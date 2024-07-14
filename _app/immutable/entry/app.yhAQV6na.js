import{s as B,a as U,l as h,g as q,i as b,f as g,N as j,o as M,e as Q,c as W,b as z,p as O,O as p,t as F,d as G,j as H,P as D,Q as v,R as J}from"../chunks/scheduler.Bq1aPRZr.js";import{S as K,i as X,b as w,e as L,t as E,g as y,c as k,a as I,m as R,d as P}from"../chunks/index.dYeTvltd.js";const Y="modulepreload",Z=function(a,e){return new URL(a,e).href},T={},d=function(e,n,i){let r=Promise.resolve();if(n&&n.length>0){const c=document.getElementsByTagName("link");r=Promise.all(n.map(t=>{if(t=Z(t,i),t in T)return;T[t]=!0;const s=t.endsWith(".css"),l=s?'[rel="stylesheet"]':"";if(!!i)for(let u=c.length-1;u>=0;u--){const m=c[u];if(m.href===t&&(!s||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${t}"]${l}`))return;const o=document.createElement("link");if(o.rel=s?"stylesheet":Y,s||(o.as="script",o.crossOrigin=""),o.href=t,document.head.appendChild(o),s)return new Promise((u,m)=>{o.addEventListener("load",u),o.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${t}`)))})}))}return r.then(()=>e()).catch(c=>{const t=new Event("vite:preloadError",{cancelable:!0});if(t.payload=c,window.dispatchEvent(t),!t.defaultPrevented)throw c})},se={};function $(a){let e,n,i;var r=a[1][0];function c(t,s){return{props:{data:t[3],form:t[2]}}}return r&&(e=v(r,c(a)),a[12](e)),{c(){e&&k(e.$$.fragment),n=h()},l(t){e&&I(e.$$.fragment,t),n=h()},m(t,s){e&&R(e,t,s),b(t,n,s),i=!0},p(t,s){if(s&2&&r!==(r=t[1][0])){if(e){y();const l=e;w(l.$$.fragment,1,0,()=>{P(l,1)}),L()}r?(e=v(r,c(t)),t[12](e),k(e.$$.fragment),E(e.$$.fragment,1),R(e,n.parentNode,n)):e=null}else if(r){const l={};s&8&&(l.data=t[3]),s&4&&(l.form=t[2]),e.$set(l)}},i(t){i||(e&&E(e.$$.fragment,t),i=!0)},o(t){e&&w(e.$$.fragment,t),i=!1},d(t){t&&g(n),a[12](null),e&&P(e,t)}}}function x(a){let e,n,i;var r=a[1][0];function c(t,s){return{props:{data:t[3],$$slots:{default:[ee]},$$scope:{ctx:t}}}}return r&&(e=v(r,c(a)),a[11](e)),{c(){e&&k(e.$$.fragment),n=h()},l(t){e&&I(e.$$.fragment,t),n=h()},m(t,s){e&&R(e,t,s),b(t,n,s),i=!0},p(t,s){if(s&2&&r!==(r=t[1][0])){if(e){y();const l=e;w(l.$$.fragment,1,0,()=>{P(l,1)}),L()}r?(e=v(r,c(t)),t[11](e),k(e.$$.fragment),E(e.$$.fragment,1),R(e,n.parentNode,n)):e=null}else if(r){const l={};s&8&&(l.data=t[3]),s&8215&&(l.$$scope={dirty:s,ctx:t}),e.$set(l)}},i(t){i||(e&&E(e.$$.fragment,t),i=!0)},o(t){e&&w(e.$$.fragment,t),i=!1},d(t){t&&g(n),a[11](null),e&&P(e,t)}}}function ee(a){let e,n,i;var r=a[1][1];function c(t,s){return{props:{data:t[4],form:t[2]}}}return r&&(e=v(r,c(a)),a[10](e)),{c(){e&&k(e.$$.fragment),n=h()},l(t){e&&I(e.$$.fragment,t),n=h()},m(t,s){e&&R(e,t,s),b(t,n,s),i=!0},p(t,s){if(s&2&&r!==(r=t[1][1])){if(e){y();const l=e;w(l.$$.fragment,1,0,()=>{P(l,1)}),L()}r?(e=v(r,c(t)),t[10](e),k(e.$$.fragment),E(e.$$.fragment,1),R(e,n.parentNode,n)):e=null}else if(r){const l={};s&16&&(l.data=t[4]),s&4&&(l.form=t[2]),e.$set(l)}},i(t){i||(e&&E(e.$$.fragment,t),i=!0)},o(t){e&&w(e.$$.fragment,t),i=!1},d(t){t&&g(n),a[10](null),e&&P(e,t)}}}function V(a){let e,n=a[6]&&A(a);return{c(){e=Q("div"),n&&n.c(),this.h()},l(i){e=W(i,"DIV",{id:!0,"aria-live":!0,"aria-atomic":!0,style:!0});var r=z(e);n&&n.l(r),r.forEach(g),this.h()},h(){O(e,"id","svelte-announcer"),O(e,"aria-live","assertive"),O(e,"aria-atomic","true"),p(e,"position","absolute"),p(e,"left","0"),p(e,"top","0"),p(e,"clip","rect(0 0 0 0)"),p(e,"clip-path","inset(50%)"),p(e,"overflow","hidden"),p(e,"white-space","nowrap"),p(e,"width","1px"),p(e,"height","1px")},m(i,r){b(i,e,r),n&&n.m(e,null)},p(i,r){i[6]?n?n.p(i,r):(n=A(i),n.c(),n.m(e,null)):n&&(n.d(1),n=null)},d(i){i&&g(e),n&&n.d()}}}function A(a){let e;return{c(){e=F(a[7])},l(n){e=G(n,a[7])},m(n,i){b(n,e,i)},p(n,i){i&128&&H(e,n[7])},d(n){n&&g(e)}}}function te(a){let e,n,i,r,c;const t=[x,$],s=[];function l(o,u){return o[1][1]?0:1}e=l(a),n=s[e]=t[e](a);let _=a[5]&&V(a);return{c(){n.c(),i=U(),_&&_.c(),r=h()},l(o){n.l(o),i=q(o),_&&_.l(o),r=h()},m(o,u){s[e].m(o,u),b(o,i,u),_&&_.m(o,u),b(o,r,u),c=!0},p(o,[u]){let m=e;e=l(o),e===m?s[e].p(o,u):(y(),w(s[m],1,1,()=>{s[m]=null}),L(),n=s[e],n?n.p(o,u):(n=s[e]=t[e](o),n.c()),E(n,1),n.m(i.parentNode,i)),o[5]?_?_.p(o,u):(_=V(o),_.c(),_.m(r.parentNode,r)):_&&(_.d(1),_=null)},i(o){c||(E(n),c=!0)},o(o){w(n),c=!1},d(o){o&&(g(i),g(r)),s[e].d(o),_&&_.d(o)}}}function ne(a,e,n){let{stores:i}=e,{page:r}=e,{constructors:c}=e,{components:t=[]}=e,{form:s}=e,{data_0:l=null}=e,{data_1:_=null}=e;j(i.page.notify);let o=!1,u=!1,m=null;M(()=>{const f=i.page.subscribe(()=>{o&&(n(6,u=!0),J().then(()=>{n(7,m=document.title||"untitled page")}))});return n(5,o=!0),f});function N(f){D[f?"unshift":"push"](()=>{t[1]=f,n(0,t)})}function S(f){D[f?"unshift":"push"](()=>{t[0]=f,n(0,t)})}function C(f){D[f?"unshift":"push"](()=>{t[0]=f,n(0,t)})}return a.$$set=f=>{"stores"in f&&n(8,i=f.stores),"page"in f&&n(9,r=f.page),"constructors"in f&&n(1,c=f.constructors),"components"in f&&n(0,t=f.components),"form"in f&&n(2,s=f.form),"data_0"in f&&n(3,l=f.data_0),"data_1"in f&&n(4,_=f.data_1)},a.$$.update=()=>{a.$$.dirty&768&&i.page.set(r)},[t,c,s,l,_,o,u,m,i,r,N,S,C]}class oe extends K{constructor(e){super(),X(this,e,ne,te,B,{stores:8,page:9,constructors:1,components:0,form:2,data_0:3,data_1:4})}}const ae=[()=>d(()=>import("../nodes/0.BUpxecB2.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11]),import.meta.url),()=>d(()=>import("../nodes/1.rOAcmV4u.js"),__vite__mapDeps([12,1,2,4,5,6]),import.meta.url),()=>d(()=>import("../nodes/2.Bg8HzoZx.js"),__vite__mapDeps([13,1,2,7,6,14,9,5,3,8,15,16,17]),import.meta.url),()=>d(()=>import("../nodes/3.mXTmD4HG.js"),__vite__mapDeps([18,1,2,14,9,5,6,3,8,7,15,16,17,19,10,20,21]),import.meta.url),()=>d(()=>import("../nodes/4.r3Hwz0gd.js"),__vite__mapDeps([22,1,2,23,8,7,6,10,9,5,19,15,21,3,17,4]),import.meta.url),()=>d(()=>import("../nodes/5.BbEP-sY-.js"),__vite__mapDeps([24,1,2,9,23,8,7,6,10,5,19,15,21,3,17,14,16,4,20]),import.meta.url),()=>d(()=>import("../nodes/6.D9IgybXg.js"),__vite__mapDeps([25,1,2,3,7,6,8,19,10]),import.meta.url),()=>d(()=>import("../nodes/7.DHH7RqjA.js"),__vite__mapDeps([26,1,2,7,6,5,4]),import.meta.url),()=>d(()=>import("../nodes/8.B8upODL_.js"),__vite__mapDeps([27,1,2,14,9,5,6,3,8,7,15,16]),import.meta.url),()=>d(()=>import("../nodes/9.Tf2WfzHm.js"),__vite__mapDeps([28,1,2,5,6,8,7,20,10,19]),import.meta.url)],le=[],fe={"/":[2],"/add":[3],"/entities":[4],"/entity":[5],"/login":[6],"/oidc/callback":[7],"/profile":[8],"/settings":[9]},ce={handleError:({error:a})=>{console.error(a)},reroute:()=>{}};export{fe as dictionary,ce as hooks,se as matchers,ae as nodes,oe as root,le as server_loads};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["../nodes/0.BUpxecB2.js","../chunks/scheduler.Bq1aPRZr.js","../chunks/index.dYeTvltd.js","../chunks/config.CwKg5LUm.js","../chunks/stores.Bd5mQErg.js","../chunks/entry.DA-ciDDW.js","../chunks/index.Cn22i0XI.js","../chunks/stores.CJOv96xK.js","../chunks/util.jCAmLx4X.js","../chunks/each.CtjI00YO.js","../chunks/bundle-mjs.BkWO730n.js","../assets/0.CDNwXO6b.css","../nodes/1.rOAcmV4u.js","../nodes/2.Bg8HzoZx.js","../chunks/treeWrapper.CQyH1xI5.js","../chunks/datetime.lqzArHOP.js","../assets/treeWrapper.DJ53uXT0.css","../chunks/requests.C7augCwN.js","../nodes/3.mXTmD4HG.js","../chunks/Button.LL1zcB_i.js","../chunks/PaletteOutline.N16l27sC.js","../chunks/LinkOutline.BaPMgW5x.js","../nodes/4.r3Hwz0gd.js","../chunks/ArrayWrap.3BICb7mC.js","../nodes/5.BbEP-sY-.js","../nodes/6.D9IgybXg.js","../nodes/7.DHH7RqjA.js","../nodes/8.B8upODL_.js","../nodes/9.Tf2WfzHm.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
