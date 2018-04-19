angular.module('emp_employeelist', [])
  .controller('EmpEmployeelistCtrl', function($filter, ionicDatePicker, $scope, $state, $http, $rootScope, $ionicPlatform, $ionicPopup, $cordovaImagePicker, $ionicLoading, $timeout, $ionicModal, $cordovaSms, $cordovaDevice, $ionicHistory) {

    $scope.hour_values = 24;
    $scope.search = "";
    $scope.ImageUrl = '';
    $rootScope.EmployeeID_timesheet = localStorage.getItem("id")
    $scope.AuthToken = localStorage.getItem("auth_token")
    $scope.getlocalurl = "http://mobcom.altiussolution.com"

    $scope.employtimesheet=function(){
      $http.get(Baseurl + 'employees/assigned_project?employee_id=' + $rootScope.EmployeeID_timesheet + "&app_version=" + versioncheck, {
        headers: {
          "Authorization": "Token token=" + $scope.AuthToken
        }
      })
      .success(function(response) {
        $scope.ProjectDetails = response;
        $scope.projectnameside = $scope.ProjectDetails;
        $scope.projectname = function(objs) {
          if (objs != null) {
            $scope.projectnametype = objs.id;
            $scope.project_name = objs.name;
          } else {
            $scope.projectnametype = null;
          }
        }
      })
    }
    
    $scope.employlist=function(){
      $http.get(Baseurl + 'employees?app_version=' + versioncheck, {
        headers: {
          "Authorization": "Token token=" + $scope.AuthToken
        }
      })
      .success(function(response) {
        $timeout(function() {
          $ionicLoading.hide();
        })
        $scope.EmployeesDetails = response;
        for (var i in $scope.EmployeesDetails) {
          if (localStorage.getItem("id") == $scope.EmployeesDetails[i].id) {
            if ($scope.EmployeesDetails[i].image.url == null || $scope.EmployeesDetails[i].image.url == undefined || $scope.EmployeesDetails[i].image.url == "") {
              $scope.ImageUrl = '';
              /*$scope.getlocalurl='img/blank-profile-picture.png';*/
            } else {
              $scope.ImageUrl = $scope.EmployeesDetails[i].image.url;

            }
          }
        }
      }) 
    }    

    $scope.WeekStatus = 'current';

    $scope.week = 0;

    $scope.Previous = function(Previous) {
      $scope.week++;
      $scope.WeekStatus = Previous;
      $scope.Timesheetcal($scope.WeekStatus);
    }

    $scope.Next = function(Next) {
      $scope.week--;
      $scope.WeekStatus = Next;
      $scope.Timesheetcal($scope.WeekStatus);
    }

    $scope.Current = function(Current) {
      $scope.week = 0;
      $scope.WeekStatus = Current;
      $scope.Timesheetcal($scope.WeekStatus);
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
      $http.get(Baseurl + 'time_sheets/employee_time_sheet?employee_id=' + $rootScope.EmployeeID_timesheet + '&date=' + $scope.WeekStatus + "&app_version=" + versioncheck + "&period=" + $scope.week, {
          headers: {
            "Authorization": "Token token=" + $scope.AuthToken
          }
        })
        .success(function(response) {

          $scope.Timesheets = response[0];
          $scope.TimesheetsDetails = response[1];
          if ($scope.Timesheets != undefined) {
            var setdate = $scope.Timesheets.date_range.split("..")
            $scope.FromDate = setdate[0];
            $scope.ToDate = setdate[1];

            $scope.Dates_Record = [];
            for (var i = 0; i < 7; i++) {
              $scope.mydate = new Date($scope.FromDate);
              $scope.newdate = $scope.mydate.setDate($scope.mydate.getDate() + i);
              $scope.All_Dates = $filter('date')($scope.newdate, "dd-MM-yyyy");
              $scope.Dates_Record.push($scope.All_Dates);
            }

            if ($scope.WeekStatus == 'current') {
              $scope.start = new Date($scope.FromDate);
              $scope.end = new Date();
              var ipObj1 = {
                from: $scope.start,
                to: $scope.end,
                inputDate: new Date(),
                callback: function(val) { //Mandatory 
                  $scope.timesheet.selectdate = $filter('date')(val, "dd-MM-yyyy");
                  $http.get(Baseurl + 'is_absent?date=' + $scope.timesheet.selectdate + '&employee_id=' + $rootScope.EmployeeID_timesheet + "&app_version=" + versioncheck, {
                    headers: {
                      "Authorization": "Token token=" + $scope.AuthToken
                    }
                  }).success(function(response) {
                    if (response.attendance_log == 'Absent') {
                      var alertPopupdate1 = $ionicPopup.alert({
                        title: "MobCom",
                        content: "Selected date is already absent"
                      })
                      $scope.datepic = true;
                      $scope.timesheet.projectnametype = '';
                      $scope.timesheet.hours = '';
                    } else if (response.attendance_log == 'Data Incorrect') {
                      var alertPopupdate2 = $ionicPopup.alert({
                        title: "MobCom",
                        content: "Selected date is already absent"
                      })
                      $scope.datepic = true;
                      $scope.timesheet.projectnametype = '';
                      $scope.timesheet.hours = '';

                    } else {
                      $scope.datepic = false;
                    }
                  })
                },
              };

              $scope.openDatePicker = function() {
                ionicDatePicker.openDatePicker(ipObj1);
              };
            } else {
              $scope.start = new Date($scope.FromDate);
              $scope.end = new Date($scope.ToDate);
              var ipObj1 = {
                from: $scope.start,
                to: $scope.end,
                inputDate: $scope.start,
                callback: function(val) { //Mandatory 
                  $scope.timesheet.selectdate = $filter('date')(val, "dd-MM-yyyy");
                  $http.get(Baseurl + 'is_absent?date=' + $scope.timesheet.selectdate + '&employee_id=' + $rootScope.EmployeeID_timesheet + "&app_version=" + versioncheck, {
                    headers: {
                      "Authorization": "Token token=" + $scope.AuthToken
                    }
                  }).success(function(response) {
                    if (response.attendance_log == 'Absent') {
                      var alertPopupdate3 = $ionicPopup.alert({
                        title: "MobCom",
                        content: "Selected date is already absent"
                      })
                      $scope.datepic = true;
                      $scope.timesheet.projectnametype = '';
                      $scope.timesheet.hours = '';
                    } else if (response.attendance_log == 'Data Incorrect') {
                      var alertPopupdate4 = $ionicPopup.alert({
                        title: "MobCom",
                        content: "Selected date is already absent"
                      })
                      $scope.datepic = true;
                      $scope.timesheet.projectnametype = '';
                      $scope.timesheet.hours = '';

                    } else {
                      $scope.datepic = false;
                    }
                  })
                  $scope.isDisabled = true;
                },
              };

              $scope.openDatePicker = function() {
                ionicDatePicker.openDatePicker(ipObj1);
              };
            }
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
          } else {
            $scope.TimesheetsDetails = [];
          }
        })

    }



    $scope.hoursempty = function(project) {
      if (project == "" || project == null || project == undefined) {
        $scope.timesheet.hours = 0;
      }
    }

    $scope.checkProject = function(test, value) {
      if ((test == "" || test == null || test == undefined) && value > 0) {
        var alertPopuptimepro = $ionicPopup.alert({
          title: "MobCom",
          content: "Please select the project"
        })
        $scope.timesheet.hours = 0;
      }
    }



    $scope.timesheet = {
      selectdate: '',
      projectnametype: '',
      hours: ""
    };

    $scope.LocalData = [];

    $scope.addfield = function() {
      
     if(($scope.timesheet.hours) % 1 === 0){
      if ($scope.timesheet.hours == 0) {
        $scope.attendance = false;
      } else {
        $scope.attendance = true;
      }
      var check = false
      for (var i in $scope.LocalData) {

        if ($scope.timesheet.projectnametype == null) {
          $scope.project_name = null;
        } else {
          $scope.project_name = $scope.timesheet.projectnametype.name;
        }

        if ($scope.LocalData[i].project_name == $scope.project_name && $scope.LocalData[i].date == $scope.timesheet.selectdate) {
          check = true;
        }

      }

      if (check != false) {
        var alertPopuptimedate = $ionicPopup.alert({
          title: "MobCom",
          content: "Please select different Project or Date"
        })
      } else {
        if ($scope.timesheet.projectnametype == null || $scope.timesheet.projectnametype == "" || $scope.timesheet.projectnametype == undefined) {
          $scope.project_id = null;
          $scope.project_name = null;
        } else {
          $scope.project_id = $scope.timesheet.projectnametype.id;
          $scope.project_name = $scope.timesheet.projectnametype.name
        }
        $scope.LocalData.push({
          "date": $scope.timesheet.selectdate,
          "project_id": $scope.project_id,
          "project_name": $scope.project_name,
          "hours": $scope.timesheet.hours,
          "employee_id": $rootScope.EmployeeID_timesheet,
          "attendance_log": $scope.attendance
        })
        $scope.timesheet.selectdate = '';
        $scope.timesheet.projectnametype = null;
        $scope.timesheet.hours = null;
      }
     }else{
       $scope.timesheet.hours = null;
       var alertPopuptimefloat = $ionicPopup.alert({
          title: "MobCom",
          content: "Enter rounded value"
        })
     } 
    }

    $scope.remove = function(index) {
      $scope.LocalData.splice(index, 1)
    }

    $scope.timesheetcreate = function() {

      $scope.timeCreate = [];
      for (var i in $scope.LocalData) {
        $scope.timeCreate.push({
          "date": $scope.LocalData[i].date,
          "hours": $scope.LocalData[i].hours,
          "project_id": $scope.LocalData[i].project_id,
          "employee_id": $scope.LocalData[i].employee_id,
          "attendance_log": $scope.LocalData[i].attendance_log
        })
      }
      var data = {
        "data": $scope.timeCreate
      };
      $http({
        method: 'post',
        url: Baseurl + "time_sheets?app_version=" + versioncheck,
        data: data,
        headers: {
          "Authorization": "Token token=" + $scope.AuthToken
        }
      }).then(function(response) {
        $scope.hour_values = 24;
        $scope.show = 2;
        $scope.getApproveData = [];
        for (var i in response.data) {
          if (response.data[i].approval_status == true) {
            $scope.getApproveData.push($scope.LocalData[i].project_name);
          } else {
            $scope.getApproveData = [];
          }
        }
        if ($scope.getApproveData.length == 0) {
          var alertPopuptimesheet1 = $ionicPopup.alert({
            template: "Timesheet has been created",
            title: "MobCom",
            buttons: [{
              text: 'OK',
              type: 'button-positive',
              onTap: function(e) {
                $scope.LocalData = []
                $scope.Timesheetcal($scope.WeekStatus)
              }
            }]
          })
          $scope.LocalData = []
          $scope.Timesheetcal($scope.WeekStatus)
        }

        if ($scope.getApproveData.length > 0) {
          var alertPopuptimesheet2 = $ionicPopup.show({
            template: $scope.getApproveData.toString() + " Approved timesheet couldn't be edited",
            title: "MobCom",
            buttons: [{
              text: 'OK',
              type: 'button-positive',
              onTap: function(e) {
                $scope.LocalData = []
                $scope.Timesheetcal($scope.WeekStatus)
              }
            }]
          })
          $scope.LocalData = []
          $scope.Timesheetcal($scope.WeekStatus)
        }

      })

    }



    $scope.empback = function() {
      $ionicHistory.goBack();
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
    };




    $ionicModal.fromTemplateUrl("templates/modal.html", {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      return modal;
    });

    $scope.mode = {
      response: ""
    };

    $scope.openModal = function(mobile_number, id, pname) {
      $scope.mode = {
        response: ""
      };
      $scope.mNumber = mobile_number;
      $scope.selectedId = id;
      $scope.nameOpen = pname;
      $scope.modal.show();

    };
    $scope.closeModal = function() {
      $scope.modal.hide();
      $scope.mode = {
        response: ""
      };
    };


    $scope.popup = function(mobile_number, id, response) {
      var data = response;

      //CONFIGURATION    
      var options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
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




    $scope.CallPost = function(id) {
      var create = {
        "call_log": {
          "from_employee_id": $rootScope.EmployeeID_timesheet,
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
          "from_employee_id": $rootScope.EmployeeID_timesheet,
          "to_employee_id": selectedId,
          "to_contact_id": 0,
          "message": response,
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

    $scope.Image = [];

    $scope.upload = function() {


      $scope.Image = [];
      $scope.profileData = [];

      var options = {
        maximumImagesCount: 1,
        width: 800,
        height: 800,
        quality: 80
      };

      $cordovaImagePicker.getPictures(options)
        .then(function(results) {
          /*$scope.Image=results[0];*/
          $scope.Image = [];
          if (results[0] != undefined) {
            $scope.Image.push({
              "file": results[0]
            })
          }
          window.resolveLocalFileSystemURL(results[0],
            function(fileEntry) {
              // convert to Base64 string
              fileEntry.file(
                function(file) {
                  //got file

                  var reader = new FileReader();
                  reader.onloadend = function(evt) {
                    var imgData = evt.target.result; // this is your Base64 string
                    $rootScope.getimgData = imgData
                  };
                  reader.readAsDataURL(file);

                },
                function(evt) {
                  //failed to get file
                });

            },
            // error callback
            function() {}
          )
        }, function(error) {
          // error getting photos
          alert(error);
        })
    }



    $scope.ImagePost = function() {
      var create = {
        "message_log": {
          "employee_id": $rootScope.EmployeeID_timesheet,
          "image": $rootScope.getimgData
        }
      }
      $http({
        method: 'post',
        url: Baseurl + "employees/image_upload?app_version=" + versioncheck,
        data: create,
        headers: {
          "Authorization": "Token token=" + $scope.AuthToken
        }
      }).then(function(response) {
        $scope.ImageUrl = '';
        $ionicPopup.alert({
          title: 'Employee Profile',
          template: 'Your profile updated successfully',
          buttons: [{
            text: '<b>OK</b>',
            type: 'button-positive',
            onTap: function() {
              $state.go("emp_dashboard");
            }
          }]
        })

      }, function(error) {
        $ionicPopup.alert({
          title: 'Employee Profile',
          template: 'Your profile updated failed',
          buttons: [{
            text: '<b>OK</b>',
            type: 'button-positive',
            onTap: function() {

            }
          }]
        })
      })

    }


    $scope.moreDetail = function(detail) {
      $rootScope.empdetail = detail;
      $state.go("emp_information");
    }


    $scope.empinfoback = function() {
      $ionicHistory.goBack();
    }

    $scope.add = function() {
      $scope.show = 1;
    }

  })