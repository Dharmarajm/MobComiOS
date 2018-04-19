angular.module('projectlist', [])

.controller('ProjectlistCtrl', function($filter, ionicDatePicker, $ionicHistory, $scope, $state, $http, $rootScope, $ionicPopup, $ionicPlatform, $ionicLoading, $timeout, $ionicModal, $cordovaSms, $cordovaDevice) {

  $scope.AuthToken = localStorage.getItem("auth_token")
  $scope.search = "";
  
  var status = localStorage.getItem("BooleanAssign")

  if (status == 'false') {
    $scope.approve_state = false;
    $scope.assign = false;
  } else if (status == 'true') {
    $scope.approve_state = '';
    $scope.assign = true;
  } else {
    $scope.approve_state = '';
    $scope.assign = true;
  }

  $scope.projectback = function() {
    $state.go("admin_dashboard");
  }


  $scope.teams = function(id, name) {
    $scope.ProjectID = id;
    $rootScope.Projectname = name;
    $state.go("teams");
    $http.get(Baseurl + 'projects/project_employee?project_id=' + $scope.ProjectID + '&app_version=' + versioncheck, {
        headers: {
          "Authorization": "Token token=" + $scope.AuthToken
        }
      })
      .success(function(response) {
        $rootScope.TeamMember = response;
      })
  }
  
  $scope.checkStatus = function(approve_state) {
    if (approve_state == false) {
      $scope.approve_state = false;
      $scope.assign = false;
      localStorage.setItem("BooleanAssign", $scope.assign)
    } else {
      $scope.approve_state = '';
      $scope.assign = true;
      localStorage.setItem("BooleanAssign", $scope.assign)
    }
  }

  $scope.cost = function(id, name, budget) {
    $scope.ProjectID = id;
    $rootScope.Projectname = name;
    $rootScope.Projectbudget = budget;
    $state.go("cost");

    $http.get(Baseurl + 'time_sheets/cost_estimate?project_id=' + $scope.ProjectID + '&app_version=' + versioncheck, {
        headers: {
          "Authorization": "Token token=" + $scope.AuthToken
        }
      })
      .success(function(response) {
        $rootScope.total_ctc = 0;
        $rootScope.total_hr = 0;
        $rootScope.total_amt = 0;
        $rootScope.costs = [];

        for (var i in response) {
          var hrs = (response[i].ctc / 24) / 8;
          var amount = Math.round(hrs * response[i].hours);
          $rootScope.costs.push({
            name: response[i].name,
            ctc: response[i].ctc,
            hours: response[i].hours,
            amount: amount
          })
          console.log(response[i])
        }
        for (var i in $rootScope.costs) {
          $rootScope.total_ctc += $rootScope.costs[i].ctc;

          $rootScope.total_hr += $rootScope.costs[i].hours;
          $rootScope.total_amt += Math.round($rootScope.costs[i].amount);
        }


      })
  }

  $rootScope.projectlist = function() {
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

    $http.get(Baseurl + 'projects?app_version=' + versioncheck, {
        headers: {
          "Authorization": "Token token=" + $scope.AuthToken
        }
      })
      .success(function(response) {
        $timeout(function() {
            $ionicLoading.hide();
          })
        $scope.ProjectDetails = response;
      })
  }



  $scope.NewProject = function() {
    $state.go("createnewproject");
  }

  $scope.newPro=function(){
    $http.get(Baseurl + 'clients?app_version=' + versioncheck, {
      headers: {
        "Authorization": "Token token=" + $scope.AuthToken
      }
    })
    .success(function(response) {
      $scope.ClientDetails = response;
      $scope.clientnameside = $scope.ClientDetails;
      
    })
  }
  
  $scope.clientname = function(objs) {
    if (objs != null) {
      $scope.clientnametype = objs.id;
    } else {
      $scope.clientnametype = null;
    }
  }

  $scope.clientnameside = "";
  $scope.name = "";
  $scope.budget == "";

  $scope.createproject = function(name, budget) {
    if ($scope.clientnametype == "" || $scope.clientnametype == null || $scope.clientnametype == undefined) {
      var alertPopupcreatePro = $ionicPopup.alert({
        title: "MobCom",
        content: "Please Select the Client Name"
      })
    } else if (name == "" || name == null || name == undefined) {
      var alertPopupProName = $ionicPopup.alert({
        title: "MobCom",
        content: "Enter the Project Name"
      })
    } else if (budget == "" || budget == null || budget == undefined) {
      var alertPopupProBud = $ionicPopup.alert({
        title: "MobCom",
        content: "Enter the Project budget Amount"
      })
    } else {
      var create = {
        "client_id": $scope.clientnametype,
        "name": name,
        "budget": budget
      }

      $http({
        method: 'post',
        url: Baseurl + "projects?app_version=" + versioncheck,
        data: create,
        headers: {
          "Authorization": "Token token=" + $scope.AuthToken
        }
      }).then(function(response) {
        var alertPopupProCreate = $ionicPopup.alert({
          template: 'Project has been created',
          title: "MobCom",
          buttons: [{
            text: 'OK',
            type: 'button-positive',
            onTap: function(e) {
              $state.go("projectlist");
            }
          }]
        })

      })
    }
  }

  $scope.costback = function() {
    $state.go("projectlist");
  }

  $scope.teamback = function() {
    $state.go("projectlist");
  }

  $scope.WeekStatus = 'current';

  $scope.timesheet_project = function(id, name) {
    $rootScope.ID = id;
    $rootScope.Projectname = name;
    $scope.WeekStatus = 'current';
    $state.go("project_timesheet");
    $scope.Timesheetcal($scope.WeekStatus);
  }



  $scope.week = 0;
  $scope.animation={shake:false}
  
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

    $scope.CheckApprove = false;
    $http.get(Baseurl + 'time_sheets/project_working_hours?project_id=' + $rootScope.ID + '&date=' + $scope.WeekStatus + '&app_version=' + versioncheck + "&period=" + $scope.week, {
        headers: {
          "Authorization": "Token token=" + $scope.AuthToken
        }
      })
      .success(function(response) {
        $scope.Timesheets = response[0];
        var setdate = $scope.Timesheets.date_range.split("..")
        if ($scope.Timesheets != undefined) {
          $scope.FromDate = setdate[0];
          $scope.ToDate = setdate[1];
        }
        $scope.ProjectApprovalID = [];
        $scope.TimesheetsDetails = response[1];
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
        } else {
          $scope.TimesheetsDetails = [];
        }


      })

  }

  $scope.ProjectApproval = function() {

    $http.get(Baseurl + 'projects/approval_status?project_id=' + $rootScope.ID + '&app_version=' + versioncheck, {
        headers: {
          "Authorization": "Token token=" + $scope.AuthToken
        }
      })
      .success(function(response) {

        var alertPopupProjectAS = $ionicPopup.alert({
          template: $rootScope.Projectname + " Project timesheet has been approved",
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

  $scope.call = function(number, id) {
    window.plugins.CallNumber.callNumber(function(result) {
      if (window.PhoneCallTrap) {
        PhoneCallTrap.onCall(function(state) {});
      }
      //success logic goes here
    }, function(error) {
      // alert(error)
      //error logic goes here
    }, number)
  }


  $scope.popup = function(mobile_number, id, response) {
    $scope.teamMode = {
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
            template: "Message has been sent",
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


  $ionicModal.fromTemplateUrl("modal.html", {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      return modal;
  });

  $scope.teamMode = {
    response: ""
  };

  $scope.openModal = function(mobile_number, id, pname) {
    $scope.teamMode = {
      response: ""
    };

    $scope.mNumber = mobile_number;
    $scope.selectedId = id;
    $scope.nameOpen = pname;
    $scope.modal.show();

  };
  $scope.closeModal = function() {
    $scope.teamMode = {
      response: ""
    };
    $scope.modal.hide();
  };

  $scope.moreDetail = function(detail) {
    $rootScope.empdetail = detail;
    $state.go("emp_information");
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

  $scope.empinfoback = function() {
      $ionicHistory.goBack();
    }


})