/*
* Simple API used to persit data to and from local storage in HTML5
*/
window.Webstore=function(localFlag){
	
	var store = null;	
	var unsupported = (typeof(Storage) ==="undefined" || typeof(JSON) === "undefined");
	
	if(!unsupported){
		store = (localFlag) ? localStorage : sessionStorage;
	}
  		
  	function getData(key){
  		var val = store[key];
  		val = (val) ? val : null;
  		try{
  			 val = JSON.parse(val);
		}catch(err){
			console.log(err);
			//expected exception when val is a string
  		}
  		return val;
  	}

  	function storeData(key,obj){
  		var stringVal = (typeof(obj) === "string")? obj : JSON.stringify(obj);
  		store[key]=stringVal;
  	}

  	function dataPresent(key){
  		var val = store[key];
  		return (val) ? true : false;
  	}

	return{
		get : function(key){
			if(unsupported)	return null;
			return getData(key);
		},
		set : function(key,obj){
			if(unsupported)	return;
			storeData(key,obj);
		},
		contains: function(key){
			if(unsupported)	return false;
			return dataPresent(key);
		}
	};
}