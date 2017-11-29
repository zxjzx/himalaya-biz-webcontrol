/**
 * checkbox or radio Api服务
 * 
 * 
 * （1）ejpTableCheckboxService.cacheHasExistedData(params) ; 
 * 	  一般用在获取要选的表格数据之前调用，用于收集已存在的数据，然后根据isDisabled的值判断勾选or禁用。
	  入参params各属性表示的意思：
	  params = {
	  	isDisabled : true（禁用） / false （不禁用） ;
	   originalExistedIdList : [] ; //传入的数据Id集合，用于和模态框数据对应的Id进行比较，能匹配到就默认勾选。
	   hasExistedObjList : [] ;//传入的数据对象的集合，用于保存之前选中的数据对象。
	   [*该值不传，会影响到ejpTableCheckboxService.getChangeDataObj()的返回值的remove的值不准确。]
	  }
   （2）ejpTableCheckboxService.cacheDataList(initParam);
   	   一般用在获取弹框列表数据成功之后使用，用于保存每次翻页时当前页的数据（会过滤到已存在的）。即保存所有我们已切换页的全部数据。
	  initParam = {
	  	itemList : [] ; //获取的当前页数据。
	  }
	  每次分页都将不存在的数据push到allBrowsedDataIdList集合中。
	  allBrowsedDataIdList ：[] ;//表示操作者浏览过的所有弹框列表数据。
	  
   （3）将列表中的所有id（或其他id）转换成服务中统一的id(tableDataId)，用于逻辑比较。
      id转换：ejpTableCheckboxService.convertedId(item).
      类目id转换 ： ejpTableCheckboxService.convertedCategoryId(item);
      针对其它id转换，使用者可以根据自己的实际情况添加方法。
     
   （4） ejpTableCheckboxService.updateSelectedState(event,item) ; //该方法写在点击单个勾选操作的触发函数里面执行。
   		event:当前对象，
   		item : 勾选的当前数据对象。
   （5） ejpTableCheckboxService.cancelSelected();
   		清空之前所有选中的数据，将选中的数据全部清零。一般用在点击“取消”触发事件或关闭弹窗事件时。
   		也可用在重新打开弹窗时使用，为了清空上一次操作的所有动作和勾选的数据
   	    （*这个根据自己的具体业务逻辑自行选择使用地方，该方法就是为了清空所有之前勾中的所有数据。）
   （6） ejpTableCheckboxService.checkAll() ; //全选操作。
   		该方法用在点击全选的触发函数中，用于勾选当前页的所有数据。
   （7） 操作完成之后获取数据的方法 ： //一般用在点击“确定”的触发函数中触发。
   		1）$scope.selectedIdList = ejpTableCheckboxService.getCheckedIdList();
   		其返回值($scope.selectedIdList)为勾选中的所有id集合。【该集合中只包含id】
   		2）$scope.selectedObjList = ejpTableCheckboxService.getCheckedObjList();
   		其返回值($scope.selectedIdList)为勾选中的所有对象的集合。【该集合中包含id也包含其它属性值】
   		3）$scope.changedDataObj = ejpTableCheckboxService.getChangeDataObj();
   		其返回值($scope.changedDataObj)为操作中所有添加或删除的数据。
   		返回值结构为 ：
   		$scope.changedDataObj = {
			add:{ //添加的数据集合
				idList:[], //添加的id集合
				dataObjList : [] //添加的对象集合
			},
			remove : { //删除的数据集合
				idList:[], //删除的id集合，
				dataObjList : [] //删除的对象集合
			} 
   		}
   		*提示：有一个待优化的问题 ,如果在执行ejpTableCheckboxService.cacheHasExistedData(params)方法时，
   		如果入参params的hasExistedObjList属性不传，则会影响$scope.changedDataObj.remove.dataObjList的返回值的准确性，
   		所以一般要获取操作过程中删除的数据的化就要在初始化入参的时候，将hasExistedObjList值也要传入服务中。
   		一般在添加的数据都是新增的，不需与以前的数据进行比较，所有，反悔的新增数据不会有影响。
   		一般如果禁用之前已经勾选的数据，不让其再选择的化，$scope.changedDataObj.remove就没有值，只有$scope.changedDataObj.add有值。
   		
   		【如果还有不清楚的地方，可以参照setGiftService.js(赠品规则管理中添加赠品操作controller),
   			页面为js/service/selectgift/multiSelectGiftModal.html】
 * 
 * 
 */
(function(){
	'use strict' ;
	
	angular.module("ejpTableCheckedServiceModule",[])
	
	//checkbox Api服务
	.service("ejpTableCheckboxService",['$q','$http',function($q,$http){
		//保存所有浏览过的数据对象集合
		var allBrowsedDataList = [] ;
		//保存所有浏览过的数据Id的集合
		var allBrowsedDataIdList = [] ;
		//表格获取的当前页的列表数据
		var currentPageDataList = [] ;
		//此次保存前就存在的数据(一般用与禁用的数据)
		var hasExistedIdList = [] ;
		var hasExistedObjList = [] ;
		//原始的存在的数据
		var originalExistedIdList = [] ;
		//选中的数据Id集合
		var hasCheckedIdList = [] ;
		var hasCheckedObjList = [] ;
		//全选状态
		var allCheckState ;
		//是否禁用
		var isDisabled ;
		//表格数据Id(针对该服务运用过程中可能遇到数据中唯一标识（id）字段名称可能不一致的情况,重新定义一个变量用于转换成相同的字段名进行代码中的逻辑处理)
		var tableDataId ;
		
		//将当前页的表格数据Id转成指令的统一标识id(tableDataId)[针对于数据中id作为唯一标识符的数据]
		this.convertedId = function(item){
			if(item.id){
				tableDataId = item.id ;
			}
			return tableDataId ;
		}
		
		//将当前页的表格数据Id转成指令的统一标识id(tableDataId)[针对于数据中有多个唯一标识符的数据（例如类目）]
		this.convertedCategoryId = function(item){
			if(item.subCategoryId){
				tableDataId = item.subCategoryId ;
			}else if(item.id){
				tableDataId = item.id ;
			}
			return tableDataId ;
		}
		
		/**
		 * ejpTableCheckboxService.cacheHasExistedData(params) ;
		 * 一般用在获取要选的表格数据之前调用。
		 * params = {
		 * 	isDisabled : true（禁用） / false （不禁用） ;
		 *  originalExistedIdList : [] ; //传入的数据Id集合，用于和模态框数据对应的Id进行比较，能匹配到就默认勾选。
		 *  hasExistedObjList : [] ;//传入的数据对象的集合，用于保存之前选中的数据对象。[*该值不传，会影响到ejpTableCheckboxService.getChangeDataObj()的返回值的remove的值不准确。]
		 * }
		 * 
		 */
		this.cacheHasExistedData = function(params){
			isDisabled = params.isDisabled ;
			originalExistedIdList = params.hasExistedIdList ;
			hasExistedIdList = angular.copy(params.hasExistedIdList) ;
			hasExistedObjList = angular.copy(params.hasExistedObjList) ;
		}
		
		/**
		 * ejpTableCheckboxService.cacheDataList(initParam);
		 * 一般用在获取被选中数据调用成功之后。
		 * initParam = {
		 * 	itemList : [] ; //获取的当前页数据。
		 * }
		 * 每次分页都将不存在的数据push到allBrowsedDataIdList集合中。
		 * allBrowsedDataIdList ：[] ;//表示操作者浏览过的所有模态框数据。
		 * 
		 */
		this.cacheDataList  = function(initParam){
			currentPageDataList = initParam.itemList ; 
			angular.forEach(currentPageDataList,function(currentPageItem){
				if(allBrowsedDataIdList.indexOf(currentPageItem.tableDataId) < 0){
					allBrowsedDataIdList.push(currentPageItem.tableDataId) ;
					allBrowsedDataList.push(currentPageItem);
				}
			})
			initHasExistedData(); 
			initLastCheckedData();
			isAllCheck();
			return allCheckState ;
		}
		
		//进行比较，勾选存在的值，isDisabled为true则禁用该条数据。【未操作之前的操作】
		var initHasExistedData = function(){
			angular.forEach(currentPageDataList,function(item){
				if(hasExistedIdList && hasExistedIdList.indexOf(item.tableDataId) >=0){
					if(isDisabled){
						item.flag = true ;
						item.isDisabled = true ;
					}
					else {
						hasCheckedIdList = hasExistedIdList ;
						hasCheckedObjList = hasExistedObjList ;
					}
				}
			})
		}
		
		//进行比较，勾选存在的值，isDisabled为true则禁用该条数据。【未操作之前的操作】
		var initLastCheckedData = function(){
			angular.forEach(currentPageDataList,function(item){
				if(hasCheckedIdList.indexOf(item.tableDataId) >=0){
					item.flag = true ;
				}
			});
		}
		
		//判断全选状态
		var isAllCheck = function(){
			allCheckState = true;
        	angular.forEach(currentPageDataList,function(item) {
        		if(!hasCheckedIdList.length || hasCheckedIdList.indexOf(item.tableDataId) < 0){
        			allCheckState = false;
            	}
           });
		}
		
		//全选操作
		this.checkAll = function(allCheckState){
			angular.forEach(currentPageDataList,function(item){
				if(!item.isDisabled){
					item.flag = allCheckState ;
					if(item.flag){
						addChecked(item) ;
					}else {
						removeChecked(item);
					}
				}
			})
			isAllCheck();
			return allCheckState ;
		}
		
		//逐个选中
		this.updateSelectedState = function(event,item){
			var target = event.target;
	        var checkedWay = (target.checked?'add':'remove');
	        updateSelected(checkedWay,item,target.type);
	        isAllCheck();
	        return allCheckState ;
		}
		
		//逐个选中操作
		var updateSelected = function(checkedWay,item,checkType){
			if(checkedWay == 'add'){
				addChecked(item) ;
	        }
	        if(checkedWay == 'remove'){
	        	removeChecked(item);
	        }
	        isAllCheck(); 
		}
		
		//add选中的数据
		var addChecked = function(item){
			if(hasCheckedIdList.indexOf(item.tableDataId) < 0){
				hasCheckedIdList.push(item.tableDataId);
				hasCheckedObjList.push(item);
			}
		}
		//remove选中的数据
		var removeChecked = function(item){
			if(hasCheckedIdList.indexOf(item.tableDataId) >= 0){
				var index =  hasCheckedIdList.indexOf(item.tableDataId);
				hasCheckedIdList.splice(index,1);
				hasCheckedObjList.splice(index,1);
			}
			//删除已存在的数据(一般用于已经存在的数据进行再操作)
			if(!isDisabled){
				if(hasExistedIdList.indexOf(item.tableDataId) >= 0){
	        		var index = hasExistedIdList.indexOf(item.tableDataId) ;
	        		hasExistedIdList.splice(index,1);
	        		hasExistedObjList.splice(index,1);
	        	}
			}
		}
		
		//取消弹框时，清空之前所选
		this.cancelSelected = function(){
			hasCheckedIdList = [] ;
			hasCheckedObjList = [] ;
		}
		
		//获取选中的Id集合（用于外部调用，获取所需的值）
		this.getCheckedIdList = function(){
			return hasCheckedIdList ;
		}
		
		//获取选中的对象的集合（用于外部调用，获取所需的值）
		this.getCheckedObjList = function(){
			return hasCheckedObjList ;
		}
		
		//获取与id匹配的对象数据
		var getDataById = function(id){
			var singleDataObj ;
			angular.forEach(allBrowsedDataList,function(item){
				if(id == item.tableDataId){
					singleDataObj = item ;
				}
			});
			return singleDataObj ;
		}
		
		//获取删除和添加的数据对象集合（用于外部调用，获取所需的值）
		this.getChangeDataObj = function(){
			//删除和添加的数据集合
			var changedDataObj = {
				add:{ //添加的数据集合
					idList:[],
					dataObjList : []
				},
				remove : { //删除的数据集合
					idList:[],
					dataObjList : []
				} 
			}
			//add的数据集合
			angular.forEach(hasCheckedIdList,function(checkedIdItem){
				if(originalExistedIdList.indexOf(checkedIdItem) < 0){
					changedDataObj.add.idList.push(checkedIdItem);
					changedDataObj.add.dataObjList.push(getDataById(checkedIdItem));
				}
			});
			//remove的数据集合
			angular.forEach(originalExistedIdList,function(existedIdItem){
				if(hasExistedIdList.indexOf(existedIdItem) < 0){
					changedDataObj.remove.idList.push(existedIdItem);
					changedDataObj.remove.dataObjList.push(getDataById(existedIdItem));
				}
			})
			return changedDataObj ;
		}
		
	}])
	
}())