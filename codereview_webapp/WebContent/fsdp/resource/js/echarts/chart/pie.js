define("echarts/chart/pie",["require","../component/base","./base","zrender/shape/Text","zrender/shape/Ring","zrender/shape/Circle","zrender/shape/Sector","zrender/shape/BrokenLine","../config","../util/ecData","zrender/tool/util","zrender/tool/math","zrender/tool/color","../chart"],function(w){function A(l,d,c,m,h){u.call(this,l,d,c,m,h),j.call(this);var i=this;i.shapeHandler.onmouseover=function(I){var L=I.target,G=x.get(L,"seriesIndex"),D=x.get(L,"dataIndex"),K=x.get(L,"special"),C=[L.style.x,L.style.y],M=L.style.startAngle,F=L.style.endAngle,H=((F+M)/2+360)%360,E=L.highlightStyle.color,J=i.getLabel(G,D,K,C,H,E,!0);J&&i.zr.addHoverShape(J);var r=i.getLabelLine(G,D,C,L.style.r0,L.style.r,H,E,!0);r&&i.zr.addHoverShape(r)},this.refresh(m)}var u=w("../component/base"),j=w("./base"),z=w("zrender/shape/Text"),g=w("zrender/shape/Ring"),B=w("zrender/shape/Circle"),b=w("zrender/shape/Sector"),q=w("zrender/shape/BrokenLine"),v=w("../config"),x=w("../util/ecData"),k=w("zrender/tool/util"),y=w("zrender/tool/math"),f=w("zrender/tool/color");return A.prototype={type:v.CHART_TYPE_PIE,_buildShape:function(){var C=this.series,p=this.component.legend;this.selectedMap={},this._selected={};var o,D,h;this._selectedMode=!1;for(var s,d=0,c=C.length;c>d;d++){if(C[d].type===v.CHART_TYPE_PIE){if(C[d]=this.reformOption(C[d]),this.legendHoverLink=C[d].legendHoverLink||this.legendHoverLink,s=C[d].name||"",this.selectedMap[s]=p?p.isSelected(s):!0,!this.selectedMap[s]){continue}o=this.parseCenter(this.zr,C[d].center),D=this.parseRadius(this.zr,C[d].radius),this._selectedMode=this._selectedMode||C[d].selectedMode,this._selected[d]=[],this.deepQuery([C[d],this.option],"calculable")&&(h={zlevel:this._zlevelBase,hoverable:!1,style:{x:o[0],y:o[1],r0:D[0]<=10?0:D[0]-10,r:D[1]+10,brushType:"stroke",lineWidth:1,strokeColor:C[d].calculableHolderColor||this.ecTheme.calculableHolderColor}},x.pack(h,C[d],d,void 0,-1),this.setCalculable(h),h=D[0]<=10?new B(h):new g(h),this.shapeList.push(h)),this._buildSinglePie(d),this.buildMark(d)}}this.addShapeList()},_buildSinglePie:function(Z){for(var J,T=this.series,P=T[Z],ad=P.data,O=this.component.legend,K=0,M=0,R=0,W=Number.NEGATIVE_INFINITY,aa=[],Q=0,ab=ad.length;ab>Q;Q++){J=ad[Q].name,this.selectedMap[J]=O?O.isSelected(J):!0,this.selectedMap[J]&&!isNaN(ad[Q].value)&&(0!==+ad[Q].value?K++:M++,R+=+ad[Q].value,W=Math.max(W,+ad[Q].value))}if(0!==R){for(var N,I,C,D,X,F,Y=100,ae=P.clockWise,ac=(P.startAngle.toFixed(2)-0+360)%360,G=P.minAngle||0.01,S=360-G*K-0.01*M,E=P.roseType,Q=0,ab=ad.length;ab>Q;Q++){if(J=ad[Q].name,this.selectedMap[J]&&!isNaN(ad[Q].value)){if(I=O?O.getColor(J):this.zr.getColor(Q),Y=ad[Q].value/R,N="area"!=E?ae?ac-Y*S-(0!==Y?G:0.01):Y*S+ac+(0!==Y?G:0.01):ae?ac-360/ab:360/ab+ac,N=N.toFixed(2)-0,Y=(100*Y).toFixed(2),C=this.parseCenter(this.zr,P.center),D=this.parseRadius(this.zr,P.radius),X=+D[0],F=+D[1],"radius"===E?F=ad[Q].value/W*(F-X)*0.8+0.2*(F-X)+X:"area"===E&&(F=Math.sqrt(ad[Q].value/W)*(F-X)+X),ae){var H;H=ac,ac=N,N=H}this._buildItem(aa,Z,Q,Y,ad[Q].selected,C,X,F,ac,N,I),ae||(ac=N)}}this._autoLabelLayout(aa,C,F);for(var Q=0,ab=aa.length;ab>Q;Q++){this.shapeList.push(aa[Q])}aa=null}},_buildItem:function(L,P,J,E,N,D,Q,d,I,K,G){var M=this.series,C=((K+I)/2+360)%360,O=this.getSector(P,J,E,N,D,Q,d,I,K,G);x.pack(O,M[P],P,M[P].data[J],J,M[P].data[J].name,E),L.push(O);var F=this.getLabel(P,J,E,D,C,G,!1),H=this.getLabelLine(P,J,D,Q,d,C,G,!1);H&&(x.pack(H,M[P],P,M[P].data[J],J,M[P].data[J].name,E),L.push(H)),F&&(x.pack(F,M[P],P,M[P].data[J],J,M[P].data[J].name,E),F._labelLine=H,L.push(F))},getSector:function(P,E,L,H,S,G,F,J,M,Q){var I=this.series,D=I[P],c=D.data[E],p=[c,D],N=this.deepMerge(p,"itemStyle.normal")||{},r=this.deepMerge(p,"itemStyle.emphasis")||{},O=this.getItemStyleColor(N.color,P,E,c)||Q,T=this.getItemStyleColor(r.color,P,E,c)||("string"==typeof O?f.lift(O,-0.2):O),R={zlevel:this._zlevelBase,clickable:this.deepQuery(p,"clickable"),style:{x:S[0],y:S[1],r0:G,r:F,startAngle:J,endAngle:M,brushType:"both",color:O,lineWidth:N.borderWidth,strokeColor:N.borderColor,lineJoin:"round"},highlightStyle:{color:T,lineWidth:r.borderWidth,strokeColor:r.borderColor,lineJoin:"round"},_seriesIndex:P,_dataIndex:E};if(H){var C=((R.style.startAngle+R.style.endAngle)/2).toFixed(2)-0;R.style._hasSelected=!0,R.style._x=R.style.x,R.style._y=R.style.y;var K=this.query(D,"selectedOffset");R.style.x+=y.cos(C,!0)*K,R.style.y-=y.sin(C,!0)*K,this._selected[P][E]=!0}else{this._selected[P][E]=!1}return this._selectedMode&&(R.onclick=this.shapeHandler.onclick),this.deepQuery([c,D,this.option],"calculable")&&(this.setCalculable(R),R.draggable=!0),(this._needLabel(D,c,!0)||this._needLabelLine(D,c,!0))&&(R.onmouseover=this.shapeHandler.onmouseover),R=new b(R)},getLabel:function(S,F,O,K,J,G,H){var M=this.series,P=M[S],T=P.data[F];if(this._needLabel(P,T,H)){var I,E,a,c=H?"emphasis":"normal",Q=k.merge(k.clone(T.itemStyle)||{},P.itemStyle),C=Q[c].label,R=C.textStyle||{},X=K[0],W=K[1],D=this.parseRadius(this.zr,P.radius),N="middle";C.position=C.position||Q.normal.label.position,"center"===C.position?(I=X,E=W,a="center"):"inner"===C.position||"inside"===C.position?(D=(D[0]+D[1])/2,I=Math.round(X+D*y.cos(J,!0)),E=Math.round(W-D*y.sin(J,!0)),G="#fff",a="center"):(D=D[1]- -Q[c].labelLine.length,I=Math.round(X+D*y.cos(J,!0)),E=Math.round(W-D*y.sin(J,!0)),a=J>=90&&270>=J?"right":"left"),"center"!=C.position&&"inner"!=C.position&&"inside"!=C.position&&(I+="left"===a?20:-20),T.__labelX=I-("left"===a?5:-5),T.__labelY=E;var m=new z({zlevel:this._zlevelBase+1,hoverable:!1,style:{x:I,y:E,color:R.color||G,text:this.getLabelText(S,F,O,c),textAlign:R.align||a,textBaseline:R.baseline||N,textFont:this.getFont(R)},highlightStyle:{brushType:"fill"}});return m._radius=D,m._labelPosition=C.position||"outer",m._rect=m.getRect(m.style),m._seriesIndex=S,m._dataIndex=F,m}},getLabelText:function(p,h,d,D){var c=this.series,C=c[p],l=C.data[h],m=this.deepQuery([l,C],"itemStyle."+D+".label.formatter");return m?"function"==typeof m?m.call(this.myChart,C.name,l.name,l.value,d):"string"==typeof m?(m=m.replace("{a}","{a0}").replace("{b}","{b0}").replace("{c}","{c0}").replace("{d}","{d0}"),m=m.replace("{a0}",C.name).replace("{b0}",l.name).replace("{c0}",l.value).replace("{d0}",d)):void 0:l.name},getLabelLine:function(P,E,L,J,S,I,F,G){var M=this.series,Q=M[P],H=Q.data[E];if(this._needLabelLine(Q,H,G)){var D=G?"emphasis":"normal",c=k.merge(k.clone(H.itemStyle)||{},Q.itemStyle),l=c[D].labelLine,N=l.lineStyle||{},m=L[0],O=L[1],T=S,R=this.parseRadius(this.zr,Q.radius)[1]- -l.length,C=y.cos(I,!0),K=y.sin(I,!0);return new q({zlevel:this._zlevelBase+1,hoverable:!1,style:{pointList:[[m+T*C,O-T*K],[m+R*C,O-R*K],[H.__labelX,H.__labelY]],strokeColor:N.color||F,lineType:N.type,lineWidth:N.width},_seriesIndex:P,_dataIndex:E})}},_needLabel:function(d,c,a){return this.deepQuery([c,d],"itemStyle."+(a?"emphasis":"normal")+".label.show")},_needLabelLine:function(d,c,a){return this.deepQuery([c,d],"itemStyle."+(a?"emphasis":"normal")+".labelLine.show")},_autoLabelLayout:function(m,h,d){for(var r=[],c=[],p=0,l=m.length;l>p;p++){("outer"===m[p]._labelPosition||"outside"===m[p]._labelPosition)&&(m[p]._rect._y=m[p]._rect.y,m[p]._rect.x<h[0]?r.push(m[p]):c.push(m[p]))}this._layoutCalculate(r,h,d,-1),this._layoutCalculate(c,h,d,1)},_layoutCalculate:function(I,M,G,D){function L(e,d,h){for(var c=e;d>c;c++){if(I[c]._rect.y+=h,I[c].style.y+=h,I[c]._labelLine&&(I[c]._labelLine.style.pointList[1][1]+=h,I[c]._labelLine.style.pointList[2][1]+=h),c>e&&d>c+1&&I[c+1]._rect.y>I[c]._rect.y+I[c]._rect.height){return void C(c,h/2)}}C(d-1,h/2)}function C(c,a){for(var d=c;d>=0&&(I[d]._rect.y-=a,I[d].style.y-=a,I[d]._labelLine&&(I[d]._labelLine.style.pointList[1][1]-=a,I[d]._labelLine.style.pointList[2][1]-=a),!(d>0&&I[d]._rect.y>I[d-1]._rect.y+I[d-1]._rect.height));d--){}}function N(V,Z,T,Q,Y){for(var P,aa,O,S=T[0],U=T[1],W=Y>0?Z?Number.MAX_VALUE:0:Z?Number.MAX_VALUE:0,R=0,X=V.length;X>R;R++){aa=Math.abs(V[R]._rect.y-U),O=V[R]._radius-Q,P=Q+O>aa?Math.sqrt((Q+O+20)*(Q+O+20)-Math.pow(V[R]._rect.y-U,2)):Math.abs(V[R]._rect.x+(Y>0?0:V[R]._rect.width)-S),Z&&P>=W&&(P=W-10),!Z&&W>=P&&(P=W+10),V[R]._rect.x=V[R].style.x=S+P*Y,V[R]._labelLine.style.pointList[2][0]=S+(P-5)*Y,V[R]._labelLine.style.pointList[1][0]=S+(P-20)*Y,W=P}}I.sort(function(c,a){return c._rect.y-a._rect.y});for(var p,F=0,H=I.length,J=[],E=[],K=0;H>K;K++){p=I[K]._rect.y-F,0>p&&L(K,H,-p,D),F=I[K]._rect.y+I[K]._rect.height}this.zr.getHeight()-F<0&&C(H-1,F-this.zr.getHeight());for(var K=0;H>K;K++){I[K]._rect.y>=M[1]?E.push(I[K]):J.push(I[K])}N(E,!0,M,G,D),N(J,!1,M,G,D)},reformOption:function(c){var a=k.merge;return c=a(c||{},this.ecTheme.pie),c.itemStyle.normal.label.textStyle=a(c.itemStyle.normal.label.textStyle||{},this.ecTheme.textStyle),c.itemStyle.emphasis.label.textStyle=a(c.itemStyle.emphasis.label.textStyle||{},this.ecTheme.textStyle),c},refresh:function(a){a&&(this.option=a,this.series=a.series),this.backupShapeList(),this._buildShape()},addDataAnimation:function(K){for(var P=this.series,J={},E=0,N=K.length;N>E;E++){J[K[E][0]]=K[E]}var D={},Q={},h={},I=this.shapeList;this.shapeList=[];for(var L,G,M,C={},E=0,N=K.length;N>E;E++){L=K[E][0],G=K[E][2],M=K[E][3],P[L]&&P[L].type===v.CHART_TYPE_PIE&&(G?(M||(D[L+"_"+P[L].data.length]="delete"),C[L]=1):M?C[L]=0:(D[L+"_-1"]="delete",C[L]=-1),this._buildSinglePie(L))}for(var O,F,E=0,N=this.shapeList.length;N>E;E++){switch(L=this.shapeList[E]._seriesIndex,O=this.shapeList[E]._dataIndex,F=L+"_"+O,this.shapeList[E].type){case"sector":D[F]=this.shapeList[E];break;case"text":Q[F]=this.shapeList[E];break;case"broken-line":h[F]=this.shapeList[E]}}this.shapeList=[];for(var H,E=0,N=I.length;N>E;E++){if(L=I[E]._seriesIndex,J[L]){if(O=I[E]._dataIndex+C[L],F=L+"_"+O,H=D[F],!H){continue}if("sector"===I[E].type){"delete"!=H?this.zr.animate(I[E].id,"style").when(400,{startAngle:H.style.startAngle,endAngle:H.style.endAngle}).start():this.zr.animate(I[E].id,"style").when(400,C[L]<0?{startAngle:I[E].style.startAngle}:{endAngle:I[E].style.endAngle}).start()}else{if("text"===I[E].type||"broken-line"===I[E].type){if("delete"===H){this.zr.delShape(I[E].id)}else{switch(I[E].type){case"text":H=Q[F],this.zr.animate(I[E].id,"style").when(400,{x:H.style.x,y:H.style.y}).start();break;case"broken-line":H=h[F],this.zr.animate(I[E].id,"style").when(400,{pointList:H.style.pointList}).start()}}}}}}this.shapeList=I},onclick:function(E){var G=this.series;if(this.isClick&&E.target){this.isClick=!1;for(var D,h=E.target,F=h.style,d=x.get(h,"seriesIndex"),H=x.get(h,"dataIndex"),c=0,C=this.shapeList.length;C>c;c++){if(this.shapeList[c].id===h.id){if(d=x.get(h,"seriesIndex"),H=x.get(h,"dataIndex"),F._hasSelected){h.style.x=h.style._x,h.style.y=h.style._y,h.style._hasSelected=!1,this._selected[d][H]=!1}else{var p=((F.startAngle+F.endAngle)/2).toFixed(2)-0;h.style._hasSelected=!0,this._selected[d][H]=!0,h.style._x=h.style.x,h.style._y=h.style.y,D=this.query(G[d],"selectedOffset"),h.style.x+=y.cos(p,!0)*D,h.style.y-=y.sin(p,!0)*D}this.zr.modShape(h.id,h)}else{this.shapeList[c].style._hasSelected&&"single"===this._selectedMode&&(d=x.get(this.shapeList[c],"seriesIndex"),H=x.get(this.shapeList[c],"dataIndex"),this.shapeList[c].style.x=this.shapeList[c].style._x,this.shapeList[c].style.y=this.shapeList[c].style._y,this.shapeList[c].style._hasSelected=!1,this._selected[d][H]=!1,this.zr.modShape(this.shapeList[c].id,this.shapeList[c]))}}this.messageCenter.dispatch(v.EVENT.PIE_SELECTED,E.event,{selected:this._selected,target:x.get(h,"name")},this.myChart),this.zr.refresh()}}},k.inherits(A,j),k.inherits(A,u),w("../chart").define("pie",A),A});