function P(){}const et=t=>t;function q(t,e){for(const n in e)t[n]=e[n];return t}function nt(t){return!!t&&(typeof t=="object"||typeof t=="function")&&typeof t.then=="function"}function H(t){return t()}function it(){return Object.create(null)}function L(t){t.forEach(H)}function ct(t){return typeof t=="function"}function rt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let m;function st(t,e){return t===e?!0:(m||(m=document.createElement("a")),m.href=e,t===m.href)}function ot(t){return Object.keys(t).length===0}function A(t,...e){if(t==null){for(const i of e)i(void 0);return P}const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function lt(t){let e;return A(t,n=>e=n)(),e}function ut(t,e,n){t.$$.on_destroy.push(A(e,n))}function at(t,e,n,i){if(t){const c=j(t,e,n,i);return t[0](c)}}function j(t,e,n,i){return t[1]&&i?q(n.ctx.slice(),t[1](i(e))):n.ctx}function ft(t,e,n,i){if(t[2]&&i){const c=t[2](i(n));if(e.dirty===void 0)return c;if(typeof c=="object"){const l=[],r=Math.max(e.dirty.length,c.length);for(let o=0;o<r;o+=1)l[o]=e.dirty[o]|c[o];return l}return e.dirty|c}return e.dirty}function _t(t,e,n,i,c,l){if(c){const r=j(e,n,i,l);t.p(r,c)}}function dt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function ht(t){const e={};for(const n in t)n[0]!=="$"&&(e[n]=t[n]);return e}function mt(t,e){const n={};e=new Set(e);for(const i in t)!e.has(i)&&i[0]!=="$"&&(n[i]=t[i]);return n}function pt(t){return t??""}function yt(t,e,n){return t.set(n),e}let y=!1;function bt(){y=!0}function gt(){y=!1}function B(t,e,n,i){for(;t<e;){const c=t+(e-t>>1);n(c)<=i?t=c+1:e=c}return t}function M(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const s=[];for(let u=0;u<e.length;u++){const a=e[u];a.claim_order!==void 0&&s.push(a)}e=s}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let c=0;for(let s=0;s<e.length;s++){const u=e[s].claim_order,a=(c>0&&e[n[c]].claim_order<=u?c+1:B(1,c,T=>e[n[T]].claim_order,u))-1;i[s]=n[a]+1;const k=a+1;n[k]=s,c=Math.max(k,c)}const l=[],r=[];let o=e.length-1;for(let s=n[c]+1;s!=0;s=i[s-1]){for(l.push(e[s-1]);o>=s;o--)r.push(e[o]);o--}for(;o>=0;o--)r.push(e[o]);l.reverse(),r.sort((s,u)=>s.claim_order-u.claim_order);for(let s=0,u=0;s<r.length;s++){for(;u<l.length&&r[s].claim_order>=l[u].claim_order;)u++;const a=u<l.length?l[u]:null;t.insertBefore(r[s],a)}}function R(t,e){t.appendChild(e)}function I(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function xt(t){const e=C("style");return e.textContent="/* empty */",z(I(t),e),e.sheet}function z(t,e){return R(t.head||t,e),e.sheet}function F(t,e){if(y){for(M(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function wt(t,e,n){y&&!n?F(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function vt(t){t.parentNode&&t.parentNode.removeChild(t)}function Et(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function C(t){return document.createElement(t)}function U(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function v(t){return document.createTextNode(t)}function kt(){return v(" ")}function Nt(){return v("")}function At(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function jt(t){return function(e){return e.preventDefault(),t.call(this,e)}}function Ct(t){return function(e){return e.stopPropagation(),t.call(this,e)}}function E(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}const W=["width","height"];function G(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const i in e)e[i]==null?t.removeAttribute(i):i==="style"?t.style.cssText=e[i]:i==="__value"?t.value=t[i]=e[i]:n[i]&&n[i].set&&W.indexOf(i)===-1?t[i]=e[i]:E(t,i,e[i])}function Dt(t,e){for(const n in e)E(t,n,e[n])}function J(t,e){Object.keys(e).forEach(n=>{K(t,n,e[n])})}function K(t,e,n){const i=e.toLowerCase();i in t?t[i]=typeof t[i]=="boolean"&&n===""?!0:n:e in t?t[e]=typeof t[e]=="boolean"&&n===""?!0:n:E(t,e,n)}function St(t){return/-/.test(t)?J:G}function Ot(t){return t.dataset.svelteH}function Tt(t){return Array.from(t.childNodes)}function Q(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function D(t,e,n,i,c=!1){Q(t);const l=(()=>{for(let r=t.claim_info.last_index;r<t.length;r++){const o=t[r];if(e(o)){const s=n(o);return s===void 0?t.splice(r,1):t[r]=s,c||(t.claim_info.last_index=r),o}}for(let r=t.claim_info.last_index-1;r>=0;r--){const o=t[r];if(e(o)){const s=n(o);return s===void 0?t.splice(r,1):t[r]=s,c?s===void 0&&t.claim_info.last_index--:t.claim_info.last_index=r,o}}return i()})();return l.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,l}function S(t,e,n,i){return D(t,c=>c.nodeName===e,c=>{const l=[];for(let r=0;r<c.attributes.length;r++){const o=c.attributes[r];n[o.name]||l.push(o.name)}l.forEach(r=>c.removeAttribute(r))},()=>i(e))}function Pt(t,e,n){return S(t,e,n,C)}function qt(t,e,n){return S(t,e,n,U)}function V(t,e){return D(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>v(e),!0)}function Ht(t){return V(t," ")}function Lt(t,e){e=""+e,t.data!==e&&(t.data=e)}function Bt(t,e){t.value=e??""}function Mt(t,e,n,i){n==null?t.style.removeProperty(e):t.style.setProperty(e,n,"")}function Rt(t,e,n){for(let i=0;i<t.options.length;i+=1){const c=t.options[i];if(c.__value===e){c.selected=!0;return}}(!n||e!==void 0)&&(t.selectedIndex=-1)}function It(t,e){for(let n=0;n<t.options.length;n+=1){const i=t.options[n];i.selected=~e.indexOf(i.__value)}}function zt(t){const e=t.querySelector(":checked");return e&&e.__value}function Ft(t,e,n){t.classList.toggle(e,!!n)}function X(t,e,{bubbles:n=!1,cancelable:i=!1}={}){return new CustomEvent(t,{detail:e,bubbles:n,cancelable:i})}function Ut(t,e){const n=[];let i=0;for(const c of e.childNodes)if(c.nodeType===8){const l=c.textContent.trim();l===`HEAD_${t}_END`?(i-=1,n.push(c)):l===`HEAD_${t}_START`&&(i+=1,n.push(c))}else i>0&&n.push(c);return n}function Wt(t,e){return new t(e)}let p;function b(t){p=t}function d(){if(!p)throw new Error("Function called outside component initialization");return p}function Gt(t){d().$$.on_mount.push(t)}function Jt(t){d().$$.after_update.push(t)}function Kt(t){d().$$.on_destroy.push(t)}function Qt(){const t=d();return(e,n,{cancelable:i=!1}={})=>{const c=t.$$.callbacks[e];if(c){const l=X(e,n,{cancelable:i});return c.slice().forEach(r=>{r.call(t,l)}),!l.defaultPrevented}return!0}}function Vt(t,e){return d().$$.context.set(t,e),e}function Xt(t){return d().$$.context.get(t)}function Yt(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach(i=>i.call(this,e))}const h=[],N=[];let _=[];const x=[],O=Promise.resolve();let w=!1;function Y(){w||(w=!0,O.then($))}function Zt(){return Y(),O}function Z(t){_.push(t)}function $t(t){x.push(t)}const g=new Set;let f=0;function $(){if(f!==0)return;const t=p;do{try{for(;f<h.length;){const e=h[f];f++,b(e),tt(e.$$)}}catch(e){throw h.length=0,f=0,e}for(b(null),h.length=0,f=0;N.length;)N.pop()();for(let e=0;e<_.length;e+=1){const n=_[e];g.has(n)||(g.add(n),n())}_.length=0}while(h.length);for(;x.length;)x.pop()();w=!1,g.clear(),b(t)}function tt(t){if(t.fragment!==null){t.update(),L(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(Z)}}function te(t){const e=[],n=[];_.forEach(i=>t.indexOf(i)===-1?e.push(i):n.push(i)),n.forEach(i=>i()),_=e}export{ct as $,at as A,_t as B,dt as C,ft as D,G as E,Yt as F,St as G,Dt as H,qt as I,U as J,Ut as K,Qt as L,A as M,lt as N,Jt as O,Zt as P,Wt as Q,Mt as R,N as S,Et as T,It as U,Rt as V,Z as W,zt as X,$t as Y,I as Z,xt as _,Lt as a,et as a0,X as a1,ot as a2,p as a3,it as a4,$ as a5,b as a6,te as a7,H as a8,bt as a9,gt as aa,h as ab,Y as ac,nt as ad,d as ae,Kt as af,Ct as ag,jt as ah,Vt as ai,Ft as aj,yt as ak,pt as al,F as b,Pt as c,vt as d,Tt as e,V as f,Ht as g,C as h,wt as i,kt as j,ut as k,E as l,st as m,P as n,Gt as o,Bt as p,At as q,L as r,rt as s,v as t,Ot as u,Nt as v,mt as w,Xt as x,q as y,ht as z};
