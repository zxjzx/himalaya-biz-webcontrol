/**
 * checkbox Api服务
一、html
    1、全选按钮
        <label>
            <div ng-class="{'checker disabled':selectAllButton,'checker':!selectAllButton}">
                <span ng-class="{'checked':allCheck}">
                    <input type="checkbox" ng-model="allCheck" ng-click="checkAll()" ng-disabled="selectAllButton" />
                </span>
            </div>
        </label>
    2、单选按钮
        <label>
            <div class="checker" ng-class="{'checker disabled' : item.disab, 'checker' : !item.disab}">
                <span ng-class="{'checked':item.flag}">
                    <input type="checkbox" ng-model="item.flag" ng-click="updateSelection($event,item)" ng-disabled="item.disab" />
                </span>
            </div>
        </label>

二、js使用
    1、注入"tableCheckedService"
    2、 //初始化
        tableCheckedService.hasExistedDataList(productInfoSpecList,"id");
    3、//单个选中按钮
         $scope.updateSelection = function ($event, item) {
            $scope.allCheck = tableCheckedService.updateSelection($event, item);
         };
    4、//选中所有按钮
         $scope.checkAll = function (allCheck) {
            $scope.allCheck = allCheck;
            tableCheckedService.checkAll(allCheck);
         };

    5、//对列表页数据的操作
        //对已添加到页面的数据样式进行控制
         $scope.allCheck = $scope.selectAllButton = tableCheckedService.compareDataList($scope.vm.items,"id");
         if(!$scope.allCheck){
            //对新选中的数据样式进行控制
            $scope.allCheck = tableCheckedService.cacheDataList();
         }
 */
(function(){
	'use strict' ;

	angular.module("tableCheckedServiceModule",[])
	.service("tableCheckedService",[function(){
		var hasImportedList = [];//已导入的数据列表List
        var hasImportedIdList = [];//已导入的idList
        
        var newCheckedProductList = [];//新选中的列表
        var newCheckedProductIdList = [];//新选中的idList列表
        
        var currentPageDataList = [];//当前页用以比较的数据列表
        
      //表格数据Id(针对该服务可能遇到数据中需要比较的id字段名称可能不一致的情况,重新定义一个变量用于逻辑数据)
		var tableDataId ;
		
		var currentIdName;
		
      //id转换
        this.hasExistedDataList = function (params,idName,idList){
        	tableDataId = idName;

        	if(!params.length){
        		hasImportedList = [];
        		newCheckedProductList = [];
        		newCheckedProductIdList = [];
        		hasImportedIdList = [];
        		currentPageDataList = [];
        		if(idList){
            		hasImportedIdList = idList;
            	}
        		return;
        	}
        	
        	hasImportedList = [];
    		newCheckedProductList = [];
    		newCheckedProductIdList = [];
    		hasImportedIdList = [];
    		currentPageDataList = [];
    		
    		params.forEach(function(item){
    			hasImportedList.push(item);//已经导入的不用去重
    			if(hasImportedIdList.indexOf(item[idName]) === -1){//用于比较的id要去重
    				hasImportedIdList.push(item[idName])
    			}
    		});
        };
        
        /**
         * 比较先前的数据是否应该勾选
         * @param params 列表页数据
         * @param idName 用以比较的字段
         * @returns {boolean} 返回全选按钮是否应该选中
         */
        this.compareDataList = function(params,idName){
        	if(idName){
        		currentIdName = idName;
        	}else{
        		currentIdName = tableDataId;
        	}
        	if(!params.length){
        	    return false;
            }
        	currentPageDataList = params;
        	var num = null;
        	currentPageDataList.forEach(function (outerItem) {
                hasImportedIdList.forEach(function (innerItem) {
                	var compareId = outerItem[currentIdName];
                    if(compareId === innerItem){
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
        };

        /**
         * 逐个选中按钮
         * @param event 选中事件
         * @param item 选中该项的值
         * @returns {boolean} 返回点击按钮是否应该选中
         */
        this.updateSelection = function(event,item){
        	var checkbox = event.target;
            var num = 0;
            var allCheck = false;//全选按钮是否选中
            if(checkbox.checked){
                newCheckedProductList.push(item);
                newCheckedProductIdList.push(item[currentIdName]);
            }else{
                var index = newCheckedProductList.indexOf(item);
                newCheckedProductList.splice(index,1);
                newCheckedProductIdList.splice(item[currentIdName]);
            }
            currentPageDataList.forEach(function (item) {
                if(item.flag){
                    num++;
                }
            });
            if( currentPageDataList.length === num){//页面显示的数据全部选中时,全选按钮自动勾选
                allCheck = true;
            }else{
                allCheck = false;
            }
            return allCheck;
		};

        /**
         * 点击全选按钮
         * @param allCheck
         */
        this.checkAll = function (allCheck) {
            currentPageDataList.forEach(function (item) {
                item.flag = allCheck;
                var index = newCheckedProductIdList.indexOf(item[tableDataId]);
                if(item.flag){
                    if(index === -1){//没有这一项
                        newCheckedProductList.push(item);
                        newCheckedProductIdList.push(item[tableDataId]);
                    }
                }else{//取消全部选中
                    if(newCheckedProductIdList.length >0 && index > -1){//包含这一项
                        newCheckedProductList.splice(index,1);
                        newCheckedProductIdList.splice(index,1);
                    }
                }

                if(newCheckedProductIdList.length > 0 ){
                    newCheckedProductList.forEach(function (part) {
                        if(part[tableDataId] === item[tableDataId]){
                            item.flag = true;
                        }
                    })
                }

                //已成功添加到页面的数据会勾选
                if(hasImportedIdList.indexOf(item[tableDataId]) > -1){
                    item.flag = true;
                }
            });
        };


        /**
         * 将当前页新选的数据保存起来,并且显示已选中
         * @returns {boolean}
         */
        this.cacheDataList = function(){
        	var num = null;
        	var allCheck = false;
        	if(!newCheckedProductIdList.length){
        		return allCheck;
        	}
        	currentPageDataList.forEach(function (outerItem) {
                newCheckedProductIdList.forEach(function (innerItem) {
                	if(outerItem[tableDataId]){
                		if(outerItem[tableDataId] === innerItem){
                			outerItem.flag = true;
                			num ++ ;
                		}
                	}else{
                		if(outerItem[currentIdName] === innerItem){
                			outerItem.flag = true;
                			num ++ ;
                		}
                	}
                });
            });
            if(num === currentPageDataList.length){
                allCheck = true;
            }
            return allCheck;
        };

        /**
         * 返回已选中的所有数据（包括已置灰和新选中的所有产品列表）
         * @returns {{hasImportedList: Array, newCheckedProductList: Array}}
         */
        this.returnData = function (){
        	newCheckedProductList.forEach(function (item) {
                if(hasImportedIdList.indexOf(item[tableDataId]) === -1){
                	hasImportedList.push(item);
                }
            });
            return {
        		hasImportedList:hasImportedList,
        		newCheckedProductList:newCheckedProductList
        	}
        }
	}])
}());