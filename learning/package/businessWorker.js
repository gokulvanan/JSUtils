
self.onmessage=function(e) {
  //console.log("In Main Worker");
  alert(e.data);
  var val = jsonUtils.getJson(e.data);
  var output = callFunc(val);
  self.postMessage(jsonUtils.getString(output));
};

// Business Logic here
function callFunc(data){
	//console.log("calling business logic");
	var time=2000;
 	if(data == " New Div2 content") time=7000;
 	setTimeout(function(data){ return data},time);
}

jsonUtils=function(){
	
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