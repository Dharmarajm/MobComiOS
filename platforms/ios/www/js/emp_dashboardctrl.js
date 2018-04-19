angular.module('emp_dashboard', [])

.controller('EmpDashboardCtrl', function($scope, $state, $http, $rootScope, $ionicPopup, $cordovaImagePicker) {

  $scope.timesheet = function() {
    $state.go("emp_timesheet");
  }

  $scope.employee = function() {
    $state.go("emp_employeelist");
  }

  $scope.profile = function() {
    $state.go("profile");
  }

})