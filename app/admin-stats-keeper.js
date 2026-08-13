(()=>{
  'use strict';
  if(window.__MCU_ADMIN_STATS_KEEPER__)return;
  window.__MCU_ADMIN_STATS_KEEPER__=true;

  const URL='https://svnrfyqloiludzvnylyp.supabase.co/functions/v1/mcu-telemetry';
  let timer=0;
  let cache=null;
  let cacheAt=0;
  const fmt=v=>Number(v||0).toLocaleString('tr-TR');

  function active(){return (document.getElementById('subtitle')?.textContent||'').trim()==='ADMIN MERKEZİ'}
  function count(){
    const s=document.querySelector('#movieList .profile-hero .meta')?.textContent||'';
    const m=s.match(/Toplam hesap:\s*([0-9.]+)/i);
    return m?Number(m[1].replace(/\./g,''))||0:0;
  }
  async function totals(){
    if(cache&&Date.now()-cacheAt<30000)return cache;
    try{
      const r=await fetch(URL+'?t='+Date.now(),{cache:'no-store'});
      const j=await r.json();
      if(j?.ok){cache=j.totals||{};cacheAt=Date.now();return cache}
    }catch{}
    return cache||{};
  }
  async function keep(){
    if(!active())return;
    const host=document.getElementById('movieList');
    if(!host||document.getElementById('mcuCloudUsageStats'))return;
    const card=document.createElement('section');
    card.id='mcuCloudUsageStats';
    card.className='panel';
    const hero=host.querySelector('.profile-hero');
    if(hero?.nextSibling)host.insertBefore(card,hero.nextSibling);else host.prepend(card);
    card.innerHTML='<h3 style="margin-top:0">📈 Canlı Kullanım / Rating</h3><p class="meta">Toplam hesap ve anonim kullanım sayaçları.</p><div class="metric-grid"><div class="metric-card"><b>'+fmt(count())+'</b><small>Toplam hesap</small></div><div class="metric-card"><b>…</b><small>Uygulama açılışı</small></div><div class="metric-card"><b>…</b><small>Giriş</small></div><div class="metric-card"><b>…</b><small>Çıkış</small></div><div class="metric-card"><b>…</b><small>Kayıt</small></div></div>';
    const t=await totals();
    if(!active()||!card.isConnected)return;
    card.innerHTML='<h3 style="margin-top:0">📈 Canlı Kullanım / Rating</h3><p class="meta">Toplam hesap ve anonim kullanım sayaçları.</p><div class="metric-grid"><div class="metric-card"><b>'+fmt(count())+'</b><small>Toplam hesap</small></div><div class="metric-card"><b>'+fmt(t.app_open)+'</b><small>Uygulama açılışı</small></div><div class="metric-card"><b>'+fmt(t.login)+'</b><small>Giriş</small></div><div class="metric-card"><b>'+fmt(t.logout)+'</b><small>Çıkış</small></div><div class="metric-card"><b>'+fmt(t.register)+'</b><small>Kayıt</small></div></div><div class="meta">Canlı sayaçlar güncel.</div>';
  }
  function queue(){clearTimeout(timer);timer=setTimeout(keep,100)}
  function watch(){
    const host=document.getElementById('movieList');
    if(!host||host.dataset.mcuStatsKeeper)return;
    host.dataset.mcuStatsKeeper='1';
    new MutationObserver(()=>{if(active()&&!document.getElementById('mcuCloudUsageStats'))queue()}).observe(host,{childList:true});
  }
  document.addEventListener('click',e=>{if(e.target instanceof Element&&e.target.closest('#adminMenuBtn')){watch();setTimeout(queue,200);setTimeout(queue,700);setTimeout(queue,1400)}},true);
  window.addEventListener('focus',()=>{watch();queue()},{passive:true});
  watch();setTimeout(()=>{watch();queue()},900);
})();