/* Asistentes por peso y calculadoras con estado propio */
(function(){
const T=window.ARU.T;
const N=v=>{const x=parseFloat(String(v).replace(",","."));return isFinite(x)?x:NaN};
const R=(v,d=2)=>isFinite(v)?(Math.round(v*10**d)/10**d).toString().replace(".",","):"—";
const ok=(v,...k)=>k.every(x=>{const y=v[x];return y!==null&&y!==undefined&&!(typeof y==="number"&&isNaN(y))});
const ul=a=>"<ul>"+a.map(x=>"<li>"+x+"</li>").join("")+"</ul>";
const src=a=>a;
const fxn=(x,d)=>{d=d||0;return(Math.round(x*Math.pow(10,d))/Math.pow(10,d)).toString().replace(".",",")};
const dkv=(b,id)=>{const e=b.querySelector("#"+id);return e?parseFloat(e.value):NaN};
const dkf=(id,l)=>`<label class="f"><span>${l}</span><input id="${id}" type="number" inputmode="decimal" step="any" placeholder="0"></label>`;
const dkS=(n,t,body)=>`<section class="stp"><h4><i>${n}</i><span>${t}</span></h4><div class="bd">${body}</div></section>`;
const dkK=(l,v)=>`<div class="kv"><span>${l}</span><b>${v}</b></div>`;
const dkNeed=m=>`<p class="why">Cargá ${m} para calcular.</p>`;
const dkSC=w=>(w*4+7)/(w+90);
const vf=[{k:"epi",t:"n",l:"Adrenalina (mcg/kg/min)",v:0},{k:"nor",t:"n",l:"Noradrenalina (mcg/kg/min)",v:0},{k:"mil",t:"n",l:"Milrinona (mcg/kg/min)",v:0},{k:"vas",t:"n",l:"Vasopresina (U/kg/min)",v:0},{k:"dop",t:"n",l:"Dopamina (mcg/kg/min)",v:0},{k:"dob",t:"n",l:"Dobutamina (mcg/kg/min)",v:0}];
const AL=(u,t)=>`<a href="${u}" target="_blank" rel="noopener" style="color:var(--acc);font-weight:600">${t}</a>`;
const BX=h=>`<div class="card"><div class="body" style="padding-top:18px">${h}</div></div>`;
const sf=v=>isFinite(v)?parseFloat(v.toPrecision(3)).toString().replace(".",","):"—";
const P_=(l,v)=>`<div class="pp"><small>${l}</small>${v}</div>`;
const BG_=(l,v)=>`<div class="big"><small>${l}</small><b>${v}</b></div>`;
const WN_=t=>`<div class="wn">${t}</div>`;
const F_=(id,l,ph)=>`<label class="f"><span>${l}</span><input data-c="${id}" type="number" inputmode="decimal" step="any" placeholder="${ph||0}"></label>`;
const S_=(id,l,o)=>`<label class="f"><span>${l}</span><select data-c="${id}"><option value="">Seleccione</option>${o.map((x,i)=>`<option value="${i}">${x}</option>`).join("")}</select></label>`;
const nn=(b,id)=>{const e=b.querySelector(`[data-c="${id}"]`);if(!e)return NaN;const x=parseFloat(String(e.value).replace(",","."));return isFinite(x)?x:NaN};
const sv=(b,id)=>{const e=b.querySelector(`[data-c="${id}"]`);return e&&e.value!==""?+e.value:null};
const OUT=id=>`<div data-o="${id}"></div>`;
const wire=(h,fn)=>({html:h,init(b){const run=()=>{try{fn(b)}catch(e){console.error("WIRE "+e.message)}};b.oninput=b.onchange=run;run();return()=>{b.oninput=b.onchange=null}}});
const setO=(b,id,h)=>{const e=b.querySelector(`[data-o="${id}"]`);if(e)e.innerHTML=h};
const NAI=[["ClNa 3% (513 mEq/L Na)",513],["ClNa 2% (341 mEq/L Na)",341],["Fisiológico (154 mEq/L Na)",154],["Ringer (130 mEq/L Na)",130]];
const NAH=[["Agua (solo vía digestiva) (0 mEq/L Na)",0],["1/5 Fisiológico (34 mEq/L Na)",34],["1/2 Fisiológico (77 mEq/L Na)",77],["Ringer (130 mEq/L Na)",130],["Fisiológico (154 mEq/L Na)",154]];
T.cad={t:"Cetoacidosis diabética: paso a paso",c:{html:`<div class="dk"><p class="sub">Protocolo ordenado en el tiempo, basado en la GAP 2025 del Garrahan. Cargá los datos y seguí los pasos de arriba hacia abajo. Es una ayuda de cálculo: verificá siempre con la guía y el criterio clínico.</p>
<div class="card"><div class="calc"><h3 class="th">Datos del paciente</h3><div class="flds">${dkf("d-p","Peso real (kg)")}${dkf("d-pi","Peso ideal para la talla (kg)")}</div><div class="flds">${dkf("d-ph","pH venoso")}${dkf("d-bic","Bicarbonato (mEq/L)")}</div><div class="flds">${dkf("d-glu","Glucemia (mg/dL)")}${dkf("d-na","Sodio (mEq/L)")}</div><div class="flds">${dkf("d-k","Potasio (mEq/L)")}</div></div></div>
<div id="d-out"></div></div>`,
init(b){const out=b.querySelector("#d-out");
function render(){const p=dkv(b,"d-p"),pi=dkv(b,"d-pi"),ph=dkv(b,"d-ph"),bic=dkv(b,"d-bic"),glu=dkv(b,"d-glu"),na=dkv(b,"d-na"),k=dkv(b,"d-k");
const hasA=ph>0||bic>=0,w=Math.min(p,70),hasW=w>0;
const g=(ph>0&&ph<7.1)||(bic>=0&&bic<5),m=!g&&((ph>0&&ph<7.2)||(bic>=0&&bic<10)),l=!g&&!m&&((ph>0&&ph<7.3)||(bic>=0&&bic<18));
const sev=!hasA?null:g?3:m?2:l?1:0,sevT=["No cumple criterio de CAD por gasometría","CAD leve","CAD moderada","CAD grave"];
let h="";
h+=hasA?`<div class="grav g${sev}">${sevT[sev]}<small>${sev>0?"Se toma la peor categoría entre pH y bicarbonato. Leve: pH &lt;7,3 o HCO₃ &lt;18 · Moderada: pH &lt;7,2 o HCO₃ &lt;10 · Grave: pH &lt;7,1 o HCO₃ &lt;5.":"Revisá el diagnóstico: CAD = glucemia elevada con pH &lt;7,3 o bicarbonato &lt;18 y cetonas."}</small></div>`:`<div class="grav g0">Cargá pH venoso o bicarbonato para clasificar la gravedad</div>`;
let s1;
if(!hasA||!hasW)s1=dkNeed(!hasW?"el peso real":"pH o bicarbonato");
else{const ml=(g?20:10)*w;
s1=`<p class="do">${g?"SF 0,9% 20 mL/kg":m?"SF 0,9% 10 mL/kg":"CAD leve: hidratación por vía oral"} ${sev>=2?"= "+fxn(ml)+" mL en 1 hora, con bomba":""}</p>`
+(sev===1?`<p class="why">Si no tolera la vía oral: SF 0,9% 10 mL/kg = ${fxn(10*w)} mL EV en 1 hora, como en la moderada.</p>`:"")
+(sev===0?`<p class="why">No cumple criterio de CAD: no aplicar este plan sin revisar el diagnóstico.</p>`:"")
+`<p class="why">Con peso real (máximo 70 kg). Todavía no se da insulina. Monitorización continua y acceso venoso.</p>`}
h+=dkS(1,"Hora 0: líquidos de inicio",s1);
let s2=`<p class="do">Iniciar la insulina 1 hora después de comenzar los líquidos. Nunca en bolo EV.</p>`;
if(k>0&&k<2.5)s2+=`<div class="box al"><b>Potasio &lt;2,5: NO iniciar insulina.</b> Corregir el potasio por vía EV según la guía institucional y empezar la insulina cuando el potasio sea &gt;2,5.</div>`;
if(!(pi>0))s2+=dkNeed("el peso ideal para la talla");
else{const u=Math.floor(0.1*pi);
s2+=`<p class="why">Se calcula con el peso ideal para la talla.</p>`
+`<div class="box al"><b>Elegir UNA sola vía según dónde esté el paciente. No dar insulina SC y EV a la vez.</b></div><h5>En sala (internación general): insulina subcutánea</h5>`
+dkK("Insulina rápida SC horaria (0,1 U/kg/h, redondeo hacia abajo)",u>=1?u+" U cada hora":"Dosis &lt;1 U/h: no diluir, usar infusión EV")
+`<h5>En terapia intensiva (UCIP): infusión EV continua</h5>`
+dkK("Infusión EV continua (60 U en 60 mL = 1 U/mL)",fxn(0.1*pi,2)+" mL/h = "+fxn(0.1*pi,2)+" U/h")
+dkK("Si se elige la dosis baja de 0,05 U/kg/h",fxn(0.05*pi,2)+" mL/h")
+`<p class="src">Rango habitual 0,05–0,1 U/kg/h (ISPAD 2022). La elección entre ambas la define el equipo según la guía.</p>`}
s2+=`<h5>Cómo armar la infusión de insulina</h5><ul class="ck"><li>Cargar <b>60 U de insulina rápida (regular)</b> y completar hasta <b>60 mL con solución fisiológica</b> en una jeringa de 60 mL = <b>1 U/mL</b>.</li><li>Conectar una extensión (alargue), purgar y cargar el sistema. <b>Velocidad (mL/h) = dosis (U/h)</b>${pi>0?": con 0,1 U/kg/h son "+fxn(0.1*pi,2)+" mL/h":""}.</li><li>Rotular con la hora de preparación: la solución se usa <b>12 h</b> y después se prepara una nueva. Usar un frasco de insulina nuevo para el tratamiento.</li><li>Pasar con bomba de infusión. Sin bolo inicial.</li></ul><p class="src">Preparación según la GAP Garrahan de CAD (versión 2020 disponible; confirmar con la guía 2025 y el protocolo del servicio).</p>`;
h+=dkS(2,"Hora 1: insulina",s2);
let s3;
if(!hasW||!hasA)s3=dkNeed(!hasW?"el peso real":"pH o bicarbonato");
else{const sc=dkSC(w),mx=g?7500:6500,tot=Math.min(sc*(g?4000:3500),mx),ini=(g?20:10)*w,r=(ini+3*tot/24)/w;
s3=`<p class="do">Pasar a ${fxn(tot/24,1)} mL/h desde la hora 1 (${fxn(tot)} mL en 24 h)</p><p class="why">Incluye el déficit y las pérdidas. Superficie corporal ${fxn(sc,2)} m² × ${g?4000:3500} mL/m²/día, máximo ${mx} mL.</p>`
+dkK("Control de las primeras 4 h (inicio + 3 h de mantenimiento)",fxn(r,1)+" mL/kg"+(r>50?" · SUPERA 50 mL/kg: revisar":" · dentro del máximo de 50 mL/kg"));
if(r>50)s3+=`<div class="box al">Supera 50 mL/kg en las primeras 4 horas: revisar el plan de líquidos.</div>`;
s3+=`<h5>Qué lleva el líquido</h5>`
+dkK("Dextrosa",glu>0?(glu>250?"2,5% (glucemia &gt;250)":"5% (glucemia ≤250)"):"Cargá la glucemia")
+dkK("Sodio",glu>0&&na>0?(()=>{const c=na+2*((glu-100)/100);return "Na corregido "+fxn(c,1)+" → solución con Na "+(c<130?140:120)+" mEq/L"})():"Cargá sodio y glucemia")
+dkK("Potasio",k>0?(k<2.5?"K &lt;2,5: corrección EV rápida según guía y posponer la insulina":k<3.5?"K 2,6–3,4: 20 mEq/L en el líquido de inicio y 40 mEq/L en el mantenimiento":k<=6?"K 3,5–6: sin potasio en el líquido de inicio; 40 mEq/L en el mantenimiento":"K &gt;6: no indicar potasio; evaluar tratamiento de hiperkalemia"):"Cargá el potasio")}
h+=dkS(3,"Hora 1 a 24: plan de hidratación",s3);
let rate2=0;if(hasW&&hasA){const sc2=dkSC(w),mx2=g?7500:6500;rate2=Math.min(sc2*(g?4000:3500),mx2)/24}
let s4=`<p class="do">Dos bolsas con el mismo sodio y potasio: la <b>A sin dextrosa</b> y la <b>B con dextrosa 10%</b>. El volumen total por hora no cambia: solo se modifica qué porción pasa por cada bolsa, sin cambiar de bolsa ni reprogramar la insulina.</p><ul class="ck"><li><b>Bolsa A:</b> NaCl 0,45–0,9% + KCl 40 mEq/L (si no hay hiperkalemia ni anuria; el potasio se ajusta con el valor sérico, ver paso 3). Sin dextrosa.</li><li><b>Bolsa B:</b> la misma base y el mismo potasio + <b>dextrosa 10%</b>.</li><li>Dos bombas independientes, conectadas en Y. Empezar solo con la bolsa A (líquidos de inicio; la insulina empieza 1 h después, paso 2).</li><li>Controlar la glucemia <b>cada hora</b> y reajustar la proporción A:B. Meta: descenso de 50–75 mg/dL/h y glucemia entre 150 y 250 mg/dL.</li><li>Primero se ajusta la mezcla de bolsas; la insulina se mantiene. La reducción a 0,05 U/kg/h la define la GAP (menores de 5 años, o descenso de la glucemia &gt;100 mg/dL/h).</li></ul>`
+`<table class="tb"><tr><th>Glucemia (mg/dL)</th><th>Bolsa A (sin dextrosa)</th><th>Bolsa B (dextrosa 10%)</th></tr><tr><td>&gt;250</td><td>100%</td><td>0%</td></tr><tr><td>&gt;200 a 250</td><td>75%</td><td>25%</td></tr><tr><td>&gt;150 a 200</td><td>50%</td><td>50%</td></tr><tr><td>≤150</td><td>25%</td><td>75%</td></tr></table><p class="src">Tabla orientativa: individualizar según el protocolo del servicio. Con A y B, dextrosa 2,5% equivale a 25% de B y dextrosa 5% a 50% de B.</p>`;
if(!(rate2>0))s4+=dkNeed(!hasW?"el peso real":"pH o bicarbonato");
else if(!(glu>0))s4+=`<p class="why">Cargá la glucemia para ver cuánto va por cada bolsa (velocidad total ${fxn(rate2,1)} mL/h).</p>`;
else{const pb=glu>250?0:glu>200?0.25:glu>150?0.5:0.75,b2=rate2*pb,a2=rate2-b2;
 s4+=dkK("Velocidad total (igual que el paso 3)",fxn(rate2,1)+" mL/h")+dkK("Bolsa A (sin dextrosa)",fxn(a2,1)+" mL/h ("+Math.round((1-pb)*100)+"%)")+dkK("Bolsa B (dextrosa 10%)",fxn(b2,1)+" mL/h ("+Math.round(pb*100)+"%)")+dkK("Dextrosa equivalente",fxn(pb*10,1)+"%")}
s4+=`<div class="box al"><b>Atención:</b> este esquema de dos bolsas no figura en la GAP Garrahan, que indica dextrosa 2,5% con glucemia &gt;250 y 5% con glucemia ≤250 (paso 3). No combinar ambos criterios: usar el que indique el protocolo del servicio.</div><p class="src">Esquema de dos bolsas: ISPAD y protocolos de urgencias pediátricas; cortes de glucemia orientativos.</p>`;
h+=dkS("B","Dos bolsas: ajustar la dextrosa",s4);

h+=dkS(4,"Controles",`<ul class="ck"><li>Glucemia capilar y examen neurológico <b>cada hora</b></li><li>Gasometría venosa, ionograma y cetonemia (β-hidroxibutirato) <b>cada 2 a 4 horas</b></li><li>Balance estricto: ingresos y diuresis</li><li>Monitor cardíaco, sobre todo si el potasio está alterado</li></ul><p class="src">Frecuencias generales de ISPAD 2022: ajustarlas a la guía y a la gravedad del paciente.</p>`);
h+=dkS(5,"Bicarbonato",`<p class="do">No recomendado.</p><p class="why">Solo si el pH es &lt;6,8 con compromiso de la contractilidad cardíaca.</p>`);
let e6=`<p class="do">Sospechar ante: cefalea, vómitos reiterados, bradicardia con hipertensión, alteración del estado de conciencia o pupilas anormales.</p><div class="box al"><b>Si sospecha edema cerebral, tratar sin esperar la imagen:</b><ul class="ck"><li>Disminuir la velocidad de los líquidos y cabecera a 30°</li><li>Manitol 0,5–1 g/kg EV en 10–15 min${hasW?" = "+fxn(0.5*w,1)+" a "+fxn(w,1)+" g":""}, <b>o</b> solución salina hipertónica 3% 2,5–5 mL/kg EV en 10–15 min${hasW?" = "+fxn(2.5*w)+" a "+fxn(5*w)+" mL":""}</li><li>Avisar a UCIP y asegurar la vía aérea si hay deterioro</li></ul></div><p class="src">Esquema de ISPAD 2022 (no figura en la GAP cargada en la app). Verificarlo con la guía institucional.</p>`;
h+=dkS(6,"Alerta: edema cerebral",e6);
h+=dkS(7,"Resolución",`<p class="do">Pasar a insulina subcutánea cuando: pH &gt;7,30, bicarbonato ≥18 y β-hidroxibutirato &lt;1 mmol/L.</p>`+(pi>0?dkK("Al resolver: insulina basal (glargina 0,5 U/kg de peso ideal)",fxn(0.5*pi,1)+" U"):`<p class="why">Al resolver se coloca insulina basal: glargina 0,5 U/kg de peso ideal.</p>`));
h+=`<div class="box"><b>Pedir ingreso a UCIP</b> si: menor de 2 años, shock, depresión respiratoria, edema cerebral, pH inicial &lt;6,9 entre 2 y 5 años, u otros criterios de la guía.</div><p class="src"><b>Fuente:</b> GAP 2025 Garrahan, Manejo de la cetoacidosis diabética en pediatría. Los puntos marcados ISPAD 2022 son criterios generales, no de la GAP.</p>`;
out.innerHTML=h}
b.oninput=b.onchange=render;render();return()=>{b.oninput=b.onchange=null}}}};;
T.sri={t:"Secuencia de intubación rápida",c:{html:`<div class="dk"><p class="sub">Adicional: no figura en ARUCIP. Tubo, equipo y fármacos para el peso cargado, todo en una pantalla. Verificá siempre las dosis con la guía y el criterio clínico.</p>
<div class="card"><div class="calc"><h3 class="th">Datos del paciente</h3><div class="flds">${dkf("sr-p","Peso (kg)")}${dkf("sr-e","Edad en años (opcional)")}</div></div></div>
<p><a href="#" data-go="ck" data-open="d-intub" style="color:var(--acc);font-weight:600">Abrir el checklist de Intubación</a></p>
<div id="sr-out"></div></div>`,
init(b){const out=b.querySelector("#sr-out");
const fm=x=>fxn(x,x<10?2:x<100?1:0),rg=(a,c)=>fm(a)===fm(c)?fm(a):fm(a)+" a "+fm(c);
const TU=[[5,3.5,3,"1"],[6,3.5,3,"1,5"],[10,4,3.5,"1,5 a 2"],[12,4.5,4,"2"],[16,5,4.5,"2"],[20,5.5,5,"2 a 2,5"],[25,0,6,"2,5"],[30,0,6.5,"2,5 a 3"],[35,0,6.5,"3"],[40,0,0,"3"],[50,0,0,"3 a 4"],[60,0,0,"4"]];
function render(){const w=dkv(b,"sr-p"),a=dkv(b,"sr-e"),okW=w>0,okA=a>=0,need=dkNeed("el peso");
const dm=(d,c,conc,u,lo)=>{const v=lo&&d<lo?lo:Math.min(d,c);return fm(v)+" "+(u||"mg")+" = "+fm(v/conc)+" mL"+(lo&&d<lo?" (dosis mínima)":d>c?" (dosis máxima)":"")};
const row=(l,d,c,conc,u,lo)=>dkK(l,okW?dm(d,c,conc,u,lo):"—");
const mgo=(l,d,c)=>dkK(l,okW?fm(Math.min(d,c))+" mg"+(d>c?" (dosis máxima)":""):"—");
let h="",e1="";
if(!okW)e1=need;
else if(w<3)e1=`<p class="rv">⚠ Menos de 3 kg: las tarjetas empiezan en 5 kg. Usá la guía neonatal para el tubo y el equipo.</p>`;
else{let c=TU[0];TU.forEach(r=>{if(w>=r[0])c=r});
const lo=w<5,sb=lo?3.5:c[1],cb=lo?3:c[2],ad=!sb&&!cb,lm=c[3];
e1=(lo?`<p class="why">Menos de 5 kg: las tarjetas empiezan en 5 kg. Tubo según Iowa y LITFL 2026; confirmá con la guía neonatal.</p>`:dkK("Tarjeta Garrahan usada",c[0]+" kg"))
+dkK("Tubo sin balón",ad||!sb?"No figura":fxn(sb,1))
+dkK("Tubo con balón",ad?"Varón 8, mujer 7":fxn(cb,1))
+dkK("Profundidad ≈ 3 × diámetro",ad?"24 cm varón; 21 cm mujer":(sb?fxn(3*sb,1)+" cm sin balón; ":"")+fxn(3*cb,1)+" cm con balón");
if(okA&&a>=2)e1+=dkK("Tubo por edad (años/4 + 3,5 con balón; años/4 + 4 sin balón)",fxn(Math.floor((a/4+3.5)*2)/2,1)+" con balón; "+fxn(Math.floor((a/4+4)*2)/2,1)+" sin balón");
if(okA&&a>=1)e1+=dkK("Profundidad por edad (años/2 + 12)",fxn(a/2+12,1)+" cm");
const n=ad?7:cb;
e1+=dkK("Rama del laringoscopio",w<12?"Recta (Miller) 1":w<30?"Miller 2 o Macintosh 2":"Macintosh 3")
+dkK("Sonda de aspiración",(n<=3?"6":n<=4.5?"8":n<=6?"10":n<=6.5?"12":"12 a 14")+" Fr")
+dkK("Sonda gástrica",(w<6?"8":w<10?"10":w<=15?"10 a 12":w<=24?"12":n<=6?"12":n<=6.5?"14":"14 a 16")+" Fr")
+dkK("Máscara laríngea (rescate)",lm);}
e1+=`<p class="why">Menor de 1 año: rama recta. Tené a mano tubos de otro número, otra rama y aspiración funcionando.</p>`
+`<p class="rv">⚠ Discrepancia: rama por peso de LITFL 2026 (Miller 1 hasta 11 kg, Miller o Macintosh 2 hasta 29 kg). WikEM indica 1,5 entre 2 y 3 años; Iowa indica 2 desde los 2 años.</p>`
+`<p class="rv">⚠ Discrepancia: profundidad 3 × diámetro (tarjetas de la app, WikEM, que usa el tubo sin balón) frente a años/2 + 12 cm (CATS 2026). Confirmá con capnografía, auscultación y Rx.</p>`;
h+=dkS(1,"Equipo para este peso",e1);
h+=dkS(2,"Preparar y preoxigenar",`<ul class="ck"><li>Definí el plan, el plan de rescate y quién hace cada cosa.</li><li>Dos accesos si se puede, monitor, capnografía y carro de paro cerca.</li><li>Fármacos cargados y rotulados, vasoactivo y sedación listos.</li><li>Oxígeno al 100% durante 3 minutos o más.</li><li>Oxígeno por cánula durante la apnea: menor de 1 año 5 L/min, 1 a 7 años 10 L/min, mayor de 7 años 15 L/min.</li><li>No uses presión cricoidea de rutina (AHA 2020).</li></ul><p class="rv">⚠ Discrepancia: expansión si hay hipotensión antes de intubar: 20 mL/kg (Fórmulas y preparaciones) frente a 10 mL/kg (LITFL 2026).</p>`);
let s3=`<p class="do">Opcional, según el paciente:</p>`
+row("Atropina, 0,02 mg/kg (mín 0,1 mg; máx 0,5 mg), solución 0,1 mg/mL",.02*w,.5,.1,"mg",.1)
+`<p class="why">Tomar 1 mL de ampolla (1 mg/mL) y llevar a 10 mL con Dx5% o SF. Dosis máxima total: 1 mg. Tenela lista por si hay bradicardia.</p>`
+`<p class="rv">⚠ Discrepancia: el CIME 2012 del Garrahan no recomienda diluir la atropina (1 mg/mL, push en 1 a 2 minutos); la tarjeta la lleva a 10 mL.</p>`
+`<p class="rv">⚠ Discrepancia: 0,02 mg/kg (tarjeta Garrahan, Iowa, Yale 2021) frente a 0,01 mg/kg (Fórmulas y preparaciones, sin dosis mínima). Tope 0,5 mg (tarjeta) frente a 1 mg (Yale 2021). Indicación: menores de 2 años (Fórmulas y preparaciones), menores de 5 años o con succinilcolina (Yale 2021), sin uso de rutina (WikEM).</p>`
+row("Fentanilo, 1 mcg/kg (máx 50 mcg)",w,50,50,"mcg")
+`<p class="why">Ampolla 50 mcg/mL: llevar a 5 mL con SF y pasar en 3 a 5 minutos. Dosis máxima acumulada: 100 mcg. Puede dar hipotensión.</p>`
+`<p class="rv">⚠ Discrepancia: fentanilo en push en 1 a 3 minutos (CIME 2012) frente a 3 a 5 minutos (tarjeta).</p>`
+`<p class="rv">⚠ Discrepancia: 1 mcg/kg (tarjeta Garrahan, Iowa, WikEM) frente a 2 mcg/kg (Fórmulas y preparaciones, Yale 2021). Tope por dosis 50 mcg (tarjeta) frente a 300 mcg (Iowa).</p>`
+(okW?dkK("Fentanilo con 2 mcg/kg (máx 100 mcg acumulados)",fm(Math.min(2*w,100))+" mcg"+(2*w>100?" (dosis máxima)":"")):"")
+row("Lidocaína 1%, 1 mg/kg (máx 100 mg), ampolla 10 mg/mL",w,100,10)
+`<p class="why">Opcional en trauma de cráneo (Yale 2021). Sin diluir, push lento.</p>`;
h+=dkS(3,"Premedicación",s3);
const m5=okA&&a<5,mzT=m5?6:10;
let s4=`<p class="do">Elegí UNO, según la hemodinamia:</p>`
+row("Ketamina EV, 1 mg/kg (máx 50 mg), solución 10 mg/mL",w,50,10)
+`<p class="why">Tomar 1 mL de ampolla (50 mg/mL) y llevar a 5 mL con Dx5% o SF. Pasar en al menos 2 minutos. Útil en asma y en inestabilidad. No aprobada en menores de 3 meses (WikEM).</p>`
+row("Ketamina IM, 3 mg/kg (máx 100 mg), ampolla 50 mg/mL",3*w,100,50)
+`<p class="rv">⚠ Discrepancia: 1 mg/kg (tarjeta Garrahan, Fórmulas y preparaciones, Iowa, LITFL 2026) frente a 1 a 2 mg/kg (Merck 2026) y 2 mg/kg (Yale 2021). Tope 50 mg (tarjeta) frente a 5 mg/kg (Yale 2021). IM: 3 mg/kg (tarjeta) frente a 7 mg/kg (Yale 2021).</p>`
+(okW?dkK("Ketamina EV con 2 mg/kg",fm(2*w)+" mg"):"")
+`<p class="rv">⚠ Discrepancia: Fórmulas y preparaciones dice llevar 2 mL a 10 mL y pasar 1 mL/kg; con ampolla de 50 mg/mL serían 10 veces la dosis. Acá se usa la dilución de la tarjeta.</p>`
+row("Midazolam, 0,1 mg/kg (máx < 5 años: 6 mg; ≥ 5 años: 10 mg), solución 1 mg/mL",.1*w,mzT,1)
+`<p class="why">Tomar 1 mL de ampolla (5 mg/mL) y llevar a 5 mL con Dx5% o SF (2 mL a 10 mL si necesitás más). Pasar en 2 a 5 minutos. Puede dar hipotensión y su efecto es variable.</p>`
+(okW&&!okA&&.1*w>6?`<p class="why">Si tiene menos de 5 años, el tope es 6 mg.</p>`:"")
+`<p class="rv">⚠ Discrepancia: 0,1 mg/kg (tarjeta Garrahan, Fórmulas y preparaciones, Iowa) frente a 0,2 mg/kg (Yale 2021).</p>`
+mgo("Etomidato, 0,3 mg/kg (máx 20 mg)",.3*w,20)
+`<p class="why">Sin efecto sobre la presión ni la PIC. Puede frenar la suprarrenal: cuidado en sepsis. No figura en las tarjetas: mirá la concentración de la ampolla.</p>`
+`<p class="rv">⚠ Discrepancia: 0,3 mg/kg (Yale 2021, WikEM) frente a 0,1 a 0,3 mg/kg (Iowa Handbook).</p>`
+dkK("Propofol, 1 a 2 mg/kg (máx 100 mg), ampolla 10 mg/mL",okW?rg(Math.min(w,100),Math.min(2*w,100))+" mg = "+rg(Math.min(w,100)/10,Math.min(2*w,100)/10)+" mL":"—")
+`<p class="why">Baja la presión: evitá en shock. Fuentes: SECIP 2020, Iowa Handbook, Yale 2021.</p>`
+dkK("Tiopental, 5 mg/kg",okW?fm(5*w)+" mg":"—")
+`<p class="why">Hipotensor. Las fuentes no dan tope. Ampolla 1000 mg: mirá la dilución en la calculadora de preparaciones.</p>`
+`<p class="rv">⚠ Discrepancia: el CIME 2012 del Garrahan no recomienda tiopental en push: infusión intermitente en 10 a 60 minutos, 20 a 50 mg/mL.</p>`
+`<p class="rv">⚠ Discrepancia: 5 mg/kg (Iowa, Mazurek 1998) frente a 2 a 3 mg/kg (Pediamécum, dosis del status en la app).</p>`
+`<p><a href="#" data-go="calc" data-open="c-sed" style="color:var(--acc);font-weight:600">Preparaciones de ketamina y tiopental: abrir la calculadora</a></p>`;
h+=dkS(4,"Inductor",s4);
const sc=okA&&a<1?[2*w,2*w]:[w,2*w];
let s5=`<p class="do">Elegí UNO. Dalo enseguida del inductor.</p>`
+row("Rocuronio, 0,5 mg/kg (tarjeta Garrahan), ampolla 10 mg/mL",.5*w,1e9,10)
+row("Rocuronio, 1 mg/kg (secuencia rápida, máx 100 mg), ampolla 10 mg/mL",w,100,10)
+`<p class="why">Sin diluir, push rápido. Actúa en 60 a 90 segundos y dura 30 a 45 minutos. La ampolla va en heladera. Tarjeta: de elección para vía aérea difícil, no usar en hipertensión pulmonar.</p>`
+`<p class="rv">⚠ Discrepancia: 0,5 mg/kg (tarjeta Garrahan) frente a 0,9 a 1,2 mg/kg en secuencia rápida (Pediamécum 2021), 1 mg/kg (CATS 2026, Yale 2021, Iowa) y 1,2 mg/kg (WikEM). Elegí según el protocolo de tu unidad.</p>`
+dkK("Succinilcolina, 1 a 2 mg/kg (lactantes 2 mg/kg, máx 150 mg)",okW?rg(Math.min(sc[0],150),Math.min(sc[1],150))+" mg":"—")
+`<p class="why">No usar con hiperpotasemia, insuficiencia renal, enfermedad neuromuscular, quemaduras o aplastamiento de más de 48 horas ni antecedente de hipertermia maligna. Con atropina a mano. No figura en las tarjetas: mirá la concentración de la ampolla.</p>`
+`<p class="rv">⚠ Discrepancia: 1 a 2 mg/kg (CATS 2026) frente a 1 mg/kg (Iowa, Yale 2021) y 1,5 mg/kg (WikEM). Lactantes: 2 mg/kg (Merck 2026).</p>`
+row("Vecuronio, 0,1 mg/kg, solución 1 mg/mL",.1*w,1e9,1)
+`<p class="why">Reconstituir 10 mg en 10 mL de agua para inyectable o SF. Push rápido. No figura como opción de secuencia rápida (Yale 2021). Las fuentes no dan tope.</p>`;
h+=dkS(5,"Bloqueante neuromuscular",s5);
let s6=`<ul class="ck"><li>Curva de capnografía y auscultación en ambos campos.</li><li>Inflá el balón: presión menor de 20 cmH₂O (CATS 2026).</li><li>Fijá el tubo, colocá la sonda gástrica y pedí Rx.</li><li>Empezá sedación y analgesia: el bloqueante dura más que el inductor.</li><li>Si no podés intubar: ventilá con bolsa y máscara o pasá a máscara laríngea. Avisá enseguida.</li></ul>`
+row("Sugammadex, 4 mg/kg, ampolla 100 mg/mL",4*w,1e9,100)
+`<p class="why">Solo revierte rocuronio y vecuronio. Sin diluir, push rápido en 10 segundos. No reemplaza el manejo de la vía aérea.</p>`
+`<p class="rv">⚠ Discrepancia: 4 mg/kg (tarjeta Garrahan) frente a 16 mg/kg para reversión inmediata (CATS 2026). La ficha técnica recomienda 2 a 4 mg/kg de 2 a 17 años y dice que la reversión inmediata no fue estudiada en niños. La tarjeta de 60 kg da 200 mg, no 240 mg.</p>`
+(okW?dkK("Sugammadex con 16 mg/kg",fm(16*w)+" mg = "+fm(16*w/100)+" mL"):"");
h+=dkS(6,"Después de intubar y rescate",s6);
h+=`<div class="box">Dosis redondeadas: verificá siempre las dosis con la guía y el criterio clínico. Si no dice máximo, las fuentes consultadas no dan tope.</div><p class="src"><b>Fuente:</b> Cards Garrahan 2018 y Fórmulas y preparaciones (transcriptas en la app), Boletín CIME Garrahan 2012, AHA PALS 2020, CATS Intubation v7 2026, Pediamécum AEP rocuronio 2021, SECIP 2020, Yale PICU Book 2021, Iowa Pediatric Critical Care Reference Guide (sin fecha), Iowa Handbook, PEM Cincinnati 2016, LITFL 2026, WikEM, Merck Manual 2026, OMS Pocket Book 2013, ficha técnica de sugammadex. Adicional: no figura en ARUCIP.</p>`;
out.innerHTML=h}
b.oninput=b.onchange=render;render();return()=>{b.oninput=b.onchange=null}}}};;
T.wat={t:"WAT-1: abstinencia iatrogénica",c:{html:(()=>{
const sel=(i,l,o)=>`<label class="f"><span>${l}</span><select id="wa-${i}"><option value="">Sin puntuar</option>${o.map((x,k)=>`<option value="${x[1]}">${x[0]}</option>`).join("")}</select></label>`;
const NS=[["No = 0",0],["Sí = 1",1]];
return `<div class="dk"><p class="sub">Adicional: no figura en ARUCIP. Mide abstinencia a opioides y benzodiacepinas, de 0 a 12 puntos. Verificá siempre con la guía y el criterio clínico.</p>`
+dkS(1,"Cuándo y cómo",`<ul class="ck"><li>Desde el primer día de descenso, si recibió opioides o benzodiacepinas en infusión o dosis regulares durante 5 días o más.</li><li>2 veces por día (8 y 20 h, ± 2 h) hasta 72 horas después de la última dosis, y más seguido si aparecen síntomas.</li><li>Primero revisá la historia de las 12 horas previas.</li><li>Observá en reposo 2 minutos.</li><li>Estímulo progresivo: llamalo por su nombre, tocalo suave y aprovechá un procedimiento doloroso ya previsto, como la aspiración. Si no hay ninguno, presión en el lecho ungueal con una lapicera por menos de 5 segundos.</li><li>Después observá la recuperación.</li></ul>`)
+dkS(2,"Datos de la historia clínica del paciente (12 horas previas)",`<div class="flds" style="display:grid;grid-template-columns:minmax(0,1fr)">${sel(0,"Deposiciones blandas/líquidas",NS)}${sel(1,"Vómitos, arcadas o náuseas",NS)}${sel(2,"Temperatura corporal > 37,8 °C",NS)}</div><p class="why">Contá vómitos y temperatura solo si no se explican por otra causa. Temperatura: el valor más frecuente de las 12 horas.</p>`)
+dkS(3,"Observación de los 2 minutos anteriores al estímulo",`<div class="flds" style="display:grid;grid-template-columns:minmax(0,1fr)">${sel(3,"Estado",[["SBS1 ≤ 0 o Dormido/despierto/calma = 0",0],["SBS1 ≥ +1 o Despierto agitado = 1",1]])}${sel(4,"Temblor",[["Ninguno/leve = 0",0],["Moderado/intenso = 1",1]])}${sel(5,"Sudores",NS)}${sel(6,"Movimientos descoordinados/repetitivos",[["Ninguno/leves = 0",0],["Moderados/intensos = 1",1]])}${sel(7,"Bostezos o estornudos",[["Ninguno o 1 = 0",0],[">2 = 1",1]])}</div><p class="rv">⚠ Discrepancia: el formulario dice «>2» y las instrucciones dicen «más de 1». Con 2 exactos, las instrucciones dan 1 punto.</p>`)
+dkS(4,"Observación de 1 minuto durante el estímulo",`<div class="flds" style="display:grid;grid-template-columns:minmax(0,1fr)">${sel(8,"Se sobresalta al tocarle",[["Nada/leve = 0",0],["Moderado/pronunciado = 1",1]])}${sel(9,"Tono muscular",[["Normal = 0",0],["Aumentado = 1",1]])}</div>`)
+dkS(5,"Recuperación después del estímulo",`<div class="flds" style="display:grid;grid-template-columns:minmax(0,1fr)">${sel(10,"Tiempo hasta recobrar la calma (SBS1 < 0)",[["< 2 minutos = 0",0],["2-5 minutos = 1",1],["> 5 minutos = 2",2]])}</div><p class="rv">⚠ Discrepancia: este ítem dice SBS1 < 0 y el ítem Estado define la calma como SBS1 ≤ 0.</p>`)
+`<div id="wa-out"></div>`
+`<div class="row"><button class="btn g w" id="wa-r" type="button">Limpiar la escala</button></div>`
+`<p class="rv">⚠ Discrepancia: el algoritmo de metadona de la app usa WAT-1 < 3, WAT o SOS > 3 y WAT o SOS < 4. El corte de WAT-1 es ≥ 3.</p>`
+`<p><a href="#" data-tool="metadona" style="color:var(--acc);font-weight:600">Abrir el algoritmo de metadona</a></p><p><a href="#" data-tool="sos" style="color:var(--acc);font-weight:600">Abrir SOS Sophia</a></p><p><a href="#" data-tool="sbs" style="color:var(--acc);font-weight:600">Abrir SBS y RASS</a></p>`
+`<div class="box">Verificá siempre con la guía y el criterio clínico.</div><p class="src"><b>Fuente:</b> WAT-1 Version 1, guía de uso (UCSF, 2023) y versión en español (2014). © 2007 Linda S. Franck and Martha A.Q. Curley, CC BY-ND 2.0. Reprinted with permission from: Franck LS, Harris S, Soetenga D, Amling J, Curley M. Pediatr Crit Care Med 2008;9(6):573-580. Translated by: Corporate Translations, Inc. Adicional: no figura en ARUCIP.</p></div>`})(),
init(b){const out=b.querySelector("#wa-out"),S=[...b.querySelectorAll("select[id^=wa-]")];
function render(){let t=0,m=0;S.forEach(s=>{if(s.value==="")m++;else t+=parseInt(s.value,10)});
let h=`<div class="card"><div class="calc"><h3 class="th">Resultado</h3>${dkK("Puntuación total (0-12)",String(t))}`;
if(m)h+=`<p class="why">Faltan ${m} de 11 ítems.</p>`;
if(t>=3)h+=`<div class="box al">≥ 3: abstinencia iatrogénica.</div>`;
else if(!m)h+=`<p class="do">Menos de 3: por debajo del corte.</p>`;
out.innerHTML=h+`</div></div>`}
b.oninput=b.onchange=render;b.querySelector("#wa-r").onclick=()=>{S.forEach(s=>{s.value=""});render()};render();return()=>{b.oninput=b.onchange=null}}}};;
T.comfb={t:"COMFORT-B: sedación y malestar",c:{html:(()=>{
const N=[1,2,3,4,5].map(x=>`<option value="${x}">${x}</option>`).join("");
const sel=(i,l)=>`<label class="f"><span id="cb-l${i}">${l}</span><select id="cb-${i}"><option value="">Sin puntuar</option>${N}</select></label>`;
const G=`<div class="flds" style="display:grid;grid-template-columns:minmax(0,1fr)">`;
return `<div class="dk"><p class="sub">Adicional: no figura en ARUCIP. Escala conductual de sedación y malestar en niños en terapia intensiva, de 6 a 30 puntos. Solo suma el puntaje y orienta la lectura: no incluye dosis. Verificá siempre con la guía y el criterio clínico.</p>`
+`<p class="rv">⚠ Sin descripciones: el formulario original pide no reproducirlo sin permiso, por eso acá no están los textos de cada puntaje. Puntuá con el formulario de tu servicio y cargá los números.</p>`
+dkS(1,"Cuándo y cómo",`<ul class="ck"><li>Observá 2 minutos sin molestarlo y evaluá el tono muscular al final.</li><li>Esperá 20 minutos después de una intervención, como aspiración o cambio de posición.</li><li>Cada ítem va de 1 (sin malestar) a 5 (malestar intenso).</li><li>No sirve con bloqueante neuromuscular.</li><li>Requiere entrenamiento en la escala.</li></ul>`)
+dkS(2,"Puntaje",G+`<label class="f"><span>Cómo respira</span><select id="cb-v"><option value="v">En ventilación mecánica</option><option value="e">Respiración espontánea</option></select></label>`+sel(0,"Alerta")+sel(1,"Calma/agitación")+sel(2,"Respuesta respiratoria")+sel(3,"Movimiento físico")+sel(4,"Tono muscular")+sel(5,"Tensión facial")
+`<label class="f"><span>Interpretación de enfermería (NISS), opcional</span><select id="cb-n"><option value="">Sin puntuar</option><option value="1">1 = Subsedado</option><option value="2">2 = Sedación adecuada</option><option value="3">3 = Sobresedado</option></select></label></div><p class="why">El NISS aclara los puntajes de 11 a 22.</p>`)
+`<div id="cb-out"></div>`
+`<div class="row"><button class="btn g w" id="cb-r" type="button">Limpiar la escala</button></div>`
+dkS(3,"Cómo leerla",`<ul class="ck"><li>≤ 10: sobresedación. 11 a 22: zona intermedia. ≥ 23: subsedación (Ista 2005).</li><li>SCCM 2022 (PANDEM) recomienda COMFORT-B o SBS para medir la sedación en niños ventilados.</li><li>Validada de 0 a 16 años.</li></ul><p class="rv">⚠ Discrepancia: zona intermedia de 11 a 22 (Ista 2005) frente a 12 a 22 (versión española, Bosch-Alcaraz 2020) y 11 a 23 (Silva 2013).</p><p class="rv">⚠ Discrepancia: para dolor, AEP 2020 usa ≥ 17 y la versión española > 13 (Bosch-Alcaraz 2022).</p>`)
+`<p><a href="#" data-tool="sbs" style="color:var(--acc);font-weight:600">Abrir SBS y RASS</a></p><p><a href="#" data-tool="wat" style="color:var(--acc);font-weight:600">Abrir WAT-1</a></p><p><a href="#" data-tool="sos" style="color:var(--acc);font-weight:600">Abrir SOS Sophia</a></p>`
+`<div class="box">Verificá siempre con la guía y el criterio clínico.</div><p class="src"><b>Fuente:</b> Ista E et al. Pediatr Crit Care Med 2005;6:58-63 y tesis Ista 2008 (Erasmus). van Dijk M et al. Am J Nurs 2005;105:33-36. Smith HAB et al. Pediatr Crit Care Med 2022;23:e74-e110. Mencía S, Tapia R. Protoc diagn ter pediatr 2020;3:51-73. Bosch-Alcaraz A et al. Med Intensiva 2020;44:542-550 y Enferm Intensiva 2022;33:58-66. Silva CC et al. Rev Bras Ter Intensiva 2013;25:306-311. Escala COMFORT: Ambuel B et al.; COMFORT-B: van Dijk M, Erasmus MC. Adicional: no figura en ARUCIP.</p></div>`})(),
init(b){const out=b.querySelector("#cb-out"),V=b.querySelector("#cb-v"),NI=b.querySelector("#cb-n"),S=[0,1,2,3,4,5].map(i=>b.querySelector("#cb-"+i)),L=b.querySelector("#cb-l2");
function render(){let t=0,m=0;S.forEach(s=>{if(s.value==="")m++;else t+=parseInt(s.value,10)});
const lb=V.value==="e"?"Llanto":"Respuesta respiratoria";if(L.getAttribute("data-k")!==lb){L.setAttribute("data-k",lb);L.textContent=lb}
let h=`<div class="card"><div class="calc"><h3 class="th">Resultado</h3>${dkK("Puntaje total (6-30)",m?"—":String(t))}`;
if(m)h+=`<p class="why">Faltan ${m} de 6 ítems.</p>`;
else{if(t<=10)h+=`<div class="box al">≤ 10: sobresedación.</div>`;
else if(t>=23)h+=`<div class="box al">≥ 23: subsedación.</div>`;
else{const n=NI.value;h+=n==="1"?`<div class="box al">11 a 22 con NISS 1: subsedación.</div>`:n==="3"?`<div class="box al">11 a 22 con NISS 3: sobresedación.</div>`:n==="2"?`<p class="do">11 a 22 con NISS 2: sedación adecuada.</p>`:`<p class="do">11 a 22: zona intermedia. Sumá la interpretación de enfermería (NISS).</p>`}
if(t>=17)h+=`<p class="why">≥ 17: considerá dolor y analgesia (AEP 2020).</p>`}
out.innerHTML=h+`</div></div>`}
b.oninput=b.onchange=render;b.querySelector("#cb-r").onclick=()=>{S.forEach(s=>{s.value=""});NI.value="";V.value="v";render()};render();return()=>{b.oninput=b.onchange=null}}}};;
T.tox={t:"Intoxicaciones: antídotos por peso",c:{html:(()=>{
const O=[["para","Paracetamol"],["opio","Opioides"],["bzd","Benzodiacepinas"],["op","Organofosforados y carbamatos"],["alc","Metanol y etilenglicol"],["tca","Antidepresivos tricíclicos"],["ccb","Bloqueantes cálcicos y betabloqueantes"],["sulf","Sulfonilureas"],["cn","Cianuro y monóxido de carbono"],["meth","Metahemoglobinemia"],["fe","Hierro"],["dig","Digoxina"],["inh","Isoniazida"],["dist","Distonía aguda por fármacos"],["la","Anestésicos locales"],["ac","Anticoagulantes orales"],["desc","Descontaminación digestiva"],["hd","Hemodiálisis (EXTRIP)"]];
return `<div class="dk"><p class="sub">Adicional: no figura en ARUCIP. Elegí el tóxico para ver el antídoto calculado por peso. Verificá siempre las dosis con la guía y el criterio clínico.</p>`
+dkS(1,"Primero",`<ul class="ck"><li>Vía aérea, ventilación, circulación, glucemia y ECG.</li><li>Centro Nacional de Intoxicaciones (Hospital Posadas): 0800-333-0160, las 24 horas.</li><li>Unidad de Toxicología, Hospital Gutiérrez: 0800-444-8694, las 24 horas (directorio 2015: verificá el número).</li></ul>`)
+`<div class="card"><div class="calc"><h3 class="th">Datos del paciente</h3><div class="flds">${dkf("tx-p","Peso (kg)")}${dkf("tx-e","Edad en años (opcional)")}</div>`
+`<div class="flds" style="display:grid;grid-template-columns:minmax(0,1fr)"><label class="f"><span>Tóxico</span><select id="tx-s"><option value="">Elegí el tóxico</option>${O.map(x=>`<option value="${x[0]}">${x[1]}</option>`).join("")}</select></label></div>`
+`<div class="flds" id="tx-d" hidden>${dkf("tx-n","Digoxina sérica (ng/mL)")}${dkf("tx-m","Digoxina ingerida (mg)")}</div></div></div>`
+`<div id="tx-out"></div>`
+`<div class="box">Dosis redondeadas: verificá siempre las dosis con la guía y el criterio clínico.</div><p class="src"><b>Fuente:</b> AHA 2025 (Part 10, Cao D et al.) y Tabla 4 de antídotos; AHA 2023 (Lavonas EJ et al.); PALS 2025. Fichas FDA de acetilcisteína, naloxona, flumazenil, fomepizol, bicarbonato, Nithiodote, tiosulfato DBL 2021, Provayblue, desferoxamina, DigiFab e isoniazida. Dart RC et al. JAMA Netw Open 2023. Vega IL et al. Am Fam Physician 2024. Glatstein M et al. Clin Toxicol 2012. Klein-Schwartz W et al. Br J Clin Pharmacol 2016. Guía canadiense de antídotos 2026 y Austin 2023 (etanol). Perth Children's Hospital 2026. Vogt LM et al. Mov Disord 2024. AAP/AAPD 2019. Ghannoum M et al. Kidney Int 2018. Consulta con OpenEvidence, noviembre de 2026. Adicional: no figura en ARUCIP.</p></div>`})(),
init(b){const out=b.querySelector("#tx-out"),sel=b.querySelector("#tx-s"),dg=b.querySelector("#tx-d");
const fm=x=>fxn(x,x<1?3:x<10?2:x<100?1:0),L=`<p class="why">`;
const rg=(a,c,u)=>fm(a)===fm(c)?fm(a)+" "+u:fm(a)+" a "+fm(c)+" "+u;
const cp=(v,m,u)=>fm(Math.min(v,m))+" "+u+(v>m?" (dosis máxima)":"");
const ul=a=>`<ul class="ck">${a.map(x=>`<li>${x}</li>`).join("")}</ul>`;
const lk=(id,t)=>`<p><a href="#" data-tool="${id}" style="color:var(--acc);font-weight:600">${t}</a></p>`;
function render(){const w=dkv(b,"tx-p"),e=dkv(b,"tx-e"),ok=w>0,okE=e>=0,s=sel.value;dg.hidden=s!=="dig";
const kk=(l,v)=>dkK(l,ok?v:"—");
const need=ok?"":dkNeed("el peso");
let h="";
if(s==="para"){const k=Math.min(w,100),v=ok&&w<5?"sin tabla":ok&&w<=20?null:ok&&w<=40?[100,250,500]:[200,500,1000];
const dl=i=>v==="sin tabla"?"sin tabla":v===null?fm([3,7,14][i]*w)+" mL":v[i]+" mL";
h=dkS(2,"Cuándo tratar",ul(["Nomograma desde las 4 horas: solo ingesta aguda única, de liberación inmediata y con hora conocida.","Sin nivel dentro de las 8 horas, hora desconocida, ingesta repetida o toxicidad clínica: iniciá N-acetilcisteína y decidí después."]))
+dkS(3,"N-acetilcisteína EV, 3 bolsas",need+kk("Bolsa 1: 150 mg/kg en 1 hora",fm(150*k)+" mg")+kk("Diluyente de la bolsa 1",dl(0))+kk("Bolsa 2: 50 mg/kg en 4 horas",fm(50*k)+" mg")+kk("Diluyente de la bolsa 2",dl(1))+kk("Bolsa 3: 100 mg/kg en 16 horas",fm(100*k)+" mg")+kk("Diluyente de la bolsa 3",dl(2))
+L+`Diluyente: dextrosa 5%, ClNa 0,45% o agua estéril. El exceso de volumen bajo 40 kg puede dar hiponatremia y convulsiones. Tope de cálculo: 100 kg. Bajo 5 kg la ficha no da tabla.</p><p class="rv">⚠ Discrepancia: 3 bolsas (ficha FDA) frente a 2 bolsas (Perth 2026): 200 mg/kg en 4 horas y 100 mg/kg en 16 horas. Tope de cálculo: 100 kg (ficha y Dart 2023) frente a 110 kg (Perth).</p>`)
+dkS(4,"N-acetilcisteína oral",kk("Carga: 140 mg/kg",fm(140*k)+" mg")+kk("Luego 70 mg/kg cada 4 horas, 17 dosis",fm(70*k)+" mg")+L+`Si vomita dentro de la hora, repetí la dosis.</p>`)
+dkS(5,"Antes de cortar",L+`No cortes a las 21 horas sin reevaluar: paracetamol indetectable, transaminasas en descenso, INR en mejoría y paciente bien.</p>`)}
if(s==="opio"){h=dkS(2,"Naloxona, ampolla 0,4 mg/mL",need+kk("Reversión total: 0,1 mg/kg (máx 2 mg)",cp(.1*w,2,"mg"))+kk("Volumen de ampolla",fm(Math.min(.1*w,2)/.4)+" mL")+kk("Reversión parcial: 0,01 mg/kg",fm(.01*w)+" mg")
+L+`EV, IO, IM o SC, cada 2 a 3 minutos. Infusión: 2/3 de la dosis que lo despertó, por hora. Observá 4 a 6 horas después de la última dosis. En paro, primero RCP.</p><p class="rv">⚠ Discrepancia: PALS 2025 indica 0,1 mg/kg de entrada; la ficha FDA empieza con 0,01 mg/kg y sigue con 0,1 mg/kg si no responde.</p>`+L+`Si recibe opioides de forma crónica: usá la menor dosis eficaz, por el riesgo de abstinencia aguda. No hay protocolo pediátrico específico.</p>`)}
if(s==="bzd"){h=dkS(2,"Flumazenil, ampolla 0,1 mg/mL",need+kk("0,01 mg/kg (máx 0,2 mg) en 15 segundos",cp(.01*w,.2,"mg"))+kk("Volumen de ampolla",fm(Math.min(.01*w,.2)/.1)+" mL")+kk("Tope acumulado: 0,05 mg/kg o 1 mg",cp(.05*w,1,"mg"))
+L+`Repetí cada minuto, hasta 5 dosis. Desde 1 año. La resedación apareció entre 19 y 50 minutos.</p>`+ul(["No lo uses para diagnosticar.","Puede dar convulsiones si hay dependencia de benzodiacepinas.","Precaución en traumatismo de cráneo."])+`<p class="rv">⚠ Discrepancia: Fórmulas y preparaciones incluye infusión de 5 a 10 µg/kg/hora; no figura en la ficha FDA ni en la tabla de la AHA.</p>`)}
if(s==="op"){h=dkS(2,"Atropina",need+kk("0,02 mg/kg EV",fm(.02*w)+" mg")+kk("Duplicá cada 5 minutos",fm(.04*w)+" mg, "+fm(.08*w)+" mg, "+fm(.16*w)+" mg")
+L+`Titulá hasta revertir broncorrea, broncoespasmo y bradicardia. Mantenimiento: 10 a 20% de la dosis total de carga, por hora.</p><p class="rv">⚠ Discrepancia: 0,02 mg/kg (AHA) frente a 0,02 a 0,05 mg/kg con mínimo de 0,1 mg (WikEM).</p>`+L+`Convulsiones o agitación: diazepam o midazolam.</p>`+lk("stat","Abrir Status epiléptico"))
+`<details><summary>Si se consigue: pralidoxima</summary>`+need+kk("20 a 50 mg/kg EV (máx 2000 mg)",rg(Math.min(20*w,2000),Math.min(50*w,2000),"mg"))+kk("Mantenimiento: 10 a 20 mg/kg/hora",rg(10*w,20*w,"mg/h"))+`<p class="rv">⚠ Discrepancia: mantenimiento 10 a 20 mg/kg/hora (AHA) frente a 5 a 10 mg/kg/hora (WikEM). Pasá la carga en 15 a 30 minutos, sin bolo rápido.</p></details>`}
if(s==="alc"){h=dkS(2,"Etanol EV al 10%: opción si no hay fomepizol",need+kk("Carga: 8 a 10 mL/kg en 30 a 60 minutos",rg(8*w,10*w,"mL"))+kk("Mantenimiento: 1 a 2 mL/kg/hora",rg(w,2*w,"mL/h"))+kk("En hemodiálisis: 2 a 3,5 mL/kg/hora",rg(2*w,3.5*w,"mL/h"))
+L+`Meta: etanol 100 a 150 mg/dL. Medí etanol cada hora hasta estabilizar y luego cada 2 a 3 horas. Controlá la glucemia: los niños hacen hipoglucemia. Sin tope en las fuentes: ajustá por nivel. Preferí vía central.</p><p class="rv">⚠ Discrepancia: preparación: 100 mL de etanol 99,5-100% con 900 mL de dextrosa 5% (guía canadiense 2026) frente a 100 mL de etanol 96% en 1000 mL de dextrosa 5% (Austin 2023). En hemodiálisis: 2 a 3,5 mL/kg/hora frente a duplicar la infusión.</p>`)
+dkS(3,"Hemodiálisis y corte",ul(["Hemodiálisis: nivel de 50 mg/dL o más, insuficiencia renal o acidosis grave o progresiva.","Suspendé con nivel indetectable o menor de 20 mg/dL, paciente asintomático y pH normal.","El carbón activado no sirve."]))
+`<details><summary>Si se consigue: fomepizol</summary>`+need+kk("Carga: 15 mg/kg en 30 minutos",fm(15*w)+" mg")+kk("10 mg/kg cada 12 horas, 4 dosis",fm(10*w)+" mg")+kk("Luego 15 mg/kg cada 12 horas",fm(15*w)+" mg")+L+`En hemodiálisis, cada 4 horas. La ficha aclara que la seguridad pediátrica no está establecida.</p></details>`}
if(s==="tca"){h=dkS(2,"Bicarbonato de sodio",need+kk("Bolo: 1 a 3 mEq/kg",rg(w,3*w,"mEq"))+kk("Infusión de solución 150 mEq/L: 1 a 3 mL/kg/hora",rg(w,3*w,"mL/h"))
+L+`La AHA usa 0,5 mEq/mL en niños: si tenés ampolla 1 M (1 mEq/mL), diluí a la mitad. Titulá hasta resolver hipotensión y QRS ancho. Evitá sodio mayor de 150 a 155 mEq/L y pH mayor de 7,50 a 7,55. Vigilá potasio y cloro.</p><p class="rv">⚠ Discrepancia: la ficha FDA dice 2 a 5 mEq/kg en 4 a 8 horas para acidosis metabólica; no es el bolo de tricíclicos.</p>`
+L+`QRS ancho refractario: lidocaína. Emulsión lipídica solo si fallan las medidas estándar.</p>`)}
if(s==="ccb"){h=dkS(2,"Calcio",need+kk("Cloruro de calcio 10%: 20 mg/kg (0,2 mL/kg)",fm(20*w)+" mg = "+fm(.2*w)+" mL")+kk("Infusión: 20 a 40 mg/kg/hora",rg(20*w,40*w,"mg/h"))+kk("Gluconato de calcio 10%: 60 mg/kg (0,6 mL/kg)",fm(60*w)+" mg = "+fm(.6*w)+" mL")+kk("Infusión: 60 a 120 mg/kg/hora",rg(60*w,120*w,"mg/h"))
+L+`Cloruro por vía central. Ajustá por presión, con calcio iónico hasta 1,5 a 2 veces el límite superior. Dosis pediátrica de una sola fuente (AHA).</p>`)
+dkS(3,"Insulina en dosis altas",need+kk("Bolo de insulina regular: 1 U/kg",fm(w)+" U")+kk("Infusión: 1 a 10 U/kg/hora",rg(w,10*w,"U/h"))+kk("Dextrosa: 0,25 a 0,5 g/kg/hora",rg(.25*w,.5*w,"g/h"))
+L+`Glucemia mayor de 100 mg/dL, cada 20 a 30 minutos al inicio. Potasio mayor de 3 mEq/L, control horario.</p><p class="rv">⚠ Discrepancia: inicio 1 a 10 U/kg/hora (AHA), 1 U/kg/hora (CHOP) y 0,5 a 1 U/kg/hora (Graudins 2016). Dextrosa 0,25 g/kg/hora (CHOP) frente a 0,5 g/kg/hora (Graudins). No uses dextrosa 50% sin preparación pediátrica.</p>`)
+dkS(4,"Glucagón",need+kk("0,05 a 0,15 mg/kg",rg(.05*w,.15*w,"mg"))+L+`Sobre todo en betabloqueantes. Preví vómitos. La emulsión lipídica no es de rutina en bloqueantes cálcicos.</p>`)}
if(s==="sulf"){h=dkS(2,"Octreotide",need+kk("1 a 1,5 mcg/kg, cada 6 horas (máx 50 mcg)",ok&&w>=50?"50 mcg (dosis máxima)":ok&&1.5*w>50?fm(w)+" a 50 mcg (dosis máxima)":rg(w,1.5*w,"mcg"))
+L+`EV o SC. Dextrosa solo si hay hipoglucemia y siempre junto con octreotide. Vigilá hipertensión y apnea.</p><p class="rv">⚠ Discrepancia: observar 12 horas tras suspender dextrosa y octreotide (Klein-Schwartz 2016) frente a 24 horas en niños (FPnotebook).</p>`+lk("gluc","Abrir Glucemia"))}
if(s==="cn"){h=dkS(2,"Cianuro: tiosulfato de sodio",need+kk("Tiosulfato de sodio 25% (250 mg/mL): 1,65 mL/kg (412,5 mg/kg)",cp(1.65*w,50,"mL"))
+L+`Sospechá en lesión por inhalación con acidosis láctica mayor de 5 mmol/L que persiste pese a la reanimación. Oxígeno al 100%. Tiosulfato a 2,5 a 5 mL/min. Máximo 50 mL (12,5 g): se alcanza desde 30 kg. Actúa más lento que la hidroxocobalamina. Verificá la concentración de tu ampolla.</p><p class="rv">⚠ Discrepancia: 1,65 mL/kg (ficha DBL 2021, Micromedex y presentación del servicio) frente a 1 mL/kg (ficha Nithiodote, junto con nitrito). Con nitrito, repetir a la mitad si reaparecen los signos.</p>`)
+`<details><summary>Si se consigue: nitrito de sodio</summary>`+need+kk("Nitrito de sodio 30 mg/mL: 0,2 mL/kg (6 mg/kg)",cp(.2*w,10,"mL"))+L+`Se da antes del tiosulfato, a 2,5 a 5 mL/min, vigilando la presión. Mantené metahemoglobina menor de 30%. Con anemia, reducí el nitrito. Precaución bajo 6 meses. Evitalo si también hay monóxido de carbono.</p></details>`
+`<details><summary>Si se consigue: hidroxocobalamina</summary>`+need+kk("70 mg/kg (máx 5 g)",ok&&70*w>5000?"5 g (dosis máxima)":fm(70*w)+" mg")+L+`El tope de 5 g es la dosis de adulto. Puede repetirse. Da hipertensión transitoria y orina roja, y altera laboratorios colorimétricos. Datos pediátricos extrapolados de adultos. No la des por la misma vía que el tiosulfato.</p></details>`
+dkS(3,"Monóxido de carbono",L+`Oxígeno al 100%. No hay criterios pediátricos validados de oxígeno hiperbárico: consultá a toxicología.</p>`)}
if(s==="meth"){h=dkS(2,"Azul de metileno",need+kk("1 mg/kg EV en 5 a 30 minutos",fm(w)+" mg")
+L+`Tratá con síntomas y metahemoglobina mayor de 20%, o sin síntomas con más de 30%. Repetí 1 mg/kg a la hora si sigue mayor de 30% o con síntomas. Diluí en 50 mL de dextrosa 5%, no con cloruro de sodio. Mantené aporte de dextrosa.</p>`
+`<p class="rv">⚠ Contraindicado en déficit de G6PD. Riesgo de síndrome serotoninérgico con opioides, ISRS, IRSN e IMAO: en UCIP pensá en el fentanilo y observá 4 horas.</p><p class="rv">⚠ Discrepancia: máximo 2 dosis (ficha FDA) frente a 5 a 7 mg/kg (AHA). Con 7 mg/kg acumulados puede dar cianosis y hemólisis.</p>`
+L+`Con filtrado de 15 a 59 mL/min/1,73 m²: dosis única. Alternativas: ácido ascórbico y exanguinotransfusión.</p>`)}
if(s==="fe"){h=dkS(2,"Riesgo",ul(["Hasta 20 mg/kg de hierro elemental: no tóxico.","20 a 60 mg/kg: leve a moderado.","Más de 60 mg/kg: grave.","Hierro sérico mayor de 350 µg/dL sugiere toxicidad; mayor de 500 µg/dL es grave."]))
+dkS(3,"Desferoxamina",need+kk("EV hasta 15 mg/kg/hora",fm(15*w)+" mg/h")+kk("Tope por día: 80 mg/kg (máx 6 g)",cp(80*w,6000,"mg"))
+L+`Indicación: acidosis metabólica, shock, gastroenteritis grave o hierro mayor de 500 µg/dL. No esperes el nivel si está grave. Hidratá: puede dar hipotensión. Dosis EV altas se asocian a SDRA. Riesgo de Yersinia.</p><p class="rv">⚠ Discrepancia: ficha FDA: dosis fijas, IM 1000 mg y luego 500 mg, EV solo en colapso, máx 6 g/24 horas, seguridad desde 3 años. Monografía pediátrica 2022: 15 mg/kg/hora, máx 80 mg/kg/día y 6 g/día. Toxicología: hasta 40 mg/kg/hora en riesgo de vida. Los 40 mg/kg/día son de sobrecarga crónica.</p>`+L+`El carbón activado no sirve. Considerá irrigación intestinal.</p>`)}
if(s==="dig"){const n=dkv(b,"tx-n"),m=dkv(b,"tx-m"),okN=ok&&n>0,okM=m>0;
const vi=x=>x===1?"1 vial":x+" viales";h=dkS(2,"Fab antidigoxina, vial 40 mg",(okN?dkK("Con nivel: ng/mL × kg ÷ 100",vi(Math.ceil(n*w/100))):"")+(okM?dkK("Con mg ingeridos, comprimidos: mg × 0,8 ÷ 0,5",vi(Math.ceil(m*.8/.5))):"")+kk("Aguda sin datos",ok&&w<20?"10 viales + 10 si hace falta":"20 viales (o 10 + 10)")+kk("Crónica sin nivel",ok&&w<20?"1 vial":"6 viales")
+L+`Redondeá hacia arriba. Reconstituí con 4 mL (10 mg/mL). Pasá en al menos 30 minutos; bolo solo con paro inminente. Dosis muy chicas: diluí a 1 mg/mL con 36 mL de SF. Vigilá volumen bajo 20 kg.</p>`+ul(["Indicaciones: arritmia con riesgo de vida, potasio mayor de 5 mEq/L tras ingesta aguda, nivel mayor de 15 ng/mL, o mayor de 10 ng/mL a las 6 horas.","Sin respuesta: replanteá que sea digital."]))}
if(s==="inh"){h=dkS(2,"Piridoxina",need+kk("Ingesta desconocida: 70 mg/kg (máx 5 g)",ok&&70*w>5000?"5 g (dosis máxima)":fm(70*w)+" mg")
+L+`Ingesta conocida: 1 g por cada gramo de isoniazida. A 0,5 g/min hasta que cedan las convulsiones; el resto en 4 a 6 horas. Sumá diazepam.</p><p class="rv">⚠ Discrepancia: 70 mg/kg (Lheureux 2005, Ramathibodi 2021) frente a 80 mg/kg en 30 a 60 minutos (consulta sobre la ficha FDA). Máximo: 5 g frente a dosis máxima segura desconocida.</p>`+lk("stat","Abrir Status epiléptico"))}
if(s==="dist"){h=dkS(2,"Difenhidramina",need+kk("1 mg/kg EV (máx 50 mg)",cp(w,50,"mg"))
+L+`Mejora en 10 a 30 minutos. Seguí por vía oral cada 6 horas durante 1 a 2 días: puede recurrir. Tope diario de ficha: 5 mg/kg/día, máx 300 mg.</p>`)
+dkS(3,"Si no alcanza",need+kk("Diazepam 0,1 mg/kg EV (máx 10 mg)",cp(.1*w,10,"mg"))+kk("Lorazepam 0,05 a 0,10 mg/kg EV o IM",rg(.05*w,.1*w,"mg"))
+L+`Observá 12 a 24 horas si hubo compromiso respiratorio. Biperideno: no se encontró dosis pediátrica.</p><p class="rv">⚠ El algoritmo de Vogt 2024 con clonidina e hidrato de cloral es para status distónico, no para distonía por fármacos.</p>`)}
if(s==="la"){const big=ok&&w>70;h=dkS(2,"Emulsión lipídica 20%",need+kk("Bolo: 1,5 mL/kg en 2 a 3 minutos",big?"100 mL":fm(1.5*w)+" mL")+kk("Infusión: 0,25 mL/kg/min hasta 30 minutos",big?"200 a 250 mL en 15 a 20 minutos":fm(.25*w)+" mL/min")+kk("Tope sugerido: 10 mL/kg",fm(10*w)+" mL")
+L+`Repetí el bolo 1 o 2 veces si sigue el colapso. Convulsiones: benzodiacepinas; evitá propofol si está inestable. Evitá vasopresina, bloqueantes cálcicos y betabloqueantes. Más de 70 kg: esquema de adulto.</p><p class="rv">⚠ Discrepancia: bolo en 1 minuto (AAP/AAPD 2019) frente a 2 a 3 minutos (AHA).</p>`)}
if(s==="ac"){h=dkS(2,"Vitamina K y complejo protrombínico",L+`No se encontró dosis pediátrica en 2 fuentes. Consultá a hematología. Si tiene válvula mecánica o Fontan, la vitamina K puede estar contraindicada. Preferí vía EV lenta.</p>`)}
if(s==="desc"){const a=okE?e:-1,gr=ok?rg(.5*w,Math.min(w,50),"g"):"—";
h=dkS(2,"Carbón activado",kk("Dosis única: 0,5 a 1 g/kg (máx 50 g)",gr)
+L+`Idealmente en la primera hora; más tarde según el riesgo. Por tabla: menores de 1 año 10 a 25 g; 1 a 12 años 25 a 50 g. Dosis múltiple: menores de 1 año 1 g/kg, de 1 a 12 años 25 a 50 g, cada 4 a 6 horas, sin sorbitol: carbamazepina, dapsona, fenobarbital, quinina, salicilatos y teofilina.</p>`+ul(["No sirve en hierro, litio, metanol, etilenglicol, etanol ni metformina.","No lo des sin vía aérea protegida ni con obstrucción intestinal.","No intubes solo para darlo."]))
+dkS(3,"Irrigación intestinal",(a>=0?dkK("Según edad",a<.75?"Menor de 9 meses: sin dato":a<6?"500 mL/h":"1000 mL/h"):"")
+L+`9 meses a 5 años: 500 mL/h. 6 años o más: 1000 mL/h, por sonda, hasta efluente claro. Considerala en liberación prolongada, hierro, litio o potasio. No en obstrucción, íleo, perforación, inestabilidad o vía aérea sin proteger.</p>`)
+dkS(4,"Alcalinización en salicilatos",L+`Bicarbonato isotónico a 1,5 veces el mantenimiento. Meta: pH urinario de 7,5 o más y sérico menor de 7,6. Corregí el potasio. No en insuficiencia renal, edema pulmonar o cerebral. La tabla no da bolo pediátrico: ajustalo con toxicología.</p>`)}
if(s==="hd"){h=dkS(2,"Hemodiálisis en intoxicación grave",ul(["Recomendada: salicilatos, metanol, litio, ácido valproico, barbitúricos de acción larga, metformina y talio.","Sugerida: carbamazepina y paracetamol.","No indicada: antidepresivos tricíclicos."])+L+`No hay cortes pediátricos en esta herramienta: mirá la recomendación EXTRIP de cada tóxico y consultá a toxicología.</p>`)}
out.innerHTML=h}
b.oninput=b.onchange=render;render();return()=>{b.oninput=b.onchange=null}}}};;
T.anaf={t:"Anafilaxia paso a paso",c:{html:`<div class="dk"><p class="sub">Adicional: no figura en ARUCIP. La adrenalina IM es la primera droga: no la demores. Verificá siempre las dosis con la guía y el criterio clínico.</p>
<div class="card"><div class="calc"><h3 class="th">Datos del paciente</h3><div class="flds">${dkf("an-p","Peso (kg)")}${dkf("an-e","Edad en años (opcional)")}</div></div></div>
<div id="an-out"></div></div>`,
init(b){const out=b.querySelector("#an-out");
const fm=x=>fxn(x,x<1?3:x<10?2:x<100?1:0),rg=(a,c)=>fm(a)===fm(c)?fm(a):fm(a)+" a "+fm(c);
function render(){const w=dkv(b,"an-p"),a=dkv(b,"an-e"),okW=w>0,okA=a>=0,need=dkNeed("el peso");
const top=okA&&a>12?.5:.3,d=Math.min(.01*w,top),capd=.01*w>top;
let h=dkS(1,"Primeros segundos",`<ul class="ck"><li>Sacá el desencadenante y pedí ayuda.</li><li>Acostalo con las piernas elevadas. Si le cuesta respirar, puede quedar sentado.</li><li>Oxígeno, monitor y acceso EV.</li></ul>`);
let s2=(okW?dkK("Adrenalina IM, 0,01 mg/kg, ampolla 1 mg/mL",fm(d)+" mg = "+fm(d)+" mL"+(capd?" (dosis máxima)":"")):need)
+(okW&&w<10?dkK("Menos de 10 kg: 1 mL de ampolla llevado a 2 mL con SF",fm(d/.5)+" mL"):"")
+(okW&&!okA&&.01*w>.3?`<p class="why">Si tiene más de 12 años, el tope es 0,5 mg.</p>`:"")
+`<p class="why">Máximo: menores de 12 años 0,3 mg; mayores de 12 años 0,5 mg. En la cara anterolateral del muslo, sin diluir salvo en lactantes pequeños. Repetí a los 5 minutos si no responde.</p>`
+`<p class="rv">⚠ Discrepancia: tarjeta Garrahan por peso con tope 0,5 mg sobre los 12 años, frente a AAAAI 2023, tope 0,3 mg en niños y adolescentes. RCUK 2021 usa dosis fijas: menos de 6 meses 0,1 a 0,15 mg; 6 meses a 6 años 0,15 mg; 6 a 12 años 0,3 mg; más de 12 años 0,5 mg.</p>`;
h+=dkS(2,"Adrenalina IM ya",s2);
let s3=(okW?dkK("SF, 10 mL/kg (máx 1000 mL)",fm(Math.min(10*w,1000))+" mL"):"")
+`<p class="rv">⚠ Discrepancia: 10 mL/kg (RCUK 2021) frente a 20 mL/kg antes de intubar con hipotensión (Fórmulas y preparaciones).</p>`
+`<p class="do">Si sigue mal tras 2 dosis IM: anafilaxia refractaria. Mientras preparás la infusión, IM cada 5 minutos.</p>`
+(okW?dkK("Adrenalina EV, 0,1 mcg/kg/min (tarjeta Garrahan)",fm(.6*w)+" mg = "+fm(.6*w)+" mL de ampolla")
+`<p class="why">Vía central de corta permanencia: llevar a 100 mL con Dx5% o SF; 1 mL/h = 0,1 mcg/kg/min. Vía periférica o central de larga permanencia: llevar a 300 mL; 3 mL/h = 0,1 mcg/kg/min.</p>`
+dkK("Alternativa RCUK 2021: 1 mg en 100 mL de SF, 0,5 a 1 mL/kg/h",rg(.5*w,w)+" mL/h"):"")
+`<p class="why">Adrenalina EV: solo con experiencia y monitoreo. Ajustá según respuesta.</p>`;
h+=dkS(3,"Si no responde",s3);
h+=dkS(4,"Después",`<ul class="ck"><li>Antihistamínicos y corticoides no reemplazan a la adrenalina.</li><li>Si hay broncoespasmo, tratalo como crisis asmática.</li><li>Puede haber reacción bifásica entre 1 y 48 horas después.</li><li>Una hora sin síntomas tras resolver hace poco probable la reacción bifásica (AAAAI 2023). Definí la observación según la gravedad.</li></ul><p class="why">Esta herramienta no calcula antihistamínicos, corticoides ni glucagón: no se encontraron dosis para anafilaxia en 2 fuentes.</p><p><a href="#" data-tool="asma" style="color:var(--acc);font-weight:600">Abrir Crisis asmática grave</a></p><p><a href="#" data-tool="sri" style="color:var(--acc);font-weight:600">Abrir Secuencia de intubación rápida</a></p><p><a href="#" data-go="cards" style="color:var(--acc);font-weight:600">Abrir Cards</a></p>`);
h+=`<div class="box">Dosis redondeadas: verificá siempre las dosis con la guía y el criterio clínico.</div><p class="src"><b>Fuente:</b> Cards Garrahan 2018, RCUK Anaphylaxis 2021 y algoritmos pediátricos 2022, AAAAI Anaphylaxis 2023, SAP Arch Argent Pediatr 2015. Adicional: no figura en ARUCIP.</p>`;
out.innerHTML=h}
b.oninput=b.onchange=render;render();return()=>{b.oninput=b.onchange=null}}}};;
T.asma={t:"Crisis asmática grave paso a paso",c:{html:`<div class="dk"><p class="sub">Adicional: no figura en ARUCIP. Mayores de 2 años. Verificá siempre las dosis con la guía y el criterio clínico.</p>
<div class="card"><div class="calc"><h3 class="th">Datos del paciente</h3><div class="flds">${dkf("as-p","Peso (kg)")}</div></div></div>
<div id="as-out"></div></div>`,
init(b){const out=b.querySelector("#as-out");
const fm=x=>fxn(x,x<10?2:x<100?1:0),rg=(a,c)=>fm(a)===fm(c)?fm(a):fm(a)+" a "+fm(c);
function render(){const w=dkv(b,"as-p"),ok=w>0,need=dkNeed("el peso");
const kk=(l,v)=>dkK(l,ok?v:"—"),mg=(d,c)=>fm(Math.min(d,c))+" mg"+(d>c?" (dosis máxima)":"");
let h=dkS(1,"Gravedad",`<ul class="ck"><li>Grave: no completa frases, agitado, SatO₂ menor de 92%, FC mayor de 140 (2 a 5 años) o de 125 (más de 5), FR mayor de 40 (2 a 5 años) o de 30 (más de 5).</li><li>Riesgo vital: confusión, agotamiento, tórax silente, cianosis o hipotensión. Avisá a UCIP.</li></ul>`);
let s2=`<p class="do">Oxígeno para SatO₂ de 94 a 98%.</p>`
+kk("Salbutamol nebulizado, cada 20 minutos las primeras 2 horas",(w<20?"2,5":"5")+" mg")
+kk("Ipratropio nebulizado, las primeras 2 horas","250 mcg")
+`<p class="rv">⚠ Discrepancia: salbutamol 2,5 a 5 mg (RCUK 2022, SIGN 2019); la elección por 20 kg es de Maine 2025. Ipratropio 250 mcg (RCUK 2022, SIGN 2019) frente a 500 mcg (Maine 2025). Con aerosol: 2 a 10 disparos cada 20 minutos (SIGN 2019).</p>`
+`<h5>Corticoide: elegí UNO</h5>`
+kk("Hidrocortisona EV, 1 a 2 mg/kg/dosis cada 6 h (máx 50 mg)",rg(Math.min(w,50),Math.min(2*w,50))+" mg")
+kk("Metilprednisolona, 1 a 2 mg/kg/día en 2 a 3 tomas (máx 60 mg/día)",rg(Math.min(w,60),Math.min(2*w,60))+" mg/día")
+kk("Dexametasona, 0,6 mg/kg cada 24 h (máx 16 mg)",mg(.6*w,16))
+`<p class="rv">⚠ Discrepancia: las 3 dosis son del CIME Garrahan 2021. Hidrocortisona 4 mg/kg cada 4 h (RCUK 2022, SIGN 2019). Metilprednisolona en UCIP: carga 2 mg/kg (máx 60 mg), luego 0,5 a 1 mg/kg cada 6 h (Children's Mercy, CHAM, Maine 2025).</p>`
+(ok?dkK("Metilprednisolona, carga 2 mg/kg (máx 60 mg)",mg(2*w,60)):"");
h+=dkS(2,"Primera hora",s2);
const m1=Math.min(25*w,2000),m2=Math.min(50*w,2000);
let s3=`<p class="do">Sin respuesta a broncodilatadores y corticoide:</p>`
+kk("Sulfato de magnesio 25%, 25 mg/kg (máx 2000 mg), ampolla 250 mg/mL",fm(m1)+" mg = "+fm(m1/250)+" mL")
+kk("Volumen final, a 10 a 60 mg/mL",rg(m1/60,m1/10)+" mL")
+`<p class="why">Diluir con Dx5% o SF. Pasar en 15 a 30 minutos.</p>`
+`<p class="rv">⚠ Discrepancia: 25 mg/kg (tarjeta Garrahan) frente a 25 a 50 mg/kg (Children's Mercy), 50 mg/kg (Maine 2025) y 50 a 75 mg/kg (CHAM). Tope 2 g. Infusión prolongada en UCIP: 15 a 20 mg/kg/h (Taher 2022) según protocolo de la unidad.</p>`
+(ok?dkK("Magnesio con 50 mg/kg (máx 2000 mg)",fm(m2)+" mg = "+fm(m2/250)+" mL"):"");
h+=dkS(3,"Magnesio",s3);
let s4=kk("Salbutamol continuo nebulizado",(w<20?"10":w<40?"15":"20")+" mg/h")
+(ok?`<p class="why">Máximo 40 mg/h (CHAM). LearnPICU llega a cerca de 0,5 mg/kg/h.</p>`:"")
+kk("Adrenalina IM, 0,01 mg/kg (máx 0,5 mg), ampolla 1 mg/mL",fm(Math.min(.01*w,.5))+" mg = "+fm(Math.min(.01*w,.5))+" mL")
+kk("Terbutalina EV, bolo 10 mcg/kg (máx 750 mcg)",fm(Math.min(10*w,750))+" mcg")
+kk("Terbutalina EV, infusión 0,1 a 10 mcg/kg/min",rg(.1*w,10*w)+" mcg/min")
+`<p class="why">Con ECG y TA. Si no figura en tu farmacia, usá el protocolo local.</p>`
+kk("Aminofilina EV, carga 5 mg/kg",fm(5*w)+" mg")
+kk("Aminofilina EV, infusión 0,5 a 0,9 mg/kg/h",rg(.5*w,.9*w)+" mg/h")
+`<p class="why">Controlá niveles: objetivo 10 a 15 mcg/mL. Riesgo de convulsiones y arritmias.</p>`
+`<p class="rv">⚠ Discrepancia: carga 5 mg/kg (CHAM) frente a 5 a 7 mg/kg (Children's Mercy). Objetivo 10 a 15 mcg/mL (CHAM, LearnPICU) frente a 10 a 20 mcg/mL (Children's Mercy). Bolo de terbutalina 4 a 10 mcg/kg (Maine 2025).</p>`
+kk("Ketamina, 1 a 2 mg/kg",rg(w,2*w)+" mg")
+`<p class="why">Si se intuba: Vt bajo, frecuencia baja, espiración larga (I:E 1:4 o más) e hipercapnia permisiva.</p>`
+`<p class="rv">⚠ Discrepancia: Vt 5 a 6 mL/kg (Children's Mercy) frente a 8 mL/kg (LearnPICU). Ketamina en infusión 0,5 a 1 mg/kg/h (Children's Mercy) frente a 1 a 2 mg/kg/h (LearnPICU).</p>`
+`<p class="why">Salbutamol EV: esta herramienta no lo calcula porque no se encontró dosis en 2 fuentes.</p>`
+`<p><a href="#" data-tool="sri" style="color:var(--acc);font-weight:600">Abrir Secuencia de intubación rápida</a></p>`;
h+=dkS(4,"UCIP",s4);
h+=`<div class="box">Dosis redondeadas: verificá siempre las dosis con la guía y el criterio clínico. Las fuentes no dan tope para magnesio en infusión, aminofilina ni ketamina.</div><p class="src"><b>Fuente:</b> Cards Garrahan 2018, Boletín CIME Corticosteroides 2021, RCUK 2022, SIGN 2019, Maine PECC 2025, Children's Mercy, CHAM, LearnPICU, Taher 2022. Adicional: no figura en ARUCIP.</p>`;
out.innerHTML=(ok?"":need)+h}
b.oninput=b.onchange=render;render();return()=>{b.oninput=b.onchange=null}}}};;
T.transf={t:"Transfusiones por peso",c:{html:`<div class="dk"><p class="sub">Adicional: no figura en ARUCIP. Volúmenes y umbrales por componente. Verificá siempre las dosis con la guía y el criterio clínico.</p>
<div class="card"><div class="calc"><h3 class="th">Datos del paciente</h3><div class="flds">${dkf("tr-p","Peso (kg)")}</div></div></div>
<div id="tr-out"></div></div>`,
init(b){const out=b.querySelector("#tr-out");
const fm=x=>fxn(x,x<10?1:0),rg=(a,c)=>fm(a)+" a "+fm(c);
function render(){const w=dkv(b,"tr-p"),ok=w>0;
const kk=(l,v)=>dkK(l,ok?v:"—");
let h=ok?"":dkNeed("el peso");
h+=dkS(1,"Glóbulos rojos",kk("Volumen, 10 a 15 mL/kg",w>20?"1 unidad, cerca de 260 mL":rg(10*w,15*w)+" mL")
+kk("Velocidad, 5 mL/kg/h (máx 150 mL/h)",fm(Math.min(5*w,150))+" mL/h")
+`<p class="why">Más de 20 kg: 1 unidad y reevaluar. 10 mL/kg suben cerca de 2 g/dL. Terminá en menos de 4 horas. En sangrado crítico, tan rápido como haga falta.</p>`
+`<ul class="ck"><li>Hb menor de 7 g/dL sin síntomas: transfundir.</li><li>Hb de 7 a 10 g/dL: solo con signos de oferta de oxígeno insuficiente.</li><li>Hb de 10 g/dL o más: inapropiado salvo causa documentada.</li></ul>`
+`<p class="rv">⚠ Discrepancia: umbrales de la GAP Garrahan 2011 frente a Hb 8 g/dL o menos en UCIP estable, 10 g/dL en lesión cerebral grave y 13 g/dL en cardiopatía cianótica o ECMO (Versiti 2015). Sin umbral único en neonatos.</p>`
+`<p class="rv">⚠ Discrepancia: TAXI 2018 y SSC niños 2020: no transfundir con Hb de 7 g/dL o más si está hemodinámicamente estable. En shock séptico sin sangrado, SSC 2020 sugiere evitar plaquetas y plasma profilácticos.</p>`);
h+=dkS(2,"Plaquetas",kk("Volumen, 10 mL/kg (15 kg o más: 1 unidad)",w>=15?"1 unidad":fm(10*w)+" mL")
+kk("Velocidad, 10 a 20 mL/kg/h",rg(10*w,20*w)+" mL/h")
+`<p class="why">Sube cerca de 30000 a 50000/µL. Respetá el grupo ABO si se puede.</p>`
+`<ul class="ck"><li>Profilaxis: 10000/µL en insuficiencia medular, quimioterapia y trasplante; 20000/µL en ciertos tumores sólidos.</li><li>Sangrado activo por consumo o secuestro: mantener 50000/µL o más.</li><li>Neurocirugía: 100000/µL o más.</li><li>Biopsia hepática, bypass y cirugía mayor en leucemia: 50000/µL o más.</li><li>Catéter central y endoscopía: 40000/µL o más. Fibrobroncoscopía: 30000/µL o más.</li><li>Púrpura trombótica trombocitopénica: contraindicadas salvo hemorragia que amenace la vida.</li></ul>`
+`<p class="rv">⚠ Discrepancia: profilaxis 10000/µL (GAP 2011) frente a 30000/µL y 100000/µL en críticos (Versiti 2015). Volumen: 10 mL/kg (GAP 2011 en neonatos, RCH 2023) frente a 10 a 15 mL/kg en menores de 4 meses y fracciones de unidad por peso (Versiti 2015).</p>`);
h+=dkS(3,"Plasma fresco congelado",kk("Volumen, 10 a 15 mL/kg",rg(10*w,15*w)+" mL")
+kk("CID en paciente crítico, 30 mL/kg",fm(30*w)+" mL")
+kk("Velocidad, 10 a 20 mL/kg/h",rg(10*w,20*w)+" mL/h")
+`<ul class="ck"><li>Indicado: anticoagulantes orales con sangrado grave, hepatopatía grave antes de procedimientos, cirugía cardíaca con sangrado y RIN alterado, déficit aislado sin concentrado, PTT.</li><li>No indicado: profilaxis en CID o cirugía cardíaca, RIN prolongado sin sangrado, reemplazo de volumen, aporte de proteínas.</li><li>Grupo: primero el mismo; luego AB. No uses plasma O en otros grupos salvo situación crítica.</li></ul>`
+`<p class="rv">⚠ Discrepancia: 10 a 15 mL/kg (GAP 2011) frente a 10 a 20 mL/kg (RCH 2023, Versiti 2015). Las fuentes no dan tope en mL; no superes el volumen de adulto.</p>`);
h+=dkS(4,"Crioprecipitado",kk("Volumen, 5 a 10 mL/kg",rg(5*w,10*w)+" mL")
+kk("1 unidad cada 7 kg",ok?Math.ceil(w/7)+" unidades":"—")
+kk("Velocidad, 10 a 20 mL/kg/h",rg(10*w,20*w)+" mL/h")
+`<ul class="ck"><li>Fibrinógeno menor de 100 mg/dL.</li><li>Von Willebrand si no hay concentrado.</li></ul>`
+`<p class="rv">⚠ Discrepancia: la GAP 2011 no da dosis. 5 a 10 mL/kg (RCH 2023) frente a 1 unidad de 20 a 25 mL cada 7 kg (Versiti 2015). Fibrinógeno menor de 100 mg/dL (GAP 2011) frente a 125 mg/dL con sangrado (Versiti 2015). Unidades redondeadas hacia arriba.</p>`);
h+=dkS(5,"Irradiado y leucorreducido",`<ul class="ck"><li>Irradiado: inmunodeficiencia congénita, candidato a trasplante de progenitores, donante familiar, plaquetas HLA, Hodgkin, análogos de purina. Riesgo moderado: leucemia, pretérmino, exanguinotransfusión, cirugía cardiovascular, trasplante de órgano sólido.</li><li>Leucorreducido: 2 o más reacciones febriles, soporte prolongado, prevención de CMV en inmunocomprometidos y lactantes.</li><li>Cardiocirugía en menores de 1 año: glóbulos rojos de hasta 5 días, irradiados y leucorreducidos.</li></ul>`);
h+=`<div class="box">Dosis redondeadas: verificá siempre las dosis con la guía y el criterio clínico. Confirmá con hemoterapia. Solo glóbulos rojos tiene tope de velocidad en las fuentes.</div><p class="src"><b>Fuente:</b> GAP 2011 Garrahan, Uso de Transfusiones en Pediatría; RCH Blood product prescription 2023; Versiti/BCW Pediatric Transfusion Guidelines 2015; TAXI 2018; Surviving Sepsis Campaign niños 2020. Adicional: no figura en ARUCIP.</p>`;
out.innerHTML=h}
b.oninput=b.onchange=render;render();return()=>{b.oninput=b.onchange=null}}}};;
T.stat={t:"Status epiléptico paso a paso",c:{html:`<div class="dk"><p class="sub">Adicional: no figura en ARUCIP. Crisis convulsiva de 5 minutos o más, o crisis repetidas sin recuperar la conciencia. Cargá el peso y seguí los pasos de arriba hacia abajo. Verificá siempre las dosis con la guía y el criterio clínico.</p>
<div class="card"><div class="calc"><h3 class="th">Datos del paciente</h3><div class="flds">${dkf("st-p","Peso (kg)")}<label class="f"><span>Edad (cambia los topes)</span><select id="st-e"><option value="">Sin indicar</option><option value="a">Menor de 2 años</option><option value="b">2 a 4 años</option><option value="c">5 años o más</option></select></label></div></div></div>
<div id="st-out"></div></div>`,
init(b){const out=b.querySelector("#st-out"),E=b.querySelector("#st-e");
const fm=x=>fxn(x,x<10?2:x<100?1:0),rg=(a,c)=>fm(a)===fm(c)?fm(a):fm(a)+" a "+fm(c);
const dm=(mg,conc,top)=>fm(mg)+" mg = "+fm(mg/conc)+" mL"+(top?" (dosis máxima)":"");
function render(){const w=dkv(b,"st-p"),e=E.value,okW=w>0,need=dkNeed("el peso"),menor5=e==="a"||e==="b";
const cap=(d,c)=>[Math.min(d,c),d>c];
const row=(l,d,c,conc)=>{if(!okW)return dkK(l,"—");const r=cap(d,c);return dkK(l,dm(r[0],conc,r[1]))};
const rr=(l,a,c,u)=>dkK(l,okW?rg(a,c)+" "+u:"—");
const ped=(d,lo,hi)=>!okW||e!==""||d<=lo?"":`<p class="why">Si tiene menos de 5 años, el tope es ${lo} mg.</p>`;
const tBz=(lo,hi)=>menor5?lo:hi;
let h="";
h+=dkS(1,"Minuto 0: estabilizar",`<ul class="ck"><li>Anotá la hora de inicio. Vía aérea, oxígeno, monitor (ECG, SatO₂, TA).</li><li>Acceso EV o IO. Si no se logra enseguida, no esperes: pasá a midazolam IM o IN.</li><li>Laboratorio: electrolitos, calcio, magnesio, hemograma, tóxicos y niveles de anticonvulsivantes si los toma.</li><li>Buscá la causa: hipoglucemia, hiponatremia, hipocalcemia, tóxicos, infección del SNC, trauma.</li><li>Glucemia capilar. Si es menor de 60 mg/dL, corregí ya:</li></ul>`
+(okW?dkK("Dextrosa 10%, 5 mL/kg (0,5 g/kg, máx 250 mL)",fm(Math.min(5*w,250))+" mL"):need));
const lz=0.1*w,dzT=tBz(5,10),dz=0.2*w,mzT=tBz(6,10),mz=0.2*w;
let s2=`<p class="do">Elegí UNA. Con acceso EV o IO:</p>`
+row("Lorazepam EV, 0,1 mg/kg (máx 4 mg)",lz,4,4)
+`<p class="why">Ampolla 4 mg/mL, en heladera. Diluir al ½ con SF o Dx5%. Pasar en 2 a 5 minutos.</p>`
+row("Diazepam EV, 0,2 mg/kg (máx < 5 años: 5 mg; ≥ 5 años: 10 mg)",dz,dzT,5)
+`<p class="why">Ampolla 5 mg/mL. Sin diluir, push lento.</p>`+ped(dz,5,10)
+row("Midazolam EV, 0,2 mg/kg (máx < 5 años: 6 mg; ≥ 5 años: 10 mg), solución 1 mg/mL",mz,mzT,1)
+`<p class="why">Tomar 1 mL de ampolla (5 mg/mL) y llevar a 5 mL con Dx5% o SF. Pasar en 2 a 5 minutos.</p>`+ped(mz,6,10)
+`<h5>Sin acceso EV</h5>`
+row("Midazolam IM, 0,2 mg/kg (mismos topes), ampolla 5 mg/mL",mz,mzT,5)
+`<p class="why">Profunda, sin diluir, en músculo grande.</p>`
+row("Midazolam IN, 0,2 mg/kg (mismos topes), ampolla 5 mg/mL",mz,mzT,5)
+`<p class="why">Con atomizador. Con volumen grande, la mitad en cada fosa nasal.</p>`
+rr("Diazepam rectal, 0,3 a 0,5 mg/kg (máx 10 mg)",Math.min(.3*w,10),Math.min(.5*w,10),"mg")
+`<p class="rv">⚠ Discrepancia: midazolam EV 0,2 mg/kg (tarjeta Garrahan) frente a 0,1 mg/kg, máx 5 mg (CPS 2021).</p>`
+(okW?dkK("Midazolam EV con 0,1 mg/kg",fm(Math.min(.1*w,5))+" mg"):"")
+`<p class="rv">⚠ Discrepancia: midazolam IN 0,2 mg/kg (tarjeta Garrahan, CPS 2021) frente a 0,5 mg/kg, máx 10 mg (Fórmulas y preparaciones). Midazolam IM: 0,2 mg/kg (tarjeta) frente a dosis fija de 5 mg entre 13 y 40 kg y 10 mg con más de 40 kg (AES 2016).</p>`
+`<p class="rv">⚠ Discrepancia: diazepam EV 0,2 mg/kg (tarjeta Garrahan; AES 2016: 0,15 a 0,2 mg/kg, máx 10 mg) frente a 0,3 mg/kg (CPS 2021). Diazepam rectal: 0,3 a 0,5 mg/kg, máx 10 mg (Fórmulas y preparaciones) frente a 0,2 a 0,5 mg/kg, máx 20 mg (AES 2016).</p>`;
h+=dkS(2,"Minuto 5: primera benzodiacepina",s2);
h+=dkS(3,"Minuto 10: segunda dosis",`<p class="do">Si sigue 5 minutos después de la primera dosis, repetí una vez. No más de 2 dosis en total, contando las prehospitalarias.</p><p class="why">Más dosis aumentan la depresión respiratoria. Prepará ya el fármaco de segunda línea.</p><p class="rv">⚠ Discrepancia: la tarjeta Garrahan dice «dosis máxima total» para diazepam y midazolam; AES 2016 y CPS 2021 dan el máximo por dosis. Con 2 dosis el total puede superar el tope: revisalo antes de repetir.</p>`);
const pht=Math.min(20*w,1500),tp=okW?Math.ceil(Math.max(pht/w,pht/50)):0;
let s4=`<p class="do">Si sigue: elegí UNA, EV o IO, sin demoras.</p><p class="why">AES 2016 la ubica entre los minutos 20 y 40; SECIP 2023 la adelanta a los minutos 10 a 15.</p>`
+row("Fenitoína, 20 mg/kg (máx 1500 mg), ampolla 50 mg/mL",20*w,1500,50)
+(okW?`<p class="why">Tiempo mínimo a no más de 1 mg/kg/min ni 50 mg/min: ${tp} minutos.</p>`:"")
+`<p class="why">Diluir solo en SF. Lavar con SF. Cuidado con la extravasación. ECG y TA durante la carga.</p>`
+`<p class="rv">⚠ Discrepancia: la tarjeta Garrahan indica pasarla en 15 minutos hasta 30 kg y en 30 minutos desde 35 kg; 20 mg/kg en 15 minutos son 1,33 mg/kg/min, más que el límite de 1 mg/kg/min (CPS 2021, SECIP 2023). Tope 1500 mg (tarjeta, SECIP 2023) frente a 1000 mg (CPS 2021).</p>`
+`<p class="rv">⚠ Discrepancia: el CIME del Garrahan da carga de 15 a 20 mg/kg y hasta 1 a 3 mg/kg/min en niños (máx 50 mg/min). Fenobarbital: hasta 2 mg/kg/min, máx 30 mg/min en niños.</p>`
+row("Fenobarbital, 20 mg/kg (máx 1000 mg), ampolla 50 mg/mL",20*w,1000,50)
+`<p class="why">Sin diluir o al ½ con SF, en 15 minutos (tarjeta) a 20 minutos (CPS 2021). Riesgo de apnea e hipotensión, sobre todo tras benzodiacepinas.</p>`
+`<p class="rv">⚠ Discrepancia: 20 mg/kg (tarjeta Garrahan, CPS 2021) frente a 15 mg/kg (AES 2016). Fórmulas y preparaciones: 15 a 20 mg/kg.</p>`
+row("Levetiracetam, 20 mg/kg (tarjeta Garrahan, máx 1500 mg), ampolla 100 mg/mL",20*w,1500,100)
+row("Levetiracetam, 60 mg/kg (AES 2016, máx 4500 mg), ampolla 100 mg/mL",60*w,4500,100)
+`<p class="why">Diluir con SF o Dx5%. Pasar en al menos 15 minutos. Ajustar en insuficiencia renal.</p>`
+`<p class="rv">⚠ Discrepancia: 20 mg/kg (tarjeta Garrahan) frente a 60 mg/kg (AES 2016, CPS 2021; CPS: máx 3000 mg). Fórmulas y preparaciones: 20 a 40 mg/kg. Las 2 cifras están calculadas: elegí según el protocolo de tu unidad.</p>`
+row("Ácido valproico, 20 mg/kg (tarjeta Garrahan, máx 1000 mg), ampolla 100 mg/mL",20*w,1000,100)
+row("Ácido valproico, 40 mg/kg (AES 2016, máx 3000 mg), ampolla 100 mg/mL",40*w,3000,100)
+`<p class="why">Diluir con Dx5% o SF. Pasar en 15 minutos. No usar con disfunción hepática. Evitar en menores de 2 años sin causa clara o con sospecha de enfermedad metabólica (SECIP 2023).</p>`
+`<p class="rv">⚠ Discrepancia: 20 mg/kg (tarjeta Garrahan) frente a 40 mg/kg (AES 2016). Fórmulas y preparaciones: 30 a 45 mg/kg. CPS 2021: 30 mg/kg. Las 2 cifras están calculadas: elegí según el protocolo de tu unidad.</p>`
+`<p><a href="#" data-go="cards" style="color:var(--acc);font-weight:600">Volumen de dilución por peso: abrir Cards</a></p>`;
h+=dkS(4,"Minuto 20: segunda línea",s4);
const pure=w>=50,cMz=Math.min(.1*w,5);
let s5=`<p class="do">Si sigue: terapia intensiva, vía aérea asegurada, EEG continuo y vasoactivos listos.</p><p class="why">Infusión anestésica titulada hasta el cese clínico y eléctrico. Mantener 24 a 48 horas sin crisis antes de descender lento (NCS 2012). AES 2016 también admite repetir un fármaco de segunda línea.</p>`
+`<p><a href="#" data-go="ck" data-open="d-intub" style="color:var(--acc);font-weight:600">Abrir el checklist de Intubación</a></p>`
+`<p><a href="#" data-go="calc" data-open="c-sed" style="color:var(--acc);font-weight:600">Preparaciones de ketamina y tiopental: abrir la calculadora</a></p>`
+`<h5>Midazolam</h5>`
+row("Bolo, 0,2 mg/kg (máx 10 mg), ampolla 5 mg/mL",.2*w,10,5)
+(okW?dkK("Inicio, 0,1 mg/kg/h",fm(.1*w)+" mg/h = "+fm(.1*w/cMz)+" mL/h")
+dkK("Rango, 0,1 a 1,6 mg/kg/h",rg(.1*w,1.6*w)+" mg/h = "+rg(.1*w/cMz,1.6*w/cMz)+" mL/h")
+dkK("Preparación (tarjeta Garrahan)",pure?"120 mg puros = 24 mL":fm(2.4*w)+" mg = "+fm(2.4*w/5)+" mL, llevar a 24 mL")
+`<p class="why">${pure?"Goteo puro: 1 mL/h = "+fxn(5/w,2)+" mg/kg/h.":"Con Dx5% o SF: 1 mL/h = 0,1 mg/kg/h."}</p>`:need)
+`<p class="rv">⚠ Discrepancia: techo de 1,6 mg/kg/h (Fórmulas y preparaciones, Hasbro) frente a 2 mg/kg/h (Vanderbilt 2024, SECIP 2023, Becker 2023). Bolo 0,2 mg/kg (Vanderbilt 2024, SECIP 2023, Becker 2023) frente a 0,1 mg/kg (Hasbro).</p>`
+`<h5>Ketamina</h5>`
+rr("Bolo, 0,5 a 3 mg/kg",.5*w,3*w,"mg")
+rr("Infusión, 1 a 10 mg/kg/h",w,10*w,"mg/h")
+`<p class="rv">⚠ Discrepancia: Fórmulas y preparaciones da bolo 0,5 a 3 mg/kg e infusión 1 a 10 mg/kg/h; Vanderbilt 2024, SECIP 2023 y Hasbro dan bolo 1 a 2 mg/kg y máximo 6 mg/kg/h.</p>`
+`<h5>Tiopental</h5>`
+rr("Bolo, 2 a 3 mg/kg (Pediamécum)",2*w,3*w,"mg")
+rr("Infusión, 1 a 5 mg/kg/h",w,5*w,"mg/h")
+`<p class="why">Concentración máxima 20 mg/mL por vía central. No compartir lumen con midazolam. Causa hipotensión y acumulación.</p>`
+`<p class="rv">⚠ Discrepancia: bolo 2 a 3 mg/kg (Pediamécum) frente a 3 a 5 mg/kg (SECIP 2023). Infusión 1 a 5 mg/kg/h (Fórmulas y preparaciones, Pediamécum) frente a 1 a 6 mg/kg/h (SECIP 2023).</p>`
+`<h5>Otros</h5><p class="why">Menor de 2 años: piridoxina 100 mg por SNG (tarjeta Garrahan; sin presentación EV).</p><p class="rv">⚠ Discrepancia: SECIP 2023 indica piridoxina 100 mg EV en menores de 3 años con causa desconocida.</p><p class="why">Pentobarbital y propofol: según el protocolo de tu unidad; esta herramienta no los calcula.</p>`;
h+=dkS(5,"Minuto 40: estado refractario",s5);
h+=`<div class="box">Dosis redondeadas: verificá siempre las dosis con la guía y el criterio clínico.</div><p class="src"><b>Fuentes:</b> Tarjetas del Hospital Garrahan (transcripción no oficial, en Cards). AES: Glauser T, et al. Epilepsy Curr 2016. CPS, Acute Care Committee, 2021. NCS: Brophy GM, et al. Neurocrit Care 2012. SECIP, protocolo de estatus epiléptico 2020, revisado 2023. Vanderbilt Children's, guía de status epiléptico 2024. Becker LL, et al. Front Neurol 2023. Hasbro Children's (Brown Health), sin fecha. Pediamécum (AEP). Fórmulas y preparaciones de esta app.</p>`;
out.innerHTML=h}
b.oninput=b.onchange=render;render();return()=>{b.oninput=b.onchange=null}}}};;
T.ehh={t:"Estado hiperosmolar hiperglucémico: paso a paso",c:{html:`<div class="dk"><p class="sub">Protocolo ordenado en el tiempo, basado en la GAP 2025 del Garrahan. No es una CAD: <b>la insulina no se da al inicio</b>. Es una emergencia: asistir donde haya cuidados intensivos.</p>
<div class="card"><div class="calc"><h3 class="th">Datos del paciente</h3><div class="flds">${dkf("h-p","Peso real (kg, máx. 70 para los cálculos)")}${dkf("h-glu","Glucemia (mg/dL)")}</div><div class="flds">${dkf("h-na","Sodio plasmático (mEq/L)")}${dkf("h-ph","pH venoso (opcional)")}</div><div class="flds">${dkf("h-bic","Bicarbonato (mEq/L, opcional)")}${dkf("h-dg","Descenso de glucemia en la última hora (mg/dL/h)")}</div><label class="f"><span>Cetonas</span><select id="h-ket"><option value="">Sin dato</option><option value="0">Ausentes o leves</option><option value="1">Moderadas o altas</option></select></label></div></div>
<div id="h-out"></div></div>`,
init(b){const out=b.querySelector("#h-out");
function render(){const p=dkv(b,"h-p"),glu=dkv(b,"h-glu"),na=dkv(b,"h-na"),ph=dkv(b,"h-ph"),bic=dkv(b,"h-bic"),dg=dkv(b,"h-dg"),ket=b.querySelector("#h-ket").value,w=Math.min(p,70),hasW=w>0;
const osm=na>0&&glu>0?2*na+glu/18:NaN;let h="";
const crit=[["Glucemia &gt;600 mg/dL",glu>0?glu>600:null],["Osmolalidad efectiva ≥320 mOsm/kg",isFinite(osm)?osm>=320:null],["pH &gt;7,3",ph>0?ph>7.3:null],["Bicarbonato &gt;15 mEq/L",bic>=0?bic>15:null],["Cetonas ausentes o leves",ket===""?null:ket==="0"]];
const bad=crit.some(c=>c[1]===false),unk=crit.some(c=>c[1]===null);
h+=`<div class="grav ${bad?"g3":unk?"g0":"g1"}">${bad?"No cumple todos los criterios de EHH":unk?"Completá los datos para confirmar el diagnóstico":"Cumple criterios de EHH"}<small>${bad?"Puede tratarse de una CAD o de una superposición: revisar el diagnóstico antes de seguir este plan.":"Diagnóstico: glucemia &gt;600, osmolalidad efectiva ≥320, pH &gt;7,3, bicarbonato &gt;15 y cetonas ausentes o leves."}</small></div>`;
h+=`<div class="box">${crit.map(c=>`${c[1]===null?"◻︎":c[1]?"✔︎":"✖︎"} ${c[0]}`).join("<br>")}${isFinite(osm)?`<br><b>Osmolalidad efectiva: ${fxn(osm,1)} mOsm/kg</b> (2 × Na + glucemia/18; normal 275–295)`:""}${na>0&&glu>0?`<br>Sodio corregido: ${fxn(na+2*((glu-100)/100),1)} mEq/L`:""}</div>`;
h+=dkS(1,"Hora 0: líquidos de inicio",hasW?`<p class="do">SF 0,9% 20 mL/kg en push = ${fxn(20*w)} mL</p><p class="why">Con peso real (máximo 70 kg). No dar insulina ni bicarbonato.</p>`:dkNeed("el peso real"));
let s2;
if(!hasW)s2=dkNeed("el peso real");
else{const sc=dkSC(w),tot=Math.min(6000*sc,10500);
s2=`<p class="do">Pasar a ${fxn(tot/24,1)} mL/h (${fxn(tot)} mL en 24 h) más las pérdidas concurrentes, incluida la diuresis</p><p class="why">Superficie corporal ${fxn(sc,2)} m² × 6000 mL/m²/día, máximo 10.500 mL.</p>`
+dkK("Solución","Agua destilada, sin dextrosa")+dkK("Sodio","125 mEq/L")+dkK("Potasio","40 mEq/L, solo si hay diuresis y función renal adecuada")}
h+=dkS(2,"Plan de hidratación de 24 horas",s2);
const row=(txt,act,on)=>`<tr class="${on?"on":""}"><td>${txt}</td><td>${act}</td></tr>`;
const r1=dg>=0&&dg<50,r2=dg>=50&&dg<=100,r3=dg>100||(glu>0&&glu<=250);
h+=dkS(3,"Cada hora: qué hacer según la glucemia",`<p class="why">Medir la glucemia cada hora. Según cuánto baja con la hidratación sola:</p><table><tr><th>Descenso de glucemia</th><th>Conducta</th></tr>${row("Menos de 50 mg/dL por hora",hasW?"Comenzar insulina EV continua 0,05 U/kg/h = "+fxn(0.05*w,2)+" U/h (con 1 U/mL: "+fxn(0.05*w,2)+" mL/h)":"Comenzar insulina EV continua 0,05 U/kg/h",r1)}${row("50 a 100 mg/dL por hora","Seguir sin insulina y sin dextrosa",r2)}${row("Más de 100 mg/dL por hora, o glucemia ≤250","Agregar dextrosa al 2,5%",r3)}</table>${glu>0&&glu<=250?`<p class="why">La glucemia está en ${fxn(glu)} mg/dL (≤250): agregar dextrosa 2,5%.</p>`:""}`);
h+=dkS(4,"Metas y límites de seguridad",`<ul class="ck"><li>Bajar el sodio <b>no más de 0,5 mEq/L por hora</b></li><li>Bajar la osmolalidad <b>no más de 3 mOsm/L por hora</b></li><li>Bicarbonato: <b>contraindicado</b></li></ul>`);
h+=dkS(5,"Complicaciones a vigilar",`<ul class="ck"><li><b>Trombosis venosa:</b> evitar los accesos centrales</li><li><b>Rabdomiólisis:</b> pedir CPK</li><li><b>Hipertermia maligna</b></li></ul>`);
h+=`<p class="src"><b>Fuente:</b> GAP 2025 Garrahan, estado hiperosmolar hiperglucémico. La tabla de conducta por glucemia sigue las reglas de esa guía.</p>`;
out.innerHTML=h}
b.oninput=b.onchange=render;render();return()=>{b.oninput=b.onchange=null}}}};;
T.natr={t:"Hipo / hiper natremia y Na corregido",c:wire(BX(`<h3 class="th">Hipo / hiper natremia: correcciones</h3><p class="hint">Completá los campos requeridos y aparecerán los resultados de HIPO-natremia, HIPER-natremia o HIPER-natremia extrema (>175 mEq/L). Valores válidos: Na real menor de 135 o mayor de 145 mEq/L.</p>
${F_("w","Peso (kg)")}${F_("na","Na real (mEq/L)")}${F_("nd","Na deseado (mEq/L)")}${F_("ch","Cambio por hora deseado (mEq/L/hora)","0.5")}
${S_("ih","Infusión para corregir HIPO-Na",NAI.map(x=>x[0]))}${S_("ir","Infusión para corregir HIPER-Na",NAH.map(x=>x[0]))}${F_("nx","O escribí la concentración de Na usada (mEq/L), opcional")}
${OUT("r")}<p class="hint">Si el Na de la infusión es superior a la natremia, no aporta agua libre y por lo tanto no mejorará la hipernatremia.</p>
<p class="hint">Fuentes: Adrogué HJ, Madias NE. Hyponatremia. N Engl J Med 2000. Adrogué HJ, Madias NE. Hypernatremia. N Engl J Med 2000. Schwaderer AL, Schwartz GJ. Treating hypernatremic dehydration. Pediatr Rev 2005.</p>`)+
BX(`<h3 class="th">Hipernatremia severa (&gt;175 mEq/L) con compromiso hemodinámico</h3><p class="hint">Usar fisiológico (154 mEq/L) para expandir puede causar un descenso exagerado de la natremia. Si la velocidad que propone Adrogué-Madias es muy lenta, hay autores que proponen expandir con una solución no menor a 15 mEq/L por debajo de la natremia (por ej., con natremia de 195, expandir con 180 mEq/L). Esta calculadora mezcla fisiológico (154 mEq/L) con sodio hipertónico.</p>
${F_("v0","Volumen de fisiológico al que se agregará ClNa hipertónico (ml)")}${F_("pc","% de ClNa hipertónico a utilizar (3%, 20%, 7%...)")}${OUT("x")}`)+
BX(`<h3 class="th">Na corregido en hiperglucemia</h3>${F_("gn","Natremia (mEq/L o mmol/L)")}${F_("gg","Glucemia (mg%)")}${OUT("g")}<p class="hint">En situaciones de hiperglucemia, usar la natremia corregida para la toma de decisiones. Fórmulas: Katz 1973 = Na medido + 0,016 × (glucemia − 100); Hillier 1999 = Na medido + 0,024 × (glucemia − 100). Fuentes: Katz MA. N Engl J Med 1973;289(16):843-4. Hillier TA, et al. Am J Med 1999;106(4):399-403.</p>`),b=>{
const w=nn(b,"w"),na=nn(b,"na"),nd=nn(b,"nd"),ch=nn(b,"ch")>0?nn(b,"ch"):0.5,ih=sv(b,"ih"),ir=sv(b,"ir"),nx=nn(b,"nx");let o="";
if(w>0&&na>0&&nd>0){const act=0.6*w,d=nd-na,hrs=Math.abs(d)/ch;
 if(na<135){const dk=d*0.6,dt=dk*w,agua=act*(1-na/nd),cl=dt/0.5,infNa=nx>0?nx:(ih!=null?NAI[ih][1]:NaN);
  o=BG_("Hiponatremia: déficit de Na",sf(dk)+" mEq/kg = "+sf(dt)+" mEq")+P_("Exceso de agua libre",sf(agua)+" L = "+sf(agua*1000/w)+" ml/kg")+
  P_("Corrección clásica con ClNa 3%","Déficit de Na pasado a ClNa 3% = "+sf(cl/w)+" ml/kg = "+sf(cl)+" ml en total, a "+sf(cl/hrs)+" ml/hora para subir "+sf(Math.abs(d))+" mEq/L en "+sf(hrs)+" h. Esta ecuación no tiene en cuenta el agua que se agrega con la corrección, por lo que sobreestima el resultado (la natremia sube siempre menos). El ClNa 3% tiene 0,513 mEq/ml; se redondea a 0,5.");
  if(infNa>na){const dl=(infNa-na)/(act+1),mlh=ch/dl*1000;o+=P_("Adrogué-Madias","Con una infusión de "+sf(infNa)+" mEq/L de Na, a "+sf(mlh)+" ml/hora subiría "+sf(ch)+" mEq/L por hora (≈ "+sf(ch*hrs)+" mEq/L en "+sf(hrs)+" h). Cada litro de esa infusión sube la natremia unos "+sf(dl)+" mEq/L.")}
  else if(infNa>0)o+=WN_("La infusión elegida no tiene más Na que el paciente: no corrige la hiponatremia.");
  o+=WN_("La ecuación no toma en cuenta diuresis, natriuresis ni otras pérdidas o ganancias de agua o sodio. Límite habitual de ascenso: 0,5 mEq/L/h y 10–12 mEq/L en 24 h.")}
 else if(na>145){const aguaL=act*(na/nd-1),exNa=(na-nd)*0.6,infNa=nx>0?nx:(ir!=null?NAH[ir][1]:NaN);
  o=BG_("Hipernatremia: déficit de agua libre",sf(aguaL*1000/w)+" ml/kg = "+sf(aguaL)+" L")+P_("En caso de intoxicación salina","Exceso de Na = "+sf(exNa)+" mEq/kg = "+sf(exNa*w)+" mEq en total.");
  if(isFinite(infNa)){if(infNa<na){const dl=(infNa-na)/(act+1),mlh=(-ch)/dl*1000;o+=P_("Adrogué-Madias","Con una infusión de "+sf(infNa)+" mEq/L de Na, a "+sf(mlh)+" ml/hora bajaría "+sf(ch)+" mEq/L por hora (≈ "+sf(Math.abs(d))+" mEq/L en "+sf(hrs)+" h).")+(infNa<30?WN_("Habitualmente se recomienda no usar por vía EV Na menor de 30–40 mEq/L. El agua (0 mEq/L) se administra solo por vía digestiva."):"")}
   else o+=WN_("Si el Na de la infusión es superior a la natremia, no aporta agua libre y no mejorará la hipernatremia.")}
  if(na>175)o+=WN_("Hipernatremia severa (>175 mEq/L): ver la calculadora de más abajo para expandir con una solución de Na no menor a 15 mEq/L por debajo de la natremia.");
  o+=WN_("La ecuación no toma en cuenta diuresis, natriuresis ni otras pérdidas o ganancias de agua o sodio. Descenso máximo habitual: 0,5 mEq/L/h y 10–12 mEq/L en 24 h.")}
 else o=WN_("Valores válidos solo para Na real menor de 135 o mayor de 145 mEq/L.")}
setO(b,"r",o);
const v0=nn(b,"v0"),pc=nn(b,"pc");let x="";
if(na>0&&v0>0&&pc>0){const tg=na-15,cc=pc*1000/58.5;if(tg<=154)x=WN_("Para esta natremia, el objetivo (natremia − 15 = "+sf(tg)+" mEq/L) no supera el fisiológico: no hace falta agregar hipertónico.");else if(tg>=cc)x=WN_("El sodio hipertónico elegido no alcanza esa concentración.");else{const ml=v0*(tg-154)/(cc-tg),vf=v0+ml;x=P_("Resultado","Para un Na del paciente de "+sf(na)+" y un Na de infusión deseado de "+sf(tg)+" mEq/L: a "+sf(v0)+" ml de fisiológico, agregar "+sf(ml)+" ml de ClNa al "+sf(pc)+"%.")+P_("Solución final",sf(vf)+" ml con "+sf(tg)+" mEq/L; se puede usar como expansión de 10–20 ml/kg hasta compensar la hipovolemia arterial efectiva.")}}
setO(b,"x",x);
const gn=nn(b,"gn"),gg=nn(b,"gg");setO(b,"g",gn>0&&gg>0?P_("Natremia corregida Katz",sf(gn+0.016*(gg-100))+" mEq/L")+P_("Natremia corregida Hillier",sf(gn+0.024*(gg-100))+" mEq/L"):"")})};;
T.eab={t:"Estado ácido-base",c:wire(BX(`<h3 class="th">Calcula pH según PaCO2 y bicarbonato</h3>${F_("a1","PaCO2 (mmHg)")}${F_("a2","Bicarbonato (mEq/L)")}${OUT("a")}`)+BX(`<h3 class="th">Calcula PaCO2 necesaria para un pH deseado</h3>${F_("b1","pH objetivo")}${F_("b2","Bicarbonato medido (mEq/L)")}${OUT("b")}`)+BX(`<h3 class="th">Calcula bicarbonato necesario para un pH deseado</h3>${F_("c1","pH objetivo")}${F_("c2","PaCO2 medida (mmHg)")}${OUT("c")}<p class="hint">Ecuación de Henderson: [H+] (nmol/L) = 24 × PaCO2 / HCO3. pH = 9 − log10([H+]).</p>`),b=>{
const pa=nn(b,"a1"),ba=nn(b,"a2");setO(b,"a",pa>0&&ba>0?(()=>{const h=24*pa/ba;return P_("[H+]",sf(h)+" nmol/L")+BG_("pH",R(9-Math.log10(h),2))})():"");
const ph=nn(b,"b1"),bb=nn(b,"b2");setO(b,"b",ph>0&&bb>0?(()=>{const h=Math.pow(10,9-ph);return P_("1er paso: [H+] objetivo",sf(h)+" nmol/L")+BG_("PaCO2 necesaria",R(h*bb/24,1)+" mmHg")})():"");
const pc=nn(b,"c1"),cc=nn(b,"c2");setO(b,"c",pc>0&&cc>0?(()=>{const h=Math.pow(10,9-pc);return P_("1er paso: [H+] objetivo",sf(h)+" nmol/L")+BG_("Bicarbonato necesario",R(24*cc/h,1)+" mEq/L")})():"")})};;
T.gluc={t:"Glucosa / dextrosa parenteral",c:wire(BX(`<p>Todo lo que necesita resolver del aporte parenteral de glucosa, en 3 herramientas: 1) conocer o definir aportes con 2 valores; 2) aporte de glucosa de hasta 3 infusiones simultáneas; 3) preparación de una solución dextrosada específica.</p>`)+
BX(`<h3 class="th">Herramienta 1. Definir / conocer aportes de glucosa</h3><p class="hint">Ingresá 2 valores conocidos o deseados y dejá en blanco el que querés averiguar.</p>${F_("g1","Aporte de agua (ml/kg/día)")}${F_("g2","Concentración de dextrosa (g%)")}${F_("g3","Flujo de glucosa (mg/kg/min)")}${OUT("o1")}<p class="hint">Ecuaciones: flujo = (ml/kg/día × g% × 10) / 1440; ml/kg/día = (flujo × 1440) / (g% × 10); g% = (flujo × 1440) / (ml/kg/día × 10). 1 g de dextrosa = 3,4 cal.</p>`)+
BX(`<h3 class="th">Herramienta 2. Aporte de glucosa con hasta 3 infusiones simultáneas</h3>${F_("hp","Peso (kg)")}${F_("h1","1.ª infusión (ml/hora)")}${F_("d1","1.ª dextrosa (g%, 0 si no contiene glucosa)")}${F_("h2","2.ª infusión (ml/hora)")}${F_("d2","2.ª dextrosa (g%)")}${F_("h3","3.ª infusión (ml/hora)")}${F_("d3","3.ª dextrosa (g%)")}${OUT("o2")}`)+
BX(`<h3 class="th">Herramienta 3. Preparación de solución dextrosada específica</h3><p class="hint">Ingresá el dextrosado deseado, la concentración de glucosa de las 2 soluciones y el volumen total que querés indicar o preparar.</p>${F_("k1","Concentración deseada (dextrosa g%)")}${F_("k2","Solución 1: dextrosa en g% (por ej. 5)")}${F_("k3","Solución 2: dextrosa en g% (0 para agua u otra solución sin dextrosa)")}${F_("k4","Volumen total deseado (ml; habitualmente 500, 100 o 50)")}${OUT("o3")}`),b=>{
const a=nn(b,"g1"),c=nn(b,"g2"),f=nn(b,"g3"),k=[a,c,f].filter(x=>isFinite(x)).length;let o="";
if(k===2){let A=a,C=c,Fl=f;if(!isFinite(Fl))Fl=A*C*10/1440;else if(!isFinite(A))A=Fl*1440/(C*10);else C=Fl*1440/(A*10);const g=Fl*1440/1000;
 o=P_("ml/kg/día",sf(A))+P_("Concentración de dextrosa",sf(C)+" g%")+P_("Flujo",sf(Fl)+" mg/kg/min")+P_("Glucosa",sf(g)+" g/kg/día")+P_("Calorías",sf(g*3.4)+" cal/kg/día")+(C<=12.5?WN_("Apto vía periférica: el dextrosado no supera el 12,5%."):WN_("Necesita vía central: el dextrosado es mayor de 12,5%."))}
else if(k>0)o=WN_("Ingresá exactamente 2 de los 3 valores.");setO(b,"o1",o);
const p=nn(b,"hp"),hs=[1,2,3].map(i=>nn(b,"h"+i)),ds=[1,2,3].map(i=>nn(b,"d"+i));let o2="";
if(p>0){let ml=0,mg=0;for(let i=0;i<3;i++){const h=isFinite(hs[i])?hs[i]:0,d=isFinite(ds[i])?ds[i]:0;ml+=h;mg+=h*d*10}
 if(ml>0){const fl=mg/60/p,g=fl*1440/1000;o2=P_("Volumen",sf(ml*24/p)+" ml/kg/día")+P_("Flujo de glucosa",sf(fl)+" mg/kg/min")+P_("Aporte de glucosa",sf(g)+" g/kg/día")+P_("Calorías por glucosa",sf(g*3.4)+" cal/kg/día")}}
setO(b,"o2",o2);
const C=nn(b,"k1"),s1=nn(b,"k2"),s2=nn(b,"k3"),V=nn(b,"k4");let o3="";
if(C>=0&&s1>=0&&s2>=0&&V>0&&b.querySelector('[data-c="k1"]').value!==""){const lo=Math.min(s1,s2),hi=Math.max(s1,s2);if(s1===s2||C<lo||C>hi)o3=WN_("Con las 2 soluciones indicadas no se puede preparar el dextrosado deseado.");else{const V1=V*(C-s2)/(s1-s2),V2=V-V1,r1=Math.round(V1),r2=Math.round(V-r1);o3=P_("Volumen solución 1",sf(V1)+" ml (redondeado "+r1+" ml)")+P_("Volumen solución 2",sf(V2)+" ml (redondeado "+r2+" ml)")+P_("Volumen total",sf(V)+" ml")+P_("Dextrosa exacta post redondeo",sf((r1*s1+r2*s2)/V)+" g%")}}
setO(b,"o3",o3)})};;
T.fosk={t:"Calculadoras para hipofosfatemia e hipokalemia",c:wire(BX(`<h3 class="th">Hipofosfatemia: corrección EV</h3><p class="hint">Basada en el Boletín CIME del Hospital Garrahan, "Electrolitos" (2022). Se consideran "niños" los menores de 50 kg. En obesidad se sugiere usar el peso corporal ideal. Presentación: fosfato de potasio o de sodio, ampolla de 3 mmol de fósforo/mL (1 mmol = 31 mg). La ampolla de fosfato de K aporta 4,4 mEq de K/mL; la de fosfato de Na, 4 mEq de Na/mL.</p>
${F_("pw","Peso (kg)")}<div data-g="k">${S_("pk","Fósforo sérico (mg/dL), niños (<50 kg)",["< 1","1 - 1,4","1,5 - 1,9"])}</div><div data-g="a">${S_("pa","Fósforo sérico (mg/dL), adultos (≥50 kg)",["< 1,5","1,6 - 2,2","2,3 - 3"])}</div>
${S_("pv","Vía EV de administración",["Vía periférica","Vía central"])}${S_("ps","Tipo de fósforo (sal)",["Fosfato de potasio","Fosfato de sodio"])}${F_("ph","¿En cuántas horas? (4 a 12 h)","4")}${OUT("p")}
<h3 class="th">Mantenimiento EV de fósforo para 24 h</h3><p class="hint">Niños: mantenimiento de 15 a 45 mg/kg/día (dosis de inicio 15; máximo 45 mg/kg/día). Adultos: dosis máxima de mantenimiento EV 2170 mg.</p>${F_("pm","Dosis en mg/kg de P para 24 h")}${OUT("m")}`)+
BX(`<h3 class="th">Hipokalemia severa: corrección EV</h3><p class="hint">Dosis, dosis máxima y velocidad según el Boletín CIME Garrahan "Electrolitos" (2022) y "Uso seguro del potasio". En obesidad, usar el peso corporal ideal. Presentación: cloruro de potasio 3 M (1 ml = 3 mEq). Dilución periférica a 60 mEq/L; central a 150 mEq/L.<br><b>Hipokalemia severa = K sérico ≤2 mEq/L o sintomáticos (clínica o ECG).</b> Corrección EV 0,5 a 1 mEq/kg; dosis máxima 40 mEq/dosis; velocidad 0,25 a 0,5 mEq/kg/hora (máxima 20 mEq/h).</p>
${F_("kw","Peso (kg)")}${S_("kd","Dosis (mEq/kg)",["0,5","1"])}${S_("kv","Vía EV",["Vía central","Vía periférica"])}${OUT("k")}<p class="hint">Fuentes: Boletín CIME Garrahan, Electrolitos (actualización 2022); GAP 2015 Uso seguro del potasio; Boletín CIME junio 2020 (dosificación en obesos pediátricos).</p>`),b=>{
const w=nn(b,"pw");const kid=!(w>=50);
b.querySelector('[data-g="k"]').hidden=!kid;b.querySelector('[data-g="a"]').hidden=kid;
const rk=kid?sv(b,"pk"):sv(b,"pa"),pv=sv(b,"pv"),ps=sv(b,"ps"),hh=nn(b,"ph")>0?nn(b,"ph"):4;let o="";
if(w>0&&rk!=null&&pv!=null&&ps!=null){const mgk=kid?[10,5,2.5][rk]:[20,10,5][rk],mg=mgk*w,mmol=mg/31,ml=mmol/3,cmax=pv===0?0.05:0.12,vmin=mmol/cmax,tmin=mmol/w/0.06,tt=Math.max(hh,tmin);
 o=BG_("Corrección con "+(ps===0?"fosfato de potasio":"fosfato de sodio"),sf(ml)+" ml ("+sf(mg)+" mg de P = "+sf(mmol)+" mmol)")+P_("Dosis por kg",sf(mgk)+" mg/kg de fósforo elemental"+(kid?" en 4–6 h":(rk===0?" en 8–12 h":" en 4–6 h"))+"; repetir hasta fósforo 2 mg/dL")+P_("Dilución","Diluir hasta al menos "+sf(vmin)+" ml con solución fisiológica o dextrosa 5% (concentración máxima "+(pv===0?"periférica 0,05":"central 0,12")+" mmol/ml)")+P_("Administración","En "+sf(tt)+" h por vía "+(pv===0?"periférica":"central")+" con bomba de infusión (~"+sf(vmin/tt)+" ml/hora). Velocidad: "+sf(mmol/w/tt)+" mmol/kg/h; máxima recomendada 0,06 mmol/kg/h.")+P_("Aporte de "+(ps===0?"potasio":"sodio"),sf(ml*(ps===0?4.4:4))+" mEq ("+sf(ml*(ps===0?4.4:4)/w)+" mEq/kg)");
 if(tt<hh-1e-9||tmin>hh)o+=WN_("El tiempo elegido superaba la velocidad máxima de 0,06 mmol/kg/h; se ajustó a "+sf(tt)+" h.");
 o+=WN_("Elegir la sal según el sodio y el potasio del paciente. Monitoreo cardíaco con infusión intermitente o dosis altas. No administrar en insuficiencia renal severa. Incompatible con calcio y magnesio.")}
setO(b,"p",o);
const pm=nn(b,"pm");setO(b,"m",w>0&&pm>0?(()=>{const mg=pm*w,ml=mg/31/3;return P_("Dosis de P total para 24 h",sf(mg)+" mg")+P_("En ml de ampolla (3 mmol/ml)",sf(ml)+" ml")+P_("Diluir para vía central a",sf(mg/31/0.12)+" ml")+P_("Diluir para vía periférica a",sf(mg/31/0.05)+" ml")+(pm>45?WN_("Supera la dosis máxima de 45 mg/kg/día."):"")})():"");
const kw=nn(b,"kw"),kd=sv(b,"kd"),kz=sv(b,"kv");let ko="";
if(kw>0&&kd!=null&&kz!=null){const dose=[0.5,1][kd],me=dose*kw,cap=Math.min(me,40),ml=cap/3,vol=cap/(kz===0?150:60)*1000,t1=cap/Math.min(0.5*kw,20),t2=cap/(0.25*kw);
 ko=BG_("Cloruro de potasio 3 M",sf(ml)+" ml ("+sf(cap)+" mEq)")+P_("Diluir en","hasta "+sf(vol)+" ml ("+(kz===0?"vía central a 150 mEq/L":"vía periférica a 60 mEq/L")+")")+P_("Administrar en","entre "+sf(t1)+" y "+sf(t2)+" h por vía "+(kz===0?"central":"periférica")+" con bomba de infusión (velocidad 0,25–0,5 mEq/kg/h, sin superar 20 mEq/h)");
 if(me>40)ko+=WN_("La dosis calculada ("+sf(me)+" mEq) supera la dosis máxima de 40 mEq/dosis; se limitó a 40 mEq.");
 ko+=WN_("Monitoreo ECG continuo. Corregir también el magnesio y controlar el potasio seriado.")}
setO(b,"k",ko)})};;
T.ccv=(function(){
const F=n=>isFinite(n)?String(parseFloat(n.toPrecision(3))).replace(".",","):"–";
const K60=1000/60;
/* K: factor para pasar (cantidad/volumen) a dosis por kg por unidad de tiempo con 1 mL/h */
const DR={
adre:{n:"Adrenalina",pres:"ampolla 1 mg/mL x 1 mL",au:"mg",st:1,du:"mcg/kg/min",K:K60,lo:.03,hi:.3,sol:"Dx5% o SF",
 rec:(w,v)=>({amt:(w<30?.6:.3)*w,vol:v=="vc"?100:300}),cm:{vc:.32,vp:.08},cmu:"mg/mL",
 nt:["No administrar pura.","Se inactiva en contacto con soluciones alcalinas, como el bicarbonato de sodio.","En obesidad usar peso corporal ideal (PCI)."]},
nora:{n:"Noradrenalina",pres:"ampolla 1 mg/mL x 4 mL",au:"mg",st:1,du:"mcg/kg/min",K:K60,lo:.03,hi:.3,sol:"Dx5%",
 rec:(w,v)=>({amt:(w<30?.6:.3)*w,vol:v=="vc"?100:300}),cm:{vc:.32,vp:.016},cmu:"mg/mL",cmn:"La concentración máxima por vía periférica (0,016 mg/mL, 4 mg en 250 mL) está sugerida en la bibliografía.",
 nt:["Sin dosis máxima.","En obesidad usar PCI."]},
dobu:{n:"Dobutamina",pres:"frasco ampolla 12,5 mg/mL x 5 mL",au:"mg",st:12.5,du:"mcg/kg/min",K:K60,lo:2,hi:10,us:6,mx:20,sol:"Dx5% o SF",
 rec:(w,v)=>({amt:12*w,vol:50}),cm:{vc:5,vp:2},cmu:"mg/mL",nt:["Dosis habitual 6 mcg/kg/min. Dosis máxima 20 mcg/kg/min.","En obesidad usar PCI."]},
dopa:{n:"Dopamina",pres:"ampolla 20 mg/mL x 5 mL",au:"mg",st:20,du:"mcg/kg/min",K:K60,lo:2,hi:10,us:6,mx:20,sol:"Dx5% o SF",
 rec:(w,v)=>({amt:12*w,vol:50}),cm:{vc:8,vp:3.2},cmu:"mg/mL",nt:["Dosis habitual 6 mcg/kg/min. Dosis máxima 20 mcg/kg/min.","En obesidad usar PCI."]},
esmo:{n:"Esmolol",pres:"ampolla 250 mg/mL x 20 mL",au:"mg",st:250,du:"mcg/kg/min",K:K60,lo:25,hi:500,sol:"Dx5% o SF",
 rec:(w,v)=>w<6?{amt:1000,vol:100}:{amt:5000,vol:250},cm:{vc:20},cmu:"mg/mL",nt:["Ver protocolo.","En obesos usar PCI."]},
fenil:{n:"Fenilefrina (infusión)",pres:"ampolla 10 mg/mL x 1 mL",au:"mg",st:10,du:"mcg/kg/min",K:K60,lo:.1,hi:.5,sol:"Dx5% o SF",
 rec:(w,v)=>w<15?{amt:.6*w,vol:100}:{amt:10,vol:100},cm:{vc:.1,vp:.1},cmu:"mg/mL",cmn:"Concentración máxima 0,1 mg/mL; en reportes aislados se administró a 0,4 mg/mL.",
 nt:["Se recomienda vía central: alto riesgo de necrosis tisular si se extravasa.","En obesidad usar PCI."]},
iso:{n:"Isoproterenol",pres:"ampolla 0,2 mg/mL x 5 mL",au:"mg",st:.2,du:"mcg/kg/min",K:K60,lo:.05,hi:2,sol:"Dx5% o SF",
 rec:(w,v)=>w<10?{amt:.6*w,vol:100}:{amt:6,vol:100},cm:{vc:.064,vp:.064},cmu:"mg/mL",nt:["En obesidad usar PCI."]},
levo:{n:"Levosimendán",pres:"frasco ampolla 12,5 mg, reconstituir con 5 mL (2,5 mg/mL)",au:"mg",st:2.5,du:"mcg/kg/min",K:K60,lo:.05,hi:.2,us:.1,sol:"Dx5% únicamente",
 rec:(w,v)=>w<=10?{amt:2.5,vol:50}:w<25?{amt:6.25,vol:100}:{amt:12.5,vol:250},cm:{vc:.1,vp:.1},cmu:"mg/mL",
 nt:["Carga opcional: 6 mcg/kg en 30 minutos. Usar la misma preparación para la carga y luego el mantenimiento, ajustando la velocidad.","Dosis máxima 12,5 mg/día. Ver protocolo.","En obesidad usar PCI."]},
mil:{n:"Milrinona",pres:"frasco ampolla 1 mg/mL x 10 mL",au:"mg",st:1,du:"mcg/kg/min",K:K60,lo:.25,hi:.75,us:.5,sol:"Dx5% o SF",
 rec:(w,v)=>v=="vc"?(w<30?{amt:.72*w,vol:24}:{conc:1}):(w<15?{amt:.72*w,vol:24}:{amt:12,vol:24}),cm:{vc:1,vp:.5},cmu:"mg/mL",
 nt:["Dosis habitual pediátrica 0,5 mcg/kg/min. En falla renal y neonatos 0,25 mcg/kg/min.","Incompatible con furosemida (precipita).","En obesidad usar peso corporal total (PCT)."]},
nitro:{n:"Nitroprusiato de sodio",pres:"frasco ampolla 25 mg/mL x 2 mL",au:"mg",st:25,du:"mcg/kg/min",K:K60,lo:.5,hi:4,mx:10,sol:"Dx5% únicamente",
 rec:(w,v)=>w<15?{amt:6*w,vol:100}:{amt:100,vol:100},cm:{vc:1,vp:1},cmu:"mg/mL",
 nt:["No se recomienda usar más de 4 mcg/kg/min por más de 72 h. Dosis máxima 10 mcg/kg/min.","Monitorizar metahemoglobina y tiocianato con dosis altas o uso prolongado.","Proteger de la luz la solución a infundir; no hace falta cubrir la línea de administración.","En obesidad usar PCT."]},
alpro:{n:"Alprostadil (prostaglandinas)",pres:"ampolla 500 mcg/mL x 1 mL",au:"mcg",st:500,du:"mcg/kg/min",K:1/60,lo:.05,hi:.1,mx:.4,sol:"Dx5% o SF",
 rec:(w,v)=>({amt:250,vol:50}),cm:{vc:20,vp:20},cmu:"mcg/mL",nt:["Dosis inicial 0,05–0,1 mcg/kg/min; mantenimiento 0,01–0,05. Titular hasta la mínima dosis efectiva. Dosis máxima 0,4 mcg/kg/min.","Ver protocolo."]},
vaso:{n:"Vasopresina",pres:"ampolla 20 UI/mL x 1 mL",au:"UI",st:20,du:"UI/kg/min",K:1/60,lo:.0003,hi:.002,mx:.002,sol:"Dx5% o SF",
 rec:(w,v,x)=>w<30?(x>0?{amt:x,vol:24}:{need:"Ingresá las UI a diluir (2 a 15 UI en menores de 30 kg) para calcular."}):{amt:20,vol:24},cm:{vc:1},cmu:"UI/mL",x:true,
 nt:["Menores de 30 kg: 2–15 UI hasta 24 mL. 30 kg o más: 20 UI hasta 24 mL.","Controlar niveles de sodio plasmático."]},
cacl:{n:"Calcio cloruro (infusión)",pres:"ampolla 100 mg/mL x 10 mL",au:"mg",st:100,du:"mg/kg/h",K:1,lo:5,hi:10,sol:"Dx5% o SF",
 rec:(w,v)=>w>=10?{amt:1200,vol:24}:{need:"En menores de 10 kg: calcular la dosis (5–10 mg/kg/h; 0,05–0,1 mL/kg/h de la ampolla) y diluirla hasta 24 mL, según el protocolo."},cm:{vc:50},cmu:"mg/mL",
 nt:["Administrar siempre por vía central. Concentración máxima 50 mg/mL (PALS); otras fuentes sugieren 20 mg/mL.","Incompatible con ringer lactato y bicarbonato de sodio."]}
};
const ORD=["adre","nora","dobu","dopa","mil","levo","iso","fenil","nitro","esmo","vaso","alpro","cacl"];
const DAY={
amio:{n:"Amiodarona (infusión continua)",pres:"ampolla 50 mg/mL x 3 mL",un:"mg/kg/día",lo:5,hi:10,cm:{vc:6,vp:2},cmu:"mg/mL",mxT:2200,mxU:"mg/día",sol:"Dx5% únicamente",
 nt:["5–10 mg/kg/día; puede llegar a 20 mg/kg/día en refractarios; ECMO hasta 30 mg/kg/día.","Dosis máxima 2200 mg/día (taquicardia ventricular en adultos).","Las concentraciones menores de 0,6 mg/mL son inestables. En obesidad usar PCT.","Una vez calculada la dilución, dividir los mL totales por 24 para que la dosis se administre en 24 h."],f:d=>d},
lido:{n:"Lidocaína (infusión continua)",pres:"frasco ampolla 10 mg/mL x 20 mL",un:"mcg/kg/min",lo:20,hi:50,cm:{vc:8,vp:8},cmu:"mg/mL",mxT:4*1440,mxU:"mg/día (4 mg/min)",sol:"Dx5% o SF",
 nt:["Dosis máxima 50 mcg/kg/min o 4 mg/min. No exceder 20 mcg/kg/min en shock o falla hepática o cardíaca.","Reducir la dosis si la infusión se prolonga más de 24 h (riesgo de acumulación).","Carga por peso corporal total, mantenimiento por peso ideal."],f:d=>d*1.44}
};
const BO=[
{n:"Adenosina",pr:"ampolla 3 mg/mL x 2 mL",a:w=>"1.ª dosis: <b>"+F(Math.min(.1*w,6))+" mg</b> ("+F(Math.min(.1*w,6)/3)+" mL puros). 2.ª dosis: <b>"+F(Math.min(.2*w,12))+" mg</b> ("+F(Math.min(.2*w,12)/3)+" mL).",i:"0,1 mg/kg (máx 6 mg); 2.ª dosis 0,2 mg/kg (máx 12 mg). Push rápido por vena periférica de un miembro superior elevado, seguido de lavado con SF (dos jeringas con llave de tres vías). Vida media 10 segundos. En obesidad usar PCT."},
{n:"Adrenalina (PCR)",pr:"ampolla 1 mg/mL",a:w=>"<b>"+F(Math.min(.01*w,1))+" mg</b> = <b>"+F(Math.min(.1*w,10))+" mL</b> de la dilución 1:10.000.",i:"0,01 mg/kg o 0,1 mL/kg de la dilución 1:10.000 (1 mL de ampolla llevado a 10 mL). Dosis máxima 1 mg (10 mL). No administrar pura."},
{n:"Atropina",pr:"ampolla 1 mg/mL",a:w=>"<b>"+F(Math.min(Math.max(.02*w,.1),.5))+" mg</b> = <b>"+F(Math.min(Math.max(.02*w,.1),.5)*10)+" mL</b> de la dilución 1:10.000.",i:"0,02 mg/kg o 0,2 mL/kg de 1:10.000. En pediatría: dosis mínima 0,1 mg y máxima 0,5 mg (adultos 0,4 a 1 mg). Dosis menores de 0,1 mg pueden causar bradicardia paradójica. Repetir una sola vez."},
{n:"Calcio cloruro (bolo)",pr:"ampolla 100 mg/mL",a:w=>"<b>"+F(.1*w)+" a "+F(.2*w)+" mL</b> ("+F(10*w)+" a "+F(20*w)+" mg).",i:"0,1 a 0,2 mL/kg (10–20 mg/kg). Diluir al medio y administrar en 3 a 5 minutos por vía central, con agua destilada en el push. Incompatible con ringer lactato y bicarbonato."},
{n:"Amiodarona (carga)",pr:"ampolla 50 mg/mL",a:w=>"<b>"+F(3*w)+" a "+F(5*w)+" mg</b> ("+F(3*w/50)+" a "+F(5*w/50)+" mL de ampolla).",i:"3–5 mg/kg/dosis, máximo acumulado 15 mg/kg (adultos 300 mg y luego 150 mg). Diluir hasta 10–15 mg/mL en Dx5%: sin pulso en 3–5 min; con pulso en 20–60 min."},
{n:"Fenilefrina (bolo)",pr:"ampolla 10 mg/mL",a:w=>"<b>"+F(10*w)+" a "+F(100*w)+" mcg</b> = <b>"+F(.1*w)+" a "+F(w)+" mL</b> de la doble dilución (0,1 mg/mL).",i:"10–100 mcg/kg. Doble dilución: 1 mL de ampolla a 10 mL (1 mg/mL) y luego 1 mL de esa solución a 10 mL (0,1 mg/mL). Administrar en 20–30 segundos, preferentemente por vía central."},
{n:"Lidocaína (bolo)",pr:"frasco ampolla 10 mg/mL",a:w=>"<b>"+F(w)+" mg</b> = <b>"+F(w/10)+" mL</b> puros.",i:"1 mg/kg/dosis, IV push puro. Dosis máxima acumulada 3 mg/kg o 300 mg en 1 hora. Se puede repetir un segundo bolo si entre el push y el goteo pasan más de 15 minutos."}
];
const opts=ORD.map(k=>`<option value="${k}">${DR[k].n}</option>`).join("")+Object.keys(DAY).map(k=>`<option value="${k}">${DAY[k].n}</option>`).join("");
const html=`<div class="dk"><p class="sub">Lineamientos para infusiones, antiarrítmicos y vasoactivos en pacientes pre y postoperatorio de cirugía cardíaca congénita (CCV). Es una calculadora aparte de las calculadoras generales. Fuente: «Lineamientos en el uso de inotrópicos, vasoactivos y antiarrítmicos en pacientes pre/POP de CCV», Bellagamba P, Bruno F; revisor Brandoni D; actualización 8/2026. Verificá siempre contra el documento original y el protocolo de tu unidad.</p>
<div class="card"><div class="calc"><h3 class="th">Datos</h3>
${dkf("cv-w","Peso (kg)")}
<label class="f"><span>Droga</span><select id="cv-d">${opts}</select></label>
<label class="f"><span>Vía de administración</span><select id="cv-v"><option value="vc">Central</option><option value="vp">Periférica</option></select></label>
<div id="cv-x" hidden>${dkf("cv-ui","UI de vasopresina a diluir en 24 mL (2 a 15 UI)")}</div>
<div id="cv-dd">${dkf("cv-dose","Dosis deseada (opcional)")}</div></div></div>
<div id="cv-out"></div>
<h3 class="th" style="margin:22px 4px 6px">Bolos y dosis intermitentes por peso</h3><div id="cv-bol"></div></div>`;
return {t:"Cardiología: infusiones y bolos (pre/POP CCV)",c:{html,init(b){
const g=id=>b.querySelector("#"+id),out=g("cv-out"),bol=g("cv-bol");
function bolos(w){if(!(w>0)){bol.innerHTML=dkNeed("el peso");return}
 bol.innerHTML=BO.map(x=>`<div class="card"><div class="calc"><b>${x.n}</b><small style="display:block;color:var(--mut)">${x.pr}</small><p style="margin:8px 0 4px">${x.a(w)}</p><p class="hint" style="margin:0">${x.i}</p></div></div>`).join("")}
function render(){const w=dkv(b,"cv-w"),k=g("cv-d").value,via=g("cv-v").value;bolos(w);
 const day=DAY[k];g("cv-x").hidden=k!=="vaso";
 g("cv-dd").querySelector("span").textContent=day?"Dosis ("+day.un+")":"Dosis deseada ("+DR[k].du+"), opcional";
 g("cv-dose").placeholder=day?(day.lo+"–"+day.hi):"0";
 if(!(w>0)){out.innerHTML=dkNeed("el peso");return}
 const dose=dkv(b,"cv-dose");
 if(day){const lim=day.cm[via];const nt=ul(day.nt);
  if(!(dose>0)){out.innerHTML=`<div class="card"><div class="calc"><b>${day.n}</b><small style="display:block;color:var(--mut)">${day.pres}</small><p class="why">Ingresá la dosis en ${day.un} (habitual ${day.lo}–${day.hi}) para calcular la preparación.</p><div class="box">Concentración recomendada: ${F(lim)} ${day.cmu} (${via=="vc"?"vía central":"vía periférica"}). Solvente: ${day.sol}.</div>${nt}</div></div>`;return}
  const tot=day.f(dose)*w;const vol=tot/lim;const al=tot>day.mxT;
  out.innerHTML=`<div class="card"><div class="calc"><b>${day.n}</b><small style="display:block;color:var(--mut)">${day.pres}</small>${dkK("Dosis diaria",F(tot)+" mg/día")}${dkK("Volumen mínimo a la concentración máxima ("+F(lim)+" "+day.cmu+")",F(vol)+" mL de "+day.sol)}${dkK("Velocidad de infusión (volumen ÷ 24 h)",F(vol/24)+" mL/h")}${dkK("Volumen de ampolla",F(tot/(day.pres.indexOf("50 mg")>=0?50:10))+" mL")}${al?`<div class="box al">La dosis diaria supera el máximo de ${day.mxT} ${day.mxU}.</div>`:""}${dose>day.hi?`<div class="box">La dosis está por encima del rango habitual (${day.lo}–${day.hi} ${day.un}).</div>`:""}<div class="box">Se puede usar un volumen mayor: dividir siempre los mL totales por 24 para que se administre en 24 h. Mantener la concentración por debajo de ${F(lim)} ${day.cmu}.</div>${ul(day.nt)}</div></div>`;return}
 const d=DR[k];const ui=dkv(b,"cv-ui");const r=d.rec(w,via,ui);
 if(r.need){out.innerHTML=`<div class="card"><div class="calc"><b>${d.n}</b><small style="display:block;color:var(--mut)">${d.pres}</small><p class="why">${r.need}</p>${ul(d.nt)}</div></div>`;return}
 let conc,per,prep;
 if(r.conc){conc=r.conc;prep=`Usar la ampolla <b>pura</b> (${F(r.conc)} ${d.cmu}), sin diluir.`}
 else{conc=r.amt/r.vol;prep=`Colocar <b>${F(r.amt)} ${d.au}</b>${d.st?` (<b>${F(r.amt/d.st)} mL</b> de ampolla)`:""} y completar hasta <b>${F(r.vol)} mL</b> con ${d.sol}.`}
 per=conc*d.K/w;
 const lim=d.cm[via];const over=lim!=null&&conc>lim*1.0001;
 const volMin=(!r.conc&&lim!=null&&over)?r.amt/lim:null;
 const rate=x=>F(x/per);
 let h=`<div class="card"><div class="calc"><b>${d.n}</b><small style="display:block;color:var(--mut)">${d.pres}</small><div class="box">${prep}</div>${dkK("Concentración final",F(conc)+" "+d.cmu)}${dkK("1 mL/h equivale a","<b>"+F(per)+" "+d.du+"</b>")}`;
 h+=dkK("Rango habitual",F(d.lo)+" a "+F(d.hi)+" "+d.du+(d.us?" (habitual "+F(d.us)+")":"")+(d.mx?" · máx "+F(d.mx):""));
 h+=dkK("Velocidad para el rango","<b>"+rate(d.lo)+" a "+rate(d.hi)+" mL/h</b>");
 if(dose>0){h+=dkK("Velocidad para "+F(dose)+" "+d.du,"<b>"+rate(dose)+" mL/h</b>");if(d.mx&&dose>d.mx)h+=`<div class="box al">La dosis supera el máximo indicado (${F(d.mx)} ${d.du}).</div>`;else if(dose>d.hi)h+=`<div class="box">La dosis está por encima del rango habitual.</div>`}
 if(lim!=null){h+=over?`<div class="box al">La concentración (${F(conc)} ${d.cmu}) supera el máximo para ${via=="vc"?"vía central":"vía periférica"} (${F(lim)} ${d.cmu}).${volMin?` Con la misma cantidad, completar hasta al menos ${F(volMin)} mL.`:""}${d.cmn?" "+d.cmn:""}</div>`:`<div class="box">Concentración dentro del máximo para ${via=="vc"?"vía central":"vía periférica"} (${F(lim)} ${d.cmu}).${d.cmn?" "+d.cmn:""}</div>`}
 else if(via=="vp")h+=`<div class="box">Sin concentración máxima indicada para vía periférica: preferir vía central.</div>`;
 h+=ul(d.nt)+`</div></div>`;out.innerHTML=h}
b.addEventListener("input",render);b.addEventListener("change",render);render();return function(){b.removeEventListener("input",render);b.removeEventListener("change",render)}}}}})();;
T.metadona={t:"Algoritmo de retiro de la analgosedación usando metadona V.O.",c:wire(BX(`<p class="hint">Una guía rápida (protocolo en etapa piloto).</p><h3 class="th">1. Dosis inicial de metadona</h3><p>La dosis inicial de metadona es <b>0,1 mg/kg/dosis multiplicado por la dosis de opioide que viene recibiendo</b> (en mg/kg/hora si es morfina o en µg/kg/hora si es fentanilo). Por ejemplo, 0,2 mg/kg/dosis de metadona si venía con morfina a 0,2 mg/kg/hora o fentanilo a 2 µg/kg/hora. Se indica cada 6 h V.O. por 2 días si hace entre 5 y 10 días que recibe opioides, o por 4 días si hace más de 10 días.</p>
${F_("w","Peso (kg)")}${S_("op","Opioide a convertir",["Morfina (mg/kg/hora)","Fentanilo (µg/kg/hora)"])}${F_("d","Dosis actual del opioide")}${S_("lg","¿Recibió más de 10 días de opioides?",["Sí","No (5 a 10 días)"])}${OUT("m")}`)+
BX(`<h3 class="th">2. Escalones de retiro del opioide</h3>${ul(["Con la 2.ª dosis de metadona se baja el opioide a la mitad, con la 3.ª otra vez a la mitad y se suspende con la 4.ª dosis. Ej.: fentanilo 2 µg/kg/h → 1 → 0,5 → suspender; morfina 0,2 mg/kg/h → 0,1 → 0,05 → suspender.","Al mismo tiempo, si venía con benzodiacepina EV, se pasa a V.O. (por ej. midazolam 0,1 mg/kg/h = lorazepam V.O. 0,1 mg/kg/6 h).","Desde el 1.er descenso de opioides, monitoreo sistemático de abstinencia con WAT-1 o SOS. Objetivo: WAT-1 &lt;3 y SOS Sophia &lt;4."])}
<h3 class="th">3. Esquema de metadona según días de opioides</h3><p><b>Más de 10 días:</b> cada 6 h por 4 días; cada 8 h por 2 días; cada 12 h por 2 días más; luego cada 24 h.<br><b>5 a 10 días:</b> cada 6 h por 2 días; cada 8 h por 2 días; cada 12 h por 1 día más; luego cada 24 h.</p>
<h3 class="th">4. Sedación excesiva</h3><p>Saltear una dosis de benzodiacepina <b>o</b> de metadona y disminuir 10–20% las dosis siguientes de la droga omitida. Revisar la relación cronológica entre administración y sobresedación para decidir cuál omitir; si no está clara, omitir la dosis de benzodiacepina. Si persiste, alternar la droga a omitir y reducir dosis.</p>
<h3 class="th">5. Signos de abstinencia (WAT o SOS &gt;3)</h3><p>Se tratan con dosis de rescate de morfina. También se puede adelantar hasta un par de horas la dosis de metadona, sobre todo al comienzo.</p>`)+
BX(`<h3 class="th">6. Clonidina</h3><p>Se recomienda comenzar, si no la tenía y no hay contraindicaciones, con clonidina V.O.: 1–3 µg/kg cada 8 h (dosis máxima 5 µg/kg y/o 400 µg cada 8 h).</p>${OUT("c")}
<h3 class="th">7. Días 2 y 3: reajuste de la dosis de metadona por rescates</h3><p class="hint">Los días 2.º y 3.º de metadona se pueden agregar las dosis equivalentes de rescate que necesitó el día anterior. Ejemplo del algoritmo: 4 dosis de 0,1 mg/kg de morfina = 0,4 mg/kg/día; ÷ 24 = 0,017 mg/kg/hora, o sea que se aumenta la dosis de metadona en 0,017 mg/kg/dosis (de 0,1 a 0,117 mg/kg/dosis). Máximo de rescate de morfina: 10 mg/dosis.</p>${F_("rm","Dosis de rescate con morfina (mg)")}${F_("rn","Cantidad de rescates en 24 h")}${F_("my","Dosis de metadona de AYER (mg/dosis)")}${OUT("r")}`)+
BX(`<h3 class="th">8. Si sospecha delirium (CAPD 9 o más)</h3><p>O ve excitación importante o sospecha alucinaciones: puede agregar neurolépticos como haloperidol o levomepromazina (ver la sección Delirium).</p>
<h3 class="th">9. Descenso de la metadona</h3><p><b>¿24 h sin abstinencia significativa (WAT o SOS &lt;4)?</b><br>Sí: disminuir 20% la dosis cada 24 h, en base a la última dosis con la que estuvo libre de abstinencia (retiro completo en 5 días).<br>No / más lento: disminuir 20% cada 48 h (o 10% diario), retiro completo en 10 días.</p>
<h3 class="th">10. Si reaparece el síndrome de abstinencia (WAT o SOS &gt;4)</h3><p>Realizar rescate hasta escore &lt;4, reponer las dosis de opioide y benzodiacepina a la última dosis efectiva y enlentecer el retiro a la mitad (por ej. de 20% cada 48 h a 10% cada 48 h).</p>
<h3 class="th">11. Cuando está libre de opioides y benzodiacepinas</h3><p>Inicia el retiro de clonidina según la duración del tratamiento: menos de 1 semana, retirar en 48 h; 1 semana a 1 mes, en 5 días; más de 1 mes, en 14 días. Recién después de retirar la clonidina se inicia el retiro de neurolépticos (clorpromazina, levomepromazina, haloperidol, etc.).</p>
<p class="hint">Fuentes y notas: ${AL("https://arucip.pubpub.org/pub/retiroconmetadona","arucip.pubpub.org/pub/retiroconmetadona")} (requiere conexión). Dudas o errores: jselandari@intramed.net. Herramienta de apoyo: verificá siempre la indicación.</p>`),b=>{
const w=nn(b,"w"),op=sv(b,"op"),d=nn(b,"d"),lg=sv(b,"lg");let m="";
if(w>0&&op!=null&&d>=0&&isFinite(d)){const mgkg=0.1*d,mg=mgkg*w,cap=Math.min(mg,20);m=BG_("Dosis inicial de metadona",sf(cap)+" mg cada 6 h V.O.")+P_("Cálculo",sf(mgkg)+" mg/kg/dosis × "+sf(w)+" kg = "+sf(mg)+" mg"+(mg>20?" (dosis máxima 20 mg/dosis)":""))+(lg!=null?P_("Duración de la dosis cada 6 h",lg===0?"4 días (más de 10 días de opioides)":"2 días (5 a 10 días de opioides)"):"")}
setO(b,"m",m);
setO(b,"c",w>0?P_("Clonidina a 3 µg/kg",sf(Math.min(3*w,400))+" µg cada 8 h V.O. (rango 1–3 µg/kg = "+sf(w)+" a "+sf(3*w)+" µg; máximo 5 µg/kg y/o 400 µg)"):"");
const rm=nn(b,"rm"),rn=nn(b,"rn"),my=nn(b,"my");setO(b,"r",rm>=0&&rn>=0&&my>=0&&isFinite(rm+rn+my)?BG_("Metadona: nueva dosis",sf(Math.min(my+rm*rn/24,20))+" mg/dosis")+P_("Incremento",sf(rm*rn/24)+" por dosis (rescates de ayer ÷ 24)")+WN_("Dosis máxima de metadona 20 mg/dosis."):"")})};;
document.querySelector("#calcs").insertAdjacentHTML("beforeend",`<div id="c-endo"><div class="card"><div class="lst"><a class="lk off" href="#" data-tool="cad"><span class="ic">${ic("flask")}</span><div><b>Cetoacidosis diabética (GAP Garrahan 2025)</b><small>Gravedad, líquidos, electrolitos e insulina por peso</small></div>${ic("next")}</a></div></div><div class="card"><div class="lst"><a class="lk off" href="#" data-tool="ehh"><span class="ic">${ic("drop")}</span><div><b>Estado hiperosmolar hiperglucémico (GAP Garrahan 2025)</b><small>Líquidos, sodio, potasio e insulina</small></div>${ic("next")}</a></div></div><div class="card"><div class="lst"><a class="lk off" href="#" data-tool="ccv"><span class="ic">${ic("pulse")}</span><div><b>Cardiología: infusiones y bolos (pre/POP CCV)</b><small>Dilución estandarizada por peso y vía, velocidades y bolos</small></div>${ic("next")}</a></div></div><div class="card"><div class="lst"><a class="lk off" href="#" data-tool="gfr"><span class="ic">${ic("pulse")}</span><div><b>Filtrado glomerular pediátrico (NKF)</b><small>Bedside Schwartz, cistatina C y CKiD</small></div>${ic("next")}</a></div></div></div>`);;
})();
