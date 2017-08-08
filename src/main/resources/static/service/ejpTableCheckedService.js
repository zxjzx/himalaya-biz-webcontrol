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
		
		//缓存列表数据
		this.cacheDataList = function(itemList){
			currentPageDataList = itemList;
			lastCheckedIdList = angular.copy(hasCheckedIdList);
			lastCheckedObjList = angular.copy(hasCheckedObjList);
			angular.forEach(currentPageDataList,function(item){
				if(hasCheckedIdList.indexOf(item.id) >=0){
					item.flag = true ;
				}
			});
			isAllCheck();
			return allCheckState ;
		}
		
		//缓存已经存在的选中值
		this.initHasExistedIdList = function(existedList,isDisabled){
			hasExistedList = existedList ; 
			angular.forEach(currentPageDataList,function(item){
				if(hasExistedList.indexOf(item.id) >=0){
					item.flag = true ;
					if(isDisabled){
						item.disabled = true ;
					}else {
						addChecked();
					}
				}
			})
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
			return hasCheckedIdList ;
		}
		
		//获取选中的的数据对象集合（用于外部调用，获取所需的值）
		this.getCheckedObjList = function(){
			return hasCheckedObjList ;
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