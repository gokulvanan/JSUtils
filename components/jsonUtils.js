/**
*	Simple API to  simplify json parssing in other API calls
*/

window.jsonUtils=function(){
	
	return{
		getJson: function(obj){
			return (typeof(obj) === "string")? obj : JSON.stringify(obj);
		},
		getString: function(str){
		try{
  			 str = JSON.parse(str);
		}catch(err){
			//expected exception when val is a string
  		}
  		return str;
		}
	};
}();