//To set params and api for delete action (Service)
advancePubapp.service('getParams', function() {
    this.args = function(rowheadVal,rowbodyVal) {
        
        var params = null;
        var api = null;
        var viewName = rowheadVal.actionMethods.delete.viewName;
        if(viewName){
            if(viewName.toLowerCase() == 'user'){
                return {params : {user_id:rowbodyVal.id},api:rowheadVal.actionMethods.delete.api}
            }
             if(viewName.toLowerCase() == 'categories'){
				return {params : {id:rowbodyVal.id},api:rowheadVal.actionMethods.delete.api}   
            } 
			if(viewName.toLowerCase() == 'courses'){
				return {params : {id:rowbodyVal.id},api:rowheadVal.actionMethods.delete.api}  
            } 
			if(viewName.toLowerCase() == 'classes'){
				return {params : {id:rowbodyVal.id},api:rowheadVal.actionMethods.delete.api}   
            } 
            
            if(viewName.toLowerCase() == 'group'){
				return {params : {id:rowbodyVal.id},api:rowheadVal.actionMethods.delete.api}  
            } 
             
        }
    };
});
