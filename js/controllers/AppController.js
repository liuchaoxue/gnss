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

    $scope.loginGnss = function () {
        $http.post("http://192.168.1.30:3000/login?username=" + $scope.userName + "&password=" + $scope.passWord, {}, {
            withCredentials: true,
        }).success(function (data) {
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