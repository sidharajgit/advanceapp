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