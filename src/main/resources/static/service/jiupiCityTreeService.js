/**
 * 树形控件服务
 */
(function(){
	'use strict' ;
	
	var jiupiCityTreeModule = angular.module('jiupiCityTreeModule' , []);
	jiupiCityTreeModule.service('jiupiCityTreeService', ['$http','$q',function($http,$q) {
		   
		   /**
		    * 获取所有的酒批城市接口服务
		    * cityMode  用于搜索cityMode对应的酒批城市。
		    * cityMode为-1默认查所有的
		    */
		   this.findJiupiCityListByCityMode = function(cityMode){
			   return $q(function (resolve, reject) {
		           $http({
		               method: 'GET',
		               url: '/bizwebcontrol/jiupicitymultitree/listProvinceAllCitiesDTO/' + cityMode
		           }).success(function (data) {
		               resolve(data)
		           }).error(function (data) {
		               reject(data.message);
		           });
		       });
		   };
		    
		    this.convertModel = function(cityList){
		    	angular.forEach(cityList,function(item){
		    		item.name = item.province;
		    		item.children = item.jiupiCityList ;
		    	});
		        return cityList;
		    }

		}]);
	
}());
