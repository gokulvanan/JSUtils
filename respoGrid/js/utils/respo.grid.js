    

/* 
    Requries jquery1.7 or above
*/


define(function () {

	var defaults = { //TODO add defaults
        "divId":null,
		"colDefs":[],
		"width":0.985,
		"height":0.5,
		"localData":[],
		"source":"local",// ajax 
        "paramNames":{"page":"page","rowsPerPage": "rowsPerPage","sortCol":"sortCol","sortDir":"sortDir","total":"total","data":"data"},
        "getList":null // function called during AJAX load input args contains params of gird , output json with total and data fields

	}
    //Global variables
    var debug=true; // added to switch on and off logging
    var widthMap={};// map that holds width of each cols as they change -- used in rebuilding body during pagination and sorting
    var totalWidth=0;
    var hideableCols = new Array(), hiddenCols = new Array();
    var colSpanSize=0;
    var scrollBarPadding=14; // added to provide padding to last header column for scrollbar
   

	function getInstance (options) {
        options = options || {};
        var opts = $.extend(true, {}, defaults, options); //merge user and default options
        
        var msg = _validate(opts);
        if(msg) throw msg;
        var $window = $(window);
        colSpanSize=opts.colDefs.length;
        //setDiv height and width
        var divId= opts.divId;
        var $div = $("#"+divId);
        // log($div);
        $div.css("overflow-y:auto;");
 
        // helper utility function used in pagination
        opts.getTotalPages = function(){
            var total = (this.source==="local") ? this.localData.length : ((this.total)? this.total : this.data.length);
            var rowsPerPage = this.rowsPerPage
            return (total % opts.rowsPerPage == 0) ? (total/opts.rowsPerPage) : parseInt((total/opts.rowsPerPage)) + 1;
        }

        //build gridHeader
        var table = new Array();
        table.push('<table id="head_'+divId+'" class="table table table-bordered table-striped" style="margin-bottom:0px;">');
        buildHeader(table,opts);
        table.push('</table>');
        var $head = $(table.join(""));
        // log($head);
        $div.append($head);
        
        var ht = $window.innerHeight()*opts.height;
        var $bodyDiv = $('<div id="respoGridBody_'+divId+'" style="top:0px;overflow-y:scroll;height:'+ht+'px;border-bottom:1px solid #eee;"></div>');

        //TODO Correct the bug in loading function
        // loading div to show timer 
        var loadingDiv=$("<div id='respo_loading_"+opts.divId+"' class='icon icon-large incon-spinner icon-spin' style='display:none;'></div>");
        $div.append(loadingDiv);
        opts.showLoadingDiv = function(){
            var parentDiv = $("div#"+divId);
            $(loadingDiv).css({
            // "position":"relative",
            "top": "0px",
            "left": "0px",
            "width": "100%",
            "height": "100%",
            "z-index": 500,
             });
            $(loadingDiv).show();
        }
        opts.hideLoadingDiv = function(){
            $(loadingDiv).hide();
        }
        // console.log("Show loading called");
        // opts.showLoadingDiv();
        console.log(opts.paramNames);
        // onload default sort
        if (opts.source === "local" ) {
            if(opts.sortCol){
                var dir = (opts.sortDir === 'desc') ? 'desc' : 'asc'; 
            opts.localData.sort(function(a,b){ return sort(a,b,opts.sortCol,dir)});    
            }
        }else{
            //set Params for ajax call
            // console.log(opts.paramNames);
            opts.params[opts.paramNames["page"]]=opts.page;
            opts.params[opts.paramNames["rowsPerPage"]]=opts.rowsPerPage;
            opts.params[opts.paramNames["sortCol"]]=opts.sortCol;
            opts.params[opts.paramNames["sortDir"]]=opts.sortDir;
        }


        //set data based on rowsPerPage
        opts.data = getData(opts);
        
        table = new Array();
        table.push('<table id="body_'+divId+'" class="table table table-bordered table-striped ">');
        buildBody(table,opts);
        table.push('</table>');
        var $table = $(table.join(""));

        var $caption = buildCaption(opts);
        
        $(window).bind("resize", function(){ setTimeout(function(){resize($table,opts);},100)});//delay to prevent overload for frequent resizes
        $bodyDiv.append($table);
        $div.append($bodyDiv);
        $div.prepend($caption);// add caption before table

        if(opts.actions) initializeButtonActions($caption,opts.actions);

        $("a.respo_expand",$table).bind("click",function(event){ event.preventDefault(); showDetails(this);});
        $("a.respo_minimize",$table).bind("click",function(event){ event.preventDefault();  hideDetails(this);});
        $("a.respo_sort_up",$head).bind("click",function(event){ event.preventDefault(); sortCol(this,opts,divId);});
        $("a.respo_sort_down",$head).bind("click",function(event){ event.preventDefault();  sortCol(this,opts,divId);});
        
        $("a.respo_rows_per_page_change",$caption).bind("click",function(event){ event.preventDefault(); changeRowsPerPage(this,opts,$caption,divId);});
        $("select.respo_curr_page",$caption).bind("change",function(event){ pagnButtonClick(this,opts,$caption,divId);});
        $("a.respo_pagn",$caption).bind("click",function(event){ event.preventDefault();  pagnButtonClick(this,opts,$caption,divId);});
        // initCaptionHandlers($caption);
        // initSort($head);
        resize($table,opts);
        return{
            search: function(params){
                params = (params) ? opts.params : params;
                search(params,opts);
                return this;
            }
        }
    };

   
    function search(params,opts){
        //search from local data
        //resort and rebuild grid
    }

    function initializeButtonActions($caption, opts){
        $("button.btn",$caption).bind("click",function(){
            console.log("action called");
            // disable button
            // carry out custom action
            //enable button
        });
    }
    // TODO from pagnButtonClick
    function pagnButtonClick(elm,opts,$caption,divId){
        // console.log($(elm).is("select"));
        var $elm = $(elm);
        var elmType = $elm[0].nodeName.toLowerCase();
        if(elmType === "select"){
            opts.page=parseInt($elm.val());
        }else{
             if($elm.parent().attr("class") === 'disabled') return; // do nothing for a disabled button
             if($elm.html() === "Next"){
                    opts.page++; console.log("next");
             }   
             else {
                opts.page--;console.log("previous");
             }
             $("select.respo_curr_page",$caption).val(opts.page);                        
        }
        opts.data = getData(opts);
        reBuildBody(opts,divId);
        enableDisablePagnButtons(opts,$caption);
    }

    function enableDisablePagnButtons(opts,$caption){
         // enable both buttons
         var next = null, previous = null;
         $("a.respo_pagn",$caption).each(function(){
            var $e = $(this);
            if($e.html() === "Next") next = $e.parent();
            else previous = $e.parent();
            $e.parent().attr("class","");
         });
         
         if(opts.page === opts.getTotalPages()){
            console.log("Disable Next");
            next.attr("class","disabled"); // disable next
         }  
         else if(opts.page === 1){
            console.log("Disable Previous");
            previous.attr("class","disabled"); // disable previous
         }                
    }

    function getData(opts){
        if(opts.source === 'local'){
            var i = (opts.page -1) * opts.rowsPerPage;
            var j = ((i+opts.rowsPerPage) < opts.localData.length) ? i+opts.rowsPerPage : opts.localData.length;
            console.log(i+"_"+j);
            return opts.localData.slice(i,j);
        }else{
           var json = opts.getList(opts.params);
           opts.total=json[opts.paramNames["total"]];// TODO check need for retriving page and rowsPerpage 
           return json[opts.paramNames["data"]];
        } 
    }

    function buildCaption(opts){
        var caption = new Array();
        caption.push('<div  id="resp.caption row" >')
        if(opts.actions)     caption.push(buildActions(opts,caption)); // TODO: change this dirty trick to keep div on same row and improve css 
        if(opts.pageOpts)    caption.push(buildPagination(opts,caption));
        caption.push('</div>');
        return $(caption.join(" "));
    }

    function buildPagination(opts){
        var pagn = new Array();
        var pageOpts = opts.pageOpts , rowsPerPage=opts.rowsPerPage;
        // build rowsPerPage Div and init page = 1
        pagn.push('<div id="rowsPerPage_div" class="btn-group pull-left">');
        pagn.push('<button class="btn  btn-small disabled"><b>RowsPer Page : ');
        pagn.push('<span id="respo_rows_per_page_val">'+opts.pageOpts[0]+'</span>');
        pagn.push('</b></button>');
        pagn.push('<button class="btn  btn-small dropdown-toggle " data-toggle="dropdown">');
        pagn.push('<span class="caret"></span>');
        pagn.push('</button>');
        pagn.push('<ul class="dropdown-menu" style="left:90px;min-width:15px;">');// TODO remove the hardcode left and min-widht value
        for(var i=0; i<pageOpts.length; i++){
                pagn.push('<li><a href="#" class="respo_rows_per_page_change" >'+pageOpts[i]+'</a></li>');
            }
        pagn.push('</ul>');
        pagn.push('</div>');
      
        // Build pagination pages link'
        pagn.push('<div class=" pagination pagination-small pagination-centered row">')
        pagn.push('<ul id="respo_pagn_links">');
        pagn.push(buildPagnButtons(opts.page,opts.getTotalPages()));       
        pagn.push('</ul>');
        pagn.push('</div>');
        return pagn.join(" ");
    }

    function buildActions(opts){
        var acts = opts.actions;
        var actions = new Array();
        actions.push('<div id="respo_actions" class="pull-right" style="margin-right:10px;">');
        for(var i=0,len=acts.length; i<len; i++){
            actions.push('<button id="'+acts[i].name+'" class="btn btn-danger btn-small" data-loading-text="'+acts[i].loading+'">');
            actions.push("<i class='icon "+acts[i].icon+"'> </i>&nbsp;")
            actions.push(acts[i].label);
            actions.push('</button>');
        }
        actions.push('  </div> ');
        return actions.join(" ");
    }

    function buildPagnButtons(page,totalPages){
        
        var pagn = new Array();
        if(page === 1)       pagn.push('<li class="disabled">');
        else                 pagn.push('<li >');
        pagn.push('<a class="respo_pagn respo_pagn_disabled" href="#">Prev</a></li>');
        pagn.push("<li > <span style='color:#999999;'> <select class='respo respo_curr_page'>");
        for(var i=1; i<=totalPages ; i++){
            var active = (i === page) ? "selected:true;" : "";
            pagn.push('<option value="'+i+'">'+i+'</option>');
        }
        pagn.push("</select></span> </li>");
        if(page == totalPages) pagn.push('<li class="disabled">');
        else                 pagn.push('<li >');
        pagn.push('<a class="respo_pagn" href="#">Next</a></li>');   
        return pagn.join(" ");      
    }

    function changeRowsPerPage(elm,opts,$caption,divId){
        // update table data and update pagn params
        var val = parseInt($(elm).html());
        $("span#respo_rows_per_page_val").html(val);
        opts.rowsPerPage=val;

        opts.page=1;
        opts.data = getData(opts);
        reBuildBody(opts,divId);
        $("ul#respo_pagn_links").html(buildPagnButtons(opts.page,opts.getTotalPages()));
        // re init tigger to pagnButton click handlers
        $("select.respo_curr_page",$caption).bind("change",function(event){ pagnButtonClick(this,opts,$caption,divId);});
        $("a.respo_pagn",$caption).bind("click",function(event){ event.preventDefault();  pagnButtonClick(this,opts,$caption,divId);});
    }

    
  
    function sortCol(elm,opts,divId){
      
      var tableBody = $("table#body_"+divId);
      var col = $(elm).attr("id").split("_");
      removeDetailsWindow();
      if(opts.source === "local"){
        var data = opts.localData;
        data.sort(function(a,b){return sort(a,b,col[0],col[1])});  
      }else{ // ajax call
        opts.params[opts.paramNames["sortCol"]]=col[0]; // update params used in making getListReq
        opts.params[opts.paramNames["sortDir"]]=col[1]; // update params used in making getListreq
      }
      
      opts.data = getData(opts);
      
      updateGrid(opts,tableBody);
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
        // log(elm);
    }

    function hideDetails(elm){
        var $elm = $(elm);
        // elm.preventDefault();
        $elm.hide();
        $elm.prev().show(); 
        var tr = $elm.parent().parent();
        $(tr).next().remove();
        // log(elm); 
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
        // log(windowWidth);
        // log("tableWidth"+totalWidth)
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
        // log(colDefs);
        for(var i=0; i<colDefs.length; i++){
            var def = colDefs[i];
            //TEMP fix below to remove padding from last element.. need a more reliable solution
            if(i === colDefs.length-1)  widthMap[def.name]= $("th."+def.name).width() - scrollBarPadding;
            else                        widthMap[def.name]= $("th."+def.name).width();
        }
        // log(widthMap);
    }
    
            
    function updateGrid(opts, $elm){
        var data= opts.data;
        // console.log($elm);
        var $tbody = $elm.find("tbody");
        // log($tbody.html());
        var $tr = $tbody.find("tr:first");
         console.log($tr);
        for(var i=0; i<opts.data.length; i++){
            var row= data[i];
            // if(row.id) $tr.attr("id",row.id);
            var $td = $tr.find("td:first");
            // log($td);
            for(var j=0; j<opts.colDefs.length; j++){
                var def = opts.colDefs[j];
                var content = (def.format)? def.format(row[def.name]) : row[def.name];
                $td.find("span#respo_content_"+def.name).html(content);
                $td = $td.next();
            }
            $tr = $tr.next();
            
        }
    }

    function reBuildBody(opts,divId){
        // console.log(opts);
        var $table = $("table#body_"+divId);
        // $table.html("Loading... ");
        var table = new Array();
        buildBody(table,opts,true);
        $table.html(table.join(""));

        $("a.respo_expand",$table).bind("click",function(event){ event.preventDefault(); showDetails(this);});
        $("a.respo_minimize",$table).bind("click",function(event){ event.preventDefault();  hideDetails(this);});
        resize($table,opts);
    }
    
    function isHidden(name){
        for(var i=0; i<hiddenCols.length; i++){
            var col = hiddenCols[i];
            if (col.name === name) return true;
        }
        return false;
    }
    function buildBody(table,opts,rebuildFlag){
    	table.push('<tbody>');
        // console.log(hiddenCols);
    	for(var i=0; i<opts.data.length; i++){
    		var row = opts.data[i];
    		var id = i;
    		table.push("<tr id='"+id+"' class='mainRow'>");
    		for(var j=0; j<opts.colDefs.length; j++){
    			var def = opts.colDefs[j];
                var align = (def.align) ? def.align : "left";
                var width = (rebuildFlag)? widthMap[def.name] :def.minWidth;
                var hide = (isHidden(def.name)) ? "display:none;" : "";
                // var hide ="";
    			table.push("<td class='"+def.name+"' style='width:"+width+"px;text-align:"+align+";"+hide+"'>");
                if(def.main){
                  table.push("<a href='#' class='respo_expand icon-plus-sign' style='display:none;' >&nbsp;</a>");
                  table.push("<a href='#' class='respo_minimize icon-minus-sign' style='display:none;' >&nbsp;</a>&nbsp;")  
                } 
                table.push("<span id='respo_content_"+def.name+"'>");
				table.push((def.format)? def.format(row[def.name]) : row[def.name]);
                table.push("</span>");
    			table.push("</td>");
    		}
    		table.push("</tr>");
    	}
		table.push('</tbody>');					
    }

    function buildHeader(table,opts){
        // log(totalWidth)
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
            table.push('<th class=" btn-inverse '+def.name+'" style="width:'+wt+'px;" >');
    		
  			table.push(def.label);
            
            if(def.sort){
                var hideAsc="",hideDesc="";
                table.push("&nbsp;&nbsp;<span><a href='#' id='"+def.name+"_asc' class='respo_sort_up icon-chevron-up icon-white'  "+hideAsc+">&nbsp;</a>" );
                table.push("<a href='#' id='"+def.name+"_desc' class='respo_sort_down icon-chevron-down icon-white ' "+hideDesc+">&nbsp;</a>" );
            } 
			table.push('</th>');
    	}
    	table.push("</tr>");
    	table.push("</thead>");

        hideableCols.sort(function(a,b){ return sort(a,b,"minWidth","asc");}); // sort by minWidth desc
    }

    

    function sort(a,b,field,dir){
        var val = ((a[field] < b[field]) ? -1 : ((a[field] > b[field]) ? 1 : 0));
        return (dir === "asc") ? val : -val;
    }

    function _validate(){

        // check for mandatory colDef Params .. minWidth and name
        //check if rowsPerPage opt is put if opts are given
    	return null;
    }

    function log(obj){
        if(!debug) return;
        // console.log("Being called from"+arguments.callee.caller.toString())
        if(console && log)  console.log(obj);
        else    alert(obj.toString());
    }

    return{
        getInstance: getInstance // initialize respoTable
    }


});
