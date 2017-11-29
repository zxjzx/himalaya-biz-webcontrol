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
            	$scope.labelColorList = ["success","danger","warning","primary","info"];
                $scope.setStyle = function(code){
                	return "label label-sm label-"+$scope.labelColorList[code%5];
                }
            }]
        }
    }])
/**
 * 过滤显示：{{productType | codeFilter : item.type : "code" : "name"}}
 * productBusinessClassList：过滤的List数组，
 * codeFilter：过滤的属性值
 * key：显示的变量属性
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