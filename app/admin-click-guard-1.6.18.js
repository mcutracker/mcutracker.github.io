(()=>{
  'use strict';
  if(window.__MCU_ADMIN_CLICK_GUARD_1618__)return;
  window.__MCU_ADMIN_CLICK_GUARD_1618__=true;

  function isAdminCenter(){
    return (document.getElementById('subtitle')?.textContent||'').trim().toLocaleUpperCase('tr-TR')==='ADMIN MERKEZİ';
  }

  function keepAdminState(){
    if(!isAdminCenter())return;
    try{if(typeof currentCategory!=='undefined')currentCategory='admin'}catch{}
    document.getElementById('mcuDashboardPlan1')?.remove();
  }

  function isInteractive(target){
    if(!(target instanceof Element))return false;
    // Yan menünün kendisi interaktif sayılmaz; yalnızca gerçek buton/link alanları çalışır.
    return !!target.closest('button,a,input,select,textarea,label,[role="button"],.menu-category,#hamburgerButton,#menuOverlay');
  }

  function guard(e){
    if(!isAdminCenter())return;
    keepAdminState();
    const target=e.target instanceof Element?e.target:null;
    if(!isInteractive(target)){
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }

  // Window capture, uygulamanın document seviyesindeki genel click handler'larından önce çalışır.
  window.addEventListener('click',guard,true);

  const observer=new MutationObserver(()=>keepAdminState());
  const start=()=>{
    observer.observe(document.body||document.documentElement,{childList:true,subtree:true,characterData:true});
    keepAdminState();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.addEventListener('focus',keepAdminState,{passive:true});
})();
