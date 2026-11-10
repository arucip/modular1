/* motor.js · Arucip
   Evalúa escalas, scores y fórmulas guardadas como texto en modules/packs/*.json.
   Las fórmulas son copia literal del código original (no reescritas a mano).
   Las funciones auxiliares de abajo son las mismas de la app original. */
(function(){
"use strict";
var lib=(function(){
const N=v=>{const x=parseFloat(String(v).replace(",","."));return isFinite(x)?x:NaN};
const R=(v,d=2)=>isFinite(v)?(Math.round(v*10**d)/10**d).toString().replace(".",","):"—";
const ok=(v,...k)=>k.every(x=>{const y=v[x];return y!==null&&y!==undefined&&!(typeof y==="number"&&isNaN(y))});
const sum=a=>a.reduce((p,c)=>p+c,0);
const z=x=>isFinite(x)?x:0;
const ul=a=>"<ul>"+a.map(x=>"<li>"+x+"</li>").join("")+"</ul>";
const fxn=(x,d)=>{d=d||0;return(Math.round(x*Math.pow(10,d))/Math.pow(10,d)).toString().replace(".",",")};
const VIS=v=>z(v.dop)+z(v.dob)+100*z(v.epi)+100*z(v.nor)+10*z(v.mil)+10000*z(v.vas);
function meta(v){const W=v.w,H=v.h,g=v.g;if(!(W>0)||!g)return NaN;const hh=H>0;
const fn={1:()=>hh?(0.1673*W+H*15.174-617.6)/W:(W*59.48-30.33)/W,2:()=>hh?(W*19.59+H*1.303+414.9)/W:(W*22.7+505)/W,3:()=>hh?(W*16.25+H*1.372+515)/W:(13.4*W+693)/W,
4:()=>hh?(16.252*W+H*10.232-413)/W:(W*58.29-31.05)/W,5:()=>hh?(16.969*W+H*1.618+371.2)/W:(W*20.3+486)/W,6:()=>hh?(8.365*W+4.65*H+200)/W:(W*17.7+659)/W};return fn[g]()}
function cal100(v){return v.cm>0?v.cm:(v.fm?v.fm[0]:NaN)}
function prot100(v){return v.pm>0?v.pm:(v.fm?v.fm[1]:NaN)}
const VA={"2|3|3":"Aumentar amplitud (delta P) y disminuir FiO2","2|3|2":"Disminuir amplitud y disminuir FiO2","2|2|2":"Disminuir amplitud y aumentar Paw","2|1|2":"Disminuir amplitud y aumentar Paw para disminuir FiO2","2|3|1":"Disminuir FiO2","2|2|1":"Aumentar Paw","2|1|1":"Nada o aumentar Paw para disminuir FiO2","2|2|3":"Aumentar amplitud (delta P) y Paw","2|1|3":"Aumentar amplitud (delta P)",
"1|3|2":"Disminuir Paw y disminuir amplitud","1|2|2":"Aumentar Paw o FiO2 y disminuir amplitud (delta P)","1|1|2":"Disminuir amplitud (delta P)","1|3|1":"Disminuir Paw","1|2|1":"Aumentar Paw o aumentar FiO2","1|3|3":"Disminuir Paw y aumentar amplitud (delta P)","1|2|3":"Aumentar amplitud (delta P) y aumentar Paw","1|1|3":"Aumentar amplitud (delta P)","1|1|1":"No modifique el setting de VAFO"};
const FN=["Cara","Piernas","Actividad","Llanto","Consuelo"];
const QFR=[55,47,33,25,21],QTA=[2.64,2.29,1.96,1.68,1.54];
const PMAP=[[31,17],[39,25],[44,31],[45,32],[49,36],[52,38]];
function cvP(v){if(!ok(v,"va","la"))return 0;let m=0;if(ok(v,"ed")&&v.tm>=0){const t=PMAP[v.ed];m=v.tm>=t[0]?0:v.tm>=t[1]?1:2}return Math.min(6,v.va+v.la+m)}
function pim(v){if(!ok(v,"pu","el","vm"))return null;const ta=isFinite(v.ta)?v.ta:120;const fp=(v.fi>0&&v.pa>0)?v.fi/v.pa:0;
return -1.792793+3.823309*v.pu-0.5378016*v.el+0.9763453*v.vm+0.0671255*Math.abs(z(v.be))-0.0430768*ta+0.1715711*(ta*ta/1000)+0.4213994*fp+(v.dx?v.dx:0)+(v.pq?v.pq:0)}
function pel(v){if(!ok(v,"age"))return null;const a=v.age;return [v.gcs,v.pup,v.lac,v["map"+a],v["cr"+a],v.pf,v.pc,v.vm,v.wbc,v.plq].reduce((p,c)=>p+(c==null||isNaN(c)?0:c),0)}
const AE=[1,2,3,6,8,13,14,16,20],DP=[5,10,11,15,22],RP=[4,7,9,12,17,18,19,21];
const mq=(v,L)=>{const a=L.map(i=>v["m"+i]);return{s:sum(a.filter(x=>x!=null)),n:a.filter(x=>x!=null).length,t:L.length}};
return {N,R,ok,sum,z,ul,fxn,VIS,meta,cal100,prot100,VA,FN,QFR,QTA,PMAP,cvP,pim,pel,AE,DP,RP,mq};
})();
var cache={};
function compile(src){
  if(cache[src])return cache[src];var f;
  try{f=new Function("L","with(L){return ("+src+")}")(lib)}
  catch(e){var m=/^(?:async\s+)?([A-Za-z_$][\w$]*)\s*\(/.exec(src);if(!m)throw e;f=new Function("L","with(L){return ({"+src+"})}")(lib)[m[1]]}
  return cache[src]=f}
function hydrate(x){
  if(Array.isArray(x))return x.map(hydrate);
  if(x&&typeof x==="object"){var k=Object.keys(x);if(k.length===1&&k[0]==="$fn")return compile(x.$fn);
    var o={};k.forEach(function(a){o[a]=hydrate(x[a])});return o}
  return x}
/* ítem de pack -> definición de herramienta que entiende app.js */
function toTool(it){
  if(it.kind==="form"){var t={t:it.t,f:hydrate(it.f),o:hydrate(it.o)};if(it.i!=null)t.i=it.i;if(it.n!=null)t.n=it.n;return t}
  if(it.kind==="info"){var u={t:it.t,c:{html:it.html,init:function(){return function(){}}}};return u}
  return null}
window.ARU=window.ARU||{};window.ARU.motor={lib:lib,compile:compile,hydrate:hydrate,toTool:toTool};
})();
