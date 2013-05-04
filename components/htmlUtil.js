
/*
 * Required JS libs
 * prototype.js
 * jquery.js 
 * jquery.colorbox.js // for modalUtil functions
 * sessionControl.js // for session expiration
 */
var htmlUtil={};

htmlUtil.tableUtil={};// set of table Utility functions

//**********************************************TABLE UTILS*********************************************************************'

/**
 * Added for performance, This stack stores the computed table structure in case of table call and prevent call to recomputation when 
 * same tableId in the same page is refreshed using AJAX.
 */
htmlUtil.tableUtil.tableStructStack=new Array();

/**
 * Added for performance,
 * This method returns tableStruct if its already stored in the tableStructStack. Else it returns null.
 * @param table (tableObject)
 * @return tableStructureObject
 */
htmlUtil.tableUtil.getTableStructIfPresent= function (table)
{
	try{
		if(table.length)//jquery retruns array with table object wraped .. where as documenGetElementById returns just the object
			table = table[0];

		var stack=this.tableStructStack;

		if(stack.length==0)
			return null;
		else
		{

			for(var i in stack)
			{
				if(stack[i].tableProperty.id.trim()==table.id.trim()) // condition for check is based on table ID in struct and in input
				{
					return stack[i];
				}
			}
			return null;
		}
	}catch(err)
	{
		alert("Error in Copy Table Structure function in js - Error in getTableStructIfPresent msg:- "+err.message);
		return null;
	}

};

//TABLE STRUCT COPY FUNCTIONS///////////////////////////////////////////
/**
 * @Desc
 * The below function copyTableStructure copies table structure and properties and return an tableStructure JSON object
 * This object would be used to reconstruct output form AJAX service call to reproduce to this table format.
 * TableStructure Obejct stores only tabel, tr and td related property information.
 * Code assumes simple table structure such as <table> <tr> <td>...</td>....</tr>...</table>
 * thead,tbody and ttail are not considered in this function
 * header present flag should be true is first row is header and content starts from second row
 * @params tableId - id value of table element
 * @params headerPresentFlag - boolean true if header is present
 */


htmlUtil.tableUtil.copyTableStructure= function (table,headerPresentFlag)
{
	var tableStructure=null;

	var tableProperty =null;
	var headerRowProperty=null;
	var headerColumnPropertyList=null;
	var rowProperty=null;
	var columnPropertyList=null;

	tableStructure=this.getTableStructIfPresent(table);
	if(tableStructure)// if present
		return tableStructure;
	try
	{
		//jquery retruns array with table object wrapped .. where as documenGetElementById returns just the object
		// hence the below check ensure that we wrap single objet to array so that the code below will always work.
		if(table.length)
			table = table[0];

		//Intiatlize table properties
		tableProperty=this.getTableProperty(table);

		var row=table.rows[0];
		var headerRow=null;
		if(headerPresentFlag && table.rows.length>1)
		{
			headerRow=table.rows[0];
			row=table.rows[1];
		}

		if(headerRow)
		{
			//Intialize header row property
			headerRowProperty=this.getRowProperty(headerRow);
			//intialiez header columns
			headerColumnPropertyList=this.getColumnPropeties(headerRow);
		}
		//intialize first row property
		rowProperty=this.getRowProperty(row);
		//intlaize first columns props
		columnPropertyList=this.getColumnPropeties(row);


		//Intialize table structure
		tableStructure={
				"tableProperty":tableProperty,
				"headerRowProperty":headerRowProperty,
				"headerColumnPropertyList":headerColumnPropertyList,
				"rowProperty":rowProperty,
				"columnPropertyList":columnPropertyList					
		};

		return tableStructure;

	}catch (err)
	{
		alert("Error in Copy Table Structure function in js "+err.message);
		return null;
	}
};

/**
 * The getTableProperty method is called from copyTableStructure. This method returns a tableProperty object which contains
 * all table tag attributes.
 * @param table element
 * @return tablePropery
 */
htmlUtil.tableUtil.getTableProperty=function (table)
{
	try{
		var tableProperty={
				"id":table.id,
				"name":table.name,
				"align":table.align,
				"background":table.background,
				"bgColor":table.bgColor,
				"border":table.border,
				//"caption":table.caption,
				"cellPadding":table.cellPadding,
				"cellSpacing":table.cellSpacing,
				"frame":table.frame,
				"height":table.height,
				"rules":table.rules,
				"summary":table.summary,
				//"tFoot":table.tFoot,
				//"tHead":table.tHead,
				"width":table.width,
				"style":table.style,
				"className":table.className
		};
		return tableProperty;
	}catch(err){
		err={message:"Error in getTableProperty msg:- "+err.message};
		throw (err);
	}
};

/**
 * The getRowProperty method is called from copyTableStructure. This method returns a rowProperty object which contains
 * all row tag attributes.
 * @param tr (row) element
 * @return rowProperty
 */
htmlUtil.tableUtil.getRowProperty=function (row)
{
	try{
		var rowProperty={
				"id":row.id,
				"name": row.name,
				"align":row.align,
				"bgColor":row.bgColor,
				"ch":row.ch,
				"chOff":row.chOff,
				"height":row.height,
				"rowIndex":row.rowIndex,
				"sectionRowIndex":row.sectionRowIndex,
				"vAlign":row.vAlign,
				"style":row.style,
				"className":row.className,
				"width":row.width,
				"height":row.height
		};
		return rowProperty;
	}catch(err){
		err={message:"Error in getRowProperty msg:- "+err.message};
		throw (err);
	}
};

/**
 * The getColumnPropeties method is used to iterate columns in row element of table and return array of column elements with their properties.
 * This is called from copyTableStructure. 
 * 
 * @param tr (row) element
 * @return columnPropertyList - array of columnPropery for input row
 */
htmlUtil.tableUtil.getColumnPropeties=function (row)
{
	try{
		var columnPropertyList= new Array();
		var cellList = row.cells;
		for(var i=0; i<cellList.length; i++)
		{
			var cell=cellList[i];
			var columnPropery = { "className": cell.className,
					"style": cell.style,
					"id":cell.id,
					"name": cell.name,
					"colSpan":cell.colSpan,
					"height": cell.height,
					"width":cell.width,
					"align": cell.align,
					"rowSpan":cell.rowSpan,
					"vAlign":cell.valign,
					"background":cell.background,
					"bgColor":cell.bgColor
			};
			columnPropertyList.push(columnPropery);
		}

		if(columnPropertyList.length==0)
			return null;
		else
			return columnPropertyList;
	}catch(err){
		err={message:"Error in getColumnPropeties msg:- "+err.message};
		throw (err);
	}
};


//TABLE RECONSTRUCTION UTIL FUNCTIONS////////////////////////////////
/**
 *
 *constructTable function is used to construct table object from tableStruct and tableData.
 *Its assumed that the tableData structure conforms to the row column structure of the table. 
 *
 *@param tableStruct should contain table structure and style information
 *@param tableData is a 2D array collection of rows and columns obtained from AJAX response. 
 *@return table-HTML (String)
 */

htmlUtil.tableUtil.constructTable =function (tableStruct,tableData)
{
	try
	{
		var wraperObj=document.createElement('div');
		var table=document.createElement('table');
		table=this.intializeTableProperties(table,tableStruct.tableProperty);

		if(tableData==null)
		{
			$(table).html("<div width='100%'  style='VERTICAL-ALIGN: MIDDLE; TEXT-ALIGN: CENTER; FONT-SIZE: 16px; '>" +
					"No Data Available" +
			"</div>");
		}
		else
		{
			var rowCount = tableData.length;

			for(var i=0;i<rowCount; i++)
			{
				var row = table.insertRow(i);

				if(i==0 && tableStruct.headerRowProperty!=null)//header row is present
				{			
					row=this.intializeRowProperties(row,tableStruct.headerRowProperty);
					this.createDataColumns(row,tableStruct.headerColumnPropertyList,tableData[i]);
				}
				else 
				{
					row=this.intializeRowProperties(row,tableStruct.rowProperty);
					this.createDataColumns(row,tableStruct.columnPropertyList,tableData[i]);

				}
			}
		}

		$(wraperObj).html(table); //set table in wraper object	
		return ($(wraperObj).html());//table
	}
	catch(err)
	{
		alert("Error in ConstructTable method of htmlUtil.tableUtil.js msg= "+err.message);
	}
};

/**
 * createDataColumns is called from constructTable, The method is used to populate each row based on column property List for that row
 * and dataList for that row.
 * @param rowElm - tr (row) element of the table being generated
 * @param columnPropList - array of ColumnPropery JSON objects for rowElm
 * @param cellDataList - array of data for rowElm.
 * @return void
 *
 */
htmlUtil.tableUtil.createDataColumns =function (rowElm,columnPropList,cellDataList)
{

	try
	{

		if(columnPropList.length!=cellDataList.length)
		{
			err={message:"Error in createDataColumns msg:- Datalist and PropList vary in length"};
			throw (err);
		}
		for(var i=0; i<columnPropList.length; i++)
		{
			var cellElm=rowElm.insertCell(i);
			cellElm= this.intializeColumnProperties(cellElm,columnPropList[i]);
			$(cellElm).html(cellDataList[i]);
		}
	}
	catch(err)
	{
		err={message:"Error in createDataColumns msg:- "+err.message};
		throw (err);
	}
};

/**
 * intializeTableProperties is called from constructTable, 
 * The method is used to populate properties of tableElm form tableProperty Object
 * @param tableElm <table> -element of the table being generated
 * @param propObj - tablePropertyObject of tableStructure
 * @return tableElm <table>- element of table after population.
 *
 */
htmlUtil.tableUtil.intializeTableProperties= function (tableElm, propObj)
{
	try
	{

		tableElm.setAttribute("id",((propObj.id) ? propObj.id : "") );
		tableElm.setAttribute("name",((propObj.name) ? propObj.name : "") );
		tableElm.setAttribute("align",((propObj.align) ? propObj.align : "") );
		tableElm.setAttribute("background", ((propObj.background) ? propObj.background : "") );
		tableElm.setAttribute("bgColor", ((propObj.bgColor) ? propObj.bgColor : "") );
		tableElm.setAttribute("border",((propObj.border) ? propObj.border : "") );
		//	tableElm.setAttribute("caption",propObj.caption);
		tableElm.setAttribute("cellPadding",((propObj.cellPadding) ? propObj.cellPadding : "") );
		tableElm.setAttribute("cellSpacing",((propObj.cellSpacing) ? propObj.cellSpacing : "") );
		tableElm.setAttribute("frame",((propObj.frame) ? propObj.frame : "") );
		tableElm.setAttribute("height",((propObj.height) ? propObj.height : "") );
		tableElm.setAttribute("rules",((propObj.rules) ? propObj.rules : "") );
		tableElm.setAttribute("summary",((propObj.summary) ? propObj.summary : "") );
		//	tableElm.setAttribute("tFoot",propObj.tFoot);
		//	tableElm.setAttribute("tHead",propObj.tHead);
		tableElm.setAttribute("width",((propObj.width) ? propObj.width : "") );
		tableElm.setAttribute("style",((propObj.style) ? propObj.style : "") );
		tableElm.setAttribute("className",((propObj.className) ? propObj.className : "") );
	}
	catch(err)
	{
		err={message:"Error in intializeTableProperties msg:- "+err.message};
		throw (err);
	}
	return tableElm;

};


/**
 * intializeRowProperties is called from constructTable, 
 * The method is used to populate properties of row <tr> elements form rowproperty Objects in tableStructure
 * @param rowElm <tr> -element of the row being generated
 * @param propObj - rowPropertyObject of tableStructure
 * @return rowElm <tr>- element of row after population.
 *
 */
htmlUtil.tableUtil.intializeRowProperties =function (rowElm, propObj)
{
	try
	{
		rowElm.setAttribute("id",((propObj.id) ? propObj.id : "") );
		rowElm.setAttribute("name",((propObj.name) ? propObj.name : "") );
		rowElm.setAttribute("align",((propObj.align) ? propObj.align : "") );
		rowElm.setAttribute("bgColor",((propObj.bgColor) ? propObj.bgColor : "") );
		rowElm.setAttribute("ch",((propObj.ch) ? propObj.ch : "") );
		rowElm.setAttribute("chOff",((propObj.chOff) ? propObj.chOff : "") );
		rowElm.setAttribute("height",((propObj.height) ? propObj.height : "") );
		rowElm.setAttribute("propObjIndex",((propObj.propObjIndex) ? propObj.propObjIndex : "") );
		rowElm.setAttribute("sectionpropObjIndex", ((propObj.sectionpropObjIndex) ? propObj.sectionpropObjIndex : "") );
		rowElm.setAttribute("vAlign",((propObj.vAlign) ? propObj.vAlign : "") );
		rowElm.setAttribute("style", ((propObj.style) ? propObj.style : "") );
		rowElm.setAttribute("className",((propObj.className) ? propObj.className : "") );
		rowElm.setAttribute("width",((propObj.width) ? propObj.width : "") );
		rowElm.setAttribute("height",((propObj.height) ? propObj.height : "") );
	}
	catch(err)
	{
		err={message:"Error in intializeRowProperties msg:- "+err.message};
		throw (err);
	}
	return rowElm;
};

/**
 * intializeColumnProperties is called from createDataColumns, 
 * The method is used to populate properties of columns <td> elements form columnProperty Objects in columnPropertyList of tableStructure
 * @param colElm <td> -element of the column being generated
 * @param propObj - columnPropertyObject of columnPropertyList of tableStructure
 * @return colElm <td>- element of column after population.
 *
 */
htmlUtil.tableUtil.intializeColumnProperties= function (colElm, propObj)
{

	try
	{


		colElm.setAttribute("className", ((propObj.className) ? propObj.className : ""));
		colElm.setAttribute("style",((propObj.className) ? propObj.classtylesName : ""));
		colElm.setAttribute("id",((propObj.className) ? propObj.id : ""));
		colElm.setAttribute("name", ((propObj.className) ? propObj.name : ""));
		colElm.setAttribute("colSpan",((propObj.className) ? propObj.colSpan : ""));
		colElm.setAttribute("height", ((propObj.className) ? propObj.height : "") );
		colElm.setAttribute("width",((propObj.className) ? propObj.width : ""));
		colElm.setAttribute("align", ((propObj.className) ? propObj.align : ""));
		colElm.setAttribute("rowSpan",((propObj.className) ? propObj.rowSpan : ""));
		colElm.setAttribute("vAlign",((propObj.className) ? propObj.valign : ""));
		colElm.setAttribute("background",((propObj.className) ? propObj.background : ""));
		colElm.setAttribute("bgColor",((propObj.className) ? propObj.bgColor : ""));
	}
	catch(err)
	{
		err={message:"Error in intializeColumnProperties msg:- "+err.message};
		throw (err);
	}
	return colElm;
};
//TABLE MANIPULATION FUNCTIONS//////////////////////////////////////////////////////////
/**
 *The manipulateData function is used to format the tableData array obtained  from the JSON object returned during AJAX call.
 *This is done by passing a local js function as parameter to this method. The local js function would be defined in the respective js file.
 *This is used in case where anchor tag <a href> is added to make one column a hyperlink or dropdown etc.. such format of raw data
 *obtained from server should be put in a function in local js file.
 *
 *This function is often used after AJAX call and before table reconstruction call.
 *
 *@param tableData Array<Array<String>> note.. for dropdown String would be opt1~opt2~ (this needs to be formating function defined in your page)
 *@param manipulatingFunctions= Array<Functtion> if headerFlag=true size of this array =2 i.e. 1st entry to header formating function
 *                      and 2nd for data formatingfunctions.
 *                   	note: formatingfunctions are user defined local to page they are designing.
 *                   	They will have 2 params (rowIndex and array of columnData for that row)
 *@headerFlag boolean - true if tableData has header(assumed as the first index) else false. 
 *@returns - modified/Formated tableData
 */

htmlUtil.tableUtil.manipulateData= function (tableData,manipulatingFunctions,headerFlag)
{
	try{
		if(tableData==null &&manipulatingFunctions!=null)
		{
			return tableData;// No manipulation when server returns no records
		}
		else if(tableData!=null && manipulatingFunctions ==null)
		{
			var err={message:" Input manipulatingFunctions argument is null"};
			throw (err);
		}

		if(headerFlag && manipulatingFunctions.length!=2)
		{
			var err={message:" Input argument manipulatingFunctions does not defind either header or column values"};
			throw (err);
		}

		var rowCount = tableData.length;

		for(var i=0,j=0;i<rowCount; i++)
		{
			tableData[i]=this.formatData(i,tableData[i],manipulatingFunctions[j]);
			if(headerFlag && i==0)
				j++;
		}

		return tableData;

	}catch (err)
	{
		alert("Error in manipulateData before Table Construction in AJAX response err msg- "+err.message);
	}

};

/**
 * formatData method is called from manipulateData method in iteration for each row for the tableData.
 * This method is used to call the respective formatingFunction (locally defined in js) on each row of table.
 * @param rowIndex - index for row element.
 * @param rowData - array of column data for the respective row.
 * @param formatColumns - (override function locally defined to manipulate columns of row element.)
 * @return formated rowData (ColumnDataList for that row)
 */
htmlUtil.tableUtil.formatData= function (rowIndex,rowData,formatColumns)
{
	try{

		if(!rowData)
		{
			var err={message:" Input arguments are null"};
			throw (err);
		}

		if(!formatColumns)
			return rowData;
		else
			return(formatColumns(rowIndex,rowData)); // this methos had to be declared in the local js class. 

	}catch(err)
	{
		err={message:" Error in formatData function call err msg- "+err.message};
		throw (err);
	}
};

htmlUtil.tableUtil.storeTabelValinBuffer = function (rowElm,index,masterRowDataBuffer)
{
	try{
		var rowObj=""+index;
		for(var i=0; i<rowElm.length; i++)
		{
			rowObj+="#"+$(rowElm[i]).val();
		}
		masterRowDataBuffer.push(rowObj);
	}
	catch(err)
	{
		alert("Error in htmlUtil storeTabelValinBuffer method err Msg-"+err.message);
	}

};

htmlUtil.tableUtil.retriveTableValinBuffer = function (rowElm,index,masterRowDataBuffer)
{
	try{
		for(var i=0; i<masterRowDataBuffer.length; i++)
		{
			var rowObj=masterRowDataBuffer[i].split("#");
			if(rowObj[0]==index)
			{
				for(var k=0; k<rowElm.length; k++)
				{
					$(rowElm[k]).val(rowObj[k+1]);
				}
				masterRowDataBuffer.splice(i,1);
			}
		}
	}
	catch(err)
	{
		alert("Error in htmlUtil retriveTableValinBuffer method err Msg-"+err.message);
	}

};
//*****************************************************************************************************************************************

//***********************************************JSON OBJECT TO HTML GENERATION FUNCTIONS**************************************************

htmlUtil.jsonUtil={};
//HTML GENERATING FUNCTIONS//////////////////////

/**
 * CONSTANTS USED IN LINE WITH JSONConstants.java to identiy IJSONOBJECT are declared below
 */

var JSON_OBJECT_DROP_DOWN_ELEMENT="dropDownElement";
var JSON_OBJECT_PARAMETERS_ELEMENT="parametersBean";

/**
 * constructHTML method is the interface that is used to call the respective html generating based on type of JSON Object.
 * eg. constructDropDown is invoked for JSON object with name 'dropDownElement'.
 * @param dataObj - JSON DataObject follows IJSON format.
 * @return string -(HTML output of the dataObject)
 */
htmlUtil.jsonUtil.constructHTML= function (dataObj)
{
	try{
		if(dataObj==null)
		{
			var err={message:" Input arguments are null"};
			throw (err);
		}

		if(dataObj.name==JSON_OBJECT_DROP_DOWN_ELEMENT)
			return this.constructDropDown(dataObj);

	}catch(err)
	{
		alert("Error in ConstructHTML function of htmlUtil.jsonUtil err msg- "+err.message);
	}
};

/**
 * constructDropDown method is called from constructHTML method.
 * This method is used to construct HTML for dropdown element based on JSONObject data.
 * @param dataObj - JSON DataObject- dropDownElement.
 * @return string -(HTML output of the dropDown)
 */
htmlUtil.jsonUtil.constructDropDown=function (dataObj)
{
	var outputHTML="";
	try{
		var options = dataObj.options;
		var selectedIndex= dataObj.selectedIndex;
		if(options==null || selectedIndex==null)
		{
			var err={message:" Input arguments are null"};
			throw (err);
		}
		for(var i=0; i< options.length; i++)
		{
			if(selectedIndex==i)
				{
			outputHTML+="<option value=\""+options[i].optionValue+"\" selected=\""+selectedIndex+"\">";
				}
			else
				{
				
				outputHTML+="<option value=\""+options[i].optionValue+"\">";
				}
			outputHTML+=options[i].optionText;
			outputHTML+="</option>";
		}
		return outputHTML;
	}catch(err)
	{
		err={message:" Error in constructDropdown method err msg:- "+err.message};
		throw (err);
	}
};


/**
 * Recursive function added to convert jsonObj to string representation
 * @param jsonObj
 * @return
 */
htmlUtil.jsonUtil.getJsonStringRepresentation= function (jsonObj)
{
	try
	{
		if(typeof jsonObj==="object")
		{
			var i=0;
			var output="{";
			for(var param in jsonObj)
			{
				if(i!=0)
					output+=", ";
				output+="\""+param+"\"";
				output+=":";
				output+=this.getJsonStringRepresentation(jsonObj[param]);
				i++;
			}
			output+="}";
			return output;
		}	
		else
		{
			if(typeof jsonObj==="string")
				jsonObj="\""+jsonObj+"\"";
			
			return jsonObj;
		}
	}catch(err)
	{
		err={message:" Error in constructDropdown method err msg:- "+err.message};
		throw (err);
	}
};
//HTML MODIFYING FUNCTIONS///////////////////////////////

/**
 * modifyHTML method is the interface that  is used to call the respective html modifying functions based on type of JSON Object.
 * Note: here HTML is not generated. There is not return of HTML string. Only Existing HTML is modified.
 * eg. intializeParam is invoked for JSON object with name 'parametersBean'.
 * @param dataObj - JSON DataObject follows IJSON format.
 * @return void
 */
htmlUtil.jsonUtil.modifyHTML= function (dataObj)
{
	try{
		if(dataObj==null)
		{
			var err={message:" Input arguments are null"};
			throw (err);
		}

		if(dataObj.name==JSON_OBJECT_PARAMETERS_ELEMENT)
			this.initializeParam(dataObj);

	}catch(err)
	{
		alert("Error in modifyHTML function of htmlUtil.jsonUtil err msg- "+err.message);
	}
};
/**
 * intializeParam method is used to initialize HTML input tags with value specified by dataobject.
 * @param dataObj - JSON DataObject- parametersBean.
 * @return void
 */
htmlUtil.jsonUtil.initializeParam= function (paramObj)
{
	try{
		if((paramObj.name).trim()!="parametersBean")
		{
			var err={message:"Argument not a parametersBean"};
			throw (err);
		} 
		var parameters = paramObj.parameters;
		for(var i=0; i<parameters.length;i++)
		{
			var param = parameters[i];
			document.getElementById(param.paramName).value=param.paramValue;
		}

	}catch(err)
	{
		err={message:" Error in intializeParam method err msg:- "+err.message};
		throw (err);
	}
};

//*****************************************************************************************************************************************


////////////////////////////////////////VALIDATIONS//////////////////////////////////////////////

htmlUtil.validator={};
htmlUtil.validator.isUnique=function (value,list,elmn)
{
	try
	{
		if(!value)
		{
			return true;
		}
		if(!list)
		{
			return true;
		}
		if(list.length==0)
		{
			return true;
		}
		for(var i=0; i<list.length;i++)
		{
			if(value==list[i])
			{
				if(elmn)
					htmlUtil.prompt.error({elm:elmn,msg:"*Entry must be unique!"});
				return false;
			}
		}
		return true;	
	}catch(err)
	{
		alert("Error in htmlUtil.validator.isUnique method err Msg-"+err.message);
		return false;
	}
	
	
};


htmlUtil.validator.isAlphaNumeric=function (value,elmn)
{
	try
	{
		if(!value)
		{
			return true;
		}
		var specialChars = "%<>^#~*+=\\[]:;\"&@$|?"; //note ,(){}-_'./ are treated as part of alpha numeric
		for(var i=0; i<specialChars.length;i++)
		{
			var specialChar=specialChars.charAt(i);
			if(value.indexOf(specialChar)!=-1)
			{
				if(elmn)
					htmlUtil.prompt.error({elm:elmn, msg:"* Only Alphanumeric Charecters Allowed"});
				return false;
			}
		}
		return true;	
	}catch(err)
	{
		alert("Error in htmlUtil.validator.isAlphaNumeric method err Msg-"+err.message);
		return false;
	}
	
	
};

htmlUtil.validator.isJgridReserverCharecters= function (value,elmn)
{
	try
	{
		if(!value)
		{
			return true;
		}
		var	specialChars = "~#:";
		for(var i=0; i<specialChars.length;i++)
		{
			var specialChar=specialChars.charAt(i);
			if(value.indexOf(specialChar)!=-1)
			{
				if(elmn)
					htmlUtil.prompt.error({elm:elmn, msg:"* The Charecters ~#: are not Allowed"});
				return false;
			}
		}
		if(value.indexOf("INSERT:")!=-1)
		{
			if(elmn)
				htmlUtil.prompt.error({elm:elmn, msg:"* The Charecters ~#: are not Allowed"});
			return false;
		}
		if(value.indexOf("UPDATE:")!=-1)
		{
			if(elmn)
				htmlUtil.prompt.error({elm:elmn, msg:"* The Charecters ~#: are not Allowed"});
			return false;
		}
		if(value.indexOf("DELETE:")!=-1)
		{
			if(elmn)
				htmlUtil.prompt.error({elm:elmn, msg:"* The Charecters ~#: are not Allowed"});
			return false;
		}
		
		return true;
	}catch(err)
	{
		alert("Error in jgridUtil.isJgridReserverCharecters method err Msg-"+err.message);
		return false;
	}
		
};

htmlUtil.validator.isNonSpecialCharecter= function (value,specialChars,elmn)
{
	try
	{
		if(!value)
		{
			return true;
		}
		if(!specialChars)
			specialChars = "%<>^#~*+=\\[]:;\"&@$|?";
		for(var i=0; i<specialChars.length;i++)
		{
			var specialChar=specialChars.charAt(i);
			if(value.indexOf(specialChar)!=-1)
			{
				if(elmn)
					htmlUtil.prompt.error({elm:elmn, msg:"Special Charecters are not Allowed"});
				return false;
			}
		}
		return true;
	}catch(err)
	{
		alert("Error in htmlUtil.validator.isNonSpecialCharecter method err Msg-"+err.message);
		return false;
	}
		
};

htmlUtil.validator.isNumeric= function (value,elmn)
{
	try
	{
		if(!value)
		{
			return true;
		}
		var validChars = "0123456789.";
		for(var i=0; i<value.length;i++)
		{
			var inputChars=value.charAt(i);
			if(validChars.indexOf(inputChars)==-1)
			{
				if(elmn)
					htmlUtil.prompt.error({elm:elmn, msg:"* Only Numeric Charecters are Allowed"});
				return false;
			}
		}
		return true;	
	}catch(err)
	{
		alert("Error in htmlUtil.validator.isNumeric method err Msg-"+err.message);
		return false;
	}
	
};

htmlUtil.validator.isAlphabets= function (value,elmn)
{
	try
	{
		if(!value)
		{
			return true;
		}
		value=value.toUpperCase();// case insesntive
		var validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";//note ,(){}-_'./ are treated as part of alphabets
		for(var i=0; i<value.length;i++)
		{
			var inputChars=value.charAt(i);
			if(validChars.indexOf(inputChars)==-1)
			{
				if(elmn)
					htmlUtil.prompt.error({elm:elmn, msg:"* Only Alphabet Charecters are Allowed"});
				return false;
			}
		}
		return true;	
	}catch(err)
	{
		alert("Error in htmlUtil.validator.isNumeric method err Msg-"+err.message);
		return false;
	}
	
};

htmlUtil.validator.isMandatory= function (value,elmn)
{
	try
	{
		if(!value)
		{
			if(elmn)
				htmlUtil.prompt.error({elm:elmn, msg:"* Mandatory Field"});
			return false;
		}
		if(value.trim().length==0)
		{
			if(elmn)
				htmlUtil.prompt.error({elm:elmn, msg:"* Mandatory Field"});
			return false;
		}
		
		return true;	
	}catch(err)
	{
		alert("Error in htmlUtil.validator.isMandatory method err Msg-"+err.message);
		return false;
	}
};
//******************************************************************************************************************************************


//**************************************************VALIDATION PROMPT FUNTION***********************************************************

htmlUtil.prompt={};
/**
 * The below functions are used in construction of prompt used to display error message during inine form element validation.
 * The 2 base functions buildPrompt and calculatePosition was taken from jquery-validatorEngine plugin free source code 
 * and modified according to RAD application requirement.
 * 
 */

/**
 * buildPrompt method is the base function which construct the html prompt div.Used in inline form validation
 * Every prompt is associated to its caller element- using element Name and id in absence of name.
 * Prompt is built near the element on which this method is called.
 * Prompt can be closed by user by clicking on it.
 * Unlike alert- prompt can also be closed by invoking close functions for this prompt.
 * Note: this method will throw error if the html element invoking it does not have a name attribute defined.
 * @param caller - DOM element of the calling HTML element. Prompt is invoked for this element (Can be textbox/ dropdown etc.. )
 * @param promptText - Message to be indicated on the Prompt.
 * @param showTriangle- boolean to determine if the the arrow pointer shown along with the prompt is needed or not. Some cases as 
 * 		  				check boxes and radio, dispalying arrow on prompt may be inappropriate.
 * @param promptPosition- 4 set of predefined values (bottomLeft,bottomRight,topLeft,topRight) used to determine where to place the prompt
 * @param adjustmentFactor - added to overcome defect of this framework. It does not position correctly in case of nested elements
 * 							 like <table><tr><td><input> here input position is mis-calculated. 
 * 	
 */
htmlUtil.prompt.buildPrompt= function (caller,promptText,showTriangle,promptPosition,adjustmentFactor,autoClose,type) {			

	
	//PROMPT BOX CONSTRUCTION 
	var divFormError = document.createElement('div');
	var formErrorContent = document.createElement('div');
	$(divFormError).addClass("errorDiv");

	try
	{
		//note: Caller Element must have  name or Id- name is given the higher precedence in case both exist
		//Above point is needed for this code to work as based on Name/ID we can identify the prompt and close it
		if(caller)
		{
			var promptId=null;
			 if(caller.id)
					promptId=caller.id;
			 else if(caller.name)
				promptId=caller.name;
			else if($(caller).attr("id")) 
				promptId=$(caller).attr("id");
			else
			{
				var err={message:" Caller element does not have name or id attribute "};
				throw (err);
			}
			//jgrid case  - require rowid to be unique in page - may have problems when there are more than one grids
			 if(promptId.split("_").length==2){
					$(divFormError).addClass(promptId.split("_")[0]+"_errorDiv");//identifier
			 }
			 $(divFormError).addClass(promptId+"errorDiv");//identifier
			
			
			
		}
		$(formErrorContent).addClass("errorDivContent");//prompt styling
		
		/*
		 * Added to style according to type.. by default error= red, warn - yellow and notification- grey
		 */
		$(formErrorContent).addClass(type);
		
		/*
		The below change was done to fix the position issue in case of nested input elements..
		The fix needs to be tested.
		*/
		//$(caller).before(divFormError);//prompt positioning
		$('body').append(divFormError);// prompt div is with respect to body div- helps in clean position 
		
		$(divFormError).append(formErrorContent);// prompt content

		//PROMPT ARROW POINTER CONSTRUCTION
		if(showTriangle)//Arrow pinter used to point the prompt box to the error element
		{		
			var arrow = document.createElement('div');
			$(arrow).addClass("errorDivArrow");
			$(arrow).addClass(type+"Arrow");
			if(promptPosition == "bottomLeft" || promptPosition == "bottomRight")
			{
				$(formErrorContent).before(arrow);
				$(arrow).html('<div class="line1"><!-- --></div><div class="line2"><!-- --></div><div class="line3"><!-- --></div><div class="line4"><!-- --></div><div class="line5"><!-- --></div><div class="line6"><!-- --></div><div class="line7"><!-- --></div><div class="line8"><!-- --></div><div class="line9"><!-- --></div><div class="line10"><!-- --></div>');
			}
			else if(promptPosition == "topLeft" || promptPosition == "topRight")
			{
				$(divFormError).append(arrow);
				$(arrow).html('<div class="line10"><!-- --></div><div class="line9"><!-- --></div><div class="line8"><!-- --></div><div class="line7"><!-- --></div><div class="line6"><!-- --></div><div class="line5"><!-- --></div><div class="line4"><!-- --></div><div class="line3"><!-- --></div><div class="line2"><!-- --></div><div class="line1"><!-- --></div>');
			}
		}

		$(formErrorContent).html(promptText);
		
		//PROMPT POSITIONING
		if(caller)
		{
			var calculatedPosition = this.calculatePosition(caller,promptText,divFormError,promptPosition,adjustmentFactor);
			calculatedPosition.callerTopPosition +="px";
			calculatedPosition.callerleftPosition +="px";
			calculatedPosition.marginTopSize +="px";
			$(divFormError).css({
				"top":calculatedPosition.callerTopPosition,
				"left":calculatedPosition.callerleftPosition,
				"marginTop":calculatedPosition.marginTopSize,
				"opacity":0
			});
		}else
		{

			$(formErrorContent).removeClass("errorDivContent");//change prompt styling
			$(formErrorContent).removeClass(type);//css renders based on left to right order hence type is placed at extreem right to override errorDivContent-2
			$(formErrorContent).addClass("errorDivContent-2");//prompt styling
			$(formErrorContent).addClass(type);//change prompt styling
			$(divFormError).css({
				"top": (($(document).height()/2)-100)+"px",
				"left": (($(document).width()/2)-200)+"px",
				"marginTop":"0px",
				"opacity":0
			});
		}
		//PROMPT CLOSES ON CLICK
		$(formErrorContent).click(function(){
			$(divFormError).remove();
		});
		//PROMPT AUTO CLOSE AFTER 10SEC
		if(autoClose)
			setTimeout(function() {$(divFormError).remove(); divFormError=null;}, 5000);

		//PROMPT DISPLAY- ANIMATION - fadeIn effect
		$(divFormError).animate({"opacity":0.87},'fast',function(){return true;});	

	}catch(err)
	{
		alert("Error in htmlUtil.prompt.buildPrompt method err msg: "+err.message);
	}

};

/**
 * calculate position method is the called form  buildPrompt function which construct the html prompt div.
 * This mehtod calculates the position of the promptDiv with respect to input parmaeters
 * @param caller - DOM element of the calling HTML element. Prompt is invoked for this element (Can be textbox/ dropdown etc.. )
 * @param promptText - Message to be indicated on the Prompt.
 * @param divFormError- div element of the prompt.
 * @param promptPosition- 4 set of predefined values (bottomLeft,bottomRight,topLeft,topRight) used to determine where to place the prompt
 * @param adjustmentFactor - added to overcome defect of this framework. It does not position correctly in case of nested elements
 * 							 like <table><tr><td><input> here input position is mis-calculated. 
 * 	
 */
htmlUtil.prompt.calculatePosition= function (caller,promptText,divFormError,promptPosition,adjustmentFactor){
	
	try
	{
		callerTopPosition = $(caller).offset().top;
		callerleftPosition = $(caller).offset().left;
		callerWidth =  $(caller).width();
		inputHeight = $(divFormError).height();
		var marginTopSize = 0;
		if(adjustmentFactor)
		{
			callerTopPosition+=adjustmentFactor.top;
			callerleftPosition+=adjustmentFactor.left;
		}
		/* POSITIONNING */
		if(promptPosition == "topRight")
		{ 
			callerleftPosition +=  callerWidth -30; 
			callerTopPosition -= inputHeight; 
		}
		else if(promptPosition == "topLeft")
		{
			callerTopPosition -=inputHeight; 
		}

		else if(promptPosition == "bottomLeft")
		{
			callerHeight =  $(caller).height();
			callerTopPosition +=   callerHeight+5;
		}

		else if(promptPosition == "bottomRight")
		{
			callerHeight =  $(caller).height();
			callerleftPosition +=  callerWidth -30;
			callerTopPosition += callerHeight+5; 
		}
		

		return  {
				"callerTopPosition":callerTopPosition,
				"callerleftPosition":callerleftPosition,
				"marginTopSize":marginTopSize
				};

	}catch(err)
	{
		err={message:" Error in htmlUtil.prompt.calculatePosition method err msg:- "+err.message};
		throw (err);
	}
		
};

/**
 * htmlAlert method is the wrapper method for buildPrompt, This is used from the local js files.
 * All prompts can be closed by clicking on them
 * Overloading options
 * 1 argument - message -
 * constructs a alert prompt box at center of the screen with the given message. (Box Dimension are configurable in htmlUtil.css- erroDivContent-2
 * 2 arguments- DOMelement, message - 
 * constructs a alert prompt box with the message, pointerArrow and position relative to top left position of the DOM element.
 * 3 arguments - DOMElement,message,boxRelativePosition - 
 * constructs a alert prompt box with the message, pointerArrow and position relative to the DOM element based on boxRelativePosition
 * 4 arguments - DOMElement,message,boxRelativePosition,adjustmentFactor - 
 * same as 3 argument functionality and here the position is offset based on the top,left attributes of adjustmentFactor JSON object
 * 5 arguments - DOMElement,message,boxRelativePosition,adjustmentFactor,showPointerFlag
 * same as 3 argument functionality and here the showPointerFlag is a boolean to indicate the need for pointer arrow.
 * @param elm - DOM element of the calling HTML element. Prompt is invoked for this element (Can be textbox/ dropdown etc.. )
 * @param message - Message to be indicated on the Prompt.
 * @param position - String value can be 'topLeft,topRight,bottomLeft,bottomRight - by default = topLeft
 * @param adjustmentFactor - added to override position from calculated position. - adjustmentFactor = json with top, width attributes.
 * @param showPointer - by default true - can be set to false
 */
htmlUtil.prompt.htmlAlert=function (alertType,jsonArg)
{
	var type=(alertType)?alertType:"error";
	var elm=jsonArg.elm;
	var message=jsonArg.msg;
	var position=(jsonArg.pstn)?jsonArg.pstn:(elm)?"topLeft":"center";
	var adjustmentFactor=jsonArg.adjFactor;
	var showPointer=(jsonArg.showPointer)?jsonArg.showPointer:true;
	var autoClose=(jsonArg.autoClose)?jsonArg.autoClose:true;
	/*if(arguments.length==2)
	{
		message=arguments[1];
		position="center";
		
		showPointer=false;
	}
	if(arguments.length==3)
	{
		elm=arguments[1];
		message=arguments[2];
	}
	if(arguments.length==4)
	{
		elm=arguments[1];
		message=arguments[2];
		position=arguments[3];
	}
	if(arguments.length==5)
	{
		elm=arguments[1];
		message=arguments[2];
		position=arguments[3];
		adjustmentFactor=arguments[4];
	}
	if(arguments.length==6)
	{
		elm=arguments[1];
		message=arguments[2];
		position=arguments[3];
		adjustmentFactor=arguments[4];
		showPointer=arguments[5];
	}
	if(!position)
		position="topLeft";*/
	this.buildPrompt (elm,message,showPointer,position,adjustmentFactor,autoClose,type);
};


htmlUtil.prompt.error=function(jsonArg)
{
	this.htmlAlert("error",jsonArg);
};

htmlUtil.prompt.warn=function(jsonArg)
{
	this.htmlAlert("warn",jsonArg);
};

htmlUtil.prompt.notify=function(jsonArg)
{
	this.htmlAlert("notify",jsonArg);;
};
/**
 * closePrompt method is used to remove the promptElm.
 *@param promptElm - DOM element of the PromptDIV. 
 */
htmlUtil.prompt.closePrompt= function(promptElm)
{
	try
	{
		$(promptElm).remove();
	}catch(err)
	{
		alert("Error in removing element in htmlUtil.prompt.closePrompt err msg "+err.message);
	}
};

/**
 * Wrapper method for closePrompt, this is used to remove the promptElms associated with the concerned htmlElement
 * @param fieldElm/fieldElm[] - DOM element of the calling HTML element. Prompt is invoked for this element (Can be textbox/ dropdown etc.. )
 */
htmlUtil.prompt.closeHtmlAlert= function(fieldElm)
{
	try
	{
		if(!fieldElm.length)
		{
			var tempArray=new Array();
			tempArray.push(fieldElm);
			fieldElm=tempArray;
		}
		for(var k=0;k<fieldElm.length;k++)
		{
			var promptId=null;
			if(fieldElm[k].id)
				promptId=fieldElm[k].id;
			else if(fieldElm[k].name)
				promptId=fieldElm[k].name;
			else if($(fieldElm).attr("id")) 
				promptId=$(fieldElm).attr("id");
			else
			{
				var err={message:" Caller element does not have name or id attribute "};
				throw (err);
			}
			var promptElms = $("."+promptId+"errorDiv");
			if(promptElms)
			{
				for(var i=0; i<promptElms.length;i++)
				{
					this.closePrompt(promptElms[i]);
				}
			}
		}
		
	}catch(err)
	{
		alert("Error in htmlUtil.prompt.closeHtmlAlert err msg "+err.message);
	}
	

};


/**
 *Utility method. This is used to remove all the promptElms in a jsp page.
 */
htmlUtil.prompt.closeAllHtmlAlert= function ()
{
	try
	{
		var promptElms = $(".errorDiv");//all promts use this class. note.. not other element is expected to use this class
		if(promptElms)
		{
			for(var i=0; i<promptElms.length;i++)
			{
				this.closePrompt(promptElms[i]);
			}
		}
	}catch(err)
	{
		alert("Error in htmlUtil.prompt.closeHtmlAlert err msg "+err.message);
	}
};


/**
 *Utility method. This is used to by jgridUil to close all the promptElms in specific to grid page.
 */
htmlUtil.prompt.closeHtmlAlertInGrid= function (tableId)
{
	try
	{
		var promptElms = $("."+tableId+"_errorDiv");//all promts use this class. note.. not other element is expected to use this class
		if(promptElms)
		{
			for(var i=0; i<promptElms.length;i++)
			{
				this.closePrompt(promptElms[i]);
			}
		}
	}catch(err)
	{
		alert("Error in htmlUtil.prompt.closeHtmlAlert err msg "+err.message);
	}
};


/**
 *Utility method. This is used to by jgridUil to close all the promptElms in specific to grid for a specific row.
 */
htmlUtil.prompt.closeHtmlAlertInGridForRow= function (rowId)
{
	try
	{
		var promptElms = $("."+rowId+"_errorDiv");//all promts use this class. note.. not other element is expected to use this class
		if(promptElms)
		{
			for(var i=0; i<promptElms.length;i++)
			{
				this.closePrompt(promptElms[i]);
			}
		}
	}catch(err)
	{
		alert("Error in htmlUtil.prompt.closeHtmlAlertInGridForRow err msg "+err.message);
	}
};
//*****************************************************************************************************************************************


//*************************************MODAL AND SUBWINDOW UTILS**************************************************************************
//************* Needs common.jsp with variable modalFrameReturnData***********************************************************************************************************
htmlUtil.popUp={};

htmlUtil.popUp.openSubWindow= function(url,width,height)
{
	
	$.colorbox(
			{
				href:url,
				width:width,
				height:height,
				overlayClose:false,
				iframe:true
			});
	 if(sessionControl)
		   sessionControl.resetSessionCount();
};

htmlUtil.popUp.openModalWindow= function(url,width,height,returnHandler)
{

	$.colorbox(
			{
				href:url,
				width:width,
				height:height,
				overlayClose:false,
//				escKey:false,
				onClosed:function(){htmlUtil.popUp.processReturnData(returnHandler)},
				iframe:true
			});
		$("#cboxClose").hide();
		 if(sessionControl)
		 {
			 sessionControl.resetSessionCount();
		 }
		 
};


htmlUtil.popUp.processReturnData=function(returnFunction)
{
	
	try
	{
		//read Data from modalFrameReturnData variable in common.jsp
		var data =$("#modalFrameReturnData").val();
		// clear data for modalFrameReturnData variable in common.jsp
		$("#modalFrameReturnData").val("");
		// call local returnFunction with this data as argument
		returnFunction(data);
	}catch(err)
	{
		htmlUtil.prompt.error({msg:"Error in htmlUtil.popUp.processReturnData in htmlUtil.js msg: "+err.message});
	}
};

htmlUtil.popUp.sendReturnDataAndClose=function(data)
{
	try
	{
		var body$=parent.$;
		
		if(body$)
		{
			//write Data to modalFrameReturnData variable in common.jsp
			body$("#modalFrameReturnData").val(data);
			//close popUp window
			body$.colorbox.close();
		}
	}catch(err)
	{
		htmlUtil.prompt.error({msg:"Error in htmlUtil.popUp.sendReturnData in htmlUtil.js msg: "+err.message});
	}
};

htmlUtil.popUp.close= function()
{
	try
	{
		var body$=parent.$;
		if(body$)
		{
			//close popUp window
			body$.colorbox.close();
		}
	}catch(err)
	{
		htmlUtil.prompt.error({msg:"Error in htmlUtil.popUp.close in htmlUtil.js msg: "+err.message});
	}
};
//*****************************************************************************************************************************************