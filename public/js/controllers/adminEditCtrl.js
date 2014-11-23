'use strict';

tvapp.controller('adminEditCtrl', function($scope, $routeParams, $http, SERVICES, $timeout) {
    //config
    var defaults = {
        slideType: 'Welcome',
        slideTypes: ['Welcome', 'Success', 'Birthdays', 'Video'],
        employeeNames: [{'name' : '', date: ''}]
    };

    var slideData = angular.copy(defaults);
    $scope.currentData = angular.copy(defaults);
    $scope.isNewItem = true;
    $scope.isChanged = false;
    $scope.imageSrc = '';
    $scope.showMessage = false;
    $scope.showError = false;

    $scope.$watchCollection('currentData', function() {
        if(angular.equals($scope.currentData, slideData)) {
            $scope.isChanged = false;
        }
        else {
            $scope.isChanged = true;
        }
    });

    //extend model
    if($routeParams.id) {
        $http.get(SERVICES.GET_SLIDE).
            success(function(data) {
                slideData = angular.extend(slideData, data);
                $scope.currentData = angular.copy(slideData);
                $scope.isNewItem = false;
            })
            .error(function() {
                showError('Fail!!!');
            });
    }

    $scope.uploadPhoto = function uploadPhoto() {
        console.log($scope.imageSrc);
    };

    $scope.save = function save() {
        $http.post(SERVICES.POST_SLIDE, prepareData($scope.currentData))
            .success(function() {
                showMessage('Saved!!!');
            })
            .error(function() {
                showError('Fail!!!');
            });
    };

    $scope.revert = function revert() {
        $scope.currentData = angular.copy(slideData);
        $scope.isChanged = false;
    };

    $scope.addEmployee = function addEmployee() {
        $scope.currentData.employeeNames.push({'name' : '', date: ''});
    };

    var prepareData = function prepareData(data) {
        return data;
    };

    var showMessage = function showMessage(message) {
        $scope.showMessage = message;
        setTimeout(function() {
            $scope.showMessage = false;
        }, 5000);
    };

    var showError = function showMessage(error) {
        $scope.showError = error;
        $timeout(function() {
            $scope.showError = false;
        }, 5000);
    };
});
