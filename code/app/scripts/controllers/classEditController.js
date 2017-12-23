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



