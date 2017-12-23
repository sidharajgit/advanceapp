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