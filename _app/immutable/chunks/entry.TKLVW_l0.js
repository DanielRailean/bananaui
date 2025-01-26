import{R as rt}from"./scheduler.COIS6eYE.js";import{w as de}from"./index.CkJDvWgm.js";new URL("sveltekit-internal://");function ot(e,n){return e==="/"||n==="ignore"?e:n==="never"?e.endsWith("/")?e.slice(0,-1):e:n==="always"&&!e.endsWith("/")?e+"/":e}function st(e){return e.split("%25").map(decodeURI).join("%25")}function it(e){for(const n in e)e[n]=decodeURIComponent(e[n]);return e}function se({href:e}){return e.split("#")[0]}const ct=["href","pathname","search","toString","toJSON"];function lt(e,n,t){const r=new URL(e);Object.defineProperty(r,"searchParams",{value:new Proxy(r.searchParams,{get(a,o){if(o==="get"||o==="getAll"||o==="has")return s=>(t(s),a[o](s));n();const i=Reflect.get(a,o);return typeof i=="function"?i.bind(a):i}}),enumerable:!0,configurable:!0});for(const a of ct)Object.defineProperty(r,a,{get(){return n(),e[a]},enumerable:!0,configurable:!0});return r}const ft="/__data.json",ut=".html__data.json";function dt(e){return e.endsWith(".html")?e.replace(/\.html$/,ut):e.replace(/\/$/,"")+ft}function ht(...e){let n=5381;for(const t of e)if(typeof t=="string"){let r=t.length;for(;r;)n=n*33^t.charCodeAt(--r)}else if(ArrayBuffer.isView(t)){const r=new Uint8Array(t.buffer,t.byteOffset,t.byteLength);let a=r.length;for(;a;)n=n*33^r[--a]}else throw new TypeError("value must be a string or TypedArray");return(n>>>0).toString(36)}function pt(e){const n=atob(e),t=new Uint8Array(n.length);for(let r=0;r<n.length;r++)t[r]=n.charCodeAt(r);return t.buffer}const Oe=window.fetch;window.fetch=(e,n)=>((e instanceof Request?e.method:(n==null?void 0:n.method)||"GET")!=="GET"&&V.delete(he(e)),Oe(e,n));const V=new Map;function gt(e,n){const t=he(e,n),r=document.querySelector(t);if(r!=null&&r.textContent){let{body:a,...o}=JSON.parse(r.textContent);const i=r.getAttribute("data-ttl");return i&&V.set(t,{body:a,init:o,ttl:1e3*Number(i)}),r.getAttribute("data-b64")!==null&&(a=pt(a)),Promise.resolve(new Response(a,o))}return window.fetch(e,n)}function mt(e,n,t){if(V.size>0){const r=he(e,t),a=V.get(r);if(a){if(performance.now()<a.ttl&&["default","force-cache","only-if-cached",void 0].includes(t==null?void 0:t.cache))return new Response(a.body,a.init);V.delete(r)}}return window.fetch(n,t)}function he(e,n){let r=`script[data-sveltekit-fetched][data-url=${JSON.stringify(e instanceof Request?e.url:e)}]`;if(n!=null&&n.headers||n!=null&&n.body){const a=[];n.headers&&a.push([...new Headers(n.headers)].join(",")),n.body&&(typeof n.body=="string"||ArrayBuffer.isView(n.body))&&a.push(n.body),r+=`[data-hash="${ht(...a)}"]`}return r}const _t=/^(\[)?(\.\.\.)?(\w+)(?:=(\w+))?(\])?$/;function yt(e){const n=[];return{pattern:e==="/"?/^\/$/:new RegExp(`^${vt(e).map(r=>{const a=/^\[\.\.\.(\w+)(?:=(\w+))?\]$/.exec(r);if(a)return n.push({name:a[1],matcher:a[2],optional:!1,rest:!0,chained:!0}),"(?:/(.*))?";const o=/^\[\[(\w+)(?:=(\w+))?\]\]$/.exec(r);if(o)return n.push({name:o[1],matcher:o[2],optional:!0,rest:!1,chained:!0}),"(?:/([^/]+))?";if(!r)return;const i=r.split(/\[(.+?)\](?!\])/);return"/"+i.map((c,f)=>{if(f%2){if(c.startsWith("x+"))return ie(String.fromCharCode(parseInt(c.slice(2),16)));if(c.startsWith("u+"))return ie(String.fromCharCode(...c.slice(2).split("-").map(l=>parseInt(l,16))));const u=_t.exec(c),[,h,g,d,m]=u;return n.push({name:d,matcher:m,optional:!!h,rest:!!g,chained:g?f===1&&i[0]==="":!1}),g?"(.*?)":h?"([^/]*)?":"([^/]+?)"}return ie(c)}).join("")}).join("")}/?$`),params:n}}function wt(e){return!/^\([^)]+\)$/.test(e)}function vt(e){return e.slice(1).split("/").filter(wt)}function bt(e,n,t){const r={},a=e.slice(1),o=a.filter(s=>s!==void 0);let i=0;for(let s=0;s<n.length;s+=1){const c=n[s];let f=a[s-i];if(c.chained&&c.rest&&i&&(f=a.slice(s-i,s+1).filter(u=>u).join("/"),i=0),f===void 0){c.rest&&(r[c.name]="");continue}if(!c.matcher||t[c.matcher](f)){r[c.name]=f;const u=n[s+1],h=a[s+1];u&&!u.rest&&u.optional&&h&&c.chained&&(i=0),!u&&!h&&Object.keys(r).length===o.length&&(i=0);continue}if(c.optional&&c.chained){i++;continue}return}if(!i)return r}function ie(e){return e.normalize().replace(/[[\]]/g,"\\$&").replace(/%/g,"%25").replace(/\//g,"%2[Ff]").replace(/\?/g,"%3[Ff]").replace(/#/g,"%23").replace(/[.*+?^${}()|\\]/g,"\\$&")}function Et({nodes:e,server_loads:n,dictionary:t,matchers:r}){const a=new Set(n);return Object.entries(t).map(([s,[c,f,u]])=>{const{pattern:h,params:g}=yt(s),d={id:s,exec:m=>{const l=h.exec(m);if(l)return bt(l,g,r)},errors:[1,...u||[]].map(m=>e[m]),layouts:[0,...f||[]].map(i),leaf:o(c)};return d.errors.length=d.layouts.length=Math.max(d.errors.length,d.layouts.length),d});function o(s){const c=s<0;return c&&(s=~s),[c,e[s]]}function i(s){return s===void 0?s:[a.has(s),e[s]]}}function je(e,n=JSON.parse){try{return n(sessionStorage[e])}catch{}}function Ae(e,n,t=JSON.stringify){const r=t(n);try{sessionStorage[e]=r}catch{}}var xe;const I=((xe=globalThis.__sveltekit_j97ese)==null?void 0:xe.base)??"/bananaui";var Ne;const kt=((Ne=globalThis.__sveltekit_j97ese)==null?void 0:Ne.assets)??I,St="1737899457106",De="sveltekit:snapshot",$e="sveltekit:scroll",Ce="sveltekit:states",At="sveltekit:pageurl",j="sveltekit:history",F="sveltekit:navigation",K={tap:1,hover:2,viewport:3,eager:4,off:-1,false:-1},H=location.origin;function Ve(e){if(e instanceof URL)return e;let n=document.baseURI;if(!n){const t=document.getElementsByTagName("base");n=t.length?t[0].href:document.URL}return new URL(e,n)}function pe(){return{x:pageXOffset,y:pageYOffset}}function N(e,n){return e.getAttribute(`data-sveltekit-${n}`)}const Re={...K,"":K.hover};function Fe(e){let n=e.assignedSlot??e.parentNode;return(n==null?void 0:n.nodeType)===11&&(n=n.host),n}function Ge(e,n){for(;e&&e!==n;){if(e.nodeName.toUpperCase()==="A"&&e.hasAttribute("href"))return e;e=Fe(e)}}function le(e,n){let t;try{t=new URL(e instanceof SVGAElement?e.href.baseVal:e.href,document.baseURI)}catch{}const r=e instanceof SVGAElement?e.target.baseVal:e.target,a=!t||!!r||ee(t,n)||(e.getAttribute("rel")||"").split(/\s+/).includes("external"),o=(t==null?void 0:t.origin)===H&&e.hasAttribute("download");return{url:t,external:a,target:r,download:o}}function Y(e){let n=null,t=null,r=null,a=null,o=null,i=null,s=e;for(;s&&s!==document.documentElement;)r===null&&(r=N(s,"preload-code")),a===null&&(a=N(s,"preload-data")),n===null&&(n=N(s,"keepfocus")),t===null&&(t=N(s,"noscroll")),o===null&&(o=N(s,"reload")),i===null&&(i=N(s,"replacestate")),s=Fe(s);function c(f){switch(f){case"":case"true":return!0;case"off":case"false":return!1;default:return}}return{preload_code:Re[r??"off"],preload_data:Re[a??"off"],keepfocus:c(n),noscroll:c(t),reload:c(o),replace_state:c(i)}}function Ie(e){const n=de(e);let t=!0;function r(){t=!0,n.update(i=>i)}function a(i){t=!1,n.set(i)}function o(i){let s;return n.subscribe(c=>{(s===void 0||t&&c!==s)&&i(s=c)})}return{notify:r,set:a,subscribe:o}}function Rt(){const{set:e,subscribe:n}=de(!1);let t;async function r(){clearTimeout(t);try{const a=await fetch(`${kt}/_app/version.json`,{headers:{pragma:"no-cache","cache-control":"no-cache"}});if(!a.ok)return!1;const i=(await a.json()).version!==St;return i&&(e(!0),clearTimeout(t)),i}catch{return!1}}return{subscribe:n,check:r}}function ee(e,n){return e.origin!==H||!e.pathname.startsWith(n)}const It=-1,Lt=-2,Pt=-3,Tt=-4,Ut=-5,xt=-6;function Nt(e,n){if(typeof e=="number")return a(e,!0);if(!Array.isArray(e)||e.length===0)throw new Error("Invalid input");const t=e,r=Array(t.length);function a(o,i=!1){if(o===It)return;if(o===Pt)return NaN;if(o===Tt)return 1/0;if(o===Ut)return-1/0;if(o===xt)return-0;if(i)throw new Error("Invalid input");if(o in r)return r[o];const s=t[o];if(!s||typeof s!="object")r[o]=s;else if(Array.isArray(s))if(typeof s[0]=="string"){const c=s[0],f=n==null?void 0:n[c];if(f)return r[o]=f(a(s[1]));switch(c){case"Date":r[o]=new Date(s[1]);break;case"Set":const u=new Set;r[o]=u;for(let d=1;d<s.length;d+=1)u.add(a(s[d]));break;case"Map":const h=new Map;r[o]=h;for(let d=1;d<s.length;d+=2)h.set(a(s[d]),a(s[d+1]));break;case"RegExp":r[o]=new RegExp(s[1],s[2]);break;case"Object":r[o]=Object(s[1]);break;case"BigInt":r[o]=BigInt(s[1]);break;case"null":const g=Object.create(null);r[o]=g;for(let d=1;d<s.length;d+=2)g[s[d]]=a(s[d+1]);break;default:throw new Error(`Unknown type ${c}`)}}else{const c=new Array(s.length);r[o]=c;for(let f=0;f<s.length;f+=1){const u=s[f];u!==Lt&&(c[f]=a(u))}}else{const c={};r[o]=c;for(const f in s){const u=s[f];c[f]=a(u)}}return r[o]}return a(0)}const Me=new Set(["load","prerender","csr","ssr","trailingSlash","config"]);[...Me];const Ot=new Set([...Me]);[...Ot];function jt(e){return e.filter(n=>n!=null)}class te{constructor(n,t){this.status=n,typeof t=="string"?this.body={message:t}:t?this.body=t:this.body={message:`Error: ${n}`}}toString(){return JSON.stringify(this.body)}}class qe{constructor(n,t){this.status=n,this.location=t}}class ge extends Error{constructor(n,t,r){super(r),this.status=n,this.text=t}}const Dt="x-sveltekit-invalidated",$t="x-sveltekit-trailing-slash";function J(e){return e instanceof te||e instanceof ge?e.status:500}function Ct(e){return e instanceof ge?e.text:"Internal Error"}const x=je($e)??{},G=je(De)??{},T={url:Ie({}),page:Ie({}),navigating:de(null),updated:Rt()};function me(e){x[e]=pe()}function Vt(e,n){let t=e+1;for(;x[t];)delete x[t],t+=1;for(t=n+1;G[t];)delete G[t],t+=1}function D(e){return location.href=e.href,new Promise(()=>{})}function Le(){}let ne,fe,W,L,ue,$;const He=[],z=[];let P=null;const Be=[],Ft=[];let O=[],w={branch:[],error:null,url:null},_e=!1,X=!1,Pe=!0,M=!1,C=!1,Ke=!1,ye=!1,we,k,A,R,Z;async function Xt(e,n,t){var a,o;document.URL!==location.href&&(location.href=location.href),$=e,ne=Et(e),L=document.documentElement,ue=n,fe=e.nodes[0],W=e.nodes[1],fe(),W(),k=(a=history.state)==null?void 0:a[j],A=(o=history.state)==null?void 0:o[F],k||(k=A=Date.now(),history.replaceState({...history.state,[j]:k,[F]:A},""));const r=x[k];r&&(history.scrollRestoration="manual",scrollTo(r.x,r.y)),t?await Yt(ue,t):Bt(location.href,{replaceState:!0}),Kt()}function Ye(e){z.some(n=>n==null?void 0:n.snapshot)&&(G[e]=z.map(n=>{var t;return(t=n==null?void 0:n.snapshot)==null?void 0:t.capture()}))}function Je(e){var n;(n=G[e])==null||n.forEach((t,r)=>{var a,o;(o=(a=z[r])==null?void 0:a.snapshot)==null||o.restore(t)})}function Te(){me(k),Ae($e,x),Ye(A),Ae(De,G)}async function We(e,n,t,r){return B({type:"goto",url:Ve(e),keepfocus:n.keepFocus,noscroll:n.noScroll,replace_state:n.replaceState,state:n.state,redirect_count:t,nav_token:r,accept:()=>{n.invalidateAll&&(ye=!0)}})}async function Gt(e){return P={id:e.id,promise:Xe(e).then(n=>(n.type==="loaded"&&n.state.error&&(P=null),n))},P.promise}async function ce(e){const n=ne.find(t=>t.exec(Ze(e)));n&&await Promise.all([...n.layouts,n.leaf].map(t=>t==null?void 0:t[1]()))}function ze(e,n){var a;w=e.state;const t=document.querySelector("style[data-sveltekit]");t&&t.remove(),R=e.props.page,we=new $.root({target:n,props:{...e.props,stores:T,components:z},hydrate:!0}),Je(A);const r={from:null,to:{params:w.params,route:{id:((a=w.route)==null?void 0:a.id)??null},url:new URL(location.href)},willUnload:!1,type:"enter",complete:Promise.resolve()};O.forEach(o=>o(r)),X=!0}async function Q({url:e,params:n,branch:t,status:r,error:a,route:o,form:i}){let s="never";if(I&&(e.pathname===I||e.pathname===I+"/"))s="always";else for(const d of t)(d==null?void 0:d.slash)!==void 0&&(s=d.slash);e.pathname=ot(e.pathname,s),e.search=e.search;const c={type:"loaded",state:{url:e,params:n,branch:t,error:a,route:o},props:{constructors:jt(t).map(d=>d.node.component),page:R}};i!==void 0&&(c.props.form=i);let f={},u=!R,h=0;for(let d=0;d<Math.max(t.length,w.branch.length);d+=1){const m=t[d],l=w.branch[d];(m==null?void 0:m.data)!==(l==null?void 0:l.data)&&(u=!0),m&&(f={...f,...m.data},u&&(c.props[`data_${h}`]=f),h+=1)}return(!w.url||e.href!==w.url.href||w.error!==a||i!==void 0&&i!==R.form||u)&&(c.props.page={error:a,params:n,route:{id:(o==null?void 0:o.id)??null},state:{},status:r,url:new URL(e),form:i??null,data:u?f:R.data}),c}async function ve({loader:e,parent:n,url:t,params:r,route:a,server_data_node:o}){var u,h,g;let i=null,s=!0;const c={dependencies:new Set,params:new Set,parent:!1,route:!1,url:!1,search_params:new Set},f=await e();if((u=f.universal)!=null&&u.load){let d=function(...l){for(const _ of l){const{href:v}=new URL(_,t);c.dependencies.add(v)}};const m={route:new Proxy(a,{get:(l,_)=>(s&&(c.route=!0),l[_])}),params:new Proxy(r,{get:(l,_)=>(s&&c.params.add(_),l[_])}),data:(o==null?void 0:o.data)??null,url:lt(t,()=>{s&&(c.url=!0)},l=>{s&&c.search_params.add(l)}),async fetch(l,_){let v;l instanceof Request?(v=l.url,_={body:l.method==="GET"||l.method==="HEAD"?void 0:await l.blob(),cache:l.cache,credentials:l.credentials,headers:l.headers,integrity:l.integrity,keepalive:l.keepalive,method:l.method,mode:l.mode,redirect:l.redirect,referrer:l.referrer,referrerPolicy:l.referrerPolicy,signal:l.signal,..._}):v=l;const S=new URL(v,t);return s&&d(S.href),S.origin===t.origin&&(v=S.href.slice(t.origin.length)),X?mt(v,S.href,_):gt(v,_)},setHeaders:()=>{},depends:d,parent(){return s&&(c.parent=!0),n()},untrack(l){s=!1;try{return l()}finally{s=!0}}};i=await f.universal.load.call(null,m)??null}return{node:f,loader:e,server:o,universal:(h=f.universal)!=null&&h.load?{type:"data",data:i,uses:c}:null,data:i??(o==null?void 0:o.data)??null,slash:((g=f.universal)==null?void 0:g.trailingSlash)??(o==null?void 0:o.slash)}}function Ue(e,n,t,r,a,o){if(ye)return!0;if(!a)return!1;if(a.parent&&e||a.route&&n||a.url&&t)return!0;for(const i of a.search_params)if(r.has(i))return!0;for(const i of a.params)if(o[i]!==w.params[i])return!0;for(const i of a.dependencies)if(He.some(s=>s(new URL(i))))return!0;return!1}function be(e,n){return(e==null?void 0:e.type)==="data"?e:(e==null?void 0:e.type)==="skip"?n??null:null}function Mt(e,n){if(!e)return new Set(n.searchParams.keys());const t=new Set([...e.searchParams.keys(),...n.searchParams.keys()]);for(const r of t){const a=e.searchParams.getAll(r),o=n.searchParams.getAll(r);a.every(i=>o.includes(i))&&o.every(i=>a.includes(i))&&t.delete(r)}return t}async function Xe({id:e,invalidating:n,url:t,params:r,route:a}){if((P==null?void 0:P.id)===e)return P.promise;const{errors:o,layouts:i,leaf:s}=a,c=[...i,s];o.forEach(p=>p==null?void 0:p().catch(()=>{})),c.forEach(p=>p==null?void 0:p[1]().catch(()=>{}));let f=null;const u=w.url?e!==w.url.pathname+w.url.search:!1,h=w.route?a.id!==w.route.id:!1,g=Mt(w.url,t);let d=!1;const m=c.map((p,y)=>{var U;const b=w.branch[y],E=!!(p!=null&&p[0])&&((b==null?void 0:b.loader)!==p[1]||Ue(d,h,u,g,(U=b.server)==null?void 0:U.uses,r));return E&&(d=!0),E});if(m.some(Boolean)){try{f=await tt(t,m)}catch(p){return ae({status:J(p),error:await q(p,{url:t,params:r,route:{id:a.id}}),url:t,route:a})}if(f.type==="redirect")return f}const l=f==null?void 0:f.nodes;let _=!1;const v=c.map(async(p,y)=>{var re;if(!p)return;const b=w.branch[y],E=l==null?void 0:l[y];if((!E||E.type==="skip")&&p[1]===(b==null?void 0:b.loader)&&!Ue(_,h,u,g,(re=b.universal)==null?void 0:re.uses,r))return b;if(_=!0,(E==null?void 0:E.type)==="error")throw E;return ve({loader:p[1],url:t,params:r,route:a,parent:async()=>{var Se;const ke={};for(let oe=0;oe<y;oe+=1)Object.assign(ke,(Se=await v[oe])==null?void 0:Se.data);return ke},server_data_node:be(E===void 0&&p[0]?{type:"skip"}:E??null,p[0]?b==null?void 0:b.server:void 0)})});for(const p of v)p.catch(()=>{});const S=[];for(let p=0;p<c.length;p+=1)if(c[p])try{S.push(await v[p])}catch(y){if(y instanceof qe)return{type:"redirect",location:y.location};let b=J(y),E;if(l!=null&&l.includes(y))b=y.status??b,E=y.error;else if(y instanceof te)E=y.body;else{if(await T.updated.check())return await D(t);E=await q(y,{params:r,url:t,route:{id:a.id}})}const U=await qt(p,S,o);return U?await Q({url:t,params:r,branch:S.slice(0,U.idx).concat(U.node),status:b,error:E,route:a}):await et(t,{id:a.id},E,b)}else S.push(void 0);return await Q({url:t,params:r,branch:S,status:200,error:null,route:a,form:n?void 0:null})}async function qt(e,n,t){for(;e--;)if(t[e]){let r=e;for(;!n[r];)r-=1;try{return{idx:r+1,node:{node:await t[e](),loader:t[e],data:{},server:null,universal:null}}}catch{continue}}}async function ae({status:e,error:n,url:t,route:r}){const a={};let o=null;if($.server_loads[0]===0)try{const f=await tt(t,[!0]);if(f.type!=="data"||f.nodes[0]&&f.nodes[0].type!=="data")throw 0;o=f.nodes[0]??null}catch{(t.origin!==H||t.pathname!==location.pathname||_e)&&await D(t)}const s=await ve({loader:fe,url:t,params:a,route:r,parent:()=>Promise.resolve({}),server_data_node:be(o)}),c={node:await W(),loader:W,universal:null,server:null,data:null};return await Q({url:t,params:a,branch:[s,c],status:e,error:n,route:null})}function Ee(e,n){if(!e||ee(e,I))return;let t;try{t=$.hooks.reroute({url:new URL(e)})??e.pathname}catch{return}const r=Ze(t);for(const a of ne){const o=a.exec(r);if(o)return{id:e.pathname+e.search,invalidating:n,route:a,params:it(o),url:e}}}function Ze(e){return st(e.slice(I.length)||"/")}function Qe({url:e,type:n,intent:t,delta:r}){let a=!1;const o=at(w,t,e,n);r!==void 0&&(o.navigation.delta=r);const i={...o.navigation,cancel:()=>{a=!0,o.reject(new Error("navigation cancelled"))}};return M||Be.forEach(s=>s(i)),a?null:o}async function B({type:e,url:n,popped:t,keepfocus:r,noscroll:a,replace_state:o,state:i={},redirect_count:s=0,nav_token:c={},accept:f=Le,block:u=Le}){const h=Ee(n,!1),g=Qe({url:n,type:e,delta:t==null?void 0:t.delta,intent:h});if(!g){u();return}const d=k,m=A;f(),M=!0,X&&T.navigating.set(g.navigation),Z=c;let l=h&&await Xe(h);if(!l){if(ee(n,I))return await D(n);l=await et(n,{id:null},await q(new ge(404,"Not Found",`Not found: ${n.pathname}`),{url:n,params:{},route:{id:null}}),404)}if(n=(h==null?void 0:h.url)||n,Z!==c)return g.reject(new Error("navigation aborted")),!1;if(l.type==="redirect")if(s>=20)l=await ae({status:500,error:await q(new Error("Redirect loop"),{url:n,params:{},route:{id:null}}),url:n,route:{id:null}});else return We(new URL(l.location,n).href,{},s+1,c),!1;else l.props.page.status>=400&&await T.updated.check()&&await D(n);if(He.length=0,ye=!1,me(d),Ye(m),l.props.page.url.pathname!==n.pathname&&(n.pathname=l.props.page.url.pathname),i=t?t.state:i,!t){const p=o?0:1,y={[j]:k+=p,[F]:A+=p,[Ce]:i};(o?history.replaceState:history.pushState).call(history,y,"",n),o||Vt(k,A)}if(P=null,l.props.page.state=i,X){w=l.state,l.props.page&&(l.props.page.url=n);const p=(await Promise.all(Ft.map(y=>y(g.navigation)))).filter(y=>typeof y=="function");if(p.length>0){let y=function(){O=O.filter(b=>!p.includes(b))};p.push(y),O.push(...p)}we.$set(l.props),Ke=!0}else ze(l,ue);const{activeElement:_}=document;await rt();const v=t?t.scroll:a?pe():null;if(Pe){const p=n.hash&&document.getElementById(decodeURIComponent(n.hash.slice(1)));v?scrollTo(v.x,v.y):p?p.scrollIntoView():scrollTo(0,0)}const S=document.activeElement!==_&&document.activeElement!==document.body;!r&&!S&&Jt(),Pe=!0,l.props.page&&(R=l.props.page),M=!1,e==="popstate"&&Je(A),g.fulfil(void 0),O.forEach(p=>p(g.navigation)),T.navigating.set(null)}async function et(e,n,t,r){return e.origin===H&&e.pathname===location.pathname&&!_e?await ae({status:r,error:t,url:e,route:n}):await D(e)}function Ht(){let e;L.addEventListener("mousemove",o=>{const i=o.target;clearTimeout(e),e=setTimeout(()=>{r(i,2)},20)});function n(o){r(o.composedPath()[0],1)}L.addEventListener("mousedown",n),L.addEventListener("touchstart",n,{passive:!0});const t=new IntersectionObserver(o=>{for(const i of o)i.isIntersecting&&(ce(i.target.href),t.unobserve(i.target))},{threshold:0});function r(o,i){const s=Ge(o,L);if(!s)return;const{url:c,external:f,download:u}=le(s,I);if(f||u)return;const h=Y(s);if(!h.reload)if(i<=h.preload_data){const g=Ee(c,!1);g&&Gt(g)}else i<=h.preload_code&&ce(c.pathname)}function a(){t.disconnect();for(const o of L.querySelectorAll("a")){const{url:i,external:s,download:c}=le(o,I);if(s||c)continue;const f=Y(o);f.reload||(f.preload_code===K.viewport&&t.observe(o),f.preload_code===K.eager&&ce(i.pathname))}}O.push(a),a()}function q(e,n){if(e instanceof te)return e.body;const t=J(e),r=Ct(e);return $.hooks.handleError({error:e,event:n,status:t,message:r})??{message:r}}function Bt(e,n={}){return e=Ve(e),e.origin!==H?Promise.reject(new Error("goto: invalid URL")):We(e,n,0)}function Kt(){var n;history.scrollRestoration="manual",addEventListener("beforeunload",t=>{let r=!1;if(Te(),!M){const a=at(w,void 0,null,"leave"),o={...a.navigation,cancel:()=>{r=!0,a.reject(new Error("navigation cancelled"))}};Be.forEach(i=>i(o))}r?(t.preventDefault(),t.returnValue=""):history.scrollRestoration="auto"}),addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&Te()}),(n=navigator.connection)!=null&&n.saveData||Ht(),L.addEventListener("click",t=>{var g;if(t.button||t.which!==1||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.defaultPrevented)return;const r=Ge(t.composedPath()[0],L);if(!r)return;const{url:a,external:o,target:i,download:s}=le(r,I);if(!a)return;if(i==="_parent"||i==="_top"){if(window.parent!==window)return}else if(i&&i!=="_self")return;const c=Y(r);if(!(r instanceof SVGAElement)&&a.protocol!==location.protocol&&!(a.protocol==="https:"||a.protocol==="http:")||s)return;if(o||c.reload){Qe({url:a,type:"link"})?M=!0:t.preventDefault();return}const[u,h]=a.href.split("#");if(h!==void 0&&u===se(location)){const[,d]=w.url.href.split("#");if(d===h){t.preventDefault(),h===""||h==="top"&&r.ownerDocument.getElementById("top")===null?window.scrollTo({top:0}):(g=r.ownerDocument.getElementById(h))==null||g.scrollIntoView();return}if(C=!0,me(k),e(a),!c.replace_state)return;C=!1}t.preventDefault(),B({type:"link",url:a,keepfocus:c.keepfocus,noscroll:c.noscroll,replace_state:c.replace_state??a.href===location.href})}),L.addEventListener("submit",t=>{if(t.defaultPrevented)return;const r=HTMLFormElement.prototype.cloneNode.call(t.target),a=t.submitter;if(((a==null?void 0:a.formMethod)||r.method)!=="get")return;const i=new URL((a==null?void 0:a.hasAttribute("formaction"))&&(a==null?void 0:a.formAction)||r.action);if(ee(i,I))return;const s=t.target,c=Y(s);if(c.reload)return;t.preventDefault(),t.stopPropagation();const f=new FormData(s),u=a==null?void 0:a.getAttribute("name");u&&f.append(u,(a==null?void 0:a.getAttribute("value"))??""),i.search=new URLSearchParams(f).toString(),B({type:"form",url:i,keepfocus:c.keepfocus,noscroll:c.noscroll,replace_state:c.replace_state??i.href===location.href})}),addEventListener("popstate",async t=>{var r;if((r=t.state)!=null&&r[j]){const a=t.state[j];if(Z={},a===k)return;const o=x[a],i=t.state[Ce]??{},s=new URL(t.state[At]??location.href),c=t.state[F],f=se(location)===se(w.url);if(c===A&&(Ke||f)){e(s),x[k]=pe(),o&&scrollTo(o.x,o.y),i!==R.state&&(R={...R,state:i},we.$set({page:R})),k=a;return}const h=a-k;await B({type:"popstate",url:s,popped:{state:i,scroll:o,delta:h},accept:()=>{k=a,A=c},block:()=>{history.go(-h)},nav_token:Z})}else if(!C){const a=new URL(location.href);e(a)}}),addEventListener("hashchange",()=>{C&&(C=!1,history.replaceState({...history.state,[j]:++k,[F]:A},"",location.href))});for(const t of document.querySelectorAll("link"))t.rel==="icon"&&(t.href=t.href);addEventListener("pageshow",t=>{t.persisted&&T.navigating.set(null)});function e(t){w.url=t,T.page.set({...R,url:t}),T.page.notify()}}async function Yt(e,{status:n=200,error:t,node_ids:r,params:a,route:o,data:i,form:s}){_e=!0;const c=new URL(location.href);({params:a={},route:o={id:null}}=Ee(c,!1)||{});let f;try{const u=r.map(async(d,m)=>{const l=i[m];return l!=null&&l.uses&&(l.uses=nt(l.uses)),ve({loader:$.nodes[d],url:c,params:a,route:o,parent:async()=>{const _={};for(let v=0;v<m;v+=1)Object.assign(_,(await u[v]).data);return _},server_data_node:be(l)})}),h=await Promise.all(u),g=ne.find(({id:d})=>d===o.id);if(g){const d=g.layouts;for(let m=0;m<d.length;m++)d[m]||h.splice(m,0,void 0)}f=await Q({url:c,params:a,branch:h,status:n,error:t,form:s,route:g??null})}catch(u){if(u instanceof qe){await D(new URL(u.location,location.href));return}f=await ae({status:J(u),error:await q(u,{url:c,params:a,route:o}),url:c,route:o})}f.props.page&&(f.props.page.state={}),ze(f,e)}async function tt(e,n){var a;const t=new URL(e);t.pathname=dt(e.pathname),e.pathname.endsWith("/")&&t.searchParams.append($t,"1"),t.searchParams.append(Dt,n.map(o=>o?"1":"0").join(""));const r=await Oe(t.href);if(!r.ok){let o;throw(a=r.headers.get("content-type"))!=null&&a.includes("application/json")?o=await r.json():r.status===404?o="Not Found":r.status===500&&(o="Internal Error"),new te(r.status,o)}return new Promise(async o=>{var h;const i=new Map,s=r.body.getReader(),c=new TextDecoder;function f(g){return Nt(g,{Promise:d=>new Promise((m,l)=>{i.set(d,{fulfil:m,reject:l})})})}let u="";for(;;){const{done:g,value:d}=await s.read();if(g&&!u)break;for(u+=!d&&u?`
`:c.decode(d,{stream:!0});;){const m=u.indexOf(`
`);if(m===-1)break;const l=JSON.parse(u.slice(0,m));if(u=u.slice(m+1),l.type==="redirect")return o(l);if(l.type==="data")(h=l.nodes)==null||h.forEach(_=>{(_==null?void 0:_.type)==="data"&&(_.uses=nt(_.uses),_.data=f(_.data))}),o(l);else if(l.type==="chunk"){const{id:_,data:v,error:S}=l,p=i.get(_);i.delete(_),S?p.reject(f(S)):p.fulfil(f(v))}}}})}function nt(e){return{dependencies:new Set((e==null?void 0:e.dependencies)??[]),params:new Set((e==null?void 0:e.params)??[]),parent:!!(e!=null&&e.parent),route:!!(e!=null&&e.route),url:!!(e!=null&&e.url),search_params:new Set((e==null?void 0:e.search_params)??[])}}function Jt(){const e=document.querySelector("[autofocus]");if(e)e.focus();else{const n=document.body,t=n.getAttribute("tabindex");n.tabIndex=-1,n.focus({preventScroll:!0,focusVisible:!1}),t!==null?n.setAttribute("tabindex",t):n.removeAttribute("tabindex");const r=getSelection();if(r&&r.type!=="None"){const a=[];for(let o=0;o<r.rangeCount;o+=1)a.push(r.getRangeAt(o));setTimeout(()=>{if(r.rangeCount===a.length){for(let o=0;o<r.rangeCount;o+=1){const i=a[o],s=r.getRangeAt(o);if(i.commonAncestorContainer!==s.commonAncestorContainer||i.startContainer!==s.startContainer||i.endContainer!==s.endContainer||i.startOffset!==s.startOffset||i.endOffset!==s.endOffset)return}r.removeAllRanges()}})}}}function at(e,n,t,r){var c,f;let a,o;const i=new Promise((u,h)=>{a=u,o=h});return i.catch(()=>{}),{navigation:{from:{params:e.params,route:{id:((c=e.route)==null?void 0:c.id)??null},url:e.url},to:t&&{params:(n==null?void 0:n.params)??null,route:{id:((f=n==null?void 0:n.route)==null?void 0:f.id)??null},url:t},willUnload:!n,type:r,complete:i},fulfil:a,reject:o}}export{Xt as a,I as b,Bt as g,T as s};
