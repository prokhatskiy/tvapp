'use strict';

tvapp.controller('adminEditCtrl', function($scope, $routeParams, $http, SERVICES, $timeout, $location, ROUTES) {
    var defaults,
        slideData,
        employeesTemplate = {'name' : '', date: ''};

    $scope.templates = {
        'Welcome': '/templates/slideEditor/welcome.html',
        'Success': '/templates/slideEditor/success.html',
        'Birthdays': '/templates/slideEditor/birthdays.html',
        'Video': '/templates/slideEditor/video.html'
    };

    $scope.slideTypes = _.keys($scope.templates);

    defaults = {
        slideType: $scope.slideTypes[0],
        employees: [employeesTemplate]
    };

    slideData = angular.copy(defaults);
    $scope.currentData = angular.copy(defaults);
    $scope.isNewItem = true;
    $scope.isChanged = false;
    $scope.imageSrc = '';
    $scope.showMessage = false;
    $scope.showError = false;

    $scope.$watchCollection('currentData', function() {
        $scope.isChanged = !angular.equals($scope.currentData, slideData);
    });

    //extend model
    if ($routeParams.id) {
        $http.get(SERVICES.GET_SLIDE + '/' + $routeParams.id)
            .success(function(data) {
                slideData = angular.extend(slideData, data);
                $scope.currentData = angular.copy(slideData);
                $scope.isNewItem = false;
            })
            .error(function(data, status) {
                switch (status) {
                    case 401:
                        $location.path(ROUTES.LOGIN_ROOT);
                        break;
                    default:
                        showError('Slide cannot be loaded.' + 'Status code: ' + status);
                }
            });
    } else {
        $http.get(SERVICES.CHECK_ACCESS)
            .error(function(data, status) {
                switch (status) {
                    case 401:
                        $location.path(ROUTES.LOGIN_ROOT);
                        break;
                    default:
                        showError('Cannot check access.' + 'Status code: ' + status);
                }
            });
    }

    $scope.uploadPhoto = function uploadPhoto() {
        console.log($scope.imageSrc);
    };

    $scope.save = function save() {
        $http.post(SERVICES.POST_SLIDE, $scope.currentData)
            .success(function() {
                showMessage('This slide is saved.');
            })
            .error(function(data, status) {
                switch (status) {
                    case 401:
                        $location.path(ROUTES.LOGIN_ROOT);
                        break;
                    default:
                        showError('This slide is not saved. Please, see console for details. Status code: ' + status);
                }
            });
    };

    $scope.revert = function revert() {
        $scope.currentData = angular.copy(slideData);
        $scope.isChanged = false;
    };

    $scope.addEmployee = function addEmployee() {
        $scope.currentData.employees.push(employeesTemplate);
    };

    var showMessage = function showMessage(message) {
        $scope.showMessage = message;
        $timeout(function() {
            $scope.showMessage = false;
        }, 5000);
    };

    var showError = function showError(error) {
        $scope.showError = error;
        $timeout(function() {
            $scope.showError = false;
        }, 5000);
    };
});
