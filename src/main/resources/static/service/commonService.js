/**
 * 通用服务 
 */
(function(){
	'use strict' ;
	
	angular.module("commonServiceModule" ,[])
	
	/**
	 * 数组比较服务
	 * beforeData : 表示改变之前的数据
	 * afterData : 表示改变之后的数据
	 * field　：　表示比较的字段,
	 * return changedDataList (返回改变之后的数据集合) 
	 */
	.service('dataCompareService',['$cacheFactory',function($cacheFactory){
		
		this.arrayCompare = function(beforeData,afterData,field){
			var changedDataList = [] ;
			angular.forEach(beforeData,function(beforeItem){
				angular.forEach(afterData,function(afterItem){
					if((beforeItem.id == afterItem.id) && beforeItem[field] != afterItem[field] ){
						changedDataList.push({
							'id' : afterItem.id ,
							'sequence' :afterItem.sequence
						});
					}
				})
			})
			return changedDataList 
		}
	}])
}())