
var HEAD_CONTROL_ELM_$ = $(parent.document.getElementById("headFrameControlFlag"));
var BODY_CONTROL_ELM_$ = $(parent.document.getElementById("bodyFrameControlFlag"));
var MODULE_LOCK_ELM_$ = $(parent.document.getElementById("moduleLockFlag"));

$(document).ready(function() {

	// setFrameHanlder
	if(!HEAD_CONTROL_ELM_$ || !BODY_CONTROL_ELM_$ || !MODULE_LOCK_ELM_$ )
	{
		htmlUtil.prompt.error({msg:"Frame  intialization error at body frame "});
	}
	BODY_CONTROL_ELM_$.click(function (){
		frameControl.triggerAction(BODY_CONTROL_ELM_$.val());
	});
	MODULE_LOCK_ELM_$.val("false");//unset the module lock flag.

});


var frameControl={};
////////////////////Methods to be overridefromLocal/////////////////////////////

frameControl.printAction= function()
{
	htmlUtil.prompt.notify({msg:"Print action for this Page is under construction"});
};

frameControl.exportAction= function()
{
	htmlUtil.prompt.notify({msg:"Export action for this Page is under construction"});
};

frameControl.feedbackHandler= function(flag,data)
{
	
	if($.trim(data).length!=0)
		htmlUtil.prompt.notify({msg:data});
	if(HEAD_CONTROL_ELM_$)
	{
		HEAD_CONTROL_ELM_$.val(flag);
		HEAD_CONTROL_ELM_$.click(); // triggers call from header.js called from header.jsp
	}
};



frameControl.triggerAction= function (flag)
{
	if(flag=="contact_us")
	{
		
		htmlUtil.popUp.openModalWindow('/MVT/contactUsAction.do?hidAction=INIT','50%','55%',function (data){ frameControl.feedbackHandler(flag,data);});
	}
	else if (flag=="email")
	{
//		htmlUtil.popUp.openModalWindow('/csa/contactUs.do','50%','55%',function (data){ frameControl.feedbackHandler(flag,data);});
		htmlUtil.prompt.notify({msg:"Email option is under construction"});
	}
	else if (flag=="print")
	{
		frameControl.printAction();
	}
	else if (flag=="export")
	{
		frameControl.exportAction();
	}
};

frameControl.callHeaderFunction=function(val)
{
	if(HEAD_CONTROL_ELM_$)
	{
		HEAD_CONTROL_ELM_$.val(val);
		HEAD_CONTROL_ELM_$.click(); // triggers call from header.js called from header.jsp
	}
	else
		alert("Error in Frame Control functionality");
};

frameControl.openExternalLink=function(url)
{
	parent.window.open(url, '_blank');
};

frameControl.openScreen=function(module,subTab,url)
{
	var str = 'OPEN_MODULE#@'+module+'@'+subTab+'@'+url;
	this.callHeaderFunction(str);
};