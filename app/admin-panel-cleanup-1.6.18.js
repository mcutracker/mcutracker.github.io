(()=>{
'use strict';
if(window.__MCU_ADMIN_PANEL_CLEANUP_1618__)return;
window.__MCU_ADMIN_PANEL_CLEANUP_1618__=true;

function ensureStyle(){
  if(document.getElementById('mcuAdminCleanupStyle1618'))return;
  const style=document.createElement('style');
  style.id='mcuAdminCleanupStyle1618';
  style.textContent='#mcuDemoPasswordResetBtn{display:none!important}';
  (document.head||document.documentElement).appendChild(style);
}

function clean(){
  try{
    ensureStyle();
    document.getElementById('mcuDemoPasswordResetBtn')?.remove();
    document.querySelectorAll('#movieList section.panel').forEach(panel=>{
      const title=(panel.querySelector('h3')?.textContent||'').trim();
      if(title==='Tek Hesap Sistemi')panel.remove();
    });
  }catch{}
}

clean();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',clean,{once:true});
const observer=new MutationObserver(clean);
observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('focus',clean,{passive:true});
setTimeout(clean,300);
setTimeout(clean,1200);
})();