advancePubapp.directive('restrictInput', [function(){

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var ele = element[0];
                var regex = RegExp(attrs.restrictInput);
                var value = ele.value;

                ele.addEventListener('keyup',function(e){
                    if (regex.test(ele.value)){
                        value = ele.value;
                    }else{
                        ele.value = value;
                    }
                });
            }
        };
    }]);    