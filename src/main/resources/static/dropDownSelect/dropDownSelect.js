/*下拉框枚举*/
(function () {
	'use strict';
	var dropDownSelectModule = angular.module("dropDownSelectModule",[]);
	dropDownSelectModule.directive("dropDownSelect",[function(){
		return{
			restrict:'E',
			scope:{
				labelName:'@',
				labCol:'@',
				selCol:'@',
				isShow:'@',
				ngModel:'=',
				typeCode:'@'
			},
			templateUrl:'../static/dropDownSelect/dropDownSelect.html',
			controller:['$scope','$http','findDictionaryByCodeService',function($scope,$http,findDictionaryByCodeService){
				$scope.dropDownSelect=function(){
                    findDictionaryByCodeService.getDictionaryTypeDetailByCode($scope.typecode).then(function (response) {
                        if(response.result === 'success'){
                            $scope.dropDownSelectList=response.data.items;
                        }
                    })
					
				}
				$scope.dropDownSelect();
			}]
				
			
		}
	}])
}()) 