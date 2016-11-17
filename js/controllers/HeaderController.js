MetronicApp.controller('HeaderController', ['$scope', '$http', function ($scope, $http) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader();
    });
    if (localStorage.getItem('base_station') && localStorage.getItem('signal_type')) {
        $scope.base_station = localStorage.getItem('base_station');
        $scope.signal_type = localStorage.getItem('signal_type');
    }
    $scope.changeBaseStation = function (name) {
        localStorage.setItem('base_station', name)
        $scope.base_station = name;
        $scope.$emit('to-parent', name);
    }

    $scope.changeSignalType = function (name) {
        localStorage.setItem('signal_type', name)
        $scope.signal_type = name;
        $scope.$emit('to-parent', name);
    }

    $scope.logoutGnss = function () {
        $http.get("http://192.168.1.30:3000/logout", {withCredentials: true}).success(function (req) {
            $scope.$emit('logout-to-parent', 'data');
        }).error(function (req) {
            isShowLogin(true, false)
        })

    }
}]);