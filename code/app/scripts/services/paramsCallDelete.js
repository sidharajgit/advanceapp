//To set params and api for delete action (Service)
advancePubapp.service('getParamsDelete', function() {
    this.args = function(viewName,idsarray,titlearray) {       
        var params = null;
        var api = null;
        if(viewName){
            if(viewName.toLowerCase() == 'user'){
                //return {params : {user_id:rowbodyVal.id}}
                //return {params :  {catAction:'UserMultiDel',courseCatIds:idsarray,courseCatTitles:titlearray}}
			    var idsarraylist=_.map(idsarray).join(', ');
                return {params : {user_id:idsarraylist,isAdmin:'listDetails'}}
            }
             if(viewName.toLowerCase() == 'categories'){
				var idsarraylist=_.map(idsarray).join(',');
                return {params : {id:idsarraylist}}
            } 
            if(viewName.toLowerCase() == 'courses'){
				var idsarraylist=_.map(idsarray).join(',');
                return {params : {id:idsarraylist}}
            }
			if(viewName.toLowerCase() == 'classes'){
                var idsarraylist=_.map(idsarray).join(',');
                return {params : {id:idsarraylist,isAdmin:'listDetails'}}
            } 
            if(viewName.toLowerCase() == 'group'){
                var idsarraylist=_.map(idsarray).join(',');
                return {params : {id:idsarraylist,isAdmin:'listDetails'}}
				//return {params : {groupAction:'groupMultiDel',courseCatIds:idsarray,courseCatTitles:titlearray}}   
            } 
            
        }
    };
});
//user.delete_list