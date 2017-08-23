/**
 * 产品类目服务 
 */
(function(){
	'use strict' ;
	
	angular.module("productCategoryServiceModule",[])
	
	.service("productCategoryService",['$q','$http',function($q,$http){
		
		//获取产品统计类目列表接口
		this.listStatisticsCategoryWithChild = function(){
			return $q(function(resolve,reject){
				
				$http({
					method : 'get' ,
					url:'/bizwebcontrol/category/listStatisticsCategoryWithChild' 
				}).success(function(data){
					resolve(data) ;
				}).error(function(data){
					reject(data.message);
				});
			})
		}
		
		/**
		 * 产品统计类目Api
		 */
		var cacheAllStatisticsCategoryList = [] ;
		
		//缓存产品所有统计类目列表
		this.cacheAllStatisticsCategoryData = function(allStatisticsCategoryList){
			cacheAllStatisticsCategoryList = allStatisticsCategoryList ;
		}
		
		//根据categoryId查找相对应的统计类目(针对于不知道该类目是一级类目还是二级类目的情况)
		this.getCategoryObjByCategoryId = function(categoryId){
			var categoryObj = {
				partnerCategoryObj : {},
				subcategoryObj : {}
			} ;
			angular.forEach(cacheAllStatisticsCategoryList,function(partnerItem){
				if(categoryId == partnerItem.id){
					categoryObj.partnerCategoryObj = partnerItem ;
				}else {
					angular.forEach(partnerItem.statisticsCategoryWithChildList,function(secondItem){
						if(categoryId == secondItem.id){
							categoryObj.partnerCategoryObj = partnerItem ;
							categoryObj.subcategoryObj = secondItem ;
						}
					})
				}
			});
			return categoryObj ;
		}
		
		//已知一级类目Id，找对应的一级类目对应的对象
		this.getCategoryObjByPartnerCategoryId = function(statisticsPartnerCategoryId){
			var categoryObj = {
					partnerCategoryObj : {},
					subcategoryObj : {}
				} ;
			angular.forEach(cacheAllStatisticsCategoryList,function(partnerItem){
				if(statisticsPartnerCategoryId == partnerItem.id){
					categoryObj.partnerCategoryObj = partnerItem ;
				}
			});
			return categoryObj ;
		}
		
		//已知二级类目Id，找对应的一级类目，二级类目对象
		this.getCategoryObjBySubcategoryId = function(subcategoryId){
			var categoryObj = {
				partnerCategoryObj : {},
				subcategoryObj : {}
			} ;
			angular.forEach(cacheAllStatisticsCategoryList,function(partnerItem){
				angular.forEach(partnerItem.statisticsCategoryWithChildList,function(secondItem){
					if(subcategoryId == secondItem.id){
						categoryObj.partnerCategoryObj = partnerItem ;
						categoryObj.subcategoryObj = secondItem ;
					}
				})
			});
			return categoryObj ;
		}
		
	}])
}())