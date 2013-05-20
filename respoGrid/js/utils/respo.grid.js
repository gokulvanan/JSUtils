    

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
        "source":"local",// ajax / loadOnce / loadNext
        "searchDiv": null,
        "paramNames":{"page":"page","rowsPerPage": "rowsPerPage","sortCol":"orderBy","sortDir":"asc","total":"total","data":"data"},
        //"paramNames":{"page":"page","rowsPerPage": "rowsPerPage","sortCol":"sortCol","sortDir":"sortDir","total":"total","data":"data"},
        "getList":null, // function called during AJAX load input args contains params of gird , output json with total and data fields
        "getListHandler":null // handler function handle json response
    }
    //Global variables
    var debug=true; // added to switch on and off logging
    var widthMap={};// map that holds width of each cols as they change -- used in rebuilding body during pagination and sorting
    var totalWidth=0;
    var hideableCols = new Array(), hiddenCols = new Array();
    var colSpanSize=0; // used to add NO Data Found, Loading messages
    var scrollBarPadding=13; // added to provide padding to last header column for scrollbar
    var columnPadding=17; // individual header column padding value is defined currently by bootstrap css
    var actionHandlerMap={};// map used to map action names to handler functions for the action specfied 
    var editableColsMap={}; // map used to map column names to editable actions and validaiton actions

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
        table.push('<table id="head_'+divId+'" class="table table table-bordered table-striped" style="margin-bottom:0px;table-layout:fixed;">');
        buildHeader(table,opts);
        table.push('</table>');
        var $head = $(table.join(""));
        // log($head);
        $div.append($head);
        
        var ht = $window.innerHeight()*opts.height;
        var $bodyDiv = $('<div id="respoGridBody_'+divId+'" style="top:0px;overflow-y:scroll;height:'+ht+'px;border-bottom:1px solid #dddddd;"></div>');

        // Build Search div if given
        
        if(opts.searchDiv) buildSearchDiv(opts);
        //TODO Correct the bug in loading function
        // loading div to show timer 
     /*   var loadingDiv=$("<div id='respo_loading_"+opts.divId+"' class='icon icon-large incon-spinner icon-spin' style='display:none;'></div>");
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
        }*/
        // // console.log("Show loading called");
        // opts.showLoadingDiv();
        // console.log(opts.paramNames);
        // onload default sort
        if (opts.source === "local" ) {
            if(opts.sortCol){
                var dir = (opts.sortDir === 'desc') ? 'desc' : 'asc'; 
            opts.localData.sort(function(a,b){ return sort(a,b,opts.sortCol,dir)});    
            }
        }else{
            //set Params for ajax call
            // // console.log(opts.paramNames);
            opts.params={};
//            opts.params[opts.paramNames["page"]]=opts.page;
//            opts.params[opts.paramNames["rowsPerPage"]]=opts.rowsPerPage;
//            opts.params[opts.paramNames["sortCol"]]=opts.sortCol;
//            opts.params[opts.paramNames["sortDir"]]=opts.sortDir;
        }

        opts.divId = divId;
        opts.$bodyDiv = $bodyDiv;
        //set data based on rowsPerPage
        processData(opts,function(args){
            buildTableFromData(args,divId,$bodyDiv,$div,$head);
        });
        
        return{
            search: function(){
//                params = (params) ? opts.params : params;
                search(opts,divId);
                return this;
            }
        }
    };
    
    function buildSearchDiv(opts){
        var $div = $("div#"+opts.searchDiv);
        $div.attr("class","input-append");
        var search = new Array();
        console.log(opts.colDefs);
        for(var i=0,len=opts.colDefs.length; i<len; i++){
            console.log(opts.colDefs[i]);
            var def = opts.colDefs[i];
            if(def.search){
                var searchOpts = def.searchOpts || {};
                var type = searchOpts.searchType || "text";
                var size = searchOpts.size || "large";
                var placeHolder= searchOpts.placeHolder || "";
                if(type === "text"){
                    search.push('<input class="search input-'+size+'"  placeholder="'+placeHolder+'" id="'+def.name+'" type="text" />')
                }else if (type === 'dropdown'){
                    var dropDownOpts =  searchOpts.opts || {};
                    search.push("<select class='search input-"+size+"' id='"+def.name+"' >");
                    if($.trim(placeHolder).length !== 0) {
                          search.push("<option value='' > Select "+placeHolder+"</option>");
                      }
                    for(var key in dropDownOpts){
                        search.push("<option value='"+key+"' >"+dropDownOpts[key]+"</option>");
                    }
                    search.push("</select>");
                }
            }
        }
        search.push('<button id="go" class="btn " type="button">Go!</button>');
        $div.html(search.join(" "));
    }

    function processData(opts, handler){
        if(opts.source === 'local'){
            opts.data = getLocalData(opts);
            handler(opts);
        }else if (opts.source ==='ajax'){ // source === ajax
             opts.params[opts.paramNames["page"]]=opts.page;
             opts.params[opts.paramNames["rowsPerPage"]]=opts.rowsPerPage;
             opts.params[opts.paramNames["sortCol"]]=opts.sortCol;
             opts.params[opts.paramNames["sortDir"]]=opts.sortDir;
             ajaxCallHelper(opts,handler)
        }else if (opts.source === 'loadOnSearch'){
            if(opts.searchCall){ // make ajax call for search
                opts.page=1; // reset to first page
                opts.params[opts.paramNames["page"]]=undefined; // remove pagination params as pagination is now clientSide
                opts.params[opts.paramNames["rowsPerPage"]]=undefined; // remove pagination params as pagination is now clientSide
                opts.params[opts.paramNames["sortCol"]]=opts.sortCol;
                opts.params[opts.paramNames["sortDir"]]=opts.sortDir;
                ajaxCallHelper(opts,handler)

            }else{ // work with local data for other cases
              if(opts.localData && opts.localData.length > 0){
                    opts.data = getLocalData(opts);
                    handler(opts);
                }  
            }
            
        }
    }
    
    function ajaxCallHelper(opts,handler){
        beforeAjaxCall(opts);// helper method to show loading div etc
            opts.getList(opts.params,function (response){
                var obj= opts.getListHandler(response);
                // console.log(obj);
                opts.data =  obj[opts.paramNames.data];
                opts.total = obj[opts.paramNames.total];
                afterAjaxCall(opts); // helper method to remove loading div, cleaup.. no data msg + error reporting
                handler(opts);
                afterBuildingGrid(opts);
            });
    }
   
    function beforeAjaxCall(opts){
        
        opts.data=[]; // clear old Data
        
        // code to work with yui set of pagination options set in my BE.. to remove this from here
        var paramNames = opts.paramNames;
        var page = opts.params[paramNames.page];
        var rowsPerPage = opts.params[paramNames.rowsPerPage];
        var dir = opts.params[paramNames.sortDir];
        dir = (dir === "asc" )? true : false;
        page = (page-1)*rowsPerPage;
        
        opts.params[paramNames.sortDir]=dir;
        opts.params[paramNames.page]= page;
    }
    
    function afterAjaxCall(opts){
        if(opts.source="loadOnSearch"){
            opts.searchFlag=false;// search flag reset.. to keep pagination and sorting as local calls its set during every serach call
            opts.localdata=[]; // as localData needs to be populate
            opts.localdata=opts.data;
            opts.data=getLocalData(opts);
        }
    }

    function afterBuildingGrid(opts){
        //TODO
    }
    function buildTableFromData(opts,divId,$bodyDiv,$div,$head){
        var table = new Array();
        table.push('<table id="body_'+divId+'" class="table table table-bordered table-striped " style="table-layout:fixed;">');
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
        $("a.respo_sort_up",$head).bind("click",function(event){ event.preventDefault(); sortCol(this,opts,divId,"asc");});
        $("a.respo_sort_down",$head).bind("click",function(event){ event.preventDefault();  sortCol(this,opts,divId,"desc");});

        $("a.respo_rows_per_page_change",$caption).bind("click",function(event){ event.preventDefault(); changeRowsPerPage(this,opts,$caption,divId);});
        $("select.respo_curr_page",$caption).bind("change",function(event){ pagnButtonClick(this,opts,$caption,divId);});
        $("a.respo_pagn",$caption).bind("click",function(event){ event.preventDefault();  pagnButtonClick(this,opts,$caption,divId);});
        // initCaptionHandlers($caption);
        // initSort($head);
       initEditableCols($table);
        resize($table,opts);
    }
    
    function initEditableCols($table){
        console.log(" initEditableCols");
        console.log(editableColsMap);
        for(var key in editableColsMap){
            console.log("input.respo_inline_edit_content_"+key);
            $("input.respo_inline_edit_content_"+key,$table).click(function(event){
                console.log("here");    
                event.preventDefault();
                var elm = $(this);
                elm.removeAttr('readonly');
                elm.next().show();
                elm.next().next().show();
            }); 
            $("a.respo_inline_edit_cancel").click(function(event){
                event.preventDefault();
                var elm = $(this);
                elm.hide();
                elm.prev().hide();
                elm.prev().prev().attr('readonly','readonly');
            });
        }
    }

    function search(opts,divId){
        //search from ajax data 
        if(opts.source==='ajax' || opts.source === 'loadOnSearch'){
            opts.searchFlag=(opts.source === 'loadOnSearch');
            var params = getSerchParams("search"); // add search params 
            opts.params=params;
            processData(opts,function(args){
                reBuildBody(args,divId);
             });
        }else if(opts.source === 'local'){
            //TODO

        }
        else{
            throw "Invalid Source";
        }

    }

    function getSerchParams(clazz){
        var params={};
        $("."+clazz).each(function(){
            var id = $(this).attr("id");
            var val = $(this).val();
            params[id]=val;
        });
        return params;
    }
    
    function initializeButtonActions($caption, opts){
        $(".respo_btns",$caption).bind("click",function(){
            var id = $(this).attr("id");
            var loading = $(this).attr("data-loading-text");
            // disable button
            disableButtons(id,loading,".respo_btns");
            // carry out custom action            
            actionHandlerMap[id]();
            //enable button
         setTimeout(function(){
                enableButtons(id,".respo_btns");
         },3000)

        });
    }
    // TODO from pagnButtonClick
    function pagnButtonClick(elm,opts,$caption,divId){
        // // console.log($(elm).is("select"));
        var $elm = $(elm);
        var elmType = $elm[0].nodeName.toLowerCase();
        if(elmType === "select"){
            opts.page=parseInt($elm.val());
        }else{
             if($elm.parent().attr("class") === 'disabled') return; // do nothing for a disabled button
             if($elm.html() === "Next"){
                    opts.page++; // console.log("next");
             }   
             else {
                opts.page--;// console.log("previous");
             }
             $("select.respo_curr_page",$caption).val(opts.page);                        
        }
        // console.log("PagnButtonClick");
        // console.log(opts.page);
        // console.log(opts.rowsPerPage);
        processData(opts,function(args){
            /*var tableBody = $("table#body_"+divId);
            updateGrid(args,tableBody);*/
            // console.log(opts.data);
            reBuildBody(args,divId);
            enableDisablePagnButtons(args,$caption);   
        });
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
            // console.log("Disable Next");
            next.attr("class","disabled"); // disable next
         }  
         else if(opts.page === 1){
            // console.log("Disable Previous");
            previous.attr("class","disabled"); // disable previous
         }                
    }

    function getLocalData(opts){
            var i = (opts.page -1) * opts.rowsPerPage;
            var j = ((i+opts.rowsPerPage) < opts.localData.length) ? i+opts.rowsPerPage : opts.localData.length;
            // console.log(i+"_"+j);
            return opts.localData.slice(i,j);
    }
    
   
    
//    function getListHandler(response){
//       opts.total=response[opts.paramNames["total"]];// TODO check need for retriving page and rowsPerpage 
//         opts.ajaxData[opts.paramNames["data"]];
//    }
//    
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
        pagn.push('<button class="btn  btn-small disabled"><b>Dislplay Records : ');// TODO remove inline styling
        pagn.push('<span id="respo_rows_per_page_val">'+opts.pageOpts[0]+'</span>');
        pagn.push('</b></button>');
        pagn.push('<button class="btn  btn-small dropdown-toggle " style="height: 26px;" data-toggle="dropdown">');
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
        actionHandlerMap = {}; // reset
        var acts = opts.actions;
        var actions = new Array();
        actions.push('<div id="respo_actions" class="pull-right" style="margin-right:10px;">');
        for(var i=0,len=acts.length; i<len; i++){
            actionHandlerMap[acts[i].name]= acts[i].action; // used in click Handler to prevent array looping to lookup the action for button clicked
            actions.push('<button id="'+acts[i].name+'" class="respo_btns btn btn-danger btn-small" data-loading-text="'+acts[i].loading+'">');
            actions.push("<i class='icon "+acts[i].icon+"'> </i>&nbsp;")
            actions.push(acts[i].label);
            actions.push('</button>');
        }
        actions.push('  </div> ');
        return actions.join(" ");
    }
    
    function enableButtons(id,grpClass){
        $("button#"+id+"_loading").hide();
        $("button#"+id).show();
        $(grpClass).attr("disabled",false);
    }
    
    function disableButtons(id,label,grpClass){
        $(grpClass).attr("disabled",true);
        var loadingElm = $("button#"+id+"_loading");
        if (loadingElm.length === 0){ //TODO change loading image to be in css sprite.. 
            loadingElm = $("<button id='"+id+"_loading' class='btn btn-warning btn-small' >  <img src='/img/loading.gif' ></img> "+label+" </button>");
            loadingElm.insertAfter("button#"+id);
        }else{
            loadingElm.show();
        }
        $("button#"+id).hide();
        
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
        
        processData(opts, function(args){
             reBuildBody(args,divId);
             $("ul#respo_pagn_links").html(buildPagnButtons(args.page,args.getTotalPages()));
             // re init tigger to pagnButton click handlers
             $("select.respo_curr_page",$caption).bind("change",function(event){ pagnButtonClick(this,args,$caption,divId);});
             $("a.respo_pagn",$caption).bind("click",function(event){ event.preventDefault();  pagnButtonClick(this,args,$caption,divId);});
        });
    }

    
  
    function sortCol(elm,opts,divId,dir){
      
      var tableBody = $("table#body_"+divId);
      var col = $(elm).attr("id");
      col = col.substring(0,col.length-3);  
      removeDetailsWindow();
      if(opts.source === "local"){
        var data = opts.localData;
        data.sort(function(a,b){return sort(a,b,col,dir)});  
      }else{ // ajax call
        opts.sortCol=col; // update params used in making getListReq
        opts.sortDir=dir; // update params used in making getListreq
      }
      processData(opts, function(args){
          updateGrid(args,tableBody);
      });
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
        str.push("<td class='respo_details_backdrop' colspan='"+(colSpanSize - hiddenCols.length)+"'>");
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
//         console.log(windowWidth);
//         console.log("tableWidth"+totalWidth)
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
            if(i === colDefs.length-1)  widthMap[def.name]= $("th."+def.name).width();// - scrollBarPadding;
            else                        widthMap[def.name]= $("th."+def.name).width();
        }
        // log(widthMap);
    }
    
            
    function updateGrid(opts, $elm){
        var data= opts.data;
        // // console.log($elm);
        var $tbody = $elm.find("tbody");
        // log($tbody.html());
        var $tr = $tbody.find("tr:first");
         // console.log($tr);
        for(var i=0; i<opts.data.length; i++){
            var row= data[i];
            // if(row.id) $tr.attr("id",row.id);
            var $td = $tr.find("td:first");
            // log($td);
            for(var j=0; j<opts.colDefs.length; j++){
                var def = opts.colDefs[j];
                var content = (def.format)? def.format(row[def.name]) : row[def.name];
                var $span = $td.find("span.respo_content_"+def.name);
                var $input = $span.find("input");
                if($input.length === 0) $span.html(content);
                else $input.val(content);
                $td = $td.next();
            }
            $tr = $tr.next();
            
        }
    }

    function reBuildBody(opts,divId){
         // console.log(divId);
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
         // console.log("Build Body "+opts.data.length);
        if(opts.data.length === 0){
            var colSpan = opts.colDefs.length-hiddenCols.length;
            table.push("<tr id='"+id+"' class='mainRow'>");
            table.push("<td style='text-align:center;' colspan='"+colSpan+"'>");
            table.push("<span  >No Data Found<span>");
            table.push("</td >");
            table.push("</tr>");
        }
        for(var i=0; i<opts.data.length; i++){
            var row = opts.data[i];
            var id = i;
            table.push("<tr id='respo_row_"+id+"' class='mainRow'>");
            for(var j=0; j<opts.colDefs.length; j++){
                var def = opts.colDefs[j];
                var align = (def.align) ? def.align : "left";
                var width = (rebuildFlag)? /*widthMap[def.name] */def.minWidth :def.minWidth; //TODO need to rethink this
                var hide = (isHidden(def.name)) ? "display:none;" : "";
                // var hide ="";
                table.push("<td class='"+def.name+"' style='word-wrap:break-word;width:"+width+"px;text-align:"+align+";"+hide+"'>");
                if(def.main){
                  table.push("<a href='#' class='respo_expand icon-expand-alt icon-large' style='display:none;' >&nbsp;</a>");
                  table.push("<a href='#' class='respo_minimize icon-collapse-alt icon-large' style='display:none;' >&nbsp;</a>&nbsp;")  
                } 
                table.push("<span id='respo_content_"+def.name+"_"+i+"' class='respo_content_"+def.name+"'>");
                if(def.editable){
                    editableColsMap[def.name]=def.editOpts;
                    table.push("<input id='respo_inline_edit_content_"+def.name+"_"+i+"' type='text' readonly='readonly' class=' respo_inline_edit_content_"+def.name+"' value='");
                    table.push((def.format)? def.format(row[def.name]) : row[def.name]);                
                    table.push("'/>");
                    table.push("&nbsp;<a href='#' class='respo_inline_edit_save icon-save' title='Save' style='display:none;'  >&nbsp;</a>");    
                    table.push("&nbsp;<a href='#' class='respo_inline_edit_cancel icon-ban-circle' title='Cancel' style='display:none;'  >&nbsp;</a>");   
                }else{
                    table.push((def.format)? def.format(row[def.name]) : row[def.name]);
                }
                table.push("</span>");
                table.push("</td>");
            }
            table.push("</tr>");
        }
        table.push('</tbody>');                 
//      // console.log(table.join());
    }

    function buildHeader(table,opts){
        table.push("<thead>");
        table.push("<tr class='mainHeaderRow'>");
        for(var i=0; i<opts.colDefs.length; i++){
            var def = opts.colDefs[i];
            var wt =  def.minWidth;
            var padding="", pad = 0;
            if(i == opts.colDefs.length-1){
                pad = scrollBarPadding;
                padding="padding-right:"+scrollBarPadding+"px";
            }
            totalWidth += (wt + columnPadding + pad);  // 17px default header cellp adding by bootstrap
            if(def.hideable)hideableCols.push(def);
            table.push('<th class=" bluebackdrop '+def.name+'" style="word-wrap:break-word;width:'+wt+'px;'+padding+'" >');
            
            table.push(def.label);
            
            if(def.sort){
                var hideAsc="",hideDesc="";
                table.push("&nbsp;&nbsp;<span><a href='#' id='"+def.name+"Asc' class='respo_sort_up icon-chevron-up icon-white'  "+hideAsc+">&nbsp;</a>" );
                table.push("<a href='#' id='"+def.name+"Dsc' class='respo_sort_down icon-chevron-down icon-white ' "+hideDesc+">&nbsp;</a>" );
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

    function _validate(opts){

        if(opts.source === 'local'){
            if(!opts.page) opts.page=1;
            if(!opts.rowsPerPage) opts.rowsPerPage=opts.localData.length;
            if(opts.scrollBarPadding) scrollBarPadding=opts.scrollBarPadding;
        }else if(opts.source ==='ajax'){
            if(!opts.getList || !opts.getListHandler){
                return "For source == 'ajax' , getList and getListHandler has to specified";
            }
        }else{
            return "Invalid source type";
        }
            
        // check for mandatory colDef Params .. minWidth and name
        //check if rowsPerPage opt is put if opts are given
        return null;
    }
//
//    function log(obj){
//        if(!debug) return;
//        // // console.log("Being called from"+arguments.callee.caller.toString())
//        if(console && log)  // console.log(obj);
//        else    alert(obj.toString());
//    }

    return{
        getInstance: getInstance // initialize respoTable
    }


});
