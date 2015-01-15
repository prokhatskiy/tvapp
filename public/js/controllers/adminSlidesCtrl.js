'use strict';

tvapp.controller('adminSlidesCtrl', function($rootScope, $scope, $http, SERVICES, $location, ROUTES) {
    $scope.gridType = {
        value: window.localStorage.getItem('gridType') || 'Table',
        values: ['Table', 'Grid']
    };

    $scope.$watchCollection('gridType', function() {
        window.localStorage.setItem('gridType', $scope.gridType.value)
    });

    $scope.deleteSlide = function(id) {
        if(!confirm('Are you sure?')) return;

        $http.delete(SERVICES.DELETE_SLIDE + '/' + id)
            .success(function() {
                update();
            })
            .error(function(data, status) {
                switch (status) {
                    case 401:
                        $location.path(ROUTES.LOGIN_ROOT);
                        break;
                    default:
                        console.log('adminSlidesCtrl - get Slides FAIL - status: ' + status + ' response: ' + data);
                }
            });
    };

    var update = function() {
        $http.get(SERVICES.ADMIN_SLIDES)
            .success(function(data) {
                populateSlides(data);
            })
            .error(function(data, status) {
                switch (status) {
                    case 401:
                        $location.path(ROUTES.LOGIN_ROOT);
                        break;
                    default:
                        console.log('adminSlidesCtrl - get Slides FAIL - status: ' + status + ' response: ' + data);
                }
            });
    };

    var populateSlides = function(data) {
        $scope.slides = data;

        $scope.slides.sort(function(a, b) {
            return b.generalOrder - a.generalOrder;
        });
    };

    update();
});
