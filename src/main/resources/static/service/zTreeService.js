/**
 * 树形控件Api服务
 */
(function(){
	'use strict' ;
	
	var zTreeServiceModule = angular.module('zTreeServiceModule',[]);
	zTreeServiceModule.service('zTreeService', ['$cacheFactory', function ($cacheFactory) {
		
		//存储用户已选酒批城市Id节点列表
	    var cacheJiupiCityIdList = [];
	    
	    /**
	     * 缓存用户已选节点 
	     */
	    this.cahceUserCheckedNode = function(checkedNodeList,notCheckedNodeList){
	    	
	    	//还没有任何缓存时，直接将用户已选中节点存入allCheckedNodeList
	    	if(!cacheJiupiCityIdList || cacheJiupiCityIdList.length == 0){
	    		angular.forEach(checkedNodeList,function(newCheckedNode){
	    			if(!newCheckedNode.isParent){
	    				cacheJiupiCityIdList.push(newCheckedNode.id)
	    			}
	    		});
	    	}else {
		    	//add节点
	    		angular.forEach(checkedNodeList,function(nodeItem){
	    			if(!nodeItem.isParent){
	    				if(cacheJiupiCityIdList.indexOf(nodeItem.id) < 0){
	    					cacheJiupiCityIdList.push(nodeItem.id);
	    				}
	    			}
	    		})
	    		//remove节点
	    		angular.forEach(notCheckedNodeList,function(nodeItem){
	    			if(!nodeItem.isParent){
	    				if(cacheJiupiCityIdList.indexOf(nodeItem.id) >= 0){
	    					angular.forEach(cacheJiupiCityIdList,function(cacheItem,index){
	    						if(nodeItem.id == cacheItem){
	    							cacheJiupiCityIdList.splice(index,1)
	    						}
	    					})
	    				}
	    			}
	    		})
	    		
	    	}
	    	console.log(cacheJiupiCityIdList);
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
	     * 获取选中的jiupiCityObject集合
	     */
	    this.getJiupiCityObjList = function () {
	        var leafNodes = [];
	        angular.forEach(allCheckedNodeList, function (item) {
	            if (!item.isParent) {
	                var fullName = getFullNameByNodeId(item.id);
	                //父节点
	                var pNode = item.getParentNode();
	                leafNodes.push({
	                    cityId: item.id,
	                    province:pNode.name ,
	                    city: item.name,
	                    fullName: fullName,
	                });
	            }
	        });
	        return leafNodes;
	    };
	    
	    
	    /**
	     * 获取选中的jiupiCityId集合 
	     */
	    this.getJiupiCityIdList = function () {
	        return cacheJiupiCityIdList;
	    }
	}]);
	
}());