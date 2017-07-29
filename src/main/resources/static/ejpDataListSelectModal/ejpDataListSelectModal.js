/**
 * 数据选择模态框
 * 
 */
(function(){
	'use strict';
	angular.module('ejpDataListSelectModalModule', [])
	//初始化配置
	.constant("ejpDataListSelectConfig",{
	   //促销活动
		promotion : {
			templateUrl : '../static/ejpDataListSelectModal/salesPromotionModal.html',
			controller : 'salesPromotionController',
		},
		
		
	})
	.directive("ejpDataListSelectType",['$parse','$modal','ejpDataListSelectConfig',
	function($parse, $modal, ejpDataListSelectConfig) {
		return {
			restrict : 'A',
			compile : function($element, $attr) {
				return {
					post : function postFunction(scope, element, attr, ctrl) {
						//获取初始化配置
						var config = angular.copy(ejpDataListSelectConfig);

						element.on("click",function() {
							// 选择窗口类型
							var modalType = attr.ejpDataListSelectType;

							// 加载入参数据
							var paramFunctionName = attr.ejpDataListParamFunction;
							// 触发点击事件后，再获取加载的列表数据
							var loadingDataListFuntion = scope.$eval(paramFunctionName);
							//传入的参数对象
							var paramObj = loadingDataListFuntion();

							// 点击OK按钮后的回调函数
							var callbackFunction = scope.$eval(attr.ejpCallback);
							
							// 创建弹框对象
							var modalInstance = $modal.open({
								templateUrl : config[modalType].templateUrl,
								controller : config[modalType].controller ,
								size : 'lg',
								resolve : {
									requestResults : function() {
										return angular.copy(paramObj);
									}
								},
							});
							modalInstance.result.then(callbackFunction, angular.noop, angular.noop);
						});
					}
				};
			}
		}
	}])
	//选择促销活动弹框
	.controller('salesPromotionController',['$modalInstance','$scope','$modal','$log','requestResults',
	   '$http', '$location', 'ejpAlert','getUserInfo','ejpCheckbox',
       function($modalInstance,$scope,$modal,$log,requestResults,$http,$location,ejpAlert,getUserInfo,ejpCheckbox){
		
				//标题
				$scope.title = requestResults.title ;
				//传入的已经选中的列表数据
				var hasCheckedDataList = requestResults.data ;
				//模板类型
				$scope.checkStyle = requestResults.checkStyle ;
				
		 		var vm =$scope.vm = {};
                vm.pages = {
                    itemsPerPage : 20,
                    index : 1,
                    totalResult : 0,
                    totalPage : 0
                };
                vm.items = [] ;
                
                var search = {};
                
                $scope.searchParam = {state:'3'};
                $scope.getActivityList = function(){
                    var url='promotion/findDiscountPromotionEnabledList/';
                    switch($scope.searchParam.state){
                         case '3' : url='promotion/findDiscountPromotionEnabledList/';break;  //打折促销
                         case '4' : url='promotion/findTimelimitPromotionEnabledList/';break;  //限时惠
                         case '5' : url='promotion/findCompositeProductEnabledList/';break;  //组合产品
                         case '6' : url='promotion/findGatherOrderEnabledList/';break;  //凑单活动
                         default : alert("您没有选择活动类型,默认打折促销！！");
                                   $scope.searchParam.state = '3';
                                 url='promotion/findDiscountPromotionEnabledList/';
                    }
                    var identity =$scope.identity = getUserInfo.userInfo();
                	if(identity.city.city_Id > 0){
                		search.city = identity.city;
                	} 
                	search.state = $scope.searchParam.state ;
                    search.onGoing = 1;
                    search.bizUserClassId = requestResults.bizUserClassId;
                    $scope.loadingShow=true;
                    $http.post(url+ vm.pages.index + '.action',search).success(
                            function(data) {
                                $scope.loadingShow = false;
                                if (data.result === "success") {
                                    if(data.datas.pager){
                                        $scope.vm.items = data.datas.dataList;
                                        $scope.vm.pages.totalResult = data.datas.pager.recordCount;
                                        $scope.vm.pages.index = data.datas.pager.currentPage;
                                        $scope.vm.pages.totalPage = data.datas.pager.totalPage;
                                    }else {
                                        $scope.vm.items = data.datas.dataList;
                                    }
                                    var items = [];
                                    angular.forEach($scope.vm.items,function(item){
                                        if(item.endDate >= new Date().getTime()){
                                            items.push(item);
                                        }
                                    });
                                    $scope.vm.items = items;
                                }
                            })
                   } 
                   $scope.getActivityList();
                
                    //查询按钮
                    $scope.searchExist = function(searchParams) {
                        angular.copy(searchParams,search);
                        
                        vm.pages = {
                            itemsPerPage : 20,
                            index : 1,
                            totalResult : 0,
                            totalPage : 0
                        };
                        $scope.getActivityList();
                    };
                    
                    //清空按钮
                    $scope.resteExist = function() {
                    	$scope.searchParam = {state:'3'};
                    };
                    
                    //传入的参数
                    var requiredParam = {
                    	'dataList' : $scope.vm.items ,
                    	'hasCheckedDataList' :  hasCheckedDataList , 
                    } ;
                    
                    var targetObjList = ejpCheckbox.getTargetIdList(requiredParam);
                 
//**************多选************************************************
                  //选中的活动
            		$scope.hasCheckedPromotionIdList =  [];
            		$scope.hasCheckedPromotionList = [];
            		$scope.currentPage = 1;
            		
            		//活动集合
            		$scope.promotionIdList = [];

                    $scope.checkAll = function() {
                    	angular.forEach($scope.vm.items,function(data) {
                             data.checked = $scope.allCheck;
                             if (data.checked) {//选中
                            	 if($scope.hasCheckedProductIdList.indexOf(data.id) < 0){
                            		 $scope.hasCheckedProductIdList.push(data.id);
                            		 $scope.hasCheckedProductsList.push(data);
                            	 }
                             }else{
                             	if($scope.hasCheckedProductIdList.length > 0 
                             			&& $scope.hasCheckedProductIdList.indexOf(data.id) >= 0){
                             		$scope.hasCheckedProductIdList.splice($scope.hasCheckedProductIdList.indexOf(data.id),1);
                             		$scope.hasCheckedProductsList.splice($scope.hasCheckedProductIdList.indexOf(data.id),1);
                             	}
                             }
                        });
                    };
            		
            	    var updateSelected = function(action,item,name){
            	        if(action == 'add' && $scope.hasCheckedProductIdList.indexOf(item.id) == -1){
            	            $scope.hasCheckedProductIdList.push(item.id);
            	            $scope.hasCheckedProductsList.push(item);
            	        }
            	        if(action == 'remove' && $scope.hasCheckedProductIdList.indexOf(item.id)>-1){
            	            var idx =  $scope.hasCheckedProductIdList.indexOf(item.id);
            	            $scope.hasCheckedProductIdList.splice(idx,1);
            	            $scope.hasCheckedProductsList.splice(idx,1);
            	        }
            	        $scope.isAllCheck(); 
            	    }

            	    $scope.updateSelection = function($event, item){
            	        var checkStyle = $event.target;
            	        var action = (checkStyle.checked?'add':'remove');
            	        updateSelected(action,item,checkStyle.name);
            	        $scope.isAllCheck(); 
            	    }

            	    $scope.isSelected = function(id){
            	        return $scope.hasCheckedProductIdList.indexOf(id)>=0;
            	    }
            		
            	    $scope.isAllCheck = function(){
            	    	$scope.allCheck = true;
                    	angular.forEach($scope.vm.items,function(data,index) {
                    		if($scope.hasCheckedProductIdList.length == 0 || $scope.hasCheckedProductIdList.indexOf(data.id) < 0){
                    			$scope.allCheck = false;
                        	}
                       });
            	    }
//********end 多选 ************************************************                   
        
                    // 确认按钮（close()可以带参数）
                    $scope.ok = function() {
                        $modalInstance.close($("input[name='id']:checked").val());
                        
                    };
                    // 取消按钮
                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
            }])
}());