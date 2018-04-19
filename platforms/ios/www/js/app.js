// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ionic-datepicker','ngCordova','login','registration','admin_dashboard',
  'emp_dashboard','emp_employeelist','admin_employeelist','projectlist','contacts'])

.run(function($ionicPlatform,$ionicPopup, $rootScope, $state, $ionicHistory, $timeout,$http) {
  $ionicPlatform.ready(function(){
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    // var permissions = cordova.plugins.permissions;
    // permissions.requestPermission(permissions.CAMERA, success, error);

    // function error() {
    //   console.warn('Camera permission is not turned on');
    // }

    // function success(status) {
    //   if (!status.hasPermission) error();
    // }
    // permissions.hasPermission(permissions.CAMERA, function(status) {
    //   if (status.hasPermission) {
    //     console.log("Yes :D ");
    //   } else {
    //     console.warn("No :( ");
    //   }
    // });

   document.addEventListener("deviceready", function() {
    hockeyapp.start(success, error, "c4a33428124947edb308ada711c50057");
    function error(error) {
     console.log(error);
    }

    function success(status) {
     console.log(status);
    }
    
  }, false);
  
  cordova.getAppVersion.getVersionNumber(function (version) {
      var mobversion = version;
      console.log(version)
      $http.get(Baseurl+'employees/get_version').success(function(res){
       var setVersion=res.version_no;
       console.log(setVersion)
       if(mobversion != setVersion){
       var myPopup = $ionicPopup.confirm({
       title: "Mobcom",
       template: 'New version '+setVersion+' available',
         buttons: [{
          text: 'UPDATE',
          type: 'button-positive',
          onTap: function(){
            hockeyapp.checkForUpdate();
            myPopup.show();
          }
        }]
       });
       }
      })
   });

  });

 $ionicPlatform.registerBackButtonAction(function(e) {
    e.preventDefault();
    function showConfirm() {
      var confirmPopup = $ionicPopup.show({
      title : 'Mobcom',
      template : 'Are you sure you want to exit ?',
      buttons : [{
        text : 'Cancel',
        type : 'button-danger',
       }, {
        text : 'Ok',           
        type : 'button-danger',
        onTap : function() {
         ionic.Platform.exitApp();
        }
       }]
      });
     };
      if($state.current.name=='login' || $state.current.name=='admin_dashboard' || $state.current.name=='emp_dashboard'){
       showConfirm();
      }else if($state.current.name=='admin_employeelist' || $state.current.name=='projectlist' || $state.current.name=='clients'){
         $state.go('admin_dashboard')
      }else if($state.current.name=='teams'){
         $state.go('projectlist')    
      }else if($state.current.name=='emp_employeelist' ){
        $state.go('emp_dashboard')
      }
      else {
        navigator.app.backHistory();
      }
    }, 100)


   $rootScope.logout=function(){
      $ionicPopup.confirm({
        title: "Do you want to Logout?",
        template: '<style>.popup { width:700px; } .popup-head { background-color: #FFFFFF; } .popup-title { color: #000; }</style>',
          buttons: [{ text: 'OK',
          type: 'button-positive',
          onTap: function(){
            localStorage.clear();
            $state.go("login")
          }
          },{
           text: 'CANCEL',
           type: 'button-positive',
           onTap: function(){}
        }]
      });
      
    }

})

 .config(function (ionicDatePickerProvider) {
    var datePickerObj = {
      inputDate: new Date(),
      titleLabel: 'Select a Date',
      setLabel: 'Set',
      //todayLabel: 'Today',
      closeLabel: 'Close',
      mondayFirst: false,
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      //from: new Date(1930, 1, 1),
      //to: new Date()-1,
      showTodayButton: true,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
      disableWeekdays: []
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  })





 
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  
  $ionicConfigProvider.views.swipeBackEnabled(false);
  var jsScrolling = (ionic.Platform.isAndroid() ) ? false : true;
  $ionicConfigProvider.scrolling.jsScrolling(jsScrolling);
  /*$ionicConfigProvider.views.maxCache(0);*/

  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller:'LoginCtrl'
  })

  .state('registration', {
    url: '/registration',
    templateUrl: 'templates/registration.html',
    controller:'RegistrationCtrl'
  })

  .state('admin_dashboard', {
    url: '/admin_dashboard',
    templateUrl: 'templates/admin_dashboard.html',
    controller:'AdminDashboardCtrl'
  })

  .state('emp_dashboard', {
    url: '/emp_dashboard',
    templateUrl: 'templates/emp_dashboard.html',
    controller: 'EmpDashboardCtrl'
  })


  .state('admin_employeelist', {
    url: '/admin_employeelist',
    templateUrl: 'templates/admin_employeelist.html',
    controller: 'AdminEmployeelistCtrl'
  })

  .state('emp_employeelist', {
    url: '/emp_employeelist',
    templateUrl: 'templates/emp_employeelist.html',
    controller: 'EmpEmployeelistCtrl'
  })

  .state('emp_information', {
    url: '/emp_information',
    templateUrl: 'templates/emp_information.html',
    controller: 'ProjectlistCtrl'
  })

  .state('admin_timesheet', {
    url: '/admin_timesheet',
    templateUrl: 'templates/admin_timesheet.html',
    controller: 'AdminEmployeelistCtrl'
  })


  .state('emp_timesheet', {
    url: '/emp_timesheet',
    templateUrl: 'templates/emp_timesheet.html',
    controller: 'EmpEmployeelistCtrl'
  })

  .state('projectlist', {
    url: '/projectlist',
    templateUrl: 'templates/projectlist.html',
    controller: 'ProjectlistCtrl'
  })

   .state('project_timesheet', {
    url: '/project_timesheet',
    templateUrl: 'templates/project_timesheet.html',
    controller: 'ProjectlistCtrl'
  })

   .state('createnewproject', {
    url: '/createnewproject',
    templateUrl: 'templates/createnewproject.html',
    controller: 'ProjectlistCtrl'
  })

  .state('assigntoemp', {
    url: '/assigntoemp',
    templateUrl: 'templates/assigntoemp.html',
    controller: 'AdminEmployeelistCtrl'
  })


  .state('employeedetails', {
    url: '/employeedetails',
    templateUrl: 'templates/employeedetails.html',
    controller: 'RegistrationCtrl'
  })

  .state('profile', {
    url: '/profile',
    templateUrl: 'templates/profile.html',
    controller: 'EmpEmployeelistCtrl'
  })   

  .state('contacts', {
    url: '/contacts',
    templateUrl: 'templates/contacts.html',
    controller: 'ContactsCtrl'
  })

  .state('clients', {
    url: '/clients',
    templateUrl: 'templates/clients.html',
    controller: 'ContactsCtrl'
  })

   .state('teams', {
    url: '/teams',
    templateUrl: 'templates/teams.html',
    controller: 'ProjectlistCtrl'
  })

   .state('cost', {
    url: '/cost',
    templateUrl: 'templates/cost.html',
    controller: 'ProjectlistCtrl'
  })


  if(localStorage.length==0){
      $urlRouterProvider.otherwise('/login');
   }
  else if(localStorage.length!=0){
    if(localStorage.getItem("role")=='Employee'){
     $urlRouterProvider.otherwise('/emp_dashboard');
    }else if(localStorage.getItem("role")=='Admin'){
     $urlRouterProvider.otherwise('/admin_dashboard'); 
    }  
  }else{
    $urlRouterProvider.otherwise('/login');  
  }
  
  
})


var Baseurl='http://mobcom.altiussolution.com/api/v1/';
//var Baseurl='http://192.168.1.59:3000/api/v1/';
var versioncheck="0.3"
