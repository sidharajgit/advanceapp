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



 