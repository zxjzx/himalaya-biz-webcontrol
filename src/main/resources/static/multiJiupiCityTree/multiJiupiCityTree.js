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
	        },
	        templateUrl:  '../static/multiJiupiCityTree/multiJiupiCityTree.html',
	        controller: ['$rootScope','$scope','$http','jiupiCityTreeService','findDictionaryByCodeService','zTreeService',
	                     function ($rootScope,$scope,$http,jiupiCityTreeService,findDictionaryByCodeService,zTreeService) {
	        	
		        	$scope.vo = {} ;
		        	
		        	//获取运营模式字典
		        	findDictionaryByCodeService.getDictionaryTypeDetailByCode("cityModel").then(function(data){
		        		if(data.result==='success'){
		        			$scope.cityModeList = data.data.items ;
		        			angular.forEach($scope.cityModeList,function(item,index){
		        				//删除轻加盟(3为轻加盟)
		        				if(item.code=='3'){
		        					$scope.cityModeList.splice(index,1);
		        				}
		        			});
		        			$scope.cityModeList.push({'code' : -1,'name': '所有城市'})
		        		}
		        	})
		        	//默认运营模式为自营
		        	$scope.vo.cityMode = 1 ;
	        	
		            //已知区域Id，获取街道数据
		        	var findAllJiupiCity = function(){
		        		jiupiCityTreeService.findJiupiCityListByCityMode($scope.vo.cityMode)
		              	  .then(function(result){
		              		$scope.zNodes = jiupiCityTreeService.convertModel(result.list);
		              		var parentChecked = [];
		              		if($scope.leafNodes && $scope.leafNodes.length>0 ){
		              			angular.forEach($scope.zNodes,function(parentItem){
		              				angular.forEach(parentItem.children,function(childItem){
		              					angular.forEach($scope.leafNodes,function(leafItem){
		              						if(leafItem == childItem.id){
		              							childItem.checked = true ;
			              						parentChecked.push(childItem.id);
		              						}
		              					})
		              				})
		              			})
		              		}
		              		 initNodes(parentChecked);
		              		$.fn.zTree.init($("#treeDemo"), setting, $scope.zNodes);
		              		showNode();
		              	});
		        	}
		        	findAllJiupiCity();
	        	
		        	//切换模式触发事件
		        	$scope.changeMode = function(){
		        		findAllJiupiCity();
		        	}
	        	
		        	//初始化选中的值（一般用于编辑）
	                function initNodes(nodeList){
	                	angular.forEach($scope.zNodes,function(parentItem){
	                		angular.forEach(parentItem.children,function(childItem){
	                			angular.forEach(nodeList,function(son){
		                    		if(son == childItem.id){
		                    			parentItem.open = true ;
		                    			parentItem.checked = true ;
		                    			childItem.checked = true;
		                    		}
		                    	});
		                	})
	                	})
	                }
	                
	                function showNode(){
	                    $scope.leafNodes = [];//清空
	                    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
	                    var nodes = treeObj.getCheckedNodes(true);
	                    zTreeService.setCheckedNodes(treeObj,nodes);
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
	                        onClick : showNode ,
	                        onCheck : showNode
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
	        }]
	    }
	}]);
}());
