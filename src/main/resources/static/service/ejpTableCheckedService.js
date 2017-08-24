/**
 * checkbox or radio Api服务
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
		
		//初始化已经存在的数据
		this.cacheHasExistedData = function(params){
			isDisabled = params.isDisabled ;
			originalExistedIdList = params.hasExistedIdList ;
			hasExistedIdList = angular.copy(params.hasExistedIdList) ;
			hasExistedObjList = angular.copy(params.hasExistedObjList) ;
			
		}
		
		//初始化入参数据
		this.cacheDataList  = function(initParam){
			currentPageDataList = initParam.itemList ; 
			angular.forEach(currentPageDataList,function(currentPageItem){
				if(allBrowsedDataIdList.indexOf(currentPageItem.id) < 0){
					allBrowsedDataIdList.push(currentPageItem.id) ;
					allBrowsedDataList.push(currentPageItem);
				}
			})
			initHasExistedData();
			initLastCheckedData();
			isAllCheck();
			return allCheckState ;
		}
		
		//初始化未操作前就存在的数据
		var initHasExistedData = function(){
			angular.forEach(currentPageDataList,function(item){
				if(hasExistedIdList && hasExistedIdList.indexOf(item.id) >=0){
					if(isDisabled){
						item.flag = true ;
						item.isDisabled = true ;
					}else {
						hasCheckedIdList = hasExistedIdList ;
						hasCheckedObjList = hasExistedObjList ;
					}
				}
			})
		}
		
		//初始化每次操作改变的数据
		var initLastCheckedData = function(){
			angular.forEach(currentPageDataList,function(item){
				if(hasCheckedIdList.indexOf(item.id) >=0){
					item.flag = true ;
				}
			});
		}
		
		//判断全选状态
		var isAllCheck = function(){
			allCheckState = true;
        	angular.forEach(currentPageDataList,function(item) {
        		if(!hasCheckedIdList.length || hasCheckedIdList.indexOf(item.id) < 0){
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
			if(hasCheckedIdList.indexOf(item.id) < 0){
				hasCheckedIdList.push(item.id);
				hasCheckedObjList.push(item);
			}
		}
		//remove选中的数据
		var removeChecked = function(item){
			if(hasCheckedIdList.indexOf(item.id) >= 0){
				var index =  hasCheckedIdList.indexOf(item.id);
				hasCheckedIdList.splice(index,1);
				hasCheckedObjList.splice(index,1);
			}
			//删除已存在的数据(一般用于已经存在的数据进行再操作)
			if(!isDisabled){
				if(hasExistedIdList.indexOf(item.id) >= 0){
	        		var index = hasExistedIdList.indexOf(item.id) ;
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
				if(id == item.id){
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
	
	//radio Api服务
	.service("ejpTableRadioService",['$q','$http',function($q,$http){
		
	}])
}())