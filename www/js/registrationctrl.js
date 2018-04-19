angular.module('registration', [])

.controller('RegistrationCtrl', function($filter, $scope, $state, $http, $rootScope, $ionicPopup, ionicDatePicker, $timeout, $ionicLoading) {



  $scope.confirm = {
    emailid: '',
    password: '',
    verify: ''
  }


  $scope.backgo = function() {
    $state.go("login");
  }



  $scope.save = function() {

    if ($scope.confirm.password == "") {
      var alertPopup = $ionicPopup.alert({
        title: "Error",
        content: "Please enter your Password"
      })
    } else if ($scope.confirm.verify == "") {
      var alertPopup = $ionicPopup.alert({
        title: "Error",
        content: "Please enter your verify Password"
      })
    } else if ($scope.confirm.verify != $scope.confirm.password) {
      var alertPopup = $ionicPopup.alert({
        title: "Error",
        content: "Password and verify Password is mismatch"
      })
    } else {

      $http.get(Baseurl + 'users/user_registration?id=' + $rootScope.reg.id + '&email=' + $rootScope.reg.email + '&password=' + $scope.confirm.password + '&ctc=' + $scope.confirm.ctc + '&app_version=' + versioncheck)
        .success(function(response) {
          var alertPopupRegistrate = $ionicPopup.alert({
            title: "MobCom",
            content: "You are registered successfully"
          })
          $state.go("login");
        })
    }
  }



  var ipObj1 = {
    callback: function(val) { //Mandatory 
      $scope.reg.date_of_birth = $filter('date')(val, "yyyy-MM-dd");
    }
  };

  $scope.openDatePicker = function() {
    ionicDatePicker.openDatePicker(ipObj1);
  };

  $scope.next = function() {

    if ($scope.confirm.emailid == '') {
      var alertPopup = $ionicPopup.alert({
        title: "Error",
        content: "Please enter your Email ID"
      })
    } else {

      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      $http.get(Baseurl + 'employees/employee_details?email=' + $scope.confirm.emailid + '&app_version=' + versioncheck)
        .success(function(response) {
          $timeout(function() {
            $ionicLoading.hide();
          })
          if (response == true) {
            var alertPopupnext = $ionicPopup.alert({
              title: "MobCom",
              content: "Already registered"
            })
          } else if (response == false) {
            var alertPopupnext1 = $ionicPopup.alert({
              title: "MobCom",
              content: "Email id is not avaiable"
            })
          } else {
            $state.go("employeedetails")
            $rootScope.reg = response[0];
          }

        })
    }
  }

})