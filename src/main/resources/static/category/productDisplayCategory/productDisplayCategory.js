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
				 * 		bizUserDisplayClassObj : {}, //会员展示类别
				 * 		partnerCategoryObj : {} , //选取的父类目对象
				 * 		subcategoryObj ：{}, //选取的子类目对象
				 * }
				 */
				displayCategoryVo : '=' , 
				displayPartnerCategoryId : '=' ,         //展示类目的父类目Id
				displaySubcategoryId : '=' ,	         //展示类目的子类目Id
				bizUserDisplayClassCode : '=' ,	         //会员展示类别code
				displayCategoryId : '=' ,	         	 //展示类目Id(一般针对只有一个类目Id,不清楚是一级类目还是二级类目的情况)
				changeBizUserDisplayClass : '&' , 		 //外部函数，选择会员展示类别的触发函数
				changeDisplayPartnerCategory : '&' ,     //外部函数，选择父类目的触发函数
				changeDisplaySubcategory : '&'  	     //外部函数，选择子类目的触发函数
			},
			templateUrl : '../static/category/productDisplayCategory/productDisplayCategory.html',
			controller : ['$http','$scope','findDictionaryByCodeService','productDisplayCategoryService',
			              function($http,$scope,findDictionaryByCodeService,productDisplayCategoryService){
				
				//获取会员展示类别
				var getBizUserDisplayClassList = function(){
					findDictionaryByCodeService.getDictionaryTypeDetailByCode("BizUserDisplayClass").then(function(data){
						$scope.bizUserDisplayClassList = data.data.items;
						productDisplayCategoryService.cacheBizUserDisplayClassData($scope.bizUserDisplayClassList);
						//回显会员展示类别
						if($scope.bizUserDisplayClassCode){
							$scope.displayCategoryVo = productDisplayCategoryService.getBizUseDisplayClassObjByCode($scope.bizUserDisplayClassCode);
							findProductDisplayCategoryList($scope.bizUserDisplayClassCode);
						}
					})
				}
				getBizUserDisplayClassList();
				
				//获取产品展示类目列表
				var findProductDisplayCategoryList = function(bizUserDisplayClass){
					productDisplayCategoryService.listDisplayCategoryWithChildNoBrand(bizUserDisplayClass).then(function(data){
						if(data.result==='success'){
							$scope.displayCategoryVo.allDisplayCategoryList = data.list ;
							productDisplayCategoryService.cacheAllDisplayCategoryData($scope.displayCategoryVo.allDisplayCategoryList);
							//展示类目回显
							if($scope.displayCategoryId){
								$scope.displayCategoryVo = productDisplayCategoryService.getCategoryObjByCategoryId($scope.displayCategoryId);
							}else {
								if($scope.displayPartnerCategoryId && !$scope.displaySubcategoryId){
									$scope.displayCategoryVo = productCategoryService.getCategoryObjByPartnerCategoryId($scope.displayPartnerCategoryId);
								}else if($scope.displayPartnerCategoryId && $scope.displaySubcategoryId){
									$scope.displayCategoryVo = productCategoryService.getCategoryObjBySubcategoryId($scope.displaySubcategoryId);
								}
							}
						}
					})
				}
				
				//选择会员展示类别触发
				$scope.initBizUserDisplayClass = function(){
					findProductDisplayCategoryList($scope.displayCategoryVo.bizUserDisplayClassObj.code);
					$scope.bizUserDisplayClassCode = $scope.displayCategoryVo.bizUserDisplayClassObj ? $scope.displayCategoryVo.bizUserDisplayClassObj.code : "" ;
					$scope.displayPartnerCategoryId = "" ;
					$scope.displaySubcategoryId = "" ;
				}
				
				//选择一级类目时触发
				$scope.initPartnerCategory = function(){
					$scope.displayPartnerCategoryId = $scope.displayCategoryVo.partnerCategoryObj ? $scope.displayCategoryVo.partnerCategoryObj.id : "" ;
					$scope.displaySubcategoryId = "" ;
				}
				
				//选择二级类目时触发
				$scope.initSubcategory = function(){
					$scope.displaySubcategoryId = $scope.displayCategoryVo.subcategoryObj ? $scope.displayCategoryVo.subcategoryObj.id : "" ;
				}
				
			}],
		}
	}])
}())