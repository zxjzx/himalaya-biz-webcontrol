(function(){
	'use strict' ;
	
	var findDictionaryByCodeModule = angular.module('findDictionaryByCodeModule' , []);
	findDictionaryByCodeModule.service('findDictionaryByCodeService', ['$http','$q',function($http,$q) {
		   
		//获取字典
	   this.getDictionaryTypeDetailByCode = function(code){
		   return $q(function (resolve, reject) {
			   
	           $http({
	               method: 'get',
	               url: '/bizwebcontrol/dictionary/getDictionaryType/' + code,
	           }).success(function (data) {
	               resolve(data)
	           }).error(function (data) {
	               reject(data.message);
	           });
	       });
	   }
	}]);
}());
