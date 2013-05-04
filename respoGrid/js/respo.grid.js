

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
  //    positionDiv($div,opts.width,opts.innerHeightght,$(window).innerWidth(),$(window).innerHeight());
        // $(window).bind("resize", function(){
        //  positionDiv($div,opts.width,opts.height,$(window).innerWidth(),$(window).innerHeight());
  //    });


        //build gridHeader
        var table = new Array();
        table.push('<table class="table table table-bordered table-striped ">');
        buildHeader(table,opts);
        buildBody(table,opts);
        table.push('</table>');
        // console.log(table.join(""));
        var $table = $(table.join(""));
        
        //$table.footable(); // trigger footable mapping for responsiveness
        // $div.html(table.join(""));
        $(window).bind("resize", function(){ setTimeout(function(){resize($table,opts);},100)});//delay to prevent overload for frequent resizes
        $div.append($table);
        $("a.respo_expand",$table).bind("click",function(event){ event.preventDefault(); showDetails(this);});
        $("a.respo_minimize",$table).bind("click",function(event){ event.preventDefault();  hideDetails(this);});
        resize($table,opts);
    };

    /*
        TODO: Need to add minus icon alos hidden and present during table creation itself. 
        as changing class doesnt seem to render it.. need to check this 
        need to build a description row and remove description row 
        need to bind resize to keep reset plus-minus toggle if any before resize
    */
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
    			table.push("<td class='"+def.name+"'>");
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
            totalWidth += def.minWidth;

            // if(def.hideable)hideableCols.push({"index":i, "colDef":def
            if(def.hideable)hideableCols.push(def);
            table.push('<th class="btn-inverse '+def.name+'" style="width:'+def.minWidth+'px;"');
    		table.push('>');
  			table.push(def.label);
			table.push('</th>');
    	}
    	table.push("</tr>");
    	table.push("</thead>");
        hideableCols.sort(compareColDef); // sort by minWidth desc
    }

    function positionDiv($div,width,height,windowWidth,windowHeight){
    		// $div.css("width",function(){return getPercentVal(windowWidth,width)});
			$div.css("height",function(){return getPercentVal(windowHeight,height)});
	}

    function getPercentVal(val,percent){
    	return (val*percent);
    }

    function _validate(){

        // check for colNames to match colDefs
        // check for mandatory colDef Params .. minWidth and name
    	return null;
    }


})(jQuery,window);
