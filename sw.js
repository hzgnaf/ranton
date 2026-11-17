// Ranton app helper: lets Ranton be installed, opens instantly, and shows call alerts.
const C='ranton-v1794948621';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./icon.svg','./manifest.json'])).catch(()=>{}))});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request)));
});
// tapping an alert (or its Answer / Decline button) brings Ranton to the front
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const msg={type:'ranton-notif',action:e.action||'open',...(e.notification.data||{})};
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    const c=list[0];
    if(c){c.postMessage(msg);return c.focus?c.focus():null}
    return self.clients.openWindow('./');
  }));
});
