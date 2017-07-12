(function () {
	'use strict';
	
	
	var jiupiCitySelectModule = angular.module("jiupiCitySelectModule",[]);
	jiupiCitySelectModule.directive("bizJiupiCitySelect",[function(){
		return {
			restrict:'E',
			scope:{
				labelName:"@",
				isShow:"@",
				cityVo:"="
			},
			templateUrl:"../static/jiupicitySelect/jiupiCitySelect.html",
			controller:["$scope","$http",function($scope,$http){
				$scope.getCityList = function(){
					$http.post('JiupiCityCtrl/findAllJiupiCityList').success(function(data){
		        		if(data.result=="success"){
		        			$scope.allCityList=data.list;
		        			$scope.allCityList.unshift({"cityId":"","jiupiCityFullName":"请选择"});
		        		}
		        	})
				};
				$scope.getCityList();
			}]
		}
	}])
}());


