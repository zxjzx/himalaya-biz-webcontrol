/**
 *	产品展示类目指令 
 */
(function(){
	'use strict' ;
	
	angular.module("productDisplayCategoryModule",[])
	
	.directive("productDisplayCategory",[function(){
		return {
			restrict : 'E',
			transclude : true ,
			scope : {
				displayCategoryVo : '=' ,
				displayPartnerCategoryId : '=' ,
				displaySubcategoryId : '=' ,
				changeBizUserDisplayClass : '&' ,
				changeDisplayPartnerCategory : '&' ,
				changeDisplaySubcategory : '&' ,
			},
			templateUrl : '../static/category/productDisplayCategory/productDisplayCategory.html',
			controller : ['$http','$scope','productCategoryService','findDictionaryByCodeService',
			              function($http,$scope,productCategoryService,findDictionaryByCodeService){
				
				//获取会员展示类别
				var getBizUserDisplayClassList = function(){
					findDictionaryByCodeService.getDictionaryTypeDetailByCode("BizUserDisplayClass").then(function(data){
						$scope.bizUserDisplayClassList = data.data.items;
					})
				}
				getBizUserDisplayClassList();
				
				//获取产品展示类目列表
				var findProductDisplayCategoryList = function(bizUserDisplayClass){
					productCategoryService.listDisplayCategoryWithChildNoBrand(bizUserDisplayClass).then(function(data){
						console.log(data);
						if(data.result==='success'){
							$scope.allDisplayCategoryList = data.list ;
						}
					})
				}
				
				//选择会员展示类别触发
				$scope.initBizUserDisplayClass = function(){
					findProductDisplayCategoryList($scope.displayCategoryVo.bizUserDisplayClass.code);
				}
				
				//选择一级类目时触发
				$scope.initPartnerCategory = function(){
					$scope.displayPartnerCategoryId = $scope.displayCategoryVo.partnerCategoryObj.id ;
				}
				
				//选择二级类目时触发
				$scope.initSubcategory = function(){
					$scope.displaySubcategoryId = $scope.displayCategoryVo.subcategoryObj.id ;
				}
				
			}],
		}
	}])
}())