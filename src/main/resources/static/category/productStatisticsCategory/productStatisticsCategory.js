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
				changeParentCategory : '&' ,
				changeSubCategory : '&' ,
			},
			templateUrl : '../static/category/productStatisticsCategory/productStatisticsCategory.html',
			controller : ['$http','$scope','productCategoryService',
			              function($http,$scope,productCategoryService){
				
				console.log($scope.statisticsCategoryVo);
				
				//获取产品展示类目列表
				var findProductStatisticsCategoryList = function(bizUserDisplayClass){
					productCategoryService.listStatisticsCategoryWithChild().then(function(data){
						console.log(data);
						if(data.result==='success'){
							$scope.allStatisticsCategoryList = data.list ;
						}
					})
				}
				findProductStatisticsCategoryList();
				
				//类目回显
				if($scope.statisticsCategoryVo && $scope.statisticsCategoryVo.categoryId){
					$scope.statisticsCategoryVo = productCategoryService.getCategoryObjByCategoryId($scope.statisticsCategoryVo.categoryId);
				}
				
				//选择一级类目时触发
				$scope.initPartnerCategory = function(){
					$scope.statisticsPartnerCategoryId = $scope.statisticsCategoryVo.partnerCategoryObj.id ;
				}
				
				//选择二级类目时触发
				$scope.initSubcategory = function(){
					$scope.statisticsSubcategoryId = $scope.statisticsCategoryVo.subcategoryObj.id ;
				}
				
			}],
		}
	}]);
}());