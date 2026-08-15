(()=>{
  'use strict';
  if(window.__MCU_INSTAGRAM_LINK_1618__)return;
  window.__MCU_INSTAGRAM_LINK_1618__=true;

  const INSTAGRAM_URL='https://www.instagram.com/mcutrackerultimate/';

  function ensureStyle(){
    if(document.getElementById('mcuInstagramLinkStyle'))return;
    const style=document.createElement('style');
    style.id='mcuInstagramLinkStyle';
    style.textContent=`
      #mcuInstagramLink{
        display:block;width:100%;text-align:left;margin:4px 0;padding:9px 12px;
        border-radius:8px;background:rgba(23,24,29,.86);border:1px solid #303030;
        color:#fff;text-decoration:none;font-weight:700;cursor:pointer;transition:.15s;
      }
      #mcuInstagramLink:hover{
        border-color:var(--accent,#d00000);background:rgba(var(--accent-rgb,208,0,0),.10);
        transform:translateY(-1px);
      }
    `;
    document.head.appendChild(style);
  }

  function ensureLink(){
    const menu=document.getElementById('sideMenu');
    if(!menu||document.getElementById('mcuInstagramLink'))return;
    ensureStyle();
    const link=document.createElement('a');
    link.id='mcuInstagramLink';
    link.href=INSTAGRAM_URL;
    link.target='_blank';
    link.rel='noopener noreferrer';
    link.textContent='📸 Instagram • @mcutrackerultimate';
    link.setAttribute('aria-label','MCU Tracker Ultimate Instagram hesabını aç');
    const info=menu.querySelector('.category-info');
    if(info)menu.insertBefore(link,info);else menu.appendChild(link);
  }

  ensureLink();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureLink,{once:true});
  const observer=new MutationObserver(ensureLink);
  observer.observe(document.documentElement,{childList:true,subtree:true});
})();