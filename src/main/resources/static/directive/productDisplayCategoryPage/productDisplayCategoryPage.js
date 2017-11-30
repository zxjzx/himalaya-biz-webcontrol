/**
 * <product-display-category-page ng-if="productInfo.categoryList" has-exist-category-list="categorys"></product-display-category-page>
	productInfo.categoryList：页面加载时显示的类目
	用时，js中要声明:$scope.categorys=[];				
 */
(function () {
	'use strict';
	angular.module("productDisplayCategoryPageModule",[])
	.directive("productDisplayCategoryPage",[function(){
		return{
			restrict:'E',
			scope:{
				hasExistCategoryList:'=', 
			},
			templateUrl:'../static/directive/productDisplayCategoryPage/productDisplayCategoryPage.html',
			controller:['$scope','$http','$modal','findDictionaryByCodeService','ejpAlert',
			            function($scope,$http,$modal,findDictionaryByCodeService,ejpAlert){
				
				$scope.categorys = $scope.hasExistCategoryList;
				
				//获取会员展示类别
                findDictionaryByCodeService.getDictionaryTypeDetailByCode('BizUserDisplayClass').then(function(data){
               	 	$scope.bizUserDisplayClassList = data.data.items;
                });
                
                //移除类目
                $scope.removeCategory = function(firstCategoryId,secondCategoryId){
	               	 var i = 0;
	               	 angular.forEach($scope.categorys,function(obj) {
	               		 if (firstCategoryId == obj.firstCategoryId && obj.secondCategoryId==null) {
	               			 $scope.categorys.splice(i,1);
	                        }else if(firstCategoryId == obj.firstCategoryId && secondCategoryId==obj.secondCategoryId){
	                       	 $scope.categorys.splice(i,1);
	                        }
	               		 i++;
	               	 });
                }
                //打开添加的弹出
				$scope.openAddCategory = function (size) {
	                var modalInstance = $modal.open({
	                    templateUrl: '../static/directive/productDisplayCategoryPage/productDisplayCategoryModal.html',
	                    controller: productCategoryCtrl,
	                    size: size,
	                    resolve: {
	                        requestResults: function () {
	                            return {
	                                'category': $scope.categorys
	                            }
	                        }
	                    }
	                });
	                //回调
	                modalInstance.result.then(function (data) {
	                	
	                	var flag = true;
                        
                        if (data != null || data.partnerCategoryObj != null){
                        	//判断是否已经添加
                       	 	var i = 0;//i表示弹窗显示次数,防止多次弹出弹窗
                            angular.forEach($scope.categorys,function(obj) {
                                if (data.partnerCategoryObj.id == obj.firstCategoryId && !data.subcategoryObj) {
                               	 i++;
                               	 if(i == 1){
                               		 ejpAlert.show('已添加此类目');
                               	 }
                                    flag = false;
                                    return;
                                }
                                if (data.partnerCategoryObj.id == obj.firstCategoryId && (!obj.secondCategoryId || data.subcategoryObj.id==obj.secondCategoryId)) {
                               	 ejpAlert.show('已添加此类目');
                                    flag = false;
                                    return;
                                }
                            });
                        }
                        if(flag){
                        	$scope.newData = {};//新增加的产品类目
	                       	$scope.newData = {
	                       			 bizUserDisplayClass:data.bizUserDisplayClassObj.code,
	                       			 bizUserDisplayClassName:data.bizUserDisplayClassObj.name,
	                       			 firstCategoryId:data.partnerCategoryObj.id,
	                       			 firstCategoryName:data.partnerCategoryObj.name,
	                       			 secondCategoryId:data.subcategoryObj.id,
	                       			 secondCategoryName:data.subcategoryObj.name
	                       	 }
                        	$scope.categorys.push($scope.newData);
                            console.log($scope.categorys);
                            $scope.hasExistCategoryList = $scope.categorys;
                        }
                        
                        
	                });
	            };
	            //end
	            function productCategoryCtrl ($scope,ejpAlert,$modalInstance){
	            	 $scope.title = '增加类目';
	                 $scope.sonMenu = {};
	                 $scope.ok = function () {
	                 	//categoryClass -->  bizUserDisplayClass; partnerCategoryObj;subcategoryObj 
	                 	if(!$scope.sonMenu.partnerCategoryObj){
	                 		ejpAlert.show("没有选择类目！");
	                 		return ;
	                 	}else {
	                 		$modalInstance.close($scope.sonMenu);
	                 	}
	                 };

	                 $scope.cancel = function () {
	                     $modalInstance.dismiss('cancel');
	                 };
	            }
			}]
				
			
		}
	}])
}()) 