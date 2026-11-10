/* Cronómetro FR-FC (usa estado propio y tiempo real) */
(function(){
const T=window.ARU.T;
const N=v=>{const x=parseFloat(String(v).replace(",","."));return isFinite(x)?x:NaN};
const R=(v,d=2)=>isFinite(v)?(Math.round(v*10**d)/10**d).toString().replace(".",","):"—";
T.cron={t:"Cronómetro FR-FC",c:{html:`<p class="sub">¿Evaluás un paciente sin monitoreo? Apretá el botón, contá 6 o más respiraciones o latidos y volvé a apretar el mismo botón. Usalo también para controlar goteos, transfusiones, etc.</p>
<div class="card"><div class="calc"><div class="r"><span>Tiempo</span><b id="cr-t">0,0 s</b></div><button class="btn pri" id="cr-b">Iniciar</button><label class="f"><span>Latidos, respiraciones o gotas contadas</span><input id="cr-n" type="number" inputmode="numeric" value="6" min="1"></label><div class="r"><span>Frecuencia<small>por minuto</small></span><b id="cr-r">—</b></div><button class="btn g" id="cr-x">Reiniciar</button></div></div>`,
init(b){let t0=0,iv=0,el=0;const B=b.querySelector("#cr-b"),Tm=b.querySelector("#cr-t"),Rr=b.querySelector("#cr-r"),Nn=b.querySelector("#cr-n");
const calc=()=>{const c=N(Nn.value);Rr.textContent=el>0&&c>0?R(c*60/el,0):"—"};
B.onclick=()=>{if(!iv){t0=performance.now();el=0;Rr.textContent="—";iv=setInterval(()=>{el=(performance.now()-t0)/1000;Tm.textContent=R(el,1)+" s"},100);B.textContent="Detener"}else{clearInterval(iv);iv=0;el=(performance.now()-t0)/1000;Tm.textContent=R(el,1)+" s";B.textContent="Iniciar";calc()}};
Nn.oninput=calc;
b.querySelector("#cr-x").onclick=()=>{clearInterval(iv);iv=0;el=0;Tm.textContent="0,0 s";Rr.textContent="—";B.textContent="Iniciar"};
return()=>clearInterval(iv)}}};;
})();
