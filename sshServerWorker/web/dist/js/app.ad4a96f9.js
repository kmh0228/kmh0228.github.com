(function(t){function e(e){for(var r,o,c=e[0],u=e[1],s=e[2],l=0,f=[];l<c.length;l++)o=c[l],a[o]&&f.push(a[o][0]),a[o]=0;for(r in u)Object.prototype.hasOwnProperty.call(u,r)&&(t[r]=u[r]);d&&d(e);while(f.length)f.shift()();return i.push.apply(i,s||[]),n()}function n(){for(var t,e=0;e<i.length;e++){for(var n=i[e],r=!0,o=1;o<n.length;o++){var c=n[o];0!==a[c]&&(r=!1)}r&&(i.splice(e--,1),t=u(u.s=n[0]))}return t}var r={},o={app:0},a={app:0},i=[];function c(t){return u.p+"js/"+({about:"about"}[t]||t)+"."+{about:"fb9fb55d","chunk-8f3f4488":"cf5f6a7c"}[t]+".js"}function u(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,u),n.l=!0,n.exports}u.e=function(t){var e=[],n={"chunk-8f3f4488":1};o[t]?e.push(o[t]):0!==o[t]&&n[t]&&e.push(o[t]=new Promise(function(e,n){for(var r="css/"+({about:"about"}[t]||t)+"."+{about:"31d6cfe0","chunk-8f3f4488":"6483eff7"}[t]+".css",a=u.p+r,i=document.getElementsByTagName("link"),c=0;c<i.length;c++){var s=i[c],l=s.getAttribute("data-href")||s.getAttribute("href");if("stylesheet"===s.rel&&(l===r||l===a))return e()}var f=document.getElementsByTagName("style");for(c=0;c<f.length;c++){s=f[c],l=s.getAttribute("data-href");if(l===r||l===a)return e()}var d=document.createElement("link");d.rel="stylesheet",d.type="text/css",d.onload=e,d.onerror=function(e){var r=e&&e.target&&e.target.src||a,i=new Error("Loading CSS chunk "+t+" failed.\n("+r+")");i.code="CSS_CHUNK_LOAD_FAILED",i.request=r,delete o[t],d.parentNode.removeChild(d),n(i)},d.href=a;var p=document.getElementsByTagName("head")[0];p.appendChild(d)}).then(function(){o[t]=0}));var r=a[t];if(0!==r)if(r)e.push(r[2]);else{var i=new Promise(function(e,n){r=a[t]=[e,n]});e.push(r[2]=i);var s,l=document.createElement("script");l.charset="utf-8",l.timeout=120,u.nc&&l.setAttribute("nonce",u.nc),l.src=c(t),s=function(e){l.onerror=l.onload=null,clearTimeout(f);var n=a[t];if(0!==n){if(n){var r=e&&("load"===e.type?"missing":e.type),o=e&&e.target&&e.target.src,i=new Error("Loading chunk "+t+" failed.\n("+r+": "+o+")");i.type=r,i.request=o,n[1](i)}a[t]=void 0}};var f=setTimeout(function(){s({type:"timeout",target:l})},12e4);l.onerror=l.onload=s,document.head.appendChild(l)}return Promise.all(e)},u.m=t,u.c=r,u.d=function(t,e,n){u.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},u.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},u.t=function(t,e){if(1&e&&(t=u(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(u.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)u.d(n,r,function(e){return t[e]}.bind(null,r));return n},u.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return u.d(e,"a",e),e},u.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},u.p="/",u.oe=function(t){throw console.error(t),t};var s=window["webpackJsonp"]=window["webpackJsonp"]||[],l=s.push.bind(s);s.push=e,s=s.slice();for(var f=0;f<s.length;f++)e(s[f]);var d=l;i.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"034f":function(t,e,n){"use strict";var r=n("64a9"),o=n.n(r);o.a},"56d7":function(t,e,n){"use strict";n.r(e);var r=n("2b0e"),o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},a=[],i=(n("034f"),n("2877")),c={},u=Object(i["a"])(c,o,a,!1,null,null,null),s=u.exports,l=n("8c4f"),f=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"Home_container"},[t._m(0),n("div",{staticClass:"content"},[n("div",{staticClass:"content_video fl",staticStyle:{width:"calc(100% - 300px)",height:"calc(100% - 120px)"}},[n("p",[t._v(" "+t._s(t.curVideo)+" ")]),n("video",{staticStyle:{"object-fit":"contain"},attrs:{src:t.videoSrc,width:"90%",height:"90%",controls:""}},[t._v("你的浏览器暂不支持video标签")])]),n("div",{staticClass:"video_list fl",staticStyle:{width:"300px",height:"calc(100% - 120px)"}},t._l(t.videoList,function(e,r){return n("p",{on:{click:function(n){return t.selectVideo(e)}}},[t._v(t._s(e))])}),0),n("div",{staticClass:"log"},[t._v("aaaaaaaa")])])])},d=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"background"},[n("div",{staticClass:"bg_b"}),n("div",{staticClass:"bg_f"})])}],p=n("bc3a"),h=n.n(p),v={name:"home",data(){return{videoList:["加载列表中。。。。。。"],videoSrc:"./test.mp4",curVideo:""}},methods:{selectVideo(t){this.curVideo=t,this.videoSrc="http://129.28.168.243/"+t}},mounted(){var t=this;h.a.post("/getList",{}).then(function(e){t.videoList=e.data.list}).catch(function(){alert("与服务器无连接，请检查网络。")})}},m=v,b=(n("de16"),Object(i["a"])(m,f,d,!1,null,null,null));b.exports;r["a"].use(l["a"]);var g=new l["a"]({routes:[{path:"/",name:"home",component:()=>n.e("chunk-8f3f4488").then(n.bind(null,"e003"))},{path:"/about",name:"about",component:function(){return n.e("about").then(n.bind(null,"f820"))}}]}),y=n("2f62");r["a"].use(y["a"]);var _=new y["a"].Store({state:{},mutations:{},actions:{}});n("ca62");r["a"].config.productionTip=!1,new r["a"]({router:g,store:_,render:function(t){return t(s)}}).$mount("#app")},"64a9":function(t,e,n){},ca62:function(t,e,n){},de16:function(t,e,n){"use strict";var r=n("f3e7"),o=n.n(r);o.a},f3e7:function(t,e,n){}});
//# sourceMappingURL=app.ad4a96f9.js.map