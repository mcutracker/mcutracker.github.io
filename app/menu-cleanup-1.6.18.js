(()=>{
  'use strict';
  if(window.__MCU_MENU_CLEANUP_1618__)return;
  window.__MCU_MENU_CLEANUP_1618__=true;

  const REMOVED=['mcu','chronological','release'];

  function clean(){
    try{
      REMOVED.forEach(cat=>{
        document.querySelectorAll(`.menu-category[data-cat="${cat}"]`).forEach(el=>el.remove());
      });
    }catch{}
  }

  clean();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',clean,{once:true});
  setTimeout(clean,250);
  setTimeout(clean,1000);
  document.addEventListener('click',()=>setTimeout(clean,0),true);
})();
