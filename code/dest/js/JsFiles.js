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
advancePubapp.factory('sfactory',function($http,$q,$rootScope,$state,jwtEncoder,sessionService,$mdDialog){   
 
    return {
        /* Post method */
       /* serviceCall: function(request,task,isAdmin,isLoaderhidden) { 
            var deferred = $q.defer();
            var url =typeof(siteAdminURL) == "undefined" ? (isAdmin == 'adminPage') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_sommer&task=" : "http://172.24.198.87:8080/development/cms/index.php?option=com_sommer&task=" : (isAdmin == 'adminPage') ? siteAdminURL+"/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? siteAdminURL+"/admin.php?option=com_sommer&task=" : siteURL+"index.php?option=com_sommer&task=";
            isLoaderhidden ? $rootScope.appLoader = false : $rootScope.appLoader = true;
            $http.post(url+task,request).then(function successCallback(response) {
                if(response.status == 200){
                    if(response.data.sessioned){
						deferred.resolve(response.data);    
					}
					else{
						$rootScope.appLoader = false;
						$state.go('adminLogin',{isLoggedin:false,location: false});
					}    
                }
                else{
                    //$rootScope.appLoader = false;
                    deferred.reject("Incorrect parameters");
                }
            },function(error){
                $rootScope.appLoader = false;
                deferred.reject(error);
            });
            return deferred.promise;
        },*/
		
	   serviceCall: function(request,task,isAdmin,isLoaderhidden) { 
            var deferred = $q.defer();
            var url =typeof(siteAdminURL) == "undefined" ? (isAdmin == 'adminPage') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_sommer&task=" : "http://172.24.198.87:8080/development/cms/index.php?option=com_sommer&task=" : (isAdmin == 'adminPage') ? siteAdminURL+"/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? siteAdminURL+"/admin.php?option=com_sommer&task=" : siteURL+"index.php?option=com_sommer&task=";
		   
           isLoaderhidden ? $rootScope.appLoader = false : $rootScope.appLoader = true;
		   var token = jwtEncoder.encode(request);		   
		   $http.post(url+task,'', {
    			headers: {'Authorization': token}
			}).then(function successCallback(response) {
                if(response && response.status == 200){
                    if(response.data.sessioned){
						deferred.resolve(response.data);    
					}
					else{
						sessionService.clear();
						$rootScope.appLoader = false;
						$state.go('adminLogin',{isLoggedin:false,location: false});
					}   
                }
                else{
                    $rootScope.appLoader = false;
                    deferred.reject("Incorrect parameters");
                }
            },function(error){
                $rootScope.appLoader = false;
                deferred.reject(error);
            });
		
            return deferred.promise;
        },
		
		loginServiceCall: function(request,task,isAdmin) { 
            var deferred = $q.defer();
            var url =typeof(siteAdminURL) == "undefined" ? (isAdmin == 'adminPage') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_sommer&task=" : "http://172.24.198.87:8080/development/cms/index.php?option=com_sommer&task=" : (isAdmin == 'adminPage') ? siteAdminURL+"/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? siteAdminURL+"/admin.php?option=com_sommer&task=" : siteURL+"index.php?option=com_sommer&task=";
            $rootScope.appLoader = true;
		    var token = jwtEncoder.encode(request);	
			
            $http.post(url+task,'', {
    			headers: {'Authorization': token}
			}).then(function successCallback(response) {
                if(response.status == 200){
                    deferred.resolve(response.data);  
					localStorage.setItem('tokenId', response.data.data.tokenId);					
                }
                else{
                    //$rootScope.appLoader = false;
                    deferred.reject("Incorrect parameters");
                }
            },function(error){
                $rootScope.appLoader = false;
                deferred.reject(error);
            });
            return deferred.promise;
        },
         ecomserviceCall: function(request,task,isLoader) { 
            var deferred = $q.defer();            
             var url = "http://172.24.137.114//ecommerce/webservice/service.php?method=";
            $rootScope.appLoader = !isLoader;
            var token = jwtEncoder.encode(request);
            $http.post(url+task, request).then(function successCallback(response) {
                if(response && response.status == 200){
                    console.log("media library menu accordion ->",response.data);
                    deferred.resolve(response.data);
                    /*if(response.data.sessioned){
                        deferred.resolve(response.data);    
                    }
                    else{
                        sessionService.clear();
                        $state.go('phonics');
                        $rootScope.appLoader = false;
                        $mdDialog.hide();
                    }*/   
                }
                else{
                    $rootScope.appLoader = false;
                    deferred.reject("Incorrect parameters");
                }
            },function(error){
                $rootScope.appLoader = false;
                deferred.reject(error);
            });
            return deferred.promise;
        },
/*		loginServiceCall: function(request,task,isAdmin) { 
            var deferred = $q.defer();
            var url =typeof(siteAdminURL) == "undefined" ? (isAdmin == 'adminPage') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_sommer&task=" : "http://172.24.198.87:8080/development/cms/index.php?option=com_sommer&task=" : (isAdmin == 'adminPage') ? siteAdminURL+"/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? siteAdminURL+"/admin.php?option=com_sommer&task=" : siteURL+"index.php?option=com_sommer&task=";
           $rootScope.appLoader = true;
            $http.post(url+task,request).then(function successCallback(response) {
                if(response.status == 200){
                    deferred.resolve(response.data);   
                }
                else{
                    //$rootScope.appLoader = false;
                    deferred.reject("Incorrect parameters");
                }
            },function(error){
                $rootScope.appLoader = false;
                deferred.reject(error);
            });
            return deferred.promise;
        },*/
        
        /* Get method */
        getService: function(request,task) {
            var deferred = $q.defer();
             $rootScope.appLoader = true;
            var url="http://172.24.198.87:8080/development/cms/index.php?option=com_sommer&task=";
            $http.get(url+task).then(function successCallback(response) {
                if(response.data.sessioned){
                    deferred.resolve(response.data);    
                }
                else{
					sessionService.clear();
                    $rootScope.appLoader = false;
                    $state.go('adminLogin',{isLoggedin:false,location: false}); 
                }
            },function(error){
                $rootScope.appLoader = false;
                deferred.reject(error);
            });
            return deferred.promise; 
        },
        
        /* post call for form data method */
     /*serviceCallFormData: function(request,task,isAdmin) {
            var deferred = $q.defer();
            $rootScope.appLoader = true;
            var url =typeof(siteAdminURL) == "undefined" ? (isAdmin == 'adminPage') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_sommer&task=" : "http://172.24.198.87:8080/development/cms/index.php?option=com_sommer&task=" : (isAdmin == 'adminPage') ? siteAdminURL+"/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? siteAdminURL+"/admin.php?option=com_sommer&task=" : siteURL+"index.php?option=com_sommer&task=";
           $http.post(url+task,request,{ headers: {'Content-Type': undefined},transformRequest: angular.identity}).then(function successCallback(response) {
                if(response.status == 200){
                   if(response.data.sessioned){
						deferred.resolve(response.data);    
					}
					else{
						$rootScope.appLoader = false;
						$state.go('adminLogin',{isLoggedin:false,location: false}); 
					}  
                }
                else{
                    $rootScope.appLoader = false;
                    deferred.reject("Incorrect parameters");
                }
            },function(error){
                $rootScope.appLoader = false;
                deferred.reject(error);
            });
            return deferred.promise;
        },*/
		
	  serviceCallFormData: function(request,task,isAdmin) {
            var deferred = $q.defer();
            $rootScope.appLoader = true;
            var url =typeof(siteAdminURL) == "undefined" ? (isAdmin == 'adminPage') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_sommer&task=" : "http://172.24.198.87:8080/development/cms/index.php?option=com_sommer&task=" : (isAdmin == 'adminPage') ? siteAdminURL+"/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? siteAdminURL+"/admin.php?option=com_sommer&task=" : siteURL+"index.php?option=com_sommer&task=";
		  
		    var token = jwtEncoder.encode(JSON.stringify(request.token));
		  
           $http.post(url+task,request.formObj,{ headers: {'Content-Type': undefined,'Authorization': token},transformRequest: angular.identity}).then(function successCallback(response) {
                if(response.status == 200){
                   if(response.data.sessioned){
						deferred.resolve(response.data);    
					}
					else{
						sessionService.clear();
						$rootScope.appLoader = false;
						$state.go('adminLogin',{isLoggedin:false,location: false}); 
					}  
                }
                else{
                    $rootScope.appLoader = false;
                    deferred.reject("Incorrect parameters");
                }
            },function(error){
                $rootScope.appLoader = false;
                deferred.reject(error);
            });
            return deferred.promise;
        },
      
        /* ajax call to fetch local json files */
        /* This code needs to be deleted before moving app to production */
        localService: function(task) {
            var deferred = $q.defer();          
             $http({method: 'GET',url: 'app/scripts/JsonFiles/'+task+'.json'}).then(function successCallback(response) {
                deferred.resolve(response);
              }, function errorCallback(error) {
                 deferred.reject(error);
              });
            return deferred.promise;
        },
        serviceIntervalCall: function(request,task,isAdmin) {            
            var deferred = $q.defer();            
            var url =typeof(siteAdminURL) == "undefined" ? (isAdmin == 'adminPage') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? "http://172.24.198.87:8080/development/cms/administrator/index.php?option=com_sommer&task=" : "http://172.24.198.87:8080/development/cms/index.php?option=com_sommer&task=" : (isAdmin == 'adminPage') ? siteAdminURL+"/index.php?option=com_login&task=" : (isAdmin == 'listDetails') ? siteAdminURL+"/admin.php?option=com_sommer&task=" : siteURL+"index.php?option=com_sommer&task=";          
		   	var token = jwtEncoder.encode(request);
            $http.post(url+task,'', {
    			headers: {'Authorization': token}
			}).then(function successCallback(response) {
                if(response && response.status == 200){
                    if(response.data.sessioned){
						//var playload = JSON.parse(atob(config.headers.Authorization.split('.')[1]));
    					//console.log(playload);
						deferred.resolve(response.data);    
					}
					else{
						sessionService.clear();
						$state.go('adminLogin',{isLoggedin:false,location: false}); 
                        $mdDialog.hide();
					}   
                }
                else{
                    deferred.reject("Incorrect parameters");
                }
            },function(error){
                deferred.reject(error);
            });
            return deferred.promise;           
        },
        serviceCallReports: function(request,task) {
            var deferred = $q.defer();
             $rootScope.appLoader = true;
            var url = typeof(siteAdminURL) === "undefined" ? "http://172.24.137.114/randa/" : appUrl;
            var token = jwtEncoder.encode(request);
            $http.post(url+task,'', {
    			headers: {'Authorization': token}
			}).then(function successCallback(response) {
				if(response.status == 200){
					if(response.data.sessioned){
						deferred.resolve(response.data);    
					}
					else{
						sessionService.clear();
						$rootScope.appLoader = false;
						$state.go('adminLogin',{isLoggedin:false,location: false}); 
					}    
				}				
            },function(error){
                $rootScope.appLoader = false;
                deferred.reject(error);
            });
            return deferred.promise; 
        },
        
        bufferedData : function(){
            return{
                assignment:[],
                params:{},
                studentProfile:[],
                types : ""
            }
        }
    };  

})
var loaderApp = angular.module('loader', [
	'bsLoadingOverlay',
	'ui.bootstrap'
]).run(function(bsLoadingOverlayService) {
	bsLoadingOverlayService.setGlobalConfig({
		templateUrl: 'loading-overlay-template.html'
	});
});
advancePubapp.controller('accordionController',['$scope','sfactory','$stateParams','$filter','$rootScope', '$mdDialog','$timeout','cacheService','encryptionService','sessionService', '$state','taskService', function($scope,sfactory,$stateParams,$filter,$rootScope,$mdDialog,$timeout,cacheService,encryptionService,sessionService, $state,taskService){ 
    //Method for get roles
    var isInit,tasks;  
	
	$scope.changeEditViewMode = function(roletype){ 
		$scope.viewmode = false;
		if(roletype == '5' && $scope.acc.data.classname != null){
			$scope.userNameEditable = false;
		}
	}
	$scope.EditModeCancel = function(){
		$scope.viewmode = true;
	}
    $scope.$watchCollection('contentBody',function(newVal,oldVal){
        $scope.acc.data.viewChild  = newVal.viewChild;
        $scope.acc.data.showChild  = newVal.showChild;
        $scope.acc.data.isEditable = newVal.isEditable;
        $scope.acc.data.isMessage  = newVal.isMessage;
    }); 
     
     /* Method to capture baner call back from child directives */
   $scope.$on('emitFromDirectiveBaner',function(event,args){
        $scope.alertBaner = args.alertBaner;
    })
   
    /* Method to capture baner call back from child directives */
    $scope.$on('emitFromDirectiveBaner',function(event,args){
        $scope.alertBaner = args.alertBaner;
    })
	
    /* Method on change of email */                                                                                          
    $scope.validateEmail = function(){
        var dataRequest = {};
        $scope.useremailexist= false;
        if(angular.isDefined($scope.acc.data.email) && ($scope.acc.data.email !== "")) {
			dataRequest = {email1:$scope.acc.data.email,userId:$scope.acc.data.id};
            sfactory.serviceCall(dataRequest,tasks.validateEmail,"listDetails",true).then(function(response){
				if(angular.isDefined(response)){
					$scope.useremailexist = !($filter('lowercase')(response.status) == 'success');
				}
            },function(){
            });
       }
    };
    
	if($scope.contentBody.isMessage){ 
    //method for delete 
    $scope.deletemessage = function(messageid){
		var confirm = $mdDialog.confirm()
			  .title('Would you like to delete message?')
			  .ariaLabel('Lucky day')
			  .targetEvent()
			  .ok('yes!')
			  .cancel('no');

		$mdDialog.show(confirm).then(function() {
			var task       = "messaging.messageActions";
			var data = {'messageId':messageid,"actionType":"delete"};
			sfactory.serviceCall(data,task,'listDetails').then(function(response){            
				if($filter('lowercase')(response.status) == 'success'){
					var matchmessageid = messageid;
					var matchdeleteid  = ( _.filter($scope.messagetabs[0]['content'], function(num){ return _.contains(matchmessageid,num.messageId) }));
					if(matchdeleteid.length > 0){
						_.each(matchdeleteid,function(selectedItems){
							deleteUniq($scope.messagetabs[0]['content'], 'messageId', selectedItems.messageId); 
						});
					}
					var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
					$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
					$scope.$emit('emitForClose',{'isSingleuser':false,'isMultiuser':false,'showicon':true});
				}else{
						var banerData = {'message':'The group is non deletable','showBaner':true,'banerClass':'alert-success'};
						$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
						$scope.$emit('emitForClose',{'isSingleuser':false,'isMultiuser':false,'showicon':true});
					}
				$rootScope.appLoader = false;
			},function(error){           
			});
		}, function() {
		 
		});
	}	    
    //Method for checkbox    
    $scope.selectedmessage = [];
		$scope.usermessagetoggle = function (item, list) {
			var idx = list.indexOf(item);
			if (idx > -1) {
				list.splice(idx, 1);
			}
			else {
				list.push(item);
			}
		};

		$scope.usermessageexists = function (item, list) {
			return list.indexOf(item) > -1;
		};

		$scope.usermessageIndeterminate = function() {
			return ($scope.selectedmessage.length !== 0 &&
			$scope.selectedmessage.length !== $scope.messageid.length);
		};

		$scope.userMessageSelectAll = function() {
		if ($scope.selectedmessage.length === $scope.messageid.length) {
			$scope.selectedmessage = [];
		} else if ($scope.selectedmessage.length === 0 || $scope.selectedmessage.length > 0) {
			$scope.selectedmessage = $scope.messageid.slice(0);
		}
	};
	        
	//Method for send item contents
		$scope.messagetabs = [
		  { title: 'SENT', content: []}
		];		
		var serRequest = JSON.stringify({receiverUserId:$scope.contentBody.id});
		angular.forEach($scope.messagetabs, function (val, key) {
			if(val.title == 'SENT'){
					$scope.sendMessageList = function(){
					var task       = "messaging.sentMessageList";
					
					sfactory.serviceCall(serRequest,task,'listDetails').then(function(response){ 						
						if($filter('lowercase')(response.status) == 'success'){
							$scope.messagetabs[key]['content'] = response.data; 
                            $scope.messageid = _.pluck(response.data, 'messageId') 
							$scope.initMessageObj();
						}else{
						}
						$rootScope.appLoader = false;
					});
				}
			}
		}) 			
				
		$scope.sendMessageList();	
		/* Method to initialize Message object object */
		$scope.initMessageObj = function(){
			$scope.message = {}; 
            $scope.messageCategory = ["message","mail","both"];
            $scope.textangulartoolbar =[['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol','justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent','quote','insertLink'],[ 'wordcount', 'charcount']]; 
            $scope.validImage = [];$scope.invalidImage = []; $scope.uploadedImage = [];
		}
		$scope.initMessageObj();
        /*  File Attachments for mail category */     
        $scope.upload = function(files) {
            $scope.validImage = [];$scope.invalidImage = []; $scope.uploadedImage = [];
            if(files){
                if (files.length < 20) {
                _.each(files, function(item){

                    $scope.uploadedImage.push(item);
                    //$scope.imageFileName.push({'name':item.name,'valid':true});
                    $scope.getImage(item);


                });
                }else{
                 alert("Please select max 20 files.");
                return false;
              }

            }
        };

        $scope.removeImage = function(e,index){
           $(e.target).parent().remove();
            $scope.uploadedImage.splice(index,1);     
           // console.log(uploadedImage);
        }
        $scope.getImage = function(file) {
           var reader = new FileReader();
            reader.filename = file.name;
            reader.onload = function (e) {
                $scope.$apply(function ($scope) {
                    $scope.validImage.push({"name":e.target.filename,"imgfile":e.target.result});
                });
            };
            reader.readAsDataURL(file);
            return $scope.validImage;
        };
        //Changing the text format
        $scope.changeTextContentFormat = function(){
          if($scope.message.compose_category == 'message')  {
              $scope.message.messageContent = String($scope.message.messageContent).replace(/<[^>]+>/gm, '');
          }
        };
		//Method for message send
		$scope.createMessage = function(){
            var formObj = new FormData(); 
            msgType = "yes";
			$scope.message.receiverUserId = $scope.acc.data.id;
            $scope.message.receiverUserEmail = $scope.acc.data.email;
            if($scope.acc.data.roleType == "Student"){
                msgType = "no";
            }
			var task       = "messaging.composeAdminConversation";
            sendMessage = {"messageSubject":$scope.message.messageSubject,"messageContent":$scope.message.messageContent,"receiverUserId":[$scope.message.receiverUserId],"receiverClassId":[],"messageType": msgType,"messageCategory": $scope.message.compose_category};
            //To append the file attachment
            _.each($scope.uploadedImage,function(item){
                formObj.append('mailAttachment[]',item);
           });
            var formToken = {'token':sendMessage,'formObj':formObj};
			sfactory.serviceCallFormData(formToken,task,'listDetails').then(function(response){            
				if($filter('lowercase')(response.status) == 'success'){
                    $scope.messagetabs[0]['content'].push($scope.message);
					var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
					$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
					$scope.$emit('emitForClose',{'isSingleuser':false,'isMultiuser':false,'showicon':true});					
                    $scope.contentBody.showChild = false;
                    $scope.contentBody.isMessage = false;
					$timeout(function(){
						$scope.contentBody.showChild = true;
					},0);                 
        
				}else{
					var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
					$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
				}
				$rootScope.appLoader = false;
			},function(error){
				if(response){
					var banerData    = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
					$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
                    $scope.contentBody.showChild = false;
                    $scope.contentBody.isMessage = false;
				}
			});
		}
        
       $scope.viewsentusermail = function(content){
			$mdDialog.show({
				controller: 'userSentMailViewController',
				templateUrl: 'dest/templates/userSentMailView.html',
				parent: angular.element(document.body),
				clickOutsideToClose:false,
				fullscreen: true,
				locals: {
				   mailcontent: content
				 }
			}).then(function() {            
			}, function() {
				
			});
		}  
	}
    
    $scope.getStudentReport = function(){
        sfactory.bufferedData.studentProfile = $scope.acc.data;
        sfactory.bufferedData.types = "student";
        $state.go('adminLanding.studentprofile',{location: false});
    };
    
    $scope.uploadedit = function(file) {
        $scope.profilepic = file;  
                $scope.acc.data.profile_pic = file;
                $scope.acc.data.profile_pic_name = file;
    }

    $scope.cancelEdit = function(){
        $scope.contentBody.showChild = false;
        $scope.contentBody.isEditable = false;
        sessionService.empty("croppedimage");
    };
    $scope.cancelMessage = function(){  
        $scope.contentBody.showChild = false;
        $scope.contentBody.isMessage = false;
    };
    
    $scope.update_useredit = function(){
        croppedImage = sessionService.get("croppedimage") ? sessionService.get("croppedimage") : "";
        var editRequest = {
            firstname : $scope.acc.data.firstname,
            lastname  : $scope.acc.data.lastname,
            roletype  : $scope.acc.data.roletype,
            user_username  : $scope.acc.data.username,
            groupname : $scope.acc.data.groupname,
            user_id   : $scope.acc.data.id,
            email     : $scope.acc.data.email,
            phoneno   : $scope.acc.data.phone_no,
            password  : angular.isDefined($scope.acc.data.password)? encryptionService.encrypt($scope.acc.data.password):"",
            address   : ($scope.acc.data.address ? $scope.acc.data.address : ''),
            dob: $scope.acc.data.dob,
			gender: $scope.acc.data.gender,
        }
        
        sessionService.empty("croppedimage");        
        var task = "user.useredit";
        var formToken = {'token':editRequest,'formObj':JSON.stringify({'croppedimage' : croppedImage})}; 
        sfactory.serviceCallFormData(formToken,task,'listDetails').then(function(response){
            $scope.contentBody.isEditable = false;
            if($filter('lowercase')(response.status) == 'success'){
				//roleType = classroletypecheck(Number($scope.acc.data.roletype));
				roleType                 = _.find(cacheService.get('userroles'),{roleid:$scope.acc.data.roletype}).name;
				$scope.acc.data.roleType = roleType;
                modelAssign($scope.contentBody,$scope.acc.data,response);
                var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
                $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
            }
			$rootScope.appLoader = false;
        },function(error){
        });
    }  

    $scope.phonelengthchange = function(){
        $scope.phonelen  = 14;
    } 
	    
    //value stored to table

    function modelAssign(model,currentModel,response){  
        model.profile_pic    = response.data.profile_pic ? response.data.profile_pic : ((currentModel.profile_pic == "noimage.png")? "": currentModel.profile_pic);
        model.profile_smlimage    = ((currentModel.profile_pic == "noimage.png")? "": currentModel.profile_pic);
        model.profile_picurl = response.data.profile_picurl ? response.data.profile_picurl : currentModel.profile_picurl;
        model.firstname      = currentModel.firstname;
        model.lastname       = currentModel.lastname;
        model.username       = currentModel.username;
        model.birth_year     = currentModel.birth_year;
        model.id             = currentModel.id;
        model.phone_no       = currentModel.phone_no;
		
		model.dob.year       = currentModel.dob.year;
		model.dob.day        = currentModel.dob.day;
		model.dob.month      = currentModel.dob.month;
		
        model.email          = currentModel.email;
		model.roleType       = currentModel.roleType;
		model.roletype       = currentModel.roletype;
		model.gender         = currentModel.gender;
        model.address        = (currentModel.address ? currentModel.address : '');
        model.showChild      = false;
        model.viewChild      = false;
        model.name           = currentModel.firstname+" "+currentModel.lastname;
    }
		     
    $scope.goToDetailsPage = function() {
        sfactory.bufferedData.studentProfile = $scope.acc.data;
        sfactory.bufferedData.types = "student";
        $state.go('adminLanding.studentprofile',{location: false});
    }
	/* Method to initialise controller */

	function initializeController(){
		$scope.showPassword       = false;
        tasks = taskService.getTasks("accordionController");
		//$scope.editmode = true;
		$scope.viewmode         = true;
		$scope.userNameEditable = true;
		isInit           = true;
		$scope.rotetype  = cacheService.get('userroles');
        $scope.phonelen  = 10;
		$scope.acc       = {};
		$scope.acc.data  = angular.copy($scope.contentBody);
		$scope.acc.data.roleType = _.find(cacheService.get('userroles'),{roleid:$scope.acc.data.roletype}).name;
		//$scope.acc.data.roleType  = roleTypeCheck($scope.acc.data.roletype);
		//Method for click edit add user button enable
		$scope.$emit('editaccordion','edit');
		if(encryptionService.decrypt(sessionService.get('role')) == "Organization Admin" && $scope.selectedFilterTab == "Organization Admin"){
			$scope.adminUserType = encryptionService.decrypt(sessionService.get('role'));
		}
        $scope.currentYear = new Date().getFullYear();
		$scope.adminType = cacheService.get('adminType');;
		$scope.userClass = ["", "", ""];
		if($scope.acc.data.profile_pic == ''){
			$scope.acc.data.profile_picurl   = 'dest/images/';
			$scope.acc.data.profile_pic      = 'noimage.png';
			$scope.acc.data.profile_pic_name = '';
		}else{
			$scope.acc.data.profile_pic_name = $scope.acc.data.profile_smlimage;
		}
	}
	/* Method to initialise controller */
	initializeController();

}]);       



 
advancePubapp.controller('activityanalyticsController', ['$scope', 'sfactory','$uibModal','$rootScope','$filter','$log','$stateParams','reportService','encryptionService', 'sessionService',function($scope,sfactory,$uibModal,$rootScope,$filter,$log,$stateParams,reportService,encryptionService,sessionService) {
    
    var reportDataReq,chartArray;
    //Method for activityanalytics controller
    function analyticscontroller(reportDataReq){
       var task = 'activityreports';
        inputreq = JSON.stringify(reportDataReq);
       sfactory.serviceCallReports(inputreq, task).then(function(response) {
            if(angular.isDefined(response)){
				if($filter('lowercase')(response.status) == 'success'){
					$scope.tableData.data =response.data.data;
					$rootScope.appLoader = false;
				}else{
					$rootScope.appLoader = false;
				}	
            }
			
        }, function(error) {
            var localTask = "activityreports";
            sfactory.localService(localTask).then(function(response) {
                $scope.tableData.data =response.data.data;
            }, function(error) {
            });
        });
    }
    
    //Method for acivity analytics controller
    $scope.getactivityAnalyticsData = function(){
        inputreq = JSON.stringify(reportDataReq);
        $scope.isAnalytics = true;$scope.userTypeCount = 0;
        if(!angular.isDefined($scope.activityanalytic.activity)){
            var task = 'activityanalytics';        
            sfactory.serviceCallReports(inputreq, 'activityanalytics').then(function(response) {                
                if(angular.isDefined(response.data)){
                    $scope.activityanalytic.activity= response.data;
                    loadCharts();                    
                    $rootScope.appLoader = false;
                }
            }, function(error) {
                var localTask = "activityanalytics";
                sfactory.localService(localTask).then(function(response) {
                    $scope.activityanalytic.activity= response.data;
                    loadCharts();                   
                }, function(error) {
                });
            });
        }else{
            loadCharts();
            
        }
            
    }
    function loadCharts(){
        $scope.activityAnalyse = $scope.activityanalytic.activity.activityanalyse;
        $scope.forumsDiscussions = $scope.activityanalytic.activity.forums_discussions;
        $scope.participantsForumsDiscussions = $scope.activityanalytic.activity.participants_forums_discussions;
    };
    /* Method to show filter modal  */
    $scope.chartModal = function(size, chartType, data, chartHeader,traffic) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'dest/templates/chartsModal.html',
            controller: 'modalController',
            size: size,
            resolve: {
                items: function() {
                    return {
                        chartType: chartType,
                        chartdata: data,
                        header: chartHeader, 
                        traffic:traffic,
                        dateRange:$scope.analyticsdaterangecustompick,
                        chartProperties:chartProperties
                    };
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    
    /*Method for update data based on calender*/
    function updateCharts(startDate,endDate){
          var requestData = {
                'start_date': startDate,
                'end_date': endDate,
              'group_id'  : reportDataReq.group_id,
                'user_id': reportDataReq.user_id
        };
        
        $scope.activeUserType = 'all';
        sfactory.serviceCallReports(requestData, 'activityanalytics').then(function(response) {
			if(angular.isDefined(response)){
				if($filter('lowercase')(response.status) == 'success'){
					$scope.activityAnalyse.change(response.data.activityanalyse);
                    $scope.activityAnalyse.x = response.data.activityanalyse.x;
                    $scope.activityAnalyse.series = response.data.activityanalyse.series;
					$scope.forumsDiscussions.change(response.data.forums_discussions); 
                    $scope.forumsDiscussions.x = (response.data.forums_discussions.x); 
					$scope.participantsForumsDiscussions.change(response.data.participants_forums_discussions); 
                    $scope.participantsForumsDiscussions.x = (response.data.participants_forums_discussions.x); 
					$rootScope.appLoader = false;
				}
			 }	
        }, function(error) {
        var localTask = "activityanalyticsupdate";
        sfactory.localService(localTask).then(function(response) {
            $scope.activityAnalyse.change(response.data.activityanalyse);
            $scope.activityAnalyse.x = response.data.activityanalyse.x;
            $scope.activityAnalyse.series = response.data.activityanalyse.series;
            $scope.forumsDiscussions.change(response.data.forums_discussions);            
            $scope.participantsForumsDiscussions.change(response.data.participants_forums_discussions);   
            $rootScope.appLoader = false;
            }, function(error) {
            });
        });
    }
        
    //Method for activities download
    $scope.activityanalyticdownload = function(task){
        userId  = reportDataReq.user_id;
        groupId = reportDataReq.group_id;
         if($scope.startDate && $scope.endDate){
            var start = new Date($scope.startDate).getFullYear()+"-"+(Number(new Date($scope.startDate).getMonth())+1)+"-"+new Date($scope.startDate).getDate();
            var end = new Date($scope.endDate).getFullYear()+"-"+(Number(new Date($scope.endDate).getMonth())+1)+"-"+new Date($scope.endDate).getDate();
            window.location = appUrl+task+"?start_date="+start+"&end_date="+end+"&user_id="+userId+"&group_id="+groupId+"&csv=1";
        }
        else{
            window.location = appUrl+task+"?user_id="+userId+"&group_id="+groupId+"&csv=1";
        }
    }
    $scope.downloadbtn = function(){
        $scope.isActive_down = !$scope.isActive_down;
    }
    $scope.closedownload = function(){
        $scope.isActive_down = false;
    };
    $scope.reportdownloadbtn = function(){
        $scope.isActive_downreport = !$scope.isActive_downreport;
    }
    $scope.reportclosedownload = function(){
        $scope.isActive_downreport = false;
    };
    
    $scope.saveChartObj = function(response){
        var chartObject =_.find(chartArray, function(obj){ return obj.title.textStr  == response.title.textStr;});
        if(angular.isDefined(chartObject)){
            chartArray[chartArray.findIndex(x => x.title.textStr === response.title.textStr)] = response;
        }
        else{
            chartArray.push(response);
        }
    };
    
    $scope.export = function(download){
        reportService.exportCharts(chartArray,{type:download});
    };
    $scope.usertypefilterNew = function(usertype){ 
        if($scope.userTypeCount == 0){
            if(usertype == "Guest"){
                $scope.usertypefilter("Registered");
                $scope.usertypefilter(usertype);
            }else if(usertype == "Registered"){
                $scope.usertypefilter("Guest");
                $scope.usertypefilter(usertype);
            }
        }else{
            $scope.usertypefilter(usertype);
        }
    };
    $scope.usertypefilter = function(usertype){ 
        var copyChart = {};copyChart2 = {};copyChart3 = {};
        angular.copy($scope.activityAnalyse,copyChart3);
        copyChart2 = $scope.activityAnalyse.series;       
        
        //filteredGoal = _.where($scope.activityAnalyse.series, {"usertype" : usertype});
        if(usertype != "all"){
            for(i=0;i<copyChart2.length;i++){            
                if(copyChart2[i].usertype == usertype){ 
                   for(j=0;j<copyChart2[i].data.length;j++){
                       copyChart2[i].data[j] = 0;
                   }
                }            
            }   
            filteredGoal = copyChart2;
        }else{
            filteredGoal = $scope.activityAnalyse.series;
        }
        
        copyChart.series = filteredGoal;         
        copyChart.x=$scope.activityAnalyse.x;
        copyChart.title=$scope.activityAnalyse.title; 
        $scope.activeUserType = usertype;
        updateStackBarCharts(copyChart,copyChart3);        
    };
    function updateStackBarCharts(response1,response2){
        $scope.activityAnalyse.change(response1);
        $scope.activityAnalyse = response2;
        $scope.userTypeCount++;
    }
    //Method for initilize controller 
    function initializeactivityController(){
        var activityanalyticsscope = angular.element(jQuery("#adminLanding")).scope();
        
        reportDataReq = {
            'group_id'  : encryptionService.decrypt(sessionService.get('grp_id')),            
            'user_id': encryptionService.decrypt(sessionService.get('userId'))
        };
        analyticscontroller(reportDataReq);
        $scope.activityanalytic = {};chartArray=[];
        $scope.activityanalytic.vmDate = Last7Days().split(',')[Last7Days().split(',').length-1]+" To "+Last7Days().split(',')[0];
        $scope.activeUserType = 'all';
        $scope.analyticsdaterangecustompick = $scope.activityanalytic.vmDate;
        $scope.dateoptions={
            "locale": {
              "format": "MM-DD-YYYY",
            },
            showDropdowns:true,
            autoApply:true,
            maxDate : new Date(),
            eventHandlers: {
                'apply.daterangepicker': function(ev, picker) {
                    $scope.analyticsdaterangecustompick = ev.model.startDate.format('MM-DD-YYYY')+ ' To '+ev.model.endDate.format('MM-DD-YYYY');
                    updateCharts(ev.model.startDate.format('MM-DD-YYYY'),ev.model.endDate.format('MM-DD-YYYY'));                    
                }
            }
        };
        $scope.tableData = {
            pageName: 'activityreports',
            isFilterbtns: false,
            isSearch: true,
            isPagination: true,
            sortType: 'firstname',
            isCheckboxhide: true,
            headers: [{name: 'Media Type',bind_val: 'media_type',isSortable: true},
                {name: 'No. of enrolled users',bind_val: 'enrolled_count',isSortable: true},
                {name: 'No. of visits',bind_val: 'no_of_visit',isSortable: true},
                {name: 'No. of shares',bind_val: 'no_of_shares',isSortable: true},
                {name: 'Time Spent',bind_val: 'time_spent',isSortable: true}
            ],
            data: []
        };
        chartProperties=[
            {
                chartTitle:"Content Consumption Based On MediaType",
                taskUrl :"activitycontentconsumption",
                key:"activityanalyse",
                type:"stackbar"
            },
            {
                chartTitle:"No. of discussions in all Forums",
                taskUrl :"forumdiscussion",
                key:"forums_discussions",
                type:"line"
            },
            {
                chartTitle:"No. of participants in all Forums",
                taskUrl :"nofparticipationforumdiscussion",
                key:"participants_forums_discussions",
                type:"line"
            }
        ];
    }
    //Method for initilize controller
    initializeactivityController();
    
}]);
advancePubapp.controller('addStudentModalController', ['$scope', 'sfactory', '$rootScope', 'taskService','$state','$mdDialog','dataforUserEnrollement','$filter','sessionService','paginationDatamanagement', '$timeout',/*'$interval',*/ function($scope, sfactory, $rootScope, taskService,$state,$mdDialog,dataforUserEnrollement,$filter,sessionService,paginationDatamanagement,$timeout/*, $interval*/) {
     
    var tasks,templatepath,selectedStudents,usersEnrollapi={},usernamePrev,usernameValidation,emailPrev,emailValidation,phonicsClasstasks,classDetailstasks,addStdentTasks;
    var selectedUsersmodal = []; 
 

    /* Method on change of username */
    $scope.onUsernameChange = function(){
       inputReq = {username : $scope.user.username};
        sfactory.serviceCall(inputReq,addStdentTasks.validateUsername,'listDetails',true).then(function(response) {
            $scope.usernamexist = !($filter('lowercase')(response.status) == 'success')
        }, function(error) {                
        });
    };
       
    
    /*$scope.isAdult = function(){
        return ($scope.currentYear - $scope.user.birth_year)>14;
    };*/
    
    /* Method on change of email */                                                                                          
    $scope.onEmailChange = function(){
		if(angular.isDefined($scope.user.email1) && $scope.user.email1 != ""){
		   inputReq = {email1 : $scope.user.email1,userid:""};
			sfactory.serviceCall(JSON.stringify(inputReq),addStdentTasks.validateEmail,'listDetails',true).then(function(response) {
				$scope.useremailexist = !($filter('lowercase')(response.status) == 'success')
			}, function(error) {                
			});
		}	
    };
     
    /*Function to update button changes from custom column directive*/
 	$scope.buttonUpdate = function(response){
		$scope.ischeckedall = response.ischeckedall;
		$scope.parentprevStatus   = response.parentprevStatus;
        (response.id) ? selectedStudents.push(response.id) : selectedStudents = [];
		if(selectedStudents.length){
			if(response.status){
			   selectedStudents = _.uniq(selectedStudents);
			   $scope.istoberemoved = false;
			}
			else{
				if(response.prevStatus != 'add'){
					selectedStudents = _.without(selectedStudents,response.id);
					$scope.istoberemoved = false;
				}
				else{
					selectedStudents = _.uniq(selectedStudents);
					$scope.istoberemoved = true;
				}
			}
		}        
        $scope.cachePagination = selectedStudents;
        paginationDatamanagement.selectedItems = $scope.cachePagination;
        $scope.studentsToadd = selectedStudents.length ? selectedStudents.join() : '';
        if(response.unchecked && response.totalRecord) {
            response.unchecked === response.totalRecord ? $scope.studentsToadd = '' : '';
        }
		
		/* Method for count reached 100 for add new student or remove student*/
		if($scope.parentprevStatus == 'add') {
			$scope.enrollstudentlen = $scope.existingUserlist.paginateData.total_matched_records + dataforUserEnrollement.classusercnt;
		}else if($scope.parentprevStatus == 'remove'){
			$scope.enrollstudentlen = dataforUserEnrollement.classusercnt;
		}else{
			if(response.status){
				$scope.enrollstudentlen = (angular.isDefined($scope.enrollstudentlen)) ? $scope.enrollstudentlen+1 : dataforUserEnrollement.classusercnt + 1;
			}else{
				$scope.enrollstudentlen = (angular.isDefined($scope.enrollstudentlen)) ? $scope.enrollstudentlen-1 : dataforUserEnrollement.classusercnt - 1;
			}
		}
    }
    
	
	
    /*Function to revert selected students from class*/
  	$scope.cancelSelections = function(){
		if(selectedUsersmodal.length){
			$mdDialog.hide({'isExisting':true,'data':selectedUsersmodal});
		}else{
			$mdDialog.cancel();
		}
        $scope.cachePagination = ""; //clearing cache on cancel 
        paginationDatamanagement.selectedItems =[];
        $scope.ischeckedall = false;
    }
	
	/* Method for empty form */
	function emptyUserForm(){
		$scope.user ={};
		$scope.useremailexist = false;
		$scope.usernamexist   = false;
	}
	
    /**Add new student for displaying create form and hide the existing student list*/
    $scope.createNewStudent = function(value){
		if($scope.enrollstudentlen >= 100){
			var banerData = {'message':"Already Maximum count 100 reached",'showBaner':true,'banerClass':'alert-danger'}; 
			$scope.alertBaner = banerData;
		}else{
			emptyUserForm();
			if(value == 1) {
				$scope.newstudent = true;
				$scope.multistudent = false;
			} else if($scope.parentUserRole) {   
				$scope.cancel();
			} else {
				$scope.newstudent = false;
			} 
		} 
    };
    /**Add new student for displaying create form and hide the existing student list*/
    $scope.createMultiStudent = function(value){
		if($scope.enrollstudentlen >= 100){
			var banerData = {'message':"Already Maximum count 100 reached",'showBaner':true,'banerClass':'alert-danger'}; 
			$scope.alertBaner = banerData;
		}else{
			  if(value == 1) {
				$scope.csvextensionerror = "";
				$scope.csvFilename       = "";
				$scope.multistudent = true;
				$scope.newstudent = false;
			} else if($scope.parentUserRole) {   
				$scope.cancel();
			}else{
				$scope.multistudent = false;
			}        
		}
    };
    
   /* Method on change of email */                                                                                          
    $scope.validateEmail = function(){
        var dataRequest = {};
        $scope.useremailexist = false;
        if(angular.isDefined($scope.user.email1) && ($scope.user.email1 !== "")) {
			dataRequest = {email1:$scope.user.email1,userId:""};
            sfactory.serviceCall(dataRequest,addStdentTasks.validateEmail,"listDetails",true).then(function(response){
				if(angular.isDefined(response)){
					$scope.useremailexist = !($filter('lowercase')(response.status) == 'success');
				}
            },function(){
            });
       }
    };
    
    /**Exporting mulituser form*/
    $scope.export = function(){
		window.location = siteURL+'media/com_sommer/templates/site/MultiUser-Upload-Template.xlsx';
    };
    /* Method for upload csv */
    $scope.uploadcsv   = function(file){ 
        $scope.csvFilename       = "";
        if(file){
            $scope.fileExt = file.name.split(".").pop();
            if($scope.fileExt == "CSV" || $scope.fileExt == "csv" || $scope.fileExt == "xlsx"){
                 $scope.csvFile      = file;
                 $scope.csvFilename  = $scope.csvFile.name;
                 $scope.csvextension = false;
            }else{
                 $scope.csvextensionerror = "Please choose csv file";
                 $scope.csvextension      = true;
                 $scope.csvFilename       = "";
            }
        }
    }
	
	/* Method callback for close the baner alert message */
    $scope.closeBaner = function(){ 
        $scope.alertBaner.showBaner = false;
    }
	
	/* Method for banner image */
    $scope.$on('emitFromDirectiveBaner',function(event,args){
        $scope.alertBaner = args.alertBaner;
    });
	
    /*Method for upload csv file */
    
    $scope.csvForm  = function(){
        var csvFile = $scope.csvFile;
        if($scope.csvFilename === "" || (typeof($scope.csvFilename) == "undefined")){
             $scope.alertBaner = {message:'Please choose a file to upload',showBaner:true,'banerClass':'alert-danger'};
        }else{ 
            var formObj = new FormData();
            formObj.append('file',$scope.csvFile);
            //formObj.append('classmasterid',dataforUserEnrollement.classmasterid);
			var formToken = {'token':{'classmasterid':dataforUserEnrollement.classmasterid},'formObj':formObj}; 
           // var task    = "userdashboard.userImport";
            sfactory.serviceCallFormData(formToken,addStdentTasks.multipleuserImport,'listDetails').then(function(response){				
                if($filter('lowercase')(response.status) == 'success'){
					bulkResponse = {'data':response.bulkData.data};
					$scope.classusercnt = response.bulkData.classusercnt;
                   (response.bulkData.data.length >= 1)?$scope.multistudent = false: '';
					var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'}; 				
                    if(!$scope.parentUserRole){
                        if(selectedUsersmodal.length){
                            selectedUsersmodal = selectedUsersmodal.concat(bulkResponse.data);
                        }
                        else{
                            selectedUsersmodal.push(bulkResponse.data);
                        }
						$scope.alertBaner = banerData;
                        $scope.newstudentAdded = true;
                    }
                    else{
                        if(bulkResponse.data.length){
                            $mdDialog.hide({'data':bulkResponse.data,'banerData':banerData});
                        }
                        else{
                            var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
                            $mdDialog.cancel(banerData);
                        }
                    }
                } else {
                    var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
					$scope.alertBaner = banerData;
                }
                $scope.csvFilename  = "";
                $rootScope.appLoader = false;
            },function(error){
                $rootScope.appLoader = false;
            });
        }        
    }
    //table push data
    function addimporttable(item){
        return { 
            name        : item.firstname,
            lastname    : item.lastname,
            username    : item.username,
            roleType    : item.roleType,       
            id          : item.id,
			lastvisitDate : "NA", 
            roletype    : item.roletype,
            groupname   : item.groupname,
            registerdate : item.registerdate,
            phone_no    : item.phone_no,  
            email      : item.email,
            email1      : item.email,
            firstname   : item.firstname,
            dob   : item.dob,
            profile_picurl  : '',
            profile_pic     : '',        
            password        : '',        
            address     : '',
            block       :  item.block
        }
    }
    /*Function to add students to specified class*/
    $scope.enrollStudents = function(){
		
		//Dynamic messages changes
		
		if(($scope.enrollstudentlen && $scope.enrollstudentlen > 100) || ($scope.classusercnt && $scope.classusercnt >= 100)){
			existingStudentAdd =  (angular.isDefined($scope.studentsToadd) && $scope.studentsToadd.search(',')) ? $scope.studentsToadd.split(',').length: 1;
			if(existingStudentAdd && $scope.classusercnt){
				message = "Already this class have "+$scope.classusercnt+" Students.From Existing list you added " +existingStudentAdd+" Students.";
			}else if(existingStudentAdd){
				message = "Maximum limit 100";
			}else if($scope.classusercnt){
				message = "Maximum limit 100";
			}else{
				message = "Maximum limit 100";
			}
			var banerData = {'message':message,'showBaner':true,'banerClass':'alert-danger'}; 
			$scope.alertBaner = banerData;
		}else{
			if(!$scope.newstudentAdded) {
				if(dataforUserEnrollement.parentPage == 'class'){
					/*Properties for add students to class*/
					usersEnrollapi.task = phonicsClasstasks.addExistingstudentstoclass;
					usersEnrollapi.req = JSON.stringify({'classmasterid':dataforUserEnrollement.classmasterid,'classuser':$scope.studentsToadd,'ischeckall':$scope.ischeckedall,'istoberemoved':$scope.istoberemoved});
				}
				else if(dataforUserEnrollement.parentPage == 'group'){
					/*Properties for add students to group*/
					usersEnrollapi.task = phonicsClasstasks.addExistingstudentstogroup;
					usersEnrollapi.req = JSON.stringify({'classgroupid':dataforUserEnrollement.classgroupid,'groupuser':$scope.studentsToadd,'ischeckall':$scope.ischeckedall,'istoberemoved':$scope.istoberemoved});
				}
				//console.log($scope.UserEnrollementdata,"data for user addition");
				sfactory.serviceCall(usersEnrollapi.req,usersEnrollapi.task,'listDetails').then(function(response){
					if($filter('lowercase')(response.status) == 'success'){
						var dataTosend = $scope.studentsToadd.split(',');
						$mdDialog.hide({'isExisting':true,'message':response.message});
					}else{
						//$mdDialog.hide({'isExisting':true,'message':response});
						$scope.alertBaner = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'}; 
					}	
					$rootScope.appLoader = false;
				},function(error){
					var localTask = "classUserlist";
					sfactory.localService(localTask).then(function(response){

					},function(error){
					});
				});
			} else {
				$mdDialog.hide({'isExisting':false,'data':selectedUsersmodal});
			}
		}
    }
    
    $scope.cancelModel = function(){
        if($scope.multistudent){
            $scope.createMultiStudent(2);
        }
        else if($scope.newstudent){
            $scope.createNewStudent(2);
        }
        else if(!$scope.newstudent && !$scope.multistudent){
            $scope.cancelSelections();
        }
    };
    
    /**Add new student*/
    $scope.createUser = function(){
        userValues = {            
            "firstname" : $scope.user.firstname,
            "lastname" : $scope.user.lastname,
            "phone_no" : $scope.user.phone_no,
            "roaming" : $scope.user.roaming ? $scope.user.roaming : false,
            "username" : $scope.user.username,
            "email1" : $scope.user.email1,
            "address" : $scope.user.address ? $scope.user.address : "",
            "dob" : $scope.user.dob ? $scope.user.dob : "",
            "gender" : $scope.user.gender,
            "classmasterid" : dataforUserEnrollement.classmasterid
        }; 
		
      sfactory.serviceCall(JSON.stringify(userValues),addStdentTasks.addnewstudent,'listDetails').then(function(response) {
			if($filter('lowercase')(response.status) == 'success'){
                $scope.newstudentAdded = true;
				//$scope.createnewstudentcheck = true;	//because if form submit but class not added,in the case if i cancel the form need to call service
                insertData = {
                        name        : $scope.user.firstname+' '+$scope.user.lastname,
                        lastname    : $scope.user.lastname,
                        username    : $scope.user.username,
                        roleType    : "Student",       
                        id          : response.data.id,
                        roletype    : "5",
                        classname   : sessionService.get('classname'),
                        groupname   : response.data.groupname,
                        gender      : $scope.user.gender,
                        registerdate : response.data.registerdate,
                        phone_no    : $scope.user.phone_no,  
                        email      : $scope.user.email,
                        email1      : $scope.user.email,
                        firstname   : $scope.user.firstname,
					 	lastvisitDate : "NA",
                        dob   : '',
                        profile_picurl  : '',
                        profile_pic     : '',        
                        password        : '',        
                        address     : '',
                        block       :  true
                    }
				var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
                if(!$scope.parentUserRole){             
					$scope.alertBaner = banerData;
                    selectedUsersmodal.push(insertData);
					$scope.classusercnt = response.data.classusercnt;
                    $scope.newstudent = false;
                } else if($scope.parentUserRole){
                    $mdDialog.hide({'isExisting':false,'data':insertData,'banerData':banerData});                    
                }
			}
		  else{
			  var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
			  if(!$scope.parentUserRole){   
				  	$scope.alertBaner = banerData;
                } else if($scope.parentUserRole){                    
                    $mdDialog.cancel({'data':[],'banerData':banerData});                    
                }
		  }
			$rootScope.appLoader = false;
		}, function(error) {
			var localTask = "usernameExistCheck";
			sfactory.localService(localTask).then(function(response){						
				
			},function(error){
			});
		});  
    }
    /* Funtion to intialize user object for manipulating user list table */
    function setuserobj(){
        var userTask;        
        $scope.parentUserRole = false;
        $scope.existingUserlist = {
            paginateData:null,
            paginationAPI:'',
            paginateParams:'',
			pageName:'classExistingstudents',
            isFilterbtns:true,
            isSearch:true,
            isPagination:true,
            isroletypedisplay:true,            
            headers:[
                {name:'Name',bind_val:'name',isSortable:true},
                {name:'User Name',bind_val:'username',isSortable:true},
                {name:'class',bind_val:'classname',isSortable:true,isActionColumn: true,columnName: "addtooltippopup"},
                {name:'Group',bind_val:'classgroupname',isSortable:true,isActionColumn: true,columnName: "addtooltippopup"},
                {name:'Last login',bind_val:'lastvisitDate',isSortable:true},
                {name:'Actions',bind_val:'actions',isSortable:false,isActionColumn:true,columnName:"addToclass",headcolumnName:true,'isClass':dataforUserEnrollement.parentPage == 'class' ? 'Add' : 'Add'}                 
            ],            
            data:[]
        };
        if(dataforUserEnrollement.parentPage == 'class'){
            if(dataforUserEnrollement.parentState == 'existing'){
                userTask = phonicsClasstasks.getExistingstudentslistExistingClass; 
                existingUsersinputreq = JSON.stringify({classmasterid: dataforUserEnrollement.classmasterid,'itemsPerpage':10,'currentPage':1,'sortOrder':'desc','sortCoulmn':'name'});
            }
            else{
                userTask = phonicsClasstasks.getExistingstudentslistClass; 
                existingUsersinputreq = JSON.stringify({'itemsPerpage':10,'currentPage':1,'sortOrder':'desc','sortCoulmn':'name'});
            }                 
        }
        else if(dataforUserEnrollement.parentPage == 'group'){
            if(dataforUserEnrollement.parentState == 'existing'){
                userTask = phonicsClasstasks.getExistingstudnetslistClass;   
                existingUsersinputreq = JSON.stringify({classgroupid: dataforUserEnrollement.classgroupid,'itemsPerpage':10,'currentPage':1,'sortOrder':'desc','sortCoulmn':'name'});
            }
            else{
                userTask = phonicsClasstasks.getExistingstudnetslistGroup; 
                existingUsersinputreq = JSON.stringify({masterclassid: dataforUserEnrollement.classmasterid,'itemsPerpage':10,'currentPage':1,'sortOrder':'desc','sortCoulmn':'name'});
            }            
        }
        $scope.existingUserlist.paginationAPI = userTask;        
        sfactory.serviceCall(existingUsersinputreq,userTask,'listDetails').then(function(response){
            //user list response comes here...
            $scope.modalData.bool = true;
            console.log("response   ->",response);
            $scope.existingUserlist.data = response.data;
            $scope.existingUserlist.paginateData = response.paginateData ? response.paginateData : {};
            $scope.existingUserlist.paginationAPI = userTask;
            $scope.existingUserlist.paginateParams = JSON.parse(existingUsersinputreq);
            $rootScope.appLoader = false;
        },function(error){            
            var localTask = "classUserlist";
            sfactory.localService(localTask).then(function(response){
                $scope.existingUserlist.data = response.data.data;
                $scope.existingUserlist.paginateData = response.data.paginateData;
            },function(error){
            });
        });

    };
    
    function parentUser(type) {
        $rootScope.appLoader = false;
        $scope.parentUserRole = true;
        if (type === 'new') {
            $scope.newstudent = true;
            $scope.multistudent = false;
        } else if(type === 'multiple') {
            $scope.newstudent = false;
            $scope.multistudent = true;
        }
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
      $scope.csvextensionerror = "";
      $scope.csvFilename       = "";
    };
    
    $scope.hidepopup = function () {
        $scope.showDown = false;
    };
    
    $scope.renderimage = function () {
        $scope.blockingObject.render(function (dataURL) {
            $scope.dataURLsa = dataURL;
            $scope.upload(dataURL);
            if (dataURL.length) {
                $scope.showDown = false;
            }
        });
    };
    
    /* Method for image upload */
    $scope.upload = function(file) {
        $scope.uploadedFile = file;
    };
    
    var handleFileSelect = function (evt) {
        $scope.showDown = true;
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {
                $scope.myImage = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };
    
    $scope.addStudents = function(){
        $mdDialog.hide();
    };
    
	var bulkResponse = {};
    /* Method to initialize Controller */
    function initailizeController() {
        phonicsClasstasks = taskService.getTasks("phonicsClassController");            
        classDetailstasks = taskService.getTasks("classDetailsController");
        addStdentTasks    = taskService.getTasks("addStudentModalController");
        $scope.cachePagination = paginationDatamanagement.selectedItems;
		$scope.roleType = sessionService.get('role');
        $rootScope.appLoader = true;
        templatepath = templateURL+"dest/templates/";
        $scope.newstudent = $scope.multistudent = false;
        dataforUserEnrollement.hasOwnProperty('classmasterid') ? setuserobj() : parentUser(dataforUserEnrollement.parentState);
        selectedStudents = [];
        $scope.modalData = {'bool':false};
        $scope.parentData = dataforUserEnrollement;
        $scope.studentsToadd = '';
        $scope.showDown = false;
        $scope.myCroppedImage = '';
        $scope.myImage = '';
        $scope.blockingObject = {
            block: true
        };
        $scope.obj = {};
        setTimeout(function () {
            angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
        });
        $scope.user = {};
        $scope.usernamexist =  $scope.useremailexist = false;
        $scope.newMultiUserData = {"data":[]};
        $scope.currentYear = new Date().getFullYear();
        $scope.newstudentAdded = false;
    };
        
    initailizeController();
}]);
advancePubapp.controller('admincontentController',['$scope', function($scope){
}]);
advancePubapp.controller('adminController',['$scope','sfactory','$state','$rootScope','$stateParams','encryptionService','sessionService',function($scope,sfactory,$state,$rootScope,$stateParams,encryptionService,sessionService){ 
        
    /* Method to login into admin Controlpanel page */ 
    $scope.submit_login_admin=function(){
		if(angular.isDefined($scope.admin.admin_username) && angular.isDefined($scope.admin.admin_password) && $scope.admin.admin_username != '' && $scope.admin.admin_password != ''){
			var serRequest = JSON.stringify({username:$scope.admin.admin_username ? $scope.admin.admin_username : '',password:$scope.admin.admin_password ? encryptionService.encrypt($scope.admin.admin_password) : ''});
			var task = "adminLogin";
			$scope.appLoader = true;
			sfactory.loginServiceCall(serRequest,task,'adminPage').then(function(response){
				if(response.status=='success'){
					
					sessionService.set('session_Id',encryptionService.encrypt(response.data.sessionId));  
                    sessionService.set('sessionExpired',encryptionService.encrypt(String(response.data.sessionExpired)));
					$scope.appLoader = false;
					$scope.admin ={sessionedAdmintype:response.data.adminType ? response.data.adminType : adminType, grpId:response.data.groupTypeId ? response.data.groupTypeId : null,loggedBy:response.data.loggedBy} ;
					$scope.alertBaner = {message:response && response.message && response.message != '' ? response.message : "Authenticated Successfully",banerClass:'alert-success',showBaner:true};
					$scope.isLoggedin = true;
					if(response.data.adminType && response.data.adminType.toLowerCase() == 'superadmin'){
						$state.go('groupdashboard',{isLoggedin:true,location: false});
					}
					else{
						var serRequest = {};
						var task = "loggedUserdetails";
						sfactory.serviceCall(serRequest,task,'adminPage').then(function(response){
							 if(response.status.toLowerCase() == 'success'){
                                 /*requestcheck= {
                                    'group_id'  : response.data.groupTypeId,
                                    'sessionId': response.data.sessionId
                                };
                                sfactory.serviceCallReports(requestcheck,'setreportssession').then(function(response){
                                    if(response.status=='success'){                        
                                        $state.go('adminLanding.usermanagement',{loggedUserDetails:response.data,location: false});  
                                    }

                            },function(error){
                                
                            });*/
                                 sessionService.set('userId',encryptionService.encrypt(String(response.data.userId)));
                                 sessionService.set('role',encryptionService.encrypt(String(response.data.roleType)));
                                 $state.go('adminLanding.usermanagement',{loggedUserDetails:response.data,location: false});
                                 $rootScope.appLoader = false;
				          }
							 
						 },
						  function(){
							  $rootScope.appLoader = false;
						 });
					}

				}else{
					$scope.admin = {};
					$scope.appLoader = false;
					$scope.alertBaner = {message:(response && response.message && response.message != '' ? response.message : 'check username & password'),banerClass:'alert-danger',showBaner:true};
				}
				$rootScope.appLoader = false;
			},function(error){
				$scope.appLoader = false;
			});
		}
    }
        
    /* Method to show/hide password */
    $scope.showPwdChange = function(){
        if($scope.showPwd == 'text') $scope.showPwd = 'password';
        else if($scope.showPwd == 'password') $scope.showPwd = 'text';
    };
    
    /* Method to reset password */
    $scope.forgotPwd = function(){
      $scope.isForgotpwd = true;
    };
    
    /* Method to navigate to admin page */
    $scope.setbackTosignin = function(event){
        event.preventDefault(); 
        $scope.isForgotpwd = false;
        $scope.admin.adminMail = "";
    };
    
    /* Method to reset admin password */
    $scope.resetAdminPwd = function(){
        var forgotPwdRequest = JSON.stringify({email:$scope.admin.adminMail});
        var task = "register.forgotpassword"; 
        $scope.appLoader = true;
        sfactory.loginServiceCall(forgotPwdRequest,task).then(function(response){
            if(response.status=='success'){
                $scope.alertBaner = {message:response && response.message && response.message != '' ? response.message : "Password reset link sent to mail successfully",banerClass:'alert-success',showBaner:response.message ? true : false};
                $scope.isForgotpwd = false;
                
            }else{
                $scope.alertBaner = {message:(response && response.message && response.message != '' ? response.message : 'Incorrect username/email id.'),banerClass:'alert-danger',showBaner:response.message ? true : false};                
            }
			$rootScope.appLoader = false;
            $scope.appLoader = false;
        },function(error){
           
            $scope.appLoader = false;
        });
    };
    
    /* Method to close alert baner */
    $scope.closeBaner = function(){
        $scope.alertBaner.showBaner = false;
    };
        
 	function initializeController(){
		//Method for local calls only
		if(typeof(siteAdminURL) == "undefined"){
			$scope.isLoggedin = true;
			var serRequest = {};
			var task = "loggedUserdetails";
			sfactory.localService(task).then(function(response){
				 if(response.data.status.toLowerCase() == 'success'){
                     sessionService.set('userId',encryptionService.encrypt("1"));
                     sessionService.set('role',encryptionService.encrypt(response.data.data.data[0]['roleType']));
					if(response.data.data.data[0]['adminType'] == 'superAdmin'){                        
						$state.go('groupdashboard',{loggedUserDetails:response.data,location: false}); 
					}else if(response.data.data.data[0]['adminType'] == 'groupAdmin'){
						$state.go('adminLanding.usermanagement',{loggedUserDetails:response.data,location: false}); 
					} 
					
				 }
				 $rootScope.appLoader = false;
			 },
			  function(){
				  $rootScope.appLoader = false;
			 });
		}	
        if($stateParams.isLoggedin){
          $scope.isLoggedin = $stateParams.isLoggedin;
        }
        $scope.showPwd = "password";
        $scope.isSuccessLogin = false;
        $scope.admin = {};
        $scope.loginImage = templateURL+"dest/images/loginlft.png";
    };
    
    initializeController();
}]);
advancePubapp.controller('adminlandingController',['$scope','sfactory','$state','$mdSidenav', '$log','$stateParams','$rootScope','$timeout','$mdDialog','$filter', '$mdToast','cacheService','sessionService','encryptionService','sharedService','$interval','messagingService',function($scope,sfactory,$state, $mdSidenav ,$log,$stateParams,$rootScope,$timeout,$mdDialog,$filter,$mdToast,cacheService,sessionService,encryptionService,sharedService,$interval,messagingService){
   
    var stateName,breadcrumblist;
	
    /* Method callback for close the baner alert message */
    $scope.closeBaner = function(){
        $scope.alertBaner.showBanercls = false;
        $scope.$emit('switchMenu',{list:$scope.listObj});
    };
    
    /* Method to capture baner call back from child directives */
    $scope.$on('emitFromDirectiveBaner',function(event,args){
        $scope.alertBaner = args.alertBaner;
        if(angular.isDefined(args.list)) $scope.listObj = args.list;
    });
    
    /* Method for back to notification */
    $scope.backtomessageNotification = function(){
        $scope.mailnotify = false;
    };
    /** Method for reloading pages for groupadmin when user click logo / breadcrumb */
    $scope.reloadingpage = function(){        
		if($state.current.name === "adminLanding.usermanagement"){
			$state.reload();
		}else{
			$scope.breadcrumbList= [];
			$scope.breadcrumbList.push('User Management');
			menuReset();
			$state.go("adminLanding.usermanagement",{isLoggedin:true,location: false});			
		}        
    };
    /* Method to update menu template based on the menu list */
 	$scope.getContentTemplate = function(list,val){
        if(list.childList) list.showChild = true;
        if(list.innerchildList) list.showinnerChild = true;
		if(val && !list.childList && !list.innerchildList){
			list.childList ? list.childList.childs[0].selected = true : list.selected = true;
			list.innerchildList ? list.innerchildList.innerchilds[0].selected = true : list.selected = true;
		}		
        $scope.adminContentLandingPage = list.childList ? list.childList.childs[0].name.replace(/\s+/g,"").toLowerCase() : list.name.replace(/\s+/g,"").toLowerCase();
        if(list.innerchildList) {
            $scope.showinnerChild = true;
            list.innerchildList ? list.innerchildList.innerchilds[0].selected = true : list.selected = true;
            $scope.adminContentLandingPage = list.innerchildList ? list.innerchildList.innerchilds[0].name.replace(/\s+/g,"").toLowerCase() : list.name.replace(/\s+/g,"").toLowerCase();
        }
		var path = "adminLanding."+$scope.adminContentLandingPage;
		$state.go(path,{location: false});
    };

    /* Method for home icon redirection */
    $scope.breadcrumsicon = function(){ 
		cacheService.empty();
        $state.go('groupdashboard',{isLoggedin:true,location: false});
    };
	
	/* Method for my profile edit */
	$scope.myprofileedit = function(){
		statename = 'myprofile';
		staticbreadcrumblist();
        sfactory.bufferedData.types = "my";
		$state.go("adminLanding."+statename,{location: false});
	};
    
    /* Method for my admin message */
	$scope.adminmessage = function(){
		statename = 'adminmessage';
		staticbreadcrumblist();
		$state.go("adminLanding."+statename,{location: false});
	};
	
	function staticbreadcrumblist(){
		$scope.breadcrumbList=[];
		$scope.breadcrumbList.push('Myprofile')
	};

     $scope.mouseovr = function(){
         $scope.isActive = false;
     };
    
     $scope.mouselv = function(){
         $scope.isActive = true;
     };
    
    $scope.isActive = false;
    $scope.isMenu_active = false;
    
    $scope.activeButton123 = function() {
        $scope.isActive = !$scope.isActive;
        $scope.isMenu_active = !$scope.isMenu_active;
    };
    
    //method for toggle child menu
	$scope.toggle_child_menu = function($scope) {
        $scope.isActive1 = !$scope.isActive1;
    };
    
    //method to hide child medu on mouseleave event
     $scope.hideThisDiv = function () {
        $scope.isActive1 = false;
    };
    $scope.clocsesubmenu = function () {
        $scope.isActive1 = false;
    };
    /* Method to logout admin */
    $scope.logoutAdmin = function(){
        $scope.mailnotify = false;
        var logoutRequest = {};
        var task = "adminLogout";
        sfactory.serviceCall(logoutRequest,task,'adminPage').then(function(response){
            sessionService.clear();
            $state.go('adminLogin',{isLoggedin:false,location: false}); 
			$rootScope.appLoader = false;
			cacheService.empty();
            sessionService.emptyData('currentstate');
        },function(logoutError){
        });
    };
    
    /* Method to toggle menu based on the resolution */
    $scope.slideMenu = function(navID){
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
    };
    
    /* Method to check whether the menu has child*/
    $scope.hasChild = function(index){
        $scope.menu.showChild = (angular.isDefined($scope.menuList[index].childList));
    };
    
    /* Method to check whether the menu has inner child*/
    $scope.hasInnerChild = function(index,parentIndex){        
        $scope.menu.showInnerChild = (angular.isDefined($scope.menuList[parentIndex].childList)) ? (angular.isDefined($scope.menuList[parentIndex].childList.childs[index].innerchildList) ? true : false) : false;
    };
    
    /* Method to remove menu on mouse leave*/
    $scope.hideChildMenus = function(){
        $scope.menu ={showChild:false,innerchilds:false};
    };
    
    /* Method to change state */
    function loadState(stateName,breadcrumblist){
        $scope.breadcrumbList = breadcrumblist;
        resetSelection();
        $scope.menu ={showChild:false,innerchilds:false};
        $state.go("adminLanding."+stateName,{location: false});
    };
    
    /* Method to change state if menu has no child */
    $scope.changeState = function(index){
        if(!$scope.menu.showChild){
            if(($scope.menuList[index].name === 'Dashboard')){
				cacheService.empty();
                $state.go('groupdashboard',{isLoggedin:true,location: false});
            }
            else{
                stateName = $filter('lowercase')($scope.menuList[index].name.replace(/[\s]/g, ''));
                breadcrumblist = ($scope.menuList[index].name === 'Survey') ? [$scope.menuList[index].name+ ' Template'] : [$scope.menuList[index].name];
                loadState(stateName,breadcrumblist);
                $scope.menuList[index].selected = true;
            }
        }
        sessionService.emptyData('currentstate');
    };
    
    /* Method to change state if menu has child */
    $scope.changeChildState = function(index,parentIndex){
        stateName = $filter('lowercase')($scope.menuList[parentIndex].childList.childs[index].name.replace(/[\s]/g, ''));
        breadcrumblist = [$scope.menuList[parentIndex].name,$scope.menuList[parentIndex].childList.childs[index].name];
        loadState(stateName,breadcrumblist);
        $scope.menuList[parentIndex].selected = true;
        $scope.menuList[parentIndex].childList.childs[index].selected = true;
    };
  	
    /* Method to change state if menu has inner child */
    $scope.changeInnerChildState = function(index,parentIndex,oldParentIndex){
        stateName=$filter('lowercase')($scope.menuList[oldParentIndex].childList.childs[parentIndex].innerchildList.innerchilds[index].name.replace(/[\s]/g, ''));
        breadcrumblist =[$scope.menuList[oldParentIndex].name,$scope.menuList[oldParentIndex].childList.childs[parentIndex].name,$scope.menuList[oldParentIndex].childList.childs[parentIndex].innerchildList.innerchilds[index].name];
        loadState(stateName,breadcrumblist);
        $scope.menuList[oldParentIndex].selected = true;
        $scope.menuList[oldParentIndex].childList.childs[parentIndex].selected = true;
        $scope.menuList[oldParentIndex].childList.childs[parentIndex].innerchildList.innerchilds[index].selected = true;
    };
    
    /* Method to reset selection of menu */
    function resetSelection(){
        _.map($scope.menuList, function (menuObj) {
           menuObj.selected = false;
           if(angular.isDefined(menuObj.childList)){
               _.map(menuObj.childList.childs, function (child) {
                    child.selected = false;
                    if(angular.isDefined(child.innerchildList)){
                        _.map(child.innerchildList.innerchilds, function (innerChild) {
                            innerChild.selected = false;
                        });
                    }
               });
           }
        });
    }
    
    /* Method select menu on refresh */
    function menuReset(){
        $scope.breadcrumbList=[];
        resetSelection();
        var tabArray =$stateParams.stateUrl;
        _.map($scope.menuList, function (menuObj) {
            if(((menuObj.name).split(' ').join('')).toLowerCase() === tabArray[0]){
               menuObj.selected = true;
                (menuObj.name === 'Survey') ?  $scope.breadcrumbList.push(menuObj.name + [' Template']): $scope.breadcrumbList.push(menuObj.name);
               if(angular.isDefined(menuObj.childList)){
                   _.map(menuObj.childList.childs, function (child) {
                       if(((child.name).split(' ').join('')).toLowerCase() === tabArray[1]){
                            child.selected = true;
                            $scope.breadcrumbList.push(child.name);
                            if(angular.isDefined(child.innerchildList)){
                                _.map(child.innerchildList.innerchilds, function (innerChild) {
                                    if(((innerChild.name).split(' ').join('')).toLowerCase() === tabArray[2]){ 
                                        $scope.breadcrumbList.push(innerChild.name);
                                        innerChild.selected = true;
                                    }
                                });
                            }
                       }
                   });
               }
            }
        });
        
		if(tabArray == 'myprofile'||(tabArray == 'usermanagement' && encryptionService.decrypt(sessionService.get('toState')) == "adminLanding.myprofile")){
			staticbreadcrumblist();
		}
    };
     /** Service to get the latest conversation messages/notification ***/
    function messageRecent(){
        if($scope.recentMsgBool){ 
            $scope.recentMsgBool = false;
            sfactory.serviceIntervalCall("","messaging.recentConversation",'listDetails').then(function(response){
                if(response.status.toLowerCase() == 'success'){
                    $scope.recentConversation = response.data;                
                    _.each($scope.recentConversation.recentUnreadMsgList, function(item){
                        var sentDate = moment.utc(item.messageSentTime).local();
                        item.messageSentTime = moment(sentDate).format("MM/DD/YYYY hh:mm A"); 
                    }); 
                    _.each($scope.recentConversation.recentUnreadNotifyList, function(item){
                        var sentDate = moment.utc(item.messageSentTime).local();
                        item.messageSentTime = moment(sentDate).format("MM/DD/YYYY hh:mm A"); 
                    }); 
                    messagingService.msgcount = $scope.recentConversation.msgCount ? $scope.recentConversation.msgCount : 0;
                    messagingService.notifyCount = $scope.recentConversation.notifyCount ? $scope.recentConversation.notifyCount : 0;
                } 
                $scope.recentMsgBool = true;
            },function(error){
                sfactory.localService("messagerecent").then(function(response){
                    $scope.recentConversation = response.data.data;                
                    _.each($scope.recentConversation.recentUnreadMsgList, function(item){
                        var sentDate = moment.utc(item.messageSentTime).local();
                        item.messageSentTime = moment(sentDate).format("MM/DD/YYYY hh:mm A"); 
                    }); 
                    _.each($scope.recentConversation.recentUnreadNotifyList, function(item){
                        var sentDate = moment.utc(item.messageSentTime).local();
                        item.messageSentTime = moment(sentDate).format("MM/DD/YYYY hh:mm A"); 
                    });
                    $scope.recentMsgBool = true;
                },function(error){
                });
            });
        }
        
    };
    $scope.recentMsgBool = true;
    /*console.log("Hos tis ",$location.host());*/
    $scope.recentMsgNotify = null;
    
    $scope.recentMsgNotify = $interval(
        function () {
                    messageRecent();
                }, 15000);
    //To call the function manually for the first time
    messageRecent();
    
    $scope.messageState = function(value){
        $scope.showNotify = true;
        $scope.msgType = value;
        $scope.recentConversationMsg = (value == 1) ? $scope.recentConversation.recentUnreadMsgList : $scope.recentConversation.recentUnreadNotifyList;         
    };
    
    $scope.hideNotifyMsg = function(){
       $scope.showNotify = false; 
    };
    
    $scope.messageRedirection = function(value){
        $scope.showNotify = false;
        $state.go('adminLanding.adminmessage',{'msgtype': value});
        //$state.go('dashboardmessage',{'msgtype': $scope.msgType});
    };
    
    $scope.viewMsgNotify = function(msgid){
        $scope.showNotify = false;
        msgIds = [];
        msgIds.push(msgid);
        msgstat = {
            "messageId" : msgIds,
            "readStatus" : "read"
        };        
        sfactory.serviceIntervalCall(msgstat,"messaging.conversationRead",'listDetails').then(function(response){
            if($filter('lowercase')(response.status) == 'success'){					
                messageRecent();
            }            
        },function(){
            var banerData = {'message':"Message read/unread status changed successfully",'showBaner':true,'banerClass':'alert-success'};
            $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});                      
        });
        $state.go('adminLanding.adminmessage',{'msgtype': $scope.msgType,'msgid': msgid});
        //$state.go('dashboardmessage',{'msgtype': $scope.msgType,'msgid': msgid});
    };
    
	/* Method to initial data for admin portal page application after successfull login and groupname in top show*/
      function adminLanding(){
         $scope.cacheServiceData = sharedService;         
		 $scope.loggedUserDetails = $stateParams.Loggeduserdetails;
		 $scope.menuList          = $stateParams.Loggeduserdetails.menu;  
		 $scope.isValiduser       = $scope.loggedUserDetails.groupType;
		if($stateParams.Loggeduserdetails.adminType == "superAdmin"){
			if(sessionService.get('grp_id')){
				grpid = encryptionService.decrypt(sessionService.get('grp_id'));
				groupname = _.where($scope.loggedUserDetails.groupName, {group_id: Number(grpid)});
				if(groupname){
					$scope.currentGroupname = groupname[0].groupname;
				}
			}
		}else if($stateParams.Loggeduserdetails.adminType == "groupAdmin"){
			$scope.currentGroupname = $stateParams.Loggeduserdetails.loggedInUserName;
		}
          messageRecent();
    }     
	
    /* Method to initialize controller */
	function initilizeController(){
        $scope.isActive1 = false;
		$scope.menu ={showChild:false};        
		adminLanding();
		menuReset();         
	};
    
	initilizeController();
    
}]);
advancePubapp.controller('adminmessageController',['$scope','sfactory','$rootScope','$filter','$mdConstant','encryptionService','sessionService','$mdDialog','$window','$timeout','$stateParams','messagingService','$interval', function($scope,sfactory,$rootScope,$filter,$mdConstant,encryptionService,sessionService,$mdDialog,$window,$timeout,$stateParams,messagingService,$interval){
    
	$scope.$watch('counter', function(newValue, oldValue) {
        if(newValue != oldValue && newValue != 0){
            messageConversationListAuto();
            //alert('hey, msgcount has changed!');
        }        
    });
	$scope.replyeditoronoff = function(value){
        $scope.replyeditoron = value;
        if(!$scope.replyeditoron){
            $scope.reply.message = $scope.reply.message ? String($scope.reply.message).replace(/<[^>]+>/gm, '') : "";
        }
    };
   /*$scope.msgeditoronoff = function(value){
        $scope.msgeditoron = value;
        if(!$scope.msgeditoron){
            $scope.compose.message = $scope.compose.message ? String($scope.compose.message).replace(/<[^>]+>/gm, '') : "";
        }
    };*/
    /**
     * Search for contacts.
     */
    $scope.querySearch = function(query) {
       var results = query ? $scope.allContacts.filter(createFilterFor(query)) : [];
       return results;
    };

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
       var lowercaseQuery = angular.lowercase(query);
       return function filterFn(contact) {           
          return (contact._lowername.indexOf(lowercaseQuery) != -1);;
       };
    }
    
    function loadContacts(){
        var contacts = $scope.allcontacts;        
        return contacts.map(function (item, index) {
          var contact = {
                name: item.username,
                id:item.id,
                class:item.class
          };
          contact._lowername = item.username.toString().toLowerCase();
          return contact;
       });
    }
    
    $scope.addFromContacts = function(newcontact,typeuser){        
        var a = -1;
        if(typeuser == "yes"){
            name = newcontact.className;
            id = newcontact.classId;
        }else{
            name = newcontact.username;
            id = newcontact.id;
        }        
        _.each($scope.contacts, function(item,index){
             if(item.name == name && item.id == id && item.class == typeuser){
                a = 1;
                $scope.contacts.splice(index, 1);//removes the element from array if it is already in array
             }                    
        });
        if(a <= -1){
            if(typeuser == "yes"){
                $scope.contacts.push({"name":newcontact.className,"_lowername":newcontact.className.toString().toLowerCase(),"id":newcontact.classId,"class":typeuser});
            }else{
                $scope.contacts.push({"name":newcontact.username,"_lowername":newcontact.username.toString().toLowerCase(),"id":newcontact.id,"class":typeuser});
            }
                        
        }
        $scope.showcontactlist = false;       
    }; 
    /** For multi user message from class magmt */
    $scope.multiUserMessage = function(){        
        _.each($scope.multiUserIds,function(data){
            item = _.where($scope.contactdetails,{id:data});            
            $scope.addFromContacts(item[0],"no");
        });
        $scope.multiUserIds=[];//reset the values for multi user message from user mgmt
    };
    $scope.toUserCheck = function(arrValue,classtype){
        if(classtype == "yes"){
            name = arrValue.className;
            id = arrValue.classId;
        }else{
            name = arrValue.username;
            id = arrValue.id;
        }
        returnVal = false;
      if(classtype == "yes"){
          _.each($scope.contacts, function(item){
             if(item.name == name && item.id == id && item.class == classtype){
                 returnVal = true;
             }                    
        });
      }else{
          _.each($scope.contacts, function(item){
             if(item.name == name && item.id == id && item.class == classtype){
                 returnVal = true;
             }                    
        });
          
      } 
        return returnVal;
    };
    $scope.custominboxsearch = function(searchterm){               
        var dataTofilter = $scope.inboxdetails;
        var pluckedData = [],searchedData={},filterObj={},tableRow={};
		$scope.rectifiedData = [];
        datatableSearchObj ={            
            values:['senderFirstname','senderLastname','messageSubject']
        };        
		_.each(dataTofilter,function(item){
			tableRow = {};
            angular.forEach(datatableSearchObj.values, function(value, key) {
                tableRow[value] = item[value];                
            });
            $scope.rectifiedData.push(tableRow);
		});        
       searchedData = $filter('filter')($scope.rectifiedData, searchterm);
		_.each(searchedData,function(item){
            filterObj={};
            filterObj = item;
			pluckedData.push( _.where(dataTofilter,filterObj)[0]);
		});        
		$scope.searchFiltereddata = pluckedData;       
    };
    
    $scope.composemessage = function(){
        var formObj = new FormData(); 
        receiver = [];receiverClass = [];
        _.each($scope.contacts, function(item){
            if(item.class == "no"){
                receiver.push(item.id);
            }else{
                receiverClass.push(item.id);
            }                        
        });
        sendMessage = {"messageSubject":$scope.compose.subject,"messageContent":$scope.compose.message,"receiverUserId":receiver,"receiverClassId":receiverClass,"messageType": $scope.msgType, "messageCategory": $scope.compose.category}; 
        //To append the file attachment
        _.each($scope.uploadedImage,function(item){
            formObj.append('mailAttachment[]',item);
       });
        var formToken = {'token':sendMessage,'formObj':formObj};
        
        sfactory.serviceCallFormData(formToken,"messaging.composeAdminConversation",'listDetails').then(function(response){
            if($filter('lowercase')(response.status) == 'success'){
                $scope.compose = {};$scope.contacts = [];$scope.reply = {};
                /*var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success','type':'compose'};
                $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});*/
                $scope.shwcompsbx = !$scope.shwcompsbx;$scope.callConversationList();   
				if($scope.inboxdetails.length == 0){
                    $scope.showcomposebox();
                }				
                $rootScope.appLoader = false;
            }            
        },function(){
			$scope.compose = {};$scope.contacts = [];
            var banerData = {'message':"Message sent successfully",'showBaner':true,'banerClass':'alert-success','type':'compose'};
            $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
            $scope.showcomposebox();            
        });
    }; 
    //Changing the text format
    $scope.changeTextContentFormat = function(){
      if($scope.compose.category == 'message')  {
          $scope.compose.message = String($scope.compose.message).replace(/<[^>]+>/gm, '');
      }
    };
    $scope.replymessage = function(){  
		if($scope.userId == $scope.inboxdetails[$scope.indxcount].senderId){
			receiverUserId = $scope.inboxdetails[$scope.indxcount].receiverUserId;
		}else{
			receiverUserId = $scope.inboxdetails[$scope.indxcount].senderId;
		}
		receiver = receiverUserId.split(",");
        sendReply = {
            "messageSubject" : $scope.inboxdetails[$scope.indxcount].messageSubject,
            "messageContent" : $scope.reply.message,
            "receiverUserId" : receiver,
            "messageParentId": $scope.inboxdetails[$scope.indxcount].messageId,
            "messageType" : "yes",
            "messageCategory": "message"
        };
        sfactory.serviceCall(sendReply,"messaging.composeAdminConversation",'listDetails').then(function(response){
            if($filter('lowercase')(response.status) == 'success'){
                /*var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success','type':'reply'};
                $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData}); */
                $scope.reply = {};$scope.callConversationList();$scope.compose = {};
                $rootScope.appLoader = false;
            }            
        },function(){
			$scope.reply = {};$scope.compose = {};
            var banerData = {'message':"Message sent successfully",'showBaner':true,'banerClass':'alert-success','type':'reply'};
            $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});                      
        });
    };
    $scope.replyMsgEditWord = function(){
        /*var wordCount = $scope.reply.message ? $scope.reply.message.split(' ').length : 0;
        if(wordCount > 50 ){
            $scope.replyMsgEditWordCount = true;
        }else{
            $scope.replyMsgEditWordCount = false;
        }   */   
        $scope.replyMsgEditWordCount = false;
    };
    $scope.editorrequired = function(){        
      /*var wordCount = $scope.compose.message ? $scope.compose.message.split(' ').length : 0;
        if(wordCount > 50 ){
            $scope.composeMsgEditWordCount = true;
        }else{
            $scope.composeMsgEditWordCount = false;
        }*/  
        $scope.composeMsgEditWordCount = false;
    };
    $scope.closeBaner = function(){
        if($scope.alertBaner.type == "reply"){
            $scope.callConversationList();
        }else if($scope.alertBaner.type == "compose"){
            $scope.callConversationList();
        }
        
        $scope.alertBaner.showBaner = false;
        $scope.alertBaner.type = "";       
    }
    $scope.checkingcontactlist= function(){
        $scope.showcontactlist = false;
        if($scope.contacts.length == 0){
           $scope.showcontactlist = true; 
        }        
    };
    $scope.getindexCount= function(value){
        $scope.shwcompsbx = false;
		$scope.shwconts.contactBox=false;
        $scope.indxcount = value;        
        $scope.reply.message = "";
        if($scope.msgType == 'yes'){
            $scope.replyboxShown = ($scope.inboxdetails[$scope.indxcount].messageCategory != 'mail') ? true : false;
        }else{
            $scope.replyboxShown = false;
        }        
    };
    $scope.showcomposebox = function(){
        $scope.shwcompsbx = !$scope.shwcompsbx;
		$scope.compose = {};$scope.contacts = [];$scope.reply = {}; $scope.search = {};
        $scope.allcontacts = [];        
        $scope.classdetails = $scope.contactdetails = $scope.admindetails = {};
        /** To get the contact user list */
        sfactory.serviceCall({},"messaging.get_alluser_details",'listDetails').then(function(response){
            if($filter('lowercase')(response.status) == 'success'){
                $scope.contactdetails = response.data;
                 _.each($scope.contactdetails, function(item){
                     $scope.allcontacts.push({"username":item.username,"id":item.id,"class":"no"});                     
                });
                $scope.allContacts = loadContacts();
                // for multi user message from class mgmt
                if($scope.multiUserIds.length > 0){
                    $scope.multiUserMessage();
                }
                $rootScope.appLoader = false;
            }            
        },function(){
            sfactory.localService("messagecontacts").then(function(response){
                $scope.contactdetails = response.data.data;
                 _.each($scope.contactdetails, function(item){
                     $scope.allcontacts.push({"username":item.username,"id":item.id,"class":"no"});                    
                });                
                $scope.allContacts = loadContacts();
                // for multi user message from class mgmt
                if($scope.multiUserIds.length > 0){
                    $scope.multiUserMessage();
                }
                $rootScope.appLoader = false;                
            },function(error){
            });
        });
        /** To get the contact class list */
        sfactory.serviceCall({},"messaging.get_allclass_details",'listDetails').then(function(response){
            if($filter('lowercase')(response.status) == 'success'){
                $scope.classdetails = response.data;
                 _.each($scope.classdetails, function(item){
                     $scope.allcontacts.push({"username" : item.className, "id" : item.classId,"class":"yes"});                     
                });
                $scope.allContacts = loadContacts();
                $rootScope.appLoader = false;
            }            
        },function(){
            sfactory.localService("messageclasslist").then(function(response){
                $scope.classdetails = response.data.data;
                 _.each($scope.classdetails, function(item){
                     $scope.allcontacts.push({"username" : item.className, "id" : item.classId,"class":"yes"});                    
                });                
                $scope.allContacts = loadContacts();
                $rootScope.appLoader = false;                
            },function(error){
            });
        });
    };
    /**Confirm box for the compose cancel*/
    $scope.checkConfrim = function(){        
        var confirm = $mdDialog.confirm()
          .title("Are you sure you want to cancel this operation?")
          .textContent()
          .ariaLabel()
          .ok('Ok')
          .cancel('Cancel'); 
        if(!isEmpty($scope.compose) || $scope.contacts.length > 0){
            $mdDialog.show(confirm).then(function(result) {
                $scope.compose = {};$scope.contacts = [];$scope.multiUserIds=[];
                //$scope.shwcompsbx = false;  
                //To clear the attachements info
                $scope.validImage = [];$scope.invalidImage = []; $scope.uploadedImage = [];
				$window.location.reload();				
            }, function() {               

            });
        }else{
            //$scope.shwcompsbx = false;
			$window.location.reload();
        }
    };
    /**To check the object is empty or not*/
    function isEmpty(obj) {
        var i = j = 0;
        for(var key in obj) { i++;
            if(obj.hasOwnProperty(key) && obj[key] != "" && obj[key] === undefined){
                 j++;
            }
               
        }
        if(i == j){
            return true;
        }else{
            return false;
        }
        
    }
    $scope.msgReadUnread = function(msgstatus,msgvalue){
		$scope.search = {};
		msgvalue = 1;
		
		if($scope.inboxdetails[$scope.indxcount].senderId == $scope.userId){
			if($scope.inboxdetails[$scope.indxcount].senderReadStatus === 0){
				msgvalue = 0;
			}
		}else{
			if($scope.inboxdetails[$scope.indxcount].receiverUserReadStatus === 0){
				msgvalue = 0;
			}
		}
		if(msgvalue === 0){
			msgIds = [];
			msgIds.push($scope.inboxdetails[$scope.indxcount].messageId);
			msgstat = {
				"messageId" : msgIds,
				"readStatus" : msgstatus
			};        
			sfactory.serviceIntervalCall(msgstat,"messaging.conversationRead",'listDetails').then(function(response){
				if($filter('lowercase')(response.status) == 'success'){
					/*var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
					$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});*/ 
					if($scope.inboxdetails[$scope.indxcount].senderId == $scope.userId){
                       $scope.inboxdetails[$scope.indxcount].senderReadStatus = 1;
                    }else{
                       $scope.inboxdetails[$scope.indxcount].receiverUserReadStatus = 1;
                    }
					$rootScope.appLoader = false;
				}            
			},function(){
				var banerData = {'message':"Message read/unread status changed successfully",'showBaner':true,'banerClass':'alert-success'};
				$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});                      
			});
		}
        
    };
	/** Message actions like delete **/
    $scope.msgActions = function(action){
        var delete_title;
        $scope.msgType === 'yes' ? delete_title = "Are you sure you want to delete the message?" : delete_title = "Are you sure you want to delete the notification?";
         var confirm = $mdDialog.confirm()
          .title(delete_title)
          .textContent()
          .ariaLabel()
          .ok('Ok')
          .cancel('Cancel'); 
       
        $mdDialog.show(confirm).then(function(result) {
            msgIds = [];
            msgIds.push($scope.inboxdetails[$scope.indxcount].messageId);
            msgstat = {
                "messageId" : msgIds,
                "actionType": action
            };        
            sfactory.serviceCall(msgstat,"messaging.conversationActions",'listDetails').then(function(response){
                if($filter('lowercase')(response.status) == 'success'){
                    $scope.inboxdetails.splice($scope.indxcount,1);
                    $scope.indxcount = 0;
                    var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
                    $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});                
                    $rootScope.appLoader = false;
                }            
            },function(){            
                $scope.inboxdetails.splice($scope.indxcount,1);
                $scope.indxcount = 0;            
                var banerData = {'message':"Message "+action+" successfully",'showBaner':true,'banerClass':'alert-success'};
                $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
                //$scope.callConversationList();
            });
        }, function() {               

        });
    };
	/** Inbox list */
    $scope.callConversationList = function(){
		$scope.reply = {};$scope.shwconts.contactBox=false;$scope.search = {};
        //To clear the attachements info
        $scope.validImage = [];$scope.invalidImage = []; $scope.uploadedImage = [];
        sfactory.serviceCall({},"messaging.conversationList",'listDetails').then(function(response){
            if($filter('lowercase')(response.status) == 'success'){
                $scope.inboxdetails = response.data;                
                $scope.inboxdetails = _.where($scope.inboxdetails,{
                  "messageType" : $scope.msgType
                });
                _.each($scope.inboxdetails, function(item){
                    var sentDate = moment.utc(item.messageSentTime).local(); 
                    var sentUpdateDate = moment.utc(item.messageUpdateTime).local();					
                    item.messageSentTime = moment(sentDate).format("MM/DD/YYYY hh:mm A"); 
                    item.messageUpdateTime = moment(sentUpdateDate).format("MM/DD/YYYY HH:mm:ss");
                    _.each(item.messageReply, function(reply){
                        var replySentDate = moment.utc(reply.messageSentTime).local();
                        reply.messageSentTime = moment(replySentDate).format("MM/DD/YYYY hh:mm A");
                    });
                });
				$scope.indxcount = 0;
				if($scope.inboxdetails.length == 0 && $scope.msgType == 'yes'){                                        
					$scope.showcomposebox();                    
                }else{
					if($scope.msgId){
						var indexMsg = $scope.inboxdetails.map(function (item) {
                            return item.messageId;
                        }).indexOf($scope.msgId); 
                        $scope.indxcount = indexMsg;
					}
                    // To hide reply box based on mail in messages
                    if($scope.msgType == 'yes'){
                        $scope.replyboxShown = ($scope.inboxdetails[$scope.indxcount].messageCategory != 'mail') ? true : false;
                    }else{
                        $scope.replyboxShown = false;
                    }
                    // For multi user messages showing the compose area
                    if($scope.multiUserIds.length > 0){
                        $scope.shwcompsbx = true;
                    }else{
                        $scope.shwcompsbx = false;
                    }
                }                
                
                $rootScope.appLoader = false;
            }else{
                $rootScope.appLoader = false;
            }           
        },function(){
            sfactory.localService("messageinbox").then(function(response){
                $scope.inboxdetails = response.data.data;
                $scope.inboxdetails = _.where($scope.inboxdetails,{
                  "messageType" : $scope.msgType
                });
                _.each($scope.inboxdetails, function(item){
                    var sentDate = moment.utc(item.messageSentTime).local(); 
                    var sentUpdateDate = moment.utc(item.messageUpdateTime).local();					
                    item.messageSentTime = moment(sentDate).format("MM/DD/YYYY hh:mm A");
                    item.messageUpdateTime = moment(sentUpdateDate).format("MM/DD/YYYY HH:mm:ss");
                    _.each(item.messageReply, function(reply){
                        var replySentDate = moment.utc(reply.messageSentTime).local();
                        reply.messageSentTime = moment(replySentDate).format("MM/DD/YYYY hh:mm A");
                    });
                });        
                $scope.indxcount = 0;
				if($scope.inboxdetails.length == 0 && $scope.msgType == 'yes'){                                        
					$scope.showcomposebox();                    
                }else{
					if($scope.msgId){
						var indexMsg = $scope.inboxdetails.map(function (item) {
                            return item.messageId;
                        }).indexOf($scope.msgId); 
                        $scope.indxcount = indexMsg;
					}
                    // To hide reply box based on mail in messages
                    if($scope.msgType == 'yes'){
                        $scope.replyboxShown = ($scope.inboxdetails[$scope.indxcount].messageCategory != 'mail') ? true : false;
                    }else{
                        $scope.replyboxShown = false;
                    }
                    // For multi user messages showing the compose area
                    if($scope.multiUserIds.length > 0){
                        $scope.shwcompsbx = true;
                    }else{
                        $scope.shwcompsbx = false;
                    }
                    
                } 
                $rootScope.appLoader = false;                                
            },function(error){
            });
        });
    }
	function setTabsIndex(){
        $timeout(function () {
           $scope.selectedIndex = ($scope.msgType == 'yes') ? 0 : 1;
       });
    };
    function initiateController(){
		$scope.search = {};
        $scope.shwconts={'contactBox':false,'userTypeDrop': 'Student'};
        $scope.indxcount = 0;
        $scope.compose = $scope.reply = {};
        $scope.msgdetails = {};$scope.allcontacts = [];
        $scope.contacts = [];
        $scope.inboxdetails = [];
        $scope.msgType = ($stateParams.msgtype != 1) ? 'no' : 'yes';
        $scope.msgId = ($stateParams.msgid > 0) ? $stateParams.msgid : 0;
        setTabsIndex(); 
        $scope.searchFiltereddata = [];
        $scope.filterSelected = true;        
        $scope.editoron = false;
        $scope.userTypeDrop = "Student";
        $scope.replyeditorerror = true;
        $scope.userRoleType = encryptionService.decrypt(sessionService.get('role'));
        $scope.replyMsgEditWordCount = $scope.composeMsgEditWordCount = false;
        $scope.userId = encryptionService.decrypt(sessionService.get('userId'));                        
        var semicolon = 186;
        $scope.customKeys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA, semicolon];        
        $scope.selectedItem = $scope.searchText = null;
        $scope.textangulartoolbar =[['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol','justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent','quote','insertLink'],[ 'wordcount', 'charcount']]; $scope.editoron = false;  
        $scope.selectedContactIndex = 0;
        $scope.messageCategory = ["message","mail","both"];
        /** Inbox list */
        $scope.callConversationList();      
        $scope.multiUserIds = messagingService.userIds;
        if($scope.multiUserIds.length > 0){
            console.log("msg ctrlr",$scope.multiUserIds);
            messagingService.userIds = [];
            $scope.showcomposebox();
            $scope.compose.category = "message";
        }
    }
    
    $scope.replybx = function(){
        $scope.shwreplybox = false;
    }
    initiateController();
    
    /** Inbox list */
    function messageConversationListAuto(){ 
        var currMsgId = $scope.inboxdetails[$scope.indxcount].messageId;
        sfactory.serviceIntervalCall({},"messaging.conversationList",true).then(function(response){
            if($filter('lowercase')(response.status) == 'success'){
                $scope.inboxdetails = response.data;                
                $scope.inboxdetails = _.where($scope.inboxdetails,{
                  "messageType" : $scope.msgType
                });
                _.each($scope.inboxdetails, function(item){
                    var sentDate = moment.utc(item.messageSentTime).local();
                    var sentUpdateDate = moment.utc(item.messageUpdateTime).local();
                    item.messageSentTime = moment(sentDate).format("MM/DD/YYYY hh:mm A");
                    item.messageUpdateTime = moment(sentUpdateDate).format("MM/DD/YYYY HH:mm:ss");
                    _.each(item.messageReply, function(reply){
                        var replySentDate = moment.utc(reply.messageSentTime).local();
                        reply.messageSentTime = moment(replySentDate).format("MM/DD/YYYY hh:mm A");
                    });                    
                });
                //To retain old viewed message/notification
                var indexMsg = $scope.inboxdetails.map(function (item) {
                    return item.messageId;
                }).indexOf(currMsgId); 
                $scope.indxcount = indexMsg;
            }          
        },function(){
            sfactory.localService("messageinbox").then(function(response){
                $scope.inboxdetails = response.data.data;
                $scope.inboxdetails = _.where($scope.inboxdetails,{
                  "messageType" : $scope.msgType
                });
                _.each($scope.inboxdetails, function(item){                    
                    var sentDate = moment.utc(item.messageSentTime).local();
                    var sentUpdateDate = moment.utc(item.messageUpdateTime).local();                    
                    item.messageSentTime = moment(sentDate).format("MM/DD/YYYY hh:mm A");
                    item.messageUpdateTime = moment(sentUpdateDate).format("MM/DD/YYYY HH:mm:ss"); 
                    _.each(item.messageReply, function(reply){
                        var replySentDate = moment.utc(reply.messageSentTime).local();
                        reply.messageSentTime = moment(replySentDate).format("MM/DD/YYYY hh:mm A");
                    });
                });       
                
                $rootScope.appLoader = false;                                
            },function(error){
            });
        });
    };
    $scope.recentMsgsAuto = null;
    
    $scope.recentMsgsAuto = $interval(
        function () {
            if($scope.msgType == 'yes'){
                $scope.counter = messagingService.msgcount;
            }else{
                $scope.counter = messagingService.notifyCount;
            }
           
            
        }, 5000);
    /*  File Attachments for mail category */
     
    $scope.upload = function(files) {
        $scope.validImage = [];$scope.invalidImage = []; $scope.uploadedImage = [];
        if(files){
            if (files.length < 20) {
            _.each(files, function(item){
            
                $scope.uploadedImage.push(item);
                //$scope.imageFileName.push({'name':item.name,'valid':true});
                $scope.getImage(item);
                          
            
            });
            }else{
             alert("Please select max 20 files.");
            return false;
          }
            
        }
    };
    
    $scope.removeImage = function(e,index){
       $(e.target).parent().remove();
        $scope.uploadedImage.splice(index,1);     
       // console.log(uploadedImage);
    }
    $scope.getImage = function(file) {
       var reader = new FileReader();
        reader.filename = file.name;
        reader.onload = function (e) {
            $scope.$apply(function ($scope) {
                $scope.validImage.push({"name":e.target.filename,"imgfile":e.target.result});
            });
        };
        reader.readAsDataURL(file);
        return $scope.validImage;
    };
	
}]);
advancePubapp.controller('advancepublicationsController',function($scope,$state,$rootScope,$window,sfactory){

    $scope.$on('contenttemplate',function(event,args){
        $scope.contentTemplatename = templateURL+'dest/templates/'+args.contentTemplate+'.html';
    });
    $rootScope.$watch('appLoader',function(newVal,oldVal){
        $scope.appLoaderCheck = $rootScope.appLoader;
    })
    $(window).scroll(function () {
                if ($(window).scrollTop() > 50) {
                    $('.md-sidenav-left').addClass('md-sidenav-left-top');
                }
    });  
    
});

advancePubapp.controller('assetPopupController',['$scope','sfactory','$stateParams','$filter','$rootScope', '$mdDialog','$timeout','cacheService','encryptionService','sessionService', '$state','dataToPass', function($scope,sfactory,$stateParams,$filter,$rootScope,$mdDialog,$timeout,cacheService,encryptionService,sessionService, $state,dataToPass){ 

function navigationButton(){
    //Make prev button disabled
    $scope.prev = ($scope.index == 0) ? true : false;
    //Make next button disabled
    $scope.next = ($scope.index == ($scope.datavalues.length - 1)) ? true : false;
    //to load the song
    audio = angular.element(document.getElementById("audiopopup"));
    audio.src = $scope.assetUrl;
    audio.load();
}
$scope.prevSong = function(){
    if($scope.index > 0){
        $scope.index = $scope.index - 1;
        $scope.assetUrl = $scope.datavalues[$scope.index].book_url;
    } 
    
    navigationButton();
};
$scope.nextSong = function(){
    if(($scope.datavalues.length - 1) > $scope.index){
        $scope.index = $scope.index + 1;
        $scope.assetUrl = $scope.datavalues[$scope.index].book_url;        
    }
    
    navigationButton();
};
    
$scope.cancelModel = function(){
    $mdDialog.cancel();
}
function initializeController() {        
    $scope.index = dataToPass.index;
    $scope.assetType = dataToPass.type;
    $scope.datavalues = dataToPass.data;
    $scope.assetUrl = dataToPass.data[$scope.index].book_url;
    navigationButton();
};
    initializeController();
    
    
}]);
    
advancePubapp.filter('assetValid', ['$sce', function ($sce) {
        return function (recordingUrl) {
            return $sce.trustAsResourceUrl(recordingUrl);
        };
    }]);
advancePubapp.controller('toggle_btns', function($scope) {
     $scope.toggleRed = false;
      
});

    
   
advancePubapp.controller('btnactionsController',['$scope','sfactory','getParams','$mdDialog','$rootScope','$filter','$state','$stateParams','taskService','sessionService','encryptionService', function($scope,sfactory,getParams,$mdDialog,$rootScope,$filter,$state,$stateParams,taskService,sessionService,encryptionService){ 
	
	$scope.currentStateName = $state.current.name;
	 
	$scope.classdetailspage = function(){
		//$state.go('classDetails',{table:"users",classid:$scope.contentBody.id,classname:$scope.contentBody.name,teacherid:$scope.contentBody.classadminid});
		($scope.contentBody.classadminid != '') ? sessionService.set('teacherid',encryptionService.encrypt(String($scope.contentBody.classadminid))) : '';
		classListName = (angular.isNumber($scope.contentBody.name)) ? encryptionService.encrypt(String($scope.contentBody.name)) : encryptionService.encrypt($scope.contentBody.name);
		(classListName != '') ? sessionService.set('classname',classListName) : '';
		//$state.go('adminLanding.classDetails',{table:"users",classid:$scope.contentBody.id});
		$state.go('adminLanding.classDetails',{table:"users",classid:$scope.contentBody.id});
	}
    /* Method to edit user list */
    $scope.editRow = function(primary){
		/*if(!primary && $state.current.name == "adminLanding.usermanagement"){
			$mdDialog.show(
			  $mdDialog.alert()
				.parent(angular.element(document.querySelector('#popupContainer')))
				.clickOutsideToClose(true)
				.title('')
				.textContent('You can not edit the user because user is not added by you.')
				.ariaLabel('Alert Dialog Demo')
				.ok('ok')
				.targetEvent()
			);
		}else{*/ 
			$scope.setback({'response':true}); 
			$scope.contentBody.viewChild = false;
			$scope.contentBody.isEditable = true;
			$scope.contentBody.editall=true;
			$scope.contentBody.showChild = true;	
			$scope.contentBody.isMessage = false;
			$scope.contentBody.isAddCourse = false;
			$scope.contentBody.isAddUser = false;
			$scope.contentBody.editcourse = false;
			$scope.contentBody.edituser = false;
		/*}*/
    }
    /* Method to edit class user list */
	$scope.editclassRow = function(paramVal){
		$scope.setback({'response':true});
        $scope.contentBody.viewChild = false;
        $scope.contentBody.isEditable = true;
		$scope.contentBody.editall=false;
	    		
		if(paramVal=='course'){	 
            $scope.contentBody.editcourse=true;
            $scope.contentBody.edituser=false;
			$scope.contentBody.isAddCourse = true;
			$scope.contentBody.isAddUser = false;
			$scope.contentBody.showChild = true;
		}
        if(paramVal=='user'){	
            $scope.contentBody.editcourse=false;
            $scope.contentBody.edituser=true;
			$scope.contentBody.isAddUser = true;
			$scope.contentBody.isAddCourse = false;
			$scope.contentBody.showChild = true;
		}
		else{
			$scope.contentBody.editall=false;
		}
    }
    
    /* Method for message message*/
    $scope.editMessage = function(){
        $scope.setback({'response':true});
        $scope.contentBody.showChild = true;
        $scope.contentBody.isEditable = false;
        $scope.contentBody.isMessage = true;
        $scope.contentBody.viewChild = false;
        $scope.contentBody.isAddCourse = false;
        $scope.contentBody.isAddUser = false;
        $scope.contentBody.editcourse = false;
        $scope.contentBody.edituser = false;
    }
    
    
    /* Method to view user list */
    $scope.viewRow = function(){
		$scope.setback({'response':true});
        $scope.contentBody.showChild = false;
        $scope.contentBody.isEditable = false;
        $scope.contentBody.viewChild = !$scope.contentBody.viewChild;
        $scope.contentBody.isMessage = false;
        angular.element(document).ready(function () {
              $(".tooltips").removeClass('active');
        });
    }
    
	/* Method for assign content */
	$scope.assignContent = function(){
        $scope.assigncontentToTable({'response':$scope.contentBody});
    };
	
    /* Method to delete user from list */
    $scope.deleteRow = function(ev) {
		$scope.setback({'response':true});
        // Appending dialog to document.body to cover sidenav in docs app
        if(ev == 'classes'){
            var typename = 'class';
        }else{
            var typename = 'user';
        }
        var confirm = $mdDialog.confirm()
              .title('Are you sure you want to delete the '+typename+'?')
              .textContent('')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Delete')
              .cancel('Cancel');

        $mdDialog.show(confirm).then(function() {
            $scope.status = 'You decided to get rid of your debt.';
            $scope.contentBody.showChild = false;
            $scope.contentBody.viewChild = false;
            var deleteAction = getParams.args($scope.contentHead,$scope.contentBody); 
            var sessionBasedcall = ($scope.contentHead.actionMethods && $scope.contentHead.actionMethods.delete) ? $scope.contentHead.actionMethods.delete.session : null;
            if(deleteAction.params){
                sfactory.serviceCall(JSON.stringify(deleteAction.params),deleteAction.api,'listDetails').then(function(response){
                    $scope.contentBody.row_Checkbox = false;
                    if(response.status && response.status.toLowerCase() == 'success') {
                        var deletableItem = response.data.deletable.length > 0 ? response.data.deletable[0] : null;
                        if(deletableItem){
                            var pickedObj = _.where($scope.contentItems,{'id':Number(deletableItem)});
                            var curItemIndex = $scope.contentItems.indexOf(pickedObj[0]);
                            if(curItemIndex > -1) {
                                $scope.contentItems.splice(curItemIndex,1);
								/*var usermanagementscope = angular.element(jQuery("#usermanagementCls")).scope();
								if(usermanagementscope && angular.isDefined(usermanagementscope.tableTrashData)){
									usermanagementscope.tableTrashData.data.push($scope.contentBody);
								}	*/							
                                $scope.emitbaner({'response':{'message':response.message,'showBaner':true,'banerClass':'alert-success','contentItems':pickedObj[0]}});
                            }
                        }
                        if(response.data.non_deletable.length > 0 && !response.data.deletable.length){
                            $scope.emitbaner({'response':{'message':response.message,'showBaner':true,'banerClass':'alert-danger','contentItems':null,'switchMenu':response.data.relatedWith}});
                        }
						
                    }
                    $rootScope.appLoader = false;
                },function(error){
                });
            }
        }, function() {
        });
    };
 
     /* Method to add users to class  */  
   $scope.addcheckuser = function(event,id){
        event.preventDefault();
		$scope.$emit('emitadduserdata',{'adduserdata':id,'username':$scope.contentBody.username});	   
    };
	
    $scope.updatecheckuseradd = function(event,id,val,action){
		event.preventDefault();
        inputReq = {
            'classid'    : $scope.contentBody.defaultclassid,
            'userid'     : $scope.contentBody.id,
            'action'     : action
        };
        sfactory.serviceCall(inputReq, 'classes.classEnrollUser',"listDetails").then(function(response) {
            if(angular.isDefined(response)){
                if($filter('lowercase')(response.status) == 'success'){
                   $scope.contentBody.useradd   = val;
                   $scope.contentBody.user_count= response.data; 
		           $userdata = {'updateuserdata':id,'user_count':$scope.contentBody.user_count,'value':val,'user':$scope.contentBody.username};
		           $scope.$emit('emitupdateuserdata',$userdata);
                }
            }
			$rootScope.appLoader = false;
        }, function(error) {
          
        });	
		console.log($scope.contentBody);
    };
	 
	$scope.addcourseenroll = function(event,id,val,action){	
		event.preventDefault();
        if($scope.contentHead.isAssignContent){
            $scope.contentHead.apiParams.courseid = $scope.contentBody.id;
            $scope.contentHead.apiParams.userid = $scope.contentBody.userId;
        }else{
            $scope.contentHead.apiParams.action = action;
            $scope.contentHead.apiParams.classid = $scope.contentHead.apiParams.classid;
            $scope.contentHead.apiParams.courseid = $scope.contentBody.course_id;
        }
        var task = $scope.contentHead.actionName;
        sfactory.serviceCall($scope.contentHead.apiParams, task,"listDetails").then(function(response) {
            if(angular.isDefined(response)){
                if($filter('lowercase')(response.status) == 'success'){					
					if($scope.contentHead.columnName == "ClassEnrollButtons"){
						$scope.contentBody.enrolstatus=val;
						$scope.contentBody.course_count= response.data; 
						var editClassscope = angular.element(jQuery("#editClass")).scope();
						
						if($scope.contentHead.apiParams.courseid){
							$contentval = {'courses':$scope.contentBody.name,'type':'course'};
						}					
						if(editClassscope) editClassscope.gathereditCoursesvalues(id,$scope.contentBody.course_count,$contentval,val);
					}else{
						$scope.contentBody.enrollcourse=val;
					}
					$scope.emitbaner({'response':{'message':response.message,'showBaner':true,'banerClass':'alert-success','contentItems':''}});
                }
				$rootScope.appLoader = false;
            }
        }, function(error) { 
          
        });	
    };  
	
	//Method for add parent link
	$scope.addparentlink = function(event,id,val,action){
		$scope.contentHead.apiParams.userid   = $scope.contentHead.apiParams.userid;
		$scope.contentHead.apiParams.parentid = $scope.contentBody.id;
		$scope.contentHead.apiParams.action   = action;
		var task = $scope.contentHead.actionName;
		sfactory.serviceCall($scope.contentHead.apiParams, task,"listDetails").then(function(response) {
			if(angular.isDefined(response)){
				if($filter('lowercase')(response.status) == 'success'){
					//change remaining content values as false
					parentaddtrue = _.find($scope.contentItems,{parentadd : true});
					if(parentaddtrue){
						parentaddtrue.parentadd = false;
					}
					$scope.contentBody.parentadd=val;
					parentval = {'username':$scope.contentBody.username,'val':val}
					var parentvalupdate = angular.element(jQuery("#modalclassparent")).scope();
					if(parentvalupdate) parentvalupdate.parentvalueupdate({'updateuserdata':id,'username':parentval});
				}
				$rootScope.appLoader = false;
			}
	  	}, function(error) { 

		});
	}
	//Method for Parent list
	$scope.assignParentForUser =function(headval,bodyval){		  
		$mdDialog.show({
            controller: 'modalclassparentController',
            templateUrl: 'dest/templates/modalclassparent.html',
            parent: angular.element(document.body),
            clickOutsideToClose:false,
            fullscreen: $scope.customFullscreen,
            locals: {
               userassigntoparent: {'userid' : bodyval.id,'columnName':headval.columnName}
             }
        }).then(function(parentname) {
			var editscope = angular.element(jQuery("#editClass")).scope();
			val = {'userid':bodyval.id,'parentname':parentname};
			if(editscope) editscope.updateparenttostudent(val);
        }, function() {
            
        });
	}
	 
	$scope.classusercourselistdisplay = function(datas,val){
		$scope.courseandlist = true;  
		(val == 'user') ? data = datas.username : data = datas.groupname;
        (val == 'user') ? listype = "Student" : listype = "Group";
		(data != "") ? $scope.groupwithuser = data.split(',') : $scope.groupwithuser = [];
        ($scope.groupwithuser.length <= 1) ? $scope.listType = listype : $scope.listType = listype+"s";
	};
	 
	$scope.classusercourselisthide = function(){
		$scope.courseandlist = false;
	}
    $scope.close_course_list = function(){
        $scope.courseandlist = false;
    }
	
	//Common method service call for undo and permanant options
	function servicecall(param,task,action){
		sfactory.serviceCall(param, task,"listDetails").then(function(response) {
			if(angular.isDefined(response)){
				if($filter('lowercase')(response.status) == 'success'){
					//method for row remove
					if(action == 'undo'){
						$scope.contentItems.splice(_.findIndex($scope.contentItems, { 'id': $scope.contentBody.id }), 1);
					/*	var usermanagementscope = angular.element(jQuery("#usermanagementCls")).scope();
						usermanagementscope.tableData.data.push($scope.contentBody);*/
						$scope.emitbaner({'response':{'message':response.message,'showBaner':true,'banerClass':'alert-success','contentItems':''}});
					}
					
					if(action == 'permanent'){
						$scope.contentItems.splice(_.findIndex($scope.contentItems, { 'id': $scope.contentBody.id }), 1);
						$scope.emitbaner({'response':{'message':response.message,'showBaner':true,'banerClass':'alert-success','contentItems':''}});
					}
				}
				$rootScope.appLoader = false;
			}
	  	}, function(error) { 

		});
	}
	
	//Method for undo user in list
	$scope.clickundouser = function(id,action){
		task   = 'user.undo_deleteduser';
		params = JSON.stringify({'userid' : id});
		servicecall(params,task,action)
	}
	
	/*Method to toggle add/remove all records*/
	$scope.togglealltoClass = function(status,prevStatus){
		$scope.contentHead.prevStatus = prevStatus;
		$scope.contentHead.addedAll = !$scope.contentHead.addedAll;
		$scope.updateparentpage({'response':{'status':status,'ischeckedall':status,'parentprevStatus':prevStatus}});
		if(status){
			_.each($scope.contentItems,function(items,index){
				items.studentAdded = true;
			});
		}
		else{
			_.each($scope.contentItems,function(items,index){
				items.studentAdded = false;
			});
		}
	}
	
    /*Function to add/remove users to class*/
	$scope.toggleusertoClass = function(_id,status){
		removedData = [];
        removedData.length === $scope.totalRecords ? removedData = [] : '';
        if(status) {
            tableToggleDatasession.push(_id);
        } else {
            var index = tableToggleDatasession.indexOf(_id);
            index !== -1 ? tableToggleDatasession.splice(index, 1) : '';
            removedData.push(_id);
            removedData = _.uniq(removedData);
        }
        tableToggleDatasession = _.uniq(tableToggleDatasession); 
		if($scope.contentItems.length <= 10) {
            if($scope.contentItems.length === tableToggleDatasession.length) {
               $scope.contentHead.prevStatus = 'add'; 
               $scope.contentHead.addedAll = true; 
            } else {
                $scope.contentHead.addedAll = false;
            }
        }
        $scope.contentBody.studentAdded = !$scope.contentBody.studentAdded;
        $scope.updateparentpage({'response':{'id':_id,'status':status,'ischeckedall':false,'prevStatus':$scope.contentHead.prevStatus, 'unchecked':removedData.length, 'totalRecord':$scope.totalRecords}});
    }
	//Method for permanat userslist delete
	
	$scope.clickpermanantdeleteuser = function(id,action){
		var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete the user permanently?')
          .textContent('')
          .ariaLabel('')
          .targetEvent()
          .ok('Ok')
          .cancel('Cancel');
		$mdDialog.show(confirm).then(function() {
			task = 'user.permanentUserDelete';
			params = JSON.stringify({'userid' : id});
			servicecall(params,task,action)
		}, function() {
		});
	}
	
	/* Method for open and close options */
	
	$scope.openOptions = function(){
        $scope.options = true;   
    }
    $scope.closeOptions = function(){
         $scope.options = false;   
    }
	
	/* Method for addtooltip popup content */
	$scope.addtooltippopup = function(data,name){
		$scope.groupwithclassbool = true;
		$scope.grpClsTitle        = name;
		$scope.groupwithclass     = data.split(',');
	} 
	
	/* Method for edit student popup */
	$scope.editStudentPopup = function(ev) {
        $mdDialog.show({
          controller: 'editStudentController',
          templateUrl: templatepath + 'editStudentModal.html',
          locals:{dataToPass: $scope.contentBody, previousState: $state},  
          parent: angular.element(document.body),
          clickOutsideToClose:true
        }).then(function(returnmessage) {
			if(returnmessage){
				var banerData = {'message':returnmessage.message,'showBaner':true,'banerClass':'alert-success'};   
				$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
			}
        }, function() {
            
        });
    }
	
	/* Method for remove studet from class */
    function removeUserFromGroup() {
        var confirm = $mdDialog.confirm()
        .title('You are trying to remove Student who is assigned in Group. Do you really want to remove student?')
        .ariaLabel('Lucky day')
        .targetEvent()
        .ok('REMOVE')
        .cancel('CANCEL');
        $mdDialog.show(confirm).then(function() {
            tasks = taskService.getTasks("editStudentController");
            var data = {'classgroupid':$stateParams.group, 'userid':$scope.contentBody.id};
            sfactory.serviceCall(JSON.stringify(data),tasks.removeGroupStudent,'listDetails').then(function(response){
                if(response.status === 'success') {
					$scope.contentItems.splice(_.findIndex($scope.contentItems, { 'id': $scope.contentBody.id }), 1);
					var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};   
					//$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData,'page':'groupStudentCount'});
					$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData,'page':{'pagename' : 'groupStudentCount','id':$scope.contentBody.id}});
                    $scope.removeuserfromtable();
                }else{
					$scope.emitbaner({'response':{'message':response.message,'showBaner':true,'banerClass':'alert-danger'}});
				}
                $rootScope.appLoader = false;
            },function(error){
                $state.go('adminLanding.classDetails', {class: $stateParams.classid, group: $stateParams.group, table:'users'},{reload:true});
                $rootScope.appLoader = false;
            });
        }, function() {
        });
    }
    
	/* Method for remove studet from class */
    function removeUserFromClass() { 
        var confirm = $mdDialog.confirm()
        .title('Are you sure you want to remove the student?')
        .ariaLabel('Lucky day')
        .targetEvent()
        .ok('REMOVE')
        .cancel('CANCEL');
		console.log($scope.contentBody);
        $mdDialog.show(confirm).then(function() {
            tasks = taskService.getTasks("editStudentController");
            var data = {'classmasterid':$stateParams.classid, 'userid':$scope.contentBody.id};
            sfactory.serviceCall(JSON.stringify(data),tasks.removeClassStudent,'listDetails').then(function(response){
                if(response.status === 'success') {
					$scope.contentItems.splice(_.findIndex($scope.contentItems, { 'id': $scope.contentBody.id }), 1);
					var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};   
					$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData,'page':'classStudentCount'});
                    $scope.removeuserfromtable();
                }else{
					$scope.emitbaner({'response':{'message':response.message,'showBaner':true,'banerClass':'alert-danger'}});
				}
                $rootScope.appLoader = false;
            },function(error){
                $state.go('adminLanding.classDetails', {class: $stateParams.classid, group: '', table:'users'},{reload:true});
                $rootScope.appLoader = false;
            });
        }, function() {
        });
    }
	
	/* Method for remove user from group and class */
	$scope.removeUserFromClassOrGroup = function() {
        if($stateParams.group && $stateParams.classid) {
            removeUserFromGroup()
        } else if($stateParams.classid && !$stateParams.group) {
            removeUserFromClass();
        } else if(!$stateParams.classid) {
            removeUser();
        }
    }
	  
	/* Method for remove tooltip popup */
	$scope.removetooltippopup = function(){
		$scope.groupwithclassbool = false;
	}
	function initializeController(){
        templatepath = templateURL+"dest/templates/";
        tableToggleDatasession = [];
        $scope.options = false;
    };
	initializeController();
    
}]);


advancePubapp.controller('btnStatusController',['$scope','sfactory','getParamsstatus','$mdDialog','$filter','$rootScope', function($scope,sfactory,getParamsstatus,$mdDialog,$filter,$rootScope){ 
         
    /* Method to get class names for user type buttons */
    $scope.getClassnames = function(){
        if($scope.contentBody[$scope.contentHead.bind_val] === 'Group Admin'){
			$scope.contentBody[$scope.contentHead.bind_val] = 'Groupadmin';
		}
        return 'user_type_icon_'+$scope.contentBody[$scope.contentHead.bind_val];
    }
     
    /* Method to activate category from list */
    $scope.statusField = $scope.contentBody.block != undefined ? $scope.contentBody.block : $scope.contentBody.visible;
    $scope.stateLevel = $scope.statusField;
    $scope.statusChange = function() {
        var stateTitle = !$scope.contentBody.block ? 'Are you sure you want to deactivate?' : 'Are you sure you want to activate?';
        var confirm = $mdDialog.confirm()
              .title(stateTitle)
              .textContent()
              .ariaLabel()
              .ok('Ok')
              .cancel('Cancel'); 
        
        $mdDialog.show(confirm).then(function(result) {
          $scope.status = '';
            $scope.contentBody.showChild = false;
            $scope.contentBody.viewChild = false;
			
			if($scope.contentHead.actionMethods.status.viewName == "adminclassDashboard"){
				bindparam = $scope.contentBody.roaming_content;
			}else{
				bindparam = $scope.contentBody.block;
			}
			
            var statusAction = getParamsstatus.args($scope.contentHead,$scope.contentBody.id,bindparam,$scope.contentBody);
            var sessionBasedcall = ($scope.contentHead.actionMethods && $scope.contentHead.actionMethods.status) ? $scope.contentHead.actionMethods.status.session : null;
            if(statusAction.params){   
                sfactory.serviceCall(JSON.stringify(statusAction.params),statusAction.api,'listDetails').then(function(response){
                    if($filter('lowercase')(response.status) == 'success'){
						//Method for content management status changes 
						if($scope.contentHead.actionMethods && $scope.contentHead.actionMethods && $scope.contentHead.actionMethods.status.api == 'content_v2.catGroupAssign'){
							contentcatagoryaction();
						}else if($scope.contentHead.actionMethods && $scope.contentHead.actionMethods && $scope.contentHead.actionMethods.status.api == 'content_v2.sectionGroupAssign'){
							contentlessonsaction($scope.contentBody.lessons);
						}
						else{
							if($scope.contentHead.actionMethods.status.viewName == "usernonactivate"){
								 nonactiveindex = _.findIndex($scope.contentItems,{id:statusAction.params.id});
								(nonactiveindex != -1) ? $scope.contentItems.splice(nonactiveindex,1) :"";
							}
							else if($scope.contentHead.actionMethods.status.viewName == "adminclassDashboard"){
								$scope.contentBody.roaming_content = response.data.block;
								$scope.statusField = response.data.roaming_content;
							}else{
								$scope.contentBody.block = response.data.block;
								$scope.statusField = response.data.block;
							}
						}
						$scope.emitbaner({'response':{'message':response.message,'showBaner':true,'banerClass':'alert-success','contentItems':$scope.contentItems}});
						
                    }else{
                        if($scope.contentBody.block){
                            $scope.contentBody.block = false;
                        }else{
                            $scope.contentBody.block = true;
                        }
                        $scope.emitbaner({'response':{'message':response.message,'showBaner':true,'banerClass':'alert-danger','contentItems':$scope.contentItems}});
                    }
					$rootScope.appLoader = false;
                },function(error){
                    //$scope.contentItems.push($scope.contentBody);
                    $scope.emitbaner({'response':{'message':response.message,'showBaner':true,'banerClass':'alert-success','contentItems':$scope.contentItems}});
                });
            }
        }, function() {
            
           $scope.status = '';
            
            if($scope.contentBody.block){
                $scope.contentBody.block = false;
            }else{
                $scope.contentBody.block = true;
            }
			
			//roaming content activation deactivation
			if($scope.contentBody.roaming_content){
                $scope.contentBody.roaming_content = false;
            }else{
                $scope.contentBody.roaming_content = true;
            }
        });
    };
	
	//Method for content management status changes 
	function contentcatagoryaction(){
		_.find($scope.contentBody.sections, function(section) {
			section.block = $scope.contentBody.block;
			contentlessonsaction(section.lessons);
		})						
	}
	
	//Method for content management status changes 
	function contentlessonsaction(lessons){
		_.find(lessons, function(lesson) { 
			lesson.block = $scope.contentBody.block;
			_.find(lesson.activities, function(activity) { 
				activity.block = $scope.contentBody.block;
			})
		})
	}
}]);
advancePubapp.controller('categoriesController',['$scope','$state','$http','$httpParamSerializer','spinnerService','sfactory','$rootScope', function($scope,$state,$http,$httpParamSerializer,spinnerService,sfactory,$rootScope){
    $scope.alertmsg=""; 
    $scope.showvalue="ng-hide";    
    /* Method to capture emitForCloseicon */
    $scope.$on('emitForClose',function(event,args){
        $scope.showform = args.showform;
        $scope.showicon = args.showicon;
    });
    
    /* Method callback for close the baner alert message */
    $scope.closeBaner = function(){
		$scope.alertBaner.showBaner = false;
    }
    
    /* Method to capture baner call back from child directives */
    $scope.$on('emitFromDirectiveBaner',function(event,args){
        $scope.alertBaner = args.alertBaner;
    })
	
	 $scope.$on('emitFromdeleteBaner',function(event,args){
        $scope.alertBaner = args.alertBaner;
        initiateController(); 
    })
    
    initiateController();
    /* Method to initiate controller scope properties */
    function initiateController(){
        $scope.crossicon = {showform :false,showicon:false};
        var templatepath = templateURL+"dest/templates/";
        $scope.tableData = {
            isFilterbtns:false,
            isSearch:true,
            isPagination:true,
			ismultiDel:{task:'coursecat.catgoriesDel',viewname:'categories'},
            childTemplate:templatepath+'editCategory.html',
            headers:[
                {name:'Category Name',bind_val:'name',isSortable:true},
                {name:'Description',bind_val:'description',isSortable:true,isDescColumn:true},
                {name:'Course',bind_val:'coursecnt',isSortable:true},
                {name:'User',bind_val:'courseusercnt',isSortable:true},
                {name:'Group',bind_val:'coursegroupcnt',isSortable:true},
                {name:'Status',bind_val:'block',isSortable:false,isStatusColumn:true,actionMethods:{status:{api:'coursecat.catgoriesActDeAct',viewName:'categories'}}},
                {name:'Actions',bind_val:'actions',isSortable:false,isActionColumn:true,columnName:"addeditview",ishideViewbtn:true,actionMethods:{delete:{api:'coursecat.catgoriesDel',viewName:'categories'}}}
            ],
            data:[]
        }
        var categoryReq ={} ;
        var task = "coursecat.catgoriesList&catAction=CatList&catId=1";
        /* Method to fetch user details */
        sfactory.serviceCall(categoryReq,task).then(function(response){
            $scope.tableData.data = response.data;	
            $rootScope.appLoader = false;
        },function(error){
            var localTask = "allcategorylist";
            sfactory.localService(localTask).then(function(response){
                $scope.tableData.data = response.data.data.data;
            },function(error){
            });
        });
        $rootScope.appLoader = false;
    }

    /* Method to add category from list */
    $scope.submitcategoryForm=function(details)
    { 
        $scope.category_name=details.category_name;
        $scope.comment=details.comment;
        if(!$scope.comment){
            $scope.showvalue="ng-show";   
        }else{
			$scope.showvalue="ng-hide";      
			var task="coursecat.catgoriesAdd";
			$scope.categorydata={"catAction":'catAdd',"courseCatId":'0',"courseCatName":details.category_name,"courseCatDesc":details.comment};  
			var data = JSON.stringify($scope.categorydata);  
			sfactory.serviceCall(data,task).then(function(response){
            $scope.categorydata.id=response.data;
            var categorypushdata =  $scope.pushModeldata($scope.categorydata);
            $scope.tableData.data.splice(0, 0, categorypushdata);    
            $scope.showform = false;
            $scope.showicon = true;
            $scope.alertBaner = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};   
        },function(error){
            $scope.alertBaner = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
        });   
        }
    }
    
     $scope.$on('editvalues', function(event, catdata) { 
        var task="coursecat.catgoriesUpdate";
		var data = JSON.stringify({"catAction":'catEdit',"courseCatId":catdata.edit.id,"courseCatName":catdata.edit.name,"courseCatDesc":catdata.edit.description});  
		sfactory.serviceCall(data,task).then(function(response){
           // $scope.clicktable2();
			var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
			$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
        },function(error){
            var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
            $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
        });    
    });

	$scope.pushModeldata= function(item){
		return  { id:item.id,
		name:item.courseCatName,
		description:item.courseCatDesc,
		visible:"1",
		visibleold:"1",
		coursecnt:"0 course",
		courseusercnt:"0 User",
		coursegroupcnt:"0",
		row_Checkbox:false
		}
	}      
}]);

advancePubapp.filter('trusted', ['$sce', function($sce) {
    var div = document.createElement('div');
    return function(text) {
        div.innerHTML = text;
        return $sce.trustAsHtml(div.textContent);
    };
}])
 

advancePubapp.controller('categoryEditController',['$scope','sfactory', function($scope,sfactory){
    $scope.data = angular.copy($scope.contentBody);
    /* Method to submit update/edit values of user */
    $scope.category_update_cancel = function(body){
        $scope.contentBody.showChild = false;
    },
    
    $scope.categoryedit = function(catdata){
        $scope.contentBody.name=catdata.name;
        $scope.contentBody.description=catdata.description;
        $scope.contentBody.showChild = false;
        $scope.$emit("editvalues",{edit:catdata});
        
    }
    
}]);
advancePubapp.controller('classanalyticsController', ['$scope', 'sfactory', '$log','$uibModal','reportService','$rootScope','$stateParams','$filter','sessionService','encryptionService',function($scope,sfactory,$log ,$uibModal,reportService,$rootScope,$stateParams,$filter,sessionService,encryptionService) {
    var chartProperties,reportDataReq,chartArray;
    /* Method to fetch overall user reports */
    function getReportData() {
        inputreq = JSON.stringify($scope.reportparams);
        sfactory.serviceCallReports(inputreq, 'classreports').then(function(response) {
            if(angular.isDefined(response)){
                $scope.tableData.data =response.data.class_report;
                $scope.class.reports = response.data;
                $rootScope.appLoader = false;
            }
        }, function(error) {
            var localTask = "classreports";
            sfactory.localService(localTask).then(function(response) {
                $scope.tableData.data =response.data.class_report;
                $scope.class.reports = response.data;
            }, function(error) {
            });
        });
    }
    /* Method to fetch analytics data */
    $scope.getAnalyticsData = function(){
        inputreq = JSON.stringify($scope.reportparams);
        $scope.isAnalytics = true;
        if(!angular.isDefined($scope.class.analytics)){
            sfactory.serviceCallReports(inputreq, 'classanalytics').then(function(response) {
                if(angular.isDefined(response.data)){
                   $scope.class.analytics = response.data;
                   loadAnalytics();
                    $rootScope.appLoader = false;
                }
            }, function(error) {
                var localTask = "classreports";
                sfactory.localService(localTask).then(function(response) {
                    $scope.class.analytics = response.data;
                    loadAnalytics();
                }, function(error) {
                });
            });
        }
        else{
            loadAnalytics();
        }
    }
    
     /* Method to load charts */
    function loadAnalytics(){
        //Load Pie Charts
        $scope.classStatus = reportService.loadPiechart($scope.class.analytics.class_status,'Class Status');
    };
    $scope.chartModalClass = function() {        
        $scope.modalMsgClass = !$scope.modalMsgClass;
    };
    
    $scope.chartModalClassnoofcls = function() {        
        $scope.modalnoofclass = !$scope.modalnoofclass;
    };
    $scope.chartModalClassnoofstatus = function() {        
        $scope.noofstatus = !$scope.noofstatus;
    };
    $scope.chartModalClassnoofstu = function() {        
        $scope.noofstudents = !$scope.noofstudents;
    };
    /* Method to show charts according to the date range selected */
    function updateCharts(startDate,endDate){
        var requestData = JSON.stringify({
            'start_date': startDate,
            'end_date': endDate,
            'group_id'  : $scope.reportparams.group_id,
            'user_id': $scope.reportparams.user_id
        });
        
        sfactory.serviceCallReports(requestData, 'classanalytics').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                //Load Line Charts
                $scope.class.analytics.no_of_class.change(response.data.no_of_class);
                $scope.class.analytics.no_of_class.x = response.data.no_of_class.x;
                $scope.class.analytics.no_students_enrolled_with_classes.change(response.data.no_students_enrolled_with_classes);
                $scope.class.analytics.no_students_enrolled_with_classes.x = response.data.no_students_enrolled_with_classes.x;
                //Load Pie Charts
                $scope.classStatus.change(reportService.loadPiechart(response.data.class_status,'Class Status'));
                $scope.classStatus.data = response.data.class_status;
                $rootScope.appLoader = false;
            }            
            }, function(error) {
            var localTask = "updatedreportdata";
            sfactory.localService(localTask).then(function(response) {
                //Load Line Charts
                $scope.class.analytics.no_of_class.change(response.data.no_of_class);
                $scope.class.analytics.no_students_enrolled_with_classes.change(response.data.no_students_enrolled_with_classes);

                //Load Pie Charts
                $scope.classStatus.change(reportService.loadPiechart(response.data.class_status,'Class Status'));
                $scope.classStatus.data = response.data.class_status;
                $rootScope.appLoader = false;
                }, function(error) {
                });
            });
    };
    
    /* Method to download reports as csv */
    $scope.downloadReport = function(task){
        userId = $scope.reportparams.user_id;
        groupId = $scope.reportparams.group_id;
        if($scope.startDate && $scope.endDate){
            var start = new Date($scope.startDate).getFullYear()+"-"+(Number(new Date($scope.startDate).getMonth())+1)+"-"+new Date($scope.startDate).getDate();
            var end = new Date($scope.endDate).getFullYear()+"-"+(Number(new Date($scope.endDate).getMonth())+1)+"-"+new Date($scope.endDate).getDate();
            window.location = appUrl+task+"?start_date="+start+"&end_date="+end+"&user_id="+userId+"&group_id="+groupId+"&csv=1";
        }
        else{
            window.location = appUrl+task+"?user_id="+userId+"&group_id="+groupId+"&csv=1";
        }
    }
    $scope.downloadbtn = function(){
        $scope.isActive_down = !$scope.isActive_down;
    }
    $scope.closedownload = function(){
        $scope.isActive_down = false;
    };
    $scope.reportdownloadbtn = function(){
        $scope.isActive_downreport = !$scope.isActive_downreport;
    }
    $scope.reportclosedownload = function(){
        $scope.isActive_downreport = false;
    };
    $scope.saveChartObj = function(response){
        var chartObject =_.find(chartArray, function(obj){ return obj.title.textStr  == response.title.textStr;});
        if(angular.isDefined(chartObject)){
            chartArray[chartArray.findIndex(x => x.title.textStr === response.title.textStr)] = response;
        }
        else{
            chartArray.push(response);
        }
    };  
    $scope.export = function(download){
        reportService.exportCharts(chartArray,{type:download});
    };
    
    /* Method to show filter modal */
    $scope.chartModal = function(size, chartType, data, chartHeader,traffic) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'dest/templates/chartsModal.html',
            controller: 'modalController',
            size: size,
            resolve: {
                items: function() {
                    return {
                        chartType: chartType,
                        chartdata: data,
                        header: chartHeader, 
                        traffic:traffic,
                        dateRange:$scope.daterangecustompick,
                        chartProperties:chartProperties
                    };
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    
    /* Method to initialize controller */
    function initializeController(){
        
        var classanalyticsscope = angular.element(jQuery("#adminLanding")).scope();
        
        $scope.reportparams = {
            'group_id'  : encryptionService.decrypt(sessionService.get('grp_id')),            
            'user_id': encryptionService.decrypt(sessionService.get('userId'))
        };
        reportDataReq = JSON.stringify({           
        });
        $scope.class = {};chartArray=[];
        $scope.class.vmDate = Last7Days().split(',')[Last7Days().split(',').length-1]+" To "+Last7Days().split(',')[0];
        getReportData();
        $scope.daterangecustompick = $scope.class.vmDate;
        $scope.dateoptions={
            "locale": {
              "format": "MM-DD-YYYY",
            },
            showDropdowns:true,
            autoApply:true,
            maxDate : new Date(),
            eventHandlers: {
                'apply.daterangepicker': function(ev, picker) {
                    $scope.daterangecustompick = ev.model.startDate.format('MM-DD-YYYY')+ ' To '+ev.model.endDate.format('MM-DD-YYYY');
                    updateCharts(ev.model.startDate.format('MM-DD-YYYY'),ev.model.endDate.format('MM-DD-YYYY'));
                }
            }
        };
       $scope.tableData = {
            pageName: 'classreport',
            isFilterbtns: false,
            isSearch: true,
            isPagination: true,
            sortType: 'firstname',
            isCheckboxhide: true,
            headers: [{
                    name: 'Class name',
                    bind_val: 'classname',
                    isSortable: true
                },
                {
                    name: 'Class Admin',
                    bind_val: 'class_admin',
                    isSortable: true
                },
                {
                    name: 'class admin type',
                    bind_val: 'roleType',
                    isSortable: true
                },       
                {
                    name: 'Number of Enrolled Users',
                    bind_val: 'enrolled_count',
                    isSortable: true
                },
                    
                {
                    name: 'Status',
                    bind_val: 'status',
                    isSortable: true
                },
                {
                    name: 'Date Created',
                    bind_val: 'date',
                    isSortable: true
                }
            ],
            data: []
        };
        chartProperties=[
            {
                chartTitle:"Number of Classes",
                taskUrl :"classcount",
                key:"no_of_class",
                type:"line"
            },
            {
                chartTitle:"Number of Students",
                taskUrl : "enrolledstudents",
                key:"no_students_enrolled_with_classes",
                type:"line"
            },
            {
                chartTitle:"Class Status",
                taskUrl : "classstatus",
                key:"class_status",
                type:"pie"
            }
        ];
    }
    initializeController();
    
}]);
advancePubapp.controller('classcontentmanagementController', ['$scope', 'sfactory', '$rootScope', 'taskService', '$state', '$stateParams','sharedService','sessionService','$filter','$timeout',function($scope, sfactory, $rootScope, taskService,$state,$stateParams,sharedService,sessionService,$filter,$timeout) { 

    var localTask, tasks, dataRequest,courseType,assignCourse,currentState;

    /*Method to initialize request object */
    function getCurrentStateObj(){
        var requestObj={};
        if($stateParams.userid !== ''){
            requestObj.userid = $stateParams.userid;
            requestObj.type = 'individual';
        }
        else{
            requestObj.type = ($stateParams.group && $stateParams.group != '') ? 'group' : 'class';
            requestObj.classmasterid = ($stateParams.group && $stateParams.group != '') ? $stateParams.group : $stateParams.classid;
        }
        return requestObj;
    };
    
    function changeState(){
        var stateName = $state.current.name;
        $state.transitionTo(stateName, currentState,{
            location: true,
            inherit: true,
            relative: $state.$current,
            notify: false,
            reload: true
        });
    };
    

    
    /* Method to change activity status */
    $scope.changeActivityStatus = function(parentIndex, Index) {
        var activityStatusObject = _.countBy(_.pluck($scope.contents.currentSection.lessons[parentIndex].activities, 'isadded'), function(value) {
            return value === true ? 'true' : 'false';
        });
        dataRequest = getCurrentStateObj();
        dataRequest.course_id = $scope.contents.currentSection.lessons[parentIndex].activities[Index].course_id,
        dataRequest.action = ($scope.contents.currentSection.lessons[parentIndex].activities[Index].isadded) ? 'enrol' : 'unenrol'
        sfactory.serviceCall(JSON.stringify(dataRequest), assignCourse,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                $scope.contents.course.sections[$scope.contents.activeSection].lessons[parentIndex].activities[Index].isadded = $scope.contents.currentSection.lessons[parentIndex].activities[Index].isadded;
                $scope.contents.currentSection.lessons[parentIndex].isadded = (activityStatusObject.true > 0);
                updateSectionStatus();
                $scope.contents.currentSection = $scope.contents.course.sections[$scope.contents.activeSection];
            }
        $rootScope.appLoader = false;
        }, function(error) {});
    };

    /* Method to change lesson status */
    $scope.changeLessonStatus = function(index) {
        dataRequest = getCurrentStateObj();
        dataRequest.course_id = $scope.contents.currentSection.lessons[index].lesson_courses,
        dataRequest.action =($scope.contents.currentSection.lessons[index].isadded) ? 'unenrol' : 'enrol',
        sfactory.serviceCall(JSON.stringify(dataRequest), assignCourse,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                _.each($scope.contents.currentSection.lessons[index].activities, function(activity) {
                    activity.isadded = $scope.contents.currentSection.lessons[index].isadded;
                });
                updateSectionStatus();
                $scope.contents.currentSection = $scope.contents.course.sections[$scope.contents.activeSection];
            }
        $rootScope.appLoader = false;
        }, function(error) {});
    };

    /* Method to change section status */
    $scope.changeSectionStatus = function() {
        dataRequest = getCurrentStateObj();
        dataRequest.action = ($scope.contents.currentSection.isadded) ? 'enrol' : 'unenrol';
        dataRequest.course_id = $scope.contents.currentSection.section_courses;
        sfactory.serviceCall(JSON.stringify(dataRequest), assignCourse,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                _.each($scope.contents.course.sections[$scope.contents.activeSection].lessons, function(lesson) {
                    lesson.isadded = $scope.contents.currentSection.isadded;
                    _.each(lesson.activities, function(activity) {
                        activity.isadded = $scope.contents.currentSection.isadded;
                    });
                });
                $scope.contents.currentSection = $scope.contents.course.sections[$scope.contents.activeSection];
            }
        $rootScope.appLoader = false;
        }, function(error) {});
    };

    $scope.changeUnitStatus = function(){
        dataRequest = getCurrentStateObj();
        dataRequest.action = ($scope.contents.currentSection.isadded) ? 'enrol' : 'unenrol';
        dataRequest.course_id = ($scope.contents.currentSection.section_courses);
         sfactory.serviceCall(JSON.stringify(dataRequest), assignCourse,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                angular.forEach($scope.contents.filters,function(filter){
                    $scope.contents.currentSection['isadded'+filter.toLowerCase()] = $scope.contents.currentSection.isadded;
                    angular.forEach($scope.contents.currentSection[filter],function(activity){
                        activity.isadded = $scope.contents.currentSection.isadded;
                    });
                });
            }
        $rootScope.appLoader = false;
        }, function(error) {
            angular.forEach($scope.contents.filters,function(filter){
                $scope.contents.currentSection['isadded'+filter.toLowerCase()] = $scope.contents.currentSection.isadded;
                angular.forEach($scope.contents.currentSection[filter],function(activity){
                    activity.isadded = $scope.contents.currentSection.isadded;
                });
            });
        });
    };
    
    /* Method to change section tabs */
    $scope.changeSection = function(index,type) {
        $scope.contents.activeSection = index;
        $scope.contents.currentSection = (type === 'Phonics Adventure' ) ? $scope.contents.course.sections[index] : $scope.contents.course.units[index];
        currentState.section = index;
        changeState();
    };

    /* Method to update section section status according to lesson and activity status */
    function updateSectionStatus() {
        var lessonStatusObject = _.countBy( _.pluck($scope.contents.currentSection.lessons, 'isadded'), function(value) {
            return value === true ? 'true' : 'false';
        });
        $scope.contents.currentSection.isadded = (lessonStatusObject.true > 0);
    };

    /* Get data for Phonics Adventure or Number Success */
    function dataFor(data){
         switch($scope.contents.tabs.name) {
            case 'Number Success':
                 $scope.contents.currentSection = data.units[0];
                 $scope.contents.activeSection = 0;
                break;
            case 'Phonics Adventure':
                 $scope.contents.currentSection = data.sections[0];
                 $scope.contents.activeSection = 0;
                 flag = true;
                 _.each(data.sections, function(item,index){                    
                    if(item.isadded && flag){
                        $scope.contents.currentSection = item;
                        $scope.contents.activeSection = index;
                        flag = false;
                    }                                      
                });
                break;
        }
    };

    /* Get data on switching parent tabs */
    $scope.getData = function(index,childIndex,isStateUpdate){
        if(index < 3){
            $scope.contents.tabs = angular.copy($scope.headerdata[index]);
            if(isStateUpdate){
                currentState.childtab = 0;
                currentState.section = 0;
            }
            switch (index) {
                case 0:
                    $scope.contents.activeLevel = [false, false];
                    $scope.getLevelData(index,$scope.contents.tabs.categories[0].levels[0].name,0);
                    break;
                case 1:
                    $scope.getContentData(index);
                    break;
                case 2:
                    getWritingsuccessData();
                    break;
            }
            currentState.tab = index;
            changeState();
        }
    };

   /* Method to get Level-1 or Level-2 contents */
    $scope.getLevelData = function(index,levelname,levelIndex) {
        if(!$scope.contents.activeLevel[levelIndex] || levelname === null){
            currentState.childtab = index;
            $scope.activetab.childIndex = currentState.childtab;
            changeState();
            $scope.contents.activeLevel = [false, false];
            $scope.contents.activeLevel[levelIndex] = true;
            if(levelname === null){
                levelname = ($scope.contents.tabs.categories[index].levels) ? $scope.contents.tabs.categories[index].levels[0].name : $scope.contents.tabs.categories[index].name;
            }
            dataRequest = getCurrentStateObj();
            dataRequest.content = levelname;
            dataRequest.courseType = $scope.contents.tabs.name;
            $scope.contents.currentSection=null;
            localStorage.setItem('params', JSON.stringify(dataRequest));
            sfactory.serviceCall(JSON.stringify(dataRequest), tasks.getContents,'listDetails').then(function(response) {
                if($filter('lowercase')(response.status) == 'success'){
                    $scope.contents.course = response.data.courses;
                    dataFor(response.data.courses);
                    $scope.changeSection(Number(currentState.section),dataRequest.courseType);
                }
            $rootScope.appLoader = false;
            }, function(error) {
                sfactory.localService(localTask).then(function(response) {
                    $scope.contents.course = response.data.courses;
                    dataFor(response.data.courses);
                    $scope.changeSection(Number(currentState.section),dataRequest.courseType);
                    $rootScope.appLoader = false;
                }, function(error) {});
            });
        }
    };

    /* Get data for Number Success*/
    $scope.getContentData = function(index){
       $scope.contents.tabs = angular.copy($scope.headerdata[index]);
       dataRequest = getCurrentStateObj();
       dataRequest.courseType=   $scope.contents.tabs.name;
       dataRequest.content = $scope.contents.tabs.categories[currentState.childtab].name;
       $scope.contents.currentSection=null;
        $scope.activetab.childIndex = currentState.childtab;
        sfactory.serviceCall(JSON.stringify(dataRequest), tasks.getContents,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                $scope.contents.course = response.data.courses;
                $scope.contents.filters = response.data.filters;
                dataFor(response.data.courses);
                $scope.changeSection(Number(currentState.section),dataRequest.courseType);
            }
       $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService("number_success").then(function(response) {
                $scope.contents.course = response.data.data.courses;
                $scope.contents.filters = response.data.data.filters;
                $scope.changeSection(Number(currentState.section),dataRequest.courseType);
                $rootScope.appLoader = false;
            }, function(error) {});
        });
    };

    /* Method to change lesson status of Number Success */
    $scope.changeNSActivityStatus = function(index,category) {
        dataRequest = getCurrentStateObj();
        $scope.ns_course.currentSection =category;
        dataRequest.course_id = $scope.contents.currentSection[category][index].course_id;
        dataRequest.action =($scope.contents.currentSection[category][index].isadded) ?  'enrol' : 'unenrol';
        sfactory.serviceCall(JSON.stringify(dataRequest), assignCourse,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                _.each($scope.contents.currentSection[category][index].activities, function(activity) {
                    activity.isadded = $scope.contents.currentSection[category][index].isadded;
                });
                updateCourseStatus($scope.ns_course.currentSection);
                if($scope.contents.course.sections){
                     $scope.contents.currentSection = $scope.contents.course.sections[$scope.contents.activeSection];
                 }else if($scope.contents.course.units){
                     $scope.contents.currentSection = $scope.contents.course.units[$scope.contents.activeSection];
                 }
            }
        $rootScope.appLoader = false;
        }, function(error) {});
    };

    /* Method to change course status of Number Success */
    $scope.changeNSCourse = function(type,select){  
        dataRequest = getCurrentStateObj();
        dataRequest.course_id = $scope.contents.currentSection[type+"_courses"];
        dataRequest.action = select ?  'enrol' : 'unenrol' ,
        sfactory.serviceCall(JSON.stringify(dataRequest), assignCourse,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
              for(var i=0;i< $scope.contents.currentSection[type].length;i++){
                    $scope.contents.currentSection[type][i].isadded = select;
                }      
            }
        $rootScope.appLoader = false;
        }, function(error) {
            updateCourseStatus($scope.ns_course);
        });

    };
    
    /* Method to update Course Status */
    function updateCourseStatus(course){
        var courseStatusObject = _.countBy( _.pluck($scope.contents.currentSection[course], 'isadded'), function(value) {
            return value === true ? 'true' : 'false';
        });
        $scope.contents.currentSection['isadded'+course.toLowerCase()]= courseStatusObject.true > 0;
    };
    
    /* Method to get writing success data */
     function getWritingsuccessData(){
        var selectedIndex = 0;
        $scope.contents.currentSection = null;
        dataRequest = getCurrentStateObj();
        dataRequest.courseType = "Writing Success";
        sfactory.serviceCall(dataRequest, tasks.getContents,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                $scope.contents.course = response.data;
                angular.forEach($scope.contents.course.courses[selectedIndex].sections,function(section){
                    $scope.writingSuccess.menu.push({key:section.key,values:_.pluck(section.subsection[selectedIndex].activities, 'name')})
                });
                $scope.activetab.childIndex = Number(currentState.childtab);
                $scope.switchWritingsuccess($scope.activetab.childIndex,Number(currentState.section));
            }
            $rootScope.appLoader = false;
            }, function(error) {
                sfactory.localService("writingSuccess").then(function(response) {
                    $scope.contents.course = response.data;
                    angular.forEach($scope.contents.course.courses[selectedIndex].sections,function(section){
                        $scope.writingSuccess.menu.push({key:section.key,values:_.pluck(section.subsection[selectedIndex].activities, 'name')})
                    });
                    $scope.activetab.childIndex = Number(currentState.childtab);
                    $scope.switchWritingsuccess($scope.activetab.childIndex,Number(currentState.section));
                }, function(error) {});
            });
    };
   
    /* Method to Change Writing Success Menu status */
    $scope.changeWSMenuStatus = function(index){
        dataRequest = getCurrentStateObj();
        dataRequest.course_id = $scope.writingSuccess.menustatus[index].course_id;
        dataRequest.action = ($scope.writingSuccess.menustatus[index].isadded) ?  'enrol' : 'unenrol';
        sfactory.serviceCall(dataRequest, assignCourse,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                 angular.forEach($scope.contents.currentSection.subsection,function(subsectionObj){
                     if(subsectionObj.activities[index].isactive){
                         subsectionObj.activities[index].isadded = angular.copy($scope.writingSuccess.menustatus[index].isadded);
                     }
                 });
            }
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService("writingSuccess").then(function(response) {
                angular.forEach($scope.contents.currentSection.subsection,function(subsectionObj){
                    if(subsectionObj.activities[index].isactive){
                         subsectionObj.activities[index].isadded = angular.copy($scope.writingSuccess.menustatus[index].isadded);
                    }
                });
            });
            }, function(error) {});
    };
    
    /* Method to Writing Success Subtab */
    $scope.switchWritingsuccess = function(parentIndex,index,stateUpdate){
        $scope.writingSuccess.selectedLevel = $scope.contents.tabs.categories[parentIndex].levels[index];
        angular.forEach($scope.contents.tabs.categories[parentIndex].levels,function(tab,tabIndex){
            tab.isActive = (tabIndex === index);
        });
        $scope.writingSuccess.menuList = _.find($scope.writingSuccess.menu,function(menuObj){
            return menuObj.key === $scope.writingSuccess.selectedLevel.key;
        }).values;
        $scope.contents.currentSection = $scope.contents.course.courses[parentIndex].sections[index];
        updateWSMenuStatus();
        if(angular.isDefined(stateUpdate)){
            switch (stateUpdate) {
                case 'childtabUpdate':
                    currentState.childtab = parentIndex;
                    currentState.section = 0;
                    $stateParams.childtab = parentIndex;
                    $stateParams.section = 0;
                    break;
                case 'section':
                    currentState.section = index;
                    $stateParams.section = index;
                    break;
            }
            changeState();
        }
    };
    
    /* Method to update Writing Success menu status */
    function updateWSMenuStatus(){
        $scope.writingSuccess.menustatus=[];
        var activities=[],isAdded=true,isActive = false,courses=[];
        activities = _.pluck($scope.contents.currentSection.subsection, "activities");
        angular.forEach($scope.writingSuccess.menuList,function(menuList,menuIndex){
            isAdded = true;
            isAtleastOneAdded = false;
            isActive = false;
            courses = [];
            angular.forEach(activities,function(activity,index){
                if(angular.isDefined(activity[menuIndex])){
                    if(activity[menuIndex].isactive){
                       isAdded = isAdded && activity[menuIndex].isadded; 
                       courses.push(activity[menuIndex].course_id);
                       isAtleastOneAdded = true;
                    }
                    isActive = isActive || activity[menuIndex].isactive;
                }
            });
            $scope.writingSuccess.menustatus.push({key:menuList,isadded:isAdded && isAtleastOneAdded,course_id:courses,isactive:isActive});
        });
    };
    
    /* Method to change Writing Success activity status */
    $scope.changeWSActivityStatus = function(subsectionIndex,index){
        dataRequest = getCurrentStateObj();
        dataRequest.course_id = $scope.contents.currentSection.subsection[subsectionIndex].activities[index].course_id;
        dataRequest.action = ($scope.contents.currentSection.subsection[subsectionIndex].activities[index].isadded) ?  'enrol' : 'unenrol';
        sfactory.serviceCall(dataRequest, assignCourse,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                var activityStatusObject = _.countBy(_.pluck($scope.contents.currentSection.subsection[subsectionIndex].activities, 'isadded'), function(value) {
                    return value === true ? 'true' : 'false';
                });
                if($scope.contents.currentSection.subsection[subsectionIndex].isactive){
                    $scope.contents.currentSection.subsection[subsectionIndex].isadded = (activityStatusObject.true > 0);
                }
                updateWSSectionStatus();
            }
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService("writingSuccess").then(function(response) {
                var activityStatusObject = _.countBy(_.pluck($scope.contents.currentSection.subsection[subsectionIndex].activities, 'isadded'), function(value) {
                    return value === true ? 'true' : 'false';
                });
                if($scope.contents.currentSection.subsection[subsectionIndex].isactive){
                    $scope.contents.currentSection.subsection[subsectionIndex].isadded = (activityStatusObject.true > 0);
                }
                updateWSSectionStatus();
            }, function(error) {});
        });
    };
    
    /* Method to change Writing Success lesson status */
    $scope.changeWSLessonStatus = function(index){
        dataRequest = getCurrentStateObj();
        dataRequest.course_id = $scope.contents.currentSection.subsection[index].contentid;
        dataRequest.action = ($scope.contents.currentSection.subsection[index].isadded) ?  'enrol' : 'unenrol';
        sfactory.serviceCall(dataRequest, assignCourse,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                angular.forEach($scope.contents.currentSection.subsection[index].activities,function(activity){
                    if(activity.isactive){
                        activity.isadded = $scope.contents.currentSection.subsection[index].isadded;
                    }
                });
                updateWSSectionStatus();
            }
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService("writingSuccess").then(function(response) {
                angular.forEach($scope.contents.currentSection.subsection[index].activities,function(activity){
                    if(activity.isactive){
                        activity.isadded = $scope.contents.currentSection.subsection[index].isadded;
                    }
                });
                updateWSSectionStatus();
            }, function(error) {});
        });
    };
    
    /* Method to update Writing Success section status */
    $scope.changeWSSectionStatus = function(){
        dataRequest = getCurrentStateObj();
        dataRequest.course_id = $scope.contents.currentSection.contentid;
        dataRequest.action = ($scope.contents.currentSection.isadded) ?  'enrol' : 'unenrol';
        sfactory.serviceCall(dataRequest, assignCourse,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                angular.forEach($scope.contents.currentSection.subsection,function(subsection){
                    if(subsection.isactive){
                        subsection.isadded = $scope.contents.currentSection.isadded;
                    }
                    angular.forEach(subsection.activities,function(activity){
                        if(activity.isactive){
                            activity.isadded = $scope.contents.currentSection.isadded;
                        }
                    });
                });
                updateWSMenuStatus();
            }
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService("writingSuccess").then(function(response) {
                angular.forEach($scope.contents.currentSection.subsection,function(subsection){
                    if(subsection.isactive){
                        subsection.isadded = $scope.contents.currentSection.isadded;
                    }
                    angular.forEach(subsection.activities,function(activity){
                        if(activity.isactive){
                            activity.isadded = $scope.contents.currentSection.isadded;
                        }
                    });
                });
                updateWSMenuStatus();
            }, function(error) {});
        });
    };
    
    /* Method to update Writing Success section status */
    function updateWSSectionStatus(){
        var lessonStatusObject = _.countBy(_.pluck($scope.contents.currentSection.subsection, 'isadded'), function(value) {
            return value === true ? 'true' : 'false';
        });
        $scope.contents.currentSection.isadded = (lessonStatusObject.true > 0);
        updateWSMenuStatus();
    };
    
    /* Method to initialize Controller */
    function initializeController() {
        $scope.ns_course={};
        $scope.activetab={};
        $scope.writingSuccess={menu:[]};
        currentState = $stateParams;
        localTask = 'contentmanagement';
        tasks = taskService.getTasks('classcontentmanagementController');
        assignCourse = ($stateParams.userid !== '') ? tasks.assignCourseIndividual : tasks.assignCourse;
        $scope.tabDetails = $stateParams;
        $scope.contents={levels:[],activeLevel:[false,false],currentSection:null};
        $scope.activeparenttab = Number(currentState.tab);
        $scope.activetab.childIndex = Number(currentState.childtab);
        $scope.getData(Number(currentState.tab),Number(currentState.childtab));
    };

    initializeController();
}]);
advancePubapp.controller('classDetailsController', ['$scope', 'sfactory', '$rootScope', 'taskService','$state', '$stateParams','cacheService','$mdDialog','sessionService','$filter','encryptionService','sharedService',function($scope, sfactory, $rootScope, taskService,$state,$stateParams,cacheService,$mdDialog,sessionService,$filter,encryptionService,sharedService) {

    var templatepath = '',tasks; 
    var dataToPassObj = {},breadCrumbMatcher={};

	function filterData(index,groupId, groupName){
        var stateparams = (index === 0) ? {group: '',table:$stateParams.table} : {group: ($scope.tabs[index-2].groupId),table:$scope.tableType[index-2]};
        var tableName = (stateparams.table === 'users') ? (stateparams.group === '') ? "Students in Class" : "Students in Group": breadCrumbMatcher[stateparams.table];
        $stateParams.group = stateparams.group;
        $state.transitionTo('adminLanding.classDetails', stateparams,{
            location: true,
            inherit: true,
            relative: $state.$current,
            notify: false
        });
    };
     
    /* Method to initialize tabs */
    $scope.initializeTab = function(index, groupId, groupName){
       $scope.selectedTab.inputTab = index;
       $scope.groupId = groupId;
       $scope.groupName = groupName;
       (index !== 0) ? getStudentsInGroup(groupId,true) : "";   
	   (index == 0) ? getStudentsInClass(false) : "";  
       var selectedTab = (index === 0) ? index : index-2;
       $scope.tableType[selectedTab] = 'users';
       filterData(index,groupId, groupName); 
	   sharedService.selectedTab = 0;	
    };
    
    /* Method to assign content - callback */
    $scope.assignContent = function(response){
        $scope.userTable.nameOfUser = response.name;
        $scope.userTable.userid = response.id;
        $state.transitionTo('adminLanding.classDetails', {table:'assignContents',userid:response.id},{
                location: true,
                inherit: true,
                relative: $state.$current,
                notify: false
        });
		$stateParams.userid = response.id;
        $scope.changeTable(0,'assignContents',response.id);
    };
    
    /* Method to change table*/
    $scope.changeTable = function(index,selectedTable,userId,isNew){
        var tableName;
        $scope.tableType = []; 
        $scope.tab = {name:($scope.userTable.nameOfUser !== '') ? $scope.userTable.nameOfUser : $scope.className};
        $scope.userTable.nameOfUser= ''; 
        if(selectedTable && !isNew){
            var banerData = {message:"",showBaner:true,banerClass:'alert-danger'};
            if($scope.selectedTab.inputTab == 0){
                if(!$scope.classStudentDetails.length){	
                    banerData.message = "You can not assign content without adding student in the class.";
                    $scope.tableType = ['users'];
					$scope.alertBaner = banerData;
					return;
                }
            }
            else{
                if(!$scope.groupStudentDetails.length){
                    banerData.message = "You can not assign content without adding student in the group.";
				    for(var i=0; i<index+1; i++) {
                        $scope.tableType.push('users');
                    }
                    $scope.alertBaner = banerData;
                    return;
                }
            }
        }
        userId = angular.isDefined(userId) ? userId : $stateParams.userid;
		selectedTable = angular.isDefined(selectedTable) ? selectedTable : $stateParams.table;
        if(selectedTable === 'courses' || selectedTable === 'assignContents' || selectedTable === 'addContents'){
            getContentHeader(userId,selectedTable);
        }
        else if(selectedTable === 'users'){
            ($stateParams.group === '') ? getStudentsInClass(true) : getStudentsInGroup('');
            setTableType(false,selectedTable);
			sharedService.selectedTab = 0;
        }
        if(angular.isUndefined(selectedTable)){
            selectedTable = 'users';
			sharedService.selectedTab = 0;
        }
    };
    
    /* Method to set tabletype in the current tab*/
    function setTableType(index,selectedTable){
       var stateStatus={};
        $stateParams.table = selectedTable;
        if($stateParams.group == ''){
            $scope.tableType = [selectedTable];
        }
        else{
            _.each($scope.tabs, function(tab) {
                $scope.tableType.push('users');
            });
            $scope.tableType[$scope.selectedTab.inputTab-2] = selectedTable;				
        }
        stateStatus = (selectedTable === 'users') ? {table:selectedTable,userid:''} : {table:selectedTable} ;
        $state.transitionTo('adminLanding.classDetails', stateStatus,{
            location: true,
            inherit: true,
            relative: $state.$current,
            notify: false,
            reload: true
        });
    };
    
    /* Method for set tab details */
    function setTabDetails() {
		var grouArr = [];
        if($scope.groupDetails.length){ 
			checkduplicate =_.difference($scope.groupDetails, $scope.tabs);
			if(checkduplicate){
				$scope.tabs = [];
				_.each(checkduplicate,function(group){                    
					 $scope.tabs.push({
						groupname:group.groupname,          
						groupId: group.groupid,          
						userCount: group.usercnt
					});
				});
			}else{
				_.each($scope.groupDetails,function(group){                    
					 $scope.tabs.push({
						groupname:group.groupname,          
						groupId: group.groupid,          
						userCount: group.usercnt
					});
				   $scope.tabs = _.uniq($scope.tabs, function(p){ return p.groupId; });
				});
			}
        }
        _.each($scope.tabs, function(tab) {
            $scope.tableType.push('users');
        });
        $scope.students = $scope.classStudentDetails;
        if ($stateParams.group) {
            _.each($scope.tabs,function(tab,index){
                if((tab.groupId).toString() === $stateParams.group){
                    $scope.selectedTab.inputTab = (index+2);
                    $scope.groupId = tab.groupId;
                    $scope.groupName = tab.groupname;
                }
            });
            $scope.tableType[$scope.selectedTab.inputTab-2] = $stateParams.table;
            filterData($scope.selectedTab.inputTab,$scope.groupId,$scope.groupName);
        } else {
            $scope.selectedTab.inputTab=0;
            $scope.tableType[0] = $stateParams.table;
            filterData(0,$scope.groupId,$scope.groupName);
        }
    };
    
    /* Method to get students in the group*/
    function getStudentsInGroup(groupId,initialcheck) {
           $scope.isGroupData = {'bool':false};
            var inputreq = {};
            var groupId = groupId || $stateParams.group;
            if(groupId){
                inputreq = JSON.stringify({'classgroupid':groupId,'itemsPerpage':10,'currentPage':1,'sortOrder':'desc','sortCoulmn':'name'});
                sfactory.serviceCall(inputreq,tasks.getGroupDetails,'listDetails').then(function(response){
                    $scope.groupStudentDetails = {};     
                    $scope.groupStudentDetails = response.data;
                    $scope.isGroupData = {'bool':true};
                    $scope.groupTableData.data = [];
                    $scope.groupTableData.data = $scope.groupStudentDetails;
                    $scope.groupTableData.paginateData = response.paginateData;
                    $scope.groupTableData.paginationAPI = tasks.getGroupDetails;
                    $scope.groupTableData.paginateParams = JSON.parse(inputreq);
                    $rootScope.appLoader = false;
					if(initialcheck){
                        $scope.tabs[$scope.selectedTab.inputTab-2].userCount = $scope.groupTableData.paginateData.total_matched_records; 
					}
                },function(error){
                    var localTask = "groupStudents";
                    sfactory.localService(localTask).then(function(response){     
                        $scope.groupStudentDetails = {};     
                        $scope.groupStudentDetails = response.data.data;
                        $scope.isGroupData = {'bool':true};
                        $scope.groupTableData.data = [];
                        $scope.groupTableData.data = $scope.groupStudentDetails;
                        $scope.groupTableData.paginateData = response.data.paginateData;
                        $scope.groupTableData.paginationAPI = tasks.getGroupDetails;
                        $scope.groupTableData.paginateParams = JSON.parse(inputreq);
                        $rootScope.appLoader = false;
                    },function(error){
                    });
                });
            } 
    };
    
    /* Method to get classdetails */
    function getStudentsInClass(isUpdategroup) {
        $scope.isGroupData = {'bool':false};
        var inputreq = JSON.stringify({'itemsPerpage':10,'currentPage':1,'sortOrder':'desc','sortCoulmn':'name','classmasterid':$stateParams.classid});
        sfactory.serviceCall(inputreq,tasks.getClassDetails,'listDetails').then(function(response){
            $scope.isGroupData = {'bool':true};
            $scope.classDetails = response.data.classdeatils;
            $scope.classDetails.imagename ? $scope.classImg = $scope.classDetails.profile_picurl + $scope.classDetails.imagename : '';
            $scope.groupDetails = response.data.groupdeatils;
            $scope.classStudentDetails = response.data.classstudentdeatils;
            $scope.classTableData.data = $scope.classStudentDetails;
            $scope.classTableData.paginateData = response.data.paginateData;
            $scope.classTableData.paginationAPI = tasks.getClassDetails;
            $scope.classTableData.paginateParams = JSON.parse(inputreq);
            $scope.classStudentsCount = response.data.classstudentdeatils ? response.data.classstudentdeatils.length : 0;
            $rootScope.appLoader = false;
            if(isUpdategroup){
                setTabDetails(); 
            }          
        },function(error){
            var localTask = "classDetails";
            sfactory.localService(localTask).then(function(response){
                $scope.isGroupData = {'bool':true};
                $scope.classDetails = response.data.data.classdeatils;
                $scope.classDetails.imagename ? $scope.classImg = $scope.classDetails.profilepic_url + $scope.classDetails.imagename : '';
                $scope.groupDetails = response.data.data.groupdeatils;
                $scope.classStudentDetails = response.data.data.classstudentdeatils;
                $scope.classTableData.data = $scope.classStudentDetails;
                $scope.classTableData.paginateData = response.data.data.paginateData;
                $scope.classTableData.paginationAPI = tasks.getClassDetails;
                $scope.classTableData.paginateParams = JSON.parse(inputreq);
                $scope.classStudentsCount = response.data.data.classstudentdeatils ? response.data.data.classstudentdeatils.length : 0;
                $rootScope.appLoader = false;
                if(isUpdategroup){
                    setTabDetails(); 
                }
            },function(error){
            });
        });
    }
	
    /* Method to get content data */
   function getContentHeader(userId,selectedTable){
        var tableToDisplay,dataRequest;
             if(userId !== ''){
                 dataRequest = {type:'individual',userid:userId};
            }
            else{
                dataRequest = {
                    type:($stateParams.group && $stateParams.group != '') ? 'group' : 'class',
                    classmasterid:($stateParams.group && $stateParams.group != '') ? $stateParams.group : $stateParams.classid
                };
            }
            sfactory.serviceCall(JSON.stringify(dataRequest),tasks.getHeader,'listDetails').then(function(response) {
                $scope.activetab ='';
                var headerData = response.data[0].categories;
                _.each(headerData,function(category,outerIndex){
                    category.isadded = false;
                    _.each(category.levels,function(level){
                        if(level.isadded){
                            category.isadded = true;
                            if($scope.activetab === ''){
                                $scope.activetab = outerIndex;
                            }
                        }
                    });
                });
                if($scope.activetab === '' && selectedTable === 'courses'){
                    selectedTable = 'addContents';
                    $stateParams.table = 'addContents';
                    $rootScope.appLoader = false;
                }
                else{
                    if($scope.activetab === ''){
                       $scope.activetab = 0;
                    }
                    $scope.headerdata = response.data;
                    selectedTable = (selectedTable == 'addContents') ? 'assignContents' : selectedTable;
                }
                setTableType(false,selectedTable);
            }, function(error) {
                var localTask = "contentmanagement";
                    sfactory.localService(localTask).then(function(response){     
                        $scope.activetab =0;
                        $scope.headerdata = response.data.header;
                        $scope.courseHeader = response.data.header;
                        setTableType(false,selectedTable);
                    },function(error){
                });
            });
    };
    
    
    /* Method for add student popup */	
    $scope.addStudentPopup = function(ev,parentState) { 
		//addstudentcount = ($stateParams.group) ? $scope.groupTableData.paginateData.total_records : $scope.classTableData.paginateData.total_records;
		addstudentcount = ($stateParams.group) ? angular.isDefined( $scope.groupTableData.paginateData.total_records)? $scope.groupTableData.paginateData.total_records: 0 : $scope.classTableData.paginateData.total_records;
		if(angular.isDefined(addstudentcount) && addstudentcount < 100){
			$mdDialog.show({
            controller: 'addStudentModalController',
            templateUrl: templatepath+'addStudentModal.html',
            parent: angular.element(document.body),
			locals:{dataforUserEnrollement: {'classmasterid':$stateParams.classid,'parentPage':$stateParams.group ? 'group' : 'class','classgroupid':$stateParams.group,'parentState':parentState,'classusercnt':($stateParams.group) ? $scope.groupTableData.paginateData.total_matched_records : $scope.classTableData.paginateData.total_matched_records}},	
            targetEvent: ev,
            clickOutsideToClose:false,
			}).then(function(answer){
                if(answer) {
                    if($stateParams.group !== ''){
                       /* if(parentState === 'new'){
                            _.each($scope.tabs, function(tab) {
                                $scope.tableType.push('users');
                            });
                            $scope.tableType[$scope.selectedTab.inputTab-2] = 'courses'; 
                            $scope.changeTable($scope.selectedTab.inputTab-2,'courses','',true);
                        }*/
                        getStudentsInGroup('',true);
                    }
                    else{
                        if(parentState === 'new'){
                            $scope.tableType[$scope.selectedTab.inputTab] = 'courses'; 
                            $scope.changeTable($scope.selectedTab.inputTab,'courses','',true);
                        }
						getStudentsInClass(false);
						if(!answer.isExisting){
							(answer.data && answer.data.length) ? $scope.classTableData.data = $scope.classTableData.data.concat(answer.data) : $scope.classTableData.data.push(answer.data); 
						}						
                    }
					(angular.isDefined(answer.message) && answer.message != "") ? $scope.alertBaner = {'message':answer.message,'showBaner':true,'banerClass':'alert-success'} : "";
                } 
				
			},function(){
				
			});
		}else{
			var banerData = {'message':"Already Maximum count 100 reached",'showBaner':true,'banerClass':'alert-danger'}; 
			$scope.alertBaner = banerData;
            return;
		}
    };
	
   /* Method for message popup */	
   $scope.messagePopup = function(ev,parentState,groupId){        
        $mdDialog.show({
            controller: 'messageModalController',
            templateUrl: templatepath+'messageModal.html',
            parent: angular.element(document.body),
            locals:{dataToMessage: {'classmasterid':$stateParams.classid,'parentState':parentState,'groupId':groupId}},
            targetEvent: ev,
            clickOutsideToClose:true,
        }).then(function(returnmessage){
			if(returnmessage){
				var banerData = {'message':returnmessage.message,'showBaner':true,'banerClass':'alert-success'};   
				$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
			}
		},function(){
			
		}); 
    };
    
    /* Method for create group popup */
	$scope.createEditGroupPopup = function(ev) {
        var indexOfSelectedGroup,banerData;
        $mdDialog.show({
          controller: 'createGroupController',
          templateUrl: templatepath+'createGroupModal.html',
          locals:{dataToPass: dataToPassObj},
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false
        }).then(function(returnmessage){
			if(!returnmessage.cancel){
                if(angular.isDefined(returnmessage.inputreq)){
                   indexOfSelectedGroup = _.findIndex($scope.tabs, { groupId: returnmessage.inputreq.classgroupid });
                   $scope.tabs[indexOfSelectedGroup].groupname= returnmessage.inputreq.classgroupname; 
				   $scope.groupName = returnmessage.inputreq.classgroupname;
                }
				//Create group stateparams maintain
				if(angular.isDefined(returnmessage.response.data) && returnmessage.response.data.groupid){
					$stateParams.group = returnmessage.response.data.groupid;
					$scope.groupDetails.push(returnmessage.response.data);
					$state.transitionTo('adminLanding.classDetails', {classid:classId, group:returnmessage.response.data.groupid ,table: 'users'},{
                        location: true,
                        inherit: true,
                        relative: $state.$current,
                        notify: false,
                        reload: false
                    });
                    $stateParams.group = returnmessage.response.data.groupid;
					$stateParams.table ="users";
					$scope.groupTableData.paginateData={isDbempty:true};
					$scope.groupTableData.data=[];
                    setTabDetails();
					//getStudentsInGroup();
				}
			  	banerData = {'message':returnmessage.response.message,'showBaner':true,'banerClass':'alert-success'};   
				$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
			}else{
                if(dataToPassObj.groupType === 'add'){
                    $scope.selectedTab.inputTab=0;
				    $scope.tableType[0] = $stateParams.table;
                }
			}
		},function(){
		}); 
    }; 

    /* Method to edit class popup */
    $scope.editClassPopup = function(ev) {
        dataToPassObj.className = $scope.className;
        dataToPassObj.classId = $stateParams.classid;
        dataToPassObj.classImg = $scope.classImg;
        dataToPassObj.classType = 'edit';
        $mdDialog.show({
          controller: 'createClassController',
          templateUrl: templatepath+'createClassModal.html',
          locals:{dataToPass: dataToPassObj},
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        }).then(function(returnmessage){
			if(returnmessage){
                $scope.className = returnmessage.editedClassName;
                returnmessage.response.data.classicon_image ? $scope.classImg = returnmessage.response.data.classicon_url + returnmessage.response.data.classicon_image : '';
				var banerData = {'message':returnmessage.response.message,'showBaner':true,'banerClass':'alert-success'};  
				$scope.alertBaner = banerData;
			}
		},function(){
			
		});
      };
    
    /* Method for edit class or group */
    $scope.editClassOrGroup = function(ev, type) {
        dataToPassObj = {};
        dataToPassObj.classId = $stateParams.classid;
        if (type === 'class') {
            dataToPassObj.className = $scope.className;
            $scope.editClassPopup(ev);
        } else if(type === 'groupedit') {
            dataToPassObj.group = $scope.groupId;
            dataToPassObj.groupName = $scope.groupName;
            dataToPassObj.groupType = 'edit';
            $scope.createEditGroupPopup(ev);
        } else if(type === 'groupadd' && angular.isDefined($scope.groupDetails) && $scope.groupDetails.length < 10){
			if(!$scope.classStudentDetails.length){
				var banerData = {'message':"You cannot create a group without adding students in class.",'showBaner':true,'banerClass':'alert-danger'}; 
				$scope.alertBaner = banerData;
				$scope.selectedTab.inputTab = 0;
			}
			else{
				dataToPassObj = $stateParams;
				dataToPassObj.groupType = 'add';
				$scope.createEditGroupPopup(ev);
			}  
        } else if(type === 'groupadd' && angular.isDefined($scope.groupDetails) && $scope.groupDetails.length >= 10){
            var banerData = {'message':"Already maximum count 10 reached",'showBaner':true,'banerClass':'alert-danger'};   
            $scope.alertBaner = banerData;	
            $scope.selectedTab.inputTab = 0;
            return;
        }        
    }; 
	
    $scope.changeClassOptions = function(value,event){
        if(event) event.stopPropagation();
        $scope.classOptions = value;
    };

    /* Method to delete class */
	 $scope.deleteClass = function() {
        var confirm = $mdDialog.confirm()
        .title('Are you sure you want to delete the class?')
        .ariaLabel('Lucky day')
        .targetEvent()
        .ok('DELETE')
        .cancel('CANCEL');
		if(angular.isDefined($scope.classStudentDetails) && $scope.classStudentDetails.length == 0){
			$mdDialog.show(confirm).then(function() {
				var data = {'classmasterid':$stateParams.classid};
				sfactory.serviceCall(data,tasks.deleteClass,'listDetails').then(function(response){
                    if($filter('lowercase')(response.status) == 'success'){
                        var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'}; 
                        $scope.alertBaner = banerData;	
						$state.transitionTo('adminLanding.classmanagement', null, {'reload':true});
                    }else{
						$scope.alertBaner = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'}; 
					}
                    $rootScope.appLoader = false;
				},function(error){
					$rootScope.appLoader = false;
					$state.transitionTo('teacherDashboard', null, {'reload':true});
				});
			}, function() {
			
			});
		}else{
			var banerData = {message:'You can not delete the class with students. Remove students first to delete the class.','showBaner':true,'banerClass':'alert-danger'}; 
            $scope.alertBaner = banerData;
		}
    }
	
	 /* Methodfor delete group */
	$scope.deleteGroup = function(tab) {
        var confirm = $mdDialog.confirm()
        .title('You are trying to delete a group. Do you really want to delete group?')
        .ariaLabel('Lucky day')
        .targetEvent()
        .ok('DELETE')
        .cancel('CANCEL');
		if(angular.isDefined($scope.groupStudentDetails) && $scope.groupStudentDetails.length == 0){
			$mdDialog.show(confirm).then(function() {
				var data = {'classgroupid':tab.groupId};
					sfactory.serviceCall(data,tasks.deleteGroup,'listDetails').then(function(response){
                        if($filter('lowercase')(response.status) == 'success'){
                            var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'}; 
                            $scope.alertBaner = banerData;	
                            $scope.tabs.splice(_.findIndex($scope.tabs, {groupId: tab.groupId }), 1);
                            $scope.groupDetails.splice(_.findIndex($scope.tabs, {groupid: tab.groupId }), 1);
                            $scope.tableType = ['users'];
                            $scope.selectedTab.inputTab = 0;
                            setTimeout(function () {	
                                $state.transitionTo('adminLanding.classDetails', {group:'',table:'users'},{
                                    location: true,
                                    inherit: true,
                                    relative: $state.$current,
                                    notify: false,
                                    reload: false
                                });
                            },2000);
                        }else{
							$scope.alertBaner = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'}; 
						}
                       $rootScope.appLoader = false;
					},function(error){
						$rootScope.appLoader = false;
						$state.go('adminLanding.classDetails', {class: $stateParams.classid, group: '', table:'users'},{reload:true});
					});
			}, function() {
			});
		}else{
			var banerData = {'message':"Group has student so you can't delete group",'showBaner':true,'banerClass':'alert-danger'}; 
			$scope.alertBaner = banerData;
			$scope.grpoptions = false;
		}
    }

    
	/* Method callback for close the baner alert message */
    $scope.closeBaner = function(){
        $scope.alertBaner.showBaner = false;
    }
	$scope.$on('emitFromDirectiveBaner',function(event,args){
		if(angular.isDefined(args.page) && args.page.pagename == 'groupStudentCount' && args.page.id){
			if(_.findIndex($scope.groupStudentDetails, {id: args.page.id }) != -1){
				$scope.groupStudentDetails.splice(_.findIndex($scope.groupStudentDetails, {id: args.page.id }), 1);
			}				
			if($scope.tabs[$scope.selectedTab.inputTab-2].userCount != 0){
				$scope.tabs[$scope.selectedTab.inputTab-2].userCount = $scope.tabs[$scope.selectedTab.inputTab-2].userCount-1;
			}
		}
		if(args.page == 'classStudentCount'){
			getStudentsInClass(true);
		}
        $scope.alertBaner = args.alertBaner;
    })

    /* Method to initialize controller */
    function initializeController() {
		$scope.selectedTab = {};
        $scope.isGroupData = {'bool':false};
        $scope.classOptions = false;
        $scope.grpOptions = false;
        $scope.tabs = [];
        $scope.userTable = {userid:'',nameOfUser:''};
        tasks = taskService.getTasks("classDetailsController");
        /*Object to be configured students in class*/
        $scope.classTableData = {
            paginateData:null,
            paginationAPI:'',
            paginateParams:'',
            resKey:'classstudentdeatils',
            isDrilldown:true,
            pageName: 'psclassDetails',
            isFilterbtns: false,
            isSearch: true,
            isPagination: true,
            isroletypedisplay: true,
            sortType: 'name',
            headers: [{
                name: 'Name',
                bind_val: 'name',
                isSortable: true
            },{
                name: 'User Name',
                bind_val: 'username',
                isSortable: true
            },{
                name: 'Class',
                bind_val: 'classname',
                isSortable: true,
				isActionColumn: true,
                columnName: "addtooltippopup",
            }, {
                name: 'Group',
                bind_val: 'classgroupname',
                isSortable: true,
				isActionColumn: true,
                columnName: "addtooltippopup",
            }, {    
                name: 'Last Login',
                bind_val: 'lastvisitDate',
                isSortable: true
            }, {
                name: 'Roaming Content',
                bind_val: 'roaming_content',
                isSortable: true,
                isSortable:true,
                isStatusColumn:true,
                columnName:"roaming",
                actionMethods:{status:{api:'adminclass.userRoamingContent',viewName:'adminclassDashboard'}}
            }, {
                name: 'Action',
                bind_val: '',
                isSortable: false,
                isActionColumn:true,
                columnName:'dottedIcons'
            }],
            data: []
        }
        
        /*Object to be configured students in Group*/
        $scope.groupTableData = {
            paginateData:null,
            paginationAPI:'',
            paginateParams:'',
            pageName: 'psclassDetails',
            isFilterbtns: false,
            isSearch: true,
            isPagination: true,
            isroletypedisplay: true,
            sortType: 'name',
            headers: [{
                name: 'Name',
                bind_val: 'name',
                isSortable: true
            },{
                name: 'User Name',
                bind_val: 'username',
                isSortable: true
            },{
                name: 'Class',
                bind_val: 'classname',
                isSortable: true,
				isActionColumn: true,
                columnName: "addtooltippopup",
            }, {
                name: 'Group',
                bind_val: 'classgroupname',
                isSortable: true,
				isActionColumn: true,
                columnName: "addtooltippopup",
            }, {    
                name: 'Last Login',
                bind_val: 'lastvisitDate',
                isSortable: true
            }, {
                name: 'Roaming Content',
                bind_val: 'roaming_content',
                isSortable: true,
                isSortable:true,
                isStatusColumn:true,
                columnName:"roaming",
                actionMethods:{status:{api:'adminclass.userRoamingContent',viewName:'adminclassDashboard'}}
            }, {
                name: 'Action',
                bind_val: '',
                isSortable: false,
                isActionColumn:true,
                columnName:'dottedIcons'
            }],
            data: []
        }
        $scope.domainURL = templateURL ? templateURL:'';
        templatepath = templateURL+"dest/templates/";
        $scope.icons ={
            addGroupusericon : "Add student to group",
            addClassusericon : "Add student to class",
            addGrpconticon   : "Assign Content to Group",
            addClassconticon : "Assign Content to Class"
        };
        
		$scope.selectedadminid = (!_.isNull(sessionService.get('teacherid'))) ? encryptionService.decrypt(sessionService.get('teacherid')) : '';
		$scope.className       = (!_.isNull(sessionService.get('classname'))) ? encryptionService.decrypt(sessionService.get('classname')) : '';
        getStudentsInClass(true);
        if($stateParams.group != ''){
            getStudentsInGroup();
        }
        $scope.changeTable();
    };
    
    initializeController();
    
}]);
advancePubapp.controller('classEditController',['$scope','sfactory','$timeout', '$q','$rootScope','$filter','$mdDialog','cacheService', function($scope,sfactory,$timeout,$q,$rootScope,$filter,$mdDialog,cacheService){
     
	//banner emit in class management conteoller
	$scope.captureBaner = function(value){
        var banerData = {'message':value.message,'showBaner':value.showBaner,'banerClass':value.banerClass};
        $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData,'list':value.switchMenu});
    };
	$scope.$on('emitFromDirectiveBaner', function(event, args) {
        $scope.alertBaner = args.alertBaner;
    });
	 
    if($scope.contentBody.isMessage){  
    //method for delete 
    $scope.deleteclassmessage = function(messageid){
		var task       = "messaging.messageActions";
		var data = {'messageId':messageid,"actionType":"delete"};
        sfactory.serviceCall(data,task,'listDetails').then(function(response){            
            if($filter('lowercase')(response.status) == 'success'){
				var matchmessageid = messageid;
				var matchdeleteid  = ( _.filter($scope.messagetabs[0]['content'], function(num){ return _.contains(matchmessageid,num.messageId) }));
				if(matchdeleteid.length > 0){
					_.each(matchdeleteid,function(selectedItems){
						deleteUniq($scope.messagetabs[0]['content'], 'messageId', selectedItems.messageId); 
					});
				}
				var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
				$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
				$scope.$emit('emitForClose',{'isSingleuser':false,'isMultiuser':false,'showicon':true});
            }else{
					var banerData = {'message':'The group is non deletable','showBaner':true,'banerClass':'alert-success'};
					$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
					$scope.$emit('emitForClose',{'isSingleuser':false,'isMultiuser':false,'showicon':true});
				}
			$rootScope.appLoader = false;
        },function(error){           
        });
	}	
    
      //Method for checkbox    
    $scope.selectedclassmessage = [];
		$scope.classmessagetoggle = function (item, list) {
			var idx = list.indexOf(item);
			if (idx > -1) {
				list.splice(idx, 1);
			}
			else {
				list.push(item);
			}
		};

		$scope.classmessageexists = function (item, list) {
			return list.indexOf(item) > -1;
		};

		$scope.classmessageIndeterminate = function() {
			return ($scope.selectedclassmessage.length !== 0 &&
			$scope.selectedclassmessage.length !== $scope.messageid.length);
		};

		$scope.classMessageSelectAll = function() {
		if ($scope.selectedclassmessage.length === $scope.messageid.length) {
			$scope.selectedclassmessage = [];
		} else if ($scope.selectedclassmessage.length === 0 || $scope.selectedclassmessage.length > 0) {
			$scope.selectedclassmessage = $scope.messageid.slice(0);
		}
	};
        
	//Method for send item contents
		$scope.messagetabs = [
		  { title: 'SENT', content: []}
		];		
		var serRequest = JSON.stringify({receiverClassId:$scope.contentBody.id});
		angular.forEach($scope.messagetabs, function (val, key) {
			if(val.title == 'SENT'){
				//messagetabs[key]['content'] = 'djsfsf';
					$scope.sendClassMessageList = function(){
					var task       = "messaging.sentMessageList";
					
					sfactory.serviceCall(serRequest,task,'listDetails').then(function(response){ 
						$scope.messagetabs[key]['content'] = response.data;
						if($filter('lowercase')(response.status) == 'success'){
							$scope.messagetabs[key]['content'] = response.data; 
                            $scope.messageid = _.pluck(response.data, 'messageId') 
							$scope.initMessageObj();
						}else{
							
						}
						$rootScope.appLoader = false;
					});
				}
			}
		}) 			
				
		$scope.sendClassMessageList();	
		/* Method to initialize Message object object */
		$scope.initMessageObj = function(){
			$scope.message = {messageTo:'',messageSubject:'',messageContent:''};    
		}
		$scope.initMessageObj();
		//Method for message send
		$scope.createClassMessage = function(){
			$scope.message.receiverClassId = $scope.data.id;
            $scope.message.receiverUserEmail = $scope.data.email;
			var serRequest = JSON.stringify($scope.message);
			var task       = "messaging.composeUserMail";
			
			sfactory.serviceCall(serRequest,task,'listDetails').then(function(response){            
				if($filter('lowercase')(response.status) == 'success'){
                    $scope.messagetabs[0]['content'].push($scope.message);
					var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
					$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
					$scope.$emit('emitForClose',{'isSingleuser':false,'isMultiuser':false,'showicon':true});
					$scope.initMessageObj();
                    $scope.contentBody.showChild = false;
                    $timeout(function(){
						$scope.contentBody.showChild = true;
					},0)
				}else{
					var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
					$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
				}
				$rootScope.appLoader = false;
			},function(error){
				if(response){
					var banerData    = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
					$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
				}
			});
		}
        
       //Method for send mail    
       $scope.viewsentclassmail = function(content){
			$mdDialog.show({
				controller: 'userSentMailViewController',
				templateUrl: 'dest/templates/userSentMailView.html',
				parent: angular.element(document.body),
				clickOutsideToClose:false,
				fullscreen: true,
				locals: {
				   mailcontent: content
				 }
			}).then(function() {            
			}, function() {
				
			});
		}  
	}
    
    //Method for contentbody watch
	$scope.$watchCollection('contentBody',function(newVal,oldVal){
        $scope.data.viewChild  = newVal.viewChild;
        $scope.data.showChild  = newVal.showChild;
        $scope.data.isEditable = newVal.isEditable;
		$scope.data.isAddUser = newVal.isAddUser;
		$scope.data.isAddCourse = newVal.isAddCourse;
		
		if($scope.contentBody.isEditable && $scope.contentBody.editcourse){
			if(!angular.isDefined($scope.coursecatcoryarray)){
				$scope.classeditcourse();
			}
		}
		
		if($scope.contentBody.isEditable && $scope.contentBody.edituser){
			if(!angular.isDefined($scope.classedituseresponse)){
				classeditusers();
			}			
		}
		
		if($scope.contentBody.isEditable && $scope.contentBody.editall){
			myadmintype();
		}
		if($scope.contentBody.viewChild){
			classviewcourse();
			classviewusers();
		}
		$scope.data = angular.copy($scope.contentBody);
    });
    /* Method to submit update/edit values of user */
    $scope.class_update_cancel = function(body){
        var showItems = ["showChild","isEditable","isAddCourse","isAddUser","editcourse","edituser","editall","viewChild"];
        _.filter(showItems, function (key) {
            $scope.contentBody[key] = false;
        });
    }
    
    /*Method for class edit*/
    $scope.classedit = function(classdata){
        var data = JSON.stringify({
            "classid": classdata.id,
            "classname": classdata.name,
            "groupid": classdata.groupid,
            "roletype": classdata.roletype,
            "adminid": classdata.userid
        });        
        var task = "classes.classUpdate"; 
        sfactory.serviceCall(data, task,"listDetails").then(function(response) {
        if($filter('lowercase')(response.status) == 'success'){
            $scope.contentBody.isEditable = false;
			roleType = classroletypecheck(Number(classdata.roletype));
			classdata.roleType = roleType;
			$scope.selectedItemadmin = classdata.class_admin;
            classeditmodelAssign($scope.contentBody,classdata,response.data);
            var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
            $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
        }
        else{
            var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
            $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
        }
        $rootScope.appLoader = false;
        }, function(error) {
            var banerData = {
                'message': response.message,
                'showBaner': true,
                'banerClass': 'alert-danger'
            };
            $scope.$emit('emitFromDirectiveBaner', {
                'alertBaner': banerData
            });
        });
    };
    
	function classroletypecheck(id){
		classroletype  = [{"roleid":3,"rolname":"Teacher"},{"roleid":5,"rolname":"Student"},{"roleid":9,"rolname":"Parent"},{"roleid":10,"rolname":"Group Admin"}];
		filteredrole   = _.findWhere(classroletype, {roleid: id});
		return filteredrole.rolname;
	}
	
    /*Method for tablevalue without server data*/
    function classeditmodelAssign(model,currentdata,response){
        model.id            = currentdata.id,
        model.name          = currentdata.name,
        model.classcode     = currentdata.classcode,
        model.registerdate  = currentdata.registerdate,
        model.roletype      = currentdata.roletype,
        model.roleType      = currentdata.roleType,
        model.groupname     = currentdata.groupname,
        model.class_admin   = currentdata.class_admin,
        model.block         = true,
        model.row_Checkbox  = false,
        model.class_status  = "1",
        model.groupid       = currentdata.groupid
    }  
	
   $scope.$on('emitupdateuserdata',function(event,args){
		$scope.contentBody.user_count = args.user_count;
		if(args.value){
			if(!angular.isDefined($scope.contentBody.enrolled_users)){
				$scope.contentBody.enrolled_users = [];
			}
			$scope.contentBody.enrolled_users.push(args.user);
		}
		if(!args.value){
			$scope.contentBody.enrolled_users.pop(args.user);
		}
	});
	
    $scope.gathereditCoursesvalues = function(selectedCourseid,course_count,content,value){
		$scope.contentBody.course_count = course_count;
		if(content.type == 'course'){
			if(value){
				if(!angular.isDefined($scope.contentBody.enrolled_courses)){
					$scope.contentBody.enrolled_courses = [];
				}
				$scope.contentBody.enrolled_courses.push(content.courses);
			}
			if(!value){
				$scope.contentBody.enrolled_courses.pop(content.courses);
			}
		}		
    }
  	/**
     * Create filter function for a query string
     */
    $scope.createFilterFor = function(query) {	
        var lowercaseQuery = query;
		return function filterFn(state) {	
		var nameval=angular.lowercase(state.name);
		return (nameval.indexOf(lowercaseQuery) === 0);
		};
    }
		
	 /* Method to get selected object from auto complete */
    $scope.selectedItemChange = function(item){
        if(item){
        $scope.data.groupid = item.id;
		$scope.data.groupname = item.name;
        }
    }

  
    $scope.querySearch = function(query) {
		var results = query ? $scope.states.filter( $scope.createFilterFor(query) ) : $scope.states;
		var deferred = $q.defer();
		$timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
		return deferred.promise;
    }
	
    $scope.selectedItemChangeadmin = function(item){
        if(item){
        $scope.data.userid = item.id;
		$scope.data.class_admin = item.name;
        }
    }
	 
	$scope.querySearchadmin = function(query) {
		var results = query ? $scope.adminname.filter( $scope.createFilterFor(query) ) : $scope.adminname;
		var deferred = $q.defer();
		$timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
		return deferred.promise;
    }

	function getallGrp(){
		var groupReq ={};
		var taskgroup = "classes.get_all_groups";
		sfactory.serviceCall(groupReq,taskgroup,"listDetails").then(function(response){
			$scope.states= JSON.parse(JSON.stringify(response.data));
			$rootScope.appLoader = false;
		},function(error){
			var localTask = "groupname";
			sfactory.localService(localTask).then(function(response){	
			$scope.states= JSON.parse(JSON.stringify(response.data));
			},function(error){
			});
		});
	}
    
	$scope.myadmintype=function()
	{   
	    $scope.selectedItemadmin  = null;
        $scope.searchTextadmin    = null;
		$scope.data.class_admin="";
	    var gid=$scope.data.groupid; 
		var userroleReq ={"groupid":gid,"admintype":$scope.data.roletype};
        var taskrolegrp = "classes.classadminlistrole";
        /* Method to fetch class details */
        sfactory.serviceCall(JSON.stringify(userroleReq),taskrolegrp,"listDetails").then(function(response){
            $scope.adminname = response.data;
			$rootScope.appLoader = false;
        },function(error){
            var localTask = "groupname";
            sfactory.localService(localTask).then(function(response){
                $scope.adminname = response.data.data.data;
            },function(error){
            });
        });
	}
    
    //method for myadmintype
	function myadmintype()
	{
		var gid=$scope.data.groupid;
		var userroleReq ={"groupid":gid,"admintype":$scope.data.roletype};
        var taskrolegrp = "classes.classadminlistrole";
        /* Method to fetch class details */
        sfactory.serviceCall(JSON.stringify(userroleReq),taskrolegrp,"listDetails").then(function(response){
            $scope.adminname = response.data;
			$rootScope.appLoader = false;
        },function(error){
            var localTask = "groupname";
            sfactory.localService(localTask).then(function(response){
                $scope.adminname = response.data.data.data;
            },function(error){
            });
        });
		
	}
	
    //method for classviewcourse
	function classviewcourse(){
		$scope.crossicon = {showform :false,showicon:false};
        var templatepath = templateURL+"dest/templates/";
         $scope.tableDataviewcoursenew = {
			pageName:'classcoursemanagement', 
            isFilterbtns:false,
            isSearch:true,
            isPagination:true,
			isCheckboxhide:true,
            isrowSelect:false,
			sortType:'coursename',
            headers:[
                {name:'Course Name',bind_val:'coursename',isSortable:true},
                {name:'Book Name',bind_val:'category_textbook',isSortable:true,isDescColumn:true},
				{name:'Category',bind_val:'cat_name',isSortable:true},
            ],
            data:[]
        }
        var viewcourseReq = JSON.stringify({"classid":$scope.data.id});
        var viwcoursetask = "classes.view_class_course";
        /* Method to fetch user details */
        sfactory.serviceCall(viewcourseReq,viwcoursetask,'listDetails').then(function(response){
            $scope.tableDataviewcoursenew.data = response.data;
			$rootScope.appLoader = false;
        },function(error){
            var localTask = "classcourselist";
            sfactory.localService(localTask).then(function(response){
                $scope.tableDataviewcoursenew.data = response.data.data.data;
            },function(error){
            });
        });
	
    }
    
    //method for classviewusers
	function classviewusers(){
        $scope.crossicon = {showform :false,showicon:false};
        var templatepath = templateURL+"dest/templates/";
         $scope.tableDataviewusers = {
			pageName:'classuserviewmanagement', 
            isFilterbtns:false,
            isSearch:true,
            isPagination:true,
			isCheckboxhide:true,
            isrowSelect:false,
			sortType:'name',
            headers:[
                {name:'Name',bind_val:'name',isSortable:true},
                {name:'User Name',bind_val:'username',isSortable:true},
				{name:'User Type',bind_val:'usertype',isSortable:true},
				{name:'Email ID',bind_val:'email',isSortable:true},
               
            ],
            data:[]
        }
       var viewuserReq = JSON.stringify({"classid":$scope.data.id});
        var viewusertask = "classes.view_class_user";
        /* Method to fetch user details */
        sfactory.serviceCall(viewuserReq,viewusertask,'listDetails').then(function(response){
            $scope.tableDataviewusers.data = response.data;
			$rootScope.appLoader = false;
        },function(error){
            var localTask = "allclassuserlist";
            sfactory.localService(localTask).then(function(response){
                $scope.tableDataviewusers.data = response.data.data.data;
            },function(error){
            });
        });
    }
    
	//method for viewsectioncontent
    $scope.viewsectioncontent = function(data, index){
      data.viewsection = true;
      $scope.index = index;
    }
    
	//method for close content
	$scope.closecontent = function(data,$event){ 
		$event.stopPropagation();
		$event.preventDefault();
	    data.viewsection = false;
	}
	//Method for get current tab
	$scope.getClassCurrentTab = function(courseSearch){
      var tabMap = {'Phonics Adventure':0,'Number Success':1};
      $scope.filteredData = $filter('filter')($scope.contentmanagement, courseSearch);
      $scope.contentTabindex = ($scope.filteredData && $scope.filteredData.length > 0) ? tabMap[$scope.filteredData[0].name] : 0;
    }
	  
    $scope.classeditcourse = function(){
		$scope.contentTabindex = 0;
		$scope.pagename = "classeditcourse";
        $scope.crossicon = {showform :false,showicon:false};
        var templatepath = templateURL+"dest/templates/";
        var viewcourseReq = {"classid":$scope.data.id};       
        var task = "classes.classContentsList";
		
		if(angular.isUndefined($scope.contentmanagement)){
			sfactory.serviceCall(JSON.stringify(viewcourseReq),task,"listDetails").then(function(response){
				$rootScope.appLoader = false;
				if(response.status.toLowerCase() == "success"){
					$scope.contentmanagement = response.data;
					$scope.getClassCurrentTab();
				}
			},function(error){
				var localTask = "contentmanagement";
				sfactory.localService(localTask).then(function(response){
					$scope.contentmanagement = response.data.data;
					$scope.getClassCurrentTab();
				},function(error){
				});
			});
		}	
		$scope.activitiesHead =  {name:'Available',bind_val:'dummy',isSortable:false,isActionColumn:true,columnName:"ClassEnrollButtons",actionName:'classes.classEnrollCourse',apiParams:{'courseid':null,'classid':$scope.data.id}};
    }
	
	//method for parent to user
	$scope.updateparenttostudent = function(val){
		$scope.contentBody.parentname = val.parentname;
		_.each($scope.tableDataeditusers.data, function(data){
			if(data.id == val.userid){
				data.parentname = val.parentname;
			}
		});
	}
	
    //method for classeditusers
	function classeditusers(){
        $scope.crossicon = {showform :false,showicon:false};
        var templatepath = templateURL+"dest/templates/";
        $scope.tableDataeditusers = {
			pageName:'classusermanagement',
            isFilterbtns:false,
            isSearch:true,
            isPagination:true,
			isCheckboxhide:true,
            isrowSelect:false,
			sortType:'name',
            headers:[
                {name:'Name',bind_val:'name',isSortable:true},
                {name:'User Name',bind_val:'username',isSortable:true},
                {name:'Parent',bind_val:'parentname',isActionColumn:true,columnName:"addWithtext",paramvalue:'Parent'},
                {name:'status',bind_val:'dummy',isSortable:false,isActionColumn:true,columnName:"UpdateUserButtons"},
            ],
            data:[]
        }
				
        var editcourseReq  = JSON.stringify({"classid":$scope.data.id});
        var editcoursetask = "classes.updatestudentfetch";
        /* Method to fetch user details */
        sfactory.serviceCall(editcourseReq,editcoursetask,"listDetails").then(function(response){
            $scope.tableDataeditusers.data = response.data;
            $scope.classedituseresponse    = response.data;
			$rootScope.appLoader = false;
        },function(error){
            var localTask = "allclassuserlist";
            sfactory.localService(localTask).then(function(response){
                $scope.tableDataeditusers.data = response.data.data.data;
            },function(error){
            });
        });
	
    }
    
     /* Method to initiate controller scope properties */
    function initiateController(){
        $scope.datatable ={};
	    $scope.data = angular.copy($scope.contentBody);
        // Auto Complete  
        $scope.selectedItem  = $scope.data.groupname;
        $scope.searchText    = $scope.data.groupname;
        $scope.selectedItemadmin  = $scope.data.class_admin;
        $scope.searchTextadmin    = $scope.data.class_admin;
    }
	// Intialize Controller
    initiateController();
	
}]);




advancePubapp.controller('classmanagementController',['$scope','sfactory','$rootScope','$state','encryptionService','cacheService','$window','taskService','sessionService','$filter',function($scope, sfactory,$rootScope,$state,encryptionService,cacheService,$window,taskService,sessionService,$filter){ 
     
    var templatepath = templateURL+"dest/templates/";
    var tasks; 
	
	/* Method for create class */
    $scope.createClass = function(type){        
		inputreq = createclassformdata(type);
        tasks = taskService.getTasks("createClassController");
        sfactory.serviceCall(inputreq,tasks.addNewClass,'listDetails').then(function(response){
			$rootScope.appLoader = false;
			if($filter('lowercase')(response.status) == 'success'){
				($scope.classUser.classname != '')	? sessionService.set('classname',encryptionService.encrypt($scope.classUser.classname)) : '';
				(response.data.classadminid != '')	? sessionService.set('teacherid',encryptionService.encrypt(response.data.classadminid)) : '';
				$scope.alertBaner = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
				$state.go('adminLanding.classDetails',{table:"users",classid:response.data.classmasterid,classname:$scope.classUser.classname});
			}else{
				$scope.alertBaner = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
			}			
        },function(error){
            var localTask = "createClass";
            sfactory.localService(localTask).then(function(response){
            },function(error){
            });
        });
    } 
	/* Method for create class form data */
	function createclassformdata(type){
		inputreq = {};
		if(type == 'new'){
			inputreq.classname     = $scope.classUser.classname;
			inputreq.email1        = $scope.classUser.email1;
			inputreq.firstname 	   = $scope.classUser.firstname;
			inputreq.gender        = $scope.classUser.gender;
			inputreq.lastname      = $scope.classUser.lastname;
			inputreq.phone_no      = $scope.classUser.phone_no;
			inputreq.username      = $scope.classUser.username;
		}else{
			inputreq.classname     = $scope.classUser.classname;
			inputreq.classadmin    = $scope.classUser.classadmin;
			//($scope.classUser.classadmin != '')	? sessionService.set('teacherid',encryptionService.encrypt($scope.classUser.classadmin)) : '';
		}
		return inputreq;
	}
	
	/* Method for select particu;arrow value */
	$scope.gatherValues = function(selectedItem){
		$scope.classUser.classadmin = selectedItem.id;
    } 
	
	/* Method callback for close the baner alert message */
  	$scope.closeBaner = function(){
		($scope.alertBaner) ? $scope.alertBaner.showBaner = false : '';
	}
	
	/* Method for call back function */
	$scope.classCallback = function(arg1){ 
		$scope.isSingleuser  = arg1.isSingleuser;
		$scope.showClassForm = {class:true,teachershow:false,exist:false,newform:false};
	}
	
	/*Method for previous cancel callback*/
	$scope.previousCancel = function(type){
		if(type == 'prev'){
			$scope.showClassForm = {class:true,teachershow:false,exist:false,newform:false};
		}else{
			$scope.crossbutton = {isSingleuser:false};
			$scope.isSingleuser = false;
			$scope.classUser = {};
			$scope.showClassForm = {class:false,teachershow:false,exist:false,newform:false};
		}
	}
	
	/* Method for exist teacher list */
	function existsTeacherDisplay(){
		/* Method for Existing teacher table maintain */
		$scope.tableDataadmin = {
            pageName: 'classTeacherList',
            isFilterbtns: false,
            isSearch: true,
            isPagination: true,
            isCheckboxhide: true,
            isrowSelect: true,
            sortType: 'name',
            headers: [{name: 'Teacher Name', bind_val: 'name', isSortable: true},
					  {name: 'User Name',bind_val: 'username',isSortable: true,isDescColumn: true},
					  ],
            data: []
        }
		inputreq = JSON.stringify({'groupaction':"existing",'itemsPerpage':10,'currentPage':1,'sortOrder':'desc','sortCoulmn':''});
        sfactory.serviceCall(inputreq,tasks.classadminlist,"listDetails").then(function(response) {
			if($filter('lowercase')(response.status) == 'success'){
				$scope.tableDataadmin.data = response.data;
				//$scope.alertBaner = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
			}else{
				$scope.alertBaner = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
			}
            $rootScope.appLoader = false;
        }, function(error) {
            var localTask = "allclassuserlist";
            sfactory.localService(localTask).then(function(response) {
                $scope.tableDataadmin.data = response.data.data.data;
            }, function(error) {
            });
        });
	}
	
	/* Method for classnamename exist check */
	$scope.classNameExistCheck = function(){
		inputreq = {'classname':$scope.classUser.classname};
		sfactory.serviceCall(inputreq,tasks.checkClassExistance,'listDetails').then(function(response){
           if($filter('lowercase')(response.status) == 'success'){
			   $scope.classNameCheck = false;
			   $scope.showClassForm = {class:false,teachershow:true,exist:true,newform:false};
			   existsTeacherDisplay();
		   }else{
			   $scope.classNameCheck = true;
			   $scope.classnameerror = response.message;
		   }
		   $rootScope.appLoader = false;
        },function(error){
			 $scope.classNameCheck = false;
			 $scope.showClassForm = {class:false,teachershow:true,exist:true,newform:false};
			//existsTeacherDisplay();
        });
	}
	
	/* Method for get all class list */
    function allClassList() { 
		inputreq = JSON.stringify({'itemsPerpage':10,'currentPage':1,'sortOrder':'desc','sortCoulmn':'name'});
		sfactory.serviceCall(inputreq,tasks.getClasses,'listDetails').then(function(response){
			if($filter('lowercase')(response.status) == 'success'){
				sessionService.empty('classname');
				$scope.responseval = true;
				$scope.tableData.data = response.data;
				$scope.tableData.paginateData   = response.paginateData;
				$scope.tableData.paginationAPI  = tasks.getClasses;
				$scope.tableData.paginateParams = JSON.parse(inputreq);
			}else{
				$scope.alertBaner = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'}; 
			}
			/*($filter('lowercase')(response.status) == 'success') ? $scope.tableData.data = response.data : $scope.alertBaner = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'}*/
			$rootScope.appLoader = false;
        },function(error){
			$scope.responseval = true;
            var localTask      = "classmanagement";
			sfactory.localService(localTask).then(function(response){
				$scope.tableData.data = response.data.data;
			},function(error){
			});
        });
    }	
	
	/* Method for load table */
    function loadtable(){  
		$scope.addRecord = {level1: true,level2: false};
		var templatepath = templateURL + "dest/templates/";
        $scope.tableData = {
         	paginateData:null,
            paginationAPI:'',
            paginateParams:'',
            resKey:'classstudentdeatils',
            isDrilldown:false,
            pageName: 'classmanagement',
            isFilterbtns: false,
            isSearch: true,
            isPagination: true,
            isroletypedisplay: true,
            sortType: 'name',
            headers: [{name: 'Class',bind_val: 'name',isSortable: true},
					  {name: 'Class Admin',bind_val: 'classadmin',isSortable: true},
					  {name: 'Class Created Date',bind_val: 'classdate',isSortable: true},
					  {name: 'Group',bind_val: 'group_count',isSortable: false,isActionColumn: true,columnName: "addWithtext",paramvalue: 'group'},
					  {name: 'User',bind_val: 'user_count',isSortable: false,isActionColumn: true,columnName: "addWithtext",paramvalue: 'user'},
					  {name: 'Actions',bind_val: 'actions',isSortable: false,isActionColumn: true,columnName: "addeditview",actionMethods: {delete: {api: 'classes.delete_list',
                      viewName: 'classes'}
                }
            }],
            data: []
        }
	}
    /* Method for start up controller */
    function initializeController(){ 		
		tasks = taskService.getTasks("classmanagementTask");
        $scope.currentYear = new Date().getFullYear();
		loadtable();
		allClassList();
		$scope.classUser = {};
		$scope.classUser.dob = {month : '',day:'',year:''};
    };
    
    initializeController();
}]);
advancePubapp.controller('comparativereportsController',['$scope', 'sfactory','$uibModal','$rootScope','reportService','$filter','$log','$stateParams','sessionService','encryptionService', function($scope,sfactory,$uibModal,$rootScope,reportService,$filter,$log,$stateParams,sessionService,encryptionService) {
    var chartProperties=[],reportDataReq,chartArray; 
    
    //Method  for program adventure report
    function comparativereports(reportDataReq){
        var task = 'programreports';
        inputreq = JSON.stringify(reportDataReq);
        sfactory.serviceCallReports(inputreq, task).then(function(response) {
            if(angular.isDefined(response)){
                if($filter('lowercase')(response.status) == 'success'){ 
                    $scope.tableData.data =response.data.program_report;
                    $scope.comparativereports.overall = response.data.users_at_each_program;
                    $rootScope.appLoader = false;
                }else{
                    $rootScope.appLoader = false;
                }	
            }
        }, function(error) {
            var localTask = "comparativereports";            
            sfactory.localService(localTask).then(function(response) {
                $scope.tableData.data =response.data.data.program_report;
                $scope.comparativereports.overall = response.data.data.users_at_each_program;              
            }, function(error) {
            });
        });
    }
    
    //Method for program analytics
    $scope.getComparativeReportsAnalysticData = function(){
        $scope.isAnalytics = true;$scope.userTypeCount = 0;
        if(!angular.isDefined($scope.comparativereports.program)){
            var task = 'programanalytics';        
            inputreq = JSON.stringify(reportDataReq);
            sfactory.serviceCallReports(inputreq, task).then(function(response) {            
                if(angular.isDefined(response.data)){
                    $scope.comparativereports.program = response.data;
                    loadCharts();
                    $rootScope.appLoader = false;
                }
            }, function(error) {
            var localTask = "comparativereports";
                sfactory.localService(localTask).then(function(response) {
                    $scope.comparativereports.program = response.data.analysticsdata;
                    loadCharts();
                }, function(error) {
                });
            });
        }else{
        loadCharts();        
        }
       
    }
    function loadCharts(){
        $scope.mostVisited = $scope.comparativereports.program.most_visited;
        $scope.visitorsAtProgramLevel = $scope.comparativereports.program.visitors_at_program_level;
        $scope.socialSharesBasedOnProgram = $scope.comparativereports.program.social_shares_based_on_program;
        $scope.badgesAssociatedWithEachProgram = $scope.comparativereports.program.badges_associated_witheach_program;
        $scope.averageTimespentOnEachProgram = $scope.comparativereports.program.average_timespent_on_each_program;        
        $scope.mostConsumedProgram = reportService.loadPiechart($scope.comparativereports.program.most_consumed_program,'Most Consumed Program');
    }
    /* Method to load charts 
    function loadPieCharts(data){
        //Load Pie Charts
        $scope.comparativereports.program.most_consumed_program = reportService.loadPiechart(data.most_consumed_program,'Most Consumed Program');
    };*/
     /* Method to show filter modal */
    $scope.chartModal = function(size, chartType, data, chartHeader,traffic) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'dest/templates/chartsModal.html',
            controller: 'modalController',
            size: size,
            resolve: {
                items: function() {
                    return {
                        chartType: chartType,
                        chartdata: data,
                        header: chartHeader, 
                        traffic:traffic,
                        dateRange:$scope.daterangecustompick,
                        chartProperties:chartProperties,
                        reportsProgram: "cr"
                    };
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };      
        
    //Method for activities download
   $scope.comparativereportsdownload = function(task){
        userId  = reportDataReq.user_id;
        groupId = reportDataReq.group_id;
         if($scope.startDate && $scope.endDate){
            var start = new Date($scope.startDate).getFullYear()+"-"+(Number(new Date($scope.startDate).getMonth())+1)+"-"+new Date($scope.startDate).getDate();
            var end = new Date($scope.endDate).getFullYear()+"-"+(Number(new Date($scope.endDate).getMonth())+1)+"-"+new Date($scope.endDate).getDate();
            window.location = appUrl+task+"?start_date="+start+"&end_date="+end+"&user_id="+userId+"&group_id="+groupId+"&csv=1";
        }
        else{
            window.location = appUrl+task+"?user_id="+userId+"&group_id="+groupId+"&csv=1";
        }
    }
   $scope.downloadbtn = function(){
        $scope.isActive_down = !$scope.isActive_down;
    }
    $scope.closedownload = function(){
        $scope.isActive_down = false;
    };
    $scope.reportdownloadbtn = function(){
        $scope.isActive_downreport = !$scope.isActive_downreport;
    }
    $scope.reportclosedownload = function(){
        $scope.isActive_downreport = false;
    };
    $scope.saveChartObj = function(response){
        var chartObject =_.find(chartArray, function(obj){ return obj.title.textStr  == response.title.textStr;});
        if(angular.isDefined(chartObject)){
            chartArray[chartArray.findIndex(x => x.title.textStr === response.title.textStr)] = response;
        }
        else{
            chartArray.push(response);
        }
    };
    
    $scope.export = function(download){
        reportService.exportCharts(chartArray,{type:download});
    };
    $scope.usertypefilterNew = function(usertype){ 
        if($scope.userTypeCount == 0){
            if(usertype == "Guest"){
                $scope.usertypefilter("Registered");
                $scope.usertypefilter(usertype);
            }else if(usertype == "Registered"){
                $scope.usertypefilter("Guest");
                $scope.usertypefilter(usertype);
            }
        }else{
            $scope.usertypefilter(usertype);
        }
    };
    $scope.usertypefilter = function(usertype){ 
        var copyChart = {};copyChart2 = {};copyChart3 = {};
        angular.copy($scope.averageTimespentOnEachProgram,copyChart3);
        copyChart2 = $scope.averageTimespentOnEachProgram.series;       
        
        //filteredGoal = _.where($scope.averageTimespentOnEachProgram.series, {"usertype" : usertype});
        if(usertype != "all"){
            for(i=0;i<copyChart2.length;i++){            
                if(copyChart2[i].usertype == usertype){ 
                   for(j=0;j<copyChart2[i].data.length;j++){
                       copyChart2[i].data[j] = 0;
                   }
                }            
            }   
            filteredGoal = copyChart2;
        }else{
            filteredGoal = $scope.averageTimespentOnEachProgram.series;
        }
        
        copyChart.series = filteredGoal;         
        copyChart.x=$scope.averageTimespentOnEachProgram.x;
        copyChart.title=$scope.averageTimespentOnEachProgram.title; 
        $scope.activeUserType = usertype;
        updateStackBarCharts(copyChart,copyChart3);        
    };
    function updateStackBarCharts(response1,response2){
        $scope.averageTimespentOnEachProgram.change(response1);
        $scope.averageTimespentOnEachProgram = response2;
        $scope.userTypeCount++;
    }
    function updateCharts(start_date,end_date){
        
          var requestData = JSON.stringify({
                'start_date': start_date,
                'end_date': end_date,
                'program_id': "cr",
                'group_id'  : reportDataReq.group_id,
                'user_id': reportDataReq.user_id
        });
        
        sfactory.serviceCallReports(requestData, 'programanalytics').then(function(response) {
			if(angular.isDefined(response)){
				if($filter('lowercase')(response.status) == 'success'){
                    $scope.mostVisited.change(response.data.most_visited); 
                    $scope.mostVisited.x = (response.data.most_visited.x); 
                    $scope.visitorsAtProgramLevel.change(response.data.visitors_at_program_level);
                    $scope.socialSharesBasedOnProgram.change(response.data.social_shares_based_on_program);
                    $scope.badgesAssociatedWithEachProgram.change(response.data.badges_associated_witheach_program);                    
					$scope.averageTimespentOnEachProgram.change(response.data.average_timespent_on_each_program);
                    $scope.averageTimespentOnEachProgram.x = response.data.average_timespent_on_each_program.x;
                    $scope.averageTimespentOnEachProgram.series = response.data.average_timespent_on_each_program.series;
                    $scope.mostConsumedProgram.change(reportService.loadPiechart(response.data.most_consumed_program,'Most Consumed Program'));
                    $scope.mostConsumedProgram.data = response.data.most_consumed_program;
					$rootScope.appLoader = false;
				}
			 }	
        }, function(error) {
        var localTask = "comparativereports";
        sfactory.localService(localTask).then(function(response) {
            $scope.mostVisited.change(response.data.analysticsdata.most_visited);
            $scope.visitorsAtProgramLevel.change(response.data.analysticsdata.visitors_at_program_level);
            $scope.socialSharesBasedOnProgram.change(response.data.analysticsdata.social_shares_based_on_program);
            $scope.badgesAssociatedWithEachProgram.change(response.data.analysticsdata.badges_associated_witheach_program);            
            $scope.averageTimespentOnEachProgram.change(response.data.analysticsdata.average_timespent_on_each_program);
            $scope.averageTimespentOnEachProgram.x = response.data.analysticsdata.average_timespent_on_each_program.x;
            $scope.averageTimespentOnEachProgram.series = response.data.analysticsdata.average_timespent_on_each_program.series;            
            $scope.mostConsumedProgram.change(reportService.loadPiechart(response.data.analysticsdata.most_consumed_program,'Most Consumed Program'));
            $scope.mostConsumedProgram.data = response.data.most_consumed_program;
            }, function(error) {
            });
        });
    }
	 //Method for initilize controller
    function initilizecomparativereports(){       
        var comparativereportscope = angular.element(jQuery("#adminLanding")).scope();
        
        reportDataReq = {            
            'program_id': "cr",
            'group_id'  : encryptionService.decrypt(sessionService.get('grp_id')),            
            'user_id': encryptionService.decrypt(sessionService.get('userId'))
            
        };
        comparativereports(reportDataReq);
        $scope.comparativereports = {};chartArray=[];
        $scope.comparativereports.vmDate = Last7Days().split(',')[Last7Days().split(',').length-1]+" To "+Last7Days().split(',')[0];
        $scope.daterangecustompick = $scope.comparativereports.vmDate;
        $scope.dateoptions={
            "locale": {
              "format": "MM-DD-YYYY",
            },
            showDropdowns:true,
            autoApply:true,
            maxDate : new Date(),
            eventHandlers: {
                'apply.daterangepicker': function(ev, picker) { 
                    $scope.daterangecustompick = ev.model.startDate.format('MM-DD-YYYY')+ ' To '+ev.model.endDate.format('MM-DD-YYYY');
                    updateCharts(ev.model.startDate.format('MM-DD-YYYY'),ev.model.endDate.format('MM-DD-YYYY'));                    
                }
            }
        };
            $scope.tableData = {
            pageName: 'comparativereportstable',
            isFilterbtns: false,
            isSearch: true,
            isPagination: true,
            sortType: '',
            isCheckboxhide: true,
            headers: [{name: 'Program',bind_val: 'label',isSortable: true},                
                {name: 'No. of Activities',bind_val: 'no_of_activities',isSortable: true},
                {name: '# Student Course Completions',bind_val: 'no_of_students_completed',isSortable: true},
                {name: 'No. of Visits',bind_val: 'no_of_visits',isSortable: true},
                {name: 'No. of shares',bind_val: 'no_of_shares',isSortable: true},
                {name: 'Average time spent',bind_val: 'time_spent',isSortable: true}                
            ],
            data: []
        };
        
            chartProperties=[
            {
                chartTitle:"Most visited program",
                taskUrl :"mostvisitedprogram",
                key:"most_visited",
                type:"line"
            },
            {
                chartTitle:"No. of visitors by Program",
                taskUrl :"visitorsatprogramlevel",
                key:"visitors_at_program_level",
                type:"bar"
            },
            {
                chartTitle:"Social share Based on Program Type",
                taskUrl :"programsocialshares",
                key:"social_shares_based_on_program",
                type:"bar"
            }, 
            {
                chartTitle:"Badges",
                taskUrl :"programbadges",
                key:"badges_associated_witheach_program",
                type:"bar"
            },
            {
                chartTitle:"Average Time Spent on Each Program",
                taskUrl :"avgtimespentoneachprogram",
                key:"average_timespent_on_each_program",
                type:"bar"
            },
            {
                chartTitle:"Most Consumed Program",
                taskUrl :"mostconsumedprogram",
                key:"most_consumed_program",
                type:"pie"
            }    
        ];
    }
    initilizecomparativereports();
}]);
advancePubapp.controller('contentmanagementController', ['$scope', 'sfactory', '$rootScope', 'taskService','$state','sessionService','encryptionService','$filter','sessionService','$mdDialog', '$timeout','$q',function($scope, sfactory, $rootScope, taskService,$state,sessionService,encryptionService,$filter,sessionService,$mdDialog,$timeout,$q) {

    var localTask, tasks, dataRequest,courseType,currentState;

    
    /*Method to assign or unassign survey to activity */
    $scope.assignUnassignSurvey = function(parentIndex,Index,activity,isAssign){
        dataRequest = (isAssign) ? {assign :[]} :{unassign :[]};
        var data = {
            mediaType: activity.type,
            courseId: activity.course_id,
            activityId: activity.id
        };
        (isAssign) ? dataRequest.assign.push(data) : dataRequest.unassign.push(data);
        sfactory.serviceCall(dataRequest, tasks.assignSurvey, 'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                $scope.contents.course.sections[$scope.contents.activeSection].lessons[parentIndex].activities[Index].survey_assigned_status = isAssign;
                $scope.contents.currentSection = $scope.contents.course.sections[$scope.contents.activeSection];
            }
            else{
                showBanner(response.message,response.status);
            }
            $rootScope.appLoader = false;
        }, function(error) {});
    };
    
    /* Method to show notification */
    function showBanner(message,status){
        var banerData = {};
        banerData.message = message;
        banerData.banerClass = ($filter('lowercase')(status) === 'success') ? 'alert-success' : 'alert-danger';
        banerData.showBaner=true;
        $scope.alertBaner = angular.copy(banerData);
    };
    
    /* Method to view survey results */
    $scope.viewSurveyResults = function(activity){
        sessionService.set('courseSurveyID',encryptionService.encrypt(String(activity.survey_id)));
        $state.go('adminLanding.surveyresults',{location: false});
    };
    
    /* Method to change Number Success units status */
    $scope.changeNSUnitStatus = function(){
        dataRequest = {
            action: ($scope.contents.currentSection.block) ? 'act' : 'deact',
            section_courses: $scope.contents.currentSection.units_courses,
            section_activities: $scope.contents.currentSection.units_activities
        };
         sfactory.serviceCall(dataRequest, tasks.sectionAssign, 'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                angular.forEach($scope.contents.filters,function(filter){
                    if(angular.isDefined($scope.contents.currentSection['block'+angular.lowercase(filter)])){
                        $scope.contents.currentSection['block'+angular.lowercase(filter)] = $scope.contents.currentSection.block;
                    }
                    angular.forEach($scope.contents.currentSection[filter],function(lesson){
                        if(angular.isDefined(lesson.block)) lesson.block = $scope.contents.currentSection.block;
                    });
                });
            }
            $rootScope.appLoader = false;
        }, function(error) {});
    };
    
    /* Method to change Phonics Adventure section status */
    $scope.changePASectionStatus = function() {
        dataRequest = {
            action: ($scope.contents.currentSection.block) ? 'act' : 'deact',
            section_courses: $scope.contents.currentSection.section_courses,
            section_activities: $scope.contents.currentSection.section_activities
        };
        sfactory.serviceCall(dataRequest, tasks.sectionAssign, 'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                angular.forEach($scope.contents.course.sections[$scope.contents.activeSection].lessons, function(lesson) {
                    if(angular.isDefined(lesson.block)){
                        lesson.block = response.data.block;
                        angular.forEach(lesson.activities, function(activity) {
                            if(angular.isDefined(activity.block)) activity.block = response.data.block;
                        });
                     }
                });
                $scope.contents.currentSection = $scope.contents.course.sections[$scope.contents.activeSection];
            }
            $rootScope.appLoader = false;
        }, function(error) {});
    };
    
    /* Method to change Phonics Adventure lesson status */
    $scope.changePALessonStatus = function(index) {
        dataRequest = {
            action: ($scope.contents.currentSection.lessons[index].block) ? 'deact' : 'act',
            lesson_courses: $scope.contents.currentSection.lessons[index].lesson_courses,
            lesson_activities: $scope.contents.currentSection.lessons[index].lesson_activities
        };
        sfactory.serviceCall(dataRequest, tasks.lessonAssign, 'listDetails').then(function(response) {
           if($filter('lowercase')(response.status) == 'success'){
                angular.forEach($scope.contents.currentSection.lessons[index].activities, function(activity) {
                    if(angular.isDefined(activity.block)) activity.block = response.data.block;
                });
                updateSectionStatus();
                $scope.contents.currentSection = $scope.contents.course.sections[$scope.contents.activeSection];
           }
           $rootScope.appLoader = false;
        }, function(error) {});
    };

    /* Method to change Number Success lesson status */
    $scope.changeNSLessonStatus = function(category){  
        dataRequest={
            action : ($scope.contents.currentSection['block'+angular.lowercase(category)]) ? 'act' : 'deact',
            lesson_courses:$scope.contents.currentSection[category+'_courses'],
            lesson_activities:$scope.contents.currentSection[category+'_activities']
        };
        sfactory.serviceCall(JSON.stringify(dataRequest),tasks.lessonAssign,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                angular.forEach($scope.contents.currentSection[category],function(categoryType,index){
                    if(angular.isDefined(categoryType.block)) categoryType.block = $scope.contents.currentSection['block'+ angular.lowercase(category)];
                });
                updateNSUnits();
                $scope.contents.course.units[$scope.contents.activeSection] = $scope.contents.currentSection;
            }
            $rootScope.appLoader = false;
        }, function(error) {});
    };
    
    /* Method to change Phonics Adventure activity status */
    $scope.changePAActivityStatus = function(parentIndex, Index) {
        var activityStatusObject = _.countBy(_.pluck($scope.contents.currentSection.lessons[parentIndex].activities, 'block'), function(value) {
            return value === true ? 'true' : 'false';
        });
        dataRequest = {
            id: $scope.contents.currentSection.lessons[parentIndex].activities[Index].id,
            course_id: $scope.contents.currentSection.lessons[parentIndex].activities[Index].course_id,
            action: ($scope.contents.currentSection.lessons[parentIndex].activities[Index].block) ? 'act' : 'deact'
        };
        sfactory.serviceCall(dataRequest, tasks.activityAssign, 'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                $scope.contents.course.sections[$scope.contents.activeSection].lessons[parentIndex].activities[Index].block = response.data.block;
                $scope.contents.currentSection.lessons[parentIndex].block = (activityStatusObject.true > 0);
                updateSectionStatus();
                $scope.contents.currentSection = $scope.contents.course.sections[$scope.contents.activeSection];
            }
            $rootScope.appLoader = false;
        }, function(error) {});
    };
    
    /* Method to change Number Success activity status */
    $scope.changeNSActivityStatus = function(index,category) {
        dataRequest = {
            action: ($scope.contents.currentSection[category][index].block) ? 'act' : 'deact',
            id:$scope.contents.currentSection[category][index].id,
            course_id:$scope.contents.currentSection[category][index].course_id
        };
        sfactory.serviceCall(JSON.stringify(dataRequest),tasks.activityAssign,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                var lessonStatusObject = _.countBy( _.pluck($scope.contents.currentSection[category], 'block'), function(value) {
                    return value === true ? 'true' : 'false';
                });
                $scope.contents.currentSection['block'+ angular.lowercase(category)] = (lessonStatusObject.true > 0);
                updateNSUnits();
                $scope.contents.course.units[$scope.contents.activeSection] = $scope.contents.currentSection;
            }
            $rootScope.appLoader = false;
        }, function(error) {});
    };
 
    /* Method to change section tabs */
    $scope.changeTab = function(index,tabname) {
        var currentState;
        $scope.contents.activeSection = index;
        $scope.contents.currentSection = (tabname === 'Phonics Adventure') ? $scope.contents.course.sections[index] : $scope.contents.course.units[index];
        currentState = angular.fromJson(sessionService.getData('currentstate'));
        currentState.sectionIndex = index;
        sessionService.setData('currentstate',currentState);
    };
    
    /* Method to update section status for Phonics Adventure */
    function updateSectionStatus() {
        var lessonStatusObject = _.countBy( _.pluck($scope.contents.currentSection.lessons, 'block'), function(value) {
            return value === true ? 'true' : 'false';
        });
        $scope.contents.currentSection.block = (lessonStatusObject.true > 0);
    };

    $scope.selection={};
    $scope.selection.filter='all';
    $scope.selectAct= function(act){
         $scope.selection.filter= act;
    }

    /* Method to update section status for Number Success */
    function updateNSUnits(){
        var status=[];
        angular.forEach($scope.contents.filters,function(filter){
            status.push($scope.contents.currentSection['block'+angular.lowercase(filter)]);
        });
        $scope.contents.currentSection.block = ((_.filter(status, function(val){ return val == true;})).length > 0);
    };
    
    /* Method to get tab contents */
    $scope.getTabData = function(index,tabName){
        $scope.activetab.childIndex = 0;
		var currentTab = $scope.contents.tabs[index];
        dataRequest ={
            type: currentTab.name
        };
        currentState = {type:dataRequest.type,parentIndex:index,childIndex:0,sectionIndex:0};
        switch (tabName) {
            case 'Phonics Adventure':
                $scope.contents.selectedTab = currentTab.name;
                dataRequest.content = currentTab.categories[index].levels[index].name;
                currentState.content = dataRequest.content;
                getData(index);
                break;
            case 'Number Success':
                $scope.contents.selectedTab = currentTab.name;
                dataRequest.content = currentTab.categories[0].name;
                currentState.content = dataRequest.content;
                getData(index);
                break;
            case 'Media Library':                                
                getMediaLib();
                break;
            case 'Writing Success':
                $scope.contents.selectedTab = currentTab;
                getWritingsuccessData(tabName);
                break;
        }
        sessionService.setData('currentstate',currentState);
    };
    
    /* Method to get writing success data */
     function getWritingsuccessData(tabname){
        var selectedIndex = 0;
        $scope.contents.currentSection = null;
        sfactory.serviceCall(dataRequest, tasks.getContents,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                $scope.contents.course = response.data;
                if(angular.isDefined(response.data.header)){
                    $scope.contents.tabs = response.data.header;
                    $scope.contents.selectedTab =  $filter('filter')($scope.contents.tabs, {name:tabname})[0];
                    angular.forEach($scope.contents.selectedTab.categories[0].levels,function(tab,tabIndex){
                        tab.isActive = false;
                    });
                }
                $scope.contents.currentSection = _.find($scope.contents.course.courses[selectedIndex].sections,function(section){
                    return section.key = $scope.contents.selectedTab.categories[selectedIndex].levels[selectedIndex].key;
                });
                $scope.contents.selectedTab.categories[selectedIndex].levels[selectedIndex].isActive = true;
                $scope.writingSuccess.selectedLevel = $scope.contents.selectedTab.categories[selectedIndex].levels[selectedIndex];
                angular.forEach($scope.contents.course.courses[selectedIndex].sections,function(section){
                    $scope.writingSuccess.menu.push({key:section.key,values:_.pluck(section.subsection[selectedIndex].activities, 'name')})
                });
                $scope.activetab.childIndex = angular.copy(currentState.childIndex);
                $scope.switchWritingsuccess($scope.activetab.childIndex,currentState.sectionIndex);
            }
            $rootScope.appLoader = false;
            }, function(error) {
                sfactory.localService("writingSuccess").then(function(response) {
                    $scope.contents.course = response.data;
                    if(angular.isDefined(response.data.header)){
                        $scope.contents.tabs = response.data.header;
                        $scope.contents.selectedTab =  $filter('filter')($scope.contents.tabs, {name:tabname})[0];
                    }
                    $scope.contents.currentSection = _.find($scope.contents.course.courses[selectedIndex].sections,function(section){
                        return section.key = $scope.contents.selectedTab.categories[selectedIndex].levels[selectedIndex].key;
                    });
                    $scope.contents.selectedTab.categories[selectedIndex].levels[selectedIndex].isActive = true;
                    $scope.writingSuccess.selectedLevel = $scope.contents.selectedTab.categories[selectedIndex].levels[selectedIndex];
                    angular.forEach($scope.contents.course.courses[selectedIndex].sections,function(section){
                        $scope.writingSuccess.menu.push({key:section.key,values:_.pluck(section.subsection[selectedIndex].activities, 'name')})
                    });
                    $scope.activetab.childIndex = angular.copy(currentState.childIndex);
                    $scope.switchWritingsuccess($scope.activetab.childIndex,currentState.sectionIndex);
                }, function(error) {});
            });
    };
    
    $scope.switchWritingsuccess = function(parentIndex,index){
        currentState.childIndex = parentIndex;
        currentState.sectionIndex = index;
        sessionService.setData('currentstate',currentState);
        $scope.writingSuccess.selectedLevel = $scope.contents.selectedTab.categories[parentIndex].levels[index];
        angular.forEach($scope.contents.selectedTab.categories[parentIndex].levels,function(tab,tabIndex){
            tab.isActive = (tabIndex === index);
        });
        $scope.writingSuccess.menuList = _.find($scope.writingSuccess.menu,function(menuObj){
            return menuObj.key === $scope.writingSuccess.selectedLevel.key;
        }).values;
        $scope.contents.currentSection = $scope.contents.course.courses[parentIndex].sections[index];
        updateWSMenuStatus();
    };

    /* Method to update Writing Success menu status */
    function updateWSMenuStatus(){
        $scope.writingSuccess.menustatus=[];
        var block=true,courses=[],activities=[],isAtleastOneAdded;
        activities = _.pluck($scope.contents.currentSection.subsection, "activities");
        angular.forEach($scope.writingSuccess.menuList,function(menuList,menuIndex){
            block = true;
            courses=[];
            activityIds=[];
            isAtleastOneAdded = false;
            angular.forEach(activities,function(activity,index){
                if(angular.isDefined(activity[menuIndex])){
                    block = block && activity[menuIndex].block;
                    courses.push(activity[menuIndex].course_id);
                    activityIds.push(activity[menuIndex].id);
                    if(activity[menuIndex].isenabled) isAtleastOneAdded = true;
                }
            });
            $scope.writingSuccess.menustatus.push({key:menuList,course_id:courses,isenabled:isAtleastOneAdded,activity_id:activityIds,block:block});
        });
    };
    
    /* Method to Change Writing Success Menu status */
    $scope.changeWSMenuStatus = function(index){
        dataRequest ={
            action : $scope.writingSuccess.menustatus[index].block ? 'act' : 'deact',
            lesson_courses : $scope.writingSuccess.menustatus[index].course_id.join(),
            lesson_activities:$scope.writingSuccess.menustatus[index].activity_id.join()
        }
        sfactory.serviceCall(dataRequest,tasks.lessonAssign,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                 angular.forEach($scope.contents.currentSection.subsection,function(subsectionObj){
                    if(subsectionObj.activities[index].isenabled)
                        subsectionObj.activities[index].block = angular.copy($scope.writingSuccess.menustatus[index].block);
                 });
            }
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService("writingSuccess").then(function(response) {
                angular.forEach($scope.contents.currentSection.subsection,function(subsectionObj){
                    if(subsectionObj.activities[index].isenabled)
                        subsectionObj.activities[index].block = angular.copy($scope.writingSuccess.menustatus[index].block);
                 });
            });
            }, function(error) {});
    };
    
   /* Method to change Writing Success activity status */
    $scope.changeWSActivityStatus = function(subsectionIndex,index){
        dataRequest = {
            action: ($scope.contents.currentSection.subsection[subsectionIndex].activities[index].block) ?  'act' : 'deact',
            id:$scope.contents.currentSection.subsection[subsectionIndex].activities[index].id,
            course_id:$scope.contents.currentSection.subsection[subsectionIndex].activities[index].course_id
        };
        sfactory.serviceCall(dataRequest,tasks.activityAssign,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                var activityStatusObject = _.countBy(_.pluck($scope.contents.currentSection.subsection[subsectionIndex].activities, 'block'), function(value) {
                    return value === true ? 'true' : 'false';
                });
                $scope.contents.currentSection.subsection[subsectionIndex].block = (activityStatusObject.true > 0);
                updateWSSectionStatus();
            }
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService("writingSuccess").then(function(response) {
                var activityStatusObject = _.countBy(_.pluck($scope.contents.currentSection.subsection[subsectionIndex].activities, 'block'), function(value) {
                    return value === true ? 'true' : 'false';
                });
                $scope.contents.currentSection.subsection[subsectionIndex].block = (activityStatusObject.true > 0);
                updateWSSectionStatus();
            }, function(error) {});
        });
    };
    
    /* Method to update Writing Success section status */
    function updateWSSectionStatus(){
        var lessonStatusObject = _.countBy(_.pluck($scope.contents.currentSection.subsection, 'block'), function(value) {
            return value === true ? 'true' : 'false';
        });
        $scope.contents.currentSection.block = (lessonStatusObject.true > 0);
        updateWSMenuStatus();
    };
    
    /* Method to change Writing Success lesson status */
    $scope.changeWSLessonStatus = function(index){
        dataRequest={
            action : ($scope.contents.currentSection.subsection[index].block) ? 'act' : 'deact',
            lesson_courses:$scope.contents.currentSection.subsection[index].contentid,
            lesson_activities:$scope.contents.currentSection.subsection[index].contentactivityid
        };
        sfactory.serviceCall(dataRequest, tasks.lessonAssign,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                angular.forEach($scope.contents.currentSection.subsection[index].activities,function(activity){
                    if(activity.isenabled) activity.block = $scope.contents.currentSection.subsection[index].block;
                });
                updateWSSectionStatus();
            }
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService("writingSuccess").then(function(response) {
                angular.forEach($scope.contents.currentSection.subsection[index].activities,function(activity){
                    if(activity.isenabled) activity.block = $scope.contents.currentSection.subsection[index].block;
                });
                updateWSSectionStatus();
            }, function(error) {});
        });
    };
    
    /* Method to update Writing Success section status */
    $scope.changeWSSectionStatus = function(){
        dataRequest = {
            action: ($scope.contents.currentSection.block) ? 'act' : 'deact',
            section_courses: $scope.contents.currentSection.contentid,
            section_activities: $scope.contents.currentSection.contentactivityid
        };
        sfactory.serviceCall(dataRequest,tasks.sectionAssign,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                angular.forEach($scope.contents.currentSection.subsection,function(subsection){
                    if(subsection.isenabled) subsection.block = $scope.contents.currentSection.block;
                    angular.forEach(subsection.activities,function(activity){
                        if(activity.isenabled)  activity.block = $scope.contents.currentSection.block;
                    });
                });
                updateWSMenuStatus();
            }
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService("writingSuccess").then(function(response) {
                angular.forEach($scope.contents.currentSection.subsection,function(subsection){
                    if(subsection.isenabled) subsection.block = $scope.contents.currentSection.block;
                    angular.forEach(subsection.activities,function(activity){
                        if(activity.isenabled)  activity.block = $scope.contents.currentSection.block;
                    });
                });
                updateWSMenuStatus();
            }, function(error) {});
        });
    };

    $scope.selection={
        filters:{"customFilters":[]},        
        itemperpage : "25",
        itemperpageOptions : ["25","45","65","85","100","all"],
        all:'All'
    }
    $scope.switchDisplyMode = function(type){
        $scope.switchMode = type;
    }
    $scope.changeMediaLibTab = function(tabName,tabID){
        $scope.activities.course = [];
        $scope.selectedMediaLibTab = tabName;
        $scope.selectedMediaLibID = tabID;
        $scope.callFromFilters = false;
        addAll = {"id": $scope.selectedMediaLibID, "name": "All", "class": "parent" }; //To add the 'All' category for all main tabs        
        afterTabChanges();
        _.each($scope.mediaLibrary.content.section,function(item){
            if(item.name == tabName){
                $scope.selectOptions = item;
                /*$scope.selectOptions.section.push(addAll);
                if(item.section === undefined){
                    $scope.selectedMediaLibTabID = item.id;
                    $scope.mediaLibMainCategory = false;
                    $scope.mediaLibSubCategory = false;
                }else{
                    $scope.mediaLibMainCategory = true;
                    $scope.selected =item.section[0].name;
                    if(item.section[0].section === undefined  ){
                        $scope.mediaLibSubCategory = false;
                        $scope.selectedMediaLibTabID = item.section[0].id;
                    }else{
                      $scope.mediaLibSubCategory = true;
                      $scope.sub_selectOptions = item.section[0];
                      $scope.sub_selected = item.section[0].section[0].name;
                      $scope.selectedMediaLibTabID = item.section[0].section[0].id;
                    }
                }*/
                $scope.selectOptions.section.unshift(addAll);
                $scope.selected = $scope.selectOptions.section[0].name;
                $scope.selectedMediaLibTabID = tabID;
                $scope.mediaLibMainCategory = true;
                $scope.mediaLibSubCategory = false;
                
            }
        });
        //Avoid multiple times adding 'All' category for the tabs
        newArr = _.uniq($scope.selectOptions.section,_.property('id'));
        $scope.selectOptions.section = newArr;
        //Set the search box with empty value
        $scope.medialib.search = "";
        mediaLibContent();
    };
    function afterTabChanges(){
        $scope.printableFormat = false;
        $scope.productWeek = false;
        $scope.bookOfWeek = false;
        $scope.videoOfWeek = false;
        $scope.openContentLink = "none";
        if($scope.selectedMediaLibTab == "Ebooks"){
            $scope.productWeek = true;
            $scope.bookOfWeek = true;
        }else if($scope.selectedMediaLibTab == "Videos"){
            $scope.productWeek = true;
            $scope.videoOfWeek = true;
            $scope.openContentLink = "video";
        }else if($scope.selectedMediaLibTab == "Worksheets"){
            $scope.printableFormat = true;                
        }else if($scope.selectedMediaLibTab == "Songs"){
            $scope.openContentLink = "song";                
        }
    }
    $scope.actionChanges = function(type,id){                 
        selectedCourse = _.where($scope.activities.course, {courseid: id});
        feature_title = "";
        if(type == "product"){            
            if(selectedCourse[0].product_of_the_week){
                dataparams = {"is_active": selectedCourse[0].is_active, "printable": selectedCourse[0].is_printable, "featured": selectedCourse[0].is_featured, "premium": selectedCourse[0].is_premium, "product_of_the_week": "", "product_id":selectedCourse[0].courseid};
                feature_title = "Are you sure you want to remove from product of the week?";
            }else{
                productAction = ($scope.bookOfWeek) ? "Book" : (($scope.videoOfWeek) ? "Video" : "");
                dataparams = {"is_active": true, "printable": selectedCourse[0].is_printable, "featured": false, "premium": false, "product_of_the_week": productAction, "product_id":selectedCourse[0].courseid};
                if(selectedCourse[0].is_featured || selectedCourse[0].is_premium){
					if(!selectedCourse[0].is_active){
						feature_title = "Are you sure you want to show this product in website? Do you want to make this product to 'Product of the week'?";
					}else{
						feature_title = "Already this product is as featured/premium? Do you want to make this product to 'Product of the week'?";
					}                    
                }else{
					if(!selectedCourse[0].is_active){
						feature_title = "Are you sure you want to show this product in website? Do you want to make this product to 'Product of the week'?";
					}else{
						feature_title = "Do you want to make this product to 'Product of the week'?";
					}
				}              
            }            
        }else if(type == "print"){
            if(selectedCourse[0].is_printable){
                feature_title = "Are you sure you want to remove this product from printable?";
            }else{
                feature_title = "Are you sure you want to make this product to printable?";
            }
            dataparams = {"is_active": selectedCourse[0].is_active, "printable": !selectedCourse[0].is_printable, "featured": selectedCourse[0].is_featured, "premium": selectedCourse[0].is_premium, "product_of_the_week": "", "product_id":selectedCourse[0].courseid};            
        }else if(type == "premium"){
            if(selectedCourse[0].is_premium){
                feature_title = "Are you sure you want to remove this product from premium?";
                dataparams = {"is_active": selectedCourse[0].is_active, "printable": selectedCourse[0].is_printable, "featured": selectedCourse[0].is_featured, "premium": !selectedCourse[0].is_premium, "product_of_the_week": "", "product_id":selectedCourse[0].courseid};
            }else{
                feature_title = "Are you sure you want to make this product to premium and feature?";
                dataparams = {"is_active": selectedCourse[0].is_active, "printable": selectedCourse[0].is_printable, "featured": true, "premium": true, "product_of_the_week": "", "product_id":selectedCourse[0].courseid};
            }           
        }else if(type == "feature"){
            if(selectedCourse[0].is_featured){                
                if(selectedCourse[0].is_premium){
                    feature_title = "This product is premium. Are you sure you want to remove this product from featured and premium?";
                }else{
                    feature_title = "Are you sure you want to remove this product from featured?";
                }
                dataparams = {"is_active": selectedCourse[0].is_active, "printable": selectedCourse[0].is_printable, "featured": false, "premium": false, "product_of_the_week": "", "product_id":selectedCourse[0].courseid};
           }else{
               feature_title = "Are you sure you want to make this product to featured?";
               dataparams = {"is_active": selectedCourse[0].is_active, "printable": selectedCourse[0].is_printable, "featured": !selectedCourse[0].is_featured, "premium": selectedCourse[0].is_premium, "product_of_the_week": "", "product_id":selectedCourse[0].courseid};
           }
            
        }else if(type == "active"){
            if(selectedCourse[0].is_active){
                feature_title = "Are you sure you want to hide this product in website?";
            }else{
                feature_title = "Are you sure you want to show this product in website?";
            }
            dataparams = {"is_active": !selectedCourse[0].is_active, "printable": selectedCourse[0].is_printable, "featured": selectedCourse[0].is_featured, "premium": selectedCourse[0].is_premium, "product_of_the_week": "", "product_id":selectedCourse[0].courseid};            
        }
        if(feature_title != ""){
            var confirm = $mdDialog.confirm()
          .title(feature_title)
          .textContent()
          .ariaLabel()
          .ok('Ok')
          .cancel('Cancel');
            $mdDialog.show(confirm).then(function(result) {
                featureActionChanges(dataparams,type);
            }, function() {             

            });
        }else{
            featureActionChanges(dataparams,type);
        }        
        
    }
    function featureActionChanges(dataparams,type){
        /** To call the mediaLibrary content actions */
        sfactory.serviceCall(dataparams, tasks.getMediaLibraryActions,'listDetails').then(function(response) {          
            if(($filter('lowercase')(response.status) == 'success')){
               // mediaLibContent();
                _.each($scope.activities.course,function(item){
                    // Assign the filters dynamically to get model name dynamically
                    if(item.courseid == response.data.product_id){  
                        if(type == 'product'){
                            resetParams();
                        }
                        item.product_of_the_week = (response.data.product_of_the_week != "") ? true : false;
                        item.is_featured = response.data.featured;
                        item.is_premium = response.data.premium;
                        item.is_printable = response.data.printable;
                        item.is_active = response.data.is_active;
                    }
                    // To avoid two books/videos are active for product of week
                    /*if($scope.getCurrentProductWeek > 0 && $scope.getCurrentProductWeek != response.data.product_id && item.courseid == $scope.getCurrentProductWeek){                        
                         $timeout(function(){item.product_of_the_week = false;}, 500); 
                    }*/
                });
                $rootScope.appLoader = false;
            }else{               
                $rootScope.appLoader = false;
            }     

        }, function(error) {   
             
        });
    }
    /** Service call initiated for search */
    $scope.searchCall = function(){        
        mediaLibContent();        
    };
    function mediaLibContent(){        
        if(!$scope.callFromFilters){
              $scope.selection.filters.customFilters=[];
              _.each($scope.selection.filters,function(value,key){
                    $scope.selection.filters[key] = [];// Assign the filters dynamically to get model name dynamically

                });
          }
        if($scope.medialib.search != ""){
            dataRequest ={"filters":$scope.selection.filters,"pagination":{"itemsPerpage":$scope.selection.itemperpage,"currentPage":$scope.mdlibpagination.currentPage},"cat_id":[$scope.selectedMediaLibTabID],"parentId": $scope.selectedMediaLibID,"is_admin":true,"searchText":$scope.medialib.search};
        }else{
            dataRequest ={"filters":$scope.selection.filters,"pagination":{"itemsPerpage":$scope.selection.itemperpage,"currentPage":$scope.mdlibpagination.currentPage},"cat_id":[$scope.selectedMediaLibTabID],"parentId": $scope.selectedMediaLibID,"is_admin":true};
        }
        
          
        $scope.getCurrentProductWeek = 0;getCurrentProductWeek = [];
        sfactory.serviceCall(dataRequest, tasks.getMediaLibraryContent,'listDetails').then(function(response) {
            if(($filter('lowercase')(response.status) == 'success')){
                $scope.activities = response.data;                
                $scope.customFilters = false;
                if($scope.activities.customFilters.length > 0 ){               
                    $scope.customFilters = true;
                }
                getCurrentProductWeek = _.where($scope.activities.course, {'product_of_the_week':true});
                if(getCurrentProductWeek.length > 0){
                    $scope.getCurrentProductWeek = getCurrentProductWeek[0].courseid;                    
                }
                
                $scope.mdlibpagination.pagination = response.paginateData;
                $scope.mdlibpagination.pagination.pages=[];
                for(i=0;i<($scope.mdlibpagination.pagination.total_matched_records/$scope.selection.itemperpage);i++){
                    $scope.mdlibpagination.pagination.pages.push({index:i+1})
                }
                $scope.numPages = $scope.mdlibpagination.pagination.pages.length;
                //getAllImagesDonePromise();
                console.log('live media library content',response.data);
            }
            
            $rootScope.appLoader = false; //- this is commented to control image preload this is enable in function getAllImagesDonePromise()

        }, function(error) {

          sfactory.localService('ebook_subcategory').then(function(response) {            
            $rootScope.appLoader = false;
            $scope.activities = response.data.data;
            $scope.customFilters = false;
            if($scope.activities.customFilters.length > 0 ){               
                $scope.customFilters = true;
            }
            getCurrentProductWeek = _.where($scope.activities.course, {'product_of_the_week':true});
            if(getCurrentProductWeek){
                $scope.getCurrentProductWeek = getCurrentProductWeek[0].courseid;
            }
            $scope.mdlibpagination.pagination = response.data.paginateData;
              $scope.mdlibpagination.pagination.pages=[];
            for(i=0;i<($scope.mdlibpagination.pagination.total_matched_records/$scope.selection.itemperpage);i++){
                $scope.mdlibpagination.pagination.pages.push({index:i+1})
            }
              $scope.numPages = $scope.mdlibpagination.pagination.pages.length; 
              //getAllImagesDonePromise();
              console.log("local media library content",response.data.data)
            }, function(error) {});
        });
    }
    $scope.getPageData = function(index){        
        mediaLibContent();
    };
    /**fancy modal for video embedding*/
    /*$(".videopopup").fancybox({
        maxWidth	: 800,
        maxHeight	: 600,
        fitToView	: false,
        width		: '70%',
        height		: '70%',
        autoSize	: false,
        closeClick	: false,
        openEffect	: 'none',
        closeEffect	: 'none',
        helpers   : { title : { type : 'inside' } }
    });*/
    /* Material Modal for video /audio */
	$scope.assetPopup = function(index) {		
        dataToPassObj = {'index':index,'type':$scope.openContentLink,'data': $scope.activities.course};
        $mdDialog.show({
          controller: 'assetPopupController',
          templateUrl: 'dest/templates/assetPopupModal.html',
          parent: angular.element(document.body),
          locals: {dataToPass: dataToPassObj},          
          clickOutsideToClose:true 
        }).then(function(response){
            
        },function(){

        });
		
    };
    /** Function to get the menu details with filters for media library */
    function getMediaLib(){
        dataRequest ={};$scope.customFilters = false;
        $scope.medialib= {"search" : ""};
        $scope.switchMode='grid';
        $scope.noassetimage = 'dest/images/no_asset.png';
        $scope.callFromFilters = true;
        console.log('Media Lib');        
        $scope.mdlibpagination = {currentPage:1,paginationList:5,pagination:{}};
        sfactory.serviceCall(dataRequest, tasks.getMediaLibraryMenuContent,'listDetails').then(function(response) {
            if(($filter('lowercase')(response.status) == 'success')){
                $scope.mediaLibMainCategory = true;
                $scope.mediaLibrary =  response.data;
                $scope.filters = $scope.mediaLibrary.filters; //filters
                _.each($scope.filters,function(item){
                    $scope.selection.filters[item.name] = [];// Assign the filters dynamically to get model name dynamically

                });
                  $scope.selectedMediaLibTab = $scope.mediaLibrary.content.section[0].name;
                  $scope.selectedMediaLibID = $scope.mediaLibrary.content.section[0].id;
                  
                addAll = {"id": $scope.selectedMediaLibID, "name": "All", "class": "parent" }; //To add the 'All' category for all main tabs
                $scope.selectOptions = $scope.mediaLibrary.content.section[0];
                /*$scope.selectOptions.section.push(addAll);
                  $scope.selected =$scope.mediaLibrary.content.section[0].section[0].name;
                  if($scope.mediaLibrary.content.section[0].section[0].section === undefined  ){
                      $scope.selectedMediaLibTabID = $scope.mediaLibrary.content.section[0].section[0].id;
                      $scope.mediaLibSubCategory = false;
                  }else{
                      $scope.mediaLibSubCategory = true;
                      $scope.sub_selectOptions = $scope.mediaLibrary.content.section[0].section[0];
                      $scope.sub_selected = $scope.mediaLibrary.content.section[0].section[0].section[0].name;
                      $scope.selectedMediaLibTabID = $scope.mediaLibrary.content.section[0].section[0].section[0].id;
                  }*/
                $scope.selectOptions.section.unshift(addAll);
                $scope.selected = $scope.mediaLibrary.content.section[0].section[0].name;
                $scope.selectedMediaLibTabID = $scope.selectedMediaLibID;
                $scope.mediaLibSubCategory = false;
                afterTabChanges();
                mediaLibContent();
            }else{
                $rootScope.apploader = false;                
            }
        }, function(error) {

          sfactory.localService('mediaLib').then(function(response) {            
            $rootScope.appLoader = false;
            $scope.mediaLibMainCategory = true;
            $scope.mediaLibrary =  response.data.data;
            $scope.filters = $scope.mediaLibrary.filters; //filters
            _.each($scope.filters,function(item){
                $scope.selection.filters[item.name] = [];// Assign the filters dynamically to get model name dynamically
                
            });
              $scope.selectedMediaLibTab = $scope.mediaLibrary.content.section[0].name;
              $scope.selectedMediaLibID = $scope.mediaLibrary.content.section[0].id; 
              addAll = {"id": $scope.selectedMediaLibID, "name": "All", "class": "parent" }; //To add the 'All' category for all main tabs
              $scope.selectOptions = $scope.mediaLibrary.content.section[0];
             /* $scope.selectOptions.section.push(addAll);
              $scope.selected =$scope.mediaLibrary.content.section[0].section[0].name;
              if($scope.mediaLibrary.content.section[0].section[0].section === undefined  ){
                  $scope.selectedMediaLibTabID = $scope.mediaLibrary.content.section[0].section[0].id;
                  $scope.mediaLibSubCategory = false;
              }else{
                  $scope.mediaLibSubCategory = true;
                  $scope.sub_selectOptions = $scope.mediaLibrary.content.section[0].section[0];
                  $scope.sub_selected = $scope.mediaLibrary.content.section[0].section[0].section[0].name;
                  $scope.selectedMediaLibTabID = $scope.mediaLibrary.content.section[0].section[0].section[0].id;
              }*/
              $scope.selectOptions.section.unshift(addAll);
              $scope.selected = $scope.mediaLibrary.content.section[0].section[0].name;
              $scope.selectedMediaLibTabID = $scope.selectedMediaLibID;
              $scope.mediaLibSubCategory = false;
              afterTabChanges();
              mediaLibContent();
              console.log("local media library",response.data);
            }, function(error) {});
        });

    }
    /* Triggers after the filters from directive in mediaLibrary */
    $scope.changeFilter = function(res){ 
        $scope.activities.course = [];
        $scope.selection.filters[res.type] = res.value;
        $scope.callFromFilters = true;        
        mediaLibContent();
    }
    
    /*For the itemperpage in mediaLibrary */
   $scope.changePageItemCount = function(){
       $scope.activities.course = [];
       mediaLibContent();
   };
    /** Triggers after choosing category in mediaLibrary **/
    $scope.getSubjectAct = function(option){
        $scope.callFromFilters = false;
        _.each($scope.mediaLibrary.content.section,function(item){
            if(item.name == $scope.selectedMediaLibTab){
                _.each(item.section,function(value){
                    if(value.id == option.id){                                              
                        $scope.selected = option.name;
                        if(value.section === undefined  ){
                          $scope.mediaLibSubCategory = false;
                            $scope.selectedMediaLibTabID = value.id;
                        }else{
                          $scope.mediaLibSubCategory = true;
                          $scope.sub_selectOptions = value;
                          $scope.sub_selected = value.section[0].name;
                          $scope.selectedMediaLibTabID = value.section[0].id;
                        } 
                    }
                });
                
            }
        });
        mediaLibContent();
    }
    /** Triggers after choosing sub category in mediaLibrary **/
    $scope.getActivity = function(data){
        $scope.callFromFilters = false;
        $scope.selectedMediaLibTabID = data.id;
        $scope.sub_selected = data.name;
        mediaLibContent();        
    }
    /* Method to get child tab contents */
    $scope.getChildTabData = function(parentIndex,index,selectedLevel){
        if(parentIndex === 0){
          if(!$scope.contents.activeLevel[index]){
                $scope.contents.activeLevel = [false,false];
                $scope.contents.activeLevel[index] = true;
                dataRequest = {
                    content:selectedLevel.name,
                    type:courseType
                };
            }  
        }
        else{
            dataRequest = {
                content:$scope.contents.tabs[parentIndex].categories[index].name,
                type:$scope.contents.tabs[parentIndex].name
            };
        }
        currentState.content = dataRequest.content;
        currentState.type = dataRequest.type;
        currentState.parentIndex = parentIndex;
        currentState.childIndex = index;
        getData(parentIndex);
    };
    
    /* Method to get contents */
    function getData(index) {
        localTask = (index === 0) ? 'contentmanagement' : 'number_success';
        $scope.contents.currentSection = null;
        var myDef = $q.defer();
        sfactory.serviceCall(dataRequest, tasks.getContents, 'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                $scope.contents.course = response.data.courses;
                courseType = response.data.name;
                if(angular.isDefined(response.data.header)){
                   $scope.contents.tabs = response.data.header;
                   $scope.contents.selectedTab = response.data.header[0].name;
                    myDef.resolve();
                }
                if(angular.isDefined(response.data.filters)){
                    $scope.contents.filters = response.data.filters;
                }
                $scope.contents.activeSection = currentState.sectionIndex;
                if(angular.isDefined(response.data.courses.sections) || angular.isDefined(response.data.courses.units)){
                    $scope.contents.currentSection = (index === 0) ? response.data.courses.sections[$scope.contents.activeSection] : response.data.courses.units[$scope.contents.activeSection];
                }
                sessionService.setData('currentstate',currentState);
            }
            else{
                myDef.reject();
            }
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService(localTask).then(function(response) {
                $scope.contents.course = response.data.courses;
                courseType = response.data.name;
                if(angular.isDefined(response.data.header)){
                   $scope.contents.tabs = response.data.header;
                   $scope.contents.selectedTab = response.data.header[0].name;
                    myDef.resolve();
                }
                if(angular.isDefined(response.data.filters)){
                    $scope.contents.filters = response.data.filters;
                }
                $scope.selection.filter='all';
                $scope.contents.activeSection = currentState.sectionIndex;
                $scope.contents.currentSection = (index === 0) ? response.data.courses.sections[$scope.contents.activeSection] : response.data.courses.units[$scope.contents.activeSection];
                sessionService.setData('currentstate',currentState);
            }, function(error) {});
        });
        return myDef.promise;
    };

    /* Method to reset params for products */
    function resetParams(){
        _.each($scope.activities.course,function(item){
            // Reset the product of the week prop...
            item.product_of_the_week = false;
        });
    }
    
    function getAllImagesDonePromise() {       
       var deferred;
        var dArr = [];
        var imgpaths = [];
        _.each($scope.activities.course,function(item,index){
            deferred = $q.defer();
            imgpaths.push({
                path: item.thumburl,
                callback: deferred.resolve
            });
            dArr.push(deferred.promise);
        });
        $scope.imgpaths = imgpaths;
        $q.all(dArr).then(function(){
            $rootScope.appLoader = false;
            //console.log('all loaded');
        });
    }
    
    /* Method to initialize Controller */
    function initializeController() {
        $scope.angular = angular;
        $scope.activetab={};
        dataRequest={};
        $scope.writingSuccess={menu:[]};
        $scope.contents={levels:[],activeLevel:[true,false],currentSection:null};
        tasks = taskService.getTasks('contentmanagementController');
        currentState = angular.fromJson(sessionService.getData('currentstate'));
        if(currentState === null){
            currentState = {type:'Phonics Adventure',content:'Textbook1',parentIndex:0,childIndex:0,sectionIndex:0};
        }
        dataRequest.header = true;
        dataRequest.type = currentState.type;
        dataRequest.content = currentState.content;
        $scope.activeparenttab = currentState.parentIndex;
        $scope.activetab.childIndex = currentState.childIndex;
        $scope.sectionIndex = currentState.sectionIndex;
        if(dataRequest.type === 'Writing Success'){
            getWritingsuccessData(dataRequest.type);
        }
        else if(dataRequest.type == 'Media Library'){ 
            getData($scope.activeparenttab).then(function(response){
                $scope.getTabData($scope.activeparenttab,dataRequest.type); 
            },function(errorResponse){
                
            });                       
        }
        else{
            getData($scope.activeparenttab);
        }
    };

    initializeController();
    
}]);
advancePubapp.controller('contentmanagementControllerbk',['$scope','sfactory','$rootScope','$filter','$mdDialog','taskService', function($scope,sfactory,$rootScope,$filter,$mdDialog,taskService){ 

	var userReq = {};
    var tasks;
    
    /* Method to capture emitForCloseicon */
    $scope.$on('emitForClose',function(event,args){
        $scope.isSingleuser = false;
        $scope.isMultiuser  = false;
        $scope.showicon     = args.showicon;
    });
    
    /* Method callback for close the baner alert message */
    $scope.closeBaner = function(){
        $scope.alertBaner.showBaner = false;
        $scope.$emit('switchMenu',{list:$scope.listObj});
    };
     
    /* Method to capture baner call back from child directives */
    $scope.$on('emitFromDirectiveBaner',function(event,args){
        $scope.alertBaner = args.alertBaner;
        if(angular.isDefined(args.list)) $scope.listObj = args.list;
    });
    
    $scope.showTabDialog = function(ev) {
        $mdDialog.show({
          controller: 'tabDialogController',
          templateUrl: 'dest/templates/tabDialog.html',
          targetEvent: ev,
          clickOutsideToClose:true
        })
            .then(function(answer) {
            }, function() {
            });
      }; 
    
    /* Method to capture emitted values from deep child directive */
    $scope.captureBaner = function(value){
        var banerData = {'message':value.message,'showBaner':value.showBaner,'banerClass':value.banerClass};
        $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData,'list':value.switchMenu});
    };
    
	
	/* Method for tab change in content management */
    $scope.getCurrentTab = function(){
      var tabMap = {'Phonics Adventure':0,'Number Success':1};
      $scope.filteredData = $filter('filter')($scope.contentmanagement, $scope.contentSearch);
      $scope.contentTabindex = ($scope.filteredData && $scope.filteredData.length > 0) ? tabMap[$scope.filteredData[0].name] : 0;
    };
	
	/* Method for viewsectioncontent */
    $scope.viewsectioncontent = function(data){
      data.viewsection = true;
    };
  
	$scope.closecontent = function(data,$event){  
	    $event.stopPropagation();
		$event.preventDefault();
	    data.viewsection = false;
	};
    
	function initiatecontentController(){
		$scope.pagename = "contentmanagementpage";
        $scope.contentTabindex = 0; // It represents the current tab index for contents based on the search text...
        tasks = taskService.getTasks('contentmanagementController');
		var localTask = "contentmanagement";
		sfactory.serviceCall({},tasks.getContents,'listDetails').then(function(response){
			$scope.contentmanagement = response.data;  
            $scope.getCurrentTab();
			$rootScope.appLoader = false;
		},function(error){
			appLoaderCheck = true;
			sfactory.localService(localTask).then(function(response){
				$scope.contentmanagement = response.data;  
                $scope.getCurrentTab();
				appLoaderCheck = false;
			},function(error){
			});
		});
		$scope.courseHead = {name:'Available',bind_val:'block',isSortable:false,isStatusColumn:true,columnName:"status",actionMethods:{status:{api:'content_v2.catGroupAssign',viewName:'content',session:'listDetails',isModify:true,parentId:""}}};

		$scope.sectionHead = {name:'Available',bind_val:'block',isSortable:false,isStatusColumn:true,columnName:"status",actionMethods:{status:{api:'content_v2.sectionGroupAssign',viewName:'content',session:'listDetails',isModify:true,parentId:""}}};
		
		$scope.activitiesHead = {name:'Available',bind_val:'block',isSortable:false,isStatusColumn:true,columnName:"status",actionMethods:{status:{api:'content_v2.scormGroupAssign',viewName:'content',session:'listDetails',isModify:true,parentId:""}}};
	};

	initiatecontentController();
    
}]);

advancePubapp.animation('.animate_slider_cont', function($animate) {
 return {
    enter: function(element, done) {
        element.css('display','inline-block');
        element.animate({"max-height":'999px'},500,function(){
            element.css('overflow','visible');
        });
        
    },
    leave: function(element, done) {
        element.css('overflow','hidden');
        element.slideUp();
        element.animate({"max-height":'0'},500);
    }
  };
});
advancePubapp.controller('createClassController', ['$scope', 'sfactory', '$rootScope', 'taskService','$state','$mdDialog','dataToPass', '$filter','$stateParams','sessionService','encryptionService',function($scope, sfactory, $rootScope, taskService,$state,$mdDialog,dataToPass,$filter,$stateParams,sessionService,encryptionService) {
     
    $scope.existclasserr = "";
    var tasks;
    var selectedClassId;
    var inputreq;
    $scope.showDown = false;
    $scope.myCroppedImage = '';
    $scope.myImage = '';
    $scope.blockingObject = {
        block: true
    };
     
	/* method for select particu;arrow value */
	$scope.gatherValues = function(selectedItem){
		$scope.classUser.classadmin = selectedItem.id;
    } 
		
	/* Method for edit teacher display */
	function editTeacherDisplay(){ 
		  sfactory.serviceCall('', tasks.teacherlist,"listDetails").then(function(response) {
			if($filter('lowercase')(response.status) == 'success'){
				$scope.selectedadminid = (!_.isNull(sessionService.get('teacherid'))) ? encryptionService.decrypt(sessionService.get('teacherid')) : '';
				$scope.classAdminuser = response.data;
				$scope.alertBaner = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
			}else{
				$scope.alertBaner = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
			}
            $rootScope.appLoader = false;
        }, function(error) {
            var localTask = "allclassuserlist";
            sfactory.localService(localTask).then(function(response) {
                $scope.tableDataadmin.data = response.data.data.data;
            }, function(error) {
            });
        });
	}
	
    $scope.addOrEditClass = function(isValid) {
         dataToPass && dataToPass.className ? $scope.editClass() : $scope.createClass('new'); 
    }
    
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $scope.hide();
    };
    
    $scope.hidepopup = function () {
        $scope.showDown = false;
    }
    $scope.renderimage = function () {
        $scope.blockingObject.render(function (dataURL) {
            $scope.classImage = dataURL;
            $scope.upload(dataURL);
            if (dataURL.length) {
                $scope.showDown = false;
            }
        });
    }
    
	/*Method to validate keypup event for class name*/
	$scope.classkeyup = function(name){
		if(name.length <= 25){
			return;
		}
		else{
			existclasserr=''
		}
	}
	//Method for image upload
    $scope.upload = function(file) {
        $scope.uploadedFile = file;
    }
    
    $scope.blockingObject.callback = function (dataURL) {
        
    }
    
    var handleFileSelect = function (evt) {
        $scope.showDown = true;
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {
                $scope.myImage = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };
    
    //function to add class
    $scope.createClass = function(type){        
		inputreq = createclassformdata(type);
        sfactory.serviceCall(inputreq,tasks.addNewClass,'listDetails').then(function(response){
			$rootScope.appLoader = false;
			if($filter('lowercase')(response.status) == 'success'){
				($scope.classUser.classname != '')	? sessionService.set('classname',encryptionService.encrypt($scope.classUser.classname)) : '';
				$scope.alertBaner = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
				setTimeout(function(){
					$mdDialog.cancel();
					$state.go('adminLanding.classDetails',{table:"users",classid:response.data.classmasterid,name:$scope.classUser.classname});
				},3000)
			}else{
				$scope.alertBaner = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
			}			
        },function(error){
            var localTask = "createClass";
            sfactory.localService(localTask).then(function(response){
                $state.go('adminLanding.classDetails',{table: "users", classid: '100', name:$scope.classUser.classname});
            },function(error){
            });
        });
    } 
	
	function createclassformdata(type){
		inputreq = {};
		if(type == 'new'){
			inputreq.classname     = $scope.classUser.classname;
			inputreq.email1        = $scope.classUser.email1;
			inputreq.firstname 	   = $scope.classUser.firstname;
			inputreq.gender        = $scope.classUser.gender;
			inputreq.lastname      = $scope.classUser.lastname;
			inputreq.phone_no      = $scope.classUser.phone_no;
			inputreq.username      = $scope.classUser.username;
			inputreq.profilepic    = $scope.uploadedFile;
		}else{
			inputreq.classname     = $scope.classUser.classname;
			inputreq.profilepic    = $scope.uploadedFile;
			inputreq.classadmin    = $scope.classUser.classadmin;
		}
		return inputreq;
	}
    
	$scope.checkClassExist = function() {
		var inputreq = {};
		inputreq.classname = $scope.classUser.classname;
		sfactory.serviceCall(inputreq,tasks.checkClassExistance,'listDetails').then(function(response){
			if(response.status !== "fail") {
				$scope.existStudent = true;  
			} else {
				$scope.existclasserr = response.message;
			}
			$rootScope.appLoader = false;
		},function(error){
			var localTask = "classExist";
			sfactory.localService(localTask).then(function(response){
				if(response.data.status !== "fail") {
					createClass();
				} else {
					$scope.existclasserr = response.data.message;
				}
				$rootScope.appLoader = false;
			},function(error){
			});
		});
    }
    
    $scope.editClass = function(isValid){
        inputreq = {};
        inputreq.classmasterid = selectedClassId;
        inputreq.classname = $scope.classUser.classname.trim();
        inputreq.profilepic = $scope.uploadedFile;
		inputreq.adminid = $scope.classUser.adminid;
        sfactory.serviceCall(inputreq,tasks.editClass,'listDetails').then(function(response){
            if(response.status !== "fail") {
			($scope.classUser.adminid != '') ? 	sessionService.set('teacherid',encryptionService.encrypt(String($scope.classUser.adminid))) : '';
			($scope.classUser.classname != '')	? sessionService.set('classname',encryptionService.encrypt($scope.classUser.classname)) : '';
            var responseData = {
                response : response,
                editedClassName : inputreq.classname
            }
			$mdDialog.hide(responseData);
            }else{
                $scope.existclasserr = response.message;
            }
            $rootScope.appLoader = false;
        },function(error){
            var localTask = "createClass";
            sfactory.localService(localTask).then(function(response){
                sessionService.set("classname",$scope.classUser.classname);
                $state.go('adminLanding.classDetails',{table:"users",classid:selectedClassId}, {reload:true});
                $rootScope.appLoader = false;
            },function(error){
            });
        });
    };     
    
    /* Method to initialize Controller */
    function init() {
		$scope.classUser = {};
		tasks = taskService.getTasks("createClassController");
        dataToPass && dataToPass.className ? $scope.classUser.classname = dataToPass.className : $scope.classUser.classname = '';
        dataToPass && dataToPass.classId ? selectedClassId = dataToPass.classId : '';
        $scope.classType = dataToPass.classType;
        $scope.classImage = dataToPass.classImg;
        setTimeout(function () {
            angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
        });
		editTeacherDisplay();
    };
	
	init();
    
}]);
advancePubapp.controller('createGroupController', ['$scope', 'sfactory', '$rootScope', 'taskService','$state','$mdDialog', 'dataToPass','$filter', function($scope, sfactory, $rootScope, taskService,$state,$mdDialog, dataToPass,$filter) {
    
    var inputreq,groupId,groupName;
 
    $scope.cancel = function() {
       $mdDialog.hide({cancel:true});
     //$mdDialog.cancel();
   /*  if($scope.groupType === 'edit') {    
           $state.transitionTo('classDetails', {classid:classId, group:groupId, table: 'users'},{
                    location: true,
                    inherit: true,
                    relative: $state.$current,
                    notify: false
            });
       } else if($scope.groupType === 'add') {
           $state.go('classDetails', {classid:classId, group:groupId, table: 'users'}, {reload: true});
       }*/
    };
    
    $scope.addOrEditGroup = function(isValid){
        $scope.groupType === 'add' ? checkGroupExist(isValid) : editGroup(isValid);
    };
    
    $scope.closeBaner = function(){ 
      $scope.alertBaner.showBaner = false;
    };
    
    function checkGroupExist(isValid) {
        if (isValid) {
            var inputreq = {};
            inputreq.groupname = $scope.obj.groupname;
            inputreq.classmasterid = classId;
            tasks = taskService.getTasks("createGroupController");
            sfactory.serviceCall(JSON.stringify(inputreq),tasks.checkGroupExistance,'listDetails').then(function(response){
                if(response.status !== "fail") {
                    createGroup();
                } else {
                    $scope.err.groupErrorMsg = response.message;
                }
                $rootScope.appLoader = false;
            },function(error){
                var localTask = "groupExist";
                sfactory.localService(localTask).then(function(response){
                    if(response.status !== "fail") {
                        createGroup();
                    } else {
                        $scope.err.groupErrorMsg = response.data.message;
                    }
                    $rootScope.appLoader = false;
                },function(error){
                });
            });
        }
    };
    
	function createGroup() {
        inputreq = {};
        inputreq.groupname = $scope.obj.groupname.trim();
        inputreq.classmasterid = classId;
        tasks = taskService.getTasks("createGroupController");
        sfactory.serviceCall(inputreq,tasks.addNewGroup,'listDetails').then(function(response){
            groupId = response.data.groupid;
			response.data.groupname = inputreq.groupname;
			response.data.usercnt   = 0;
            $mdDialog.hide({response:response});
           /* setTimeout(function() {
                $state.go('classDetails', {classid:classId, group:response.data[0].groupid ,table: 'users'}, {reload: true});
            },500);*/
			setTimeout(function() {
				$state.transitionTo('adminLanding.classDetails', {classid:classId, group:response.data.groupid ,table: 'users'},{ 
					location: true,
					inherit: true,
					relative: $state.$current,
					notify: false,
					reload: false
				});
			},500);	
            $rootScope.appLoader = false;
        },function(error){
            var localTask = "createGroup";
            sfactory.localService(localTask).then(function(response){
				$mdDialog.hide({response:response});
                //$mdDialog.hide(response);
                groupId = response.data.data.groupid;
                setTimeout(function() {
                    $state.go('adminLanding.classDetails', {classid:classId, group:response.data.groupid ,table: 'users'}, {reload: true});
                },7000);
            },function(error){
            });
        });
    };
    
    function editGroup(isValid) {
        if(isValid) {
            inputreq = {classgroupname:$scope.obj.groupname.trim(),classgroupid:groupId,classmasterid:classId}
            tasks = taskService.getTasks("createGroupController");
            sfactory.serviceCall(inputreq,tasks.editGroup,'listDetails').then(function(response){
				if($filter('lowercase')(response.status) == 'success'){ 
                     $mdDialog.hide({response:response,inputreq:inputreq});
				}else{
					$scope.alertBaner = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'}; 
				}
                $rootScope.appLoader = false;
            },function(error){
            });
        }
    };
    
    /* Method to initialize Controller */
    function initializeController() {
        $scope.obj = {};
        $scope.err = {};
        $scope.notNewGroup = true;
        $scope.groupNameFlag = false;
        inputreq = {};
        classId = dataToPass.classId || dataToPass.classid;
        $scope.groupType = dataToPass.groupType;
        groupId = dataToPass.group;
        groupName = dataToPass.groupName;
        groupName ? $scope.obj.groupname = groupName : $scope.obj.groupname = '';
    };
    
    initializeController();
}]);
advancePubapp.controller('dashboardController',['$scope','sfactory','$state','$mdSidenav','$log','$rootScope','$timeout','$mdDialog','$filter', '$mdToast','cacheService','sessionService', 'encryptionService','$interval','messagingService',function($scope,sfactory,$state, $mdSidenav ,$log,$rootScope,$timeout,$mdDialog,$filter,$mdToast,cacheService,sessionService,encryptionService,$interval,messagingService){
	 
    /* Method callback for close the baner alert message */ 
    $scope.closeBaner = function(){
        $scope.alertBaner.showBanercls = false;
        $scope.$emit('switchMenu',{list:$scope.listObj});
    }
    $scope.closeBanerIdle = function(){
        $scope.active= true;$scope.timer=false;
       // $scope.$emit('switchMenu',{list:$scope.listObj});
    }
    /* Method to capture baner call back from child directives */
    $scope.$on('emitFromDirectiveBaner',function(event,args){
        $scope.alertBaner = args.alertBaner;
        if(angular.isDefined(args.list)) $scope.listObj = args.list;
    })
    
    //Method for group admin notifications
    $scope.groupadminnotification = function(){
        $mdToast.show({
            locals:{notificationdata : $scope.loggedUserDetails.unreadNotification}, 
            hideDelay    : 6000,
            position     : 'top right',
            controller   : 'messageNotificationController',
            templateUrl  : 'dest/templates/messageNotification.html',
            clickOutsideToClose: true
        }).then(function(shownotify) {
            if(shownotify == 'showmorenotification'){
                $scope.messageunreadNotification = $scope.loggedUserDetails.unreadNotification;
                $scope.mailnotify = true;
            }else{
                $scope.mailnotify = true;
                _.each($scope.loggedUserDetails.unreadNotification, function(mailitem,$index) {
                    if(mailitem.messageId == shownotify){ 
                        $scope.loggedUserDetails.unreadNotification[$index].expandmessagenotify = true;
                    }
                });
                $scope.messageunreadNotification = $scope.loggedUserDetails.unreadNotification;
            }
            
        }, function() {
        });
    }

    $scope.selectedToggle='org';
    $scope.toggleSsa = function(select){
        $scope.selectedToggle=select;
        console.log(select);
        sfactory.serviceCall({},'organization.superadminlist','listDetails').then(function(response){
             $rootScope.appLoader = false;
            if($filter('lowercase')(response.status) == 'success'){
                $scope.tableData.data = response.data.list;              
                $scope.pagination = response.paginateData;
                $scope.pagination.currentPage = paginationData.currentPage;
            }
           
        },function(error){
            var localTask = "usermanagement";
            sfactory.localService("adminlist").then(function(response){
                $scope.tableData.data = response.data.data;
                // $scope.pagination = response.data.paginateData;
                // $scope.pagination.currentPage = $scope.pagination.currentPage;
            },function(error){
            });
        });
    }

    //Method for back to notification
    $scope.backtomessageNotification = function(){
        $scope.mailnotify = false;
    }
	/* Method to initial data for admin portal page application after successfull login */
    $scope.dashboardCall = function(){
		var serRequest = {};
        var task = "loggedUserdetails";
        sfactory.serviceCall(serRequest,task,'adminPage').then(function(response){
			 if(response.status.toLowerCase() == 'success'){
				$scope.breadcrumbList = ['User Management'];
				$scope.loggedUserDetails = response.data;
                $scope.cacheServiceData.imageName = $scope.loggedUserDetails.profileImage.url+$scope.loggedUserDetails.profileImage.name;
                $scope.cacheServiceData.fullname = $scope.loggedUserDetails.loggedBy;
                sessionService.set('userId',encryptionService.encrypt(String(response.data.userId)));
                sessionService.set('role',encryptionService.encrypt(String(response.data.roleType)));
                if($scope.loggedUserDetails.adminType == 'groupAdmin'){
                     $scope.afterCard = false;
                }                
			 }
			 $rootScope.appLoader = false;
		 },
          function(){
              var localTask = "loggeduserdetails";
              sfactory.localService(localTask).then(function(response){
                    $scope.loggedUserDetails = response.data.data.data['0'];
                    $scope.cacheServiceData.imageName = $scope.loggedUserDetails.profileImage.url+$scope.loggedUserDetails.profileImage.name;
                    $scope.cacheServiceData.fullname = $scope.loggedUserDetails.loggedBy;
                    $scope.breadcrumbList = ['User Management'];
                    $scope.adminContentTemplate = templateURL+'dest/templates/usermanagement.html';
                },function(error){
                });
         });
    }
    
    /* Method to activate or deactivate the group */
    $scope.activateOrDeactivate = function(selectedGroup){
        var index;
        var serRequest = {id :selectedGroup.group_id,action: (selectedGroup.block) ? 'deactivate' : 'activate'};
        sfactory.serviceCall(serRequest,'groups.groupStatus','listDetails').then(function(response){
            var banerData = {message:response.message,showBanercls:true,banerClass:''};
            if(($filter('lowercase')(response.status) == 'success')){
                banerData.banerClass = 'alert-success';
                index = $scope.loggedUserDetails.groupName.findIndex(x => x.group_id === selectedGroup.group_id);
                $scope.loggedUserDetails.groupName[index].block = !$scope.loggedUserDetails.groupName[index].block;
            }
            else{
                banerData.banerClass = 'alert-danger';
            }
            $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
            $scope.$emit('emitForClose',{'isSingleuser':false,'isMultiuser':false,'showicon':true});
            $rootScope.appLoader = false;
		 },
         function(){
         });
    };
    
   //Method for new group management and user creation
  $scope.creategroupuser = function() {
        $mdDialog.show({
            controller: 'groupmanagementController',
            templateUrl: 'dest/templates/groupmanagement.html',
            parent: angular.element(document.body),
            clickOutsideToClose:true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function(returnmessage) {
			if(returnmessage){
				if($filter('lowercase')(returnmessage.status) == 'success'){
					var banerData = {'message':returnmessage.message,'showBanercls':true,'banerClass':'alert-success'};
					$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
					$scope.$emit('emitForClose',{'isSingleuser':false,'isMultiuser':false,'showicon':true});
				}else{
					var banerData = {'message':returnmessage.message,'showBanercls':true,'banerClass':'alert-danger'};
					$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
					$scope.$emit('emitForClose',{'isSingleuser':false,'isMultiuser':false,'showicon':true});
				}
			}
        }, function() {
        });
    };
 
    //Method for view group management
    $scope.vieweditgroupuser = function(group,task){
        if(task == 'edit'){
             group.viewChild = 'isEditable';
             $tempurl         = 'dest/templates/groupEditView.html';
        }else{
             group.viewChild = 'viewChild';
             $tempurl         = 'dest/templates/groupView.html';
        }       
		$mdDialog.show({
            controller: 'groupAddEditController',
            templateUrl: $tempurl,
            parent: angular.element(document.body),
            clickOutsideToClose:false,
            fullscreen: $scope.customFullscreen,
            locals: {
               existgrouplist: group
             }
        }).then(function(returnmessage) {
            if(returnmessage){
				var banerData = {'message':returnmessage.message,'showBanercls':true,'banerClass':'alert-success'};
				$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
				$scope.$emit('emitForClose',{'isSingleuser':false,'isMultiuser':false,'showicon':true});
			}
        }, function() {
            
        });
    }
	
    //Method for delete group management
    $scope.deletegroupuser = function(Id,index){
        var confirm = $mdDialog.confirm()
        .title('Are you sure you want to delete the group?')
        .ariaLabel('Lucky day')
        .targetEvent()
        .ok('Delete')
        .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {
            var task = "groups.delete_list";
            var data = {'id':Id};
            sfactory.serviceCall(data,task,'listDetails').then(function(response){            
                if($filter('lowercase')(response.status) == 'success'){
                    if(response.data.deletable != ""){
                        $scope.loggedUserDetails.groupName.splice(index, 1);
                        var banerData = {'message':response.message,'showBanercls':true,'banerClass':'alert-success'};
                        $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
                        $scope.$emit('emitForClose',{'isSingleuser':false,'isMultiuser':false,'showicon':true});
                    }else{
                        var banerData = {'message':'The group is non deletable','showBanercls':true,'banerClass':'alert-success'};
                        $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
                        $scope.$emit('emitForClose',{'isSingleuser':false,'isMultiuser':false,'showicon':true});
                    }
                }else{
                    var banerData = {'message':response.message,'showBanercls':true,'banerClass':'alert-danger'};
                    $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
                }
                $rootScope.appLoader = false;
            },function(error){
                var banerData    = {'message':response.message,'showBanercls':true,'banerClass':'alert-danger'};
                $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
            });
        }, function() {
        
        });  
    }
    //method for my profile edit
	$scope.myprofileedit = function(){
		statename = 'myprofile';		
        sfactory.bufferedData.types = "my";
		$state.go("adminLanding."+statename,{location: false});
	}
    
    /** Service to get the latest conversation messages/notification ***/
    function messageRecent(){
        if($scope.recentMsgBool){ 
            $scope.recentMsgBool = false;
            sfactory.serviceIntervalCall("","messaging.recentConversation",'listDetails').then(function(response){
                if(response.status.toLowerCase() == 'success'){
                    $scope.recentConversation = response.data;                
                    _.each($scope.recentConversation.recentUnreadMsgList, function(item){
                        var sentDate = moment.utc(item.messageSentTime).local();
                        item.messageSentTime = moment(sentDate).format("MM/DD/YYYY hh:mm A"); 
                    }); 
                    _.each($scope.recentConversation.recentUnreadNotifyList, function(item){
                        var sentDate = moment.utc(item.messageSentTime).local();
                        item.messageSentTime = moment(sentDate).format("MM/DD/YYYY hh:mm A"); 
                    });   
                    messagingService.msgcount = $scope.recentConversation.msgCount ? $scope.recentConversation.msgCount : 0;
                    messagingService.notifyCount = $scope.recentConversation.notifyCount ? $scope.recentConversation.notifyCount : 0;
                } 
                $scope.recentMsgBool = true;
            },function(error){
                sfactory.localService("messagerecent").then(function(response){
                    $scope.recentConversation = response.data.data;                
                    _.each($scope.recentConversation.recentUnreadMsgList, function(item){
                        var sentDate = moment.utc(item.messageSentTime).local();
                        item.messageSentTime = moment(sentDate).format("MM/DD/YYYY hh:mm A"); 
                    }); 
                    _.each($scope.recentConversation.recentUnreadNotifyList, function(item){
                        var sentDate = moment.utc(item.messageSentTime).local();
                        item.messageSentTime = moment(sentDate).format("MM/DD/YYYY hh:mm A"); 
                    });
                    $scope.recentMsgBool = true;
                },function(error){
                });
            });
        }
        
    };
    /*console.log("Hos tis ",$location.host());*/
    
    $scope.recentMsgNotify = null;
    
    $scope.recentMsgNotify = $interval(
        function () {
                    messageRecent();
                }, 15000);
    
    $scope.messageState = function(value){
        $scope.showNotify = true;
        $scope.msgType = value;
        $scope.recentConversationMsg = (value == 1) ? $scope.recentConversation.recentUnreadMsgList : $scope.recentConversation.recentUnreadNotifyList;         
    };
    
    $scope.hideNotifyMsg = function(){
       $scope.showNotify = false; 
    };
    
    $scope.messageRedirection = function(value){
        $scope.showNotify = false;
        $state.go('adminLanding.adminmessage',{'msgtype': value});
    };
    
    $scope.viewMsgNotify = function(msgid){
        $scope.showNotify = false;
        msgIds = [];
        msgIds.push(msgid);
        msgstat = {
            "messageId" : msgIds,
            "readStatus" : "read"
        };        
        sfactory.serviceIntervalCall(msgstat,"messaging.conversationRead",'listDetails').then(function(response){
            if($filter('lowercase')(response.status) == 'success'){					
                messageRecent();
            }            
        },function(){
            var banerData = {'message':"Message read/unread status changed successfully",'showBaner':true,'banerClass':'alert-success'};
            $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});                      
        });
        $state.go('adminLanding.adminmessage',{'msgtype': $scope.msgType,'msgid': msgid});        
    };
    
    
    
    /*Method to navigate super admdin to admin portal contents page */
    $scope.adminPortal = function(group){
		    sessionService.empty('grp_id');	
			if(typeof(siteAdminURL) == "undefined"){
				sessionService.set('grp_id',encryptionService.encrypt(group.group_id.toString()));
			}		
		    var req = JSON.stringify({'group_id':group.group_id});
            sfactory.serviceCall(req,'adminGroupIdControl','adminPage').then(function(response){
                if($filter('lowercase')(response.status) == 'success'){
					
					sessionService.set('grp_id',encryptionService.encrypt(group.group_id.toString()));
					
                    $scope.adminportalview = true;  
                    $scope.afterCard = true;  
                    /*requestcheck= {
                        'group_id'  : response.data.groupId,
                        'sessionId': response.data.sessionId

                    };
                    sfactory.serviceCallReports(requestcheck,'setreportssession').then(function(response){
                        if(response.status=='success'){                        
                            $state.go('adminLanding.usermanagement',{Loggeduserdetails:$scope.loggedUserDetails,location: false}); 
                        }
                    },function(error){
                    });*/	
                    $state.go('adminLanding.usermanagement',{Loggeduserdetails:$scope.loggedUserDetails,location: false}); 
                }else{
                    var banerData = {'message':'Group is not available','showBanercls':true,'banerClass':'alert-success'};
                    $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
                    $scope.$emit('emitForClose',{'isSingleuser':false,'isMultiuser':false,'showicon':true});
                }
            },function(){
                $scope.adminportalview = true;  
                $scope.afterCard = true;     
                $scope.loginnedgroupname = group.groupname;
                $state.go('adminLanding.usermanagement',{Loggeduserdetails:$scope.loggedUserDetails,location: false}); 
            });
    };
	
	//method for toggle child menu
	$scope.toggle_child_menu = function($scope) {
        $scope.isActive1 = !$scope.isActive1;
    };
    
    //method to hide child medu on mouseleave event
     $scope.hideThisDiv = function () {
        $scope.isActive1 = false;
    };
    $scope.clocsesubmenu = function () {
        $scope.isActive1 = false;
    };

   $scope.showform= false;

    $scope.usercancel = function(){
        $scope.showform =  false;

    }
    $scope.addAdmin = function(){
         $scope.showform =  true;
    }
	 
	/* Method to logout admin */
    $scope.logoutAdmin = function(){
        $scope.mailnotify = false;
        var logoutRequest = {};
        var task = "adminLogout";
        sfactory.serviceCall(logoutRequest,task,'adminPage').then(function(response){
            sessionService.clear();
            $state.go('adminLogin',{isLoggedin:false,location: false}); 
			$rootScope.appLoader = false;
			cacheService.empty();
        },function(logoutError){
        });
    };

    /* Method to toggle menu based on the resolution */
    $scope.slideMenu = function(navID){
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
    };
    /*$scope.checkingMultiEnroll = function(){
        enrollValues = {
            "action" : "enrol",
            "classid": 230,
            "courseid": [2,3,4,5,6,7,8,9,10,11]
        }
        sfactory.serviceCall(enrollValues,"assignContenttoclass").then(function(response){
            if($filter('lowercase')(response.status) == 'success'){
					console.log("Bulk Enrollment response =>",response);
                }
        },function(){
        });
    };*/
     function initializeController(){
         $scope.isActive1 = false;
         $scope.cacheServiceData = {};
        var templatepath = templateURL+"dest/templates/";
         $scope.tableData = {
            pageName:'adminlist',
            currentpage :'user',
            isFilterbtns:false,
            isSearch:false,
            isPagination:false,
            isroletypedisplay:false,
            sortType:'registerdate',
            sortReverse: false,
            // ismultiDel:{task:'user.delete_list',viewname:'user'},
            childTemplate:templatepath+"userEdit.html",
            isCheckboxhide:true,
            headers:[
                {name:'Name',bind_val:'name',isSortable:true},
                {name:'user name',bind_val:'username',isSortable:true},
                {name:'Registered date',bind_val:'registerDate',isSortable:true},
                {name:'Block | UnBlock',bind_val:'block',isSortable:true,isStatusColumn:true,columnName:"status",actionMethods:{status:{api:'user.changeBlock',viewName:'user',session:'listDetails'}}},
                {name:'actions',bind_val:'actions',isSortable:false,isActionColumn:true,columnName:"addeditview",actionMethods:{delete:{api:'user.delete_list',viewName:'user',session:'listDetails'}}}                
            ],  
            data:[]
        }
		$scope.dashboardCall();
         $scope.recentMsgBool = true;
         messageRecent();
        $scope.adminPageScope = angular.element(jQuery("#admin")).scope();
	 };
    
    initializeController();
}]);
advancePubapp.controller('editStudentController', ['$scope', 'sfactory', '$rootScope', 'taskService','$state', '$stateParams','cacheService','$mdDialog', 'dataToPass', 'previousState', '$filter', function($scope, sfactory, $rootScope, taskService,$state,$stateParams,cacheService, $mdDialog, dataToPass, previousState, $filter) {
    
    var tasks;
    var inputreq;
    var userName;
    var email;
    var userId;
    $scope.user = {};
    $scope.currentYear = new Date().getFullYear();
    $scope.showDown = false;
    $scope.myCroppedImage = '';
    $scope.myImage = '';
    $scope.blockingObject = {
        block: true
    };
    
    /* Method on change of email */                                                                                          
    $scope.validateEmail = function(){
        var dataRequest = {};
        $scope.useremailexist = false;
        if(angular.isDefined($scope.user.email) && ($scope.user.email !== "")) {
			dataRequest = {email1:$scope.user.email,userid:userId};
            sfactory.serviceCall(dataRequest,tasks.validateEmail,"listDetails",true).then(function(response){
				if(angular.isDefined(response)){
					$scope.useremailexist = !($filter('lowercase')(response.status) == 'success');
				}
            },function(){
            });
       }
    };
    /* Method to initialize Controller */
    function initializeController() {
        
		tasks = taskService.getTasks("editStudentController");
		/* Method for set profile pic if there is no imgae*/
				
        if(dataToPass) {
            userName = dataToPass.username;
            email = dataToPass.email;
            userId = dataToPass.id;
            $scope.user.firstname = dataToPass.firstname;
            $scope.user.lastname = dataToPass.lastname;
            $scope.user.username = dataToPass.username;
            $scope.user.phone_no = dataToPass.phone_no;
            $scope.user.address = dataToPass.address;
            $scope.user.roaming = dataToPass.roaming_content;
            $scope.user.gender = dataToPass.gender;
			$scope.user.dob = dataToPass.dob;
            $scope.user.email = dataToPass.email;
            $scope.studentProfilePic = (dataToPass.profile_pic != "") ? dataToPass.profile_picurl + dataToPass.profile_pic : templateURL+'dest/images/noimage.png';
        }
        setTimeout(function () {
            angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
        });
    };
     
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $scope.hide();
    };
     
    $scope.hidepopup = function () {
        $scope.showDown = false;
    }
    $scope.renderimage = function () {
        $scope.blockingObject.render(function (dataURL) {
            $scope.dataURLsa = dataURL;
            $scope.studentProfilePic = dataURL;
            $scope.upload(dataURL);
            if (dataURL.length) {
                $scope.showDown = false;
            }
        });
    }
    
    //Method for image upload
    $scope.upload = function(file) {
        $scope.uploadedFile = file;
    }
    
    $scope.blockingObject.callback = function (dataURL) {
        
    }
    
    var handleFileSelect = function (evt) {
        $scope.showDown = true;
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {
                $scope.myImage = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };
    
    function createRequestObj() {
        inputreq = {};
        inputreq.firstname = $scope.user.firstname;
        inputreq.lastname = $scope.user.lastname;
        inputreq.username = userName;
        inputreq.phoneno = $scope.user.phone_no;
        inputreq.address = $scope.user.address;
        inputreq.user_id = userId;
        inputreq.password = $scope.user.password;
        inputreq.dob = $scope.user.dob;
        inputreq.roaming_content = $scope.user.roaming;
        inputreq.gender = $scope.user.gender;
        inputreq.email1 = $scope.user.email;
        inputreq.roletype = 5;
        //inputreq.profilepic = $scope.uploadedFile;
    }
    
    $scope.editUser = function() {
        createRequestObj();
        tasks = taskService.getTasks("editStudentController");
        var formToken = {'token':inputreq,'formObj':JSON.stringify({'profilepic' : $scope.uploadedFile})}; 
        sfactory.serviceCallFormData(formToken,tasks.editStudent,'listDetails').then(function(response){
            if($filter('lowercase')(response.status) == 'success'){
                studenTableUpdate(response);
                $rootScope.appLoader = false;
                $mdDialog.hide(response);
            } else {
                var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
                $scope.alertBaner = banerData;
            }
        },function(error){
            var localTask = "editStudentSuccess";
            sfactory.localService(localTask).then(function(response){
                $mdDialog.hide(response);
                previousState.reload();   
                $rootScope.appLoader = false;
            },function(error){
            });
        });
    }
	
	function studenTableUpdate(response){
		dataToPass.firstname = inputreq.firstname;
		dataToPass.lastname  = inputreq.lastname;
		dataToPass.phone_no  = inputreq.phoneno;
		dataToPass.address   = inputreq.address;
		dataToPass.gender    = inputreq.gender;
        dataToPass.email    = inputreq.email;
	    dataToPass.roaming_content = inputreq.roaming_content;
		dataToPass.name      = inputreq.firstname+' '+inputreq.lastname;
		dataToPass.dob  = angular.isDefined(inputreq.dob)?inputreq.dob:"";
		dataToPass.profile_pic  = (response.data.profile_pic)?response.data.profile_pic:"";
		dataToPass.profile_picurl  = (response.data.profile_picurl)?response.data.profile_picurl:"";
        
	}
    
    initializeController();
}]);
//var advancePubapp = angular.module('advancePublications',[]);
advancePubapp.controller('forummanagementController',['$scope','$state','sfactory','$rootScope','Lightbox','$filter','$mdDialog','encryptionService','sessionService','$stateParams','sharedService',function($scope,$state,sfactory,$rootScope,Lightbox,$filter,$mdDialog,encryptionService,sessionService,$stateParams,sharedService){ 
    
    $scope.uploadedImage = [];
     var iconTypesAllowed;
 
    /* Method to initialize the add forum form */
    function initializeAddForum(){
        $scope.forum.title ="";
        $scope.forum.message="";
        $scope.forum.imgname="";
        $scope.forum.imageLoadError="";
        $scope.forum.postCategory = $scope.forum.postCategories[0];
        $scope.dataURLsa = "";
        $scope.forum.picture={icon:"noimage.png",copyIcon:"",url:"dest/images"};
        //$scope.getPostToOptions();
        $scope.invalidImage = [];
        $scope.replyForum= false;
    };
    
    /* Method to called when click on 'New Topic' button */
    $scope.addNewTopic = function(){
        $scope.changeFormDisplay(true,false);
        initializeAddForum();
        $scope.forum.addNewTopic = true;
    };
    
    $scope.delete_space= function(){
        $scope.replyForum= false;
        val = $.trim($scope.forum.add.message);
        if(val.length>0){
            $scope.replyForum= true;
        }
    }
    
    /* redirect Forum page */
    $scope.getFrmList = function(){
        $state.go('adminLanding.forum',{"id":''});
    };
    
    /* redirect Forum post */
    $scope.gotoFrmTopic = function(index){
        $state.go('adminLanding.forum',{id:index});
    };
    
    /* Method to view the expanded view of Forum */
    $scope.expandedView = function(index){
        $scope.editId   = $stateParams.id ? _.findIndex($scope.forumData.filteredForums, {topicId: $stateParams.id }) : index; 
        $scope.validImage = [];$scope.invalidImage = []; $scope.uploadedImage = [];
        forumDataReq={discussionId: $stateParams.id ? index : $scope.forumData.filteredForums[index].topicId};
        sfactory.serviceCall(JSON.stringify(forumDataReq), forumServices.discussionDetails,forumServices.type).then(function(response) {
            if(angular.isDefined(response)){
                $scope.forum.discussions = response.data;
                _.each($scope.forum.discussions, function(item){
                    var discussionCreated = moment.utc(item.discussionCreatedOn).local();
                    item.discussionCreatedOn = moment(discussionCreated).format("MM/DD/YYYY hh:mm A");
                });
                $scope.editIndex = $scope.editId;
                $scope.forum.formDetails = $scope.forumData.filteredForums[$scope.editId];
                $scope.forum.add = {};
                $scope.changeFormDisplay(false,true);
            }
            $rootScope.appLoader = false;
        }, function(error) {
                sfactory.localService(localTask).then(function(response) {
                    $scope.forum.discussions = angular.copy(response.data.discussionDetails);
                    $scope.editIndex = $scope.editId;
                    $scope.forum.formDetails = $scope.forumData.filteredForums[$scope.editId];
                    $scope.forum.add = {};
                    $scope.changeFormDisplay(false,true);
                }, function(error) {
               });
        });
    };
    
    /* Method to close Add New Topic in Forum */
    $scope.cancelNewTopic = function(){
       $scope.forum.addNewTopic = false;
    };
     
    /* Method to change display of Forum list */
    $scope.changeFormDisplay =function(isListView,isExpandedView){
        $scope.forum.formList = isListView;
        $scope.forum.expanded = isExpandedView;
        $scope.validImage = [];$scope.invalidImage = []; $scope.uploadedImage = [];
        
        /* tab selection */
        $scope.selectedIndex.tab = sharedService.forumTabs;
    };
    
    /* Method to filter Forum list */
    $scope.filterForums = function(index){
        $scope.forumData.filteredForums = (index === 0) ? $scope.forumData.data : _.filter($scope.forumData.data, function(obj){return obj.myforums === $scope.tabs[index]});
        sharedService.forumTabs = $scope.selectedIndex.tab;
    };
    
        
    /* Method to populate the combo for Post list and Post category*/
    $scope.getPostToOptions = function(){
        $scope.forum.postList = _.pluck(_.find($scope.forumData.postCategory,function(obj){ return obj.name === $scope.forum.postCategory}).postedTo,'postName');
        $scope.updatePostList();
    };
    
    /* Method to initialize Post To combo box*/
    $scope.updatePostList = function(){
        $scope.forum.postTo = $scope.forum.postList[0];
    };

    /* Method for icon image upload */
    $scope.iconImageUpload = function(){
		setTimeout(function () {
		  angular.element('#picture').trigger('click');
		}, 0);
	};
    
    /* Method to add new Forum */
    $scope.addNewForum = function(){
        var formObj = new FormData(); 
        forumDataReq = {topicTitle:$scope.forum.title,topicMessage:$scope.forum.message}; //,topicAttachment: $scope.dataURLsa
        //,topicCategory:$scope.forum.postCategory,topicAssignedTo:$scope.forum.postTo
        /*formObj.append('topicAttachment',uploadedImage);
        formObj.append('forumData',JSON.stringify(forumDataReq)); */
        _.each($scope.uploadedImage,function(item){
        formObj.append('topicAttachment[]',item);
       });
        //formObj.append('forumData',JSON.stringify(forumDataReq));
        var formToken = {'token':forumDataReq,'formObj':formObj};
        sfactory.serviceCallFormData(formToken, forumServices.createForum,forumServices.type).then(function(response) {
            if(angular.isDefined(response)){
                
               var topicCreated = moment.utc(response.data.topicCreatedOn).local();
                response.data.topicCreatedOn = moment(topicCreated).format("MM/DD/YYYY hh:mm A");
                response.data.myforums = ($scope.myId==response.data.topicCreatedUserid) ? "My Forums" : 0;
                $scope.forumData.filteredForums.unshift(response.data);
                
                $scope.validImage = [];$scope.invalidImage = [];$scope.uploadedImage = [];
                $scope.forum.addNewTopic = false;
                showBanner(response.message, response.status);  
            }
            $rootScope.appLoader = false;
        }, function(error) {
                $scope.forumData.filteredForums.unshift(forumDataReq);
                $scope.forum.addNewTopic = false;
        });
    };
    
    /* Method to image upload in add new Forum */
    $scope.upload = function(files) {
        $scope.validImage = [];$scope.invalidImage = []; $scope.uploadedImage = [];$scope.forum.picture = {};
        if(files){
            if (files.length < 20) {
            _.each(files, function(item){
            if(_.contains(iconTypesAllowed, item.name.split(".").pop())){
                $scope.uploadedImage.push(item);
                //$scope.imageFileName.push({'name':item.name,'valid':true});
                $scope.getImage(item);
                $scope.forum.picture.isError  = false;                
            }else{
                $scope.forum.picture.errorMessage = "Please choose valid file";
                $scope.forum.picture.isError = true;
                 $scope.invalidImage.push({'name':item.name,'valid':false,'imgfile':null});           
            }
            });
            }else{
             alert("Please select max 20 files.");
            return false;
          }
            
        }
    };
    
    $scope.removeImage = function(e,index){
       $(e.target).parent().remove();
        $scope.uploadedImage.splice(index,1);     
       // console.log(uploadedImage);
    }


    /* Method to added reply to the Forum in expanded view */
    $scope.addReply = function(){
         var formObj = new FormData(); 
        forumDataReq = {discussionTopicId:$scope.forumData.filteredForums[$scope.editIndex].topicId,discussionMessage:$scope.forum.add.message};
         _.each($scope.uploadedImage,function(item){
        formObj.append('topicAttachment[]',item);
       });
        //formObj.append('forumData',JSON.stringify(forumDataReq));
        var formToken = {'token':forumDataReq,'formObj':formObj};
        sfactory.serviceCallFormData(formToken, forumServices.addReply,forumServices.type).then(function(response) {
            if(angular.isDefined(response)){
               var discussionCreated = moment.utc(response.data.discussionCreatedOn).local();
               response.data.discussionCreatedOn = moment(discussionCreated).format("MM/DD/YYYY hh:mm A");
               $scope.forum.discussions.unshift(response.data);
               $scope.forum.add={};
               $scope.validImage = []; $scope.invalidImage = [];$scope.uploadedImage = [];
            }
            $rootScope.appLoader = false;
            showBanner(response.message, response.status);  
        }, function(error) {
            $scope.forum.discussions.push({discussionMessage:$scope.forum.add.message,discussionCreatedOn:"2017-06-06 06:54:09"});
            $scope.forum.add={};
        });
    };
    
    $scope.cancelReply = function(){
        $scope.forum.add.message = "";
        $scope.validImage = [];$scope.invalidImage = []; $scope.uploadedImage = [];
    };
    
    $scope.openLightboxModal = function (images,index) {
        $scope.images=[];
        _.each(images, function(item){
            $scope.images.push({"url": item,"thumbUrl":item});
        });
    Lightbox.openModal($scope.images, index);
  };
     
    /* Method to get Forum list */
    function getForumDetails(){
         sfactory.serviceCall({}, forumServices.forumList,forumServices.type).then(function(response) {
            if(angular.isDefined(response)){
                $scope.forumData = response;
                $scope.forumData.filteredForums = response.data;
                _.each($scope.forumData.filteredForums, function(item){
                    var topicCreated = moment.utc(item.topicCreatedOn).local();
                    item.topicCreatedOn = moment(topicCreated).format("MM/DD/YYYY hh:mm A");
                    item.myforums = ($scope.myId==item.topicCreatedUserid) ? "My Forums" : 0;
                });
                $scope.forum.postCategories =_.pluck(response.postCategory,'name');
                //$scope.forum.postList = _.pluck(_.find(response.postCategory,function(obj){ return obj.name === $scope.forum.postCategories[0]}).postedTo,'postName');
                $scope.filterForums($scope.selectedIndex.tab);
                if($stateParams.id >0){        
                    $scope.expandedView(Number($stateParams.id));
                }
                if($scope.forumData.filteredForums.length == 0){
                    $scope.tabs =[];
                }
            }
            
            $rootScope.appLoader = false;
        }, function(error) {
                sfactory.localService(localTask).then(function(response) {
                    $scope.forumData = response.data;
                    $scope.forumData.filteredForums = response.data.data;
                     _.each($scope.forumData.filteredForums, function(item){
                    var topicCreated = moment.utc(item.topicCreatedOn).local();
                    item.topicCreatedOn = moment(topicCreated).format("MM/DD/YYYY hh:mm A");
                    item.myforums = ($scope.myId==item.topicCreatedUserid) ? "My Forums" : 0;
                    });
                    $scope.forum.postCategories =_.pluck(response.data.postCategory,'name');
                   // $scope.forum.postList = _.pluck(_.find(response.data.postCategory,function(obj){ return obj.name === $scope.forum.postCategories[0]}).postedTo,'postName');
                    $scope.filterForums($scope.selectedIndex.tab);      
                    if($stateParams.id>0){        
                        $scope.expandedView(Number($stateParams.id));
                    }
                    if($scope.forumData.filteredForums.length == 0){
                        $scope.tabs = [];
                    }
                }, function(error) {
               });
        });
    };
    
    /* Method to delete Forum or delete topic from a Froum */
    $scope.deleteForum = function(index,event) {
         if(event) event.stopPropagation();
        if(index == 0) { return false;};
         var formObj = new FormData(); 
         forumDataReq = {topicId:index,actionType:"delete"};
         formObj.append('forumData',JSON.stringify(forumDataReq));
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to delete the post ?')
            .textContent('')
            .ariaLabel('Lucky day')
            .ok('Delete')
            .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                $rootScope.appLoader = true;
                
                sfactory.serviceCall(JSON.stringify(forumDataReq), forumServices.deleteForumTopic,forumServices.type).then(function(response) {
                    if(angular.isDefined(response)){
                    showBanner(response.message, response.status);  
                    }
                    $scope.forumData.filteredForums.splice(_.findIndex($scope.forumData.filteredForums, {topicId: response.data.topicId }), 1);
                    (_.findIndex($scope.forumData.data, {topicId: response.data.topicId })=== -1)? "": $scope.forumData.data.splice(_.findIndex($scope.forumData.data, {topicId: response.data.topicId }), 1);
                    if($scope.forumData.filteredForums.length == 0){
                        $scope.tabs =[];
                    }
                    $rootScope.appLoader = false;
                }, function(error) {
                    
                });
            }, function() {
            });
    };
    
    /* Method to close notification banner*/
    $scope.closeBaner = function(){
        $scope.alertBaner.showBaner = false;
    };
    
  
    $scope.toggleOptions = function(index){
        $scope.toggle['list'+(index)] = angular.copy(!$scope.toggle['list'+(index)]);
    }
    
    
    /* Method to show notification */
    function showBanner(message,status){
        banerData.message = message;
        banerData.banerClass = ($filter('lowercase')(status) === 'success') ? 'alert-success' : 'alert-danger';
        banerData.showBaner=true;
        $scope.alertBaner = angular.copy(banerData);
        $scope.$emit('emitFromdeleteBaner',{'alertBaner':banerData});
    }
    
    
    /* Method to initilize controller */
    function initializeController(){
        forumDataReq = {};
        $scope.validImage = [];$scope.invalidImage = []; $scope.uploadedImage = [];
        $scope.selectedIndex = {'tab':0};
        $scope.forum={cancelPicture: "dest/images/noimage.png"};
        localStorage.setItem('activetab',1);
        $scope.changeFormDisplay(true,false);
        $scope.noImage = templateURL+"dest/images/noimage.png";
        
        //Variables to match webservices
        forumServices ={
            forumList           : 'forum.forumTopicList',
            discussionDetails   : 'forum.forumDiscussionList',
            createForum         : 'forum.createForumTopic',
            addReply            : 'forum.createForumDiscussion',
            type                : 'listDetails',
            deleteForumTopic    : 'forum.forumTopicActions'
        };
        //Local task initialization
        localTask = "forum";
        iconTypesAllowed = ["jpg","jpeg","gif","png"];
        //$scope.tabs =["All","Teacher","Parent"];
        $scope.tabs =["All","My Forums"];
        getForumDetails();
        $scope.myId = encryptionService.decrypt(sessionService.get('userId'));
        $scope.roleType = encryptionService.decrypt(sessionService.get('role'));
        banerData = {message:'',showBaner:false,banerClass:''};  
        $scope.toggle = {};
    };
    initializeController();
        
    $scope.getImage = function(file) {
       var reader = new FileReader();
        reader.filename = file.name;
        reader.onload = function (e) {
            $scope.$apply(function ($scope) {
                $scope.validImage.push({"name":e.target.filename,"imgfile":e.target.result});
            });
        };
        reader.readAsDataURL(file);
        return $scope.validImage;
    };
   
    
}]);
advancePubapp.controller('groupAddEditController',['$scope','sfactory','$timeout','$rootScope','existgrouplist','$mdDialog','$filter', function($scope,sfactory, $timeout,$rootScope,existgrouplist,$mdDialog,$filter){
   
    /* Grupt */
    $scope.showDown = false;
    $scope.myCroppedImage = '';
    $scope.myImage = '';
    $scope.blockingObject = {
        block: true
    };
    $scope.hidepopup = function () {
        //location.reload();
        $scope.showDown = false;
    }
    $scope.renderimage = function () {
        $scope.blockingObject.render(function (dataURL) {
            $scope.dataURLsa = dataURL;
            $scope.upload(dataURL);
            if(dataURL.length)
            {$scope.showDown = false;}
        });
    }
    $scope.blockingObject.callback = function (dataURL) {
        
    }
    var handleFileSelect = function (evt) {
        $scope.showDown = true;
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {
                $scope.myImage = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
        
    };
    
    //Method for groupupdatecancel
    $scope.groupupdatecancel = function(){
        $scope.acc.data.groupadminname = $scope.acc.copydata.groupadminname;
        $scope.acc.data.groupicon_image = $scope.acc.copydata.groupicon_image;
        $scope.acc.data.groupname = $scope.acc.copydata.groupname;
        $mdDialog.hide();
    }
    /* Method callback for close the baner alert message */
    $scope.hideErrorMsg = function(){
		$scope.groupnameerror = true ;
        if(!angular.isUndefined($scope.alertBaner))
            if($scope.alertBaner.showBaner) $scope.alertBaner.showBaner = false;
    }
    /* Method to capture baner call back from child directives */
    $scope.$on('emitFromDirectiveBaner',function(event,args){
        //$scope.$emit('emitBaner',args);
        $scope.alertBaner = args.alertBaner;
        if(angular.isDefined(args.list)) $scope.listObj = args.list;
    })
    
    /* Method to capture baner call back from child directives */
    $scope.$on('emitFromErrorMsg',function(event,args){
        $scope.alertBaner = args.alertBaner;
     })
    
     $scope.validateGroupname = function(evnt){
        if(!angular.isUndefined($scope.acc.data.groupname)){
            var groupnameValidateDataReq={groupname : $scope.acc.data.orgname,groupid:$scope.acc.data.orgid};
             sfactory.serviceCall(JSON.stringify(groupnameValidateDataReq), 'organization.orgexistcheck','listDetails').then(function(response) {
				 if($filter('lowercase')(response.status) === 'success'){
					$scope.groupnameerror = false ;
				 }				 
                 else if($filter('lowercase')(response.status) === 'fail'){
					 $scope.groupnameerror = true ;
                     var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};   
                     $scope.$emit('emitFromErrorMsg',{'alertBaner':banerData});
                     angular.element(document.querySelector('#'+evnt.target.id)).focus();
                 }
                $rootScope.appLoader = false;
            }, function(error) {
          });   
        }
    };
    
    $scope.getadminRoles = function(){ 
		var groupReq = {'id': $scope.acc.data.orgid};   
        // var groupReq = {'id': '1'};     
        var task = "organization.orgadminlist";
        sfactory.serviceCall(JSON.stringify(groupReq),task,'listDetails').then(function(response){
            if(response.status.toLowerCase() == 'success'){
                $scope.groupAdminuser = response.data;
              	if(angular.isString($scope.acc.data.groupadmin)){
					var adminIds = $scope.acc.data.groupadmin.split(',');
				}else{
					$scope.acc.data.groupadmin = $scope.acc.data.groupadmin.toString();
					var adminIds = $scope.acc.data.groupadmin.split(',');
				}
				
				if(angular.isArray($scope.acc.data.groupadminname)){
					$scope.acc.data.groupadminname = $scope.acc.data.groupadminname;
				}else{
					if(angular.isNumber($scope.acc.data.groupadminname)){
						$scope.acc.data.groupadminname = $scope.acc.data.groupadminname.toString();
						$scope.acc.data.groupadminname = ($scope.acc.data.groupadminname && $scope.acc.data.groupadminname.split(' - ') ? $scope.acc.data.groupadminname.split(' - ') : null);
					}else{
						$scope.acc.data.groupadminname = ($scope.acc.data.groupadminname && $scope.acc.data.groupadminname.split(' - ') ? $scope.acc.data.groupadminname.split(' - ') : null);
					}
				}		
				setEmail(adminIds,$scope.groupAdminuser,'id');
            }
			$rootScope.appLoader = false;
        },function(error){
        });								 
	}
    
    //Method for user updation
    $scope.update_groupedit = function(body){  
		$scope.groupAdminids= [];
		_.each($scope.acc.data.groupadminname,function(item){
			var xx = _.where($scope.groupAdminuser,{'username':item});
			$scope.groupAdminids.push(xx[0].userid);
		});
        var editRequest = {groupadmin:$scope.groupAdminids,groupid:$scope.acc.data.id,groupname:$scope.acc.data.groupname};        
        var task = "groups.update_group";
        /*var formObj = new FormData(); 
        formObj.append('groupicon',$scope.profilepic);
        formObj.append('groupdata',JSON.stringify(editRequest));*/    
        var formToken = {'token':editRequest,'formObj':JSON.stringify({'croppedimage' : $scope.dataURLsa})}; 
        sfactory.serviceCallFormData(formToken,task,'listDetails').then(function(response){
             if(response.status.toLowerCase() == 'success'){
                 $scope.acc.data.groupadmin = $scope.groupAdminids.join();
                
                 if((typeof(response.data.groupicon_image) == "undefined")){
                     $scope.groupimage    =  $scope.acc.data.groupicon_image;  
                     $scope.groupimageurl =  $scope.acc.data.groupicon_url; 
                 }else{
                     $scope.acc.data.groupicon_url   = response.data.groupicon_url;
					 $scope.acc.data.groupicon_image = response.data.groupicon_image; 
                 }
				 $scope.existgrouplist		    = $scope.acc.data;		 
				 $mdDialog.hide(response);    
             }else{
                 var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
                 $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
             }
             $rootScope.appLoader = false;
        },function(error){
            
        });
    }
      
    //Method for set email
    function setEmail(childSource,parentSource,field){
		var emails = [];
		_.each(childSource,function(item){
			var xx = (field == 'id' ? _.where(parentSource,{'userid':item}) : _.where(parentSource,{'username':item}));
			if(angular.isDefined(xx[0])){
				if(xx[0].email){
					emails.push(xx[0].email);
					$scope.acc.data.email = emails.join(', ');
				}
			}
		});
	}
    
    /* Method to update email based on group admin selection */
	$scope.$watch('acc.data.groupadminname',function(newVal,oldVal){
		if(newVal && typeof(newVal) == "object" && newVal.length > 0 && $scope.groupAdminuser){
			setEmail(newVal,$scope.groupAdminuser,'name');
		}	
		else {
			if(angular.isDefined($scope.acc) && ($scope.acc.data.viewChild == "isEditable")){
				$scope.acc.data.email = "";
			}
		}
	});

    
    
    
    //Method for icon image upload
    $scope.iconimageupload = function(){
		setTimeout(function () {
		  angular.element('#picture').trigger('click');
		}, 0);
	};
    
     //Method for image upload
    $scope.upload = function(file) {
        $scope.profilepic = file;
        $scope.acc.data.groupicon_image      = file;
        $scope.acc.data.groupicon_smallimage = file;
       /* if(file){
            $scope.fileExt = file.name.split(".").pop();
            if($scope.fileExt == "jpg" || $scope.fileExt == "jpeg" || $scope.fileExt == "gif" || $scope.fileExt == "png"){
                $scope.profilepic = file;  
                $scope.acc.data.groupicon_image      = file.name;
                $scope.acc.data.groupicon_smallimage = file.name;
                $scope.imageextension      = false;
                $scope.group_picturecancel = 'dest/images/noimage.png';
            }else{
                $scope.imageextensionerror = "please choose valid file";
                $scope.imageextension      = true;
                $scope.profilepic          = "";
                $scope.acc.data.groupicon_smallimage = "";
                $scope.group_picturecancel = 'dest/images/noimage.png';
            }
            
        }else{
            $scope.imageextension      = false;
            $scope.group_picturecancel = {};
            $scope.group_picturecancel = $scope.profilepic.$ngfBlobUrl;
        }*/
    }

    //Method for initialize controller
   
	function initializeController(){
        $scope.existgrouplist = existgrouplist;
		$scope.acc = {};
    	$scope.acc.data = $scope.existgrouplist;
		$scope.acc.copydata = angular.copy($scope.existgrouplist);
        if( $scope.acc.data.viewChild == 'isEditable'){
            $scope.getadminRoles();
        }
        if(angular.isArray($scope.acc.data.groupadminname)){
			$scope.acc.data.groupadminnamelist = $scope.acc.data.groupadminname.join(', ');
		}else{
			$scope.acc.data.groupadminnamelist = $scope.acc.data.groupadminname;
		}
        if($scope.acc.data.groupicon_image == '' || (typeof($scope.acc.data.groupicon_image) == "noimage.png")){
			$scope.acc.data.groupicon_url   = 'dest/images';
			$scope.acc.data.groupicon_image = 'noimage.png';
			$scope.acc.data.groupicon_defaultimg = '';
		}else{
            $scope.acc.data.groupicon_defaultimg = $scope.acc.data.groupicon_smallimage;
        }
        
        setTimeout(function () {
		  angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
		});
	}
	
	//Method for initgroupcontroller
	 initializeController();  
}]);
advancePubapp.controller('groupmanagementController',['$scope','$http','sfactory','$rootScope','$filter','$timeout','$mdDialog','taskService', function($scope,$http,sfactory,$rootScope,$filter,$timeout,$mdDialog,taskService){ 

    $scope.closeRegisteration = function(response){
		$scope.isSingleuser = false;
	}

    /* Method to capture emitForCloseicon */
    $scope.$on('emitForClose',function(event,args){
        $scope.isSingleuser = false;
        $scope.showicon = args.showicon; 
    }); 
     
    /* Method to capture baner call back from child directives */
    $scope.$on('emitFromDirectiveBaner',function(event,args){
        $scope.alertBaner = args.alertBaner;
    })
     
    $scope.$on('emitFromdeleteBaner',function(event,args){
        $scope.alertBaner = args.alertBaner;
        initiateController(); 
    })
    
	/* Method to watch editableContent for update group name */
	$scope.$watch('editableContent',function(newVal,oldVal){
		$scope.group.groupname = newVal;
	});    
    
    //Add user animation     
    $scope.hoverIn = function(){
        this.hoverEdit = true;
    };

    $scope.hoverOut = function(){
        this.hoverEdit = false;
    };
    
     /* Method callback for close the baner alert message */
    $scope.closeBaner = function(){
        $scope.alertBaner.showBaner = false;
    }
    
    $scope.groupcancel = function(){
        //$scope.isSingleuser = false;
        $mdDialog.cancel();
        $scope.namegroupcreate = true;
        $scope.initGroupObj();
    }
    
    /* Method callback for close the baner alert message */
    $scope.hideErrorMsgUser = function(){
        if(!angular.isUndefined($scope.alertBaner))
            if($scope.alertBaner.showBanerUser) $scope.alertBaner.showBanerUser = false;
    }
    $scope.hideErrorMsgEmail = function(){
        if(!angular.isUndefined($scope.alertBaner))
            if($scope.alertBaner.showBanerEmail) $scope.alertBaner.showBanerEmail = false;
    }
    
    /* Method to capture baner call back from child directives */
    $scope.$on('emitFromErrorMsg',function(event,args){
         $scope.alertBaner = args.alertBaner;
      })
    
    //Method to check entered User name already exist or not
    $scope.valiateUsername = function(evnt){ 
       if($scope.group.username != "" && (!angular.isUndefined($scope.group.username))){
           var usernameValidateDataReq={username : $scope.group.username};
           var task = tasks.checkwithExistusername;
           sfactory.serviceCall(usernameValidateDataReq, task,'listDetails',true).then(function(response) {
             if($filter('lowercase')(response.status) === 'fail'){ 
                 var banerData = {'message':response.message,'showBanerUser':true,'banerClass':'alert-success'};   
                 $scope.$emit('emitFromErrorMsg',{'alertBaner':banerData});
                 angular.element(document.querySelector('#'+evnt.target.id)).focus();
             }
            $rootScope.appLoader = false;
        }, function(error) {
        });
       }
    };
    
    //Method to check entered emailId already exist or not
    $scope.validateEmail = function(evnt){ 
         if(_.isEmpty($scope.form.groupform.groupadd_email1.$error)){
            var emailValidateDataReq={email1 : $scope.group.email1,userId:""};
             var task = tasks.checkwithExistemail;
             sfactory.serviceCall(emailValidateDataReq, task,'listDetails',true).then(function(response) {
                 if($filter('lowercase')(response.status) === 'fail'){
                     var banerData = {'message':response.message,'showBanerEmail':true,'banerClass':'alert-success'};   
                     $scope.$emit('emitFromErrorMsg',{'alertBaner':banerData});
                     angular.element(document.querySelector('#'+evnt.target.id)).focus();
                 }
                $rootScope.appLoader = false;
            }, function(error) {
            });
            }
    };    
        
    /* Method callback for close the baner alert message */
    $scope.hideErrorMsgGrpnm = function(){
       if(!angular.isUndefined($scope.alertBaner))
            if($scope.alertBaner.showBanerGrpnm) $scope.alertBaner.showBanerGrpnm = false;
    }
    
    //Method to check entered groupname already exist or not
    $scope.validateGroupname = function(evnt){
         $rootScope.appLoader = false;
        if(!angular.isUndefined($scope.group.groupname)){
            var groupnameValidateDataReq={groupname : $scope.group.groupname,groupid:$scope.group.group_id};
            var task ="groups.groupnameexist"
             sfactory.serviceCall(JSON.stringify(groupnameValidateDataReq), task,'listDetails').then(function(response) {
                 if($filter('lowercase')(response.status) === 'fail'){
                     var banerData = {'message':response.message,'showBanerGrpnm':true,'banerClass':'alert-success'};   
                     $scope.$emit('emitFromErrorMsg',{'alertBaner':banerData});
                     angular.element(document.querySelector('#'+evnt.target.id)).focus();
                 }
                $rootScope.appLoader = false;
            }, function(error) {
          });   
        }
    };
    
    
    // Start group Name already is  there or not in table 
    $scope.group    = {groupname:''};
    $scope.creategroup = function(){
        $scope.groupname = $scope.group.groupname;
		$scope.editableContent = $scope.group.groupname;
        //return false;*/
        var task ="groups.groupnameexist"
        
        sfactory.serviceCall({groupname : $scope.group.groupname},task,'listDetails').then(function(response){
             if($filter('lowercase')(response.status) == 'success'){
                $scope.namegroupcreate = false;
            }else{
                 var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
                 $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
            }
			$rootScope.appLoader = false;
        },function(error){
        });  
    }
   
    /* Method to initialize group objects */
    $scope.initGroupObj = function(){ 
        $scope.group = {groupname:'',firstname:'',gender:'',dob:{day:'', month:'',year:''},email1:'',phone_no:'',lastname:'',username:''};
    }
    $scope.initGroupObj();
    //Start Form submit and user add
    
    $scope.createNewGroupUser = function(){ 

        var task = "groups.addNewGroup"; 
        sfactory.serviceCall($scope.group,task,'listDetails').then(function(response){          
            if($filter('lowercase')(response.status) == 'success'){
                $scope.group.id               = response.data.groupid;
                response.data.group_id        = response.data.groupid;
                response.data.id              = response.data.groupid;
				response.data.groupname       =   $scope.group.groupname;
				response.data.groupadmin      = response.data.groupadminid;
				response.data.groupadminname  = $scope.group.username;               
				response.data.email1           = $scope.group.email1;
				response.data.block           = true;  
				response.data.groupicon_image = '';               
				var groupscope = angular.element(jQuery("#adminLanding")).scope();
				if(angular.isDefined(groupscope.loggedUserDetails) && angular.isDefined(groupscope.loggedUserDetails.groupname)){
					groupscope.loggedUserDetails.groupname.push(response.data);
				}else{
					groupscope.loggedUserDetails.groupname = [];
					groupscope.loggedUserDetails.groupname.push(response.data);
				}
				
				$mdDialog.hide(response);
                $scope.$emit('emitForClose',{'isSingleuser':false,'isMultiuser':false,'showicon':true});
                $scope.initGroupObj();
                $scope.namegroupcreate = true;
            }else{
                $mdDialog.hide(response);
            }
           	$rootScope.appLoader = false;
            },function(error){
                
        });     
    }

    //method for initiate controller
    function initiateController(){
        $scope.namegroupcreate = true;
        $scope.currentYear = new Date().getFullYear();
        $scope.form = {};
        tasks = taskService.getTasks("groupmanagentController");
    }
	
	//method for initiate controller
	initiateController();
   
}]);    
advancePubapp.controller('messageModalController', ['$scope', 'sfactory', '$rootScope', 'taskService','$state','$mdDialog','dataToMessage','$filter',function($scope, sfactory, $rootScope, taskService,$state,$mdDialog,dataToMessage,$filter) {
    
    init();
    
    /* Method to initialize Controller */
    function init() {
        //templatepath = templateURL+"dest/templates/";
        $scope.validImage = [];$scope.invalidImage = []; $scope.uploadedImage = [];
        $scope.message = {};
        $scope.textangulartoolbar =[['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol','justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent','quote','insertLink'],[ 'wordcount', 'charcount']]; 
        $scope.modalMsgEditWordCount = false;
        $scope.messageCategory = ["message","mail","both"];
        //console.log("dataToMessage",dataToMessage);
    };
    $scope.sendMessage = function(){
        var formObj = new FormData(); 
        messageInput = {};
        if(dataToMessage.parentState == "user"){            
            messageInput = {"messageSubject":$scope.message.subject_text,"messageContent":$scope.message.message_text,"receiverUserId":[dataToMessage.userid],"messageType":"yes","messageCategory": $scope.message.compose_category};
        }else if(dataToMessage.parentState == "group"){            
            messageInput = {"messageSubject":$scope.message.subject_text,"messageContent":$scope.message.message_text,"receiverGroupId":[dataToMessage.groupId],"messageType":"yes","messageCategory": $scope.message.compose_category};
        }else if(dataToMessage.parentState == "class"){            
            messageInput = {"messageSubject":$scope.message.subject_text,"messageContent":$scope.message.message_text,"receiverClassId":[dataToMessage.classmasterid],"messageType":"yes","messageCategory": $scope.message.compose_category};
        }   
        
        //To append the file attachment
        _.each($scope.uploadedImage,function(item){
            formObj.append('mailAttachment[]',item);
       });
        var formToken = {'token':messageInput,'formObj':formObj};
        //console.log(messageInput);
        sfactory.serviceCallFormData(formToken,"messaging.composeAdminConversation",'listDetails').then(function(response) {            
            if($filter('lowercase')(response.status) == 'success'){
                //$mdDialog.cancel();                  
				 $mdDialog.hide(response);  
            }
            $rootScope.appLoader = false;
        }, function(error) {
            $mdDialog.cancel();
        });
    };
    //Changing the text format
    $scope.changeTextContentFormat = function(){
      if($scope.message.compose_category == 'message')  {
          $scope.message.message_text = String($scope.message.message_text).replace(/<[^>]+>/gm, '');
      }
    };
    /*$scope.msgeditoronoff = function(value){
        $scope.msgeditoron = value;
        if(!$scope.msgeditoron){
            $scope.message.message_text = $scope.message.message_text ? String($scope.message.message_text).replace(/<[^>]+>/gm, '') : "";
        }
    };*/
    $scope.customWordValidation = function(){        
      /*var wordCount = $scope.message.message_text ? $scope.message.message_text.split(' ').length : 0;
        if(wordCount > 50 ){
            $scope.modalMsgEditWordCount = true;
        }else{
            $scope.modalMsgEditWordCount = false;
        }  */
        $scope.modalMsgEditWordCount = false;
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
     /*  File Attachments for mail category */     
    $scope.upload = function(files) {
        $scope.validImage = [];$scope.invalidImage = []; $scope.uploadedImage = [];
        if(files){
            if (files.length < 20) {
            _.each(files, function(item){
            
                $scope.uploadedImage.push(item);
                //$scope.imageFileName.push({'name':item.name,'valid':true});
                $scope.getImage(item);
                          
            
            });
            }else{
             alert("Please select max 20 files.");
            return false;
          }
            
        }
    };
    
    $scope.removeImage = function(e,index){
       $(e.target).parent().remove();
        $scope.uploadedImage.splice(index,1);     
       // console.log(uploadedImage);
    }
    $scope.getImage = function(file) {
       var reader = new FileReader();
        reader.filename = file.name;
        reader.onload = function (e) {
            $scope.$apply(function ($scope) {
                $scope.validImage.push({"name":e.target.filename,"imgfile":e.target.result});
            });
        };
        reader.readAsDataURL(file);
        return $scope.validImage;
    };
}]);
advancePubapp.controller('messageNotificationController',['$scope','notificationdata','$mdToast', function($scope,notificationdata, $mdToast){
    //Method for assign data to scope
    $scope.messagenotification = notificationdata;
    //Method for show more notifications
    $scope.showmorenotification = function(){
        $scope.showmorenotification = 'showmorenotification';
        $mdToast.hide($scope.showmorenotification);
    }
    
    //Method for single click image notification
    $scope.singlemailnotification = function(notificationdata){
        $scope.notificationdata = notificationdata;
        $mdToast.hide($scope.notificationdata.messageId);
    }
}]);
advancePubapp.controller('modalclassparentController',['$scope','$http','$state','userassigntoparent','sfactory','$filter','$rootScope','$mdDialog',function($scope,$http,$state,userassigntoparent,sfactory,$filter,$rootScope,$mdDialog){
	
	//Method for cancel parent list
	$scope.parent_link_cancel = function() {
		if(angular.isDefined($scope.parentname)){
			$mdDialog.hide($scope.parentname);
		}else{
			$mdDialog.cancel();
		}
		
    };
	
	$scope.parentvalueupdate = function(event){
		$scope.parentname = (event.username.val == true)?event.username.username:"";
	}
	
	$scope.userassigntoparent = userassigntoparent;
	event.preventDefault();
	inputReq = {
		'userid'     : userassigntoparent.userid
	};
	var task = 'classes.parentList';
	sfactory.serviceCall(userassigntoparent, task,"listDetails").then(function(response) {
		if(angular.isDefined(response)){
			if($filter('lowercase')(response.status) == 'success'){
				$scope.tableDataParentLinktoUser.data = response.data;
			}
			$rootScope.appLoader = false;
		}
	}, function(error) { 
	  
	});	    
		
	//Method for initiate controller call
	function initiatemodalController(){
		$scope.tableDataParentLinktoUser = {
		pageName:'classeditparentlink',
		isFilterbtns: false,
		isSearch:false,
		isCheckboxhide:true,
		isPagination:true,
		sortType:'name',
		headers:[
			{name:'Name',bind_val:'name',isSortable:true},
			{name:'user name',bind_val:'username',isSortable:true},
			{name:'status',bind_val:'parentadd',isSortable:false,isActionColumn:true,columnName:"linktoparent",actionName:'classes.addParent',apiParams:{'userid':userassigntoparent.userid,'action':null,'parentid':null},'isParentlink':true},
		],  
		data:[]
		} 
	}	
	
	//Method for initiate controller
	initiatemodalController();
}]);
advancePubapp.controller('modalController',['$scope','$uibModalInstance','items', 'sfactory','reportService','$rootScope','$filter','$stateParams','$http', '$document','$timeout','sessionService','encryptionService',function ($scope,$uibModalInstance, items,sfactory,reportService,$rootScope,$filter,$stateParams,$http, $document,$timeout,sessionService,encryptionService) {
  
    var sourceData,dataRange,chartArray; 
    
    $scope.switchDateRange = function (selection) {
        var dateRange;
        switch (selection) {
            case 0:
                    dateRange=getLast7days();
                    break; 
            case 1:
                    dateRange=getThisMonthdays();
                    break;
            case 2:
                    dateRange=getLastMonthdays();
                    break; 
            case 3:
                    dateRange=getThisQuarterdays();
                    break;
            case 4:
                    dateRange=getYearToDateDays();
                    break;
            case 5:
                    dateRange=getYearDays();
                    break;
        }
        $scope.activeMenu = selection;         
        $scope.daterangecustompickmodal = dateRange.startDate+" To "+dateRange.endDate;
        updateChart(dateRange.startDate,dateRange.endDate);
    };
    
    $scope.changeSourceOfTraffic = function(){
        if($scope.dataSource){
            var trafficData = ($scope.chartData.traffic.byDevice) ? $scope.chartData.chartdata.by_device : $scope.chartData.chartdata.by_channel;            
            $scope.chartData.chartdata.change(reportService.loadPiechart(trafficData,"Source of Traffic"));
        }else{
            var trafficData = ($scope.chartData.traffic.byDevice) ? sourceData.chartdata.by_device : sourceData.chartdata.by_channel;
            $scope.chartData.chartdata.change(reportService.loadPiechart(trafficData,"Source of Traffic"));
        }        
    };
  
    $scope.ok = function () {
        $uibModalInstance.close('selectedData');
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
    $scope.saveChartObj = function(response){
        chartArray[0] = response;
    };
    
    $scope.export = function(download){
        reportService.exportCharts(chartArray,{type:download});
    };
    
    function updateChart(start_date,end_date){
        var modalanalyticsscope = angular.element(jQuery("#adminLanding")).scope();
        $scope.resportsessionid = angular.isDefined(modalanalyticsscope.loggedUserDetails.sessionId) ? modalanalyticsscope.loggedUserDetails.sessionId : "";
        
        var chartProperties = _.detect($scope.chartData.chartProperties, function(item){ 
            
        return item.chartTitle === $scope.chartData.chartdata.title;}); 
        dataRangeStr = JSON.stringify({
            start_date: start_date,
            end_date: end_date,
            program_id:($scope.chartData.reportsProgram === undefined) ? "" : $scope.chartData.reportsProgram,
            'group_id'  : encryptionService.decrypt(sessionService.get('grp_id')),            
            'user_id': encryptionService.decrypt(sessionService.get('userId'))
        });
        
        if($scope.chartData.chartType == "world"){ 
            liveTask = 'analyticsbygeography';
        }else{
            liveTask = chartProperties.taskUrl;
        }
        sfactory.serviceCallReports(dataRangeStr,liveTask).then(function(response) { 
             var data;
            if(angular.isDefined(response)){ 
                if($filter('lowercase')(response.status) == 'success'){ 
                    if($scope.chartData.chartType == "world"){                       
                        
                        $scope.chartData.chartdata.change(response.data.by_geo); 
                        $scope.chartData.chartdata.data = response.data.by_geo;
                        
                    }else{
                        if(chartProperties.type === 'pie'){
                            if(angular.isDefined(chartProperties.traffic)){ 
                                $scope.dataSource = true;
                                /*data = $scope.chartData.traffic.byDevice ? $scope.chartData.traffic.byDevice : $scope.chartData.traffic.byChannel;*/
								data = $scope.chartData.traffic.byDevice ? response.data.source_of_traffic.by_device : response.data.source_of_traffic.by_channel;
								$scope.chartData.chartdata.by_channel = response.data.source_of_traffic.by_channel;
                                $scope.chartData.chartdata.by_device = response.data.source_of_traffic.by_device;                                
                            }else{
                               data = response.data[chartProperties.key];
                            }                            
                            
                            /*data = angular.isDefined(chartProperties.traffic) ? ($scope.chartData.traffic.byDevice ? response.data.source_of_traffic.by_device : response.data.source_of_traffic.by_channel) : response.data[chartProperties.key];*/
                            $scope.chartData.chartdata.change(reportService.loadPiechart(data,chartProperties.chartTitle));
                        }
                        else{ 
                            if(chartProperties.key == 'user_visits' || chartProperties.key == 'conversion_ratio' || chartProperties.key == 'no_of_class' || chartProperties.key == 'no_students_enrolled_with_classes' || chartProperties.key == 'activityanalyse' || chartProperties.key == 'forums_discussions' || chartProperties.key == 'participants_forums_discussions' || chartProperties.key == 'social_shares' || chartProperties.key == 'social_shares_based_on_program' || chartProperties.key == 'social_shares_based_on_media_type' || chartProperties.key == 'most_visited'|| chartProperties.key == 'visitors_at_program_level'|| chartProperties.key == 'social_shares_based_on_program'|| chartProperties.key == 'badges_associated_witheach_program'|| chartProperties.key == 'average_timespent_on_each_program'|| chartProperties.key == 'most_consumed_program'||chartProperties.key == 'channel_triggered_users_visit' ||chartProperties.key == 'enrollment_at_program'||chartProperties.key == 'classes_at_program'||chartProperties.key == 'enrollement_based_on_textbook'){
                                $scope.chartData.chartdata.change(response.data[chartProperties.key]);
                            }
                            else{                       $scope.chartData.chartdata.change(reportService.updateChart(response.data[chartProperties.key],chartProperties.chartTitle,dateRange));
                            }
                       }
                    }           
                    
                    
                }
            }
           $rootScope.appLoader = false;		
          
        }, function(error) {
            var localTask = "updatedreportdata";
            sfactory.localService(localTask).then(function(response) {
                var data;
                if($scope.chartData.chartType == "world"){               
                        
                        $scope.chartData.chartdata.change(response.data.by_geo); 
                        $scope.chartData.chartdata.data = response.data.by_geo;
                        
                    }else{
                        if(chartProperties.type === 'pie'){  
                            data = angular.isDefined(chartProperties.traffic) ? ($scope.chartData.traffic.byDevice ? response.data.by_device : response.data.by_channel) : response.data[chartProperties.key];
                            $scope.chartData.chartdata.change(reportService.loadPiechart(data,chartProperties.chartTitle));
                        }
                        else{ 
                                if(chartProperties.key == 'user_visits' || chartProperties.key == 'conversion_ratio' || chartProperties.key == 'no_of_class' || chartProperties.key == 'no_students_enrolled_with_classes' || chartProperties.key == 'activityanalyse' || chartProperties.key == 'forums_discussions' || chartProperties.key == 'participants_forums_discussions' || chartProperties.key == 'social_shares' || chartProperties.key == 'social_shares_based_on_program' || chartProperties.key == 'social_shares_based_on_media_type'){
                                    $scope.chartData.chartdata.change(response.data[chartProperties.key]);
                                }
                                else{            
                                    $scope.chartData.chartdata.change(reportService.updateChart(response.data[chartProperties.key],chartProperties.chartTitle,dateRange));
                                }
                               }
                    }
                  
            }, function(error) {
            });
        }); 
    };
    
    function initiateController(){
        $scope.dataSource = false;
        $scope.chartData = angular.copy(items);
        chartArray=[];
        
        if(angular.isDefined(items.chartdata.by_channel)){
            sourceData = angular.copy(items);
            var trafficData = items.traffic.byDevice ? items.chartdata.by_device : items.chartdata.by_channel;
            $scope.chartData.chartdata = reportService.loadPiechart(trafficData,"Source of Traffic");
        }
        
        
        $scope.rangeSelection =['Last 7 Days','This Month','Last Month','This Quarter','This Year'];
        $scope.activeMenu = 0;
        $scope.daterangecustompickmodal = $scope.chartData.dateRange;
        $scope.dateoptions={
            "locale": {
              "format": "MM-DD-YYYY",
            },
            showDropdowns:true,
            autoApply:true,
            maxDate : new Date(),
            eventHandlers: {
                'apply.daterangepicker': function(ev, picker) { 
                    updateChart(ev.model.startDate.format('MM-DD-YYYY'),ev.model.endDate.format('MM-DD-YYYY'));                    
                }
            }
        };
        $scope.customView = true;
        var worlds = $scope.chartData.chartType;
               
    };
    $scope.downloadbtn = function(){
        $scope.isActive = !$scope.isActive;
    }
    $scope.closedownload = function(){
        $scope.isActive = false;
    };
    initiateController();
}]);
advancePubapp.controller('myprofileController',['$scope','sfactory','$rootScope','$filter','$state','sessionService','encryptionService','sharedService','taskService',function($scope,sfactory,$rootScope,$filter,$state,sessionService,encryptionService,sharedService,taskService){ 
    
    var tasks;
    
    $scope.update_adminprofile = function(){
        if($scope.studentProfile){
            password = ($scope.userdetails.new_password != '') ? encryptionService.encrypt($scope.userdetails.new_password) : "";
        }else{
            password = ($scope.userdetails.old_password != '' && $scope.passcheck) ? encryptionService.encrypt($scope.userdetails.new_password) : "";
        }
        
        var editRequest = {
            user_username:$scope.userdetails.username,
            firstname : $scope.userdetails.firstname,
            lastname  : $scope.userdetails.lastname,                                   
            user_id   : $scope.userdetails.userid,
            email     : $scope.userdetails.email,
            phoneno   : $scope.userdetails.phone_no,
            password  : password,
            address   : ($scope.userdetails.address ? $scope.userdetails.address : ''),
            dob: $scope.userdetails.dob,
			gender: $scope.userdetails.gender,
            userprofileimage : $scope.userdetails.updateprofileimageName,
            userprofileimagefile : $scope.userdetails.updateprofileimagePic,
			roleType : $scope.userRoleType
        }
        var task = "user.updateUserdetails";
        var formToken = {'token':editRequest,'formObj':JSON.stringify({'croppedimage' : $scope.dataURLsa})}; 
        sfactory.serviceCallFormData(formToken,task,"listDetails").then(function(response){            
            if($filter('lowercase')(response.status) == 'success'){				
                var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'}; 
				sessionService.set("menuIndex","0");
				if(response.data.profile_pic && response.data.profile_pic != '' && $scope.dataURLsa && !$scope.studentProfile){
					//set new one
					sessionService.set('profile_pic',response.data.profile_pic);
					sessionService.set('profile_picurl',response.data.profile_picurl);
					
					//get new one
					$scope.profile_pic = sessionService.get('profile_pic');
					$scope.profile_picurl = sessionService.get('profile_picurl');
					
					sharedService.profile_pic    = $scope.profile_pic;
					sharedService.profile_picurl = $scope.profile_picurl ;
                    
				}
                var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
                $scope.alertBaner = banerData;
            }
			$rootScope.appLoader = false;
        },function(error){
                var banerData = {'message':"User details has been updated successfully.!",'showBaner':true,'banerClass':'alert-success'};
                $scope.alertBaner = banerData;
                $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
                $scope.cacheServiceData.imageName = $scope.userdetails.updateprofileimageName;
                $scope.cacheServiceData.fullname = $scope.userdetails.firstname+","+$scope.userdetails.lastname;
        });
    } ;
    
    $scope.closeBaner = function(){
        $scope.alertBaner.showBaner = false;$scope.alertBaner.timeout = 0;
        $scope.updateuserprofilecancel();
    };
    
    /* Method to validate user email */
    $scope.validateEmail = function(){
		var dataRequest = {};
        $scope.myprofile.emailError = false;
        if(angular.isDefined($scope.userdetails.email) && ($scope.userdetails.email !== "")) {
			dataRequest = {email1:$scope.userdetails.email,userId:$scope.userdetails.userid};
            sfactory.serviceCall(dataRequest,tasks.validateEmail,"listDetails",true).then(function(response){
				if(angular.isDefined(response)){
					$scope.myprofile.emailError = !($filter('lowercase')(response.status) == 'success');
				}
            },function(){
            });
       }
    };
    
    $scope.updateuserprofilecancel = function(){
        $state.go(encryptionService.decrypt(sessionService.get('previousState')));   
    };
    
    /* Method for image upload */
    $scope.uploadedit = function(file) {
        if(file){
            $scope.fileExt = file.name.split(".").pop();
            if($scope.fileExt == "jpg" || $scope.fileExt == "jpeg" || $scope.fileExt == "gif" || $scope.fileExt == "png"){
                $scope.imageextensionerror = "";
                $scope.userdetails.updateprofileimagePic = file;  
                $scope.userdetails.updateprofileimage = file.name;
                $scope.userdetails.updateprofileimageName = file.name;
                $scope.userdetails.userdetailspicturecancel = 'dest/images/no_image.png';
                $scope.imageextension      = false;
            }else{
                $scope.imageextensionerror = "please choose valid file";
                $scope.imageextension      = true;
                $scope.userdetails.updateprofileimagePic = "";
                $scope.userdetails.updateprofileimageName = "";
                $scope.userdetails.userdetailspicturecancel = 'dest/images/no_image.png';
            }
            
        }else{
            $scope.imageextension      = false;
            $scope.userdetails.userdetailspicturecancel = {};
            $scope.userdetails.userdetailspicturecancel = $scope.userdetails.updateprofileimagePic.$ngfBlobUrl;
        }
    };
    
    $scope.oldpasswordcheck = function(){
        params = {"old_password": encryptionService.encrypt($scope.userdetails.old_password)};
        sfactory.serviceCall(JSON.stringify(params),"user.passwordValidCheck","listDetails").then(function(response){
            if($filter('lowercase')(response.status) == 'success'){
                $scope.passcheck = true;                
                $rootScope.appLoader = false;
            }else{
                $scope.passcheck = false;                
                $rootScope.appLoader = false;
            }            
        },function(){
            $scope.passcheck = true; 
        });
    };
    
    /* On New password change check same as old */
    $scope.newpasswordcheck = function(){
        params = {"old_password": encryptionService.encrypt($scope.userdetails.new_password)};
        sfactory.serviceCall(JSON.stringify(params),"user.passwordValidCheck","listDetails").then(function(response){
            if($filter('lowercase')(response.status) == 'success'){
                $scope.newpasscheck = false;                
                $rootScope.appLoader = false;
            }else{
                $scope.newpasscheck = true;                
                $rootScope.appLoader = false;
            }            
        },function(){
            $scope.newpasscheck = true; 
        });
    };
    
    $scope.reset_pwd = function(){
        $scope.shwpwddiv = !$scope.shwpwddiv;
        $scope.reset_pwd_visible = !$scope.reset_pwd_visible;
        $scope.userdetails.old_password = "";
        $scope.userdetails.new_password = "";
    };
    
    $scope.blockingObject = {
        block: true
    };
    
    $scope.hidepopup = function () {
        $scope.showDown = false;
    };
    
    $scope.renderimage = function () {
        $scope.blockingObject.render(function (dataURL) {
            $scope.dataURLsa = dataURL;
            
            if(dataURL.length)
            {$scope.showDown = false;}
        });
    };

    var handleFileSelect = function (evt) {
        $scope.showDown = true;
        var file = evt.currentTarget.files[0];
        if(file){
            fileExt = file.name.split(".").pop();
            if(fileExt == "jpg" || fileExt == "jpeg" || fileExt == "gif" || fileExt == "png"){
                var reader = new FileReader();
                reader.onload = function (evt) {
                    $scope.$apply(function ($scope) {
                        $scope.myImage = evt.target.result;
                    });
                };
                reader.readAsDataURL(file);
            }else{
                $scope.hidepopup();
                var banerData = {message:"Please choose valid image",showBaner:true,banerClass:'alert-danger'};  
                $scope.alertBaner = banerData;
                $scope.$apply();
            }        
        }
    };
    
    function initiateController(){
        tasks = taskService.getTasks("myProfileController");
        $scope.$emit('selectedTab',{'index':-1});
        $scope.templatepath = templateURL ? templateURL : '';
        $scope.cacheServiceData = sharedService;
        $scope.alertBaner;
        $scope.userdetails = myprofile = {};
        $scope.myprofile = {emailError:false};
        $scope.reset_pwd_visible = false;       
        $scope.currentYear = new Date().getFullYear();        
        $scope.userRoleType = sessionService.get('role');
        $scope.passcheck = true; 
        $scope.newpasscheck = true; 
        $scope.showDown = false;
        $scope.myCroppedImage = '';
        $scope.myImage = '';
        $scope.studentProfile = false;
        $scope.emailError ='';
        $scope.isMyProfile = angular.isUndefined($scope.selection);
        var isStudentAndNotSelfsigned = (angular.lowercase(sessionService.get('role')) === 'student') && (sessionService.get('isselfassigned') === "false");
        $scope.isStudentAndSelfsigned = !$scope.isMyProfile;
        $scope.isDisableFields  = false;
        
        angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);

        if(sfactory.bufferedData.types == "student"){ 
            $scope.userdetails = sfactory.bufferedData.studentProfile; //for student profile, if user comes from student profile page
            $scope.userdetails.userid  = $scope.userdetails.id;
            $scope.studentProfile = true;
            if($scope.userdetails.profile_pic != ""){
                $scope.profileimage = $scope.userdetails.profile_picurl+$scope.userdetails.profile_pic;
                $scope.userdetails.updateprofileimageName = $scope.userdetails.profile_picurl+$scope.userdetails.profile_pic;
            }else{
                $scope.profileimage = templateURL+'dest/images/no_image.png';
                $scope.userdetails.updateprofileimageName = "No Image";
            }
             _.each($scope.userdetails, function(item){
                    $scope.userdetails.roleName = "Student";
             });
            return;
        }else{
            sfactory.serviceCall(myprofile,"user.admin_settings","listDetails").then(function(response){
                if($filter('lowercase')(response.status) == 'success'){
                    $scope.userdetails = response.data;
                    $scope.userdetails.old_password = "";
                    if($scope.userdetails.profile_pic != ""){
                        if($scope.userdetails.profilepic.type == 'others'){
                            $scope.profileimage = $scope.userdetails.profilepic.url+$scope.userdetails.profilepic.name;
                            $scope.userdetails.updateprofileimageName = $scope.userdetails.profilepic.name;
                        }else{
                            $scope.userdetails.updateprofileimageName = $scope.userdetails.profilepic.name;
                        }

                    }else{
                        $scope.profileimage = templateURL+'dest/images/no_image.png';
                        $scope.userdetails.updateprofileimageName = "No Image";
                    }
                    $rootScope.appLoader = false;
                }            
            },function(){
                sfactory.localService("usereditprofile").then(function(response) {
                    $scope.userdetails = response.data.data;
                    $scope.userdetails.old_password = "";
                    if($scope.userdetails.profile_pic != ""){
                        $scope.profileimage = $scope.userdetails.profilepic.url+$scope.userdetails.profilepic.name;
                        $scope.userdetails.updateprofileimageName = $scope.userdetails.profilepic.name;
                    }else{
                        $scope.profileimage = 'dest/images/no_image.png';
                        $scope.userdetails.updateprofileimageName = "No Image";
                    }

                }, function(error) {
                });
            });
        }

    //$scope.dashboard.breadCrumbList =["My Profile"];   
    };
    initiateController();
}]);
advancePubapp.controller('numbersuccessController',['$scope', 'sfactory','$uibModal','$rootScope','$filter','$log','sessionService','encryptionService', function($scope,sfactory,$uibModal,$rootScope,$filter,$log,sessionService,encryptionService) {
    var reportDataReq; 
    
    //Method  for number success report
    function numbersuccessreport(reportDataReq){
    var task = 'programreportsind';
        inputreq = JSON.stringify(reportDataReq);
        sfactory.serviceCallReports(inputreq, task).then(function(response) {
        if(angular.isDefined(response)){
            if($filter('lowercase')(response.status) == 'success'){
                $scope.tableData.data =response.data.program_report;
                $scope.numbersuccess.overall = response.data.users_at_program;
                $rootScope.appLoader = false;
            }else{
                $rootScope.appLoader = false;
            }	
        }
        }, function(error) {
            var localTask = "numbersuccessreports";
                sfactory.localService(localTask).then(function(response) {
                $scope.tableData.data =response.data.data.program_report;
                $scope.numbersuccess.overall = response.data.data.users_at_program;
            }, function(error) {
            });
        });
    }
    
    //Method for number success analytics
    $scope.getnumberSuccessAnalyticsData = function(){
        var task = 'programanalyticsind';
        inputreq = JSON.stringify(reportDataReq);
        sfactory.serviceCallReports(inputreq, task).then(function(response) {
            console.log(response);
            if(angular.isDefined(response.data)){
                $scope.numbersuccess.number= response.data;                
                $rootScope.appLoader = false;
            }
        }, function(error) {
        var localTask = "numbersuccessreports";
            sfactory.localService(localTask).then(function(response) {
                $scope.numbersuccess.number= response.data.analyticsdata;
            }, function(error) {
            });
        });
    }
    
     /* Method to show filter modal */
    $scope.chartModal = function(size, chartType, data, chartHeader,traffic) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'dest/templates/chartsModal.html',
            controller: 'modalController',
            size: size,
            resolve: {
                items: function() {
                    return {
                        chartType: chartType,
                        chartdata: data,
                        header: chartHeader, 
                        traffic:traffic,
                        dateRange:$scope.daterangecustompick,
                        chartProperties:chartProperties,
                        reportsProgram: "Number Success"
                    };
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    
      /*Method for update data based on calender*/
    function updateCharts(start_date,end_date){
          var requestData = JSON.stringify({
                'start_date': start_date,
                'end_date': end_date,
                'program_id': "Number Success",
                'group_id'  : reportDataReq.group_id,
                'user_id': reportDataReq.user_id
        });
        sfactory.serviceCallReports(requestData, 'numbersuccessanalytics').then(function(response) {
			if(angular.isDefined(response)){
				if($filter('lowercase')(response.status) == 'success'){
					$scope.numbersuccess.number.most_visited.change(response.data.most_visited);
                    $scope.numbersuccess.number.most_visited.x = (response.data.most_visited.x);
					$scope.numbersuccess.number.classes_at_program.change(response.data.classes_at_program);  
                    $scope.numbersuccess.number.classes_at_program.x = (response.data.classes_at_program.x);
					$scope.numbersuccess.number.enrollment_at_program.change(response.data.enrollment_at_program);
                    $scope.numbersuccess.number.enrollment_at_program.x = (response.data.enrollment_at_program.x);
                    
                    $scope.numbersuccess.number.enrollement_based_on_textbook.change(response.data.enrollement_based_on_textbook);                    
					$rootScope.appLoader = false;
				}
			 }	
        }, function(error) {
        var localTask = "numbersuccessanalytics";
        sfactory.localService(localTask).then(function(response) {
            $scope.numbersuccess.number.most_visited.change(response.data.most_visited);
            $scope.numbersuccess.number.classes_at_program.change(response.data.classes_at_program);            
            $scope.numbersuccess.number.enrollment_at_program.change(response.data.enrollment_at_program); 
            $scope.numbersuccess.number.enrollement_based_on_textbook.change(response.data.enrollement_based_on_textbook); 
            }, function(error) {
            });
        });
    }

    //Method for activities download
   $scope.numbersuccessdownload = function(task){
        userId  = reportDataReq.user_id;
        groupId = reportDataReq.group_id;
         if($scope.startDate && $scope.endDate){
            var start = new Date($scope.startDate).getFullYear()+"-"+(Number(new Date($scope.startDate).getMonth())+1)+"-"+new Date($scope.startDate).getDate();
            var end = new Date($scope.endDate).getFullYear()+"-"+(Number(new Date($scope.endDate).getMonth())+1)+"-"+new Date($scope.endDate).getDate();
            window.location = appUrl+task+"?start_date="+start+"&end_date="+end+"&program_id=Number Success"+"&user_id="+userId+"&group_id="+groupId+"&csv=1";
        }
        else{
            window.location = appUrl+task+"?program_id=Number Success"+"&user_id="+userId+"&group_id="+groupId+"&csv=1";
        }
    }
    $scope.downloadbtn = function(){
        $scope.isActive_down = !$scope.isActive_down;
    }
    $scope.closedownload = function(){
        $scope.isActive_down = false;
    };
    $scope.reportdownloadbtn = function(){
        $scope.isActive_downreport = !$scope.isActive_downreport;
    }
    $scope.reportclosedownload = function(){
        $scope.isActive_downreport = false;
    };
    $scope.saveChartObj = function(response){
        var chartObject =_.find(chartArray, function(obj){ return obj.title.textStr  == response.title.textStr;});
        if(angular.isDefined(chartObject)){
            chartArray[chartArray.findIndex(x => x.title.textStr === response.title.textStr)] = response;
        }
        else{
            chartArray.push(response);
        }
    };
    
    $scope.export = function(download){
        reportService.exportCharts(chartArray,{type:download});
    };
	 //Method for initilize controller
    function initilizenumbersuccess(){
        reportDataReq = {
            'program_id': "Number Success",
            'group_id'  : encryptionService.decrypt(sessionService.get('grp_id')),            
            'user_id': encryptionService.decrypt(sessionService.get('userId'))
        };
        numbersuccessreport(reportDataReq);
        $scope.numbersuccess = {};
        $scope.numbersuccess.vmDate = Last7Days().split(',')[Last7Days().split(',').length-1]+" To "+Last7Days().split(',')[0];
            $scope.tableData = {
            pageName: 'numbersuccesstable',
            isFilterbtns: false,
            isSearch: true,
            isPagination: true,
            sortType: '',
            isCheckboxhide: true,
            headers: [{name: 'Course',bind_val: 'label',isSortable: true},
                {name: 'No of enrolled users',bind_val: 'no_of_enrolled_users',isSortable: true},
                {name: 'no of Activity',bind_val: 'no_of_activities',isSortable: true},
                {name: 'no of Student Completed Course',bind_val: 'no_of_students_completed',isSortable: true},
                {name: 'no of visit',bind_val: 'no_of_visits',isSortable: true},
                {name: 'no of shares',bind_val: 'no_of_shares',isSortable: true},
                {name: 'Time spent',bind_val: 'time_spent',isSortable: true},                
            ],
            data: []
        };
        $scope.daterangecustompick = $scope.numbersuccess.vmDate;
        $scope.dateoptions={
            "locale": {
              "format": "MM-DD-YYYY",
            },
            showDropdowns:true,
            autoApply:true,
            maxDate : new Date(),
            eventHandlers: {
                'apply.daterangepicker': function(ev, picker) { 
                    $scope.daterangecustompick = ev.model.startDate.format('MM-DD-YYYY')+ ' To '+ev.model.endDate.format('MM-DD-YYYY');
                    updateCharts(ev.model.startDate.format('MM-DD-YYYY'),ev.model.endDate.format('MM-DD-YYYY'));                    
                }
            }
        };
		
		    chartProperties=[
            {
                chartTitle:"Number Success- User visits",
                taskUrl :"uservisitbyprogram",
                key:"most_visited",
                type:"line"
            },
            {
                chartTitle:"Classes at Number Success",
                taskUrl :"classesatprogram",
                key:"classes_at_program",
                type:"line"
            },
            {
                chartTitle:"Enrollment at Number Success",
                taskUrl :"enrolledatprogram",
                key:"enrollment_at_program",
                type:"line"
            }, 
            {
                chartTitle:"Enrollement Based On Textbook",
                taskUrl :"enrollementbasedontextbook",
                key:"enrollement_based_on_textbook",
                type:"bar"
            }
        ];
    }    
    initilizenumbersuccess();
}]);
advancePubapp.controller('phonicsadventureController',['$scope', 'sfactory','$uibModal','$rootScope','$filter','$log','$stateParams','reportService','sessionService','encryptionService', function($scope,sfactory,$uibModal,$rootScope,$filter,$log,$stateParams,reportService,sessionService,encryptionService) {
    var reportDataReq,chartArray; 
    
    //Method  for phonic adventure report
    function phonicadventurereport(reportDataReq){
        var task = 'programreportsind';
        inputreq = JSON.stringify(reportDataReq);
        sfactory.serviceCallReports(inputreq, task).then(function(response) {
        if(angular.isDefined(response)){
            if($filter('lowercase')(response.status) == 'success'){
                $scope.tableData.data =response.data.program_report;
                $scope.phonicadventure.overall = response.data.users_at_program;
                $rootScope.appLoader = false;
            }else{
                $rootScope.appLoader = false;
            }	
        }
        }, function(error) {
            var localTask = "phonicadventurereports";
                sfactory.localService(localTask).then(function(response) {
                $scope.tableData.data =response.data.data.program_report;
                $scope.phonicadventure.overall = response.data.data.users_at_program;
            }, function(error) {
            });
        });
    }
    
    //Method for phonic adventure analytics
    $scope.getphonicAnalyticsData = function(){
        inputreq = JSON.stringify(reportDataReq);
        var task = 'programanalyticsind';
        sfactory.serviceCallReports(inputreq, task).then(function(response) {            
            if(angular.isDefined(response.data)){
                $scope.phonicadventure.phonics= response.data;
                $rootScope.appLoader = false;
            }
        }, function(error) {
        var localTask = "phonicadventurereports";
            sfactory.localService(localTask).then(function(response) {                
                $scope.phonicadventure.phonics= response.data.analyticsdata;
            }, function(error) {
            });
        });
    }
    
     /* Method to show filter modal */
    $scope.chartModal = function(size, chartType, data, chartHeader,traffic) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'dest/templates/chartsModal.html',
            controller: 'modalController',
            size: size,
            resolve: {
                items: function() {
                    return {
                        chartType: chartType,
                        chartdata: data,
                        header: chartHeader, 
                        traffic:traffic,
                        dateRange:$scope.daterangecustompick,
                        chartProperties:chartProperties,
                        reportsProgram: "Phonics Adventure"
                    };
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    
      /*Method for update data based on calender*/
    function updateCharts(start_date,end_date){
          var requestData = JSON.stringify({
                'start_date': start_date,
                'end_date': end_date,                
                'program_id': "Phonics Adventure",
                'group_id'  : reportDataReq.group_id,
                'user_id': reportDataReq.user_id
        });
        sfactory.serviceCallReports(requestData, 'programanalyticsind').then(function(response) {
			if(angular.isDefined(response)){
				if($filter('lowercase')(response.status) == 'success'){
					$scope.phonicadventure.phonics.most_visited.change(response.data.most_visited);
                    $scope.phonicadventure.phonics.most_visited.x = (response.data.most_visited.x);
                    $scope.phonicadventure.phonics.classes_at_program.change(response.data.classes_at_program); 
                    $scope.phonicadventure.phonics.classes_at_program.x = (response.data.classes_at_program.x);
                    $scope.phonicadventure.phonics.enrollment_at_program.change(response.data.enrollment_at_program); 
                    $scope.phonicadventure.phonics.enrollment_at_program.x = (response.data.enrollment_at_program.x);
                    
                    $scope.phonicadventure.phonics.enrollement_based_on_textbook.change(response.data.enrollement_based_on_textbook); 
					$rootScope.appLoader = false;
				}
			 }	
        }, function(error) {
        var localTask = "phonicadventurereports";
        sfactory.localService(localTask).then(function(response) {
            $scope.phonicadventure.phonics.most_visited.change(response.data.analyticsdata.most_visited);
            $scope.phonicadventure.phonics.classes_at_program.change(response.data.analyticsdata.classes_at_program);                                   
            $scope.phonicadventure.phonics.enrollment_at_program.change(response.data.analyticsdata.enrollment_at_program);            
            $scope.phonicadventure.phonics.enrollement_based_on_textbook.change(response.data.analyticsdata.enrollement_based_on_textbook);  
            }, function(error) {
            });
        });
    }

    //Method for activities download
    $scope.phonicadventuredownload = function(task){
        userId  = reportDataReq.user_id;
        groupId = reportDataReq.group_id; //encryptionService.decrypt(reportDataReq.group_id);
         if($scope.startDate && $scope.endDate){
            var start = new Date($scope.startDate).getFullYear()+"-"+(Number(new Date($scope.startDate).getMonth())+1)+"-"+new Date($scope.startDate).getDate();
            var end = new Date($scope.endDate).getFullYear()+"-"+(Number(new Date($scope.endDate).getMonth())+1)+"-"+new Date($scope.endDate).getDate();
            window.location = appUrl+task+"?start_date="+start+"&end_date="+end+"&program_id=Phonics Adventure"+"&user_id="+userId+"&group_id="+groupId+"&csv=1";
        }
        else{
            window.location = appUrl+task+"?program_id=Phonics Adventure"+"&user_id="+userId+"&group_id="+groupId+"&csv=1";
        }
    }
    $scope.downloadbtn = function(){
        $scope.isActive_down = !$scope.isActive_down;
    }
    $scope.closedownload = function(){
        $scope.isActive_down = false;
    };
    $scope.reportdownloadbtn = function(){
        $scope.isActive_downreport = !$scope.isActive_downreport;
    }
    $scope.reportclosedownload = function(){
        $scope.isActive_downreport = false;
    };
    $scope.saveChartObj = function(response){
        var chartObject =_.find(chartArray, function(obj){ return obj.title.textStr  == response.title.textStr;});
        if(angular.isDefined(chartObject)){
            chartArray[chartArray.findIndex(x => x.title.textStr === response.title.textStr)] = response;
        }
        else{
            chartArray.push(response);
        }
    };
    
    $scope.export = function(download){
        reportService.exportCharts(chartArray,{type:download});
    };
    
	 //Method for initilize controller
    function initilizephonicsadventure(){
        var phonicsreportscope = angular.element(jQuery("#adminLanding")).scope();
        
        reportDataReq = {
            'program_id': "Phonics Adventure",
            'group_id'  : encryptionService.decrypt(sessionService.get('grp_id')),
            'user_id': encryptionService.decrypt(sessionService.get('userId'))           
        };
        phonicadventurereport(reportDataReq);
        $scope.phonicadventure = {};chartArray=[];
        $scope.phonicadventure.vmDate = Last7Days().split(',')[Last7Days().split(',').length-1]+" To "+Last7Days().split(',')[0];
        $scope.tableData = {
            pageName: 'phonicsreportstable',
            isFilterbtns: false,
            isSearch: true,
            isPagination: true,
            sortType: '',
            isCheckboxhide: true,
            headers: [{name: 'Course',bind_val: 'label',isSortable: true},
                {name: 'No of enrolled users',bind_val: 'no_of_enrolled_users',isSortable: true},
                {name: 'no of Activity',bind_val: 'no_of_activities',isSortable: true},
                {name: 'no of Student Completed Course',bind_val: 'no_of_students_completed',isSortable: true},
                {name: 'no of visit',bind_val: 'no_of_visits',isSortable: true},
                {name: 'no of shares',bind_val: 'no_of_shares',isSortable: true},
                {name: 'Time spent',bind_val: 'time_spent',isSortable: true},                
            ],
            data: []
        };
        
        $scope.daterangecustompick = $scope.phonicadventure.vmDate;
        $scope.dateoptions={
            "locale": {
              "format": "MM-DD-YYYY",
            },
            showDropdowns:true,
            autoApply:true,
            maxDate : new Date(),
            eventHandlers: {
                'apply.daterangepicker': function(ev, picker) {
                    $scope.daterangecustompick = ev.model.startDate.format('MM-DD-YYYY')+ ' To '+ev.model.endDate.format('MM-DD-YYYY');
                    updateCharts(ev.model.startDate.format('MM-DD-YYYY'),ev.model.endDate.format('MM-DD-YYYY'));                    
                }
            }
        };
		
		    chartProperties=[
            {
                chartTitle:"Phonics Adventure- User visits",
                taskUrl :"uservisitbyprogram",
                key:"most_visited",
                type:"line"
            },
            {
                chartTitle:"Classes at Phonics Adventure",
                taskUrl :"classesatprogram",
                key:"classes_at_program",
                type:"line"
            },
            {
                chartTitle:"Enrollment at Phonics Adventure",
                taskUrl :"enrolledatprogram",
                key:"enrollment_at_program",
                type:"line"
            }, 
            {
                chartTitle:"Enrollement Based On Textbook",
                taskUrl :"enrollementbasedontextbook",
                key:"enrollement_based_on_textbook",
                type:"bar"
            }
        ];
    }
    initilizephonicsadventure();
}]);
advancePubapp.controller('profilePicController',['$scope','sfactory', function($scope,sfactory){
}]);
advancePubapp.controller('programanalyticsController',['$scope', 'sfactory','$uibModal','$rootScope','$filter','$log', function($scope,sfactory,$uibModal,$rootScope,$filter,$log) {
    var reportDataReq; 
    
    //Method  for program adventure report
    function programanalyticsreport(){
    var task = 'programanalyticsreports';
        sfactory.serviceCallReports(reportDataReq, task).then(function(response) {
        if(angular.isDefined(response)){
            if($filter('lowercase')(response.status) == 'success'){
                $scope.tableData.data =response.data.data;
                $rootScope.appLoader = false;
            }else{
                $rootScope.appLoader = false;
            }	
        }
        }, function(error) {
            var localTask = "programanalyticsreports";
                sfactory.localService(localTask).then(function(response) {
                $scope.tableData.data =response.data.data;
            }, function(error) {
            });
        });
    }
    
    //Method for program analytics
    $scope.getprogramAnalyticsData = function(){
        var task = 'programanalyticsreports';
        sfactory.serviceCallReports(reportDataReq, 'activityanalytics').then(function(response) {
            console.log(response);
            if(angular.isDefined(response.data)){
                $scope.programanalytics.program= response.data;
                $rootScope.appLoader = false;
            }
        }, function(error) {
        var localTask = "programanalyticsreports";
            sfactory.localService(localTask).then(function(response) {
                $scope.programanalytics.program= response.data;
            }, function(error) {
            });
        });
    }
    
     /* Method to show filter modal */
    $scope.chartModal = function(size, chartType, data, chartHeader,traffic) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'dest/templates/chartsModal.html',
            controller: 'modalController',
            size: size,
            resolve: {
                items: function() {
                    return {
                        chartType: chartType,
                        chartdata: data,
                        header: chartHeader, 
                        traffic:traffic,
                        dateRange:$scope.programanalytics.vmDate,
                        chartProperties:chartProperties
                    };
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    
      /*Method for update data based on calender*/
    $scope.updateCharts = function(dateRange){
          var requestData = JSON.stringify({
                'start_date': new Date(dateRange.startDate).getFullYear()+"-"+(new Date(dateRange.startDate).getMonth()+1)+"-"+new Date(dateRange.startDate).getDate(),
                'end_date': new Date(dateRange.endDate).getFullYear()+"-"+(new Date(dateRange.endDate).getMonth()+1)+"-"+new Date(dateRange.endDate).getDate(),
                'groupid'  :(window.loggedGroup === undefined) ? "" : window.loggedGroup.group_id, 'sessionId': $scope.resportsessionid
        });
        sfactory.serviceCallReports(requestData, 'programanalytics').then(function(response) {
			if(angular.isDefined(response)){
				if($filter('lowercase')(response.status) == 'success'){
					$scope.programanalytics.activity.activityanalyse.change(response.data.activityanalyse);
					$scope.programanalytics.activity.forums_discussions.change(response.data.forums_discussions);            
					$scope.programanalytics.activity.participants_forums_discussions.change(response.data.participants_forums_discussions); 
					$rootScope.appLoader = false;
				}
			 }	
        }, function(error) {
        var localTask = "programanalyticsreports";
        sfactory.localService(localTask).then(function(response) {
            $scope.programanalytics.program.average_timespent.change(response.data.average_timespent);
            $scope.programanalytics.program.badges_associated_witheach_program.change(response.data.badges_associated_witheach_program);            
            $scope.programanalytics.program.most_consumed_program.change(response.data.most_consumed_program);            
            $scope.programanalytics.program.mostvisited_program.change(response.data.mostvisited_program);            
            $scope.programanalytics.program.social_share_based_program.change(response.data.social_share_based_program);            
            $scope.programanalytics.program.visitors_of_program.change(response.data.visitors_of_program);            
            }, function(error) {
            });
        });
    }
        
    //Method for activities download
   /* $scope.programanalyticsdownload = function(task){
         if($scope.startDate && $scope.endDate){
            var start = new Date($scope.startDate).getFullYear()+"-"+(Number(new Date($scope.startDate).getMonth())+1)+"-"+new Date($scope.startDate).getDate();
            var end = new Date($scope.endDate).getFullYear()+"-"+(Number(new Date($scope.endDate).getMonth())+1)+"-"+new Date($scope.endDate).getDate();
            window.location = appUrl+task+"?start_date="+start+"&end_date="+end+"&groupid="+window.loggedGroup.group_id+"&sessionId="+$scope.resportsessionid;
        }
        else{
            window.location = appUrl+task+"?sessionId="+$scope.resportsessionid+"&groupid="+window.loggedGroup.group_id;
        }
    }*/
    
	 //Method for initilize controller
    function initilizeprogramanalytics(){
        programanalyticsreport();
        $scope.programanalytics = {};
        $scope.programanalytics.vmDate = Last7Days().split(',')[Last7Days().split(',').length-1]+" To "+Last7Days().split(',')[0];
            $scope.tableData = {
            pageName: 'programanalytics',
            isFilterbtns: false,
            isSearch: true,
            isPagination: true,
            sortType: '',
            isCheckboxhide: true,
            headers: [{name: 'Course',bind_val: 'course',isSortable: true},
                {name: 'No of enrolled users',bind_val: 'numberofenrolleduser',isSortable: true},
                {name: 'no of Activity',bind_val: 'no_of_activity',isSortable: true},
                {name: 'no of Student Completed Course',bind_val: 'no_of_student_course',isSortable: true},
                {name: 'no of visit',bind_val: 'no_of_visit',isSortable: true},
                {name: 'no of shares',bind_val: 'no_of_share',isSortable: true},
                {name: 'Time spent',bind_val: 'time_spent',isSortable: true},
                {name: 'Date Created',bind_val: 'date',isSortable: true}
            ],
            data: []
        };
        
            chartProperties=[
            {
                chartTitle:"Most visited Program",
                taskUrl :"phonicsmostvistedprogram",
                key:"mostvisited_program",
                type:"line"
            },
            {
                chartTitle:"Visitors at program level",
                taskUrl :"phonicsvistedprogramlevel",
                key:"visitors_of_program",
                type:"bar"
            },
            {
                chartTitle:"Social Share Based On Program",
                taskUrl :"phonicssocialprogram",
                key:"social_share_based_program",
                type:"bar"
            }, 
            {
                chartTitle:"Badges Associated with each program",
                taskUrl :"phonicsbadgesassociatedwithprogram",
                key:"badges_associated_witheach_program",
                type:"bar"
            },
            {
                chartTitle:"Average time spent on each program",
                taskUrl :"phonicsaveragetimespent",
                key:"average_timespent",
                type:"bar"
            },
            {
                chartTitle:"Most Consumed Program",
                taskUrl :"phonicsmostconsumedprogram",
                key:"most_consumed_program",
                type:"pieload"
            }    
        ];
    }
    initilizeprogramanalytics();
}]);
advancePubapp.controller('readingsuccessController',['$scope', 'sfactory','$uibModal','$rootScope','$filter','$log','sessionService','encryptionService', function($scope,sfactory,$uibModal,$rootScope,$filter,$log,sessionService,encryptionService) {
    var reportDataReq; 
    
    //Method  for number success report
    function readingsuccessreport(reportDataReq){
    var task = 'programreportsind';
        inputreq = JSON.stringify(reportDataReq);
        sfactory.serviceCallReports(inputreq, task).then(function(response) {
        if(angular.isDefined(response)){
            if($filter('lowercase')(response.status) == 'success'){
                $scope.tableData.data =response.data.program_report;
                $scope.readingsuccess.overall = response.data.users_at_program;
                $rootScope.appLoader = false;
            }else{                
                $rootScope.appLoader = false;
            }	
        }
        }, function(error) {
            var localTask = "readingsuccessreports";
                sfactory.localService(localTask).then(function(response) {
               $scope.tableData.data =response.data.data.program_report;
                $scope.readingsuccess.overall = response.data.data.users_at_program;
            }, function(error) {
            });
        });
    }
    
    //Method for number success analytics
    $scope.getreadingSuccessAnalyticsData = function(){
        var task = 'programanalyticsind';
        inputreq = JSON.stringify(reportDataReq);
        sfactory.serviceCallReports(inputreq, task).then(function(response) {
            console.log(response);
            if(angular.isDefined(response.data)){
                $scope.readingsuccess.number= response.data;
                $rootScope.appLoader = false;
            }
        }, function(error) {
        var localTask = "readingsuccessreports";
            sfactory.localService(localTask).then(function(response) {                
                $scope.readingsuccess.number= response.data.analyticsdata;
            }, function(error) {
            });
        });
    }
    
     /* Method to show filter modal */
    $scope.chartModal = function(size, chartType, data, chartHeader,traffic) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'dest/templates/chartsModal.html',
            controller: 'modalController',
            size: size,
            resolve: {
                items: function() {
                    return {
                        chartType: chartType,
                        chartdata: data,
                        header: chartHeader, 
                        traffic:traffic,
                        dateRange:$scope.daterangecustompick,
                        chartProperties:chartProperties,
                        reportsProgram: "Reading Success"
                    };
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    
      /*Method for update data based on calender*/
    function updateCharts(start_date,end_date){
          var requestData = JSON.stringify({
                'start_date': start_date,
                'end_date': end_date,                
                'program_id': "Reading Success",
                'group_id'  : reportDataReq.group_id,
                'user_id': reportDataReq.user_id
        });
        sfactory.serviceCallReports(requestData, 'programanalyticsind').then(function(response) {
			if(angular.isDefined(response)){
				if($filter('lowercase')(response.status) == 'success'){
					$scope.readingsuccess.number.most_visited.change(response.data.most_visited);
                    $scope.readingsuccess.number.most_visited.x = (response.data.most_visited.x);
					$scope.readingsuccess.number.classes_at_program.change(response.data.classes_at_program); 
                    $scope.readingsuccess.number.classes_at_program.x = (response.data.classes_at_program.x);
					$scope.readingsuccess.number.enrollment_at_program.change(response.data.enrollment_at_program);
                    $scope.readingsuccess.number.enrollment_at_program.x = (response.data.enrollment_at_program.x);                    
                    
                    $scope.readingsuccess.number.enrollement_based_on_textbook.change(response.data.enrollement_based_on_textbook);                    
					$rootScope.appLoader = false;
				}
			 }	
        }, function(error) {
        var localTask = "readingsuccessreports";
        sfactory.localService(localTask).then(function(response) {            
            $scope.readingsuccess.number.most_visited.change(response.data.analyticsdata.most_visited);
            $scope.readingsuccess.number.classes_at_program.change(response.data.analyticsdata.classes_at_program);                                   
            $scope.readingsuccess.number.enrollment_at_program.change(response.data.analyticsdata.enrollment_at_program);            
            $scope.readingsuccess.number.enrollement_based_on_textbook.change(response.data.analyticsdata.enrollement_based_on_textbook);
            }, function(error) {
            });
        });
    }

    //Method for activities download
    $scope.readingsuccessdownload = function(task){
        userId  = reportDataReq.user_id;
        groupId = encryptionService.decrypt(reportDataReq.group_id);
         if($scope.startDate && $scope.endDate){
            var start = new Date($scope.startDate).getFullYear()+"-"+(Number(new Date($scope.startDate).getMonth())+1)+"-"+new Date($scope.startDate).getDate();
            var end = new Date($scope.endDate).getFullYear()+"-"+(Number(new Date($scope.endDate).getMonth())+1)+"-"+new Date($scope.endDate).getDate();
            window.location = appUrl+task+"?start_date="+start+"&end_date="+end+"&program_id=Reading Success"+"&user_id="+userId+"&group_id="+groupId+"&csv=1";
        }
        else{
            window.location = appUrl+task+"?program_id=Reading Success"+"&user_id="+userId+"&group_id="+groupId+"&csv=1";
        }
    }
    
    $scope.downloadbtn = function(){
        $scope.isActive_down = !$scope.isActive_down;
    }
    $scope.closedownload = function(){
        $scope.isActive_down = false;
    };
    $scope.reportdownloadbtn = function(){
        $scope.isActive_downreport = !$scope.isActive_downreport;
    }
    $scope.reportclosedownload = function(){
        $scope.isActive_downreport = false;
    };
    $scope.saveChartObj = function(response){
        var chartObject =_.find(chartArray, function(obj){ return obj.title.textStr  == response.title.textStr;});
        if(angular.isDefined(chartObject)){
            chartArray[chartArray.findIndex(x => x.title.textStr === response.title.textStr)] = response;
        }
        else{
            chartArray.push(response);
        }
    };
    
    $scope.export = function(download){
        reportService.exportCharts(chartArray,{type:download});
    };
    
	 //Method for initilize controller
    function initilizereadingsuccess(){
       
        $scope.readingsuccess = {};
         reportDataReq = {
            'program_id': "Reading Success",
            'group_id'  : encryptionService.decrypt(sessionService.get('grp_id')),            
            'user_id': encryptionService.decrypt(sessionService.get('userId'))
        };
        readingsuccessreport(reportDataReq);
        $scope.readingsuccess.vmDate = Last7Days().split(',')[Last7Days().split(',').length-1]+" To "+Last7Days().split(',')[0];
            $scope.tableData = {
            pageName: 'readingsuccesstable',
            isFilterbtns: false,
            isSearch: true,
            isPagination: true,
            sortType: '',
            isCheckboxhide: true,
            headers: [{name: 'Course',bind_val: 'label',isSortable: true},
                {name: 'No of enrolled users',bind_val: 'no_of_enrolled_users',isSortable: true},
                {name: 'no of Activity',bind_val: 'no_of_activities',isSortable: true},
                {name: 'no of Student Completed Course',bind_val: 'no_of_students_completed',isSortable: true},
                {name: 'no of visit',bind_val: 'no_of_visits',isSortable: true},
                {name: 'no of shares',bind_val: 'no_of_shares',isSortable: true},
                {name: 'Time spent',bind_val: 'time_spent',isSortable: true},                
            ],
            data: []
        };
        $scope.daterangecustompick = $scope.readingsuccess.vmDate;
        $scope.dateoptions={
            "locale": {
              "format": "MM-DD-YYYY",
            },
            showDropdowns:true,
            autoApply:true,
            maxDate : new Date(),
            eventHandlers: {
                'apply.daterangepicker': function(ev, picker) {
                    $scope.daterangecustompick = ev.model.startDate.format('MM-DD-YYYY')+ ' To '+ev.model.endDate.format('MM-DD-YYYY');
                    updateCharts(ev.model.startDate.format('MM-DD-YYYY'),ev.model.endDate.format('MM-DD-YYYY'));                    
                }
            }
        };
		
		    chartProperties=[
            {
                chartTitle:"Reading Success- User visits",
                taskUrl :"uservisitbyprogram",
                key:"most_visited",
                type:"line"
            },
            {
                chartTitle:"Classes at Reading Success",
                taskUrl :"classesatprogram",
                key:"classes_at_program",
                type:"line"
            },
            {
                chartTitle:"Enrollment at Reading Success",
                taskUrl :"enrolledatprogram",
                key:"enrollment_at_program",
                type:"line"
            }, 
            {
                chartTitle:"Enrollement Based On Textbook",
                taskUrl :"enrollementbasedontextbook",
                key:"enrollement_based_on_textbook",
                type:"bar"
            }
        ];
    }    
    initilizereadingsuccess();
}]);
advancePubapp.controller('servertabledirectiveController',['$scope','$filter','PaginationService','sfactory','getParamsDelete','$filter','$mdDialog','$rootScope','$log','taskService','paginationDatamanagement','$state', function($scope,$filter,PaginationService,sfactory,getParamsDelete,$filter,$mdDialog,$rootScope,$log,taskService,paginationDatamanagement,$state){
    var notToRefresh = false,datatableSearchObj={};
	$scope.$watchCollection('datasource.data',function(newVal,oldVal){
        if(!notToRefresh && angular.isDefined(newVal)){
            $scope.datasource.data = newVal;
            /*if($scope.datasource.paginateParams && newVal.length > $scope.datasource.paginateParams.itemsPerpage){
                $scope.pageChanged();
            }*/
            $scope.paginateProcess(newVal);
        }
        else{
            notToRefresh = false;
        }
        if($scope.roleFiltereddata && $scope.roleFiltereddata.length >= 0){
			$scope.datatable.filterTable($scope.tabName);
		}
	}); 
	
    /*Method to close add single/multi record while edit/delete/view */
	$scope.setParentvalues = function(response){
		$scope.closeregisteration({'response':true});
	}
	
	$scope.buttonToggleupdate = function(response){
        (response.id) ? $scope.cachePagination.push(response.id) : $scope.cachePagination = [];
		$scope.isCheckedall = response.ischeckedall;
		$scope.prevStatus = response.prevStatus;
		if($scope.cachePagination.length){
			if(response.status){
			   $scope.cachePagination = _.uniq($scope.cachePagination);
			}
			else{
				if(response.prevStatus == 'add'){ 
					$scope.cachePagination = _.uniq($scope.cachePagination);
				}else{
					$scope.cachePagination = _.without($scope.cachePagination,response.id);
				}
			}
		}
        $scope.buttonupdate({'response':response});
    }
    
    /* Method to toggle check all check boxes */
    $scope.processAllData = function(){ 
        var sourceData = ($scope.searchFiltereddata ? $scope.searchFiltereddata : ($scope.roleFiltereddata ? $scope.roleFiltereddata : $scope.datasource.data));
        //method for in which tab chekbox is enable
        if($scope.headerCheck.box){
            toggleCheckbool(sourceData,true);
        }
        else{
            toggleCheckbool(sourceData,false);
        }        
    }

    $scope.navigateToStudentProfile = function(body){
        /*sfactory.bufferedData.studentProfile = body;
        sfactory.bufferedData.types = "student";
        $state.go('adminLanding.studentprofile');*/
    };
     
    /* Method to delete all records */
    $scope.deleteAllrows = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Are you sure you want to delete the selected students ?')
              .textContent('')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Delete')
              .cancel('Cancel');

        $mdDialog.show(confirm).then(function() {
            var task = $scope.datasource.ismultiDel.task;
            var view = $scope.datasource.ismultiDel.viewname;
            options = {val:[],title : []};
            $scope.sourceData = ($scope.searchFiltereddata ? $scope.searchFiltereddata : ($scope.roleFiltereddata ? $scope.roleFiltereddata : $scope.datasource.data));
            if($scope.headerCheck.box){
                _.each($scope.sourceData,function(body){
                    $scope.chkarrayall.push(body.id);
                    $scope.chkarrayalltitle.push(body.name);
                    $scope.selectedItems.push(body);
                });            
            }
            _.each($scope.sourceData,function(body){
                if(body.row_Checkbox){
                    $scope.selectedItems.push(body);
                    $scope.chkarrayall.push(body.id);
                    $scope.chkarrayalltitle.push(body.name);
                }    
                options.val=_.difference($scope.chkarrayall, $scope.chkarray);
                options.val=_.uniq(options.val);
                options.title=_.difference($scope.chkarrayalltitle, $scope.chkarraytitle);
                options.title=_.uniq(options.title);
            });    

            var deleteActionAll = getParamsDelete.args(view,options.val,options.title);
            sfactory.serviceCall(JSON.stringify(deleteActionAll.params),task).then(function(response){
                options = {val:[],title : []};
                $scope.chkarrayall = [];$scope.chkarrayalltitle = [];
                $scope.headerCheck.box = false;
                toggleCheckbool($scope.datasource.data,false);
                if($filter('lowercase')(response.status) == 'success'){
                    var deletableItems = [];
                        _.each(response.data.deletable,function(items){
                           deletableItems.push(_.where($scope.sourceData, {'id':items}));
                        });
                        if(deletableItems.length > 0){
                            _.each(deletableItems,function(selectedItems){
                                deleteUniq($scope.datasource.data, 'id', selectedItems[0].id); 
                            });
                        }
                        $scope.datatable.filterTable($scope.tabName);                    
                    if(typeof(response.data.non_deletable)!= "undefined" && response.data.non_deletable.length > 0){
                        var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
                        $scope.$emit('emitFromdeleteBaner',{'alertBaner':banerData});
                    }else{
                        var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
                        $scope.$emit('emitFromdeleteBaner',{'alertBaner':banerData});
                    }                    
                }
                else{
                    var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-warning'};
                    $scope.$emit('emitFromdeleteBaner',{'alertBaner':banerData});
                }
				$rootScope.appLoader = false;
            },function(error){
                $scope.headerCheck.box = false;
                toggleCheckbool($scope.datasource.data,false);
            });
        }, function() {
            $scope.headerCheck.box = false;
            toggleCheckbool($scope.datasource.data,false);
        });
    };

    $scope.breadcrumbFnlink = function(str, index){
       $scope.$emit('emitbreadcrumbFnlink', str, index);
    }
   $scope.tableDatafnlink=function(event,body,fuctionVal)
    {
        event.preventDefault();
        $scope.classcatid = body;
        $scope.classcatid.fuctionVal =fuctionVal;
        $scope.$emit('emittableDataList',{'catergorydata':$scope.classcatid});
    };
    
    
    /* Method as callback for row click event */
    $scope.assignRow=function(event,body) {
		$(".trow").removeClass('rowselect');
		$(".selectrow"+body.id).addClass('rowselect');
        $scope.assignAdmin = body;
        //$scope.$emit('emitadmin',{'admindata':$scope.assignAdmin});
        var classmgmtscope = angular.element(jQuery("#classmanagement")).scope();
        classmgmtscope.gatherValues($scope.assignAdmin);
    };

    /* Method to toggle individual checkboxes */
    $scope.individual_check = function(body,head){
        var sourceData = ($scope.searchFiltereddata ? $scope.searchFiltereddata : ($scope.roleFiltereddata ? $scope.roleFiltereddata : $scope.datasource.data));
        if($scope.headerCheck.box){  
            if(_.contains($scope.chkarray, body.id)){ 
                $scope.chkarray= _.without($scope.chkarray, body.id);    
            }
            else{
                $scope.chkarray.push(body.id);				  
            }		  
            if(_.contains($scope.chkarraytitle, body.name)){ 
                $scope.chkarraytitle= _.without($scope.chkarraytitle, body.name);    
            }
            else{ 
                $scope.chkarraytitle.push(body.name);				  
            }
        }
        if(body.row_Checkbox){
            if($scope.checkboxenable <= sourceData.length) $scope.checkboxenable++;
        }
        else{
            if($scope.checkboxenable > 0) $scope.checkboxenable--;
        }
        if($scope.checkboxenable == sourceData.length)
            $scope.headerCheck.box = true;
        else $scope.headerCheck.box = false;
    }
    
    
    /* Method to call paginationservice for page order */
    $scope.paginateProcess = function(data,page){
		data = $filter('orderBy')(data, $scope.sortType, $scope.sortReverse);
        $scope.pager = PaginationService.GetPager(data.length,page);// get pager object from service
        $scope.items = data.slice();// get current page of items
    }
    
    /* set page based on the data */
    $scope.setPage = function(page) {
        if (page < 1 || page > $scope.pager.totalPages) {
            return;
        }
        var data = ($scope.searchFiltereddata && $scope.searchFiltereddata.length > 0) ? $scope.searchFiltereddata : ($scope.roleFiltereddata ? $scope.roleFiltereddata : $scope.datasource.data);
        $scope.sortedData = $filter('orderBy')(data, $scope.sortType, $scope.sortReverse);
        $scope.paginateProcess($scope.sortedData,page);
    }
    
    /* Method to filter based on the button actioons */
    if(typeof($scope.datatable) != "undefined"){
            $scope.datatable.filterTable = function(selectedOption,isDelete){
         
            if($scope.tabName.name == selectedOption.name){
                $scope.headerCheck.box = true;
            }else{
                $scope.headerCheck.box = false;
            }    
                
            selectedOption.isActive = true;
            if(!angular.isDefined(selectedOption.name)){
				selectedOption.name = angular.copy($scope.tabName.name);
				$scope.tabName.isActive = true;
                notToRefresh = true;
            }
			else{
                                
				selectedOption.isActive = true;
				$scope.tabName = selectedOption;
                _.each($scope.datasource.tabList,function(item){
                    //method for default all option need to check
					if(item.name == selectedOption.name){
						item.isActive = true;
					}else{
						item.isActive = false;
					}
				});
			}
                
            var mapbtnRole = {'group admin':'admin',student:'Student',teacher:'Teacher',parent:'Parent',all:'All'};
            var datatTofilter = $scope.isSearched ? $scope.searchFiltereddata : $scope.datasource.data;
            $scope.roleFiltereddata = (selectedOption.name.toLowerCase() != 'all' ? $filter('filter')($scope.datasource.data, {roleType:mapbtnRole[selectedOption.name.toLowerCase()]}) : $scope.datasource.data);
            if(!isDelete && $scope.dataSearch.text != null) $scope.updateSearch($scope.dataSearch.text,$scope.roleFiltereddata);
            else {
                var dataTofilter = ($scope.searchFiltereddata ? $scope.searchFiltereddata : ($scope.roleFiltereddata ? $scope.roleFiltereddata : $scope.datasource.data));
                $scope.paginateProcess(dataTofilter);
            }
            $scope.processAllData();    
           
        }
    }
    
    /* Method to set sort order */
    $scope.setSortorder = function(head){

        if(!$scope.datasource.data.length) return;

        if(head.isSortable){
            /*server side sorting*/
            $scope.sortReverse = !$scope.sortReverse;
            $scope.sorting = {'column':head.bind_val,'order':$scope.sortReverse ? 'asc' : 'desc'};
            $scope.pageChanged();
        }
        else return false;
    }
    
  
    /* Method to set sort up icon order */
    $scope.sortDowndecider = function(head){
        if($scope.sortType && head.bind_val.toLowerCase() == $scope.sortType.toLowerCase() && $scope.sortReverse) return true;
    }
    
    /* Method to set sort up icon order */
    $scope.sortUpdecider = function(head){
        if($scope.sortType && head.bind_val.toLowerCase() == $scope.sortType.toLowerCase() && !$scope.sortReverse) return true;
    }
    
    /* Method to capture emitted values from deep child directive */
    $scope.captureBaner = function(value){
        var banerData = {'message':value.message,'showBaner':value.showBaner,'banerClass':value.banerClass};
        var deltedData = value.contentItems ? value.contentItems : null;
        if(deltedData != null){
            var curItemIndex = $scope.items.indexOf(deltedData);
            if(curItemIndex > -1) {
                $scope.items.splice(curItemIndex,1); 
            }    
        }
        $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData,'list':value.switchMenu});
    };
    
    /* Method to toggle individual check box bool based on overall checkbox status */
    function toggleCheckbool(sourceData,bool){
        _.each(sourceData,function(items){
            items.row_Checkbox = bool;            
        });
        if(bool) $scope.checkboxenable = sourceData.length;
        else if(!bool) $scope.checkboxenable = 0;
    }
    
    $scope.assigncontentToStudent = function(response){
        $scope.assigncc({'response':response});
    }

	//table page search
	$scope.tablePageSearch = function(){
		if($scope.dataSearch.text == ''){
			$scope.pageChanged();
		}
	}
	
    $scope.pageChanged = function(isSearch) {
        singletimeupdate = ((!singletimeupdate && isSearch && $scope.dataSearch.text) ? true : false);
        /*check total record against total matched records for sorting*/
        if(singletimeupdate && !isSearch && $scope.datasource && $scope.datasource.paginateData && ($scope.datasource.paginateData.total_records === $scope.datasource.paginateData.total_matched_records)){
            $scope.dataSearch.text = '';
        }
        inputReq = $scope.datasource.paginateParams;
        inputReq.currentPage = $scope.pagination.currentPage;
        inputReq.sortOrder = $scope.sorting ? $scope.sorting.order : inputReq.sortOrder;
        inputReq.sortCoulmn = $scope.sorting ? $scope.sorting.column :  inputReq.sortCoulmn;
        inputReq.searchQuery = $scope.dataSearch.text;
        inputReq.itemsPerpage = ($scope.pagination.itemsPerPage.value !== 'All') ? $scope.pagination.itemsPerPage.value : "";
        inputReq.searchTable = ($scope.dataSearch.text && isSearch) ? true : false
        sfactory.serviceCall(JSON.stringify(inputReq),$scope.datasource.paginationAPI,'listDetails').then(function(response){
            //user list response comes here...
            if($scope.datasource.isDrilldown){
                if($scope.cachePagination.length){
                    _.each($scope.cachePagination,function(items,index){
                        var matchedVal = _.where(response.data[$scope.datasource.resKey],{'id':items});
                        if(matchedVal.length) {
                            matchedVal[0].studentAdded = true;
                        }
                    });
                    $scope.datasource.data = response.data[$scope.datasource.resKey];
                    $scope.datasource.paginateData = response.data['paginateData'];
                }
                else{
					if($scope.isCheckedall){
						_.each(response.data[$scope.datasource.resKey],function(items,index){
							items.studentAdded = true;
                        });
					}
					$scope.datasource.data = response.data[$scope.datasource.resKey];
                    $scope.datasource.paginateData = response.data['paginateData'];                    
                }
            }
            else{ 
				 if($scope.cachePagination.length){
					/* Method for previous stuatus based works */ 
					if($scope.prevStatus == 'add' || $scope.prevStatus == 'remove'){
						_.each(response.data,function(items,index){
							($scope.prevStatus == 'add') ? items.studentAdded = true : items.studentAdded = false;
						});	
					}	
					 
					_.each($scope.cachePagination,function(items,index){
						var matchedVal = _.where(response.data,{'id':items});
						if(matchedVal.length) {
							(angular.isUndefined($scope.prevStatus)) ? matchedVal[0].studentAdded = true : ($scope.prevStatus == 'add') ? matchedVal[0].studentAdded = false :matchedVal[0].studentAdded = true;
						}
					}); 
                   
                    $scope.datasource.data = response.data;
                    $scope.datasource.paginateData = response.paginateData;
                }
                else{
					if($scope.isCheckedall || (!$scope.isCheckedall && $scope.prevStatus == 'add')){
						_.each(response.data,function(items,index){
							items.studentAdded = true;
                        });
					} 
                    $scope.datasource.data = response.data;
                    $scope.datasource.paginateData = response.paginateData;                    
                }
                // convert UTC time to current timezone time
                if($scope.datasource.pageName=="reportsData" || $scope.datasource.pageName=="teacherStudentsData"){
                       _.each($scope.datasource.data, function(item){
                           if(item.lastvisitDate!="" && item.lastvisitDate!="NA"){
                                var lastloginDate = new Date(item.lastvisitDate+' UTC');                        
                                item.lastvisitDate = moment(lastloginDate).format("MM/DD/YYYY");  
                            }
                      });
                }
            }
            $scope.pagination.totalItems = (!$scope.datasource.paginateData.isDbempty) ? $scope.datasource.paginateData.total_matched_records : 1
            $rootScope.appLoader = false;
        },function(error){
            var localTask = "classUserlist";
            sfactory.localService(localTask).then(function(response){
                $scope.datasource.data = response.data.data;
                $scope.datasource.paginateData = response.data.paginateData;
            },function(error){
            });
        });
    };
    
    initiateController();
    var singletimeupdate;
    /* Method to initiate properties */
    function initiateController(){
        $scope.cachePagination = paginationDatamanagement.selectedItems;
        //Properties for pagination
        $scope.pagination = {
            currentPage: 1,
            totalItems: $scope.datasource.paginateData ? $scope.datasource.paginateData.total_matched_records : 1,
            numPages : [{value:10,isSelected:true},{value:20,isSelected:false},{value:50,isSelected:false},{value:100,isSelected:false},{value:'All',isSelected:false}]
        };
        //properties for sort table
        $scope.chkarrayall = [];
        $scope.chkarray=[];
        $scope.chkarrayalltitle = [];
        $scope.chkarraytitle=[];
        $scope.checkboxenable = 0;
        $scope.selectedItems = [];
        var options = {};
        $scope.assignAdmin={};
        var sourceData = null;
        $scope.dataSearch = {'text':null};
        $scope.sortType     = $scope.datasource.sortType; // set the default sort type
        $scope.sortReverse  = false;  // set the default sort order
        $scope.headerCheck ={box:false};
        $scope.radio = {model : 'All'};
        $scope.tabName = {isActive:true,name:"All"};
        /* pagination properties initialized */
        $scope.paginateRange = _.range(1, $scope.datasource.data.length); // dummy array of items to be paged
        $scope.pager = {};
        $scope.setPage(1);
    	$scope.rectifiedData = []; 
        datatableSearchObj ={  
			classedituser:{
				key:'name',
				values:['name']
			},
			studentsEngagementData:{
				key:'name',
				values:['name']
			},
			classnewstudentlist:{
				key:'name',
				values:['name']
			},
            classExistingstudents:{
                
            },
            reportsData:{
                key:'name',
				values:['name']
            }
        };
    };
}]);
/* Method to delete values from array */
var deleteUniq = function(arr, attr, value){
    var i = arr.length;
    while(i--){
       if( arr[i] 
           && arr[i].hasOwnProperty(attr) 
           && (arguments.length > 2 && arr[i][attr] === value ) ){ 

           arr.splice(i,1);

       }
    }
    return arr;
}



advancePubapp.animation('.animateslider', function($animate) {
 return {
    enter: function(element, done) {
        element.slideDown();
        element.css('display','inline-block');
        element.animate({"max-height":'3000px'},500,function(){
        element.css('overflow','visible');
        });
        
    },
    leave: function(element, done) {
        element.css('overflow','hidden');
        element.css('display','inline-block');
        element.slideUp();
        element.animate({"max-height":'0'},500);
        window.scrollTo(0,0);
    }
  };
});

 
advancePubapp.animation('.rm_bx_bor', function($animate) {
  return {
    enter: function(element, done) {
        var selectorElem = $(element).attr('selectorElem');
        var container = $('body');
        element.animate({"max-height":"3000"},1500,function(){
			if(selectorElem){
				var offset_top = $('#'+selectorElem).offset().top;
				container.stop().animate({
					scrollTop: offset_top - 127
				},500);
			}
           
        });
    },
    leave: function(element, done) {
		var selectorElem = $(element).attr('selectorElem');
		var container = $('body');
		element.css('overflow','hidden');
		element.animate({"max-height":"0"},500,function(){
			element.hide();
			var offset_top = $('#'+selectorElem).offset().top;
			container.stop().animate({
				scrollTop: offset_top - 127
			},500);
		});
		
    }
  };
});
advancePubapp.controller('socialmediaController', ['$scope', '$http', 'spinnerService', 'sfactory', '$rootScope', '$stateParams','$uibModal', '$log', 'reportService','$filter','$stateParams', 'encryptionService','sessionService',function($scope, $http, spinnerService, sfactory, $rootScope, $stateParams, $uibModal, $log, reportService,$filter,$stateParams,encryptionService,sessionService) {
     var chartProperties=[],reportDataReq,chartArray;
    
      /* Method to fetch overall data from json or service for reports */
    function getReportsData(reportDataReq) {
        inputreq = JSON.stringify(reportDataReq);
        sfactory.serviceCallReports(inputreq, 'socialmediareports').then(function(response) {
           if(angular.isDefined(response)){
                if($filter('lowercase')(response.status) == 'success'){
                    $scope.socialShares.reportData= response.data;
                    loadReport(response.data);
                    $rootScope.appLoader = false;
                }
            }   
        }, function(error) {
            var localTask = "socialmedia";
            sfactory.localService(localTask).then(function(response) {
                $scope.socialShares.reportData= response.data;
                loadReport(response.data);
            }, function(error) {
            });
        });
    }
    
    /* Method to fetch overall data from json or service for anaytics */
   
     $scope.getAnalyticsData = function(){
         inputreq = JSON.stringify(reportDataReq);
         $scope.isAnalytics = true;
        if(!angular.isDefined($scope.socialShares.analyticData)){
            sfactory.serviceCallReports(inputreq, 'socialmediaanalytics').then(function(response) {
                if(angular.isDefined(response)){
                    if($filter('lowercase')(response.status) == 'success'){
                        $scope.socialShares.analyticData = response.data;
                        loadReportAnalytics();
                        $rootScope.appLoader = false;
                    }
                }
            }, function(error) {
                var localTask = "socialmedia";
                sfactory.localService(localTask).then(function(response) {
                   $scope.socialShares.analyticData = response.data;
                    loadReportAnalytics();
                }, function(error) {
                });
            });
        }
        else{
           loadReportAnalytics(); 
        }
    };
    
    
    /*Method to load all analytics charts*/
    function loadReportAnalytics() {
       //load line chart function
        $scope.socialSharesLinechart = $scope.socialShares.analyticData.social_shares;
        // load pie chart function
        $scope.preferredSocialMedia = reportService.loadPiechart($scope.socialShares.analyticData.most_preferred_social_shares,'Most Preferred Social media');
        //load Bar charts function
        $scope.programBasedDataBarChart = $scope.socialShares.analyticData.social_shares_based_on_program;
        $scope.mediaBasedDataBarChart = $scope.socialShares.analyticData.social_shares_based_on_media_type;

    };
    
    
    
    /* Method to download reports as csv */
    $scope.downloadReport = function(task){
        userId  = reportDataReq.user_id;
        groupId = reportDataReq.group_id;
        if($scope.startDate && $scope.endDate){
            var start = new Date($scope.startDate).getFullYear()+"-"+(Number(new Date($scope.startDate).getMonth())+1)+"-"+new Date($scope.startDate).getDate();
            var end = new Date($scope.endDate).getFullYear()+"-"+(Number(new Date($scope.endDate).getMonth())+1)+"-"+new Date($scope.endDate).getDate();
            window.location = appUrl+task+"?start_date="+start+"&end_date="+end+"&user_id="+userId+"&group_id="+groupId+"&csv=1";
        }
        else{
            window.location = appUrl+task+"?user_id="+userId+"&group_id="+groupId+"&csv=1";
        }
    }
       
        /*Method to get report data*/
       function loadReport(data) {
          $scope.socialShareData = data.total_social_shares;
          $scope.tableData.data = data.media_type_report;
       };
    
    $scope.downloadbtn = function(){
        $scope.isActive_down = !$scope.isActive_down;
    }
    $scope.closedownload = function(){
        $scope.isActive_down = false;
    };
    $scope.reportdownloadbtn = function(){
        $scope.isActive_downreport = !$scope.isActive_downreport;
    }
    $scope.reportclosedownload = function(){
        $scope.isActive_downreport = false;
    };
    $scope.saveChartObj = function(response){
        var chartObject =_.find(chartArray, function(obj){ return obj.title.textStr  == response.title.textStr;});
        if(angular.isDefined(chartObject)){
            chartArray[chartArray.findIndex(x => x.title.textStr === response.title.textStr)] = response;
        }
        else{
            chartArray.push(response);
        }
    };
    
    $scope.export = function(download){
        reportService.exportCharts(chartArray,{type:download});
    };
    /*open model popup for more filter option*/
   $scope.chartModal = function(size, chartType, data, chartHeader) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'dest/templates/chartsModal.html',
            controller: 'modalController',
            size: size,
            resolve: {
                items: function() {
                    return {
                        chartType: chartType,
                        chartdata: data,
                        header: chartHeader, 
                        dateRange:$scope.socialdaterangecustompick,
                        chartProperties:chartProperties
                    };
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
     
    /*Method to update all charts after change in date range*/
     function updateCharts(startDate,endDate) {
        if (startDate && endDate) {
            $scope.startDate = startDate;
            $scope.endDate = endDate;
			
            var requestData = JSON.stringify({
                'start_date': startDate,
                'end_date': endDate,
                'group_id'  : reportDataReq.group_id,
                'user_id': reportDataReq.user_id
            });
            
            sfactory.serviceCallReports(requestData, 'socialmediaanalytics').then(function(response) {
                 if(angular.isDefined(response)){
                     if($filter('lowercase')(response.status) == 'success'){   
                        $scope.socialSharesLinechart.change(response.data.social_shares);
                        $scope.socialSharesLinechart.x = (response.data.social_shares.x);
                        $scope.preferredSocialMedia.change(reportService.loadPiechart(response.data.most_preferred_social_shares,'Most Preferred Social media'));
                         $scope.preferredSocialMedia.data = response.data.most_preferred_social_shares;
                        $scope.programBasedDataBarChart.change(response.data.social_shares_based_on_program);
                        $scope.mediaBasedDataBarChart.change(response.data.social_shares_based_on_media_type);
                     }
                      $rootScope.appLoader = false;
                 }
            }, function(error) {
                var localTask = "updatedreportdata";
                sfactory.localService(localTask).then(function(response) {
                    $scope.socialSharesLinechart.change(response.data.social_shares);
                    $scope.preferredSocialMedia.change(reportService.loadPiechart(response.data.most_preferred_social_shares,'Most Preferred Social media'));
                    $scope.preferredSocialMedia.data = response.data.most_preferred_social_shares;
                    $scope.programBasedDataBarChart.change(response.data.social_shares_based_on_program);
                    $scope.mediaBasedDataBarChart.change(response.data.social_shares_based_on_media_type);
                    $rootScope.appLoader = false;
                }, function(error) {
                });
            });
        }
    };
    
    
    /* Method loads when controller initiats */
    function initiateController() {
         $scope.socialShares={};chartArray=[];
        $scope.socialShares.vmDate = Last7Days().split(',')[Last7Days().split(',').length-1]+" To "+Last7Days().split(',')[0];
        //$scope.socialShares.currDate = new Date();
        $scope.jsonData = [];
        $scope.tableData = {};
        var socialmediascope = angular.element(jQuery("#adminLanding")).scope();
        
        reportDataReq = {
            'group_id'  : encryptionService.decrypt(sessionService.get('grp_id')),            
            'user_id': encryptionService.decrypt(sessionService.get('userId'))
        };
        $scope.socialdaterangecustompick = $scope.socialShares.vmDate;
        $scope.dateoptions={
            "locale": {
              "format": "MM-DD-YYYY",
            },
            showDropdowns:true,
            autoApply:true,
            maxDate : new Date(),
            eventHandlers: {
                'apply.daterangepicker': function(ev, picker) { 
                    $scope.socialdaterangecustompick = ev.model.startDate.format('MM-DD-YYYY')+ ' To '+ev.model.endDate.format('MM-DD-YYYY');
                    updateCharts(ev.model.startDate.format('MM-DD-YYYY'),ev.model.endDate.format('MM-DD-YYYY'));                    
                }
            }
        };
      $scope.tableData = {
            pageName: 'socialreport',
            isFilterbtns: false,
            isSearch: true,
            isPagination: true,
            sortType: '',
            isCheckboxhide: true,
            headers: [{name: 'Media Type', bind_val: 'media_type', isSortable: true},
                      {name: 'Total Shares', bind_val: 'total_shares', isSortable: true},
                      {name: 'Facebook Shares', bind_val: 'facebook_shares', isSortable: true},
                      {name: 'Twitter Shares', bind_val: 'twitter_shares', isSortable: true},
                      {name: 'Google+ Shares', bind_val: 'google_shares', isSortable: true},
                      {name: 'Linkedin Shares', bind_val: 'linkedin_shares', isSortable: true}],
            data: []
        };
                
        /*object for model view Chart*/
         chartProperties=[
            {
                chartTitle:"Social Shares",
                taskUrl : "mostsocialshares",
                key:"social_shares",
                type:"line"
            },
            {
                chartTitle:"Most Preferred Social media",
                taskUrl : "mostpreferredsocialshares",
                key:"most_preferred_social_shares",
                type:"pie"
            },
            {
                chartTitle:"No. of social shares by Program",
                taskUrl : "socialsharesbyprogram",
                key: "social_shares_based_on_program",
                type: "bar"
            },
            {
                chartTitle:"Social share Based on Media Type",
                taskUrl : "socialsharesbymediatype",
                key: "social_shares_based_on_media_type",
                type: "bar"
            },
        ];
        getReportsData(reportDataReq);
    }
    
    initiateController();
    
}]);
advancePubapp.controller('studentDashboardCtrl', ['$scope', '$rootScope','phonicsajaxFactory', 'taskService','$state','$filter', '$stateParams','cacheService',function($scope, $rootScope, phonicsajaxFactory, taskService,$state,$filter,$stateParams,cacheService) {
    
    $scope.studentAssignment ={};
    $scope.activeScreen = 'assignments';
    var studentAssignment={};
    $scope.Activities = [];
    $scope.selection ={
        selectedTab:'1',
        selectedSub:'pa',
        selectedAct:'All',
        filter:'All',
        selectedAssign:'grpAssign',
        category:'Phonics Adventure'
     };
     $scope.individualAssignments ={};


    $scope.selectTab = function(select){
        $scope.selection.selectedTab = select;
    }

    $scope.selectCat = function(select, index){
         $scope.selection.category = select;
          $scope.Activities =[];
         $scope.courses =  $scope.displayAssignmentData.categories[index].courses;

        $scope.generateActivity($scope.courses);
    }
    $scope.generateActivity= function(courses){

     for(var i =0;i< courses.length;i++){            
            for(var j=0;j< courses[i].sections.length;j++){
                for(var k=0;k<courses[i].sections[j].lessons.length;k++){
                    for(var l=0;l<courses[i].sections[j].lessons[k].activities.length;l++){
                        if(courses[i].sections[j].lessons[k].activities[l].isadded){
                            $scope.Activities.push(courses[i].sections[j].lessons[k].activities[l]);
                        }
                        
                    }
                }
            }
         }
    }
    

    $scope.selectAct = function(select){
        $scope.selection.selectedAct =select; // for view
        $scope.selection.filter = select; // for view all
    }
   
    $scope.selectAssignment = function(select, id){
        $scope.selection.selectedAssign = select;
        //make an API call for all assignments        
        phonicsajaxFactory.serviceCall({"type":select,"id":id}, studentAssignment.getAssignment).then(function(response) {
            if(angular.isDefined(response)){
                   console.log(response)
                    $scope.studentAssignment = response.data;
                    $scope.assignmentCat($scope.selection.selectedAssign);
                }
                $rootScope.appLoader = false;
              }, function(error) {
               phonicsajaxFactory.localService('studentAssignment').then(function(response) {
                 $scope.studentAssignment = response.data;
                  console.log(response)
                }, function(error) {
                    console.log(error);
               });
        });
    }

    $scope.getAssignmentActivity = function(tab){

      phonicsajaxFactory.serviceCall({"type": $scope.selection.selectedAssign,"id":tab.id}, studentAssignment.getAssignment).then(function(response) {
            if(angular.isDefined(response)){
                     $scope.studentAssignment = response.data;
                     if(response.data.categories.length){
                        $scope.courses = response.data.categories[0].courses;
                     }else{
                        $scope.courses =[];
                        $scope.Activities =[];
                     }
                     
                }
                $rootScope.appLoader = false;
              }, function(error) {
               phonicsajaxFactory.localService('studentAssignment').then(function(response) {
                 $scope.studentAssignment = response.data;
                  console.log(response)
                }, function(error) {
                    console.log(error);
               });
        });
    }

    $scope.assignmentCat = function(assign){
          switch(assign) {
                case 'class':
                    phonicsajaxFactory.bufferedData.assignment =  $scope.studentAssignment.classAssignments;
                    phonicsajaxFactory.bufferedData.assignment.type="class"
                    $state.go('viewAll');
                    break;
                case 'group':
                     phonicsajaxFactory.bufferedData.assignment =  $scope.studentAssignment.groupAssignments;
                     phonicsajaxFactory.bufferedData.assignment.type="group"
                     $state.go('viewAll');
                    break;
                case 'individual':
                     phonicsajaxFactory.bufferedData.assignment =  $scope.studentAssignment.individualAssignments;
                     phonicsajaxFactory.bufferedData.assignment.type="individual"
                     $state.go('viewAll');
                    break;
            }
    }

    $scope.selectScreen = function(val,assign){
        $scope.activeScreen = val;
        $scope.selection.selectedAssign = assign;
        if(val === 'viewAll'){
            $scope.assignmentCat(assign)           
        }else if(val === 'bookSection'){  
        phonicsajaxFactory.bufferedData.params = {
                        "type":"romaing",
                        "courseType":assign,
                        "content":"textbook1"
                        } ;  
            $state.go('viewIndividual');
         
        }

    }


    
    /* Method to initialize Controller */
    function initializeController() {

        studentAssignment = taskService.getTasks("studentDashboardCtrl");

        phonicsajaxFactory.serviceCall({"type":"all","id":""}, studentAssignment.getAssignment).then(function(response) {
            if(angular.isDefined(response)){
                   console.log(response)
                    $scope.studentAssignment = response.data;
                }
                $rootScope.appLoader = false;
              }, function(error) {
               phonicsajaxFactory.localService('studentAssignment').then(function(response) {
                 $scope.studentAssignment = response.data.data;
                  console.log(response)
                }, function(error) {
               });
        });

    };



    
    initializeController();
}]);
advancePubapp.controller('studentprofileController',['$scope','$rootScope','$state','sfactory','taskService','$stateParams','sessionService','encryptionService',function($scope,$rootScope, $state, sfactory, taskService, $stateParams, sessionService,encryptionService){       
	$scope.assignments ={};
	if(angular.lowercase(sessionService.get('role'))=="parent"){
    $scope.selection ={
		selectedTab:'individual',
		selectedSub:'Phonics Adventure',
		selectedAct:'All'
	 };
    }else{
     $scope.selection ={
		selectedTab:'class',
		selectedSub:'Phonics Adventure',
		selectedAct:'All'
	 };   
    }
	 $scope.template =templateURL+"dest/templates/myProfile.html"
	 $scope.userdetails=[];
	var url ="",userId,coursePlayerData = {};var buffer ="";
	  $scope.activityDataAvalibility = 0;

	$scope.selectTab = function(select){
		$scope.selection.selectedTab = select;
		$scope.selection.selectedSub = 'Phonics Adventure';
		selectURL();
		if(select !== 'profile'){
			$scope.assignmentsList(userId,$scope.selection.selectedSub);
		}else{
			setLocalVariable();
		}
	}
    
	function selectURL(){  
		switch($scope.selection.selectedTab) {
			    case 'class':
				       url = studentProfile.studentClassAssignment;				        
			        break;
			    case 'group':
			    		url = studentProfile.studentGroupAssignment;
			         
			        break;
			    case 'individual':
			    		url =  studentProfile.studentIndividualAssignment;
			        break;
			}
	}
	$scope.selectSub = function(select){
		if($scope.selection.selectedSub === select) return;
		$scope.selection.selectedSub = select;
		$scope.assignmentsList(userId,select);
	}
	
	function geyWritingSuccessKeyValues(key){
		keyvalue = _.where($scope.writingSuccessReport.courses[0].sections,{key:key});
		return keyvalue[0].name;
	}
	
	$scope.selectAct = function(select){
		$scope.selection.selectedAct =select;
		if(select === 'All'){
             $scope.activityDataAvalibility = 0;
             return;
        }
        if($scope.Activities.length){
            $scope.activityDataAvalibility = $scope.Activities.findIndex(x => x.activity_type == select);
        }
	}
    
	function populateData(data){
    	switch($scope.selection.selectedTab) {
		    case 'individual':
		         $scope.Activities =[];
				 $scope.assignments = data.assignments;
				 filterselection();
				 $scope.generateIndividualActivity($scope.assignments)
		        break;
		    default:
		        $scope.assignments =data.assignments.class;
		        coursePlayerData = $scope.assignments;		   
		        filterselection();
				$scope.generateActivity($scope.assignments)
		}
    }

    function filterselection(){
		if($scope.selection.selectedSub === 'Number Success' || $scope.selection.selectedSub === 'Writing Success'){
			$scope.selection.selectedAct =  $scope.filters[0];
		}
		else if($scope.selection.selectedSub === 'Phonics Adventure'){
			$scope.selection.selectedAct =  'All';
		}
    }
    
	$scope.assignmentsList = function(id,category){
        var groupId = encryptionService.decrypt(sessionService.get('grp_id'));
			var parms={
                "user_id":id,
                "category":category,
                "groupid":groupId
				}
			selectURL();
			setLocalVariable();
			sfactory.serviceCall(JSON.stringify(parms), url,"listDetails").then(function(response) {
                 $rootScope.appLoader = false;
				if(angular.isDefined(response)){
					  $scope.filters = response.data.filters;
					if(response.data){
							populateData(response.data);						
					}else{
						console.log('Data not available !');
						 $scope.Activities =[];
						 $scope.activityDataAvalibility = -1;
						 $scope.assignments={};
					}
				    }else{
				    	console.log('Data not available !');
						 $scope.Activities =[];
						 $scope.assignments={};
				    }
			   
			  }, function(error) {
				  sfactory.localService("studentReport").then(function(response) {
				  			$scope.filters = response.data.data.filters;	
				  			if($scope.selection.selectedSub === 'Phonics Adventure'){
				  				// $scope.filters.unshift('Course')
				  			}else{
				  				$scope.selection.selectedAct = $scope.filters[0];  	
				  			}
				  					
							populateData(response.data.data);
                              
                            }, function(error) {
                    });
			});
	}

	
  $scope.selectNSTab = function(select, index){
  		$scope.selection.filter = select;
  		$scope.selection.selectedAct = select;
  		if(select === 'All'){
             $scope.activityDataAvalibility = 0;
             return;
        }
        if($scope.Activities.length){
            $scope.activityDataAvalibility = $scope.Activities.findIndex(x => x.activity_type == select);
        }
  }
  
  $scope.viewActivity = function(event){
      event.preventDefault();
  }
  function initializeController() {
    	$scope.userdetails=[];
        studentProfile = taskService.getTasks("studentprofileController");
        url =  (angular.lowercase(sessionService.get('role'))=="parent") ? studentProfile.studentIndividualAssignment : studentProfile.studentClassAssignment;
   
        if(sfactory.bufferedData.studentProfile){
        	  localStorage.setItem('userdetails',JSON.stringify(sfactory.bufferedData.studentProfile));
        	  userId=sfactory.bufferedData.studentProfile.id;        	
        	  $scope.userdetails = sfactory.bufferedData.studentProfile;
        	  setLocalVariable();
        }else{
        	
        	 $scope.userdetails = JSON.parse(localStorage.getItem('userdetails'));
        	 userId = $scope.userdetails.id; // when buffered data is not available using localstorage to save data
        	 buffer=JSON.parse(localStorage.getItem('params'));
        	 $scope.selection.selectedTab = buffer.type;
        	 $scope.selection.selectedSub = buffer.courseType;
        }         
       if($scope.selection.selectedTab !== 'profile'){
			 $scope.assignmentsList(userId, $scope.selection.selectedSub); 
		}
        $scope.noImageUrlPath = templateURL+'dest/images/no_image.png';
        $scope.userRole = angular.lowercase(sessionService.get('role'));
       // $scope.dashboard.breadCrumbList = ["Student List","Student Profile"];
    };  

    $scope.generateIndividualActivity = function(courses){
		for(var j=0;j< courses.courses.sections.length;j++){
			for(var k=0;k<courses.courses.sections[j].lesson.length;k++){
		    	for(var l=0;l<courses.courses.sections[j].lesson[k].activities.length;l++){
					if($scope.selection.selectedSub == "Writing Success"){
						if(courses.courses.sections[j].lesson[k].activities[l].isactive){
							$scope.Activities.push(courses.courses.sections[j].lesson[k].activities[l]);	
						}
					}else{
						$scope.Activities.push(courses.courses.sections[j].lesson[k].activities[l]);		
					}
		    			 			                      
		   		 }
			}
		}
        if($scope.Activities.length){
            $scope.activityDataAvalibility = 0;
        }else{
        	 $scope.activityDataAvalibility = -1;
        }		
		if($scope.selection.selectedSub == "Writing Success"){		
	   		$scope.Activities = _.groupBy($scope.Activities, "alphabet_type");
	    }
    }

   $scope.generateActivity= function(courses){
     $scope.Activities =[];	   
     for(var i =0;i< courses.length;i++){            
            for(var j=0;j< courses[i].sections.length;j++){
                for(var k=0;k<courses[i].sections[j].lesson.length;k++){
                    for(var l=0;l<courses[i].sections[j].lesson[k].activities.length;l++){
                           if($scope.selection.selectedSub == "Writing Success"){
								if(courses[i].sections[j].lesson[k].activities[l].isactive){
									$scope.Activities.push(courses[i].sections[j].lesson[k].activities[l]);
								}								 
							}else{
								 $scope.Activities.push(courses[i].sections[j].lesson[k].activities[l]);
							}
                    }
                }
            }
         }
        if($scope.Activities.length){
            $scope.activityDataAvalibility = 0;
        }else{
        	 $scope.activityDataAvalibility = -1;
        }
	   if($scope.selection.selectedSub == "Writing Success"){		
	   		$scope.Activities = _.groupBy($scope.Activities, "alphabet_type");
	   }
    }

   $scope.isNoDataFound = function(key){
       return (_.findLastIndex($scope.Activities[key], {activity_type: $scope.selection.selectedAct}) === -1);
   };
   
    function setLocalVariable(){
    	var params ={'type':$scope.selection.selectedTab,'courseType':$scope.selection.selectedSub};
        localStorage.setItem("params",JSON.stringify(params))
    };
    
    initializeController();
}])

advancePubapp.controller('studentsInClassController', ['$scope', 'sfactory', '$rootScope', 'taskService','$state', '$stateParams','cacheService',function($scope, sfactory, $rootScope, taskService,$state,$stateParams,cacheService) {
    
    $scope.assignc = function(response){
        $scope.assigncontentToClassPage({'response':response});
    }
    
    /* Method to initialize Controller */
    function initializeController() {
        //setTableContent();
    };
    
    function setTableContent() {
        $scope.tableData = $scope.studentsList;
    }
    
    
    initializeController(); 
}]);
advancePubapp.controller('surveyController',['$scope','sfactory','$rootScope','taskService','$state','$stateParams','sessionService','encryptionService','$mdDialog','$filter',function($scope,sfactory,$rootScope,taskService,$state,$stateParams,sessionService,encryptionService,$mdDialog,$filter){ 
    
    var localTask,survey,questionHoverText;
    
    /* Method to add new Survey */
    $scope.addNewSurvey = function(value){
        if(!value){
            $scope.survey.title ='';
            $scope.changeCategory(0);
        }
        var params = (value === true) ? {type:'new'} : {type:''};
        $scope.survey.addNew = value;
        $state.transitionTo('adminLanding.survey',params,{
            location: true,
            inherit: true,
            relative: $state.$current,
            notify: false
        });
    };
    
    /*Method to delete Survey*/
    $scope.deleteSurvey = function(index){
        var confirm = $mdDialog.confirm()
              .title('Are you sure you want to delete the survey?')
              .textContent('')
              .ariaLabel('Lucky day')
              .targetEvent()
              .ok('Ok')
              .cancel('Cancel');
                $mdDialog.show(confirm).then(function() {
                    dataRequest={surveyid : $scope.survey.list[index].id};
                    sfactory.serviceCall(dataRequest,tasks.deleteSurvey,'listDetails').then(function(response) {
                        if($filter('lowercase')(response.status) === 'success'){
                            $scope.survey.list.splice(index, 1);
                            showBanner(response.message,response.status);
                            $rootScope.appLoader = false;
                        }
                    }, function(error) {
                        sfactory.localService(localTask).then(function(response) {
                           $scope.survey.list.splice(index, 1);
                           showBanner(response.message,response.status);
                        }, function(error) {});
                    });
                }, function() {
                   
                });
    };
    
    /* Method to select the category */
    $scope.changeCategory = function(index){
       angular.forEach($scope.survey.categories,function(category,categoryIndex){
           category.isSelected = (index === categoryIndex);
       });
       survey.selectedType = $scope.survey.categories[index];
    };
    
    /* Method to show notification */
    function showBanner(message,status){
        var banerData = {};
        banerData.message = message;
        banerData.banerClass = ($filter('lowercase')(status) === 'success') ? 'alert-success' : 'alert-danger';
        banerData.showBaner=true;
        $scope.alertBaner = angular.copy(banerData);
    };
    
        /* Method to check the availibility of selected category */
    $scope.checkAvalibility = function(index){
       var surveyList = _.filter($scope.survey.list, function(survey){ return survey.categoryName== $scope.survey.list[index].categoryName && $scope.survey.list[index].id !== survey.id;});
        var activityStatusObject = _.countBy(_.pluck(surveyList, 'enable'), function(value) {
            return value === true ? 'true' : 'false';
        });
        if(activityStatusObject.true > 0){
            var confirm = $mdDialog.confirm()
              .title('Already \''+surveyList[0].title+'\' is enabled for category - \''+surveyList[0].categoryName+'\' .Do you want to change it now?')
              .textContent('')
              .ariaLabel('Lucky day')
              .targetEvent()
              .ok('Ok')
              .cancel('Cancel');
                $mdDialog.show(confirm).then(function() {
                    changeSurveyStatus(index,true);
                }, function() {
                   $scope.survey.list[index].enable = false; 
                });
        }
        else{
            changeSurveyStatus(index,false);
        }
    };
    
    /* Method to enable or disable survey*/
    function changeSurveyStatus(index,isOverwrite){
        var selectedSurvey = $scope.survey.list[index];
        dataRequest={
            surveyid : selectedSurvey.id,
            enable : selectedSurvey.enable
        };
        sfactory.serviceCall(dataRequest,tasks.enableSurvey,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) === 'success' && isOverwrite){
                angular.forEach($scope.survey.list,function(survey,surveyIndex){
                    if(surveyIndex !== index && survey.categoryName === selectedSurvey.categoryName){
                        survey.enable = false;
                    }
                });
            }
            showBanner(response.message,response.status);
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService(localTask).then(function(response) {
                if(isOverwrite){
                    angular.forEach($scope.survey.list,function(survey,surveyIndex){
                        if(surveyIndex !== index && survey.categoryName === selectedSurvey.categoryName){
                            survey.enable = false;
                        }
                    });
                }
            }, function(error) {});
        });
    };
    
    /* Method to view or edit Survey */
    $scope.viewEditSurvey = function(index,param){ 
        var categoryIndex = _.findLastIndex($scope.survey.categories, {id: $scope.survey.list[index].categoryId});
        $scope.changeCategory(categoryIndex);
        sessionService.set('surveyDetails',encryptionService.encrypt(JSON.stringify($scope.survey.categories)));
        $state.go('adminLanding.surveyDetails',{type:param,id:$scope.survey.list[index].id});
    };
    
    /* Method to add new Survey */
    $scope.addSurvey = function(){                                          sessionService.set('surveyDetails',encryptionService.encrypt(JSON.stringify({title:$scope.survey.title,type:survey.selectedType})));
        $state.go('adminLanding.surveyDetails',{type:'add'});
    };
    
    /* Method to show hover text */
    $scope.hoverIn = function(index){
        angular.forEach($scope.survey.question.showDescription,function(description,descriptionIndex){
            $scope.survey.question.showDescription[descriptionIndex] = (descriptionIndex === index);
        });
        $scope.survey.question.description[index] = (index === 0) ? questionHoverText.thumbs : questionHoverText.rating;
    };
    
    /* Method to hide hover text */
    $scope.hoverOut = function(index){
        $scope.survey.question.showDescription[index] = false;
    };

    /* Method to get Survey list */
    function getSurveyList(){
        var categorySectionIndex = 0;
        sfactory.serviceCall(dataRequest,tasks.getSurveyList,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) === 'success'){
                $scope.survey.list = response.data.surveys;
                $scope.survey.categories = response.data.categories;
                survey.selectedType = $scope.survey.categories[0];
                $scope.survey.addNew = ($stateParams.type === 'new');
                if(sessionService.get('surveyDetails') !== null && $stateParams.type === 'new'){
                    var surveyDetails = angular.fromJson(encryptionService.decrypt(sessionService.get('surveyDetails')));
                    $scope.survey.title = surveyDetails.title;
                    categorySectionIndex = _.findIndex($scope.survey.categories, {id:surveyDetails.type.id});
                }
                $scope.survey.categories[categorySectionIndex].isSelected = true;
            }
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService(localTask).then(function(response) {
                $scope.survey.list = response.data.surveys;
                $scope.survey.categories = response.data.categories;
                survey.selectedType = $scope.survey.categories[0];
                $scope.survey.addNew = ($stateParams.type === 'new');
                if(sessionService.get('surveyDetails') !== null && $stateParams.type === 'new'){
                    var surveyDetails = angular.fromJson(encryptionService.decrypt(sessionService.get('surveyDetails')));
                    $scope.survey.title = surveyDetails.title;
                    categorySectionIndex = _.findIndex($scope.survey.categories, {id:surveyDetails.type.id});
                }
                $scope.survey.categories[categorySectionIndex].isSelected = true;
            }, function(error) {});
        });
    };
    
    /* Method to initialize the controller*/
    function initializeController(){
        localTask = 'survey';
        dataRequest={};
        questionHoverText={thumbs:'Default First Question answers will be thumbs up and down',rating:'Default answers will be the rating choice'};
        tasks = taskService.getTasks('surveyController');
        $scope.survey={addNew: $stateParams.index === 'new',viewAll:true,question:{}};
        survey={};
        getSurveyList();
    };
    
    initializeController();
}]);
advancePubapp.controller('surveymanagementControllerbk',['$scope','sfactory','$mdDialog','$rootScope','$filter',function($scope,sfactory,$mdDialog,$rootScope,$filter){ 

    var banerData,questionTypeOptions,surveyServices,localTask,newQuestions; 
    /* Method called when click on new survey */
    $scope.addNewSurvey= function(){
        $scope.survey.completed = false;
        $scope.survey.newSurvey.addNew = true;
        $scope.survey.newSurvey.isEditable = false;
        $scope.survey.newSurvey.title="";
        $scope.survey.view =false;
        $scope.editIndex = null;
        $scope.toggle = {};
    }; 
    
    /* Method called on cancel click */
    $scope.cancel = function(){
        $scope.survey.newSurvey.isEditable  =false;
        $scope.survey.completed = true;
        $scope.survey.newSurvey.addNew = false;
        $scope.toggle = {};
        $scope.survey.addQuestionToSurvey = false;
    };
    
    /* Method to verify the new survey name*/
    $scope.verifySurveyName = function(){
        var serviceDataReq ={title:$scope.survey.newSurvey.title};
        sfactory.serviceCall(serviceDataReq, surveyServices.surveyExist,surveyServices.type).then(function(response) {
            if(angular.isDefined(response)){
                if($filter('lowercase')(response.status) === 'success'){
                   selectQuestionType();
                }
                else{
                    showBanner(response.message,response.status);
                    $scope.survey.newSurvey.title ="";
                }
            }
            $rootScope.appLoader = false;
        }, function(error) {
                sfactory.localService(localTask).then(function(response) {
                    selectQuestionType();
                }, function(error) {
                });
            }); 
    };
    
    /* Method to open list when click on edit button */
    $scope.editQuestion = function(index){
        $scope.toggle['list'+(index+1)] = angular.copy(!$scope.toggle['list'+(index+1)]);
        $scope.form.survey.save.$setPristine();
        $scope.form.survey.save.$setUntouched();
        
    };
    
    /* Method to start adding new questions to the survey */
     function selectQuestionType(){
        $scope.editSurveyData={title:angular.copy($scope.survey.newSurvey.title),questions:[]};
        $scope.survey.newSurvey.isEditable = true;
        $scope.survey.newSurvey.addNew = false;
    };
    
    /* Method to open edit survey screen*/
    $scope.editSurvey= function(index){
        if($scope.surveyData.surveys[index].users_count !== 0) { return false;};
        $scope.editIndex=index;
        $scope.survey.newSurvey.isEditable = true;
        $scope.survey.addQuestionToSurvey = false;
        $scope.editSurveyData = angular.copy($scope.surveyData.surveys[index]);
        
        $scope.isActive = false;
        $scope.isActive = !$scope.isActive;
    };
  
    /* Method to show view survey screen*/
    $scope.viewSurvey = function(index){
        $scope.survey.completed = false;
        $scope.survey.view = true;
        $scope.viewIndex = index;
    };
    
    /* Method to exit view survey screen*/
    $scope.exitViewSurvey = function(){
        $scope.survey.completed = true;
        $scope.survey.view = false;
    };
    
    /* Method to close notification banner*/
    $scope.closeBaner = function(){
        $scope.alertBaner.showBaner = false;
    };
    
    /* Method to show notification */
    function showBanner(message,status){
        banerData.message = message;
        banerData.banerClass = ($filter('lowercase')(status) === 'success') ? 'alert-success' : 'alert-danger';
        banerData.showBaner=true;
        $scope.alertBaner = angular.copy(banerData);
    }
    
    /* Method to add new questions to the display area */
    function addToDisplay(newQuestion){
        var questionObj ={},item ={};
        newQuestion.quest_options=[];
        _.each(newQuestion.options,function(obj,index){
            item.id=index;
            item.title=obj;
            newQuestion.quest_options.push(item);
            item={};
        });
        questionObj.type_id = newQuestion.quest_type ;
        questionObj.title = newQuestion.quest_title;
        questionObj.options =newQuestion.quest_options;
        $scope.editSurveyData.questions.push(questionObj);
    };
    
     /* Method to add new survey*/
    $scope.addNewQuestion = function(){
        var newQuestion={};
        $scope.survey.addQuestionToSurvey = true;
        $scope.survey.addQuestionToSurvey = false;
        newQuestion.quest_title = $scope.survey.newSurvey.newquestion.question;
        newQuestion.quest_type =  _.find($scope.surveyData.questionstypes, function(obj){ return obj.type == $scope.survey.newSurvey.newquestion.questionType;}).id;
        newQuestion.options=_.pluck($scope.survey.newSurvey.newquestion.optnsCount,'value');
        addToDisplay(newQuestion);
        $scope.survey.newSurvey.newquestion ={};
    };
    
    /* Method to save new survey*/
    $scope.saveSurvey = function(){
        if(_.isNull($scope.editIndex)){
            saveNewSurvey();
        }
        else{
            saveEditedSurvey();
        }
    };
    
    function saveEditedSurvey(){
        $scope.survey.addQuestionToSurvey = false;
        var item={},data;
        var updatedData = angular.copy($scope.editSurveyData);
        var serviceDataReq = {
            id:updatedData.id,
            title:updatedData.title,
            questions:[]
        }
        _.each($scope.surveyData.surveys[$scope.editIndex].questions,function(obj,index){
            if(!_.isEqual(obj, $scope.editSurveyData.questions[index])){
                data =angular.copy($scope.editSurveyData.questions[index]);
                item.id = data.id;
                item.type_id = data.type_id;
                item.title = data.title;
                item.options = data.options;
                serviceDataReq.questions.push(item);
                item={};
            }
        });
        for(var i=$scope.surveyData.surveys[$scope.editIndex].questions.length;i<$scope.editSurveyData.questions.length;i++){
            var question = angular.copy($scope.editSurveyData.questions[i]);
            item.id = 0;
            item.type_id = question.type_id;
            item.title=question.title;
            item.options = _.pluck(question.options,'title');
            serviceDataReq.questions.push(item);
            item={};
        }
        sfactory.serviceCall(serviceDataReq , surveyServices.editSurvey,surveyServices.type).then(function(response) {
            if(angular.isDefined(response)){
                showBanner(response.message,response.status);
                if($filter('lowercase')(response.status) === 'success'){
                    $scope.surveyData.surveys[$scope.editIndex] = angular.copy(response.data);
                    $scope.cancel();
                }
            }
            $rootScope.appLoader = false;
        }, function(error) {
                $scope.surveyData.surveys[$scope.editIndex] = $scope.editSurveyData;
                $scope.cancel();
            });
    };
    
    /* Method to save new survey*/
    function saveNewSurvey(){
        var serviceDataReq = angular.copy($scope.editSurveyData);
        _.each(serviceDataReq.questions,function(obj){
            obj.options = _.pluck(obj.options,'title');
        })
        sfactory.serviceCall(serviceDataReq , surveyServices.addSurvey,surveyServices.type).then(function(response) {
            if(angular.isDefined(response)){
                showBanner(response.message,response.status);
                if($filter('lowercase')(response.status) === 'success'){
                    $scope.surveyData.surveys.push(response.data);
                    $scope.cancel();
                }
            }
            $rootScope.appLoader = false;
        }, function(error) {
                $scope.surveyData.surveys.push($scope.editSurveyData);
                $scope.cancel();
            });
    };

    $scope.showNewQuestionForm = function(){
        $scope.survey.newSurvey.newquestion={};
        $scope.survey.addQuestionToSurvey=true;
    };
    
    $scope.cancelAddQuestion= function(){
        $scope.survey.addQuestionToSurvey=false;
    };
    
    /* Method to delete survey or delete question from a survey*/
    $scope.delete = function(index, type) {
        if($scope.surveyData.surveys[index].users_count !== 0) { return false;};
        var confirm = $mdDialog.confirm()
            .title('Are you sure want to delete the ' + type + '?')
            .textContent('')
            .ariaLabel('Lucky day')
            .ok('Delete')
            .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                if(_.isNull($scope.editIndex) || angular.isDefined($scope.surveyData.surveys[$scope.editIndex].questions[index])){
                    deleteItem(index,type);
                }
                else{
                    $scope.editSurveyData.questions.splice(index, 1);
                }
            }, function() {
            });
    };
    
    function deleteItem(index,type){
            var serviceName = (type === 'Survey') ? surveyServices.deleteSurvey : surveyServices.deleteQuestion;
            var data = (type === 'Survey') ? {
                surveyid: $scope.surveyData.surveys[index].id
            } : {
                surveyid: $scope.surveyData.surveys[$scope.editIndex].id,
                questionid: $scope.surveyData.surveys[$scope.editIndex].questions[index].id
            };
            sfactory.serviceCall(data, serviceName, surveyServices.type).then(function(response) {
                if (angular.isDefined(response)) {
                    showBanner(response.message, response.status);
                    if ($filter('lowercase')(response.status) === 'success') {
                        if (type === 'Survey') {
                            $scope.survey.newSurvey.isEditable = false;
                            $scope.surveyData.surveys.splice(index, 1);
                        } else {
                            $scope.surveyData.surveys[$scope.editIndex].questions.splice(index, 1);
                            $scope.editSurveyData.questions.splice(index, 1);
                            if($scope.editSurveyData.questions.length === 0){
                                $scope.survey.newSurvey.isEditable = false;
                                $scope.survey.completed = true;
                                $scope.surveyData.surveys.splice($scope.editIndex, 1);
                            }
                        }
                    }
                }
                $rootScope.appLoader = false;
            }, function(error) {
                if (type === 'Survey') {
                    $scope.survey.newSurvey.isEditable = false;
                    $scope.surveyData.surveys.splice(index, 1);
                } else {
                    $scope.surveyData.surveys[$scope.editIndex].questions.splice(index, 1);
                    $scope.editSurveyData.questions.splice(index, 1);
                    if($scope.editSurveyData.questions.length === 0){
                        $scope.survey.newSurvey.isEditable = false;
                        $scope.survey.completed = true;
                        $scope.surveyData.surveys.splice($scope.editIndex, 1);
                    }
                }
            });
    };
    /* Method to display choice options according to the option count*/
    $scope.getOptionCount = function(){
        $scope.form.survey.save.$setPristine();
        $scope.form.survey.save.$setUntouched();
        $scope.survey.newSurvey.newquestion.optnsCount =[];
        var item={};
         var optnCount=_.find(questionTypeOptions, function(obj){ return obj.type === $scope.survey.newSurvey.newquestion.questionType;}).options;
        _.each(new Array(optnCount).fill(0),function(obj,index){
            item.name = index;
            item.value="";
            $scope.survey.newSurvey.newquestion.optnsCount.push(item);
            item={};
        });
    };
    
    /* Method to fetch survey details and question types on initial load*/
    function getSurveyList(){
         sfactory.serviceCall({}, surveyServices.surveyList,surveyServices.type).then(function(response) {
                if(angular.isDefined(response)){
                   $scope.surveyData = response.data;
                   $scope.questionType =_.pluck(response.data.questionstypes, "type");
                }
            $rootScope.appLoader = false;
        }, function(error) {
                sfactory.localService(localTask).then(function(response) {
                    $scope.surveyData = response.data;
                    $scope.questionType =_.pluck(response.data.questionstypes, "type");
                }, function(error) {
                });
        });
    };
    
    /* Method to initialize the controller*/
    function initilizeController(){
        $scope.form = {};
        $scope.survey={completed:true,new:false,addQuestionToSurvey:false,newSurvey:{isEditable:false}};
        $scope.isArray = angular.isArray;
        banerData = {message:'',showBaner:false,banerClass:''};
        
        //Variable to match the question type and option count
         questionTypeOptions = [
            {type : "Multi-Choice",options:4},
            {type : "Fill-In",options:0},
            {type : "Either-Option",options:2}
        ];
        
        //Varible to match webservices
        surveyServices ={
            surveyList      :'survey.survey_list',
            deleteSurvey    :'survey.delete_survey',
            deleteQuestion  :'survey.survey_remove_question',
            addSurvey       :'survey.add_survey',
            surveyExist     :'survey.survey_exist',
            editSurvey      :'survey.edit_survey',
            type            :'listDetails'
        };
        $scope.editIndex = null;
        $scope.toggle = {};
        //Local task initialization
        localTask = "survey";
        
        getSurveyList();
    };
    
    initilizeController();
}]);
advancePubapp.controller('surveyDetailsController',['$scope','sfactory','$rootScope','taskService','$state','$stateParams','sessionService','encryptionService','$filter',function($scope,sfactory,$rootScope,taskService,$state,$stateParams,sessionService,encryptionService,$filter){ 
    
    var localTask,dataRequest,tasks,questionHoverText;

    /* Method to add more questions to the Survey*/
    $scope.addMoreQuestions = function(){
        if($scope.survey.questions.length < 6){
            $scope.survey.questions.push({title:''});
            $scope.survey.showDescription.push(false);
            $scope.survey.description.push('');
        }
        else{
            $scope.alertBaner = {message:'Already maximum count 6 reached',banerClass:'alert-danger',showBaner:true};
        }
    };
    
    /* Method to show hover text */
    $scope.hoverIn = function(index){
        angular.forEach($scope.survey.showDescription,function(description,descriptionIndex){
            $scope.survey.showDescription[descriptionIndex] = (descriptionIndex === index);
        });
        $scope.survey.description[index] = (index === 0) ? questionHoverText.thumbs : questionHoverText.rating;
    };
    
    /* Method to hide hover text */
    $scope.hoverOut = function(index){
        $scope.survey.showDescription[index] = false;
    };
    
    /* Method to go back to Add new Survey page*/
    $scope.goBack = function(isClear,param){
        if(isClear){
           sessionService.empty('surveyDetails'); 
        }
        $scope.breadcrumbList.splice(-1,1);
        $state.go('adminLanding.survey',{type:param});
    };
    
     /* Method to select the category */
    $scope.changeCategory = function(index){
       angular.forEach($scope.survey.categories,function(category,categoryIndex){
           category.isSelected = (index === categoryIndex)
       });
    };
    
    /* Method to save the newly created or edited Survey*/
    $scope.saveSurvey = function(){
        var isNewSurvey = ($scope.surveyType == 'add');
        var task = (isNewSurvey) ? tasks.createSurvey : tasks.editSurvey;
        selectedCategory = (isNewSurvey) ? ($scope.survey.type.id) : (_.find($scope.survey.categories, function(category){ return category.isSelected === true; }).id) ;
        dataRequest={
                title : $scope.survey.title,
                category : selectedCategory,
                questions : $scope.survey.questions
        }
        if(!isNewSurvey){
            dataRequest.id = $scope.survey.id;
        }
        sfactory.serviceCall(dataRequest,task,'listDetails').then(function(response) {
                if($filter('lowercase')(response.status) === 'success'){
                    $scope.goBack(true,'');
                    $rootScope.appLoader = false;
                }
            }, function(error) {
                sfactory.localService(localTask).then(function(response) {
                    $scope.goBack(true,'');
                }, function(error) {});
        });
    };
    
    /* Method to get survey details*/
    function getContents(){
        if($stateParams.type === 'add'){
            $scope.survey = angular.fromJson(encryptionService.decrypt(sessionService.get('surveyDetails')));
            $scope.survey.questions = [{title:''}];
            $scope.survey.showDescription=[];
            $scope.survey.description=[];
            $scope.breadcrumbList.push($scope.survey.title);
        }
        else{
            dataRequest = {surveyId:$stateParams.id};
            sfactory.serviceCall(dataRequest,tasks.getSurvey,'listDetails').then(function(response) {
                if($filter('lowercase')(response.status) === 'success'){
                    $scope.survey = response.data;
                    $scope.survey.categories = angular.fromJson(encryptionService.decrypt(sessionService.get('surveyDetails')));
                    $scope.survey.showDescription=[];
                    $scope.survey.description=[];
                    angular.forEach(response.data.questions,function(question,index){
                        $scope.survey.showDescription[index] = false;
                        $scope.survey.description[index] = '';
                    });
                    $scope.breadcrumbList.push($scope.survey.title);
                }
                $rootScope.appLoader = false;
                }, function(error) {
                    sfactory.localService(localTask).then(function(response) {
                        $scope.survey = response.data.surveydetails;
                        $scope.survey.categories = angular.fromJson(encryptionService.decrypt(sessionService.get('surveyDetails')));
                        $scope.survey.showDescription=[];
                        $scope.survey.description=[];
                        angular.forEach(response.data.questions,function(question,index){
                            $scope.survey.showDescription[index] = false;
                            $scope.survey.description[index] = '';
                        });
                        $scope.breadcrumbList.push($scope.survey.title);
                    }, function(error) {});
                });
        }
        
    };
    
    /* Method to initialize the controller*/
    function initializeController(){
        localTask = 'survey';
        tasks = taskService.getTasks('surveyController');
        $scope.surveyType = $stateParams.type;
        $scope.survey={};
        $scope.surveyForm={};
        getContents();
        questionHoverText={thumbs:'Default First Question answers will be thumbs up and down',rating:'Default answers will be the rating choice'};
    };
    
    initializeController();
}]);
advancePubapp.controller('surveyresultsController', ['$scope', 'sfactory', '$rootScope', 'taskService','$state','$filter','sessionService','encryptionService', function($scope, sfactory, $rootScope, taskService,$state,$filter,sessionService,encryptionService) {

    /* method to redirect to content management page */
    $scope.goToContentPage = function() {
        $state.go('adminLanding.contentmanagement',{location: false});
    }
    
    /* Method to get Survey contents */
    function getData() {
        var surveyid = encryptionService.decrypt(sessionService.get('courseSurveyID'));
        localTask = 'surveyresult';
        dataRequest  = {surveyId: surveyid};
        sfactory.serviceCall(JSON.stringify(dataRequest), tasks.getSurveyResult, 'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
            $scope.surveyResult = response.data;
            }
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService(localTask).then(function(response) {
                $scope.surveyResult = response.data;
                $rootScope.appLoader = false;
            }, function(error) {});
        });
    };
    
    
    /* Method to initialize Controller */
    function initializeController() {
       tasks = taskService.getTasks('surveyresultsController');
       getData();
    };

    initializeController();
}]);
advancePubapp.controller('tabDialogController',['$scope','$mdDialog','$rootScope','$filter',function($scope,$mdDialog,$rootScope,$filter){ 
    
    $scope.cancel = function () {
        
    };
    
    /* Method to initialize the controller*/
    function initilizeController(){
    };
    
    initilizeController();
}]);
advancePubapp.controller('tabledirectiveController',['$scope','$filter','PaginationService','sfactory','getParamsDelete','$filter','$mdDialog','$rootScope','cacheService','messagingService','$state',function($scope,$filter,PaginationService,sfactory,getParamsDelete,$filter,$mdDialog,$rootScope,cacheService,messagingService,$state){
	var paginationObj;
    var notToRefresh = false,datatableSearchObj={};
	$scope.$watchCollection('datasource.data',function(newVal,oldVal){
        if(!notToRefresh && angular.isDefined(newVal)){
		  $scope.datasource.data = newVal;
		  $scope.paginateProcess(newVal);
          $scope.items = newVal;
        }
        else{
            notToRefresh = false;
        }
        if(angular.isDefined($scope.datatable) && angular.isDefined($scope.datatable.filterTable)){
            //$scope.datatable.filterTable($scope.tabName);
        }
	});
		
    /*Method to close add single/multi record while edit/delete/view */
	$scope.setParentvalues = function(response){
		$scope.closeregisteration({'response':true});
	};
	
    /* Method to toggle check all check boxes */
    $scope.processAllData = function(){ 
        var sourceData = ($scope.searchFiltereddata ? $scope.searchFiltereddata : ($scope.roleFiltereddata ? $scope.roleFiltereddata : $scope.datasource.data));
        if($scope.headerCheck.box){
            toggleCheckbool(sourceData,true);
        }
        else{
            toggleCheckbool(sourceData,false);
        }        
    };
     
    /* Method to delete all records */
    $scope.deleteAllrows = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
              var confirm = $mdDialog.confirm()
              .title('Are you sure you want to delete the '+ ev+'?')
              .textContent('')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Delete')
              .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {
            var task = $scope.datasource.ismultiDel.task;
            var view = $scope.datasource.ismultiDel.viewname;
            options = {val:[],title : []};
            $scope.sourceData = ($scope.searchFiltereddata ? $scope.searchFiltereddata : ($scope.roleFiltereddata ? $scope.roleFiltereddata : $scope.datasource.data));
            if($scope.headerCheck.box){
                _.each($scope.sourceData,function(body){
                    $scope.chkarrayall.push(body.id);
                    $scope.chkarrayalltitle.push(body.name);
                    $scope.selectedItems.push(body);
                });            
            }
            _.each($scope.sourceData,function(body){
                if(body.row_Checkbox){
                    $scope.selectedItems.push(body);
                    $scope.chkarrayall.push(body.id);
                    $scope.chkarrayalltitle.push(body.name);
                }    
                options.val=_.difference($scope.chkarrayall, $scope.chkarray);
                options.val=_.uniq(options.val);
                options.title=_.difference($scope.chkarrayalltitle, $scope.chkarraytitle);
                options.title=_.uniq(options.title);
            });    

            var deleteActionAll = getParamsDelete.args(view,options.val,options.title);
            sfactory.serviceCall(JSON.stringify(deleteActionAll.params),task,deleteActionAll.params.isAdmin).then(function(response){
                options = {val:[],title : []};
                $scope.chkarrayall = [];$scope.chkarrayalltitle = [];
                $scope.headerCheck.box = false;
                toggleCheckbool($scope.datasource.data,false);
                if($filter('lowercase')(response.status) == 'success'){
                    var deletableItems = [];
                        _.each(response.data.deletable,function(items){
							if(items){
								deletableItems.push(_.where($scope.sourceData, {'id':Number(items)}));
							}
                        });
                        if(deletableItems.length > 0){
                            _.each(deletableItems,function(selectedItems){
                                deleteUniq($scope.datasource.data, 'id', selectedItems[0].id); 
                            });
                        }
						if(angular.isDefined($scope.datatable) && angular.isDefined($scope.datatable.filterTable)){
                        	$scope.datatable.filterTable($scope.tabName);      
						}
                    if(typeof(response.data.non_deletable)!= "undefined" && response.data.non_deletable.length > 0){
                        var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
                        $scope.$emit('emitFromdeleteBaner',{'alertBaner':banerData});
                    }else{
                        var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
                        $scope.$emit('emitFromdeleteBaner',{'alertBaner':banerData});
                    }                    
                }
                else{
                    var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-warning'};
                    $scope.$emit('emitFromdeleteBaner',{'alertBaner':banerData});
                }
				$rootScope.appLoader = false;
            },function(error){
                $scope.headerCheck.box = false;
                toggleCheckbool($scope.datasource.data,false);
            });
        }, function() {
            $scope.headerCheck.box = false;
            toggleCheckbool($scope.datasource.data,false);
        });
    };

    $scope.breadcrumbFnlink = function(str, index){
       $scope.$emit('emitbreadcrumbFnlink', str, index);
    };
    
    $scope.tableDatafnlink=function(event,body,fuctionVal){
        event.preventDefault();
        $scope.classcatid = body;
        $scope.classcatid.fuctionVal =fuctionVal;
        $scope.$emit('emittableDataList',{'catergorydata':$scope.classcatid});
    };
    
    
    /* Method as callback for row click event */
    $scope.assignRow=function(event,body) {
		$(".trow").removeClass('rowselect');
		$(".selectrow"+body.id).addClass('rowselect');
        $scope.assignAdmin = body;
        //$scope.$emit('emitadmin',{'admindata':$scope.assignAdmin});
        var classmgmtscope = angular.element(jQuery("#classmanagementdetails")).scope();
        classmgmtscope.gatherValues($scope.assignAdmin);
    };
    /** Function for sending multi user message */
    $scope.sendMultiMessage = function(){
        messagingService.userIds = $scope.checkedChkBoxArr;
        console.log(messagingService.userIds);
        $state.go('adminLanding.adminmessage',{'msgtype': 1});
    };
    
    /* Method to toggle individual checkboxes */
    $scope.individual_check = function(body,head){
        var sourceData = ($scope.searchFiltereddata ? $scope.searchFiltereddata : ($scope.roleFiltereddata ? $scope.roleFiltereddata : $scope.datasource.data));
        if(body.row_Checkbox){
            if($scope.checkboxenable <= sourceData.length) {$scope.checkboxenable++;} 
            $scope.checkedChkBoxArr.push(body.id);
        }
        else{
            if($scope.checkboxenable > 0) {$scope.checkboxenable--;}
            $scope.checkedChkBoxArr = _.without($scope.checkedChkBoxArr, body.id);
            
        }
        var count = 0;
        _.each(sourceData,function(items){
            if(_.contains($scope.checkedChkBoxArr, items.id)){ 
                count++;
            }
        });
        if(count == sourceData.length){
            $scope.headerCheck.box = true;
        }else{
            $scope.headerCheck.box = false;
        }
        //$scope.activeCheckbox = true;
        $scope.activeCheckbox = !$scope.activeCheckbox;
    };

    
    /* Method to call paginationservice for page order */
    $scope.paginateProcess = function(data,page){
		//data = $filter('orderBy')(data, $scope.sortType, $scope.sortReverse);
        //$scope.pager = PaginationService.GetPager(data.length,page);// get pager object from service
        //$scope.items = data.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);// get current page of items
    };
    
    /* set page based on the data */
    $scope.setPage = function(page) {
        if (page < 1 || page > $scope.pager.totalPages) {
            return;
        }
        var data = ($scope.searchFiltereddata && $scope.searchFiltereddata.length > 0) ? $scope.searchFiltereddata : ($scope.roleFiltereddata ? $scope.roleFiltereddata : $scope.datasource.data);
        $scope.sortedData = $filter('orderBy')(data, $scope.sortType, $scope.sortReverse);
        $scope.paginateProcess($scope.sortedData,page);
    };

    /* search result using filter */
    $scope.updateSearch = function(searchedText,data){
		var dataTofilter = (data ? data : ($scope.roleFiltereddata ? $scope.roleFiltereddata : $scope.datasource.data));
        var pluckedData = [],searchedData={},filterObj={},tableRow={};
		$scope.rectifiedData = [];
		_.each(dataTofilter,function(item){
			tableRow = {};
            angular.forEach(datatableSearchObj[$scope.datasource.pageName].values, function(value, key) {
                tableRow[value] = item[value];
            });
            $scope.rectifiedData.push(tableRow);
		});
       searchedData = $filter('filter')($scope.rectifiedData, searchedText);
		_.each(searchedData,function(item){
            filterObj={};
            filterObj[datatableSearchObj[$scope.datasource.pageName].key] = item[datatableSearchObj[$scope.datasource.pageName].key];
			pluckedData.push( _.where(dataTofilter,filterObj)[0]);
		});
		$scope.searchFiltereddata = pluckedData;
		$scope.paginateProcess($scope.searchFiltereddata);
        $scope.isSearched = true;
    };
    
    /* Method to filter based on the button actioons */
   if(typeof($scope.datatable) != "undefined"){
            $scope.datatable.filterTable = function(selectedOption, body, isDelete){
            _.each($scope.datasource.tabList,function(item){                
                item.isActive = false;
            });
            selectedOption.isActive = true;
            if(!angular.isDefined(selectedOption.name)){
				selectedOption.name = angular.copy($scope.tabName.name);
				$scope.tabName.isActive = true;
                notToRefresh = true;
            }
			else{             
				selectedOption.isActive = true;
				$scope.tabName = selectedOption;
                _.each($scope.datasource.tabList,function(item){
                    //method for default all option need to check
					if(item.name == selectedOption.name){
						item.isActive = true;
					}else{
						item.isActive = false;
					}
				});
			} 
            var mapbtnRole = {'group admin':'admin',student:'Student',teacher:'Teacher',parent:'Parent',all:'All'};
            var datatTofilter = $scope.isSearched ? $scope.searchFiltereddata : $scope.datasource.data;
			if($scope.datasource.pageName == 'usermanagement' || $scope.datasource.pageName == 'usermanagementtrash'){
				$scope.roleFiltereddata = ((selectedOption.name.toLowerCase() != 'all' && ($scope.datasource.pageName == 'usermanagement' || $scope.datasource.pageName == 'usermanagementtrash') ) ? $filter('filter')($scope.datasource.data, {roleType:mapbtnRole[selectedOption.name.toLowerCase()]}) : $scope.datasource.data);
				
				//Method non active users
				$scope.roleFiltereddata = (selectedOption.name == "Non-Active") ? $scope.roleFiltereddata = $filter('filter')($scope.roleFiltereddata,{useractivated:false}) : $scope.roleFiltereddata = $filter('filter')($scope.roleFiltereddata,{useractivated:true}); 
			}
            if(!isDelete && $scope.dataSearch.text != null) $scope.updateSearch($scope.dataSearch.text,$scope.roleFiltereddata);
            else {
                var dataTofilter = ($scope.searchFiltereddata ? $scope.searchFiltereddata : ($scope.roleFiltereddata ? $scope.roleFiltereddata : $scope.datasource.data));
                $scope.paginateProcess(dataTofilter);
            }
            $scope.updatecheckBox(dataTofilter);
        }
    };
   
   $scope.updatecheckBox = function(data){
	   if(angular.isDefined(data)){
		   var cnt = 0;
		   $scope.headerCheck.box = false;
			_.each(data,function(items){
				if(angular.isArray($scope.checkedChkBoxArr)){
					if(_.contains($scope.checkedChkBoxArr, items.id)){ 
						cnt++;
					}
				}
			});
			if(data.length != 0){
				if(cnt == data.length){
					$scope.headerCheck.box = true;
				}
			}
	   }
    };
    
    /* Method to set sort order */
    $scope.setSortorder = function(head,index){
        $scope.pageChanged($scope.paginationdata.currentPage,null,head.bind_val,"toggle");
        $scope.isSortAsc = !($scope.isSortAsc);
    };
    
    /* Method to change the pagination */
    $scope.pageChanged = function(currentPage,filterby,sortCoulmn,sortOrder,issearchclicked){
        paginationObj = {
			   //filterby  : (typeof filterby == "undefined") ? "": filterby,	
			   filterby  : (typeof filterby != "undefined") ? filterby: (angular.isDefined(paginationObj) && angular.isDefined(paginationObj.filterby) && paginationObj.filterby !="") ? paginationObj.filterby :"",	
               itemsPerpage:($scope.pagination.itemsPerPage.value !== 'All') ? $scope.pagination.itemsPerPage.value : "",
               currentPage:angular.isDefined(currentPage) ? currentPage : $scope.paginationdata.currentPage,
               searchQuery:($scope.dataSearch.text !== null ) ? $scope.dataSearch.text : "",
               searchTable:($scope.dataSearch.text && issearchclicked) ? true : false
        };
        var paginationData = [{filterby:filterby},{sortCoulmn:sortCoulmn},{sortOrder:sortOrder}];
        angular.forEach(paginationData,function(obj){
            var key = Object.keys(obj)[0];
            if(angular.isDefined(obj[key]) && obj[key] !== null)
               paginationObj[key] = obj[key];
        })
        $scope.getSourcedata({response : paginationObj});
    }; 

    /* Method to filter table */
    $scope.filterTable = function(tab){
		//filter table
		$scope.headerCheck.box = false;
		$scope.checkboxenable = 0;
		//filter table
		$scope.selectedFilterTab = tab.name; 
        var userRole = _.find(cacheService.get('userroles'), function(userRole){ return userRole.rolname == tab.name;});
        var roleId = angular.isDefined(userRole) ? userRole.roleid : "";
        $scope.pageChanged(1,roleId,"name","desc");
        angular.forEach($scope.datasource.tabList,function(tabItem){
            tabItem.isActive = (tabItem.name === tab.name)
        });
    };
     
    $scope.searchItems = function(){
		filterby  = (angular.isDefined(paginationObj.filterby && paginationObj.filterby != "")) ? paginationObj.filterby: null;
		$scope.pageChanged($scope.paginationdata.currentPage,filterby,null,null,true);
        //$scope.pageChanged($scope.paginationdata.currentPage,null,null,null,true);
    };
    
    /* Method to capture emitted values from deep child directive */
    $scope.captureBaner = function(value){
        var banerData = {'message':value.message,'showBaner':value.showBaner,'banerClass':value.banerClass};
        var deltedData = value.contentItems ? value.contentItems : null;
        if(deltedData != null){
            var curItemIndex = $scope.items.indexOf(deltedData);
            if(curItemIndex > -1) {
                $scope.items.splice(curItemIndex,1); 
            }    
        }
        $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData,'list':value.switchMenu});
    };
    
    /* Method to toggle individual check box bool based on overall checkbox status */
    function toggleCheckbool(sourceData,bool){
        _.each(sourceData,function(items){
            items.row_Checkbox = bool; 
            if(bool) $scope.checkedChkBoxArr.push(items.id);
            else $scope.checkedChkBoxArr = _.without($scope.checkedChkBoxArr, items.id); 
        });
        if(bool) $scope.checkboxenable = sourceData.length;
        else if(!bool) $scope.checkboxenable = 0;
    };
    
    /* Method to initiate properties */
    function initiateController(){
        //properties for sort table
        //$scope.paginationdata = {currentPage:1};
        $scope.chkarrayall = [];
        $scope.pagination ={
            numPages : [{value:10,isSelected:true},{value:20,isSelected:false},{value:50,isSelected:false},{value:100,isSelected:false},{value:'All',isSelected:false}]
        };
        $scope.chkarray=[];
        $scope.isSortAsc = false;
        $scope.chkarrayalltitle = [];
        $scope.chkarraytitle=[];
        $scope.checkboxenable = 0;
        $scope.selectedItems = [];
        $scope.checkedChkBoxArr = [];
        var options = {};
        $scope.assignAdmin={};
        var sourceData = null;
        $scope.dataSearch = {'text':null};
        $scope.sortType     = $scope.datasource.sortType; // set the default sort type
        $scope.sortReverse  =  $scope.datasource.sortReverse ? $scope.datasource.sortReverse : true;  // set the default sort order
        $scope.headerCheck ={box:false};
        $scope.radio = {model : 'All'};
        $scope.tabName = {isActive:true,name:"All"};
        /* pagination properties initialized */
        $scope.paginateRange = _.range(1, $scope.datasource.data.length); // dummy array of items to be paged
        $scope.pager = {};
        $scope.setPage(1);
    	$scope.rectifiedData = []; 
        datatableSearchObj ={
                usermanagement:{
                    key:'username',
                    values:['name','username','roleType','email']
                },
				usermanagementtrash:{
					key:'username',
                    values:['name','username','registerdate','roleType']
				},
                groupmanagement:{
                    key :'groupname',
                    values:['groupname','groupcode','groupadminname','registerdate']
                },
                classmanagement:{
                    key :'name',
                    values:['name','classcode','roleType','class_admin','groupname','registerdate','course_count','user_count']
                },
                classadminmanagement:{
                    key:'name',
                    values:['name','username','usertype']
                },
                classusermanagement:{
                    key:'name',
                    values:['name','username']
                },
                classuserviewmanagement:{
                    key:'name',
                    values:['name','username','usertype','email','phone_no']
                },
                classcoursemanagement:{
                    key:'coursename',
                    values:['coursename','description','category_name']
                },
                content:{
                    key:'name',
                    values:['name','coursecnt','lessoncnt','activitycnt']
                },
                course:{
                    key:'name',
                    values:['name','summary','feetype']
                },
                section:{
                    key:'name',
                    values:['name','summary']
                },
                activity:{
                    key:'name',
                    values:['name','summary']
                },
                userreport:{
                    key:'username',
                    values:['firstname','lastname','usertype','username','groupname','status','created','lastlogin','lastip']
                },
                socialreport:{
                    key:'media_type',
                    values:['media_type','total_shares','facebook_shares','twitter_shares','google_shares','instagram_shares']
                },
                classreport:{
                    key:'classname',
                    values:['classname','class_admin','enrolled_count','status','date']
                },
                numbersuccesstable:{
                    key:'label',
                    values:['label','no_of_enrolled_users','no_of_activities','no_of_students_completed','no_of_visits','no_of_shares','time_spent']
                },
                writingsuccesstable:{
                    key:'label',
                    values:['label','no_of_enrolled_users','no_of_activities','no_of_students_completed','no_of_visits','no_of_shares','time_spent']
                },
                readingsuccesstable:{
                    key:'label',
                    values:['label','no_of_enrolled_users','no_of_activities','no_of_students_completed','no_of_visits','no_of_shares','time_spent']
                },
                phonicsreportstable:{
                    key:'label',
                    values:['label','no_of_enrolled_users','no_of_activities','no_of_students_completed','no_of_visits','no_of_shares','time_spent']
                },
                comparativereportstable:{
                    key:'label',
                    values:['label','no_of_activities','no_of_students_completed','no_of_visits','no_of_shares','time_spent']
                },
        };
    };
    
    initiateController();
    
}]);



/* Method to delete values from array */
var deleteUniq = function(arr, attr, value){
    var i = arr.length;
    while(i--){
       if( arr[i] 
           && arr[i].hasOwnProperty(attr) 
           && (arguments.length > 2 && arr[i][attr] === value ) ){ 
           arr.splice(i,1);
       }
    }
    return arr;
};

advancePubapp.animation('.rm_bx_bor', function($animate) {
  return {
    enter: function(element, done) {
        var selectorElem = $(element).attr('selectorElem');
        var container = $('body');
        $(".close_btn_act").css("pointer-events","none");
        element.animate({"max-height":"3000"},1500,function(){
            var offset_top = $('#'+selectorElem).offset().top;
            $(".close_btn_act").css("pointer-events","auto");
            container.stop().animate({
                scrollTop: offset_top - 60
            },500);
        });
    },
    leave: function(element, done) {
        if(document.getElementsByClassName("animate_slider").length === 0){
			var selectorElem = $(element).attr('selectorElem');
			var container = $('body');
			element.css('overflow','hidden');
			element.animate({"max-height":"0"},500,function(){
				element.hide();
				var offset_top = $('#'+selectorElem).offset().top;
				container.stop().animate({
					scrollTop: offset_top - 60
				},500);
			});
		}
        else{
			element.hide();
		}
    }
  };
});


advancePubapp.animation('.animate_slider', function($animate) {
 return {
    enter: function(element, done) {
        window.scrollTo(0,0);
        element.css('display','inline-block');
        element.animate({"max-height":'3000px'},500,function(){
        element.css('overflow','visible');
        element.css('display','table');
        });
        
    },
    leave: function(element, done) {
        element.css('overflow','hidden');
        element.css('display','inline-block');
        element.slideUp();
        element.animate({"max-height":'0'},500);
        window.scrollTo(0,0);
    }
  };
});

advancePubapp.animation('.animate_slider_cont', function() {
 return {
    enter: function(element, done) {
        element.css('display','inline-block');
        element.animate({"max-height":'3000px'},500,function(){
            element.css('overflow','visible');
        });
        
    },
    leave: function(element, done) {
        element.css('overflow','hidden');
        element.slideUp();
        element.animate({"max-height":'0'},500);
    }
  };
});



    
  
    
    
    
    
advancePubapp.controller('tableTemplateController',function($scope){
});
advancePubapp.controller('useranalyticsController', ['$scope', '$http', 'sfactory','$log','$uibModal', '$document','$timeout','reportService','$rootScope','$filter','$stateParams','sessionService','encryptionService',function($scope, $http, sfactory, $log,$uibModal, $document,$timeout,reportService,$rootScope,$filter,$stateParams,sessionService,encryptionService) {
    var chartProperties,reportDataReq,chartArray; 
    
    /* Method to fetch overall user reports */
    function getReportsData(reportDataReq) {
        inputreq = JSON.stringify($scope.reportparams);
        sfactory.serviceCallReports(inputreq, 'userreportsdata').then(function(response) {
            if(angular.isDefined(response)){
                if($filter('lowercase')(response.status) == 'success'){
                    $scope.tableData.data =response.data.users_report;
                    _.each($scope.tableData.data, function(item){
                        var createDate = moment.utc(item.created).local();                        
                        item.created = moment(createDate).format("MM/DD/YYYY HH:mm:ss");                        
                        if(item.lastlogin == "00/00/0000 00:00:00"){
                            item.lastlogin = "NA";
                        }else{
                            var lastLogin = moment.utc(item.lastlogin).local();                        
                            item.lastlogin = moment(lastLogin).format("MM/DD/YYYY HH:mm:ss");
                        }
                    });
                    $scope.users.reports =response.data;
                    $rootScope.appLoader = false;
                }
            }
        }, function(error) {
            var localTask = "reportdata";
            sfactory.localService(localTask).then(function(response) {
                $scope.tableData.data =response.data.users_report;
                _.each($scope.tableData.data, function(item){
                    var createDate = moment.utc(item.created).local();                        
                    item.created = moment(createDate).format("MM/DD/YYYY HH:mm:ss");                        
                    if(item.lastlogin == "00/00/0000 00:00:00"){
                        item.lastlogin = "NA";
                    }else{
                        var lastLogin = moment.utc(item.lastlogin).local();                        
                        item.lastlogin = moment(lastLogin).format("MM/DD/YYYY HH:mm:ss");
                    }
                });
                $scope.users.reports =response.data;
            }, function(error) {
            });
        });
    };
     
    $scope.getAnalyticsData = function(){
        $scope.isAnalytics = true;
        inputreq = JSON.stringify($scope.reportparams);
        sfactory.serviceCallReports(inputreq, 'useranalyticsdata').then(function(response) {
            if(angular.isDefined(response)){
                if($filter('lowercase')(response.status) == 'success'){
                    $scope.users.analytics =response.data;
                    loadCharts();
                    $rootScope.appLoader = false;
                }
            }
        }, function(error) {
            var localTask = "reportdata";
            sfactory.localService(localTask).then(function(response) {
                $scope.users.analytics =response.data;
                loadCharts();
            }, function(error) {
            });
        });
        
    };
    
    function loadCharts() {
        //Load Pie Charts
        $scope.registeredUsers = reportService.loadPiechart($scope.users.analytics.count_of_usertypes_in_site,'Registered Users at Sommer Learning');
        $scope.userEnrollment = reportService.loadPiechart($scope.users.analytics.enrollments,'Enrolled and Self Enrolled Students');

        var trafficData = ($scope.traffic.byDevice) ? $scope.users.analytics.source_of_traffic.by_device : $scope.users.analytics.source_of_traffic.by_channel;
        $scope.sourceOfTraffic = reportService.loadPiechart(trafficData,'Source Of Traffic');
//        $scope.conversionRatio=reportService.loadChart($scope.users.analytics.conversion_ratio,$scope.users.analytics.conversion_ratio.title);
        $scope.channelTriggeredData= $scope.users.analytics.channel_triggered_users_visit;
        $scope.usersAnalyticsByGeo.data = $scope.users.analytics.by_geo;
        /*$timeout(function(){
			loadMap($scope.users.analytics.by_geo);
		},2000);*/
    };

    /*function loadMap(geoUsers) {
        google.charts.load('current', {
            'packages': ['geochart']
        });
        google.charts.setOnLoadCallback(drawRegionsMap);
        function drawRegionsMap() {
            var data = google.visualization.arrayToDataTable(geoUsers);
            var options = {
                showTooltip: true,
                showInfoWindow: true,
                colorAxis: {colors: ['#FF0000','#09a709']},
                datalessRegionColor:'lightgrey'
            };
            var chart = new google.visualization.GeoChart(document.getElementById('geography-map'));
            chart.draw(data, options);
        }
    };*/
    
    $scope.changeTrafficData = function(){
        var trafficData = ($scope.traffic.byDevice) ? $scope.users.analytics.source_of_traffic.by_device :$scope.users.analytics.source_of_traffic.by_channel;
        $scope.sourceOfTraffic.change(reportService.loadPiechart(trafficData,'Source of Traffic'));
    };
   
   
     function updateCharts(startDate,endDate) {
        if (startDate && endDate) {
            var dateObj= {};
            dateObj.startDate = startDate;
            dateObj.endDate = endDate;
			var selectedStartmonth = new Date(dateObj.startDate).getMonth()+1;
			var selectedEndmonth = new Date(dateObj.endDate).getMonth()+1;
			var requestData = JSON.stringify({
                'start_date': startDate,
                'end_date': endDate,
                'group_id'  : $scope.reportparams.group_id,
                'user_id': $scope.reportparams.user_id
            });
            
            sfactory.serviceCallReports(requestData, 'useranalyticsdata').then(function(response) {
                if($filter('lowercase')(response.status) == 'success'){
                    $timeout(function(){
					/*loadMap(response.data.by_geo);*/
                    $rootScope.appLoader = false;
				},2000);
                    $scope.usersAnalyticsByGeo.change(response.data.by_geo);
                    $scope.usersAnalyticsByGeo.data = response.data.by_geo;
                    
                    $scope.userEnrollment.change(reportService.loadPiechart(response.data.enrollments,'Enrolled and Self Enrolled Students'));
                    $scope.userEnrollment.data = response.data.enrollments;
                    
                    $scope.registeredUsers.change(reportService.loadPiechart(response.data.count_of_usertypes_in_site,'Registered Users at Sommer Learning'));
                    $scope.registeredUsers.data = response.data.count_of_usertypes_in_site;
                    
                    var sourceData = $scope.traffic.byDevice ? response.data.source_of_traffic.by_device :response.data.source_of_traffic.by_channel;
                    $scope.users.analytics.source_of_traffic.by_device = response.data.source_of_traffic.by_device;
                    $scope.users.analytics.source_of_traffic.by_channel = response.data.source_of_traffic.by_channel;
                    $scope.sourceOfTraffic.change(reportService.loadPiechart(sourceData,'Source of Traffic'));
                    $scope.sourceOfTraffic.data = sourceData;

                    $scope.users.analytics.user_visits.change(response.data.user_visits);
                    $scope.users.analytics.user_visits.x = response.data.user_visits.x;
                    
                    $scope.users.analytics.conversion_ratio.change(response.data.conversion_ratio);
                    $scope.users.analytics.conversion_ratio.x = response.data.conversion_ratio.x; 
//                    $scope.conversionRatio.change(reportService.updateChart(response.data.conversion_ratio,"Conversion Ratio : Guest to registrants",dateObj));
                    $scope.channelTriggeredData.change(reportService.updateChart(response.data.channel_triggered_users_visit,"Channel that triggered the user website visit",dateObj));
                                       
                }
                
            }, function(error) {
                var localTask = "updatedreportdata";
                sfactory.localService(localTask).then(function(response) {
                 /*$timeout(function(){
					loadMap(response.data.by_geo);
				},2000);*/
               
                $scope.userEnrollment.change(reportService.loadPiechart(response.data.enrollments,'Enrolled and Self Enrolled Students'));

                $scope.registeredUsers.change(reportService.loadPiechart(response.data.count_of_usertypes_in_site,'Registered Users at Sommer Learning'));
                $scope.registeredUsers.data = response.data.count_of_usertypes_in_site;
                var sourceData = $scope.traffic.byDevice ? response.data.source_of_traffic.by_device :response.data.source_of_traffic.by_channel;
                    $scope.sourceOfTraffic.change(reportService.loadPiechart(sourceData,'Source of Traffic'));

                $scope.users.analytics.user_visits.change(response.data.user_visits);
//                $scope.conversionRatio.change(reportService.updateChart(response.data.conversion_ratio,"Conversion Ratio : Guest to registrants",dateObj));
                $scope.channelTriggeredData.change(reportService.updateChart(response.data.channel_triggered_users_visit,"Channel that triggered the user website visit",dateObj));
                $scope.usersAnalyticsByGeo.change(response.data.by_geo);
                    $scope.usersAnalyticsByGeo.data = response.data.by_geo;
                }, function(error) {
                });
            });
        }
    };
    
    $scope.chartModal = function(size, chartType, data,traffic) {        
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'dest/templates/chartsModal.html',
            controller: 'modalController',
            size: size,
            resolve: {
                items: function() {
                    return {
                        chartType: chartType,
                        chartdata: data, 
                        traffic:traffic,
                        dateRange:$scope.daterangecustompick,
                        chartProperties:chartProperties
                    };
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.chartModalUsers = function() {        
        $scope.modalMsgUsers = !$scope.modalMsgUsers;
    };
    $scope.chartModalUserStatus = function() {        
        $scope.modalMsgUserStatus = !$scope.modalMsgUserStatus;
    };
    $scope.chartModalUsersTime = function() {        
        $scope.modalMsgUsersTime = !$scope.modalMsgUsersTime;
    };

    $scope.noofvisitors = function() {        
        $scope.noofvisitorsSec = !$scope.noofvisitorsSec;
    };
    $scope.registeredusers = function() {        
        $scope.registeredusersSec = !$scope.registeredusersSec;
    };
    $scope.sourceoftraffic = function() {        
        $scope.sourceoftrafficSec = !$scope.sourceoftrafficSec;
    };
    $scope.souoftraffic = function() {        
        $scope.souoftrafficSec = !$scope.souoftrafficSec;
    };
    $scope.channeltrigger = function() {        
        $scope.channeltriggerSec = !$scope.channeltriggerSec;
    };
    $scope.enrollusers = function() {        
        $scope.enrollusersSec = !$scope.enrollusersSec;
    };
    $scope.convoradio = function() {        
        $scope.convoradioSec = !$scope.convoradioSec;
    };
    
    
    
    
    /* Method to download reports as csv */
    $scope.downloadReport = function(task){
        userId = $scope.reportparams.user_id;
        groupId = $scope.reportparams.group_id;
        if($scope.startDate && $scope.endDate){
            var start = new Date($scope.startDate).getFullYear()+"-"+(Number(new Date($scope.startDate).getMonth())+1)+"-"+new Date($scope.startDate).getDate();
            var end = new Date($scope.endDate).getFullYear()+"-"+(Number(new Date($scope.endDate).getMonth())+1)+"-"+new Date($scope.endDate).getDate();
            window.location = appUrl+task+"?start_date="+start+"&end_date="+end+"&user_id="+userId+"&group_id="+groupId+"&csv=1";
        }
        else{
            window.location = appUrl+task+"?user_id="+userId+"&group_id="+groupId+"&csv=1";
        }
    };
    $scope.downloadbtn = function(){
        $scope.isActive_down = !$scope.isActive_down;
    }
    $scope.closedownload = function(){
        $scope.isActive_down = false;
    };
    $scope.reportdownloadbtn = function(){
        $scope.isActive_downreport = !$scope.isActive_downreport;
    }
    $scope.reportclosedownload = function(){
        $scope.isActive_downreport = false;
    };
    $scope.saveChartObj = function(response){
        var chartObject =_.find(chartArray, function(obj){ return obj.title.textStr  == response.title.textStr;});
        if(angular.isDefined(chartObject)){
            chartArray[chartArray.findIndex(x => x.title.textStr === response.title.textStr)] = response;
        }
        else{
            chartArray.push(response);
        }
    };
    
    $scope.export = function(download){
        reportService.exportCharts(chartArray,{type:download});
    };
    
    function initiateController() {
        $scope.users = {};
        $scope.usersAnalyticsByGeo={};
        chartProperties=[];
        chartArray=[];
        $scope.reportparams = {
            'group_id'  : encryptionService.decrypt(sessionService.get('grp_id')),            
            'user_id': encryptionService.decrypt(sessionService.get('userId'))
        };
        $scope.daterangecustompick = Last7Days().split(',')[Last7Days().split(',').length-1]+" To "+Last7Days().split(',')[0];
        //$scope.daterangecustompick = {startDate: null, endDate: null};
        $scope.jsonData = [];
        $scope.tableData = {};
        $scope.traffic = {byDevice: true,byChannel :false};
        $scope.sourceTraficData = {
            byDevice: [],
            byChannel: []
        }
        
        var useranalyticsscope = angular.element(jQuery("#adminLanding")).scope();       
        
        
        
        var i = 0, reportData = {},task = "userreportsdata";
        
        $scope.dateoptions={
            /*singleDatePicker: true,*/
            "locale": {
              "format": "MM-DD-YYYY",
            },
            showDropdowns:true,
            autoApply:true,
            maxDate : new Date(),
            eventHandlers: {
                'apply.daterangepicker': function(ev, picker) { 
                    $scope.daterangecustompick = ev.model.startDate.format('MM-DD-YYYY')+ ' To '+ev.model.endDate.format('MM-DD-YYYY');
                    updateCharts(ev.model.startDate.format('MM-DD-YYYY'),ev.model.endDate.format('MM-DD-YYYY'));
                    //updateCharts($scope.daterangecustompick.date.startDate.format('YYYY-MM-DD'),$scope.daterangecustompick.date.endDate.format('YYYY-MM-DD'));                    
                }
            }
        };
        /* Method to open modal window for filtering charts */
        $scope.items = ['item1', 'item2', 'item3'];
        $scope.tableData = {
            pageName: 'userreport',
            isFilterbtns: false,
            isSearch: true,
            isPagination: true,
            sortType: 'firstname',
            isCheckboxhide: true,
            headers: [{
                    name: 'first name',
                    bind_val: 'firstname',
                    isSortable: true
                },
                {
                    name: 'last name',
                    bind_val: 'lastname',
                    isSortable: true
                },
                {
                    name: 'user type',
                    bind_val: 'usertype',
                    isSortable: true
                },
                {
                    name: 'user name',
                    bind_val: 'username',
                    isSortable: true
                }/*,
                {
                    name: 'group',
                    bind_val: 'groupname',
                    isSortable: true
                }*/,
                {
                    name: 'status',
                    bind_val: 'status',
                    isSortable: true
                },
                {
                    name: 'created',
                    bind_val: 'created',
                    isSortable: true
                },
                {
                    name: 'last login',
                    bind_val: 'lastlogin',
                    isSortable: true
                },
                {
                    name: 'last ip',
                    bind_val: 'lastip',
                    isSortable: true
                }
            ],
            data: []
        };
        chartProperties=[
            {
                chartTitle:"Number of visitors",
                taskUrl : "uservisits",
                key:"user_visits",
                type:"line"
            },
            {
                chartTitle:"Registered Users at Sommer Learning",
                taskUrl : "usertypecount",
                key:"count_of_usertypes_in_site",
                type:"pie"
            },
            {
                chartTitle:"Source of Traffic",
                taskUrl : "sourceoftraffic",
                key:"",
                traffic:true,
                type:"pie"
            },
            {
                chartTitle:"Enrolled and Self Enrolled Students",
                taskUrl : "enrolled",
                key:"enrollments",
                type:"pie"
            },
            {
                chartTitle:"Channel that triggered the user website visit",
                taskUrl : "analyticsbychannel",
                key:"channel_triggered_users_visit",
                type:"bar"
            },
            {
                chartTitle:"Conversion Ratio",
                taskUrl : "guesttoregistered",
                key:"conversion_ratio",
                type:"line"
            },
            {
                chartTitle:"Guest Registered after N number of Visits",
                taskUrl : "guestRegisteredAfterNofvisit",
                key:"guest_registered",
                type:"line"
            }
        ];
        getReportsData(reportDataReq);
    };

    initiateController();
}]);
advancePubapp.controller('imageupload',['$scope','sfactory','$rootScope','$filter','$state','sessionService',function($scope,sfactory,$rootScope,$filter,$state,sessionService){
    
    $scope.showDown = false;
    $scope.myCroppedImage = '';    
    $scope.myImage = '';
    $scope.blockingObject = {
        block: true
    };
    $scope.hidepopup = function () {
        //location.reload();
        $scope.showDown = false;
    }
    $scope.renderimage = function () {
        $scope.blockingObject.render(function (dataURL) {
            $scope.dataURLsa = dataURL;
            sessionService.set("croppedimage",dataURL);
            $scope.uploadedit(dataURL);
            if(dataURL.length)
            {$scope.showDown = false;}
        });
    }
    $scope.blockingObject.callback = function (dataURL) {
        
    }

    var handleFileSelect = function (evt) {
        $scope.showDown = true;
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {
                $scope.myImage = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
        
    };
    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
    
    
}]);
advancePubapp.controller('usermanagementController',['$scope','$http','sfactory','$filter', '$rootScope','cacheService','$mdDialog','taskService','sessionService','encryptionService',function($scope,$http,sfactory,$filter,$rootScope,cacheService,$mdDialog,taskService,sessionService,encryptionService){ 
	   
	var logginAdminType,tasks,dataRequest,templatepath;  
		
	$scope.statuses = ['Planned', 'Confirmed', 'Cancelled'];
	
	/* Method for clase registration */
	$scope.closeRegisteration = function(response){
		singleMultiuserbool();
	}
	
	$scope.$on('editaccordion',function(event,args){
       $scope.crossbutton = {isSingleuser:false,isMultiuser:false};
    }) 
	 
	/* Method for single multi user boolean changes */
	function singleMultiuserbool(){
		$scope.isSingleuser = false;
        $scope.isMultiuser  = false;
		$scope.alertUserError = false;
		$scope.emailbool = false;
		$scope.userbool = false;
		$scope.userexitaccountbool = false;
		$scope.referenceusername = "";
		$scope.referenceemail1 = "";
	}
	
	/* Method for user callback */
	$scope.userCallback = function(arg1){
		if(arg1 && arg1.isSingleuser){
			$scope.isSingleuser = true;
			$scope.isMultiuser = false;
			$scope.emailbool = false;
			$scope.userbool = false;
			$scope.alertUserError = false;
		}
		if(arg1 && arg1.isMultiuser){
			singleMultiuserbool();
			$scope.isMultiuser = true;
		}
	}
	
    /* Method to capture emitForCloseicon */
    $scope.$on('emitForClose',function(event,args){
		$scope.isSingleuser = false;
        $scope.showicon     = args.showicon;
    });
    
	/* Method callback for close the baner alert message */
    $scope.closeBaner = function(){
        $scope.alertBaner.showBaner = false;
        $scope.$emit('switchMenu',{list:$scope.listObj});
    }
    
    /* Method to capture baner call back from child directives */
    $scope.$on('emitFromDirectiveBaner',function(event,args){
         showAlertAndInitialize(event,args);
    });
    
    function showAlertAndInitialize(event,args){
        $scope.alertBaner = args.alertBaner;
        if(angular.isDefined(args.list)) $scope.listObj = args.list;
		
		if(!$scope.isSingleuser && !$scope.isMultiuser){
			$scope.crossbutton = {isSingleuser:false,isMultiuser:false};
		}else{
			$scope.crossbutton = {isSingleuser:$scope.crossbutton.isSingleuser,isMultiuser:$scope.isMultiuser}; 
		}
    };
   
    /* Method on change of username */                                                                                          
    $scope.validateEmail = function(){
        var dataRequest = {};
        $scope.useremailexist = false;
        if(angular.isDefined($scope.user.email1) && ($scope.user.email1 !=="" )) {
			dataRequest = {email1:$scope.user.email1,userId:""};
            sfactory.serviceCall(dataRequest,tasks.validateEmail,"listDetails",true).then(function(response){
				if(angular.isDefined(response)){
					$scope.useremailexist = !($filter('lowercase')(response.status) == 'success');
				}
            },function(){
            });
       }
    };
	
	/* Method on change of email */ 
	$scope.validateUserName = function(){
		 var dataRequest = {};
		 $scope.userNameExist = false;
		 if(angular.isDefined($scope.user.username) && ($scope.user.username !=="" )) {
			 dataRequest = {username : $scope.user.username};
			 sfactory.serviceCall(dataRequest,tasks.validateUserName,"listDetails",true).then(function(response){
				if(angular.isDefined(response)){
					$scope.userNameExist = !($filter('lowercase')(response.status) == 'success');
					$scope.UsernameError = response.message;
				}
            },function(){
            });
		 }
	}

	/* Method for emit from delete banner */
    $scope.$on('emitFromdeleteBaner',function(event,args){
        $scope.alertBaner = args.alertBaner;
    })
	
    /* Method to capture admin login details from login state */
    $scope.$on('loginDetails',function(event,args){
       $scope.adminType = args.response;
    });
    
    
    /* Show multiple user */
    $scope.multipleuser = function(){
        $scope.showmultipleuser = !$scope.showmultipleuser;
    }
       
    /* Start Multiple User */
    $scope.export = function(){
        var adminType = logginAdminType == 'superAdmin' ? 'admin' : 'groupadmin';
		window.location = siteURL+'media/com_sommer/templates/'+adminType+'/MultiUser-Upload-Template.xlsx';
    };
    
	/* Method for upload csv */
    $scope.uploadcsv   = function(file){ 
        $scope.csvFilename       = "";
        if(file){
            $scope.fileExt = file.name.split(".").pop();
            if($scope.fileExt == "CSV" || $scope.fileExt == "csv" || $scope.fileExt == "xlsx"){
                 $scope.csvFile      = file;
                 $scope.csvFilename  = $scope.csvFile.name;
                 $scope.csvextension = false;
            }else{
                 $scope.csvextensionerror = "please choose csv file";
                 $scope.csvextension      = true;
                 $scope.csvFilename       = "";
            }
        }
    }
    
    /*Method for upload csv file */
    
    $scope.csvForm  = function(){
        var csvFile = $scope.csvFile;
        if($scope.csvFilename === "" || (typeof($scope.csvFilename) == "undefined")){
             $scope.alertBaner = {message:'Please choose a file to upload',showBaner:true,'banerClass':'alert-danger'};
        }else{ 
            var formObj = new FormData();
            formObj.append('file',$scope.csvFile);
            var task    = "user.userImport";
            var formToken = {'token':Number($scope.loggedGroup),'formObj':formObj};
            sfactory.serviceCallFormData(formToken,task,'listDetails').then(function(response){
				$scope.crossbutton = {isSingleuser:false,isMultiuser:false};
                if($filter('lowercase')(response.status) == 'success'){
                    angular.forEach(response.data, function(data){
                        var ImportnewUser = addimporttable(data);
                        if(ImportnewUser) $scope.tableData.data.push(ImportnewUser);
                    });
                    var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};   
                    $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
                    $scope.$emit('emitForClose',{'isSingleuser':false,'isMultiuser':false,'showicon':true});
                }
                else{
                    var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
                    $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
                }
                $scope.csvFilename  = "";
                $rootScope.appLoader = false;
            },function(error){
            });
        }        
    }
    
    //table push data
    function addimporttable(item){
        return { 
            name        : item.firstname,
            lastname    : item.lastname,
            username    : item.username,
            roleType    : item.roleType,       
            id          : item.id,
            roletype    : item.roletype,
            groupname   : item.groupname,
            registerdate : item.registerdate,
            phone_no    : item.phone_no,  
            email      : item.email,
            email1      : item.email,
            firstname   : item.firstname,
            birth_year   : item.birth_year,
            profile_picurl  : '',
            profile_pic     : '',        
            password        : '',        
            address     : '',
            block       :  item.block
        }
    }
    //End Multiple User
	$scope.usercancel = function(){
		$scope.crossbutton = {isSingleuser:false,isMultiuser:false};
        initUserObj();
        $scope.csvextension = false;
        $scope.csvFilename  = "";
		singleMultiuserbool();
    }
    
    //Image Upload
    $scope.upload = function(file) {
        if(file) $scope.profile_pic = file;
    }
     
    /* Method to initialize user object */
	function initUserObj(){
		$scope.user = {firstname:'',gender:'', username:'',email1:'',dob:{day:'',month:'',year:''},lastname:'',phone_no : '',address:''}; 
	}
	  
    initUserObj();

    /* Method to create new user */ 
    $scope.createUser = function(){  
        sfactory.serviceCall($scope.user,tasks.createUser,'listDetails').then(function(response){     
            if($filter('lowercase')(response.status) === 'success'){
                $scope.crossbutton  = {isSingleuser:false,isMultiuser:false};
				$scope.isSingleuser = false;
				$scope.user.roletypename = _.find(cacheService.get('userroles'),{roleid:Number($scope.user.roletype)}).name;
                $scope.alertBaner   = {message:response.message,showBaner:true,banerClass:'alert-success'};
		        initUserObj();
                getAllUserDetails(dataRequest,true);
            }else{
                $scope.alertBaner   = {message:response.message,showBaner:true,banerClass:'alert-danger'};;
            }
			$rootScope.appLoader = false;
        },function(error){
        });
    };
    
    //Method for tabledate push
    
    function addModelAssign(item,data,type){
        return { 
        name            : item.firstname,
        lastname        : item.lastname,
        username        : item.username,
        roleType        : item.roletypename,       
        id              : Number(data.id),
        roletype        : item.roletype,
        groupname       : data.groupname,
        registerdate    : data.registerdate,
        phone_no        : item.phone_no,  
        email           : item.email1,
        email1          : item.email1,
        firstname       : item.firstname,
        profile_picurl  : '',
        profile_pic     : '',        
        password        : '',        
        address         : (item.address ? item.address : ''),
        block           :  data.block,
        birth_year      : item.birth_year,
        gender          : item.gender,
		isprimaryuser   : (type == 'exist')? false:true	
        }       
    }
		
    $scope.changePagination = function(response){
        getAllUserDetails(response,$scope.initialtable);
    };
    
	/* Method for all user details */
	function getAllUserDetails(paginationData,type){
        if(angular.isDefined(paginationData.sortOrder) && paginationData.sortOrder === 'toggle') {
           paginationData.sortOrder = (dataRequest.sortOrder === 'asc') ? 'desc' : 'asc';
        }
        angular.extend(dataRequest, paginationData);
		//if(typeof paginationData.filterby == "undefined" ){dataRequest.filterby = ""};
		dataRequest.registerStatus = type;
		sfactory.serviceCall(dataRequest,tasks.getAllUsers,'listDetails').then(function(response){
			if($filter('lowercase')(response.status) == 'success'){
                $scope.tableData.data = response.data; 
                $scope.pagination = response.paginateData;
                $scope.pagination.currentPage = paginationData.currentPage;
            }
            $rootScope.appLoader = false;
		},function(error){
			console.log(type);
			var localTask = "usermanagement";
			sfactory.localService("usermanagement").then(function(response){
				$scope.tableData.data = response.data[type];
                $scope.pagination = response.data.paginateData;
                $scope.pagination.currentPage = paginationData.currentPage;
			},function(error){
			});
		});
	}
     
    function initDataRequest(){
        dataRequest = {
              itemsPerpage: 25,
              currentPage: 1,
              sortOrder: "desc",
              sortCoulmn: "name",
              filterby:"",
              searchQuery: ""
        }
    };
	
	$scope.getUserTableData = function(type){
		if(type != "register"){
			$scope.crossbutton = {isSingleuser:false,isMultiuser:false};
			if($scope.isSingleuser){
				$scope.isSingleuser = false;
			}else if($scope.isMultiuser){
				$scope.isMultiuser = false;
			}
		}else{
			$scope.crossbutton = {isSingleuser:false,isMultiuser:false};
		}	
		$scope.initialtable = type;
		tableDataLoad();
	}
	 
	/* Method for Dynamic table loaded */
	function dynamicTableCreation(){
		$scope.dynamictable = {
			tablename:[
				{name:"Registered User's",type:"register"},
				{name:"Non Activated User's",type:"nonactivate"},
				{name:"Trashed User's",type:"trashed"}
			]
		}
	}
     
	/* Method for Table values load */
	function tableDataLoad(){
		var registertype,activedeactive,action,trash;
		switch ($scope.initialtable) {
			case "register":
				registertype   =  {name:'Registered date',bind_val:'registerdate',isSortable:true};
				activedeactive =  {name:'block | unblock',bind_val:'block',isSortable:true,isStatusColumn:true,columnName:"status",actionMethods:{status:{api:'user.changeBlock',viewName:'user',session:'listDetails'}}};
				action         =   {name:'actions',bind_val:'actions',isSortable:false,isActionColumn:true,columnName:"addeditview",actionMethods:{delete:{api:'user.delete_list',viewName:'user',session:'listDetails'}}}; 
				trash = false;
				break;
			case "nonactivate":
				registertype   =  {name:'Registration Processed',bind_val:'registerdate',isSortable:true};	
				activedeactive =  {name:'Activate User',bind_val:'block',isSortable:true,isStatusColumn:true,columnName:"status",actionMethods:{status:{api:'user.changeBlock',viewName:'usernonactivate',session:'listDetails'}}};
				action         =   {name:'actions',bind_val:'actions',isSortable:false,isActionColumn:true,columnName:"addeditview",actionMethods:{delete:{api:'user.delete_list',viewName:'user',session:'listDetails'}}};  
				trash = false;	
				break;
			case "trashed":
				registertype   =  {name:'Registration date',bind_val:'registerdate',isSortable:true};	
				activedeactive =  "";
				action         =   {name:'actions',bind_val:'actions',isSortable:false,isActionColumn:true,columnName:"trashview",actionMethods:{delete:{api:'user.delete_list',viewName:'user',session:'listDetails'}}};
				trash = true;
				break;
		}		
	
        $scope.tableData = { 
			trash:trash,
			pageName:'usermanagement',
			currentpage :'user',
            isFilterbtns:true,
            isSearch:true,
            isPagination:true,
            isroletypedisplay:true,
			sortType:'registerdate',
            sortReverse: false,
            ismultiDel:{task:'user.delete_list',viewname:'user'},
            childTemplate:templatepath+"userEdit.html",
            headers:[
                {name:'Name',bind_val:'name',isSortable:true},
                {name:'user name',bind_val:'alternate_username',isSortable:true},
                {name:'user type',bind_val:'roleType',isSortable:true,isStatusColumn:true,columnName:"icon"},
                {name:'Email',bind_val:'email',isSortable:true},
                registertype,
                activedeactive,
                action            
            ],  
            data:[]
        }
		
		// Method for Dynamic tab list
		roleTypeUser  = cacheService.get('userroles');
		allroletype   = {roleid: "", rolname: "All"};
		xx            = roleTypeUser.find(function(el){ return el.rolname === allroletype.rolname })
		if(!xx) roleTypeUser.unshift(allroletype);
		roleTypeUser.map(function(word){ word.isActive = (word.rolname == "All"); word.name = word.rolname;  });
		$scope.tableData.tabList = roleTypeUser; 		
	}
    /* Method to initiate controller scope properties */
	function initializeController(){	
		dynamicTableCreation();
		$scope.initialtable = "register";
        $scope.currentYear = new Date().getFullYear();
        $scope.useremailexist = false;
        $scope.userNameExist  = false;
		logginAdminType = cacheService.get('adminType');
		$scope.rotetype = cacheService.get('userroles');
		if(encryptionService.decrypt(sessionService.get('role')) == "Organization Admin"){
			rotetypecopy          = angular.copy(cacheService.get('userroles'));
			findOrganizationAdmin = _.findIndex(rotetypecopy,{rolname:"Organization Admin"});
			(findOrganizationAdmin != -1) ? rotetypecopy.splice(findOrganizationAdmin,1):"";
			$scope.rotetype = rotetypecopy;
		}
        $scope.states    = ["Teacher","Student","Parents"];
        $scope.datatable={};
        $scope.addRecord = {level1:true,level2:true,level1Title:'Add User',level2Title:'Add Multi User'};
        templatepath = templateURL+"dest/templates/"; 
        $scope.currentYear = new Date().getFullYear(); 
        tasks = taskService.getTasks('usermanagementController');	
        initDataRequest();
		tableDataLoad();
        $scope.form={};
    }
	initializeController();
}]);
advancePubapp.controller('userSentMailViewController',['$scope','sfactory','$mdDialog','mailcontent',function($scope,sfactory,$mdDialog,mailcontent){ 
    
	$scope.mailcontent = mailcontent;
	
	$scope.sentmailcancel = function(){
		$mdDialog.cancel();
	}
}]);
advancePubapp.controller('writingsuccessController',['$scope', 'sfactory','$uibModal','$rootScope','$filter','$log','sessionService','encryptionService', function($scope,sfactory,$uibModal,$rootScope,$filter,$log,sessionService,encryptionService) {
    var reportDataReq; 
    
    //Method  for number success report
    function writingsuccessreport(reportDataReq){
    	var task = 'programreportsind';
        inputreq = JSON.stringify(reportDataReq);
        sfactory.serviceCallReports(inputreq, task).then(function(response) {
        if(angular.isDefined(response)){
            if($filter('lowercase')(response.status) == 'success'){
                $scope.tableData.data =response.data.program_report;
                $scope.writingsuccess.overall = response.data.users_at_program;
                $rootScope.appLoader = false;
            }else{
                $rootScope.appLoader = false;
            }	
        }
        }, function(error) {
            var localTask = "writingsuccessreports";
                sfactory.localService(localTask).then(function(response) {
                $scope.tableData.data =response.data.data.program_report;
                $scope.writingsuccess.overall = response.data.data.users_at_program;
            }, function(error) {
            });
        });
    }
    
    //Method for number success analytics
    $scope.getwritingSuccessAnalyticsData = function(){
        var task = 'programanalyticsind';
        inputreq = JSON.stringify(reportDataReq);
        sfactory.serviceCallReports(inputreq, task).then(function(response) {            
            if(angular.isDefined(response.data)){
                $scope.writingsuccess.number= response.data;                
                $rootScope.appLoader = false;
            }
        }, function(error) {
        var localTask = "writingsuccessreports";
            sfactory.localService(localTask).then(function(response) {
                $scope.writingsuccess.number= response.data.analyticsdata;
            }, function(error) {
            });
        });
    }
    
     /* Method to show filter modal */
    $scope.chartModal = function(size, chartType, data, chartHeader,traffic) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'dest/templates/chartsModal.html',
            controller: 'modalController',
            size: size,
            resolve: {
                items: function() {
                    return {
                        chartType: chartType,
                        chartdata: data,
                        header: chartHeader, 
                        traffic:traffic,
                        dateRange:$scope.daterangecustompick,
                        chartProperties:chartProperties,
                        reportsProgram: "Writing Success"
                    };
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    
      /*Method for update data based on calender*/
    function updateCharts(start_date,end_date){
          var requestData = JSON.stringify({
                'start_date': start_date,
                'end_date': end_date,
                'program_id': "Writing Success",
                'group_id'  : reportDataReq.group_id,
                'user_id': reportDataReq.user_id
        });
        sfactory.serviceCallReports(requestData, 'programanalyticsind').then(function(response) {
			if(angular.isDefined(response)){
				if($filter('lowercase')(response.status) == 'success'){
					$scope.writingsuccess.number.most_visited.change(response.data.most_visited);
                    $scope.writingsuccess.number.most_visited.x = (response.data.most_visited.x);
					$scope.writingsuccess.number.classes_at_program.change(response.data.classes_at_program);
                    $scope.writingsuccess.number.classes_at_program.x = (response.data.classes_at_program.x);
					$scope.writingsuccess.number.enrollment_at_program.change(response.data.enrollment_at_program);
                    $scope.writingsuccess.number.enrollment_at_program.x = (response.data.enrollment_at_program.x);
                    
                   $scope.writingsuccess.number.enrollement_based_on_textbook.change(response.data.enrollement_based_on_textbook);  
					$rootScope.appLoader = false;
				}
			 }	
        }, function(error) {
        var localTask = "writingsuccessanalytics";
        sfactory.localService(localTask).then(function(response) {
            $scope.writingsuccess.number.most_visited.change(response.data.analyticsdata.most_visited);
            $scope.writingsuccess.number.classes_at_program.change(response.data.analyticsdata.classes_at_program);            
            $scope.writingsuccess.number.enrollment_at_program.change(response.data.analyticsdata.enrollment_at_program);            
            $scope.writingsuccess.number.enrollement_based_on_textbook.change(response.data.analyticsdata.enrollement_based_on_textbook);            
             
            }, function(error) {
            });
        });
    }

    //Method for activities download
   $scope.writingsuccessdownload = function(task){
        userId  = reportDataReq.user_id;
        groupId = reportDataReq.group_id;
         if($scope.startDate && $scope.endDate){
            var start = new Date($scope.startDate).getFullYear()+"-"+(Number(new Date($scope.startDate).getMonth())+1)+"-"+new Date($scope.startDate).getDate();
            var end = new Date($scope.endDate).getFullYear()+"-"+(Number(new Date($scope.endDate).getMonth())+1)+"-"+new Date($scope.endDate).getDate();
            window.location = appUrl+task+"?start_date="+start+"&end_date="+end+"&program_id=Writing Success"+"&user_id="+userId+"&group_id="+groupId+"&csv=1";
        }
        else{
            window.location = appUrl+task+"?program_id=Writing Success"+"&user_id="+userId+"&group_id="+groupId+"&csv=1";
        }
    }
    $scope.downloadbtn = function(){
        $scope.isActive_down = !$scope.isActive_down;
    }
    $scope.closedownload = function(){
        $scope.isActive_down = false;
    };
    $scope.reportdownloadbtn = function(){
        $scope.isActive_downreport = !$scope.isActive_downreport;
    }
    $scope.reportclosedownload = function(){
        $scope.isActive_downreport = false;
    };
    $scope.saveChartObj = function(response){
        var chartObject =_.find(chartArray, function(obj){ return obj.title.textStr  == response.title.textStr;});
        if(angular.isDefined(chartObject)){
            chartArray[chartArray.findIndex(x => x.title.textStr === response.title.textStr)] = response;
        }
        else{
            chartArray.push(response);
        }
    };
    
    $scope.export = function(download){
        reportService.exportCharts(chartArray,{type:download});
    };
	 //Method for initilize controller
    function initilizewritingsuccess(){        
        $scope.writingsuccess = {};
        reportDataReq = {
            'program_id': "Writing Success",
            'group_id'  : encryptionService.decrypt(sessionService.get('grp_id')),            
            'user_id': encryptionService.decrypt(sessionService.get('userId'))
        };
        writingsuccessreport(reportDataReq);
        $scope.writingsuccess.vmDate = Last7Days().split(',')[Last7Days().split(',').length-1]+" To "+Last7Days().split(',')[0];
        $scope.tableData = {
            pageName: 'writingsuccesstable',
            isFilterbtns: false,
            isSearch: true,
            isPagination: true,
            sortType: '',
            isCheckboxhide: true,
            headers: [{name: 'Course',bind_val: 'label',isSortable: true},
                {name: 'No of enrolled users',bind_val: 'no_of_enrolled_users',isSortable: true},
                {name: 'no of Activity',bind_val: 'no_of_activities',isSortable: true},
                {name: 'no of Student Completed Course',bind_val: 'no_of_students_completed',isSortable: true},
                {name: 'no of visit',bind_val: 'no_of_visits',isSortable: true},
                {name: 'no of shares',bind_val: 'no_of_shares',isSortable: true},
                {name: 'Time spent',bind_val: 'time_spent',isSortable: true},                
            ],
            data: []
        };
		$scope.daterangecustompick = $scope.writingsuccess.vmDate;
        $scope.dateoptions={
            "locale": {
              "format": "MM-DD-YYYY",
            },
            showDropdowns:true,
            autoApply:true,
            maxDate : new Date(),
            eventHandlers: {
                'apply.daterangepicker': function(ev, picker) {
                    $scope.daterangecustompick = ev.model.startDate.format('MM-DD-YYYY')+ ' To '+ev.model.endDate.format('MM-DD-YYYY');
                    updateCharts(ev.model.startDate.format('MM-DD-YYYY'),ev.model.endDate.format('MM-DD-YYYY'));                    
                }
            }
        };
		    chartProperties=[
            {
                chartTitle:"Writing Success- User visits",
                taskUrl :"uservisitbyprogram",
                key:"most_visited",
                type:"line"
            },
            {
                chartTitle:"Classes at Writing Success",
                taskUrl :"classesatprogram",
                key:"classes_at_program",
                type:"line"
            },
            {
                chartTitle:"Enrollment at Writing Success",
                taskUrl :"enrolledatprogram",
                key:"enrollment_at_program",
                type:"line"
            }, 
            {
                chartTitle:"Enrollement Based On Textbook",
                taskUrl :"enrollementbasedontextbook",
                key:"enrollement_based_on_textbook",
                type:"bar"
            }
        ];
    }    
    initilizewritingsuccess();
}]);
advancePubapp.directive('crossicon', ['$rootScope', function ($rootScope) {
      
    return {
        restrict: 'E',
        templateUrl:templateURL+"dest/templates/addClose.html",
		scope: {
			tableData: '=',
			tableType:'=',
			addRecord: '=',
			crossButton: '=',
			onLoadCallback : '&' 
		}, 
        link: function(scope, element, attrs) {
            var addSinlge = {usermanagement:'Add User',classmanagement: 'Add Class'};
            var addMulti  = {usermanagement:'Add Multiple Users',classmanagement: 'Assign Content'};
            scope.addName = {
                addSingleName:addSinlge[scope.tableData.pageName],addMultiuploadname:addMulti[scope.tableData.pageName]
            };
			scope.crossButton = {};
			scope.hideAllviews = function(){
				_.each(scope.tableData.data,function(item){
					item.viewChild =  false;
					item.showChild =  false;
					item.isEditable = false;
                    item.isAddCourse = false;
                    item.isAddUser = false;
				});
			}
            scope.toggleSingleuser = function(){
                scope.crossButton.isSingleuser = true;
                scope.crossButton.isMultiuser  = false;
				scope.hideAllviews();
				usertype = {'isSingleuser':scope.crossButton.isSingleuser};
				scope.onLoadCallback({arg1: usertype});
            } 
            scope.toggleMultiuser = function(){
                scope.crossButton.isSingleuser = false;
                scope.crossButton.isMultiuser = true;
				scope.crossButton.isTeacherTab = true;
				scope.hideAllviews();
				usertype = {'isMultiuser':scope.crossButton.isMultiuser};
				scope.onLoadCallback({arg1: usertype});				
            }
        }
    };
        
}]);
advancePubapp.directive('alertBanner', function () {
    return {
        restrict: 'E',
        templateUrl:'dest/templates/alertBanner.html',
        scope: {
            data: "="
        },
        link:function(scope, elem, attrs) {
            scope.closeBaner = function(){
                scope.data.showBaner = false;
            };
        }
    };
});
advancePubapp.directive('hcBarChart', function () { 
                    return {
                        restrict: 'E',
                        template: '<div></div>',
                        scope: {
                             chartdata: '=',
                             chartobj : "&"
                        },
                        link: function (scope, element) {
                            var chart;
                            function drawChart(){
                                chart = Highcharts.chart(element[0], {
                                  credits: {
                                        enabled: false
                                    },
                                    chart: {
                                        type: 'column'
                                    },
                                    title: {
                                        text: scope.chartdata.title,
                                        align: 'left'
                                    },
                                    xAxis: {
                                        categories:scope.chartdata.x,
                                        crosshair: true,
                                        title: {
                                            text: null
                                        }
                                    },
                                    yAxis: {
                                        min: 0,
                                        title: {
                                            text:scope.chartdata.y_axis_label
                                        }
                                    },
                                    exporting: {
                                         enabled: false
                                    },
                                    legend: {
                                        enabled: scope.isEnableLegend
                                    },
                                    tooltip: {
                                        shared: true,
                                    },
                                    plotOptions: {
                                        column: {
                                            pointPadding: 0.2,
                                            borderWidth: 0
                                        }
                                    },
                                    lang: {
                                        noData: 'No data found!'
                                    },
                                  series: scope.chartdata.series
                                });
                                return chart;
                            };

                           scope.chartdata.change = function(newData){
                               chart.legend.update({
                                    enabled: isShowLegend(newData.series)
                               });
                               scope.chartdata.x = angular.copy(newData.x);
                               chart.xAxis[0].update({
                                    categories: newData.x
                                });
                                for(var i=0;i<newData.series.length;i++){
                                    chart.series[i].update({
                                        data: newData.series[i].data
                                    });
                                }
                               scope.chartobj({response:chart});
                            };
                            
                            function isShowLegend(obj) {
                                var emptyArrayMembers = _.filter(obj, function(member) { 
                                        return _.isArray(member.data) && _.isEmpty(member.data)
                                });
                                return (obj.length > 1 ) && (emptyArrayMembers.length === 0);
                            };
                        
                            function init(){
                                scope.isEnableLegend = isShowLegend(scope.chartdata.series);
                                drawChart();
                                if(angular.isDefined(chart)){
									scope.chartobj({response:chart});
								}
                            };

                            init();
                        }
                };
});

advancePubapp.directive('hcBarStackChart', function () { 
     return {
            restrict: 'E',
            template: '<div></div>',
            scope: {
                 chartdata: '=',
                 chartobj : "&"
            },
            link: function (scope, element) {
                var chart;
                function drawChart(){
                  chart = Highcharts.chart(element[0], {
                      credits: {
                            enabled: false
                        },
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: scope.chartdata.title,
                            align: 'left'
                        },
                        xAxis: {
                            categories:scope.chartdata.x,
                            crosshair: true,
                            title: {
                                text: null
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text:scope.chartdata.y_axis_label
                            }
                        },
                         tooltip: {
                            formatter: function() {
                                return 'Total Number of '+this.series.name+': '+ this.point.stackTotal+'<br/>'+
                                    this.series.name +': '+ this.y +'<br/>'+'Type : '+this.series.userOptions.usertype ;
                            }
                        },
                        plotOptions: {
                            column: {
                                stacking: 'normal'
                            }
                        },
                      lang: {
                            noData: 'No data found!'
                        },
                      exporting: {
                            enabled: false
                        },
                      series: scope.chartdata.series
                    });
                    return chart;
                };
               scope.chartdata.change = function(newData){
                   scope.chartdata.x = angular.copy(newData.x);
                   chart.xAxis[0].update({
                        categories: newData.x
                    });
                   //chart.series = chart.series.slice(0,newData.series.length);
                    for(var i=0;i<newData.series.length;i++){
                        chart.series[i].update({
                            data: newData.series[i].data
                        });
                    }
//                   for(var i=0;i<chart.series.length;i++){
//                        chart.series[i].remove();
//                    }
//                   for(var i=0;i<newData.series.length;i++){
//                        chart.addSeries(newData.series[i]);
//                    }
//                   chart.redraw();
                   scope.chartobj({response:chart});
                };
                function isShowLegend(obj) {
                    var emptyArrayMembers = _.filter(obj, function(member) { 
                            return _.isArray(member.data) && _.isEmpty(member.data)
                    });
                    return (obj.length > 1 ) && (emptyArrayMembers.length === 0);
                };
                        
                function init(){
                    scope.isEnableLegend = isShowLegend(scope.chartdata.series);
                    drawChart();
                    if(angular.isDefined(chart)){
                        scope.chartobj({response:chart});
                    }
                };

                init();
            }
    };
});    
    
advancePubapp.directive('childTable', function ($sce) {
    function link(scope, element, attrs){
    }
    return {
        restrict: "EA",
        //templateUrl:templateURL+"dest/templates/accordionPanel.html",
        templateUrl:function(element,attr){
           return $sce.trustAsResourceUrl(templateURL+attr.templateUrl)
        },
        controller:"accordionController",
        controllerAs: 'acc',
        link:link,
        scope:{
            contentBody:"=",
            contentItems:"=",
			selectedFilterTab:"="
        }
  };
}); 
advancePubapp.directive('ngConfirmClick', [
    function(){
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
}])

advancePubapp.directive('contenteditable', function() {
    return {
      restrict: 'A', // only activate on element attribute
      require: '?ngModel', // get a hold of NgModelController
      link: function(scope, element, attrs, ngModel) {
        if(!ngModel) return; // do nothing if no ng-model

        // Specify how UI should be updated
        ngModel.$render = function() {
          element.html(ngModel.$viewValue || '');
        };

        // Listen for change events to enable binding
        element.on('blur keyup change', function() {
          scope.$apply(read);
        });
        read(); // initialize

        // Write data to the model
        function read() {
          var html = element.html();
          // When we clear the content editable the browser leaves a <br> behind
          // If strip-br attribute is provided then we strip this out
          if( attrs.stripBr && html == '<br>' ) {
            html = '';
          }
          ngModel.$setViewValue(html);
        }
      }
    };
  })
advancePubapp.directive('contentManagement', function () {
    return {
        restrict: 'E',
        templateUrl: typeof(siteURL) == "undefined" ? 'dest/templates/classcontentManagement.html' :'dest/templates/classcontentManagement.html',
        controller:'classcontentmanagementController',
        scope: {
            tabname: "=",
            headerdata: '=',
            activetab : "="
        },
        link:function(scope, elem, attrs) {
        }
    };
});
advancePubapp.directive('customColumn', function ($sce) {
    function link(scope, element, attrs){
    }
    return {
        restrict: "EA",
        //templateUrl:templateURL+"dest/templates/accordionPanel.html",
        templateUrl:function(element,attr){
           return $sce.trustAsResourceUrl(templateURL+attr.templateUrl)
        },
        controller: "@",
        name:"controllerName",
        link:link,
        scope:{
            contentBody:"=",
            contentHead:"=",
            contentItems:"=",
            emitbaner: '&',
			setback: "&",
			totalRecords:"=",
			updateparentpage: "&",
            assigncontentToTable:"&",
			isHeader:"@",
            removeuserfromtable:"&"
        }
  };
});
advancePubapp.directive('datemonthyear',['appconstants',function(appconstants){
	return{
		restrict: 'E',
		templateUrl:templateURL+"dest/templates/datemonthyear.html",
		scope:{
			datemonth:'=',
			agecheck :'=',
			disableinput :'=',
            isrequired : '='
		},
		link: function(scope, element, attrs) {
			
			scope.getDobMonth   = function(){
				scope.dobmonth  = _.keys(appconstants.monthdays);
				//(scope.agecheck == 'ageabovethirteen') ? belowAgeCheck() :'';
				belowAgeCheck();
			};
			
			scope.getDobDay     = function(){
				scope.dobmonth  = _.keys(appconstants.monthdays);
				//(scope.agecheck == 'ageabovethirteen') ? belowAgeCheck() :'';
				belowAgeCheck();
			};
			
			scope.getDobYear    = function(){
				var leapyear;
				scope.dobmonth  = _.keys(appconstants.monthdays);
				scope.days      = Number(scope.monthdate["January"]);
				if(scope.datemonth.month == 2){
					leapyearcheck();
				}else{
					belowAgeCheck();
				}
			};
			
			function leapyearcheck(){
				leapyear    = ((scope.datemonth.year % 4 == 0) && (scope.datemonth.year % 100 != 0)) || (scope.datemonth.year % 400 == 0);
				if(!leapyear){
					if(scope.datemonth.day >= 29){
						scope.datemonth.day = '';
					}
					scope.days = 28;
				}else{
					scope.days = 29;
				}
			}
			
			function belowAgeCheck(){
				if(scope.datemonth.year && scope.datemonth.month && scope.datemonth.day){
					if(currentYear-13 == scope.datemonth.year){  
						if((currentmonth  <= (Object.keys(scope.monthdate)).indexOf(scope.datemonth.month)+1) && currentdate < scope.datemonth.day){
							scope.days     = currentdate;
							scope.dobmonth = (Object.keys(scope.monthdate)).slice(0, (Object.keys(scope.monthdate)).indexOf(scope.datemonth.month)+1);
							scope.datemonth.day     = "";
							scope.datemonth.month   = "";
						}
					}else{
						monthCalculation();
					}
				}else if(scope.datemonth.year && scope.datemonth.month){
					if((currentmonth  <= (Object.keys(scope.monthdate)).indexOf(scope.datemonth.month)+1)){
						scope.days     = currentdate;
						scope.dobmonth = (Object.keys(scope.monthdate)).slice(0, (Object.keys(scope.monthdate)).indexOf(scope.datemonth.month)+1);
					}
				}else{
					monthCalculation();
				}				
			};
			
			function monthCalculation(){
				if(scope.datemonth.year && scope.datemonth.month == 2){
					leapyearcheck();
				}else{
					scope.datemonth.month = (angular.isDefined(scope.datemonth.month) && scope.datemonth.month != '') ? scope.datemonth.month : 1;
					monthvalues           = Object.values(scope.monthdate);
					scope.days            = Number(monthvalues[scope.datemonth.month-1]);
				}
			}
			
			function init(){
				currentTime      = new Date();
				currentdate      = currentTime.getDate()
				currentmonth     = currentTime.getMonth() + 1
				currentYear      = currentTime.getFullYear();			
				scope.monthdate  = appconstants.monthdays;
				scope.dobmonth   = _.keys(appconstants.monthdays);
				currentYearCheck = (scope.agecheck == 'ageabovethirteen') ? currentYear-12 :currentYear-2;
				scope.years      = _.range(currentYear-100, currentYearCheck);
				scope.days       = Number(scope.monthdate["January"]);
			};
			
			init();
		}
	};
}])
advancePubapp.directive('dropDown', function() {
    return {
        scope: {
            selectOptions: '=options',
            select:'=selectedOption',
            invokeCat:'&onSelect'
        },
        templateUrl: 'dest/templates/select.html',
        link:  function(scope, element, attr) {
            scope.showOption = false;

            scope.toggle = function(){
                scope.showOption = !scope.showOption;
            }

            scope.selection = function(option){
                // alert(option);
                scope.select =option.name;
                scope.invokeCat({option:option});
            }

              // element.bind("click", function(e){
               
              //        if(e.target.parentNode.className !=='dd-select'){
              //            scope.showOption = false;
              //            scope.$apply();
              //        }else{
              //            scope.showOption = true;
              //        }
              //  });

        }
    }
})
.directive('dropDownChild', function() {
    return {
        scope: {
            selectOptions: '=options',
            select:'=selectedOption',
            invokeSubCat:'&onSubSelect'
        },
        templateUrl: 'dest/templates/select-child.html',
        link:  function(scope, element, attr) {
            scope.showOption = false;

            scope.toggle = function(){
                scope.showOption = !scope.showOption;
            }

            scope.selection = function(option){
                // alert(option);
                scope.select =option.name;
                scope.invokeSubCat({option:option});
            }

            // element.bind("click", function(e){
          
            //         if(e.target.parentNode.className !=='dd-selected child'){
            //              scope.showOption = false;
            //              scope.$apply();
            //          }else{
            //             scope.showOption = true;
            //          }
            //    });

        }
    }
})
advancePubapp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);


/*advancePubapp.directive("fileread", [function () {
    alert("hello");
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                 alert("hello hello");
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);*/
advancePubapp.directive('loadedImg', function(){
    return {
        restrict: 'A',
      
        link: function(scope, element) {
          element.on('load', function() {
            // Set visibility: true + remove spinner overlay
              element.removeClass('spinner-hide');
              element.addClass('spinner-show');
              //element.parent().find('.loading').remove();
              element.parent().removeClass('preloaderImg');              
          });
          scope.$watch('ngSrc', function() {
            // Set visibility: false + inject temporary spinner overlay
              element.addClass('spinner-hide');
              // element.parent().append('<span class="spinner"></span>');
          });
        }
    };
});
advancePubapp.directive('hcLineChart', function () {  
                return {
                    restrict: 'E',
                    template: '<div></div>',
                    scope: {
                        chartdata: '=',
                        chartobj : "&"
                    },
                    link: function (scope, element) {
                    var chart;
                    function drawChart(){
                        chart = Highcharts.chart(element[0],{
                        credits: {
                            enabled: false
                        },
                        title: {
                                text: scope.chartdata.title,
                                align: 'left'
                        },
                        xAxis: {
                            categories: scope.chartdata.x,
                            title: {
                                enabled: false
                            }     
                        },
                        yAxis: {
                                title: {
                                    text :scope.chartdata.y_axis_label
                                }
                        },
                        exporting: {
                                 enabled: false
                        },
                        legend: {
                                enabled: scope.isEnableLegend
                            },
                        tooltip:{
                            formatter:function(){
                                var symbol;

                                
                                var displayStr = '<b>' + this.x + '</b>';
                                    $.each(this.points,function(){                                        
                                        switch ( this.point.graphic.symbolName ) {
                                            case 'circle':
                                                symbol = '●';
                                                break;
                                            case 'diamond':
                                                symbol = '♦';
                                                break;
                                            case 'square':
                                                symbol = '■';
                                                break;
                                            case 'triangle':
                                                symbol = '▲';
                                                break;
                                            case 'triangle-down':
                                                symbol = '▼';
                                                break;
                                        }
                                        displayStr += ' <br><span style="color:'+ this.series.color + '">' + symbol+ '</span>'+ this.series.name + ' : ' + this.y;
                                    });
                                return (scope.chartdata.title === 'Conversion Ratio') ? displayStr+"%" : displayStr;
                            },
                            shared: true
                        },
                        lang: {
                                noData: 'No data found!'
                        },
                        series: scope.chartdata.series
                    });
                    };
                        
                    scope.chartdata.change = function(newData){
                        chart.legend.update({
                            enabled: isShowLegend(newData.series)
                        });
                        chart.xAxis[0].update({
                            categories: newData.x
                        });
                        /*chart.xAxis[0].update({
                            categories: newData.x
                        });*/
                        
                        for(var i=0;i<newData.series.length;i++){
                            chart.series[i].update({
                                data: newData.series[i].data
                            });
                        }
                        scope.chartobj({response:chart});
                  };

                    function isShowLegend(obj) {
                        var emptyArrayMembers = _.filter(obj, function(member) { 
                            return _.isArray(member.data) && _.isEmpty(member.data)
                        });
                        return (obj.length > 1 ) && (emptyArrayMembers.length === 0);
                    };
                        
                    function init(){
                        scope.isEnableLegend = isShowLegend(scope.chartdata.series);
                        drawChart();
                        if(angular.isDefined(chart)){
                            chart.options.plotOptions = {line: {dataLabels: {enabled: true}}};
                            scope.chartobj({response:chart});
                        }
                    };
                    
                    init();
                }
        };
});

/*
$scope.roles = [
          {"id": 1, "name": "Manager", "assignable": true},
          {"id": 2, "name": "Developer", "assignable": true},
          {"id": 3, "name": "Reporter", "assignable": true}
    ];
    
    $scope.member = {roles: []};
    $scope.selected_items = [];
<dropdown-multiselect pre-selected="member.roles" model="selected_items" options="roles"></dropdown-multiselect>
*/
advancePubapp.directive('dropdownMultiselect', function(){
   return {
       restrict: 'E',
       scope:{           
            model: '=',
            options: '=',
           filterName : '=filterType',
            pre_selected: '=preSelected',
           filtercall: '&'
       },
       template: "<div class='btn-group' data-ng-class='{open: open}' data-ng-mouseleave='open=false;selectValues();' data-ng-init='selectValues()'>"+
        
                "<button class='btn btn-small dropdown-toggle' data-ng-click='open=!open;openDropdown()' title='{{select}}'>{{select}}<span class='caret'></span></button>"+
                "<ul class='dropdown-menu' aria-labelledby='dropdownMenu'>" 										 +
                    "<li data-ng-repeat='option in options'> <a href='javascript:void(0);' data-ng-class='isChecked(option.id)'><input type='checkbox' ng-checked='isChecked(option.id)' class='dropdownChecks' data-ng-click='setSelectedItem();' name='{{option.name}}' /><span data-ng-click='setSelectedItem();'>{{option.name}}</span></a></li>" +                                        
                "</ul>" +
            "</div>" ,
       controller: function($scope){
           $scope.selectValues = function(){
               if($scope.pre_selected.length > 0 ){
                   /*getId = _.where($scope.options, {'id':$scope.pre_selected[$scope.pre_selected.length-1]});
                   $scope.select = getId[0].name;*/ 
                   $scope.select = "";                    
                   for(i=0;i<$scope.pre_selected.length;i++){                       
                       getId = _.where($scope.options, {'id':$scope.pre_selected[i]});
                       if(i == ($scope.pre_selected.length-1)){
                           $scope.select += getId[0].name;
                       }else{
                           $scope.select += getId[0].name+", ";
                       }                       
                   }
               }else{
                   if($scope.filterName == "customFilters"){
                       $scope.select = "Others";
                   }else{
                       $scope.select = $scope.filterName;
                   }
                   
               }                            
           }
           $scope.openDropdown = function(){        
                $scope.selected_items = [];
                for(var i=0; i<$scope.pre_selected.length; i++){                        
                    $scope.selected_items.push($scope.pre_selected[i].id);
                }               
            };
           
            $scope.selectAll = function () {
                $scope.model = _.pluck($scope.options, 'id');
                console.log($scope.model);
            };
           $scope.callFilterCall = function(){
               $scope.filtercall({res:{value:$scope.model,type:$scope.filterName}});
           }
            $scope.deselectAll = function() {
                $scope.model=[];
                console.log($scope.model);
            };
            $scope.setSelectedItem = function(){
                var id = this.option.id;
                if (_.contains($scope.model, id)) {
                    $scope.model = _.without($scope.model, id);                    
                } else {                    
                    $scope.model.push(id);
                }
                console.log("setSelectedItem",$scope.model);
                $scope.callFilterCall();
                return false;
            };
            $scope.isChecked = function (id) {                
                if (_.contains($scope.model, id)) {                       
                    return 'icon-ok';// pull-right - This is removed
                    return 'checked';// pull-right - This is removed
                }else{
                    
                    return false;
                }                
            };                                 
       }
   } 
});

/*This directive allows us to pass a function in on an enter key to do what we want.
 */
advancePubapp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});
(function () {
'use strict';
var directiveId = 'ngMatch';
advancePubapp.directive(directiveId, ['$parse', function ($parse) {
 
var directive = {
link: link,
restrict: 'A',
require: '?ngModel'
};
return directive;
 
function link(scope, elem, attrs, ctrl) {
// if ngModel is not defined, we don't need to do anything
if (!ctrl) return;
if (!attrs[directiveId]) return;
 
var firstPassword = $parse(attrs[directiveId]);
 
var validator = function (value) {
var temp = firstPassword(scope),
v = value === temp;
ctrl.$setValidity('match', v);
return value;
}
 
ctrl.$parsers.unshift(validator);
ctrl.$formatters.push(validator);
attrs.$observe(directiveId, function () {
validator(ctrl.$viewValue);
});
 
}
}]);
})();
advancePubapp.directive('restrictInput', [function(){

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var ele = element[0];
                var regex = RegExp(attrs.restrictInput);
                var value = ele.value;

                ele.addEventListener('keyup',function(e){
                    if (regex.test(ele.value)){
                        value = ele.value;
                    }else{
                        ele.value = value;
                    }
                });
            }
        };
    }]);    
/*
Automatic phone number formatting in input field

Credits: 
    - Wade Tandy via
    http://stackoverflow.com/questions/19094150/using-angularjs-directive-to-format-input-field-while-leaving-scope-variable-unc
    
    - kstep via
    http://stackoverflow.com/questions/12700145/how-to-format-a-telephone-number-in-angularjs
    
    - hans via
    http://codepen.io/hans/details/uDmzf/
*/
  
advancePubapp.directive('phonenumberDirective', ['$filter', function($filter) {
		function link(scope, element, attributes) {
			// scope.inputValue is the value of input element used in template
			//scope.inputValue = scope.phonenumberModel;
			scope.$watch('phonenumberModel', function(value, oldValue) {
				value = String(value);
				var number = value.replace(/[^0-9]+/g, '');
				scope.phonenumberModel = number;
				scope.phonenumberModel = $filter('phonenumber')(number);
				if(number.length < 10 && scope.phonenumberModel){
					scope.phonetrue = true;
					scope.validationmsg = "Maximum length 10";
				}else if(number.length > 10 && scope.phonenumberModel){
					scope.phonetrue = true;
					scope.validationmsg = "Minimum length 10";
				}				
				else if(scope.phonenumberModel.length < 14 && scope.phonenumberModel){
					scope.phonetrue = true;
					scope.validationmsg = "Minimum length 10";
				}else{
					scope.phonetrue = false;
				}
			});
		}
		return {
			link: link,
			restrict: 'E',
			scope: {
				phonenumberPlaceholder: '=placeholder',
				phonenumberModel: '=model',
				phonetrue: '=',
				iseditable:'='
			},
			//templateUrl: '/static/phonenumberModule/template.html',
			template: '<md-input-container class="md-block">'+' <label>Phone Number</label> '+'<input ng-model="phonenumberModel" type="tel" class="phonenumber" ng-disabled="iseditable"><span style="color:rgb(221,44,0);" ng-if="phonetrue&&phonenumberModel">{{validationmsg}}</span>'+ '</md-input-container>',            
            
            /*template: '<md-input-container class="md-block">'+' <label>Phone Number</label> '+'<input ng-model="inputValue" type="tel" class="phonenumber" placeholder="{{phonenumberPlaceholder}}" ><span style="color:rgb(221,44,0);" ng-if="phonetrue&&inputValue">Minimum length 10</span>'+' </md-input-container>',  */
		};
	}])
    	
	advancePubapp.filter('phonenumber', function() {	    
	    return function (number) {
	        if (!number) { return ''; }
	        number = String(number);
 	        var formattedNumber = number;
			var c = (number[0] == '1') ? '1 ' : '';
			number = number[0] == '1' ? number.slice(1) : number;
			var area = number.substring(0,3);
			var front = number.substring(3, 6);
			var end = number.substring(6, 10);
			if (front) {
				formattedNumber = (c + "(" + area + ") " + front);	
			}
			if (end) {
				formattedNumber += ("-" + end);
			}
			return formattedNumber;
	    };
	});

/*advancePubapp.directive('phoneInput', function($filter, $browser) {
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            console.log($element);
            var listener = function() {
                var value = $element.val().replace(/[^0-9]/g, '');
                $element.val($filter('tel')(value, false));
            };

            // This runs when we update the text field
            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.replace(/[^0-9]/g, '').slice(0,10);
            });

            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() {
                $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
            };

            $element.bind('change', listener);
            $element.bind('keydown', function(event) {
                var key = event.keyCode;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
                    return;
                }
                $browser.defer(listener); // Have to do this or changes don't get picked up properly
            });

            $element.bind('paste cut', function() {
                $browser.defer(listener);
            });
        }

    };
});

advancePubapp.filter('tel', function () {
    return function (tel) {         
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 1:
            case 2:
            case 3:
                city = value;
                break;

            default:
                city = value.slice(0, 3);
                number = value.slice(3);
        }

        if(number){
            if(number.length>3){
                number = number.slice(0, 3) + '-' + number.slice(3,7);
            }
            else{
                number = number;
            }

            return ("(" + city + ") " + number).trim();
        }
        else{
            return "(" + city;
        }

    };
});*/
advancePubapp.directive('hcPieChart', function () {
                    return {
                        restrict: 'E',
                        template: '<div></div>',
                        scope: {
                            chartdata: '=',
                            chartobj : "&"
                        },
                        link: function (scope, element) {
                            var chart;myArray=[];
                            function drawChart(){
                                chart = Highcharts.chart(element[0], {
                                    credits: {
                                        enabled: false
                                    },
                                    chart: {
                                        type: 'pie'
                                    },
                                    title: {
                                        text: scope.chartdata.title,
                                        align: 'left'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: false,
                                                format: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f} %)'
                                            },
                                            showInLegend: true
                                            /*point: {
                                                events: {
                                                    legendItemClick: function (event) {                       
                                                        total = $(".highcharts-legend .highcharts-legend-item").length;
                                                        hiden = $(".highcharts-legend .highcharts-legend-item-hidden").length;                 				
                                                        eventName = event.target.name;
                                                        eventNameIndex = $.inArray(eventName, myArray);
                                                        if((total-1) == hiden){ 
                                                            if(eventNameIndex >-1){
                                                                myArray.splice(eventNameIndex, 1);        
                                                            }else{
                                                                event.preventDefault();
                                                                this.select(); 
                                                            }
                                                        }else{
                                                            if(eventNameIndex >-1){
                                                                myArray.splice(eventNameIndex, 1);
                                                            }else{
                                                                myArray.push(eventName);
                                                            } 
                                                        }
                                                    }
                                                }
                                            }*/
                                        },
                                        /*series: {
                                            point: {
                                                events: {
                                                    legendItemClick: function () {
                                                        return false; // <== returning false will cancel the default action
                                                    }
                                                }
                                            }
                                        }*/
                                    },
                                    exporting: {
                                           enabled: false
                                    },
                                    tooltip: {
                                          pointFormat: "<b>{point.y} ({point.percentage:.2f} %)</b>"
                                    },
                                    lang: {
                                        noData: 'No data found!'
                                    },
                                    series: [{
                                        data: scope.chartdata.data
                                    }]
                                });
                            };
                            
                            scope.chartdata.change = function(chartData){
                                chart.series[0].update({
                                    data: chartData.data
                                });
                                scope.chartobj({response:chart});
                            };
                            
                            function init(){
                                drawChart();
                                if(angular.isDefined(chart)){
                                    chart.options.plotOptions = {pie: {dataLabels: {enabled: true,format: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f} %)'}}};
                                    scope.chartobj({response:chart});
                                } 
                            };
                            init();
                        }
                }
});

advancePubapp.directive('hcPieLoadChart', function () {
                    return {
                        restrict: 'E',
                        template: '<div></div>',
                        scope: {
                            chartdata: '='
                        },
                        link: function (scope, element) {
                            var chart = Highcharts.chart(element[0], {
                                credits: {
                                    enabled: false
                                },
                                chart: {
                                    type: 'pie'
                                },
                                title: {
                                    text: scope.chartdata.title,
                                    align: 'left'
                                },
                                plotOptions: {
                                    pie: {
                                        allowPointSelect: true,
                                        cursor: 'pointer',
                                        dataLabels: {
                                            enabled: false,
                                            format: '<b>{point.name}</b>: {point.percentage:.2f} %'
                                        },
                                        showInLegend: true
                                    }
                                },
                                tooltip: {
                                      pointFormat: "{point.name}: {point.percentage:.2f} %"
								},
                                lang: {
                                    noData: 'No data found!'
                                },
                                series: [{
                                    data: scope.chartdata.series[0].data
                                }]
                            });
                            scope.chartdata.change = function(chartData){
                                chart.series[0].update({
                                        data: chartData.series[0].data
                                });
                            }
                            
                        }
                }
});

advancePubapp.directive('roleType', function () {
    return {
        restrict: 'A',
        templateUrl: 'dest/templates/adminroletypedisplay.html',
        link: function (scope, element, attrs) {
        }
    }
});
advancePubapp.directive('studentsInClass', function () {
    return {
        restrict: 'E',
        templateUrl: typeof(siteURL) == "undefined" ? 'dest/templates/studentsInClass.html' :'dest/templates/studentsInClass.html',
        controller: 'studentsInClassController',
        scope: {
            studentsList: '=',
            parentPagetitle:'@',
            assigncontentToClassPage :'&'
        },
        link:function(scope, element, attributes){
           // console.log(scope.parentPagetitle);
        }
    };
});
advancePubapp.directive('tableDiv', function () {
    function link(scope, element, attrs){
        /*scope.$watchcollection(scope.datasource.data,function (newVal,oldVal) {
            scope.datasource.data = newVal;
        })*/
    }
    return {
        restrict: "EA",
        templateUrl:templateURL+"dest/templates/tabledirective.html",
        controller:"tabledirectiveController",
        link:link,
        scope:{
            datasource:"=",
            crossicon:"=",
            getSourcedata:"&",
			closeregisteration: "&",
            datatable: "=",
            paginationdata:"="
        }
  };
}).directive('serverTableDiv', function () {
    function link(scope, element, attrs){
        /*scope.$watchcollection(scope.datasource.data,function (newVal,oldVal) {
            scope.datasource.data = newVal;
        })*/
    }
    return {
        restrict: "EA",
        templateUrl:templateURL+"dest/templates/servertabledirective.html",
        controller:"servertabledirectiveController",
        link:link,
        scope:{
            datasource:"=",
            crossicon:"=",
            getSourcedata:"&",
			closeregisteration: "&",
            datatable: "=",
			buttonupdate: "&",
			assigncc:"&"
        }
  };
}) 

 
advancePubapp.directive('toggleButton', function() {
    return {
        require: 'ngModel',
        scope: {
            levelOne: '@levelOne',
            levelTwo: '@levelTwo',
            levelSelected: '=ngModel'
        },
        replace: true,
        transclude: true,
        template: '<div>' +
            '<span ng-transclude></span> ' +
            '<button class="btn" ng-class="{\'btn-primary\': state.value}" ng-click="state.toggle()">{{levelOne}}</button>' +
            '<button class="btn" ng-class="{\'btn-primary\': !state.value}" ng-click="state.toggle()">{{levelTwo}}</button>' +
            '</div>',
        link: function postLink(scope) {
            scope.levelSelected = scope.levelOne;
            scope.state = {
                value: true,
                toggle: function() {
                    this.value = !this.value;
                    scope.levelSelected = this.value ? scope.levelOne : scope.levelTwo;
                }
            };
        }
    }
})
advancePubapp.directive('hcWorldChart', function () { 
                    return {
                        restrict: 'E',
                        template: '<div></div>',
                        scope: {
                             chartdata: '=',
                            chartobj : "&"
                        },
                        link: function (scope, element) {
                            
                            function drawChart(){
                                chart = Highcharts.mapChart(element[0], {
                                    chart: {
                                        map: 'custom/world'
                                    },
                                    credits: {
                                        enabled: false
                                    },

                                    title: {
                                        text: "SOURCE OF TRAFFIC : BY GEOGRAPHY",
                                        align: 'left'
                                    },
                                    exporting: {
                                        enabled: false
                                    },
                                    mapNavigation: {
                                        enabled: false
                                    },
                                    colorAxis: {
                                        min: 1,
                                        type: 'logarithmic',
                                        minColor: '#347789',
                                        maxColor: '#06b7e8'
                                    },

                                    series: [{
                                        data: scope.chartdata.data,                                         
                                        name: 'Users',                                         
                                        states: {
                                            hover: {
                                            color: '#BADA55'
                                            }
                                        },

                                        dataLabels: {
                                            enabled: true,
                                            formatter: function () {                
                                                if(this.point.value > 0){
                                                    return this.point.name+" - "+this.point.value;
                                                }
                                            }                                          

                                        }
                                    }],

                                          //series: scope.chartdata.series
                                        });
                            };
                            
                            scope.chartdata.change = function(chartData){
                                chart.series[0].update({
                                    data: chartData
                                });
                                scope.chartobj({response:chart});
                            };
                            function init(){                        
                                drawChart();
                                if(angular.isDefined(chart)){                                    
                                    scope.chartobj({response:chart});
                                }
                            };
                    
                            init();
                        
                            

                            
                        }
                };
});

advancePubapp.directive('yrInteger', function () {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.on('keypress', function(event) {
                if (!isIntegerChar())
                    event.preventDefault();
                function isIntegerChar() {
                    return /[0-9]/.test(
                        String.fromCharCode(event.which))
                }
            })
        }
    }
});
advancePubapp.constant('appconstants',{
	monthdays :{
		January   : "31",
		February  : "29",
		March     : "31",
		April     : "30",
		May       : "31" ,
		June      : "30",
		July      : "31",
		August    : "31",
		September : "30",
		October   : "31",
		November  : "30",
		December  : "31"
	}
}); 
advancePubapp.factory('IdleTimeout', function ($timeout, $document) {

    return function (delay, onIdle, playOnce) {

        var idleTimeout = function (delay, onIdle) {
            var $this = this;
            $this.idleTime = delay;
            $this.goneIdle = function () {
                //console.log('Gone Idle');
                onIdle();
                $timeout.cancel($this.timeout);
            };
            return {
                cancel: function () {
                    //console.log('cancelTimeout');
                    return $timeout.cancel($this.timeout);
                },
                start: function (event) {
                    //console.log('startTimeout', $this.idleTime);
                    $this.timeout = $timeout(function () {
                        $this.goneIdle();
                    }, $this.idleTime);
                }
            };
        };

        var events = ['keydown', 'keyup', 'click', 'mousemove', 'DOMMouseScroll', 'mousewheel', 'mousedown', 'touchstart', 'touchmove', 'scroll', 'focus'];
        var $body = angular.element($document);
        var reset = function () {
            idleTimer.cancel();
            idleTimer.start();
        };
        var idleTimer = idleTimeout(delay, onIdle);



        return {
            active: true,
            cancel: function () {
                idleTimer.cancel();
                _.each(events, function (event) {
                    $body.off(event, reset);
                });
            },
            start: function () {
                idleTimer.start();
                _.each(events, function (event) {
                    $body.on(event, reset);
                });
            }
        };
    };

}).directive('timeoutTest', ['IdleTimeout','sessionService','encryptionService', function (IdleTimeout,sessionService,encryptionService) {
    return {
        restrict: 'AC',
        controller: function($scope) {
            $scope.msg = '';            
            $scope.timer = null;
            $scope.active = false;
            $scope.start = function(timer) {
                sessionValue = Number(encryptionService.decrypt(sessionService.get('sessionExpired')));
                timeOut = sessionValue == 0 ? 300*1000 : sessionValue *1000;
                //console.log("timeout",$scope.pages);
                $scope.timer = new IdleTimeout(timeOut, $scope.cancel);
                $scope.timer.start();
                $scope.msg = 'Timer is running';
                $scope.active = true;
            };
            $scope.cancel = function() {
                //console.log('app has gone idle');

                $scope.timer.cancel();
                $scope.msg = 'Timer has stopped.';
                $scope.active = false;
            };
        },
        link: function($scope, $el, $attrs) {
            $scope.start();
        }
    };
}]);

advancePubapp.factory('PaginationService',function(){
    // service definition
    var service = {};
 
    service.GetPager = GetPager;
 
    return service;
 
    // service implementation
    function GetPager(totalItems, currentPage, pageSize) {
        // default to first page
        currentPage = currentPage || 1;
 
        // default page size is 10
        pageSize = pageSize || 10;
 
        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);
 
        var startPage, endPage;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }
 
        // calculate start and end item indexes
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
 
        // create an array of pages to ng-repeat in the pager control
        var pages = _.range(startPage, endPage + 1);
 
        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

    
    })
advancePubapp.factory('paginationDatamanagement', ['sfactory','$window','encryptionService',function(sfactory,$window,encryptionService) {
    /*Method to cache list of selected items while paginating the page*/
   return {
         selectedItems: []
   }
}]);
advancePubapp.factory('sessionInterceptor',['$window', function($window){
  
  var sessionInjector = {
        request: function(config) {
            if((config.url).indexOf("adminLogin") === -1){
				session_Id = $window.sessionStorage.getItem('session_Id');	
				grp_id = $window.sessionStorage.getItem('grp_id');	
                config.headers['sessionId'] = session_Id;
				if(grp_id){
					 config.headers['group_id'] = grp_id;
				}
            }
            return config;
        }
    };
    return sessionInjector; 
}]);

/*
advancePubapp.factory('stateService',function() {
  return {
	 myState: "foo"
  }
})
advancePubapp.config(['$httpProvider', function($httpProvider) {  
    $httpProvider.interceptors.push('sessionInjector');
}]);*/


advancePubapp.factory('sharedService',function() {
  return {
	 imageName: "No image",
     fullname: "User, fullname"
  }
});

advancePubapp.factory('sessionValidator',function($http,$q,$rootScope,$cookies,$state,$stateParams){ 	
return {
        /* Post method */
        fetchData: function() {   
            if(typeof(siteAdminURL) == "undefined"){
                 /* Code needs to be un commented in local dev environement only */
                var adminType = "groupAdmin"; // groupAdmin for sommer and abc group admins. superAdmin only for super users ...    
                $cookies.put('isAdminLoggedIn',"true");
                $cookies.put('adminType',adminType);
                $cookies.put('groupTypeId',"108");
                $cookies.put('groupType','true'); 
            }
            var session = $cookies.get('isAdminLoggedIn'); 
            var sessionType = {sessionedAdmintype:$cookies.get('adminType'),grpId:$cookies.get('groupTypeId') ? $cookies.get('groupTypeId') : null};
            var defer = $q.defer();
            if(session){
                defer.resolve(sessionType);
            }
            else{
                defer.reject();
            }
            return defer.promise;
        }
    }

});  
advancePubapp.factory('sharedService',function() {
  return {
	 imageName: "No image",
     fullname: "User, fullname",
     selectedTab: 0,
     forumTabs:0
  }
});


advancePubapp.factory('spinnerService', function () {  
  // create an object to store spinner APIs.
  var spinners = {};
  return {
    // private method for spinner registration.
    _register: function (data) {
      if (!data.hasOwnProperty('name')) {
        throw new Error("Spinner must specify a name when registering with the spinner service.");
      }
      if (spinners.hasOwnProperty(data.name)) {
        throw new Error("A spinner with the name '" + data.name + "' has already been registered.");
      }
      spinners[data.name] = data;
    },
    // unused private method for unregistering a directive,
    // for convenience just in case.
    _unregister: function (name) {
      if (spinners.hasOwnProperty(name)) {
        delete spinners[name];
      }
    },
    _unregisterGroup: function (group) {
      for (var name in spinners) {
        if (spinners[name].group === group) {
          delete spinners[name];
        }
      }
    },
    _unregisterAll: function () {
      for (var name in spinners) {
        delete spinners[name];
      }
    },
    show: function (name) {
      var spinner = spinners[name];
      if (!spinner) {
        throw new Error("No spinner named '" + name + "' is registered.");
      }
      spinner.show();
    },
    hide: function (name) {
      var spinner = spinners[name];
      if (!spinner) {
        throw new Error("No spinner named '" + name + "' is registered.");
      }
      spinner.hide();
    },
    showGroup: function (group) {
      var groupExists = false;
      for (var name in spinners) {
        var spinner = spinners[name];
        if (spinner.group === group) {
          spinner.show();
          groupExists = true;
        }
      }
      if (!groupExists) {
        throw new Error("No spinners found with group '" + group + "'.")
      }
    },
    hideGroup: function (group) {
      var groupExists = false;
      for (var name in spinners) {
        var spinner = spinners[name];
        if (spinner.group === group) {
          spinner.hide();
          groupExists = true;
        }
      }
      if (!groupExists) {
        throw new Error("No spinners found with group '" + group + "'.")
      }
    },
    showAll: function () {
      for (var name in spinners) {
        spinners[name].show();
      }
    },
    hideAll: function () {
      for (var name in spinners) {
        spinners[name].hide();
      }
    }
  };
});
advancePubapp.service('cacheFactory', ['$cacheFactory', function($cacheFactory) {
	return $cacheFactory('super-cache');
 }]);
advancePubapp.service('cacheService', ['sfactory','$q','sharedService','$rootScope',function(sfactory,$q,sharedService,$rootScope) {
    
	/* Method for get internal cache from server side */
	var cacheData={}; 
    this.getAndSet = function (){
        var deferred = $q.defer();
        if(!angular.isDefined(cacheData.data)){
            var task = "adminGroupDetails";
            sfactory.serviceCall({},task,'adminPage').then(function(response){
                 if(response.status.toLowerCase() == 'success'){
                     cacheData.data = response.data;
                     if(response.data.profileImage.type == "others"){
                        sharedService.imageName = (response.data.profileImage.name != "") ? response.data.profileImage.url+response.data.profileImage.name : "";                         
                     }else{
                        sharedService.imageName = response.data.profileImage.url;
                     } 
                     sharedService.fullname = response.data.loggedBy;
                 }
                 $rootScope.appLoader = false;
                 deferred.resolve(cacheData.data);
             },
              function(){
                var localTask = "admingroupdetails";
                sfactory.localService(localTask).then(function(response){
                    cacheData.data = response.data;
                    if(response.data.profileImage.type == "others"){
                        sharedService.imageName = response.data.profileImage.url+response.data.profileImage.name;                        
                    }    
                    sharedService.fullname = response.data.loggedBy;
                    deferred.resolve(cacheData.data);
                },function(error){
                });
            }); 
        }else{
			deferred.resolve(cacheData.data);
		} 
        return deferred.promise;
    };
  
	/* Method for get value */
	this.get = function(key){
		return cacheData.data[key];
	};
	
	/* Method for empty object */
    this.empty = function(){
		cacheData={};
	};
	
    /* Method to set the cachedata */
	this.set = function(value){
		cacheData.data['searchkey'] = value;
	};
		
}]);

advancePubapp.service('encryptionService',function() {
    
    var key = CryptoJS.enc.Hex.parse("0123456789abcdef0123456789abcdef");
    var iv =  CryptoJS.enc.Hex.parse("abcdef9876543210abcdef9876543210");
    
    /* Method to encrypt data */
    this.encrypt= function(data){
        var encrypted = CryptoJS.AES.encrypt(data, key, {iv:iv});
        return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    };
    
    /* Method to decrypt data */
    this.decrypt = function(encrypted){
       var decrypted = CryptoJS.AES.decrypt(encrypted,key,{iv: iv});
        return decrypted.toString(CryptoJS.enc.Utf8);
     };
});
advancePubapp.service('jwtEncoder', function() { 
 
    /* Method to create JWT for requesting json*/
    this.encode = function(key){
		if(angular.isObject(key)){
           key = JSON.stringify(key);
        }
		/*Json web token for ajax calls*/
		var header = {
		  "alg": "HS256",
		  "typ": "JWT"
		};
		
		var encodedHeader = getBase64(JSON.stringify(header));
		var encodedData = getBase64(key);
		
		/*var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
		var encodedHeader = base64url(stringifiedHeader);

		
		var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(key));
		var encodedData = base64url(stringifiedData);*/

		var token = encodedHeader + "." + encodedData;
		
		var secret = "74c570a558f9207faa7f56e5a63daa5f";
		var signature = CryptoJS.HmacSHA256(token, secret);
		signature = base64url(signature);
		var signedToken = token + "." + signature;
		
		/*var utf8Val = CryptoJS.enc.Utf8.parse(key);
		var base64Val = CryptoJS.enc.Base64.stringify(utf8Val);
		if(localStorage.getItem('tokenId') != null && localStorage.getItem('tokenId') != undefined){
			var token = localStorage.getItem('tokenId').split('.')[0] +"."+base64Val+ '.' + localStorage.getItem('tokenId').split('.')[2];
		}*/
		return signedToken;
    };
    
	/*Method to return base64 value.*/
	function getBase64(value){
		var stringifiedHeader = CryptoJS.enc.Utf8.parse(value);
		var encodedHeader = base64url(stringifiedHeader);
		return encodedHeader;
	}
	
	/*Method to encode signature with regexp*/
    function base64url(source) {
	  // Encode in classical base64
	  encodedSource = CryptoJS.enc.Base64.stringify(source);

	  // Remove padding equal characters
	  encodedSource = encodedSource.replace(/=+$/, '');

	  // Replace characters according to base64url specifications
	  encodedSource = encodedSource.replace(/\+/g, '-');
	  encodedSource = encodedSource.replace(/\//g, '_');

	  return encodedSource;
	}
});
advancePubapp.factory('messagingService',function() {
    return {
        msgcount : 0,
        notifyCount : 0,
        userIds :[]
    }    
});
//To set params and api for delete action (Service)
advancePubapp.service('getParams', function() {
    this.args = function(rowheadVal,rowbodyVal) {
        
        var params = null;
        var api = null;
        var viewName = rowheadVal.actionMethods.delete.viewName;
        if(viewName){
            if(viewName.toLowerCase() == 'user'){
                return {params : {user_id:rowbodyVal.id},api:rowheadVal.actionMethods.delete.api}
            }
             if(viewName.toLowerCase() == 'categories'){
				return {params : {id:rowbodyVal.id},api:rowheadVal.actionMethods.delete.api}   
            } 
			if(viewName.toLowerCase() == 'courses'){
				return {params : {id:rowbodyVal.id},api:rowheadVal.actionMethods.delete.api}  
            } 
			if(viewName.toLowerCase() == 'classes'){
				return {params : {id:rowbodyVal.id},api:rowheadVal.actionMethods.delete.api}   
            } 
            
            if(viewName.toLowerCase() == 'group'){
				return {params : {id:rowbodyVal.id},api:rowheadVal.actionMethods.delete.api}  
            } 
             
        }
    };
});

//To set params and api for delete action (Service)
advancePubapp.service('getParamsDelete', function() {
    this.args = function(viewName,idsarray,titlearray) {       
        var params = null;
        var api = null;
        if(viewName){
            if(viewName.toLowerCase() == 'user'){
                //return {params : {user_id:rowbodyVal.id}}
                //return {params :  {catAction:'UserMultiDel',courseCatIds:idsarray,courseCatTitles:titlearray}}
			    var idsarraylist=_.map(idsarray).join(', ');
                return {params : {user_id:idsarraylist,isAdmin:'listDetails'}}
            }
             if(viewName.toLowerCase() == 'categories'){
				var idsarraylist=_.map(idsarray).join(',');
                return {params : {id:idsarraylist}}
            } 
            if(viewName.toLowerCase() == 'courses'){
				var idsarraylist=_.map(idsarray).join(',');
                return {params : {id:idsarraylist}}
            }
			if(viewName.toLowerCase() == 'classes'){
                var idsarraylist=_.map(idsarray).join(',');
                return {params : {id:idsarraylist,isAdmin:'listDetails'}}
            } 
            if(viewName.toLowerCase() == 'group'){
                var idsarraylist=_.map(idsarray).join(',');
                return {params : {id:idsarraylist,isAdmin:'listDetails'}}
				//return {params : {groupAction:'groupMultiDel',courseCatIds:idsarray,courseCatTitles:titlearray}}   
            } 
            
        }
    };
});
//user.delete_list
//To set params and api for status action (Service)
advancePubapp.service('getParamsstatus', function() {
    this.args = function(rowheadVal,id,rowVal,rowbody) {
      /*  if(rowheadVal.actionMethods.status.isModify){
            var customParams = {action:null,id:id}
        }
        else{
            var customParams = {action:null,id:id};
        }*/
		if(rowheadVal.actionMethods && rowheadVal.actionMethods.status &&rowheadVal.actionMethods.status.api == "content_v2.sectionGroupAssign"){
			var customParams = {action:null,id:id,section_activities:rowbody.section_activities,section_courses:rowbody.section_courses};
		}else{
			var customParams = {action:null,id:id};
		}
		
        var statusRef = {params : customParams,api : rowheadVal.actionMethods.status.api};
        var viewName = rowheadVal.actionMethods.status.viewName;
        if(rowVal){
            statusRef.params.action = "act"; 
        }
        else{
		  statusRef.params.action = "deact"; 
        }
        return statusRef;             
    };
}); 

advancePubapp.service('reportService', function() {
    
    this.loadPiechart = function (data,title){
       var updatedData= {
            title: title,
            data: []
        }
        var item={};
        if(_.reduce(_.pluck(data, 'count'), function(data, num) { return data + num}, 0) !== 0){
           angular.forEach(data,function(obj){
                item.name = obj.label;
                item.y = obj.count;
                updatedData.data.push(item);
                item={};
            });
        }
        return updatedData;
    };

    function getLabels(data){
        var labelArray=[];
        _.each(data,function(obj){
            labelArray.push(obj.label);
        });
        return labelArray;
    };
    
    function getChartData(data,XAxis,filter,key){
        var dataArray = new Array(XAxis.length).fill(0);
        if(filter === 'year'){
                angular.forEach(data.data,function(obj){
                if(XAxis.indexOf(new Date(obj.date).getFullYear()) !== -1){
                    dataArray[XAxis.indexOf(new Date(obj.date).getFullYear())] = dataArray[XAxis.indexOf(new Date(obj.date).getFullYear())] + obj[key];
                    }
                });
        }
        else if(filter === 'month'){
                angular.forEach(data.data,function(obj){
                    dataArray[XAxis.indexOf(XAxis[new Date(obj.date).getMonth()])] = dataArray[XAxis.indexOf(XAxis[new Date(obj.date).getMonth()])]+obj[key];
                });
        }
        else if(filter === 'week'){
                angular.forEach(data.data,function(obj){
                    dataArray[getWeekNumber(obj.date)-1] = dataArray[getWeekNumber(obj.date)-1]+obj[key];
                });
        }
        else if(filter === 'day'){
                angular.forEach(data.data,function(obj){
                    dataArray[XAxis.indexOf(obj.date)] = dataArray[XAxis.indexOf(obj.date)]+obj[key];
                });
        }
        return dataArray;
    };
    
    this.updateChart = function(data,title,dateRange){
        var labels = getLabels(data);
        var startYear = new Date(dateRange.startDate).getFullYear();
        var lastYear = new Date(dateRange.endDate).getFullYear();
        var years=[],seriesData=[],item={},updatedData={},monthArray=[],weekArray=[],daysArray=[];
        var startMonth = new Date(dateRange.startDate).getMonth();
        var endMonth = new Date(dateRange.endDate).getMonth();
        var startWeekNo = getWeekNumber(dateRange.startDate);
        var endWeekNo = getWeekNumber(dateRange.endDate);
        var diffDays = Math.round(Math.abs((new Date(dateRange.startDate).getTime() - new Date(dateRange.endDate).getTime()) / (24 * 60 * 60 * 1000)));
        var key = (title === 'Conversion Ratio : Guest to registrants') ? 'percentage' : 'count';
        if (startYear !== lastYear){
            //Yearly Data
            seriesData =[];
             for(var i = startYear ; i<=lastYear ; i++){
                 years.push(i);
             }
             updatedData = getSeriesData(data,years,'year',key);
        }
        else if (startYear == lastYear) {
            if (startMonth !== endMonth) {
                //Monthly Data
                seriesData =[];
                monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                updatedData = getSeriesData(data,monthArray,'month',key);
            }
             else if (startMonth == endMonth) {
                if (diffDays < 7 && startWeekNo === endWeekNo) {
                    daysArray = getDailyrange(getweekDuration(new Date(dateRange.startDate)).firstDate,getweekDuration(new Date(dateRange.startDate)).lastDate,startMonth+1,startYear)
                    updatedData = getSeriesData(data,daysArray,'day',key);
                }
                else{
                    //Weekly Data
                     for (var i = 0; i < weekCount(lastYear, endMonth + 1, 0); i++) {
                       weekArray.push("Week " + (i + 1));
                     }
                    updatedData = getSeriesData(data,weekArray,'week',key);
                }
            }
        }
        return updatedData;
    };
    
    function getSeriesData(data,Xaxis,filter,key){
        var updatedData=[],seriesData=[],item={};
        _.each(data,function(obj){
                item.data = getChartData(obj,Xaxis,filter,key);
                seriesData.push(item);
                item ={};
            });
            updatedData.x = Xaxis;
            updatedData.series = getSeries(seriesData);
        return updatedData;
    };
      
    function getSeries(data){
        var totalData=0;
        _.each(data, function(item) {
            totalData = totalData + _.reduce(item.data, function(data, num) { return data + num}, 0);
        });
        if(totalData === 0){
            angular.forEach(data,function(obj){
                obj.data =[];
            });
        }
        return data;
    };
    
    this.loadChart = function (data,title){
        var daysArray = Last7Days().split(',').reverse();
        var seriesData=[],item={},chartData={};
        var key = (title === 'Conversion Ratio : Guest to registrants') ? 'percentage' : 'count';
        var percentage = new Array(daysArray.length).fill(0);
        _.each(data, function(obj) {
            item.name = obj.label;
            item.data = getData(obj.data,daysArray,key);
            item.selected= true;
            seriesData.push(item);
            item={};
        });
        chartData.title = title;
        chartData.x = daysArray;
        chartData.series = getSeries(seriesData);
        return chartData;
    }

    function getData(data,daysArray,key){
        var lineData= new Array(daysArray.length).fill(0);
        angular.forEach(data,function(obj){
            if(daysArray.indexOf(obj.date) !== -1){
                lineData[daysArray.indexOf(obj.date)] = lineData[daysArray.indexOf(obj.date)]+obj[key];
            }
        });
        return lineData;
    };
  
    function getSVG(charts) {
        var svgArr = [],
            top = 0,
            width = 0;
        Highcharts.each(charts, function (chart) {
            var svg = chart.getSVG(),
                svgWidth = +svg.match(
                    /^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/
                )[1],
                svgHeight = +svg.match(
                    /^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/
                )[1];

            svg = svg.replace(
                '<svg',
                '<g transform="translate(0,' + top + ')" '
            );
            svg = svg.replace('</svg>', '</g>');

            top += svgHeight;
            width = Math.max(width, svgWidth);

            svgArr.push(svg);
        });

        return '<svg height="' + top + '" width="' + width +
            '" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
            svgArr.join('') + '</svg>';
    };
    
    this.exportCharts = function (charts, options) {
        options = Highcharts.merge(Highcharts.getOptions().exporting, options);
        Highcharts.post(options.url, {
            filename: options.filename || 'chart',
            type: options.type,
            width: options.width,
            svg: getSVG(charts)
        });
    };

});

advancePubapp.service('sessionService', ['$window','encryptionService',function($window,encryptionService) {
 
    /* Method for set sessionstorage */
    this.set = function(key,value){
        $window.sessionStorage.setItem(key,value);
    };
    
    /* Method for get sessionstorage */
	this.get = function(key){
		return $window.sessionStorage.getItem(key);	
	};
    
    /* Method for set sessionstorage with encription */
    this.setData = function(key,value){
        $window.localStorage[key] = encryptionService.encrypt(JSON.stringify(value));
    };
    
    /* Method for get sessionstorage with decription */
	this.getData = function(key){
		if($window.localStorage[key] != null){	
			return encryptionService.decrypt($window.localStorage[key]);
		}
        else{
            return null;
        }
	};
    
    this.emptyData = function(key){
		$window.localStorage.removeItem(key);
	};
    
	/* Method for clear value */
	this.clear =function(){
		angular.forEach($window.sessionStorage, function (item,key) {
			$window.sessionStorage.removeItem(key);
        });
	};
    
	this.empty = function(key){
		$window.sessionStorage.removeItem(key);
	} 
}]);  
advancePubapp.service('taskService', function() {

    var map = {
        contentmanagementController : {
            getContents: 'content_v2.contentsList',
            activityAssign: 'content_v2.scormGroupAssign',
            courseAssign: 'content_v2.catGroupAssign',
            lessonAssign: 'content_v2.lessonGroupAssign',
            sectionAssign: 'content_v2.sectionGroupAssign',
            assignSurvey:'survey.assign_survey',
            getBookList:'media_library_products',
            getMediaLibraryMenuContent : 'medialibrary.mediaContentMenu',
            getMediaLibraryContent : 'medialibrary.mediaContentDetails',
            getMediaLibraryActions : 'medialibrary.mediaContentActions'
        },
        classmanagementTask : {
            getClasses: 'adminclass.classList',
            checkClassExistance: 'adminclass.classnameexist',
            classadminlist: 'adminclass.classadminlist',
            getUserlist: 'adminclass.fetchStudentList',
            getExistingstudentslist:'adminclass.fetchStudentList',
            getExistingstudentslistClass:'adminclass.fetchStudentList',
            addExistingstudentstoclass:'adminclass.addStudenttoclass',
            getExistingstudnetslistGroup:'adminclass.fetchClassStudentList',
            addExistingstudentstogroup:'adminclass.addStudenttoGroup',
            getExistingstudentslistExistingClass:'adminclass.getExpectclassstudent',
            getExistingstudnetslistClass:'adminclass.getExpectgroupstudent',
        },
        classDetailsController : {
            getClassDetails: 'adminclass.getClassgroupdetails',
            getGroupDetails: 'adminclass.getGroupstudentdetails',
            getContents: 'adminclass.classAssignContentList',
            deleteClass: 'adminclass.deleteClass',
            deleteGroup: 'adminclass.deleteClassGroup',
            getHeader:'adminclass.contentheader'
        },
        createClassController : {
            addNewClass: 'adminclass.addClass',
            editClass: 'adminclass.editClass',
            teacherlist :'adminclass.editclassadminlist'
        },
        addStudentModalController : { 
            validateUsername :"adminclass.userNameExistCheck",
            validateEmail:"adminclass.emailExistCheck",
            addnewstudent:"adminclass.addnewstudent",
            multipleuserImport:"adminclass.userImport"
        },
        phonicsClassController : {
            getClasses: 'adminclass.getDashboardDetails',
            getUserlist: 'adminclass.fetchStudentList',
            getExistingstudentslist:'adminclass.fetchStudentList',
            getExistingstudentslistClass:'adminclass.fetchStudentList',
            addExistingstudentstoclass:'adminclass.addStudenttoclass',
            getExistingstudnetslistGroup:'adminclass.fetchClassStudentList',
            addExistingstudentstogroup:'adminclass.addStudenttoGroup',
            getExistingstudentslistExistingClass:'adminclass.getExpectclassstudent',
            getExistingstudnetslistClass:'adminclass.getExpectgroupstudent',
        },
        createGroupController : {
            addNewGroup: 'adminclass.addGroupintoclass',
            editGroup: 'adminclass.editClassGroup',
            checkGroupExistance: 'adminclass.groupnameexist',
            createNewOrg:'organization.add',
            checkOrgExistance  :'organization.orgexistcheck'
        },
        editStudentController : { 
            editStudent: 'adminclass.userEdit',
            removeGroupStudent: 'adminclass.removeUserinGroup',
            removeClassStudent: 'adminclass.removeUserinClass',
            validateEmail:"adminclass.emailExistCheck"
        },
        classcontentmanagementController : { 
            getContents: 'content_v2.contentsList',
            activityAssign: 'content_v2.scormGroupAssign',
            courseAssign: 'content_v2.catGroupAssign',
            lessonAssign: 'content_v2.lessonGroupAssign',
            sectionAssign: 'content_v2.sectionGroupAssign',
            getContents: 'adminclass.classAssignContentList',
            assignCourse: 'adminclass.assignContenttoclass',
            assignCourseIndividual:'adminclass.individualCourseAssign'
        },
        studentprofileController : { 
            studentIndividualAssignment:'adminclass.getStudentIndividualAssignements',
            studentClassAssignment:'adminclass.getStudentClassAssignements',
            studentGroupAssignment: 'adminclass.getStudentGroupAssignements'
        },
        surveyController : {
            getSurveyList:'survey.survey_list',
            createSurvey:'survey.add_survey',
            getSurvey:'survey.getsurvey',
            enableSurvey:'survey.enable_survey',
            editSurvey:'survey.edit_survey',
            deleteSurvey:'survey.delete_survey'
        },
        surveyresultsController :{
            getSurveyResult:'survey.getSurveyResult',
        },
        usermanagementController:{
            getAllUsers : "user.get_newalluser_details",
            getAllTrashUsers : "user.get_alldeleteduser_details",
            createUser:"user.userRegister",
            validateEmail:"user.emailExistCheck",
            validateUserName:"user.userNameExistCheck"
        },
        accordionController :{
            validateEmail:"user.emailExistCheck"
        },
        myProfileController :{
            validateEmail:"user.emailExistCheck"
        },
        groupmanagentController:{
            checkwithExistusername:"groups.userNameExistCheck",
            checkwithExistemail:"groups.emailExistCheck"
        }
    }

    this.getTasks = function(key) {
        return map[key];
    }; 

});
function getSum(startVal, endVal) {
    return startVal + endVal;
}

var getDaysInMonth = function(month,year) {
  return new Date(year, month, 0).getDate();
};

function weekCount(year, month_number, startDayOfWeek) {
  // month_number is in the range 1..12

  // Get the first day of week week day (0: Sunday, 1: Monday, ...)
  var firstDayOfWeek = startDayOfWeek || 0;

  var firstOfMonth = new Date(year, month_number-1, 1);
  var lastOfMonth = new Date(year, month_number, 0);
  var numberOfDaysInMonth = lastOfMonth.getDate();
  var firstWeekDay = (firstOfMonth.getDay() - firstDayOfWeek + 7) % 7;

  var used = firstWeekDay + numberOfDaysInMonth;

  return Math.ceil( used / 7);
}

function getWeekNumber(thisDate) {
    var dt = new Date(thisDate);
    var thisDay = dt.getDate();

    var newDate = dt;
    newDate.setDate(1); // first day of month
    var digit = newDate.getDay();

    var Q = (thisDay + digit) / 7;

    var R = (thisDay + digit) % 7;

    if (R !== 0) return Math.ceil(Q);
    else return Q;
}

/* Method to return first and last date of week */
function getweekDuration(curr){
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6
	first = first > 0 ? first : (first+1);
    return {firstDate:first,lastDate:last};
}


/* Method to get 7 days date range */
function getDailyrange(startdate,enddate,month,year){
    var datesBetween = [];
    while (startdate <= enddate) {
		var date = year+"-"+month+"-"+(startdate+1);
        datesBetween.push(new Date(date).toISOString().substring(0,10));
        startdate = startdate + 1;
    } 
    return datesBetween;
}

function Last7Days() {
    return '0123456'.split('').map(function(n) {
        var d = new Date();
        d.setDate(d.getDate() - n);
        return (function(day, month, year) {
            return [month < 10 ? '0' + (month + 1) : (month + 1), day < 10 ? '0' + day : day,year].join('-');
        })(d.getDate(), d.getMonth(), d.getFullYear());
    }).join(',');
};

/* Method to get last 7 days range*/
function getLast7days(){
    var dateObj={};
    var dateArray = Last7Days().split(',');
    var lastDate = new Date(dateArray[0]);
    var firstDate = new Date(dateArray[(dateArray.length - 1)]);
    var lastMonth = ((1+lastDate.getMonth()) < 10) ? '0'+ (1+lastDate.getMonth()) : (1+lastDate.getMonth());
    var lastendDate = (lastDate.getDate()) < 10 ? '0' + lastDate.getDate() : lastDate.getDate(); 
    var firstMonth = ((1+firstDate.getMonth()) < 10 ) ? '0'+ (1+firstDate.getMonth()) : (1+firstDate.getMonth());
    var firststartDate = (firstDate.getDate()) < 10 ? '0'+firstDate.getDate() : firstDate.getDate();
    dateObj.endDate = lastMonth + '-'+lastendDate+'-'+lastDate.getFullYear();
    dateObj.startDate = firstMonth+'-'+firststartDate+'-'+firstDate.getFullYear();
    return dateObj;
};

/* Method to get current month dates range*/
function getThisMonthdays(){
     var dateObj={};
     var formatted_date = function(date){
        return ("0"+ (date.getMonth()+1)).slice(-2) +'-'+("0"+ date.getDate()).slice(-2) +'-'+ date.getFullYear(); 
     }
     var curr_date =new Date();
     var first_day = new Date(curr_date.getFullYear(), curr_date.getMonth(), 1); 
     var last_day = new Date(curr_date.getFullYear(), curr_date.getMonth() + 1, 0);
     dateObj.endDate = formatted_date(last_day);
     dateObj.startDate = formatted_date(first_day);
     return dateObj;
};

/* Method to get previous month dates range*/
function getLastMonthdays(){
    var dateObj={};
    var curr_date = new Date();
    var prevMonthLastDate = new Date(curr_date.getFullYear(), curr_date.getMonth(), 0);
    var prevMonthFirstDate = new Date(curr_date.getFullYear(), (curr_date.getMonth() - 1 + 12) % 12, 1);
    var formatDateComponent = function(dateComponent) {
      return (dateComponent < 10 ? '0' : '') + dateComponent;
    };
    var formatDate = function(date) {
      return formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate()) + '-' + date.getFullYear();
    };
    dateObj.endDate = formatDate(prevMonthLastDate);
    dateObj.startDate =formatDate(prevMonthFirstDate);
    return dateObj;
};

/* Method to get current year dates range*/
function getYearDays(){
    var dateObj={};
    var firstDay = new Date(new Date().getFullYear(), 0, 1);
    var lastday = new Date(new Date().getFullYear(), 11, 31);
    dateObj.startDate = (1+firstDay.getMonth())+'-'+firstDay.getDate() +'-'+ firstDay.getFullYear();
    dateObj.endDate = (1+lastday.getMonth())+'-'+lastday.getDate() +'-'+ lastday.getFullYear();
    return dateObj;
};

/* Method to get year to date dates range*/
function getYearToDateDays(){
    var dateObj={};
    var firstDay = new Date(new Date().getFullYear(), 0, 1);
    var lastDay = new Date();
    var lastMonth = ((1+lastDay.getMonth()) < 10) ? '0'+ (1+lastDay.getMonth()) : (1+lastDay.getMonth());
    var lastendDate = (lastDay.getDate()) < 10 ? '0' + lastDay.getDate() : lastDay.getDate(); 
    var firstMonth = ((1+firstDay.getMonth()) < 10 ) ? '0'+ (1+firstDay.getMonth()) : (1+firstDay.getMonth());
    var firststartDate = (firstDay.getDate()) < 10 ? '0'+firstDay.getDate() : firstDay.getDate();
    
    dateObj.startDate = firstMonth+'-'+firststartDate +'-'+ firstDay.getFullYear();
    dateObj.endDate = lastMonth+'-'+lastendDate +'-'+ lastDay.getFullYear();
    return dateObj;
};

/* Method to get this quarter dates range*/
function getThisQuarterdays(){
    var dateObj={};
    var firstDay = moment(new Date(new Date().getFullYear(), new Date().getMonth(), 1)).subtract(2, 'months').format('MM-DD-YYYY');
    var lastDay = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    dateObj.endDate = (1+lastDay.getMonth())+'-'+lastDay.getDate() +'-'+ lastDay.getFullYear();
    dateObj.startDate=firstDay;
    return dateObj;
};