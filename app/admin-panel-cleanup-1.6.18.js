(()=>{
'use strict';
if(window.__MCU_ADMIN_PANEL_CLEANUP_1618__)return;
window.__MCU_ADMIN_PANEL_CLEANUP_1618__=true;

function clean(){
  try{
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
document.addEventListener('click',()=>setTimeout(clean,0),true);
window.addEventListener('focus',clean,{passive:true});
setTimeout(clean,300);
setTimeout(clean,1200);
})();