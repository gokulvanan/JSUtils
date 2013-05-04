window.Executor=function(WORKER_PATH){
	

	function exec(jsonObj,guiFunc){
		if(typeof(Worker) ==="undefined") throw new Error("Web worker not supported by browser");
		var worker = new Worker(WORKER_PATH);
  		worker.onmessage = function(event){
  			console.log("in executor onmessage handler");
  			console.log(event);
  			guiFunc(jsonUtils.getJson(event.data));// process data
  		}

  		worker.postMessage(jsonUtils.getString(jsonObj));

	}
	return{
		execute: exec
	}
};