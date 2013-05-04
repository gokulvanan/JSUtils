

/*
 * Override function to customize jgrid settings
 * 
 */

$.extend($.jgrid.defaults,{
	datatype: "JSON", 
	mtype: "POST",
	altRows:true,
	shrinkToFit:true,
	loadui:"block" ,
	jsonReader : { 
	"root": "tableData", 
	"page": "currentPage", 
	"total": "totalPages", 
	"records": "totalRecords", 
	"repeatitems": false, 
/*	"cell": "cell",*/
	"id": "id",
	"userdata": "objectData"
}
});

$.extend(
		$.fn.fmatter , 
		{
			editAction : function(cellvalue, opts, rowdata) {
			var str="",ocl;
			var rowId=opts.rowId;
			if(rowId.indexOf("NEW")>-1)
			{
				ocl = "onclick=jgridUtil.customizedRestore('"+rowId+"','"+opts.gid+"'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
				str = str+"<div title='"+$.jgrid.nav.deltitle+"' style='float:left;margin-left:5px;' class='ui-pg-div ui-inline-del' "+ocl+"><span class='ui-icon ui-icon-trash'></span></div>";
			}
			ocl = "onclick=jgridUtil.customizedEdit('"+rowId+"','"+opts.gid+"'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover') ";
			str =str+ "<div title='"+$.jgrid.nav.edittitle+"' style='float:left;cursor:pointer;margin-left:5px;' class='ui-pg-div ui-inline-edit' "+ocl+"><span class='ui-icon ui-icon-pencil'></span></div>";	
			ocl = "onclick=jgridUtil.customizedRestore('"+rowId+"','"+opts.gid+"','edit'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
			str = str+"<div title='"+$.jgrid.edit.bCancel+"' style='float:left;display:none;margin-left:5px;' class='ui-pg-div ui-inline-cancel' "+ocl+"><span class='ui-icon ui-icon-cancel'></span></div>";
			
			return "<div style='margin-left:8px;'>" + str + "</div>";
		},
		    delAction : function(cellvalue, opts, rowdata) {
			var str="",ocl;
			var rowId=opts.rowId;
			if(rowId.indexOf("NEW")>-1)
			{
				ocl = "onclick=jgridUtil.customizedRestore('"+rowId+"','"+opts.gid+"'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
				str = str+"<div title='"+$.jgrid.nav.deltitle+"' style='float:left;margin-left:5px;' class='ui-pg-div ui-inline-del' "+ocl+"><span class='ui-icon ui-icon-trash'></span></div>";
			}
			ocl = "onclick=jgridUtil.customizedDel('"+rowId+"','"+opts.gid+"'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
			str = str+"<div title='"+$.jgrid.nav.deltitle+"' style='float:left;margin-left:5px;' class='ui-pg-div ui-inline-del' "+ocl+"><span class='ui-icon ui-icon-trash'></span></div>";
			ocl = "onclick=jgridUtil.customizedRestore('"+rowId+"','"+opts.gid+"','del'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
			str = str+"<div title='"+$.jgrid.edit.bCancel+"' style='float:left;display:none;margin-left:5px;' class='ui-pg-div ui-inline-cancel' "+ocl+"><span class='ui-icon ui-icon-cancel'></span></div>";
			return "<div style='margin-left:8px;'>" + str + "</div>";
		}, pickAndAddAction : function(cellvalue, opts, rowdata) {
			var str="",ocl;
			var rowId=opts.rowId;
			ocl = "onclick=\"customPickAndAdd('"+rowId+"','"+opts.gid+"')\"; onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover') ";
			str =str+ "<div title='"+$.jgrid.nav.addtitle+"' style='float:left;cursor:pointer;margin-left:5px;' class='ui-pg-div ui-inline-edit' "+ocl+"><span class='ui-icon ui-icon-extlink'></span></div>";	
			return "<div style='margin-left:8px;'>" + str + "</div>";
		}, 
			editableForAdd : function(cellvalue, opts, rowdata) {
			var str="";
			var rowId=opts.rowId;
			var name=opts.colModel.name;
		
			if(rowId.indexOf("NEW")>-1)
			{
				str=overrideEditableForAddTrueCase(cellvalue,opts,rowdata);
				if(str)
				{
					return str;
				}
				str ="<input id='"+rowId+"_"+name+"' name='"+name+"' value='' type='text' ></input>";
			}
			else
			{
				str=overrideEditableForAddFalseCase(cellvalue,opts,rowdata);
				if(str)
				{
					return str;
				}
				str=cellvalue;
			}
			return str;
		} ,
			jgridUtilCustom : function(cellvalue, opts, rowdata) {
			var rowId=opts.rowId;
			var isNewRow=(rowId.indexOf("NEW")>-1);
			var	str=griCustomFormater(cellvalue, opts, rowdata,isNewRow);
			if(str==null)
			{
				alert("Custom Formater not implemented in local js file.");
				throw new Error("Custom Formater not implemented in local js file.");
			}
			return str;
		},
		customHyperLink : function(cellvalue, opts, rowdata) {
			var rowId=opts.rowId;
			var str="";
			var colMod=opts.colModel;
			if(cellvalue)
			{
				str ="<a href='#' onclick=\"jgridCustomLinkClickHandler('"+rowId+"','"+opts.gid+"','"+opts.colModel.name+"','"+cellvalue+"');\">"+cellvalue+"</a>";
			}
			return str;
		}
		});



/*
 * below plugins are src code of jgrid functions which have been modfide. These will overrice the source file.
 * incase source file is being updated to new version. compatibility of these override functions needs to be checkd.
 * Modifcations made will be can be found by searching for MODIFIED key word
 *
 */




/*
 * jqFilter  jQuery jqGrid filter addon.
 * Copyright (c) 2011, Tony Tomov, tony@trirand.com
 * Dual licensed under the MIT and GPL licenses
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
 * 
 * The work is inspired from this Stefan Pirvu
 * http://www.codeproject.com/KB/scripting/json-filtering.aspx
 *
 * The filter uses JSON entities to hold filter rules and groups. Here is an example of a filter:

{ "groupOp": "AND",
      "groups" : [ 
        { "groupOp": "OR",
            "rules": [
                { "field": "name", "op": "eq", "data": "England" }, 
                { "field": "id", "op": "le", "data": "5"}
             ]
        } 
      ],
      "rules": [
        { "field": "name", "op": "eq", "data": "Romania" }, 
        { "field": "id", "op": "le", "data": "1"}
      ]
}
*/
/*global jQuery, $, window, navigator */

(function ($) {

$.fn.jqFilter = function( arg ) {
	if (typeof arg === 'string') {
		
		var fn = $.fn.jqFilter[arg];
		if (!fn) {
			throw ("jqFilter - No such method: " + arg);
		}
		var args = $.makeArray(arguments).slice(1);
		return fn.apply(this,args);
	}

	var p = $.extend(true,{
		filter: null,
		columns: [],
		onChange : null,
		afterRedraw : null,
		checkValues : null,
		error: false,
		errmsg : "",
		errorcheck : true,
		showQuery : true,
		sopt : null,
		ops : [
			{"name": "eq", "description": "equal", "operator":"="},
			{"name": "ne", "description": "not equal", "operator":"<>"},
			{"name": "lt", "description": "less", "operator":"<"},
			{"name": "le", "description": "less or equal","operator":"<="},
			{"name": "gt", "description": "greater", "operator":">"},
			{"name": "ge", "description": "greater or equal", "operator":">="},
			{"name": "bw", "description": "begins with", "operator":"LIKE"},
			{"name": "bn", "description": "does not begin with", "operator":"NOT LIKE"},
			{"name": "in", "description": "in", "operator":"IN"},
			{"name": "ni", "description": "not in", "operator":"NOT IN"},
			{"name": "ew", "description": "ends with", "operator":"LIKE"},
			{"name": "en", "description": "does not end with", "operator":"NOT LIKE"},
			{"name": "cn", "description": "contains", "operator":"LIKE"},
			{"name": "nc", "description": "does not contain", "operator":"NOT LIKE"},
			{"name": "nu", "description": "is null", "operator":"IS NULL"},
			{"name": "nn", "description": "is not null", "operator":"IS NOT NULL"}
		],
		numopts : ['eq','ne', 'lt', 'le', 'gt', 'ge', 'nu', 'nn', 'in', 'ni'],
		stropts : ['eq', 'ne', 'bw', 'bn', 'ew', 'en', 'cn', 'nc', 'nu', 'nn', 'in', 'ni'],
		_gridsopt : [], // grid translated strings, do not tuch
		groupOps : ["AND", "OR"],
		groupButton : true,
		ruleButtons : true,
		direction : "ltr"
	}, arg || {});
	return this.each( function() {
		if (this.filter) {return;}
		this.p = p;
		// setup filter in case if they is not defined
		if (this.p.filter === null || this.p.filter === undefined) {
			this.p.filter = {
				groupOp: this.p.groupOps[0],
				rules: [],
				groups: []
			};
		}
		var i, len = this.p.columns.length, cl,
		isIE = /msie/i.test(navigator.userAgent) && !window.opera;

		// translating the options
		if(this.p._gridsopt.length) {
			// ['eq','ne','lt','le','gt','ge','bw','bn','in','ni','ew','en','cn','nc']
			for(i=0;i<this.p._gridsopt.length;i++) {
				this.p.ops[i].description = this.p._gridsopt[i];
			}
		}
		this.p.initFilter = $.extend(true,{},this.p.filter);

		// set default values for the columns if they are not set
		if( !len ) {return;}
		for(i=0; i < len; i++) {
			cl = this.p.columns[i];
			if( cl.stype ) {
				// grid compatibility
				cl.inputtype = cl.stype;
			} else if(!cl.inputtype) {
				cl.inputtype = 'text';
			}
			if( cl.sorttype ) {
				// grid compatibility
				cl.searchtype = cl.sorttype;
			} else if (!cl.searchtype) {
				cl.searchtype = 'string';
			}
			if(cl.hidden === undefined) {
				// jqGrid compatibility
				cl.hidden = false;
			}
			if(!cl.label) {
				cl.label = cl.name;
			}
			if(cl.index) {
				cl.name = cl.index;
			}
			if(!cl.hasOwnProperty('searchoptions')) {
				cl.searchoptions = {};
			}
			if(!cl.hasOwnProperty('searchrules')) {
				cl.searchrules = {};
			}

		}
		if(this.p.showQuery) {
			$(this).append("<table class='queryresult ui-widget ui-widget-content' style='display:block;max-width:440px;border:0px none;' dir='"+this.p.direction+"'><tbody><tr><td class='query'></td></tr></tbody></table>");
		}
		//MODIFED TO Support serach rules validation as per jgridUtils
		var tableId=(this.id+"").split("_")[1];
		/*
		 *Perform checking.
		 *
		*/
		var checkData = function(val, colModelItem,tableId) {
			var ret = [true,""];
			//MODIFED TO Support serach rules validation as per jgridUtils
			//TableId added
				if(colModelItem.searchrules)
				{
					if(jgridUtil.validRow($(".search_"+colModelItem.index),colModelItem.searchrules,val,tableId)===false)
					{
						p.error=true;
						p.errmsg="validation error";
					}
				}
			/*if($.isFunction(colModelItem.searchrules)) {
				ret = colModelItem.searchrules(val, colModelItem);
			} else if($.jgrid && $.jgrid.checkValues) {
				try {
					ret = $.jgrid.checkValues(val, -1, null, colModelItem.searchrules, colModelItem.label);
				} catch (e) {}
			}
			if(ret && ret.length && ret[0] === false) {
				p.error = !ret[0];
				p.errmsg = ret[1];
			}*/
		};
		/* moving to common
		randId = function() {
			return Math.floor(Math.random()*10000).toString();
		};
		*/

		this.onchange = function (  ){
			// clear any error 
			this.p.error = false;
			this.p.errmsg="";
			return $.isFunction(this.p.onChange) ? this.p.onChange.call( this, this.p ) : false;
		};
		/*
		 * Redraw the filter every time when new field is added/deleted
		 * and field is  changed
		 */
		this.reDraw = function() {
			$("table.group:first",this).remove();
			var t = this.createTableForGroup(p.filter, null);
			$(this).append(t);
			if($.isFunction(this.p.afterRedraw) ) {
				this.p.afterRedraw.call(this, this.p);
			}
		};
		/*
		 * Creates a grouping data for the filter
		 * @param group - object
		 * @param parentgroup - object
		 */
		this.createTableForGroup = function(group, parentgroup) {
			var that = this,  i;
			//MODIFED CSS FOR THIS
			// this table will hold all the group (tables) and rules (rows)
			var table = $("<table class='group ui-widget ' style='border:0px none;'><tbody></tbody></table>"),
			// create error message row
			align = "left";
			if(this.p.direction == "rtl") {
				align = "right";
				table.attr("dir","rtl");
			}
			if(parentgroup === null) {
				table.append("<tr class='error' style='display:none;'><th colspan='5' class='ui-state-error' align='"+align+"'></th></tr>");
			}

			var tr = $("<tr></tr>");
			table.append(tr);
			// this header will hold the group operator type and group action buttons for
			// creating subgroup "+ {}", creating rule "+" or deleting the group "-"
			var th = $("<th colspan='5' align='"+align+"'></th>");
			tr.append(th);

			if(this.p.ruleButtons === true) {
			// dropdown for: choosing group operator type
			var groupOpSelect = $("<select class='opsel'></select>");
			th.append(groupOpSelect);
			// populate dropdown with all posible group operators: or, and
			var str= "", selected;
			for (i = 0; i < p.groupOps.length; i++) {
				selected =  group.groupOp === that.p.groupOps[i] ? " selected='selected'" :"";
				str += "<option value='"+that.p.groupOps[i]+"'" + selected+">"+that.p.groupOps[i]+"</option>";
			}

			groupOpSelect
			.append(str)
			.bind('change',function() {
				group.groupOp = $(groupOpSelect).val();
				that.onchange(); // signals that the filter has changed
			});
			}
			// button for adding a new subgroup
			var inputAddSubgroup ="<span></span>";
			if(this.p.groupButton) {
				//MODIFED CSS FOR THIS
				inputAddSubgroup = $("<input type='button' value='+ {}' title='Add subgroup' class='add-group ui-jqgrid-custom-button'/>");
				inputAddSubgroup.bind('click',function() {
					if (group.groups === undefined ) {
						group.groups = [];
					}

					group.groups.push({
						groupOp: p.groupOps[0],
						rules: [],
						groups: []
					}); // adding a new group

					that.reDraw(); // the html has changed, force reDraw

					that.onchange(); // signals that the filter has changed
					return false;
				});
			}
			th.append(inputAddSubgroup);
			if(this.p.ruleButtons === true) {
			// button for adding a new rule
			//MODIFED CSS FOR THIS
			var inputAddRule = $("<input type='button' value='+' title='Add rule' class='add-rule ui-add ui-jqgrid-custom-button'/>"), cm;
			inputAddRule.bind('click',function() {
				//if(!group) { group = {};}
				if (group.rules === undefined) {
					group.rules = [];
				}
				for (i = 0; i < that.p.columns.length; i++) {
				// but show only serchable and serchhidden = true fields
					var searchable = (typeof that.p.columns[i].search === 'undefined') ?  true: that.p.columns[i].search ,
					hidden = (that.p.columns[i].hidden === true),
					ignoreHiding = (that.p.columns[i].searchoptions.searchhidden === true);
					if ((ignoreHiding && searchable) || (searchable && !hidden)) {
						cm = that.p.columns[i];
						break;
					}
				}
				var opr;
				if( cm.searchoptions.sopt ) {opr = cm.searchoptions.sopt;}
				else if(that.p.sopt) { opr= that.p.sopt; }
				else if  (cm.searchtype === 'string') {opr = that.p.stropts;}
				else {opr = that.p.numopts;}

				group.rules.push({
					field: cm.name,
					op: opr[0],
					data: ""
				}); // adding a new rule

				that.reDraw(); // the html has changed, force reDraw
				// for the moment no change have been made to the rule, so
				// this will not trigger onchange event
				return false;
			});
			th.append(inputAddRule);
			}

			// button for delete the group
			if (parentgroup !== null) { // ignore the first group
				//MODIFED CSS FOR THIS
				var inputDeleteGroup = $("<input type='button' value='-' title='Delete group' class='delete-group ui-jqgrid-custom-button'/>");
				th.append(inputDeleteGroup);
				inputDeleteGroup.bind('click',function() {
				// remove group from parent
					for (i = 0; i < parentgroup.groups.length; i++) {
						if (parentgroup.groups[i] === group) {
							parentgroup.groups.splice(i, 1);
							break;
						}
					}

					that.reDraw(); // the html has changed, force reDraw

					that.onchange(); // signals that the filter has changed
					return false;
				});
			}

			// append subgroup rows
			if (group.groups !== undefined) {
				for (i = 0; i < group.groups.length; i++) {
					var trHolderForSubgroup = $("<tr></tr>");
					table.append(trHolderForSubgroup);

					var tdFirstHolderForSubgroup = $("<td class='first'></td>");
					trHolderForSubgroup.append(tdFirstHolderForSubgroup);
					var groupCls="";
					//MODIFED FOR highlighting boudries of subgroup
					if(i%2==0)
						groupCls="highlight_subgroup";
					var tdMainHolderForSubgroup = $("<td colspan='4' class='"+groupCls+"'></td>");
					tdMainHolderForSubgroup.toggleClass
					tdMainHolderForSubgroup.append(this.createTableForGroup(group.groups[i], group));
					trHolderForSubgroup.append(tdMainHolderForSubgroup);
				}
			}
			if(group.groupOp === undefined) {
				group.groupOp = that.p.groupOps[0];
			}

			// append rules rows
			if (group.rules !== undefined) {
				for (i = 0; i < group.rules.length; i++) {
					table.append(
                       this.createTableRowForRule(group.rules[i], group)
					);
				}
			}
//			alert($(table).html());
			return table;
		};
		/*
		 * Create the rule data for the filter
		 */
		this.createTableRowForRule = function(rule, group ) {
			// save current entity in a variable so that it could
			// be referenced in anonimous method calls

			var that=this, tr = $("<tr></tr>"),
			//document.createElement("tr"),

			// first column used for padding
			//tdFirstHolderForRule = document.createElement("td"),
			i, op, trpar, cm, str="", selected;
			//tdFirstHolderForRule.setAttribute("class", "first");
			tr.append("<td class='first'></td>");


			// create field container
			var ruleFieldTd = $("<td class='columns'></td>");
			tr.append(ruleFieldTd);


			// dropdown for: choosing field
			var ruleFieldSelect = $("<select></select>"), ina, aoprs = [];
			ruleFieldTd.append(ruleFieldSelect);
			ruleFieldSelect.bind('change',function() {
				rule.field = $(ruleFieldSelect).val();

				trpar = $(this).parents("tr:first");
				for (i=0;i<that.p.columns.length;i++) {
					if(that.p.columns[i].name ===  rule.field) {
						cm = that.p.columns[i];
						break;
					}
				}
				if(!cm) {return;}
				cm.searchoptions.id = $.jgrid.randId();
				if(isIE && cm.inputtype === "text") {
					if(!cm.searchoptions.size) {
						cm.searchoptions.size = 10;
					}
				}
				var elm = $.jgrid.createEl(cm.inputtype,cm.searchoptions, "", true, that.p.ajaxSelectOptions, true);
				$(elm).addClass("input-elm");
				//MOFIED to support SEARCH VALIDATION
				$(elm).addClass("search_"+cm.index);
				//that.createElement(rule, "");

				if( cm.searchoptions.sopt ) {op = cm.searchoptions.sopt;}
				else if(that.p.sopt) { op= that.p.sopt; }
				else if  (cm.searchtype === 'string') {op = that.p.stropts;}
				else {op = that.p.numopts;}
				// operators
				var s ="", so = 0;
				aoprs = [];
				$.each(that.p.ops, function() { aoprs.push(this.name) });
				for ( i = 0 ; i < op.length; i++) {
					ina = $.inArray(op[i],aoprs);
					if(ina !== -1) {
						if(so===0) {
							rule.op = that.p.ops[ina].name;
						}
						s += "<option value='"+that.p.ops[ina].name+"'>"+that.p.ops[ina].description+"</option>";
						so++;
					}
				}
				$(".selectopts",trpar).empty().append( s );
				$(".selectopts",trpar)[0].selectedIndex = 0;
				//MODIFIED for DROPDOWN BUG IN IE 9
//				if( $.browser.msie && $.browser.version <9) {
				if( $.browser.msie && $.browser.version <10) {
					var sw = parseInt($("select.selectopts",trpar)[0].offsetWidth) + 1;
					$(".selectopts",trpar).width( sw );
					$(".selectopts",trpar).css("width","auto");
				}
				// data
				$(".data",trpar).empty().append( elm );
				$(".input-elm",trpar).bind('change',function() {
					rule.data = $(this).val();
					that.onchange(); // signals that the filter has changed
				});
				setTimeout(function(){ //IE, Opera, Chrome
				rule.data = $(elm).val();
				that.onchange();  // signals that the filter has changed
				}, 0);
			});

			// populate drop down with user provided column definitions
			var j=0;
			for (i = 0; i < that.p.columns.length; i++) {
				// but show only serchable and serchhidden = true fields
		        var searchable = (typeof that.p.columns[i].search === 'undefined') ?  true: that.p.columns[i].search ,
		        hidden = (that.p.columns[i].hidden === true),
				ignoreHiding = (that.p.columns[i].searchoptions.searchhidden === true);
				if ((ignoreHiding && searchable) || (searchable && !hidden)) {
					selected = "";
					if(rule.field === that.p.columns[i].name) {
						selected = " selected='selected'";
						j=i;
					}
					str += "<option value='"+that.p.columns[i].name+"'" +selected+">"+that.p.columns[i].label+"</option>";
				}
			}
			ruleFieldSelect.append( str );


			// create operator container
			var ruleOperatorTd = $("<td class='operators'></td>");
			tr.append(ruleOperatorTd);
			cm = p.columns[j];
			// create it here so it can be referentiated in the onchange event
			//var RD = that.createElement(rule, rule.data);
			cm.searchoptions.id = $.jgrid.randId();
			if(isIE && cm.inputtype === "text") {
				if(!cm.searchoptions.size) {
					cm.searchoptions.size = 10;
				}
			}
			var ruleDataInput = $.jgrid.createEl(cm.inputtype,cm.searchoptions, rule.data, true, that.p.ajaxSelectOptions, true);

			// dropdown for: choosing operator
			var ruleOperatorSelect = $("<select class='selectopts'></select>");
			ruleOperatorTd.append(ruleOperatorSelect);
			ruleOperatorSelect.bind('change',function() {
				rule.op = $(ruleOperatorSelect).val();
				trpar = $(this).parents("tr:first");
				var rd = $(".input-elm",trpar)[0];
				if (rule.op === "nu" || rule.op === "nn") { // disable for operator "is null" and "is not null"
					rule.data = "";
					rd.value = "";
					rd.setAttribute("readonly", "true");
					rd.setAttribute("disabled", "true");
				} else {
					rd.removeAttribute("readonly");
					rd.removeAttribute("disabled");
				}

				that.onchange();  // signals that the filter has changed
			});

			// populate drop down with all available operators
			if( cm.searchoptions.sopt ) {op = cm.searchoptions.sopt;}
			else if(that.p.sopt) { op= that.p.sopt; }
			else if  (cm.searchtype === 'string') {op = p.stropts;}
			else {op = that.p.numopts;}
			str="";
			$.each(that.p.ops, function() { aoprs.push(this.name) });
			for ( i = 0; i < op.length; i++) {
				ina = $.inArray(op[i],aoprs);
				if(ina !== -1) {
					selected = rule.op === that.p.ops[ina].name ? " selected='selected'" : "";
					str += "<option value='"+that.p.ops[ina].name+"'"+selected+">"+that.p.ops[ina].description+"</option>";
				}
			}
			ruleOperatorSelect.append( str );
			// create data container
			var ruleDataTd = $("<td class='data'></td>");
			tr.append(ruleDataTd);

			// textbox for: data
			// is created previously
			//ruleDataInput.setAttribute("type", "text");
			ruleDataTd.append(ruleDataInput);
			//MOFIED to support SEARCH VALIDATION
			$(ruleDataInput).addClass("input-elm")		
			.addClass("search_"+cm.index)
			.bind('change', function() {
				rule.data = $(this).val();
				that.onchange(); // signals that the filter has changed
			});

			// create action container
			var ruleDeleteTd = $("<td></td>");
			tr.append(ruleDeleteTd);

			// create button for: delete rule
			if(this.p.ruleButtons === true) {
				//MODIFED CSS FOR THIS
			var ruleDeleteInput = $("<input type='button' value='-' title='Delete rule' class='delete-rule ui-del ui-jqgrid-custom-button'/>");
			ruleDeleteTd.append(ruleDeleteInput);
			//$(ruleDeleteInput).html("").height(20).width(30).button({icons: {  primary: "ui-icon-minus", text:false}});
			ruleDeleteInput.bind('click',function() {
				// remove rule from group
				for (i = 0; i < group.rules.length; i++) {
					if (group.rules[i] === rule) {
						group.rules.splice(i, 1);
						break;
					}
				}

				that.reDraw(); // the html has changed, force reDraw

				that.onchange(); // signals that the filter has changed
				return false;
			});
			}
			return tr;
		};

		this.getStringForGroup = function(group) {
			var s = "(", index;
			if (group.groups !== undefined) {
				for (index = 0; index < group.groups.length; index++) {
					if (s.length > 1) {
						s += " " + group.groupOp + " ";
					}
					try {
						s += this.getStringForGroup(group.groups[index]);
					} catch (eg) {alert(eg);}
				}
			}

			if (group.rules !== undefined) {
				try{
					for (index = 0; index < group.rules.length; index++) {
						if (s.length > 1) {
							s += " " + group.groupOp + " ";
						}
						s += this.getStringForRule(group.rules[index]);
					}
				} catch (e) {alert(e);}
			}

			s += ")";

			if (s === "()") {
				return ""; // ignore groups that don't have rules
			} else {
				return s;
			}
		};
		this.getStringForRule = function(rule) {
			var opUF = "",opC="", i, cm, ret, val,
			numtypes = ['int', 'integer', 'float', 'number', 'currency']; // jqGrid
			for (i = 0; i < this.p.ops.length; i++) {
				if (this.p.ops[i].name === rule.op) {
					opUF = this.p.ops[i].operator;
					opC = this.p.ops[i].name;
					break;
				}
			}
			for (i=0; i<this.p.columns.length; i++) {
				if(this.p.columns[i].name === rule.field) {
					cm = this.p.columns[i];
					break;
				}
			}
			val = rule.data;
			if(opC === 'bw' || opC === 'bn') { val = val+"%"; }
			if(opC === 'ew' || opC === 'en') { val = "%"+val; }
			if(opC === 'cn' || opC === 'nc') { val = "%"+val+"%"; }
			if(opC === 'in' || opC === 'ni') { val = " ("+val+")"; }
			//MODIFED TO Support serach rules validation as per jgridUtils
			if(p.errorcheck) { checkData(rule.data, cm,tableId); }
			if($.inArray(cm.searchtype, numtypes) !== -1 || opC === 'nn' || opC === 'nu') { ret = rule.field + " " + opUF + " " + val; }
			else { ret = rule.field + " " + opUF + " \"" + val + "\""; }
			return ret;
		};
		this.resetFilter = function () {
			this.p.filter = $.extend(true,{},this.p.initFilter);
			this.reDraw();
			this.onchange();
		};
		this.hideError = function() {
			$("th.ui-state-error", this).html("");
			$("tr.error", this).hide();
		};
		this.showError = function() {
			$("th.ui-state-error", this).html(this.p.errmsg);
			$("tr.error", this).show();
		};
		this.toUserFriendlyString = function() {
			return this.getStringForGroup(p.filter);
		};
		this.toString = function() {
			// this will obtain a string that can be used to match an item.
			var that = this;
			function getStringRule(rule) {
				if(that.p.errorcheck) {
					var i, cm;
					for (i=0; i<that.p.columns.length; i++) {
						if(that.p.columns[i].name === rule.field) {
							cm = that.p.columns[i];
							break;
						}
					}
					//MODIFED TO Support serach rules validation as per jgridUtils
					if(cm) {checkData(rule.data, cm,tableId);}
				}
				return rule.op + "(item." + rule.field + ",'" + rule.data + "')";
			}

			function getStringForGroup(group) {
				var s = "(", index;

				if (group.groups !== undefined) {
					for (index = 0; index < group.groups.length; index++) {
						if (s.length > 1) {
							if (group.groupOp === "OR") {
								s += " || ";
							}
							else {
								s += " && ";
							}
						}
						s += getStringForGroup(group.groups[index]);
					}
				}

				if (group.rules !== undefined) {
					for (index = 0; index < group.rules.length; index++) {
						if (s.length > 1) {
							if (group.groupOp === "OR") {
								s += " || ";
							}
							else  {
								s += " && ";
							}
						}
						s += getStringRule(group.rules[index]);
					}
				}

				s += ")";

				if (s === "()") {
					return ""; // ignore groups that don't have rules
				} else {
					return s;
				}
			}

			return getStringForGroup(this.p.filter);
		};

		// Here we init the filter
		this.reDraw();

		if(this.p.showQuery) {
			this.onchange();
		}
		// mark is as created so that it will not be created twice on this element
		this.filter = true;
	});
};
$.extend($.fn.jqFilter,{
	/*
	 * Return SQL like string. Can be used directly
	 */
	toSQLString : function()
	{
		var s ="";
		this.each(function(){
			s = this.toUserFriendlyString();
		});
		return s;
	},
	/*
	 * Return filter data as object.
	 */
	filterData : function()
	{
		var s;
		this.each(function(){
			s = this.p.filter;
		});
		return s;

	},
	getParameter : function (param) {
		if(param !== undefined) {
			if (this.p.hasOwnProperty(param) ) {
				return this.p[param];
			}
		}
		return this.p;
	},
	resetFilter: function() {
		return this.each(function(){
			this.resetFilter();
		});
	},
	addFilter: function (pfilter) {
		if (typeof pfilter === "string") {
			pfilter = jQuery.jgrid.parse( pfilter );
	}
		this.each(function(){
			this.p.filter = pfilter;
			this.reDraw();
			this.onchange();
		});
	}

});
})(jQuery);


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * jqGrid extension for form editing Grid Data
 * Tony Tomov tony@trirand.com
 * http://trirand.com/blog/
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
**/
/*global xmlJsonClass, jQuery, $  */
(function($){

$.jgrid.extend({

	searchGrid : function (p) {
	p = $.extend({
		recreateFilter: false,
		drag: true,
		sField:'searchField',
		sValue:'searchString',
		sOper: 'searchOper',
		sFilter: 'filters',
        loadDefaults: true, // this options activates loading of default filters from grid's postData for Multipe Search only.
		beforeShowSearch: null,
		afterShowSearch : null,
		onInitializeSearch: null,
		afterRedraw : null,
		closeAfterSearch : false,
		closeAfterReset: false,
		closeOnEscape : false,
		multipleSearch : false,
		multipleGroup : false,
		//cloneSearchRowOnAdd: true,
		top : 0,
		left: 0,
		jqModal : true,
		modal: false,
		resize : true,
		width: 450,
		height: 'auto',
		dataheight: 'auto',
		showQuery: false,
		errorcheck : true,
		// translation
		// if you want to change or remove the order change it in sopt
		// ['eq','ne','lt','le','gt','ge','bw','bn','in','ni','ew','en','cn','nc'],
		sopt: null,
		stringResult: undefined,
		onClose : null,
		onSearch : null,
		onReset : null,
		toTop : true,
		overlay : 30,
		columns : [],
		tmplNames : null,
		tmplFilters : null,
		// translations - later in lang file
		tmplLabel : ' Template: ',
        showOnLoad: false,
        layer: null
	}, $.jgrid.search, p || {});
	return this.each(function() {
		var $t = this;
		if(!$t.grid) {return;}
		var fid = "fbox_"+$t.p.id,
		showFrm = true,
		IDs = {themodal:'searchmod'+fid,modalhead:'searchhd'+fid,modalcontent:'searchcnt'+fid, scrollelm : fid},
		defaultFilters  = $t.p.postData[p.sFilter];
		if(typeof(defaultFilters) === "string") {
			defaultFilters = $.jgrid.parse( defaultFilters );
		}
		if(p.recreateFilter === true) {
			$("#"+IDs.themodal).remove();
		}
		function showFilter() {
			if($.isFunction(p.beforeShowSearch)) {
				showFrm = p.beforeShowSearch($("#"+fid));
				if(typeof(showFrm) === "undefined") {
					showFrm = true;
				}
			}
			if(showFrm) {
				$.jgrid.viewModal("#"+IDs.themodal,{gbox:"#gbox_"+fid,jqm:p.jqModal, modal:p.modal, overlay: p.overlay, toTop: p.toTop});
				if($.isFunction(p.afterShowSearch)) {
					p.afterShowSearch($("#"+fid));
				}
			}
		}
		if ( $("#"+IDs.themodal).html() !== null ) {
			showFilter();
		} else {
			var fil = $("<div class='searchFilter_container'><div id='"+fid+"' class='searchFilter' style='overflow:auto'></div></div>").insertBefore("#gview_"+$t.p.id),
			align = "left", butleft =""; 
			if($t.p.direction == "rtl") {
				align = "right";
				butleft = " style='text-align:left'";
				fil.attr("dir","rtl");
			}
			if($.isFunction(p.onInitializeSearch) ) {
				p.onInitializeSearch($("#"+fid));
			}
			var columns = $.extend([],$t.p.colModel),
			//MODIFED TO CHANGE BUTTON STYLING
			bS  ="<input id='"+fid+"_search' name='"+fid+"_search' type='button' class='ui-jqgrid-custom-button' value='Search'  />",
			bC  ="<input id='"+fid+"_reset' name='"+fid+"_search' type='button' class='ui-jqgrid-custom-button' value='Reset'  />",
//			bS  ="<a href='javascript:void(0)' id='"+fid+"_search' class='fm-button ui-state-default ui-corner-all fm-button-icon-right ui-reset'><span class='ui-icon ui-icon-search'></span>"+p.Find+"</a>",
//			bC  ="<a href='javascript:void(0)' id='"+fid+"_reset' class='fm-button ui-state-default ui-corner-all fm-button-icon-left ui-search'><span class='ui-icon ui-icon-arrowreturnthick-1-w'></span>"+p.Reset+"</a>",
			bQ = "", tmpl="", colnm, found = false, bt, cmi=-1;
			if(p.showQuery) {
				bQ ="<a href='javascript:void(0)' id='"+fid+"_query' class='fm-button ui-state-default ui-corner-all fm-button-icon-left'><span class='ui-icon ui-icon-comment'></span>Query</a>";
			}
			if(!p.columns.length) {
				$.each(columns, function(i,n){
					if(!n.label) {
						n.label = $t.p.colNames[i];
					}
					// find first searchable column and set it if no default filter
					if(!found) {
						var searchable = (typeof n.search === 'undefined') ?  true: n.search ,
						hidden = (n.hidden === true),
						ignoreHiding = (n.searchoptions && n.searchoptions.searchhidden === true);
						if ((ignoreHiding && searchable) || (searchable && !hidden)) {
							found = true;
							colnm = n.index || n.name;
							cmi =i;
						}
					}
				});
			} else {
				columns = p.columns;
			}
			// old behaviour
			if( (!defaultFilters && colnm) || p.multipleSearch === false  ) {
				var cmop = "eq";
				if(cmi >=0 && columns[cmi].searchoptions && columns[cmi].searchoptions.sopt) {
					cmop = columns[cmi].searchoptions.sopt[0];
				} else if(p.sopt && p.sopt.length) {
					cmop = p.sopt[0];
				}
				defaultFilters = {"groupOp": "AND",rules:[{"field":colnm,"op":cmop,"data":""}]};
			}
			found = false;
			if(p.tmplNames && p.tmplNames.length) {
				found = true;
				tmpl = p.tmplLabel;
				tmpl += "<select class='ui-template'>";
				tmpl += "<option value='default'>Default</option>";
				$.each(p.tmplNames, function(i,n){
					tmpl += "<option value='"+i+"'>"+n+"</option>";
				});
				tmpl += "</select>";
			}

			bt = "<table class='search_button' style='width:99%;border:0px none;margin-top:0px' id='"+fid+"_2'><tbody><tr><td colspan='2' align='right' >"+bS+"&nbsp;&nbsp;&nbsp;"+bC+"</td></tr></tbody></table>";
			$("#"+fid).jqFilter({
				columns : columns,
				filter: p.loadDefaults ? defaultFilters : null,
				showQuery: p.showQuery,
				errorcheck : p.errorcheck,
				sopt: p.sopt,
				groupButton : p.multipleGroup,
				ruleButtons : p.multipleSearch,
				afterRedraw : p.afterRedraw,
				_gridsopt : $.jgrid.search.odata,
				onChange : function( sp ) {
//				MODIFIED FOR BUTTON SYTLING	
//				if(this.p.showQuery) {
						$('.query',this).html(this.toUserFriendlyString());
//					}
				},
				direction : $t.p.direction
			});
//			alert(fil.html());
			fil.append( bt );
			if(found && p.tmplFilters && p.tmplFilters.length) {
				$(".ui-template", fil).bind('change', function(e){
					var curtempl = $(this).val();
					if(curtempl=="default") {
						$("#"+fid).jqFilter('addFilter', defaultFilters);
					} else {
						$("#"+fid).jqFilter('addFilter', p.tmplFilters[parseInt(curtempl,10)]);
					}
					return false;
				});
			}
			if(p.multipleGroup === true) p.multipleSearch = true;
			if($.isFunction(p.onInitializeSearch) ) {
				p.onInitializeSearch($("#"+fid));
			}
			p.gbox = "#gbox_"+fid;
			$("#"+p.layer).html(fil);
		/*	if (p.layer)
				$.jgrid.createModal(IDs ,fil,p,"#gview_"+$t.p.id,$("#gbox_"+$t.p.id)[0], "#"+p.layer, {position: "relative"});
			else
				$.jgrid.createModal(IDs ,fil,p,"#gview_"+$t.p.id,$("#gbox_"+$t.p.id)[0]);*/
			if(bQ) {
				$("#"+fid+"_query").bind('click', function(e){
					$(".queryresult", fil).toggle();
					return false;
				});
			}
			if (p.stringResult===undefined) {
				// to provide backward compatibility, inferring stringResult value from multipleSearch
				p.stringResult = p.multipleSearch;
			}
			$("#"+fid+"_search").bind('click', function(){
				var fl = $("#"+fid),
				sdata={}, res ,
				filters = fl.jqFilter('filterData');
				if(p.errorcheck) {
					fl[0].hideError();
					if(!p.showQuery) {fl.jqFilter('toSQLString');}
					if(fl[0].p.error) {
						//fl[0].showError();MODIFIED to not show error
						return false;
					}
				}

				if(p.stringResult) {
					try {
						// xmlJsonClass or JSON.stringify
						res = xmlJsonClass.toJson(filters, '', '', false);
					} catch (e) {
						try {
							res = JSON.stringify(filters);
						} catch (e2) { }
					}
					if(typeof(res)==="string") {
						sdata[p.sFilter] = res;
						$.each([p.sField,p.sValue, p.sOper], function() {sdata[this] = "";});
					}
				} else {
					if(p.multipleSearch) {
						sdata[p.sFilter] = filters;
						$.each([p.sField,p.sValue, p.sOper], function() {sdata[this] = "";});
					} else {
						sdata[p.sField] = filters.rules[0].field;
						sdata[p.sValue] = filters.rules[0].data;
						sdata[p.sOper] = filters.rules[0].op;
						sdata[p.sFilter] = "";
					}
				}
				$t.p.search = true;
				$.extend($t.p.postData,sdata);
				if($.isFunction(p.onSearch) ) {
					p.onSearch();
				}
				$($t).trigger("reloadGrid",[{page:1}]);
				if(p.closeAfterSearch) {
					$.jgrid.hideModal("#"+IDs.themodal,{gb:"#gbox_"+$t.p.id,jqm:p.jqModal,onClose: p.onClose});
				}
				return false;
			});
			$("#"+fid+"_reset").bind('click', function(){
				var sdata={},
				fl = $("#"+fid);
				$t.p.search = false;
				if(p.multipleSearch===false) {
					sdata[p.sField] = sdata[p.sValue] = sdata[p.sOper] = "";
				} else {
					sdata[p.sFilter] = "";
				}
				fl[0].resetFilter();
				if(found) {
					$(".ui-template", fil).val("default");
				}
				$.extend($t.p.postData,sdata);
				if($.isFunction(p.onReset) ) {
					p.onReset();
				}
				$($t).trigger("reloadGrid",[{page:1}]);
				return false;
			});
			showFilter();
			$(".fm-button:not(.ui-state-disabled)",fil).hover(
			   function(){$(this).addClass('ui-state-hover');},
			   function(){$(this).removeClass('ui-state-hover');}
			);
		}
	});
},

navGrid : function (elem, o, pEdit,pAdd,pDel,pSearch, pView) {
	o = $.extend({
		edit: true,
		editicon: "ui-icon-pencil",
		add: true,
		addicon:"ui-icon-plus",
		del: true,
		delicon:"ui-icon-trash",
		search: true,
		searchicon:"ui-icon-search",
		refresh: true,
		refreshicon:"ui-icon-refresh",
		refreshstate: 'firstpage',
		view: false,
		viewicon : "ui-icon-document",
		position : "left",
		closeOnEscape : true,
		beforeRefresh : null,
		afterRefresh : null,
		cloneToTop : false,
		alertwidth : 200,
		alertheight : 'auto',
		alerttop: null,
		alertleft: null,
		alertzIndex : null
	}, $.jgrid.nav, o ||{});
	return this.each(function() {
		if(this.nav) {return;}
		var alertIDs = {themodal:'alertmod',modalhead:'alerthd',modalcontent:'alertcnt'},
		$t = this, twd, tdw;
		if(!$t.grid || typeof elem != 'string') {return;}
		if ($("#"+alertIDs.themodal).html() === null) {
			if(!o.alerttop && !o.alertleft) {
				if (typeof window.innerWidth != 'undefined') {
					o.alertleft = window.innerWidth;
					o.alerttop = window.innerHeight;
				} else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth !== 0) {
					o.alertleft = document.documentElement.clientWidth;
					o.alerttop = document.documentElement.clientHeight;
				} else {
					o.alertleft=1024;
					o.alerttop=768;
				}
				o.alertleft = o.alertleft/2 - parseInt(o.alertwidth,10)/2;
				o.alerttop = o.alerttop/2-25;
			}
			$.jgrid.createModal(alertIDs,"<div>"+o.alerttext+"</div><span tabindex='0'><span tabindex='-1' id='jqg_alrt'></span></span>",{gbox:"#gbox_"+$t.p.id,jqModal:true,drag:true,resize:true,caption:o.alertcap,top:o.alerttop,left:o.alertleft,width:o.alertwidth,height: o.alertheight,closeOnEscape:o.closeOnEscape, zIndex: o.alertzIndex},"","",true);
		}
		var clone = 1;
		if(o.cloneToTop && $t.p.toppager) {clone = 2;}
		for(var i = 0; i<clone; i++) {
			var tbd,
			//modified for position buttons to right
//			navtbl = $("<table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table navtable' style='float:left;table-layout:auto;'><tbody><tr></tr></tbody></table>"),
			navtbl = $("<table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table navtable' style='float:right;table-layout:auto;'><tbody><tr></tr></tbody></table>"),
			sep = "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>",
			pgid, elemids;
			if(i===0) {
				pgid = elem;
				elemids = $t.p.id;
				if(pgid == $t.p.toppager) {
					elemids += "_top";
					clone = 1;
				}
			} else {
				pgid = $t.p.toppager;
				elemids = $t.p.id+"_top";
			}
			if($t.p.direction == "rtl") {$(navtbl).attr("dir","rtl").css("float","right");}
			if (o.add) {
				pAdd = pAdd || {};
				tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
				$(tbd).append("<div class='ui-pg-div'><span class='ui-icon "+o.addicon+"'></span>"+o.addtext+"</div>");
				$("tr",navtbl).append(tbd);
				$(tbd,navtbl)
				.attr({"title":o.addtitle || "",id : pAdd.id || "add_"+elemids})
				.click(function(){
					if (!$(this).hasClass('ui-state-disabled')) {
						if ($.isFunction( o.addfunc )) {
							o.addfunc();
						} else {
							$($t).jqGrid("editGridRow","new",pAdd);
						}
					}
					return false;
				}).hover(
					function () {
						if (!$(this).hasClass('ui-state-disabled')) {
							$(this).addClass("ui-state-hover");
						}
					},
					function () {$(this).removeClass("ui-state-hover");}
				);
				tbd = null;
			}
			if (o.edit) {
				tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
				pEdit = pEdit || {};
				$(tbd).append("<div class='ui-pg-div'><span class='ui-icon "+o.editicon+"'></span>"+o.edittext+"</div>");
				$("tr",navtbl).append(tbd);
				$(tbd,navtbl)
				.attr({"title":o.edittitle || "",id: pEdit.id || "edit_"+elemids})
				.click(function(){
					if (!$(this).hasClass('ui-state-disabled')) {
						var sr = $t.p.selrow;
						if (sr) {
							if($.isFunction( o.editfunc ) ) {
								o.editfunc(sr);
							} else {
								$($t).jqGrid("editGridRow",sr,pEdit);
							}
						} else {
							$.jgrid.viewModal("#"+alertIDs.themodal,{gbox:"#gbox_"+$t.p.id,jqm:true});
							$("#jqg_alrt").focus();
						}
					}
					return false;
				}).hover(
					function () {
						if (!$(this).hasClass('ui-state-disabled')) {
							$(this).addClass("ui-state-hover");
						}
					},
					function () {$(this).removeClass("ui-state-hover");}
				);
				tbd = null;
			}
			if (o.view) {
				tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
				pView = pView || {};
				$(tbd).append("<div class='ui-pg-div'><span class='ui-icon "+o.viewicon+"'></span>"+o.viewtext+"</div>");
				$("tr",navtbl).append(tbd);
				$(tbd,navtbl)
				.attr({"title":o.viewtitle || "",id: pView.id || "view_"+elemids})
				.click(function(){
					if (!$(this).hasClass('ui-state-disabled')) {
						var sr = $t.p.selrow;
						if (sr) {
							if($.isFunction( o.viewfunc ) ) {
								o.viewfunc(sr);
							} else {
								$($t).jqGrid("viewGridRow",sr,pView);
							}
						} else {
							$.jgrid.viewModal("#"+alertIDs.themodal,{gbox:"#gbox_"+$t.p.id,jqm:true});
							$("#jqg_alrt").focus();
						}
					}
					return false;
				}).hover(
					function () {
						if (!$(this).hasClass('ui-state-disabled')) {
							$(this).addClass("ui-state-hover");
						}
					},
					function () {$(this).removeClass("ui-state-hover");}
				);
				tbd = null;
			}
			if (o.del) {
				tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
				pDel = pDel || {};
				$(tbd).append("<div class='ui-pg-div'><span class='ui-icon "+o.delicon+"'></span>"+o.deltext+"</div>");
				$("tr",navtbl).append(tbd);
				$(tbd,navtbl)
				.attr({"title":o.deltitle || "",id: pDel.id || "del_"+elemids})
				.click(function(){
					if (!$(this).hasClass('ui-state-disabled')) {
						var dr;
						if($t.p.multiselect) {
							dr = $t.p.selarrrow;
							if(dr.length===0) {dr = null;}
						} else {
							dr = $t.p.selrow;
						}
						if(dr){
							if("function" == typeof o.delfunc){
								o.delfunc(dr);
							}else{
								$($t).jqGrid("delGridRow",dr,pDel);
							}
						} else  {
							$.jgrid.viewModal("#"+alertIDs.themodal,{gbox:"#gbox_"+$t.p.id,jqm:true});$("#jqg_alrt").focus();
						}
					}
					return false;
				}).hover(
					function () {
						if (!$(this).hasClass('ui-state-disabled')) {
							$(this).addClass("ui-state-hover");
						}
					},
					function () {$(this).removeClass("ui-state-hover");}
				);
				tbd = null;
			}
			if(o.add || o.edit || o.del || o.view) {$("tr",navtbl).append(sep);}
			if (o.search) {
				tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
				pSearch = pSearch || {};
				$(tbd).append("<div class='ui-pg-div'><span class='ui-icon "+o.searchicon+"'></span>"+o.searchtext+"</div>");
				$("tr",navtbl).append(tbd);
				$(tbd,navtbl)
				.attr({"title":o.searchtitle  || "",id:pSearch.id || "search_"+elemids})
				.click(function(){
					if (!$(this).hasClass('ui-state-disabled')) {
						$($t).jqGrid("searchGrid",pSearch);
					}
					return false;
				}).hover(
					function () {
						if (!$(this).hasClass('ui-state-disabled')) {
							$(this).addClass("ui-state-hover");
						}
					},
					function () {$(this).removeClass("ui-state-hover");}
				);
				if (pSearch.showOnLoad && pSearch.showOnLoad === true)
					$(tbd,navtbl).click();
				tbd = null;
			}
			if (o.refresh) {
				tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
				$(tbd).append("<div class='ui-pg-div'><span class='ui-icon "+o.refreshicon+"'></span>"+o.refreshtext+"</div>");
				$("tr",navtbl).append(tbd);
				$(tbd,navtbl)
				.attr({"title":o.refreshtitle  || "",id: "refresh_"+elemids})
				.click(function(){
					if (!$(this).hasClass('ui-state-disabled')) {
						if($.isFunction(o.beforeRefresh)) {o.beforeRefresh();}
						$t.p.search = false;
						try {
							var gID = $t.p.id;
							$t.p.postData.filters ="";
							$("#fbox_"+gID).jqFilter('resetFilter');
						    if($.isFunction($t.clearToolbar)) {$t.clearToolbar(false);}
						} catch (e) {}
						switch (o.refreshstate) {
							case 'firstpage':
							    $($t).trigger("reloadGrid", [{page:1}]);
								break;
							case 'current':
							    $($t).trigger("reloadGrid", [{current:true}]);
								break;
						}
						if($.isFunction(o.afterRefresh)) {o.afterRefresh();}
					}
					return false;
				}).hover(
					function () {
						if (!$(this).hasClass('ui-state-disabled')) {
							$(this).addClass("ui-state-hover");
						}
					},
					function () {$(this).removeClass("ui-state-hover");}
				);
				tbd = null;
			}
			tdw = $(".ui-jqgrid").css("font-size") || "11px";
			$('body').append("<div id='testpg2' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:"+tdw+";visibility:hidden;' ></div>");
			twd = $(navtbl).clone().appendTo("#testpg2").width();
			$("#testpg2").remove();
			$(pgid+"_"+o.position,pgid).append(navtbl);
			if($t.p._nvtd) {
				if(twd > $t.p._nvtd[0] ) {
					$(pgid+"_"+o.position,pgid).width(twd);
					$t.p._nvtd[0] = twd;
				}
				$t.p._nvtd[1] = twd;
			}
			tdw =null;twd=null;navtbl =null;
			this.nav = true;
		}
	});
}
});
})(jQuery);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 * Note Functions in setPager could not be overriden this has to be changed in source file
$.extend($.fn.jqGrid,{ 
	 setPager = function (pgid, tp){
         // TBD - consider escaping pgid with pgid = $.jgrid.jqID(pgid);
			var sep = "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>",
			pginp = "",
			pgl="<table cellspacing='0' cellpadding='0' border='0' style='table-layout:auto;' class='ui-pg-table'><tbody><tr>",
			str="", pgcnt, lft, cent, rgt, twd, tdw, i,
			clearVals = function(onpaging){
				var ret;
				if ($.isFunction(ts.p.onPaging) ) { ret = ts.p.onPaging.call(ts,onpaging); }
				ts.p.selrow = null;
				if(ts.p.multiselect) {ts.p.selarrrow =[];$('#cb_'+$.jgrid.jqID(ts.p.id),ts.grid.hDiv)[ts.p.useProp ? 'prop': 'attr']("checked", false);}
				ts.p.savedRow = [];
				if(ret=='stop') {return false;}
				return true;
			};
			pgid = pgid.substr(1);
			tp += "_" + pgid;
			pgcnt = "pg_"+pgid;
			lft = pgid+"_right"; cent = pgid+"_center"; rgt = pgid+"_left";
			//Modified for positioning buttons to right
			//lft = pgid+"_left"; cent = pgid+"_center"; rgt = pgid+"_right";
//			alert("#"+$.jgrid.jqID(pgid) );
			$("#"+$.jgrid.jqID(pgid) )
			.append("<div id='"+pgcnt+"' class='ui-pager-control' role='group'><table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table' style='width:100%;table-layout:fixed;height:100%;' role='row'><tbody><tr><td id='"+lft+"' align='left'></td><td id='"+cent+"' align='center' style='white-space:pre;'></td><td id='"+rgt+"' align='right'></td></tr></tbody></table></div>")
			.attr("dir","ltr"); //explicit setting
			if(ts.p.rowList.length >0){
				str = "<td dir='"+dir+"'>";
				str +="<select class='ui-pg-selbox' role='listbox'>";
				for(i=0;i<ts.p.rowList.length;i++){
					str +="<option role=\"option\" value=\""+ts.p.rowList[i]+"\""+((ts.p.rowNum == ts.p.rowList[i])?" selected=\"selected\"":"")+">"+ts.p.rowList[i]+"</option>";
				}
				str +="</select></td>";
			}
			if(dir=="rtl") { pgl += str; }
			if(ts.p.pginput===true) { pginp= "<td dir='"+dir+"'>"+$.jgrid.format(ts.p.pgtext || "","<input class='ui-pg-input' type='text' size='2' maxlength='7' value='0' role='textbox'/>","<span id='sp_1_"+$.jgrid.jqID(pgid)+"'></span>")+"</td>";}
			if(ts.p.pgbuttons===true) {
				var po=["first"+tp,"prev"+tp, "next"+tp,"last"+tp]; if(dir=="rtl") { po.reverse(); }
				pgl += "<td id='"+po[0]+"' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-first'></span></td>";
				pgl += "<td id='"+po[1]+"' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-prev'></span></td>";
				pgl += pginp !== "" ? sep+pginp+sep:"";
				pgl += "<td id='"+po[2]+"' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-next'></span></td>";
				pgl += "<td id='"+po[3]+"' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-end'></span></td>";
			} else if (pginp !== "") { pgl += pginp; }
			if(dir=="ltr") { pgl += str; }
			pgl += "</tr></tbody></table>";
			//Modified for positioning view all records to left and buttons to right
//			if(ts.p.viewrecords===true) {$("td#"+pgid+"_"+ts.p.recordpos,"#"+pgcnt).append("<div dir='"+dir+"' style='text-align:"+ts.p.recordpos+"' class='ui-paging-info'></div>");}
			if(ts.p.viewrecords===true) {$("td#"+pgid+"_"+ts.p.recordpos,"#"+pgcnt).append("<div dir='"+dir+"' style='text-align:left' class='ui-paging-info'></div>");}
			$("td#"+pgid+"_"+ts.p.pagerpos,"#"+pgcnt).append(pgl);
			tdw = $(".ui-jqgrid").css("font-size") || "11px";
			$(document.body).append("<div id='testpg' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:"+tdw+";visibility:hidden;' ></div>");
			twd = $(pgl).clone().appendTo("#testpg").width();
			$("#testpg").remove();
			if(twd > 0) {
				if(pginp !== "") { twd += 50; } //should be param
				$("td#"+pgid+"_"+ts.p.pagerpos,"#"+pgcnt).width(twd);
			}
			ts.p._nvtd = [];
			ts.p._nvtd[0] = twd ? Math.floor((ts.p.width - twd)/2) : Math.floor(ts.p.width/3);
			ts.p._nvtd[1] = 0;
			pgl=null;
			$('.ui-pg-selbox',"#"+pgcnt).bind('change',function() {
				ts.p.page = Math.round(ts.p.rowNum*(ts.p.page-1)/this.value-0.5)+1;
				ts.p.rowNum = this.value;
				if(tp) { $('.ui-pg-selbox',ts.p.pager).val(this.value); }
				else if(ts.p.toppager) { $('.ui-pg-selbox',ts.p.toppager).val(this.value); }
				if(!clearVals('records')) { return false; }
				populate();
				return false;
			});
			if(ts.p.pgbuttons===true) {
			$(".ui-pg-button","#"+pgcnt).hover(function(e){
				if($(this).hasClass('ui-state-disabled')) {
					this.style.cursor='default';
				} else {
					$(this).addClass('ui-state-hover');
					this.style.cursor='pointer';
				}
			},function(e) {
				if($(this).hasClass('ui-state-disabled')) {
				} else {
					$(this).removeClass('ui-state-hover');
					this.style.cursor= "default";
				}
			});
			$("#first"+$.jgrid.jqID(tp)+", #prev"+$.jgrid.jqID(tp)+", #next"+$.jgrid.jqID(tp)+", #last"+$.jgrid.jqID(tp)).click( function(e) {
				var cp = intNum(ts.p.page,1),
				last = intNum(ts.p.lastpage,1), selclick = false,
				fp=true, pp=true, np=true,lp=true;
				if(last ===0 || last===1) {fp=false;pp=false;np=false;lp=false; }
				else if( last>1 && cp >=1) {
					if( cp === 1) { fp=false; pp=false; }
					else if( cp>1 && cp <last){ }
					else if( cp===last){ np=false;lp=false; }
				} else if( last>1 && cp===0 ) { np=false;lp=false; cp=last-1;}
				if( this.id === 'first'+tp && fp ) { ts.p.page=1; selclick=true;}
				if( this.id === 'prev'+tp && pp) { ts.p.page=(cp-1); selclick=true;}
				if( this.id === 'next'+tp && np) { ts.p.page=(cp+1); selclick=true;}
				if( this.id === 'last'+tp && lp) { ts.p.page=last; selclick=true;}
				if(selclick) {
					if(!clearVals(this.id)) { return false; }
					populate();
				}
				return false;
			});
			}
			if(ts.p.pginput===true) {
			$('input.ui-pg-input',"#"+pgcnt).keypress( function(e) {
				var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
				if(key == 13) {
					ts.p.page = ($(this).val()>0) ? $(this).val():ts.p.page;
					if(!clearVals('user')) { return false; }
					populate();
					return false;
				}
				return this;
			});
			}
		}		
});
	*/