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