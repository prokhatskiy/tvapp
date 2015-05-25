'use strict';

tvapp.controller('adminEditCtrl', function($scope, $routeParams, $http, SERVICES, $timeout, $location, ROUTES, $rootScope) {
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

    $scope.$watchCollection('currentData', function() {
        $scope.isChanged = !angular.equals($scope.currentData, slideData);
    });

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

    $scope.save = function save(stayOnPage) {
        console.log($scope.currentData);
        $http.post(SERVICES.POST_SLIDE, $scope.currentData)
            .success(function() {
                if (stayOnPage) return;

                $location.path(ROUTES.ADMIN_ROOT);
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

    if (Boolean($routeParams.id)) {
        $rootScope.$on('uiPhoto:deleted', function() {
            $scope.currentData.imageSrc = '';
            $scope.save(true);
        });
        $rootScope.$on('uiPhoto:uploaded', function(event, newImageName) {
            $scope.currentData.imageSrc = newImageName;
            $scope.save(true);
        });
    }
});
