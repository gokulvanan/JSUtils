var exceptionHandler = {};

exceptionHandler.handle=function(data)
{
	if(data.status && data.status=="Exception")
	{
		if(data.actionType=="AUTO_EMAIL_AND_LOGOUT")
		{
			parent.location='/MVT/jsp/criticalError.jsp';
		}
		else if(data.actionType=="AUTO_EMAIL_AND_NOTIFY_USER")
		{
			htmlUtil.prompt.error({msg:"Application has encountered an" +
				" Internal Error, This has been reported to Adminstator." +
				" Please avoid using the current functionality for some time. "});
		}else if(data.actionType=="NOTIFY_USER_COLLECT_MORE_INFO_FOR_MAIL")
		{
			//code to get a mail pop up
			htmlUtil.popUp.openModalWindow('/MVT/contactUsAction.do?hidAction=errorReport','50%','55%',function (data){ exceptionHandler.closeModalHandler(data);});
		}else if(data.actionType=="NOTIFY_USER")
		{
			if(data.errorType=="SESSION_TIME_OUT")
			{
				htmlUtil.prompt.error({msg:"User Session Has Timed Out. Please Login again."});
				window.location='/MVT/jsp/sessionTimeout.jsp';
			}/*else if(data.errorType=="INVALID_USER")
			{
				parent.location='/MVT/jsp/invalidUserDetails.jsp?ERROR_TYPE='+data.errorType;
			}else if(data.errorType=="INACTIVE_USER")
			{
				parent.location='/MVT/jsp/invalidUserDetails.jsp?ERROR_TYPE='+data.errorType;
			}else if(data.errorType=="INVALID_ROLE")
			{
				window.location='/MVT/jsp/invalidUserDetails.jsp?ERROR_TYPE='+data.errorType;
			}*/
		}
		return true;
	}else
	{
		return false;
	}
};

exceptionHandler.closeModalHandler=function(data)
{
	htmlUtil.prompt.notify({msg:data});
};