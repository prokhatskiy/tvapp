'use strict';

var tvapp = angular.module('tvapp', ['ui.sortable', 'ngRoute', 'ui.date', 'ngCookies']);

tvapp
    .constant('APP_CONST', (function() {
        return {
            SLIDESHOW_URL: '/slideshow'
        }
    }()))
    .constant('ROUTES', (function() {
       return {
           ADMIN_ROOT: '/',
           LOGIN_ROOT: '/login',
           ADMIN_EDIT: '/edit',
           ADMIN_ADD: '/add',
           ADMIN_TIMELINES: '/timeline'
       }
    }()))
    .constant('SERVICES', (function() {
        return {
            CHECK_ACCESS: '/services/access',
            ADMIN_SLIDES: '/services/slides',
            GET_TIMELINE: '/services/slides',
            POST_TIMELINE: '/services/slides',
            LOGIN: '/services/login',
            LOGOUT: '/services/logout',
            GET_SLIDE: '/services/slide',
            POST_SLIDE: '/services/slide/post',
            UPLOAD_IMG: '/fakeData/src.json'
        }
    }()))
    .run(["$rootScope", "APP_CONST", "ROUTES", function($rootScope, APP_CONST, ROUTES) {
        $rootScope.ROUTES = ROUTES;
        $rootScope.APP_CONST = APP_CONST;
    }])
    .config(["$routeProvider", "ROUTES", function($routeProvider, ROUTES) {
        var partialsPath = 'partials/';

        $routeProvider
            .when(ROUTES.LOGIN_ROOT, {templateUrl: partialsPath + 'login.html', controller: 'loginCtrl'})
            .when(ROUTES.ADMIN_ROOT, {templateUrl: partialsPath + 'adminSlideList.html', controller: 'adminSlidesCtrl'})
            .when(ROUTES.ADMIN_EDIT + '/:id', {templateUrl: partialsPath + 'adminSlideEdit.html', controller: 'adminEditCtrl'})
            .when(ROUTES.ADMIN_ADD, {templateUrl: partialsPath + 'adminSlideEdit.html', controller: 'adminEditCtrl'})
            .when(ROUTES.ADMIN_TIMELINES, {templateUrl: partialsPath + 'adminTimeline.html', controller: 'adminTimelineCtrl'})
            .otherwise({redirectTo: ROUTES.ADMIN_ROOT});
    }]);
'use strict';

tvapp.controller('adminEditCtrl', ["$scope", "$routeParams", "$http", "SERVICES", "$timeout", "$location", "ROUTES", function($scope, $routeParams, $http, SERVICES, $timeout, $location, ROUTES) {
    //config
    var defaults = {
        slideType: 'Welcome',
        slideTypes: ['Welcome', 'Success', 'Birthdays', 'Video'],
        employees: [{'name' : '', date: ''}]
    };

    var slideData = angular.copy(defaults);
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
    if($routeParams.id) {
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
    }
    else {
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
        $scope.currentData.employees.push({name : '', date: ''});
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
}]);

'use strict';

tvapp.controller('adminSlidesCtrl', ["$rootScope", "$scope", "$http", "SERVICES", "$location", "ROUTES", function($rootScope, $scope, $http, SERVICES, $location, ROUTES) {
    $scope.gridType = {
        value: window.localStorage.getItem('gridType') || 'Table',
        values: ['Table', 'Grid']
    };

    $scope.$watchCollection('gridType', function() {
        window.localStorage.setItem('gridType', $scope.gridType.value)
    });

    $http.get(SERVICES.ADMIN_SLIDES).
        success(function(data) {
            $scope.slides = data;

            $scope.slides.sort(function(a, b) {
                return b.generalOrder - a.generalOrder;
            });
        }).
        error(function(data, status) {
            switch (status) {
                case 401:
                    $location.path(ROUTES.LOGIN_ROOT);
                    break;
                default:
                    console.log('adminSlidesCtrl - get Slides FAIL - status: ' + status + ' response: ' + data);
            }
        });
}]);

'use strict';

tvapp.controller('adminTimelineCtrl', ["$rootScope", "$scope", "$http", "$location", "SERVICES", "ROUTES", "$timeout", "$filter", function($rootScope, $scope, $http, $location, SERVICES, ROUTES, $timeout, $filter) {
    var slides = [];

    $scope.slides = {
        active: [],
        noActive: []
    };

    $scope.isChanged = false;

    $scope.timelineSortOpitons = {
        itemMoved: function () {
            $scope.isChanged = true;
        },
        orderChanged: function () {
            $scope.isChanged = true;
        },
        containment: '#board'
    };

    $http.get(SERVICES.GET_TIMELINE)
        .success(function(data) {
            slides = angular.copy(data);
            populateColumns(slides);
        })
        .error(function(data, status) {
            switch (status) {
                case 401:
                    $location.path(ROUTES.LOGIN_ROOT);
                    break;
                default:
                    showError('adminTimelineCtrl - get Slides FAIL - status: ' + status + ' response: ' + data  + '.');
            }
        });

    $scope.revert = function() {
        populateColumns(slides);
        $scope.isChanged = false;
    };

    $scope.save = function() {
        $http.post(SERVICES.POST_TIMELINE, writeData($scope.slides.active, $scope.slides.noActive, slides))
            .success(function() {
                showMessage('Timeline is saved.');
            })
            .error(function(data, status) {
                switch (status) {
                    case 401:
                        $location.path(ROUTES.LOGIN_ROOT);
                        break;
                    default:
                        showError('Timeline is not saved. Please, see console for details. Status code: ' + status + '.');
                }
            });
    };

    var writeData = function(activeSlides, noActiveSlides, allSlides) {
        allSlides.forEach(function(slide) {
            var slideData =  _.where(activeSlides, { _id: slide._id});
            var noActiveSlideData = _.where(noActiveSlides, { _id: slide._id});

            if(slideData.length > 0) {
                slide.timelineOrder = _.indexOf(activeSlides, slideData[0]);
                slide.isActive = true;
            }
            else {
                slide.generalOrder = _.indexOf(noActiveSlides, noActiveSlideData[0]);
                slide.isActive = false;
            }
        });

        return allSlides;
    };

    var populateColumns = function populateColumns(data) {
        $scope.slides = {
            active: [],
            noActive: []
        };

        data.forEach(function(slide) {
            if(slide.isActive) {
                $scope.slides.active.push(angular.copy(slide));
            }
            else {
                $scope.slides.noActive.push(angular.copy(slide));
            }
        });

        $scope.slides.active.sort(function(a, b) {
            return a.timelineOrder - b.timelineOrder;
        });

        $scope.slides.noActive.sort(function(a, b) {
            return a.generalOrder - b.generalOrder;
        });
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
}]);
'use strict';

tvapp.controller('loginCtrl', ["$rootScope", "$scope", "$http", "$cookies", "$location", "SERVICES", "ROUTES", function($rootScope, $scope, $http, $cookies, $location, SERVICES, ROUTES) {
    $cookies.token = undefined;
    $scope.formIsHidden = true;
    $rootScope.isLoginPage = true;

    $http.post(SERVICES.LOGOUT)
        .success(function() {
            $scope.formIsHidden = false;
        })
        .error(function() {
            $location.path(ROUTES.ADMIN_ROOT);
        });

    $scope.login = function() {
        $http.post(SERVICES.LOGIN, {
                username: $scope.username,
                password: $scope.password
            })
            .success(function(data) {
                $cookies.token = data;
                $rootScope.isLoginPage = false;
                $location.path(ROUTES.ADMIN_ROOT);
            })
            .error(function(data) {
                $scope.error = data;
            });
    }
}]);