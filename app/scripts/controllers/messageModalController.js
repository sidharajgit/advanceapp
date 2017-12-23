advancePubapp.controller('messageModalController', ['$scope', 'sfactory', '$rootScope', 'taskService','$state','$mdDialog','dataToMessage','$filter',function($scope, sfactory, $rootScope, taskService,$state,$mdDialog,dataToMessage,$filter) {
    
    init();
    
    /* Method to initialize Controller */
    function init() {
        //templatepath = templateURL+"dest/templates/";
        $scope.validImage = [];$scope.invalidImage = []; $scope.uploadedImage = [];
        $scope.message = {};
        $scope.textangulartoolbar =[['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol','justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent','quote','insertLink'],[ 'wordcount', 'charcount']]; 
        $scope.modalMsgEditWordCount = false;
        $scope.messageCategory = ["message","mail","both"];
        //console.log("dataToMessage",dataToMessage);
    };
    $scope.sendMessage = function(){
        var formObj = new FormData(); 
        messageInput = {};
        if(dataToMessage.parentState == "user"){            
            messageInput = {"messageSubject":$scope.message.subject_text,"messageContent":$scope.message.message_text,"receiverUserId":[dataToMessage.userid],"messageType":"yes","messageCategory": $scope.message.compose_category};
        }else if(dataToMessage.parentState == "group"){            
            messageInput = {"messageSubject":$scope.message.subject_text,"messageContent":$scope.message.message_text,"receiverGroupId":[dataToMessage.groupId],"messageType":"yes","messageCategory": $scope.message.compose_category};
        }else if(dataToMessage.parentState == "class"){            
            messageInput = {"messageSubject":$scope.message.subject_text,"messageContent":$scope.message.message_text,"receiverClassId":[dataToMessage.classmasterid],"messageType":"yes","messageCategory": $scope.message.compose_category};
        }   
        
        //To append the file attachment
        _.each($scope.uploadedImage,function(item){
            formObj.append('mailAttachment[]',item);
       });
        var formToken = {'token':messageInput,'formObj':formObj};
        //console.log(messageInput);
        sfactory.serviceCallFormData(formToken,"messaging.composeAdminConversation",'listDetails').then(function(response) {            
            if($filter('lowercase')(response.status) == 'success'){
                //$mdDialog.cancel();                  
				 $mdDialog.hide(response);  
            }
            $rootScope.appLoader = false;
        }, function(error) {
            $mdDialog.cancel();
        });
    };
    //Changing the text format
    $scope.changeTextContentFormat = function(){
      if($scope.message.compose_category == 'message')  {
          $scope.message.message_text = String($scope.message.message_text).replace(/<[^>]+>/gm, '');
      }
    };
    /*$scope.msgeditoronoff = function(value){
        $scope.msgeditoron = value;
        if(!$scope.msgeditoron){
            $scope.message.message_text = $scope.message.message_text ? String($scope.message.message_text).replace(/<[^>]+>/gm, '') : "";
        }
    };*/
    $scope.customWordValidation = function(){        
      /*var wordCount = $scope.message.message_text ? $scope.message.message_text.split(' ').length : 0;
        if(wordCount > 50 ){
            $scope.modalMsgEditWordCount = true;
        }else{
            $scope.modalMsgEditWordCount = false;
        }  */
        $scope.modalMsgEditWordCount = false;
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
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