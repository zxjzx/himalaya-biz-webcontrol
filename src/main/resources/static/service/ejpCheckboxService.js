/**
 * 多选框checkbox服务Api
 * ejpCheckboxService
 */
(function(){
	'use strict' ;
	 angular.module('ejpCheckboxService' , [])
	 .service('ejpCheckbox',['$scope','$http',
	       function($scope,$http){
		 
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
	 }])
}())