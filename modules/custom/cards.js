/* Cards de medicación por peso (visor) */
(function(){
const T=window.ARU.T;

(function(){const W=[5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 25, 30, 35, 40, 50, 60];let w=+(st.cw)||W[0],s=st.cs||"f";if(!W.includes(w))w=W[0];if(s!=="f"&&s!=="r")s="f";
const sel=$("#cwsel"),im=$("#cimg"),cz=$("#cz"),zi=$("#czi");
sel.innerHTML=W.map(x=>`<option value="${x}">${x} kg</option>`).join("");
const NM={f:"Paro y Status",r:"Analgosedación e infusiones"};
const nz=x=>x.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
function qh(){const q=nz(($("#cq")||{value:""}).value.trim());if(q.length<2)return"";const t=document.createElement("div"),out=[];
["f","r"].forEach(k=>{t.innerHTML=CARDS[w+k];t.querySelectorAll(".cd").forEach(d=>{if(nz(d.textContent).includes(q))out.push('<div class="cface">'+NM[k]+'</div>'+d.outerHTML)})});
return '<div class="ct"><div class="cth">PESO: '+w+' kg</div>'+(out.length?out.join(""):'<div class="cd"><div class="cdh"><b>Sin resultados</b><small>Probá con otro nombre o parte del nombre</small></div></div>')+'</div>'}
document.addEventListener("input",e=>{if(e.target.id==="cq")show()});
function show(){sel.value=w;document.querySelectorAll("#cside button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.s===s));
im.innerHTML=qh()||CARDS[w+s];im.setAttribute("aria-label","Tarjeta de medicación, peso "+w+" kg, "+NM[s]);im.hidden=false;st.cw=w;st.cs=s;save();
$("#cprev").disabled=W.indexOf(w)===0;$("#cnext").disabled=W.indexOf(w)===W.length-1;
}
sel.onchange=()=>{w=+sel.value;show()};
const step=d=>{const i=W.indexOf(w)+d;if(i>=0&&i<W.length){w=W[i];show()}};
$("#cprev").onclick=()=>step(-1);$("#cnext").onclick=()=>step(1);$("#czpv").onclick=()=>step(-1);$("#czn").onclick=()=>step(1);
$("#cside").onclick=e=>{const b=e.target.closest("button");if(!b)return;s=b.dataset.s;show()};
const ZL=[1,1.5,2.2,3,4,5];let z=2.2;
const zoom=()=>{zi.style.width=Math.round(Math.min(innerWidth,720)*z)+"px"};

$("#czp").onclick=()=>{const i=ZL.indexOf(z);if(i<ZL.length-1){z=ZL[i+1];zoom()}};
$("#czm").onclick=()=>{const i=ZL.indexOf(z);if(i>0){z=ZL[i-1];zoom()}};
$("#czf").onclick=()=>{z=1;zoom()};
const close=()=>{cz.hidden=true;document.body.style.overflow=""};
$("#czx").onclick=close;document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!cz.hidden)close()});
show()})();;
})();
