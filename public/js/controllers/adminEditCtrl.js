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
                        $scope.message = {
                            type: 'error',
                            text: 'Slide cannot be loaded. Status code: ' + status,
                            hide: 5000
                        };
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
                        $scope.message = {
                            type: 'error',
                            text: 'Cannot check access. Status code: ' + status,
                            hide: 5000
                        };
                }
            });
    }

    $scope.uploadPhoto = function uploadPhoto() {
        console.log($scope.imageSrc);
    };

    $scope.save = function save() {
        $http.post(SERVICES.POST_SLIDE, $scope.currentData)
            .success(function() {
                $scope.message = {
                    type: 'message',
                    text: 'This slide is saved.',
                    hide: 5000
                };
            })
            .error(function(data, status) {
                switch (status) {
                    case 401:
                        $location.path(ROUTES.LOGIN_ROOT);
                        break;
                    default:
                        $scope.message = {
                            type: 'error',
                            text: 'This slide is not saved. Please, see console for details. Status code: ' + status,
                            hide: 5000
                        };
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
});
