import{s as U,o as fe,l as M,i as C,n as H,f as k,r as x,u as de,v as N,w as ee,x as z,y as B,z as W,b as p,p as m,A as O,h as E,B as L,C as ce,t as T,d as I,j as P,e as V,c as A,E as Ke,k as oe,a as J,g as K,M as Xe,a1 as Qe,G as He,I as Ue,J as Ge,K as Re,S as Ye,X as $e,m as xe}from"../chunks/scheduler.Bq1aPRZr.js";import{S as G,i as R,c as X,a as Q,m as Y,t as D,b as y,d as $,g as ae,e as ne,h as ke}from"../chunks/index.dYeTvltd.js";import{k as el,s as Fe}from"../chunks/config.CwKg5LUm.js";import{p as me}from"../chunks/stores.BL_KPSZr.js";import{g as Je}from"../chunks/entry.B1gx68qY.js";import{c as _e,i as ll,b as he,u as tl,t as il,d as sl}from"../chunks/stores.CJOv96xK.js";import{a as rl,d as ol,g as le,c as be}from"../chunks/util.jCAmLx4X.js";import{e as ue,u as al,o as nl}from"../chunks/each.CtjI00YO.js";import{t as Z}from"../chunks/bundle-mjs.BkWO730n.js";var ul={};const fl=(globalThis.process!=null&&ul.SVELTE_BUILD_STATIC==="true")??!1,ft=Object.freeze(Object.defineProperty({__proto__:null,prerender:fl},Symbol.toStringTag,{value:"Module"}));function dl(l){return fe(async()=>{const e=await fetch("/config");if(e.ok){const s=await e.json();s&&_e.set({config:s,source:"remote"})}else{const s=rl();s?_e.set({config:s,source:"local"}):(await ol(1e3),ll("app config not found, please create one to use the app!"),Je("settings"))}}),[]}class cl extends G{constructor(e){super(),R(this,e,dl,null,U,{})}}function hl(l){let e,s,t,o,i,r=l[4].id&&l[4].title&&ve(l),f=l[6].id&&l[6].desc&&ge(l),a=[{xmlns:"http://www.w3.org/2000/svg"},{fill:"none"},{color:l[2]},l[11],{class:o=Z("shrink-0",l[9][l[0]??"md"],l[12].class)},{role:l[1]},{"aria-label":l[7]},{"aria-describedby":i=l[8]?l[10]:void 0},{viewBox:"0 0 24 24"}],n={};for(let u=0;u<a.length;u+=1)n=N(n,a[u]);return{c(){e=B("svg"),r&&r.c(),s=M(),f&&f.c(),t=B("path"),this.h()},l(u){e=W(u,"svg",{xmlns:!0,fill:!0,color:!0,class:!0,role:!0,"aria-label":!0,"aria-describedby":!0,viewBox:!0});var h=p(e);r&&r.l(h),s=M(),f&&f.l(h),t=W(h,"path",{stroke:!0,"stroke-linecap":!0,"stroke-linejoin":!0,"stroke-width":!0,d:!0}),p(t).forEach(k),h.forEach(k),this.h()},h(){m(t,"stroke","currentColor"),m(t,"stroke-linecap","round"),m(t,"stroke-linejoin","round"),m(t,"stroke-width",l[5]),m(t,"d","M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"),O(e,n)},m(u,h){C(u,e,h),r&&r.m(e,null),E(e,s),f&&f.m(e,null),E(e,t)},p(u,h){u[4].id&&u[4].title?r?r.p(u,h):(r=ve(u),r.c(),r.m(e,s)):r&&(r.d(1),r=null),u[6].id&&u[6].desc?f?f.p(u,h):(f=ge(u),f.c(),f.m(e,t)):f&&(f.d(1),f=null),h&32&&m(t,"stroke-width",u[5]),O(e,n=le(a,[{xmlns:"http://www.w3.org/2000/svg"},{fill:"none"},h&4&&{color:u[2]},h&2048&&u[11],h&4097&&o!==(o=Z("shrink-0",u[9][u[0]??"md"],u[12].class))&&{class:o},h&2&&{role:u[1]},h&128&&{"aria-label":u[7]},h&256&&i!==(i=u[8]?u[10]:void 0)&&{"aria-describedby":i},{viewBox:"0 0 24 24"}]))},d(u){u&&k(e),r&&r.d(),f&&f.d()}}}function _l(l){let e,s,t,o,i,r,f,a=l[4].id&&l[4].title&&we(l),n=l[6].id&&l[6].desc&&Ee(l),u=[{xmlns:"http://www.w3.org/2000/svg"},{fill:"none"},{color:l[2]},l[11],{class:o=Z("shrink-0",l[9][l[0]??"md"],l[12].class)},{role:l[1]},{"aria-label":l[7]},{"aria-describedby":i=l[8]?l[10]:void 0},{viewBox:"0 0 24 24"}],h={};for(let d=0;d<u.length;d+=1)h=N(h,u[d]);return{c(){e=B("svg"),a&&a.c(),s=M(),n&&n.c(),t=B("path"),this.h()},l(d){e=W(d,"svg",{xmlns:!0,fill:!0,color:!0,class:!0,role:!0,"aria-label":!0,"aria-describedby":!0,viewBox:!0});var _=p(e);a&&a.l(_),s=M(),n&&n.l(_),t=W(_,"path",{stroke:!0,"stroke-linecap":!0,"stroke-linejoin":!0,"stroke-width":!0,d:!0}),p(t).forEach(k),_.forEach(k),this.h()},h(){m(t,"stroke","currentColor"),m(t,"stroke-linecap","round"),m(t,"stroke-linejoin","round"),m(t,"stroke-width",l[5]),m(t,"d","M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"),O(e,h)},m(d,_){C(d,e,_),a&&a.m(e,null),E(e,s),n&&n.m(e,null),E(e,t),r||(f=[L(e,"click",l[13]),L(e,"keydown",l[14]),L(e,"keyup",l[15]),L(e,"focus",l[16]),L(e,"blur",l[17]),L(e,"mouseenter",l[18]),L(e,"mouseleave",l[19]),L(e,"mouseover",l[20]),L(e,"mouseout",l[21])],r=!0)},p(d,_){d[4].id&&d[4].title?a?a.p(d,_):(a=we(d),a.c(),a.m(e,s)):a&&(a.d(1),a=null),d[6].id&&d[6].desc?n?n.p(d,_):(n=Ee(d),n.c(),n.m(e,t)):n&&(n.d(1),n=null),_&32&&m(t,"stroke-width",d[5]),O(e,h=le(u,[{xmlns:"http://www.w3.org/2000/svg"},{fill:"none"},_&4&&{color:d[2]},_&2048&&d[11],_&4097&&o!==(o=Z("shrink-0",d[9][d[0]??"md"],d[12].class))&&{class:o},_&2&&{role:d[1]},_&128&&{"aria-label":d[7]},_&256&&i!==(i=d[8]?d[10]:void 0)&&{"aria-describedby":i},{viewBox:"0 0 24 24"}]))},d(d){d&&k(e),a&&a.d(),n&&n.d(),r=!1,ce(f)}}}function ve(l){let e,s=l[4].title+"",t,o;return{c(){e=B("title"),t=T(s),this.h()},l(i){e=W(i,"title",{id:!0});var r=p(e);t=I(r,s),r.forEach(k),this.h()},h(){m(e,"id",o=l[4].id)},m(i,r){C(i,e,r),E(e,t)},p(i,r){r&16&&s!==(s=i[4].title+"")&&P(t,s),r&16&&o!==(o=i[4].id)&&m(e,"id",o)},d(i){i&&k(e)}}}function ge(l){let e,s=l[6].desc+"",t,o;return{c(){e=B("desc"),t=T(s),this.h()},l(i){e=W(i,"desc",{id:!0});var r=p(e);t=I(r,s),r.forEach(k),this.h()},h(){m(e,"id",o=l[6].id)},m(i,r){C(i,e,r),E(e,t)},p(i,r){r&64&&s!==(s=i[6].desc+"")&&P(t,s),r&64&&o!==(o=i[6].id)&&m(e,"id",o)},d(i){i&&k(e)}}}function we(l){let e,s=l[4].title+"",t,o;return{c(){e=B("title"),t=T(s),this.h()},l(i){e=W(i,"title",{id:!0});var r=p(e);t=I(r,s),r.forEach(k),this.h()},h(){m(e,"id",o=l[4].id)},m(i,r){C(i,e,r),E(e,t)},p(i,r){r&16&&s!==(s=i[4].title+"")&&P(t,s),r&16&&o!==(o=i[4].id)&&m(e,"id",o)},d(i){i&&k(e)}}}function Ee(l){let e,s=l[6].desc+"",t,o;return{c(){e=B("desc"),t=T(s),this.h()},l(i){e=W(i,"desc",{id:!0});var r=p(e);t=I(r,s),r.forEach(k),this.h()},h(){m(e,"id",o=l[6].id)},m(i,r){C(i,e,r),E(e,t)},p(i,r){r&64&&s!==(s=i[6].desc+"")&&P(t,s),r&64&&o!==(o=i[6].id)&&m(e,"id",o)},d(i){i&&k(e)}}}function ml(l){let e;function s(i,r){return i[3]?_l:hl}let t=s(l),o=t(l);return{c(){o.c(),e=M()},l(i){o.l(i),e=M()},m(i,r){o.m(i,r),C(i,e,r)},p(i,[r]){t===(t=s(i))&&o?o.p(i,r):(o.d(1),o=t(i),o&&(o.c(),o.m(e.parentNode,e)))},i:H,o:H,d(i){i&&k(e),o.d(i)}}}function kl(l,e,s){const t=["size","role","color","withEvents","title","strokeWidth","desc","ariaLabel"];let o=x(e,t);const i=de("iconCtx")??{},r={xs:"w-3 h-3",sm:"w-4 h-4",md:"w-5 h-5",lg:"w-6 h-6",xl:"w-8 h-8"};let{size:f=i.size||"md"}=e,{role:a=i.role||"img"}=e,{color:n=i.color||"currentColor"}=e,{withEvents:u=i.withEvents||!1}=e,{title:h={}}=e,{strokeWidth:d=i.strokeWidth||"2"}=e,{desc:_={}}=e,g=`${h.id||""} ${_.id||""}`,w=!1,{ariaLabel:b="check circle outline"}=e;function v(c){z.call(this,l,c)}function j(c){z.call(this,l,c)}function S(c){z.call(this,l,c)}function q(c){z.call(this,l,c)}function F(c){z.call(this,l,c)}function te(c){z.call(this,l,c)}function ie(c){z.call(this,l,c)}function se(c){z.call(this,l,c)}function re(c){z.call(this,l,c)}return l.$$set=c=>{s(12,e=N(N({},e),ee(c))),s(11,o=x(e,t)),"size"in c&&s(0,f=c.size),"role"in c&&s(1,a=c.role),"color"in c&&s(2,n=c.color),"withEvents"in c&&s(3,u=c.withEvents),"title"in c&&s(4,h=c.title),"strokeWidth"in c&&s(5,d=c.strokeWidth),"desc"in c&&s(6,_=c.desc),"ariaLabel"in c&&s(7,b=c.ariaLabel)},l.$$.update=()=>{l.$$.dirty&80&&(h.id||_.id?s(8,w=!0):s(8,w=!1))},e=ee(e),[f,a,n,u,h,d,_,b,w,r,g,o,e,v,j,S,q,F,te,ie,se,re]}class bl extends G{constructor(e){super(),R(this,e,kl,ml,U,{size:0,role:1,color:2,withEvents:3,title:4,strokeWidth:5,desc:6,ariaLabel:7})}}function vl(l){let e,s,t,o,i,r=l[4].id&&l[4].title&&pe(l),f=l[6].id&&l[6].desc&&Ce(l),a=[{xmlns:"http://www.w3.org/2000/svg"},{fill:"none"},{color:l[2]},l[11],{class:o=Z("shrink-0",l[9][l[0]??"md"],l[12].class)},{role:l[1]},{"aria-label":l[7]},{"aria-describedby":i=l[8]?l[10]:void 0},{viewBox:"0 0 24 24"}],n={};for(let u=0;u<a.length;u+=1)n=N(n,a[u]);return{c(){e=B("svg"),r&&r.c(),s=M(),f&&f.c(),t=B("path"),this.h()},l(u){e=W(u,"svg",{xmlns:!0,fill:!0,color:!0,class:!0,role:!0,"aria-label":!0,"aria-describedby":!0,viewBox:!0});var h=p(e);r&&r.l(h),s=M(),f&&f.l(h),t=W(h,"path",{stroke:!0,"stroke-linecap":!0,"stroke-linejoin":!0,"stroke-width":!0,d:!0}),p(t).forEach(k),h.forEach(k),this.h()},h(){m(t,"stroke","currentColor"),m(t,"stroke-linecap","round"),m(t,"stroke-linejoin","round"),m(t,"stroke-width",l[5]),m(t,"d","M6 18 17.94 6M18 18 6.06 6"),O(e,n)},m(u,h){C(u,e,h),r&&r.m(e,null),E(e,s),f&&f.m(e,null),E(e,t)},p(u,h){u[4].id&&u[4].title?r?r.p(u,h):(r=pe(u),r.c(),r.m(e,s)):r&&(r.d(1),r=null),u[6].id&&u[6].desc?f?f.p(u,h):(f=Ce(u),f.c(),f.m(e,t)):f&&(f.d(1),f=null),h&32&&m(t,"stroke-width",u[5]),O(e,n=le(a,[{xmlns:"http://www.w3.org/2000/svg"},{fill:"none"},h&4&&{color:u[2]},h&2048&&u[11],h&4097&&o!==(o=Z("shrink-0",u[9][u[0]??"md"],u[12].class))&&{class:o},h&2&&{role:u[1]},h&128&&{"aria-label":u[7]},h&256&&i!==(i=u[8]?u[10]:void 0)&&{"aria-describedby":i},{viewBox:"0 0 24 24"}]))},d(u){u&&k(e),r&&r.d(),f&&f.d()}}}function gl(l){let e,s,t,o,i,r,f,a=l[4].id&&l[4].title&&Le(l),n=l[6].id&&l[6].desc&&ze(l),u=[{xmlns:"http://www.w3.org/2000/svg"},{fill:"none"},{color:l[2]},l[11],{class:o=Z("shrink-0",l[9][l[0]??"md"],l[12].class)},{role:l[1]},{"aria-label":l[7]},{"aria-describedby":i=l[8]?l[10]:void 0},{viewBox:"0 0 24 24"}],h={};for(let d=0;d<u.length;d+=1)h=N(h,u[d]);return{c(){e=B("svg"),a&&a.c(),s=M(),n&&n.c(),t=B("path"),this.h()},l(d){e=W(d,"svg",{xmlns:!0,fill:!0,color:!0,class:!0,role:!0,"aria-label":!0,"aria-describedby":!0,viewBox:!0});var _=p(e);a&&a.l(_),s=M(),n&&n.l(_),t=W(_,"path",{stroke:!0,"stroke-linecap":!0,"stroke-linejoin":!0,"stroke-width":!0,d:!0}),p(t).forEach(k),_.forEach(k),this.h()},h(){m(t,"stroke","currentColor"),m(t,"stroke-linecap","round"),m(t,"stroke-linejoin","round"),m(t,"stroke-width",l[5]),m(t,"d","M6 18 17.94 6M18 18 6.06 6"),O(e,h)},m(d,_){C(d,e,_),a&&a.m(e,null),E(e,s),n&&n.m(e,null),E(e,t),r||(f=[L(e,"click",l[13]),L(e,"keydown",l[14]),L(e,"keyup",l[15]),L(e,"focus",l[16]),L(e,"blur",l[17]),L(e,"mouseenter",l[18]),L(e,"mouseleave",l[19]),L(e,"mouseover",l[20]),L(e,"mouseout",l[21])],r=!0)},p(d,_){d[4].id&&d[4].title?a?a.p(d,_):(a=Le(d),a.c(),a.m(e,s)):a&&(a.d(1),a=null),d[6].id&&d[6].desc?n?n.p(d,_):(n=ze(d),n.c(),n.m(e,t)):n&&(n.d(1),n=null),_&32&&m(t,"stroke-width",d[5]),O(e,h=le(u,[{xmlns:"http://www.w3.org/2000/svg"},{fill:"none"},_&4&&{color:d[2]},_&2048&&d[11],_&4097&&o!==(o=Z("shrink-0",d[9][d[0]??"md"],d[12].class))&&{class:o},_&2&&{role:d[1]},_&128&&{"aria-label":d[7]},_&256&&i!==(i=d[8]?d[10]:void 0)&&{"aria-describedby":i},{viewBox:"0 0 24 24"}]))},d(d){d&&k(e),a&&a.d(),n&&n.d(),r=!1,ce(f)}}}function pe(l){let e,s=l[4].title+"",t,o;return{c(){e=B("title"),t=T(s),this.h()},l(i){e=W(i,"title",{id:!0});var r=p(e);t=I(r,s),r.forEach(k),this.h()},h(){m(e,"id",o=l[4].id)},m(i,r){C(i,e,r),E(e,t)},p(i,r){r&16&&s!==(s=i[4].title+"")&&P(t,s),r&16&&o!==(o=i[4].id)&&m(e,"id",o)},d(i){i&&k(e)}}}function Ce(l){let e,s=l[6].desc+"",t,o;return{c(){e=B("desc"),t=T(s),this.h()},l(i){e=W(i,"desc",{id:!0});var r=p(e);t=I(r,s),r.forEach(k),this.h()},h(){m(e,"id",o=l[6].id)},m(i,r){C(i,e,r),E(e,t)},p(i,r){r&64&&s!==(s=i[6].desc+"")&&P(t,s),r&64&&o!==(o=i[6].id)&&m(e,"id",o)},d(i){i&&k(e)}}}function Le(l){let e,s=l[4].title+"",t,o;return{c(){e=B("title"),t=T(s),this.h()},l(i){e=W(i,"title",{id:!0});var r=p(e);t=I(r,s),r.forEach(k),this.h()},h(){m(e,"id",o=l[4].id)},m(i,r){C(i,e,r),E(e,t)},p(i,r){r&16&&s!==(s=i[4].title+"")&&P(t,s),r&16&&o!==(o=i[4].id)&&m(e,"id",o)},d(i){i&&k(e)}}}function ze(l){let e,s=l[6].desc+"",t,o;return{c(){e=B("desc"),t=T(s),this.h()},l(i){e=W(i,"desc",{id:!0});var r=p(e);t=I(r,s),r.forEach(k),this.h()},h(){m(e,"id",o=l[6].id)},m(i,r){C(i,e,r),E(e,t)},p(i,r){r&64&&s!==(s=i[6].desc+"")&&P(t,s),r&64&&o!==(o=i[6].id)&&m(e,"id",o)},d(i){i&&k(e)}}}function wl(l){let e;function s(i,r){return i[3]?gl:vl}let t=s(l),o=t(l);return{c(){o.c(),e=M()},l(i){o.l(i),e=M()},m(i,r){o.m(i,r),C(i,e,r)},p(i,[r]){t===(t=s(i))&&o?o.p(i,r):(o.d(1),o=t(i),o&&(o.c(),o.m(e.parentNode,e)))},i:H,o:H,d(i){i&&k(e),o.d(i)}}}function El(l,e,s){const t=["size","role","color","withEvents","title","strokeWidth","desc","ariaLabel"];let o=x(e,t);const i=de("iconCtx")??{},r={xs:"w-3 h-3",sm:"w-4 h-4",md:"w-5 h-5",lg:"w-6 h-6",xl:"w-8 h-8"};let{size:f=i.size||"md"}=e,{role:a=i.role||"img"}=e,{color:n=i.color||"currentColor"}=e,{withEvents:u=i.withEvents||!1}=e,{title:h={}}=e,{strokeWidth:d=i.strokeWidth||"2"}=e,{desc:_={}}=e,g=`${h.id||""} ${_.id||""}`,w=!1,{ariaLabel:b="close outline"}=e;function v(c){z.call(this,l,c)}function j(c){z.call(this,l,c)}function S(c){z.call(this,l,c)}function q(c){z.call(this,l,c)}function F(c){z.call(this,l,c)}function te(c){z.call(this,l,c)}function ie(c){z.call(this,l,c)}function se(c){z.call(this,l,c)}function re(c){z.call(this,l,c)}return l.$$set=c=>{s(12,e=N(N({},e),ee(c))),s(11,o=x(e,t)),"size"in c&&s(0,f=c.size),"role"in c&&s(1,a=c.role),"color"in c&&s(2,n=c.color),"withEvents"in c&&s(3,u=c.withEvents),"title"in c&&s(4,h=c.title),"strokeWidth"in c&&s(5,d=c.strokeWidth),"desc"in c&&s(6,_=c.desc),"ariaLabel"in c&&s(7,b=c.ariaLabel)},l.$$.update=()=>{l.$$.dirty&80&&(h.id||_.id?s(8,w=!0):s(8,w=!1))},e=ee(e),[f,a,n,u,h,d,_,b,w,r,g,o,e,v,j,S,q,F,te,ie,se,re]}class pl extends G{constructor(e){super(),R(this,e,El,wl,U,{size:0,role:1,color:2,withEvents:3,title:4,strokeWidth:5,desc:6,ariaLabel:7})}}function Cl(l){let e,s,t,o,i,r=l[4].id&&l[4].title&&je(l),f=l[6].id&&l[6].desc&&Be(l),a=[{xmlns:"http://www.w3.org/2000/svg"},{fill:"none"},{color:l[2]},l[11],{class:o=Z("shrink-0",l[9][l[0]??"md"],l[12].class)},{role:l[1]},{"aria-label":l[7]},{"aria-describedby":i=l[8]?l[10]:void 0},{viewBox:"0 0 24 24"}],n={};for(let u=0;u<a.length;u+=1)n=N(n,a[u]);return{c(){e=B("svg"),r&&r.c(),s=M(),f&&f.c(),t=B("path"),this.h()},l(u){e=W(u,"svg",{xmlns:!0,fill:!0,color:!0,class:!0,role:!0,"aria-label":!0,"aria-describedby":!0,viewBox:!0});var h=p(e);r&&r.l(h),s=M(),f&&f.l(h),t=W(h,"path",{stroke:!0,"stroke-linecap":!0,"stroke-linejoin":!0,"stroke-width":!0,d:!0}),p(t).forEach(k),h.forEach(k),this.h()},h(){m(t,"stroke","currentColor"),m(t,"stroke-linecap","round"),m(t,"stroke-linejoin","round"),m(t,"stroke-width",l[5]),m(t,"d","M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"),O(e,n)},m(u,h){C(u,e,h),r&&r.m(e,null),E(e,s),f&&f.m(e,null),E(e,t)},p(u,h){u[4].id&&u[4].title?r?r.p(u,h):(r=je(u),r.c(),r.m(e,s)):r&&(r.d(1),r=null),u[6].id&&u[6].desc?f?f.p(u,h):(f=Be(u),f.c(),f.m(e,t)):f&&(f.d(1),f=null),h&32&&m(t,"stroke-width",u[5]),O(e,n=le(a,[{xmlns:"http://www.w3.org/2000/svg"},{fill:"none"},h&4&&{color:u[2]},h&2048&&u[11],h&4097&&o!==(o=Z("shrink-0",u[9][u[0]??"md"],u[12].class))&&{class:o},h&2&&{role:u[1]},h&128&&{"aria-label":u[7]},h&256&&i!==(i=u[8]?u[10]:void 0)&&{"aria-describedby":i},{viewBox:"0 0 24 24"}]))},d(u){u&&k(e),r&&r.d(),f&&f.d()}}}function Ll(l){let e,s,t,o,i,r,f,a=l[4].id&&l[4].title&&We(l),n=l[6].id&&l[6].desc&&Me(l),u=[{xmlns:"http://www.w3.org/2000/svg"},{fill:"none"},{color:l[2]},l[11],{class:o=Z("shrink-0",l[9][l[0]??"md"],l[12].class)},{role:l[1]},{"aria-label":l[7]},{"aria-describedby":i=l[8]?l[10]:void 0},{viewBox:"0 0 24 24"}],h={};for(let d=0;d<u.length;d+=1)h=N(h,u[d]);return{c(){e=B("svg"),a&&a.c(),s=M(),n&&n.c(),t=B("path"),this.h()},l(d){e=W(d,"svg",{xmlns:!0,fill:!0,color:!0,class:!0,role:!0,"aria-label":!0,"aria-describedby":!0,viewBox:!0});var _=p(e);a&&a.l(_),s=M(),n&&n.l(_),t=W(_,"path",{stroke:!0,"stroke-linecap":!0,"stroke-linejoin":!0,"stroke-width":!0,d:!0}),p(t).forEach(k),_.forEach(k),this.h()},h(){m(t,"stroke","currentColor"),m(t,"stroke-linecap","round"),m(t,"stroke-linejoin","round"),m(t,"stroke-width",l[5]),m(t,"d","M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"),O(e,h)},m(d,_){C(d,e,_),a&&a.m(e,null),E(e,s),n&&n.m(e,null),E(e,t),r||(f=[L(e,"click",l[13]),L(e,"keydown",l[14]),L(e,"keyup",l[15]),L(e,"focus",l[16]),L(e,"blur",l[17]),L(e,"mouseenter",l[18]),L(e,"mouseleave",l[19]),L(e,"mouseover",l[20]),L(e,"mouseout",l[21])],r=!0)},p(d,_){d[4].id&&d[4].title?a?a.p(d,_):(a=We(d),a.c(),a.m(e,s)):a&&(a.d(1),a=null),d[6].id&&d[6].desc?n?n.p(d,_):(n=Me(d),n.c(),n.m(e,t)):n&&(n.d(1),n=null),_&32&&m(t,"stroke-width",d[5]),O(e,h=le(u,[{xmlns:"http://www.w3.org/2000/svg"},{fill:"none"},_&4&&{color:d[2]},_&2048&&d[11],_&4097&&o!==(o=Z("shrink-0",d[9][d[0]??"md"],d[12].class))&&{class:o},_&2&&{role:d[1]},_&128&&{"aria-label":d[7]},_&256&&i!==(i=d[8]?d[10]:void 0)&&{"aria-describedby":i},{viewBox:"0 0 24 24"}]))},d(d){d&&k(e),a&&a.d(),n&&n.d(),r=!1,ce(f)}}}function je(l){let e,s=l[4].title+"",t,o;return{c(){e=B("title"),t=T(s),this.h()},l(i){e=W(i,"title",{id:!0});var r=p(e);t=I(r,s),r.forEach(k),this.h()},h(){m(e,"id",o=l[4].id)},m(i,r){C(i,e,r),E(e,t)},p(i,r){r&16&&s!==(s=i[4].title+"")&&P(t,s),r&16&&o!==(o=i[4].id)&&m(e,"id",o)},d(i){i&&k(e)}}}function Be(l){let e,s=l[6].desc+"",t,o;return{c(){e=B("desc"),t=T(s),this.h()},l(i){e=W(i,"desc",{id:!0});var r=p(e);t=I(r,s),r.forEach(k),this.h()},h(){m(e,"id",o=l[6].id)},m(i,r){C(i,e,r),E(e,t)},p(i,r){r&64&&s!==(s=i[6].desc+"")&&P(t,s),r&64&&o!==(o=i[6].id)&&m(e,"id",o)},d(i){i&&k(e)}}}function We(l){let e,s=l[4].title+"",t,o;return{c(){e=B("title"),t=T(s),this.h()},l(i){e=W(i,"title",{id:!0});var r=p(e);t=I(r,s),r.forEach(k),this.h()},h(){m(e,"id",o=l[4].id)},m(i,r){C(i,e,r),E(e,t)},p(i,r){r&16&&s!==(s=i[4].title+"")&&P(t,s),r&16&&o!==(o=i[4].id)&&m(e,"id",o)},d(i){i&&k(e)}}}function Me(l){let e,s=l[6].desc+"",t,o;return{c(){e=B("desc"),t=T(s),this.h()},l(i){e=W(i,"desc",{id:!0});var r=p(e);t=I(r,s),r.forEach(k),this.h()},h(){m(e,"id",o=l[6].id)},m(i,r){C(i,e,r),E(e,t)},p(i,r){r&64&&s!==(s=i[6].desc+"")&&P(t,s),r&64&&o!==(o=i[6].id)&&m(e,"id",o)},d(i){i&&k(e)}}}function zl(l){let e;function s(i,r){return i[3]?Ll:Cl}let t=s(l),o=t(l);return{c(){o.c(),e=M()},l(i){o.l(i),e=M()},m(i,r){o.m(i,r),C(i,e,r)},p(i,[r]){t===(t=s(i))&&o?o.p(i,r):(o.d(1),o=t(i),o&&(o.c(),o.m(e.parentNode,e)))},i:H,o:H,d(i){i&&k(e),o.d(i)}}}function jl(l,e,s){const t=["size","role","color","withEvents","title","strokeWidth","desc","ariaLabel"];let o=x(e,t);const i=de("iconCtx")??{},r={xs:"w-3 h-3",sm:"w-4 h-4",md:"w-5 h-5",lg:"w-6 h-6",xl:"w-8 h-8"};let{size:f=i.size||"md"}=e,{role:a=i.role||"img"}=e,{color:n=i.color||"currentColor"}=e,{withEvents:u=i.withEvents||!1}=e,{title:h={}}=e,{strokeWidth:d=i.strokeWidth||"2"}=e,{desc:_={}}=e,g=`${h.id||""} ${_.id||""}`,w=!1,{ariaLabel:b="exclamation circle outline"}=e;function v(c){z.call(this,l,c)}function j(c){z.call(this,l,c)}function S(c){z.call(this,l,c)}function q(c){z.call(this,l,c)}function F(c){z.call(this,l,c)}function te(c){z.call(this,l,c)}function ie(c){z.call(this,l,c)}function se(c){z.call(this,l,c)}function re(c){z.call(this,l,c)}return l.$$set=c=>{s(12,e=N(N({},e),ee(c))),s(11,o=x(e,t)),"size"in c&&s(0,f=c.size),"role"in c&&s(1,a=c.role),"color"in c&&s(2,n=c.color),"withEvents"in c&&s(3,u=c.withEvents),"title"in c&&s(4,h=c.title),"strokeWidth"in c&&s(5,d=c.strokeWidth),"desc"in c&&s(6,_=c.desc),"ariaLabel"in c&&s(7,b=c.ariaLabel)},l.$$.update=()=>{l.$$.dirty&80&&(h.id||_.id?s(8,w=!0):s(8,w=!1))},e=ee(e),[f,a,n,u,h,d,_,b,w,r,g,o,e,v,j,S,q,F,te,ie,se,re]}class Bl extends G{constructor(e){super(),R(this,e,jl,zl,U,{size:0,role:1,color:2,withEvents:3,title:4,strokeWidth:5,desc:6,ariaLabel:7})}}function Wl(l){let e,s,t,o,i,r=l[4].id&&l[4].title&&De(l),f=l[6].id&&l[6].desc&&ye(l),a=[{xmlns:"http://www.w3.org/2000/svg"},{fill:"none"},{color:l[2]},l[11],{class:o=Z("shrink-0",l[9][l[0]??"md"],l[12].class)},{role:l[1]},{"aria-label":l[7]},{"aria-describedby":i=l[8]?l[10]:void 0},{viewBox:"0 0 24 24"}],n={};for(let u=0;u<a.length;u+=1)n=N(n,a[u]);return{c(){e=B("svg"),r&&r.c(),s=M(),f&&f.c(),t=B("path"),this.h()},l(u){e=W(u,"svg",{xmlns:!0,fill:!0,color:!0,class:!0,role:!0,"aria-label":!0,"aria-describedby":!0,viewBox:!0});var h=p(e);r&&r.l(h),s=M(),f&&f.l(h),t=W(h,"path",{stroke:!0,"stroke-linecap":!0,"stroke-linejoin":!0,"stroke-width":!0,d:!0}),p(t).forEach(k),h.forEach(k),this.h()},h(){m(t,"stroke","currentColor"),m(t,"stroke-linecap","round"),m(t,"stroke-linejoin","round"),m(t,"stroke-width",l[5]),m(t,"d","M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"),O(e,n)},m(u,h){C(u,e,h),r&&r.m(e,null),E(e,s),f&&f.m(e,null),E(e,t)},p(u,h){u[4].id&&u[4].title?r?r.p(u,h):(r=De(u),r.c(),r.m(e,s)):r&&(r.d(1),r=null),u[6].id&&u[6].desc?f?f.p(u,h):(f=ye(u),f.c(),f.m(e,t)):f&&(f.d(1),f=null),h&32&&m(t,"stroke-width",u[5]),O(e,n=le(a,[{xmlns:"http://www.w3.org/2000/svg"},{fill:"none"},h&4&&{color:u[2]},h&2048&&u[11],h&4097&&o!==(o=Z("shrink-0",u[9][u[0]??"md"],u[12].class))&&{class:o},h&2&&{role:u[1]},h&128&&{"aria-label":u[7]},h&256&&i!==(i=u[8]?u[10]:void 0)&&{"aria-describedby":i},{viewBox:"0 0 24 24"}]))},d(u){u&&k(e),r&&r.d(),f&&f.d()}}}function Ml(l){let e,s,t,o,i,r,f,a=l[4].id&&l[4].title&&Te(l),n=l[6].id&&l[6].desc&&Ie(l),u=[{xmlns:"http://www.w3.org/2000/svg"},{fill:"none"},{color:l[2]},l[11],{class:o=Z("shrink-0",l[9][l[0]??"md"],l[12].class)},{role:l[1]},{"aria-label":l[7]},{"aria-describedby":i=l[8]?l[10]:void 0},{viewBox:"0 0 24 24"}],h={};for(let d=0;d<u.length;d+=1)h=N(h,u[d]);return{c(){e=B("svg"),a&&a.c(),s=M(),n&&n.c(),t=B("path"),this.h()},l(d){e=W(d,"svg",{xmlns:!0,fill:!0,color:!0,class:!0,role:!0,"aria-label":!0,"aria-describedby":!0,viewBox:!0});var _=p(e);a&&a.l(_),s=M(),n&&n.l(_),t=W(_,"path",{stroke:!0,"stroke-linecap":!0,"stroke-linejoin":!0,"stroke-width":!0,d:!0}),p(t).forEach(k),_.forEach(k),this.h()},h(){m(t,"stroke","currentColor"),m(t,"stroke-linecap","round"),m(t,"stroke-linejoin","round"),m(t,"stroke-width",l[5]),m(t,"d","M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"),O(e,h)},m(d,_){C(d,e,_),a&&a.m(e,null),E(e,s),n&&n.m(e,null),E(e,t),r||(f=[L(e,"click",l[13]),L(e,"keydown",l[14]),L(e,"keyup",l[15]),L(e,"focus",l[16]),L(e,"blur",l[17]),L(e,"mouseenter",l[18]),L(e,"mouseleave",l[19]),L(e,"mouseover",l[20]),L(e,"mouseout",l[21])],r=!0)},p(d,_){d[4].id&&d[4].title?a?a.p(d,_):(a=Te(d),a.c(),a.m(e,s)):a&&(a.d(1),a=null),d[6].id&&d[6].desc?n?n.p(d,_):(n=Ie(d),n.c(),n.m(e,t)):n&&(n.d(1),n=null),_&32&&m(t,"stroke-width",d[5]),O(e,h=le(u,[{xmlns:"http://www.w3.org/2000/svg"},{fill:"none"},_&4&&{color:d[2]},_&2048&&d[11],_&4097&&o!==(o=Z("shrink-0",d[9][d[0]??"md"],d[12].class))&&{class:o},_&2&&{role:d[1]},_&128&&{"aria-label":d[7]},_&256&&i!==(i=d[8]?d[10]:void 0)&&{"aria-describedby":i},{viewBox:"0 0 24 24"}]))},d(d){d&&k(e),a&&a.d(),n&&n.d(),r=!1,ce(f)}}}function De(l){let e,s=l[4].title+"",t,o;return{c(){e=B("title"),t=T(s),this.h()},l(i){e=W(i,"title",{id:!0});var r=p(e);t=I(r,s),r.forEach(k),this.h()},h(){m(e,"id",o=l[4].id)},m(i,r){C(i,e,r),E(e,t)},p(i,r){r&16&&s!==(s=i[4].title+"")&&P(t,s),r&16&&o!==(o=i[4].id)&&m(e,"id",o)},d(i){i&&k(e)}}}function ye(l){let e,s=l[6].desc+"",t,o;return{c(){e=B("desc"),t=T(s),this.h()},l(i){e=W(i,"desc",{id:!0});var r=p(e);t=I(r,s),r.forEach(k),this.h()},h(){m(e,"id",o=l[6].id)},m(i,r){C(i,e,r),E(e,t)},p(i,r){r&64&&s!==(s=i[6].desc+"")&&P(t,s),r&64&&o!==(o=i[6].id)&&m(e,"id",o)},d(i){i&&k(e)}}}function Te(l){let e,s=l[4].title+"",t,o;return{c(){e=B("title"),t=T(s),this.h()},l(i){e=W(i,"title",{id:!0});var r=p(e);t=I(r,s),r.forEach(k),this.h()},h(){m(e,"id",o=l[4].id)},m(i,r){C(i,e,r),E(e,t)},p(i,r){r&16&&s!==(s=i[4].title+"")&&P(t,s),r&16&&o!==(o=i[4].id)&&m(e,"id",o)},d(i){i&&k(e)}}}function Ie(l){let e,s=l[6].desc+"",t,o;return{c(){e=B("desc"),t=T(s),this.h()},l(i){e=W(i,"desc",{id:!0});var r=p(e);t=I(r,s),r.forEach(k),this.h()},h(){m(e,"id",o=l[6].id)},m(i,r){C(i,e,r),E(e,t)},p(i,r){r&64&&s!==(s=i[6].desc+"")&&P(t,s),r&64&&o!==(o=i[6].id)&&m(e,"id",o)},d(i){i&&k(e)}}}function Dl(l){let e;function s(i,r){return i[3]?Ml:Wl}let t=s(l),o=t(l);return{c(){o.c(),e=M()},l(i){o.l(i),e=M()},m(i,r){o.m(i,r),C(i,e,r)},p(i,[r]){t===(t=s(i))&&o?o.p(i,r):(o.d(1),o=t(i),o&&(o.c(),o.m(e.parentNode,e)))},i:H,o:H,d(i){i&&k(e),o.d(i)}}}function yl(l,e,s){const t=["size","role","color","withEvents","title","strokeWidth","desc","ariaLabel"];let o=x(e,t);const i=de("iconCtx")??{},r={xs:"w-3 h-3",sm:"w-4 h-4",md:"w-5 h-5",lg:"w-6 h-6",xl:"w-8 h-8"};let{size:f=i.size||"md"}=e,{role:a=i.role||"img"}=e,{color:n=i.color||"currentColor"}=e,{withEvents:u=i.withEvents||!1}=e,{title:h={}}=e,{strokeWidth:d=i.strokeWidth||"2"}=e,{desc:_={}}=e,g=`${h.id||""} ${_.id||""}`,w=!1,{ariaLabel:b="info circle outline"}=e;function v(c){z.call(this,l,c)}function j(c){z.call(this,l,c)}function S(c){z.call(this,l,c)}function q(c){z.call(this,l,c)}function F(c){z.call(this,l,c)}function te(c){z.call(this,l,c)}function ie(c){z.call(this,l,c)}function se(c){z.call(this,l,c)}function re(c){z.call(this,l,c)}return l.$$set=c=>{s(12,e=N(N({},e),ee(c))),s(11,o=x(e,t)),"size"in c&&s(0,f=c.size),"role"in c&&s(1,a=c.role),"color"in c&&s(2,n=c.color),"withEvents"in c&&s(3,u=c.withEvents),"title"in c&&s(4,h=c.title),"strokeWidth"in c&&s(5,d=c.strokeWidth),"desc"in c&&s(6,_=c.desc),"ariaLabel"in c&&s(7,b=c.ariaLabel)},l.$$.update=()=>{l.$$.dirty&80&&(h.id||_.id?s(8,w=!0):s(8,w=!1))},e=ee(e),[f,a,n,u,h,d,_,b,w,r,g,o,e,v,j,S,q,F,te,ie,se,re]}class Tl extends G{constructor(e){super(),R(this,e,yl,Dl,U,{size:0,role:1,color:2,withEvents:3,title:4,strokeWidth:5,desc:6,ariaLabel:7})}}function Il(l){let e,s,t,o,i,r,f;return{c(){e=V("div"),s=V("img"),this.h()},l(a){e=A(a,"DIV",{class:!0,title:!0});var n=p(e);s=A(n,"IMG",{src:!0,alt:!0,class:!0}),n.forEach(k),this.h()},h(){Ke(s.src,t="/favicon.png")||m(s,"src",t),m(s,"alt","bananaui logo"),m(s,"class",o="w-10 h-10 m-4 "+(l[1]?"invert":"")),m(e,"class",i="cursor-pointer "+l[0]),m(e,"title","toggle dark mode")},m(a,n){C(a,e,n),E(e,s),r||(f=L(e,"click",l[2]),r=!0)},p(a,[n]){n&2&&o!==(o="w-10 h-10 m-4 "+(a[1]?"invert":""))&&m(s,"class",o),n&1&&i!==(i="cursor-pointer "+a[0])&&m(e,"class",i)},i:H,o:H,d(a){a&&k(e),r=!1,f()}}}let Sl="rgb(2 6 23)",Pl="lightgray";function Vl(l,e,s){let t;oe(l,he,n=>s(1,t=n));let{div_class:o=""}=e,i=-1;const r=()=>{localStorage.theme?localStorage.theme==="dark"?(document.documentElement.classList.add("dark"),i=1):(document.documentElement.classList.remove("dark"),i=0):window.matchMedia("(prefers-color-scheme: dark)").matches?(document.documentElement.classList.add("dark"),i=1):(document.documentElement.classList.remove("dark"),i=0),he.set(i)},f=()=>{i++,i>1&&(i=0),i==0&&(localStorage.theme="light"),i==1&&(localStorage.theme="dark"),r()};fe(()=>{r(),setInterval(()=>{r()},500),he.subscribe(n=>{if(!document){console.log("document not defined");return}let u=document.querySelector(":root");if(!u){console.log("no root!");return}for(const h of a)u.style.setProperty(h,n?Pl:Sl)})});let a=["--json-tree-string-color","--json-tree-boolean-color","--json-tree-number-color","--json-tree-arrow-color","--json-tree-property-color","--json-tree-label-color","--json-tree-operator-color","--json-tree-number-color","--json-tree-string-color","--json-tree-property-color"];return l.$$set=n=>{"div_class"in n&&s(0,o=n.div_class)},[o,t,f]}class Al extends G{constructor(e){super(),R(this,e,Vl,Il,U,{div_class:0})}}function Se(l,e,s){const t=l.slice();return t[6]=e[s],t}function Pe(l){let e,s,t=be(l[6].name.replaceAll("_"," "))+"",o,i,r,f;return{c(){e=V("li"),s=V("a"),o=T(t),r=J(),this.h()},l(a){e=A(a,"LI",{class:!0});var n=p(e);s=A(n,"A",{href:!0});var u=p(s);o=I(u,t),u.forEach(k),r=K(n),n.forEach(k),this.h()},h(){m(s,"href",i=l[6].appPath),m(e,"class",f="mx-4 hover:dark:text-slate-200 hover:text-slate-600 mt-2 "+(l[1](l[6])?"dark:text-slate-50 text-slate-700":""))},m(a,n){C(a,e,n),E(e,s),E(s,o),E(e,r)},p(a,n){n&1&&t!==(t=be(a[6].name.replaceAll("_"," "))+"")&&P(o,t),n&1&&i!==(i=a[6].appPath)&&m(s,"href",i),n&1&&f!==(f="mx-4 hover:dark:text-slate-200 hover:text-slate-600 mt-2 "+(a[1](a[6])?"dark:text-slate-50 text-slate-700":""))&&m(e,"class",f)},d(a){a&&k(e)}}}function Nl(l){let e,s,t,o,i,r=Fe.name+"",f,a,n,u,h;t=new Al({props:{div_class:""}});let d=ue(l[0]),_=[];for(let g=0;g<d.length;g+=1)_[g]=Pe(Se(l,d,g));return{c(){e=V("header"),s=V("div"),X(t.$$.fragment),o=J(),i=V("h1"),f=T(r),a=J(),n=V("nav"),u=V("ul");for(let g=0;g<_.length;g+=1)_[g].c();this.h()},l(g){e=A(g,"HEADER",{class:!0});var w=p(e);s=A(w,"DIV",{class:!0});var b=p(s);Q(t.$$.fragment,b),o=K(b),i=A(b,"H1",{class:!0});var v=p(i);f=I(v,r),v.forEach(k),b.forEach(k),a=K(w),n=A(w,"NAV",{class:!0});var j=p(n);u=A(j,"UL",{class:!0});var S=p(u);for(let q=0;q<_.length;q+=1)_[q].l(S);S.forEach(k),j.forEach(k),w.forEach(k),this.h()},h(){m(i,"class","font-medium text-2xl"),m(s,"class","flex flex-row items-center min-w-[200px]"),m(u,"class","flex flex-col"),m(n,"class","text-2xl text-slate-400"),m(e,"class","flex flex-col border-r-[1px] dark:border-slate-800 p-4 pt-10 bg-slate-100 dark:bg-gray-900 rounded-r-xl")},m(g,w){C(g,e,w),E(e,s),Y(t,s,null),E(s,o),E(s,i),E(i,f),E(e,a),E(e,n),E(n,u);for(let b=0;b<_.length;b+=1)_[b]&&_[b].m(u,null);h=!0},p(g,[w]){if(w&3){d=ue(g[0]);let b;for(b=0;b<d.length;b+=1){const v=Se(g,d,b);_[b]?_[b].p(v,w):(_[b]=Pe(v),_[b].c(),_[b].m(u,null))}for(;b<_.length;b+=1)_[b].d(1);_.length=d.length}},i(g){h||(D(t.$$.fragment,g),h=!0)},o(g){y(t.$$.fragment,g),h=!1},d(g){g&&k(e),$(t),Xe(_,g)}}}function Ol(l,e,s){let t;oe(l,me,n=>s(2,t=n));let o=[{name:"profile",appPath:"/profile"},{name:"overview",appPath:"/"}],i=[{name:"settings",appPath:"/settings"}],r=!1;function f(){s(0,o)}function a(n){return!r||!window?!1:window.location.pathname==n.appPath||window.location.search.includes(`=${n.name}`)}return fe(()=>{r=!0;const n=el.map(u=>({name:u.name,appPath:`/entities?type=${u.name.toLowerCase()}`}));s(0,o=[...o,...n,...i])}),l.$$.update=()=>{l.$$.dirty&4&&f()},[o,a,t]}class Zl extends G{constructor(e){super(),R(this,e,Ol,Nl,U,{})}}function ql(l,e,s){let t,o;return oe(l,me,i=>s(0,t=i)),oe(l,tl,i=>s(1,o=i)),fe(()=>{_e.subscribe(i=>{if(i&&i.config.auth.enabled&&!o){const r=t.url.pathname;r!="/login"&&Je(`/login?source=${r}`)}})}),[]}class Hl extends G{constructor(e){super(),R(this,e,ql,null,U,{})}}function Ve(l,{delay:e=0,duration:s=400,easing:t=Qe}={}){const o=+getComputedStyle(l).opacity;return{delay:e,duration:s,easing:t,css:i=>`opacity: ${i*o}`}}function Ul(l){let e,s;return e=new Tl({props:{class:"w-10 h-10 fill-blue-700"}}),{c(){X(e.$$.fragment)},l(t){Q(e.$$.fragment,t)},m(t,o){Y(e,t,o),s=!0},i(t){s||(D(e.$$.fragment,t),s=!0)},o(t){y(e.$$.fragment,t),s=!1},d(t){$(e,t)}}}function Gl(l){let e,s;return e=new Bl({props:{class:"w-10 h-10 fill-red-700"}}),{c(){X(e.$$.fragment)},l(t){Q(e.$$.fragment,t)},m(t,o){Y(e,t,o),s=!0},i(t){s||(D(e.$$.fragment,t),s=!0)},o(t){y(e.$$.fragment,t),s=!1},d(t){$(e,t)}}}function Rl(l){let e,s;return e=new bl({props:{class:"w-10 h-10 fill-green-700"}}),{c(){X(e.$$.fragment)},l(t){Q(e.$$.fragment,t)},m(t,o){Y(e,t,o),s=!0},i(t){s||(D(e.$$.fragment,t),s=!0)},o(t){y(e.$$.fragment,t),s=!1},d(t){$(e,t)}}}function Ae(l){let e,s,t,o,i;return s=new pl({}),{c(){e=V("button"),X(s.$$.fragment),this.h()},l(r){e=A(r,"BUTTON",{class:!0});var f=p(e);Q(s.$$.fragment,f),f.forEach(k),this.h()},h(){m(e,"class","self-start")},m(r,f){C(r,e,f),Y(s,e,null),t=!0,o||(i=L(e,"click",l[5]),o=!0)},p:H,i(r){t||(D(s.$$.fragment,r),t=!0)},o(r){y(s.$$.fragment,r),t=!1},d(r){r&&k(e),$(s),o=!1,i()}}}function Fl(l){let e,s,t,o,i,r,f,a,n;const u=[Rl,Gl,Ul],h=[];function d(b,v){return b[0]==="success"?0:b[0]==="error"?1:2}t=d(l),o=h[t]=u[t](l);const _=l[4].default,g=He(_,l,l[3],null);let w=l[1]&&Ae(l);return{c(){e=V("article"),s=V("div"),o.c(),i=J(),r=V("div"),g&&g.c(),f=J(),w&&w.c(),this.h()},l(b){e=A(b,"ARTICLE",{class:!0,role:!0});var v=p(e);s=A(v,"DIV",{class:!0});var j=p(s);o.l(j),j.forEach(k),i=K(v),r=A(v,"DIV",{class:!0});var S=p(r);g&&g.l(S),S.forEach(k),f=K(v),w&&w.l(v),v.forEach(k),this.h()},h(){m(s,"class","text-white"),m(r,"class","mx-2 w-full"),m(e,"class","dark:bg-slate-800 bg-gray-200 max-w-[35rem] flex my-1 p-2 px-4 rounded items-center dark:border-slate-700 shadow"),m(e,"role","alert")},m(b,v){C(b,e,v),E(e,s),h[t].m(s,null),E(e,i),E(e,r),g&&g.m(r,null),E(e,f),w&&w.m(e,null),n=!0},p(b,[v]){let j=t;t=d(b),t!==j&&(ae(),y(h[j],1,1,()=>{h[j]=null}),ne(),o=h[t],o||(o=h[t]=u[t](b),o.c()),D(o,1),o.m(s,null)),g&&g.p&&(!n||v&8)&&Ue(g,_,b,b[3],n?Re(_,b[3],v,null):Ge(b[3]),null),b[1]?w?(w.p(b,v),v&2&&D(w,1)):(w=Ae(b),w.c(),D(w,1),w.m(e,null)):w&&(ae(),y(w,1,1,()=>{w=null}),ne())},i(b){n||(D(o),D(g,b),D(w),b&&Ye(()=>{n&&(a||(a=ke(e,Ve,{},!0)),a.run(1))}),n=!0)},o(b){y(o),y(g,b),y(w),b&&(a||(a=ke(e,Ve,{},!1)),a.run(0)),n=!1},d(b){b&&k(e),h[t].d(),g&&g.d(b),w&&w.d(),b&&a&&a.end()}}}function Jl(l,e,s){let{$$slots:t={},$$scope:o}=e;const i=$e();let{type:r="error"}=e,{dismissible:f=!0}=e;const a=()=>i("dismiss");return l.$$set=n=>{"type"in n&&s(0,r=n.type),"dismissible"in n&&s(1,f=n.dismissible),"$$scope"in n&&s(3,o=n.$$scope)},[r,f,i,o,t,a]}class Kl extends G{constructor(e){super(),R(this,e,Jl,Fl,U,{type:0,dismissible:1})}}function Ne(l,e,s){const t=l.slice();return t[2]=e[s],t}function Oe(l){let e,s=[],t=new Map,o,i=ue(l[0]);const r=f=>f[2].id;for(let f=0;f<i.length;f+=1){let a=Ne(l,i,f),n=r(a);t.set(n,s[f]=Ze(n,a))}return{c(){e=V("section");for(let f=0;f<s.length;f+=1)s[f].c();this.h()},l(f){e=A(f,"SECTION",{class:!0});var a=p(e);for(let n=0;n<s.length;n+=1)s[n].l(a);a.forEach(k),this.h()},h(){m(e,"class","fixed right-0 top-0 flex flex-col z-[1000] mt-5 mr-10")},m(f,a){C(f,e,a);for(let n=0;n<s.length;n+=1)s[n]&&s[n].m(e,null);o=!0},p(f,a){a&1&&(i=ue(f[0]),ae(),s=al(s,a,r,1,f,i,t,e,nl,Ze,null,Ne),ne())},i(f){if(!o){for(let a=0;a<i.length;a+=1)D(s[a]);o=!0}},o(f){for(let a=0;a<s.length;a+=1)y(s[a]);o=!1},d(f){f&&k(e);for(let a=0;a<s.length;a+=1)s[a].d()}}}function Xl(l){let e=l[2].message+"",s;return{c(){s=T(e)},l(t){s=I(t,e)},m(t,o){C(t,s,o)},p(t,o){o&1&&e!==(e=t[2].message+"")&&P(s,e)},d(t){t&&k(s)}}}function Ze(l,e){let s,t,o;function i(){return e[1](e[2])}return t=new Kl({props:{type:e[2].type,dismissible:e[2].dismissible,$$slots:{default:[Xl]},$$scope:{ctx:e}}}),t.$on("dismiss",i),{key:l,first:null,c(){s=M(),X(t.$$.fragment),this.h()},l(r){s=M(),Q(t.$$.fragment,r),this.h()},h(){this.first=s},m(r,f){C(r,s,f),Y(t,r,f),o=!0},p(r,f){e=r;const a={};f&1&&(a.type=e[2].type),f&1&&(a.dismissible=e[2].dismissible),f&33&&(a.$$scope={dirty:f,ctx:e}),t.$set(a)},i(r){o||(D(t.$$.fragment,r),o=!0)},o(r){y(t.$$.fragment,r),o=!1},d(r){r&&k(s),$(t,r)}}}function Ql(l){let e,s,t=l[0]&&Oe(l);return{c(){t&&t.c(),e=M()},l(o){t&&t.l(o),e=M()},m(o,i){t&&t.m(o,i),C(o,e,i),s=!0},p(o,[i]){o[0]?t?(t.p(o,i),i&1&&D(t,1)):(t=Oe(o),t.c(),D(t,1),t.m(e.parentNode,e)):t&&(ae(),y(t,1,1,()=>{t=null}),ne())},i(o){s||(D(t),s=!0)},o(o){y(t),s=!1},d(o){o&&k(e),t&&t.d(o)}}}function Yl(l,e,s){let t;return oe(l,il,i=>s(0,t=i)),[t,i=>sl(i.id)]}class $l extends G{constructor(e){super(),R(this,e,Yl,Ql,U,{})}}function qe(l){let e,s;return e=new Zl({}),{c(){X(e.$$.fragment)},l(t){Q(e.$$.fragment,t)},m(t,o){Y(e,t,o),s=!0},i(t){s||(D(e.$$.fragment,t),s=!0)},o(t){y(e.$$.fragment,t),s=!1},d(t){$(e,t)}}}function xl(l){let e,s,t,o,i,r,f,a,n=!l[0].url.pathname.includes("/login"),u,h,d,_;document.title=Fe.name,s=new cl({}),o=new Hl({}),r=new $l({});let g=n&&qe();const w=l[2].default,b=He(w,l,l[1],null);return{c(){e=J(),X(s.$$.fragment),t=J(),X(o.$$.fragment),i=J(),X(r.$$.fragment),f=J(),a=V("div"),g&&g.c(),u=J(),h=V("main"),d=V("div"),b&&b.c(),this.h()},l(v){xe("svelte-nf5zyv",document.head).forEach(k),e=K(v),Q(s.$$.fragment,v),t=K(v),Q(o.$$.fragment,v),i=K(v),Q(r.$$.fragment,v),f=K(v),a=A(v,"DIV",{class:!0});var S=p(a);g&&g.l(S),u=K(S),h=A(S,"MAIN",{class:!0});var q=p(h);d=A(q,"DIV",{class:!0});var F=p(d);b&&b.l(F),F.forEach(k),q.forEach(k),S.forEach(k),this.h()},h(){m(d,"class","flex flex-col m-8 border border-slate-300 dark:border-zinc-800 bg-white rounded-xl dark:bg-slate-900 dark:text-slate-50"),m(h,"class","w-full h-full"),m(a,"class","flex flex-row min-h-[100vh]")},m(v,j){C(v,e,j),Y(s,v,j),C(v,t,j),Y(o,v,j),C(v,i,j),Y(r,v,j),C(v,f,j),C(v,a,j),g&&g.m(a,null),E(a,u),E(a,h),E(h,d),b&&b.m(d,null),_=!0},p(v,[j]){j&1&&(n=!v[0].url.pathname.includes("/login")),n?g?j&1&&D(g,1):(g=qe(),g.c(),D(g,1),g.m(a,u)):g&&(ae(),y(g,1,1,()=>{g=null}),ne()),b&&b.p&&(!_||j&2)&&Ue(b,w,v,v[1],_?Re(w,v[1],j,null):Ge(v[1]),null)},i(v){_||(D(s.$$.fragment,v),D(o.$$.fragment,v),D(r.$$.fragment,v),D(g),D(b,v),_=!0)},o(v){y(s.$$.fragment,v),y(o.$$.fragment,v),y(r.$$.fragment,v),y(g),y(b,v),_=!1},d(v){v&&(k(e),k(t),k(i),k(f),k(a)),$(s,v),$(o,v),$(r,v),g&&g.d(),b&&b.d(v)}}}function et(l,e,s){let t;oe(l,me,r=>s(0,t=r));let{$$slots:o={},$$scope:i}=e;return l.$$set=r=>{"$$scope"in r&&s(1,i=r.$$scope)},[t,i,o]}class dt extends G{constructor(e){super(),R(this,e,et,xl,U,{})}}export{dt as component,ft as universal};
