import{s as p,k as l,o as f}from"../chunks/scheduler.Bq1aPRZr.js";import{S as g,i as b}from"../chunks/index.dYeTvltd.js";import{u as d}from"../chunks/stores.CJOv96xK.js";import{g as c,b as k}from"../chunks/entry.CZr-Zmxn.js";import{p as u}from"../chunks/stores.D3W6ltxw.js";function S(e,o,m){let t;l(e,u,r=>m(1,t=r));let s=!1;return u.subscribe(r=>{if(!s)return;const a=new URLSearchParams(window.location.search),n=a.get("id_token"),i=a.get("state");n&&(d.set(n),i&&c(k+i))}),f(()=>{s=!0,t.url.toString().includes("callback#")&&c(t.url.toString().replace("#","?"))}),[]}class v extends g{constructor(o){super(),b(this,o,S,null,p,{})}}export{v as component};
