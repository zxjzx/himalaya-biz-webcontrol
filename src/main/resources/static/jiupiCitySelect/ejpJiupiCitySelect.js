/**
 * 酒批城市选择控件
 */
(function(){
	'use strict';
	
	angular.module("ejpJiupiCitySelectModule",[])
	/**
	 * 酒批城市指令 
	 */
	.directive("ejpJiupiCitySelect",[function(){
		return {
			restrict:'E',
			scope:{
				jiupiCityVo : '=' ,
				hidePleaseSelect :'=' ,
				changeJiupiProvince : '=' ,
				changeJiupiCity : '=' ,
				isDisabled : '=' ,
                selectCityFun:'&'
			},
			templateUrl:'../static/jiupiCitySelect/ejpJiupiCitySelect.html',
			controller:["$scope","$http",'ejpJiupiCityService',function($scope,$http,ejpJiupiCityService){
				
				// 获取酒批城市
				var getJiupiCity = function(){
					ejpJiupiCityService.listProvinceAllCitiesDTO(-1).then(function(data){
						if(data.result==='success'){
							$scope.allJiupiCityList = data.list ; 
							ejpJiupiCityService.cacheJiupiCityData($scope.allJiupiCityList);
							initJiupiCity();
						}
					})
				}
				getJiupiCity();
				
				//初始化酒批城市
				var initJiupiCity = function(){
					if($scope.jiupiCityVo && $scope.jiupiCityVo.cityId){
						angular.forEach($scope.allJiupiCityList,function(provinceItem){
							angular.forEach(provinceItem.jiupiCityList,function(cityItem){
								if($scope.jiupiCityVo.cityId == cityItem.id){
									$scope.jiupiCityVo.provinceObj = {} ;
									$scope.jiupiCityVo.provinceObj.province = cityItem.province ;
									$scope.jiupiCityVo.provinceObj.jiupiCityList = provinceItem.jiupiCityList ;
								}
							})
						})
					}
				}
				
				//选择市触发
				$scope.getJiupiCityObj = function(cityId){
					if(cityId){
						 $scope.jiupiCityVo.cityObj = ejpJiupiCityService.getCityObjByCityId(cityId);
						 $scope.selectCityFun();
					}
				}
			}]
		 }	
	}])
	
	/**
	 * 酒批城市服务
	 */
	.service("ejpJiupiCityService",['$http','$q',function($http,$q){
		
		this.listProvinceAllCitiesDTO = function(cityMode){
			   return $q(function (resolve, reject) {
		           $http({
		               method: 'get',
		               url: 'bizwebcontrol/jiupicitymultitree/listProvinceAllCitiesDTO/' + cityMode,
		           }).success(function (data) {
		               resolve(data)
		           }).error(function (data) {
		               reject(data.message);
		           });
		       });
		   }
		
		var cacheJiupiCityList = [] ;
		//缓存酒批数据
		this.cacheJiupiCityData = function(allJiupiCityList){
			cacheJiupiCityList = allJiupiCityList ;
		}
		
		//根据酒批cityId匹配对应的酒批数据对象
		this.getJiupiCityObjByCityId = function(cityId){
			var jiupiCityObj = {} ;
			jiupiCityObj.provinceObj = {} ;
			angular.forEach(cacheJiupiCityList,function(provinceItem){
				angular.forEach(provinceItem.jiupiCityList,function(cityItem){
					if(cityId == cityItem.id){
						jiupiCityObj.provinceObj.province = provinceItem.province ;
						jiupiCityObj.provinceObj.jiupiCityList = provinceItem.jiupiCityList ;
						jiupiCityObj.cityId = cityId ;
					}
				})
			})
			return jiupiCityObj ;
		} 
		
		//根据CityId获取选中的cityObj
		this.getCityObjByCityId = function(cityId){
			var cityObj = {} ;
			angular.forEach(cacheJiupiCityList,function(provinceItem){
				angular.forEach(provinceItem.jiupiCityList,function(cityItem){
					if(cityId == cityItem.id){
						cityObj = cityItem ;
					}
				})
			})
			return cityObj ;
		}
		
		
	}])
	
}());