<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ include file="/fsdp/common/taglibs.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title></title>
	${jquery_js }
	${highcharts_js }
	<c:if test="${!empty param.theme }">
	<script src='${ctx}/resource/js/highcharts/themes/${param.theme }.js' type='text/javascript'></script>
	</c:if>
</head>
<body>
<div>
	 图表主题：
	<button class="btn btn-primary" theme="default" onclick="changeTheme('')">默认</button>
	<button class="btn" theme="grid" onclick="changeTheme('grid')">网格 (grid)</button>
	<button class="btn" theme="grid-light" onclick="changeTheme('grid-light')">grid-light</button>
	<button class="btn" theme="skies" onclick="changeTheme('skies')">天空 (skies)</button>
	<button class="btn" theme="gray" onclick="changeTheme('gray')">灰色 (gray)</button>
	<button class="btn" theme="dark-blue" onclick="changeTheme('dark-blue')">深蓝 (dark-blue)</button>
	<button class="btn" theme="dark-green" onclick="changeTheme('dark-green')">深绿 (dark-green)</button>
	<button class="btn" theme="dark-unica" onclick="changeTheme('dark-unica')">dark-unica</button>
	<button class="btn" theme="sand-signika" onclick="changeTheme('sand-signika')">sand-signika</button>
</div>
<div id="container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>

<script language="javascript">
function changeTheme(themeName){
	window.location.href="${ctx }/fsdp/developer/demo/highcharts/dynamic.jsp?theme="+themeName;
}
$(function () {                                                                     
    $(document).ready(function() {                                                  
        Highcharts.setOptions({                                                     
            global: {                                                               
                useUTC: false                                                       
            }                                                                       
        });                                                                         
                                                                                    
        var chart;                                                                  
        $('#container').highcharts({                                                
            chart: {                                                                
                type: 'spline',                                                     
                animation: Highcharts.svg, // don't animate in old IE               
                marginRight: 10,                                                    
                events: {                                                           
                    load: function() {                                              
                                                                                    
                        // set up the updating of the chart each second             
                        var series = this.series[0];                                
                        setInterval(function() {                                    
                            var x = (new Date()).getTime(), // current time         
                                y = Math.random();                                  
                            series.addPoint([x, y], true, true);                    
                        }, 1000);                                                   
                    }                                                               
                }                                                                   
            },                                                                      
            title: {                                                                
                text: 'Live random data'                                            
            },                                                                      
            xAxis: {                                                                
                type: 'datetime',                                                   
                tickPixelInterval: 150                                              
            },                                                                      
            yAxis: {                                                                
                title: {                                                            
                    text: 'Value'                                                   
                },                                                                  
                plotLines: [{                                                       
                    value: 0,                                                       
                    width: 1,                                                       
                    color: '#808080'                                                
                }]                                                                  
            },                                                                      
            tooltip: {                                                              
                formatter: function() {                                             
                        return '<b>'+ this.series.name +'</b><br/>'+                
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                        Highcharts.numberFormat(this.y, 2);                         
                }                                                                   
            },                                                                      
            legend: {                                                               
                enabled: false                                                      
            },                                                                      
            exporting: {                                                            
                enabled: false                                                      
            },                                                                      
            series: [{                                                              
                name: 'Random data',                                                
                data: (function() {                                                 
                    // generate an array of random data                             
                    var data = [],                                                  
                        time = (new Date()).getTime(),                              
                        i;                                                          
                                                                                    
                    for (i = -19; i <= 0; i++) {                                    
                        data.push({                                                 
                            x: time + i * 1000,                                     
                            y: Math.random()                                        
                        });                                                         
                    }                                                               
                    return data;                                                    
                })()                                                                
            }]                                                                      
        });                                                                         
    });                                                                             
                                                                                    
});
</script>
</body>
</html>