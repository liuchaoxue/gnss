var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize"
]);

MetronicApp.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({});
}]);

MetronicApp.config(['$controllerProvider', function ($controllerProvider) {
    $controllerProvider.allowGlobals();
}]);


MetronicApp.factory('settings', ['$rootScope', function ($rootScope) {
    var settings = {
        layout: {
            pageSidebarClosed: false,
            pageContentWhite: true,
            pageBodySolid: false,
            pageAutoScrollOnLoad: 1000
        },
        assetsPath: 'assets',
        globalPath: 'assets/global',
        layoutPath: 'assets/layouts/layout2',
    };

    $rootScope.settings = settings;

    return settings;
}]);

MetronicApp.controller('AppController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $scope.$on('to-parent', function (event, data) {
        $scope.$broadcast('to-child', data);
    });

    $scope.$on('logout-to-parent', function (event, data) {
        juadge_login();
    });

    $("body").keydown(function () {
        if (event.keyCode == "13") {
            $('#login_btn').click();
        }
    });

    $scope.login_gnss = function (data) {
        $http.post("http://192.168.1.30:3000/", {
            username: $scope.userName,
            password: $scope.passWord
        },{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).success(function (req) {
                console.log("success")
                console.log(req)
            }).error(function (req) {
                console.log("Err")
                console.log(req)
            })

    }

    function juadge_login() {
        if (localStorage.getItem('base_station')) {
            $scope.login_hide = false;
            $scope.login_show = true;
        } else {
            $scope.login_hide = true;
            $scope.login_show = false;
        }
    }

    juadge_login();
}]);


MetronicApp.controller('HeaderController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader();
    });

    $scope.base_station = localStorage.getItem('base_station');
    $scope.signal_type = localStorage.getItem('signal_type');

    $scope.change_base_station = function (name) {
        localStorage.setItem('base_station', name)
        $scope.base_station = name;
        $scope.$emit('to-parent', name);
    }

    $scope.change_signal_type = function (name) {
        localStorage.setItem('signal_type', name)
        $scope.signal_type = name;
        $scope.$emit('to-parent', name);
    }

    $scope.logout_gnss = function () {
        localStorage.removeItem('base_station');
        $scope.$emit('logout-to-parent', 'data');
    }
}]);

MetronicApp.controller('SidebarController', ['$state', '$scope', function ($state, $scope) {

    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar($state);
    });
}]);


MetronicApp.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter();
    });
}]);

MetronicApp.config(['$stateProvider', '$httpProvider', '$urlRouterProvider', function ($stateProvider, $httpProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/dashboard.html");

    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};

    $stateProvider

        .state('dashboard', {
            url: "/dashboard.html",
            templateUrl: "views/dashboard.html",
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "dashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'assets/global/plugins/morris/morris.css',
                            'assets/global/plugins/morris/morris.min.js',
                            'assets/global/plugins/morris/raphael-min.js',
                            'assets/global/plugins/jquery.sparkline.min.js',

                            'assets/pages/scripts/dashboard.min.js',
                            'js/controllers/dashboardController.js',
                        ]
                    });
                }]
            }
        })


}]);

MetronicApp.run(["$rootScope", "settings", "$state", function ($rootScope, settings, $state) {
    $rootScope.$state = $state;
    $rootScope.$settings = settings;
}]);