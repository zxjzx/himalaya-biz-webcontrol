/**
 *  产品展示类目Api
 */
(function(){
	'use strict' ;
	
	angular.module("productDisplayCategoryServiceModule",[])
	
	.service("productDisplayCategoryService",['$q','$http',function($q,$http){
		
		//获取产品展示类目列表接口
		this.listDisplayCategoryWithChildNoBrand = function(bizUserDisplayClass){
			return $q(function(resolve,reject){
				
				$http({
					method : 'post' ,
					url:'/bizwebcontrol/category/listDisplayCategoryWithChildNoBrand/' + bizUserDisplayClass 
				}).success(function(data){
					resolve(data) ;
				}).error(function(data){
					reject(data.message);
				});
			})
		}
		
		/**
		 * 产品展示类目Api
		 */
		//缓存所有的展示类目集合
		var cacheAllDisplayCategoryList = [] ;
		//缓存会员展示类目的集合
		var cacheBizUserDisplayClassList = [] ;
		
		//缓存会员展示类别列表
		this.cacheBizUserDisplayClassData = function(bizUserDisplayClassList){
			cacheBizUserDisplayClassList = bizUserDisplayClassList ;
		}
		
		//缓存产品所有展示类目列表
		this.cacheAllDisplayCategoryData = function(allDisplayCategoryList){
			cacheAllDisplayCategoryList = allDisplayCategoryList ;
		}
		
		//根据会员展示类别code匹配对象的对象
		this.getBizUseDisplayClassObjByCode = function(bizUserDisplayClassCode){
			//返回的展示类目对象
			var displayCategoryObj = {
				bizUserDisplayClassObj : {} ,
			} ;
			angular.forEach(cacheBizUserDisplayClassList,function(classItem){
				if(classItem.code == bizUserDisplayClassCode){
					displayCategoryObj.bizUserDisplayClassObj = classItem ;
				}
			})
		}
		
		//根据categoryId查找相对应的展示类目对象(针对于不知道该类目是一级类目还是二级类目的情况)
		this.getCategoryObjByCategoryId = function(categoryId){
			//返回的展示类目对象
			var displayCategoryObj = {
				bizUserDisplayClassObj : {} ,
				partnerCategoryObj : {},
				subcategoryObj : {}
			} ;
			angular.forEach(cacheAllDisplayCategoryList,function(partnerItem){
				if(categoryId == partnerItem.id){
					displayCategoryObj.partnerCategoryObj = partnerItem ;
				}else {
					angular.forEach(partnerItem.displayCategoryWithChildList,function(secondItem){
						if(categoryId == secondItem.id){
							displayCategoryObj.partnerCategoryObj = partnerItem ;
							displayCategoryObj.subcategoryObj = secondItem ;
						}
					})
				}
			});
			return displayCategoryObj ;
		}
		
		//已知一级类目Id，找对应的一级类目对应的对象
		this.getCategoryObjByPartnerCategoryId = function(displayPartnerCategoryId){
			//返回的展示类目对象
			var displayCategoryObj = {
				bizUserDisplayClassObj : {} ,
				partnerCategoryObj : {},
				subcategoryObj : {}
			} ;
			angular.forEach(cacheAllDisplayCategoryList,function(partnerItem){
				if(displayPartnerCategoryId == partnerItem.id){
					displayCategoryObj.partnerCategoryObj = partnerItem ;
				}
			});
			return displayCategoryObj ;
		}
		
		//已知二级类目Id，找对应的一级类目，二级类目对象
		this.getCategoryObjBySubcategoryId = function(subcategoryId){
			//返回的展示类目对象
			var displayCategoryObj = {
				bizUserDisplayClassObj : {} ,
				partnerCategoryObj : {},
				subcategoryObj : {}
			} ;
			angular.forEach(cacheAllDisplayCategoryList,function(partnerItem){
				angular.forEach(partnerItem.displayCategoryWithChildList,function(secondItem){
					if(subcategoryId == secondItem.id){
						displayCategoryObj.partnerCategoryObj = partnerItem ;
						displayCategoryObj.subcategoryObj = secondItem ;
					}
				})
			});
			return displayCategoryObj ;
		}
		
	}])
}())