/* Calculadoras: infusiones, analgosedación, electrolitos, leche, opioides, basales */
(function(){
const T=window.ARU.T;

(function(){
const sf=v=>isFinite(v)?parseFloat(v.toPrecision(3)).toString().replace(".",","):"—";
const DR=[
{n:"Adrenalina",c:1,cu:"mg",pres:"Ampolla 1 mg/mL (1:1000)",u:"µg/kg/min",lo:.05,hi:1,rec:"0,05–1 µg/kg/min",f:(w,v)=>({a:.6*w,vol:v?300:100})},
{n:"Noradrenalina",c:1,cu:"mg",pres:"Ampolla 1 mg/mL",u:"µg/kg/min",lo:.05,hi:1,rec:"0,05–1 µg/kg/min",f:(w,v)=>({a:.6*w,vol:v?300:100})},
{n:"Dopamina",c:40,cu:"mg",pres:"Ampolla 40 mg/mL",u:"µg/kg/min",lo:2,hi:20,rec:"2–20 µg/kg/min",f:w=>w<=20?{a:12*w,vol:50}:w<=45?{a:12*w,vol:100}:{a:6*w,vol:100}},
{n:"Dobutamina",c:12.5,cu:"mg",pres:"Ampolla 12,5 mg/mL",u:"µg/kg/min",lo:2,hi:20,rec:"2–20 µg/kg/min",f:w=>w<=20?{a:12*w,vol:50}:w<=45?{a:12*w,vol:100}:{a:6*w,vol:100}},
{n:"Milrinona",c:1,cu:"mg",pres:"Ampolla 1 mg/mL",u:"µg/kg/min",lo:.25,hi:.75,rec:"0,25–0,75 µg/kg/min",f:w=>.72*w>20?{a:20,vol:20,pure:1}:{a:.72*w,vol:24}},
{n:"Nitroprusiato",c:0,cu:"mg",pres:"Según presentación del servicio (dilución máxima 100 mg en 100 mL)",u:"µg/kg/min",lo:.5,hi:10,rec:"0,5–10 µg/kg/min",f:w=>({a:Math.min(6*w,100),vol:100})},
{n:"Vasopresina",c:20,cu:"UI",pres:"Ampolla 20 UI/mL",u:"UI/kg/min",lo:.0002,hi:.002,rec:"0,0002–0,002 UI/kg/min (las tarjetas Garrahan inician en 0,0002)",f:w=>({a:w<10?5:w<30?10:20,vol:24})},
{n:"Isoproterenol",c:.2,cu:"mg",pres:"Ampolla 0,2 mg/mL (verificar presentación)",u:"µg/kg/min",lo:.05,hi:2,rec:"0,05–2 µg/kg/min",f:w=>({a:.6*w,vol:100,dx:1})}
];
const $$=s=>document.querySelector(s);
const html=`<details class="card inf" id="c-inf"><summary><div class="sh"><span class="ic">${ic("calc")}</span><b>Infusión de inotrópicos y vasoactivos</b>${ic("chev","chev")}</div></summary><div class="calc">
<label class="f"><span>Droga</span><select id="i-d">${DR.map((d,i)=>`<option value="${i}">${d.n}</option>`).join("")}</select></label>
<div class="flds">${fld("i-w","Peso (kg)")}${fld("i-r","Velocidad (ml/h)")}</div>
<label class="f" id="i-vw"><span>Acceso venoso</span><select id="i-v"><option value="0">Central</option><option value="1">Periférico</option></select></label>
<div class="pp" id="i-pr" hidden><small>Presentación</small><span id="i-p"></span></div>
<div class="pp" id="i-rc" hidden><small>Dosis recomendada</small><span id="i-rt"></span></div>
<div class="pp" id="i-pp" hidden><small>Preparación sugerida</small><span id="i-pt"></span></div>
<div class="big" id="i-b1" hidden><small id="i-l1"></small><b id="i-o1"></b></div>
<div class="big" id="i-b2" hidden><small id="i-l2"></small><b id="i-o2"></b></div>
<div class="wn" id="i-wn" hidden></div>
<p class="nt2">Cálculos para acceso venoso CENTRAL. Para adrenalina y noradrenalina el acceso periférico usa dilución a 300 mL (1 mL/h = 0,033 µg/kg/min). Para otras drogas por vía periférica use el criterio clínico y la dilución del servicio. Reconstruida con las fórmulas de Fórmulas y preparaciones y las tarjetas de Garrahan: verifique siempre contra las Cards antes de indicar. Con acceso central, cada preparación indica cuánta dosis da 1 mL/h.</p>
</div></details>`;
$$("#calcs").insertAdjacentHTML("afterbegin",html);
function run(){
const d=DR[+$$("#i-d").value],w=n("i-w"),r=n("i-r"),per0=+$$("#i-v").value;
$$("#i-vw").hidden=!(d.n==="Adrenalina"||d.n==="Noradrenalina");
const via=$$("#i-vw").hidden?0:per0;
const sh=(id,v)=>$$("#"+id).hidden=!v;
["i-pr","i-rc","i-pp","i-b1","i-b2","i-wn"].forEach(i=>sh(i,0));
$$("#i-p").textContent=d.pres;sh("i-pr",1);$$("#i-rt").textContent=d.rec;sh("i-rc",1);
if(!(w>0))return;
const p=d.f(w,via),a=p.a,vol=p.vol;
const per=d.u==="UI/kg/min"?a/(vol*60*w):a*1000/(vol*60*w);
let pt;
if(d.c>0){const ml=a/d.c;pt=p.pure?`Sin diluir: ${sf(ml)} mL (${sf(a)} ${d.cu}) en jeringa, goteo puro`:`${sf(ml)} mL de ${d.n} (${sf(a)} ${d.cu}) + ${p.dx?"Dx 10%":"Dx 5% o SF"} hasta ${vol} mL`}
else pt=`${sf(a)} mg de ${d.n} + Dx 5% hasta ${vol} mL (proteger de la luz)`;
$$("#i-pt").textContent=pt;sh("i-pp",1);
$$("#i-l1").textContent="A 1 mL/h, el paciente recibe";$$("#i-o1").textContent=sf(per)+" "+d.u;sh("i-b1",1);
let wn=[];
if(r>=0&&isFinite(r)&&$$("#i-r").value!==""){const dose=r*per;$$("#i-l2").textContent=`A ${sf(r)} mL/h, el paciente recibe`;$$("#i-o2").textContent=sf(dose)+" "+d.u;sh("i-b2",1);
if(dose>d.hi)wn.push("Dosis por encima del rango recomendado ("+d.rec.split(" (")[0]+").");else if(dose>0&&dose<d.lo)wn.push("Dosis por debajo del rango recomendado.")}
if(w>60)wn.push("Peso mayor a 60 kg: las tarjetas de Garrahan llegan hasta 60 kg; verifique la preparación.");
if(w<3)wn.push("Peso menor a 3 kg: verifique la preparación con farmacia.");
if(wn.length){$$("#i-wn").innerHTML=wn.join("<br>");sh("i-wn",1)}
}
["i-d","i-w","i-r","i-v"].forEach(i=>{$$("#"+i).addEventListener("input",run);$$("#"+i).addEventListener("change",run)});
run();
})();;
(function(){
/* Preparación estandarizada de analgosedación (tablas de sedoanalgesia del Hospital Garrahan, vía calculadora ARUCIP).
   Cortes de peso tomados de la calculadora original; en los límites exactos que la fuente deja solapados (5, 7,5, 8, 10, 13, 17,5, 20, 25 y 31 kg) se usa el criterio indicado en cada función. */
const sf=v=>isFinite(v)?parseFloat(v.toPrecision(3)).toString().replace(".",","):"—";
const Q=s=>document.querySelector(s);
const mk=(c,prep,o)=>{o=o||{};const vol=o.vol||50;return{c,vol,tot:o.tot||c*vol,prep,pure:o.pure,dil:o.dil||"SF o Dx5%",warn:o.warn,via:o.via}};
const SD=[
{n:"Fentanilo",u:"mcg",pres:"Ampolla 5 mL (50 mcg/mL)",pick:w=>w<5?mk(5,"Tomar 5 mL (250 mcg = 1 ampolla) y llevar hasta 50 mL de SF o Dx5%"):w<7.5?mk(10,"Tomar 10 mL (500 mcg = 2 ampollas) y llevar hasta 50 mL de SF o Dx5%"):w<17.5?mk(20,"Tomar 20 mL (1000 mcg = 4 ampollas) y llevar hasta 50 mL de SF o Dx5%"):mk(50,"Puro, sin diluir: tomar 50 mL (2500 mcg = 10 ampollas)",{pure:1,tot:2500})},
{n:"Morfina",u:"mg",pres:"Ampolla 1 mL (10 mg/mL)",pick:w=>w<5?mk(.4,"Tomar 2 mL (20 mg = 2 ampollas) y llevar hasta 50 mL de SF o Dx5%"):w<13?mk(1,"Tomar 5 mL (50 mg = 5 ampollas) y llevar hasta 50 mL de SF o Dx5%"):w<25?mk(2,"Tomar 10 mL (100 mg = 10 ampollas) y llevar hasta 50 mL de SF o Dx5%"):mk(5,"Tomar 25 mL (250 mg = 25 ampollas) y llevar hasta 50 mL de SF o Dx5%")},
{n:"Midazolam",u:"mg",pres:"Ampolla 3 mL (5 mg/mL)",pick:w=>w<5?mk(.3,"Tomar 3 mL (15 mg = 1 ampolla) y llevar hasta 50 mL de SF o Dx5%"):w<8?mk(.6,"Tomar 6 mL (30 mg = 2 ampollas) y llevar hasta 50 mL de SF o Dx5%"):w<13?mk(.9,"Tomar 9 mL (45 mg = 3 ampollas) y llevar hasta 50 mL de SF o Dx5%"):w<31?mk(1.8,"Tomar 18 mL (90 mg = 6 ampollas) y llevar hasta 50 mL de SF o Dx5%"):mk(5,"Puro, sin diluir: tomar 48 mL (240 mg = 16 ampollas)",{pure:1,vol:48,tot:240})},
{n:"Clonidina",u:"mcg",pt:1,pres:"Ampolla 1 mL (150 mcg/mL)",pick:w=>w<=5?mk(6,"Tomar 2 mL (300 mcg = 2 ampollas) y llevar hasta 50 mL de SF o Dx5%"):w<=20?mk(12,"Tomar 4 mL (600 mcg = 4 ampollas) y llevar hasta 50 mL de SF o Dx5%"):mk(36,"Tomar 12 mL (1800 mcg = 12 ampollas) y llevar hasta 50 mL de SF o Dx5%")},
{n:"Dexmedetomidina",u:"mcg",pres:"Frasco ampolla 2 mL (100 mcg/mL)",pick:w=>w<10?mk(4,"Tomar 2 mL (200 mcg = 1 ampolla) y llevar hasta 50 mL de SF o Dx5%"):mk(8,"Tomar 4 mL (400 mcg = 2 ampollas) y llevar hasta 50 mL de SF o Dx5%")},
{n:"Ketamina",u:"mg",pres:"Frasco ampolla 10 mL (50 mg/mL)",pick:w=>w<=13?mk(5,"Tomar 5 mL (250 mg) y llevar hasta 50 mL de SF o Dx5%"):mk(10,"Tomar 10 mL (500 mg) y llevar hasta 50 mL de SF o Dx5%")},
{n:"Propofol 1%",u:"mg",pt:1,pres:"Ampolla 20 mL (10 mg/mL)",pick:()=>mk(10,"Puro, sin diluir (24 mL = 240 mg). Estabilidad máxima: 6 h.",{pure:1,vol:24,tot:240,warn:"Estabilidad máxima de la preparación: 6 h."})},
{n:"Tiopental",u:"mg",pres:"Frasco ampolla 1000 mg",pick:(w,via)=>via?mk(4,"Bomba volumétrica. Reconstituir el F/A en 20 mL de SF, tomar toda la solución reconstituida y llevar hasta 250 mL de SF.",{vol:250,tot:1000,dil:"SF o Dx5%",via:"periférica"}):mk(20,"Bomba de jeringa. Reconstituir el F/A en 20 mL de SF, tomar toda la solución reconstituida y llevar hasta 50 mL de SF.",{tot:1000,dil:"SF o Dx5%",via:"central"})},
{n:"Vecuronio",u:"mg",pres:"Frasco ampolla 10 mg",pick:()=>mk(1,"Bomba de jeringa. Reconstituir 5 F/A, cada uno en 10 mL de SF, y tomar toda la solución reconstituida (50 mL).",{tot:50,dil:"SF",warn:"En la fuente original esta preparación figura como pendiente de revisión (cómo indicarla y qué dilución es más adecuada). Verificar con farmacia."})}
];
const html=`<details class="card inf sed" id="c-sed"><summary><div class="sh"><span class="ic">${ic("pill")}</span><b>Analgosedación: preparación estandarizada</b>${ic("chev","chev")}</div></summary><div class="calc">
<div class="flds">${fld("s-w","Peso (kg)")}<label class="f"><span>Paciente obeso</span><select id="s-o"><option value="0">No</option><option value="1">Sí</option></select></label></div>
<div id="s-pw" hidden>${fld("s-p","Peso ideal (kg)")}</div>
<label class="f"><span>Vía (solo tiopental)</span><select id="s-v"><option value="0">Central</option><option value="1">Periférica</option></select></label>
<div class="wn" id="s-wn" hidden></div>
<div id="s-out"></div>
<p class="nt2">Preparaciones estandarizadas según las tablas de sedoanalgesia del Hospital Garrahan (calculadora de ARUCIP). Elegí cada droga para ver la indicación médica y cómo prepararla; "1 mL/h" indica la dosis que recibe el paciente por kg y por hora. En obesos, clonidina y propofol se calculan con el peso total y el resto con el peso ideal. No reemplaza el criterio médico: verificá siempre contra las tablas del servicio.</p>
</div></details>`;
Q("#c-inf").insertAdjacentHTML("afterend",html);
function run(){
 const w=n("s-w"),ob=+Q("#s-o").value,pi=n("s-p"),via=+Q("#s-v").value;
 Q("#s-pw").hidden=!ob;
 const out=Q("#s-out"),wn=Q("#s-wn");
 if(!(w>0)){out.innerHTML="";wn.hidden=true;return}
 const m=[];
 if(w>60)m.push("Peso mayor a 60 kg: estas tablas de sedoanalgesia son pediátricas. En adultos usar el protocolo propio del servicio.");
 if(ob&&!(pi>0))m.push("Paciente obeso: ingresá el peso ideal. Mientras tanto se usa el peso total para todas las drogas.");
 out.innerHTML=SD.map(d=>{
  const wd=(ob&&pi>0&&!d.pt)?pi:w,p=d.pick(wd,via),f=p.c/wd,u=d.u+"/kg/h";
  const lab=ob&&pi>0?(d.pt?"peso total":"peso ideal")+" "+sf(wd)+" kg":"";
  const ind=p.pure?`${d.n.replace(" 1%","")} puro (${sf(p.c)} ${d.u}/mL)${p.tot&&d.n!=="Fentanilo"&&d.n!=="Midazolam"?" · "+sf(p.tot)+" "+d.u:""}`:`${d.n.replace(" 1%","")} ${sf(p.tot)} ${d.u} en ${p.dil} hasta ${p.vol} mL`;
  const via2=d.n==="Tiopental"?` (vía ${p.via})`:"";
  return `<details class="sdd2"><summary><div style="flex:1;min-width:0"><b>${d.n}${via2}</b><small>${sf(p.c)} ${d.u}/mL · 1 mL/h = ${sf(f)} ${u}${lab?" · "+lab:""}</small></div>${ic("chev","chev")}</summary><div class="sdx">
<div class="pp"><small>Presentación</small>${d.pres}</div>
<div class="pp"><small>Indicación médica</small>${ind}</div>
<div class="pp"><small>Preparación</small>${p.prep}</div>
<div class="big"><small>A 1 mL/h, el paciente recibe</small><b>${sf(f)} ${u}</b></div>
${p.warn?`<div class="wn">${p.warn}</div>`:""}
<label class="sdq">Dosis deseada (${u}) <input type="number" inputmode="decimal" step="any" class="sdi" data-f="${f}" placeholder="0"> <b class="sdo">→ — mL/h</b></label>
</div></details>`}).join("");
 if(m.length){wn.innerHTML=m.join("<br>");wn.hidden=false}else wn.hidden=true;
}
Q("#s-out").addEventListener("input",e=>{const t=e.target;if(!t.classList||!t.classList.contains("sdi"))return;const x=parseFloat(t.value),f=+t.dataset.f;t.parentNode.querySelector(".sdo").textContent=x>0?"→ "+sf(x/f)+" mL/h":"→ — mL/h"});
["s-w","s-p"].forEach(i=>Q("#"+i).addEventListener("input",run));
["s-o","s-v"].forEach(i=>Q("#"+i).addEventListener("change",run));
run();
})();;
(function(){
/* Electrolitos y ácido-base. Orden: Na, K, bicarbonato, Ca, P, Mg (cada uno con hipo e hiper); luego el resto. Fórmulas de Fórmulas y preparaciones y tarjetas Garrahan; límites de corrección del sodio según revisiones pediátricas (AAFP, PMC, Cornell PICU); fósforo según Pediatric Dosage Handbook. */
const sf=v=>isFinite(v)?parseFloat(v.toPrecision(3)).toString().replace(".",","):"—";
const Q=s=>document.querySelector(s);
const sub=(t,sm,b)=>`<details class="sdd2"><summary><div style="flex:1;min-width:0"><b>${t}</b><small>${sm}</small></div>${ic("chev","chev")}</summary><div class="sdx">${b}</div></details>`;
const big=(l,v)=>`<div class="big"><small>${l}</small><b>${v}</b></div>`;
const pp=(l,v)=>`<div class="pp"><small>${l}</small>${v}</div>`;
const wn=t=>`<div class="wn">${t}</div>`;
const sel=(id,l,o)=>`<label class="f"><span>${l}</span><select id="${id}">${o}</select></label>`;
const fp=(id,l,ph)=>fld(id,l).replace('placeholder="0"',`placeholder="${ph}"`);
const gh=t=>`<h4 class="mh eh">${t}</h4>`;
const O=id=>`<div id="${id}"></div>`;
const need=()=>pp("Falta el peso","Ingresá el peso arriba para calcular.");
const html=`<details class="card inf sed" id="c-elec"><summary><div class="sh"><span class="ic">${ic("drop")}</span><b>Electrolitos y ácido-base</b>${ic("chev","chev")}</div></summary><div class="calc">
${fld("e-w","Peso (kg)")}
${sub("Valores normales de los iones","Rangos de referencia pediátricos",`<div class="tw"><table class="tb"><thead><tr><th>Ion</th><th>Valor normal</th></tr></thead><tbody><tr><td>Sodio (Na)</td><td>135–145 mEq/L</td></tr><tr><td>Potasio (K)</td><td>3,5–5 mEq/L (recién nacidos: hasta 6)</td></tr><tr><td>Cloro (Cl)</td><td>98–106 mEq/L</td></tr><tr><td>Bicarbonato (HCO₃)</td><td>22–26 mEq/L</td></tr><tr><td>Calcio total</td><td>8,5–10,5 mg/dL</td></tr><tr><td>Calcio iónico</td><td>1,1–1,3 mmol/L (4,4–5,2 mg/dL)</td></tr><tr><td>Fósforo: recién nacidos</td><td>4,8–8,2 mg/dL</td></tr><tr><td>Fósforo: 1–3 años</td><td>3,8–6,5 mg/dL</td></tr><tr><td>Fósforo: 4–11 años</td><td>3,7–5,6 mg/dL</td></tr><tr><td>Fósforo: 12–15 años</td><td>2,9–5,4 mg/dL</td></tr><tr><td>Fósforo: 16–19 años</td><td>2,7–4,7 mg/dL</td></tr><tr><td>Magnesio (Mg)</td><td>1,7–2,4 mg/dL (0,7–1 mmol/L)</td></tr></tbody></table></div><p class="nt2">Rangos de referencia pediátricos habituales en sangre; pueden variar según el laboratorio y el método.</p>`)}

${gh("Sodio")}
<p class="nt2 nv"><b>Valor normal:</b> Na 135–145 mEq/L</p>
${sub("Hiponatremia","Déficit de sodio y NaCl 3%",`<div class="flds">${fld("e-na","Na actual (mEq/L)")}${fp("e-nd","Na deseado (mEq/L)","135")}</div>${O("e-nao")}<p class="nt2"><b>Cómo preparar NaCl 3% con ampollas de NaCl 20%:</b> 15 mL de NaCl 20% + 85 mL de agua destilada = 100 mL de NaCl 3% (0,513 mEq/mL). El NaCl 20% tiene 3,4 mEq/mL: no se administra sin diluir.</p>`)}
${sub("Hipernatremia","Déficit de agua libre y velocidad",`<div class="flds">${fld("e-hn","Na actual (mEq/L)")}${fp("e-hd","Na deseado (mEq/L)","140")}</div>${fp("e-hh","Horas para corregir","48")}${O("e-hno")}`)}

${gh("Potasio")}
<p class="nt2 nv"><b>Valor normal:</b> K 3,5–5 mEq/L (recién nacidos: hasta 6 mEq/L)</p>
${sub("Hipokalemia","1 mEq/kg: leve, moderada y grave",`${fld("e-kk","K actual (mEq/L), opcional")}${fp("e-kt","Tiempo de infusión (h)","3")}${fld("e-kc","Ampolla de ClK (mEq/mL), opcional")}${fld("e-kv","Volumen final de la dilución (mL), opcional")}${sel("e-kz","Acceso venoso",'<option value="0">Periférico</option><option value="1">Central</option>')}${O("e-ko")}`)}
${sub("Hiperkalemia","Tratamiento escalonado por peso",`${O("e-hko")}`)}

${gh("Bicarbonato")}
<p class="nt2 nv"><b>Valor normal:</b> Bicarbonato 22–26 mEq/L · Cloro 98–106 mEq/L</p>
${sub("Acidosis metabólica (bicarbonato bajo)","Déficit = 0,3 × peso × Δ bicarbonato",`<div class="flds">${fld("e-b1","Bicarbonato actual (mEq/L)")}${fld("e-b2","Bicarbonato deseado (mEq/L)")}</div>${O("e-bo")}`)}
${sub("Alcalosis metabólica (bicarbonato alto)","PCO2 esperada y déficit de cloro",`<div class="flds">${fld("e-a1","Bicarbonato actual (mEq/L)")}${fld("e-a2","Cloro actual (mEq/L)")}</div>${O("e-ao")}`)}

${gh("Calcio")}
<p class="nt2 nv"><b>Valor normal:</b> Calcio total 8,5–10,5 mg/dL · Calcio iónico 1,1–1,3 mmol/L (4,4–5,2 mg/dL)</p>
${sub("Hipocalcemia","Dosis de gluconato o cloruro de calcio",`<div class="flds">${fld("e-c1","Calcio total (mg/dL), opcional")}${fld("e-c2","Albúmina (g/dL), opcional")}</div>${O("e-co1")}`)}
${sub("Hipercalcemia","Medidas y dosis por peso",`<div class="flds">${fld("e-d1","Calcio total (mg/dL), opcional")}${fld("e-d2","Albúmina (g/dL), opcional")}</div>${O("e-co2")}`)}

${gh("Fósforo")}
<p class="nt2 nv"><b>Valor normal:</b> Fósforo según edad: recién nacidos 4,8–8,2 · 1–3 años 3,8–6,5 · 4–11 años 3,7–5,6 · 12–15 años 2,9–5,4 · 16–19 años 2,7–4,7 mg/dL</p>
${sub("Hipofosfatemia","Corrección IV según gravedad",`${fld("e-p1","Fósforo actual (mg/dL), opcional")}${sel("e-ps","Gravedad",'<option value="0">Según el valor ingresado</option><option value="1">Leve</option><option value="2">Moderada</option><option value="3">Grave</option>')}${O("e-po1")}`)}
${sub("Hiperfosfatemia","Producto calcio × fósforo y medidas",`<div class="flds">${fld("e-q1","Fósforo (mg/dL)")}${fld("e-q2","Calcio total (mg/dL)")}</div>${O("e-po2")}`)}

${gh("Magnesio")}
<p class="nt2 nv"><b>Valor normal:</b> Magnesio 1,7–2,4 mg/dL (0,7–1 mmol/L)</p>
${sub("Hipomagnesemia","Sulfato de magnesio 25 mg/kg",O("e-mo1"))}
${sub("Hipermagnesemia","Antagonismo con calcio y eliminación",O("e-mo2"))}

${gh("Otros cálculos")}
${sub("Sodio corregido por glucemia","Na medido y glucemia",`<div class="flds">${fld("e-g1","Na medido (mEq/L)")}${fld("e-g2","Glucemia (mg/dL)")}</div>${O("e-go")}`)}
${sub("Gasometría: pH, PCO2 y bicarbonato","Henderson-Hasselbalch y compensación",`<p class="nt2">Ingresá dos de los tres valores (pH, PCO2, bicarbonato) y se calcula el tercero. Sirve también para hallar la PCO2 o el bicarbonato necesarios para un pH objetivo.</p><div class="flds">${fld("e-ph","pH")}${fld("e-pc","PCO2 (mmHg)")}</div>${fld("e-hc","Bicarbonato (mEq/L)")}${O("e-gaso")}`)}
${sub("Anión restante (anion gap)","Na, Cl, bicarbonato y albúmina",`<div class="flds">${fld("e-ag1","Na (mEq/L)")}${fld("e-ag2","Cl (mEq/L)")}</div><div class="flds">${fld("e-ag3","Bicarbonato (mEq/L)")}${fld("e-ag4","Albúmina (g/dL), opcional")}</div>${O("e-ago")}`)}
<p class="nt2">Fórmulas de Fórmulas y preparaciones, de las tarjetas de Garrahan y de bibliografía pediátrica. Los límites de corrección del sodio se basan en revisiones pediátricas y de la AAFP. Herramienta de apoyo: no reemplaza el criterio clínico ni el protocolo del servicio. Verificá siempre los valores, la ampolla y la dilución antes de indicar.</p>
</div></details>`;
Q("#calcs").insertAdjacentHTML("beforeend",html);
const W=()=>n("e-w");
function hipoNa(){const w=W(),na=n("e-na"),des=n("e-nd")>0?n("e-nd"):135;let o="";
 if(na>0){if(!(w>0))o=need();
  else if(na<des){const d=(des-na)*0.6*w,ad=(513-na)/(0.6*w+1);
   o=big("Déficit de sodio",sf(d)+" mEq")+pp("Equivale a",`NaCl 3% (0,513 mEq/mL): ${sf(d/.513)} mL<br>NaCl 0,9% (0,154 mEq/mL): ${sf(d/.154)} mL`)+pp("Preparar el NaCl 3% del déficit con ampollas de NaCl 20%",`${sf(d/.513)} mL de NaCl 3% = ${sf(d/.513*.15)} mL de NaCl 20% + ${sf(d/.513*.85)} mL de agua destilada`)+pp("Hiponatremia grave con síntomas (Fórmulas y preparaciones)",`NaCl 3% 2–4 mL/kg en 15–30 min: ${sf(2*w)} a ${sf(4*w)} mL<br>Ascenso estimado con esa dosis (Adrogué-Madias): ${sf(ad*2*w/1000)} a ${sf(ad*4*w/1000)} mEq/L`)+pp("Preparar el bolo con ampollas de NaCl 20%",`Para ${sf(2*w)} mL de NaCl 3% (2 mL/kg): ${sf(2*w*.15)} mL de NaCl 20% + ${sf(2*w*.85)} mL de agua destilada<br>Para ${sf(4*w)} mL de NaCl 3% (4 mL/kg): ${sf(4*w*.15)} mL de NaCl 20% + ${sf(4*w*.85)} mL de agua destilada<br>Regla: por cada 100 mL, 15 mL de NaCl 20% + 85 mL de agua destilada.`)+pp("Tope de Na a las 24 h",`${sf(na+10)} mEq/L (máx +10; usar +8 si hay riesgo alto de desmielinización: hipokalemia, desnutrición, hepatopatía, alcoholismo).`)+wn("Ascenso máximo 0,5 mEq/L/h y no más de 10–12 mEq/L en 24 h en hiponatremia crónica (riesgo de desmielinización osmótica). Dar todo el déficit en pocas horas solo corresponde a la forma aguda sintomática. Si se supera el ascenso, considerar re-descenso. Controlar el sodio seriado (cada 2–4 h).")}
  else o=pp("Resultado","El sodio actual no es menor que el deseado: no hay déficit que calcular.")}
 Q("#e-nao").innerHTML=o}
function hiperNa(){const w=W(),na=n("e-hn"),des=n("e-hd")>0?n("e-hd"):140,hh=n("e-hh")>0?n("e-hh"):48;let o="";
 if(na>0){if(!(w>0))o=need();
  else if(na>des){const l=0.6*w*(na/des-1)*1000,mn=(na-des)/0.5;
   o=big("Déficit de agua libre",sf(l)+" mL")+pp(`Repartido en ${sf(hh)} h`,`${sf(l/hh)} mL/h de agua libre (por ejemplo Dx 5% EV, o vía enteral si la tolera), además del mantenimiento y las pérdidas en curso.`)+pp("Velocidad de descenso del Na",`${sf((na-des)/hh)} mEq/L/h. Tiempo mínimo para bajar de ${sf(na)} a ${sf(des)}: ${sf(mn)} h (a 0,5 mEq/L/h).`)+(hh<mn?wn("El tiempo elegido implica descender más rápido que 0,5 mEq/L/h: riesgo de edema cerebral. Alargar el tiempo."):"")+wn("Descenso máximo: 0,5 mEq/L/h y 10–12 mEq/L en 24 h. Con shock o deshidratación grave, primero reponer la volemia con solución isotónica. Controlar el sodio seriado (cada 4–6 h). Si hay descenso demasiado rápido con convulsiones: NaCl 3% 2–3 mL/kg.")}
  else o=pp("Resultado","El sodio actual no es mayor que el deseado: no hay déficit de agua libre.")}
 Q("#e-hno").innerHTML=o}
function hipoK(){const w=W(),k=n("e-kk"),t=n("e-kt")>0?n("e-kt"):3,kc=n("e-kc")>0?n("e-kc"):3,kv=n("e-kv"),cz=+Q("#e-kz").value;let ko="";
 if(w>0){const d=Math.min(w,40),rmax=Math.min(.5*w,20),rmin=Math.min(.25*w,20),lim=cz?150:60,vmin=d/lim*1000,vol=kv>0?kv:vmin,rate=d/t,c=d/vol*1000;
  const g=k>0?(k<2.5?3:k<3?2:k<3.5?1:0):-1,hd=(x,l)=>"<b>"+(g===x?"▶ ":"")+l+"</b>";
  if(k>0)ko+=big("K "+sf(k)+" mEq/L",g===3?"Hipokalemia grave":g===2?"Hipokalemia moderada":g===1?"Hipokalemia leve":"Sin hipokalemia (K ≥3,5 mEq/L)");
  ko+=big("Dosis: 1 mEq/kg (máximo 40 mEq/dosis)",sf(d)+" mEq");
  ko+=pp("1. Leve (K 3–3,4 mEq/L), asintomática",hd(1,"Vía oral")+": 1 mEq/kg/dosis = "+sf(d)+" mEq/dosis (hasta 3–4 mEq/kg/día en dosis divididas). Adultos 40–100 mEq/día en dosis divididas (no superar 20 mEq/dosis).");
  ko+=pp("2. Moderada (K 2,5–2,9 mEq/L)",hd(2,"Vía oral")+": 1 mEq/kg/dosis = "+sf(d)+" mEq/dosis.<br>Si no tolera la vía oral o tiene síntomas: <b>EV</b> como en la grave (paso 3).");
  ko+=pp("3. Grave (K &lt;2,5 mEq/L, o síntomas o ECG alterado): EV",hd(3,"Corrección EV de 1 mEq/kg, paso a paso")+"<br>a) Cargar "+sf(d/kc)+" mL de ClK (ampolla de "+sf(kc)+" mEq/mL) = "+sf(d)+" mEq"
   +"<br>b) Diluir hasta "+sf(vol)+" mL"+(kv>0?" (volumen ingresado)":" (volumen final mínimo para vía "+(cz?"central, 150":"periférica, 60")+" mEq/L)")+": concentración "+sf(c)+" mEq/L"
   +"<br>c) Pasar en "+sf(t)+" h: "+sf(vol/t)+" mL/h = "+sf(rate)+" mEq/h = "+sf(rate/w)+" mEq/kg/h"
   +"<br>d) Velocidad permitida (CIME Garrahan 2022): 0,25 a 0,5 mEq/kg/h = "+sf(rmin)+" a "+sf(rmax)+" mEq/h, sin superar 20 mEq/h; con esta dosis, entre "+sf(d/rmax)+" y "+sf(d/Math.max(rmin,1e-9))+" h"
   +"<br>e) Monitoreo ECG continuo; corregir también el magnesio; controlar el K al terminar la infusión.");
  if(rate/w>.5||rate>20)ko+=wn("Supera la velocidad máxima (0,5 mEq/kg/h o 20 mEq/h): solo con acceso central y monitoreo ECG continuo.");
  if(c>lim+1e-6)ko+=wn("Supera el límite de "+lim+" mEq/L para acceso "+(cz?"central":"periférico")+" (periférica a 60 mEq/L, central a 150 mEq/L).");
  if(k>0&&k<=2)ko+=wn("K ≤2 mEq/L: hipokalemia muy severa; usar la corrección EV con monitoreo ECG continuo, buscar arritmias o debilidad muscular, corregir también el magnesio y controlar K seriado.")
 }else ko=need();
 Q("#e-ko").innerHTML=ko}
function hiperK(){const w=W();let o="";
 if(w>0){const g=Math.min(w,20);
  o=pp("1. Estabilizar la membrana: calcio",`Gluconato de Ca 10%: 0,5–1 mL/kg = ${sf(Math.min(.5*w,10))} a ${sf(Math.min(w,10))} mL (máx 10 mL), en 10 min<br>O cloruro de Ca 10%: 0,1–0,2 mL/kg = ${sf(Math.min(.1*w,10))} a ${sf(Math.min(.2*w,10))} mL (máx 10 mL; 10–20 mg/kg según AHA PALS, por vía central)`)
  +pp("2. Introducir K en la célula: salbutamol",`1 gota/kg en 3 mL de SF nebulizado = ${sf(g)} gotas (máx 20)`)
  +pp("Insulina + glucosa",`Insulina corriente 0,1 U/kg = ${sf(.1*w)} UI + glucosa 0,5 g/kg = ${sf(.5*w)} g (ver la calculadora de glucosa e insulina). Fórmulas y preparaciones indica 0,2–0,5 U/kg (máx 10 U) + 3 g de glucosa por UI: ${sf(.2*w)} a ${sf(Math.min(.5*w,10))} UI. Controlar glucemia.`)
  +pp("Bicarbonato de sodio","1–2 mEq/kg = "+sf(w)+" a "+sf(2*w)+" mEq (1–2 mL/kg de 1 M, diluido). Efectivo en acidosis metabólica.")
  +pp("3. Eliminar potasio","Furosemida 1 mg/kg = "+sf(w)+" mg EV si hay diuresis. Si es refractaria o hay oligoanuria: diálisis.")
  +wn("Con ECG alterado (T picuda, ensanchamiento de QRS) iniciar por el calcio. Suspender aportes de K y fármacos que lo elevan. Monitoreo ECG continuo.")
 }else o=need();
 Q("#e-hko").innerHTML=o}
function acidosis(){const w=W(),b1=n("e-b1"),b2=n("e-b2");let bo="";
 if(w>0&&b1>=0&&b2>0&&Q("#e-b1").value!==""){const dl=b2-b1;
  if(dl<=0)bo=pp("Resultado","El bicarbonato deseado no es mayor que el actual: no hay déficit.");
  else{const m=0.3*w*dl;bo=big("Déficit de bicarbonato",sf(m)+" mEq")+pp("Bicarbonato de sodio 1 M (1 mEq/mL)",sf(m)+" mL, diluir a la mitad")+pp("Bicarbonato 1/6 M (Fórmulas y preparaciones: con agua destilada, en 1–2 h)",sf(m*6)+" mL")+pp("Habitualmente","Dar la mitad del déficit y reevaluar con nueva gasometría.")+(m>100?wn("Supera la dosis máxima de 100 mEq indicada en la tarjeta Garrahan."):"")+wn("En cetoacidosis diabética no se recomienda bicarbonato (GAP Garrahan 2025): solo si pH &lt;6,8 con compromiso de la contractilidad o hiperkalemia grave.")}}
 else if(!(w>0)&&(b1>=0||b2>0))bo=need();
 Q("#e-bo").innerHTML=bo}
function alcalosis(){const b=n("e-a1"),cl=n("e-a2"),w=W();let o="";
 if(b>26){o=big("PCO2 esperada (compensación)",sf(40+0.7*(b-24))+" mmHg")+pp("Según Fórmulas y preparaciones",sf(40+(b-24))+" mmHg (40 + Δ bicarbonato). La compensación respiratoria habitual es 0,7 mmHg por cada mEq/L de bicarbonato.")}
 if(cl>0&&w>0){const d=0.2*w*(100-cl);if(d>0)o+=pp("Déficit de cloro (hasta 100 mEq/L)",sf(d)+" mEq (0,2 × peso × (100 − Cl)). Con NaCl 0,9% (0,154 mEq/mL de Cl): "+sf(d/.154)+" mL.");else o+=pp("Cloro","El cloro no está bajo 100 mEq/L.")}
 o+=pp("Enfoque","Cloro urinario &lt;15–20 mEq/L = cloruro-sensible (vómitos, diuréticos, SNG): reponer volemia con NaCl 0,9% y K. Cloro urinario alto = cloruro-resistente (hiperaldosteronismo, Bartter): tratar la causa.");
 Q("#e-ao").innerHTML=o}
function corrCa(a,b){return a+0.8*(4-b)}
function hipoCa(){const w=W(),c=n("e-c1"),a=n("e-c2");let o="";
 if(c>0&&a>0){const cc=corrCa(c,a);o+=big("Calcio corregido por albúmina",sf(cc)+" mg/dL")+pp("Fórmula","Ca total + 0,8 × (4 − albúmina). Es una estimación: es preferible el calcio iónico.")}
 else if(c>0)o+=pp("Calcio total",sf(c)+" mg/dL. Ingresá la albúmina para corregirlo. Es preferible medir el calcio iónico.");
 if(w>0){o+=big("Gluconato de Ca 10%: 0,6–1 mL/kg",sf(Math.min(.6*w,10))+" a "+sf(Math.min(w,10))+" mL (máx 10 mL por dosis)")+pp("Cloruro de Ca 10% (central): 0,2 mL/kg",sf(Math.min(.2*w,10))+" mL")+pp("Calcio elemental (Fórmulas y preparaciones: 5–7 mg/kg, ≈ 0,6–0,75 mL/kg de gluconato 10%)",sf(5*w)+" a "+sf(7*w)+" mg. Gluconato 10%: 9,3 mg de Ca elemental/mL. Cloruro 10%: 27,2 mg/mL.")+pp("Cómo darlo","Lento, en 10–30 min, con monitoreo ECG. En paro, pasar rápido. Máximo 10 mL por dosis. No mezclar con bicarbonato ni fosfato. El cloruro de calcio se da por vía central: extravasación grave.")+wn("Corregir también la hipomagnesemia y la alcalosis. Bradicardia con digoxina: cuidado.")}
 else o+=need();
 Q("#e-co1").innerHTML=o}
function hiperCa(){const w=W(),c=n("e-d1"),a=n("e-d2");let o="";
 if(c>0){const cc=a>0?corrCa(c,a):c,lv=cc>14?"grave (&gt;14 mg/dL)":cc>12?"moderada (12–14 mg/dL)":cc>10.5?"leve (&lt;12 mg/dL)":"no hay hipercalcemia con este valor";
  o+=big(a>0?"Calcio corregido":"Calcio total",sf(cc)+" mg/dL")+pp("Gravedad",lv)}
 if(w>0){o+=pp("1. Volemia","SF 0,9% en 1,5–2 veces el mantenimiento hasta lograr euvolemia y diuresis.")
  +pp("2. Furosemida (tras reponer volemia)","1 mg/kg = "+sf(w)+" mg EV c/6–12 h")
  +pp("3. Si es grave o persiste","Calcitonina 4 UI/kg SC c/12 h = "+sf(4*w)+" UI. Bifosfonatos (pamidronato 0,5–1 mg/kg = "+sf(.5*w)+" a "+sf(w)+" mg EV) según indicación del especialista. Corticoides si es por vitamina D, sarcoidosis o linfoma.")
  +wn("Hipercalcemia grave sintomática o con insuficiencia renal: diálisis. Suspender calcio, vitamina D y tiazidas. Monitoreo ECG (QT corto). Verificar las dosis con el protocolo del servicio.")}
 else o+=need();
 Q("#e-co2").innerHTML=o}
function hipoP(){const w=W(),p=n("e-p1"),s0=+Q("#e-ps").value;let o="";
 const kid=!(w>=50);let g=s0;if(!g&&p>0)g=kid?(p<1?3:p<1.5?2:p<2?1:0):(p<1.5?3:p<2.3?2:p<=3?1:0);
 if(p>0)o+=pp("Fósforo actual",sf(p)+" mg/dL = "+sf(p*0.3229)+" mmol/L");
 if(g&&w>0){const mgk=kid?[0,2.5,5,10][g]:[0,5,10,20][g],hr=kid?"4–6 h":(g===3?"8–12 h":"4–6 h"),mg=mgk*w,mmol=mg/31,ml=mmol/3,nm=["","leve","moderada","grave"][g];
  o+=big("Hipofosfatemia "+nm+" ("+(kid?"niño <50 kg":"adulto ≥50 kg")+")",sf(mg)+" mg de fósforo elemental = "+sf(mmol)+" mmol")+pp("Dosis por kg (CIME Garrahan 2022)",sf(mgk)+" mg/kg en "+hr+"; repetir hasta fósforo 2 mg/dL")+pp("Fosfato de sodio o de potasio (3 mmol de P/mL; 1 mmol = 31 mg)",sf(ml)+" mL<br>Aporte de potasio con fosfato de K (4,4 mEq/mL): "+sf(ml*4.4)+" mEq<br>Aporte de sodio con fosfato de Na (4 mEq/mL): "+sf(ml*4)+" mEq")+pp("Dilución y velocidad","Concentración máxima: periférica 0,05 mmol/mL (≥ "+sf(mmol/0.05)+" mL), central 0,12 mmol/mL (≥ "+sf(mmol/0.12)+" mL). Velocidad máxima 0,06 mmol/kg/h (no menos de "+sf(mmol/w/0.06)+" h).")
  +(mmol>45?wn("La dosis calculada supera 45 mmol de fósforo, que es la dosis única máxima habitual en adultos: fraccionar y verificar con el protocolo del servicio."):"")+wn("Elegir la sal según sodio y potasio del paciente. Monitoreo cardíaco con infusión intermitente o dosis altas. No administrar en insuficiencia renal severa. Incompatible con calcio y magnesio. Chequear calcio antes de administrar.")}
 else if(g&&!(w>0))o+=need();
 else o+=pp("Gravedad","Niños (<50 kg): leve 1,5–1,9; moderada 1–1,4; grave &lt;1 mg/dL. Adultos (≥50 kg): leve 2,3–3; moderada 1,6–2,2; grave &lt;1,5 mg/dL. Ingresá el fósforo o elegí la gravedad.");
 o+=pp("Mantenimiento EV","Niños: 15 a 45 mg/kg/día (inicio 15; máximo 45 mg/kg/día)"+(w>0?" = "+sf(15*w)+" a "+sf(45*w)+" mg/día":"")+". Adultos: 1550–2170 mg/día.");
 o+=pp("Síndrome de realimentación","Con desnutrición, ayuno prolongado o reinicio de nutrición: controlar fósforo, potasio y magnesio y reponer antes y durante la realimentación.");
 Q("#e-po1").innerHTML=o}
function hiperP(){const p=n("e-q1"),c=n("e-q2");let o="";
 if(p>0&&c>0){const pr=p*c;o+=big("Producto calcio × fósforo",sf(pr)+" mg²/dL²")+(pr>60?wn("Producto mayor de 55–60: riesgo de calcificación metastásica. Reducir el fósforo."):pp("Interpretación","Menor de 55–60 mg²/dL²."))}
 o+=pp("Medidas","Suspender aportes de fósforo (nutrición, enemas con fosfato). Hidratación con SF si la función renal lo permite. Quelantes con las comidas (carbonato de calcio, sevelamer). Con insuficiencia renal grave o hipocalcemia sintomática: diálisis. No dar calcio IV salvo que haya hipocalcemia sintomática (riesgo de precipitación).");
 Q("#e-po2").innerHTML=o}
function hipoMg(){const w=W();let o="";
 if(w>0){o=big("Sulfato de magnesio 25 mg/kg",sf(Math.min(25*w,2000))+" mg"+(25*w>2000?" (tope adulto 2 g)":""))+pp("Sulfato de magnesio 25% (250 mg/mL)",sf(Math.min(25*w,2000)/250)+" mL")+pp("Dilución (Fórmulas y preparaciones)","Diluir en 50 o 100 mL. Regla de 3. Ej 10 kg: 250 mg × 100 ÷ 25.000 = 1 mL.")+pp("Rango habitual","25–50 mg/kg = "+sf(25*w)+" a "+sf(Math.min(50*w,2000))+" mg (máx 2 g), en 20 min–6 h según urgencia. 1 g de sulfato de Mg = 8,1 mEq.")+wn("Si hay arritmia (torsión de puntas) o convulsión, pasar en 10–20 min con monitoreo. Vigilar hipotensión, bradicardia y pérdida de reflejos. Cuidado en insuficiencia renal. Verificar con el protocolo del servicio.")}
 else o=need();
 Q("#e-mo1").innerHTML=o}
function hiperMg(){const w=W();let o="";
 if(w>0)o=pp("Antagonizar con calcio","Gluconato de Ca 10%: 0,6–1 mL/kg = "+sf(Math.min(.6*w,10))+" a "+sf(Math.min(w,10))+" mL, máx 10 mL (Fórmulas y preparaciones: calcio en hipermagnesemia), lento, con ECG")+pp("Eliminar","Suspender magnesio. Hidratación con SF y furosemida 1 mg/kg = "+sf(w)+" mg EV si hay diuresis. Con insuficiencia renal o toxicidad grave: diálisis.")+wn("Signos: hiporreflexia, hipotensión, bradicardia, depresión respiratoria, paro. Tener la vía aérea asegurada si hay depresión respiratoria.");
 else o=need();
 Q("#e-mo2").innerHTML=o}
function gluc(){const g1=n("e-g1"),g2=n("e-g2");let go="";
 if(g1>0&&g2>0){if(g2<=100)go=pp("Resultado","Con glucemia ≤100 mg/dL no hace falta corregir el sodio.");
  else go=big("Sodio corregido (factor 1,6)",sf(g1+1.6*(g2-100)/100)+" mEq/L")+pp("Con factor 2 (GAP Garrahan 2025, cetoacidosis diabética)",sf(g1+2*(g2-100)/100)+" mEq/L")+pp("Con factor 2,4 (usado por algunos autores)",sf(g1+2.4*(g2-100)/100)+" mEq/L")+wn("Estimación: por cada 100 mg/dL de glucemia por encima de 100, el sodio medido baja unos 1,6 mEq/L.")}
 Q("#e-go").innerHTML=go}
function gaso(){let ph=n("e-ph"),pc=n("e-pc"),hc=n("e-hc");const a=isFinite(ph)&&ph>0,b=isFinite(pc)&&pc>0,c=isFinite(hc)&&hc>0;let o="";
 if(a&&b&&!c){hc=0.03*pc*Math.pow(10,ph-6.1);o=big("Bicarbonato calculado",sf(hc)+" mEq/L")}
 else if(a&&c&&!b){pc=hc/(0.03*Math.pow(10,ph-6.1));o=big("PCO2 calculada",sf(pc)+" mmHg")}
 else if(b&&c&&!a){ph=6.1+Math.log10(hc/(0.03*pc));o=big("pH calculado",ph.toFixed(2).replace(".",","))}
 else if(a&&b&&c){const p2=6.1+Math.log10(hc/(0.03*pc));o=pp("Coherencia","pH calculado con PCO2 y bicarbonato: "+p2.toFixed(2).replace(".",",")+(Math.abs(p2-ph)>0.05?". No coincide con el pH ingresado: revisar los datos.":". Coincide."))}
 if((a||isFinite(ph))&&isFinite(hc)&&hc>0&&isFinite(ph)){
  if(ph<7.35&&hc<22)o+=pp("Acidosis metabólica: PCO2 esperada",sf(1.5*hc+8)+" ± 2 mmHg (Winter). Fórmulas y preparaciones: "+sf(40-1.25*(24-hc))+" mmHg. PCO2 mayor que la esperada: además acidosis respiratoria; menor: alcalosis respiratoria.");
  else if(ph>7.45&&hc>26)o+=pp("Alcalosis metabólica: PCO2 esperada",sf(40+0.7*(hc-24))+" mmHg (Fórmulas y preparaciones: "+sf(40+(hc-24))+").");
  else if(isFinite(pc)&&pc>0){if(ph<7.35&&pc>45)o+=pp("Acidosis respiratoria","Bicarbonato esperado: agudo +1 mEq/L cada 10 mmHg sobre 40 (≈"+sf(24+(pc-40)/10)+"); crónico +3,5 (≈"+sf(24+3.5*(pc-40)/10)+").");else if(ph>7.45&&pc<35)o+=pp("Alcalosis respiratoria","Bicarbonato esperado: agudo −2 mEq/L cada 10 mmHg bajo 40 (≈"+sf(24-2*(40-pc)/10)+"); crónico −4 (≈"+sf(24-4*(40-pc)/10)+").")}}
 Q("#e-gaso").innerHTML=o}
function ag(){const na=n("e-ag1"),cl=n("e-ag2"),b=n("e-ag3"),al=n("e-ag4");let o="";
 if(na>0&&cl>0&&b>=0&&Q("#e-ag3").value!==""){const g=na-cl-b;o=big("Anión restante",sf(g)+" mEq/L")+pp("Referencia","Normal ≈ 12 ± 4 mEq/L (con albúmina normal).");
  if(al>0){const gc=g+2.5*(4.4-al);o+=pp("Corregido por albúmina",sf(gc)+" mEq/L (+2,5 por cada g/dL de albúmina bajo 4,4)")}
  const gg=al>0?g+2.5*(4.4-al):g;
  if(gg>16){const d=b<24?(gg-12)/(24-b):NaN;if(isFinite(d))o+=pp("Delta/delta (ΔAG ÷ ΔHCO3)",sf(d)+(d<0.4?": acidosis hiperclorémica asociada":d<1?": acidosis mixta (AG elevado + hiperclorémica)":d<=2?": acidosis con AG elevado pura":": además hay alcalosis metabólica o acidosis respiratoria crónica"))}}
 Q("#e-ago").innerHTML=o}
function run(){hipoNa();hiperNa();hipoK();hiperK();acidosis();alcalosis();hipoCa();hiperCa();hipoP();hiperP();hipoMg();hiperMg();gluc();gaso();ag()}
Q("#c-elec").addEventListener("input",run);Q("#c-elec").addEventListener("change",run);run();
})();;
(function(){
/* Fórmulas lácteas y meta calórica. Basado en: Hospital Garrahan, Área de Alimentación, "Criterios de atención operativos para la indicación dietética en pacientes internados" (ISBN 978-987-3685-08-8). Tablas y fórmulas tomadas del archivo calculadora_meta_calorica.html. */
const Q=s=>document.querySelector(s),E=id=>document.getElementById(id);
const RDA_MESES = [
  {from:0, nino:113, nina:107}, {from:1, nino:104, nina:101}, {from:2, nino:95, nina:94},
  {from:3, nino:82, nina:84}, {from:4, nino:81, nina:83}, {from:5, nino:79, nina:78},
  {from:6, nino:79, nina:78}, {from:7, nino:79, nina:78}, {from:8, nino:79, nina:78},
  {from:9, nino:80, nina:79}, {from:10, nino:80, nina:79}, {from:11, nino:81, nina:79},
];
const RDA_ANIOS = [
  {from:1, nino:84, nina:80}, {from:2, nino:80, nina:81}, {from:3, nino:77, nina:77},
  {from:4, nino:74, nina:74}, {from:5, nino:72, nina:71}, {from:6, nino:70, nina:69},
  {from:7, nino:68, nina:67}, {from:8, nino:67, nina:64}, {from:9, nino:65, nina:61},
  {from:10, nino:62, nina:58}, {from:11, nino:60, nina:55}, {from:12, nino:58, nina:52},
  {from:13, nino:56, nina:49}, {from:14, nino:53, nina:47}, {from:15, nino:52, nina:45},
  {from:16, nino:50, nina:44}, {from:17, nino:44, nina:44},
];
const TMB_ANIOS = [
  {from:1, mujer:55, varon:57}, {from:2, mujer:56, varon:57}, {from:3, mujer:53, varon:55},
  {from:4, mujer:49, varon:51}, {from:5, mujer:46, varon:48}, {from:6, mujer:44, varon:46},
  {from:7, mujer:41, varon:44}, {from:8, mujer:39, varon:42}, {from:9, mujer:36, varon:40},
  {from:10, mujer:33, varon:37}, {from:11, mujer:31, varon:35}, {from:12, mujer:29, varon:33},
  {from:13, mujer:28, varon:31}, {from:14, mujer:27, varon:30}, {from:15, mujer:26, varon:29},
  {from:16, mujer:26, varon:28}, {from:17, mujer:26, varon:27},
];

// (etiqueta, categoria, kcal/100mL, HC, PROT, GRASAS, SODIO(mg), mOsm/L)
const FORMULAS = [
  ["PRE - Prematuros","Fórmulas para prematuro",80,8,2.4,4.3,46,275],
  ["PRE! - Prematuros concentrada","Fórmulas para prematuro",106,11,3.1,5.7,62,370],
  ["D - Inicio","Fórmulas de inicio",68,7.5,1.5,3.6,24,260],
  ["D! - Inicio concentrada","Fórmulas de inicio",92.6,10,1.9,5,33,350],
  ["B - Continuación","Fórmulas de continuación",70,7.8,2,3.2,34,270],
  ["B! - Continuación concentrada","Fórmulas de continuación",93,10.5,2.8,4.4,45,355],
  ["A - Niños mayores","Niños mayores",67,7.4,2.6,2.9,38,null],
  ["C - Sin lactosa","Fórmulas especiales",73,7.7,2.4,3.6,42,200],
  ["C! - Sin lactosa concentrada","Fórmulas especiales",97,10.2,3.2,4.8,56,267],
  ["E - Con hidrolizado proteico parcial","Fórmulas especiales",66.7,6.9,2.2,3.4,54,180],
  ["E! - Con hidrolizado proteico parcial concentrada","Fórmulas especiales",89,9.2,2.9,4.5,72,240],
  ["CA - Reducida en lactosa","Fórmulas especiales",61,4.8,3.25,3.25,46,null],
  ["DESC - Totalmente descremada","Fórmulas especiales",36,5.2,3.5,0.1,46,null],
  ["MONO - Con alto contenido de TCM","Fórmulas especiales",74.2,12,2,2.1,35,280],
  ["NEO - Con aminoácidos libres","Fórmulas especiales",70,7.9,2.2,3.4,17.7,360],
  ["H - Con hidrolizado extenso de proteínas","Fórmulas especiales",66.5,6.8,1.8,3.5,18.5,180],
  ["SOJA - Con aislado proteico de soja","Fórmulas especiales",66.4,6.7,1.8,3.6,18,180],
  ["LIQ! - Suplemento hipercalórico/hiperproteico","Suplemento",130,17,5.5,4.4,60,330],
  ["LH-PT-SF - Leche humana pretérmino sin fortificar","Centro de Lactancia Materna",70,6.95,1.81,4,40,305],
  ["LH-PT-F - Leche humana pretérmino fortificada","Centro de Lactancia Materna",86,9.75,2.91,4,45,399],
  ["LH-T - Leche humana madura término","Centro de Lactancia Materna",66,7,0.9,3.8,16,286],
];
const bk=(age,t)=>{let b=t[0];for(const r of t){if(r.from<=age)b=r;else break}return b};
const fm=(v,d=0)=>(v===null||v===undefined||!isFinite(v))?"–":v.toLocaleString("es-AR",{minimumFractionDigits:d,maximumFractionDigits:d});
const DEF="B - Continuación";
const GC={"Fórmulas para prematuro":"#C2410C","Fórmulas de inicio":"#0A7A78","Fórmulas de continuación":"#2563EB","Niños mayores":"#7C3AED","Fórmulas especiales":"#B45309"};
const kc=n=>{const f=FORMULAS.find(x=>x[0]===n);return f?`${fm(f[2],f[2]%1?1:0)} kcal · ${fm(f[4],1)} g prot por 100 mL`:""};
const picker=(id)=>{let og="",h="";FORMULAS.forEach(f=>{if(f[1]!==og){if(og)h+="</div>";h+=`<div class="mp-g" style="--gc:${GC[f[1]]||"#0A7A78"}"><div class="mp-h">${f[1]}</div>`;og=f[1]}
 h+=`<button type="button" class="mp-o" data-v="${f[0].replace(/"/g,"&quot;")}" aria-pressed="${f[0]===DEF}"><span class="mp-n">${f[0]}</span><span class="mp-s">${fm(f[2],f[2]%1?1:0)} kcal · ${fm(f[4],1)} g prot</span></button>`});h+="</div>";
 return `<div class="f"><span>Fórmula o leche</span></div><input type="hidden" id="${id}" value="${DEF}"><details class="mpick" id="${id}-d"><summary><div><b id="${id}-n">${DEF}</b><small id="${id}-k">${kc(DEF)}</small></div><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary><div class="mp-l" data-for="${id}">${h}</div></details>`};
const sel=(id,l,o,cl)=>`<label class="f${cl?" "+cl:""}"${cl?" hidden":""}><span>${l}</span><select id="${id}">${o}</select></label>`;
const chip=(id,l,s)=>`<div class="mchip"><b id="${id}">–</b><small>${l}</small>${s?`<em id="${s}">–</em>`:""}</div>`;
const BOTTLE='<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="bgm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EAF8F7"/><stop offset="1" stop-color="#BDE7E3"/></linearGradient></defs><path d="M24 2.5c-2.4 0-3.9 1.7-3.9 3.9V9h7.8V6.4c0-2.2-1.5-3.9-3.9-3.9z" fill="#F2C9A2" stroke="#C9976B" stroke-width="1"/><rect x="14.5" y="9" width="19" height="6.5" rx="2.5" fill="#0A7A78"/><path d="M17 15.5h14l2.2 4.2V40a5 5 0 0 1-5 5H19.8a5 5 0 0 1-5-5V19.7z" fill="url(#bgm)" stroke="#0A7A78" stroke-width="2"/><path d="M15.4 29.5h17.2V40a4.4 4.4 0 0 1-4.4 4.4H19.8A4.4 4.4 0 0 1 15.4 40z" fill="#fff"/><g stroke="#0A7A78" stroke-width="1.8" stroke-linecap="round"><path d="M18.5 21.5h5.5M18.5 25.5h3.5M18.5 29.5h5.5M18.5 33.5h3.5"/></g></svg>';
const html=`<details class="card inf sed lac" id="c-leche"><summary><div class="sh"><span class="ic">${ic("flask")}</span><b>Fórmulas lácteas</b>${ic("chev","chev")}</div></summary><div class="calc">
<p class="lc-in">Calcula la meta calórica y el volumen de fórmula o leche, y el aporte de nutrientes. También el aporte de lo que el paciente recibe hoy.</p>
${fld("m-w","Peso real (kg)")}
<div class="cs" id="m-tabs" role="group" aria-label="Modo"><button type="button" data-m="1" aria-pressed="true">Calcular meta</button><button type="button" data-m="2" aria-pressed="false">Aporte actual</button></div>
<div id="m-p1">
${sel("m-c","Situación clínica",'<option value="sano">Paciente sano</option><option value="critico">Paciente crítico</option><option value="quemado">Paciente quemado o con fibrosis quística (FQ)</option>')}
<div class="flds">${sel("m-u","Unidad de edad",'<option value="Meses">Meses</option><option value="Años" selected>Años</option>')}${fld("m-e","Edad")}</div>
${sel("m-s","Sexo",'<option value="">Elegir</option><option value="Varón">Varón</option><option value="Mujer">Mujer</option>')}
<div id="m-gf" hidden>${fld("m-f","Factor sobre el requerimiento (Schofield)").replace('placeholder="0"','placeholder="1"')}<p class="nt2" id="m-fh"></p></div>
${fld("m-h","Talla (cm), opcional: mejora la precisión de Schofield")}
${sel("m-o","¿Paciente obeso?",'<option value="No">No</option><option value="Sí">Sí</option>')}
<div id="m-go" hidden>${fld("m-pt","Peso teórico para la talla (kg), leído de la curva de crecimiento")}</div>
<div class="big"><small>Meta calórica total</small><b id="m-meta">–</b><small id="m-metakg">– kcal/kg/día</small></div>
<p class="lc-m" id="m-met"></p>
<div class="wn" id="m-w1" hidden></div><div class="wn" id="m-w2" hidden></div>
<h4 class="mh">Volumen de fórmula o leche</h4>
${picker("m-fo")}
<div class="big"><small>Volumen</small><b id="m-vol">–</b><small>mL / día</small></div>
<div class="flds" style="margin-top:12px">${fld("m-nt","N.º de tomas por día (opcional)")}<label class="f"><span>Volumen por toma</span><input id="m-vt" type="text" value="–" disabled></label></div>
<h4 class="mh">Aporte de nutrientes al volumen calculado</h4>
<div class="mg">${chip("m-hc","Hidratos de carbono (g/día)")}${chip("m-pr","Proteínas (g/día)","m-prk")}${chip("m-gr","Grasas (g/día)")}${chip("m-na","Sodio (mg/día)*")}</div>
<p class="nt2">Osmolaridad de referencia de la fórmula elegida: <b><span id="m-os">–</span></b> mOsm/L.</p>
<div class="wn" id="m-w3" hidden></div><div class="wn" id="m-w4" hidden></div>
</div>
<div id="m-p2" hidden>
${picker("m-fo2")}
${fld("m-va","Volumen que está recibiendo (mL/día)")}
<div class="big"><small>Aporte que está recibiendo</small><b id="m-k2">–</b><small>kcal / día</small><small id="m-k2k">– kcal/kg/día</small></div>
<div class="mg" style="margin-top:12px">${chip("m-pr2","Proteínas (g/día)","m-pr2k")}${chip("m-hc2","Hidratos de carbono (g/día)")}${chip("m-gr2","Grasas (g/día)")}${chip("m-na2","Sodio (mg/día)*")}</div>
<p class="nt2">Osmolaridad de referencia de la fórmula elegida: <b><span id="m-os2">–</span></b> mOsm/L.</p>
</div>
<details class="sdd2 lc-how"><summary><div style="flex:1;min-width:0"><b>¿Cómo calcula la meta?</b><small>Paciente sano, crítico, quemado o con FQ</small></div>${ic("chev","chev")}</summary><div class="sdx">
<div class="pp"><small>Paciente sano</small>Meta = RDA (kcal/kg/día según edad y sexo) × peso. Menores de 12 meses usan la tabla de RDA por mes de vida.</div>
<div class="pp"><small>Paciente crítico</small>Meta = gasto energético basal de Schofield (kcal/día, por edad y sexo, con peso o con peso y talla) × factor (por defecto 1, sin factor de estrés). Es la recomendación ASPEN/SCCM 2017; lo ideal es medirlo con calorimetría indirecta.</div>
<div class="pp"><small>Paciente quemado o con fibrosis quística</small>Meta = Schofield + 30% del requerimiento (factor 1,3, editable). Para FQ se sugiere un aumento de 20–50% sobre el requerimiento: 1,3 está dentro de ese rango.</div>
<div class="pp"><small>Paciente obeso</small>Se usa el promedio entre el peso real y el peso teórico para la talla.</div>
<div class="pp"><small>Volumen y nutrientes</small>Volumen (mL/día) = meta ÷ kcal por 100 mL × 100. Cada nutriente = valor por 100 mL × volumen ÷ 100.</div>
</div></details>
<p class="nt2">*Sodio: el documento original titula esta columna "(g)"; por su magnitud parece tratarse de mg/100 mL. Verificar antes de usar en restricción de sodio.</p>
<p class="nt2">Gasto energético basal: ecuaciones de Schofield (1985), con peso o con peso y talla, hasta los 18 años; en mayores se usa la ecuación de Schofield de adultos. RDA y composición de las fórmulas: Hospital Garrahan, Área de Alimentación (ISBN 978-987-3685-08-8). Herramienta de apoyo para uso profesional: no reemplaza la valoración del equipo de Nutrición.</p>
</div></details>`;
Q("#calcs").insertAdjacentHTML("beforeend",html);
const V=id=>parseFloat(E(id).value),T=(id,t)=>{E(id).textContent=t},sh=(id,on,t)=>{const e=E(id);if(t!==undefined)e.innerHTML=t;e.hidden=!on};
function r1(){
 const cs=E("m-c").value;
 E("m-gf").hidden=cs==="sano";E("m-go").hidden=E("m-o").value!=="Sí";
 const defF=cs==="quemado"?1.3:1;E("m-f").placeholder=String(defF).replace(".",",");
 E("m-fh").textContent=cs==="quemado"?"Si lo dejás vacío se usa 1,3 (Schofield + 30% del requerimiento).":"Si lo dejás vacío se usa 1 (Schofield sin factor de estrés).";
 const un=E("m-u").value,ed=V("m-e"),sx=E("m-s").value,pw=V("m-w"),fa=V("m-f")||defF,ht=V("m-h"),ob=E("m-o").value,pt=V("m-pt"),nt=V("m-nt");
 const ids=["m-hc","m-pr","m-gr","m-na"];
 if(!isFinite(ed)||!isFinite(pw)||!sx){T("m-meta","–");T("m-metakg","– kcal/kg/día");T("m-met","");T("m-vol","–");E("m-vt").value="–";ids.forEach(i=>T(i,"–"));T("m-prk","–");T("m-os","–");["m-w1","m-w2","m-w3","m-w4"].forEach(i=>E(i).hidden=true);
  if(isFinite(ed)&&isFinite(pw)&&!sx)sh("m-w1",true,"Elegí el sexo para calcular.");return}
 const em=un==="Meses"?ed:ed*12,ea=un==="Años"?ed:ed/12;
 const pu=(ob==="Sí"&&isFinite(pt))?(pw+pt)/2:pw;
 let rda;if(em<12){const r=bk(em,RDA_MESES);rda=sx==="Varón"?r.nino:r.nina}else{const r=bk(Math.min(ea,17.99),RDA_ANIOS);rda=sx==="Varón"?r.nino:r.nina}
 const sch=(()=>{const m=sx==="Varón",W=pu,H=ht>0?ht/100:NaN;
  if(ea>=18)return m?15.057*W+692.2:14.818*W+486.6;
  const g=ea<3?0:ea<10?1:2;
  if(isFinite(H)){return m?[0.167*W+1517.4*H-617.6,19.59*W+130.3*H+414.9,16.25*W+137.2*H+515.5][g]:[16.252*W+1023.2*H-413.5,16.969*W+161.8*H+371.2,8.365*W+465*H+200.0][g]}
  return m?[59.512*W-30.4,22.706*W+504.3,17.686*W+658.2][g]:[58.317*W-31.1,20.315*W+485.9,13.384*W+692.6][g]})();
 const metd=isFinite(ht)&&ht>0?"Schofield con peso y talla":"Schofield con peso";
 let tfin,met;
 if(cs==="sano"){tfin=rda;met="RDA de "+fm(rda,0)+" kcal/kg/día por edad y sexo."}
 else if(cs==="critico"){tfin=sch*fa/pu;met=metd+": "+fm(sch,0)+" kcal/día × factor "+fm(fa,2)+"."}
 else{tfin=sch*fa/pu;met=metd+": "+fm(sch,0)+" kcal/día × factor "+fm(fa,2)+(fa===1.3?" (Schofield + 30% del requerimiento).":".")}
 const meta=tfin*pu;
 T("m-meta",fm(meta,0));T("m-metakg",isFinite(tfin)?fm(tfin,1)+" kcal/kg/día":"– kcal/kg/día");T("m-met","Cálculo: "+met+(ob==="Sí"&&isFinite(pt)?" Peso usado: "+fm(pu,1)+" kg (promedio con el peso teórico).":""));
 const fd=FORMULAS.find(f=>f[0]===E("m-fo").value),k100=fd?fd[2]:null,vol=k100?(meta/k100)*100:null;
 T("m-vol",fm(vol,0));E("m-vt").value=(vol&&nt)?fm(vol/nt,0):"–";
 if(fd&&vol){const pt2=fd[4]/100*vol;T("m-hc",fm(fd[3]/100*vol,1));T("m-pr",fm(pt2,1));T("m-prk",fm(pt2/pu,2)+" g/kg/día");T("m-gr",fm(fd[5]/100*vol,1));T("m-na",fm(fd[6]/100*vol,1));T("m-os",fd[7]?fm(fd[7],0):"s/d")}
 else{ids.forEach(i=>T(i,"–"));T("m-os","–");T("m-prk","–")}
 sh("m-w1",cs==="critico"&&fa>1,"⚠ ASPEN/SCCM 2017 recomiendan no sumar factores de estrés en el paciente crítico (se sobreestima el gasto): lo ideal es la calorimetría indirecta; si no hay, Schofield o la ecuación de la OMS sin factor.");
 sh("m-w2",ea>18,"⚠ Edad fuera del rango pediátrico de las tablas de referencia (hasta 18 años).");
 sh("m-w3",ob==="Sí"&&!isFinite(pt),"⚠ Falta ingresar el peso teórico para la talla (paciente marcado como obeso).");
 sh("m-w4",cs==="quemado"&&(fa<1.2||fa>1.5),"⚠ Para quemados y FQ se sugiere un incremento de 20–50% sobre el requerimiento (factor 1,2–1,5); el valor habitual es 1,3.");
}
function r2(){
 const pw=V("m-w"),vo=V("m-va"),fd=FORMULAS.find(f=>f[0]===E("m-fo2").value);
 if(!fd||!isFinite(vo)){["m-k2","m-pr2","m-hc2","m-gr2","m-na2"].forEach(i=>T(i,"–"));T("m-k2k","– kcal/kg/día");T("m-pr2k","– g/kg/día");T("m-os2","–");return}
 const k=fd[2]/100*vo,p=fd[4]/100*vo;
 T("m-k2",fm(k,0));T("m-pr2",fm(p,1));T("m-hc2",fm(fd[3]/100*vo,1));T("m-gr2",fm(fd[5]/100*vo,1));T("m-na2",fm(fd[6]/100*vo,1));T("m-os2",fd[7]?fm(fd[7],0):"s/d");
 if(isFinite(pw)&&pw>0){T("m-k2k",fm(k/pw,1)+" kcal/kg/día");T("m-pr2k",fm(p/pw,2)+" g/kg/día")}else{T("m-k2k","– kcal/kg/día");T("m-pr2k","– g/kg/día")}
}
const root=Q("#c-leche");
root.addEventListener("input",()=>{r1();r2()});root.addEventListener("change",()=>{r1();r2()});
root.addEventListener("click",e=>{const o=e.target.closest(".mp-o");if(!o)return;const l=o.closest(".mp-l"),id=l.dataset.for,v=o.dataset.v;
 E(id).value=v;l.querySelectorAll(".mp-o").forEach(x=>x.setAttribute("aria-pressed",x===o));T(id+"-n",v);T(id+"-k",kc(v));E(id+"-d").open=false;r1();r2()});
E("m-tabs").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const m=b.dataset.m;document.querySelectorAll("#m-tabs button").forEach(x=>x.setAttribute("aria-pressed",x===b));E("m-p1").hidden=m!=="1";E("m-p2").hidden=m!=="2"});
r1();r2();
})();;
(function(){
/* Conversión de opioides, goteo continuo a intermitente e hipoglucemia. */
const sf=v=>isFinite(v)?parseFloat(v.toPrecision(3)).toString().replace(".",","):"—";
const Q=s=>document.querySelector(s),E=id=>document.getElementById(id);
const sub=(t,sm,b)=>`<details class="sdd2"><summary><div style="flex:1;min-width:0"><b>${t}</b><small>${sm}</small></div>${ic("chev","chev")}</summary><div class="sdx">${b}</div></details>`;
const big=(l,v)=>`<div class="big"><small>${l}</small><b>${v}</b></div>`;
const pp=(l,v)=>`<div class="pp"><small>${l}</small>${v}</div>`;
const wn=t=>`<div class="wn">${t}</div>`;
const card=(id,title,icon,body)=>`<details class="card inf sed" id="${id}"><summary><div class="sh"><span class="ic">${ic(icon)}</span><b>${title}</b>${ic("chev","chev")}</div></summary><div class="calc">${body}</div></details>`;
const sel=(id,l,o)=>`<label class="f"><span>${l}</span><select id="${id}">${o}</select></label>`;
const C=Q("#calcs");

/* ---------- Opioides ---------- */
C.insertAdjacentHTML("beforeend",card("c-opi","Conversión de opioides","pill",
`${fld("o-w","Peso (kg), opcional")}
${sub("Fentanilo ↔ morfina (IV)","10 µg de fentanilo ≈ 1 mg de morfina",`<div class="flds">${fld("o-f","Fentanilo (µg/kg/h)")}${fld("o-m","Morfina (mg/kg/h)")}</div><div id="o-o1"></div>
<p class="nt2"><b>Equivalencia usada:</b> 10 µg/kg/h de fentanilo ≈ 1 mg/kg/h de morfina IV, igual en las dos direcciones. Las tablas de equianalgesia varían (≈ 6 a 10 µg de fentanilo por mg de morfina; la otra nota de Fórmulas y preparaciones, 10 mg de morfina ≈ 60 µg, está en ese rango). El peso es opcional: solo sirve para mostrar la dosis total por hora. Al rotar de opioide suele reducirse la dosis equivalente por tolerancia cruzada incompleta: ajustar a la clínica.</p>`)}
${sub("Fentanilo o morfina a metadona (retiro de analgosedación)","Algoritmo de retiro con metadona de ARUCIP (protocolo piloto)",`${sel("o-s","Opioide en infusión",'<option value="f">Fentanilo (µg/kg/h)</option><option value="m">Morfina (mg/kg/h)</option>')}
${fld("o-d","Dosis actual de la infusión")}
${sel("o-q","Tiempo que lleva recibiendo opioides",'<option value="a">5 a 10 días</option><option value="b">Más de 10 días</option>')}
<div id="o-o2"></div>
<p class="nt2"><b>Dosis inicial:</b> 0,1 mg/kg/dosis de metadona por cada µg/kg/h de fentanilo (o por cada 0,1 mg/kg/h de morfina), por vía oral cada 6 h. Ej: fentanilo 2 µg/kg/h o morfina 0,2 mg/kg/h = 0,2 mg/kg/dosis. Dosis máxima de metadona: 20 mg por toma. La morfina se pasa a fentanilo equivalente (10 mg de morfina ≈ 100 µg de fentanilo), de modo que ambos opioides dan el mismo resultado.</p>
<p class="nt2"><b>Descenso del opioide:</b> tras la 1.ª dosis de metadona comenzar el descenso; en la 2.ª dosis, reducir el opioide a la mitad; en la 3.ª, a la mitad otra vez; en la 4.ª, suspender. Ej: fentanilo 2 → 1 → 0,5 → suspender.</p>
<p class="nt2"><b>Esquema de la metadona:</b> 5–10 días de opioide: cada 6 h por 2 días, cada 8 h por 2 días, cada 12 h por 1 día y luego cada 24 h. Más de 10 días: cada 6 h por 4 días, cada 8 h por 2 días, cada 12 h por 2 días y luego cada 24 h.</p>
<p class="nt2"><b>Benzodiacepina:</b> si recibía IV, pasar a vía oral (ej: midazolam 0,1 mg/kg/h → lorazepam VO 0,1 mg/kg cada 6 h). <b>Monitoreo:</b> WAT-1 o SOS desde la primera reducción; objetivo WAT-1 &lt;3 y SOS &lt;4. Si el puntaje supera el objetivo: rescate con morfina (máx 10 mg por dosis, sobre la dosis horaria previa). Sedación excesiva: omitir una dosis y reducir 10–20%. Delirium (CAPD ≥9): considerar haloperidol o levomepromazina. Clonidina opcional: 1–3 µg/kg cada 8 h.</p>
<p class="nt2"><b>Retiro de la metadona:</b> tras 24 h sin abstinencia significativa, reducir 20% cada 24 h (5 días) o 20% cada 48 h (10 días). Si reaparece la abstinencia, volver a la última dosis efectiva y enlentecer a la mitad.</p>
<p class="nt2">Otras series publicadas (por ejemplo, la del Children's Hospital of Philadelphia, Srinivasan 2017) usan dosis de metadona menores: <b>no existe una conversión única</b>. La metadona tiene vida media larga y puede acumularse. Confirmar con el protocolo del servicio.</p>`)}
<p class="nt2">Herramienta de apoyo: no reemplaza el protocolo del servicio ni al farmacéutico clínico. Verificá siempre la conversión antes de indicar.</p>`));
function opi(){
 const w=n("o-w"),f=n("o-f"),m=n("o-m");let o="";
 if(f>0){const mm=f/10;o+=big("Fentanilo "+sf(f)+" µg/kg/h equivale a",sf(mm)+" mg/kg/h de morfina");if(w>0)o+=pp("Para "+sf(w)+" kg",sf(f*w)+" µg/h de fentanilo ≈ "+sf(mm*w)+" mg/h de morfina")}
 if(m>0){const ff=m*10;o+=big("Morfina "+sf(m)+" mg/kg/h equivale a",sf(ff)+" µg/kg/h de fentanilo");if(w>0)o+=pp("Para "+sf(w)+" kg",sf(m*w)+" mg/h de morfina ≈ "+sf(ff*w)+" µg/h de fentanilo")}
 E("o-o1").innerHTML=o;
 const s=E("o-s").value,d=n("o-d"),q=E("o-q").value;let r="";
 if(d>0){const fent=s==="f"?d:d*10,per=0.1*fent,w=n("o-w"),mx=20;
  r=big("Metadona inicial (VO cada 6 h)",sf(per)+" mg/kg/dosis")+pp("Cálculo",(s==="m"?`Morfina ${sf(d)} mg/kg/h ≈ fentanilo ${sf(fent)} µg/kg/h. `:"")+`0,1 mg/kg/dosis × ${sf(fent)} (µg/kg/h de fentanilo) = ${sf(per)} mg/kg/dosis, es decir ${sf(per*4)} mg/kg/día.`);
  if(per>0.2)r+=wn("La dosis calculada supera 0,2 mg/kg/dosis, un valor alto como inicio de metadona en varias series pediátricas: confirmar con el protocolo y con farmacia antes de indicar.");if(w>0){const mg=per*w;r+=pp("Para "+sf(w)+" kg",sf(Math.min(mg,mx))+" mg por toma ("+sf(Math.min(mg,mx)*4)+" mg/día)");if(mg>mx)r+=wn("La dosis calculada ("+sf(mg)+" mg) supera el máximo de 20 mg por toma: se limita a 20 mg.")}
  else r+=pp("Máximo","20 mg por toma. Ingresá el peso para ver los mg por toma.");
  r+=pp("Descenso del opioide según las dosis de metadona",`1.ª dosis: ${sf(d)} ${s==="f"?"µg":"mg"}/kg/h (empezar a descender)<br>2.ª dosis: ${sf(d/2)}<br>3.ª dosis: ${sf(d/4)}<br>4.ª dosis: suspender`);
  r+=pp("Esquema posterior",q==="a"?"Cada 6 h × 2 días → cada 8 h × 2 días → cada 12 h × 1 día → cada 24 h":"Cada 6 h × 4 días → cada 8 h × 2 días → cada 12 h × 2 días → cada 24 h");
  r+=wn("Protocolo piloto de ARUCIP: confirmar con el protocolo del servicio y farmacia antes de indicar. Evaluar la abstinencia con WAT-1 o SOS desde la primera reducción.")}
 E("o-o2").innerHTML=r;
}
Q("#c-opi").addEventListener("input",opi);Q("#c-opi").addEventListener("change",opi);

/* ---------- Continuo a intermitente ---------- */
C.insertAdjacentHTML("beforeend",card("c-int","Goteo continuo a intermitente","drop",
`${fld("t-w","Peso (kg), opcional")}
${sub("De goteo continuo a dosis intermitentes","Dosis por hora × intervalo",`${sel("t-u","Unidad del goteo",'<option value="µg">µg/kg/h</option><option value="mg">mg/kg/h</option>')}
${fld("t-r","Dosis del goteo (por kg por hora)")}
${sel("t-i","Intervalo entre dosis",'<option>2</option><option>3</option><option selected>4</option><option>6</option><option>8</option><option>12</option>')}
<div id="t-o1"></div>`)}
${sub("De dosis intermitente a goteo continuo","Dosis por toma ÷ intervalo",`${sel("t-u2","Unidad de la dosis",'<option value="µg">µg/kg</option><option value="mg">mg/kg</option>')}
${fld("t-d","Dosis por toma (por kg)")}
${sel("t-i2","Intervalo entre dosis",'<option>2</option><option>3</option><option selected>4</option><option>6</option><option>8</option><option>12</option>')}
<div id="t-o2"></div>`)}
<p class="nt2">Es una equivalencia aritmética de la dosis total: dosis por toma = dosis por hora × horas del intervalo. No incluye el ajuste clínico: el efecto de un bolo intermitente es distinto al de un goteo (pico, duración, acumulación). Ajustar según la droga, la respuesta y las escalas de sedación o abstinencia.</p>`));
function intm(){
 const w=n("t-w");let o="";const r=n("t-r"),u=E("t-u").value,i=+E("t-i").value;
 if(r>0){const d=r*i;o=big("Cada "+i+" h, dar",sf(d)+" "+u+"/kg")+pp("Dosis total diaria",sf(r*24)+" "+u+"/kg/día ("+24/i+" tomas)");if(w>0)o+=pp("Para "+sf(w)+" kg",sf(d*w)+" "+u+" por toma; "+sf(r*24*w)+" "+u+"/día")}
 E("t-o1").innerHTML=o;
 const d2=n("t-d"),u2=E("t-u2").value,i2=+E("t-i2").value;let o2="";
 if(d2>0){const r2=d2/i2;o2=big("Goteo equivalente",sf(r2)+" "+u2+"/kg/h")+pp("Dosis total diaria",sf(d2*24/i2)+" "+u2+"/kg/día");if(w>0)o2+=pp("Para "+sf(w)+" kg",sf(r2*w)+" "+u2+"/h")}
 E("t-o2").innerHTML=o2;
}
Q("#c-int").addEventListener("input",intm);Q("#c-int").addEventListener("change",intm);

/* ---------- Hipoglucemia ---------- */
C.insertAdjacentHTML("beforeend",card("c-hg","Hipoglucemia","drop",
`${fld("g-w","Peso (kg)")}
<div id="g-o"></div>
${sub("Flujo de glucosa (GIR) del goteo actual","mg/kg/min",`<div class="flds">${fld("g-r","Flujo (mL/h)")}${fld("g-p","Dextrosa (%)")}</div><div id="g-o2"></div>`)}
${sub("Flujo necesario para un GIR deseado","mL/h",`<div class="flds">${fld("g-gd","GIR deseado (mg/kg/min)")}${fld("g-p2","Dextrosa (%)")}</div><div id="g-o3"></div>`)}
${sub("Suma de hasta 3 infusiones de glucosa","GIR total del paciente",[1,2,3].map(i=>`<div class="flds">${fld("g-r"+i+"x","Infusión "+i+": flujo (mL/h)")}${fld("g-p"+i+"x","Dextrosa (%)")}</div>`).join("")+`<div id="g-o5"></div>`)}
${sub("Preparar una dextrosa a medida","Mezcla de dos concentraciones",`<div class="flds">${fld("g-fv","Volumen final (mL)")}${fld("g-ft","Concentración deseada (%)")}</div><div class="flds">${fld("g-fa","Dextrosa más diluida (%)")}${fld("g-fb","Dextrosa más concentrada (%)")}</div><div id="g-o6"></div>`)}
${sub("GIR desde el volumen diario","mL/kg/día × % de dextrosa × 10 ÷ 1440",`<div class="flds">${fld("g-v","Volumen (mL/kg/día)")}${fld("g-p3","Dextrosa (%)")}</div><div id="g-o4"></div>`)}
${sub("Después del bolo: qué sigue","Goteo, glucagón y reevaluación",`<div class="pp"><small>Goteo de mantenimiento</small>Tras el bolo, iniciar un goteo de glucosa. GIR habitual de 4–8 mg/kg/min en niños y 6–8 mg/kg/min en lactantes y neonatos; si hace falta más de 10–12 mg/kg/min, sospechar hiperinsulinismo y pedir estudios (insulina, cortisol, hormona de crecimiento, cetonas, ácidos grasos libres) en la muestra crítica.</div><div class="pp"><small>Sin acceso venoso</small>Glucagón 0,03 mg/kg IM o SC (máx 1 mg). No sirve si el glucógeno hepático está agotado (ayuno prolongado, desnutrición, neonatos pretérmino).</div><div class="pp"><small>Controles</small>Glucemia a los 15 min del bolo y luego cada 1–3 h mientras se ajusta el goteo. Evitar suspender el goteo de golpe: descender de a poco con glucemias seriadas. Concentración: por vía periférica &lt;25% (en neonatos máx 12,5%).</div>`)}
${sub("¿Cómo se calcula?","Bolo, concentración y GIR",`<div class="pp"><small>Bolo de dextrosa</small>0,5–1 g/kg. Con dextrosa al 10% (10 g en 100 mL) son 5–10 mL/kg; con dextrosa al 25% son 2–4 mL/kg. Gramos = volumen (mL) × concentración (%) ÷ 100.</div>
<div class="pp"><small>Flujo de glucosa (GIR)</small>GIR (mg/kg/min) = flujo (mL/h) × % de dextrosa × 10 ÷ 60 ÷ peso. El × 10 pasa el % a mg/mL; ÷ 60 pasa de horas a minutos.</div>
<div class="pp"><small>Con volumen diario</small>GIR = mL/kg/día × % de dextrosa × 10 ÷ 1440 (Fórmulas y preparaciones).</div>
<div class="pp"><small>Flujo para un GIR deseado</small>mL/h = GIR × peso × 60 ÷ (% de dextrosa × 10).</div>
<div class="pp"><small>Definición</small>Hipoglucemia: glucemia baja (en lactantes y niños suele definirse &lt;60 mg/dL, y &lt;45 mg/dL en neonatos). Las definiciones varían entre guías. Controlar la glucemia después del bolo y mientras se ajusta el goteo.</div>`)}
<p class="nt2">Dosis de bolo según Fórmulas y preparaciones (hipoglucemia) y AHA PALS (0,5–1 g/kg). Herramienta de apoyo: verificá la concentración de la dextrosa y la vía antes de administrar (la dextrosa al 25% puede requerir acceso central o dilución según el protocolo del servicio).</p>`));
function hg(){
 const w=n("g-w");let o="";
 if(w>0){o=big("Bolo de dextrosa (0,5–1 g/kg, máx 25 g)",sf(Math.min(.5*w,25))+" a "+sf(Math.min(w,25))+" g")+pp("Dextrosa 10% (5–10 mL/kg, máx 250 mL)",sf(Math.min(5*w,250))+" a "+sf(Math.min(10*w,250))+" mL")+pp("Dextrosa 25% (2–4 mL/kg, máx 100 mL)",sf(Math.min(2*w,100))+" a "+sf(Math.min(4*w,100))+" mL")}
 else o=pp("Falta el peso","Ingresá el peso para calcular el bolo.");
 E("g-o").innerHTML=o;
 const r=n("g-r"),p=n("g-p");let o2="";
 if(w>0&&r>=0&&p>0&&E("g-r").value!==""){o2=big("GIR actual",sf(r*p*10/60/w)+" mg/kg/min")+pp("Glucosa por día",sf(r*24*p/100/w)+" g/kg/día")}
 E("g-o2").innerHTML=o2;
 const gd=n("g-gd"),p2=n("g-p2");let o3="";
 if(w>0&&gd>0&&p2>0)o3=big("Flujo para GIR "+sf(gd)+" mg/kg/min",sf(gd*w*60/(p2*10))+" mL/h")+pp("Volumen por día",sf(gd*w*60/(p2*10)*24)+" mL/día");
 const v=n("g-v"),p3=n("g-p3");let o4="";
 if(v>0&&p3>0)o4=big("GIR",sf(v*p3*10/1440)+" mg/kg/min")+pp("Cálculo",`${sf(v)} mL/kg/día × ${sf(p3)}% × 10 ÷ 1440 (Fórmulas y preparaciones)`);
 let t=0,any=0;for(const i of [1,2,3]){const r=n("g-r"+i+"x"),pc=n("g-p"+i+"x");if(r>=0&&pc>0&&E("g-r"+i+"x").value!==""){t+=r*pc*10/60;any=1}}
 E("g-o5").innerHTML=any&&w>0?big("GIR total",sf(t/w)+" mg/kg/min")+pp("Glucosa por día",sf(t*60*24/1000/w)+" g/kg/día ("+sf(t*60*24/1000)+" g/día)")+pp("Cálculo","Σ (mL/h × % × 10 ÷ 60) ÷ peso. Ingresá el peso arriba."):(any?pp("Falta el peso","Ingresá el peso arriba para calcular."):"");
 const fv=n("g-fv"),ft=n("g-ft"),fa=n("g-fa"),fb=n("g-fb");let o6="";
 if(fv>0&&ft>0&&fa>=0&&fb>0&&E("g-fa").value!==""){if(!(fa<ft&&ft<fb))o6=wn("La concentración deseada debe estar entre la dextrosa más diluida y la más concentrada.");else{const vb=fv*(ft-fa)/(fb-fa);o6=big("Dextrosa "+sf(fb)+"%",sf(vb)+" mL")+pp("Dextrosa "+sf(fa)+"%",sf(fv-vb)+" mL")+pp("Resultado","Volumen final "+sf(fv)+" mL de dextrosa "+sf(ft)+"% ("+sf(fv*ft/100)+" g de glucosa). Verificar la osmolaridad y la vía de administración.")}}
 E("g-o6").innerHTML=o6;
 E("g-o4").innerHTML=o4;
 E("g-o3").innerHTML=o3;
}
Q("#c-hg").addEventListener("input",hg);Q("#c-hg").addEventListener("change",hg);hg();


})();;
(function(){
/* Necesidades basales: superficie corporal, agua basal y pérdidas insensibles del quemado (Fórmulas y preparaciones: (25 + % SCQ) × SCT, ml/hora). */
const sf=v=>isFinite(v)?parseFloat(v.toPrecision(3)).toString().replace(".",","):"—";
const Q=s=>document.querySelector(s);
const big=(l,v)=>`<div class="big"><small>${l}</small><b>${v}</b></div>`;
const pp=(l,v)=>`<div class="pp"><small>${l}</small>${v}</div>`;
const wn=t=>`<div class="wn">${t}</div>`;
const sub=(t,sm,b)=>`<details class="sdd2"><summary><div style="flex:1;min-width:0"><b>${t}</b><small>${sm}</small></div>${ic("chev","chev")}</summary><div class="sdx">${b}</div></details>`;
const html=`<details class="card inf sed" id="c-sc"><summary><div class="sh"><span class="ic">${ic("calc")}</span><b>Necesidades basales y paciente quemado</b>${ic("chev","chev")}</div></summary><div class="calc">
<div class="flds">${fld("sp","Peso (kg)")}${fld("ht","Talla (cm), opcional")}</div>
<div id="sc-o"></div>
${sub("Paciente quemado: pérdidas insensibles","(25 + % SCQ) × SCT, en ml en 24 horas",`${fld("sq","Superficie corporal quemada (% SCQ)")}<div id="sc-q"></div>`)}
<p class="nt2">Agua basal = superficie corporal × 1500 ml/m²/día. Superficie corporal: Haycock si hay talla; si no, la estimada con el peso solo ((4 × peso + 7) ÷ (peso + 90)). Quemados: pérdidas insensibles = (25 + % de superficie corporal quemada) × superficie corporal total (m²), en ml/hora (Fórmulas y preparaciones), que se agregan al plan de hidratación. Herramienta de apoyo: no reemplaza el criterio clínico.</p>
</div></details>`;
Q("#calcs").insertAdjacentHTML("beforeend",html);
function run(){const p=n("sp"),t=n("ht"),q=n("sq");let o="",qo="";
 if(p>0){const h=t>0?.024265*Math.pow(t,.3964)*Math.pow(p,.5378):NaN,w=(4*p+7)/(p+90),sc=isFinite(h)?h:w,basal=sc*1500;
  o=big("Superficie corporal",sf(sc)+" m²")+pp("Método",isFinite(h)?"Haycock, con peso y talla (con peso solo: "+sf(w)+" m²)":"Estimada con el peso solo (ingresá la talla para usar Haycock)")+big("Agua basal",sf(basal)+" ml/día")+pp("Por kilo",sf(basal/p)+" ml/kg/día");
  if(q>=0&&Q("#sq").value!==""){const ph=(25+q)*sc;
   qo=big("Pérdidas insensibles",sf(ph*24)+" ml en 24 horas")+pp("Por hora",sf(ph)+" ml/hora")+big("Agua basal + pérdidas insensibles",sf(basal+ph*24)+" ml en 24 horas")+pp("Cálculo",`(25 + ${sf(q)}) × ${sf(sc)} m² = ${sf(ph)} ml/h × 24 h`)+(q>100?wn("El % de superficie quemada no puede superar 100."):"")+pp("Nota","En quemaduras mayores de 15–20% de la superficie, la reanimación inicial se calcula con Parkland o Galveston (sección Quemados). Estas pérdidas insensibles se suman al plan de hidratación de mantenimiento.")}
  else qo=pp("Falta el dato","Ingresá el % de superficie corporal quemada.")}
 else{o=pp("Falta el peso","Ingresá el peso para calcular.");qo=""}
 Q("#sc-o").innerHTML=o;Q("#sc-q").innerHTML=qo}
Q("#c-sc").addEventListener("input",run);run();
})();;
(function(){
const Q=s=>document.querySelector(s),C=Q("#calcs");
["c-sed","c-opi","c-int","c-elec","c-inf","c-leche","c-sc","c-hg","c-hk"].forEach(id=>{const e=Q("#"+id);if(e)C.appendChild(e)});
})();;
})();
