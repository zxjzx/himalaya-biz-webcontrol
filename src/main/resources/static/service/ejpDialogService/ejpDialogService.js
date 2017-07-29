/**
 * 公用服务commonService
 */
(function(){
	'use strict' ;
	
	var ejpDialogModule = angular.module("ejpDialogModule" , []);
	ejpDialogModule.service('ejpDialog' , ['$modal', '$http', 'toastr', function ($modal, $http, toastr){
		
		/*消息提示模式窗口*/
	    this.confirm = function (config) {
	        var DEFAULT = {
	            templateUrl: '../static/service/ejpDialogService/ejpDialogService.html',
	            controller: function ($scope, $modalInstance, items) {
	                $scope.results = items;
	                var data ;
	                // 确认按钮
	                $scope.ok = function () {
	                	data = true ;
	                	$modalInstance.close(data);
	                };
	                // 取消按钮
	                $scope.cancel = function () {
	                	data = false ;
	                	$modalInstance.close(data);
	                };
	            },
	            size: 'sm',
	            title: '提示消息',
	            msg: ''
	        };
	        //判断传入的值是否为String类型,若有则替换提示信息的值。
	        var cfg ;
	        if((Object.prototype.toString.call(config) === "[object String]")){
	        	cfg = $.extend(DEFAULT, {msg: config}) ;
	        }else if(Object.prototype.toString.call(config) === "[object Object]"){
	        	cfg = $.extend(DEFAULT, {msg: config.msg , size: config.size});
	        }else {
	        	cfg = $.extend(DEFAULT, config);
	        }

	        //创建弹框对象
	        var modalInstance = $modal.open({
	            templateUrl: cfg.templateUrl,
	            controller: cfg.controller,
	            size: cfg.size,
	            resolve: {
	                items: function () {
	                    return {title: cfg.title, msg: cfg.msg};
	                }
	            }
	        });
	        return modalInstance;
	    };
	    
	}])
	
}())