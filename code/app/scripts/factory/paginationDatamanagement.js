advancePubapp.factory('paginationDatamanagement', ['sfactory','$window','encryptionService',function(sfactory,$window,encryptionService) {
    /*Method to cache list of selected items while paginating the page*/
   return {
         selectedItems: []
   }
}]);