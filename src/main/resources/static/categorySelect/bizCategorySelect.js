/**
 * 类目选择下拉选择框
 */
(function () {
    'use strict'; 
    
	var categorySelectModule = angular.module("categorySelectModule", []);   //定义模块
	categorySelectModule.directive("bizCategorySelect",[function(){
	return {
		restrict:'E',
		scope:{
			selCol:"=",
			uiCol:'=',
			categoryVo:"=",
			categoryObj : "=",
			changeClass:"=",
			changePLevel:"=",
			changeSLevel:"="
		},
        templateUrl: "../static/categorySelect/bizcategorySelect.html",
		controller:["$scope","$http",function($scope,$http){
			
			//获得类目类别
			$scope.getCategoryClass = function(){
				$http.get("bizwebcontrol/dictionary/getDictionaryType/CategoryClass.action").success(function(data){
					if(data.result==="success"){
						$scope.CategotryClassList = data.data.items ;
						$scope.CategotryClassList.unshift({"code":"","name":"请选择"})
						if($scope.categoryObj){
							angular.forEach($scope.CategotryClassList,function(classItem){
								if(classItem.code == categoryClassCode){
									$scope.categoryVo.categoryClass = classItem ;
								}
							})
							$scope.categoryVo.categoryClass && $scope.findCategory();
						}
					}
				})
			}
			$scope.getCategoryClass();
			//获得类目
			$scope.findCategory = function() {
				  $scope.categoryVo.categoryClass.code && $http.post('bizwebcontrol/category/findAllCategoryList/'+$scope.categoryVo.categoryClass.code).success(function(result) {
                  	if (result.result == 'success') {
                          $scope.menuData = result.data.menuData;
                          $scope.menuData.unshift({"id":"","label":"请选择","level":[]});
                          angular.forEach($scope.menuData,function(item){
                        	  item.level.unshift({"id":"","label":"请选择"});
                          });
                          if($scope.categoryObj){
                        	  angular.forEach($scope.menuData,function(partnerItem){
                        		 if($scope.categoryObj.partnerId == partnerItem.id){
                        			 $scope.categoryVo.pLevel = partnerItem ;
                        			 angular.forEach($scope.categoryVo.pLevel.level,function(sonItem){
                        				 if($scope.categoryObj.sonId == sonItem.id){
                        					 $scope.categoryVo.sLevel = sonItem ;
                        				 }
                        			 })
                        		 }
                        	  })
                          }
                      }
                  });
              };
              
              if($scope.categoryObj && ($scope.categoryObj.partnerId || $scope.categoryObj.sonId)){
            	  	if($scope.categoryObj.sonId && $scope.categoryObj.sonId!=-1){
            	  		$scope.categoryObj.categoryClassId = $scope.categoryObj.sonId ;
            	  	}else if($scope.categoryObj.partnerId){
            	  		$scope.categoryObj.categoryClassId = $scope.categoryObj.partnerId ;
            	  	}
            	  	$scope.categoryObj.categoryClassId && $http.post("bizwebcontrol/category/findAllCategoryList/"+$scope.categoryObj.categoryClassId).success(function(data){
    					if(data.result==="success"){
    						$scope.categoryVo.categoryClass ={} ;
    						$scope.categoryVo.categoryClass.code = data.data.categoryClassCode ;
    						$scope.getCategoryClass ($scope.categoryVo.categoryClass.code) ;
    					}
    				})
              }
		}]
	}
}]);
           
	//初始化数据
//	categorySelectModule.service('categoryInitService',function(){
//		this.init=function(config){
//			 
//			config.vo = {};
//			config.changePLevel = function(){
//				config.vo.secondCategoryId = "" ; 
//				config.vo.firstCategoryId = config.vo.pLevel.id ;
//            };
//            config.changeSLevel = function(){
//            	config.vo.secondCategoryId = config.vo.sLevel.id ;
//            };
//            config.showCategory = true ;
//         
//		}
//		
//	})



}());