import{s as M,e as g,a as E,t as P,c as $,b as w,g as L,d as k,f as p,p as m,E as S,i as D,h as f,k as I,o as T}from"../chunks/scheduler.Bq1aPRZr.js";import{S as U,i as V,c as j,a as q,m as z,t as B,b as G,d as H}from"../chunks/index.dYeTvltd.js";import{s as C}from"../chunks/config.CwKg5LUm.js";import{u as R,c as A}from"../chunks/stores.CJOv96xK.js";import{d as F}from"../chunks/util.jCAmLx4X.js";import{B as J}from"../chunks/Button.LL1zcB_i.js";import{l as K}from"../chunks/favicon.C4Xm7W-s.js";function N(i){let t;return{c(){t=P("Login")},l(e){t=k(e,"Login")},m(e,a){D(e,t,a)},d(e){e&&p(t)}}}function O(i){let t,e,a,o,_,h,r,s=C.name+"",d,y,c,v;return c=new J({props:{class:"my-10 w-24 mx-auto",color:"green",$$slots:{default:[N]},$$scope:{ctx:i}}}),c.$on("click",i[0]),{c(){t=g("div"),e=g("div"),a=g("div"),o=g("img"),h=E(),r=g("h1"),d=P(s),y=E(),j(c.$$.fragment),this.h()},l(n){t=$(n,"DIV",{class:!0});var l=w(t);e=$(l,"DIV",{class:!0});var u=w(e);a=$(u,"DIV",{class:!0});var x=w(a);o=$(x,"IMG",{class:!0,src:!0,alt:!0}),h=L(x),r=$(x,"H1",{class:!0});var b=w(r);d=k(b,s),b.forEach(p),x.forEach(p),y=L(u),q(c.$$.fragment,u),u.forEach(p),l.forEach(p),this.h()},h(){m(o,"class","h-16 w-16 mr-4"),S(o.src,_=K)||m(o,"src",_),m(o,"alt","bananaui logo"),m(r,"class","text-5xl font-medium"),m(a,"class","flex flex-row mx-auto items-center"),m(e,"class","flex flex-col h-[200px] w-[500px] my-auto"),m(t,"class","flex items-center justify-center h-full w-full")},m(n,l){D(n,t,l),f(t,e),f(e,a),f(a,o),f(a,h),f(a,r),f(r,d),f(e,y),z(c,e,null),v=!0},p(n,[l]){const u={};l&32&&(u.$$scope={dirty:l,ctx:n}),c.$set(u)},i(n){v||(B(c.$$.fragment,n),v=!0)},o(n){G(c.$$.fragment,n),v=!1},d(n){n&&p(t),H(c)}}}function Q(i,t,e){let a,o;I(i,R,s=>e(2,a=s)),I(i,A,s=>e(3,o=s));let _="";function h(){const s=o==null?void 0:o.config.oidc;if(!s)throw alert("config not loaded"),new Error("no config loaded");return`${s.authorizeEndpoint}?client_id=${s.clientId}&redirect_uri=${s.selfUrl}&scope=${s.scope}&response_type=${s.responseType}&response_mode=${s.response_mode}&state=${_}&nonce=o2rp8ze2jrh`}function r(){window.location.assign(h())}return T(async()=>{const d=new URLSearchParams(window.location.search).get("source");d&&(_=d),o!=null&&o.config.auth.autoLogin&&(await F(C.autoLoginDelayMs),a||r())}),[r]}class se extends U{constructor(t){super(),V(this,t,Q,O,M,{})}}export{se as component};
