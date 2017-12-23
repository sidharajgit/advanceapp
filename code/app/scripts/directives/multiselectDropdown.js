/*
$scope.roles = [
          {"id": 1, "name": "Manager", "assignable": true},
          {"id": 2, "name": "Developer", "assignable": true},
          {"id": 3, "name": "Reporter", "assignable": true}
    ];
    
    $scope.member = {roles: []};
    $scope.selected_items = [];
<dropdown-multiselect pre-selected="member.roles" model="selected_items" options="roles"></dropdown-multiselect>
*/
advancePubapp.directive('dropdownMultiselect', function(){
   return {
       restrict: 'E',
       scope:{           
            model: '=',
            options: '=',
           filterName : '=filterType',
            pre_selected: '=preSelected',
           filtercall: '&'
       },
       template: "<div class='btn-group' data-ng-class='{open: open}' data-ng-mouseleave='open=false;selectValues();' data-ng-init='selectValues()'>"+
        
                "<button class='btn btn-small dropdown-toggle' data-ng-click='open=!open;openDropdown()' title='{{select}}'>{{select}}<span class='caret'></span></button>"+
                "<ul class='dropdown-menu' aria-labelledby='dropdownMenu'>" 										 +
                    "<li data-ng-repeat='option in options'> <a href='javascript:void(0);' data-ng-class='isChecked(option.id)'><input type='checkbox' ng-checked='isChecked(option.id)' class='dropdownChecks' data-ng-click='setSelectedItem();' name='{{option.name}}' /><span data-ng-click='setSelectedItem();'>{{option.name}}</span></a></li>" +                                        
                "</ul>" +
            "</div>" ,
       controller: function($scope){
           $scope.selectValues = function(){
               if($scope.pre_selected.length > 0 ){
                   /*getId = _.where($scope.options, {'id':$scope.pre_selected[$scope.pre_selected.length-1]});
                   $scope.select = getId[0].name;*/ 
                   $scope.select = "";                    
                   for(i=0;i<$scope.pre_selected.length;i++){                       
                       getId = _.where($scope.options, {'id':$scope.pre_selected[i]});
                       if(i == ($scope.pre_selected.length-1)){
                           $scope.select += getId[0].name;
                       }else{
                           $scope.select += getId[0].name+", ";
                       }                       
                   }
               }else{
                   if($scope.filterName == "customFilters"){
                       $scope.select = "Others";
                   }else{
                       $scope.select = $scope.filterName;
                   }
                   
               }                            
           }
           $scope.openDropdown = function(){        
                $scope.selected_items = [];
                for(var i=0; i<$scope.pre_selected.length; i++){                        
                    $scope.selected_items.push($scope.pre_selected[i].id);
                }               
            };
           
            $scope.selectAll = function () {
                $scope.model = _.pluck($scope.options, 'id');
                console.log($scope.model);
            };
           $scope.callFilterCall = function(){
               $scope.filtercall({res:{value:$scope.model,type:$scope.filterName}});
           }
            $scope.deselectAll = function() {
                $scope.model=[];
                console.log($scope.model);
            };
            $scope.setSelectedItem = function(){
                var id = this.option.id;
                if (_.contains($scope.model, id)) {
                    $scope.model = _.without($scope.model, id);                    
                } else {                    
                    $scope.model.push(id);
                }
                console.log("setSelectedItem",$scope.model);
                $scope.callFilterCall();
                return false;
            };
            $scope.isChecked = function (id) {                
                if (_.contains($scope.model, id)) {                       
                    return 'icon-ok';// pull-right - This is removed
                    return 'checked';// pull-right - This is removed
                }else{
                    
                    return false;
                }                
            };                                 
       }
   } 
});