/**
 * 树形控件Api服务
 */
(function(){
	'use strict' ;
	
	var zTreeServiceModule = angular.module('zTreeServiceModule',[]);
	zTreeServiceModule.service('zTreeService', ['$cacheFactory', function ($cacheFactory) {
		
		//存储用户已选酒批城市Id节点列表
	    var cacheJiupiCityIdList = [];
	    
	    //获得所有的酒批城市对象
	    var allJiupiCityObjList ;
	    //选中的酒批城市对象集合
	    var checkedJiupiCityObjList = [] ;
	    
	    /**
	     * 缓存用户已选节点 
	     */
	    this.cahceUserCheckedNode = function(checkedNodeList,notCheckedNodeList){
	    	
	    	//还没有任何缓存时，直接将用户已选中节点存入cacheJiupiCityIdList
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
	    }
	    
	    //储存所有的酒批城市
	    this.setAllJiupiCity = function(allTreeNode){
	    	allJiupiCityObjList = allTreeNode ;
	    }
	    
	    /**
	     * 获取选中的jiupiCityId集合 
	     */
	    this.getJiupiCityIdList = function () {
	        return cacheJiupiCityIdList;
	    }
	    
	    /**
	     * 获取选中的jiupiCityObj集合 
	     */
	    this.getJiupiCityObjList = function(){
	    	//获取选中的酒批城市对象集合
	    	angular.forEach(allJiupiCityObjList,function(parentItem){
	    		angular.forEach(parentItem.children,function(childItem){
	    			angular.forEach(cacheJiupiCityIdList,function(cityIdItem){
	    	    		if(cityIdItem == childItem.id){
	    	    			checkedJiupiCityObjList.push(childItem);
	    	    		}
	    	    	})
	    		})
	    	})
	    	return checkedJiupiCityObjList ;
	    }
	}]);
	
}());