/* app.js · Arucip (arucip2)
   Núcleo de la interfaz: navegación, favoritos, checklists, listados, apertura de herramientas,
   carga de módulos (modules/*.json) y de los scripts de modules/custom/.
   Código de interfaz heredado de la app original; los datos ahora vienen de JSON. */
(function(){var a=window.addEventListener.bind(window),d=document.addEventListener.bind(document);window.addEventListener=function(t,f,o){if(t==="load"&&document.readyState==="complete"){setTimeout(f,0);return}return a(t,f,o)};document.addEventListener=function(t,f,o){if(t==="DOMContentLoaded"&&document.readyState!=="loading"){setTimeout(f,0);return}return d(t,f,o)}})();
/* ---------- decimales con coma o punto ---------- */
/* 0.34: decimales con coma o con punto en todos los campos numéricos (es/en/pt). Los <input type="number"> pasan a texto con teclado decimal; lo que se ve queda como lo escribió el usuario, pero .value devuelve siempre el punto, así las calculadoras leen igual «1,5» y «1.5». */
window.ARUCIP_NUM=(function(){var D=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value");
function fix(el){if(!el||el.nodeName!=="INPUT"||el.hasAttribute("data-num")||el.getAttribute("type")!=="number")return;
 var raw=D.get.call(el);el.setAttribute("data-num","");el.setAttribute("type","text");if(!el.getAttribute("inputmode"))el.setAttribute("inputmode","decimal");
 el.setAttribute("autocomplete","off");el.setAttribute("autocorrect","off");el.setAttribute("spellcheck","false");
 try{Object.defineProperty(el,"value",{configurable:true,get:function(){return String(D.get.call(this)).replace(/,/g,".")},set:function(v){D.set.call(this,v)}})}catch(e){}
 if(raw!==D.get.call(el))D.set.call(el,raw)}
function scan(r){if(!r||r.nodeType!==1)return;if(r.nodeName==="INPUT")fix(r);else if(r.querySelectorAll){var l=r.querySelectorAll('input[type="number"]');for(var i=0;i<l.length;i++)fix(l[i])}}
document.addEventListener("input",function(e){var t=e.target;if(!t||!t.hasAttribute||!t.hasAttribute("data-num"))return;var v=D.get.call(t),c=v.replace(/[^0-9.,\-]/g,"");if(c!==v)D.set.call(t,c)},true);
try{new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var a=ms[i].addedNodes;for(var j=0;j<a.length;j++)scan(a[j])}}).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
document.addEventListener("DOMContentLoaded",function(){scan(document.body)});
return{fix:fix,scan:scan,num:function(v){var x=parseFloat(String(v).replace(/,/g,"."));return isFinite(x)?x:NaN}}})();

;
/* ---------- sonido en iPhone ---------- */
/* 0.29: en iPhone el sonido de la web respeta el botón de silencio. Sesión "playback" (Safari 16.4+) y, además, audio mudo en bucle: así metrónomo, alertas y voz dependen solo del volumen. */
window.ARUCIP_SND=(function(){var ios=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1),el=null,keys={},fn=null;
function any(){for(var k in keys)return true;return false}
function play(){try{if(!el){el=document.createElement("audio");el.setAttribute("playsinline","");el.setAttribute("x-webkit-airplay","deny");el.loop=true;el.preload="auto";el.src="data:audio/wav;base64,UklGRsQPAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YaAPAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA"}var p=el.play(),r=function(){try{fn&&fn()}catch(e){}};if(p&&p.then)p.then(r,function(){});else r()}catch(e){}}
function sess(t){try{if(navigator.audioSession)navigator.audioSession.type=t}catch(e){}}
document.addEventListener("visibilitychange",function(){if(ios&&document.visibilityState==="visible"&&any())play()});
return{on:function(k,f){if(!ios)return;keys[k]=1;if(f)fn=f;sess("playback");play()},off:function(k){if(!ios)return;delete keys[k];if(any())return;try{el&&el.pause()}catch(e){}sess("auto")}}})();
;
/* ---------- aviso si no corre ---------- */
document.getElementById("nojs").hidden=true
;
(function(){var n=document.getElementById("nojs");function show(t){try{n.hidden=false;n.innerHTML="<b>Arucip no pudo iniciar.</b><br>"+t+"<br>Enviá una captura de este mensaje a Gonzalo."}catch(x){}}
window.addEventListener("error",function(e){if(!window.__booted)show((e&&e.message?e.message:"error")+(e&&e.lineno?" (línea "+e.lineno+")":""))});
window.addEventListener("load",function(){if(!window.__booted)show("No terminó de cargar.")});})()
;
/* ---------- migración de datos locales (Picu Pocket) ---------- */
/* Arucip · migración de datos locales (Picu Pocket → Arucip).
   Copia las preferencias guardadas con las claves "picu-*" a las nuevas "arucip-*" una sola vez,
   para que quienes ya usaban Picu Pocket no pierdan favoritos, idioma ni ajustes.
   Debe cargarse en <head>, antes del código principal. */
(function () {
  try {
    if (localStorage.getItem("arucip-migrated") === "1") return;
    ["ack", "fav", "frq", "fs", "lang", "paro-last", "rec", "voice"].forEach(function (k) {
      var v = localStorage.getItem("picu-" + k);
      if (v !== null && localStorage.getItem("arucip-" + k) === null) localStorage.setItem("arucip-" + k, v);
    });
    localStorage.setItem("arucip-migrated", "1");
  } catch (e) {}
})();

;
/* ---------- créditos ---------- */
/* Personas intervinientes. Única fuente: se muestra en la portada, en «Acerca de esta versión» y en la sección AR-UCIP.
   Para agregar a alguien, sumar una línea en el grupo que corresponda (los colaboradores van en orden alfabético por apellido). */
window.ARUCIP_CREDITS=[
 {g:"Equipo",p:[
  ["Jorge Selandari","Promotor inicial de AR-UCIP"],
  ["Eduardo Motto","Cocreador de AR-UCIP"],
  ["Gonzalo G. Pereira","Desarrollo de la app Arucip"]]},
 {g:"Colaboradores de AR-UCIP",p:[
  ["Carolina Caminiti",""],
  ["Debora Farberman",""],
  ["María Laura Flores Tonfi",""]]},
 {g:"Autores de fuentes y herramientas citadas",p:[
  ["Boto A","Tablas de medicación del Hospital Garrahan (Área Emergencias)"],
  ["Dr. Rodrigo Carmona","Herramienta de muerte bajo criterios neurológicos (Hospital Garrahan)"],
  ["Lorenzini L","Tablas de medicación del Hospital Garrahan (Área Farmacia)"],
  ["Moreno L y col.","Bacterial Pneumonia Score (BPS)"],
  ["Rino P","Tablas de medicación del Hospital Garrahan (Área Emergencias)"],
  ["Dr. Hernán Rowenstein","Simulador de entrenamiento (Hospital Garrahan)"]]}
];
window.ARUCIP_CRED=function(){var e=function(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;")};
 return window.ARUCIP_CREDITS.map(function(g){return '<h3 class="th">'+e(g.g)+'</h3><ul class="cred">'+g.p.map(function(x){
  return '<li><b>'+e(x[0])+'</b>'+(x[1]?'<br><span>'+e(x[1])+'</span>':'')+'</li>'}).join("")+'</ul>'}).join("")+
 '<h3 class="th">Agradecimientos</h3><p>Agradecemos la colaboración desinteresada de la Fundación Garrahan.</p>'};

;
window.ARU=window.ARU||{};ARU.T={};
var CK,TL,TIPS,TG,BB,SYN,D,CARDS,NOIMG,st={};
var $;
function __core(){
const NOREF=r=>r.map(x=>`<details class="nref"><summary>${x[0]}</summary><div>${x[1]}${x[2].map(k=>`<figure><img src="${NOIMG[k]}" alt="" loading="lazy"></figure>`).join("")}</div></details>`).join("");;
const IC={next:'<path d="m9 18 6-6-6-6"/>',heart:'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
drop:'<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
wind:'<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2"/>',
face:'<circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2M9 9h.01M15 9h.01"/>',
moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
pill:'<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7ZM8.5 8.5l7 7"/>',
pulse:'<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
check:'<path d="M20 6 9 17l-5-5"/>',chev:'<path d="m6 9 6 6 6-6"/>',
ext:'<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
calc:'<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>',
search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
list:'<path d="m3 17 2 2 4-4M3 7l2 2 4-4M13 6h8M13 12h8M13 18h8"/>',
grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
book:'<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
more:'<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>'};;
IC.cards='<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 14h4"/>';;
IC.bottle='<path d="M12 1.5c-1 0-1.6.8-1.6 1.7V4h3.2v-.8c0-.9-.6-1.7-1.6-1.7z"/><rect x="8" y="4" width="8" height="3" rx="1"/><path d="M9 7h6l.8 2.2V20a2 2 0 0 1-2 2h-3.6a2 2 0 0 1-2-2V9.2z"/><path d="M9.2 12.5h2.3M9.2 15.5h2.3M9.2 18.5h2.3"/>';;
IC.flask='<path d="M9 3h6M10 3v6.2L4.6 18.6A2 2 0 0 0 6.3 21.5h11.4a2 2 0 0 0 1.7-2.9L14 9.2V3"/><path d="M7.2 15h9.6"/>';;
IC.flame='<path d="M12 2.6C12.5 5.3 15.1 6.9 16.8 9.3C18.3 11.4 18.7 13.6 17.9 15.8C17 18.7 14.8 20.6 12 20.6C8.7 20.6 6.2 18.3 6.2 15.1C6.2 12.9 7.2 11.3 8.7 9.7C9 11.1 9.7 12 10.7 12.5C10.3 9.3 10.9 5.5 12 2.6Z"/>';;
IC.selfcare='<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>';;
IC.triage='<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>';;
IC.sys='<circle cx="12" cy="4.5" r="2.5"/><path d="M12 8v6M6.5 10.5 12 12l5.5-1.5M9 21l3-7 3 7"/>';;
IC.ind=IC.calc;;
IC.fav='<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.9z"/>';;
IC.casos='<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 12h6M9 16h4"/>';;
IC.probe='<rect x="9" y="2" width="6" height="9" rx="2"/><path d="M9 11 6 17a9 9 0 0 0 12 0l-3-6"/><path d="M8.5 22h7"/>';;
const ic=(n,c)=>`<svg ${c?`class="${c}" `:""}viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;;
const CI=["heart","drop","wind","face","moon","pill","pulse","shield"];;
const CALC={"Superficie":"c-sc","insulina":"c-hk"};;
const $=s=>document.querySelector(s);;
let st={};;
try{st=JSON.parse(localStorage.getItem("arucip")||"{}")}catch(e){};
const save=()=>{try{localStorage.setItem("arucip",JSON.stringify(st))}catch(e){}};;
const esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;");;
function lk(n,d,k){const [kind,id]=k.split(/:(.*)/s);if(kind==="url")return `<a class="lk" href="${id}" target="_blank" rel="noopener"><div><b>${esc(n)}</b>${d?`<small>${esc(d)}</small>`:""}</div>${ic("ext")}</a>`;const at=kind==="tool"?`data-tool="${id}"`:kind==="calc"?`data-go="calc" data-open="${id}"`:kind==="ck"?`data-go="ck" data-open="d-${id}"`:`data-go="bib" data-open="bb-${id}"`;
return `<a class="lk off" href="#" ${at}><div><b>${esc(n)}</b>${d?`<small>${esc(d)}</small>`:""}</div>${ic("next")}</a>`};
const ckHtml=(c,pre)=>{const [id,t,i,f,its,hd,ref]=c;let lastG="";return `<details class="card" id="${pre}d-${id}"><summary><div class="sh">${id==="pocusq"&&pre?`<span class="ic">${ic("probe")}</span>`:""}${id==="tr65"?`<span class="ic">${ic("list")}</span>`:""}<b>${t}</b><span class="cnt" id="${pre}c-${id}"></span>${ic("chev","chev")}</div><div class="bar" id="${pre}b-${id}"><i></i></div></summary><div class="body">${i?`<p class="sub">${i}</p>`:""}${hd?`<div class="flds ckh">${hd.map(h=>`<label class="f"><span>${h[1]}</span><input type="text" data-h="${id}-h-${h[0]}" autocomplete="off"></label>`).join("")}</div>`:""}${its.map((x,k)=>{let g="";if(x[2]&&x[2]!==lastG){lastG=x[2];g=`<h4 class="ckg">${x[2]}</h4>`}return g+`<label class="it" id="${pre}l-${id}-${k}"><input type="checkbox" data-id="${id}" data-k="${k}"><span>${x[0]}${x[1]?`<em>${x[1]}</em>`:""}</span></label>`+(x[3]&&x[3].length?`<div class="ckimg">${x[3].map(a=>`<figure><img src="${NOIMG[a[0]]}" alt="" loading="lazy">${a[1]?`<figcaption>${a[1]}</figcaption>`:""}</figure>`).join("")}</div>`:"")}).join("")}${ref?`<h4 class="ckg">Situaciones especiales</h4>${NOREF(ref)}`:""}<div class="fin" id="${pre}f-${id}">${ic("check")}<span>${f}</span></div><div class="row"><button class="btn g" data-r="${id}">Reiniciar este checklist</button></div></div></details>`};;
$("#cks").innerHTML=CK.map(c=>ckHtml(c,"")).join("");;
function upd(id){const c0=CK.find(c=>c[0]==id),n=c0[4].length;let d=0;for(let k=0;k<n;k++)if(st[id+"-"+k])d++;
["","p","q"].forEach(pre=>{if(!$("#"+pre+"d-"+id))return;for(let k=0;k<n;k++){const on=!!st[id+"-"+k];const l=$(`#${pre}l-${id}-${k}`);l.classList.toggle("on",on);l.querySelector("input").checked=on}
const c=$("#"+pre+"c-"+id);c.textContent=d==n?"Completo":d+" / "+n;c.classList.toggle("done",d==n);$(`#${pre}b-${id} i`).style.width=(100*d/n)+"%";$("#"+pre+"b-"+id).classList.toggle("full",d==n);$("#"+pre+"f-"+id).classList.toggle("show",d==n)});
document.querySelectorAll(`input[data-h^="${id}-h-"]`).forEach(x=>{const v=st[x.dataset.h]||"";if(x.value!==v)x.value=v})};
document.addEventListener("input",e=>{const t=e.target;if(t.dataset&&t.dataset.h){st[t.dataset.h]=t.value;save();document.querySelectorAll(`input[data-h="${t.dataset.h}"]`).forEach(x=>{if(x!==t)x.value=t.value})}});;
CK.forEach(c=>upd(c[0]));;
document.addEventListener("change",e=>{const t=e.target;if(t.dataset.id){st[t.dataset.id+"-"+t.dataset.k]=t.checked;save();upd(t.dataset.id);try{navigator.vibrate&&navigator.vibrate(t.checked?8:4)}catch(x){}}});;
function rst(id){Object.keys(st).filter(k=>k.startsWith(id+"-")).forEach(k=>delete st[k]);save();upd(id)};
const ra=$("#rall");;
let rt;;
const rback=()=>{delete ra.dataset.s;ra.textContent="Reiniciar todos los checklists";ra.classList.remove("bad")};;
ra.onclick=()=>{if(ra.dataset.s){CK.forEach(c=>rst(c[0]));clearTimeout(rt);rback()}else{ra.dataset.s=1;ra.textContent="Tocá de nuevo para confirmar";ra.classList.add("bad");rt=setTimeout(rback,3000)}};;
const CIM={"Portada":"book","Cardiovascular y ECMO":"heart","Hidroelectrolítico y Nutricional":"drop","Respiratorio":"wind","Escalas de Dolor":"face","Escalas de Sedación":"moon","Bloqueantes neuromusculares (BNM)":"pulse","Delirium":"list","Síndrome de Abstinencia":"flask","Farmacología":"pill","Neurología":"pulse","Seguridad y Calidad":"shield","Multisistémico":"grid","Autocuidado":"selfcare","IA herramientas y recursos":"search"};;
$("#tl").innerHTML=TL.map(([t,a],i)=>`<details class="card"><summary><div class="sh"><span class="ic">${ic(CIM[t])}</span><b>${t}</b><span class="cnt">${a.length}</span>${ic("chev","chev")}</div></summary><div class="lst">${a.map(x=>lk(x[0],x[1],x[2])).join("")}</div></details>`).join("").replace(/(<b>Autocuidado<\/b>.*?<div class="lst">)/,'$1<p class="nt2" style="padding:6px 4px 10px">Cuidarnos es cuidar a los pacientes. Escala de autoinforme que puede contribuir al autocuidado de quienes trabajamos con niños en estado crítico.</p>');;
const fld=(id,l)=>`<label class="f"><span>${l}</span><input id="${id}" type="number" inputmode="decimal" step="any" placeholder="0"></label>`;;
const res=(id,l,s)=>`<div class="r"><span>${l}${s?`<small>${s}</small>`:""}</span><b id="${id}">—</b></div>`;;
const cc=(id,t,b,h)=>`<details class="card" id="${id}"><summary><div class="sh"><span class="ic">${ic("calc")}</span><b>${t}</b>${ic("chev","chev")}</div></summary><div class="calc">${b}${h?`<p class="hint">${h}</p>`:""}</div></details>`;;
$("#calcs").innerHTML=
cc("c-hk","Glucosa e insulina en hiperkalemia",fld("hp","Peso (kg)")+res("h1","Vía central A","D50% 500 ml + 50 UI de insulina corriente")+res("h2","Vía central B","D25% 500 ml + 25 UI de insulina corriente")+res("h3","Periférica o intraósea","D10% 500 ml + 10 UI de insulina corriente"),"Equivale a 0,1 UI/kg de insulina y 0,5 g/kg de glucosa. Dosis: opción A 1 ml/kg, opción B 2 ml/kg, periférica 5 ml/kg, en bolo en RCP o en 20–60 min en la urgencia.");;
const n=id=>parseFloat($("#"+id).value),o=(id,v)=>$("#"+id).textContent=v;;
const f1=v=>(Math.round(v*100)/100).toString().replace(".",","),u=(v,s)=>isFinite(v)?f1(v)+" "+s:"—";;
function calc(){const q=n("hp");o("h1",u(q,"ml"));o("h2",u(q*2,"ml"));o("h3",u(q*5,"ml"))};
document.querySelectorAll("#calcs input").forEach(i=>i.oninput=calc);;
document.querySelectorAll("[data-i]").forEach(e=>e.innerHTML=ic(e.dataset.i));;
window.ARUCIP_TAB=function(v){return v==="sys"?"casos":v==="cards"?"triage":/^(ck|calc)$/.test(v)?"ind":/^(tools|bib|tips|pocus|burn)$/.test(v)?"more":v};;
window.ARUCIP_GO=function(v,o){go(v,o)};;
function go(v,open){document.querySelectorAll(".view").forEach(s=>s.hidden=s.id!=="v-"+v);document.querySelectorAll(".tabs button").forEach(b=>b.setAttribute("aria-current",b.dataset.v===window.ARUCIP_TAB(v)));scrollTo(0,0);if(open){const d=$("#"+open);d.open=true;requestAnimationFrame(()=>d.scrollIntoView({block:"center"}))}};
document.addEventListener("click",e=>{const g=e.target.closest("[data-go]");if(g){e.preventDefault();return go(g.dataset.go,g.dataset.open)}
const t=e.target.closest(".tabs button");if(t)return go(t.dataset.v);const r=e.target.closest("[data-r]");if(r)rst(r.dataset.r)});;
const nz=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();;
$("#q").oninput=e=>{const q=nz(e.target.value.trim());let any=0;document.querySelectorAll("#tl details").forEach(d=>{let c=0;d.querySelectorAll(".lk").forEach(a=>{const m=!q||nz(a.textContent+" "+(SYN[a.dataset.tool]||"")).includes(q);a.hidden=!m;c+=m});d.hidden=!c;d.open=!!q&&c>0;any+=c});$("#none").hidden=!!any||!q};;
const REV=[];;
BB.forEach(([t,i,es])=>es.forEach(([n,ls])=>{const r=ls.filter(l=>l[0]=="⚠");if(r.length)REV.push([n+" ("+t+")",r])}));;
$("#bl").innerHTML=BB.filter(x=>x[2].length).map(([t,i,es],bi)=>`<details class="card" id="bb-${bi}"><summary><div class="sh"><span class="ic">${ic(i)}</span><b>${t}</b><span class="cnt">${es.length}</span>${ic("chev","chev")}</div></summary><div class="bb">${es.map(([n,ls])=>`<div class="bk"><h3>${esc(n)}</h3>${ls.map(l=>`<p${l[0]=="⚠"?' class="rv"':l[0]=="✔"?' class="okv"':""}>${esc(l)}</p>`).join("")}</div>`).join("")}</div></details>`).join("");;
const TRV=TIPS.map(x=>(x[2].match(/class="rv"/g)||[]).length);;
$("#tpl").innerHTML=TIPS.map(([t,n,h],i)=>`<details class="card" id="tp-${i}"><summary><div class="sh"><span class="ic">${ic("list")}</span><b>${esc(t)}</b>${TRV[i]?`<span class="trv" title="Avisos en rojo">⚠ ${TRV[i]}</span>`:""}<span class="cnt">${n}</span>${ic("chev","chev")}</div></summary><div class="bb">${h}</div></details>`).join("");;
document.querySelectorAll("#tpl > details").forEach((d,i)=>{const ks=d.querySelectorAll(".bk");ks.forEach((k,j)=>{k.id="tp-"+i+"-"+j});
 if(ks.length<6)return;const nv=document.createElement("details");nv.className="tsub";const sm=document.createElement("summary");sm.textContent="Ir a una parte de este apartado";nv.appendChild(sm);const sl=document.createElement("div");sl.className="tsl";sl.setAttribute("role","navigation");sl.setAttribute("aria-label","Contenido del apartado");nv.appendChild(sl);
 ks.forEach((k,j)=>{const h3=k.querySelector("h3");if(!h3)return;const b=document.createElement("button");b.type="button";b.dataset.tb=i+"-"+j;b.textContent=h3.textContent;sl.appendChild(b)});
 d.querySelector(".bb").insertBefore(nv,d.querySelector(".bb").firstChild)});;
(function(){const used={};let h=`<details class="card" id="tixd"><summary><div class="sh"><span class="ic">${ic("list")}</span><b>Índice por tema</b><span class="cnt">${TIPS.length}</span>${ic("chev","chev")}</div></summary><div class="bb">`;
 const grp=(g,ts)=>{const c=ts.map(t=>{const i=TIPS.findIndex(x=>x[0]===t);if(i<0||used[i])return"";used[i]=1;return`<button type="button" class="tchip" data-tj="${i}">${esc(t)}${TRV[i]?`<b aria-label="avisos en rojo">⚠ ${TRV[i]}</b>`:""}</button>`}).join("");return c?`<h4 class="tg">${g}</h4><div class="tch">${c}</div>`:""};
 TG.forEach(([g,ts])=>{h+=grp(g,ts)});h+=grp("Otros",TIPS.map(x=>x[0]).filter((t,i)=>!used[i]));
 $("#tix").innerHTML=h+`</div></details>`})();;
const RM=matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth";;
const tgo=el=>{if(el)setTimeout(()=>el.scrollIntoView({block:"start",behavior:RM}),40)};;
document.addEventListener("click",e=>{const a=e.target.closest("[data-tj]");if(a){const d=document.getElementById("tp-"+a.dataset.tj);if(d){d.open=true;$("#tixd").open=false;tgo(d)}return}
 const s=e.target.closest("[data-tb]");if(s){tgo(document.getElementById("tp-"+s.dataset.tb))}});;
let trvOn=false,tT=0;;
function tUnmark(k){k.querySelectorAll("mark.tm").forEach(m=>{const p=m.parentNode;p.replaceChild(document.createTextNode(m.textContent),m);p.normalize()})};
function tMark(k,q){const w=document.createTreeWalker(k,NodeFilter.SHOW_TEXT),ns=[];let n;while((n=w.nextNode()))ns.push(n);
 ns.forEach(n=>{const t=n.nodeValue;let nt="";for(let x=0;x<t.length;x++){const c=nz(t[x]);if(c.length!==1)return;nt+=c}
  let i=nt.indexOf(q);if(i<0)return;const f=document.createDocumentFragment();let last=0;
  while(i>=0){f.appendChild(document.createTextNode(t.slice(last,i)));const m=document.createElement("mark");m.className="tm";m.textContent=t.slice(i,i+q.length);f.appendChild(m);last=i+q.length;i=nt.indexOf(q,last)}
  f.appendChild(document.createTextNode(t.slice(last)));n.parentNode.replaceChild(f,n)})};
function tFil(){const q=nz($("#tq").value.trim()),fl=!!q||trvOn;let any=0,secs=0;
 document.querySelectorAll("#tpl > details").forEach(d=>{let c=0;d.querySelectorAll(".bk").forEach(k=>{tUnmark(k);const m=(!q||nz(k.textContent).includes(q))&&(!trvOn||!!k.querySelector(".rv"));k.hidden=!m;if(m){c++;if(q&&q.length>1)tMark(k,q)}});
  d.hidden=!c;d.open=fl&&c>0;const nv=d.querySelector(".tsub");if(nv)nv.hidden=fl;any+=c;secs+=c>0?1:0});
 $("#tnone").hidden=!!any||!fl;$("#tix").hidden=fl;$("#tcount").textContent=fl&&any?any+" bloques en "+secs+" apartados":""};
$("#tq").oninput=()=>{clearTimeout(tT);tT=setTimeout(tFil,120)};;
$("#trv").onclick=()=>{trvOn=!trvOn;$("#trv").setAttribute("aria-pressed",String(trvOn));tFil()};;
$("#tall").onclick=()=>{document.querySelectorAll("#tpl > details").forEach(d=>{if(!d.hidden)d.open=true})};;
$("#tnon").onclick=()=>{document.querySelectorAll("#tpl > details").forEach(d=>{d.open=false});$("#tixd").open=false;tgo($("#v-tips"))};;
$("#bq").oninput=e=>{const q=nz(e.target.value.trim());let any=0;document.querySelectorAll("#bl details").forEach(d=>{let c=0;d.querySelectorAll(".bk").forEach(k=>{const m=!q||nz(k.textContent).includes(q);k.hidden=!m;c+=m});d.hidden=!c;d.open=!!q&&c>0;any+=c});$("#bnone").hidden=!!any||!q};;
;
Object.assign(window,{IC,ic,CI,$,st,save,esc,lk,ckHtml,upd,rst,ra,rt,fld,res,cc,n,o,u,calc,go,nz,tT});
}
function __tools(){
(function(){
const T=ARU.T;
const N=v=>{const x=parseFloat(String(v).replace(",","."));return isFinite(x)?x:NaN};
let cleanup=null,prevTab="tools";;
const esc2=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");;
const lab=s=>/&(lt|gt|amp);/.test(s)?s:esc2(s);;
function fhtml(f){
if(f.t==="x")return `<div class="x">${f.h}</div>`;
if(f.t==="h")return `<h3 class="th">${f.l}</h3>`;
const w=i=>`<div class="fw" data-fk="${f.k}">${i}</div>`;
if(f.t==="n")return w(`<label class="f"><span>${f.l}</span><input data-k="${f.k}" type="number" inputmode="decimal" step="any" placeholder="${f.ph||"0"}"${f.v!=null?` value="${f.v}"`:""}></label>`);
if(f.t==="s")return w(`<label class="f"><span>${f.l}</span><select data-k="${f.k}"><option value="">Seleccione</option>${f.o.map((x,j)=>`<option value="${j}">${esc2(x[0])}</option>`).join("")}</select></label>`);
const typ=f.t==="r"?"radio":"checkbox";
return w(`<fieldset class="fs${f.inl?" inl":""}"><legend>${f.l}</legend>${f.o.map((x,j)=>`<label class="op"><input type="${typ}" name="${f.k}" data-k="${f.k}" value="${j}"><span>${esc2(x[0])}</span></label>`).join("")}</fieldset>`)};
function collect(b,t){const v={};t.f.forEach(f=>{if(!f.k)return;const els=[...b.querySelectorAll(`[data-k="${f.k}"]`)];
if(f.t==="n")v[f.k]=N(els[0].value);
else if(f.t==="s")v[f.k]=els[0].value===""?null:f.o[+els[0].value][1];
else if(f.t==="r"){const c=els.find(e=>e.checked);v[f.k]=c?f.o[+c.value][1]:null}
else if(f.t==="c")v[f.k]=els.filter(e=>e.checked).map(e=>f.o[+e.value][1])});return v};
function upd(b,t){const v=collect(b,t);t.f.forEach(f=>{if(f.show){const e=b.querySelector(`[data-fk="${f.k}"]`);if(e)e.hidden=!f.show(v)}});
t.o.forEach((q,i)=>{const e=b.querySelector("#to-"+i);let r;try{r=q.f(v)}catch(x){r="—"}e.innerHTML=r==null||r==="NaN"?"—":r;if(q.show)e.closest(".r").hidden=!q.show(v)})};
function activeTab(){const s=document.querySelector(".view:not([hidden])");return s?s.id.slice(2):"triage"};
function openTool(key,from){const t=T[key];if(!t){ARU.loadFor(key).then(function(){if(T[key])openTool(key,from)});return}if(cleanup){try{cleanup()}catch(e){}cleanup=null}
if(!$("#v-tool").hidden===false)prevTab=from||activeTab();
$("#tt").textContent=t.t;const b=$("#tb");b.oninput=b.onchange=null;
if(t.c){b.innerHTML=t.c.html;cleanup=t.c.init(b)}
else{b.innerHTML=(t.i?`<p class="sub">${t.i}</p>`:"")+`<div class="card"><div class="calc">${t.f.map(fhtml).join("")}${t.o.map((q,i)=>`<div class="r${q.w?" w":""}"><span>${q.l}${q.s?`<small>${q.s}</small>`:""}</span><b id="to-${i}">—</b></div>`).join("")}</div></div>${t.n?`<div class="nt">${t.n}</div>`:""}`;
b.oninput=b.onchange=()=>upd(b,t);upd(b,t)}
go("tool");const tb=document.querySelector(`.tabs button[data-v="${window.ARUCIP_TAB(prevTab)}"]`);document.querySelectorAll(".tabs button").forEach(x=>x.setAttribute("aria-current",x===tb));
try{history.pushState({tool:key},"")}catch(e){}};
function closeTool(){if(cleanup){try{cleanup()}catch(e){}cleanup=null}go(prevTab)};
document.addEventListener("click",e=>{const a=e.target.closest("[data-tool]");if(a){e.preventDefault();openTool(a.dataset.tool);return}
if(cleanup&&e.target.closest(".tabs button")){try{cleanup()}catch(x){}cleanup=null}});;
$("#tback").onclick=()=>{if(history.state&&history.state.tool){history.back()}else closeTool()};;
window.addEventListener("popstate",()=>{if(!$("#v-tool").hidden)closeTool()});;
;
})();
}
function __tail(){
(function(){
/* Interruptor de tema claro/oscuro. Sin preferencia guardada, sigue el sistema. */
IC.sun='<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
const r=document.documentElement,m=matchMedia("(prefers-color-scheme:dark)"),b=document.getElementById("thm"),mt=document.querySelector('meta[name="theme-color"]');
const cur=()=>r.dataset.theme||(m.matches?"dark":"light");
function paint(){const t=cur();b.setAttribute("aria-checked",t==="dark"?"true":"false");r.dataset.mode=t;if(mt)mt.content=t==="dark"?"#0E1A1F":"#F6F2EA"}
b.onclick=()=>{const t=cur()==="dark"?"light":"dark";r.dataset.theme=t;try{localStorage.setItem("arucip-theme",t)}catch(e){}paint()};
if(m.addEventListener)m.addEventListener("change",()=>{if(!r.dataset.theme)paint()});
paint();
})();;
window.__booted=true;;
;
window.addEventListener("load",function(){(function(){
var host=document.getElementById("calcs");if(!host)return;
var box=document.createElement("div");box.className="card";box.id="gw-card";
box.style.cssText="padding:14px 18px;position:sticky;top:0;z-index:5";
box.innerHTML='<label class="f"><span>Peso del paciente (kg): se usa en todas las calculadoras</span><input id="gw" type="number" inputmode="decimal" step="any" placeholder="0"></label>';
host.parentNode.insertBefore(box,host);
var g=box.querySelector("input");
function targets(){var r=[];host.querySelectorAll("input[data-num],input[type=number]").forEach(function(i){var l=i.closest("label"),s=l&&l.querySelector("span"),t=s?s.textContent.trim():"";if(/^Peso( real)? \(kg\)|^(Actual w|W)eight \(kg\)/.test(t))r.push(i)});return r}
function sync(){var v=g.value;targets().forEach(function(i){var l=i.closest("label");if(l)l.hidden=true;if(i.value!==v){i.value=v;i.dispatchEvent(new Event("input",{bubbles:true}))}})}
g.addEventListener("input",sync);
new MutationObserver(function(){if(g.value)sync();else targets().forEach(function(i){var l=i.closest("label");if(l)l.hidden=true})}).observe(host,{childList:true,subtree:true});
sync();
var bw=document.getElementById("b-w");
if(bw){var fire=function(el){el.dispatchEvent(new Event("input",{bubbles:true}))};
 bw.addEventListener("input",function(){if(g.value!==bw.value){g.value=bw.value;fire(g)}});
 g.addEventListener("input",function(){if(bw.value!==g.value){bw.value=g.value;fire(bw)}});
 if(bw.value&&!g.value){g.value=bw.value;fire(g)}else if(g.value&&!bw.value){bw.value=g.value;fire(bw)}}
})();
});
;
window.addEventListener("load",function(){(function(){
var W="";try{W=JSON.parse(localStorage.getItem("arucip")||"{}").gw||""}catch(e){}
function ws(){var r=[];["gw","b-w","pv-w"].forEach(function(i){var e=document.getElementById(i);if(e)r.push(e)});
 document.querySelectorAll("#v-tool input[data-num],#v-tool input[type=number]").forEach(function(i){var l=i.closest("label"),s=l&&l.querySelector("span"),t=s?s.textContent.trim():"";if(/^Peso( real)?( \(kg\))?$|^Peso \(kg\)|^(Actual w|W)eight \(kg\)/.test(t))r.push(i)});return r}
function fire(e){e.dispatchEvent(new Event("input",{bubbles:true}))}
function setAll(v,src){W=v;try{var s=JSON.parse(localStorage.getItem("arucip")||"{}");s.gw=v;localStorage.setItem("arucip",JSON.stringify(s));try{st.gw=v}catch(x){}}catch(e){}
 ws().forEach(function(e){if(e!==src&&e.value!==v){e.value=v;fire(e)}})}
document.addEventListener("input",function(ev){var t=ev.target;if(!t||(t.type!=="number"&&!(t.hasAttribute&&t.hasAttribute("data-num"))))return;if(ws().indexOf(t)<0)return;if(ev.isTrusted)t.dataset.wt="1";if(t.value!==W)setAll(t.value,t)},true);
function prefill(){if(!W)return;ws().forEach(function(e){if(!e.value&&!e.dataset.wt){e.value=W;fire(e)}})}
var v=document.getElementById("v-tool");if(v)new MutationObserver(prefill).observe(v,{childList:true,subtree:true});
prefill()})()});
;
(function(){var t=document.querySelector(".tabs");function sync(){var a=t&&t.querySelector("button[aria-current=true]");document.body.dataset.v=a?(a.dataset.v==="triage"?"ck":a.dataset.v):"ck"}if(t){new MutationObserver(sync).observe(t,{attributes:true,subtree:true,attributeFilter:["aria-current"]});t.addEventListener("click",function(){setTimeout(sync,0)})}document.addEventListener("click",function(e){if(e.target.closest("[data-go]"))setTimeout(sync,30)});sync()})();
;
(function(){var c=document.getElementById("c-endo"),h=document.getElementById("calcs");if(c&&h)h.appendChild(c)})();
;

(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var VER="0.61";
function sget(k,d){try{var v=localStorage.getItem(k);return v==null?d:v}catch(e){return d}}
function sset(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function jget(k,d){try{return JSON.parse(sget(k,"")||"null")||d}catch(e){return d}}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function norm(s){s=String(s||"").toLowerCase();try{s=s.normalize("NFD").replace(/[̀-ͯ]/g,"")}catch(e){}return s}
var toastT;function toast(t){var e=$("#toast45");if(!e){e=document.createElement("div");e.id="toast45";e.setAttribute("role","status");document.body.appendChild(e)}e.textContent=t;e.className="on";clearTimeout(toastT);toastT=setTimeout(function(){e.className=""},2200)}
function copyText(tx,ok){var done=function(){toast(ok||"Copiado")};
 var fb=function(){try{var a=document.createElement("textarea");a.value=tx;a.setAttribute("readonly","");a.style.cssText="position:fixed;opacity:0;top:0";document.body.appendChild(a);a.select();a.setSelectionRange(0,99999);document.execCommand("copy");a.remove();done()}catch(e){toast("No se pudo copiar")}};
 try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(tx).then(done,fb)}else fb()}catch(e){fb()}}
function shareText(tx,title){try{if(navigator.share){navigator.share({title:title||"Arucip",text:tx}).catch(function(){});return}}catch(e){}copyText(tx,"Copiado: pegalo en WhatsApp o donde quieras")}
function curW(){var w=$("#gw");var v=w?parseFloat(w.value):NaN;return v>0?v:null}
function tidy(t){return String(t).replace(/ /g," ").replace(/[ \t]+\n/g,"\n").replace(/\n{2,}/g,"\n").trim()}
function resultText(title,node){var clone=node.cloneNode(true);$$("button,.shr,input,select,summary",clone).forEach(function(n){n.remove()});
 var lines=[];$$(".r",clone).forEach(function(r){var s=$("span",r),b=$("b",r);if(s&&b)lines.push(tidy(s.firstChild?s.firstChild.textContent:s.textContent)+": "+tidy(b.textContent))});
 var body=lines.length?lines.join("\n"):tidy(node.innerText||node.textContent);
 var w=curW();return "Arucip · "+title+(w?"\nPeso: "+String(w).replace(".",",")+" kg":"")+"\n"+body+"\n(Verificar siempre las dosis en la fuente original)"}

/* ---------- 1. tamaño del texto ---------- */
var FS=[100,112.5,125];
function applyFs(){var i=parseInt(sget("arucip-fs","0"),10);if(!(i>=0&&i<3))i=0;document.documentElement.style.fontSize=FS[i]+"%";$$("#fs-ctl button").forEach(function(b){b.setAttribute("aria-pressed",String(parseInt(b.dataset.i,10)===i))})}
applyFs();

/* ---------- 2. aviso inicial ---------- */
function ack(){if(sget("arucip-ack","")==="1")return;
 var o=document.createElement("div");o.id="ack45";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");
 o.innerHTML='<div class="ack-b"><h3>Antes de empezar</h3><p><b>Arucip</b> es una ayuda rápida para profesionales de cuidados intensivos pediátricos. No reemplaza el criterio clínico, los protocolos de tu servicio ni la lectura de la fuente original.</p><p>La información puede contener errores o estar desactualizada. <b>Verificá siempre las dosis</b> antes de indicarlas o prepararlas.</p><p class="ack-s">Equipo: Jorge Selandari, Eduardo Motto y Gonzalo G. Pereira.</p><button type="button" class="btn pri w" id="ack-ok">Entendido, continuar</button></div>';
 document.body.appendChild(o);$("#ack-ok").onclick=function(){sset("arucip-ack","1");o.remove()}}

/* ---------- 3. Más: ajustes y reportar ---------- */
function repSheet(ctx){var o=$("#rep45");if(o)o.remove();o=document.createElement("div");o.id="rep45";o.className="sheet45";
 o.innerHTML='<div class="sheet-b" role="dialog" aria-modal="true" aria-label="Reportar un error"><h3>Reportar un error o sugerencia</h3><p class="hint">Escribí qué viste y tocá «Enviar por correo»: se abre tu app de correo con el mensaje listo para el autor de la app. También podés compartirlo o copiarlo.</p><label class="f"><span>Sección</span><input id="rep-s" type="text" value="'+esc(ctx||"")+'"></label><label class="f"><span>¿Qué pasó o qué cambiarías?</span><textarea id="rep-t" rows="5" placeholder="Ej.: la dosis de … no coincide con …"></textarea></label><button type="button" class="btn pri w" id="rep-ml">Enviar por correo</button><p class="hint" style="margin:6px 0 0;word-break:break-all"><span>Correo del autor:</span> <span id="rep-ad"></span></p><div class="row2"><button type="button" class="btn g" id="rep-sh">Compartir</button><button type="button" class="btn g" id="rep-cp">Copiar</button></div><button type="button" class="btn w" id="rep-x">Cerrar</button></div>';
 document.body.appendChild(o);
 function msg(){return "Reporte Arucip v"+VER+"\nSección: "+$("#rep-s").value+"\n"+$("#rep-t").value+"\n("+(navigator.userAgent||"").slice(0,90)+")"}
 var AD=["gonzalogabrielpereira","gmail.com"].join("@");$("#rep-ad").textContent=AD;
 $("#rep-ml").onclick=function(){var sec=$("#rep-s").value;location.href="mailto:"+AD+"?subject="+encodeURIComponent("Reporte Arucip v"+VER+(sec?" · "+sec:""))+"&body="+encodeURIComponent(msg())};
 $("#rep-sh").onclick=function(){shareText(msg(),"Reporte Arucip")};$("#rep-cp").onclick=function(){copyText(msg())};
 $("#rep-x").onclick=function(){o.remove()};o.addEventListener("click",function(e){if(e.target===o)o.remove()})}
function moreCard(){var host=$("#v-more");if(!host||$("#aju45"))return;var c=document.createElement("div");c.className="card";c.id="aju45";
 c.innerHTML='<div class="calc"><h3 class="th" style="margin-top:0">Ajustes</h3><div class="row-fs"><span>Tamaño del texto</span><div id="fs-ctl" role="group" aria-label="Tamaño del texto"><button type="button" data-i="0" style="font-size:.8rem">A</button><button type="button" data-i="1" style="font-size:1rem">A</button><button type="button" data-i="2" style="font-size:1.25rem">A</button></div></div><button type="button" class="btn g w" id="rep-open">Reportar un error o sugerencia</button><button type="button" class="btn g w" id="share-app">Compartir Arucip</button></div>';
 host.appendChild(c);
 $$("#fs-ctl button",c).forEach(function(b){b.onclick=function(){sset("arucip-fs",b.dataset.i);applyFs()}});applyFs();
 $("#rep-open").onclick=function(){repSheet("Más / general")};
 $("#share-app").onclick=function(){shareText("Arucip: ayuda rápida para cuidados intensivos pediátricos (checklists, calculadoras, cards por peso, quemados y modo RCP). Verificá siempre las dosis.","Arucip")}}

/* ---------- 4. favoritos y recientes ---------- */
var curKey=null,curTitle="";
document.addEventListener("click",function(e){var a=e.target.closest?e.target.closest("[data-tool]"):null;if(!a)return;var k=a.dataset.tool;curKey=k;
 setTimeout(function(){var t=$("#tt");curTitle=t?t.textContent:"";if(!curTitle)return;var r=jget("arucip-rec",[]).filter(function(x){return x.k!==k});r.unshift({k:k,t:curTitle});sset("arucip-rec",JSON.stringify(r.slice(0,8)));favState();qaRender()},40)},true);
function favs(){return jget("arucip-fav",[])}
function isFav(k){return favs().some(function(x){return x.k===k})}
function favState(){var b=$("#fav-b");if(!b)return;var f=curKey&&isFav(curKey);b.setAttribute("aria-pressed",String(!!f));b.querySelector("span").textContent=f?"Quitar de favoritos":"Agregar a favoritos"}
function toolBar(){var h=$("#tt");if(!h||$("#tact45"))return;var d=document.createElement("div");d.id="tact45";d.className="tact";
 d.innerHTML='<button type="button" class="btn g bsm" id="fav-b" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.9z"/></svg><span>Agregar a favoritos</span></button><button type="button" class="btn g bsm" id="shr-t"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V4m0 0L8 8m4-4l4 4M5 13v6h14v-6"/></svg><span>Compartir</span></button>';
 h.insertAdjacentElement("afterend",d);
 $("#fav-b").onclick=function(){if(!curKey)return;var f=favs();if(isFav(curKey)){f=f.filter(function(x){return x.k!==curKey})}else{f.unshift({k:curKey,t:curTitle||$("#tt").textContent})}sset("arucip-fav",JSON.stringify(f.slice(0,30)));favState();qaRender();toast(isFav(curKey)?"Agregado a favoritos":"Quitado")};
 $("#shr-t").onclick=function(){shareText(resultText($("#tt").textContent,$("#tb")),$("#tt").textContent)};
 var foot=document.createElement("p");foot.className="tfoot";foot.innerHTML='Arucip · apoyo a la decisión, no reemplaza el criterio clínico. <a href="#" id="tf-rep">¿Encontraste un error?</a>';var tb=$("#tb");tb.insertAdjacentElement("afterend",foot);
 $("#tf-rep").onclick=function(e){e.preventDefault();repSheet("Herramienta: "+($("#tt").textContent||""))}}
var qaEd=false;
var SECS={ck:"Checklists",calc:"Cálculos",pocus:"POCUS",burn:"Quemados",tools:"Herramientas",bib:"Fórmulas y preparaciones",tips:"Notas prácticas"};
function secAnchor(k){return k.indexOf("cat:")===0?document.querySelector('#v-more a[data-cat="'+k.slice(4)+'"]'):document.querySelector('#v-more a[data-go="'+k.slice(3)+'"]:not([data-cat])')}
function secInfo(k){var a=secAnchor(k);return {t:a&&a.querySelector("b")?a.querySelector("b").textContent:(SECS[k.slice(3)]||k),d:a&&a.querySelector("small")?a.querySelector("small").textContent:""}}
function moreStars(){$$("#v-more [data-fav-go]").forEach(function(b){var on=isFav(b.dataset.favGo);b.setAttribute("aria-pressed",String(on));b.setAttribute("aria-label",(on?"Quitar de favoritos: ":"Agregar a favoritos: ")+secInfo(b.dataset.favGo).t)})}
var STAR='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.9z"/></svg>';
function qaRender(){var q=$("#qa45");moreStars();if(!q)return;var f=favs(),r=jget("arucip-rec",[]).filter(function(x){return !f.some(function(y){return y.k===x.k})}).slice(0,6);
 if(!f.length&&!r.length){qaEd=false;q.hidden=false;q.innerHTML='<div class="card"><div class="calc"><p class="hint" style="margin:0">Todavía no tenés favoritos. Tocá la estrella de cualquier apartado o herramienta para fijarlo acá.</p></div></div>';return}q.hidden=false;
 var chip=function(x){return '<a class="qa-chip" href="#" data-tool="'+esc(x.k)+'"><span>'+esc(x.t)+'</span></a>'};
 var head='<div class="qa-hd"><div class="qa-h">Fijados</div><button type="button" class="qa-ed" id="qa-ed" aria-pressed="'+(qaEd?"true":"false")+'">'+(qaEd?"Listo":"Editar")+'</button></div>';
 var card=function(x){var go=x.k.indexOf("go:")===0,ct=x.k.indexOf("cat:")===0,g=go?x.k.slice(3):(ct?"tools":""),i=(go||ct)?secInfo(x.k):{t:x.t,d:"Herramienta"};
  return '<div class="fv"><a class="lk off fv-a" href="#" '+((go||ct)?'data-go="'+esc(g)+'"'+(ct?' data-cat="'+esc(x.k.slice(4))+'"':""):'data-tool="'+esc(x.k)+'"')+'><div><b>'+esc(i.t)+'</b><small>'+esc(i.d)+'</small></div><span data-i="next"></span></a><button type="button" class="fv-un" data-un="'+esc(x.k)+'" aria-pressed="true" aria-label="Quitar de favoritos: '+esc(i.t)+'">'+STAR+'</button></div>'};
 if(!qaEd){q.innerHTML=head+(f.length?'<div class="fv-l">'+f.map(card).join("")+'</div>':'<p class="hint">Todavía no fijaste nada.</p>')+(r.length?'<div class="qa-sub">Recientes</div><div class="qa-row">'+r.map(chip).join("")+'</div>':"");iconsIn(q);return}
 var li=function(x,btns){return '<li class="qa-li"><span>'+esc(x.t)+'</span>'+btns+'</li>'};
 q.innerHTML=head+(f.length?'<ul class="qa-list">'+f.map(function(x,i){return li(x,'<button type="button" data-qa="up" data-i="'+i+'" aria-label="Subir"'+(i?"":" disabled")+'>↑</button><button type="button" data-qa="down" data-i="'+i+'" aria-label="Bajar"'+(i<f.length-1?"":" disabled")+'>↓</button><button type="button" data-qa="del" data-i="'+i+'" aria-label="Quitar de favoritos">✕</button>')}).join("")+'</ul>':"")
  +(r.length?'<div class="qa-sub">Recientes</div><ul class="qa-list">'+r.map(function(x){return li(x,'<button type="button" data-qa="pin" data-k="'+esc(x.k)+'" aria-label="Fijar en favoritos">☆</button>')}).join("")+'</ul>':"")}
function iconsIn(root){$$("[data-i]",root).forEach(function(s){if(!s.firstChild)s.innerHTML=ic(s.dataset.i)})}
document.addEventListener("click",function(e){var s=e.target.closest?e.target.closest("[data-fav-go],[data-un]"):null;if(!s)return;e.preventDefault();e.stopPropagation();
 var k=s.dataset.favGo||s.dataset.un,f=favs();
 if(isFav(k)){f=f.filter(function(x){return x.k!==k});toast("Quitado de favoritos")}else{f.push({k:k,t:s.dataset.favGo?secInfo(k).t:k});toast("Fijado en favoritos")}
 sset("arucip-fav",JSON.stringify(f.slice(0,30)));favState();qaRender()},true);
if(!sget("arucip-fav-init","")){sset("arucip-fav-init","1");var f0=favs();if(!isFav("go:burn")){f0.unshift({k:"go:burn",t:"Quemados"});sset("arucip-fav",JSON.stringify(f0))}}
$$("#v-more a.lk[data-go]").forEach(function(a){var g=a.dataset.go;if(!a.dataset.cat&&!SECS[g])return;var b=document.createElement("button");b.type="button";b.className="fav-s";b.dataset.favGo=a.dataset.cat?"cat:"+a.dataset.cat:"go:"+g;b.innerHTML=STAR;var w=document.createElement("div");w.className="fv";a.parentNode.insertBefore(w,a);w.appendChild(a);w.appendChild(b);a.classList.add("fv-a")});
document.addEventListener("click",function(e){var b=e.target.closest?e.target.closest("#qa45 button"):null;if(!b)return;
 if(b.id==="qa-ed"){qaEd=!qaEd;qaRender();var n=$("#qa-ed");if(n)n.focus();return}
 var a=b.dataset.qa;if(!a||b.disabled)return;var f=favs(),i=parseInt(b.dataset.i,10),foc=null;
 if(a==="up"&&i>0){var t=f[i-1];f[i-1]=f[i];f[i]=t;foc='[data-qa="up"][data-i="'+(i-1)+'"]'}
 else if(a==="down"&&i<f.length-1){var t2=f[i+1];f[i+1]=f[i];f[i]=t2;foc='[data-qa="down"][data-i="'+(i+1)+'"]'}
 else if(a==="del"){f.splice(i,1)}
 else if(a==="pin"){var k=b.dataset.k,x=jget("arucip-rec",[]).filter(function(y){return y.k===k})[0];if(x&&!isFav(k)){f.unshift({k:x.k,t:x.t})}}
 else return;
 sset("arucip-fav",JSON.stringify(f.slice(0,30)));favState();qaRender();
 if(foc){var nb=$("#qa45 "+foc);if(nb)nb.focus()}else{var eb=$("#qa-ed");if(eb)eb.focus()}});

/* ---------- 5. buscador global ---------- */
var IDX=null;
function build(){IDX=[];
 [["#cks > details:not(#d-tr65)","ck","Checklist"],["#calcs details.card","calc","Calculadora"],["#pc details","pocus","POCUS"],["#bl details","bib","Fórmulas"],["#tpl details","tips","Notas prácticas"],["#v-burn details","burn","Quemados"]].forEach(function(g){$$(g[0]).forEach(function(d){var b=$("summary b",d);if(!b)return;IDX.push({l:b.textContent.trim(),k:g[2],tab:g[1],el:d,n:norm(b.textContent),h:norm(d.textContent).slice(0,6000)})})});
 $$("#tl a[data-tool], #calcs a[data-tool]").forEach(function(a){var b=$("b",a);if(!b)return;IDX.push({l:b.textContent.trim(),k:"Herramienta",tool:true,el:a,n:norm(b.textContent),h:norm(a.textContent)})})}
function reveal(it){var s=$("#gs-q");if(s){s.value="";$("#gs-r").innerHTML=""}
 if(it.tool){it.el.click();return}
 if(it.tab==="bib"||it.tab==="tips"){var g=$('a[data-go="'+it.tab+'"]');if(g)g.click()}else{window.ARUCIP_GO(it.tab)}
 setTimeout(function(){it.el.open=true;try{it.el.scrollIntoView({behavior:"smooth",block:"start"})}catch(e){it.el.scrollIntoView()}},80)}
function runSearch(){var q=norm($("#gs-q").value.trim()),out=$("#gs-r");if(q.length<2){out.innerHTML="";return}
 if(!IDX)build();var ws=q.split(/\s+/);var m=[];IDX.forEach(function(it){var inL=ws.every(function(w){return it.n.indexOf(w)>=0}),inH=!inL&&ws.every(function(w){return it.h.indexOf(w)>=0});if(inL||inH)m.push({it:it,s:inL?0:1})});
 m.sort(function(a,b){return a.s-b.s});m=m.slice(0,10);
 out.innerHTML=m.length?'<ul class="gs-l">'+m.map(function(x,i){return '<li><button type="button" data-i="'+i+'"><b>'+esc(x.it.l)+'</b><small>'+x.it.k+(x.s?" · en el contenido":"")+'</small></button></li>'}).join("")+'</ul>':'<p class="gs-n">Sin resultados para «'+esc($("#gs-q").value.trim())+'».</p>';
 $$("button",out).forEach(function(b){b.onclick=function(){reveal(m[parseInt(b.dataset.i,10)].it)}})}
function gsInit(){var cks=$("#cks");if(!cks||$("#gs45"))return;var w=document.createElement("div");w.id="gs45";
 w.innerHTML='<div class="gs"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input id="gs-q" type="search" placeholder="Buscar en toda la app (ej.: ketamina, intubación)" autocomplete="off" enterkeyhint="search" aria-label="Buscar en toda la app"></div><div id="gs-r" aria-live="polite"></div>';
 var tt=document.getElementById("tri-top");if(tt)tt.appendChild(w);else cks.parentNode.insertBefore(w,cks);$("#gs-q").addEventListener("input",runSearch);$("#gs-q").addEventListener("focus",function(){if(!IDX)build()});qaRender()}

/* ---------- 6. peso estimado por edad ---------- */
function ageCard(){var host=$("#calcs");if(!host||$("#c-age"))return;var first=$("#c-sed")||$("#calcs details.card");
 var ic=$("#c-sed .ic")?$("#c-sed .ic").innerHTML:"";var chev=$("#c-sed .chev")?$("#c-sed .chev").outerHTML:"";
 var d=document.createElement("details");d.className="card";d.id="c-age";
 d.innerHTML='<summary><div class="sh"><span class="ic">'+ic+'</span><b>Peso estimado por edad</b>'+chev+'</div></summary><div class="calc"><p class="hint" style="margin-top:0">Para cuando no hay balanza ni cinta de longitud. Es una estimación: pesá al paciente apenas sea posible.</p><div class="row2"><label class="f"><span>Edad</span><input id="ag-v" type="number" inputmode="decimal" step="any" placeholder="0"></label><label class="f"><span>Unidad</span><select id="ag-u"><option value="m">Meses</option><option value="a" selected>Años</option></select></label></div><div class="r"><span>Peso estimado<small id="ag-f"></small></span><b id="ag-o">—</b></div><button type="button" class="btn g w" id="ag-use" disabled>Usar este peso en las calculadoras</button><p class="hint">Fórmulas APLS: menores de 1 año, 0,5 × meses + 4; de 1 a 5 años, 2 × años + 8; de 6 a 12 años, 3 × años + 7. Contrastar con la fuente original.</p></div>';
 host.insertBefore(d,first);
 var est=null;function calc(){var v=parseFloat($("#ag-v").value),u=$("#ag-u").value;est=null;var f="",o="—";
  if(v>=0){var mo=u==="m"?v:v*12;if(mo>144){f="La fórmula llega hasta los 12 años";o="—"}
   else if(mo<12){est=.5*mo+4;f="0,5 × meses + 4"}
   else{var a=mo/12;if(a<=5){est=2*a+8;f="2 × años + 8"}else{est=3*a+7;f="3 × años + 7"}}
   if(est!=null){est=Math.round(est*10)/10;o=String(est).replace(".",",")+" kg"}}
  $("#ag-f").textContent=f;$("#ag-o").textContent=o;$("#ag-use").disabled=est==null}
 $("#ag-v").addEventListener("input",calc);$("#ag-u").addEventListener("change",calc);
 $("#ag-use").onclick=function(){var g=$("#gw");if(g&&est!=null){g.value=String(est);g.dispatchEvent(new Event("input",{bubbles:true}));toast("Peso cargado: "+String(est).replace(".",",")+" kg")}}}

/* ---------- 7. compartir en calculadoras ---------- */
function calcShare(){$$("#calcs details.card").forEach(function(d){if(d.id==="c-age"||$(".shr",d))return;var c=$(".calc",d);if(!c)return;var b=document.createElement("button");b.type="button";b.className="btn g bsm shr";b.textContent="Compartir resultado";
 b.onclick=function(){var t=$("summary b",d);shareText(resultText(t?t.textContent:"Calculadora",c),t?t.textContent:"")};c.appendChild(b)})}

/* ---------- 8. orden de checklists por uso ---------- */
function freq(){return jget("arucip-frq",{})}
document.addEventListener("toggle",function(e){var d=e.target;if(!d||!d.open||!d.parentNode||d.parentNode.id!=="cks")return;var f=freq();f[d.id]=(f[d.id]||0)+1;sset("arucip-frq",JSON.stringify(f))},true);
function reorder(){var c=$("#cks");if(!c)return;var f=freq(),k=Array.prototype.slice.call(c.children);var orig=k.slice();
 var sorted=orig.map(function(el,i){return {el:el,i:i,n:f[el.id]||0}}).sort(function(a,b){return (b.n>=2?b.n:0)-(a.n>=2?a.n:0)||a.i-b.i});
 sorted.forEach(function(x){c.appendChild(x.el)})}

/* ---------- init ---------- */
function init(){try{moreCard()}catch(e){}try{toolBar()}catch(e){}try{gsInit()}catch(e){}try{ageCard()}catch(e){}try{calcShare()}catch(e){}try{reorder()}catch(e){}try{ack()}catch(e){}}
if(document.readyState==="complete")init();else window.addEventListener("load",init);
})();


;

/* v0.17: herramientas que requieren internet + peso del paciente visible y «Nuevo paciente» */
(function(){
var EXT=["ccvs","ecmorisk","antro","pivt","vade","urea","iar1","simu","ialado","bienestar","mindf","salud","violencia","hiv","collapse"];
var GLOBE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/></svg>';
function badges(){var tl=document.getElementById("tl");if(!tl)return;
 Array.prototype.forEach.call(tl.querySelectorAll("a[data-tool],a.lk[href^='http']"),function(a){var ex=a.dataset.tool?EXT.indexOf(a.dataset.tool)>=0:true;if(!ex||a.querySelector(".netb"))return;
  var d=a.querySelector("div");if(!d)return;var e=document.createElement("span");e.className="netb";e.innerHTML=GLOBE+"<span>Requiere internet</span>";d.appendChild(e);
  var p=a.parentNode;if(p)p.appendChild(a)})}
function getW(){try{return JSON.parse(localStorage.getItem("arucip")||"{}").gw||""}catch(e){return ""}}
var RX=/^Peso( real)?( \(kg\))?$|^Peso \(kg\)|^(Actual w|W)eight \(kg\)/;
function toolHasW(){return Array.prototype.some.call(document.querySelectorAll("#tb input[data-num],#tb input[type=number]"),function(i){var l=i.closest("label"),s=l&&l.querySelector("span");return !!s&&RX.test(s.textContent.trim())})}
function clearW(){var g=document.getElementById("gw");
 if(g){g.value="";g.dispatchEvent(new Event("input",{bubbles:true}))}
 else{try{var s=JSON.parse(localStorage.getItem("arucip")||"{}");s.gw="";localStorage.setItem("arucip",JSON.stringify(s))}catch(e){}}
 Array.prototype.forEach.call(document.querySelectorAll("#tb input[data-num],#tb input[type=number]"),function(i){var l=i.closest("label"),s=l&&l.querySelector("span");if(s&&RX.test(s.textContent.trim())&&i.value!==""){i.value="";delete i.dataset.wt;i.dispatchEvent(new Event("input",{bubbles:true}))}});
 setTimeout(upd,30)}
function upd(){var tb=document.getElementById("tb");if(!tb)return;var bar=document.getElementById("wbar"),w=getW(),show=!!w&&toolHasW();
 if(!bar){bar=document.createElement("div");bar.id="wbar";bar.setAttribute("role","status");bar.innerHTML='<span><span>Peso del paciente cargado</span>: <b id="wbar-v"></b></span><button type="button" id="wbar-x">Nuevo paciente</button>';tb.parentNode.insertBefore(bar,tb);document.getElementById("wbar-x").onclick=clearW}
 bar.hidden=!show;var v=document.getElementById("wbar-v");var en=/^en/.test(document.documentElement.lang||"");var t=w?(en?String(w).replace(",","."):String(w).replace(".",","))+" kg":"";if(v.textContent!==t)v.textContent=t;
 var gc=document.getElementById("gw-card");if(gc){var nb=gc.querySelector(".gw-new");if(!nb){nb=document.createElement("button");nb.type="button";nb.className="gw-new";nb.textContent="Nuevo paciente";nb.onclick=clearW;gc.appendChild(nb)}nb.hidden=!w}}
function init(){badges();upd();
 document.addEventListener("input",function(){setTimeout(upd,0)});
 document.addEventListener("click",function(){setTimeout(upd,80);setTimeout(upd,450)},true)}
if(document.readyState==="complete")setTimeout(init,30);else window.addEventListener("load",function(){setTimeout(init,30)});
})();

;

if("serviceWorker" in navigator&&(location.protocol==="https:"||location.hostname==="localhost")){window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){})})}

;
/* Portada de Arucip: se muestra al abrir la app (una vez por sesión) y al tocar el logo del encabezado. */
(function(){
var c=document.getElementById("cover");if(!c)return;
var KEY="arucip-cover";
function seen(){try{return sessionStorage.getItem(KEY)==="1"}catch(e){return false}}
function mark(){try{sessionStorage.setItem(KEY,"1")}catch(e){}}
function open(){c.hidden=false;void c.offsetWidth;c.classList.remove("out");document.documentElement.style.overflow="hidden";
 var b=document.getElementById("cv-go");try{b&&b.focus({preventScroll:true})}catch(e){}}
function close(){mark();c.classList.add("out");document.documentElement.style.overflow="";
 setTimeout(function(){c.hidden=true},380)}
document.getElementById("cv-go").addEventListener("click",close);
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!c.hidden)close()});
var m=document.querySelector(".ph-mark");if(m){m.setAttribute("role","button");m.setAttribute("tabindex","0");m.setAttribute("aria-label","Portada");
 m.addEventListener("click",open);m.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();open()}})}
var tm=document.getElementById("cv-team");if(tm&&window.ARUCIP_CRED)tm.innerHTML=window.ARUCIP_CRED();
if(!seen())open();
})();

;
/* Arucip · buscador predictivo.
   Dos usos:
   - portada: busca en toda la app (motivos de ingreso, aparatos, signos y síntomas, herramientas, checklists,
     calculadoras, POCUS y quemados);
   - «Motivos de ingreso»: solo aparatos, aspectos, signos, síntomas y motivos.
   Tolera acentos y un error de tipeo. Teclado: ↑ ↓ Enter Esc. */
(function () {
  var D = window.ARUCIP_DATA;
  if (!D) return;
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var nz = function (s) { return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); };
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };
  var SEARCH_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';

  /* Siglas y nombres alternativos de los motivos (⚕ a revisar por el servicio). Coincidencia exacta de sigla = primer resultado. */
  var ACR = { shs: "shock septico", ic: "icc ic falla cardiaca", mio: "miocarditis", cch: "cc cardiopatia congenita", pcv: "pop cec posoperatorio cardiaco", arr: "tsv tv fv arritmia", hp: "hp hpp crisis hipertension pulmonar", tap: "taponamiento", hta: "crisis hipertensiva", ana: "shock anafilactico", pcr: "pcr paro rcp posparo", kaw: "pims misc mis-c kawasaki", bro: "bva irab bronquiolitis", asm: "asma status asmatico", neu: "nac neumonia empiema", sdr: "sdra pards ards", ira: "ira iresp", vaa: "crup laringitis epiglotitis", pnt: "neumotorax hemotorax", tos: "coqueluche pertussis", fex: "vad via aerea dificil", trq: "tqt traqueostomia", epc: "fq dbp fibrosis quistica displasia", sep: "sepsis", men: "meningitis meningoencefalitis", pbl: "sts fascitis shock toxico", inm: "nf neutropenia febril", cat: "iacs clabsi bacteriemia", end: "dengue hantavirus", ee: "ee status epileptico", tec: "tec tce tceg tcec traumatismo trauma encefalocraneano encefalo craneano craneoencefalico traumatismo-encefalo-craneano", hte: "hic pic hipertension endocraneana coma", acv: "acv hsa stroke", hid: "dvp dve valvula", nqx: "nqx neuroquirurgico", gbs: "gbs guillain", hie: "hie posparo", me: "mbcn muerte encefalica", del: "delirium", pol: "politrauma", tto: "trauma toracico abdominal", trm: "raquimedular", que: "quemado quemadura", inh: "humo co cianuro", aho: "ahogamiento sumersion", gol: "golpe calor hipotermia electrocucion", ani: "ofidio alacran arana mordedura picadura", mal: "maltrato abuso", cad: "cad dka cetoacidosis", ehh: "hhs hiperosmolar", hip: "hipoglucemia", ecm: "eim ecm error congenito metabolismo", sup: "suprarrenal addison", nat: "hiponatremia hipernatremia", lra: "lra aki falla renal", suh: "suh shu hus", hk: "hiperkalemia hiperpotasemia", nef: "nefrotico", rab: "rabdomiolisis", fha: "fha falla hepatica", hda: "hda sangrado digestivo", abd: "abdomen agudo", pan: "pancreatitis", nec: "nec enterocolitis", des: "desnutricion realimentacion", nut: "np nutricion parenteral enteral", lis: "lisis tumoral", mas: "mediastino", cid: "cid coagulopatia", ane: "drepanocitica anemia", hlh: "hlh hemofagocitico", tph: "tmo trasplante medula", tmd: "intox intoxicacion", tcc: "caustico hidrocarburo", tco: "co monoxido", top: "opp organofosforado plaguicida", tal: "alcohol opioide drogas", pmy: "cirugia mayor", ptx: "trasplante", pvo: "orl via aerea quirurgica", dep: "tqt dependencia tecnologica", pal: "paliativos", apn: "apnea alte bruen", det: "pews alerta temprana deterioro", trs: "traslado" };
  var IDX = null;
  function gname(id) { return D.GROUPS.filter(function (g) { return g.id === id; })[0]; }
  function H() { return window.ARUCIP_HUBS || {}; }

  function build() {
    var motivos = [], todo = [];
    var sym = {};
    Object.keys(D.SYMP || {}).forEach(function (s) { D.SYMP[s].forEach(function (id) { (sym[id] = sym[id] || []).push(s); }); });
    D.CASES.forEach(function (c) {
      var gs = c.g.map(function (i) { return gname(i).n; });
      motivos.push({ k: "Motivo de ingreso", l: c.n, sub: gs.join(" · "), h: nz(c.n), kw: nz((sym[c.id] || []).join(" ") + " " + gs.join(" ") + " " + c.g.map(function (g) { return (D.ALIAS || {})[g] || ""; }).join(" ")), r: c.top ? 0.5 : 0,
        syms: sym[c.id] || [], ac: nz(ACR[c.id] || ""), go: function () { H().openCase(c.id); } });
    });
    D.GROUPS.forEach(function (g) {
      var n = D.CASES.filter(function (c) { return c.g.indexOf(g.id) >= 0; }).length;
      motivos.push({ k: "Aparato o aspecto", l: g.n, sub: n + " motivos", h: nz(g.n), kw: nz(g.d + " " + ((D.ALIAS || {})[g.id] || "")), r: 1, syms: [], go: function () { H().openGroup(g.id); } });
    });
    D.SYS.forEach(function (s) {
      motivos.push({ k: "Aparato o sistema", l: s.n, sub: "Herramientas y escalas", h: nz(s.n), kw: nz(s.d || ""), r: 0, syms: [], go: function () { H().openSys(s.id); } });
    });
    Object.keys(D.SYMP || {}).forEach(function (s) {
      motivos.push({ k: "Signo o síntoma", l: s, sub: D.SYMP[s].length + " motivos relacionados", h: nz(s), kw: nz((D.SYMP_SYN || {})[s] || ""), r: 2, syms: [], go: function () { H().openSymptom(s); } });
    });
    todo = motivos.slice();
    /* secciones de la app */
    var tab = function (v) { return function () { var tb = document.querySelector('.tabs button[data-v="' + v + '"]'); if (tb) tb.click(); }; };
    var cat = function (c) { return function () { var a = document.querySelector('#v-more a[data-cat="' + c + '"]'); var tb = document.querySelector('.tabs button[data-v="more"]'); if (tb) tb.click(); if (a) a.click(); }; };
    [["Emergencias", "Sección", "", "emergencia emergencias triage abc valoracion inicial", tab("triage")],
     ["PARO: iniciar RCP", "Emergencias", "", "paro rcp reanimacion cardiopulmonar compresiones metronomo", function () { var p = document.getElementById("paro"); if (p) p.click(); }],
     ["Secuencia PALS", "Emergencias", "", "pals reanimacion pediatrica algoritmos", function () { var a = document.querySelector('[data-tool="pals"]'); if (a) a.click(); }],
     ["Cards: medicación por peso", "Emergencias", "", "cards tarjetas medicacion peso dosis", function () { if (window.ARUCIP_GO) window.ARUCIP_GO("cards"); }],
     ["Indicaciones y cálculos", "Sección", "día a día", "balance balances hidrico indicaciones diarias estudios complementarios periodicidad laboratorio que pedir cuando calculos nutricion infusiones", tab("ind")],
     ["Motivos de ingreso", "Sección", "por aspecto", "ingreso casos motivos aparatos sistemas", tab("casos")],
     ["Favoritos", "Sección", "uso frecuente", "favoritos fijados uso frecuente recientes", tab("fav")],
     ["Autocuidado", "Más", "", "burnout bienestar mindfulness salud violencia laboral", cat("Autocuidado")],
     ["Calidad y seguridad", "Más", "", "calidad seguridad paciente normas eventos adversos reporte", cat("Seguridad y Calidad")],
     ["IA herramientas y recursos", "Más", "", "inteligencia artificial ia iar1 recursos", cat("IA herramientas y recursos")]
    ].forEach(function (x) { todo.push({ k: x[1], l: x[0], sub: x[2], h: nz(x[0]), kw: nz(x[3]), r: 1.5, syms: [], go: x[4] }); });
    /* herramientas y escalas */
    var seen = {};
    $$("#tl [data-tool]").forEach(function (a) {
      var b = a.querySelector("b"), k = a.getAttribute("data-tool");
      if (!b || seen[k]) return; seen[k] = 1;
      var det = a.closest("details"), cat = det && det.querySelector("summary b") ? det.querySelector("summary b").textContent.trim() : "Herramienta";
      todo.push({ k: "Herramienta", l: b.textContent.trim(), sub: cat, h: nz(b.textContent), kw: nz(cat + " " + k + " " + ((typeof SYN !== "undefined" && SYN[k]) || "")), r: -0.5, syms: [], go: function () { var el = document.querySelector('[data-tool="' + k + '"]'); if (el) el.click(); } });
    });
    [["#cks > details", "ck", "Checklist"], ["#calcs > details", "calc", "Calculadora"], ["#pc > details", "pocus", "POCUS"], ["#v-burn details", "burn", "Quemados"]].forEach(function (g) {
      $$(g[0]).forEach(function (d) {
        var b = d.querySelector("summary b"); if (!b || !d.id) return;
        todo.push({ k: g[2], l: b.textContent.trim(), sub: g[2], h: nz(b.textContent), kw: "", r: -0.5, syms: [], go: function () { if (window.ARUCIP_GO) window.ARUCIP_GO(g[1], d.id); } });
      });
    });
    IDX = { motivos: motivos, todo: todo };
  }

  function near(a, b) { /* distancia de edición ≤ 1 */
    if (Math.abs(a.length - b.length) > 1) return false;
    var i = 0, j = 0, d = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++d > 1) return false;
      if (a.length > b.length) i++; else if (a.length < b.length) j++; else { i++; j++; }
    }
    return d + (a.length - i) + (b.length - j) <= 1;
  }
  function score(e, toks) {
    var s = 0, words = e.h.split(/[^a-z0-9]+/);
    for (var i = 0; i < toks.length; i++) {
      var t = toks[i], ok = 0;
      if (e.ac && e.ac.split(/[^a-z0-9]+/).indexOf(t) >= 0) ok = 9;
      else if (e.ac && t.length >= 3 && e.ac.split(/[^a-z0-9]+/).some(function (w) { return w.indexOf(t) === 0; })) ok = 3;
      else if (e.h.indexOf(t) === 0) ok = 6;
      else if (words.some(function (w) { return w.indexOf(t) === 0; })) ok = 4;
      else if (t.length >= 4 && e.h.indexOf(t) >= 0) ok = 2;
      else if (e.kw && e.kw.split(/[^a-z0-9]+/).some(function (w) { return w.indexOf(t) === 0; })) ok = 1.5;
      else if (t.length >= 4 && words.some(function (w) { return w.length >= 4 && (near(w, t) || (t.length >= 6 && near(w.slice(0, t.length), t))); })) ok = 1;
      else if (t.length >= 6 && e.kw && e.kw.split(/[^a-z0-9]+/).some(function (w) { return w.length >= 6 && (near(w, t) || near(w.slice(0, t.length), t)); })) ok = 0.8;
      if (!ok) return 0;
      s += ok;
    }
    return s + (e.r || 0);
  }
  function hl(label, toks) {
    var n = nz(label), mark = new Array(label.length).fill(false);
    toks.forEach(function (t) { var i = n.indexOf(t); if (i >= 0) for (var k = i; k < i + t.length; k++) mark[k] = true; });
    var out = "", open = false;
    for (var i = 0; i < label.length; i++) {
      if (mark[i] && !open) { out += "<mark>"; open = true; }
      if (!mark[i] && open) { out += "</mark>"; open = false; }
      out += esc(label[i]);
    }
    return out + (open ? "</mark>" : "");
  }
  function run(q, scope) {
    if (!IDX) build();
    var toks = nz(q).trim().split(/\s+/).filter(Boolean);
    if (!toks.length) return { toks: toks, res: [] };
    var list = scope === "all" ? IDX.todo : IDX.motivos, out = [];
    list.forEach(function (e) { var s = score(e, toks); if (s > 0) out.push({ e: e, s: s }); });
    out.sort(function (a, b) { return b.s - a.s || a.e.l.length - b.e.l.length; });
    return { toks: toks, res: out.slice(0, 8) };
  }

  function mount(host, opt) {
    opt = opt || {};
    var id = "ps-" + Math.random().toString(36).slice(2, 7);
    host.innerHTML = '<div class="ps"><div class="ps-in">' + SEARCH_SVG + '<input id="' + id + '" type="search" role="combobox" aria-expanded="false" aria-controls="' + id + '-l" aria-autocomplete="list" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" placeholder="' + esc(opt.placeholder || "Buscar") + '" aria-label="' + esc(opt.placeholder || "Buscar") + '"></div><ul class="ps-r" id="' + id + '-l" role="listbox" hidden></ul></div>';
    var inp = host.querySelector("input"), ul = host.querySelector("ul"), cur = [], act = -1;
    function close() { ul.hidden = true; inp.setAttribute("aria-expanded", "false"); act = -1; }
    function paint() {
      var r = run(inp.value, opt.scope);
      cur = r.res;
      if (!inp.value.trim()) { close(); return; }
      if (!cur.length) { ul.innerHTML = '<li class="ps-no" role="option" aria-disabled="true">Sin resultados. Probá con otra palabra.</li>'; ul.hidden = false; inp.setAttribute("aria-expanded", "true"); return; }
      ul.innerHTML = cur.map(function (x, i) {
        var via = "";
        if (x.e.syms && x.e.syms.length) {
          var m = x.e.syms.filter(function (s) { var n = nz(s); return r.toks.some(function (t) { return n.indexOf(t) >= 0; }); })[0];
          if (m && nz(x.e.l).indexOf(r.toks[0]) < 0) via = " · por " + esc(m.toLowerCase());
        }
        return '<li role="option" id="' + id + '-o' + i + '" data-i="' + i + '"><span class="ps-t">' + hl(x.e.l, r.toks) + '</span><small>' + esc(x.e.k) + (x.e.sub && x.e.sub !== x.e.k ? " · " + esc(x.e.sub) : "") + via + "</small></li>";
      }).join("");
      ul.hidden = false; inp.setAttribute("aria-expanded", "true"); setAct(0);
    }
    function setAct(i) {
      act = i;
      $$("li", ul).forEach(function (li, k) { li.setAttribute("aria-selected", k === i ? "true" : "false"); });
      if (i >= 0) { inp.setAttribute("aria-activedescendant", id + "-o" + i); var el = ul.children[i]; if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" }); }
    }
    function pick(i) {
      var x = cur[i]; if (!x) return;
      close(); inp.blur();
      var go = function () { x.e.go(); };
      if (opt.before) opt.before(go); else go();
    }
    inp.addEventListener("input", paint);
    inp.addEventListener("focus", function () { if (inp.value.trim()) paint(); });
    inp.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); if (ul.hidden) paint(); else setAct(Math.min(cur.length - 1, act + 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setAct(Math.max(0, act - 1)); }
      else if (e.key === "Enter") { e.preventDefault(); if (cur.length) pick(act < 0 ? 0 : act); }
      else if (e.key === "Escape") { if (!ul.hidden) { e.stopPropagation(); close(); } else inp.value = ""; }
    });
    ul.addEventListener("pointerdown", function (e) { var li = e.target.closest("li[data-i]"); if (li) { e.preventDefault(); pick(parseInt(li.getAttribute("data-i"), 10)); } });
    document.addEventListener("pointerdown", function (e) { if (!host.contains(e.target)) close(); });
    return { input: inp, close: close };
  }

  window.ARUCIP_SEARCH = { mount: mount, run: run };
})();

;
/* Arucip · secciones de acceso rápido: Triage (ABC), Sistemas y Casos (motivos de ingreso).
   Solo arma pantallas con enlaces a lo que la app ya tiene (herramientas, checklists, calculadoras, POCUS,
   quemados y cards). Los datos están en js/data.js. */
(function () {
  var D = window.ARUCIP_DATA;
  if (!D) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); };
  var nz = function (s) { return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); };

  /* ---------- Íconos (trazo, 24×24) ---------- */
  var IC = {
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.500 2-1.500-1.500-2.700-2-4.500-2A5.500 5.500 0 0 0 2 8.500c0 2.300 1.500 4 3 5.500l7 7Z"/>',
    wind: '<path d="M17.700 7.700a2.500 2.500 0 1 1 1.800 4.300H2"/><path d="M9.600 4.600A2 2 0 1 1 11 8H2"/><path d="M12.600 19.400A2 2 0 1 0 14 16H2"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    pill: '<path d="m10.500 20.500 10-10a4.950 4.950 0 1 0-7-7l-10 10a4.950 4.950 0 1 0 7 7Z"/><path d="m8.500 8.500 7 7"/>',
    drop: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.900-3-5.500s-3.500-4-4-6.500c-.5 2.500-2 4.900-4 6.500C6 11.100 5 13 5 15a7 7 0 0 0 7 7z"/>',
    thermo: '<path d="M14 4v10.540a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>',
    utensils: '<path d="M3 2v7c0 1.100.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.100.9 2 2 2h3Zm0 0v7"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    flask: '<path d="M10 2v7.300"/><path d="M14 9.300V2"/><path d="M8.500 2h7"/><path d="M14 9.300a6.500 6.500 0 1 1-4 0"/><path d="M5.500 16h13"/>',
    alert: '<path d="m21.700 18-8-14a2 2 0 0 0-3.500 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.700-3Z"/><path d="M12 9v4M12 17h.01"/>',
    clip: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 12h6M9 16h4"/>',
    home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    pulse: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.9z"/>',
    sys: '<circle cx="12" cy="4.500" r="2.500"/><path d="M12 8v6M6.500 10.500 12 12l5.500-1.500M9 21l3-7 3 7"/>',
    flame: '<path d="M12 2.600C12.500 5.300 15.100 6.900 16.800 9.300c1.500 2.100 1.900 4.300 1.100 6.500C17 18.700 14.800 20.600 12 20.600c-3.300 0-5.800-2.300-5.800-5.500 0-2.200 1-3.800 2.500-5.400.3 1.400 1 2.300 2 2.800-.4-3.200.2-7 1.300-9.900Z"/>',
    card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/>',
    more: '<circle cx="5" cy="12" r="1.500"/><circle cx="12" cy="12" r="1.500"/><circle cx="19" cy="12" r="1.500"/>'
  };
  var svg = function (n) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[n] || IC.clip) + "</svg>";
  };
  var CHEV = '<svg class="hl-c" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
  window.ARUCIP_ICONS = { svg: svg };

  /* ---------- Enlaces a lo que ya existe ---------- */
  var TYPE = { t: "Herramienta", k: "Checklist", c: "Calculadora", p: "POCUS", b: "Quemados", x: "Acceso" };
  var SECTION = { t: "Herramientas y escalas", k: "Checklists", c: "Calculadoras", p: "POCUS", b: "Quemados", x: "Otros accesos" };
  function toolTitle(k) {
    var b = document.querySelector('#tl [data-tool="' + k + '"] b') || document.querySelector('[data-tool="' + k + '"] b');
    return b ? b.textContent.trim() : (((D.LBL || {}).t || {})[k] || k);
  }
  function label(ref) {
    var p = ref.split(":"), t = p[0], id = p[1];
    return t === "t" ? toolTitle(id) : ((D.LBL[t] || {})[id] || id);
  }
  function attrs(ref) {
    var p = ref.split(":"), t = p[0], id = p[1];
    if (t === "t") return 'data-tool="' + id + '"';
    if (t === "k") return 'data-go="ck" data-open="d-' + id + '"';
    if (t === "c") return 'data-go="calc" data-open="c-' + id + '"';
    if (t === "p") return 'data-go="pocus" data-open="pc-' + id + '"';
    if (t === "b") return 'data-go="burn" data-open="b-' + id + '"';
    return 'data-go="' + id + '"';
  }
  function link(ref) {
    return '<a class="hl" href="#" ' + attrs(ref) + '><span class="hl-t"><b>' + esc(label(ref)) + "</b><small>" + TYPE[ref[0]] + "</small></span>" + CHEV + "</a>";
  }
  function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }
  function sections(refs) {
    var out = "";
    ["k", "c", "t", "p", "b", "x"].forEach(function (t) {
      var l = uniq(refs).filter(function (r) { return r[0] === t; });
      if (l.length) out += '<h3 class="hub-h">' + SECTION[t] + '</h3><div class="hl-l">' + l.map(link).join("") + "</div>";
    });
    return out;
  }
  function base() {
    return '<h3 class="hub-h">Siempre a mano</h3><div class="hl-l">' + D.BASE.map(link).join("") + "</div>";
  }
  var NOTE = '<p class="hint hub-note">Apoyo a la decisión: no reemplaza el criterio clínico ni el protocolo de tu servicio. Verificá siempre las dosis en la fuente original.</p>';
  var back = '<button class="btn g back" type="button" data-hb>‹ Volver</button>';

  var TRI_SVG = '<svg class="tri-svg" viewBox="0 0 300 232" role="img" aria-label="Triángulo de evaluación pediátrica: apariencia, trabajo respiratorio y circulación a la piel" style="display:block;width:min(100%,340px);margin:6px auto 12px">' +
    '<polygon points="150,12 286,200 14,200" fill="none" stroke="#17384A" stroke-width="3" stroke-linejoin="round"/>' +
    '<polygon points="150,12 286,200 150,200" fill="#C2402F" fill-opacity=".16"/><polygon points="150,12 14,200 150,200" fill="#1F7A5A" fill-opacity=".16"/>' +
    '<circle cx="150" cy="12" r="10" fill="#1F5368"/><circle cx="14" cy="200" r="10" fill="#1F7A5A"/><circle cx="286" cy="200" r="10" fill="#C2402F"/>' +
    '<g font-family="inherit" font-weight="700" text-anchor="middle" fill="currentColor"><text x="150" y="82" font-size="15" fill="#1F5368">Apariencia</text><text x="150" y="100" font-size="11" font-weight="500">estado neurológico</text>' +
    '<text x="82" y="160" font-size="13" fill="#1F7A5A">Trabajo</text><text x="82" y="176" font-size="13" fill="#1F7A5A">respiratorio</text>' +
    '<text x="212" y="160" font-size="12" fill="#C2402F">Circulación</text><text x="212" y="176" font-size="13" fill="#C2402F">a la piel</text></g>' +
    '<text x="150" y="226" font-size="10" text-anchor="middle" fill="currentColor" opacity=".7">Evaluación en segundos, antes de tocar al paciente</text></svg>';
  /* ---------- TRIAGE ---------- */
  function renderTriage() {
    var T = D.TRIAGE, host = $("#tri-body");
    if (!host) return;
    var li = function (a) { return a.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join(""); };
    var abc = T.abc.map(function (s) {
      return '<details class="abc"><summary><span class="abc-l">' + s.l + '</span><b>' + esc(s.n) + '</b>' + CHEV + '</summary><div class="abc-b"><ul class="hub-ul">' + li(s.pts) +
        '</ul><div class="hl-l">' + s.t.map(link).join("") + "</div></div></details>";
    }).join("");
    host.innerHTML =
      '<h2>Emergencias</h2><p class="sub">Orden de trabajo ante un paciente que ingresa: evaluá con el ABC y abrí lo que necesites.</p><div class="hl-l" style="margin:6px 0 10px"><a class="hl" href="#" data-go="cards"><span class="hl-t"><b>Cards: medicación por peso</b><small>Tablas para situaciones críticas</small></span>' + CHEV + '</a><a class="hl" href="#" data-tool="pals"><span class="hl-t"><b>Secuencia PALS</b><small>Evaluación y algoritmos pediátricos</small></span>' + CHEV + '</a></div>' +
      '<div class="card tri-t"><div class="calc"><h3 class="th" style="margin-top:0">' + esc(T.tri.n) + '</h3><p class="hint" style="margin-top:0">' + esc(T.tri.d) + '</p>' + TRI_SVG + '<ul class="hub-ul">' + li(T.tri.pts) + '</ul><button class="btn pri w" type="button" id="em-paro">PARO: si hay que reanimar</button><p class="hint">⚕ Pendiente de revisión médica.</p></div></div>' +
      '<div class="card cab-n"><div class="calc"><h3 class="th" style="margin-top:0">¿ABC o CAB?</h3><p class="hint" style="margin-top:0">⚕ Pendiente de revisión médica.</p><ul class="hub-ul"><li><b>Paciente que responde, respira y tiene pulso:</b> seguí el orden A-B-C-D-E.</li><li><b>No responde y no respira (o solo boquea) o no tiene pulso:</b> es un paro. No sigas con el ABC: iniciá compresiones (<b>C-A-B</b>) con el botón EMERGENCIA de arriba.</li></ul></div></div>' +
      '<div class="abc-w">' + abc + "</div>" +
      '<div class="card"><div class="calc"><h3 class="th" style="margin-top:0">Después del ABC</h3><ul class="hub-ul">' + li(T.prox) + "</ul></div></div>" +
      base() + NOTE;
  }

  /* ---------- SISTEMAS ---------- */
  var sysState = null;
  function renderSys() {
    var v = $("#v-sys"), html;
    if (!sysState) {
      html = '<button class="btn g back" type="button" data-hbm>‹ Motivos de ingreso</button><h2>Aparatos y sistemas</h2><p class="sub">Elegí el sistema y vas a ver todo lo que la app tiene para él.</p><div class="hub-grid">' +
        D.SYS.map(function (s) {
          return '<button class="tile" type="button" data-sys="' + s.id + '"><span class="tile-i">' + svg(s.ic) + '</span><b>' + esc(s.n) + "</b><small>" + esc(s.d) + "</small></button>";
        }).join("") + "</div>" + NOTE;
    } else {
      var s = D.SYS.filter(function (x) { return x.id === sysState; })[0];
      html = back + '<div class="hub-hd"><span class="tile-i">' + svg(s.ic) + "</span><h2>" + esc(s.n) + "</h2></div><p class=\"sub\">" + esc(s.d) + "</p>" + sections(s.t) + NOTE;
    }
    v.innerHTML = html; scrollTo(0, 0);
  }

  /* ---------- CASOS ---------- */
  var cs = { g: null, c: null, s: null, q: "" };
  function gname(id) { return D.GROUPS.filter(function (g) { return g.id === id; })[0]; }
  function casesOf(gid) { return D.CASES.filter(function (c) { return c.g.indexOf(gid) >= 0; }); }
  function caseRow(c) {
    var gs = c.g.map(function (i) { return gname(i).n; }).join(" · ");
    return '<button class="cr" type="button" data-case="' + c.id + '"><span class="hl-t"><b>' + esc(c.n) + "</b><small>" + esc(gs) + "</small></span>" + CHEV + "</button>";
  }
  function sysTools(gid) {
    var sid = (D.SYSMAP || {})[gid], s = D.SYS.filter(function (x) { return x.id === sid; })[0];
    return s && s.t && s.t.length ? '<h3 class="hub-h">Herramientas de este aparato</h3>' + sections(s.t).replace(/<h3 class="hub-h">/g, '<h4 class="hub-h2">').replace(/<\/h3>/g, "</h4>") : "";
  }
  function renderCasos() {
    var v = $("#v-casos"), html;
    if (cs.c) {
      var c = D.CASES.filter(function (x) { return x.id === cs.c; })[0], g0 = gname(c.g[0]);
      var rec = c.rec || g0.rec;
      html = back + '<p class="hub-badge">' + c.g.map(function (i) { return esc(gname(i).n); }).join(" · ") + "</p><h2>" + esc(c.n) + "</h2>" +
        '<h3 class="hub-h">Al recibirlo</h3><div class="card"><div class="calc"><ol class="hub-ol">' + rec.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ol></div></div>" +
        sections(c.t) + base() + NOTE;
    } else if (cs.g) {
      var g = gname(cs.g);
      html = back + '<div class="hub-hd"><span class="tile-i">' + svg(g.ic) + "</span><h2>" + esc(g.n) + '</h2></div><p class="sub">' + esc(g.d) + '</p><h3 class="hub-h">Motivos de ingreso</h3><div class="cr-l">' + casesOf(g.id).map(caseRow).join("") + "</div>" + sysTools(g.id) + NOTE;
    } else if (cs.s) {
      var ids = (D.SYMP || {})[cs.s] || [];
      html = back + '<p class="hub-badge">Signo o síntoma</p><h2>' + esc(cs.s) + '</h2><p class="sub">Motivos de ingreso que pueden presentarse con este signo o síntoma. Orientativo: no reemplaza el criterio clínico.</p><div class="cr-l">' +
        D.CASES.filter(function (c) { return ids.indexOf(c.id) >= 0; }).map(caseRow).join("") + "</div>" + NOTE;
    } else {
      var others = ["ad", "pr", "ca"].map(function (id) { return D.SYS.filter(function (x) { return x.id === id; })[0]; }).filter(Boolean);
      html = '<h2>Motivos de ingreso</h2><p class="sub">Motivos de ingreso a terapia intensiva pediátrica, por aspecto. Buscá por aparato, signo, síntoma o motivo.</p>' +
        '<div id="cs-search"></div>' +
        '<h3 class="hub-h">Por aspecto o aparato</h3><div class="hub-grid">' + D.GROUPS.map(function (g) {
          return '<button class="tile" type="button" data-grp="' + g.id + '"><span class="tile-i">' + svg(g.ic) + "</span><b>" + esc(g.n) + "</b><small>" + casesOf(g.id).length + " motivos · " + esc(g.d) + "</small></button>";
        }).join("") + "</div>" +
        '<h3 class="hub-h">Otros recursos</h3><div class="hub-grid">' + others.map(function (x) {
          return '<button class="tile" type="button" data-sys="' + x.id + '"><span class="tile-i">' + svg(x.ic) + "</span><b>" + esc(x.n) + "</b><small>" + esc(x.d) + "</small></button>";
        }).join("") + "</div>" + NOTE;
    }
    v.innerHTML = html;
    var sh = $("#cs-search");
    if (sh && window.ARUCIP_SEARCH) window.ARUCIP_SEARCH.mount(sh, { scope: "motivos", placeholder: "Buscar signo, síntoma, aparato o motivo" });
    scrollTo(0, 0);
  }

  /* ---------- Eventos ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t.closest) return;
    var b;
    if ((b = t.closest("[data-sys]"))) { sysState = b.dataset.sys; renderSys(); return; }
    if ((b = t.closest("[data-grp]"))) { cs.g = b.dataset.grp; renderCasos(); return; }
    if ((b = t.closest("[data-case]"))) { cs.c = b.dataset.case; renderCasos(); return; }
    if ((b = t.closest("[data-hbm]"))) { var tb = document.querySelector('.tabs button[data-v="casos"]'); if (tb) tb.click(); return; }
    if ((b = t.closest("[data-hb]"))) {
      if (b.closest("#v-sys")) { sysState = null; renderSys(); }
      else if (cs.c && !cs.q) { cs.c = null; renderCasos(); }
      else if (cs.c) { cs.c = null; renderCasos(); }
      else { cs.g = null; cs.s = null; renderCasos(); }
      return;
    }
    if ((b = t.closest(".tabs button"))) {
      if (b.dataset.v === "sys" && sysState) { sysState = null; renderSys(); }
      if (b.dataset.v === "triage") { /* sin estado propio */ }
      if (b.dataset.v === "casos" && (cs.c || cs.g || cs.q)) { cs = { g: null, c: null, s: null, q: "" }; renderCasos(); }
    }
  });
  /* PARO desde Emergencias */
  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest("#em-paro")) { var p = document.getElementById("paro"); if (p) p.click(); }
  });

  /* ---------- INDICACIONES Y CÁLCULOS (día a día) ---------- */
  function renderInd() {
    var v = $("#v-ind");
    if (!v || !D.IND) return;
    v.innerHTML = '<h2>Indicaciones y cálculos</h2><p class="sub">Para el trabajo diario en sala: balances, nutrición, analgosedación, infusiones y controles.</p>' +
      D.IND.map(function (g) { return '<h3 class="hub-h">' + esc(g.n) + '</h3><div class="hl-l">' + g.t.map(link).join("") + "</div>"; }).join("") +
      '<h3 class="hub-h">En preparación</h3><div class="card"><div class="calc"><ul class="hub-ul">' +
      (D.IND_PEND || []).map(function (x) { return "<li><b>" + esc(x.n) + "</b>: " + esc(x.d) + "</li>"; }).join("") +
      '</ul><p class="hint" style="margin:8px 0 0">Contenido pendiente de redacción y validación por el servicio. No se agregan indicaciones ni periodicidades sin esa revisión.</p></div></div>' + NOTE;
  }

  /* ---------- API para el buscador ---------- */
  function goTab(v) { var tb = document.querySelector('.tabs button[data-v="' + v + '"]'); if (tb) tb.click(); }
  window.ARUCIP_HUBS = {
    openCase: function (id) { goTab("casos"); cs = { g: null, c: id, s: null, q: "" }; renderCasos(); },
    openGroup: function (id) { goTab("casos"); cs = { g: id, c: null, s: null, q: "" }; renderCasos(); },
    openSymptom: function (name) { goTab("casos"); cs = { g: null, c: null, s: name, q: "" }; renderCasos(); },
    openSys: function (id) { goTab("casos"); if (window.ARUCIP_GO) window.ARUCIP_GO("sys"); sysState = id; renderSys(); }
  };

  /* ---------- Arranque ---------- */
  function init() { renderTriage(); renderSys(); renderCasos(); renderInd(); }
  if (document.readyState === "complete") init(); else window.addEventListener("load", init);

  /* Traducciones de los títulos de las secciones nuevas */
  try {
    var I = window.ARUCIP_I18N;
    if (I && I.langs.en) Object.assign(I.langs.en.dict, { "Triage": "Triage", "Sistemas": "Systems", "Casos": "Cases",
      "Emergencias": "Emergencies", "Motivos de ingreso": "Admission reasons", "Favoritos": "Favorites", "Aparatos y sistemas": "Organ systems", "Aparatos y sistemas": "Organ systems", "Casos clínicos": "Clinical cases",
      "Vía aérea": "Airway", "Respiración": "Breathing", "Circulación": "Circulation", "Neurológico": "Neurologic", "Exposición y entorno": "Exposure and environment",
      "Siempre a mano": "Always at hand", "Al recibirlo": "On reception", "Herramientas y escalas": "Tools and scores", "Checklists": "Checklists", "Calculadoras": "Calculators", "Frecuentes": "Common",
      "Equipo": "Team" });
    if (I && I.langs.pt) Object.assign(I.langs.pt.dict, { "Triage": "Triagem", "Sistemas": "Sistemas", "Casos": "Casos",
      "Emergencias": "Emergências", "Motivos de ingreso": "Motivos de internação", "Favoritos": "Favoritos", "Aparatos y sistemas": "Aparelhos e sistemas", "Casos clínicos": "Casos clínicos",
      "Vía aérea": "Via aérea", "Respiración": "Respiração", "Circulación": "Circulação", "Neurológico": "Neurológico", "Exposición y entorno": "Exposição e ambiente",
      "Siempre a mano": "Sempre à mão", "Al recibirlo": "Ao receber", "Herramientas y escalas": "Ferramentas e escalas", "Checklists": "Checklists", "Calculadoras": "Calculadoras", "Frecuentes": "Frequentes",
      "Equipo": "Equipe" });
  } catch (e) {}
})();

;
/* Arucip · botones de la portada: Emergencia (PARO), modo claro/oscuro, ECG en movimiento y accesos a las secciones.
   Reutiliza los elementos de la app (#paro, #thm, .pk-ecg) para que se vean y se comporten igual. */
(function () {
  var c = document.getElementById("cover");
  if (!c) return;
  var ic = window.ARUCIP_ICONS;
  if (ic) Array.prototype.forEach.call(c.querySelectorAll("[data-ic]"), function (s) { s.innerHTML = ic.svg(s.getAttribute("data-ic")); });
  /* Botón de paro: copia del dibujo del encabezado. */
  var pb = document.querySelector("#paro .pb"), cp = document.getElementById("cv-paro");
  if (pb && cp) {
    /* Los ids (degradados y tornillos) se renombran en la copia: si quedaran repetidos, el botón del
       encabezado usaría los de la portada oculta y se vería apagado. */
    var html = pb.outerHTML.replace(/id="([^"]+)"/g, 'id="$1-c"').replace(/url\(#([^)]+)\)/g, 'url(#$1-c)').replace(/href="#([^"]+)"/g, 'href="#$1-c"');
    var tmp = document.createElement("div"); tmp.innerHTML = html; cp.appendChild(tmp.firstChild);
  }
  /* ECG animado: copia del trazado del encabezado. */
  var ecg = document.querySelector(".ph .pk-ecg"), ce = document.getElementById("cv-ecg");
  if (ecg && ce) ce.appendChild(ecg.cloneNode(true));
  function go(cb) {
    document.getElementById("cv-go").click();
    setTimeout(cb, 420);
  }
  if (cp) cp.onclick = function () { go(function () { var p = document.getElementById("paro"); if (p) p.click(); }); };
  Array.prototype.forEach.call(c.querySelectorAll("[data-tab]"), function (b) {
    b.onclick = function () { go(function () { var t = document.querySelector('.tabs button[data-v="' + b.getAttribute("data-tab") + '"]'); if (t) t.click(); }); };
  });
  /* «Más información y créditos»: cierra la portada y abre «Acerca de esta versión» (equipo, aviso y fuentes). */
  var more = document.getElementById("cv-more");
  if (more) more.onclick = function () {
    go(function () { var a = document.createElement("a"); a.setAttribute("data-tool", "about"); document.body.appendChild(a); a.click(); a.remove(); });
  };
  /* El logo del encabezado (claro u oscuro) vuelve a la portada. */
  var first = document.querySelector(".ph-mark");
  Array.prototype.forEach.call(document.querySelectorAll(".ph-mark"), function (m) {
    if (m !== first) { m.setAttribute("role", "button"); m.addEventListener("click", function () { first.click(); }); }
  });
  /* Buscador general de la portada: al elegir un resultado se cierra la portada y se abre ese contenido. */
  var sh = document.getElementById("cv-search");
  if (sh && window.ARUCIP_SEARCH) window.ARUCIP_SEARCH.mount(sh, { scope: "all", placeholder: "Ej.: fiebre, shock, midazolam…", before: go });
  /* Apartados de «Más» que abren una categoría de Herramientas (Autocuidado, Calidad y seguridad, IA). */
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("a[data-cat]") : null;
    if (!a) return;
    var cat = a.getAttribute("data-cat");
    setTimeout(function () {
      var ds = Array.prototype.slice.call(document.querySelectorAll("#tl > details"));
      var d = ds.filter(function (x) { var b = x.querySelector("summary b"); return b && b.textContent.trim() === cat; })[0];
      if (d) { ds.forEach(function (x) { if (x !== d) x.open = false; }); d.open = true; d.scrollIntoView({ block: "start" }); }
    }, 80);
  });
  /* Interruptor de tema: usa el de la app para quedar sincronizado. */
  var sw = document.getElementById("cv-thm"), thm = document.getElementById("thm");
  function sync() { sw.setAttribute("aria-checked", document.documentElement.dataset.mode === "dark" ? "true" : "false"); }
  if (sw && thm) {
    sw.onclick = function () { thm.click(); sync(); };
    new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ["data-mode", "data-theme"] });
    sync();
  }

  /* «‹ Volver» en las pantallas principales (todas menos la portada): lleva a la sección anterior; si no hay, a la portada. */
  (function () {
    var stack = [], cur = null, going = false, ROOTS = ["triage", "ind", "fav", "casos", "more"];
    function curTab() {
      var v = document.querySelector(".view:not([hidden])");
      if (!v) return null;
      var id = v.id.slice(2);
      return window.ARUCIP_TAB ? window.ARUCIP_TAB(id) : id;
    }
    function ensure() {
      ROOTS.forEach(function (r) {
        var v = document.getElementById("v-" + r);
        if (!v) return;
        var f = v.firstElementChild;
        if (f && (f.classList.contains("back") || f.hasAttribute("data-rb"))) return;
        if (v.querySelector(".back")) return;
        var b = document.createElement("button");
        b.className = "btn g back"; b.type = "button"; b.setAttribute("data-rb", ""); b.textContent = "‹ Volver";
        v.insertBefore(b, v.firstChild);
      });
    }
    function onChange() {
      var n = curTab();
      if (n && n !== cur) { if (cur && !going) stack.push(cur); cur = n; }
      going = false;
      ensure();
    }
    new MutationObserver(onChange).observe(document.body, { subtree: true, attributes: true, attributeFilter: ["hidden"] });
    ROOTS.forEach(function (r) {
      var v = document.getElementById("v-" + r);
      if (v) new MutationObserver(ensure).observe(v, { childList: true });
    });
    document.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("[data-rb]") : null;
      if (!b) return;
      var prev = stack.pop();
      if (prev) {
        var t = document.querySelector('.tabs button[data-v="' + prev + '"]');
        going = true; if (t) t.click();
      } else { var m = document.querySelector(".ph-mark"); if (m) m.click(); }
    });
    cur = curTab(); ensure();
  })();
})();

}
/* ---------- carga de módulos ---------- */
function loadScript(src){return new Promise(function(ok,no){var s=document.createElement("script");s.src=src;s.onload=ok;s.onerror=function(){no(new Error(src))};document.head.appendChild(s)})}
/* Al abrir index.html con doble clic (file://) los navegadores bloquean fetch(): se usa offline-data.js como respaldo. */
function offlineFiles(){return window.__ARU_FILES?Promise.resolve(window.__ARU_FILES):loadScript("offline-data.js").then(function(){return window.__ARU_FILES},function(){return null})}
function fromOffline(u,err){return offlineFiles().then(function(f){if(!f||!(u in f))throw err||new Error("No se encontró el archivo: "+u);return JSON.parse(JSON.stringify(f[u]))})}
function J(u){
  if(location.protocol==="file:")return fromOffline(u);
  return fetch(u).then(function(r){if(!r.ok)throw new Error("No se encontró el archivo: "+u+" (HTTP "+r.status+")");return r.json()}).catch(function(e){return fromOffline(u,e)});
}
var PK={};
ARU.loadPack=function(n){if(PK[n])return PK[n];return PK[n]=J("modules/packs/"+n+".json").then(function(p){
  p.items.forEach(function(it){var t=ARU.motor.toTool(it);if(t&&!ARU.T[it.id])ARU.T[it.id]=t});return p})};
ARU.loadFor=function(key){var m=ARU.index.modules.find(function(x){return x.id===key});return m?ARU.loadPack(m.pack):Promise.resolve()};
async function boot(){
  var r=await Promise.all([J("modules/index.json"),J("data/tablas.json"),J("data/cards.json"),J("data/noimg.json"),J("data/formulas.json"),J("data/sinonimos.json"),J("modules/tips.json"),J("data/hubs.json"),J("modules/packs/checklists.json")]);
  ARU.index=r[0];TL=r[0].menu;window.D=D=r[1];window.CARDS=CARDS=r[2];window.NOIMG=NOIMG=r[3];BB=r[4];window.SYN=SYN=r[5];TIPS=r[6].tips;TG=r[6].grupos;
  window.ARUCIP_DATA=r[7];
  CK=r[8].items.map(function(c){return [c.id,c.t,c.i,c.fin,c.items,c.hd,c.ref]});
  Object.assign(window,{CK:CK,TL:TL,TIPS:TIPS,TG:TG,BB:BB});
  __core();__tools();
  var files=["cronometro","dosis","cards","calculadoras","pocus","paro","quemados","otros"];
  for(var i=0;i<files.length;i++)await loadScript("modules/custom/"+files[i]+".js");
  __tail();
}
function start(){boot().catch(function(e){var n=document.getElementById("nojs");if(n){n.hidden=false;n.innerHTML="<b>Arucip no pudo iniciar.</b><br>"+String(e&&e.message||e)}})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
