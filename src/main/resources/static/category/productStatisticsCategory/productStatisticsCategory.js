/**
 * 产品统计类目指令 
 */
(function(){
	'use strict' ;
	
	angular.module("productStatisticsCategoryModule",[])
	
	//产品统计类目directive
	.directive("productStatisticsCategory",[function(){
		return {
			restrict : 'E' ,
			transclude : true ,
			scope : {
				statisticsCategoryVo : '=' ,
				statisticsPartnerCategoryId : '=' ,
				statisticsSubcategoryId : '=' ,
				statisticsCategoryId : '=' , //统计类目Id,一般用于不知道是一级类目还是二级类目的Id的数据回显
				changeParentCategory : '&' ,
				changeSubCategory : '&' ,
			},
			templateUrl : '../static/category/productStatisticsCategory/productStatisticsCategory.html',
			controller : ['$http','$scope','productCategoryService',
			              function($http,$scope,productCategoryService){
							
				//获取产品展示类目列表
				var findProductStatisticsCategoryList = function(bizUserDisplayClass){
					productCategoryService.listStatisticsCategoryWithChild().then(function(data){
						if(data.result==='success'){
							$scope.allStatisticsCategoryList = data.list ;
							productCategoryService.cacheAllStatisticsCategoryData($scope.allStatisticsCategoryList);
							//类目回显
							if($scope.statisticsCategoryId){
								$scope.statisticsCategoryVo = productCategoryService.getCategoryObjByCategoryId($scope.statisticsCategoryId);
							}else {
								if($scope.statisticsPartnerCategoryId && !$scope.statisticsSubcategoryId){
									$scope.statisticsCategoryVo = productCategoryService.getCategoryObjByPartnerCategoryId($scope.statisticsPartnerCategoryId);
								}else if($scope.statisticsPartnerCategoryId && $scope.statisticsSubcategoryId){
									$scope.statisticsCategoryVo = productCategoryService.getCategoryObjBySubcategoryId($scope.statisticsSubcategoryId);
								}
							}
							
						}
					})
				}
				findProductStatisticsCategoryList();
				
				//选择一级类目时触发
				$scope.initPartnerCategory = function(){
					$scope.statisticsPartnerCategoryId = $scope.statisticsCategoryVo.partnerCategoryObj ? $scope.statisticsCategoryVo.partnerCategoryObj.id : null ;
					$scope.statisticsCategoryVo.subcategoryObj  = {} ;
				}
				
				//选择二级类目时触发
				$scope.initSubcategory = function(){
					$scope.statisticsSubcategoryId = $scope.statisticsCategoryVo.subcategoryObj ? $scope.statisticsCategoryVo.subcategoryObj.id : null ;
				}
				
			}],
		}
	}]);
}());