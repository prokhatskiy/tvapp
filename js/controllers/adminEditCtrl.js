'use strict';

tvapp.controller('adminEditCtrl', function($scope, $routeParams, $http, SERVICES) {
    //config
    var slideData = {
        slideType: 'Welcome',
        slideTypes: ['Welcome', 'Success', 'Birthdays', 'Video'],
        videoService: 'YouTube',
        videoServices: ['YouTube', 'Vimeo'],
        employeeNames: [{'name' : '', date: ''}]
    };

    $scope.isChanged = false;

    //extend model
    if($routeParams.id) {
        $http.get(SERVICES.SLIDE).
            success(function(data) {
                slideData = angular.extend(slideData, data);
                $scope.currentData = angular.copy(slideData);
            }).
            error(function() {
                console.log('fail');
            });
    }
    else {
        $scope.isNewItem = true;
        $scope.currentData = angular.copy(slideData);
    }

    $scope.save = function save() {
        console.log($scope.currentData);
    };

    $scope.revert = function revert() {
        $scope.currentData = angular.copy(slideData);
    };

    $scope.addEmployee = function addEmployee() {
        $scope.currentData.employeeNames.push({'name' : '', date: ''});
    };
});
