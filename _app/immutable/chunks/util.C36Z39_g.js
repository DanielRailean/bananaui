import{w as d}from"./index.CkJDvWgm.js";function y(t,e){const o={},n={},a={$$scope:1};let c=t.length;for(;c--;){const i=t[c],r=e[c];if(r){for(const s in i)s in r||(n[s]=1);for(const s in r)a[s]||(o[s]=r[s],a[s]=1);t[c]=r}else for(const s in i)a[s]=1}for(const i in n)i in o||(o[i]=void 0);return o}function _(t){return typeof t=="object"&&t!==null?t:{}}const u=d([]),f=t=>{const e=Math.floor(Math.random()*1e4),n={...{id:e,type:"error",dismissible:!0,timeout:3500},...t};u.update(a=>[n,...a]),n.timeout&&setTimeout(()=>l(e),n.timeout)},l=t=>{u.update(e=>e.filter(o=>o.id!==t))},b=(t,e=!1,o=3500)=>f({message:t,dismissible:e,timeout:o,type:"error"}),g=(t,e=!1)=>f({message:t,type:"info",dismissible:e}),p=(t,e=!1)=>f({message:t,type:"success",dismissible:e}),h=t=>new Promise(e=>setTimeout(e,t)),w=(t,e=()=>{p("copied")})=>{navigator.clipboard.writeText(t).then(e,()=>{})};function A(t){return t&&t.charAt(0).toUpperCase()+t.slice(1)}const m="BANANA_UI_CONFIG";function C(){const t=localStorage.getItem(m);if(t)return JSON.parse(t)}export{m as L,f as a,p as b,A as c,h as d,b as e,C as f,y as g,l as h,g as i,_ as j,u as t,w};
