const CACHE="evolui-v6";
const FILES=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./apple-touch-icon.png","./config.js","./privacidade.html","./dayia-simbolo.png","./dayia-logo.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const url=new URL(e.request.url);
  const guardar=res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return res};
  if(url.origin===location.origin){
    // Internet primeiro (pega atualizações), cache se estiver offline
    e.respondWith(fetch(e.request).then(guardar).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));
  }else if(url.hostname.endsWith("gstatic.com")||url.hostname.endsWith("googleapis.com")){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(guardar)));
  }
});
