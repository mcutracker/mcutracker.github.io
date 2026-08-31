(()=>{
'use strict';
if(window.__MCU_ADMIN_GROWTH_STATS_1618__)return;
window.__MCU_ADMIN_GROWTH_STATS_1618__=true;

const ENDPOINT='https://svnrfyqloiludzvnylyp.supabase.co/functions/v1/mcu-admin';
const TOKEN_KEY='MCU_TRACKER_CLOUD_TOKEN_V1';
let loading=false,lastLoad=0,scheduleTimer=0;
const fmt=v=>Number(v||0).toLocaleString('tr-TR');
const pct=v=>Math.max(0,Math.min(100,Number(v||0)));

function isAdminCenter(){
  return (document.getElementById('subtitle')?.textContent||'').trim().toLocaleUpperCase('tr-TR')==='ADMIN MERKEZİ'&&!!document.getElementById('movieList');
}
async function fetchGrowth(){
  const token=localStorage.getItem(TOKEN_KEY)||'';
  if(!token)return{ok:false,error:'invalid_session'};
  try{
    const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'growth_stats',token}),cache:'no-store'});
    return await r.json().catch(()=>({ok:false,error:'bad_response'}));
  }catch{return{ok:false,error:'network_error'}}
}
function style(){
  if(document.getElementById('mcuGrowthStyle1618'))return;
  const s=document.createElement('style');s.id='mcuGrowthStyle1618';s.textContent=`
  #mcuGrowthStats1618 .growth-goals{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}
  #mcuGrowthStats1618 .growth-goal{padding:12px;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(255,255,255,.025)}
  #mcuGrowthStats1618 .growth-goal-head{display:flex;justify-content:space-between;gap:10px;font-weight:800;font-size:12px}
  #mcuGrowthStats1618 .growth-bar{height:7px;margin-top:8px;background:rgba(255,255,255,.08);border-radius:99px;overflow:hidden}
  #mcuGrowthStats1618 .growth-bar i{display:block;height:100%;background:linear-gradient(90deg,#e62429,#ff6b70);border-radius:99px}
  @media(max-width:700px){#mcuGrowthStats1618 .growth-goals{grid-template-columns:1fr}}
  `;(document.head||document.documentElement).appendChild(s);
}
function ensureCard(){
  const host=document.getElementById('movieList');if(!host)return null;
  let card=document.getElementById('mcuGrowthStats1618');
  if(card&&card.parentNode===host)return card;
  card?.remove();
  card=document.createElement('section');card.id='mcuGrowthStats1618';card.className='panel';
  const usage=document.getElementById('mcuCloudUsageStats')||document.querySelector('#movieList #mcuStats')?.closest('section')||document.querySelector('#movieList #adminOnlineStats')?.closest('section');
  if(usage?.nextSibling)host.insertBefore(card,usage.nextSibling);
  else{
    const hero=host.querySelector('.profile-hero');
    if(hero?.nextSibling)host.insertBefore(card,hero.nextSibling);else host.prepend(card);
  }
  return card;
}
async function inject(force=false){
  if(!isAdminCenter())return;
  const now=Date.now();if(loading||(!force&&now-lastLoad<4000))return;loading=true;lastLoad=now;
  try{
    style();let card=ensureCard();if(!card)return;
    card.innerHTML='<h3 style="margin-top:0">🚀 Büyüme Merkezi</h3><p class="meta">Gerçek kullanıcı, aktivasyon ve son 7 günlük kullanım metrikleri yükleniyor…</p>';
    const j=await fetchGrowth();if(!isAdminCenter())return;
    card=ensureCard();if(!card)return;
    if(!j?.ok){card.innerHTML='<h3 style="margin-top:0">🚀 Büyüme Merkezi</h3><p class="meta">Büyüme metrikleri şu an alınamadı. Admin oturumunu yenileyip tekrar dene.</p>';return}
    const s=j.stats||{};
    card.innerHTML=`<h3 style="margin-top:0">🚀 Büyüme Merkezi</h3><p class="meta">Demo ve Ana Admin hariç toplu ürün metrikleri. Kişisel kullanıcı verisi gösterilmez.</p><div class="metric-grid"><div class="metric-card"><b>${fmt(s.realUsers)}</b><small>Gerçek kullanıcı</small></div><div class="metric-card"><b>${fmt(s.new7d)}</b><small>Son 7 gün yeni</small></div><div class="metric-card"><b>${fmt(s.activatedUsers)}</b><small>1+ içerik işaretleyen</small></div><div class="metric-card"><b>%${fmt(s.activationRate)}</b><small>Aktivasyon oranı</small></div><div class="metric-card"><b>${fmt(s.engaged10Users)}</b><small>10+ içerik tamamlayan</small></div><div class="metric-card"><b>${fmt(s.progress7d)}</b><small>7 günde ilerleme kaydeden</small></div><div class="metric-card"><b>${fmt(s.login7d)}</b><small>7 günde giriş yapan</small></div><div class="metric-card"><b>${fmt(s.avgCompleted)}</b><small>Kişi başı ort. tamamlanan</small></div></div><div class="growth-goals"><div class="growth-goal"><div class="growth-goal-head"><span>🎯 İlk hedef: 50 kullanıcı</span><span>${fmt(s.realUsers)} / 50</span></div><div class="growth-bar"><i style="width:${pct(s.goal50Pct)}%"></i></div></div><div class="growth-goal"><div class="growth-goal-head"><span>🏁 Sonraki hedef: 100 kullanıcı</span><span>${fmt(s.realUsers)} / 100</span></div><div class="growth-bar"><i style="width:${pct(s.goal100Pct)}%"></i></div></div></div><div class="meta" style="margin-top:10px">Son 30 günde giriş yapan gerçek hesap: ${fmt(s.login30d)} • Son 30 gün yeni hesap: ${fmt(s.new30d)} • Toplam tamamlanma işareti: ${fmt(s.totalCompleted)}</div>`;
  }finally{loading=false}
}
function schedule(force=false,delay=120){
  clearTimeout(scheduleTimer);
  scheduleTimer=setTimeout(()=>inject(force),delay);
}
function observeAdminRenders(){
  const target=document.body||document.documentElement;if(!target)return;
  const observer=new MutationObserver(()=>{if(isAdminCenter())schedule(false,120)});
  observer.observe(target,{childList:true,subtree:true,characterData:true});
}

document.addEventListener('click',()=>{setTimeout(()=>{if(isAdminCenter())schedule(true,0)},80)},true);
window.addEventListener('focus',()=>schedule(true,0),{passive:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{observeAdminRenders();schedule(true,300)},{once:true});
else{observeAdminRenders();schedule(true,300)}
setTimeout(()=>schedule(true,0),1200);
setTimeout(()=>schedule(true,0),2600);
})();