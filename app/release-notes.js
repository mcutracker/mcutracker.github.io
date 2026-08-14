(()=>{
  'use strict';
  if(window.__MCU_RELEASE_NOTES_LOADED__)return;
  window.__MCU_RELEASE_NOTES_LOADED__=true;
  const VERSION='1.6.18';
  const CHANGELOG_URL='https://mcutracker.github.io/app/changelog.json';
  const SESSION_KEY='MCU_TRACKER_SESSION_V1';
  const SEEN_KEY='MCU_TRACKER_CHANGELOG_SEEN_VERSION';
  let cached=null;
  let cachedAdminStats='';

  const publicText=v=>String(v??'').replace(/\bovztur\b/gi,'Ana Admin');
  const esc=v=>publicText(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  async function loadNotes(){
    if(cached)return cached;
    try{
      const r=await fetch(CHANGELOG_URL+'?v='+encodeURIComponent(VERSION)+'&t='+Date.now(),{cache:'no-store'});
      if(!r.ok)throw new Error('HTTP '+r.status);
      cached=await r.json();
      return cached;
    }catch{
      return {latest:VERSION,entries:[{version:VERSION,date:'2026-08-14',title:'Yama Notları',items:['Yama notları şu anda çevrimdışı. İnternet bağlantısı geldiğinde bu sekmeyi yeniden açabilirsin.']}]} ;
    }
  }

  function ensureAdminUsageStats(){
    if(window.__MCU_ADMIN_USAGE_STATS__||document.getElementById('mcuAdminUsageStatsLoader'))return;
    const s=document.createElement('script');
    s.id='mcuAdminUsageStatsLoader';
    s.src='https://mcutracker.github.io/app/admin-usage-stats.js?t='+Date.now();
    s.async=true;
    s.onerror=()=>s.remove();
    document.head.appendChild(s);
  }

  function adminCenterOpen(){
    return (document.getElementById('subtitle')?.textContent||'').trim()==='ADMIN MERKEZİ';
  }

  function keepAdminStatsVisible(){
    if(!adminCenterOpen())return;
    const host=document.getElementById('movieList');
    if(!host)return;
    const live=document.getElementById('mcuCloudUsageStats');
    if(live){cachedAdminStats=live.outerHTML;return;}
    if(!cachedAdminStats)return;
    const hero=host.querySelector('.profile-hero');
    if(hero?.nextSibling)hero.insertAdjacentHTML('afterend',cachedAdminStats);else host.insertAdjacentHTML('afterbegin',cachedAdminStats);
  }

  function scheduleAdminStatsKeep(){
    [350,800,1500,2800,4500,7000].forEach(ms=>setTimeout(keepAdminStatsVisible,ms));
  }

  function ensureButton(){
    let btn=document.getElementById('mcuReleaseNotesBtn');
    if(btn){btn.textContent='📋 Yama Notları';return btn;}
    const side=document.getElementById('sideMenu');
    if(!side)return null;
    btn=document.createElement('button');
    btn.id='mcuReleaseNotesBtn';
    btn.className='menu-category';
    btn.type='button';
    btn.dataset.cat='updates';
    btn.textContent='📋 Yama Notları';
    const settings=side.querySelector('[data-cat="settings"]');
    if(settings)side.insertBefore(btn,settings);else{
      const admin=document.getElementById('adminMenuBtn');
      if(admin)side.insertBefore(btn,admin);else side.appendChild(btn);
    }
    btn.addEventListener('click',e=>{
      e.preventDefault();
      e.stopPropagation();
      renderNotes(true);
      const menu=document.getElementById('sideMenu'),overlay=document.getElementById('menuOverlay');
      if(menu?.classList.contains('open')){menu.classList.remove('open');overlay?.classList.remove('open')}
    },true);
    return btn;
  }

  async function renderNotes(markSeen=false){
    const host=document.getElementById('movieList');
    if(!host)return;
    const data=await loadNotes();
    const entries=Array.isArray(data?.entries)?data.entries:[];
    document.querySelectorAll('.menu-category').forEach(b=>b.classList.toggle('active',b.id==='mcuReleaseNotesBtn'));
    const subtitle=document.getElementById('subtitle');if(subtitle)subtitle.textContent='YAMA NOTLARI';
    const latest=data?.latest||VERSION;
    host.innerHTML=`<section class="profile-hero" style="grid-template-columns:72px 1fr"><div class="profile-avatar">📋</div><div><div class="profile-name">Yama Notları</div><div class="profile-rank">MCU Tracker Ultimate • v${esc(latest)}</div><p class="meta" style="margin:8px 0 0">Uygulamaya eklenen özellikler, düzeltmeler ve bakım notları.</p></div></section>${entries.map((entry,i)=>`<section class="panel" style="border:${i===0?'1px solid rgba(255,255,255,.18)':''}"><div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap"><div><h3 style="margin:0 0 4px">v${esc(entry.version)} • ${esc(entry.title||'Yama')}</h3><div class="meta">${esc(entry.date||'')}</div></div>${i===0?'<span class="role-badge admin">YENİ</span>':''}</div><div style="margin-top:14px;display:grid;gap:9px">${(entry.items||[]).map(x=>`<div style="display:flex;gap:9px;align-items:flex-start"><span>•</span><span>${esc(x)}</span></div>`).join('')}</div></section>`).join('')||'<section class="panel"><p class="meta">Henüz yama notu bulunmuyor.</p></section>'}`;
    document.getElementById('loadMore')?.classList.add('hidden');
    if(markSeen||localStorage.getItem(SEEN_KEY)!==latest){try{localStorage.setItem(SEEN_KEY,latest)}catch{}}
  }

  async function maybeAutoOpen(){
    ensureButton();
    if(!localStorage.getItem(SESSION_KEY))return;
    const data=await loadNotes();
    const latest=data?.latest||VERSION;
    let seen='';try{seen=localStorage.getItem(SEEN_KEY)||''}catch{}
    if(seen===latest)return;
    renderNotes(true);
  }

  function install(){
    ensureButton();
    ensureAdminUsageStats();
    setTimeout(maybeAutoOpen,800);
    setTimeout(maybeAutoOpen,2200);
    setTimeout(ensureAdminUsageStats,500);
    document.addEventListener('click',e=>{
      setTimeout(()=>{ensureButton();ensureAdminUsageStats();maybeAutoOpen();keepAdminStatsVisible()},0);
      const target=e.target instanceof Element?e.target:null;
      if(target?.closest('#adminMenuBtn')||adminCenterOpen())scheduleAdminStatsKeep();
    },true);
    window.addEventListener('focus',()=>{ensureButton();ensureAdminUsageStats();keepAdminStatsVisible();scheduleAdminStatsKeep()},{passive:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();