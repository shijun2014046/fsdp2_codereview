<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ include file="/common/taglibs.jsp" %>
<!DOCTYPE html>
<html>
<head>
<title>发送短信</title>
${style_css }
${jquery_js }
${easyui_js }
${finedo_js }
${validator_js }
${ueditor_js }
${datepicker_js }
</head>
<body class="easyui-layout">
<div region="center" style="padding:5px;" border="false">
  <div class="easyui-panel" title="当前位置：短信管理 &gt; 发送短信" style="width:auto;padding:10px;" fit="true">
	<form method="post" action="${ctx }/finedo/sms/addSms" id="ajaxForm" >
		<jsp:include page="/fsdp/sms/_common.jsp"></jsp:include>
	</form>
  </div>
</div>  
<div data-options="region:'south',border:false" style="text-align:right;padding:5px;">  
    <a class="easyui-linkbutton" data-options="iconCls:'icon-ok'" href="javascript:void(0)" onclick="javascript:save()">发送</a>   
</div>
</body>
</html>
