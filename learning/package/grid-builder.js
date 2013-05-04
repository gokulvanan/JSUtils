
window.Grid = function(config){

	var conf = $.extend({
		colDefs:[],
		colNames:[],
		dataType:"local",
		data:null,
		sortCol:null,
		sortDir:"asc",
		div:null,
		pagnDiv:null,
		searchDiv:null
	},config);

	function renderGrid(){
		var $div =  $(conf.div);
		if(!$(conf.div).exist()) alert("Table Div id needs to be configured");
		if(conf.colNames.length !== conf.colDefs.length) alert("ColNames and ColDefss dont match");

		$div.attr("class","container table-bordered table-striped");// bootstrap css inclusion

		var table = new Array();
		table.push("<table class='table'>");
		table.push(buildHeader()); // build header
		var data = conf.data;
		table.push(buildBody(data));
		table.push("</table>");
		$div.html(table.join(" "));
	}

	function buildHeader(){
		var header = new Array();
		header.push("<thead>");
		header.push("<tr>");
		for(var i=0,len=conf.colNames.length; i<len; i++){
			header.push("<th>");
			header.push(colNames[i]);
			header.push("</th>");
		}
		header.push("</tr>");
		header.push("</thead>")
		return header.join(" ");
	}

	function buildBody(data){
		var body = new Array();
		var col = conf.colDefs;
		body.push("<tbody>");
		for(var i=0,len=data.length; i<len; i++){
			var row = data[i];
			body.push("<tr id='");
			body.push(data.id || i);
			body.push("'>");
			for(var j=0,len=col.length; j<len; j++){
				body.push("<td id='");
				body.push(col.id);
				body.push("'>")
				body.push(row[col.index]);
				body.push("</td>");
			}
			body.push("</tr>");
		}
		body.push("</tbody>");
		return body.join(" ");
	}
		
	return{
		render: renderGrid,
		reload: reladGrid,
		clear: clearGrid

	}
};