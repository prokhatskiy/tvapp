'use strict';

tvapp.controller('adminEditCtrl', function($scope, $routeParams, $http, SERVICES) {
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
        $http.get(SERVICES.SLIDE).
            success(function(data) {
                slideData = angular.extend(slideData, data);
                $scope.currentData = angular.copy(slideData);
                $scope.isNewItem = false;
            })
            .error(function() {
                console.log('fail');
            });
    }

    $scope.save = function save() {
        console.log($scope.currentData);
    };

    $scope.revert = function revert() {
        $scope.currentData = angular.copy(slideData);
        $scope.isChanged = false;
    };

    $scope.addEmployee = function addEmployee() {
        $scope.currentData.employeeNames.push({'name' : '', date: ''});
    };
});
