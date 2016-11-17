var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    'ngCookies'
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

MetronicApp.controller('AppController', ['$scope', '$http', '$rootScope', '$cookieStore', function ($scope, $http, $rootScope, $cookieStore) {
    $scope.$on('to-parent', function (event, data) {
        $scope.$broadcast('to-child', data);
    });

    $scope.$on('logout-to-parent', function (event, data) {
        checkLogin();
    });

    $("body").keydown(function () {
        if (event.keyCode == "13") {
            $('#login_btn').click();
        }
    });

    $scope.login_gnss = function () {
        $http.post("http://192.168.1.30:3000/login?username=" + $scope.userName + "&password=" + $scope.passWord, {}, {
            withCredentials: true,
        }).success(function (data) {
            console.log(data["connect.sid"])
            if (data["connect.sid"]) {
                $cookieStore.put("connect.sid", data["connect.sid"])
                isShowLogin(false, true)
            }
        }).error(function (req) {
            alert('账号或密码错误')
        });

    }
    function isShowLogin(login, index) {
        $scope.indexPage = index;
        $scope.loginPage = login;
    }

    function checkLogin() {
        $http.get("http://192.168.1.30:3000/users", {withCredentials: true}).success(function (req) {
            if (req == true) {
                isShowLogin(false, true)
            } else {
                isShowLogin(true, false)
            }

        }).error(function (req) {
            isShowLogin(true, false)
        })
    }

    checkLogin()
}]);


MetronicApp.controller('HeaderController', ['$scope', '$http', function ($scope, $http) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader();
    });
    if (localStorage.getItem('base_station') && localStorage.getItem('signal_type')) {
        $scope.base_station = localStorage.getItem('base_station');
        $scope.signal_type = localStorage.getItem('signal_type');
    }
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
        $http.get("http://192.168.1.30:3000/logout", {withCredentials: true}).success(function (req) {
            $scope.$emit('logout-to-parent', 'data');
        }).error(function (req) {
            isShowLogin(true, false)
        })

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

        .state('blank', {
            url: "/blank",
            templateUrl: "views/blank.html",
            data: {pageTitle: 'Blank Page Template'},
            controller: "BlankController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/BlankController.js'
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

