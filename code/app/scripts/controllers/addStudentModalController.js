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