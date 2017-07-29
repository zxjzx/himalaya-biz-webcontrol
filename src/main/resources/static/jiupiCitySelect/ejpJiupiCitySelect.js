/**
 * 酒批城市选择控件
 */
(function(){
	'use strict' ;
	
	angular.module("ejpJiupiCitySelectModule",[])
	.directive("ejpJiupiCitySelect",[function(){
		return {
			restrict:'E',
			scope:{
				jiupicityVo:'=',
			},
			templateUrl:'../static/jiupiCitySelect/ejpJiupiCitySelect.html',
			controller:["$scope","$http",function($scope,$http){
				
				//获取酒批城市
				$http.get("/bizwebcontrol/jiupicitymultitree/listProvinceAllCitiesDTO/" + -1)
					.success(function(data){
					if(data.result==='success'){
						console.log(data);
					}
				})
			}]
		}
		
	}])
}());