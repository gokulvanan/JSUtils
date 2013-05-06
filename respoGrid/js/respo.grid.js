

/* TODO:
    build client side
        sorting
        pagination
        search
    build server side
        sorting
        pagination
        search

    build scorllable table

    build options to construct search div from table colums. 
    build options to provide priority in the order to hide columns

    capitalize on bootstrap responsive js and css to make elements changea as per screen resolution.. including font size

*/

(function ($,window) {

	var defaults = {
		// "colNames":[],
		"colDefs":[],
		"width":0.985,
		"height":0.5,
		"data":[],
		"tableId":"respoTable"
	}
    var totalWidth=0;
    var hideableCols = new Array(), hiddenCols = new Array();
    var colSpanSize=0;
    var scrollBarPadding=14; // added to provide padding to last header column for scrollbar
    // var plusPatt = /icon-plus/;
    // var minusPatt = /icon-minus/;
    // plusPatt.compile();
    // minusPatt.compile();

	$.fn.respoTable = function (options) {
        options = options || {};
        var opts = $.extend(true, {}, defaults, options); //merge user and default options
        var t = this;
        var msg = _validate(opts);
        if(msg) throw msg;
        var $window = $(window);
        colSpanSize=opts.colDefs.length;
        //setDiv height and width
        
        var $div = $("#"+t.selector);
        // console.log($div);
        $div.css("overflow-y:auto;");
 


        //build gridHeader
        var table = new Array();
        table.push('<table id="head" class="table table table-bordered table-striped" style="margin-bottom:0px;">');
        buildHeader(table,opts);
        table.push('</table>');
        var $head = $(table.join(""));
        console.log($head);
        $div.append($head);
        var ht = $window.innerHeight()*opts.height;
        var $bodyDiv = $('<div id="respoGridBody" style="top:0px;overflow-y:scroll;height:'+ht+'px"></div>');

        table = new Array();
        table.push('<table id="body" class="table table table-bordered table-striped ">');
        buildBody(table,opts);
        table.push('</table>');
        var $table = $(table.join(""));
        
        $(window).bind("resize", function(){ setTimeout(function(){resize($table,opts);},100)});//delay to prevent overload for frequent resizes
        $bodyDiv.append($table);
        $div.append($bodyDiv);
        $("a.respo_expand",$table).bind("click",function(event){ event.preventDefault(); showDetails(this);});
        $("a.respo_minimize",$table).bind("click",function(event){ event.preventDefault();  hideDetails(this);});
        resize($table,opts);
    };

    
    function showDetails(elm){
        var $elm = $(elm);
        $elm.hide();
        $elm.next().show(); 
        var tr = $elm.parent().parent();
        var desc = buildDesc($(tr).attr("id"));
        desc.insertAfter($(tr));
        // console.log(elm);
    }

    function hideDetails(elm){
        var $elm = $(elm);
        // elm.preventDefault();
        $elm.hide();
        $elm.prev().show(); 
        var tr = $elm.parent().parent();
        $(tr).next().remove();
        // console.log(elm); 
    }

    function buildDesc(id){
        var str = new Array();
        // var ht = hiddenCols.length;
        str.push("<tr id='"+id+"_details' class='respo_details_row'>");
        str.push("<td class='respo_details_backdrop' colspan='"+colSpanSize+"'>");
        str.push(detailScreen(id));
        str.push("</td>");
        str.push("</tr>");
        return $(str.join(""));
    }
    
    function detailScreen(id){
        var str = new Array();
        str.push("<div id='"+id+"_div'>");
        str.push("<ul>");
        for(var i=0; i<hiddenCols.length; i++){
            var def=hiddenCols[i];
            str.push("<li>");
            str.push("<b>");
            str.push(def.label);
            str.push("</b> :");
            str.push(getRowVal(id,def.name));      
            str.push("</li>"); 
        }
        str.push("</ul>");
        str.push("</div>");
        return str.join("");
    }

    function getRowVal(id,name){
        var td = $("td."+name,$("tr#"+id));
        return $(td).html();
    }


    function resize($table,opts){
        var colDefs = opts.colDefs;
        var windowWidth=$(window).innerWidth();
        // console.log(windowWidth);
        // console.log("tableWidth"+totalWidth)
        if(totalWidth<= windowWidth){
            //show hidden columns in hidden Columns list
            while(hiddenCols.length >0){
                var col = hiddenCols.pop(0);
                if(totalWidth+col.minWidth > windowWidth){
                    hiddenCols.push(col);
                    break;
                }
                totalWidth += col.minWidth
                $("."+col.name).show();
                hideableCols.push(col);
            }
        } else{
            // hide columns in hideable columns list
            while(hideableCols.length >0){
                var col = hideableCols.pop(0);
                $("."+col.name).hide();
                hiddenCols.push(col);
                totalWidth -= col.minWidth;
                if(totalWidth <= windowWidth) break;
            }  
        }
        
        $("a.respo_minimize",$table).hide();
        $("tr.respo_details_row",$table).remove();
        if(hiddenCols.length === 0) $("a.respo_expand",$table).hide();
        else                        $("a.respo_expand",$table).show();
    }


    /*function shuffle(arr){
           for (int i = 0; i < N; i++) {
            // int from remainder of deck
            int r = i + (int) (Math.random() * (N - i));
            String swap = a[r];
            a[r] = a[i];
            a[i] = swap;
        }
    }
*/
    function compareColDef(a,b){
        return parseInt(a.minWidth - b.minWidth);
    }

    function buildBody(table,opts){
    	table.push('<tbody>');
    	for(var i=0; i<opts.data.length; i++){
    		var row = opts.data[i];
    		var id = row.id || i;
    		table.push("<tr id='"+id+"' class='mainRow'>");
    		for(var j=0; j<opts.colDefs.length; j++){
    			var def = opts.colDefs[j];
    			table.push("<td class='"+def.name+"' style='width:"+def.minWidth+"px;'>");
                if(def.main){
                  table.push("<a href='#' class='respo_expand icon-plus-sign' style='display:none;' >&nbsp;</a>");
                  table.push("<a href='#' class='respo_minimize icon-minus-sign' style='display:none;' >&nbsp;</a>&nbsp;")  
                } 
				table.push((def.format)? def.format(row[def.name]) : row[def.name]);
    			table.push("</td>");
    		}
    		table.push("</tr>");
    	}
		table.push('</tbody>');					
    }

    function buildHeader(table,opts){
        // console.log(totalWidth)
    	table.push("<thead>");
    	table.push("<tr class='mainHeaderRow'>");
    	for(var i=0; i<opts.colDefs.length; i++){
    		var def = opts.colDefs[i];
            var wt =  def.minWidth;
            var flag="";
            if(i == opts.colDefs.length-1){
                wt +=scrollBarPadding;
                def.scrollBarPadded=true;// flag to identify this colum is scorllBarPadded
            }
            totalWidth += wt;
            if(def.hideable)hideableCols.push(def);
            table.push('<th class="btn-inverse '+def.name+'" style="width:'+wt+'px;"');
    		table.push('>');
  			table.push(def.label);
            if(def.sort){
                console.log("here")
                table.push("<a href='#' id='"+def.name+"_asc' class=' icon-up-arrow icon-white' >&nbsp;</a>" );
                table.push("<a href='#' id='"+def.name+"_desc' class='icon-down-arrow icon-white' style='display:none'>&nbsp;</a>" );
            } 
			table.push('</th>');
    	}
    	table.push("</tr>");
    	table.push("</thead>");
        hideableCols.sort(compareColDef); // sort by minWidth desc
    }

    
    function _validate(){

        // check for mandatory colDef Params .. minWidth and name
    	return null;
    }


})(jQuery,window);
