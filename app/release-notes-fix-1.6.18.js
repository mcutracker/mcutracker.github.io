(()=>{
  'use strict';
  if(window.__MCU_RELEASE_NOTES_FIX_1618__)return;
  window.__MCU_RELEASE_NOTES_FIX_1618__=true;

  const VERSION='1.6.18';
  const CHANGELOG_URL='https://mcutracker.github.io/app/changelog.json';
  const SEEN_KEY='MCU_TRACKER_CHANGELOG_SEEN_VERSION';
  const publicText=v=>String(v??'').replace(/\bovztur\b/gi,'Ana Admin');
  const esc=v=>publicText(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function setUpdatesCategory(){
    try{if(typeof currentCategory!=='undefined')currentCategory='updates';}catch{}
  }

  function closeMenu(){
    document.getElementById('sideMenu')?.classList.remove('open');
    document.getElementById('menuOverlay')?.classList.remove('open');
  }

  function ensureButton(){
    let btn=document.getElementById('mcuReleaseNotesBtn');
    if(btn){
      btn.textContent='📋 Yama Notları';
      btn.dataset.cat='updates';
      return btn;
    }
    const side=document.getElementById('sideMenu');
    if(!side)return null;
    btn=document.createElement('button');
    btn.id='mcuReleaseNotesBtn';
    btn.className='menu-category';
    btn.type='button';
    btn.dataset.cat='updates';
    btn.textContent='📋 Yama Notları';
    const settings=side.querySelector('[data-cat="settings"]');
    if(settings)side.insertBefore(btn,settings);else side.appendChild(btn);
    return btn;
  }

  async function renderNotes(markSeen=true){
    setUpdatesCategory();
    const host=document.getElementById('movieList');
    if(!host)return;
    const subtitle=document.getElementById('subtitle');
    if(subtitle)subtitle.textContent='YAMA NOTLARI';
    document.querySelectorAll('.menu-category').forEach(b=>b.classList.toggle('active',b.id==='mcuReleaseNotesBtn'));
    document.getElementById('loadMore')?.classList.add('hidden');
    host.innerHTML='<section class="panel"><p class="meta">Yama notları yükleniyor…</p></section>';

    let data;
    try{
      const r=await fetch(CHANGELOG_URL+'?v='+encodeURIComponent(VERSION)+'&t='+Date.now(),{cache:'no-store'});
      if(!r.ok)throw new Error('HTTP '+r.status);
      data=await r.json();
    }catch{
      data={latest:VERSION,entries:[{version:VERSION,date:'2026-08-16',title:'Yama Notları',items:['Yama notları şu anda yüklenemedi. İnternet bağlantısını kontrol edip sekmeyi yeniden aç.']}]};
    }

    setUpdatesCategory();
    const entries=Array.isArray(data?.entries)?data.entries:[];
    const latest=data?.latest||VERSION;
    host.innerHTML=`<section class="profile-hero" style="grid-template-columns:72px 1fr"><div class="profile-avatar">📋</div><div><div class="profile-name">Yama Notları</div><div class="profile-rank">MCU Tracker Ultimate • v${esc(latest)}</div><p class="meta" style="margin:8px 0 0">Uygulamaya eklenen özellikler, düzeltmeler ve bakım notları.</p></div></section>${entries.map((entry,i)=>`<section class="panel" style="border:${i===0?'1px solid rgba(255,255,255,.18)':''}"><div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap"><div><h3 style="margin:0 0 4px">v${esc(entry.version)} • ${esc(entry.title||'Yama')}</h3><div class="meta">${esc(entry.date||'')}</div></div>${i===0?'<span class="role-badge admin">YENİ</span>':''}</div><div style="margin-top:14px;display:grid;gap:9px">${(entry.items||[]).map(x=>`<div style="display:flex;gap:9px;align-items:flex-start"><span>•</span><span>${esc(x)}</span></div>`).join('')}</div></section>`).join('')||'<section class="panel"><p class="meta">Henüz yama notu bulunmuyor.</p></section>'}`;
    if(markSeen){try{localStorage.setItem(SEEN_KEY,latest)}catch{}}
  }

  document.addEventListener('click',e=>{
    const target=e.target instanceof Element?e.target.closest('#mcuReleaseNotesBtn'):null;
    if(!target)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    setUpdatesCategory();
    closeMenu();
    renderNotes(true);
  },true);

  function install(){
    ensureButton();
    if((document.getElementById('subtitle')?.textContent||'').trim()==='YAMA NOTLARI')setUpdatesCategory();
  }
  install();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  setTimeout(install,250);
  setTimeout(install,1200);
})();
