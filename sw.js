/* Arucip · service worker (funcionamiento sin conexión)
 * Estrategia: RED PRIMERO. El caché es solo respaldo sin conexión.
 * - Con conexión revalida contra el servidor (cache:'no-cache').
 * - Si la red tarda más de TIMEOUT_MS o falla, responde con la copia guardada.
 * - Cambiar CACHE solo hace falta si se quitan archivos; ASSETS se genera al compilar. */
var CACHE="arucip2";
var TIMEOUT_MS=4000;
var ASSETS=["./","app.js","data/cards.json","data/formulas.json","data/hubs.json","data/noimg.json","data/sinonimos.json","data/tablas.json","fonts/f-868f80018e.woff","fonts/f-8c2d651deb.woff","fonts/f-9bf08347d1.woff","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","icons/icon-maskable-640.png","images/arucip-mark-alt.svg","images/arucip-mark.svg","images/emblem-ar-ucip.png","images/emblem.svg","images/favicon-64.png","images/fundacion-garrahan.png","images/icon-349.png","images/icon-brand-a-512.png","images/icon-maskable-640.png","images/img-02a4e22e96.jpg","images/img-04dcca897a.jpg","images/img-06406d6488.jpg","images/img-107350d2db.jpg","images/img-228aadff3e.jpg","images/img-23007e0c75.jpg","images/img-397a3b4edc.jpg","images/img-3ab8b387d2.jpg","images/img-5137b7be3d.jpg","images/img-56e0803322.jpg","images/img-5bcaf219a0.jpg","images/img-65ca6a13dc.jpg","images/img-66c10fc687.jpg","images/img-67b3e2909a.jpg","images/img-6d1b6d0578.jpg","images/img-6de504a92f.png","images/img-6e8f1ca7e4.jpg","images/img-6f16bd9145.jpg","images/img-70e38d208f.jpg","images/img-72a6fa9f23.jpg","images/img-75b89048e4.jpg","images/img-787e8db1e5.jpg","images/img-7b3a40b2d9.jpg","images/img-83798c0a3a.jpg","images/img-8a9b3686c7.jpg","images/img-8b6a485294.jpg","images/img-8fd7c68ca4.jpg","images/img-9042521b6d.jpg","images/img-91c5f7ce43.jpg","images/img-93850766d6.jpg","images/img-ad5cf8cff2.jpg","images/img-b84e45be5a.jpg","images/img-bcb5872840.jpg","images/img-bd90a48b44.jpg","images/img-c619e030f6.png","images/img-cd05f362f4.jpg","images/img-d0201d527a.jpg","images/img-d1f0a37dea.jpg","images/img-d2d73cf4f6.jpg","images/img-d8580efe19.jpg","images/img-de47759360.jpg","images/img-e73a48326b.jpg","images/img-edcbae2d55.jpg","images/img-f0498962c7.jpg","images/img-f37ff5d807.jpg","images/logo-emblem-dark.png","images/logo-emblem-light.png","images/logo-wordmark-dark.png","images/logo-wordmark-light.png","images/qr-app.svg","images/staff-wordmark-orig-dark.png","images/staff-wordmark-orig-light.png","images/wordmark-dark.png","images/wordmark-light.png","index.html","modules/custom/calculadoras.js","modules/custom/cards.js","modules/custom/cronometro.js","modules/custom/dosis.js","modules/custom/otros.js","modules/custom/paro.js","modules/custom/pocus.js","modules/custom/quemados.js","modules/index.json","modules/packs/aclasificar.json","modules/packs/autocuidado.json","modules/packs/cardiov_ecmo.json","modules/packs/checklists.json","modules/packs/emergencia.json","modules/packs/endocrino_metab.json","modules/packs/farmaco_toxico.json","modules/packs/hemato_onco.json","modules/packs/hen_renal.json","modules/packs/ia.json","modules/packs/multisistemico.json","modules/packs/neuro.json","modules/packs/paliat_findevida.json","modules/packs/procedimientos_invasivos.json","modules/packs/respirat.json","modules/packs/segur_calidad.json","modules/packs/traslado.json","modules/packs/trau_quem.json","modules/tags.json","modules/tips.json","motor.js","styles.css"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    return Promise.all(ASSETS.map(function(u){return c.add(new Request(u,{cache:"reload"})).catch(function(){})}));
  }).then(function(){return self.skipWaiting()}));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}));
  }).then(function(){return self.clients.claim()}));
});
function fromCache(req){
  return caches.match(req,{ignoreSearch:true}).then(function(hit){
    return hit||(req.mode==="navigate"?caches.match("index.html"):undefined)});
}
function networkFirst(e){
  var req=e.request,network=fetch(req,{cache:"no-cache"});
  e.waitUntil(network.then(function(res){
    if(!res.ok)return;var copy=res.clone();
    return caches.open(CACHE).then(function(c){return c.put(req,copy)});
  }).catch(function(){}));
  return new Promise(function(resolve){
    var done=false;function finish(r){if(!done){done=true;resolve(r)}}
    var t=setTimeout(function(){fromCache(req).then(function(h){if(h)finish(h)})},TIMEOUT_MS);
    network.then(function(res){clearTimeout(t);if(res.ok)finish(res);else fromCache(req).then(function(h){finish(h||res)})})
      .catch(function(){clearTimeout(t);fromCache(req).then(function(h){finish(h||Response.error())})});
  });
}
self.addEventListener("fetch",function(e){
  var r=e.request;
  if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
  e.respondWith(networkFirst(e));
});
