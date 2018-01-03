(function(){
	'use strict' ;
	
	var findDictionaryByCodeModule = angular.module('findDictionaryByCodeModule' , []);
	findDictionaryByCodeModule.service('findDictionaryByCodeService', ['$http','$q',function($http,$q) {
		   
		//获取字典
	   this.getDictionaryTypeDetailByCode = function(code){
		   return $q(function (resolve, reject) {
			   
	           $http({
	               method: 'get',
	               url: 'bizwebcontrol/dictionary/getDictionaryType/' + code
	           }).success(function (data) {
	               resolve(data)
	           }).error(function (data) {
	               reject(data.message);
	           });
	       });
	   };

	   //op中有太多调用字典查询的接口，此是为了减少字典查询的http请求，提高性能
        // 用于存储字典查询的结果，手动刷新页面后数据会清空。
        this.storeDictionaryDataService = {
            codeQueryList:[],
            codeResultList:{}
        };

        var self = this;

	   this.storeDictionaryDataList = function (dictionaryQueryDataList) {

           var d = $q.defer();

	   		var filterDictionaryQueryDataList = [];
           dictionaryQueryDataList.forEach(function (item) {
               if(self.storeDictionaryDataService.codeQueryList.indexOf(item) == -1){
                   filterDictionaryQueryDataList.push(item);
                   self.storeDictionaryDataService.codeQueryList.push(item);
               }
           });

           //处理返回的值
           function resolveReturnDataList(codeResultList) {
               //根据传入的参数返回相关list
               var returnDataList = {};
               dictionaryQueryDataList.forEach(function (item) {
                   var itemName = item+"List";
                   if(codeResultList[itemName]){
                       returnDataList[itemName]=codeResultList[itemName].items;
                   }
               })
               d.resolve(returnDataList);
           }

           if(filterDictionaryQueryDataList.length > 0){
               $http.post('bizwebcontrol/dictionary/queryDictionaryTypeMapByCodeList',filterDictionaryQueryDataList).success(function (response) {
                   for(var i in response.data){
                       var itemName = i + "List";
                       self.storeDictionaryDataService.codeResultList[itemName] = response.data[i];

                   }
                   resolveReturnDataList(self.storeDictionaryDataService.codeResultList)
               }).error(function(){
                   d.reject("error");
               });
               return d.promise;
		   }else{
               //当字典已经存在时返回这个
               resolveReturnDataList(self.storeDictionaryDataService.codeResultList);
               return d.promise;
           }
       };
	}]);
}());
