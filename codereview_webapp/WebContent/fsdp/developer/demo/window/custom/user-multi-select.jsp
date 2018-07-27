<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ include file="/fsdp/common/taglibs.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>多用户选择窗口使用示例</title>
<link rel="stylesheet" type="text/css" href="${ctx}/fsdp/developer/demo/demo.css">
${style_css}
${jquery_js }
${easyui_js }
${finedo_js}
</head>
<body>
	<h2>多用户选择窗口</h2>
	<p>多用户选择窗口可以通过 &lt;fsdp:orgmultiselect&gt;标签创建。</p>
	<div style="margin:10px 0 40px 0;"></div>
	<p class="demo-subtitle">基本用法</p>
	<textarea rows="3" style="overflow: hidden;border: 1px dashed orange;">
		&lt;fsdp:orgmultiselect id="user" idfield="userid" namefield="username" >&lt;/fsdp:orgmultiselect>
	</textarea>
	<div style="padding:5px 0;">
	
	 <input type="hidden" name="userid" id="userid" value=""/><input type="text" style="background-image: url('${ctx}/resource/images/icon/ui-scroll-pane-table.png');background-repeat: no-repeat;background-position: right;cursor:pointer;" value="" id="username" name="username" onclick="$('#userWindows').window('open')"/>

<div id="userWindows" class="easyui-window" title="选择人员"data-options="modal:true,closed:true,iconCls:'icon-save',resizable:false"style="width:550px;height:450px;padding:1px;"><div class="easyui-layout" data-options="fit:true"><div data-options="region:'center'" style="padding:10px;"><div id="tb" style="padding:5px;height:auto">
<div align="right" style="width: 98%" class="easyui-layout"> 
	<div id="divadd" style="display:block;"> 
		<div >  
			<div> 
				<table width="100%" cellspacing="0" >
				  <tr>                
				    <td>
				    <div>   
				    	<div>     
				        &nbsp;姓名或工号：<input type="text" style=" width: 120px;" id="queryuserid" name ="queryuserid" />
				        <a class="easyui-linkbutton" data-options="iconCls:'icon-search'" href="javascript:void(0)" onclick="getUser();" onclick="" style="width:80px">查询</a>&nbsp;
				       <span id="prompt" name="prompt" style="color: red;visibility:hidden">无用户</span>
				    	</div>
					</div>
					</td>
				  </tr>			           
				</table>
				<table width="100%" cellspacing="0" >
				  <tr>                       
				    <th width="40%">                                             
			 			<div style="width: 100%; height: 280px;overflow: auto; overflow-x:hidden; text-align: left;">    
					       <div region="west" style="padding: 4px;width: 200px;"  border="false" >
							<fsdp:tree id="tt" url="${ctx }/finedo/organization/queryOrgTree" onclick="clickTree"></fsdp:tree>
							</div>
				        </div>                           
					</th>             
				    <td id="usertd1" style="width:170px;">      
				    	人员：
					    <br/>        
				    	<select name="a_Users" id="a_Users" style="width:100%; height:280px;" ondblclick="addToSelect()" multiple="multiple"></select>
					</td>
					<td  id="usertd2" style="width:160px;">    
					          已选人员：
					    <br/>
				    	<select name="a_selectUsers" id="a_selectUsers" ondblclick="removeFromSelect();" style="width:100%; height:280px;" multiple="multiple"></select>
					</td>
				  </tr> 
				  <tr style="height: 10px;"></tr>
				  <tr>                 
				    <td class="nobg" colspan="3" align="center" style="text-align:center;">     
				    <a class="easyui-linkbutton" data-options="iconCls:'icon-ok'" href="javascript:void(0)" onclick="addToSelect();" style="width:80px">添加</a>&nbsp;
				     	   <a class="easyui-linkbutton" data-options="iconCls:'icon-no'" href="javascript:void(0)"  onclick="removeFromSelect();" style="width:80px">移出</a>  
				     	   <a class="easyui-linkbutton" data-options="iconCls:'icon-ok'" href="javascript:void(0)" onclick="addToSelectAll();"style="width:80px">全部添加</a>
				     	   <a class="easyui-linkbutton" data-options="iconCls:'icon-reload'" href="javascript:void(0)"  onclick="removeFromSelectAll();" style="width:80px">全部移出</a>
						<a class="easyui-linkbutton" data-options="iconCls:'icon-ok'" href="javascript:void(0)" onclick="selectOK();" style="width:80px">确定</a>&nbsp;
						</td>
				  </tr>				           
				</table>
			</div>
		</div>
	</div>   
	</div>
	</div>
	</div>
	</div>
   
	<script type="text/javascript">
	function clickTree(){
		var node = $('#tt').tree('getSelected');
		if (node){
			var s = node.id;
			$("#orgid").val(s);
			doSearch(s);
		}
	}
	function doSearch(orgids){  	
		document.getElementById("prompt").style.visibility="hidden";
		$.getJSON("${ctx }/finedo/chooseuser/queryUserAll?orgid="+orgids,callbark);
	} 
	
	function callbark(data){
		$("#a_Users").empty();
		if(data.resultcode=='SUCCESS'){
			if(data.object.length > 0)
			{	
				for(var i = 0;i<data.object.length;i++){
					//alert(data.object[i].usercode);
					var userid = data.object[i].usercode;
					var username = data.object[i].username+"("+data.object[i].usercode+")";
					
					$("#a_Users").append("<option value='"+userid+"'>"+username+"</option>"); 
				}
			}else{
				document.getElementById("prompt").style.visibility="visible";//显示
			}			
		}else{
			document.getElementById("prompt").style.visibility="visible";//显示
		}
	}	

	function addToSelect(){  	
		$("#a_selectUsers").append("<option value='"+$("#a_Users  option:selected").val()+"'>"+$("#a_Users  option:selected").text()+"</option>"); 
	}  
	
	
    function removeFromSelect(){
    var selOpt = $("#a_selectUsers option:selected");  
    selOpt.remove();  
    }    
    
    function removeFromSelectAll(){
    	   $("#a_selectUsers").empty();
    }    
    
    function addToSelectAll(){ 
    	$("#a_selectUsers").empty();
    	for(var i=0;i<$("#a_Users option").length;i++){
    		$("#a_selectUsers").append("<option value='"+$("#a_Users").get(0).options[i].value+"'>"+$("#a_Users").get(0).options[i].text+"</option>"); 
  		 }    
    }    
    
    function getUser(){
    	document.getElementById("prompt").style.visibility="hidden";
    	var userid  = $('#queryuserid').val();
    	//alert(userid);
    	$.getJSON("${ctx }/finedo/chooseuser/query?usercode="+encodeURI(userid),callbark);
    }
    
    function selectOK() {
    	var username="",userid=""; 
    	for(var i=0;i<$("#a_selectUsers option").length;i++){
    		userid+=$("#a_selectUsers").get(0).options[i].value+",";    		
    		username+=$("#a_selectUsers").get(0).options[i].text+",";
  		 }    
    	
    	$("#username").val(username);
    	$("#userid").val(userid);
    	//alert(userid+"=="+username);
   		$('#userWindows').window('close');
    	}
    
  </script>
     </div> 
     
    
     	</div>
     
    
	
</body>
</html>