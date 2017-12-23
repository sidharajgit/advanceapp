advancePubapp.directive('dropDown', function() {
    return {
        scope: {
            selectOptions: '=options',
            select:'=selectedOption',
            invokeCat:'&onSelect'
        },
        templateUrl: 'dest/templates/select.html',
        link:  function(scope, element, attr) {
            scope.showOption = false;

            scope.toggle = function(){
                scope.showOption = !scope.showOption;
            }

            scope.selection = function(option){
                // alert(option);
                scope.select =option.name;
                scope.invokeCat({option:option});
            }

              // element.bind("click", function(e){
               
              //        if(e.target.parentNode.className !=='dd-select'){
              //            scope.showOption = false;
              //            scope.$apply();
              //        }else{
              //            scope.showOption = true;
              //        }
              //  });

        }
    }
})
.directive('dropDownChild', function() {
    return {
        scope: {
            selectOptions: '=options',
            select:'=selectedOption',
            invokeSubCat:'&onSubSelect'
        },
        templateUrl: 'dest/templates/select-child.html',
        link:  function(scope, element, attr) {
            scope.showOption = false;

            scope.toggle = function(){
                scope.showOption = !scope.showOption;
            }

            scope.selection = function(option){
                // alert(option);
                scope.select =option.name;
                scope.invokeSubCat({option:option});
            }

            // element.bind("click", function(e){
          
            //         if(e.target.parentNode.className !=='dd-selected child'){
            //              scope.showOption = false;
            //              scope.$apply();
            //          }else{
            //             scope.showOption = true;
            //          }
            //    });

        }
    }
})