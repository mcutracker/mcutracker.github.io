(()=>{
  'use strict';
  if(window.__MCU_ADMIN_USAGE_STATS__)return;
  window.__MCU_ADMIN_USAGE_STATS__=true;

  const STATS_URL='https://svnrfyqloiludzvnylyp.supabase.co/functions/v1/mcu-telemetry';
  let loading=false;
  let lastLoad=0;

  const fmt=v=>Number(v||0).toLocaleString('tr-TR');

  function isAdminCenter(){
    return (document.getElementById('subtitle')?.textContent||'').trim()==='ADMIN MERKEZİ' && !!document.getElementById('movieList');
  }

  function accountCount(){
    const text=document.querySelector('#movieList .profile-hero .meta')?.textContent||'';
    const m=text.match(/Toplam hesap:\s*([0-9.]+)/i);
    return m?Number(m[1].replace(/\./g,''))||0:0;
  }

  async function loadStats(){
    try{
      const r=await fetch(STATS_URL+'?t='+Date.now(),{cache:'no-store'});
      if(!r.ok)throw new Error('HTTP '+r.status);
      const j=await r.json();
      if(!j?.ok)throw new Error(j?.error||'stats_error');
      return j;
    }catch{return{ok:false,totals:{}}}
  }

  async function inject(force=false){
    if(!isAdminCenter())return;
    const now=Date.now();
    if(loading||(!force&&now-lastLoad<3000))return;
    loading=true;lastLoad=now;
    try{
      const host=document.getElementById('movieList');
      if(!host)return;
      let card=document.getElementById('mcuCloudUsageStats');
      if(!card){
        card=document.createElement('section');
        card.id='mcuCloudUsageStats';
        card.className='panel';
        const hero=host.querySelector('.profile-hero');
        if(hero?.nextSibling)host.insertBefore(card,hero.nextSibling);else host.prepend(card);
      }
      const accounts=accountCount();
      card.innerHTML=`<h3 style="margin-top:0">📈 Canlı Kullanım / Rating</h3><p class="meta">Toplam hesap ve anonim kullanım sayaçları.</p><div class="metric-grid" id="mcuUsageGrid"><div class="metric-card"><b>${fmt(accounts)}</b><small>Toplam hesap</small></div><div class="metric-card"><b>…</b><small>Uygulama açılışı</small></div><div class="metric-card"><b>…</b><small>Giriş</small></div><div class="metric-card"><b>…</b><small>Çıkış</small></div><div class="metric-card"><b>…</b><small>Kayıt</small></div></div><div class="meta" id="mcuUsageStatus">Canlı sayaçlar yükleniyor…</div>`;

      const j=await loadStats();
      if(!isAdminCenter())return;
      const grid=document.getElementById('mcuUsageGrid'),status=document.getElementById('mcuUsageStatus');
      if(!grid)return;
      if(!j?.ok){
        grid.innerHTML=`<div class="metric-card"><b>${fmt(accounts)}</b><small>Toplam hesap</small></div><div class="metric-card"><b>—</b><small>Sayaç servisi</small></div>`;
        if(status)status.textContent='Hesap sayısı güncel; kullanım sayaçlarına şu an ulaşılamadı.';
        return;
      }
      const t=j.totals||{};
      grid.innerHTML=`<div class="metric-card"><b>${fmt(accounts)}</b><small>Toplam hesap</small></div><div class="metric-card"><b>${fmt(t.app_open)}</b><small>Uygulama açılışı</small></div><div class="metric-card"><b>${fmt(t.login)}</b><small>Giriş</small></div><div class="metric-card"><b>${fmt(t.logout)}</b><small>Çıkış</small></div><div class="metric-card"><b>${fmt(t.register)}</b><small>Kayıt</small></div>`;
      if(status)status.textContent='Canlı sayaçlar güncel.';
    }finally{loading=false;}
  }

  function schedule(){
    setTimeout(()=>inject(true),250);
    setTimeout(()=>inject(),800);
    setTimeout(()=>inject(),1600);
  }

  document.addEventListener('click',e=>{
    const target=e.target instanceof Element?e.target:null;
    if(target?.closest('#adminMenuBtn'))schedule();
  },true);
  window.addEventListener('focus',()=>inject(),{passive:true});
  setTimeout(()=>inject(true),1200);
})();