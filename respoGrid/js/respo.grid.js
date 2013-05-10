

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

String.prototype.trim= function ()
    {
        return this.replace(/^\s*|\s*$/g,"");
    };


    /**
     * Note: the method below works like contains of ArrayList in java.
     * @param key (String/ number)
     * @return Boolean
     */
    Array.prototype.contains= function (key)
    {
        try{
            if(!this)//condition is true for this= null or undefined
                return false;
            else
            {
                for(var i=0 in this)    
                {

                    if (this[i])
                    {

                        if(typeof this[i]=="string" && typeof key=="string" && this[i].trim()==key.trim())
                            return true;

                        else if(typeof this[i]=="number"  && typeof key=="number" &&this[i]==key)
                            return true;
                        else 
                            continue;
                    }
                }
                return false;
            }

        }catch(err)
        {
            alert("Error in prototype Array.prototype.contains method err Msg-"+err.message);
            return false;
        }
    };

(function ($,window) {

	var defaults = {
		// "colNames":[],
		"colDefs":[],
		"width":0.985,
		"height":0.5,
		"data":[],
		"tableId":"respoTable"
	}
    var widthMap={};// map that holds width of each cols as they change -- used in rebuilding body during pagination and sorting
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
        var divId= t.selector;
        var $div = $("#"+divId);
        // console.log($div);
        $div.css("overflow-y:auto;");
 


        //build gridHeader
        var table = new Array();
        table.push('<table id="head_'+divId+'" class="table table table-bordered table-striped" style="margin-bottom:0px;">');
        buildHeader(table,opts);
        table.push('</table>');
        var $head = $(table.join(""));
        // console.log($head);
        $div.append($head);
        
        var ht = $window.innerHeight()*opts.height;
        var $bodyDiv = $('<div id="respoGridBody_'+divId+'" style="top:0px;overflow-y:scroll;height:'+ht+'px;border-bottom:1px solid #eee;"></div>');

        table = new Array();
        table.push('<table id="body_'+divId+'" class="table table table-bordered table-striped ">');
        buildBody(table,opts);
        table.push('</table>');
        var $table = $(table.join(""));
        
        $(window).bind("resize", function(){ setTimeout(function(){resize($table,opts);},100)});//delay to prevent overload for frequent resizes
        $bodyDiv.append($table);
        $div.append($bodyDiv);
        $("a.respo_expand",$table).bind("click",function(event){ event.preventDefault(); showDetails(this);});
        $("a.respo_minimize",$table).bind("click",function(event){ event.preventDefault();  hideDetails(this);});
        $("a.respo_sort_up",$head).bind("click",function(event){ event.preventDefault(); sortCol(this,opts,divId);});
        $("a.respo_sort_down",$head).bind("click",function(event){ event.preventDefault();  sortCol(this,opts,divId);});
        // initSort($head);
        resize($table,opts);
    };

    function sortCol(elm,opts,divId){
      var data = opts.data;
      // console.log("table#body_"+divId);
      var tableBody = $("table#body_"+divId);
      // console.log(tableBody.html());
      var col = $(elm).attr("id").split("_");
      var toggle = (col[1] === 'asc')? "desc" : "asc";
      // tableBody.html("Loading"); SoRT NOT WOrking.. need to test this
      // console.log(data);
      data.sort(function(a,b){return sort(a,b,col[0])});
      // console.log(data);
      // removeDetailsWindow();
      updateGrid(opts,tableBody);
      // tableBody.html(reBuildBody(opts))
      $(elm).hide();
      $("a#"+col[0]+"_"+toggle).show();

    }

    function removeDetailsWindow(){
      $("a.respo_minimize").hide();
      $("tr.respo_details_row").remove();
      if(hiddenCols.length === 0) $("a.respo_expand").hide();
      else                        $("a.respo_expand").show();
    }

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
        // widthMap to be update here
        refreshWidthMap(colDefs);
        $("a.respo_minimize",$table).hide();
        $("tr.respo_details_row",$table).remove();
        if(hiddenCols.length === 0) $("a.respo_expand",$table).hide();
        else                        $("a.respo_expand",$table).show();
    }

    function refreshWidthMap(colDefs){
        // console.log(colDefs);
        for(var i=0; i<colDefs.length; i++){
            var def = colDefs[i];
            // console.log(def.name);
             widthMap[def.name]= $("th."+def.name).innerWidth();
        }
        console.log(widthMap);
        
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
    //TODO.. correct this update function used in sorting
    function updateGrid(opts, $elm){
        var data= opts.data;
        console.log($elm);
        var $tbody = $elm.find("tbody");
        // console.log($tbody.html());
        var $tr = $tbody.closest("tr");
         console.log($tr.html());
        for(var i=0; i<data.length; i++){
            var row= data[i];
            // if(row.id) $tr.attr("id",row.id);
            var $td = $tr.closest("td");
            // console.log($td);
            for(var j=0; j<opts.colDefs.length; j++){
                var def = opts.colDefs[j];
                
                // if(def.name == 'dob')    console.log($td.html());
                // if(def.name == 'dob')    console.log(row[def.name]);
                $td.html((def.format)? def.format(row[def.name]) : row[def.name]);
                // if(def.name == 'dob')    console.log($td.html());
                $td=$td.next();
            }
            $tr.next();
        }
    }

    function reBuildBody(opts){
        var table = new Array();
        table.push('<tbody>');
        for(var i=0; i<opts.data.length; i++){
            var row = opts.data[i];
            var id = row.id || i;
            table.push("<tr id='"+id+"' class='mainRow'>");
            L1: for(var j=0; j<opts.colDefs.length; j++){
                    var def = opts.colDefs[j];
                    if(hiddenCols.contains(def.name)) continue L1;
                    console.log(widthMap[def.name]);
                    table.push("<td class='"+def.name+"' style='width:"+widthMap[def.name]+"px;'>");
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
        return table.join(" ");
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
            table.push('<th class=" btn-inverse '+def.name+'" style="width:'+wt+'px;"');
    		table.push('>');
  			table.push(def.label);
            if(def.sort){
                var hideAsc="style='display:none'",hideDesc="style='display:none'";
               if(opts.sortCol === def.name){
                    hideAsc  = (opts.sortDir === 'asc') ? "" : hideAsc;
                    hideDesc = (opts.sortDir === 'desc') ? "": hideDesc;
                }
                
                table.push("&nbsp;&nbsp;<a href='#' id='"+def.name+"_asc' class='respo_sort_up icon-circle-arrow-up icon-white '  "+hideAsc+">&nbsp;</a>" );
                table.push("&nbsp;&nbsp;<a href='#' id='"+def.name+"_desc' class='respo_sort_down icon-circle-arrow-down icon-white ' "+hideDesc+">&nbsp;</a>" );
            } 
			table.push('</th>');
    	}
    	table.push("</tr>");
    	table.push("</thead>");

        hideableCols.sort(function(a,b){ return sort(a,b,"minWidth");}); // sort by minWidth desc
    }

    

    function sort(a,b,field){
        if(a[field] > b[field])      return 1;
        else if(a[field] < b[field]) return -1;
        else                         return  0;
    }

    function _validate(){

        // check for mandatory colDef Params .. minWidth and name
    	return null;
    }


})(jQuery,window);
