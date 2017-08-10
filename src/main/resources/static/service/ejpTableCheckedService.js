/**
 * checkbox or radio Api服务
 */
(function(){
	'use strict' ;
	
	angular.module("ejpTableCheckedServiceModule",[])
	
	//checkbox Api服务
	.service("ejpTableCheckboxService",['$q','$http',function($q,$http){
		//表格获取的当前页的列表数据
		var currentPageDataList = [] ;
		//此次保存前就存在的数据(一般用与禁用的数据)
		var hasExistedList = [] ;
		//保存一份原始的数据
		var copyHasExistedList = [] ;
		//选中的数据Id集合
		var hasCheckedIdList = [] ;
		//选中的列表数据对象集合
		var hasCheckedObjList = [] ;
		//上一次操作选中的数据Id集合
		var lastCheckedIdList = [] ;
		//上一次操作选中的数据对象集合
		var lastCheckedObjList = [] ;
		//全选状态
		var allCheckState ;
		//是否禁用
		var isDisabled ;
		
		//每次操作退出时都保存此次操作最后选中的列表数据Id及对象集合(一般用于下次操作的比较数据)
		var copyCurrentCheckedData = function(){
			lastCheckedIdList = angular.copy(hasCheckedIdList);
			lastCheckedObjList = angular.copy(hasCheckedObjList);
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
		
		//初始化未操作前就存在的数据
		var initHasExistedData = function(){
			angular.forEach(currentPageDataList,function(item){
				if(hasExistedList.indexOf(item.id) >=0){
					if(isDisabled){
						item.flag = true ;
						item.disabled = true ;
					}else {
						hasCheckedIdList = angular.copy(hasExistedList) ;
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
		
		//初始化已经存在的数据
		this.initHasExistedData = function(existedList){
			hasExistedList = existedList ;
		}
		
		//初始化入参数据
		this.cacheDataList  = function(params){
			currentPageDataList = params.itemList ; 
			isDisabled = params.isDisabled ;
			initHasExistedData();
			initLastCheckedData();
			isAllCheck();
			return allCheckState ;
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
		
		//取消弹框时，清空之前所选
		this.cancelSelected = function(){
			hasCheckedIdList = [] ;
			hasCheckedObjList = [] ;
		}
		
		//获取选中的Id集合（用于外部调用，获取所需的值）
		this.getCheckedIdList = function(){
			copyCurrentCheckedData();
			return hasCheckedIdList ;
		}
		
		//获取选中的的数据对象集合（用于外部调用，获取所需的值）
		this.getCheckedObjList = function(){
			copyCurrentCheckedData();
			return hasCheckedObjList ;
		}
		
		//获取删除和添加的数据对象集合（用于外部调用，获取所需的值）
		this.getChangeDataObj = function(){
			copyCurrentCheckedData();
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
			//add
			angular.forEach(hasCheckedObjList,function(item){
				if(lastCheckedIdList.indexOf(item.id) < 0){
					changedDataObj.add.idList.push(item.id);
					changedDataObj.add.dataObjList.push(item);
				}
			})
			//remove
			angular.forEach(lastCheckedObjList,function(item){
				if(hasCheckedIdList.indexOf(item.id) < 0){
					changedDataObj.remove.idList.push(item.id);
					changedDataObj.remove.dataObjList.push(item);
				}
			})
			return changedDataObj ;
		}
		
	}])
	
	//radio Api服务
	.service("ejpTableRadioService",['$q','$http',function($q,$http){
		
	}])
}())