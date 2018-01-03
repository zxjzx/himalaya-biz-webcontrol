/**
 * 字典显示
 */				
(function () {
    'use strict';
   angular.module('showDictionaryDataModule',[])
   .directive('showDictionary',[function () {
        return{
            restrict:'E',
            scope:{
                filterCode:'@',//过滤的值
                filterList:'=',//被过滤的List数组
                codeValue:'@',//对应code
                nameValue:'@',//对应name
            },
            template:'<span ng-class="setStyle(filterCode)">{{filterList | codeFilter : filterCode : codeValue : nameValue}}</span>',
            controller:['$scope','$http',function ($scope,$http) {
            	$scope.labelColorList = ["success","danger","warning","primary","info","default"];
                $scope.setStyle = function(code){
                	return "label label-sm label-"+$scope.labelColorList[code%6];
                }
            }]
        }
    }])
/**
 * 过滤显示：{{filterList | codeFilter : item.type : "code" : "name"}}
 * filterList：被过滤的List数组，
 * codeFilter：过滤的属性值
 * code：页面的变量，默认为code,可以手动设置为如：key
 * name：页面显示的值，默认为name，可以手动设置为如：value
 * 
 * 如：var sexList = [{code:0,name:"男"},{code:1,name:"女"}];
 * 当页面性别属性为sexType = 0,需要得到相对于的"男"
 * <show-dictionary ng-if="sexList" filter-code="{{sexType}}" filter-list="sexList"></show-dictionary>
 * 
 * 如：var sexList = [{key:0,value:"男"},{key:1,value:"女"}];
 * 当页面性别属性为sexType = 0,需要得到相对于的"男"
 * <show-dictionary ng-if="sexList" filter-code="{{sexType}}" filter-list="sexList" code-value="key" name-value="value"></show-dictionary>
 * 
 */
    .filter("codeFilter",function(){
        return function(filterList,filterValue,code,name){
            var newCode = (code==undefined)?"code":code;
            var newName = (name==undefined)?"name":name;
            var num;
            for(var i=0;i<filterList.length;i++){
                if(filterList[i][newCode] == filterValue){
                    num=i;
                }
            }
            return filterList[num][newName];
        }
    });
})()