//var advancePubapp = angular.module('advancePublications',[]);
advancePubapp.controller('forummanagementController',['$scope','$state','sfactory','$rootScope','Lightbox','$filter','$mdDialog','encryptionService','sessionService','$stateParams','sharedService',function($scope,$state,sfactory,$rootScope,Lightbox,$filter,$mdDialog,encryptionService,sessionService,$stateParams,sharedService){ 
    
    $scope.uploadedImage = [];
     var iconTypesAllowed;
 
    /* Method to initialize the add forum form */
    function initializeAddForum(){
        $scope.forum.title ="";
        $scope.forum.message="";
        $scope.forum.imgname="";
        $scope.forum.imageLoadError="";
        $scope.forum.postCategory = $scope.forum.postCategories[0];
        $scope.dataURLsa = "";
        $scope.forum.picture={icon:"noimage.png",copyIcon:"",url:"dest/images"};
        //$scope.getPostToOptions();
        $scope.invalidImage = [];
        $scope.replyForum= false;
    };
    
    /* Method to called when click on 'New Topic' button */
    $scope.addNewTopic = function(){
        $scope.changeFormDisplay(true,false);
        initializeAddForum();
        $scope.forum.addNewTopic = true;
    };
    
    $scope.delete_space= function(){
        $scope.replyForum= false;
        val = $.trim($scope.forum.add.message);
        if(val.length>0){
            $scope.replyForum= true;
        }
    }
    
    /* redirect Forum page */
    $scope.getFrmList = function(){
        $state.go('adminLanding.forum',{"id":''});
    };
    
    /* redirect Forum post */
    $scope.gotoFrmTopic = function(index){
        $state.go('adminLanding.forum',{id:index});
    };
    
    /* Method to view the expanded view of Forum */
    $scope.expandedView = function(index){
        $scope.editId   = $stateParams.id ? _.findIndex($scope.forumData.filteredForums, {topicId: $stateParams.id }) : index; 
        $scope.validImage = [];$scope.invalidImage = []; $scope.uploadedImage = [];
        forumDataReq={discussionId: $stateParams.id ? index : $scope.forumData.filteredForums[index].topicId};
        sfactory.serviceCall(JSON.stringify(forumDataReq), forumServices.discussionDetails,forumServices.type).then(function(response) {
            if(angular.isDefined(response)){
                $scope.forum.discussions = response.data;
                _.each($scope.forum.discussions, function(item){
                    var discussionCreated = moment.utc(item.discussionCreatedOn).local();
                    item.discussionCreatedOn = moment(discussionCreated).format("MM/DD/YYYY hh:mm A");
                });
                $scope.editIndex = $scope.editId;
                $scope.forum.formDetails = $scope.forumData.filteredForums[$scope.editId];
                $scope.forum.add = {};
                $scope.changeFormDisplay(false,true);
            }
            $rootScope.appLoader = false;
        }, function(error) {
                sfactory.localService(localTask).then(function(response) {
                    $scope.forum.discussions = angular.copy(response.data.discussionDetails);
                    $scope.editIndex = $scope.editId;
                    $scope.forum.formDetails = $scope.forumData.filteredForums[$scope.editId];
                    $scope.forum.add = {};
                    $scope.changeFormDisplay(false,true);
                }, function(error) {
               });
        });
    };
    
    /* Method to close Add New Topic in Forum */
    $scope.cancelNewTopic = function(){
       $scope.forum.addNewTopic = false;
    };
     
    /* Method to change display of Forum list */
    $scope.changeFormDisplay =function(isListView,isExpandedView){
        $scope.forum.formList = isListView;
        $scope.forum.expanded = isExpandedView;
        $scope.validImage = [];$scope.invalidImage = []; $scope.uploadedImage = [];
        
        /* tab selection */
        $scope.selectedIndex.tab = sharedService.forumTabs;
    };
    
    /* Method to filter Forum list */
    $scope.filterForums = function(index){
        $scope.forumData.filteredForums = (index === 0) ? $scope.forumData.data : _.filter($scope.forumData.data, function(obj){return obj.myforums === $scope.tabs[index]});
        sharedService.forumTabs = $scope.selectedIndex.tab;
    };
    
        
    /* Method to populate the combo for Post list and Post category*/
    $scope.getPostToOptions = function(){
        $scope.forum.postList = _.pluck(_.find($scope.forumData.postCategory,function(obj){ return obj.name === $scope.forum.postCategory}).postedTo,'postName');
        $scope.updatePostList();
    };
    
    /* Method to initialize Post To combo box*/
    $scope.updatePostList = function(){
        $scope.forum.postTo = $scope.forum.postList[0];
    };

    /* Method for icon image upload */
    $scope.iconImageUpload = function(){
		setTimeout(function () {
		  angular.element('#picture').trigger('click');
		}, 0);
	};
    
    /* Method to add new Forum */
    $scope.addNewForum = function(){
        var formObj = new FormData(); 
        forumDataReq = {topicTitle:$scope.forum.title,topicMessage:$scope.forum.message}; //,topicAttachment: $scope.dataURLsa
        //,topicCategory:$scope.forum.postCategory,topicAssignedTo:$scope.forum.postTo
        /*formObj.append('topicAttachment',uploadedImage);
        formObj.append('forumData',JSON.stringify(forumDataReq)); */
        _.each($scope.uploadedImage,function(item){
        formObj.append('topicAttachment[]',item);
       });
        //formObj.append('forumData',JSON.stringify(forumDataReq));
        var formToken = {'token':forumDataReq,'formObj':formObj};
        sfactory.serviceCallFormData(formToken, forumServices.createForum,forumServices.type).then(function(response) {
            if(angular.isDefined(response)){
                
               var topicCreated = moment.utc(response.data.topicCreatedOn).local();
                response.data.topicCreatedOn = moment(topicCreated).format("MM/DD/YYYY hh:mm A");
                response.data.myforums = ($scope.myId==response.data.topicCreatedUserid) ? "My Forums" : 0;
                $scope.forumData.filteredForums.unshift(response.data);
                
                $scope.validImage = [];$scope.invalidImage = [];$scope.uploadedImage = [];
                $scope.forum.addNewTopic = false;
                showBanner(response.message, response.status);  
            }
            $rootScope.appLoader = false;
        }, function(error) {
                $scope.forumData.filteredForums.unshift(forumDataReq);
                $scope.forum.addNewTopic = false;
        });
    };
    
    /* Method to image upload in add new Forum */
    $scope.upload = function(files) {
        $scope.validImage = [];$scope.invalidImage = []; $scope.uploadedImage = [];$scope.forum.picture = {};
        if(files){
            if (files.length < 20) {
            _.each(files, function(item){
            if(_.contains(iconTypesAllowed, item.name.split(".").pop())){
                $scope.uploadedImage.push(item);
                //$scope.imageFileName.push({'name':item.name,'valid':true});
                $scope.getImage(item);
                $scope.forum.picture.isError  = false;                
            }else{
                $scope.forum.picture.errorMessage = "Please choose valid file";
                $scope.forum.picture.isError = true;
                 $scope.invalidImage.push({'name':item.name,'valid':false,'imgfile':null});           
            }
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


    /* Method to added reply to the Forum in expanded view */
    $scope.addReply = function(){
         var formObj = new FormData(); 
        forumDataReq = {discussionTopicId:$scope.forumData.filteredForums[$scope.editIndex].topicId,discussionMessage:$scope.forum.add.message};
         _.each($scope.uploadedImage,function(item){
        formObj.append('topicAttachment[]',item);
       });
        //formObj.append('forumData',JSON.stringify(forumDataReq));
        var formToken = {'token':forumDataReq,'formObj':formObj};
        sfactory.serviceCallFormData(formToken, forumServices.addReply,forumServices.type).then(function(response) {
            if(angular.isDefined(response)){
               var discussionCreated = moment.utc(response.data.discussionCreatedOn).local();
               response.data.discussionCreatedOn = moment(discussionCreated).format("MM/DD/YYYY hh:mm A");
               $scope.forum.discussions.unshift(response.data);
               $scope.forum.add={};
               $scope.validImage = []; $scope.invalidImage = [];$scope.uploadedImage = [];
            }
            $rootScope.appLoader = false;
            showBanner(response.message, response.status);  
        }, function(error) {
            $scope.forum.discussions.push({discussionMessage:$scope.forum.add.message,discussionCreatedOn:"2017-06-06 06:54:09"});
            $scope.forum.add={};
        });
    };
    
    $scope.cancelReply = function(){
        $scope.forum.add.message = "";
        $scope.validImage = [];$scope.invalidImage = []; $scope.uploadedImage = [];
    };
    
    $scope.openLightboxModal = function (images,index) {
        $scope.images=[];
        _.each(images, function(item){
            $scope.images.push({"url": item,"thumbUrl":item});
        });
    Lightbox.openModal($scope.images, index);
  };
     
    /* Method to get Forum list */
    function getForumDetails(){
         sfactory.serviceCall({}, forumServices.forumList,forumServices.type).then(function(response) {
            if(angular.isDefined(response)){
                $scope.forumData = response;
                $scope.forumData.filteredForums = response.data;
                _.each($scope.forumData.filteredForums, function(item){
                    var topicCreated = moment.utc(item.topicCreatedOn).local();
                    item.topicCreatedOn = moment(topicCreated).format("MM/DD/YYYY hh:mm A");
                    item.myforums = ($scope.myId==item.topicCreatedUserid) ? "My Forums" : 0;
                });
                $scope.forum.postCategories =_.pluck(response.postCategory,'name');
                //$scope.forum.postList = _.pluck(_.find(response.postCategory,function(obj){ return obj.name === $scope.forum.postCategories[0]}).postedTo,'postName');
                $scope.filterForums($scope.selectedIndex.tab);
                if($stateParams.id >0){        
                    $scope.expandedView(Number($stateParams.id));
                }
                if($scope.forumData.filteredForums.length == 0){
                    $scope.tabs =[];
                }
            }
            
            $rootScope.appLoader = false;
        }, function(error) {
                sfactory.localService(localTask).then(function(response) {
                    $scope.forumData = response.data;
                    $scope.forumData.filteredForums = response.data.data;
                     _.each($scope.forumData.filteredForums, function(item){
                    var topicCreated = moment.utc(item.topicCreatedOn).local();
                    item.topicCreatedOn = moment(topicCreated).format("MM/DD/YYYY hh:mm A");
                    item.myforums = ($scope.myId==item.topicCreatedUserid) ? "My Forums" : 0;
                    });
                    $scope.forum.postCategories =_.pluck(response.data.postCategory,'name');
                   // $scope.forum.postList = _.pluck(_.find(response.data.postCategory,function(obj){ return obj.name === $scope.forum.postCategories[0]}).postedTo,'postName');
                    $scope.filterForums($scope.selectedIndex.tab);      
                    if($stateParams.id>0){        
                        $scope.expandedView(Number($stateParams.id));
                    }
                    if($scope.forumData.filteredForums.length == 0){
                        $scope.tabs = [];
                    }
                }, function(error) {
               });
        });
    };
    
    /* Method to delete Forum or delete topic from a Froum */
    $scope.deleteForum = function(index,event) {
         if(event) event.stopPropagation();
        if(index == 0) { return false;};
         var formObj = new FormData(); 
         forumDataReq = {topicId:index,actionType:"delete"};
         formObj.append('forumData',JSON.stringify(forumDataReq));
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to delete the post ?')
            .textContent('')
            .ariaLabel('Lucky day')
            .ok('Delete')
            .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                $rootScope.appLoader = true;
                
                sfactory.serviceCall(JSON.stringify(forumDataReq), forumServices.deleteForumTopic,forumServices.type).then(function(response) {
                    if(angular.isDefined(response)){
                    showBanner(response.message, response.status);  
                    }
                    $scope.forumData.filteredForums.splice(_.findIndex($scope.forumData.filteredForums, {topicId: response.data.topicId }), 1);
                    (_.findIndex($scope.forumData.data, {topicId: response.data.topicId })=== -1)? "": $scope.forumData.data.splice(_.findIndex($scope.forumData.data, {topicId: response.data.topicId }), 1);
                    if($scope.forumData.filteredForums.length == 0){
                        $scope.tabs =[];
                    }
                    $rootScope.appLoader = false;
                }, function(error) {
                    
                });
            }, function() {
            });
    };
    
    /* Method to close notification banner*/
    $scope.closeBaner = function(){
        $scope.alertBaner.showBaner = false;
    };
    
  
    $scope.toggleOptions = function(index){
        $scope.toggle['list'+(index)] = angular.copy(!$scope.toggle['list'+(index)]);
    }
    
    
    /* Method to show notification */
    function showBanner(message,status){
        banerData.message = message;
        banerData.banerClass = ($filter('lowercase')(status) === 'success') ? 'alert-success' : 'alert-danger';
        banerData.showBaner=true;
        $scope.alertBaner = angular.copy(banerData);
        $scope.$emit('emitFromdeleteBaner',{'alertBaner':banerData});
    }
    
    
    /* Method to initilize controller */
    function initializeController(){
        forumDataReq = {};
        $scope.validImage = [];$scope.invalidImage = []; $scope.uploadedImage = [];
        $scope.selectedIndex = {'tab':0};
        $scope.forum={cancelPicture: "dest/images/noimage.png"};
        localStorage.setItem('activetab',1);
        $scope.changeFormDisplay(true,false);
        $scope.noImage = templateURL+"dest/images/noimage.png";
        
        //Variables to match webservices
        forumServices ={
            forumList           : 'forum.forumTopicList',
            discussionDetails   : 'forum.forumDiscussionList',
            createForum         : 'forum.createForumTopic',
            addReply            : 'forum.createForumDiscussion',
            type                : 'listDetails',
            deleteForumTopic    : 'forum.forumTopicActions'
        };
        //Local task initialization
        localTask = "forum";
        iconTypesAllowed = ["jpg","jpeg","gif","png"];
        //$scope.tabs =["All","Teacher","Parent"];
        $scope.tabs =["All","My Forums"];
        getForumDetails();
        $scope.myId = encryptionService.decrypt(sessionService.get('userId'));
        $scope.roleType = encryptionService.decrypt(sessionService.get('role'));
        banerData = {message:'',showBaner:false,banerClass:''};  
        $scope.toggle = {};
    };
    initializeController();
        
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