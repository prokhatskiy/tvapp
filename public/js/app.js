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
            POST_SLIDE: '/services/slide',
            DELETE_SLIDE: '/services/slide',
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
}]);

'use strict';

tvapp.controller('adminSlidesCtrl', ["$rootScope", "$scope", "$http", "SERVICES", "$location", "ROUTES", function($rootScope, $scope, $http, SERVICES, $location, ROUTES) {
    $scope.templates = [
        { name: "Table", url: "/templates/slides/table.html"},
        { name: "Grid", url: "/templates/slides/grid.html" }
    ];

    $scope.selectedTemplateUrl = window.localStorage.getItem('gridTemplate') || $scope.templates[0].url;

    $scope.setTemplate = function setTemplate(template) {
        window.localStorage.setItem('gridTemplate', template.url);
        $scope.selectedTemplateUrl = template.url;
    };

    $scope.deleteSlide = function deleteSlide(id) {
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

    var update = function update() {
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

    var populateSlides = function populateSlides(data) {
        $scope.slides = data;

        $scope.slides.sort(function(a, b) {
            return b.generalOrder - a.generalOrder;
        });
    };

    update();
}]);

'use strict';

tvapp.controller('adminTimelineCtrl', ["$rootScope", "$scope", "$http", "$location", "SERVICES", "ROUTES", function($rootScope, $scope, $http, $location, SERVICES, ROUTES) {
    var slides = [];

    $scope.slides = {
        active: [],
        noActive: []
    };

    $scope.isChanged = true;

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
                    $scope.message = {
                        type: 'error',
                        text: 'adminTimelineCtrl - get Slides FAIL - status: ' + status + ' response: ' + data  + '.',
                        hide: 5000
                    };
            }
        });

    $scope.revert = function revert() {
        populateColumns(slides);
        $scope.isChanged = false;
    };

    $scope.save = function save() {
        $http.post(SERVICES.POST_TIMELINE, writeData($scope.slides.active, $scope.slides.noActive, slides))
            .success(function() {
                $scope.message = {
                    type: 'message',
                    text: 'Timeline is saved.',
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
                            text: 'Timeline is not saved. Please, see console for details. Status code: ' + status + '.',
                            hide: 5000
                        };
                }
            });
    };

    var writeData = function writeData(activeSlides, noActiveSlides, allSlides) {
        allSlides.forEach(function(slide) {
            var slideData =  _.where(activeSlides, { _id: slide._id});
            var noActiveSlideData = _.where(noActiveSlides, { _id: slide._id});

            if(slideData.length > 0) {
                slide.timelineOrder = _.indexOf(activeSlides, slideData[0]);
                slide.isActive = true;
                slide.duration = Number(activeSlides[slide.timelineOrder].duration);
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

    $scope.login = function login() {
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
                $scope.message = {
                    type: 'error',
                    text: data
                };
            });
    }
}]);
tvapp.directive('uiMessages', ["$timeout", function($timeout) {
    return {
        templateUrl: '/templates/global/messages.html',
        link: function(scope) {
            scope.$watch('message', function() {
                if (!Boolean(scope.message)) {
                    return false;
                }

                scope.message.show = true;

                if (angular.isNumber(scope.message.hide) && scope.message.hide > 0) {
                    $timeout(function() {
                        scope.message.show = false;
                    }, scope.message.hide);
                }
            });
        }
    };
}]);