'use strict';

tvapp.controller('adminTimelineCtrl', function($rootScope, $scope, $http, $location, SERVICES, ROUTES) {
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
            } else {
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
            } else {
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
});