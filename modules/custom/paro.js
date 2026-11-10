/* Modo PARO: metrónomo, temporizadores, audio y registro */
(function(){
const T=window.ARU.T;
const sum=a=>a.reduce((p,c)=>p+c,0);
const dkK=(l,v)=>`<div class="kv"><span>${l}</span><b>${v}</b></div>`;
T.parolog={t:"Registro del último PARO",c:{html:`<div class="dk"><p class="sub">Registro de la última RCP iniciada con el botón Emergencia: hora de cada adrenalina, descarga, ritmo y evento. Queda guardado solo en este dispositivo y se reemplaza cuando empezás un PARO nuevo. Copialo para la historia clínica.</p>
<div id="pl-out"></div></div>`,
init(b){const out=b.querySelector("#pl-out");let armed=false,tm=0;
const he=x=>String(x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
function render(){const P=window.ARUCIP_PLOG,r=P&&P.load();
 if(!r){out.innerHTML=`<p class="why">Todavía no hay un registro guardado.</p>`;return}
 const m=P.sum(r),last=r.log[r.log.length-1][0];
 let h=`<div class="card"><div class="calc"><h3 class="th">Eventos</h3>`+(r.t0?dkK("Inicio",P.dmy(r.t0)+" "+P.hms(r.t0)):"")+dkK("Duración",P.mmss(last))
 +r.log.map(x=>dkK(P.mmss(x[0])+(x[2]?" · "+P.hms(x[2]):""),he(String(x[1]).replace(/<[^>]+>/g,"")))).join("")
 +dkK("Resumen","adrenalina "+m.epi+" · descargas "+m.sh+" · amiodarona "+m.am+" · lidocaína "+m.li+" · ROSC: "+(m.rosc?"sí":"no"))+`</div></div>`
 +`<div class="row"><button class="btn w" id="pl-cp" type="button">Copiar registro</button></div><div class="row"><button class="btn g w" id="pl-del" type="button">Borrar registro</button></div>`
 +`<div class="box">Registro automático de apoyo: no reemplaza el registro oficial de la historia clínica. La hora sale del reloj de este dispositivo.</div>`;
 out.innerHTML=h}
out.onclick=async e=>{const t=e.target.closest("button");if(!t)return;const P=window.ARUCIP_PLOG;
 if(t.id==="pl-cp"){const r=P.load();if(!r)return;try{await navigator.clipboard.writeText(P.text(r));t.textContent="Copiado"}catch(x){t.textContent="No se pudo copiar"}setTimeout(()=>{t.textContent="Copiar registro"},2000)}
 else if(t.id==="pl-del"){if(armed){P.clear();armed=false;clearTimeout(tm);render()}else{armed=true;t.textContent="Tocá de nuevo para confirmar";clearTimeout(tm);tm=setTimeout(()=>{armed=false;t.textContent="Borrar registro"},3000)}}};
render();return()=>{out.onclick=null;clearTimeout(tm)}}}};;
T.rcp={t:"Ritmo para una buena RCP",c:{html:`<p class="sub">En la reanimación avanzada los ritmos de masaje y de bolseo suelen ser inapropiados, en general demasiado rápidos. Esta es una ayuda sonora para sostener un ritmo adecuado: el líder elige el ritmo. Cerca de los 2 minutos avisa para evaluar otra dosis de adrenalina, revisar posibles causas de refractariedad a la RCP y rotar a los reanimadores.</p>
<div class="card"><div class="calc"><fieldset class="fs inl"><legend>Ritmo</legend>
<label class="op"><input type="radio" name="rc" value="100"><span>100 / min</span></label>
<label class="op"><input type="radio" name="rc" value="110" checked><span>110 / min</span></label>
<label class="op"><input type="radio" name="rc" value="120"><span>120 / min</span></label>
<label class="op"><input type="radio" name="rc" value="20"><span>Bolseo 20 / min</span></label></fieldset>
<div class="r"><span>Tiempo del ciclo</span><b id="rc-t">0:00</b></div>
<div class="alr" id="rc-a" hidden>Pasaron 2 minutos: evaluar otra dosis de adrenalina, revisar causas de refractariedad y rotar a los reanimadores.</div>
<button class="btn pri" id="rc-b">Iniciar</button></div></div>`,
init(b){let ac=null,iv=0,tk=0,t0=0,sw=0,run=false,wl=null,fl=false;const B=b.querySelector("#rc-b"),Tm=b.querySelector("#rc-t"),A=b.querySelector("#rc-a");
const beep=(f,d,g)=>{if(!ac)return;const o=ac.createOscillator(),gn=ac.createGain();o.frequency.value=f;gn.gain.value=g;o.connect(gn);gn.connect(ac.destination);o.start();o.stop(ac.currentTime+d)};
const bpm=()=>+b.querySelector("input[name=rc]:checked").value;
const stop=()=>{window.ARUCIP_SND&&ARUCIP_SND.off("rc");clearInterval(iv);clearInterval(tk);iv=tk=0;run=false;B.textContent="Iniciar";try{wl&&wl.release()}catch(e){}wl=null};
const startBeat=()=>{clearInterval(iv);iv=setInterval(()=>{beep(bpm()==20?520:880,.06,.5)},60000/bpm())};
B.onclick=()=>{if(run){stop();return}
window.ARUCIP_SND&&ARUCIP_SND.on("rc",function(){try{ac&&ac.resume()}catch(e){}});
try{ac=ac||new (window.AudioContext||window.webkitAudioContext)()}catch(e){}
try{ac&&ac.resume()}catch(e){}
try{navigator.wakeLock&&navigator.wakeLock.request("screen").then(w=>wl=w).catch(()=>{})}catch(e){}
run=true;fl=false;A.hidden=true;t0=Date.now();B.textContent="Detener";startBeat();
tk=setInterval(()=>{const s=Math.floor((Date.now()-t0)/1000);Tm.textContent=Math.floor(s/60)+":"+String(s%60).padStart(2,"0");
if(s>=120&&!fl){fl=true;A.hidden=false;beep(1200,.25,.7);setTimeout(()=>beep(1200,.25,.7),350);setTimeout(()=>beep(1200,.25,.7),700);try{navigator.vibrate&&navigator.vibrate([200,100,200,100,200])}catch(e){}}
if(s>=125){t0=Date.now();fl=false;A.hidden=true}},250)};
b.querySelectorAll("input[name=rc]").forEach(i=>i.onchange=()=>{if(run)startBeat()});
return stop}}};;
(function(){
/* Modo PARO: metrónomo de compresiones a 120/min, temporizadores y alertas según la secuencia de RCP pediátrica (PALS) cargada por el usuario. Ayuda de apoyo: no reemplaza al líder del equipo ni el criterio clínico. */
const Q=s=>document.querySelector(s);
const sf=v=>isFinite(v)?parseFloat(v.toPrecision(3)).toString().replace(".",","):"–";
const mmss=s=>{s=Math.max(0,Math.floor(s));return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")};
const HT=[["Hipoxia", "Cianosis, SpO₂ baja, vía aérea o ventilación inadecuada.", "Oxígeno 100%, vía aérea permeable, ventilación efectiva; confirmar el tubo (capnografía y eco: deslizamiento pleural bilateral)."], ["Hipovolemia", "Pérdidas, sangrado, deshidratación, sepsis; VCI pequeña que colapsa.", "Bolo de 20 mL/kg de cristaloide (o sangre si hay hemorragia) y repetir según respuesta. Eco: cavidades vacías y VCI colapsada."], ["Hidrogenión (acidosis)", "Gasometría con pH bajo, acidosis láctica o por paro prolongado.", "Optimizar ventilación y perfusión. Bicarbonato 1 mEq/kg solo con acidosis grave documentada, hiperpotasemia o intoxicación por bloqueantes de canales de sodio (no de rutina)."], ["Hipo/hiperpotasemia", "Insuficiencia renal, rabdomiólisis, quemados, insulina; ECG con ondas T picudas o QRS ancho.", "Hiperpotasemia: calcio (cloruro 10–20 mg/kg o gluconato 60–100 mg/kg IV lento), bicarbonato, insulina con glucosa, salbutamol. Hipopotasemia: reposición cuidadosa. Verificar con gasometría."], ["Hipoglucemia", "Lactantes pequeños, ayuno, sepsis, insuficiencia hepática, insulina o hipoglucemiantes, enfermedad metabólica.", "Medir glucemia capilar sin frenar las compresiones. Si está baja: glucosa 0,5–1 g/kg IV/IO (dextrosa 10% 5–10 mL/kg) y volver a controlar."], ["Hipotermia", "Ahogamiento, exposición, temperatura central baja.", "Recalentamiento activo. Continuar la RCP hasta recalentar según protocolo."], ["Neumotórax a tensión", "Trauma, ventilación mecánica; ruidos disminuidos y desvío traqueal.", "Descompresión con aguja o toracostomía. Eco: ausencia de deslizamiento pleural, ausencia de líneas B, punto pulmón."], ["Taponamiento cardíaco", "Postoperatorio cardíaco, trauma, catéteres; tríada de Beck, QRS de bajo voltaje.", "Pericardiocentesis o toracotomía de urgencia. Eco subxifoideo: derrame con colapso de aurícula y ventrículo derechos."], ["Tóxicos", "Ingesta o sobredosis conocida; antecedentes de medicación.", "Antídoto específico y consulta a toxicología. Considerar bicarbonato en bloqueantes de canales de sodio, emulsión lipídica en anestésicos locales, naloxona en opioides."], ["Trombosis pulmonar", "Cirugía, inmovilización, catéteres venosos centrales, trombofilia.", "Considerar fibrinólisis; trombectomía quirúrgica o ECMO según centro. Eco: VD dilatado (relación VD/VI >1), septo desviado a la izquierda."], ["Trombosis coronaria", "Cardiopatía congénita operada, Kawasaki, miocardiopatía.", "Revascularización/ECMO según centro. Eco: acinesia segmentaria."]];
const CYC=120,PRE=105,EPI3=180,EPI5=300,PAUSE_MAX=10;
const ov=document.createElement("div");ov.id="paro-ov";ov.hidden=true;ov.setAttribute("role","dialog");ov.setAttribute("aria-modal","true");ov.setAttribute("aria-label","Modo RCP");
ov.innerHTML=`<div class="pv">
<div class="pv-top"><div><small>PARO · tiempo de RCP</small><b id="pv-t" class="pm">00:00</b></div><div class="pv-tb"><button type="button" id="pv-x">Terminar</button></div></div>
<div class="pv-tabs" role="tablist"><button type="button" role="tab" id="pv-tab1" aria-selected="true">Paro</button><button type="button" role="tab" id="pv-tab2" aria-selected="false">Más información</button></div>
<div class="pv-alert" id="pv-al" aria-live="assertive"></div>
<button type="button" class="pv-big b-sh" id="pv-re" hidden style="margin-top:10px">Volvió a perder el pulso: reanudar RCP</button>
<div class="pv-met"><div class="pv-hr" id="pv-hr"><b class="pm" id="pv-rate">120</b><small>compresiones por minuto</small></div><div class="pv-cnt"><small>Fase</small><b class="pm" id="pv-c">–</b><small id="pv-cs"></small></div></div>
<div class="pv-dots" id="pv-dots" aria-hidden="true"></div>
<div class="pv-box" id="pv-cgb"><div class="pv-sec" id="pv-cgt">Ciclo 1</div><ul class="pv-ul pv-cg" id="pv-cg"></ul><button type="button" class="pv-cp" id="pv-sum" style="margin:0">Resumen en voz alta para el equipo</button></div>
<div class="pv-box"><div class="pv-sec">Hitos</div><div class="pv-chips" id="pv-hit"><button type="button" data-h="Parches colocados">Parches colocados</button><button type="button" data-h="Acceso IV/IO obtenido">Acceso IV/IO</button><button type="button" data-h="Oxígeno al 100%">O₂ 100%</button><button type="button" data-h="Vía aérea avanzada colocada" id="pv-adv">Vía aérea avanzada</button><button type="button" data-h="Un solo reanimador: 30:2" id="pv-r30">Solo 1 reanimador (30:2)</button></div><p class="pv-p pv-hn">Sin vía aérea avanzada: 15:2 con dos o más reanimadores, 30:2 si estás solo. Con vía aérea avanzada: compresiones continuas y una ventilación cada 2–3 s.</p></div>

<div class="pv-rate"><button type="button" id="pv-rm" aria-label="Bajar frecuencia">− 10</button><span>Frecuencia 100–120/min</span><button type="button" id="pv-rp" aria-label="Subir frecuencia">+ 10</button></div>
<div class="pv-box"><div class="pv-row"><span>Próximo análisis de ritmo y cambio de reanimador</span><b class="pm" id="pv-cy">02:00</b></div><div class="pv-bar"><i id="pv-cb"></i></div></div>
<div class="pv-box" id="pv-an" hidden><div class="pv-sh" id="pv-ansh"></div><div class="pv-btns" id="pv-rb"><button type="button" data-rh="ns" class="b-ns">No desfibrilable<small>Asistolia / AESP</small></button><button type="button" data-rh="sh" class="b-sh">Desfibrilable<small>FV / TVsp</small></button><button type="button" data-rh="rosc" class="b-ro">Pulso presente<small>Retorno de circulación (ROSC)</small></button></div><button type="button" class="pv-big b-sh" id="pv-shk" hidden>Descarga administrada: reanudar RCP</button><p class="pv-p">¿No sabés qué ritmo es? <button type="button" class="pv-cp" id="pv-rth" style="margin:6px 0 0">Ver cómo se ve cada ritmo</button><br>Ritmo organizado en el monitor: tomar el pulso (≤10 s). Con pulso = «Pulso presente»; sin pulso = AESP («No desfibrilable»).</p></div>
<div class="pv-box"><div class="pv-row"><span>Adrenalina</span><b class="pm" id="pv-ep">sin dosis</b></div><p class="pv-p" id="pv-epd"></p><button type="button" class="pv-big b-ep" id="pv-epb">Adrenalina administrada</button></div>
<div class="pv-box"><div class="pv-row"><span>Antiarrítmico (FV/TVsp)</span><b class="pm" id="pv-aa">0</b></div><p class="pv-p" id="pv-aad"></p><button type="button" class="pv-big" id="pv-aab">Amiodarona administrada</button><button type="button" class="pv-big" id="pv-aal">Lidocaína administrada</button></div>
<div class="pv-box"><label class="pv-w"><span>Peso (kg) para ver las dosis</span><input id="pv-w" type="number" inputmode="decimal" step="any" placeholder="0"></label><details class="pv-wa"><summary>¿No sabés el peso? Estimarlo por la edad</summary><div class="pv-wag"><label class="pv-w"><span>Años</span><input id="pv-ea" type="number" inputmode="numeric" min="0" max="18" step="1" placeholder="0"></label><label class="pv-w"><span>Meses</span><input id="pv-em" type="number" inputmode="numeric" min="0" max="11" step="1" placeholder="0"></label></div><p class="pv-p" id="pv-eo">Ingresá la edad. Si tenés cinta de Broselow (por talla) o el peso real, usalos antes que esta estimación.</p><button type="button" class="pv-cp" id="pv-eu" hidden style="margin:4px 0 0">Usar este peso</button></details><p class="pv-p" id="pv-dos"></p><button class="btn g bsm" id="pv-cpd" type="button" style="margin-top:8px">Copiar dosis</button></div>


<details class="pv-det" id="pv-rt"><summary>Ritmos: cómo se ven y qué hacer (AHA/AAP 2025)</summary><div class="pv-rts"><p class="pv-p"><b>Primero el pulso.</b> Sin pulso: ritmos de paro (FV, TVsp, asistolia, AESP). Con pulso: taquicardia o bradicardia. Los trazados son esquemáticos, solo para reconocer el patrón.</p><div class="rc rk"><b class="rt">Regla rápida</b><ul class="pv-ul"><li><span class="tg tg-d">DESFIBRILAR</span> (descarga NO sincronizada): <b>FV</b> y <b>TV sin pulso</b>.</li><li><span class="tg tg-n">NO DESCARGAR</span>: <b>asistolia</b> y <b>AESP</b> (ritmo organizado sin pulso). RCP, adrenalina y buscar H y T.</li><li><span class="tg tg-c">CARDIOVERTIR</span> (descarga SINCRONIZADA): <b>TSV</b> o <b>TV con pulso</b> y compromiso cardiopulmonar (alteración aguda del estado mental, signos de shock o hipotensión).</li></ul></div><div class="rc"><span class="tg tg-d">DESFIBRILAR</span><b class="rt">Fibrilación ventricular (FV)</b><svg class="ecg-s" viewBox="0 0 300 60" preserveAspectRatio="none" role="img" aria-label="Trazado esquemático"><path d="M0 36.0 L2 39.6 L4 37.5 L6 37.9 L8 41.5 L10 39.6 L12 28.1 L14 16.8 L16 17.2 L18 26.4 L20 31.6 L22 29.2 L24 28.4 L26 34.9 L28 39.5 L30 31.6 L32 17.2 L34 12.3 L36 21.5 L38 31.9 L40 33.8 L42 33.9 L44 42.3 L46 53.2 L48 50.9 L50 33.7 L52 18.0 L54 16.2 L56 21.4 L58 20.7 L60 16.4 L62 21.5 L64 36.7 L66 46.0 L68 38.8 L70 25.2 L72 21.2 L74 26.6 L76 28.6 L78 23.9 L80 24.1 L82 36.6 L84 50.2 L86 49.9 L88 37.6 L90 27.6 L92 26.4 L94 25.3 L96 17.7 L98 11.3 L100 16.9 L102 31.0 L104 39.5 L106 37.0 L108 32.1 L110 32.8 L112 35.0 L114 31.1 L116 23.5 L118 22.2 L120 29.7 L122 37.5 L124 37.8 L126 33.7 L128 32.2 L130 33.2 L132 31.0 L134 24.3 L136 19.6 L138 21.8 L140 27.9 L142 31.3 L144 31.1 L146 31.6 L148 34.2 L150 35.5 L152 32.6 L154 28.1 L156 26.7 L158 28.9 L160 30.8 L162 30.5 L164 29.9 L166 31.2 L168 33.0 L170 32.1 L172 28.6 L174 25.9 L176 26.3 L178 28.1 L180 28.6 L182 28.5 L184 30.1 L186 33.8 L188 35.8 L190 33.9 L192 30.2 L194 28.7 L196 29.5 L198 29.2 L200 27.0 L202 26.4 L204 30.1 L206 34.6 L208 34.5 L210 29.7 L212 26.2 L214 26.7 L216 27.4 L218 24.6 L220 22.2 L222 26.7 L224 36.5 L226 42.4 L228 39.9 L230 34.9 L232 34.0 L234 34.2 L236 28.4 L238 18.7 L240 15.9 L242 24.4 L244 34.2 L246 35.2 L248 30.4 L250 29.9 L252 34.0 L254 32.3 L256 21.5 L258 13.7 L260 20.1 L262 34.8 L264 42.7 L266 40.7 L268 39.7 L270 45.1 L272 46.0 L274 32.9 L276 14.5 L278 8.3 L280 16.8 L282 25.6 L284 25.5 L286 25.0 L288 33.9 L290 44.8 L292 42.5 L294 27.4 L296 16.8 L298 21.1 L300 30.7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg><p class="pv-p">Actividad eléctrica caótica, sin complejos QRS identificables. Sin pulso.</p><p class="pv-p"><b>Qué hacer:</b> Descarga no sincronizada 2 J/kg; RCP 2 min; 4 J/kg; RCP 2 min; luego ≥4 J/kg hasta 10 J/kg (tope: dosis de adulto). Adrenalina y amiodarona o lidocaína según el ciclo (ver «Ciclo» arriba).</p></div><div class="rc"><span class="tg tg-d">DESFIBRILAR</span><b class="rt">Taquicardia ventricular sin pulso (TVsp)</b><svg class="ecg-s" viewBox="0 0 300 60" preserveAspectRatio="none" role="img" aria-label="Trazado esquemático"><path d="M0 30.0 L2 20.9 L4 13.1 L6 7.5 L8 4.6 L10 4.5 L12 6.7 L14 10.5 L16 15.1 L18 19.7 L20 24.1 L22 28.1 L24 31.9 L26 35.9 L28 40.3 L30 44.9 L32 49.5 L34 53.3 L36 55.5 L38 55.4 L40 52.5 L42 46.9 L44 39.1 L46 30.0 L48 20.9 L50 13.1 L52 7.5 L54 4.6 L56 4.5 L58 6.7 L60 10.5 L62 15.1 L64 19.7 L66 24.1 L68 28.1 L70 31.9 L72 35.9 L74 40.3 L76 44.9 L78 49.5 L80 53.3 L82 55.5 L84 55.4 L86 52.5 L88 46.9 L90 39.1 L92 30.0 L94 20.9 L96 13.1 L98 7.5 L100 4.6 L102 4.5 L104 6.7 L106 10.5 L108 15.1 L110 19.7 L112 24.1 L114 28.1 L116 31.9 L118 35.9 L120 40.3 L122 44.9 L124 49.5 L126 53.3 L128 55.5 L130 55.4 L132 52.5 L134 46.9 L136 39.1 L138 30.0 L140 20.9 L142 13.1 L144 7.5 L146 4.6 L148 4.5 L150 6.7 L152 10.5 L154 15.1 L156 19.7 L158 24.1 L160 28.1 L162 31.9 L164 35.9 L166 40.3 L168 44.9 L170 49.5 L172 53.3 L174 55.5 L176 55.4 L178 52.5 L180 46.9 L182 39.1 L184 30.0 L186 20.9 L188 13.1 L190 7.5 L192 4.6 L194 4.5 L196 6.7 L198 10.5 L200 15.1 L202 19.7 L204 24.1 L206 28.1 L208 31.9 L210 35.9 L212 40.3 L214 44.9 L216 49.5 L218 53.3 L220 55.5 L222 55.4 L224 52.5 L226 46.9 L228 39.1 L230 30.0 L232 20.9 L234 13.1 L236 7.5 L238 4.6 L240 4.5 L242 6.7 L244 10.5 L246 15.1 L248 19.7 L250 24.1 L252 28.1 L254 31.9 L256 35.9 L258 40.3 L260 44.9 L262 49.5 L264 53.3 L266 55.5 L268 55.4 L270 52.5 L272 46.9 L274 39.1 L276 30.0 L278 20.9 L280 13.1 L282 7.5 L284 4.6 L286 4.5 L288 6.7 L290 10.5 L292 15.1 L294 19.7 L296 24.1 L298 28.1 L300 31.9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg><p class="pv-p">Complejos anchos, regulares y rápidos, sin pulso central. Se trata igual que la FV.</p><p class="pv-p"><b>Qué hacer:</b> Descarga no sincronizada, misma secuencia que la FV. Si hay pulso, NO es esto: ver TV con pulso.</p></div><div class="rc"><span class="tg tg-d">DESFIBRILAR</span><b class="rt">TV polimorfa / torsades de pointes sin pulso</b><svg class="ecg-s" viewBox="0 0 300 60" preserveAspectRatio="none" role="img" aria-label="Trazado esquemático"><path d="M0 30.0 L2 25.9 L4 22.7 L6 22.9 L8 27.5 L10 34.8 L12 41.1 L14 42.5 L16 37.1 L18 27.0 L20 17.0 L22 12.7 L24 17.1 L26 28.8 L28 42.2 L30 50.5 L32 48.7 L34 37.2 L36 21.2 L38 8.8 L40 6.7 L42 16.4 L44 33.3 L46 49.0 L48 55.6 L50 49.4 L52 33.3 L54 15.5 L56 4.9 L58 6.8 L60 20.2 L62 38.3 L64 51.9 L66 54.5 L68 44.9 L70 28.4 L72 13.3 L74 7.1 L76 12.3 L78 25.8 L80 40.5 L82 49.0 L84 47.7 L86 38.1 L88 25.5 L90 16.4 L92 14.8 L94 20.6 L96 30.0 L98 38.0 L100 40.8 L102 38.1 L104 32.2 L106 26.7 L108 24.3 L110 25.3 L112 26.9 L114 31.5 L116 36.8 L118 39.7 L120 37.7 L122 30.8 L124 21.9 L126 16.0 L128 16.8 L130 24.8 L132 36.7 L134 46.4 L136 48.5 L138 41.1 L140 27.2 L142 13.7 L144 7.7 L146 12.8 L148 27.0 L150 43.5 L152 53.8 L154 52.4 L156 39.6 L158 21.7 L160 7.6 L162 4.6 L164 14.3 L166 31.8 L168 48.4 L170 55.7 L172 50.2 L174 34.8 L176 17.4 L178 6.7 L180 7.8 L182 19.7 L184 36.1 L186 48.6 L188 51.4 L190 43.7 L192 29.9 L194 17.3 L196 11.9 L198 15.6 L200 25.8 L202 36.9 L204 43.2 L206 42.5 L208 36.0 L210 27.8 L212 22.2 L214 21.4 L216 24.8 L218 29.6 L220 33.1 L222 36.1 L224 36.4 L226 32.7 L228 26.2 L230 20.2 L232 18.4 L234 22.7 L236 31.9 L238 41.6 L240 46.4 L242 43.0 L244 32.3 L246 19.2 L248 10.6 L250 11.3 L252 21.9 L254 37.3 L256 50.0 L258 53.1 L260 44.5 L262 28.2 L264 12.2 L266 4.7 L268 9.8 L270 25.1 L272 43.1 L274 54.7 L276 53.9 L278 41.3 L280 23.1 L282 8.6 L284 4.9 L286 13.7 L288 30.2 L290 46.0 L292 53.4 L294 49.0 L296 35.6 L298 20.3 L300 10.7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg><p class="pv-p">QRS anchos que cambian de amplitud y «giran» sobre la línea de base. Sin pulso.</p><p class="pv-p"><b>Qué hacer:</b> Descarga no sincronizada como FV. Además, torsades: magnesio 25–50 mg/kg (máx 2 g) y corregir potasio y QT.</p></div><div class="rc"><span class="tg tg-n">NO DESCARGAR</span><b class="rt">Asistolia</b><svg class="ecg-s" viewBox="0 0 300 60" preserveAspectRatio="none" role="img" aria-label="Trazado esquemático"><path d="M0 30.0 L2 30.2 L4 30.3 L6 30.5 L8 30.6 L10 30.7 L12 30.7 L14 30.7 L16 30.6 L18 30.5 L20 30.4 L22 30.3 L24 30.1 L26 29.9 L28 29.8 L30 29.6 L32 29.5 L34 29.4 L36 29.3 L38 29.3 L40 29.3 L42 29.4 L44 29.5 L46 29.6 L48 29.8 L50 30.0 L52 30.2 L54 30.3 L56 30.5 L58 30.6 L60 30.7 L62 30.7 L64 30.7 L66 30.6 L68 30.6 L70 30.4 L72 30.3 L74 30.1 L76 29.9 L78 29.8 L80 29.6 L82 29.5 L84 29.4 L86 29.3 L88 29.3 L90 29.3 L92 29.4 L94 29.5 L96 29.6 L98 29.8 L100 30.0 L102 30.1 L104 30.3 L106 30.4 L108 30.6 L110 30.6 L112 30.7 L114 30.7 L116 30.7 L118 30.6 L120 30.5 L122 30.3 L124 30.1 L126 30.0 L128 29.8 L130 29.6 L132 29.5 L134 29.4 L136 29.3 L138 29.3 L140 29.3 L142 29.4 L144 29.5 L146 29.6 L148 29.8 L150 29.9 L152 30.1 L154 30.3 L156 30.4 L158 30.5 L160 30.6 L162 30.7 L164 30.7 L166 30.7 L168 30.6 L170 30.5 L172 30.3 L174 30.2 L176 30.0 L178 29.8 L180 29.7 L182 29.5 L184 29.4 L186 29.3 L188 29.3 L190 29.3 L192 29.4 L194 29.5 L196 29.6 L198 29.7 L200 29.9 L202 30.1 L204 30.3 L206 30.4 L208 30.5 L210 30.6 L212 30.7 L214 30.7 L216 30.7 L218 30.6 L220 30.5 L222 30.4 L224 30.2 L226 30.0 L228 29.8 L230 29.7 L232 29.5 L234 29.4 L236 29.3 L238 29.3 L240 29.3 L242 29.4 L244 29.4 L246 29.6 L248 29.7 L250 29.9 L252 30.1 L254 30.2 L256 30.4 L258 30.5 L260 30.6 L262 30.7 L264 30.7 L266 30.7 L268 30.6 L270 30.5 L272 30.4 L274 30.2 L276 30.0 L278 29.9 L280 29.7 L282 29.6 L284 29.4 L286 29.3 L288 29.3 L290 29.3 L292 29.3 L294 29.4 L296 29.5 L298 29.7 L300 29.9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg><p class="pv-p">Línea casi plana, sin actividad eléctrica. Confirmar conexión de cables, ganancia y derivaciones.</p><p class="pv-p"><b>Qué hacer:</b> No se descarga. RCP 2 min; adrenalina lo antes posible (AHA 2025, ritmo no desfibrilable) y luego cada 3–5 min; acceso IV/IO; buscar H y T.</p></div><div class="rc"><span class="tg tg-n">NO DESCARGAR</span><b class="rt">Actividad eléctrica sin pulso (AESP)</b><svg class="ecg-s" viewBox="0 0 300 60" preserveAspectRatio="none" role="img" aria-label="Trazado esquemático"><path d="M0 30.0 L2 30.0 L4 30.0 L6 29.8 L8 29.1 L10 27.6 L12 27.1 L14 28.4 L16 29.6 L18 29.8 L20 21.8 L22 6.5 L24 28.2 L26 34.8 L28 30.6 L30 29.9 L32 29.4 L34 28.3 L36 26.5 L38 24.6 L40 24.0 L42 25.2 L44 27.2 L46 28.8 L48 29.6 L50 29.9 L52 30.0 L54 30.0 L56 30.0 L58 30.0 L60 30.0 L62 30.0 L64 30.0 L66 30.0 L68 30.0 L70 29.8 L72 29.1 L74 27.6 L76 27.1 L78 28.4 L80 29.6 L82 29.8 L84 21.8 L86 6.5 L88 28.2 L90 34.8 L92 30.6 L94 29.9 L96 29.4 L98 28.3 L100 26.5 L102 24.6 L104 24.0 L106 25.2 L108 27.2 L110 28.8 L112 29.6 L114 29.9 L116 30.0 L118 30.0 L120 30.0 L122 30.0 L124 30.0 L126 30.0 L128 30.0 L130 30.0 L132 30.0 L134 29.8 L136 29.1 L138 27.6 L140 27.1 L142 28.4 L144 29.6 L146 29.8 L148 21.8 L150 6.5 L152 28.2 L154 34.8 L156 30.6 L158 29.9 L160 29.4 L162 28.3 L164 26.5 L166 24.6 L168 24.0 L170 25.2 L172 27.2 L174 28.8 L176 29.6 L178 29.9 L180 30.0 L182 30.0 L184 30.0 L186 30.0 L188 30.0 L190 30.0 L192 30.0 L194 30.0 L196 30.0 L198 29.8 L200 29.1 L202 27.6 L204 27.1 L206 28.4 L208 29.6 L210 29.8 L212 21.8 L214 6.5 L216 28.2 L218 34.8 L220 30.6 L222 29.9 L224 29.4 L226 28.3 L228 26.5 L230 24.6 L232 24.0 L234 25.2 L236 27.2 L238 28.8 L240 29.6 L242 29.9 L244 30.0 L246 30.0 L248 30.0 L250 30.0 L252 30.0 L254 30.0 L256 30.0 L258 30.0 L260 30.0 L262 29.8 L264 29.1 L266 27.6 L268 27.1 L270 28.4 L272 29.6 L274 29.8 L276 21.8 L278 6.5 L280 28.2 L282 34.8 L284 30.6 L286 29.9 L288 29.4 L290 28.3 L292 26.5 L294 24.6 L296 24.0 L298 25.2 L300 27.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg><p class="pv-p">Complejos organizados en el monitor, pero sin pulso central. Parece un ritmo «normal».</p><p class="pv-p"><b>Qué hacer:</b> No se descarga. RCP 2 min; adrenalina lo antes posible y cada 3–5 min; buscar y tratar H y T (eco si hay pausa). Si aparece FV/TVsp: descargar.</p></div><div class="rc"><span class="tg tg-c">CARDIOVERTIR</span><b class="rt">Taquicardia supraventricular (TSV) con pulso</b><svg class="ecg-s" viewBox="0 0 300 60" preserveAspectRatio="none" role="img" aria-label="Trazado esquemático"><path d="M0 30.0 L2 29.9 L4 29.1 L6 7.2 L8 30.6 L10 28.0 L12 27.1 L14 27.8 L16 28.8 L18 30.0 L20 29.9 L22 29.1 L24 7.2 L26 30.6 L28 28.0 L30 27.1 L32 27.8 L34 28.8 L36 30.0 L38 29.9 L40 29.1 L42 7.2 L44 30.6 L46 28.0 L48 27.1 L50 27.8 L52 28.8 L54 30.0 L56 29.9 L58 29.1 L60 7.2 L62 30.6 L64 28.0 L66 27.1 L68 27.8 L70 28.8 L72 30.0 L74 29.9 L76 29.1 L78 7.2 L80 30.6 L82 28.0 L84 27.1 L86 27.8 L88 28.8 L90 30.0 L92 29.9 L94 29.1 L96 7.2 L98 30.6 L100 28.0 L102 27.1 L104 27.8 L106 28.8 L108 30.0 L110 29.9 L112 29.1 L114 7.2 L116 30.6 L118 28.0 L120 27.1 L122 27.8 L124 28.8 L126 30.0 L128 29.9 L130 29.1 L132 7.2 L134 30.6 L136 28.0 L138 27.1 L140 27.8 L142 28.8 L144 30.0 L146 29.9 L148 29.1 L150 7.2 L152 30.6 L154 28.0 L156 27.1 L158 27.8 L160 28.8 L162 30.0 L164 29.9 L166 29.1 L168 7.2 L170 30.6 L172 28.0 L174 27.1 L176 27.8 L178 28.8 L180 30.0 L182 29.9 L184 29.1 L186 7.2 L188 30.6 L190 28.0 L192 27.1 L194 27.8 L196 28.8 L198 30.0 L200 29.9 L202 29.1 L204 7.2 L206 30.6 L208 28.0 L210 27.1 L212 27.8 L214 28.8 L216 30.0 L218 29.9 L220 29.1 L222 7.2 L224 30.6 L226 28.0 L228 27.1 L230 27.8 L232 28.8 L234 30.0 L236 29.9 L238 29.1 L240 7.2 L242 30.6 L244 28.0 L246 27.1 L248 27.8 L250 28.8 L252 30.0 L254 29.9 L256 29.1 L258 7.2 L260 30.6 L262 28.0 L264 27.1 L266 27.8 L268 28.8 L270 30.0 L272 29.9 L274 29.1 L276 7.2 L278 30.6 L280 28.0 L282 27.1 L284 27.8 L286 28.8 L288 30.0 L290 29.9 L292 29.1 L294 7.2 L296 30.6 L298 28.0 L300 27.1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg><p class="pv-p">QRS angosto (≤0,09 s), regular, FC típica ≥220/min en lactantes y ≥180/min en niños, P ausentes o anormales, inicio brusco.</p><p class="pv-p"><b>Qué hacer:</b> Con compromiso: adenosina 0,1 mg/kg IV/IO rápido (máx 6 mg), 2.ª dosis 0,2 mg/kg (máx 12 mg) si hay acceso; si no hay acceso o falla: cardioversión sincronizada 0,5–1 J/kg y, si no revierte, 2 J/kg. Sedar sin demorar. Sin compromiso: maniobras vagales y luego adenosina.</p></div><div class="rc"><span class="tg tg-c">CARDIOVERTIR</span><b class="rt">Taquicardia ventricular (TV) con pulso</b><svg class="ecg-s" viewBox="0 0 300 60" preserveAspectRatio="none" role="img" aria-label="Trazado esquemático"><path d="M0 30.0 L2 19.6 L4 11.1 L6 5.8 L8 4.2 L10 6.0 L12 10.1 L14 15.3 L16 20.6 L18 25.5 L20 30.0 L22 34.5 L24 39.4 L26 44.7 L28 49.9 L30 54.0 L32 55.8 L34 54.2 L36 48.9 L38 40.4 L40 30.0 L42 19.6 L44 11.1 L46 5.8 L48 4.2 L50 6.0 L52 10.1 L54 15.3 L56 20.6 L58 25.5 L60 30.0 L62 34.5 L64 39.4 L66 44.7 L68 49.9 L70 54.0 L72 55.8 L74 54.2 L76 48.9 L78 40.4 L80 30.0 L82 19.6 L84 11.1 L86 5.8 L88 4.2 L90 6.0 L92 10.1 L94 15.3 L96 20.6 L98 25.5 L100 30.0 L102 34.5 L104 39.4 L106 44.7 L108 49.9 L110 54.0 L112 55.8 L114 54.2 L116 48.9 L118 40.4 L120 30.0 L122 19.6 L124 11.1 L126 5.8 L128 4.2 L130 6.0 L132 10.1 L134 15.3 L136 20.6 L138 25.5 L140 30.0 L142 34.5 L144 39.4 L146 44.7 L148 49.9 L150 54.0 L152 55.8 L154 54.2 L156 48.9 L158 40.4 L160 30.0 L162 19.6 L164 11.1 L166 5.8 L168 4.2 L170 6.0 L172 10.1 L174 15.3 L176 20.6 L178 25.5 L180 30.0 L182 34.5 L184 39.4 L186 44.7 L188 49.9 L190 54.0 L192 55.8 L194 54.2 L196 48.9 L198 40.4 L200 30.0 L202 19.6 L204 11.1 L206 5.8 L208 4.2 L210 6.0 L212 10.1 L214 15.3 L216 20.6 L218 25.5 L220 30.0 L222 34.5 L224 39.4 L226 44.7 L228 49.9 L230 54.0 L232 55.8 L234 54.2 L236 48.9 L238 40.4 L240 30.0 L242 19.6 L244 11.1 L246 5.8 L248 4.2 L250 6.0 L252 10.1 L254 15.3 L256 20.6 L258 25.5 L260 30.0 L262 34.5 L264 39.4 L266 44.7 L268 49.9 L270 54.0 L272 55.8 L274 54.2 L276 48.9 L278 40.4 L280 30.0 L282 19.6 L284 11.1 L286 5.8 L288 4.2 L290 6.0 L292 10.1 L294 15.3 L296 20.6 L298 25.5 L300 30.0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg><p class="pv-p">QRS ancho (&gt;0,09 s), regular, rápido, con pulso central presente.</p><p class="pv-p"><b>Qué hacer:</b> Con compromiso: cardioversión sincronizada 0,5–1 J/kg y, si no revierte, 2 J/kg; consultar a un experto antes de dar más fármacos. Sin compromiso: si es regular y monomorfa se puede considerar adenosina; consultar a un experto. Si pierde el pulso: pasar a descarga NO sincronizada (TVsp).</p></div></div></details><details class="pv-det" id="pv-ht"><summary>Causas reversibles (H y T) <span id="pv-htc" class="pv-htc"></span></summary><p class="pv-p" style="margin:10px 0 0">Tildá cada causa a medida que la descartás o la tratás. Las marcas se mantienen entre ciclos de 2 min.</p><div id="pv-htl"></div><button type="button" class="pv-cp" id="pv-htr">Volver a evaluar todas</button></details>






<details class="pv-det" id="pv-br"><summary>Bradicardia con pulso (FC baja que no es paro)</summary><ul class="pv-ul">
<li>Primero: vía aérea, <b>oxígeno y ventilación</b> (la causa más común en niños es la hipoxia).</li>
<li><b>FC &lt;60/min con mala perfusión pese a oxígeno y ventilación: comenzar compresiones</b> (usar el modo RCP).</li>
<li>Si persiste: <b>adrenalina 0,01 mg/kg</b> IV/IO (0,1 mL/kg de 1:10.000, máx 1 mg) cada 3–5 min.</li>
<li><b>Atropina 0,02 mg/kg</b> IV/IO si sospechás tono vagal aumentado o bloqueo AV primario (AHA 2025: sin dosis mínima; máx 0,5 mg por dosis); puede repetirse una vez.</li>
<li>Considerar marcapasos transcutáneo/transvenoso en bloqueo AV completo o disfunción sinusal. Buscar y tratar causas (H y T, hipotermia, tóxicos, hipertensión endocraneana).</li>
<li>Con buena perfusión: oxígeno, monitoreo, ECG de 12 derivaciones y consulta a un experto.</li></ul></details>
<details class="pv-det"><summary>Ecografía durante el paro</summary><ul class="pv-ul"><li>Hacerla solo durante el análisis de ritmo o el cambio de compresor, con la sonda lista, sin pasar los 10 s de pausa. Grabar un clip y analizar con las compresiones en marcha.</li><li>Ventana subxifoidea 4 cámaras (o paraesternal eje largo): actividad cardíaca organizada (pseudo-AESP: seguir RCP y fármacos, buscar causa), fibrilación o asistolia, derrame pericárdico y taponamiento, dilatación del VD (TEP), cavidades vacías (hipovolemia).</li><li>Tórax: deslizamiento pleural bilateral (neumotórax a tensión, intubación bronquial). Cuello: una sola columna de gas = tubo en tráquea.</li><li>Vía aérea: la capnografía sigue siendo la confirmación principal.</li></ul></details>
<details class="pv-det" id="pv-post"><summary>Cuidados posparo (tras ROSC)</summary><ul class="pv-ul"><li>ABC: SpO₂ 94–99% (evitar hiperoxia y hipoxemia). PaCO₂ en rango normal para el paciente. Vía aérea definitiva y capnografía.</li><li>Evitar hipotensión: mantener PAS y PAM por encima del percentil 10 para la edad (AHA 2025, clase 1). Monitoreo arterial invasivo si es posible. Líquidos e inotrópico/vasopresor según la causa; acceso IV/IO asegurado.</li><li>ECG de 12 derivaciones, radiografía de tórax, gasometría con lactato, glucemia (evitar hipo e hiperglucemia), electrolitos, calcio ionizado.</li><li>Ecocardiograma: función ventricular, derrame, VD. Buscar y tratar causas reversibles (H y T).</li><li>Temperatura: medición central continua. Evitar y tratar la fiebre (&gt;37,5 °C). En el niño comatoso, manejo dirigido de temperatura por 5 días: 32–34 °C seguido de 36–37,5 °C, o 36–37,5 °C desde el inicio, según protocolo del centro.</li><li>Neuro: EEG continuo si está disponible y tratar las convulsiones. No pronosticar con un solo dato (ni pupilas ni Glasgow en las primeras 24 h, ni el pH): pronóstico multimodal, en general pasadas las 72 h.</li><li>Ventilación: PaCO₂ adecuada para el paciente (normocapnia, 35–45 mmHg, salvo cardiopatía o enfermedad pulmonar crónica); evitar hipo e hipercapnia.</li><li>Trasladar a UCIP. Si el paro continúa sin respuesta, considerar ECPR/ECMO según centro.</li></ul></details>


<details class="pv-det" id="pv-db"><summary>Después del evento: debriefing del equipo</summary><ul class="pv-ul">
<li>La AHA recomienda un <b>debriefing breve del equipo</b> después de cada paro: mejora el desempeño en los siguientes. Hacerlo cuando el paciente esté estable (5–10 min).</li>
<li><b>¿Qué pasó?</b> Repasar el registro de eventos: tiempos, ritmos, descargas y dosis.</li>
<li><b>¿Qué salió bien y qué mejorar?</b> Calidad de las compresiones, pausas, tiempo hasta la primera adrenalina o la primera descarga, roles y comunicación.</li>
<li><b>Cuidar al equipo:</b> preguntar cómo está cada uno y ofrecer apoyo.</li>
<li>Hablar con la familia con claridad y registrar en la historia clínica (podés usar «Copiar registro»).</li>
</ul></details>
<details class="pv-det" id="pv-inf"><summary>Informe del paro (para la historia clínica)</summary><p class="pv-p" style="margin:10px 0 0">Se arma solo con lo que registraste en la app. Revisalo y corregilo antes de pasarlo a la historia clínica.</p><div class="pv-inf" id="pv-infb"></div><button type="button" class="pv-cp" id="pv-infc">Copiar informe</button></details>
<details class="pv-det" open><summary>Registro de eventos</summary><ol class="pv-log" id="pv-log"></ol><button type="button" class="pv-cp" id="pv-cp">Copiar registro</button></details>
<div id="pv-info" role="tabpanel" aria-labelledby="pv-tab2"><p class="pv-lect">Se recomienda lectura previa a un evento.</p>
<details class="pv-det" id="pv-vz"><summary>Voz de las alertas</summary><div class="pv-set"><label><span>Voz</span><select id="pv-vsel"><option value="">Automática (la mejor disponible)</option></select></label><button type="button" id="pv-vtest">Probar voz</button><p class="pv-p" id="pv-vno" hidden>No se encontraron voces en español en este dispositivo.</p><p class="pv-p">La app solo puede usar las voces instaladas en el teléfono; no puede traer una voz propia sin conexión. Para una voz más natural, descargá una voz de mejor calidad y después elegila acá. iPhone: Ajustes › Accesibilidad › Contenido leído › Voces › Español › elegí una voz y descargá la versión «Mejorada» o «Premium». Android: Ajustes › Sistema › Idiomas › Salida de texto a voz › Motor preferido: Servicios de voz de Google › ⚙ › Instalar datos de voz › Español.</p></div></details>
<details class="pv-det" id="pv-gu"><summary>Guía para empezar (si no sabés PALS)</summary><ol class="pv-ul">
<li><b>¿Está en paro?</b> No responde, no respira o solo boquea, y no tenés pulso claro en 10 s. Ante la duda, comprimí.</li>
<li><b>Pedí ayuda en voz alta</b> y que traigan el desfibrilador (o DEA). Alguien toma el rol de líder.</li>
<li><b>Comprimí fuerte y rápido</b> siguiendo el metrónomo: 100–120/min, un tercio del tórax, dejando que vuelva a subir. Superficie dura.</li>
<li><b>Ventilá con bolsa y máscara con O₂ 100%</b>: 2 ventilaciones cada 15 compresiones (30 si estás solo). Cada una ≈1 s, que suba el tórax.</li>
<li><b>Colocá los parches</b> sin dejar de comprimir. Acceso IV o, si no sale rápido, intraóseo.</li>
<li><b>Cada 2 min la app avisa:</b> cambio de quien comprime y análisis de ritmo en menos de 10 s. Elegí el botón del ritmo: <b>desfibrilable</b> (FV/TV sin pulso) = descarga y seguir; <b>no desfibrilable</b> (asistolia/AESP) = seguir comprimiendo.</li>
<li><b>Adrenalina:</b> en ritmo no desfibrilable, lo antes posible; en desfibrilable, después de la 2.ª descarga. Repetir cada 3–5 min. Tocá «Adrenalina administrada» para que la app cuente el tiempo.</li>
<li><b>Buscá la causa</b> (H y T) mientras se comprime. Si vuelve el pulso: «Pulso presente» y cuidados posparo.</li></ol></details>
<details class="pv-det" id="pv-ld"><summary>Cómo liderar el equipo (qué decir en voz alta)</summary><ol class="pv-ul">
<li><b>Ubicate donde veas al paciente y al monitor</b> (idealmente a los pies de la cama). El líder no comprime ni intuba: si tenés que hacerlo, pasá el liderazgo en voz alta a otra persona.</li>
<li><b>Asigná roles por nombre</b>: «Ana, comprimís. Juan, vía aérea: bolsa y máscara con O₂ al 100%. Sofía, acceso IV/IO y drogas. Pedro, parches y desfibrilador. Laura, registro y tiempos». Si son pocos, primero: compresiones, ventilación y desfibrilador.</li>
<li><b>Comunicación en circuito cerrado</b>: pedí con nombre, fármaco, dosis y vía; esperá que te lo repitan y que avisen cuando está hecho («Adrenalina administrada»). Si nadie confirma, no se hizo.</li>
<li><b>Mensajes cortos, voz calma y pensar en voz alta</b>: «Es asistolia: no se descarga. Seguimos compresiones y damos adrenalina».</li>
<li><b>Cada 2 minutos, resumí</b> con el botón «Resumen en voz alta para el equipo» (tiempo, ritmo, descargas, adrenalina, H y T pendientes) y preguntá: «¿Alguien ve algo que se nos esté pasando?».</li>
<li><b>Vigilá la calidad de la RCP</b>: frecuencia, profundidad, recoil, pausas &lt;10 s y CO₂ espirado. Corregí con respeto: «Más profundo, por favor».</li>
<li><b>Conocé tus límites</b>: pedí ayuda temprano (otro médico, UCIP, cirugía, ECMO). Cualquiera puede frenar un posible error: «Esa dosis me parece alta, ¿la revisamos?».</li>
<li><b>Familia</b>: si quiere estar presente, ofrecerlo con un integrante del equipo que la acompañe y le explique.</li>
</ol><p class="pv-p" id="pv-lph"></p></details>
<details class="pv-det" id="pv-ca"><summary>Calcio en el paro (AHA/AAP 2025)</summary><ul class="pv-ul"><li><b>No de rutina.</b> La guía AHA/AAP 2025 no recomienda el calcio de rutina en lactantes y niños en paro (Clase 3: sin beneficio, nivel B-NR). No demorar RCP, desfibrilación ni adrenalina por el calcio.</li><li><b>Considerarlo solo con causa específica:</b> hiperpotasemia, hipocalcemia o sobredosis de bloqueantes de canales de calcio (la guía cargada en la app suma hipermagnesemia).</li><li><b>Dosis:</b> cloruro de calcio 10–20 mg/kg (10%: 0,1–0,2 mL/kg, máx 1 g) o gluconato de calcio 60–100 mg/kg (10%: 0,6–1 mL/kg, máx 3 g), IV/IO lento. Con el peso cargado, las dosis en mL aparecen en el cuadro de dosis.</li><li>Confirmar la causa (gasometría, ionograma, calcio iónico, ECG) mientras se comprime.</li></ul></details>
<details class="pv-det"><summary>Secuencia de paro</summary><div class="pv-rts"><div class="rc rk"><b class="rt">Secuencia del paro (AHA/AAP 2025)</b><ul class="pv-ul"><li>RCP, parches, O₂ y acceso IV/IO. <b>Analizar ritmo cada 2 min</b> (pausa &lt;10 s).</li><li><b>Desfibrilable:</b> descarga 1 (2 J/kg) → <b>RCP inmediata 2 min</b>; descarga 2 (4 J/kg) → RCP 2 min + adrenalina (cada 3–5 min); descarga 3 (≥4, hasta 10 J/kg) → RCP 2 min + amiodarona o lidocaína. Tras cada descarga se reanudan las compresiones <b>sin revisar pulso</b>.</li><li><b>No desfibrilable:</b> RCP 2 min + adrenalina lo antes posible, luego cada 3–5 min. Si el ritmo pasa a desfibrilable, descargar.</li><li><b>Ritmo organizado:</b> revisar pulso; si hay pulso, cuidados posparo.</li><li>Fuente: AHA/AAP 2025, Parte 8 (PALS); taquicardia con pulso: algoritmo PALS de la AHA. Los trazados son ilustrativos: verificá siempre con el monitor y la guía.</li></ul></div></div></details>
<details class="pv-det"><summary>Calidad de la RCP</summary><ul class="pv-ul"><li>Frecuencia 100–120/min. Profundidad: al menos 1/3 del diámetro anteroposterior del tórax (≈4 cm en lactantes, ≈5 cm en niños). Adolescentes con signos de pubertad: como adulto (5–6 cm).</li><li>Permitir la reexpansión completa del tórax y minimizar las interrupciones.</li><li>Con ≥2 reanimadores: relación 15:2. Con vía aérea avanzada: compresiones continuas y 20–30 ventilaciones/min, sin hiperventilar.</li><li>Cambio de reanimador en cada análisis de ritmo (cada ~2 min) para sostener la calidad de las compresiones.</li><li>Con monitorización arterial invasiva durante la RCP: presión diastólica ≥25 mmHg en lactantes y ≥30 mmHg en niños ≥1 año.</li><li>Parches de monitor/desfibrilador sin interrumpir las compresiones. Acceso IV; si no se logra rápido, pasar a vía intraósea.</li><li>Sin vía aérea avanzada: 30:2 si hay un solo reanimador y 15:2 con dos o más. Recién nacido: 3:1 (si la causa es cardíaca, 15:2).</li><li>Capnografía (CO₂ espirado): si cae por debajo de 10–15 mmHg, mejorar la calidad de las compresiones; un aumento brusco sugiere ROSC.</li><li>Cargar el desfibrilador mientras se comprime. Pausa antes y después de la descarga lo más corta posible (idealmente &lt;10 s). Retomar compresiones inmediatamente después de la descarga, sin revisar pulso.</li><li>Posición: siempre sobre superficie dura (en la cama, tabla de RCP). <b>Lactante (AHA 2025):</b> dos pulgares con las manos rodeando el tórax, o talón de una mano, sobre la mitad inferior del esternón, justo debajo de la línea de los pezones. <b>Ya no se recomienda la técnica de dos dedos</b> (no logra la profundidad). Niño: talón de una o dos manos en la mitad inferior del esternón.</li><li>Cada ventilación dura ≈1 s y debe hacer subir el tórax; no más volumen ni más frecuencia (la hiperventilación empeora el retorno venoso).</li></ul></details>
<details class="pv-det"><summary>Reconocer e iniciar</summary><ul class="pv-ul"><li>Paro: sin respuesta, sin respiración o solo boqueadas (gasping), sin pulso central definido en hasta 10 s. <b>Ante la duda, comprimir.</b> Pedir ayuda y el desfibrilador. Comenzar compresiones.</li><li>Dónde tomar el pulso: lactante, braquial (cara interna del brazo); niño, carotídeo o femoral. Personal no sanitario: no tomar pulso, comenzar RCP si no responde y no respira con normalidad.</li><li>Si estás solo: con colapso súbito presenciado, pedir ayuda y el DEA primero; si no fue presenciado (lo más frecuente en niños, causa respiratoria), 2 min de RCP y después pedir ayuda.</li><li>Pulso presente pero FC &lt;60/min con mala perfusión, a pesar de oxígeno y ventilación: iniciar compresiones.</li><li>Recién nacido: ventilar primero; compresiones si FC &lt;60/min tras 30 s de ventilación efectiva.</li><li>Ritmos desfibrilables: fibrilación ventricular y taquicardia ventricular sin pulso. No desfibrilables: asistolia y actividad eléctrica sin pulso.</li></ul></details>
<details class="pv-det"><summary>Roles del equipo</summary><ul class="pv-ul"><li><b>Líder:</b> dirige, define el ritmo, decide descargas y fármacos, revisa H y T.</li><li><b>Compresor:</b> calidad y relevo cada 2 min.</li><li><b>Vía aérea:</b> ventilación con bolsa, intubación, capnografía.</li><li><b>Acceso y fármacos:</b> IV/IO, prepara y administra.</li><li><b>Monitor/desfibrilador:</b> parches, carga, descarga (avisar “todos afuera”).</li><li><b>Registrador:</b> tiempos y dosis (este registro).</li></ul></details>
<details class="pv-det"><summary>Otros fármacos y accesos</summary><ul class="pv-ul"><li><b>Acceso intraóseo:</b> tibia proximal (cara medial, 1–3 cm debajo de la tuberosidad), fémur distal o húmero proximal. Usar si el IV no se logra rápido.</li><li><b>Atropina:</b> no es de uso en el paro. Es para bradicardia con pulso por tono vagal o bloqueo AV primario: 0,02 mg/kg IV/IO (AHA 2025: sin dosis mínima; máx 0,5 mg por dosis), puede repetirse una vez.</li><li><b>Adrenalina por tubo endotraqueal</b> (solo si no hay IV/IO): 0,1 mg/kg = 0,1 mL/kg de la ampolla 1 mg/mL, seguida de 5 mL de SF y 5 ventilaciones. La vía IV/IO es la preferida.</li><li><b>Después de cada fármaco IV/IO:</b> lavar con 5–10 mL de SF (2–5 mL en lactantes) y elevar el miembro.</li><li><b>Calcio:</b> no de rutina (ver el panel «Calcio en el paro»). Indicado en hiperpotasemia, hipocalcemia, hipermagnesemia o intoxicación por bloqueantes cálcicos: cloruro 10–20 mg/kg o gluconato 60–100 mg/kg IV lento.</li><li><b>Bicarbonato:</b> no de rutina. 1 mEq/kg en hiperpotasemia, acidosis grave o bloqueantes de canales de sodio.</li><li><b>Glucosa:</b> si hay hipoglucemia: 0,5–1 g/kg (dextrosa 10% 5–10 mL/kg).</li><li><b>Magnesio:</b> torsades de pointes: 25–50 mg/kg (máx 2 g).</li><li><b>Antiarrítmico en FV/TVsp refractaria:</b> amiodarona 5 mg/kg en bolo (puede repetirse hasta 3 dosis; máx 300 mg por dosis) o lidocaína 1 mg/kg (adulto: 1–1,5 mg/kg).</li></ul></details>
<details class="pv-det"><summary>Transición a dosis de adulto</summary><table class="pv-tb2"><tr><th>Parámetro</th><th>Pediátrico</th><th>Adulto</th></tr><tr><td>Adrenalina</td><td>0,01 mg/kg (máx 1 mg)</td><td>1 mg cada 3–5 min</td></tr><tr><td>Descarga FV/TVsp</td><td>2 J/kg, luego 4 J/kg y hasta 10 J/kg (sin pasar la dosis de adulto)</td><td>120–200 J bifásico (máx 200 J)</td></tr><tr><td>Amiodarona</td><td>5 mg/kg</td><td>300 mg, luego 150 mg</td></tr><tr><td>Lidocaína</td><td>1 mg/kg (máx 100 mg)</td><td>1–1,5 mg/kg (≈100 mg)</td></tr><tr><td>Profundidad de compresión</td><td>1/3 del tórax (≈4 cm lactante, ≈5 cm niño)</td><td>5–6 cm</td></tr><tr><td>Ritmo de compresión</td><td colspan="2">100–120/min</td></tr></table><p class="pv-p">No hay un umbral único de peso para pasar a dosis de adulto. Usar la dosis por kg sin pasar el máximo (adrenalina 1 mg, descarga máx 200 J bifásico, amiodarona 300 mg). La guía cargada sugiere ~25 kg como referencia práctica; confirmar con el protocolo local. Parches del tamaño que quepa sin superponerse (pediátricos &lt;8 años o &lt;25 kg si están disponibles; en lactantes preferir desfibrilador manual; si solo hay DEA, usar atenuador de dosis para &lt;8 años o, si no hay, uno estándar).</p></details>
<details class="pv-det" id="pv-gl"><summary>Glosario: qué significa cada sigla</summary><ul class="pv-ul">
<li><b>RCP:</b> reanimación cardiopulmonar (compresiones + ventilaciones). <b>PALS:</b> soporte vital avanzado pediátrico.</li>
<li><b>FV:</b> fibrilación ventricular. <b>TVsp:</b> taquicardia ventricular sin pulso. Las dos se tratan con descarga (desfibrilar).</li>
<li><b>Asistolia:</b> línea plana. <b>AESP:</b> actividad eléctrica sin pulso (el monitor muestra un ritmo, pero no hay pulso). Las dos NO se descargan.</li>
<li><b>ROSC:</b> retorno de la circulación espontánea (vuelve el pulso). <b>Posparo:</b> cuidados después del ROSC.</li>
<li><b>Desfibrilar:</b> descarga NO sincronizada (en el paro). <b>Cardiovertir:</b> descarga SINCRONIZADA (taquicardia con pulso). <b>J/kg:</b> joules por kilo de peso. <b>DEA:</b> desfibrilador externo automático.</li>
<li><b>IV / IO:</b> intravenoso / intraóseo (aguja en el hueso, sirve para todos los fármacos). <b>ET:</b> por tubo endotraqueal.</li>
<li><b>1:10.000:</b> adrenalina diluida a 0,1 mg/mL (1 mL de la ampolla de 1 mg/mL + 9 mL de SF). <b>1:1.000:</b> la ampolla pura, 1 mg/mL.</li>
<li><b>15:2 / 30:2:</b> 15 (o 30) compresiones y 2 ventilaciones. <b>Vía aérea avanzada:</b> tubo endotraqueal o máscara laríngea.</li>
<li><b>CO₂ espirado (EtCO₂, capnografía):</b> CO₂ al final de la espiración; muestra si las compresiones son eficaces. <b>Recoil:</b> dejar que el tórax vuelva a su posición.</li>
<li><b>H y T:</b> causas reversibles del paro. <b>ECPR / ECMO:</b> RCP con circulación extracorpórea, solo en centros con programa.</li></ul></details>
</div>
<p class="pv-nt">Ayuda de apoyo según la secuencia PALS cargada en la app. No reemplaza al líder del equipo ni el criterio clínico: verificá siempre las dosis.</p>
</div>`;
document.body.appendChild(ov);
const E=id=>document.getElementById(id);
const R={on:false};
let ac=null,beatT=null,ventT=null,tick=null,wl=null,exitT=null,voices=[];
R.snd="mad";
E("pv-dots").innerHTML=Array.from({length:15},(_,i)=>`<i></i>`).join("");
/* ---------- audio ---------- */
function env(o,v,t0,dur,g){const n=ac.currentTime+t0;v.gain.setValueAtTime(0.0001,n);v.gain.exponentialRampToValueAtTime(g,n+.003);v.gain.exponentialRampToValueAtTime(.0001,n+dur);o.connect(v);v.connect(ac.destination);o.start(n);o.stop(n+dur+.03)}
function tone(f,dur,g,type,t0,f2){if(R.mute||!ac)return;try{const o=ac.createOscillator(),v=ac.createGain();o.type=type||"sine";o.frequency.setValueAtTime(f,ac.currentTime+(t0||0));if(f2)o.frequency.exponentialRampToValueAtTime(f2,ac.currentTime+(t0||0)+dur*.7);env(o,v,t0||0,dur,g||.3)}catch(e){}}
function noise(dur,g,hp){if(R.mute||!ac)return;try{const len=Math.floor(ac.sampleRate*dur),b=ac.createBuffer(1,len,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);const s=ac.createBufferSource();s.buffer=b;const f=ac.createBiquadFilter();f.type="highpass";f.frequency.value=hp||2500;const v=ac.createGain();v.gain.value=g||.4;s.connect(f);f.connect(v);v.connect(ac.destination);s.start()}catch(e){}}
function tick1(acc){
 if(R.snd==="clic"){noise(.018,acc?.7:.5,3500);tone(acc?2200:1800,.03,.18,"square")}
 else if(R.snd==="bip"){tone(acc?1200:1000,.07,.28,"sine")}
 else{const f=acc?1100:820;tone(f,.11,.62,"sine",0,f*.62);tone(f*2.1,.05,.14,"sine",0,f*1.3);noise(.012,.2,3000)}
}
function chime(freqs,gap,dur,g,type){freqs.forEach((f,i)=>tone(f,dur,g,type||"triangle",i*gap))}
function vent(){tone(440,.2,.35,"triangle",0,360)}
/* ---------- voz ---------- */
const MALE=/(diego|jorge|juan|carlos|pablo|raul|raúl|miguel|antonio|enrique|jose|josé|luis|male|masculin|hombre|andres|andrés|martin|martín|tomas|tomás|gonzalo)/i;
const FEM=/(female|femen|mujer|paulina|monica|mónica|helena|laura|sabina|sofia|sofía|lupe|marisol|elena|isabela|dalia|paloma|valentina|elvira|salome|salomé|camila|catalina|ximena|lucia|lucía|marta|carmen|maria|maría|mariana|florencia|soledad)/i;
const QUAL=/(premium|mejorad|enhanced|neural|natural|google|siri|online|wavenet)/i,LOW=/(compact|espeak|eloquence|eddy|flo\b|grandma|grandpa|abuel|reed|rocko|sandy|shelley|bad news|bells|boing|bubbles|cellos|wobble|jester|organ|trinoids|whisper|zarvox|superstar|bahh|albert|fred|junior|kathy|ralph)/i;
const rank=v=>{let s=0;const id=(v.name||"")+" "+(v.voiceURI||""),l=(v.lang||"").replace("_","-").toLowerCase();if(QUAL.test(id))s+=200;if(LOW.test(id))s-=300;if(v.localService===false)s-=40;if(l==="es-ar")s+=40;else if(/^es-(us|419|mx|co|cl|uy|pe|ve|bo|ec|py|cr|pa|gt|hn|ni|sv|do|pr|cu)/.test(l))s+=30;if(MALE.test(v.name))s+=15;if(FEM.test(v.name))s-=10;return s};
function vget(){try{return localStorage.getItem("arucip-voice")||""}catch(e){return""}}
function vfill(){const sel=document.getElementById("pv-vsel");if(!sel)return;const cur=vget();sel.innerHTML="";const o0=document.createElement("option");o0.value="";o0.textContent=window.ARUCIP_I18N&&ARUCIP_I18N.cur!=="es"&&ARUCIP_I18N.langs[ARUCIP_I18N.cur].dict["Automática (la mejor disponible)"]||"Automática (la mejor disponible)";sel.appendChild(o0);
 voices.forEach(v=>{const o=document.createElement("option");o.value=v.voiceURI||v.name;const id=(v.name||"")+" "+(v.voiceURI||"");o.textContent=v.name+" · "+v.lang+(QUAL.test(id)?" ★":"")+(v.localService===false?" (online)":"");sel.appendChild(o)});
 sel.value=voices.some(v=>(v.voiceURI||v.name)===cur)?cur:"";const no=document.getElementById("pv-vno");if(no)no.hidden=voices.length>0}
function loadVoices(){try{voices=(speechSynthesis.getVoices()||[]).filter(v=>/^es/i.test(v.lang));voices.sort((a,b)=>rank(b)-rank(a))}catch(e){}vfill()}
try{if(window.speechSynthesis){loadVoices();window.speechSynthesis.onvoiceschanged=loadVoices}}catch(e){}
function pickVoice(){const c=vget();if(c){const f=voices.find(v=>(v.voiceURI||v.name)===c);if(f)return f}return voices[0]||null}
document.addEventListener("change",e=>{if(e.target&&e.target.id==="pv-vsel"){try{localStorage.setItem("arucip-voice",e.target.value)}catch(x){}}});
document.addEventListener("click",e=>{if(e.target&&e.target.closest&&e.target.closest("#pv-vtest")){if(!voices.length)loadVoices();if(window.ARUCIP_SND){ARUCIP_SND.on("vz");setTimeout(function(){ARUCIP_SND.off("vz")},7000)}say("Inicio de RCP. Compresiones fuertes y rápidas.",true)}});
document.addEventListener("toggle",e=>{if(e.target&&e.target.id==="pv-vz"&&e.target.open)loadVoices()},true);
function spTr(t){const I=window.ARUCIP_I18N;if(!I||!I.str||I.cur==="es")return null;const en=I.cur==="en",ok=h=>({t:h,l:en?"en-US":"pt-BR"});
 let h=I.str(t);if(h!==undefined)return ok(h);
 const a=t.split(/([.;]\s+)/);let o="",i,p,dot,x,m,b;
 for(i=0;i<a.length;i+=2){p=a[i];dot="";
  if(i===a.length-1&&p.length>1&&p.charAt(p.length-1)==="."){dot=".";p=p.slice(0,-1)}
  x=I.str(p);
  if(x===undefined&&(m=/^(Revisar |Pendiente revisar: )(.+)$/.exec(p))){b=m[2].split(" y ").map(n=>I.str(n));if(b.every(n=>n!==undefined))x=(m[1]==="Revisar "?(en?"Review ":"Revisar "):(en?"Pending to review: ":"Pendente revisar: "))+b.join(en?" and ":" e ")}
  if(x===undefined)return null;
  o+=x+dot+(a[i+1]||"")}
 return ok(o)}
function voiceFor(l){try{const p=l.slice(0,2),a=(speechSynthesis.getVoices()||[]).filter(v=>v.lang&&v.lang.toLowerCase().indexOf(p)===0);a.sort((x,y)=>rank(y)-rank(x));return a[0]||null}catch(e){return null}}
function say(t,force){if((R.mute||!R.voice)&&!force)return;try{const s=window.speechSynthesis;if(!s)return;s.cancel();const x=spTr(t);if(x)t=x.t;const u=new SpeechSynthesisUtterance(t),v=x?voiceFor(x.l):pickVoice();if(v){u.voice=v;u.lang=v.lang}else u.lang=x?x.l:"es-AR";u.pitch=1;u.rate=1;u.volume=1;s.speak(u)}catch(e){}}
function vib(p){try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}}
/* ---------- registro y alertas ---------- */
const p2=n=>String(n).padStart(2,"0");
const hms=ms=>{const d=new Date(ms);return p2(d.getHours())+":"+p2(d.getMinutes())+":"+p2(d.getSeconds())};
const dmy=ms=>{const d=new Date(ms);return p2(d.getDate())+"/"+p2(d.getMonth()+1)+"/"+d.getFullYear()};
const plClean=x=>String(x).replace(/<[^>]+>/g,"");
function plCount(L,re){return L.filter(x=>re.test(plClean(x[1]))).length}
function plSum(rec){const L=rec.log||[];return{epi:plCount(L,/^Adrenalina n\.º/),sh:plCount(L,/^Descarga n\.º/),am:plCount(L,/^Amiodarona n\.º/),li:plCount(L,/^Lidocaína n\.º/),rosc:plCount(L,/^Retorno de circulación/)>0}}
function plText(rec){const L=rec.log||[],t0=rec.t0||(L[0]&&L[0][2])||0,m=plSum(rec),last=L.length?L[L.length-1][0]:0;
 const T=x=>{const I=window.ARUCIP_I18N,h=I&&I.str?I.str(x):undefined;return h===undefined?x:h};
 return T("Registro de RCP (Arucip)")+"\n"+(t0?T("Inicio: "+dmy(t0)+" "+hms(t0))+" · ":"")+T("Duración: "+mmss(last))+"\n"
 +L.map(x=>mmss(x[0])+"  "+(x[2]?hms(x[2])+"  ":"")+T(plClean(x[1]))).join("\n")
 +"\n"+T("Resumen: adrenalina "+m.epi+" · descargas "+m.sh+" · amiodarona "+m.am+" · lidocaína "+m.li+" · ROSC: "+(m.rosc?"sí":"no"))
 +"\n"+T("Registro automático de apoyo: verificá los datos y registralo en la historia clínica.")}
function plSave(){try{localStorage.setItem("arucip-paro-last",JSON.stringify({t0:R.t0,log:R.log}))}catch(e){}}
function plLoad(){try{const r=JSON.parse(localStorage.getItem("arucip-paro-last")||"null");return r&&Array.isArray(r.log)&&r.log.length?r:null}catch(e){return null}}
window.ARUCIP_PLOG={text:plText,sum:plSum,load:plLoad,hms:hms,dmy:dmy,mmss:mmss,clear:function(){try{localStorage.removeItem("arucip-paro-last")}catch(e){}}};
function log(t){const now=Date.now(),s=R.on?(now-R.t0)/1000:(R.t0?(now-R.t0)/1000:0);R.log.push([s,t,now]);E("pv-log").insertAdjacentHTML("afterbegin",`<li><b class="pm">${mmss(s)}</b> <small class="pm">${hms(now)}</small> ${t}</li>`);plSave()}
function alertMsg(key,html,lvl,spoken){
 const a=E("pv-al");a.dataset.l=lvl;a.innerHTML=html;a.classList.remove("flash");void a.offsetWidth;a.classList.add("flash");
 if(key){if(R.seen[key])return;R.seen[key]=1}
 if(lvl==="crit"){chime([784,1047,784,1047],.17,.2,.4);vib([200,100,200,100,300])}
 else if(lvl==="warn"){chime([660,880],.2,.22,.35);vib([150,80,150])}
 else{chime([660],0,.16,.28);vib(60)}
 if(spoken)say(spoken);
}
const periodMs=()=>60000/R.rate;
function schedule(ms){clearTimeout(beatT);R.next=Date.now()+ms;beatT=setTimeout(beat,ms)}
function dots(n){const d=E("pv-dots").children;for(let i=0;i<15;i++)d[i].className=i<n?"on":""}
function beat(){
 if(!R.on||R.hold)return;
 const late=Date.now()-R.next;R.cnt++;
 tick1(!R.adv&&R.cnt===1);
 const h=E("pv-hr");h.classList.remove("pulse");void h.offsetWidth;h.classList.add("pulse");
 const adj=Math.max(0,Math.min(late,50));
 if(R.adv){E("pv-c").textContent="Continuas";E("pv-cs").textContent="Compresiones sin pausa";dots(0);schedule(periodMs()-adj);return}
 const RT=R.ratio||15;
 if(R.cnt>=RT){E("pv-c").textContent="VENTILAR ×2";E("pv-cs").textContent="Pausa breve (≈3 s)";dots(15);
  setTimeout(()=>{if(R.on&&!R.hold){vent();vib(80)}},350);setTimeout(()=>{if(R.on&&!R.hold)vent()},1650);
  R.cnt=0;schedule(3200);return}
 E("pv-c").textContent=R.cnt+" / "+RT;E("pv-cs").textContent="Relación "+RT+":2";dots(RT===30?Math.ceil(R.cnt/2):R.cnt);
 schedule(periodMs()-adj);
}
function startVent(){clearInterval(ventT);ventT=null;if(R.adv&&R.on&&!R.hold)ventT=setInterval(()=>{if(R.on&&!R.hold)vent()},2500)}
function resumeCPR(){pEnd();R.hold=false;R.cnt=0;R.pauseStart=0;E("pv-an").hidden=true;E("pv-shk").hidden=true;E("pv-rb").hidden=false;schedule(100);startVent()}
function pEnd(){if(R.ps){const d=(Date.now()-R.ps)/1000;R.pn=(R.pn||0)+1;R.pt=(R.pt||0)+d;R.pmax=Math.max(R.pmax||0,d);R.ps=0}}
function holdCPR(){R.ps=Date.now();R.hold=true;clearTimeout(beatT);clearInterval(ventT);E("pv-c").textContent="PAUSA";E("pv-cs").textContent="Sin compresiones: no pasar de 10 s";dots(0)}
const rg=(x,y)=>x===y?x:x+"–"+y;
const JMAX=200,LIDOMAX=100,CACLMAX=10,CAGLUMAX=30,BICMAX=50,D10MAX=250;
function jc(x){return Math.min(x,JMAX)}
function dosis(){
 const w=parseFloat(E("pv-w").value);let h="";
 if(w>0){const mg=Math.min(.01*w,1),ml=Math.min(.1*w,10);
  h=`<b>Adrenalina:</b> 0,01 mg/kg = ${sf(mg)} mg = <b>${sf(ml)} mL</b> de 1:10.000 (0,1 mg/mL). Máx 1 mg (10 mL). IV/IO cada 3–5 min.<br>`
   +`<b>Descargas:</b> 1.ª 2 J/kg = <b>${sf(jc(2*w))} J</b>. 2.ª 4 J/kg = <b>${sf(jc(4*w))} J</b>. Siguientes ≥4 J/kg hasta 10 J/kg (${rg(sf(jc(4*w)),sf(jc(10*w)))} J). <b>Tope adulto: ${JMAX} J bifásico</b> (si no se conoce el equipo, usar la energía máxima disponible); nunca pasar de ahí.<br>`
   +`<b>Antiarrítmicos (FV/TVsp refractaria):</b> amiodarona 5 mg/kg = <b>${sf(Math.min(5*w,300))} mg</b> (máx 300 mg por dosis; acumulado máx 15 mg/kg) o lidocaína 1 mg/kg = <b>${sf(Math.min(w,LIDOMAX))} mg</b> (máx ${LIDOMAX} mg por dosis) IV/IO.<br>`
   +`<b>Otros (solo con causa específica):</b> calcio cloruro 10% 0,1–0,2 mL/kg = <b>${rg(sf(Math.min(.1*w,CACLMAX)),sf(Math.min(.2*w,CACLMAX)))} mL</b> lento (máx ${CACLMAX} mL = 1 g); gluconato de calcio 10% 0,6–1 mL/kg = <b>${rg(sf(Math.min(.6*w,CAGLUMAX)),sf(Math.min(w,CAGLUMAX)))} mL</b> (máx ${CAGLUMAX} mL = 3 g); bicarbonato 1 mEq/kg = <b>${sf(Math.min(w,BICMAX))} mEq</b> (máx ${BICMAX} mEq); glucosa 10% 5–10 mL/kg = <b>${rg(sf(Math.min(5*w,D10MAX)),sf(Math.min(10*w,D10MAX)))} mL</b> (máx ${D10MAX} mL = 25 g); magnesio 25–50 mg/kg = <b>${rg(sf(Math.min(25*w,2000)),sf(Math.min(50*w,2000)))} mg</b> (máx 2 g).<br><b>Bradicardia con pulso (no paro):</b> atropina 0,02 mg/kg = <b>${sf(Math.min(.02*w,.5))} mg</b> (máx 0,5 mg; sin dosis mínima); adrenalina igual que en el paro.<br><b>Adrenalina por tubo (sin IV/IO):</b> 0,1 mg/kg = <b>${sf(Math.min(.1*w,2.5))} mg = ${sf(Math.min(.1*w,2.5))} mL</b> de la ampolla 1 mg/mL (máx 2,5 mg).`;
  E("pv-aad").innerHTML=`Amiodarona 5 mg/kg = <b>${sf(Math.min(5*w,300))} mg</b> (máx 300 mg). Lidocaína 1 mg/kg = <b>${sf(Math.min(w,LIDOMAX))} mg</b> (máx ${LIDOMAX} mg). Tras la 3.ª descarga (o refractaria).`}
 else{E("pv-aad").textContent="Ingresá el peso para ver las dosis. Amiodarona 5 mg/kg (máx 300 mg), lidocaína 1 mg/kg.";h="Ingresá el peso para ver los mL y los J. Dosis por kg: adrenalina 0,01 mg/kg (0,1 mL/kg de 1:10.000, máx 1 mg); descarga 2 J/kg, luego 4 J/kg (hasta 10 J/kg, tope 200 J); amiodarona 5 mg/kg (máx 300 mg) o lidocaína 1 mg/kg (máx 100 mg)."}
 E("pv-dos").innerHTML=h;updLead(w);
 const prep="<br><b>Cómo prepararla:</b> la ampolla viene a 1 mg/mL (1:1.000). Cargar 1 mL de la ampolla + 9 mL de SF en una jeringa de 10 mL = 0,1 mg/mL (1:10.000). Después de darla, lavar con SF.";
 E("pv-epd").innerHTML=(w>0?`Dosis: <b>${sf(Math.min(.1*w,10))} mL</b> de 1:10.000 (0,01 mg/kg, máx 1 mg). Repetir cada 3–5 min, no en cada ciclo.`:"0,01 mg/kg = 0,1 mL/kg de 1:10.000 (máx 1 mg = 10 mL). Repetir cada 3–5 min, no en cada ciclo.")+prep;
 return w>0?w:null;
}
function shockText(){
 const w=dosis(),n=R.shocks+1;
 const per=n===1?"2 J/kg":n===2?"4 J/kg":"≥4 J/kg (hasta 10 J/kg)";
 const j=w?(n===1?` = <b>${sf(jc(2*w))} J</b>`:n===2?` = <b>${sf(jc(4*w))} J</b>`:(jc(4*w)===jc(10*w)?` = <b>${JMAX} J (tope adulto)</b>`:` = ${sf(jc(4*w))} a ${sf(jc(10*w))} J (tope ${JMAX} J)`)):"";
 return `<b>Descarga n.º ${n}: ${per}${j}</b>. Cargar mientras se comprime → «¡Todos afuera, oxígeno afuera!» → descargar → reanudar la RCP de inmediato, sin tomar pulso.`;
}
function epiStatus(){
 const el=E("pv-ep");
 if(!R.epiN){el.textContent="sin dosis";el.dataset.s="";return}
 const s=(Date.now()-R.epiLast)/1000;el.textContent="hace "+mmss(s)+" · "+R.epiN+(R.epiN===1?" dosis":" dosis");el.dataset.s=s>=EPI5?"r":s>=EPI3?"a":"g";
}
function onTick(){
 if(!R.on)return;
 const now=Date.now(),tot=(now-R.t0)/1000;E("pv-t").textContent=mmss(tot);
 if(!R.pending){const c=(now-R.cycStart)/1000,left=CYC-c;E("pv-cy").textContent=mmss(left);E("pv-cb").style.width=Math.min(100,100*c/CYC)+"%";
  if(c>=PRE&&!R.preDone){R.preDone=1;const pw=parseFloat(E("pv-w").value)||0,chg=R.rhythm==="sh"||R.shocks>0,nx=R.shocks+1,es=R.epiN?(now-R.epiLast)/1000:0,epiN=(R.epiN&&es+15>=EPI3)||(!R.epiN&&R.rhythm==="ns");
   const ej=pw>0?(nx===1?sf(jc(2*pw))+" J":nx===2?sf(jc(4*pw))+" J":(jc(4*pw)===jc(10*pw)?sf(jc(4*pw))+" J":sf(jc(4*pw))+"–"+sf(jc(10*pw))+" J")):"";
   alertMsg(null,"En 15 s: <b>preparar el análisis de ritmo</b>. El próximo reanimador se prepara para el <b>cambio</b>."+(chg?"<br><b>Cargar el desfibrilador</b> mientras se comprime"+(ej?": "+ej:"")+" (descarga n.º "+nx+" si sigue en FV/TVsp; si ya no es desfibrilable, anular la carga sin descargar).":"")+(epiN?"<br>Tener lista la <b>adrenalina</b>"+(pw>0?": "+sf(Math.min(.1*pw,10))+" mL de 1:10.000":"")+".":""),"warn","En quince segundos, cambio de reanimador y análisis de ritmo"+(chg?". Cargar el desfibrilador":"")+(epiN?". Preparar adrenalina":""))}
  if(c>=CYC)openAnalysis()}
 else{const p=(now-R.pauseStart)/1000;E("pv-cy").textContent="PAUSA "+Math.floor(p)+" s";E("pv-cb").style.width="100%";
  if(p>=PAUSE_MAX&&!R.pLong){R.pLong=1;alertMsg(null,"<b>Pausa mayor a 10 s</b>: reanudar compresiones ya.","crit","Reanudar compresiones")}}
 if(R.epiN){const s=(now-R.epiLast)/1000;
  if(s>=120&&s<EPI3&&!R.e2){R.e2=1;const pw=parseFloat(E("pv-w").value)||0;alertMsg(null,"<b>Adrenalina:</b> en 1 minuto se cumplen 3 min de la última. Prepará la próxima dosis"+(pw>0?" ("+sf(Math.min(.1*pw,10))+" mL de 1:10.000)":"")+" para darla si sigue en paro.","info","Preparar la próxima adrenalina")}
  if(s>=EPI3&&!R.e3){R.e3=1;alertMsg(null,"<b>Adrenalina:</b> pasaron 3 min, se puede repetir (3–5 min) si sigue en paro.","warn","Adrenalina, tres minutos")}
  if(s>=EPI5&&!R.e5){R.e5=1;alertMsg(null,"<b>Adrenalina:</b> pasaron 5 min. Repetir ahora si sigue en paro.","crit","Adrenalina, cinco minutos. Repetir")}}
 epiStatus();
}
function openAnalysis(){pvTab(0);
 R.pending=true;R.pauseStart=Date.now();R.pLong=0;R.rhythm=null;holdCPR();
 E("pv-an").hidden=false;E("pv-shk").hidden=true;E("pv-rb").hidden=false;E("pv-ansh").innerHTML="<b>Cambio de reanimador y análisis de ritmo.</b> Pausa breve (&lt;10 s). Buscar causas reversibles (H y T).";
 E("pv-ht").open=true;E("pv-cgt").textContent="Análisis de ritmo · ciclo "+R.cyc+" terminado";log("Cambio de reanimador y análisis de ritmo");
 alertMsg(null,"<b>CAMBIO DE REANIMADOR</b> y <b>ANALIZAR RITMO</b>: pausa &lt;10 s. Elegir el ritmo.","crit","Cambio de reanimador. Analizar ritmo");
}
function rhythm(r){
 if(!R.on)return;
 if(r==="rosc"){if(!R.r1){R.r1="rosc";R.r1t=(Date.now()-R.t0)/1000}rosc();return}
 R.rhythm=r;if(!R.r1){R.r1=r;R.r1t=(Date.now()-R.t0)/1000}
 if(r==="ns"){log("Ritmo no desfibrilable (asistolia/AESP)");newCycle()}
 else if(r==="sh"){log("Ritmo desfibrilable (FV/TVsp)");E("pv-rb").hidden=true;E("pv-shk").hidden=false;E("pv-ansh").innerHTML=shockText();
  alertMsg(null,shockText(),"crit","Descarga. Todos fuera")}
}
function shockGiven(){
 R.shocks++;if(R.shocks===1)R.tS1=(Date.now()-R.t0)/1000;log("Descarga n.º "+R.shocks+(R.shocks===1?" (2 J/kg)":R.shocks===2?" (4 J/kg)":" (≥4 J/kg)"));newCycle();
}
function htRender(){
 const d=R.ht||{};let n=0;
 Array.from(document.querySelectorAll("#pv-htl .pv-ck")).forEach(l=>{const i=l.dataset.i,x=d[i],inp=l.querySelector("input"),ev=l.querySelector(".pv-ev");
  inp.checked=!!x;if(x)n++;ev.textContent=x?"✔ Evaluada · ciclo "+x.c+" · min "+mmss(x.t):""});
 const c=E("pv-htc");if(c)c.textContent="· "+n+"/"+HT.length+" evaluadas"}
E("pv-htl").addEventListener("change",e=>{
 const l=e.target.closest(".pv-ck");if(!l)return;R.ht=R.ht||{};const i=l.dataset.i;
 if(e.target.checked){const t=R.t0?(Date.now()-R.t0)/1000:0;R.ht[i]={c:R.cyc||1,t:t};log("H/T evaluada: "+HT[i][0])}
 else{delete R.ht[i];log("H/T reabierta: "+HT[i][0])}
 htRender();if(R.on&&!R.pending)cycleGuide("keep")});
E("pv-htr").addEventListener("click",()=>{R.ht={};log("H y T: se reiniciaron todas");htRender();if(R.on&&!R.pending)cycleGuide("keep")});
function newCycle(){R.cyc=(R.cyc||1)+1;R.pending=false;R.cycStart=Date.now();R.preDone=0;htRender();resumeCPR();cycleGuide(false)}

const HTG=[["Hipoxia","Hipovolemia"],["Hidrogenión","Hipo/hiperpotasemia"],["Hipoglucemia","Hipotermia"],["Neumotórax a tensión"],["Taponamiento","Tóxicos"],["Trombosis pulmonar","Trombosis coronaria"]];
function cycleGuide(first){const keep=first==="keep";if(keep)first=false;
 const w=parseFloat(E("pv-w").value)||0,n=R.cyc,now=Date.now(),tot=(now-R.t0)/1000;
 const rh=R.rhythm,sh=R.shocks,L=[],S=[];
 const epiS=R.epiN?(now-R.epiLast)/1000:null;
 const epiD=w>0?" = "+sf(Math.min(.1*w,10))+" mL de 1:10.000":"";
 const epiLine=()=>{
  if(!R.epiN){L.push(["c","<b>Adrenalina ya</b>: 0,01 mg/kg IV/IO"+epiD+" (máx 1 mg)."]);S.push("Adrenalina ahora")}
  else if(epiS>=180){L.push(["w","<b>Adrenalina: repetir ahora</b> (pasaron "+mmss(epiS)+"; cada 3–5 min)"+epiD+"."]);S.push("Adrenalina, repetir ahora")}
  else L.push(["i","Adrenalina: última hace "+mmss(epiS)+". Próxima entre "+mmss(Math.max(0,180-epiS))+" y "+mmss(300-epiS)+"."])};
 const nxt=sh+1,jx=nxt===1?"2 J/kg":nxt===2?"4 J/kg":"≥4 J/kg (hasta 10 J/kg)";
 const jv=w>0?(nxt===1?" = "+sf(jc(2*w))+" J":nxt===2?" = "+sf(jc(4*w))+" J":(jc(4*w)===jc(10*w)?" = "+JMAX+" J (tope adulto)":" = "+sf(jc(4*w))+" a "+sf(jc(10*w))+" J (tope "+JMAX+" J)")):"";
 if(first){
  L.push(["c","<b>Confirmar el paro</b> en &lt;10 s (sin respuesta, sin respiración o gasping, sin pulso central), pedir ayuda y el desfibrilador."]);
  L.push(["w","Compresiones ya: 100–120/min, 1/3 del tórax, recoil completo. Parches sin interrumpir; O₂ 100%."]);
  L.push(["w","<b>Acceso IV/IO</b> y roles asignados. Cargar el desfibrilador cuando llegue."]);
  L.push(["i","Al final del ciclo: cambio de compresor y análisis de ritmo (&lt;10 s)."]);
 }else{
  if(!rh){L.push(["c","<b>Compresiones YA por 2 minutos</b> (ciclo "+n+"). Al terminar: cambio de compresor y análisis de ritmo; ahí se decide descarga o adrenalina."])}
  if(rh==="ns"){
   L.push(["c","<b>Reanudar compresiones YA y seguir 2 minutos</b> (ciclo "+n+") sin revisar pulso. El próximo análisis de ritmo es a los 2:00."]);
   L.push(["i","<b>Ritmo no desfibrilable</b> (asistolia/AESP): no se descarga. Si aparece FV/TVsp, elegir ritmo desfibrilable."]);
   epiLine();
  }else if(rh==="sh"){
   L.push(["c","<b>Tras la descarga: compresiones inmediatas por 2 minutos</b> (ciclo "+n+"), sin revisar pulso ni ritmo antes. Después: cambio de compresor y nuevo análisis."]);
   if(sh===1){L.push(["i","<b>Descarga 1 dada</b>. RCP 2 min, acceso IV/IO si falta, cargar el desfibrilador durante las compresiones."])}
   else if(sh===2){L.push(["i","<b>2 descargas dadas</b>."]);epiLine()}
   else{
    L.push(["i","<b>"+sh+" descargas dadas</b>."]);epiLine();
    if(!amioN&&!lidoN){L.push(["c","<b>Antiarrítmico</b>: amiodarona 5 mg/kg"+(w>0?" = "+sf(Math.min(5*w,300))+" mg":"")+" o lidocaína 1 mg/kg"+(w>0?" = "+sf(Math.min(w,LIDOMAX))+" mg":"")+" IV/IO."]);S.push("Amiodarona o lidocaína")}
    else if(amioN>=1&&amioN<3&&!lidoN){L.push(["w","Amiodarona ya dada ×"+amioN+": puede repetirse 5 mg/kg (acumulado máx 15 mg/kg). Alternativa: lidocaína 1 mg/kg."]);S.push("Considerar repetir amiodarona")}
    else L.push(["i","Antiarrítmico ya administrado ("+(amioN?amioN+" amiodarona":"")+(lidoN?(amioN?" y ":"")+lidoN+" lidocaína":"")+")."]);
   }
   L.push(["i","Si persiste FV/TVsp: <b>descarga n.º "+nxt+"</b>, "+jx+jv+"."]);
  }
  // ciclos largos: recordar la secuencia aunque no haya cambios
  if(n>=4)L.push(["i","Ciclo "+n+": mantener RCP de calidad. Si el paro sigue, revisar causas reversibles, considerar ECPR/ECMO según centro."]);
 }
 // comunes a todos los ciclos
 L.push(["i","<b>Cambiar compresor</b>; compresiones profundas y sin pausas, recoil completo."]);
 if(R.adv)L.push(["i","Vía aérea avanzada: compresiones continuas y 1 ventilación cada 2–3 s (20–30/min), sin hiperventilar."]);
 else if(n>=2||(rh&&!first)){L.push(["w","Considerar <b>vía aérea avanzada y capnografía</b>. Sin vía avanzada: 15:2 (30:2 si hay un solo reanimador)."]);S.push("Considerar vía aérea avanzada")}
 L.push(["i","CO₂ espirado &gt;10–15 mmHg = compresiones eficaces; si es menor, mejorar la calidad. Subida brusca: pensar en ROSC. Diastólica invasiva ≥25 (lactante) o ≥30 mmHg (≥1 año)."]);
 const pend=HT.map((t,i)=>[t[0],i]).filter(x=>!(R.ht&&R.ht[x[1]])).map(x=>x[0]);
 let htLine="";if(pend.length){const g=pend.slice(0,2),det=g.map(n=>{const t=HT.find(x=>x[0]===n);return `<span class="cg-ht"><b>${t[0]}</b> · <span>Buscá:</span> <span>${t[1]}</span> <span>Qué hacer:</span> <span>${t[2]}</span></span>`}).join("");htLine="<b>H y T pendientes ("+pend.length+" de "+HT.length+"):</b> "+g.join(" y ")+". Las ya descartadas quedan marcadas en el panel."+det;L.push(["w",htLine]);S.push("Revisar "+g.join(" y "))}else L.push(["i","Todas las H y T fueron evaluadas. Si no hay respuesta, reevaluar y considerar ECPR/ECMO según centro."]);
 if(n>=2)L.push(["i","Ecografía solo durante el análisis de ritmo, &lt;10 s: actividad cardíaca, derrame, VD, deslizamiento pleural."]);
 const t="Ciclo "+n+" · minuto "+mmss(tot)+(first?" · inicio":rh==="sh"?" · desfibrilable":rh==="ns"?" · no desfibrilable":"");
 E("pv-cgt").textContent=t;
 E("pv-cg").innerHTML=L.map(x=>`<li class="cg-${x[0]}">${x[1]}</li>`).join("");
 if(!first&&!keep){
  const lvl=L.some(x=>x[0]==="c")?"crit":L.some(x=>x[0]==="w")?"warn":"info";
  const tl=L.filter(x=>x[0]==="c"||x[0]==="w").slice(0,3).map(x=>x[1]);if(htLine&&tl.indexOf(htLine)<0)tl.push(htLine);const top=tl.join("<br>");
  alertMsg(null,"<b>"+t+"</b><br>"+(top||L[0][1]),lvl,"Ciclo "+n+". "+(S.length?S.slice(0,3).join(". "):"Continuar RCP de calidad"));
  log("Ciclo "+n+" iniciado"+(S.length?": "+S.join("; "):""));
 }
}

function epiGiven(){
 if(!R.on)return;R.epiN++;R.epiLast=Date.now();R.e2=0;R.e3=0;R.e5=0;if(R.epiN===1)R.tE1=(Date.now()-R.t0)/1000;log("Adrenalina n.º "+R.epiN);setTimeout(()=>{if(R.on&&!R.pending)cycleGuide("keep")},0);
 alertMsg(null,"Adrenalina n.º "+R.epiN+" registrada. Próxima dosis posible a los 3–5 min.","info","");epiStatus();
}
let aaN=0,amioN=0,lidoN=0;
function aaGive(k){const w=parseFloat(E("pv-w").value);aaN++;if(k==="a"){amioN++;log("Amiodarona n.º "+amioN+(w>0?" ("+sf(Math.min(5*w,300))+" mg)":"")+(amioN>3?" ¡revisar dosis acumulada (máx 15 mg/kg)!":""))}else{lidoN++;log("Lidocaína n.º "+lidoN+(w>0?" ("+sf(Math.min(w,LIDOMAX))+" mg)":""))}E("pv-aa").textContent=(amioN?amioN+" amio ":"")+(lidoN?lidoN+" lido":"")||"0"}
ov.querySelector("#pv-aab").addEventListener("click",()=>aaGive("a"));ov.querySelector("#pv-aal").addEventListener("click",()=>aaGive("l"));
function rosc(){
 pEnd();R.tRosc=(Date.now()-R.t0)/1000;log("Retorno de circulación espontánea (ROSC)");R.on=false;clearTimeout(beatT);clearInterval(ventT);clearInterval(tick);rel();
 const a=E("pv-al");a.dataset.l="info";a.innerHTML="<b>ROSC</b>. Iniciar cuidados posparo. Abrí “Cuidados posparo” abajo: oxigenación 94–99%, evitar hipotensión, glucemia, ECG, temperatura &lt;37,5 °C y buscar la causa.";const pp=E("pv-post");if(pp)pp.open=true;setTimeout(informe,0);
 E("pv-an").hidden=true;E("pv-c").textContent="–";E("pv-cs").textContent="Detenido";dots(0);E("pv-t").textContent=mmss((Date.now()-R.t0)/1000);E("mon-rcp").hidden=true;E("pv-re").hidden=false;
}
function rearrest(){if(R.on||!R.t0)return;E("pv-re").hidden=true;R.on=true;R.pending=false;R.hold=false;R.rhythm=null;R.preDone=0;R.seen={};R.cyc=(R.cyc||1)+1;R.cycStart=Date.now();
 R.reN=(R.reN||0)+1;R.tRe=Date.now();log("Nuevo paro tras ROSC: se reanuda la RCP");E("mon-rcp").hidden=false;tick=setInterval(onTick,250);lock();resumeCPR();cycleGuide(false);
 alertMsg(null,"<b>Nuevo paro.</b> Compresiones YA. Análisis de ritmo a los 2 min. Las dosis y descargas previas siguen registradas.","crit","Nuevo paro. Compresiones ya");onTick()}
async function lock(){try{if(navigator.wakeLock)wl=await navigator.wakeLock.request("screen")}catch(e){}}
function rel(){try{wl&&wl.release();wl=null}catch(e){}}
function setAdv(on){R.adv=on;if(on&&R.tAdv==null&&R.t0)R.tAdv=(Date.now()-R.t0)/1000;E("pv-adv").setAttribute("aria-pressed",on);log(on?"Vía aérea avanzada: compresiones continuas y ventilación cada 2–3 s":"Sin vía aérea avanzada: 15:2");R.cnt=0;if(R.on&&!R.hold){E("pv-c").textContent=on?"Continuas":"–";startVent()}}
function start(){
 if(R.on){ov.hidden=false;return}
 window.ARUCIP_SND&&ARUCIP_SND.on("paro",function(){try{ac&&ac.resume()}catch(e){}});
 try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();ac.resume&&ac.resume()}catch(e){}
 aaN=0;amioN=0;lidoN=0;E("pv-aa").textContent="0";Object.assign(R,{cyc:1,on:true,t0:Date.now(),cycStart:Date.now(),pending:false,hold:false,rate:120,cnt:0,epiN:0,epiLast:0,shocks:0,rhythm:null,amio:0,adv:false,mute:false,voice:true,seen:{},log:[],preDone:0,e3:0,e5:0,ratio:15,e2:0,ps:0,pn:0,pt:0,pmax:0,r1:null,r1t:null,tE1:null,tS1:null,tAdv:null,tRosc:null,reN:0,tRe:0,wall:new Date()});
 E("pv-log").innerHTML="";E("pv-re").hidden=true;R.ht={};E("pv-htl").innerHTML=HT.map((t,i)=>`<label class="pv-ck" data-i="${i}"><input type="checkbox"><span><b>${t[0]}</b><i class="pv-ev"></i><small>${t[1]}</small><em>${t[2]}</em></span></label>`).join("");htRender();
 E("pv-rate").textContent="120";
 Array.from(E("pv-hit").children).forEach(b=>b.setAttribute("aria-pressed","false"));dots(0);
 E("pv-an").hidden=true;E("pv-ht").open=false;E("pv-cb").style.width="0%";dosis();cycleGuide(true);
 pvTab(0);ov.hidden=false;document.body.style.overflow="hidden";ov.scrollTop=0;
 log("PARO: inicio de RCP a 120/min");
 alertMsg(null,"<b>Inicio de RCP.</b> Confirmar en &lt;10 s: inconsciente, sin respiración (o gasping) y sin pulso central. Compresiones 100–120/min, parches sin interrumpir, acceso IV/IO. Primer análisis y cambio de reanimador a los 2 min.","info","Inicio de RCP");
 E("mon-rcp").hidden=false;
 schedule(300);tick=setInterval(onTick,250);lock();onTick();
}
function end(){
 window.ARUCIP_SND&&ARUCIP_SND.off("paro");R.on=false;clearTimeout(beatT);clearInterval(ventT);clearInterval(tick);rel();try{window.speechSynthesis&&window.speechSynthesis.cancel()}catch(e){}
 ov.hidden=true;document.body.style.overflow="";E("mon-rcp").hidden=true;
}
document.addEventListener("click",e=>{
 if(e.target.closest("#paro")){start();return}
 if(e.target.closest("#mon-rcp")){ov.hidden=false;document.body.style.overflow="hidden"}
});
E("pv-rb").addEventListener("click",e=>{const b=e.target.closest("button");if(b)rhythm(b.dataset.rh)});
E("pv-shk").onclick=shockGiven;E("pv-epb").onclick=epiGiven;E("pv-re").onclick=rearrest;
E("pv-rth").onclick=()=>{const d=E("pv-rt");d.open=true;d.scrollIntoView({behavior:"smooth",block:"start"})};
E("pv-hit").addEventListener("click",e=>{const b=e.target.closest("button");if(!b||!R.on)return;if(b.id==="pv-adv"){setAdv(!R.adv);return}if(b.id==="pv-r30"){const on=R.ratio!==30;R.ratio=on?30:15;R.cnt=0;b.setAttribute("aria-pressed",on);log(on?"Un solo reanimador: relación 30:2":"Dos o más reanimadores: relación 15:2");return}const on=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",on);if(on)log(b.dataset.h)});
E("pv-w").addEventListener("input",()=>{dosis();if(R.on&&!R.pending){const t=E("pv-cgt").textContent;cycleGuide(R.cyc===1&&!R.rhythm&&R.shocks===0&&!R.epiN?true:"keep")}if(R.pending&&R.rhythm==="sh")E("pv-ansh").innerHTML=shockText()});
E("pv-rm").onclick=()=>{R.rate=Math.max(100,(R.rate||120)-10);E("pv-rate").textContent=R.rate};
E("pv-rp").onclick=()=>{R.rate=Math.min(120,(R.rate||120)+10);E("pv-rate").textContent=R.rate};
E("pv-cp").onclick=async e=>{const t=plText({t0:R.t0,log:R.log});const b=e.currentTarget;try{await navigator.clipboard.writeText(t);b.textContent="Copiado"}catch(x){b.textContent="No se pudo copiar"}setTimeout(()=>b.textContent="Copiar registro",2000)};
E("pv-x").onclick=e=>{const b=e.currentTarget;if(R.on&&!b.dataset.s){b.dataset.s=1;b.textContent="Tocá de nuevo";clearTimeout(exitT);exitT=setTimeout(()=>{delete b.dataset.s;b.textContent="Terminar"},3000);return}
 delete b.dataset.s;b.textContent="Terminar";end()};
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&R.on){lock();if(!R.hold&&R.next&&Date.now()-R.next>1500)schedule(100);onTick()}});
function updLead(w){const el=E("pv-lph");if(!el)return;
 if(!(w>0)){el.innerHTML="Cargá el peso para ver estas frases con las dosis exactas.";return}
 el.innerHTML="<b>Frases con este peso ("+sf(w)+" kg):</b><br>«Adrenalina "+sf(Math.min(.1*w,10))+" mL de 1:10.000 IV/IO, ahora, y lavá con SF».<br>«Cargando a "+sf(jc(2*w))+" J… ¡Todos afuera, oxígeno afuera!… Descarga». (2.ª descarga: "+sf(jc(4*w))+" J).<br>«Amiodarona "+sf(Math.min(5*w,300))+" mg IV/IO en bolo» o «Lidocaína "+sf(Math.min(w,LIDOMAX))+" mg IV/IO».";}
function estW(){const a=parseFloat(E("pv-ea").value),m=parseFloat(E("pv-em").value),o=E("pv-eo"),u=E("pv-eu");
 const hasA=a>=0,hasM=m>=0;u.hidden=true;u.dataset.w="";
 if(!hasA&&!hasM){o.innerHTML="Ingresá la edad. Si tenés cinta de Broselow (por talla) o el peso real, usalos antes que esta estimación.";return}
 const y=(hasA?a:0)+(hasM?m:0)/12,mo=Math.round(y*12);let w=null,f="";
 if(y>12){o.innerHTML="Mayores de 12 años: las fórmulas por edad no son confiables. Usá el peso referido o estimalo visualmente (adolescente grande: dosis de adulto con los topes).";return}
 if(mo<12){w=.5*mo+4;f="menores de 1 año: 0,5 × meses + 4"}
 else if(y<6){w=2*Math.floor(y)+8;f="1 a 5 años: 2 × años + 8"}
 else{w=3*Math.floor(y)+7;f="6 a 12 años: 3 × años + 7"}
 let tet;
 if(y>=2){const id=Math.floor((y/4+3.5)*2)/2;tet="TET con balón ≈ <b>"+sf(id)+" mm</b> (edad/4 + 3,5), a ≈ <b>"+sf(3*id)+" cm</b> en la comisura labial (3 × diámetro).";}
 else if(y>=1)tet="TET con balón ≈ <b>3,5–4 mm</b>, a ≈ 3 × diámetro en cm.";
 else tet="TET con balón ≈ <b>3–3,5 mm</b>, a ≈ 3 × diámetro en cm.";
 o.innerHTML="Peso estimado ≈ <b>"+sf(w)+" kg</b> (APLS, "+f+"). Es solo una estimación.<br>"+tet+" Tené listo medio número más y medio menos.";
 u.hidden=false;u.dataset.w=String(w);u.textContent="Usar "+sf(w)+" kg"}
function resumen(){if(!R.t0)return;
 const now=Date.now(),tot=(now-R.t0)/1000,min=s=>{const m=Math.floor(s/60);return m<1?"menos de un minuto":m===1?"1 minuto":m+" minutos"};
 const rh=!R.on?"retorno de circulación (ROSC)":R.pending?"análisis de ritmo en curso":R.rhythm==="sh"?"desfibrilable (FV/TVsp)":R.rhythm==="ns"?"no desfibrilable (asistolia/AESP)":"todavía sin analizar";
 const es=R.epiN?(now-R.epiLast)/1000:0;
 const epi=R.epiN?R.epiN+(R.epiN===1?" dosis":" dosis")+", la última hace "+mmss(es)+(es>=180?" (ya se puede repetir)":""):"sin adrenalina todavía";
 const epiS=R.epiN?R.epiN+" dosis, la última hace "+min(es)+(es>=180?", ya se puede repetir":""):"sin adrenalina todavía";
 const aa=amioN||lidoN?(amioN?amioN+" amiodarona":"")+(lidoN?(amioN?" y ":"")+lidoN+" lidocaína":""):"ninguno";
 const pend=HT.map((t,i)=>[t[0],i]).filter(x=>!(R.ht&&R.ht[x[1]])).map(x=>x[0]);
 const nx=R.on&&!R.pending?mmss(CYC-(now-R.cycStart)/1000):null;
 const h="<b>Resumen para el equipo</b> · minuto "+mmss(tot)+" · ciclo "+(R.cyc||1)+"<br>Ritmo: "+rh+". Descargas: "+(R.shocks||0)+". Adrenalina: "+epi+". Antiarrítmico: "+aa+". Vía aérea: "+(R.adv?"avanzada (compresiones continuas)":"bolsa y máscara")+".<br>H y T pendientes: "+(pend.length?pend.slice(0,4).join(", ")+(pend.length>4?" y "+(pend.length-4)+" más":""):"todas evaluadas")+"."+(nx?"<br>Próximo análisis de ritmo en "+nx+".":"")+(R.pn?"<br>Pausas de análisis y descarga: "+R.pn+", la más larga "+Math.round(R.pmax)+" s"+(R.pmax>10?" (más de 10 s: acortarlas)":"")+".":"")+"<br>«¿Alguien ve algo que se nos esté pasando?»";
 const sp="Resumen. Llevamos "+min(tot)+" de paro, ciclo "+(R.cyc||1)+". Ritmo: "+rh.replace(/\s*\(.*\)/,"")+". "+(R.shocks||0)+(R.shocks===1?" descarga":" descargas")+". Adrenalina: "+epiS+". "+(pend.length?"Pendiente revisar: "+pend.slice(0,2).join(" y ")+". ":"")+"¿Alguien ve algo que se nos esté pasando?";
 alertMsg(null,h,"info",sp);log("Resumen en voz alta al equipo");
 const a=E("pv-al");if(a&&a.scrollIntoView)a.scrollIntoView({behavior:"smooth",block:"start"})}
E("pv-sum").onclick=resumen;
function pvTab(i){const p=ov.querySelector(".pv");if(p.classList.contains("pv-i")===!!i)return;p.classList.toggle("pv-i",!!i);E("pv-tab1").setAttribute("aria-selected",i?"false":"true");E("pv-tab2").setAttribute("aria-selected",i?"true":"false");ov.scrollTop=0}
E("pv-tab1").onclick=()=>pvTab(0);E("pv-tab2").onclick=()=>pvTab(1);
E("pv-ea").addEventListener("input",estW);E("pv-em").addEventListener("input",estW);
E("pv-eu").onclick=()=>{const w=parseFloat(E("pv-eu").dataset.w);if(!(w>0))return;const i=E("pv-w");i.value=String(w);i.dispatchEvent(new Event("input",{bubbles:true}));if(R.on||R.t0)log("Peso estimado por edad: "+sf(w)+" kg");E("pv-eu").textContent="Peso cargado: "+sf(w)+" kg"};
function informe(){const el=E("pv-infb");if(!el)return"";
 if(!R.t0){el.innerHTML="<p>Todavía no hay datos.</p>";return""}
 const now=Date.now(),end=!R.on&&R.tRosc!=null?R.tRosc:(now-R.t0)/1000,w=parseFloat(E("pv-w").value)||0,d=R.wall||new Date(R.t0),z=n=>String(n).padStart(2,"0");
 const at=t=>t==null?null:"minuto "+mmss(t);
 const rn={sh:"desfibrilable (FV/TVsp)",ns:"no desfibrilable (asistolia/AESP)",rosc:"con pulso (ROSC)"};
 const evs=HT.map((t,i)=>[t[0],i]).filter(x=>R.ht&&R.ht[x[1]]).map(x=>x[0]);
 const rows=[
  ["Inicio de la RCP",z(d.getDate())+"/"+z(d.getMonth()+1)+"/"+d.getFullYear()+" "+z(d.getHours())+":"+z(d.getMinutes())],
  ["Duración de la RCP",mmss(end)+(R.on?" (en curso)":"")],
  ["Peso usado para las dosis",w>0?sf(w)+" kg":"no cargado"],
  ["Primer ritmo analizado",R.r1?rn[R.r1]+", "+at(R.r1t):"no analizado"],
  ["Descargas",R.shocks?R.shocks+", la primera en el "+at(R.tS1):"ninguna"],
  ["Adrenalina",R.epiN?R.epiN+" dosis, la primera en el "+at(R.tE1):"no se registró"],
  ["Antiarrítmico",amioN||lidoN?(amioN?amioN+" amiodarona":"")+(lidoN?(amioN?" y ":"")+lidoN+" lidocaína":""):"ninguno"],
  ["Vía aérea avanzada",R.tAdv!=null?"sí, desde el "+at(R.tAdv):"no se registró"],
  ["Pausas de análisis y descarga",R.pn?R.pn+", la más larga "+Math.round(R.pmax)+" s"+(R.pmax>10?" (más de 10 s)":""):"ninguna registrada"],
  ["H y T evaluadas",evs.length?evs.join(", "):"ninguna marcada"],
  ["Resultado",R.on?(R.reN?"nuevo paro tras ROSC, RCP en curso":"RCP en curso"):R.tRosc!=null?"ROSC en el "+at(R.tRosc)+(R.reN?" (hubo "+R.reN+" nuevo(s) paro(s))":""):"sin ROSC registrado"]];
 el.innerHTML=rows.map(r=>"<p><b>"+r[0]+":</b> "+r[1]+"</p>").join("");
 return el.innerText}
E("pv-inf").addEventListener("toggle",()=>{if(E("pv-inf").open)informe()});
E("pv-infc").onclick=async e=>{const b=e.currentTarget;informe();await new Promise(r=>setTimeout(r,120));const body=E("pv-infb").innerText.replace(/\n\s*\n/g,"\n").trim(),lg=Array.from(document.querySelectorAll("#pv-log li")).reverse().map(l=>l.innerText.replace(/\s+/g," ").trim()).join("\n");
 const t=(E("pv-inf").querySelector("summary").innerText)+"\n"+body+"\n\n"+(document.querySelector("#pv-log").closest("details").querySelector("summary").innerText)+":\n"+lg+"\n(Arucip"+(typeof VER!=="undefined"?" "+VER:"")+")";
 const lab=b.textContent;try{await navigator.clipboard.writeText(t);b.textContent="Copiado"}catch(x){b.textContent="No se pudo copiar"}setTimeout(()=>b.textContent=lab,2000)};
window.__paro=R;
})();;
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#pv-cpd");if(!b)return;const w=parseFloat(document.getElementById("pv-w").value);if(!(w>0)){b.textContent="Ingresá el peso primero";setTimeout(()=>b.textContent="Copiar dosis",1800);return}
const tx="Paro pediátrico · "+w+" kg\n"+document.getElementById("pv-dos").innerText.replace(/\n{2,}/g,"\n")+"\n(Arucip: verificar siempre las dosis)";
const ok=()=>{b.textContent="Copiado";setTimeout(()=>b.textContent="Copiar dosis",1500)};
try{navigator.clipboard.writeText(tx).then(ok,()=>{const a=document.createElement("textarea");a.value=tx;document.body.appendChild(a);a.select();try{document.execCommand("copy");ok()}catch(x){}a.remove()})}catch(x){const a=document.createElement("textarea");a.value=tx;document.body.appendChild(a);a.select();try{document.execCommand("copy");ok()}catch(y){}a.remove()}});;
})();
