/**
 * checkbox or radio Api服务
 * 全选按钮
 * <label>
        <div ng-class="{'checker disabled':selectAllButton,'checker':!selectAllButton}">
            <span ng-class="{'checked':allCheck}">
                <input type="checkbox" ng-model="allCheck" ng-click="checkAll()" ng-disabled="selectAllButton" />
            </span>
        </div>
    </label>
 * 单选按钮
 * <label>
	    <div class="checker" ng-class="{'checker disabled' : item.disab, 'checker' : !item.disab}">
	        <span ng-class="{'checked':item.flag}">
	            <input type="checkbox" ng-model="item.flag" ng-click="updateSelection($event,item)"
	                   ng-checked="isSelected(item.salePolicyId)" ng-disabled="item.disab" />
	        </span>
	    </div>
	</label>
 */
(function(){
	'use strict' ;
	
	angular.module("tableCheckedServiceModule",[])
	.service("tableCheckedService",['$q','$http',function($q,$http){
		var hasImportedList = [];//已导入的数据列表List
        var hasImportedIdList = [];//已导入的idList
        
        var hasCheckedProductList = [];//新选中的列表
        var hasCheckedProductIdList = [];//新选中的idList列表
        
        var currentPageDataList = [];//当前页用以比较的数据列表
        
        
        
      //表格数据Id(针对该服务可能遇到数据中需要比较的id字段名称可能不一致的情况,重新定义一个变量用于逻辑数据)
		var tableDataId ;
		
      //id转换
        this.hasExistedDataList = function (params,idName){
        	tableDataId = idName;
        	hasImportedList = params;
        	if(params.length == 0){
        		hasImportedList = [];
        		hasImportedIdList = [];
        		hasCheckedProductList = [];
        		hasCheckedProductIdList = [];
        		return;
        	}
    		params.forEach(function(item){
    			if(hasImportedIdList.indexOf(item[idName]) === -1){
    				hasImportedIdList.push(item[idName])
    			}
    		});
        };
        
        //比较先前的数据是否应该勾选
        this.compareDataList = function(params){
        	var num = null;
        	currentPageDataList = params;
        	params.forEach(function (outerItem) {
                hasImportedIdList.forEach(function (innerItem) {
                    if(outerItem[tableDataId] == innerItem){
                        outerItem.flag = true;
                        outerItem.disab = true;
                        num ++ ;
                    }
                });
            });
        	
        	if(num === params.length){
        		return true;
        	}else{
        		return false;
        	}
        	
        }
        
        //逐个选中按钮
        this.updateSelection = function(event,item){
        	var checkbox = event.target;
            var num = 0;
            var action = checkbox.checked ? 'add' : 'remove';
            var allCheck = false;//全选按钮是否选中
            if(checkbox.checked){
                hasCheckedProductList.push(item);
                hasCheckedProductIdList.push(item[tableDataId]);
            }else{
                var index = hasCheckedProductList.indexOf(item);
                hasCheckedProductList.splice(index,1);
                hasCheckedProductIdList.splice(item[tableDataId]);
            };
            currentPageDataList.forEach(function (item) {
                if(item.flag){
                    num++;
                }
            });
            if(num === currentPageDataList.length){//页面显示的数据全部选中时,全选按钮自动勾选
                var allCheck = true;
            }else{
                var allCheck = false;
            }
            return allCheck;
		}
        
        //全选按钮
        this.checkAll = function (allCheck) {
            currentPageDataList.forEach(function (item) {
                item.flag = allCheck;
                var index = hasCheckedProductIdList.indexOf(item[tableDataId]);
                if(item.flag){
                    if(index === -1){//没有这一项
                        hasCheckedProductList.push(item);
                        hasCheckedProductIdList.push(item[tableDataId]);
                    }
                }else{//取消全部选中
                    if(hasCheckedProductIdList.length >0 && index > -1){//包含这一项
                        hasCheckedProductList.splice(index,1);
                        hasCheckedProductIdList.splice(index,1);
                    }
                };

                if(hasCheckedProductIdList.length > 0 ){
                    hasCheckedProductList.forEach(function (part) {
                        if(part[tableDataId] == item[tableDataId]){
                            item.flag = true;
                        }
                    })
                };
                //已成功添加到页面的数据会勾选

                if(hasImportedIdList.indexOf(item[tableDataId]) > -1){
                    item.flag = true;
                }
            });
        };
        
        
        //将当前页新选的数据保存起来,并且显示已选中
        this.cacheDataList = function(){
        	var num = null;
        	var allCheck = false;
        	if(!hasCheckedProductIdList.length){
        		return allCheck;
        	}
        	currentPageDataList.forEach(function (outerItem) {
                hasCheckedProductIdList.forEach(function (innerItem) {
                    if(outerItem[tableDataId] == innerItem){
                        outerItem.flag = true;
                        num ++ ;
                    }
                });
            });
            if(num === currentPageDataList.length){
                allCheck = true;
            }
            return allCheck;
        }
        
        //返回已选中的所有数据（包括已置灰和新选中的所有产品）
        this.returnData = function (){
        	hasCheckedProductList.forEach(function (item) {
                if(hasImportedIdList.indexOf(item[tableDataId]) === -1){
                	hasImportedList.push(item);
                }
            })
            return hasImportedList;
        }
	}])
}())