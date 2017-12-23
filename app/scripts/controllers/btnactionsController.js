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

