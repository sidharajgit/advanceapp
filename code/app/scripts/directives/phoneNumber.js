/*
Automatic phone number formatting in input field

Credits: 
    - Wade Tandy via
    http://stackoverflow.com/questions/19094150/using-angularjs-directive-to-format-input-field-while-leaving-scope-variable-unc
    
    - kstep via
    http://stackoverflow.com/questions/12700145/how-to-format-a-telephone-number-in-angularjs
    
    - hans via
    http://codepen.io/hans/details/uDmzf/
*/
  
advancePubapp.directive('phonenumberDirective', ['$filter', function($filter) {
		function link(scope, element, attributes) {
			// scope.inputValue is the value of input element used in template
			//scope.inputValue = scope.phonenumberModel;
			scope.$watch('phonenumberModel', function(value, oldValue) {
				value = String(value);
				var number = value.replace(/[^0-9]+/g, '');
				scope.phonenumberModel = number;
				scope.phonenumberModel = $filter('phonenumber')(number);
				if(number.length < 10 && scope.phonenumberModel){
					scope.phonetrue = true;
					scope.validationmsg = "Maximum length 10";
				}else if(number.length > 10 && scope.phonenumberModel){
					scope.phonetrue = true;
					scope.validationmsg = "Minimum length 10";
				}				
				else if(scope.phonenumberModel.length < 14 && scope.phonenumberModel){
					scope.phonetrue = true;
					scope.validationmsg = "Minimum length 10";
				}else{
					scope.phonetrue = false;
				}
			});
		}
		return {
			link: link,
			restrict: 'E',
			scope: {
				phonenumberPlaceholder: '=placeholder',
				phonenumberModel: '=model',
				phonetrue: '=',
				iseditable:'='
			},
			//templateUrl: '/static/phonenumberModule/template.html',
			template: '<md-input-container class="md-block">'+' <label>Phone Number</label> '+'<input ng-model="phonenumberModel" type="tel" class="phonenumber" ng-disabled="iseditable"><span style="color:rgb(221,44,0);" ng-if="phonetrue&&phonenumberModel">{{validationmsg}}</span>'+ '</md-input-container>',            
            
            /*template: '<md-input-container class="md-block">'+' <label>Phone Number</label> '+'<input ng-model="inputValue" type="tel" class="phonenumber" placeholder="{{phonenumberPlaceholder}}" ><span style="color:rgb(221,44,0);" ng-if="phonetrue&&inputValue">Minimum length 10</span>'+' </md-input-container>',  */
		};
	}])
    	
	advancePubapp.filter('phonenumber', function() {	    
	    return function (number) {
	        if (!number) { return ''; }
	        number = String(number);
 	        var formattedNumber = number;
			var c = (number[0] == '1') ? '1 ' : '';
			number = number[0] == '1' ? number.slice(1) : number;
			var area = number.substring(0,3);
			var front = number.substring(3, 6);
			var end = number.substring(6, 10);
			if (front) {
				formattedNumber = (c + "(" + area + ") " + front);	
			}
			if (end) {
				formattedNumber += ("-" + end);
			}
			return formattedNumber;
	    };
	});

/*advancePubapp.directive('phoneInput', function($filter, $browser) {
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            console.log($element);
            var listener = function() {
                var value = $element.val().replace(/[^0-9]/g, '');
                $element.val($filter('tel')(value, false));
            };

            // This runs when we update the text field
            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.replace(/[^0-9]/g, '').slice(0,10);
            });

            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() {
                $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
            };

            $element.bind('change', listener);
            $element.bind('keydown', function(event) {
                var key = event.keyCode;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
                    return;
                }
                $browser.defer(listener); // Have to do this or changes don't get picked up properly
            });

            $element.bind('paste cut', function() {
                $browser.defer(listener);
            });
        }

    };
});

advancePubapp.filter('tel', function () {
    return function (tel) {         
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 1:
            case 2:
            case 3:
                city = value;
                break;

            default:
                city = value.slice(0, 3);
                number = value.slice(3);
        }

        if(number){
            if(number.length>3){
                number = number.slice(0, 3) + '-' + number.slice(3,7);
            }
            else{
                number = number;
            }

            return ("(" + city + ") " + number).trim();
        }
        else{
            return "(" + city;
        }

    };
});*/