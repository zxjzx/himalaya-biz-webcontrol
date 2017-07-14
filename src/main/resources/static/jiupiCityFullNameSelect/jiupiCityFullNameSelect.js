(function () {
	'use strict';
	
	var jiupiCityFullNameModule = angular.module("jiupiCityFullNameModule",[]);
	jiupiCityFullNameModule.directive("jiupiCityFullNameSelect",[function(){
		return {
			restrict:'E',
			scope:{
				cityObj : "=",
				isRequired:'=',
				isDisabled:'=',
				isPleaseSelect : '=',
			},
			templateUrl:"../static/jiupiCityFullNameSelect/jiupiCityFullNameSelect.html",
			controller:["$scope","$http",function($scope,$http){
				
				$scope.getCityList = function(){
					$http.get('bizwebcontrol/jiupicityfullname/findAllJiupiCityList').success(function(data){
		        		if(data.result=="success"){
		        			$scope.allCityList = data.list;
		        			if($scope.isPleaseSelect){
		        				$scope.allCityList.unshift({"id":"","jiupiCityFullName":"请选择"});
		        			}
		        			//默认选中
		        			if($scope.cityObj && $scope.cityObj.city && $scope.cityObj.city.id){
		        				angular.forEach($scope.allCityList,function(item){
			        				if(item.id ==  $scope.cityObj.city.id){
			        					$scope.cityObj.city = item ;
			        				}
			        			})
		        			}
		        		}
		        	})
				};
				$scope.getCityList();
				
			}]
		}
	}])
}());


