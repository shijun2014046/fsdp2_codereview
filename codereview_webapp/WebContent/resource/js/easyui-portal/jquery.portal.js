(function(b){function e(l){b(l).addClass("portal");var j=b('<table border="0" cellspacing="0" cellpadding="0"><tr></tr></table>').appendTo(l);var k=j.find("tr");var g=[];var f=0;b(l).find(">div").each(function(){var i=b(this);f+=i.outerWidth();g.push(i.outerWidth());var m=b('<td class="portal-column-td"></td>').appendTo(k);i.addClass("portal-column").appendTo(m);i.find(">div").each(function(){var n=b(this).addClass("portal-p").panel({doSize:false,cls:"portal-panel"});c(l,n)})});for(var h=0;h<g.length;h++){g[h]/=f}b(l).bind("_resize",function(){var i=b.data(l,"portal").options;if(i.fit==true){d(l)}return false});return g}function d(m){var q=b(m);var f=b.data(m,"portal").options;if(f.fit){var h=q.parent();f.width=h.width();f.height=h.height()}if(!isNaN(f.width)){if(b.boxModel==true){q.width(f.width-(q.outerWidth()-q.width()))}else{q.width(f.width)}}else{q.width("auto")}if(!isNaN(f.height)){if(b.boxModel==true){q.height(f.height-(q.outerHeight()-q.height()))}else{q.height(f.height)}}else{q.height("auto")}var o=q.find(">table").outerHeight()>q.height();var j=q.width();var g=b.data(m,"portal").columnWidths;var k=0;for(var l=0;l<g.length;l++){var h=q.find("div.portal-column:eq("+l+")");var n=Math.floor(j*g[l]);if(l==g.length-1){n=j-k-(o==true?28:10)}if(b.boxModel==true){h.width(n-(h.outerWidth()-h.width()))}else{h.width(n)}k+=h.outerWidth();h.find("div.portal-p").panel("resize",{width:h.width()})}}function c(j,g){var i;g.panel("panel").draggable({handle:">div.panel-header>div.panel-title",proxy:function(l){var m=b('<div class="portal-proxy">proxy</div>').insertAfter(l);m.width(b(l).width());m.height(b(l).height());m.html(b(l).html());m.find("div.portal-p").removeClass("portal-p");return m},onStartDrag:function(l){b(this).hide();i=b('<div class="portal-spacer"></div>').insertAfter(this);k(b(this).outerWidth(),b(this).outerHeight())},onDrag:function(m){var l=f(m,this);if(l){if(l.pos=="up"){i.insertBefore(l.target)}else{i.insertAfter(l.target)}k(b(l.target).outerWidth())}else{var n=h(m);if(n){if(n.find("div.portal-spacer").length==0){i.appendTo(n);d(j);k(n.width())}}}},onStopDrag:function(m){b(this).css("position","static");b(this).show();i.hide();b(this).insertAfter(i);i.remove();d(j);var l=b.data(j,"portal").options;l.onStopDrag.call()}});function f(n,m){var l=null;b(j).find("div.portal-p").each(function(){var o=b(this).panel("panel");if(o[0]!=m){var p=o.offset();if(n.pageX>p.left&&n.pageX<p.left+o.outerWidth()&&n.pageY>p.top&&n.pageY<p.top+o.outerHeight()){if(n.pageY>p.top+o.outerHeight()/2){l={target:o,pos:"down"}}else{l={target:o,pos:"up"}}}}});return l}function h(m){var l=null;b(j).find("div.portal-column").each(function(){var n=b(this);var o=n.offset();if(m.pageX>o.left&&m.pageX<o.left+n.outerWidth()){l=n}});return l}function k(m,l){if(b.boxModel==true){i.width(m-(i.outerWidth()-i.width()));if(l){i.height(l-(i.outerHeight()-i.height()))}}else{i.width(m);if(l){i.height(l)}}}}function a(j){var f=[];var g=function(i){if(typeof i=="object"&&i!=null){return a(i)}return/^(string|number)$/.test(typeof i)?"'"+i+"'":i};for(var h in j){f.push("'"+h+"':"+g(j[h]))}return"{"+f.join(",")+"}"}b.fn.portal=function(f,g){if(typeof f=="string"){return b.fn.portal.methods[f](this,g)}f=f||{};return this.each(function(){var h=b.data(this,"portal");if(h){b.extend(h.options,f)}else{h=b.data(this,"portal",{options:b.extend({},b.fn.portal.defaults,b.fn.portal.parseOptions(this),f),columnWidths:e(this)})}if(h.options.border){b(this).removeClass("portal-noborder")}else{b(this).addClass("portal-noborder")}d(this)})};b.fn.portal.methods={options:function(f){return b.data(f[0],"portal").options},resize:function(g,f){return g.each(function(){if(f){var h=b.data(this,"portal").options;if(f.width){h.width=f.width}if(f.height){h.height=f.height}}d(this)})},getPanels:function(i,g){var h=i;if(g){h=i.find("div.portal-column:eq("+g+")")}var f=[];h.find("div.portal-p").each(function(){f.push(b(this))});return f},add:function(g,f){return g.each(function(){var i=b(this).find("div.portal-column:eq("+f.columnIndex+")");var h=f.panel.addClass("portal-p");h.panel("open");h.panel("panel").addClass("portal-panel").appendTo(i);c(this,h);h.panel("resize",{width:i.width()})})},remove:function(g,f){return g.each(function(){var h=b(this).portal("getPanels");for(var j=0;j<h.length;j++){var k=h[j];if(k[0]==b(f)[0]){k.panel("destroy")}}})},getLayout:function(k){var n=b(k).portal("getPanels");var h=b(k).find(".portal-column-td");var f="{";var o=0;for(var m=0;m<h.length;m++){var g='"'+m+'":[';var p=b(h[m]).find(".portal-panel").length;for(var l=0;l<p;l++){g+=a(n[o].panel("options"))+",";o++}g=g.substring(0,g.length-1)+"]";f+=g+","}if(f.substring(0,f.length-1)==""){f=f+"}"}else{f=f.substring(0,f.length-1)+"}"}return f},getPanelForTitle:function(i,h){var f=b(i).portal("getPanels");var g;b.each(f,function(k,j){if(j.panel("options").title==h){g=j;return}});return g}};b.fn.portal.parseOptions=function(g){var f=b(g);return{width:(parseInt(g.style.width)||undefined),height:(parseInt(g.style.height)||undefined),border:(f.attr("border")?f.attr("border")=="true":undefined),fit:(f.attr("fit")?f.attr("fit")=="true":undefined)}};b.fn.portal.defaults={width:"auto",height:"auto",border:true,fit:false,onStopDrag:function(){}}})(jQuery);