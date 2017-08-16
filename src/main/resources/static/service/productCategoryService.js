/**
 * 产品类目服务 
 */
(function(){
	'use strict' ;
	
	angular.module("productCategoryServiceModule",[])
	
	.service("productCategoryService",['$q','$http',function($q,$http){
		
		//获取产品统计类目列表
		this.listStatisticsCategoryWithChild = function(){
			return $q(function(resolve,reject){
				
				$http({
					method : 'get' ,
					url:'bizwebcontrol/category/listStatisticsCategoryWithChild' 
				}).success(function(data){
					resolve(data) ;
				}).error(function(data){
					reject(data.message);
				});
			})
		}
		
		//获取产品展示类目
		this.listDisplayCategoryWithChild = function(bizUserDisplayClass){
			return $q(function(resolve,reject){
				
				$http({
					method : 'post' ,
					url:'bizwebcontrol/category/listDisplayCategoryWithChild/' + bizUserDisplayClass 
				}).success(function(data){
					resolve(data) ;
				}).error(function(data){
					reject(data.message);
				});
			})
		}
		
		var cacheAllStatisticsCategoryList = [] ;
		
		//缓存产品所有统计类目列表
		this.cacheAllStatisticsCategoryData = function(allStatisticsCategoryList){
			cacheAllStatisticsCategoryList = allStatisticsCategoryList ;
		}
	}])
}())