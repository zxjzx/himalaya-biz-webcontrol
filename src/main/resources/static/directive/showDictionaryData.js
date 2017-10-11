(function () {
    'use strict';
   var showDictionaryDataModule = angular.module('showDictionaryDataModule',[]);
    showDictionaryDataModule.directive('showDictionaryData',[function () {
        return{
            restrict:'E',
            scope:{
                typecode:'@',
                judgetype:'='
            },
            template:'<span ng-repeat="dictionaryItem in dataShowList" ng-class="setStyle(judgetype)"\n' +
            '      ng-if="dictionaryItem.code==judgetype">{{dictionaryItem.name}}</span>',
            controller:['$scope','$http','findDictionaryByCodeService',function ($scope,$http,findDictionaryByCodeService) {
                findDictionaryByCodeService.getDictionaryTypeDetailByCode($scope.typecode).then(function (data) {
                    if(data.result === 'success'){
                        $scope.dataShowList = data.data.items;
                    }
                })
                $scope.setStyle = function (colortype) {
                    if(colortype==0){
                        return 'label label-sm label-success';
                    }else if(colortype==1){
                        return 'label label-sm label-danger';
                    }else if(colortype==2){
                        return 'label label-sm label-warning';
                    }else if(colortype==3){
                        return 'label label-sm label-primary';
                    }else if(colortype==4){
                        return 'label label-sm label-info';
                    }else if(colortype==5){
                        return 'label label-sm label-success';
                    }else if(colortype==6){
                        return 'label label-sm label-danger';
                    }
                }
            }]
        }
    }])
})()