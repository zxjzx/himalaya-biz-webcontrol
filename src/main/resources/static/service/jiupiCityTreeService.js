/**
 * 树形控件服务
 */
(function(){
	'use strict' ;
	
	var jiupiCityTreeModule = angular.module('jiupiCityTreeModule' , []);
	jiupiCityTreeModule.service('jiupiCityTreeService', ['$http','$q',function($http,$q) {
		   
		   /**
		    * 获取所有的酒批城市接口服务
		    * cityMode  用于搜索cityMode对应的酒批城市。
		    * cityMode为-1默认查所有的
		    */
		   this.findJiupiCityListByCityMode = function(cityMode){
			   return $q(function (resolve, reject) {
		           $http({
		               method: 'GET',
		               url: '/bizwebcontrol/jiupicitymultitree/listProvinceAllCitiesDTO/' + cityMode
		           }).success(function (data) {
		               resolve(data)
		           }).error(function (data) {
		               reject(data.message);
		           });
		       });
		   };
		    
		    this.convertModel = function(cityList){
		    	angular.forEach(cityList,function(item){
		    		item.name = item.province;
		    		item.children = item.jiupiCityList ;
		    	});
		        return cityList;
		    }

		}]);
	
	  /**
	   * 树形控件API服务
	   */
	 jiupiCityTreeModule.service('zTreeService', ['$cacheFactory', function ($cacheFactory) {

		    var nodes = [];
		    var treeObj = null;
		    /**
		     * 设置所有选中的节点
		     */
		    this.getCheckedNodes = function () {
		        return nodes;
		    };

		    /**
		     * 获取所有选中的节点
		     */
		    this.setCheckedNodes = function (tObj, checkNodes) {
		        nodes = checkNodes;
		        treeObj = tObj;
		    };
		    this.removeCheckedNodes =function(Nodes){
		        nodes=[];
		    };

		    /**
		     * 通过节点id获取节点
		     */
		    function getTreeNodeById(nodeId) {
		        var currentNode = null;
		        angular.forEach(nodes, function (item) {
		            if (nodeId == item.id) {
		                currentNode = item;
		            }
		        });
		        return currentNode;
		    }

		    /**
		     * 通过当前节点递归获取父节点
		     */
		    function getParentNodeByNode(nodeList, node) {
		        if (node) {
		            nodeList.push(node);
		            getParentNodeByNode(nodeList, node.getParentNode());
		        }
		    }

		    /**
		     * 获取叶子节点的全路径名称
		     */
		    function getFullNameByNodeId(id) {
		        var nodeList = [];
		        var fullName = "";
		        var currentNode = getTreeNodeById(id);
		        getParentNodeByNode(nodeList, currentNode);
		        for (var i = nodeList.length - 1; i >= 0; i--) {
		            fullName += nodeList[i].name;
		        }
		        return fullName;

		    }

		    /**
		     * 获取所有选中的叶子节点（全路径-包含上级名称）
		     */
		    this.getFullLeafNodeList = function () {
		        var leafNodes = [];
		        angular.forEach(nodes, function (item) {
		            if (!item.isParent) {
		                var fullName = getFullNameByNodeId(item.id);
		                //父节点
		                var pNode = item.getParentNode();
		                leafNodes.push({
		                    cityId: item.id,
		                    name: item.name,
		                    fullName: fullName,
		                });
		            }
		        });
		        nodes = [];
		        return leafNodes;
		    };

		    /**
		     * 获取所有选中的叶子节点
		     */
		    this.getLeafNodes = function () {
		        var leafNodes = [];
		        angular.forEach(nodes, function (item) {
		            if (!item.isParent) {
		                leafNodes.push(item.id);
		            }
		        });
		        return leafNodes;
		    }
		}]);
}());
