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