
/*
 * Required JS libs
 * prototype.js
 * htmlUtil.js
 * jquery.js 
 * jqgrid.js // for jgrid custom AJAX used for update 
 * sessionControl.js= session expiry link
 */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var ajaxUtil={};
/*
 * Frame work class for performing AJAX.
 * The class methods are built over jquery, hence would require jquery.js to work.
 */

//added to send this param for all ajax calls
ajaxUtil.AJAX_CALL_PARAM='ajaxCallFlag=true&'; // this also used in jqgrid calls under formatPostData method
/**
 * Added to avoid AJAX Race conditions.
 * This stack holds all the ajax ID that are in process, so as to prevent same AJAX Id being fired when its response has 
 * not come from the server and hence prevent AJAX Race conditions.
 */
ajaxUtil.ajaxCallSatck=new Array();

/*
 * method used to encode data fiels that are sent as input data in AJAX call. 
 * @paramName- name of param attribute - part of from or the name used to get using request.getParameter("name")
 * @paravValue- value of parameter.
 * @returns  String representation of &paramName=encodeURIComponenet(paramvalue); 
 * 
 */

ajaxUtil.encodeDataFields =function (paramName,paramValue)
{
	try
	{
		paramvalue=($.trim(paramValue).length!=0) ? encodeURIComponent(paramValue) : "";//validation check
		paramName+="="+paramvalue;
		paramName="&"+paramName;
		return paramName;
	}catch(err)
	{
		alert("Error in ajaxUtil encodeDataFields method err msg : "+err.message);
	}
};

/**
 * Note: htmlUtil. should be imported before this method call for this method to work.
 * Not used- Replaced with jgrid
 */

/*ajaxUtil.refreshTableData =function ()
{

	var ajaxID=null; //Added to avoid AJAX race conditions for same action being clicked twice or dependant actions being fired.
	var URL=null;
	var input=null;
	var responseHandler=null;
	var tableOBj=null;
	var responseDiv=null;
	var width=null;
	var height=null;
	var headerFlag=false;
	
	
	if(arguments.length==4)
	{
		ajaxID=arguments[0];
		URL=arguments[1];
		responseHandler=arguments[2];
		tableOBj=arguments[3];
	}
	if(arguments.length==5)
	{
		ajaxID=arguments[0];
		URL=arguments[1];
		responseHandler=arguments[2];
		tableOBj=arguments[3];
		input=arguments[4];
	}
	if(arguments.length==6)
	{
		ajaxID=arguments[0];
		URL=arguments[1];
		responseHandler=arguments[2];
		tableOBj=arguments[3];
		input=arguments[4];
		responseDiv=arguments[5];
	}
	if(arguments.length==8)
	{
		ajaxID=arguments[0];
		URL=arguments[1];
		responseHandler=arguments[2];
		tableOBj=arguments[3];
		input=arguments[4];
		responseDiv=arguments[5];
		width=arguments[6];
		height=arguments[7];
	}
	if(arguments.length==9)
	{
		ajaxID=arguments[0];
		URL=arguments[1];
		responseHandler=arguments[2];
		tableOBj=arguments[3];
		input=arguments[4];
		responseDiv=arguments[5];
		width=arguments[6];
		height=arguments[7];
		headerFlag=arguments[8];
	}
	//Store table structure
	try
	{
	var tableStruct=htmlUtil.copyTableStructure(tableOBj,headerFlag);
	}
	catch(err)
	{
		alert("Error in refreshTableData in htmlUtil.copyTableStructure method call "+err.message);
	}
	if(!URL && !responseHandler && !ajaxID && !tableStruct)//mandatory arguments
	{
		alert("Mandatory parameters to refreshTableData AJAX call are null");
	}
	else
	{
		this.getJSON(ajaxID,URL,responseHandler,tableStruct,input,responseDiv,width,height);
	}
	
};*/





/*
 * Mehtod used to get JSON object from server during AJAX call. 
 * Method can be called with different set of arguments
 * 3 arguments 
 * 	- ajaxId- unique ID given to each AJAX call made - added to prevent AJAX Race condition.
 * 	- URL - address to server action
 * 	- responseHandler - return local function that would handle the response.
 */
ajaxUtil.getJSON =function ()
{
	var ajaxID=null; //Added to avoid AJAX race conditions for same action being clicked twice or dependant actions being fired.
	var URL=null;
	var input=null;
	var responseHandler=null;
	var responseDiv=null;
	var width=null;
	var height=null;
	
	
	if(arguments.length==3)
	{
		ajaxID=arguments[0];
		URL=arguments[1];
		responseHandler=arguments[2];
	}
	if(arguments.length==4)
	{
		ajaxID=arguments[0];
		URL=arguments[1];
		responseHandler=arguments[2];
		input=arguments[3];
	}
	if(arguments.length==5)
	{
		ajaxID=arguments[0];
		URL=arguments[1];
		responseHandler=arguments[2];
		input=arguments[3];
		responseDiv=arguments[4];
	}
	if(arguments.length==7)
	{
		ajaxID=arguments[0];
		URL=arguments[1];
		responseHandler=arguments[2];
		input=arguments[3];
		responseDiv=arguments[4];
		width=arguments[5];
		height=arguments[6];
	}
	if(!URL && !responseHandler && !ajaxID)//mandatory arguments
	{
		alert("Mandatory parameters to AJAX call are null");
	}
	
	input=(input)?this.AJAX_CALL_PARAM+input:this.AJAX_CALL_PARAM;
	try
	{
		if(this.ajaxCallSatck.contains(ajaxID))
			htmlUtil.prompt.warn({msg:"Your request is Processing.. Please wait"});
		else
		{
			this.ajaxCallSatck.push(ajaxID);
			var stack = this.ajaxCallSatck;
			$.ajax({ url:URL,
				   type:"post",
				   dataType:"json",
				   beforeSend:this.loading(responseDiv,height,width),
				   cache:false,
				   error:function(requestObj, errorMsg){
														 if(sessionControl)
															 sessionControl.resetSessionCount();
														if(!ajaxUtil.ajaxCallSatck.remove(ajaxID))
															alert("Error Ajax call not removed from stack");
														alert("Error in AJAX Serveice err msg: "+errorMsg);
														},
				   data: input,
				   success: function(data, textStatus, jqXHR){
					   try
					   {
						   if(sessionControl)
							   sessionControl.resetSessionCount();
						   if(!ajaxUtil.ajaxCallSatck.remove(ajaxID))
							   alert("Error Ajax call not removed from stack");
						   if(data.status=="Success")
						   {
							   responseHandler(data);
						   }
						   else if(data.status=="Failure")
						   {
							   alert("Error in response from Server error comments= "+data.comment);
						   }else
						   {
							   alert("Error in response from Server status= "+data.status+"  error comments= "+data.comment);
						   }	

					   }catch(err)
					   {
						   ajaxUtil.ajaxCallSatck.remove(ajaxID);
						   alert("Error in ajaxUtil jsonResponseValidator method  err msg: "+err.message);
					   }
				   }
			});
			
		}
		
	}catch (err)
	{
		alert("Error in ajaxUtil getJSON method err msg: "+err.message);
	}

};



ajaxUtil.loading=function(responseDiv,height,width){

	if(responseDiv !=null && $('#'+responseDiv)!=null )
	{
		if(width!=null && height!= null)
		{
			$('#'+responseDiv).html('<div style="position:absolute;left:'+Math.round((width-25)/2)+'px;top:'+Math.round((height-25)/2)+'px;"><img src="/csa/images/loading.gif" width="25px" height="25px" alt="LOADING.." title="LOADING.."></img></div>');
		}
		else
			$('#'+responseDiv).html('<span><center>LOADING...</center></span>');
	}
};


ajaxUtil.constructData=function(elm){
	
	var data="";
	try
	{
		if(elm!=null)
		{
			if(!elm.length)//elm.length==undefined when we get single elements using document.getElementById
				elm = [elm];
			for(var i=0;i<elm.length;i++)
			{
				data+=this.encodeDataFields($(elm[i]).attr("name"),$(elm[i]).val());
			}
			return data;	
		}
	}catch(err)
	{
		alert("Error in ajaxUtil constructData method  err msg: "+err.message);
	}
};

////Functions specific to jgrid 


/*
 * Mehtod used to get JSON object from server during AJAX call. 
 * Method can be called with different set of arguments
 * 3 arguments 
 * 	- tableId- unique ID given to each AJAX call made - added to prevent AJAX Race condition.
 * 	- URL - address to server action
 * 	- responseHandler - return local function that would handle the response.
 */
ajaxUtil.jgridCustomAjax =function ()
{
	var tableId=null; //Added to avoid AJAX race conditions for same action being clicked twice or dependant actions being fired.
	var URL=null;
	var input=null;
	var responseHandler=null;
	
	
	if(arguments.length==3)
	{
		tableId=arguments[0];
		URL=arguments[1];
		responseHandler=arguments[2];
	}
	if(arguments.length==4)
	{
		tableId=arguments[0];
		URL=arguments[1];
		responseHandler=arguments[2];
		input=arguments[3];
	}
	if(!URL && !responseHandler && !tableId)//mandatory arguments
	{
		alert("Mandatory parameters to AJAX call are null");
	}
	input=(input)?this.AJAX_CALL_PARAM+input:this.AJAX_CALL_PARAM;
	try
	{
		if(this.ajaxCallSatck.contains(tableId))
			htmlUtil.prompt.warn({msg:"Your request is Processing.. Please wait"});
		else
		{
			this.ajaxCallSatck.push(tableId);
			var stack = this.ajaxCallSatck;
			$.ajax({ url:URL,
				   type:"post",
				   dataType:"json",
				   beforeSend:this.showTimerBlock(true,tableId),
				   cache:false,
				   error:function(requestObj, errorMsg){
														if(sessionControl)
																sessionControl.resetSessionCount();// Method from home.js- note home.js should be before ajaxUtil.js for this to work
														if(!ajaxUtil.ajaxCallSatck.remove(tableId))
															alert("Error Ajax call not removed from stack");
														alert("Error in AJAX Serveice err msg: "+errorMsg);
														ajaxUtil.showTimerBlock(false,tableId);
														},
				   data: input,
				   success: function(data, textStatus, jqXHR){
					   try
					   {
						   ajaxUtil.showTimerBlock(false,tableId);
						   if(sessionControl)
							   sessionControl.resetSessionCount();// Method from home.js- note home.js should be before ajaxUtil.js for this to work
						  
						   if(sessionControl===undefined)
							   alert("here")
						   if(!ajaxUtil.ajaxCallSatck.remove(tableId))
							   alert("Error Ajax call not removed from stack");
						   if(data.status=="Success")
						   {
							   responseHandler(data,tableId);
						   }
						   else if(data.status=="Failure")
						   {
							   htmlUtil.prompt.error({msg:data.comment});
						   }else
						   {
							   alert("Error in response from Server status= "+data.status+"  error comments= "+data.comment);
						   }	

					   }catch(err)
					   {
						   ajaxUtil.ajaxCallSatck.remove(tableId);
						   alert("Error in ajaxUtil jsonResponseValidator method  err msg: "+err.message);
					   }
				   }
			});
			
		}
		
	}catch (err)
	{
		alert("Error in ajaxUtil jgridCustomAjax method err msg: "+err.message);
	}

};




ajaxUtil.showTimerBlock=function (flag,tableId)
{
	if(flag)
	{
		$("#lui_"+$.jgrid.jqID(tableId)).show();
		$("#load_"+$.jgrid.jqID(tableId)).show();
	}
	else
	{
		$("#lui_"+$.jgrid.jqID(tableId)).hide();
		$("#load_"+$.jgrid.jqID(tableId)).hide();
	}
};