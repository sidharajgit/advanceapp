advancePubapp.controller('imageupload',['$scope','sfactory','$rootScope','$filter','$state','sessionService',function($scope,sfactory,$rootScope,$filter,$state,sessionService){
    
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
            sessionService.set("croppedimage",dataURL);
            $scope.uploadedit(dataURL);
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
    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
    
    
}]);