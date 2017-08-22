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
				/**
				 * 展示类目的vo对象，
				 * 数据结构 : displayCategoryVo
				 * displayCategoryVo = {
				 * 		bizUserDisplayClass : {}, //会员展示类别
				 * 		partnerCategoryObj : {} , //选取的父类目对象
				 * 		subcategoryObj ：{}, //选取的子类目对象
				 * }
				 */
				displayCategoryVo : '=' , 
				displayPartnerCategoryId : '=' ,         //展示类目的父类目Id
				displaySubcategoryId : '=' ,	         //展示类目的子类目Id
				changeBizUserDisplayClass : '&' , 		 //外部函数，选择会员展示类别的触发函数
				changeDisplayPartnerCategory : '&' ,     //外部函数，选择父类目的触发函数
				changeDisplaySubcategory : '&'  	     //外部函数，选择子类目的触发函数
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
						if(data.result==='success'){
							$scope.displayCategoryVo.allDisplayCategoryList = data.list ;
						}
					})
				}
				
				//选择会员展示类别触发
				$scope.initBizUserDisplayClass = function(){
					findProductDisplayCategoryList($scope.displayCategoryVo.bizUserDisplayClass.code);
					$scope.displayPartnerCategoryId = "" ;
					$scope.displaySubcategoryId = "" ;
				}
				
				//选择一级类目时触发
				$scope.initPartnerCategory = function(){
					$scope.displayPartnerCategoryId = $scope.displayCategoryVo.partnerCategoryObj.id ;
					$scope.displaySubcategoryId = "" ;
				}
				
				//选择二级类目时触发
				$scope.initSubcategory = function(){
					$scope.displaySubcategoryId = $scope.displayCategoryVo.subcategoryObj.id ;
				}
				
			}],
		}
	}])
}())