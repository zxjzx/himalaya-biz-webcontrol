/**
 * 用户权限服务
 */
(function(){
	'use strict' ;
	
	angular.module("ejpUserPrivilegeServiceModule" , [])
	/**
	 * 搜集菜单，页面，按钮权限数据服务
	 */
	.service("ejpUserPrivilegeService" ,['$q','QHttp',function($q,QHttp){
	    var self = this;
	    
	    //能访问的没有权限控制的白名单页面
	    this.whiteAccessUrl = ['/error.html'];
	            
	    /**获取有权限访问的url（包含Button，Menu，Page）*/
	    /**从服务端获取权限数据*/
	    this.getUserPrivilege = function () {
	        return QHttp.request({
	            url: 'findUserPrivilegeList.action'
	        });
	    };
	    /**有权限的路由*/
	    this.getAllCanAccessUrl = function () {
	    	var deferred = $q.defer();
			if (!self.loaded) {
				self.getUserPrivilege().then(function (data) {
				    self.storePrivilegeData(data.datas.dataList);
				    var privilegeList = localStorage.getItem("PrivilegeList");
				    var privilegeListData = null;
			        if (privilegeList) {
			        	privilegeListData = angular.fromJson(privilegeList);
			        }
				    deferred.resolve(privilegeListData);
				});
		    }
	        return deferred.promise;
	    };
	    /**有权限的按钮*/
	    this.getAllPrivilegeButton = function () {
	        refreshPrivilege();
	        var privilegeList = localStorage.getItem("privilegeButton");
	        if (privilegeList) {
	            return angular.fromJson(privilegeList);
	        }
	        return null;
	    };
	    /**有权限的菜单树*/
	    this.getMenuTree = function () {
	        refreshPrivilege();
	        var privilegeList = localStorage.getItem("MenuTree");
	        if (privilegeList) {
	            return angular.fromJson(privilegeList);
	        }
	        return null;
	    };
	    function refreshPrivilege() {
	        if (!self.loaded) {
	            self.getUserPrivilege().then(function (data) {
	                self.storePrivilegeData(data.datas.dataList);
	            });
	        }
	    }

	    /**存储权限数据*/
	    this.storePrivilegeData = function (data) {
	        self.loaded = true;

	        var privilegeList = [];
	        var privilegeButton = [];
	        var menuFlagList = [];
	        angular.forEach(data, function (item) {
	            if (item.url) {
	                if (item.privilegeType === 'Button') {
	                    privilegeButton.push({
	                        privilegeType: item.privilegeType,
	                        privilegeCode: item.privilegeCode,
	                        url: item.url
	                    });
	                } else {
	                    privilegeList.push({
	                        privilegeType: item.privilegeType,
	                        privilegeCode: item.privilegeCode,
	                        url: item.url
	                    });
	                }
	            }
	            
	            //若当前权限是一个菜单，搜集其下级菜单项
	        	var menuItem = angular.copy(item);
	        	var menuItemSubMenu = [];
		
	            //递归收集下级权限和下级菜单
	        	conllectPrivilege(item, menuItemSubMenu);
	            if (item.privilegeType === 'Menu') {
	            	menuItem.sonIndex = menuItemSubMenu;
	            	menuFlagList.push(menuItem);
	            }

	        });

	        //递归收集当前角色所有能访问的列表
	        function conllectPrivilege(curItem, menuItemSubMenu) {
	            //是否有下级权限
	            if (curItem.sonIndex) {
	                angular.forEach(curItem.sonIndex, function (sonItem) {
	                    if (sonItem.privilegeType === 'Button') {
	                        privilegeButton.push({
	                            privilegeType: sonItem.privilegeType,
	                            privilegeCode: sonItem.privilegeCode,
	                            url: sonItem.url
	                        });
	                    } else {
	                    	privilegeList.push({
	                            privilegeType: sonItem.privilegeType,
	                            privilegeCode: sonItem.privilegeCode,
	                            url: sonItem.url
	                        });
	                    }
	                    var sonMenuItem = angular.copy(sonItem);
	                	var sonMenuItemSubMenu = [];
	                    if (sonItem.sonIndex) {
	                        conllectPrivilege(sonItem, sonMenuItemSubMenu);   
	                    }
	                    
	                    if (sonItem.privilegeType === 'Menu') {
	                    	sonMenuItem.sonIndex = sonMenuItemSubMenu;
	                    	menuItemSubMenu.push(sonMenuItem);
	                    }
	                });  
	            }
	        }
	        
	        localStorage.setItem("MenuTree", angular.toJson(menuFlagList));
	        localStorage.setItem("PrivilegeList", angular.toJson(privilegeList));
	        localStorage.setItem("privilegeButton", angular.toJson(privilegeButton));
	    }
	}])
	
	/**
	 * 按钮权限控制，控制按钮的显示和隐藏
	 */
	.directive('permission', ['$log', 'ejpUserPrivilegeService', function ($log,ejpUserPrivilegeService) {
	      return {
	        restrict: 'A',
	        scope:{
	        	permission:"@"
	        },
	        controller: ['$scope', '$element', function ($scope, $element) {

	       	 var privilegeList = ejpUserPrivilegeService.getAllPrivilegeButton();
	       
	       	     $element.addClass('ng-hide');
	        	 if(privilegeList){
	        		 angular.forEach(privilegeList,function(item){
	        			 if(item.privilegeCode===$scope.permission){
	        				 $element.removeClass('ng-hide');
	        			 }
	        		 });
	        	 }

	        }]
	      };
	    }]);

}())