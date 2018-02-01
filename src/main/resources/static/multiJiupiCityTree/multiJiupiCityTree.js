/**
 * 城市多选框指令
 * */
(function(){
	'use strict'; 
	
	var multiJiupiCityTreeModule = angular.module('multiJiupiCityTreeModule',[]);
	
	multiJiupiCityTreeModule.directive('multiJiupiCityTree', [function () {
	    return {
	        restrict: "E",
	        scope: {
	            labelCol:"@",
	            divCol:"@",
	            leafNodes:'=',
	            cityModelIsRequired:'=',
	            cityIsRequired:'=',
	            isDisabled:'=',
	            defaultCityMode : '=',
	            hideCitymode :'=',
				cityClickFun:'&'
	        },
	        templateUrl:  '../static/multiJiupiCityTree/multiJiupiCityTree.html',
	        controller: ['$rootScope','$scope','$http','jiupiCityTreeService','findDictionaryByCodeService','zTreeService',
	                     function ($rootScope,$scope,$http,jiupiCityTreeService,findDictionaryByCodeService,zTreeService) {
	        	
		        	$scope.vo = {} ;
		        	
		        	//copy $scope.leafNodes的值
		        	var copyLeafNodes = angular.copy($scope.leafNodes);
		        	
		        	var chkDisabledNodeList = [];
		        	
		        	//获取运营模式字典
		        	findDictionaryByCodeService.getDictionaryTypeDetailByCode("cityModel").then(function(data){
		        		if(data.result==='success'){
		        			$scope.cityModeList = data.data.items ;
		        			$scope.cityModeList.unshift({'code' : -1,'name': '所有城市'});
		        		}
		        	})
		        	
		        	//默认运营模式为所有城市
		        	$scope.vo.cityMode = $scope.defaultCityMode ? $scope.defaultCityMode : -1;
		        			        	 
		            //根据运营模式获取酒批城市
		        	var findJiupiCityByCityMode = function(){
		        		jiupiCityTreeService.findJiupiCityListByCityMode($scope.vo.cityMode)
		              	  .then(function(result){
		              		$scope.zNodes = jiupiCityTreeService.convertModel(result.list);
		              		if($scope.vo.cityMode==-1){
		              			zTreeService.setAllJiupiCity($scope.zNodes);
		              		}
		              		var parentChecked = [];
		              		if(copyLeafNodes && copyLeafNodes.length>0 ){
		              			angular.forEach($scope.zNodes,function(parentItem){
		              				angular.forEach(parentItem.children,function(childItem){
		              					angular.forEach(copyLeafNodes,function(leafItem){
		              						if(leafItem == childItem.id){
		              							childItem.checked = true ;
			              						parentChecked.push(childItem.id);
		              						}
		              					})
		              				})
		              			})
		              		}
		              		//当isDisabled为true时,初始化禁用的参数
		              		if($scope.isDisabled){
		              			initChkDisabledNode($scope.zNodes,$scope.leafNodes);
		              		}
		              		 initNodes(parentChecked);
		              		$.fn.zTree.init($("#treeDemo"), setting, $scope.zNodes);
		              		cahceUserCheckedNode();
		              	});
		        	}
		        	findJiupiCityByCityMode();
	        	
		        	//切换模式触发事件
		        	$scope.changeMode = function(){
		        		copyLeafNodes = zTreeService.getJiupiCityIdList();
		        		findJiupiCityByCityMode();
		        	}
		        	
		        	//全选or取消全选
		        	$scope.checkAll = function(checked){
		        		angular.forEach($scope.zNodes,function(parentItem){
              				angular.forEach(parentItem.children,function(childItem){
              					if(!parentItem.chkDisabled){
              						parentItem.open = checked ;
              						parentItem.checked = checked ;
              					}
              					if(!childItem.chkDisabled){
              						childItem.checked = checked ;
              					}
              				})
              			})
              			$.fn.zTree.init($("#treeDemo"), setting, $scope.zNodes);
		        		cahceUserCheckedNode();
		        	}
	        	
		        	//初始化选中的值（一般用于编辑）
	                function initNodes(nodeList){
	                	//全选默认为true ;
	                	$scope.checked = true ;
	                	if(nodeList.length){
	                		angular.forEach($scope.zNodes,function(parentItem){
		                		angular.forEach(parentItem.children,function(childItem){
		                			angular.forEach(nodeList,function(son){
		                				//初始化勾选已存在的值
			                    		if(son == childItem.id){
			                    			parentItem.open = true ;
			                    			parentItem.checked = true ;
			                    			childItem.checked = true;
			                    		}
			                    	});
			                	})
		                	})
	                	}
	                	//遍历所有的节点，看是否有没有勾选中的,若有,则取消全选
	                	angular.forEach($scope.zNodes,function(parentItem){
	                		angular.forEach(parentItem.children,function(childItem){
	                			if(!childItem.checked){
	                				$scope.checked = false ;
	                			}
		                	})
	                	})
	                }
	                
	                //初始化禁用的节点
	                function initChkDisabledNode(currentTreeNode,receiveLeafNodes){
	                	if(receiveLeafNodes && receiveLeafNodes.length>0 ){
	              			angular.forEach(currentTreeNode,function(parentItem){
	              				angular.forEach(parentItem.children,function(childItem){
	              					angular.forEach(receiveLeafNodes,function(leafItem){
	              						if(leafItem == childItem.id){
	              							parentItem.open = true ;
			                    			parentItem.checked = true ;
			                    			childItem.checked = true;
	              							parentItem.chkDisabled = true ;
		                    				childItem.chkDisabled = true ;
	              						}
	              					})
	              				})
	              			})
	              		}
	                }
	                
	                function cahceUserCheckedNode(){
	                    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
	                    //获取当前树对象,全部勾选的节点
	                    var checkedNodeList = treeObj.getCheckedNodes(true);
	                    //获取当前树对象,全部未勾选的节点
	                    var notCheckedNodeList = treeObj.getCheckedNodes(false);
	                    zTreeService.cahceUserCheckedNode(checkedNodeList,notCheckedNodeList);
	                    //选中后触发事件
                        $scope.cityClickFun();
	                }
	                
	                function nodeHighlight(nodeIndex){
	                    $.fn.zTree.getZTreeObj("treeDemo").selectNode($scope.nodeList[nodeIndex]);
	                    $("#dicKey").focus();
	                }

	                var currentFocusNodeIndex = 0;
	                function getFontCss(treeId,treeNode) {
	                    return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold",} : {color:"#333", "font-weight":"normal"};
	                }

	                var treeId;
	                $scope.nodeList = [];//高亮的Node(节点)
	                $scope.changeArea = function(id,key){
	                    treeId = id;
	                    updateNodes(false);
	                    if($scope.inputVal){
	                        var treeObj = $.fn.zTree.getZTreeObj(treeId);
	                        $scope.nodeList = treeObj.getNodesByParamFuzzy(key, $scope.inputVal);
	                        if($scope.nodeList && $scope.nodeList.length>0){
	                            updateNodes(true);
	                        }
	                    }
	                    nodeHighlight(currentFocusNodeIndex);
	                };
	                function updateNodes(highlight) {
	                    var treeObj = $.fn.zTree.getZTreeObj(treeId);
	                    for( var i=0; i<$scope.nodeList.length;  i++) {
	                        $scope.nodeList[i].highlight = highlight;
	                        treeObj.updateNode($scope.nodeList[i]);
	                        if(highlight){
	                            extendNode(treeObj,$scope.nodeList[i]);
	                        }
	                    }

	                }

	                /**
	                 * 展开节点
	                 */
	                function extendNode(treeObj,node){
	                    if(node){
	                        if( node.level !== 0){//不是根节点
	                            //展开父节点
	                            treeObj.expandNode(node.getParentNode (),true,false,true,false);
	                        }
	                        // 递归
	                        extendNode(node.getParentNode());
	                    }
	                }

	                var setting = {
	                    data: {
	                        simpleData: {
	                            enable: false,
	                        }
	                    },
	                    check:{
	                        enable: true,
	                        chkStyle: "checkbox",
	                        chkboxType: { "Y": "ps", "N": "ps" }
	                    },
	                    callback:{
	                        onCheck : cahceUserCheckedNode
	                    },
	                    view :{
	                        showIcon: false,
	                        expandSpeed: "fast",
	                        fontCss: getFontCss
	                    }
	                };

	                function onListenEntry(){
	                    $scope.changeArea('treeDemo','name');
	                    if(currentFocusNodeIndex >= $scope.nodeList.length - 1){
	                        currentFocusNodeIndex = -1;
	                    }
	                    nodeHighlight(++currentFocusNodeIndex);
	                }

	                $scope.inputVal = "";//输入框
	                $('#dicKey').keydown(function(e){
	                    if(e.keyCode==13){
	                        onListenEntry();
	                    }
	                });
	                
	                //搜索关键字
	                $scope.searchKeyWord = function(){
	                	onListenEntry();
	                }
	        }]
	    }
	}]);
}());
