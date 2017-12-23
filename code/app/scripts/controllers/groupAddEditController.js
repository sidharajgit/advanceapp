advancePubapp.controller('groupAddEditController',['$scope','sfactory','$timeout','$rootScope','existgrouplist','$mdDialog','$filter', function($scope,sfactory, $timeout,$rootScope,existgrouplist,$mdDialog,$filter){
   
    /* Grupt */
    $scope.showDown = false;
    $scope.myCroppedImage = '';
    $scope.myImage = '';
    $scope.blockingObject = {
        block: true
    };
    $scope.hidepopup = function () {
        //location.reload();
        $scope.showDown = false;
    }
    $scope.renderimage = function () {
        $scope.blockingObject.render(function (dataURL) {
            $scope.dataURLsa = dataURL;
            $scope.upload(dataURL);
            if(dataURL.length)
            {$scope.showDown = false;}
        });
    }
    $scope.blockingObject.callback = function (dataURL) {
        
    }
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
    
    //Method for groupupdatecancel
    $scope.groupupdatecancel = function(){
        $scope.acc.data.groupadminname = $scope.acc.copydata.groupadminname;
        $scope.acc.data.groupicon_image = $scope.acc.copydata.groupicon_image;
        $scope.acc.data.groupname = $scope.acc.copydata.groupname;
        $mdDialog.hide();
    }
    /* Method callback for close the baner alert message */
    $scope.hideErrorMsg = function(){
		$scope.groupnameerror = true ;
        if(!angular.isUndefined($scope.alertBaner))
            if($scope.alertBaner.showBaner) $scope.alertBaner.showBaner = false;
    }
    /* Method to capture baner call back from child directives */
    $scope.$on('emitFromDirectiveBaner',function(event,args){
        //$scope.$emit('emitBaner',args);
        $scope.alertBaner = args.alertBaner;
        if(angular.isDefined(args.list)) $scope.listObj = args.list;
    })
    
    /* Method to capture baner call back from child directives */
    $scope.$on('emitFromErrorMsg',function(event,args){
        $scope.alertBaner = args.alertBaner;
     })
    
     $scope.validateGroupname = function(evnt){
        if(!angular.isUndefined($scope.acc.data.groupname)){
            var groupnameValidateDataReq={groupname : $scope.acc.data.orgname,groupid:$scope.acc.data.orgid};
             sfactory.serviceCall(JSON.stringify(groupnameValidateDataReq), 'organization.orgexistcheck','listDetails').then(function(response) {
				 if($filter('lowercase')(response.status) === 'success'){
					$scope.groupnameerror = false ;
				 }				 
                 else if($filter('lowercase')(response.status) === 'fail'){
					 $scope.groupnameerror = true ;
                     var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};   
                     $scope.$emit('emitFromErrorMsg',{'alertBaner':banerData});
                     angular.element(document.querySelector('#'+evnt.target.id)).focus();
                 }
                $rootScope.appLoader = false;
            }, function(error) {
          });   
        }
    };
    
    $scope.getadminRoles = function(){ 
		var groupReq = {'id': $scope.acc.data.orgid};   
        // var groupReq = {'id': '1'};     
        var task = "organization.orgadminlist";
        sfactory.serviceCall(JSON.stringify(groupReq),task,'listDetails').then(function(response){
            if(response.status.toLowerCase() == 'success'){
                $scope.groupAdminuser = response.data;
              	if(angular.isString($scope.acc.data.groupadmin)){
					var adminIds = $scope.acc.data.groupadmin.split(',');
				}else{
					$scope.acc.data.groupadmin = $scope.acc.data.groupadmin.toString();
					var adminIds = $scope.acc.data.groupadmin.split(',');
				}
				
				if(angular.isArray($scope.acc.data.groupadminname)){
					$scope.acc.data.groupadminname = $scope.acc.data.groupadminname;
				}else{
					if(angular.isNumber($scope.acc.data.groupadminname)){
						$scope.acc.data.groupadminname = $scope.acc.data.groupadminname.toString();
						$scope.acc.data.groupadminname = ($scope.acc.data.groupadminname && $scope.acc.data.groupadminname.split(' - ') ? $scope.acc.data.groupadminname.split(' - ') : null);
					}else{
						$scope.acc.data.groupadminname = ($scope.acc.data.groupadminname && $scope.acc.data.groupadminname.split(' - ') ? $scope.acc.data.groupadminname.split(' - ') : null);
					}
				}		
				setEmail(adminIds,$scope.groupAdminuser,'id');
            }
			$rootScope.appLoader = false;
        },function(error){
        });								 
	}
    
    //Method for user updation
    $scope.update_groupedit = function(body){  
		$scope.groupAdminids= [];
		_.each($scope.acc.data.groupadminname,function(item){
			var xx = _.where($scope.groupAdminuser,{'username':item});
			$scope.groupAdminids.push(xx[0].userid);
		});
        var editRequest = {groupadmin:$scope.groupAdminids,groupid:$scope.acc.data.id,groupname:$scope.acc.data.groupname};        
        var task = "groups.update_group";
        /*var formObj = new FormData(); 
        formObj.append('groupicon',$scope.profilepic);
        formObj.append('groupdata',JSON.stringify(editRequest));*/    
        var formToken = {'token':editRequest,'formObj':JSON.stringify({'croppedimage' : $scope.dataURLsa})}; 
        sfactory.serviceCallFormData(formToken,task,'listDetails').then(function(response){
             if(response.status.toLowerCase() == 'success'){
                 $scope.acc.data.groupadmin = $scope.groupAdminids.join();
                
                 if((typeof(response.data.groupicon_image) == "undefined")){
                     $scope.groupimage    =  $scope.acc.data.groupicon_image;  
                     $scope.groupimageurl =  $scope.acc.data.groupicon_url; 
                 }else{
                     $scope.acc.data.groupicon_url   = response.data.groupicon_url;
					 $scope.acc.data.groupicon_image = response.data.groupicon_image; 
                 }
				 $scope.existgrouplist		    = $scope.acc.data;		 
				 $mdDialog.hide(response);    
             }else{
                 var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
                 $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData});
             }
             $rootScope.appLoader = false;
        },function(error){
            
        });
    }
      
    //Method for set email
    function setEmail(childSource,parentSource,field){
		var emails = [];
		_.each(childSource,function(item){
			var xx = (field == 'id' ? _.where(parentSource,{'userid':item}) : _.where(parentSource,{'username':item}));
			if(angular.isDefined(xx[0])){
				if(xx[0].email){
					emails.push(xx[0].email);
					$scope.acc.data.email = emails.join(', ');
				}
			}
		});
	}
    
    /* Method to update email based on group admin selection */
	$scope.$watch('acc.data.groupadminname',function(newVal,oldVal){
		if(newVal && typeof(newVal) == "object" && newVal.length > 0 && $scope.groupAdminuser){
			setEmail(newVal,$scope.groupAdminuser,'name');
		}	
		else {
			if(angular.isDefined($scope.acc) && ($scope.acc.data.viewChild == "isEditable")){
				$scope.acc.data.email = "";
			}
		}
	});

    
    
    
    //Method for icon image upload
    $scope.iconimageupload = function(){
		setTimeout(function () {
		  angular.element('#picture').trigger('click');
		}, 0);
	};
    
     //Method for image upload
    $scope.upload = function(file) {
        $scope.profilepic = file;
        $scope.acc.data.groupicon_image      = file;
        $scope.acc.data.groupicon_smallimage = file;
       /* if(file){
            $scope.fileExt = file.name.split(".").pop();
            if($scope.fileExt == "jpg" || $scope.fileExt == "jpeg" || $scope.fileExt == "gif" || $scope.fileExt == "png"){
                $scope.profilepic = file;  
                $scope.acc.data.groupicon_image      = file.name;
                $scope.acc.data.groupicon_smallimage = file.name;
                $scope.imageextension      = false;
                $scope.group_picturecancel = 'dest/images/noimage.png';
            }else{
                $scope.imageextensionerror = "please choose valid file";
                $scope.imageextension      = true;
                $scope.profilepic          = "";
                $scope.acc.data.groupicon_smallimage = "";
                $scope.group_picturecancel = 'dest/images/noimage.png';
            }
            
        }else{
            $scope.imageextension      = false;
            $scope.group_picturecancel = {};
            $scope.group_picturecancel = $scope.profilepic.$ngfBlobUrl;
        }*/
    }

    //Method for initialize controller
   
	function initializeController(){
        $scope.existgrouplist = existgrouplist;
		$scope.acc = {};
    	$scope.acc.data = $scope.existgrouplist;
		$scope.acc.copydata = angular.copy($scope.existgrouplist);
        if( $scope.acc.data.viewChild == 'isEditable'){
            $scope.getadminRoles();
        }
        if(angular.isArray($scope.acc.data.groupadminname)){
			$scope.acc.data.groupadminnamelist = $scope.acc.data.groupadminname.join(', ');
		}else{
			$scope.acc.data.groupadminnamelist = $scope.acc.data.groupadminname;
		}
        if($scope.acc.data.groupicon_image == '' || (typeof($scope.acc.data.groupicon_image) == "noimage.png")){
			$scope.acc.data.groupicon_url   = 'dest/images';
			$scope.acc.data.groupicon_image = 'noimage.png';
			$scope.acc.data.groupicon_defaultimg = '';
		}else{
            $scope.acc.data.groupicon_defaultimg = $scope.acc.data.groupicon_smallimage;
        }
        
        setTimeout(function () {
		  angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
		});
	}
	
	//Method for initgroupcontroller
	 initializeController();  
}]);