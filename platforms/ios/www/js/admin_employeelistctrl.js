angular.module('admin_employeelist', [])

.controller('AdminEmployeelistCtrl', function($filter, ionicDatePicker, $scope, $state, $http, $rootScope, $ionicPopup, $ionicLoading, $ionicPlatform, $timeout, $ionicModal, $cordovaSms, $cordovaDevice) {

  $rootScope.EmployeeID = localStorage.getItem("id")
  $scope.AuthToken = localStorage.getItem("auth_token")
  

  var status = localStorage.getItem("Boolean")

  if (status == 'false') {
    $scope.approve_state = false;
    $scope.approve = "";
  } else if (status == 'true') {
    $scope.approve_state = true;
    $scope.approve = false;
  } else {
    $scope.approve_state = false;
    $scope.approve = "";
  }


  $scope.adminempList=function(){
    $http.get(Baseurl + 'employees?app_version=' + versioncheck, {
      headers: {
        "Authorization": "Token token=" + $scope.AuthToken
      }
    })
    .success(function(response) {
      $scope.EmployeesDetails = response;
    }).error(function(error) {

    })  
  }
  


  $scope.checkStatus = function(approve_state) {
    if (approve_state == true) {
      $scope.approve_state=true;
      $scope.approve = false;
      localStorage.setItem("Boolean", approve_state)
      localStorage.setItem("appr", $scope.approve)
    } else {
      $scope.approve_state=false;
      $scope.approve = "";
      localStorage.setItem("Boolean", approve_state)
      localStorage.setItem("appr", $scope.approve)
    }
  }

  $scope.timesheet = function(id, name) {
    $rootScope.EmployeeID_timesheet = id;
    $rootScope.EmployeeName = name;
    $state.go("admin_timesheet");
  }

  $scope.search = "";

  $scope.assigntoemp = function(id, name) {
    $rootScope.EmployeeID_toassign = id;
    $rootScope.EmployeeName = name;
    $state.go("assigntoemp");
  }

  if ($rootScope.EmployeeID_toassign != undefined && $rootScope.EmployeeID_toassign != "" && $rootScope.EmployeeID_toassign !=null && $state.current.name=='assigntoemp') {
    
    $http.get(Baseurl + 'employees/unassigned_project?employee_id=' + $rootScope.EmployeeID_toassign + '&app_version=' + versioncheck, {
      headers: {
        "Authorization": "Token token=" + $scope.AuthToken
      }
    }).success(function(response) {
      $scope.AllProject = [];
      for (var i in response) {
        $scope.AllProject.push({
          "budget": response[i].budget,
          "client_id": response[i].client_id,
          "id": response[i].id,
          "name": response[i].name,
          "status": response[i].status,
          "selected": false
        })
      }
      $scope.projectnameside = $scope.AllProject;
      $scope.projectname = function(objs) {
        $scope.projectnametype = objs.id;

      }
    })
  }

  $scope.selectProject = []
  $scope.MultiSelected = function(selectedValues) {
    var chckdata = false;
    for (var i in $scope.selectProject) {
      if ($scope.selectProject[i].id == selectedValues.id) {
        chckdata = true;
        $scope.selectProject.splice(i, 1)
      }
    }
    if (chckdata == false) {
      $scope.selectProject.push({
        id: selectedValues.id,
        name: selectedValues.name,
        selected: selectedValues.selected

      })
    }
  }

  $scope.getOptionsSelected = function(options, valueProperty, selectedProperty) {
    var optionsSelected = $filter('filter')(options, function(option) {
      return option[selectedProperty] == true;
    });
    $rootScope.optionsSelect = optionsSelected;
    if (optionsSelected != undefined) {
      return optionsSelected.map(function(group) {
        return group[valueProperty];
      }).join(", ");
    }
  };


  $scope.WeekStatus = 'current';
  $scope.animation={shake:false}
  $scope.week = 0;

  $scope.Previous = function(Previous) {
    $scope.button='Previous';
    $scope.week++;
    $scope.animation.shake=false;
    $scope.stateset=false;
    $timeout(function(){
      $scope.animation.shake=true;
      $scope.stateset=true;
      $scope.WeekStatus = Previous;
      $scope.Timesheetcal($scope.WeekStatus);
    },200,true);
  }

  $scope.Next = function(Next) {
   if($scope.week != 0){
    $scope.button='Next';
    $scope.week--;
    $scope.animation.shake=true;
    $scope.stateset=false;
    $timeout(function(){
      $scope.animation.shake=false;
      $scope.stateset=true;
      $scope.WeekStatus = Next;
      $scope.Timesheetcal($scope.WeekStatus);
    },200,true);
   }  
  }

  $scope.Current = function(Current) {
   if($scope.week != 0){ 
    $scope.button='Current';
    $scope.week = 0;
    $scope.animation.shake=true;
    $scope.stateset=false;
    $timeout(function(){
      $scope.animation.shake=false;
      $scope.stateset=true;
      $scope.WeekStatus = Current;
      $scope.Timesheetcal($scope.WeekStatus);
    },200,true);
   } 
  }


  $scope.Timesheetcal = function(WeekStatu) {
    if (WeekStatu != undefined) {
      $scope.WeekStatus = WeekStatu;
    } else {
      $scope.WeekStatus = 'current';
    }
    $scope.Day1 = 0;
    $scope.Day2 = 0;
    $scope.Day3 = 0;
    $scope.Day4 = 0;
    $scope.Day5 = 0;
    $scope.Day6 = 0;
    $scope.Day7 = 0;

    $http.get(Baseurl + 'time_sheets/employee_time_sheet?employee_id=' + $rootScope.EmployeeID_timesheet + '&date=' + $scope.WeekStatus + '&app_version=' + versioncheck + "&period=" + $scope.week, {
      headers: {
        "Authorization": "Token token=" + $scope.AuthToken
      }
    }).success(function(response) {
      $scope.Timesheets = response[0];

      var setdate = $scope.Timesheets.date_range.split("..")
      $scope.FromDate = setdate[0];
      $scope.ToDate = setdate[1];

      if (response[1].length != 0) {
        $scope.TimesheetsDetl = response[1];

        /*New code Begins here*/
        $scope.TimesheetsDetails = [];
        for (var i = 0; i < $scope.TimesheetsDetl.length; i++) {
          $scope.TimesheetsDetails.push($scope.TimesheetsDetl[i]);
        }

        /*End here*/
      } else {
        $scope.TimesheetsDetails = [];
      }


      $scope.Day1 = 0;
      $scope.Day2 = 0;
      $scope.Day3 = 0;
      $scope.Day4 = 0;
      $scope.Day5 = 0;
      $scope.Day6 = 0;
      $scope.Day7 = 0;

      if ($scope.TimesheetsDetails.length != 0) {
        for (var i in $scope.TimesheetsDetails) {
          for (var j in $scope.TimesheetsDetails[i].data) {
            if ($scope.TimesheetsDetails[i].data[j].day == "Sun") {
              $scope.Day1 += $scope.TimesheetsDetails[i].data[j].hours
            } else if ($scope.TimesheetsDetails[i].data[j].day == "Mon") {
              $scope.Day2 += $scope.TimesheetsDetails[i].data[j].hours
            } else if ($scope.TimesheetsDetails[i].data[j].day == "Tue") {
              $scope.Day3 += $scope.TimesheetsDetails[i].data[j].hours
            } else if ($scope.TimesheetsDetails[i].data[j].day == "Wed") {
              $scope.Day4 += $scope.TimesheetsDetails[i].data[j].hours
            } else if ($scope.TimesheetsDetails[i].data[j].day == "Thu") {
              $scope.Day5 += $scope.TimesheetsDetails[i].data[j].hours
            } else if ($scope.TimesheetsDetails[i].data[j].day == "Fri") {
              $scope.Day6 += $scope.TimesheetsDetails[i].data[j].hours
            } else if ($scope.TimesheetsDetails[i].data[j].day == "Sat") {
              $scope.Day7 += $scope.TimesheetsDetails[i].data[j].hours
            }
          }
        }
      }

    })

  }



  $scope.assignto = function() {
    if ($scope.selectProject.length == 0) {
      var alertPopupProject = $ionicPopup.alert({
        title: "MobCom",
        content: "Please select the project name"
      })
    } else {
      for (var i in $scope.selectProject) {
        $http.get(Baseurl + 'employees/project_assign?project_id=' + $scope.selectProject[i].id + "&employee_id=" + $rootScope.EmployeeID_toassign + '&app_version=' + versioncheck, {
            headers: {
              "Authorization": "Token token=" + $scope.AuthToken
            }
          })
          .success(function(response) {

          })
      }
      $state.go("admin_employeelist");

    }
  }

  $scope.back = function() {
    $state.go("admin_employeelist");
  }


  $scope.empback = function() {
    $state.go("admin_dashboard");
  }

  $scope.call = function(number, id) {

    window.plugins.CallNumber.callNumber(function(result) {
      if (window.PhoneCallTrap) {
        PhoneCallTrap.onCall(function(state) {});
      }
    }, function(error) {
      //error logic goes here
    }, number)
  };


  $ionicModal.fromTemplateUrl("templates/modal.html", {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    return modal;
  });


  $scope.admin = {
    response: ""
  }

  $scope.openModal = function(mobile_number, id, pname) {
    $scope.admin = {
      response: ""
    }
    $scope.mNumber = mobile_number;
    $scope.selectedId = id;
    $scope.nameOpen = pname;
    $scope.modal.show();

  };
  $scope.closeModal = function() {
    $scope.admin = {
      response: ""
    };
    $scope.modal.hide();
  };

  $scope.popup = function(mobile_number, id, response) {
    $scope.admin = {
      response: ""
    };
    var data = response;

    //CONFIGURATION    
    var options = {
      replaceLineBreaks: false, // true to replace \n by a new line, false by default
      android: {
        //intent: 'INTENT' // send SMS with the native android SMS messaging
        intent: '' // send SMS without open any other app
      }
    };

    $cordovaSms
      .send(mobile_number, data, options)
      .then(function(success) {
        if (success == true) {
          var myPopup = $ionicPopup.alert({
            template: 'Message has been sent',
            title: "MobCom",
            buttons: [{
              text: 'OK',
              type: 'button-dark',
              onTap: function(e) {
                return true;
              }
            }]
          })
        }
      }, function(error) {
        var myPopup = $ionicPopup.alert({
          template: "Message can't sent",
          title: "MobCom",
          buttons: [{
            text: 'OK',
            type: 'button-dark',
            onTap: function(e) {
              return true;
            }
          }]
        })
      });
  }




  $scope.CallPost = function(id) {
    var create = {
      "call_log": {
        "from_employee_id": $rootScope.EmployeeID,
        "to_employee_id": id,
        "to_contact_id": 0,
        "start_time": "00:00",
        "end_time": "00:00"
      }
    }

    $http({
      method: 'post',
      url: Baseurl + "logs/call_create?app_version=" + versioncheck,
      data: create,
      headers: {
        "Authorization": "Token token=" + $scope.AuthToken
      }
    }).then(function(response) {})

  }

  $scope.SMSPost = function(selectedId, response) {
    var create = {
      "message_log": {
        "from_employee_id": $rootScope.EmployeeID,
        "to_employee_id": selectedId,
        "to_contact_id": 0,
        "message": response
      }
    }

    $http({
      method: 'post',
      url: Baseurl + "logs/message_create?app_version=" + versioncheck,
      data: create,
      headers: {
        "Authorization": "Token token=" + $scope.AuthToken
      }
    }).then(function(response) {

    })

  }


  $scope.Approval = function() {

    $http.get(Baseurl + 'time_sheets/time_approval_status?employee_id=' + $rootScope.EmployeeID_timesheet + '&date=' + $scope.WeekStatus + '&app_version=' + versioncheck + "&period=" + $scope.week, {
        headers: {
          "Authorization": "Token token=" + $scope.AuthToken
        }
      })
      .success(function(response) {

        var alertPopupAppSuccess = $ionicPopup.alert({
          template: $rootScope.EmployeeName + " timesheet has been approved",
          title: "MobCom",
          buttons: [{
            text: 'OK',
            type: 'button-positive',
            onTap: function(e) {
              $scope.Timesheetcal($scope.WeekStatus)
            }
          }]
        })
        $scope.Timesheetcal($scope.WeekStatus)
      })

  }


}).directive('ionMultipleSelect', ['$ionicModal', '$ionicGesture', function($ionicModal, $ionicGesture) {
  return {
    restrict: 'E',
    scope: {
      options: "="
    },
    controller: function($scope, $element, $attrs) {
      $scope.multipleSelect = {
        title: $attrs.title || "Select Options",
        tempOptions: [],
        keyProperty: $attrs.keyProperty || "id",
        valueProperty: $attrs.valueProperty || "value",
        selectedProperty: $attrs.selectedProperty || "selected",
        templateUrl: $attrs.templateUrl || 'templates/multipleSelect.html',
        renderCheckbox: $attrs.renderCheckbox ? $attrs.renderCheckbox == "true" : true,
        animation: $attrs.animation || 'slide-in-up'
      };

      $scope.OpenModalFromTemplate = function(templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
          scope: $scope,
          animation: $scope.multipleSelect.animation
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      };

      $ionicGesture.on('tap', function(e) {
        $scope.multipleSelect.tempOptions = $scope.options.map(function(option) {
          var tempOption = {};
          tempOption[$scope.multipleSelect.keyProperty] = option[$scope.multipleSelect.keyProperty];
          tempOption[$scope.multipleSelect.valueProperty] = option[$scope.multipleSelect.valueProperty];
          tempOption[$scope.multipleSelect.selectedProperty] = option[$scope.multipleSelect.selectedProperty];

          return tempOption;
        });
        $scope.OpenModalFromTemplate($scope.multipleSelect.templateUrl);
      }, $element);

      $scope.saveOptions = function() {
        for (var i = 0; i < $scope.multipleSelect.tempOptions.length; i++) {
          var tempOption = $scope.multipleSelect.tempOptions[i];
          for (var j = 0; j < $scope.options.length; j++) {
            var option = $scope.options[j];
            if (tempOption[$scope.multipleSelect.keyProperty] == option[$scope.multipleSelect.keyProperty]) {
              option[$scope.multipleSelect.selectedProperty] = tempOption[$scope.multipleSelect.selectedProperty];
              break;
            }
          }
        }
        $scope.closeModal();
      };

      $scope.closeModal = function() {
        $scope.modal.remove();
      };
      $scope.$on('$destroy', function() {
        if ($scope.modal) {
          $scope.modal.remove();
        }
      });
    }
  };
}]);