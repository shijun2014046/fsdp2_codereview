;(function($, undefined) {
	/**
	 * 表格控件操作
	 * options:{
	 * 	className:样式表
	 * 	pagination:是否分布，默认不传为分页
	 * 	url:加载url
	 * 	pagination:是否分页
	 * 	pagesize:每页显示数据量
	 * 	colortr:隔行显示的class
	 * 	data:请求参数，Json格式
	 * 	oncerequest:一次请求（true/false），默认为false。一次请求意思是指一次将查询结果全部返回，在客户端分页
	 * 	updateurl:列更新action
	 * 	servorder:(true/false)，是否为服务端排序
	 * 	selecttype:(single/multi/''),单选与多选，默认为空
	 * 	expand:(true/false)，是否支持行数据展开，默认为true
	 * }
	 * 列属性：{
	 * 	code:列的编码，对应服务返回字段名
	 * 	name:显示列标题名称
	 * 	width:显示列的宽度
	 * 	order:当前列是否支持排序
	 * 	edit:当前列是否支持编辑
	 * 	formater:格式化输出列
	 * }
	 */
	$.fn.grid = function(){
		var $finedogrid = this;
		var pages;
		var descItems = [];
		var ascItems = [];
		var selectedItems = [];
		var eventName = 'selectdata';
		this.pageOption = function(pagesVal){
			if(pagesVal){
				this.data("pages", pagesVal);
				return;
			}
			return this.data("pages");
		};
		this.firstPage = function(){
			if(pages.page == 1)
				return;
			pages.page = 1;
			this.load({}, true);
		};

		this.prePage = function(){
			if(pages.page == 1)
				return;
			pages.page -= 1;
			this.load({}, true);
		};

		this.nextPage = function(){
			if(pages.page >= pages.totalpage)
				return;
			pages.page += 1;
			this.load({}, true);
		};

		this.lastPage = function(){
			if(pages.page >= pages.totalpage)
				return;
			pages.page = pages.totalpage;
			this.load({}, true);
		};

		this.junmPage = function(val){
			if(val == pages.page)
				return;
			if(val < 1 || val > pages.totalpage)
				return;
			pages.page = parseInt(val);
			this.load({}, true);
		};
		
		this.refresh = function(){
			this.load({}, true);
		};
        
        this.selectAll = function(val){
        	$(this).find("tbody input[type=checkbox]").each(function(checkboxindex,checkboxitem){
        		checkboxitem.checked=val;
        		$finedogrid.rowSelected(checkboxitem);
        	});
        };
        
        /**
         * 获取缓存的查询条件
         */
        this.getQueryParam = function(){
        	param = $finedogrid.data("options").data;
        	return finedo.fn.isNon(param) ? '' : param;
        };
        
        /**
         * 获取选择的行的对象数组
         */
        this.getSelectedItem = function(){
        	var selectedItem = [];
        	$(this).find("tbody input[type=checkbox]").each(function(checkboxindex,checkboxitem){
        		if(checkboxitem.checked == true){
        			selectedItem.push($finedogrid.data("datarows")[checkboxindex]);
        		}
        	});
        	return selectedItem;
        };
        
        /**
         * 获取主键值
         */
        this.getKeycode = function(){
        	return this.data("keycodes");
        };
        
        /**
         * 选中或取消选中某行触发的事件
         */
        this.rowSelected = function(checkitem){
        	var keycodes = $finedogrid.getKeycode();
        	var keyAry = keycodes&&keycodes!='' ? keycodes.split(',') : undefined;
        	if(checkitem.checked == true){
        		selectedItems.push($(checkitem).data('data'));
        		if(finedo.fn.isNon($finedogrid.data('options').selecttype)){
        			return;
        		}
        		finedo.fn._triggerEvent(eventName, $(checkitem).data('data'));
        	}else{
        		var dataindex = finedo.fn.inArray($(checkitem).data('data'),selectedItems,keyAry);
        		if(dataindex != -1)
        			selectedItems.splice(dataindex,1);
        		if(finedo.fn.isNon($finedogrid.data('options').selecttype)){
        			return;
        		}
        		finedo.fn._triggerEvent('un'+eventName, $(checkitem).data('data'));
        	}
        };
        
        /**
         * 判断当前行数据是否选中
         */
        this.isSelected = function(data){
        	var keycodes = $finedogrid.getKeycode();
        	if(selectedItems.length == 0)
        		return false;
        	if(!keycodes || keycodes == '')
        		return false;
        	var keycodeAry = keycodes.split(',');
        	for(var i = 0; i < selectedItems.length; i++){
        		var isequal = true;
        		isequal = finedo.fn.jsonEqual(data, selectedItems[i], keycodeAry);
        		if(isequal)
        			return true;
        	}
        	return false;
        };
        
        /**
         * 表格排序，参数为对应的input按钮
         */
        this.gridSort = function(item, code){
        	if($(item).attr("class") == "asc"){
            	$(item).attr("title", "点击降序");
        		$(item).removeClass("asc");
        		$(item).addClass("desc");
        		if(finedo.fn.isTrue(this.data("options").servorder)){
        			var ascIndex = $.inArray(code, ascItems);
        			if(ascIndex == -1)
        				ascItems.push(code);
        			var descIndex = $.inArray(code, descItems);
        			if(descIndex != -1)
        				descItems.splice(descIndex, 1);
        			this.load();
        		}else{
            		this.sort("asc", code);
        		}
        	}else{
            	$(item).attr("title", "点击升序");
        		$(item).removeClass("desc");
        		$(item).addClass("asc");
        		if(finedo.fn.isTrue(this.data("options").servorder)){
        			var descIndex = $.inArray(code, descItems);
        			if(descIndex == -1)
        				descItems.push(code);
        			var ascIndex = $.inArray(code, ascItems);
        			if(ascIndex != -1)
        				ascItems.splice(ascIndex, 1);
        			this.load();
        		}else{
            		this.sort("desc", code);
        		}
        	}
        };
        
        /**
         * order: asc顺序， desc降序
         * code:排序字段
         */
        this.sort = function(ud, code){
        	var sortdata = this.data("datarows").sort(function(a, b) {
        		var aval = finedo.fn.getValue(a, code), bval = finedo.fn.getValue(b, code);
        		var ret = 0;
        		if(!isNaN(aval) && !isNaN(bval)){
        			if(parseFloat(aval) > parseFloat(bval))
        				ret = ud == "desc" ? -1 : 1;
        			else if(parseFloat(aval) < parseFloat(bval))
        				ret = ud == "desc" ? 1 : -1;
        			else
        				ret = 0;
        		}else{
        			if(ud == "asc")
        				ret = aval.localeCompare(bval);
        			else
        				ret = bval.localeCompare(aval);
        		}
        		return ret;
        	});
        	this.data("datarows", sortdata);
        	this.gridBodyShow(sortdata);
        };
        
        /**
         * 列编辑功能
         */
        this.tdEdit = function(event){
        	var curtd = $(this);
        	var tdTextValue = $.trim(curtd.text());
        	//将td的内容清空
        	curtd.empty();
            //新建一个输入框
            var input = $("<input>");
            input.width(curtd.width()-10);
            //将保存的文本内容赋值给输入框
            input.attr("value",tdTextValue);
            //将输入框添加到td中
            curtd.append(input);
            //给输入框注册事件，当失去焦点时就可以将文本保存起来
            input.blur(function(){
            	inputChange();
            });
            input.keyup(function(event){
            	//1.获取当前用户按下的键值
                //解决不同浏览器获得事件对象的差异,
                // IE用自动提供window.event，而其他浏览器必须显示的提供，即在方法参数中加上event
                var myEvent = event || window.event;
                var keyCode = myEvent.keyCode;
                //2.判断是否是ESC键按下
                if(keyCode == 27){
                	//将input输入框的值还原成修改之前的值
                	input.val(tdTextValue);
                } else if(keyCode == 13){
                	inputChange();
                }
            });
            //将输入框中的文本高亮选中
            //将jquery对象转化为DOM对象
            var inputDom = input.get(0);
            inputDom.select();
            //将td的点击事件移除
            curtd.unbind("click");
            inputChange = function(){
            	//将输入框的文本保存
                var inputText = input.val();
                //将td的内容，即输入框去掉,然后给td赋值
                event.data.data[event.data.column["code"]] = inputText;
                if(event.data.column["formatter"] != undefined){
					var fun = eval(event.data.column["formatter"]);
					curtd.html(fun(inputText, event.data.data));
				} else{
					curtd.html(inputText);
				}
                //让td重新拥有点击事件
                curtd.click(event.data, $finedogrid.tdEdit);
                if(inputText == tdTextValue)
                	return;
                updateInput();
            };
            recoveryInput = function(){
            	event.data.data[event.data.column["code"]] = tdTextValue;
        		if(event.data.column["formatter"] != undefined){
					var fun = eval(event.data.column["formatter"]);
					curtd.html(fun(tdTextValue, event.data.data));
				} else{
					curtd.html(tdTextValue);
				}
            };
            updateInput = function(){
            	var options = $finedogrid.data("options");
            	if(options.updateurl == undefined || options.updateurl == ''){
            		recoveryInput();
            		finedo.message.error("未配置更新请求Action!");
            		return;
            	}
            	finedo.message.question("是否更新此条记录", null, function(isupdate){
            		if(!isupdate){
            			recoveryInput();
            			return;
            		}
                	finedo.message.showWaiting();
                	$.post(options.updateurl,event.data.data,function(retjson){
        	        	finedo.message.hideWaiting();
        	        	if(retjson.resultcode != finedo.resultcode.success){
        	        		finedo.message.error(retjson.resultdesc);
        	        		recoveryInput();
        	        	}
        			},'json');
            	});
            };
        };
        
        /**
         * 以子表方式展开
         */
        this.rowExpand = function(rowid, callback, reload){
        	var rowindex = rowid.substring(rowid.lastIndexOf('-')+1);
        	var rowItem = $("#"+rowid);
    		var nextRowItem = rowItem.next("tr");
        	if($(nextRowItem).attr("expandtr") == "true"){
        		$(nextRowItem).toggle();
        		
        		if($(nextRowItem).is(':hidden')){
        			if(reload)
            			$(nextRowItem).remove();
        		}
        		return;
        	}
    		var cols = this.data("columns").length;
        	if(finedo.fn.isTrue(this.data("options").rownumbers))
        		cols += 1;
        	if(finedo.fn.isFunction(this.data("options").expand))
        		cols += 1;
        	var expandHtml = '<tr expandtr="true"><td colspan="'+cols+'"><div>'+callback(this.data("datarows")[rowindex])+'</div></td></tr>';
        	rowItem.after(expandHtml);
        };
        
        /**
         * 获取表格列属性，如果有全选列，则绑定全选事件，如果有排序按钮，则绑定排序事件
         */
        this.gridHead = function(){
        	var columns = [];//字段数组
        	$(this).find("thead tr").each(function(trindex,tritem){
        		$(tritem).find("th").each(function(tdindex,tditem){
        			var column = {};
        			var ischeckbox = false;
                    $.each($(this)[0].attributes, function(index, attr) {
						column[attr.name] = attr.value;
						if(attr.name == "checkbox" && attr.value == "true"){
							ischeckbox = true;
						}
					});
					columns.push(column);
					//如果判断有checkbox选择，则绑定全选事件
					if(ischeckbox){
						$finedogrid.data("keycodes", column.code);
						$(tditem).find("input[type=checkbox]").each(function(inputindex, inputcheckbox){
							$(inputcheckbox).click(function(){
								$finedogrid.selectAll(this.checked);
							});
						});
					}
					$(tditem).find("input[type=button]").each(function(orderindex, orderitem){
						$(orderitem).click(function(){
							$finedogrid.gridSort(this, column.code);
						});
					});
                });
        	});
        	return columns;
        };
        
        //表格展示
        this.gridShow = function(data){
        	try{
        		var options = this.data("options");
        		pages = $finedogrid.pageOption();
        		var datarows;
        		//一次加载所有数据后再分页处理，在前台对数据进行解析
        		if(finedo.fn.isTrue(options.oncerequest)){
        			var alldatarows;
        			if(this.data("alldatarows")){
        				alldatarows = this.data("alldatarows");
        			}else{
        				alldatarows = data;
        				this.data("alldatarows", data);
        			}
        			datarows = [];
        			var startRowIndex = parseInt(pages.rows)*(parseInt(pages.page)-1);
        			var endRowIndex = parseInt(pages.rows)*parseInt(pages.page);
        			for(var index = startRowIndex; index < alldatarows.total && index < endRowIndex; index++){
        				datarows.push(alldatarows.rows[index]);
        			}
        		}else{
        			datarows = data.rows;
        		}
        		this.data("datarows", datarows);
        		if(finedo.fn.isTrue(options.pagination)){
        			pages.total = data.total;
        			pages.totalpage = Math.ceil(parseInt(pages.total) / parseInt(pages.rows));
        			$("#"+this.attr("id")+"total").html(pages.total);
        			$("#"+this.attr("id")+"totalpages").html(pages.totalpage);
        			$("#"+this.attr("id")+"jumppageval").val(pages.page);
        		}
        		this.gridBodyShow(datarows);
        	}catch(e){
        		finedo.message.error("服务请求异常:"+e.message);
        	}
        };
        this.gridBodyShow = function(datarows){
        	try{
	    		var options = this.data("options");
	    		var columns = this.data("columns");
	    		pages = $finedogrid.pageOption();
	    		var tbody;
        		this.find('tbody').each(function(index, tbodyitem){
        			tbody = $(tbodyitem);
        			tbody.html('');
        		});
        		var datalength = datarows.length;
	        	for(var rowindex = 0; rowindex < datalength; rowindex++){
	    			var tr = $('<tr>');
	    			var trid = this.attr("id")+"-tbody-tr-"+rowindex;
	    			tr.attr("id", trid);
	    			//判断是否为单选，单选增加双击选择事件
	    			if(options.selecttype == 'single'){
	    				tr.dblclick(datarows[rowindex], function(event){
		    				finedo.fn._triggerEvent(eventName, event.data);
	    				});
	    			}
	    			if(options.colortr && rowindex % 2 == 1){
	    				tr.addClass(options.colortr);
	    			}
	    			for(var colindex = 0; colindex < columns.length; colindex++){
	    				var td = $('<td>');
	    				//列编辑
	    				if(finedo.fn.isTrue(columns[colindex]["edit"])){
	    					td.click({"column":columns[colindex], "data":datarows[rowindex]}, $finedogrid.tdEdit);
	    				}
	    				if(columns[colindex]["className"]){
	    					td.addClass(columns[colindex]["className"]);
	    				}
	    				//显示序列
	    				if(finedo.fn.isTrue(options["rownumbers"]) && colindex == 0){
	    					var rownumbertd = $('<td>');
	    					if(finedo.fn.isTrue(options.pagination)){
	    						rownumbertd.html((parseInt(pages.page)-1)*parseInt(pages.rows) + parseInt(rowindex)+1);
	    					}else {
	    						rownumbertd.html(parseInt(rowindex)+1);
	    					}
	    					tr.append(rownumbertd);
	    				}
	    				//checkbox选择框
	    				if(finedo.fn.isTrue(columns[colindex]["checkbox"])){
	    					var checkboxitem = $('<input type="checkbox" style="display:block;"/>');
	    					td.html(checkboxitem);
	    					if($finedogrid.isSelected(datarows[rowindex])){
	    						$(checkboxitem).attr('checked', true);
	    					}
	    					checkboxitem.data('data',datarows[rowindex]);
	    					checkboxitem.bind('change',function(event, tr){
	    						$finedogrid.rowSelected(this);
	    					});
	    				}else{
	    					if(finedo.fn.isFunction(columns[colindex]["formatter"])){
	    						var fun = eval(columns[colindex]["formatter"]);
	    						td.html(fun(trid, datarows[rowindex]));
	    					} else{
	    						td.html(finedo.fn.getValue(datarows[rowindex], columns[colindex]["code"]));
	    					}
	    				}
	    				tr.append(td);
	    			}
	    			//增加扩展列
	            	if(finedo.fn.isFunction(options.expand)){
	            		var expandtd = $('<td>');
	            		var expandbtn = $('<input type=\"button\" class=\"expand\" title=\"点击展示\"/>');
	            		expandbtn.bind('click', {rowid:trid,callback:eval(options.expand)}, function(event){
	            			$finedogrid.rowExpand(event.data.rowid, event.data.callback);
	            		});
	            		expandtd.append(expandbtn);
	            		tr.append(expandtd);
	            	}
	    			tbody.append(tr);
	    		}
        	}catch(e){
        		finedo.message.error("表格加载异常:"+e.message);
        	}
        };
        //表格加载，pageload为true表示分页加载，还显示当前页数据
		this.load = function(options, pageload){
			if(pageload != true){
				var options = $.extend(this.data("options"),options);
				$finedogrid.data("options", options);
				$finedogrid.pageOption({page:1, rows:options.pagesize, total:0, totalpage:1});
				this.removeData("alldatarows");
				selectedItems = [];
				ascItems = [];
				descItems = [];
			}
			//如果为一次加载所有数据，则判断数据是否已加载，已加载则直接取缓存数据
			if(this.data("alldatarows")){
				$finedogrid.gridShow(this.data("alldatarows"));
				return;
			}
			options = $finedogrid.data("options");
			pages = $finedogrid.pageOption();
			var loadurl = options.url;
			if(finedo.fn.isTrue(options.pagination)){
				if(loadurl.indexOf("?") == -1){
					loadurl += "?page="+pages.page+"&rows="+(finedo.fn.isTrue(options.oncerequest) ? "100000000" : pages.rows);
				}else{
					loadurl += "&page="+pages.page+"&rows="+(finedo.fn.isTrue(options.oncerequest) ? "100000000" : pages.rows);
				}
			}
			//如果有排序字段，将以asc与desc为键将值请求到服务端
			if(ascItems.length > 0){
				loadurl += loadurl.indexOf("?") == -1 ? "?" : "&";
				loadurl += "asc="+ascItems.join();
			}
			if(descItems.length > 0){
				loadurl += loadurl.indexOf("?") == -1 ? "?" : "&";
				loadurl += "desc="+descItems.join();
			}
			
			finedo.message.showWaiting();
	        $.post(loadurl,options.data,function(data){
	        	finedo.message.hideWaiting();
				if($.isFunction(options.callback)){
					options.callback(data);
				}else{
					$finedogrid.gridShow(data);
				}
			},'json');
		};
		
		/**
		 * 初始化
		 */
		this.init = function(){
			if($finedogrid.data('init') == true)
        		return $finedogrid;
			$finedogrid.data('init', true);
        	var defaults = {
                pagination : true,	//是否分布，默认不传为分页
                rownumbers : true	//显示序号
            };
            
    		//获取表格中设置的属性
    		$.each(this[0].attributes, function(index, attr) {
    			defaults[attr.name] = attr.value;
    		});
    		
            var options = $.extend(defaults,options);
            //保存对象的options
            this.data("options", options);
            //根据标题头获取各列的属性
            var columns = this.gridHead();
            this.data("columns", columns);
            //判断是否显示序号，显示则表头增加一列
            if(finedo.fn.isTrue(options.rownumbers)){
	            $(this).find("thead tr").each(function(trindex,tritem){
	            	$(tritem).prepend('<th width="30"></th>');
	            });
            }
            if(finedo.fn.isFunction(options.expand)){
	            $(this).find("thead tr").each(function(trindex,tritem){
	            	$(tritem).append('<th width="20"></th>');
	            });
            }
            $finedogrid.pageOption({page:1, rows:20, total:0, totalpage:1});
            pages = $finedogrid.pageOption();
            if(options.pagesize){
            	pages.rows = options.pagesize;
            }
            
            //初始化tbody
            this.append($('<tbody>'));
            //判断是否分页
            if(finedo.fn.isTrue(options.pagination)){
            	var cols = columns.length;
            	if(finedo.fn.isTrue(options.rownumbers))
            		cols += 1;
            	if(finedo.fn.isFunction(options.expand))
            		cols += 1;
            	var pagestr = '<div class="number">' +
            			'<div class="num">' +
            			'<label><input class="btn-num" type="button" id="'+this.attr("id")+'firstpagebtn" value="首页"/></label>' +
            			'<label><input class="btn-num" type="button" id="'+this.attr("id")+'prepagebtn" value="<<" title="上一页"/></label>' +
            			'<label><input class="btn-num" type="button" id="'+this.attr("id")+'nextpagebtn" value=">>" title="下一页"/></label>' +
            			'<label><input class="btn-num" type="button" id="'+this.attr("id")+'lastpagebtn" value="末页"/></label>' +
            			'<label>跳转到<input class="text-num" type="text" id="'+this.attr("id")+'jumppageval"/>页/<span class="red" id="'+this.attr("id")+'totalpages">1</span>页&nbsp;</label>' +
            			'<label><input class="btn-num" type="button" value="GO" id="'+this.attr("id")+'jumppagebtn" title="跳转到指定页"/></label>' +
            			'<label>共<span class="red" id="'+this.attr("id")+'total">0</span>条</label></div>' +
            			'<div class="show">' +
            			'<select class="showsel" id="'+this.attr("id")+'pagesel">' +
            			'<option '+(pages.rows == 10 ? 'selected' : '')+'>10</option>' +
            			'<option '+(pages.rows == 20 ? 'selected' : '')+'>20</option>' +
            			'<option '+(pages.rows == 50 ? 'selected' : '')+'>50</option>' +
            			'<option '+(pages.rows == 100 ? 'selected' : '')+'>100</option>' +
            			'</select></div></div>';
            	var tfoot = $('<tfoot><tr><td colspan="'+cols+'">'+pagestr+'</td></tr></tfoot>');
            	
            	this.append(tfoot);
            	$("#"+this.attr("id")+"firstpagebtn").bind("click",function(){
            		$finedogrid.firstPage();
            	});
            	$("#"+this.attr("id")+"prepagebtn").bind("click",function(){
            		$finedogrid.prePage();
            	});
            	$("#"+this.attr("id")+"nextpagebtn").bind("click",function(){
            		$finedogrid.nextPage();
            	});
            	$("#"+this.attr("id")+"lastpagebtn").bind("click",function(){
            		$finedogrid.lastPage();
            	});
            	$("#"+this.attr("id")+"pagesel").bind("change",function(){
            		pages.rows = $(this).val();
            		$finedogrid.refresh();
            	});
            	$("#"+this.attr("id")+"jumppagebtn").bind("click",function(){
            		var jumpval = $.trim($("#"+$finedogrid.attr("id")+"jumppageval").val());
            		var regu = "^[1-9]{1}[0-9]*$";
            		var re = new RegExp(regu);
            		if (jumpval.search(re) == -1) {
            			finedo.message.warning("请输入正整数！");
            			return;
            		}
            		$finedogrid.junmPage(jumpval);
            	});
            }
            return $finedogrid;
        };
		return this.init();
	};

})(jQuery);

/**
 * 定义控件获取函数
 */ 
finedo.getGrid = function(controlid){
	var fileControl = $('#'+controlid).grid();
	return fileControl;
};

/**
 * 页面加载后自动加载表格控件
 */
$(document.body).ready(function(){
	$(document.body).find("table").each(function(tableindex,tableitem){
		if(finedo.fn.isNotNon($(tableitem).attr('id')))
			finedo.getGrid($(tableitem).attr('id')).load();
	});
});

/**
 * 执行命令
 * datagrid:指定查询的数据列表对象
 * param:查询参数
 * url:调用的路径
 */
finedo.action.doSearch = function(datagrid,param,url){
	var coptions = {};
	if(param)
		coptions.data = param;
	if(url)
		coptions.url = url;
	$("#"+datagrid).grid().load(coptions);
};
/**
 * 删除记录的公用方法
 * datagrid:指定被删除的数据列表对象
 * action:指定删除数据的处理方法
 * itemid:记录的编号
 * callback:执行完成后的回调函数
 */
finedo.action.doDelete = function(datagrid,action,itemid,callback){
	if(itemid==""){
		finedo.message.info("请选择要删除的记录！");
		return;
	}
	message = "您确定删除该记录吗？";
	
	finedo.message.question(message, null, function(which){  
        if (which){ 
        	finedo.message.showWaiting();
        	$.getJSON(action+'?id='+itemid, function(ret){
        		finedo.message.hideWaiting();
        		if(ret.resultcode == finedo.resultcode.success){
        			finedo.message.info(ret.resultdesc);
	        		$("#"+datagrid).grid().refresh();
					if($.isFunction(callback)){
						callback();
					}
        		}else
        			finedo.message.error(ret.resultdesc);
            });
        }  
    });  
};
/**
 * 批量删除记录的公用方法
 * datagrid:指定被删除的数据列表对象
 * action:指定删除数据的处理方法
 * key:指定记录的主键编码
 * callback:执行完成后的回调函数
 */
finedo.action.doBatchDelete = function(datagrid,action,callback){
	var ids = [];
	var message = "您确定删除这些记录吗?";
	var rows = $('#'+datagrid).grid().getSelectedItem();
	var keycodes = $('#'+datagrid).grid().getKeycode();
	for(var i=0; i<rows.length; i++){
		var keyary = keycodes.split(",");
		var idstr = "";
		for(var keyindex = 0; keyindex < keyary.length; keyindex++){
			if(idstr != "")
				idstr += "#";
			idstr += finedo.fn.getValue(rows[i], keyary[keyindex]);
		}
		ids.push(idstr);
	}
	if(ids.length==0){
		finedo.message.warning("请选择要删除的记录！");
		return;
	}
	finedo.message.question(message, null, function(which){  
        if (which){ 
        	finedo.message.showWaiting();
        	$.getJSON(action+'?id='+ids.join(','), function(ret){
        		finedo.message.hideWaiting();
        		if(ret.resultcode == finedo.resultcode.success){
        			finedo.message.info(ret.resultdesc);
	        		$("#"+datagrid).grid().refresh();
					if($.isFunction(callback)){
						callback();
					}
        		}else
        			finedo.message.error(ret.resultdesc);
            });
        }  
    });  
};

