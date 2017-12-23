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