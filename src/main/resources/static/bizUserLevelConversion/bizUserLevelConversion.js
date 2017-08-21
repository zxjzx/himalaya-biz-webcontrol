/**
 * 会员等级名称转换指令
 * 
 */
(function(){
	"use strict" ;
	
	angular.module("bizUserLevelModule",[])
	
	//会员等级枚举与会员等级名称匹配
	.directive('bizUserLevelReadOnly',[function(){
		return {
			restrict: 'E',
			scope:{
				userLevel:'='
			},
			templateUrl : '../static/bizUserLevelConversion/bizUserLevelReadOnly.html',
			replace:true,
			controller:['$scope','$http','BizUserLevelService',function($scope,$http,BizUserLevelService){
				BizUserLevelService.getBizUseLevelList().then(function(data){
					$scope.bizUserLevelList = angular.copy(data.list);
					BizUserLevelService.cacheBizUserLevelData($scope.bizUserLevelList);
				},function(data){
					console.info(data.detailMessage);
				});

			}]
		};
	}])
	
	//获取会员等级的下拉框指令（多用于促销活动中）
	.directive('bizUserLevelDropdown',[function(){
		return {
			restrict: 'E',
			scope:{
				userLevelId : '=' , //会员等级vo对象，
				changeUserLevel : '&' , //改变会员等级胡触发函数 ，
				isDisabled : '=' , //是否禁用会员等级下拉框
			},
			templateUrl : '../static/bizUserLevelConversion/bizUserLevelDropdown.html',
			replace:true,
			controller:['$scope','$http','BizUserLevelService',function($scope,$http,BizUserLevelService){
				
				//初始化会员等级下拉框列表
				$scope.userLevelList = [] ;
				
				var getBizUserLevelList = function(){
					BizUserLevelService.getBizUseLevelList().then(function(data){
						console.log(data);
						var bizUserLevelList = angular.copy(data.list);
						//缓存数据
						BizUserLevelService.cacheBizUserLevelData(bizUserLevelList);
						for(var i=0 ; i<bizUserLevelList.length ; i++){
							var item = bizUserLevelList[i] ;
							if(i == bizUserLevelList.length-1){
								item.name = item.levelName ;
								$scope.userLevelList.push(item) ;
							}else {
								item.name = item.levelName + "会员及以上" ;
								$scope.userLevelList.push(item) ;
							}
						}
					}).then(function(){
						if($scope.userLevelId==undefined || $scope.userLevelId==""){
							//初始化会员等级为下拉框第一个会员等级
							$scope.userLevelId = $scope.userLevelList[0].id ;
						}
					})
				}
				getBizUserLevelList() ;
				
			}]
		};
	}])
	
	//获取会员等级接口服务
	.service('BizUserLevelService', ['$http', '$q', function ($http, $q) {

	//获取会员等级列表接口
    this.getBizUseLevelList = function () {
        var self = this;
        return $q(function (resolve, reject) {
        	
        	//缓存会员等级列表
            if (self.cacheBizUserLevel) {
                resolve(self.cacheBizUserLevel);
                return;
            }

            $http({
                method: 'get',
                url: 'bizwebcontrol/bizuserLevel/findBizUserLevelList'
            }).success(function (data) {
            	self.cacheBizUserLevel = data;
                resolve(data);
            }).error(function (data) {
                reject(data.message);
            });
        });
    }
    
    var cacheBizUserLevelList = [] ;
    //缓存会员等级列表数据
    this.cacheBizUserLevelData = function(bizUserLevelList){
    	cacheBizUserLevelList = bizUserLevelList ;
    }
    
    //根据会员等级Id获取会员等级对象
    this.getUserLevlObjById = function(id){
    	var userLevelObj = {} ;
    	angular.forEach(cacheBizUserLevelList,function(item){
    		if(item.id == id){
    			userLevelObj = item ;
    		}
    	})
    	return userLevelObj ;
    }
    
  }])
}());