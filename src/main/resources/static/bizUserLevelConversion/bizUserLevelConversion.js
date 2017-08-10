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
				},function(data){
					console.info(data.detailMessage);
				});

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
  }])
}());