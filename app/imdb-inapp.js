(()=>{
  'use strict';
  function removeIMDbExternalLink(){
    const modal=document.getElementById('modal');
    if(!modal)return;
    [...modal.querySelectorAll('button')].forEach(btn=>{
      if((btn.textContent||'').trim()==='IMDb Sayfası')btn.remove();
    });
  }

  function ensureAdminStatsKeeper(){
    if(window.__MCU_ADMIN_STATS_KEEPER__||document.getElementById('mcuAdminStatsKeeperLoader'))return;
    const s=document.createElement('script');
    s.id='mcuAdminStatsKeeperLoader';
    s.src='https://mcutracker.github.io/app/admin-stats-keeper.js?t='+Date.now();
    s.async=true;
    s.onerror=()=>s.remove();
    document.head.appendChild(s);
  }

  function install(){
    try{
      const original=window.openDetail;
      if(typeof original==='function'&&!original.__mcuIMDbInApp){
        const wrapped=function(...args){
          const result=original.apply(this,args);
          removeIMDbExternalLink();
          return result;
        };
        wrapped.__mcuIMDbInApp=true;
        window.openDetail=wrapped;
      }
    }catch{}
    ensureAdminStatsKeeper();
    setTimeout(ensureAdminStatsKeeper,700);
    document.addEventListener('click',e=>{
      if(e.target?.closest?.('.detail-btn'))setTimeout(removeIMDbExternalLink,0);
      if(e.target?.closest?.('#adminMenuBtn'))setTimeout(ensureAdminStatsKeeper,0);
    },true);
    window.addEventListener('focus',ensureAdminStatsKeeper,{passive:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
