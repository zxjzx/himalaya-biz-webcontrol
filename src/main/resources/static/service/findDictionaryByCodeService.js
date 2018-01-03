(function(){
	'use strict' ;
	
	var findDictionaryByCodeModule = angular.module('findDictionaryByCodeModule' , []);
	findDictionaryByCodeModule.service('findDictionaryByCodeService', ['$http','$q',function($http,$q) {
		   
		//获取字典
	   this.getDictionaryTypeDetailByCode = function(code){
		   return $q(function (resolve, reject) {
			   
	           $http({
	               method: 'get',
	               url: 'bizwebcontrol/dictionary/getDictionaryType/' + code,
	           }).success(function (data) {
	               resolve(data)
	           }).error(function (data) {
	               reject(data.message);
	           });
	       });
	   };

        var self = this;
        this.dataService = {
            // 存储所以查询页的查询条件数据，手动刷新页面后数据会清空。
            codeQueryList:[],
            codeResultList:{}
        };

	   this.storeDictionaryDataList = function (dictionaryQueryDataList) {

           var d = $q.defer();

	   		var filterDictionaryQueryDataList = [];
           dictionaryQueryDataList.forEach(function (item) {
               if(self.dataService.codeQueryList.indexOf(item) == -1){
                   filterDictionaryQueryDataList.push(item);
                   self.dataService.codeQueryList.push(item);
               }
           });
           if(filterDictionaryQueryDataList.length > 0){
               $http.post('common/queryDictionaryTypeMapByCodeList',filterDictionaryQueryDataList).success(function (response) {
                   for(var i in response.data){
                       var itemName = i + "List";
                       self.dataService.codeResultList[itemName] = response.data[i];

                   }
                   //根据传入的参数返回相关list
                   var returnDataList = {};
                   dictionaryQueryDataList.forEach(function (item) {
					   var itemName = item+"List";
					   if(self.dataService.codeResultList[itemName]){
                           returnDataList[itemName]=self.dataService.codeResultList[itemName].items;
					   }
                   })
                   d.resolve(returnDataList);
               }).error(function(){
                   d.reject("error");
               });
               return d.promise;
		   }else{
               //当已经存在时走这个
               var returnDataList = {};
               dictionaryQueryDataList.forEach(function (item) {
                   var itemName = item+"List";
                   if(self.dataService.codeResultList[itemName]){
                       returnDataList[itemName]=self.dataService.codeResultList[itemName].items;
                   }
               });
               d.resolve(returnDataList);
               return d.promise;
           }
       };
	}]);
}());
