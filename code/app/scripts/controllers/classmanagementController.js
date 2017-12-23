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