'use strict';

tvapp.controller('adminSlidesCtrl', function($rootScope, $scope, $http, SERVICES, $location, ROUTES) {
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
});
