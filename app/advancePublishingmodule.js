/* Angular app module */
var advancePubapp = angular.module('advancePublications',["ui.router","ui.bootstrap",'colorpicker.module', 'wysiwyg.module','ngMaterial','ngFileUpload','ngMessages', 'angAccordion','ngCookies', 'smDateTimeRangePicker','daterangepicker','ngAnimate','textAngular','720kb.tooltips','uiCropper','angularMoment','bootstrapLightbox'])

var templateURL = (templateURL != "" && templateURL != undefined)? templateURL : "";

var stateData =[{
            name:'adminLogin',
            url: 'dashboard',
            templateUrl:'admin',
            controller: 'adminController',
		          	params:{isLoggedin:null}        
         },{
            name:'adminLanding',
            url: 'adminLanding',
            templateUrl:'adminLanding',
            controller: 'adminlandingController',
        },{
            name:'groupdashboard',
            url: 'groups',
            templateUrl:'admindashboard',
            controller: 'dashboardController',
       },{
            name:'adminLanding.usermanagement',
            url: 'usermanagement',
            templateUrl: 'usermanagement',
            controller: 'usermanagementController',
      },{
            name:'adminLanding.classmanagement',
            url: 'classmanagement',
            templateUrl:'classmanagement',
            controller: 'classmanagementController'
      },{
            name:'adminLanding.contentmanagement',
            url: 'contentmanagement',
            templateUrl:'contentmanagement',
            controller:'contentmanagementController'
      },{
            name:'adminLanding.surveyresults',
            url: 'surveyresults',
            templateUrl:'surveyresults',
            controller:'surveyresultsController'
      },{ 
            name:'adminLanding.survey',
            url: 'survey/:type',
            templateUrl:'survey',
            controller: 'surveyController',
            params:{type: ''}
      },{ 
            name:'adminLanding.surveyDetails',
            url: 'survey/:type/:id',
            templateUrl:'surveyDetails',
            controller: 'surveyDetailsController',
            params:{type:''}
      },{
            name:'adminLanding.useranalytics',
            url: 'reports&analytics/useranalytics',
            templateUrl:'useranalytics',
            controller: 'useranalyticsController'
      },{
            name:'adminLanding.socialmedia',
            url: 'reports&analytics/socialmedia',
            templateUrl:'socialmedia',
            controller: 'socialmediaController'
      },{
            name:'adminLanding.classanalytics',
            url: 'reports&analytics/classanalytics',
            templateUrl:'classanalytics',
            controller: 'classanalyticsController'
      },{
            name:'adminLanding.activityanalytics',
            url: 'reports&analytics/activityanalytics',
            templateUrl:'activityanalytics',
            controller: 'activityanalyticsController'
      },{
            name:'adminLanding.comparativereports',
            url: 'reports&analytics/programanalytics/comparativereports',
            templateUrl:'comparativereports',
            controller: 'comparativereportsController'
      },{
            name:'adminLanding.phonicsadventure',
            url: 'reports&analytics/programanalytics/phonicadventure',
            templateUrl:'phonicsadventure',
            controller: 'phonicsadventureController'
      },{
            name:'adminLanding.numbersuccess',
            url: 'reports&analytics/programanalytics/numbersuccess',
            templateUrl:'numbersuccess',
            controller: 'numbersuccessController'
      },{
            name:'adminLanding.writingsuccess',
            url: 'reports&analytics/programanalytics/writingsuccess',
            templateUrl:'writingsuccess',
            controller: 'writingsuccessController'
      },{
            name:'adminLanding.readingsuccess',
            url: 'reports&analytics/programanalytics/readingsuccess',
            templateUrl:'readingsuccess',
            controller: 'readingsuccessController'
      },{
            name:'adminLanding.forum',
            url: 'Forum/:id',
            templateUrl:'forum',
            controller: 'forummanagementController',
            params:{id: ''} 
      },{
            name:'adminLanding.myprofile',
            url: 'myprofile',
            templateUrl:'myProfile'
            
      },{
            name:'adminLanding.adminmessage',
            url: 'adminmessage/:msgtype/:msgid',
            templateUrl:'adminmessage',
            controller: 'adminmessageController'
      },{
            name:'adminLanding.studentprofile',
            url: 'studentprofile',
            templateUrl:'studentprofile',
            controller: 'studentprofileController'
      },{
			name:'adminLanding.classDetails',
		    url: '/ClassDetails/:classid/:group/:table/:userid/:tab/:childtab/:section',
			templateUrl: 'classDetails',
			controller: 'classDetailsController',
			params:{group: '',classid:'',table:'users',userid:''}
	  }	
]; 

advancePubapp.config(function ($stateProvider, $urlRouterProvider,$httpProvider){
     $httpProvider.interceptors.push('sessionInterceptor');
     $urlRouterProvider.otherwise('/dashboard'); 
      angular.forEach(stateData, function (value, key){ 
          var state = {
            url: '/'+value.url,
            templateUrl : templateURL+'dest/templates/'+value.templateUrl+'.html',
            controller: value.controller,
            params: value.params
          };
          if(value.name === 'adminLanding'){
              var getData = ['cacheService', '$q','$stateParams',function(cacheService, $q,$stateParams){
                    var deferred = $q.defer();
                    cacheService.getAndSet().then(function(data) {
                        if(data){
                             $stateParams.Loggeduserdetails = data;
                             var tabArray =(window.location.href).split('/');
                             $stateParams.stateUrl = (tabArray.indexOf("adminLanding") === -1) ? ['usermanagement'] : tabArray.slice(tabArray.indexOf("adminLanding")+1,tabArray.length);
                             deferred.resolve();
                        }else{
                            deferred.reject();
                        }
                    });
                    return deferred.promise;
                }];
             state.resolve = getData;
          }
          $stateProvider.state(value.name, state);
      });
});

advancePubapp.run(function ($rootScope,sessionService,encryptionService) {
    $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
        sessionService.set('toState',encryptionService.encrypt(to.name));
        if(from.name != ""){ 
            sessionService.set('previousState',encryptionService.encrypt(from.name));
        }
        
    });
});