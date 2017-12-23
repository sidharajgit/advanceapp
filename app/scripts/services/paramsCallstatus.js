//To set params and api for status action (Service)
advancePubapp.service('getParamsstatus', function() {
    this.args = function(rowheadVal,id,rowVal,rowbody) {
      /*  if(rowheadVal.actionMethods.status.isModify){
            var customParams = {action:null,id:id}
        }
        else{
            var customParams = {action:null,id:id};
        }*/
		if(rowheadVal.actionMethods && rowheadVal.actionMethods.status &&rowheadVal.actionMethods.status.api == "content_v2.sectionGroupAssign"){
			var customParams = {action:null,id:id,section_activities:rowbody.section_activities,section_courses:rowbody.section_courses};
		}else{
			var customParams = {action:null,id:id};
		}
		
        var statusRef = {params : customParams,api : rowheadVal.actionMethods.status.api};
        var viewName = rowheadVal.actionMethods.status.viewName;
        if(rowVal){
            statusRef.params.action = "act"; 
        }
        else{
		  statusRef.params.action = "deact"; 
        }
        return statusRef;             
    };
}); 
