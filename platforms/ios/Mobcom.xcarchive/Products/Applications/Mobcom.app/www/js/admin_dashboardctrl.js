angular.module('admin_dashboard', [])

.controller('AdminDashboardCtrl', function($scope, $state, $http, $rootScope, $ionicPopup) {


  $scope.employee = function() {
  	localStorage.removeItem("Boolean")
    $state.go("admin_employeelist");
  }

  $scope.project = function() {
    localStorage.removeItem("BooleanAssign")
    $state.go("projectlist")
  }


  $scope.contacts = function() {
    $state.go("clients")
  }


})