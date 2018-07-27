(function(b){var a=b.each,c=function(d,e){this.init(d,e)};b.extend(c.prototype,{init:function(d,e){this.options=d;this.chartOptions=e;this.columns=d.columns||this.rowsToColumns(d.rows)||[];this.columns.length?this.dataFound():(this.parseCSV(),this.parseTable(),this.parseGoogleSpreadsheet())},getColumnDistribution:function(){var d=this.chartOptions,e=d&&d.chart&&d.chart.type,f=[];a(d&&d.series||[],function(g){f.push((b.seriesTypes[g.type||e||"line"].prototype.pointArrayMap||[0]).length)});this.valueCount={global:(b.seriesTypes[e||"line"].prototype.pointArrayMap||[0]).length,individual:f}},dataFound:function(){if(this.options.switchRowsAndColumns){this.columns=this.rowsToColumns(this.columns)}this.parseTypes();this.findHeaderRow();this.parsed();this.complete()},parseCSV:function(){var u=this,v=this.options,t=v.csv,s=this.columns,r=v.startRow||0,q=v.endRow||Number.MAX_VALUE,m=v.startColumn||0,n=v.endColumn||Number.MAX_VALUE,p,l,j=0;t&&(l=t.replace(/\r\n/g,"\n").replace(/\r/g,"\n").split(v.lineDelimiter||"\n"),p=v.itemDelimiter||(t.indexOf("\t")!==-1?"\t":","),a(l,function(d,g){var e=u.trim(d),f=e.indexOf("#")===0;g>=r&&g<=q&&!f&&e!==""&&(e=d.split(p),a(e,function(h,i){i>=m&&i<=n&&(s[i-m]||(s[i-m]=[]),s[i-m][j]=h)}),j+=1)}),this.dataFound())},parseTable:function(){var g=this.options,h=g.table,n=this.columns,m=g.startRow||0,l=g.endRow||Number.MAX_VALUE,k=g.startColumn||0,j=g.endColumn||Number.MAX_VALUE;h&&(typeof h==="string"&&(h=document.getElementById(h)),a(h.getElementsByTagName("tr"),function(e,d){d>=m&&d<=l&&a(e.children,function(f,i){if((f.tagName==="TD"||f.tagName==="TH")&&i>=k&&i<=j){n[i-k]||(n[i-k]=[]),n[i-k][d-m]=f.innerHTML}})}),this.dataFound())},parseGoogleSpreadsheet:function(){var s=this,t=this.options,r=t.googleSpreadsheetKey,q=this.columns,p=t.startRow||0,o=t.endRow||Number.MAX_VALUE,l=t.startColumn||0,m=t.endColumn||Number.MAX_VALUE,n,j;r&&jQuery.ajax({dataType:"json",url:"https://spreadsheets.google.com/feeds/cells/"+r+"/"+(t.googleSpreadsheetWorksheet||"od6")+"/public/values?alt=json-in-script&callback=?",error:t.error,success:function(f){var f=f.feed.entry,i,g=f.length,d=0,h=0,e;for(e=0;e<g;e++){i=f[e],d=Math.max(d,i.gs$cell.col),h=Math.max(h,i.gs$cell.row)}for(e=0;e<d;e++){if(e>=l&&e<=m){q[e-l]=[],q[e-l].length=Math.min(h,o-p)}}for(e=0;e<g;e++){if(i=f[e],n=i.gs$cell.row-1,j=i.gs$cell.col-1,j>=l&&j<=m&&n>=p&&n<=o){q[j-l][n-p]=i.content.$t}}s.dataFound()}})},findHeaderRow:function(){a(this.columns,function(){});this.headerRow=0},trim:function(d){return typeof d==="string"?d.replace(/^\s+|\s+$/g,""):d},parseTypes:function(){for(var g=this.columns,h=g.length,l,k,j,i;h--;){for(l=g[h].length;l--;){k=g[h][l],j=parseFloat(k),i=this.trim(k),i==j?(g[h][l]=j,j>31536000000?g[h].isDatetime=!0:g[h].isNumeric=!0):(k=this.parseDate(k),h===0&&typeof k==="number"&&!isNaN(k)?(g[h][l]=k,g[h].isDatetime=!0):g[h][l]=i===""?null:i)}}},dateFormats:{"YYYY-mm-dd":{regex:"^([0-9]{4})-([0-9]{2})-([0-9]{2})$",parser:function(d){return Date.UTC(+d[1],d[2]-1,+d[3])}}},parseDate:function(f){var g=this.options.parseDate,j,i,h;g&&(j=g(f));if(typeof f==="string"){for(i in this.dateFormats){g=this.dateFormats[i],(h=f.match(g.regex))&&(j=g.parser(h))}}return j},rowsToColumns:function(g){var h,l,k,j,i;if(g){i=[];l=g.length;for(h=0;h<l;h++){j=g[h].length;for(k=0;k<j;k++){i[k]||(i[k]=[]),i[k][h]=g[h][k]}}}return i},parsed:function(){this.options.parsed&&this.options.parsed.call(this,this.columns)},complete:function(){var s=this.columns,t,r,q=this.options,p,o,l,m,n,j;if(q.complete||q.afterComplete){this.getColumnDistribution();s.length>1&&(t=s.shift(),this.headerRow===0&&t.shift(),t.isDatetime?r="datetime":t.isNumeric||(r="category"));for(m=0;m<s.length;m++){if(this.headerRow===0){s[m].name=s[m].shift()}}o=[];for(m=0,j=0;m<s.length;j++){p=b.pick(this.valueCount.individual[j],this.valueCount.global);l=[];if(m+p<=s.length){for(n=0;n<s[m].length;n++){l[n]=[t[n],s[m][n]!==void 0?s[m][n]:null],p>1&&l[n].push(s[m+1][n]!==void 0?s[m+1][n]:null),p>2&&l[n].push(s[m+2][n]!==void 0?s[m+2][n]:null),p>3&&l[n].push(s[m+3][n]!==void 0?s[m+3][n]:null),p>4&&l[n].push(s[m+4][n]!==void 0?s[m+4][n]:null)}}o[j]={name:s[m].name,data:l};m+=p}s={xAxis:{type:r},series:o};q.complete&&q.complete(s);q.afterComplete&&q.afterComplete(s)}}});b.Data=c;b.data=function(d,e){return new c(d,e)};b.wrap(b.Chart.prototype,"init",function(e,f,h){var g=this;f&&f.data?b.data(b.extend(f.data,{afterComplete:function(k){var j,d;if(f.hasOwnProperty("series")){if(typeof f.series==="object"){for(j=Math.max(f.series.length,k.series.length);j--;){d=f.series[j]||{},f.series[j]=b.merge(d,k.series[j])}}else{delete f.series}}f=b.merge(k,f);e.call(g,f,h)}}),f):e.call(g,f,h)})})(Highcharts);