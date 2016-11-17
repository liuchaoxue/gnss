MetronicApp.controller('SidebarController', ['$state', '$scope', function ($state, $scope) {

    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar($state);
    });
}]);