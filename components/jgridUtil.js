
/*
 * Required JS libs
 * prototype.js
 * htmlUtil.js
 * jquery.js 
 * jqGrid.js
 * jgrid.override.funcs.js
 * exceptionHanlder.jsp- exception management
 * sessionControl.js-session expiry
*/


//*****************************************************************************************************************************************
///SPECIFIC proptotype functions defined for inline add,update,delete handling in jgrid//////////////////////////////////////////////
/**
 * Note: the method below works like remove of ArrayList in java.
 * @param tableId (tableJSON)
 * @return tableJSON
 */
Array.prototype.removeTable= function (tableId)
{
	try{
		if(!this)//condition is true for this= null or undefined
			return null;
		else
		{
			for(var i=0 in this)	
			{
				if (this[i])
				{
					if(this[i].id)
					{
						if(this[i].id==tableId)
						{
							var tableJson =this[i];
							this.splice(i,1);
							return tableJson;
						}
					}
					else
						continue;
				}
			}
			return null;
		}

	}catch(err)
	{
		alert("Error in htmlUtil Array.removeTable. method err Msg-"+err.message);
		return null;
	}

};

/**
 * Note: the method below works like get of ArrayList in java.
 * @param tableId (tableJSON)
 * @return tableJSON
 */
Array.prototype.getTable= function (tableId)
{
	try{
		if(!this)//condition is true for this= null or undefined
			return null;
		else
		{
			for(var i=0 in this)	
			{
				if (this[i])
				{
					if(this[i].id)
					{
						if(this[i].id==tableId)
						{
							var tableJson = this[i];
							return tableJson;
						}
					}
					else
						continue;
				}
			}
			return null;
		}

	}catch(err)
	{
		alert("Error in htmlUtil Array.getTable. method err Msg-"+err.message);
		return null;
	}

};



// add exists method to jquery
$.fn.exists = function(){return this.length>0;} ;
//*************************************************************************************************************************************

//FUNCTIONS TO BE OVERRIDEEN IN LOCAL JS FILES/////////////////////////////////////////////////////////////
/**
 *
 * Used in inline validation of jqgrid cells. If colModel of grid defines editRules:{custom:true} then this function is called.
 * @param data - data of the cell
 * @param rowId- id of row element
 * @param colName - name of column given as index in colModel
 * @param tableId- id of the respective grid
 * @return errorMessage - null or empty String implies validation output =true
 * 						- String msg - implies validation is false and msg is displayed as a prompt over the textbox/textarea.
 *
 */ 
function customValidator(data,rowId,colName,tableId){return null;};

/**
*
* Used in Save Call during inline editing of jqgrid cells.
* This function is called after the save ajax Call is processed and if its sucessful. The call to this method occurs
* before the grid is reloaded.
* @param dataObj - jsonData from server
* @param tableId - tableId of the concerned grid
* @return <boolean> result - true - calls reload table Grid.
* 						   - false - does not reload grid
*
*/ 
function afterSaveReloadGrid(dataObj,tableId){return true;};

/**
*
* Used to load ObjectData as per IJSONObject after grid load- triggered on loadComplete
* 
* @param objectJson - json representation of ObjectData sent from server 
* @param tableId - tableId of the concerned grid
* @return void 
*
*/ 
function postGridCallProcess(objectJson,tableId){};
/**
*
* Used to manipulate postData being sent in Ajax call of jgrid during update/add/del operations.
* Primarily used to append data to existing grid data depending on business logic.
* @param tableId - tableId of the concerned grid
* @param data - String data with &key=val format.
* @return <String> data- data to be use by ajax call.
*
*/ 
function manipulateDataBeforeJgridUpdateCall(tableId,data){return data;};

/**
*
* Trigger function activated when a table row is selected.
* 
* @param rowId - rowId of the row selected.
* @param tableId - tableId of the concerned grid
* @return void 
*
*/ 
function onJgridRowSelect(rowId,tableId){};

/**
*
* Override function activated to override editableforAdd formater function for the true case of new Row being added
*  Call to this function will override default behaviour in editableForAdd as long output !=null
* @param cellValue - value of cell to be formated.
* @param opts - json obj which contains tableId as gid , rowId as rowId, colModel etc.. 
* @param rowdata - rowData of the row as jsonObject
* @return String- formated output -  If output ==null then override does not take place
*
*/ 
function overrideEditableForAddTrueCase(cellvalue,opts,rowdata){return null;}



/**
*
* Override function activated to override editableforAdd formater function for the false case of new Row being added
* Call to this function will override default behaviour in editableForAdd as long output !=null
*  
* @param cellValue - value of cell to be formated.
* @param opts - json obj which contains tableId as gid , rowId as rowId, colModel etc.. 
* @param rowdata - rowData of the row as jsonObject
* @return String- formated output -  If output ==null then override does not take place
*
*/ 
function overrideEditableForAddFalseCase(cellvalue,opts,rowdata){return null;}

/**
*
* Function to be implemented for custom formatter when colModel for a column specifies formatter:jgridUtilCustom 
*  
* @param cellValue - value of cell to be formated.
* @param opts - json obj which contains tableId as gid , rowId as rowId, colModel etc.. 
* @param rowdata - rowData of the row as jsonObject
* @param isNewRow - true incase on inline editing for a new row being added using + (Add) button
* @return String- formated output -  If output ==null then error is thrown by jgridUtil.js
*
*/ 
function griCustomFormater(cellvalue, opts, rowdata,isNewRow){return null;}

/**
*
* Function will be called before framework creates edit boxes for inline editing. 
*   
* @param rowId - Id of row being edited
* @param tabelId - grid Id of the table 
* @return booelan  true - would continue to mark the row for deleting. false would not mark the row for editing
*
*/ 
function beforeJgridEdit(rowId,tableId){return true;};

/**
*
* Function will be called after framework creates edit boxes for inline editing. 
*   
* @param rowId - Id of row being edited
* @param tabelId - grid Id of the table 
* @return void
*
*/ 
function afterJgridEdit(rowId,tableId){};

/**
*
* Function will be called before framework marks row for deletion during inline editing. 
*   
* @param rowId - Id of row being edited
* @param tabelId - grid Id of the table 
* @return booelan - true - would continue to mark the row for deleting. false would not mark the row for deletion
*
*/ 
function beforeJgridDelete(rowId,tableId){return true;};
/**
*
* Function will be called after framework marks row for deletion during inline editing. 
*   
* @param rowId - Id of row being edited
* @param tabelId - grid Id of the table 
* @return void
*
*/ 
function afterJgridDelete(rowId,tableId){};

/**
*
* Function will be called once json data is returned from the server before jgrid construction
*   
* @param data - jsonDataReturnedFromServer
* @param tabelId - grid Id of the table 
* @return void
*
*/ 
function callOnJgridSucessLoad(data,tableId){};


/**
*(TEMP FIX - NEED TO FIND A BETTER SOLUTION FOR DATE PICKER
* Function will be called when add or editRow button is clicked. -used to introduce date picker
*   
* @param rowId - rowId being edited
* @param tabelId - grid Id of the table 
* @return void
*
*/ 
function customizeonGridEdit(rowId,tableId){};

/**
 * DEPRECEATED
*(TEMP FIX - NEED TO FIND A BETTER SOLUTION FOR DATE PICKER
* Function will be called before any get call from jgrid
*   
* @param tabelId - grid Id of the table 
* @return boolean- to start or stop the select service call
*
*/ 

/*function beforeGridSelectCall(tableId){return true;}*/

/**
 * called before when search button is clicked.
 * @param tableID
 * @return void
 */
function onJgridSearchOverrideFunction(tableID)
{
	
	
};

/**
 * Called before construction of jqgrid in order to override colModel generated by JSTL for special cases
 * @param tableId
 * @param colModel
 * @return
 */
function overrideColModel(tableId,colModel)
{
	return null;
}

/**
 * This function is called for handling the click action for a pick list when pickAndAddAction formatter is used.
 * @param rowId
 * @param tableId
 * @return
 */
function customPickAndAdd(rowId, tableId)
{
	htmlUtil.prompt.warn({msg:"customPickAndAdd row function not defined in local js file."});
}
function jgridCustomLinkClickHandler(rowId, tableId,colName,cellValue)
{
	htmlUtil.prompt.warn({msg:"LinkHandler for this table is not defined"});
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var jgridUtil={};	

//CONSTANTS
jgridUtil.TABLE_STACK= new Array(); //Holds table add/update/delete list
jgridUtil.GRID_MAX_ADD_ROW_ID=1; //used to proivde unique rowId for adding new data as new add row
//jgridUtil.CHANGES_CHECK_FLAG=true; // Not currently in use
jgridUtil.INVALID_GRID_STCK= new Array(); // Used to throw error flag when save is clicked to display prompts of invalid entries
jgridUtil.GRID_DATA_STCK=new Array(); // Buffer Object array that hold Json data for jgrid after tableLoad in jgrid call.
jgridUtil.HIGHLIGHT_COLOR="jgrid_highlight_selected_row";//{"background":"#0dc543"};

// MTEHODS USED FOR STACK UTILS///////////////////////////

/**
 * Returns true if TABLE_STACK has the given tableID (i.e. when table is being edited) 
 */
jgridUtil.containsTableJSON= function(tableId)
{
	
	var tableJSON=this.TABLE_STACK.getTable(tableId);
	
	if(tableJSON)
		return true;
	else
		return false;
	
	
};

/**
 * adds the row being added edited or deleted to TABLE_STACK
 */
jgridUtil.addRowToTableStackJSON= function(tableId,rowID,type)
{
	
	var tableJson=this.TABLE_STACK.removeTable(tableId);
	if(tableJson)
	{
		if(type=="EDIT")
		{
			var stk = tableJson.EDIT_STACK;
			if(!stk)
				stk=new Array();
			stk.push(rowID);
			tableJson.EDIT_STACK=stk;
		}
		else if(type=="DEL")
		{
			var stk = tableJson.DEL_STACK;
			if(!stk)
				stk=new Array();
			stk.push(rowID);
			tableJson.DEL_STACK=stk;
		}else if(type=="ADD")
		{
			var stk = tableJson.ADD_STACK;
			if(!stk)
				stk=new Array();
			stk.push(rowID);
			tableJson.ADD_STACK=stk;
		}
		else
		{
			var err={message:"Error in addToTableStackJSON msg:- incorrect Type"};
			throw (err);
		}
	}
	else
		{
		var tableJson={
				"id":tableId,
				"EDIT_STACK":null,
				"DEL_STACK":null,
				"ADD_STACK":null
		};
	
		if(type=="EDIT")
		{
			var stk = tableJson.EDIT_STACK;
			if(!stk)
				stk=new Array();
			stk.push(rowID);
			tableJson.EDIT_STACK=stk;
		}
		else if(type=="DEL")
		{
			var stk = tableJson.DEL_STACK;
			if(!stk)
				stk=new Array();
			stk.push(rowID);
			tableJson.DEL_STACK=stk;
		}else if(type=="ADD")
		{
			var stk = tableJson.ADD_STACK;
			if(!stk)
				stk=new Array();
			stk.push(rowID);
			tableJson.ADD_STACK=stk;
		}
		else
		{
			var err={message:"Error in addToTableStackJSON msg:- incorrect Type"};
			throw (err);
		}
		this.showHideGridReloadOptions("hide",tableId);
		}
	
	this.TABLE_STACK.push(tableJson);
};

/**
 * removes rows from table Stack when cancel is clicked
 */
jgridUtil.removeRowFromTableStackJSON= function(tableId,rowID,type)
{
	var output=false;
	var tableJson=this.TABLE_STACK.removeTable(tableId);
	if(tableJson)
	{
		if(type=="EDIT")
		{
			var stk = tableJson.EDIT_STACK;
			if(stk)
			{
				output= stk.remove(rowID);
				if(stk.length==0)
					stk=null;
				tableJson.EDIT_STACK=stk;
			}
		}
		else if(type=="DEL")
		{
			var stk = tableJson.DEL_STACK;
			if(stk)
			{
				output= stk.remove(rowID);
				if(stk.length==0)
					stk=null;
				tableJson.DEL_STACK=stk;
			}
		}else if(type=="ADD")
		{
			var stk = tableJson.ADD_STACK;
			if(stk)
			{
				output= stk.remove(rowID);
				if(stk.length==0)
					stk=null;
				tableJson.ADD_STACK=stk;
			}
		}
		else
		{
			var err={message:"Error in removeTableStackJSON msg:- incorrect Type"};
			throw (err);
		}
		
		if(!(tableJson.ADD_STACK==null && tableJson.EDIT_STACK==null && tableJson.DEL_STACK==null))
				this.TABLE_STACK.push(tableJson);
		else
			this.showHideGridReloadOptions("show",tableId);
	}
	
	return output;
};

/**
 * creates a new stack of rowIds for add/modify/delete and returns the same. 
 */
jgridUtil.getNewStck= function (input)
{
	var output=null;
	if(input)
	{
		output=new Array();
		for(var i=0;i<input.length;i++)
		{
			output.push(input[i]);
		}
	}
	return output;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//**************************************************INLINE EDITING FUNCTIONS****************************************************



/**
 * Gets cursor to the first Column to be edited //temp fix has to e changed
 */
jgridUtil.focusFirstEditColForAdd=function(tableId,rowId)
{
	var inputCols =$('#'+tableId+" #"+rowId+"  td input");
	if(inputCols)
		$(inputCols[0]).focus();
};


/**
 * Called when Add button is clicked on jgrid
 */
jgridUtil.customizedadd=function (tableId,data,pos)
{
	if(!pos)
		post="last";
	var rowId= jgridUtil.getUniqueId(tableId);
//	this.populateStack("ADD",tableId,rowId);
	this.addRowToTableStackJSON(tableId, rowId, "ADD");
	if(data)
		$("#"+tableId).addRowData( rowId,data,pos );//add and format add row based on formater
	else
		$("#"+tableId).addRowData( rowId,{},pos );//add and format add row based on formater
	jgridUtil.highlightRow(rowId,true);
	$('#'+tableId).jqGrid('editRow',rowId,false,function(){jgridUtil.onGridEdit(rowId,tableId);}); //focus on addrow
	this.focusFirstEditColForAdd(tableId, rowId);

};

/**
 * Called when inline edit button is clicked on jgrid
 */
jgridUtil.customizedEdit = function(rowId,tableId)
{
	if(beforeJgridEdit(rowId,tableId))
	{
		this.addRowToTableStackJSON(tableId, rowId, "EDIT");
		jgridUtil.highlightRow(rowId,true);
		$('#'+tableId).jqGrid('editRow',rowId,false,function(){jgridUtil.onGridEdit(rowId,tableId);});
		$("tr#"+rowId+" div.ui-inline-edit, "+"tr#"+rowId+" div.ui-inline-del",'#'+tableId).hide();
		$("tr#"+rowId+" div.ui-inline-cancel",'#'+tableId).show();
	}
	afterJgridEdit(rowId,tableId);
};

/**
 * Called when add or edit button is clicked. during inline edit.
 * Used to trigger override function customizeOnGridEdit
 */
jgridUtil.onGridEdit= function(rowId,tableId)
{
	customizeonGridEdit(rowId,tableId);
};

/**
 * Called when delete button is clicked
 */
jgridUtil.customizedDel=function(rowId,tableId)
{
	if(beforeJgridDelete(rowId,tableId))
	{
		this.addRowToTableStackJSON(tableId, rowId, "DEL");
		jgridUtil.highlightRow(rowId,true);
		$("tr#"+rowId+" div.ui-inline-edit, "+"tr#"+rowId+" div.ui-inline-del",'#'+tableId).hide();
		$("tr#"+rowId+" div.ui-inline-cancel",'#'+tableId).show();
	}
	afterJgridDelete(rowId,tableId);
};

/**
 * Called when inline cancel button is clicked.
 */
jgridUtil.customizedRestore=function(rowId,tableId,button)
{
	if(this.removeRowFromTableStackJSON(tableId,rowId,"EDIT"))
	{
		$('#'+tableId).jqGrid('restoreRow',rowId);
		$("tr#"+rowId+" div.ui-inline-edit, "+"tr#"+rowId+" div.ui-inline-del",'#'+tableId).show();
		$("tr#"+rowId+" div.ui-inline-cancel",'#'+tableId).hide();
	}
	else if(this.removeRowFromTableStackJSON(tableId,rowId,"DEL"))
	{
		$("tr#"+rowId+" div.ui-inline-edit, "+"tr#"+rowId+" div.ui-inline-del",'#'+tableId).show();
		$("tr#"+rowId+" div.ui-inline-cancel",'#'+tableId).hide();
	}
	else if(this.removeRowFromTableStackJSON(tableId,rowId,"ADD"))
	{
		$("#"+tableId).delRowData(rowId);
	}
	else
	{
		alert("Error in jgridUtil.customizedRestore as given rowId/tableId is not there in any stack to restore");
	}
	jgridUtil.highlightRow(rowId,false);
	htmlUtil.prompt.closeHtmlAlertInGridForRow(rowId);//closes all prompts (error,warn,notification) for the elements of that row

};

/**
 * Triggered when Cancel (restore All) button at the bottom of the grid is clicked.
 */
jgridUtil.customizedRestoreAll=function(tableId)
{
	var tableJSon =this.TABLE_STACK.getTable(tableId);
	if(tableJSon)
	{
		var types =["EDIT","ADD","DEL"];
		for(var i=0;i<types.length;i++)
		{
			var stck=null;
			if(types[i]=="EDIT")
				stck=this.getNewStck(tableJSon.EDIT_STACK);
			else if(types[i]=="ADD")
				stck=this.getNewStck(tableJSon.ADD_STACK);
			else //DEL case
				stck=this.getNewStck(tableJSon.DEL_STACK);
			
			if(stck)
			{
				for(var k=0;k<stck.length;k++)
					this.customizedRestore(stck[k],tableId,types[i]);
			}
		}
	}
};

/**
 * Called when save button is clicked.
 */
jgridUtil.customizedSave=function(url,tableId)
{
	//check stack for tableId
	var tableJson = this.TABLE_STACK.getTable(tableId);
	this.INVALID_GRID_STCK.remove(tableId);//RESET FOR NEW VALIDATION

	if(tableJson)
	{
		var gridData=this.constructData(tableJson);
		if(!this.INVALID_GRID_STCK.contains(tableId))
		{
			if(gridData)
			{
				var data="hidAction=updateJgrid_"+tableId;//ACTION PARAM"hidAction":"systemCodeMstrJgridCall"
				data+=ajaxUtil.encodeDataFields("gridData",gridData);
				data=manipulateDataBeforeJgridUpdateCall(tableId,data);
				if(data)
				{
					ajaxUtil.jgridCustomAjax(tableId,url,this.saveHandler,data);
				}
				else
				{
					alert("Error in manipulateDataBeforeJgridUpdateCall gridData being sent in ajax call.")
				}

			}
		}
	}

};

/**
 * jgrid Custom ajax handler during save operation for inline edit.
 */
jgridUtil.saveHandler = function(dataObj,tableId)
{
	jgridUtil.TABLE_STACK.removeTable(tableId);
	jgridUtil.showHideGridReloadOptions("show",tableId);
	if(dataObj.status=="Success")
	{
		if(afterSaveReloadGrid(dataObj,tableId)==true)
		{
			$("#"+tableId).trigger("reloadGrid");
		}
	}else
	{
		htmlUtil.prompt.error({msg:dataObj.comment});
	}
	
};

/**
 * Inline edit  validation functions
 */
jgridUtil.validRow=function(elmn,editRules,data,tableId)
{
	var flag=true;
	data=data+"";
	if(editRules)
	{
		if(editRules.required)
		{
			flag=htmlUtil.validator.isMandatory(data,elmn);
			if(!flag) return false;
		}
		if(editRules.numeric)
		{
			flag=htmlUtil.validator.isNumeric(data,elmn);
			if(!flag) return false;
		}
		if(editRules.alphanumeric)
		{
			flag=htmlUtil.validator.isAlphaNumeric(data,elmn);
			if(!flag) return false;
		}
		if(editRules.alphabets)
		{
			flag=htmlUtil.validator.isAlphabets(data,elmn);
			if(!flag) return false;
		}
		if(editRules.custom)// to customize validation rules
		{
			var rowId=$(elmn).attr("id").split("_")[0];
			var colName=$(elmn).attr("id").split("_")[1];
			var message=customValidator(data,rowId,colName,tableId); //id = rowId_colName
			if(message)
			{
				if((message+"").trim().length!=0)
				{
					htmlUtil.prompt.error({elm:elmn,msg:message});
					return false;
				}
			}
				
		}
	}
	
	return flag;
};

/**
 * Used by save to construct JSONdata for save ajax call  and also validate the data in the process
 */
jgridUtil.constructData=function(tableJson)
{
	var tableId=tableJson.id;
	var output='{';
	var add=this.constructFromStack(tableJson.ADD_STACK,tableId,"ADD");
	var edit=this.constructFromStack(tableJson.EDIT_STACK,tableId,"EDIT");
	var del=this.constructFromStack(tableJson.DEL_STACK,tableId,"DEL");
	if(add ==null || edit==null )
		return null; // Error case
	
	output+='INSERT:';
	output+=add+',';
	output+='UPDATE:';
	output+=edit+',';
	output+='DELETE:';
	output+=del;
	output+='}';
	return output;
};

/**
 * Sub function- used to extract JSON for each stack (ADD, UPDATE, DELETE)
 */
jgridUtil.constructFromStack=function(stck,tableId,type)
{
	var output="[";//No data case
	if(stck)
	{
		for(var i=0;i<stck.length;i++)
		{
			var rowId=stck[i];
			var rowData=$("#"+tableId).getRowData(rowId);
				if(i==0)
					output+="{";
				else
					output+=",{";
				
					output+="\"row_id\":\""+rowId+"\"";
				if(type!="DEL")
					output+=this.getStringRepresentation(rowData,tableId,rowId,type);
				
				output+="}";
		}
	}
	output+="]";
	return output;
};

/**
 * sub function used to validate and return the value of content in each cell
 */
jgridUtil.getStringRepresentation=function (rowData,tableId,rowId,type)
{
	var output='';
	var colModels=$("#"+tableId).getGridParam("colModel");
	var i=0;
	for(var k in rowData)
	{
		output+=",";
		var colModel=colModels[i];
		var name=colModel.name;
		var editable=colModel.editable;
		var editType=colModel.edittype;
		var editRules=colModel.editrules;
		var colVal=rowData[k];
		
		if(colModel.formatter)//=='customHyperLink' applies to all formatters
		{
			colVal="#"+rowId+"_"+name;
		}
		if(colModel.formatter=='editableForAdd' && type=="ADD")
		{
			colVal="#"+rowId+"_"+name;
			editable=true;
			editType="text";
		}
		output+="\""+name+"\":";
		if(editable)
			data=this.getCellData(colVal,editType,editRules,tableId);
		else
			data=colVal;
		
		
		output+="\""+data+"\"";
		
		i++;
	}
	return output;
};

/**
 * Sub function that inovkea validation function
 */
jgridUtil.getCellData =function (colVal,editType,editRules,tableId)
{
	var output='';
	output=$(colVal).val(); //colVal is not acutal element hence element is recaught using jquery on id
	var id=$(colVal).attr("id");
	if(id)
		htmlUtil.prompt.closeHtmlAlert($("#"+id));
	if(!this.validRow($("#"+id),editRules,output,tableId) && !this.INVALID_GRID_STCK.contains(tableId))
		this.INVALID_GRID_STCK.push(tableId);
	return output;
};

/**
 * Internal utility method used to highlight delete selected row.
 */
jgridUtil.highlightRow= function (rowId,flag)
{
	if(flag)
	{
		$("#"+rowId).addClass(this.HIGHLIGHT_COLOR);
	}
	else
	{
		$("#"+rowId).removeClass(this.HIGHLIGHT_COLOR);
	}
};


/**
 * Added to generate unique ID in case of adding new rows
 */
jgridUtil.getUniqueId= function (tableId)
{
	if(tableId.indexOf("~")!=-1)
	{	
		var err={message:"Error in getUniqueId msg:- table Id contains ~"};
		throw (err);
	}
	var id ="NEW"+tableId+this.GRID_MAX_ADD_ROW_ID;
	this.GRID_MAX_ADD_ROW_ID++;
	return id;
};

/**
 * Internal function used to show/hide buttons during table editing
 * Obejctive is to prevent naviation buttons as sorting or pagination during table edit.
 */
jgridUtil.showHideGridReloadOptions=function(type,tableId)
{
	if(type=='show')
	{
		$("#first_"+tableId+"_pager").show();
		$("#prev_"+tableId+"_pager").show();
		$("#next_"+tableId+"_pager").show();
		$("#last_"+tableId+"_pager").show();
		$(".ui-pg-selbox","#"+tableId+"_pager").show();
		$(".ui-pg-input","#"+tableId+"_pager").removeAttr("readonly");
		$(".ui-icon-refresh","#"+tableId+"_pager").show();
		$(".ui-icon-search","#"+tableId+"_pager").show();
	//	$("#"+tableId+"_searchDiv").show();
		
	}
	else
	{
		$("#first_"+tableId+"_pager").hide();
		$("#prev_"+tableId+"_pager").hide();
		$("#next_"+tableId+"_pager").hide();
		$("#last_"+tableId+"_pager").hide();
		$(".ui-pg-selbox","#"+tableId+"_pager").hide();
		$(".ui-pg-input","#"+tableId+"_pager").attr("readonly","readonly");
		$(".ui-icon-refresh","#"+tableId+"_pager").hide();
		$(".ui-icon-search","#"+tableId+"_pager").hide();
		$("#"+tableId+"_searchDiv").hide("slow");
	}
};


//************************************************************************************************************************************
//JGRID EVENT LISTENER FUNCTIONS///////////////////////////////////////////////////////////////////////////////////////////

//Added to peform grouping functionality -- need to add listener to this
jgridUtil.performGrouping=function (elm,tableId)
{
 var opt =$(elm).val();
 var table=$("#"+tableId)
 table.setGridParam({"rowNum":table.getGridParam("rowList")[0]});// max limit for group by
 if(opt)
 {
 
 	if(opt.trim().length==0)
 	{
 		table.setGridParam({"grouping":false});
	}
 	else
 	{
 		table.setGridParam({"sortname":opt});
 		table.setGridParam({"sortorder":"asc"});
 		table.setGridParam({"rowNum":500});// max limit for group by
 		table.setGridParam({"grouping":true});
 	 	table.setGridParam({"groupingView":{
 	   			    "groupField":[opt],
 					"groupOrder":['asc'],
 					"groupText":['<b>{0} - {1} Item(s)</b>']}});
 	}
 }
 else
 {
 	table.setGridParam({"grouping":false});
 }
	table.trigger("reloadGrid");
};


jgridUtil.onJgridSearch= function (tableID)
{
	 var dataObj= $("#"+tableID).getGridParam("postData");
	 if(!dataObj["_searchButtonFlag"])
	 {
		 dataObj["_searchButtonFlag"]=true;
	 }
	$("#"+tableID).setGridParam({"postData": dataObj})
	onJgridSearchOverrideFunction(tableID);
}


jgridUtil.onSelectRow = function (rowId,tableId)
{
	onJgridRowSelect(rowId,tableId);
};
/**
 * Called on LoadComplete
 */
jgridUtil.processObjectData= function(data,tableId)
{
	var objectJson =data.objectData;
	if(objectJson!=null && objectJson=="null")
		objectJson=null;
	postGridCallProcess(objectJson,tableId);
};
/**
 * Called on Error from Jgrid Ajax call
 */
jgridUtil.customizeErrorReturnData= function(xhr,st,err,tableId)
{
	 if(sessionControl)
		   sessionControl.resetSessionCount();// Method from sessionControl.js- note sessionControl.js should be before ajaxUtil.js for this to work
	   if(!ajaxUtil.ajaxCallSatck.remove(tableId))
		   alert("Error Ajax call not removed from stack");
	   htmlUtil.prompt.error({msg:"Error in AJAX Service err msg: "+err});
};
/**
 * Called on Sucess from Jgrid AJAX call
 */
jgridUtil.customizeSucessReturnData= function(data, st, xhr,tableId)
{
	if(!exceptionHandler.handle(data))// exception handler added to handle exceptions during ajax
	{
		this.updateLatestTableData({"id":tableId,"data":data.tableData});
		jgridUtil.removeSearchFlag(tableId);// removes specific request param used to identify when search is called.
		 if(sessionControl)
			   sessionControl.resetSessionCount();// Method from sessionControl.js- note sessionControl.js should be before ajaxUtil.js for this to work
		if(!ajaxUtil.ajaxCallSatck.remove(tableId))
			alert("Error Ajax call not removed from stack");
		if(this.checkIfReturnSuccess(data.objectData))//standard check as return json would contain error flag in objectdata array incase of 
			//any server side validations.
		{
			callOnJgridSucessLoad(data,tableId);
		}
	}
};

/**
 * Called from customizeSucessReturnData function.
 */

jgridUtil.checkIfReturnSuccess= function(objectData)
{
	if(objectData)
	{
		
		var obj=objectData[0];
		if(obj)
		{
			if(obj.name=="errorElement")
			{
				htmlUtil.prompt.error({msg:obj.message});
			}
		}
	}
}

/**
 * Called before sending request - if true reqeust is sent else not sent
 */
jgridUtil.customizedSendingReq= function(xhr,tableId)
{
	var output=false;
	if(ajaxUtil.ajaxCallSatck.contains(tableId))
	{
		htmlUtil.prompt.error({msg:"Your request is Processing.. Please wait"});
	}
	else
	{
		ajaxUtil.ajaxCallSatck.push(tableId);
//		output=beforeGridSelectCall(tableId);
		output=true;
//		alert(output);
	}
	return output;
};
///////////////////////////////////////////////////////////////////////////////////////////
//UTIL METHODS

jgridUtil.removeSearchFlag=function(tableID)
{
	 var dataObj= $("#"+tableID).getGridParam("postData");
	 if(dataObj["_searchButtonFlag"])
	 {
		 dataObj["_searchButtonFlag"]=null;
	 }
	$("#"+tableID).setGridParam({"postData": dataObj})

};

jgridUtil.updateLatestTableData= function(obj)
{
	for(var i in this.GRID_DATA_STCK)
	{
		if(this.GRID_DATA_STCK[i].id==obj.id)
			this.GRID_DATA_STCK.splice(i,1);
	}
	this.GRID_DATA_STCK.push(obj);
};

jgridUtil.setCaption= function(caption,bodyDivId)
{
	var elm=$("span.ui-jqgrid-title","#"+bodyDivId);
	if(elm.exists())
		elm.html(caption);
	else
		alert("caption div does not exist for table in div -"+bodyDivId);	
};


jgridUtil.setColNames= function (cols,tableId)
{
	for(var name in cols)
	{
		var elm=$("#grid_header_"+tableId+"_"+name,"th");
		if(elm.exists())
			elm.html(cols[name]);
		else
			alert("colName - "+name+" does not exist for table -"+tableId);
	}
};

//************************************************************************************************************************************
///////////////////////////////////////JGRID TABLE CONSTRUCT UTILS///////////////////////////////////////////////////////////


/**
 * Method to construct jgridTable
 */
jgridUtil.constructGrid= function(tableObj)
{

	//INITIALIZE TABLE
	this.intializeTable(tableObj);
	//INITIALIZE BUTTONS
	$(".HeaderButton").hide();//adds caption button to avoid jgrid bug in scrollbars geneartoin after slideUp
	this.intializeTableButtons(tableObj);
	
}

jgridUtil.intializeTable=function (tableObj)
{

	// Added to support group by opt on caption
	var gByOpts=tableObj.groupByOptions;
	if(gByOpts)
	{
		var opts ="	Group By: &nbsp; ";
		opts +="<select id='"+tableObj.tableId+"_groupingOptions' name='"+tableObj.tableId+"_groupingOptions'  class='selClass' onchange='jgridUtil.performGrouping(this,\""+tableObj.tableId+"\")'>"+
		"<option value=''>-- Select --</option>";
		for(var i=0;i<gByOpts.length;i++)
		{
			var opt=gByOpts[i];
			opts+="<option value='"+opt.id+"'>"+opt.label+"</option>";
		}
		opts+="</select>";
		tableObj.caption+=opts;
	}
	
	var gridObj= {
			url: tableObj.url,
			height: (tableObj.bodyDivId)?$("#"+tableObj.bodyDivId).height():150,
			width:(tableObj.bodyDivId)?$("#"+tableObj.bodyDivId).width():150,	
			page: 1,
			rowNum: (tableObj.rowNum)?tableObj.rowNum:10,
			rowTotal : null,
			records: 0,
			pager: tableObj.tableId+"_pager",
			pgbuttons: true,
			pginput: true,
			colModel: this.customizeTableAttr(tableObj.colModel,tableObj.tableType,"colModel"),
			rowList: (tableObj.rowList)?tableObj.rowList:[10,20,30],
			colNames: this.customizeTableAttr(tableObj.colNames,tableObj.tableType,"colName"),
			sortorder: (tableObj.sortorder)?tableObj.sortorder:"asc",
			sortname:(tableObj.sortname)?tableObj.sortname: "",
			datatype: (tableObj.datatype)?tableObj.datatype: "JSON", 
			mtype: (tableObj.mtype)?tableObj.mtype:"POST",
			selarrrow: [],
			savedRow: [],
			subGrid: false,
			subGridModel :[],
			reccount: 0,
			lastpage: 0,
			lastsort: 0,
			selrow: null,
			loadError:function(xhr,st,err){jgridUtil.customizeErrorReturnData(xhr,st,err,tableObj.tableId);},
			beforeProcessing:function(data, st, xhr){jgridUtil.customizeSucessReturnData(data, st, xhr,tableObj.tableId);},
			loadBeforeSend:function(xhr){jgridUtil.customizedSendingReq(xhr,tableObj.tableId);},
			loadComplete:function(data){jgridUtil.processObjectData(data,tableObj.tableId);},
			onSelectRow:function(id){jgridUtil.onSelectRow(id,tableObj.tableId);},
			beforeSelectRow: null,
			onSortCol: null,
			ondblClickRow: null,
			onRightClickRow: null,
			onPaging: null,
			onSelectAll: null,
			gridComplete: null,
			beforeRequest: null,
			onHeaderClick: null,
			viewrecords: true,
			loadonce: false,
			multiselect: false,
			multikey: false,
			editurl: null,
			search: false,
			caption: (tableObj.caption)?tableObj.caption:"",
			hidegrid: true,
			hiddengrid: false,
			postData: this.formatPostData(tableObj.postData),
			userData: {},
			treeGrid : false,
			treeGridModel : 'nested',
			treeReader : {},
			treeANode : -1,
			ExpandColumn: null,
			tree_root_level : 0,
			prmNames: {page:"page",rows:"rows", sort: "sidx",order: "sord", search:"_search", nd:"nd", id:"id",oper:"oper",editoper:"edit",addoper:"add",deloper:"del", subgridid:"id", npage: null, totalrows:"totalrows"},
			forceFit : false,
			gridstate : "visible",
			cellEdit: false,
			cellsubmit: "remote",
			nv:0,
			toolbar: [false,""],
			scroll: false,
			multiboxonly : false,
			deselectAfterSort : true,
			scrollrows : false,
			autowidth: false,
			scrollOffset :18,
			cellLayout: 5,
			subGridWidth: 20,
			multiselectWidth: 20,
			gridview: false,
			rownumWidth: 25,
			rownumbers : false,
			pagerpos: 'center',
			recordpos: 'right',
			footerrow : false,
			userDataOnFooter : false,
			hoverrows : true,
			altclass : 'ui-priority-secondary',
			viewsortcols : [false,'vertical',true],
			resizeclass : '',
			autoencode : false,
			remapColumns : [],
			ajaxGridOptions :{},
			direction : "ltr",
			toppager: false,
			headertitles: false,
			scrollTimeout: 40,
			data : [],
			_index : {},
			grouping : (tableObj.grouping)?tableObj.grouping:false,
			groupingView : {
				groupField:[],
				groupOrder:[],
				groupText:[],
				groupColumnShow:[],
				groupSummary:[],
				showSummaryOnHide: false,
				sortitems:[],
				sortnames:[],
				groupDataSorted : false,
				summary:[],
				summaryval:[],
				plusicon: 'ui-icon-circlesmall-plus',
				minusicon: 'ui-icon-circlesmall-minus'},
			ignoreCase : false,
			cmTemplate : {},
			idPrefix : ""
		};
		
		
		
		var customGrouping=tableObj.groupingView;
		if(customGrouping)
		{
			gridObj.groupingView.groupField=(customGrouping.groupField)?customGrouping.groupField:[];
			gridObj.groupingView.groupOrder=(customGrouping.groupOrder)?customGrouping.groupOrder:[];
			gridObj.groupingView.groupText=(customGrouping.groupText)?customGrouping.groupText:[];
			gridObj.groupingView.groupColumnShow=(customGrouping.groupColumnShow)?customGrouping.groupColumnShow:[];
			gridObj.groupingView.groupSummary=(customGrouping.groupSummary)?customGrouping.groupSummary:[];
			gridObj.groupingView.showSummaryOnHide=(customGrouping.showSummaryOnHide)?customGrouping.showSummaryOnHide:false;
			gridObj.groupingView.sortitems=(customGrouping.sortitems)?customGrouping.sortitems:[];
			gridObj.groupingView.sortnames=(customGrouping.sortnames)?customGrouping.sortnames:[];
			gridObj.groupingView.groupDataSorted =(customGrouping.groupDataSorted)?customGrouping.groupDataSorted: false;
			gridObj.groupingView.summary=(customGrouping.summary)?customGrouping.summary:[];
			gridObj.groupingView.summaryval=(customGrouping.summaryval)?customGrouping.summaryval:[];
			gridObj.groupingView.plusicon=(customGrouping.plusicon)?customGrouping.plusicon:'ui-icon-circlesmall-plus';
			gridObj.groupingView.minusicon=(customGrouping.minusicon)?customGrouping.minusicon:'ui-icon-circlesmall-minus';
		}
	
		var modifiedColModel=overrideColModel(tableObj.tableId,gridObj.colModel);//to override locally
		
		gridObj.colModel=(modifiedColModel)?modifiedColModel:gridObj.colModel;
		$("#"+tableObj.tableId).jqGrid(gridObj);
}

/**
 * Added to send ajax Called flag to server for all jqgrid ajax calls
 */
jgridUtil.formatPostData=function(postData)
{
	if(postData)
	{
		postData["ajaxCallFlag"]="true";
	}
	else
		postData={"ajaxCallFlag":"true"}
	
	return postData;
};
/**
 * Used for adding formater colums with buttons for inline editing/picklist etc 
 */
jgridUtil.customizeTableAttr= function(inputArray,tableType,flag)
{
	var output=null;
	if(tableType=="readOnly")
	{
		// do nothing
	}
	else if(tableType=="inlineEdit")
	{
		//add edit and delete columns
		var editCol="Edit";
		var delCol="Delete";
		if(flag=="colModel")
		{
			editCol={name:"editAction",width:50, index:"editAction",  fixed:true, sortable:false, resize:false, formatter:"editAction",
					search:false } ;
			delCol={name:"deleteAction",width:50, index:"deleteAction",  fixed:true, sortable:false, resize:false, formatter:"delAction",
					search:false};
		}
		output=new Array();
		output[0]=editCol;
		for(var i=0; i<inputArray.length;i++)
		{
			output[i+1]=inputArray[i];
		}
		output[output.length]=delCol;
		
	}else if(tableType=="pickList")
	{
		//add Add column
		var addCol="Add";
		if(flag=="colModel")
		{
			addCol={name:"addAction",width:50, index:"addAction",  fixed:true, sortable:false, resize:false, formatter:"pickAndAddAction",
					search:false } ;
		}
		output=new Array();
		output[0]=addCol;
		for(var i=0; i<inputArray.length;i++)
		{
			output[i+1]=inputArray[i];
		}
		
	}else if(tableType=="custom")
	{
		//to link to outside js file
	}else 
	{
		err={message:" Error in customizeTableAttr method err msg: invalid tableType"};
		throw (err);
	}
	
	if(output)
		return output;
	else
		return inputArray;
};

/**
 * Used to construct buttons
 */
jgridUtil.activateButton=function(buttonName,tableId,searchDivWidth)
{
	if(buttonName=="refresh")
	{
		$("#"+tableId).navGrid("#"+tableId+"_pager",{search:false, edit: false, add:false, del: false,
			refresh: true});
	}else if(buttonName=="search")
	{
		$("#"+tableId).navButtonAdd('#'+tableId+'_pager',
				{caption: "", title: "Search", buttonicon: "ui-icon-search",
			onClickButton: function () 
			{ 
				$("#"+tableId+"_searchDiv").toggle("slow");
			},
			position:"first"
				});
		//BELOW Code intalizes and show search div
		$("#"+tableId).searchGrid( {layer:""+tableId+"_searchDiv",width:searchDivWidth,
			multipleSearch:true,multipleGroup:true, closeOnEscape:true,drag:false,resize:false,Find:"Search",showQuery:false,
			modal:false,jqModal:false,recreateFilter:true, onSearch:function (){jgridUtil.onJgridSearch(tableId);}} );
		$("#"+tableId+"_searchDiv").insertBefore($("#"+tableId+"_pager"));
		$("#"+tableId+"_searchDiv").toggle("slow");
		//BELOW code is used to provide search on enter and reset on escape
		$("#"+tableId+"_searchDiv").keydown(function (e){
			if(e.keyCode == 13){
				$("#fbox_"+tableId+"_search").click();
				}
			else if (e.keyCode==27) {
				$("#fbox_"+tableId+"_reset").click();
				}
			}) ;
		
	}else if(buttonName=="add")
	{
		$("#"+tableId).navButtonAdd('#'+tableId+'_pager',
				{caption: "", title: "Add new row", buttonicon: "ui-icon-plus",
			onClickButton: function () 
			{ 
			jgridUtil.customizedadd(tableId);
			},
			position:"last"
				})
	}else if(buttonName=="save")
	{
		$("#"+tableId).navButtonAdd('#'+tableId+'_pager',
				{caption: "", title: "Save", buttonicon: "ui-icon-disk",
			onClickButton: function () 
			{ 
			jgridUtil.customizedSave($("#"+tableId).getGridParam("url"),tableId);
			},
			position:"last"
				});
	}else if(buttonName=="restore")
	{
		$("#"+tableId).navButtonAdd('#'+tableId+'_pager',
					{caption: "", title: "Cancel", buttonicon: "ui-icon-cancel",
				onClickButton: function () 
				{ 
				jgridUtil.customizedRestoreAll(tableId);
				},
				position:"last"
					});
	}
}

/**
 * Calls activate buttons to consturct required buttons based on table Type
 */
jgridUtil.intializeTableButtons=function(tableObj)
{
	var tableType=tableObj.tableType;
	var tableId=tableObj.tableId;
	var searchDivWidth=$("#"+tableObj.bodyDivId).width();
	var buttons = tableObj.buttons;
	if(buttons) //override option
	{
		for(var i=0;i<buttons.length;i++)
		{
			this.activateButton(buttons[i], tableId, searchDivWidth);
		}
	}
	else
	{
		if(tableType=="readOnly")
		{

			this.activateButton("refresh",tableId);
			this.activateButton("search",tableId,searchDivWidth);
		}
		else if(tableType=="inlineEdit")
		{
			//Refresh, search, add, save, cancel
			this.activateButton("refresh",tableId);
			this.activateButton("search",tableId,searchDivWidth);
			this.activateButton("add",tableId);
			this.activateButton("save",tableId);
			this.activateButton("restore",tableId);

		}else if(tableType=="pickList")
		{
			//refersh and custom simple search
			this.activateButton("refresh",tableId);
			this.activateButton("search",tableId,searchDivWidth);
			
		}else if(tableType=="custom")
		{
			//to be based on custom buttons enteed in table array
		}else 
		{
			err={message:" Error in customizeTableAttr method err msg: invalid tableType"};
			throw (err);
		}
	}
	
	
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////SIMPLE SEARCH DIV CONSTRUCTION UTILS///////////////////////////////////////////////////////////


jgridUtil.constructSimpleSearchDiv=function(bodyDivId,tableId)
{
	var colModels=$("#"+tableId).getGridParam("colModel");
	var colNames=$("#"+tableId).getGridParam("colNames");

	//filter out searchable fields
	for(var i=0; i<colModels.length;i++)
	{
		if(colModels[i].search===false)
		{
			colModels.splice(i,1);
			colNames.splice(i,1);
		}
	}
	
	if(colModels.length>0)
	{
		var searchDiv= $("<div id='"+tableId+"_simpleSearchDiv' ></div>");
		var head_row= "<tr><td colspan=5 class='input-title-header'>Search...</td></tr>";
		var button_row="<tr><th class='input-field-name-center' colspan=3 align='right >"+
					"<input id='searchButton' name='searchButton' type='button' class=' buttonDefault ' value='Search' onclick='searchLDAP()' /> &nbsp;&nbsp;&nbsp;"+
					"<input id='clearButton' name='clearButton' type='button' class='buttonDefault' value='Clear' onclick='clearLDAP()' />"+
					"</th></tr>" ;
	}
	
	var body_row="";
	for(var i=0; i<colModels.length;i+3)
	{
		body_row+="<tr>";
		body_row+="<th class='input-field-name-center' width='33.3%'>"+colNames[i]+"&nbsp;"+this.getOperationDropDown(colModels[i])+
		"&nbsp;"+this.getInputType(colModels[i])+" </th>";
		if(i+1<colModels.length)
		{	
			body_row+="<th class='input-field-name-center' width='33.3%'>"+colNames[i]+"&nbsp;"+this.getOperationDropDown(colModels[i])+
			"&nbsp;"+this.getInputType(colModels[i])+" </th>";
			if(i+2<colModels.length)
			{
				body_row+="<th class='input-field-name-center' width='33.3%'>"+colNames[i]+"&nbsp;"+this.getOperationDropDown(colModels[i])+
				"&nbsp;"+this.getInputType(colModels[i])+" </th>";
			}
			else
			{
				body_row+="<th class='input-field-name-center' width='33.3%'>&nbsp;</th>";
			}
		}else
		{
			body_row+="<th class='input-field-name-center' width='33.3%'>&nbsp;</th>";
			body_row+="<th class='input-field-name-center' width='33.3%'>&nbsp;</th>";
		}
		body_row+="</tr>";
	}
	
	var table = "<table width='100%'>"+head_row+body_row+button_row+"</table>";
	alert(table);
	$(searchDiv).html(table);
	$(searchDiv).insertBefore($("#"+bodyDivId));
}

jgridUtil.getInputType=function(colModel)
{
	var type= colModel.stype;
	if(!type)
		type="text";
	var index = colModel.index;
	var inputHTML="";
	if(type=="text")
	{
		inputHTML="<INPUT TYPE='text' name='"+index+"_value' id='"+index+"_value' SIZE='20'	CLASS='inputData' value='' />";
		/*if((colModel.searchoptions)?colModel.searchoptions.attr?colModel.searchoptions.attr.title?true:false:false:false)
		{
			if(colModel.searchoptions.attr.title=="Select Date")
				$(inputHTML).datepicker({dateFormat: 'yy-mm-dd'});// change to populate a stack
		}*/
	}
	else if (type=="select")
	{
		var opList=colModel.searchoptions.value;
		if(opList)
		{
			var optHTML=""
			for(var key in opList)
			{
				optHTML+="<option value='"+key+"'>"+opList[key]+"</option>";
			}
			inputHTML = "<select id='"+colModel.index+"_value' class='options'>"+optHTML+"</select>";
		}
	}	
	return inputHTML;
	
	
};

jgridUtil.getOperationDropDown= function(colModel)
{
	var opList ={  "eq": "equal",
				"ne":"not equal",
				"lt":"less",
				"le":"less or equal",
				"gt":"greater",
				"ge":"greater or equal",
				"bw":"begins with",
				"bn":"does not begin with",
				"in":"in",
				"ni":"not in",
				"ew":"ends with",
				"en":"does not end with",
				"cn":"contains",
				"nc":"does not contain",
				"nu":"is null",
				"nn":"is not null"
			 };
	
	var options=["eq","ne"];
	var modelOpt= colModel.searchoptions.sopt;
	if(modelOpt)
	{
		if(modelOpt.length!=0)
			options=modelOpt;
	}
	var optHTML=""
	for(var key in opList)
	{
		if(options.contains(key+""))
		{
			optHTML+="<option value='"+key+"'>"+opList[key]+"</option>";
		}
	}
	var groupOpSelect = "<select id='"+colModel.index+"_opt' class='options'>"+optHTML+"</select>";
		
	return groupOpSelect; 
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////
function tableStackJSONDebugHelper()
{
	if(jgridUtil.TABLE_STACK.length!=0)
	{
	var obj = jgridUtil.TABLE_STACK[0];
	alert(obj.id);
	alert(obj.ADD_STACK);
	alert(obj.EDIT_STACK);
	alert(obj.DEL_STACK);
	}
/*	var buffer =$('#'+tableId+'_pager_left').html();  
	$('#'+tableId+'_pager_left').html($('#'+tableId+'_pager_right').html());
	$('#'+tableId+'_pager_right').html(buffer);*/
}



/*
 
 jgridUtil.checkForChanges=function(tableId)
{
	
	if(this.CHANGES_CHECK_FLAG && this.containsTableJSON(tableId))
	{
		this.CHANGES_CHECK_FLAG=false;
		htmlUtil.prompt.warn(msg:{"Note: Unsaved changes will be lost during table reload."});
		return false;
	}
	else
	{
		//Rest check
		this.CHANGES_CHECK_FLAG=true;
		//flush table Stack
		this.TABLE_STACK.removeTable(tableId);
		return true;
	}
};




jgridUtil.EDIT_STACK=new Array();
jgridUtil.DEL_STACK=new Array();
jgridUtil.ADD_STACK= new Array();
jgridUtil.populateStack = function(type,tableId,rowId)
{
	if(tableId.indexOf("#")!=-1 || rowId.indexOf("#")!=-1)
	{
		var err={message:"Error in populateStack msg:- table Id or rowId contains #"};
		throw (err);
	}
	if(type=="EDIT")
		this.EDIT_STACK.push(tableId+"#"+rowId);
	else if(type=="DEL")
		this.DEL_STACK.push(tableId+"#"+rowId);
	else if(type=="ADD")
		this.ADD_STACK.push(tableId+"#"+rowId);
};

jgridUtil.removeFromStack = function(type,tableId,rowId)
{
	if(tableId.indexOf("#")!=-1 || rowId.indexOf("#")!=-1)
	{
		var err={message:"Error in removeFromStack msg:- table Id or rowId contains #"};
		throw (err);
	}
	if(type=="EDIT")
		return this.EDIT_STACK.remove(tableId+"#"+rowId);
	else if(type=="DEL")
		return this.DEL_STACK.remove(tableId+"#"+rowId);
	else if(type=="ADD")
		return this.ADD_STACK.remove(tableId+"#"+rowId);
	else
		return false;
};
*/