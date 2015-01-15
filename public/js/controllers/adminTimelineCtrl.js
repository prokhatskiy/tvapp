'use strict';

tvapp.controller('adminTimelineCtrl', function($rootScope, $scope, $http, $location, SERVICES, ROUTES, $timeout, $filter) {
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
});