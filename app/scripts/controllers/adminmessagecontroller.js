advancePubapp.controller('adminmessageController',['$scope','sfactory','$rootScope','$filter','$mdConstant','encryptionService','sessionService','$mdDialog','$window','$timeout','$stateParams','messagingService','$interval', function($scope,sfactory,$rootScope,$filter,$mdConstant,encryptionService,sessionService,$mdDialog,$window,$timeout,$stateParams,messagingService,$interval){
    
	$scope.$watch('counter', function(newValue, oldValue) {
        if(newValue != oldValue && newValue != 0){
            messageConversationListAuto();
            //alert('hey, msgcount has changed!');
        }        
    });
	$scope.replyeditoronoff = function(value){
        $scope.replyeditoron = value;
        if(!$scope.replyeditoron){
            $scope.reply.message = $scope.reply.message ? String($scope.reply.message).replace(/<[^>]+>/gm, '') : "";
        }
    };
   /*$scope.msgeditoronoff = function(value){
        $scope.msgeditoron = value;
        if(!$scope.msgeditoron){
            $scope.compose.message = $scope.compose.message ? String($scope.compose.message).replace(/<[^>]+>/gm, '') : "";
        }
    };*/
    /**
     * Search for contacts.
     */
    $scope.querySearch = function(query) {
       var results = query ? $scope.allContacts.filter(createFilterFor(query)) : [];
       return results;
    };

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
       var lowercaseQuery = angular.lowercase(query);
       return function filterFn(contact) {           
          return (contact._lowername.indexOf(lowercaseQuery) != -1);;
       };
    }
    
    function loadContacts(){
        var contacts = $scope.allcontacts;        
        return contacts.map(function (item, index) {
          var contact = {
                name: item.username,
                id:item.id,
                class:item.class
          };
          contact._lowername = item.username.toString().toLowerCase();
          return contact;
       });
    }
    
    $scope.addFromContacts = function(newcontact,typeuser){        
        var a = -1;
        if(typeuser == "yes"){
            name = newcontact.className;
            id = newcontact.classId;
        }else{
            name = newcontact.username;
            id = newcontact.id;
        }        
        _.each($scope.contacts, function(item,index){
             if(item.name == name && item.id == id && item.class == typeuser){
                a = 1;
                $scope.contacts.splice(index, 1);//removes the element from array if it is already in array
             }                    
        });
        if(a <= -1){
            if(typeuser == "yes"){
                $scope.contacts.push({"name":newcontact.className,"_lowername":newcontact.className.toString().toLowerCase(),"id":newcontact.classId,"class":typeuser});
            }else{
                $scope.contacts.push({"name":newcontact.username,"_lowername":newcontact.username.toString().toLowerCase(),"id":newcontact.id,"class":typeuser});
            }
                        
        }
        $scope.showcontactlist = false;       
    }; 
    /** For multi user message from class magmt */
    $scope.multiUserMessage = function(){        
        _.each($scope.multiUserIds,function(data){
            item = _.where($scope.contactdetails,{id:data});            
            $scope.addFromContacts(item[0],"no");
        });
        $scope.multiUserIds=[];//reset the values for multi user message from user mgmt
    };
    $scope.toUserCheck = function(arrValue,classtype){
        if(classtype == "yes"){
            name = arrValue.className;
            id = arrValue.classId;
        }else{
            name = arrValue.username;
            id = arrValue.id;
        }
        returnVal = false;
      if(classtype == "yes"){
          _.each($scope.contacts, function(item){
             if(item.name == name && item.id == id && item.class == classtype){
                 returnVal = true;
             }                    
        });
      }else{
          _.each($scope.contacts, function(item){
             if(item.name == name && item.id == id && item.class == classtype){
                 returnVal = true;
             }                    
        });
          
      } 
        return returnVal;
    };
    $scope.custominboxsearch = function(searchterm){               
        var dataTofilter = $scope.inboxdetails;
        var pluckedData = [],searchedData={},filterObj={},tableRow={};
		$scope.rectifiedData = [];
        datatableSearchObj ={            
            values:['senderFirstname','senderLastname','messageSubject']
        };        
		_.each(dataTofilter,function(item){
			tableRow = {};
            angular.forEach(datatableSearchObj.values, function(value, key) {
                tableRow[value] = item[value];                
            });
            $scope.rectifiedData.push(tableRow);
		});        
       searchedData = $filter('filter')($scope.rectifiedData, searchterm);
		_.each(searchedData,function(item){
            filterObj={};
            filterObj = item;
			pluckedData.push( _.where(dataTofilter,filterObj)[0]);
		});        
		$scope.searchFiltereddata = pluckedData;       
    };
    
    $scope.composemessage = function(){
        var formObj = new FormData(); 
        receiver = [];receiverClass = [];
        _.each($scope.contacts, function(item){
            if(item.class == "no"){
                receiver.push(item.id);
            }else{
                receiverClass.push(item.id);
            }                        
        });
        sendMessage = {"messageSubject":$scope.compose.subject,"messageContent":$scope.compose.message,"receiverUserId":receiver,"receiverClassId":receiverClass,"messageType": $scope.msgType, "messageCategory": $scope.compose.category}; 
        //To append the file attachment
        _.each($scope.uploadedImage,function(item){
            formObj.append('mailAttachment[]',item);
       });
        var formToken = {'token':sendMessage,'formObj':formObj};
        
        sfactory.serviceCallFormData(formToken,"messaging.composeAdminConversation",'listDetails').then(function(response){
            if($filter('lowercase')(response.status) == 'success'){
                $scope.compose = {};$scope.contacts = [];$scope.reply = {};
                /*var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success','type':'compose'};
                $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});*/
                $scope.shwcompsbx = !$scope.shwcompsbx;$scope.callConversationList();   
				if($scope.inboxdetails.length == 0){
                    $scope.showcomposebox();
                }				
                $rootScope.appLoader = false;
            }            
        },function(){
			$scope.compose = {};$scope.contacts = [];
            var banerData = {'message':"Message sent successfully",'showBaner':true,'banerClass':'alert-success','type':'compose'};
            $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
            $scope.showcomposebox();            
        });
    }; 
    //Changing the text format
    $scope.changeTextContentFormat = function(){
      if($scope.compose.category == 'message')  {
          $scope.compose.message = String($scope.compose.message).replace(/<[^>]+>/gm, '');
      }
    };
    $scope.replymessage = function(){  
		if($scope.userId == $scope.inboxdetails[$scope.indxcount].senderId){
			receiverUserId = $scope.inboxdetails[$scope.indxcount].receiverUserId;
		}else{
			receiverUserId = $scope.inboxdetails[$scope.indxcount].senderId;
		}
		receiver = receiverUserId.split(",");
        sendReply = {
            "messageSubject" : $scope.inboxdetails[$scope.indxcount].messageSubject,
            "messageContent" : $scope.reply.message,
            "receiverUserId" : receiver,
            "messageParentId": $scope.inboxdetails[$scope.indxcount].messageId,
            "messageType" : "yes",
            "messageCategory": "message"
        };
        sfactory.serviceCall(sendReply,"messaging.composeAdminConversation",'listDetails').then(function(response){
            if($filter('lowercase')(response.status) == 'success'){
                /*var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success','type':'reply'};
                $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData}); */
                $scope.reply = {};$scope.callConversationList();$scope.compose = {};
                $rootScope.appLoader = false;
            }            
        },function(){
			$scope.reply = {};$scope.compose = {};
            var banerData = {'message':"Message sent successfully",'showBaner':true,'banerClass':'alert-success','type':'reply'};
            $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});                      
        });
    };
    $scope.replyMsgEditWord = function(){
        /*var wordCount = $scope.reply.message ? $scope.reply.message.split(' ').length : 0;
        if(wordCount > 50 ){
            $scope.replyMsgEditWordCount = true;
        }else{
            $scope.replyMsgEditWordCount = false;
        }   */   
        $scope.replyMsgEditWordCount = false;
    };
    $scope.editorrequired = function(){        
      /*var wordCount = $scope.compose.message ? $scope.compose.message.split(' ').length : 0;
        if(wordCount > 50 ){
            $scope.composeMsgEditWordCount = true;
        }else{
            $scope.composeMsgEditWordCount = false;
        }*/  
        $scope.composeMsgEditWordCount = false;
    };
    $scope.closeBaner = function(){
        if($scope.alertBaner.type == "reply"){
            $scope.callConversationList();
        }else if($scope.alertBaner.type == "compose"){
            $scope.callConversationList();
        }
        
        $scope.alertBaner.showBaner = false;
        $scope.alertBaner.type = "";       
    }
    $scope.checkingcontactlist= function(){
        $scope.showcontactlist = false;
        if($scope.contacts.length == 0){
           $scope.showcontactlist = true; 
        }        
    };
    $scope.getindexCount= function(value){
        $scope.shwcompsbx = false;
		$scope.shwconts.contactBox=false;
        $scope.indxcount = value;        
        $scope.reply.message = "";
        if($scope.msgType == 'yes'){
            $scope.replyboxShown = ($scope.inboxdetails[$scope.indxcount].messageCategory != 'mail') ? true : false;
        }else{
            $scope.replyboxShown = false;
        }        
    };
    $scope.showcomposebox = function(){
        $scope.shwcompsbx = !$scope.shwcompsbx;
		$scope.compose = {};$scope.contacts = [];$scope.reply = {}; $scope.search = {};
        $scope.allcontacts = [];        
        $scope.classdetails = $scope.contactdetails = $scope.admindetails = {};
        /** To get the contact user list */
        sfactory.serviceCall({},"messaging.get_alluser_details",'listDetails').then(function(response){
            if($filter('lowercase')(response.status) == 'success'){
                $scope.contactdetails = response.data;
                 _.each($scope.contactdetails, function(item){
                     $scope.allcontacts.push({"username":item.username,"id":item.id,"class":"no"});                     
                });
                $scope.allContacts = loadContacts();
                // for multi user message from class mgmt
                if($scope.multiUserIds.length > 0){
                    $scope.multiUserMessage();
                }
                $rootScope.appLoader = false;
            }            
        },function(){
            sfactory.localService("messagecontacts").then(function(response){
                $scope.contactdetails = response.data.data;
                 _.each($scope.contactdetails, function(item){
                     $scope.allcontacts.push({"username":item.username,"id":item.id,"class":"no"});                    
                });                
                $scope.allContacts = loadContacts();
                // for multi user message from class mgmt
                if($scope.multiUserIds.length > 0){
                    $scope.multiUserMessage();
                }
                $rootScope.appLoader = false;                
            },function(error){
            });
        });
        /** To get the contact class list */
        sfactory.serviceCall({},"messaging.get_allclass_details",'listDetails').then(function(response){
            if($filter('lowercase')(response.status) == 'success'){
                $scope.classdetails = response.data;
                 _.each($scope.classdetails, function(item){
                     $scope.allcontacts.push({"username" : item.className, "id" : item.classId,"class":"yes"});                     
                });
                $scope.allContacts = loadContacts();
                $rootScope.appLoader = false;
            }            
        },function(){
            sfactory.localService("messageclasslist").then(function(response){
                $scope.classdetails = response.data.data;
                 _.each($scope.classdetails, function(item){
                     $scope.allcontacts.push({"username" : item.className, "id" : item.classId,"class":"yes"});                    
                });                
                $scope.allContacts = loadContacts();
                $rootScope.appLoader = false;                
            },function(error){
            });
        });
    };
    /**Confirm box for the compose cancel*/
    $scope.checkConfrim = function(){        
        var confirm = $mdDialog.confirm()
          .title("Are you sure you want to cancel this operation?")
          .textContent()
          .ariaLabel()
          .ok('Ok')
          .cancel('Cancel'); 
        if(!isEmpty($scope.compose) || $scope.contacts.length > 0){
            $mdDialog.show(confirm).then(function(result) {
                $scope.compose = {};$scope.contacts = [];$scope.multiUserIds=[];
                //$scope.shwcompsbx = false;  
                //To clear the attachements info
                $scope.validImage = [];$scope.invalidImage = []; $scope.uploadedImage = [];
				$window.location.reload();				
            }, function() {               

            });
        }else{
            //$scope.shwcompsbx = false;
			$window.location.reload();
        }
    };
    /**To check the object is empty or not*/
    function isEmpty(obj) {
        var i = j = 0;
        for(var key in obj) { i++;
            if(obj.hasOwnProperty(key) && obj[key] != "" && obj[key] === undefined){
                 j++;
            }
               
        }
        if(i == j){
            return true;
        }else{
            return false;
        }
        
    }
    $scope.msgReadUnread = function(msgstatus,msgvalue){
		$scope.search = {};
		msgvalue = 1;
		
		if($scope.inboxdetails[$scope.indxcount].senderId == $scope.userId){
			if($scope.inboxdetails[$scope.indxcount].senderReadStatus === 0){
				msgvalue = 0;
			}
		}else{
			if($scope.inboxdetails[$scope.indxcount].receiverUserReadStatus === 0){
				msgvalue = 0;
			}
		}
		if(msgvalue === 0){
			msgIds = [];
			msgIds.push($scope.inboxdetails[$scope.indxcount].messageId);
			msgstat = {
				"messageId" : msgIds,
				"readStatus" : msgstatus
			};        
			sfactory.serviceIntervalCall(msgstat,"messaging.conversationRead",'listDetails').then(function(response){
				if($filter('lowercase')(response.status) == 'success'){
					/*var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
					$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});*/ 
					if($scope.inboxdetails[$scope.indxcount].senderId == $scope.userId){
                       $scope.inboxdetails[$scope.indxcount].senderReadStatus = 1;
                    }else{
                       $scope.inboxdetails[$scope.indxcount].receiverUserReadStatus = 1;
                    }
					$rootScope.appLoader = false;
				}            
			},function(){
				var banerData = {'message':"Message read/unread status changed successfully",'showBaner':true,'banerClass':'alert-success'};
				$scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});                      
			});
		}
        
    };
	/** Message actions like delete **/
    $scope.msgActions = function(action){
        var delete_title;
        $scope.msgType === 'yes' ? delete_title = "Are you sure you want to delete the message?" : delete_title = "Are you sure you want to delete the notification?";
         var confirm = $mdDialog.confirm()
          .title(delete_title)
          .textContent()
          .ariaLabel()
          .ok('Ok')
          .cancel('Cancel'); 
       
        $mdDialog.show(confirm).then(function(result) {
            msgIds = [];
            msgIds.push($scope.inboxdetails[$scope.indxcount].messageId);
            msgstat = {
                "messageId" : msgIds,
                "actionType": action
            };        
            sfactory.serviceCall(msgstat,"messaging.conversationActions",'listDetails').then(function(response){
                if($filter('lowercase')(response.status) == 'success'){
                    $scope.inboxdetails.splice($scope.indxcount,1);
                    $scope.indxcount = 0;
                    var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
                    $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});                
                    $rootScope.appLoader = false;
                }            
            },function(){            
                $scope.inboxdetails.splice($scope.indxcount,1);
                $scope.indxcount = 0;            
                var banerData = {'message':"Message "+action+" successfully",'showBaner':true,'banerClass':'alert-success'};
                $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
                //$scope.callConversationList();
            });
        }, function() {               

        });
    };
	/** Inbox list */
    $scope.callConversationList = function(){
		$scope.reply = {};$scope.shwconts.contactBox=false;$scope.search = {};
        //To clear the attachements info
        $scope.validImage = [];$scope.invalidImage = []; $scope.uploadedImage = [];
        sfactory.serviceCall({},"messaging.conversationList",'listDetails').then(function(response){
            if($filter('lowercase')(response.status) == 'success'){
                $scope.inboxdetails = response.data;                
                $scope.inboxdetails = _.where($scope.inboxdetails,{
                  "messageType" : $scope.msgType
                });
                _.each($scope.inboxdetails, function(item){
                    var sentDate = moment.utc(item.messageSentTime).local(); 
                    var sentUpdateDate = moment.utc(item.messageUpdateTime).local();					
                    item.messageSentTime = moment(sentDate).format("MM/DD/YYYY hh:mm A"); 
                    item.messageUpdateTime = moment(sentUpdateDate).format("MM/DD/YYYY HH:mm:ss");
                    _.each(item.messageReply, function(reply){
                        var replySentDate = moment.utc(reply.messageSentTime).local();
                        reply.messageSentTime = moment(replySentDate).format("MM/DD/YYYY hh:mm A");
                    });
                });
				$scope.indxcount = 0;
				if($scope.inboxdetails.length == 0 && $scope.msgType == 'yes'){                                        
					$scope.showcomposebox();                    
                }else{
					if($scope.msgId){
						var indexMsg = $scope.inboxdetails.map(function (item) {
                            return item.messageId;
                        }).indexOf($scope.msgId); 
                        $scope.indxcount = indexMsg;
					}
                    // To hide reply box based on mail in messages
                    if($scope.msgType == 'yes'){
                        $scope.replyboxShown = ($scope.inboxdetails[$scope.indxcount].messageCategory != 'mail') ? true : false;
                    }else{
                        $scope.replyboxShown = false;
                    }
                    // For multi user messages showing the compose area
                    if($scope.multiUserIds.length > 0){
                        $scope.shwcompsbx = true;
                    }else{
                        $scope.shwcompsbx = false;
                    }
                }                
                
                $rootScope.appLoader = false;
            }else{
                $rootScope.appLoader = false;
            }           
        },function(){
            sfactory.localService("messageinbox").then(function(response){
                $scope.inboxdetails = response.data.data;
                $scope.inboxdetails = _.where($scope.inboxdetails,{
                  "messageType" : $scope.msgType
                });
                _.each($scope.inboxdetails, function(item){
                    var sentDate = moment.utc(item.messageSentTime).local(); 
                    var sentUpdateDate = moment.utc(item.messageUpdateTime).local();					
                    item.messageSentTime = moment(sentDate).format("MM/DD/YYYY hh:mm A");
                    item.messageUpdateTime = moment(sentUpdateDate).format("MM/DD/YYYY HH:mm:ss");
                    _.each(item.messageReply, function(reply){
                        var replySentDate = moment.utc(reply.messageSentTime).local();
                        reply.messageSentTime = moment(replySentDate).format("MM/DD/YYYY hh:mm A");
                    });
                });        
                $scope.indxcount = 0;
				if($scope.inboxdetails.length == 0 && $scope.msgType == 'yes'){                                        
					$scope.showcomposebox();                    
                }else{
					if($scope.msgId){
						var indexMsg = $scope.inboxdetails.map(function (item) {
                            return item.messageId;
                        }).indexOf($scope.msgId); 
                        $scope.indxcount = indexMsg;
					}
                    // To hide reply box based on mail in messages
                    if($scope.msgType == 'yes'){
                        $scope.replyboxShown = ($scope.inboxdetails[$scope.indxcount].messageCategory != 'mail') ? true : false;
                    }else{
                        $scope.replyboxShown = false;
                    }
                    // For multi user messages showing the compose area
                    if($scope.multiUserIds.length > 0){
                        $scope.shwcompsbx = true;
                    }else{
                        $scope.shwcompsbx = false;
                    }
                    
                } 
                $rootScope.appLoader = false;                                
            },function(error){
            });
        });
    }
	function setTabsIndex(){
        $timeout(function () {
           $scope.selectedIndex = ($scope.msgType == 'yes') ? 0 : 1;
       });
    };
    function initiateController(){
		$scope.search = {};
        $scope.shwconts={'contactBox':false,'userTypeDrop': 'Student'};
        $scope.indxcount = 0;
        $scope.compose = $scope.reply = {};
        $scope.msgdetails = {};$scope.allcontacts = [];
        $scope.contacts = [];
        $scope.inboxdetails = [];
        $scope.msgType = ($stateParams.msgtype != 1) ? 'no' : 'yes';
        $scope.msgId = ($stateParams.msgid > 0) ? $stateParams.msgid : 0;
        setTabsIndex(); 
        $scope.searchFiltereddata = [];
        $scope.filterSelected = true;        
        $scope.editoron = false;
        $scope.userTypeDrop = "Student";
        $scope.replyeditorerror = true;
        $scope.userRoleType = encryptionService.decrypt(sessionService.get('role'));
        $scope.replyMsgEditWordCount = $scope.composeMsgEditWordCount = false;
        $scope.userId = encryptionService.decrypt(sessionService.get('userId'));                        
        var semicolon = 186;
        $scope.customKeys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA, semicolon];        
        $scope.selectedItem = $scope.searchText = null;
        $scope.textangulartoolbar =[['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol','justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent','quote','insertLink'],[ 'wordcount', 'charcount']]; $scope.editoron = false;  
        $scope.selectedContactIndex = 0;
        $scope.messageCategory = ["message","mail","both"];
        /** Inbox list */
        $scope.callConversationList();      
        $scope.multiUserIds = messagingService.userIds;
        if($scope.multiUserIds.length > 0){
            console.log("msg ctrlr",$scope.multiUserIds);
            messagingService.userIds = [];
            $scope.showcomposebox();
            $scope.compose.category = "message";
        }
    }
    
    $scope.replybx = function(){
        $scope.shwreplybox = false;
    }
    initiateController();
    
    /** Inbox list */
    function messageConversationListAuto(){ 
        var currMsgId = $scope.inboxdetails[$scope.indxcount].messageId;
        sfactory.serviceIntervalCall({},"messaging.conversationList",true).then(function(response){
            if($filter('lowercase')(response.status) == 'success'){
                $scope.inboxdetails = response.data;                
                $scope.inboxdetails = _.where($scope.inboxdetails,{
                  "messageType" : $scope.msgType
                });
                _.each($scope.inboxdetails, function(item){
                    var sentDate = moment.utc(item.messageSentTime).local();
                    var sentUpdateDate = moment.utc(item.messageUpdateTime).local();
                    item.messageSentTime = moment(sentDate).format("MM/DD/YYYY hh:mm A");
                    item.messageUpdateTime = moment(sentUpdateDate).format("MM/DD/YYYY HH:mm:ss");
                    _.each(item.messageReply, function(reply){
                        var replySentDate = moment.utc(reply.messageSentTime).local();
                        reply.messageSentTime = moment(replySentDate).format("MM/DD/YYYY hh:mm A");
                    });                    
                });
                //To retain old viewed message/notification
                var indexMsg = $scope.inboxdetails.map(function (item) {
                    return item.messageId;
                }).indexOf(currMsgId); 
                $scope.indxcount = indexMsg;
            }          
        },function(){
            sfactory.localService("messageinbox").then(function(response){
                $scope.inboxdetails = response.data.data;
                $scope.inboxdetails = _.where($scope.inboxdetails,{
                  "messageType" : $scope.msgType
                });
                _.each($scope.inboxdetails, function(item){                    
                    var sentDate = moment.utc(item.messageSentTime).local();
                    var sentUpdateDate = moment.utc(item.messageUpdateTime).local();                    
                    item.messageSentTime = moment(sentDate).format("MM/DD/YYYY hh:mm A");
                    item.messageUpdateTime = moment(sentUpdateDate).format("MM/DD/YYYY HH:mm:ss"); 
                    _.each(item.messageReply, function(reply){
                        var replySentDate = moment.utc(reply.messageSentTime).local();
                        reply.messageSentTime = moment(replySentDate).format("MM/DD/YYYY hh:mm A");
                    });
                });       
                
                $rootScope.appLoader = false;                                
            },function(error){
            });
        });
    };
    $scope.recentMsgsAuto = null;
    
    $scope.recentMsgsAuto = $interval(
        function () {
            if($scope.msgType == 'yes'){
                $scope.counter = messagingService.msgcount;
            }else{
                $scope.counter = messagingService.notifyCount;
            }
           
            
        }, 5000);
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
	
}]);