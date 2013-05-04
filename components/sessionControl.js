var sessionControl={};

sessionControl.IGNORE_SESSION_COUNTER=false; // added to ignore this validation during invalid user cases
sessionControl.resetSessionCount= function()
{
	var resetSessionElm_$=$(parent.document.getElementById("refreshSessionCount"));
	var prntBuffer= parent;
	var count =10;
	while(resetSessionElm_$.length==0 && count>0)
	{
		prntBuffer=prntBuffer.parent;
		resetSessionElm_$=$(prntBuffer.document.getElementById("refreshSessionCount"));
		count--;
	}
	if(resetSessionElm_$.length==0 && !this.IGNORE_SESSION_COUNTER)
		alert("Error in getting session control object");
	else
	{
		if(!this.IGNORE_SESSION_COUNTER)
			resetSessionElm_$.click();// triggers reset of timer in header frame does not work for contact us and head trigereed body modals
	}
};
