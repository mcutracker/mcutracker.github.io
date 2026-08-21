(()=>{
'use strict';
if(window.__MCU_DASHBOARD_PLAN1_1618__)return;
window.__MCU_DASHBOARD_PLAN1_1618__=true;

const SERIES_ALIAS={
  'Loki S1':['Loki',1],'Loki S2':['Loki',2],
  'WandaVision':['WandaVision',1],
  'The Falcon and the Winter Soldier':['The Falcon and the Winter Soldier',1],
  'Hawkeye':['Hawkeye',1],'Moon Knight':['Moon Knight',1],'Ms. Marvel':['Ms. Marvel',1],
  'She-Hulk':['She-Hulk: Attorney at Law',1],'She-Hulk: Attorney at Law':['She-Hulk: Attorney at Law',1],
  'Secret Invasion':['Secret Invasion',1],'Echo':['Echo',1],'Ironheart':['Ironheart',1],
  'Agatha All Along':['Agatha All Along',1],'Eyes of Wakanda':['Eyes of Wakanda',1],
  'Marvel Zombies':['Marvel Zombies',1],'Wonder Man':['Wonder Man',1],
  'Daredevil: Born Again S1':['Daredevil: Born Again',1],'Daredevil: Born Again S2':['Daredevil: Born Again',2],
  'What If...? S1':['What If...?',1],'What If...? S2':['What If...?',2],'What If...? S3':['What If...?',3],
  'I Am Groot S1':['I Am Groot',1],'I Am Groot S2':['I Am Groot',2]
};

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function movieWatched(t){try{return !!state?.watched?.['movie|'+t+'|']}catch{return false}}
function seasonWatched(t,s){try{return !!state?.watched?.['series|'+t+'|'+s]}catch{return false}}
function itemWatched(item){const m=SERIES_ALIAS[item?.t];return m?seasonWatched(m[0],m[1])||movieWatched(item.t):movieWatched(item?.t||'')}

function globalStats(){
  try{if(typeof achievementStats==='function')return achievementStats()}catch{}
  let done=0,seriesDone=0,all=0;
  try{done=(ALL_MOVIES||[]).filter(x=>movieWatched(x.t)).length;all+=(ALL_MOVIES||[]).length}catch{}
  try{(SERIES||[]).forEach(x=>{all+=Number(x.seasons||0);for(let i=1;i<=Number(x.seasons||0);i++)if(seasonWatched(x.t,i))seriesDone++})}catch{}
  return {done,seriesDone,totalDone:done+seriesDone,all};
}
function level(){try{return levelInfo()}catch{return {xp:0,level:1,rank:'S.H.I.E.L.D. Adayı',pct:0}}}
function stones(){try{return {done:unlockedStones().length,total:INFINITY_STONES.length}}catch{return {done:0,total:6}}}
function lastTrophy(){
  try{
    const entries=Object.entries(state?.unlockedAchievements||{}).filter(([,v])=>Number(v)>0).sort((a,b)=>Number(b[1])-Number(a[1]));
    if(!entries.length)return null;
    const a=(ACHIEVEMENTS||[]).find(x=>x.id===entries[0][0]);
    return a?{title:a.title,tier:a.tier}:null;
  }catch{return null}
}
function parseXPKey(k){
  const p=String(k||'').split('|');
  if(p[0]==='movie'&&p[1])return p[1];
  if(p[0]==='series'&&p[1])return p[1]+(p[2]?' • Sezon '+p[2]:'');
  return null;
}
function lastWatched(){
  try{if(state?.dashboardLastWatched?.title)return state.dashboardLastWatched.title}catch{}
  try{const keys=Object.keys(state?.earnedWatchXP||{});for(let i=keys.length-1;i>=0;i--){const t=parseXPKey(keys[i]);if(t)return t}}catch{}
  try{const keys=Object.keys(state?.watched||{}).filter(k=>state.watched[k]);for(let i=keys.length-1;i>=0;i--){const t=parseXPKey(keys[i]);if(t)return t}}catch{}
  return null;
}
function nextItem(){
  try{if(typeof currentCategory!=='undefined'&&currentCategory==='doomsday'&&Array.isArray(DATA?.doomsday)){const n=DATA.doomsday.find(x=>!itemWatched(x));if(n)return n.t}}catch{}
  const t=document.getElementById('nextTitle')?.textContent?.trim();return t&&t!=='—'?t:null;
}
function patchWatchSetters(){
  try{
    const movie=window.setMovieWatched;
    if(typeof movie==='function'&&!movie.__mcuDashLastWatch){
      const wrapped=function(item,value){const r=movie.apply(this,arguments);if(value&&item?.t){try{state.dashboardLastWatched={title:item.t,type:'movie',at:Date.now()}}catch{}}return r};
      wrapped.__mcuDashLastWatch=true;window.setMovieWatched=wrapped;
    }
    const series=window.setSeriesWatched;
    if(typeof series==='function'&&!series.__mcuDashLastWatch){
      const wrapped=function(show,season,value){const r=series.apply(this,arguments);if(value&&show?.t){try{state.dashboardLastWatched={title:show.t+' • Sezon '+season,type:'series',at:Date.now()}}catch{}}return r};
      wrapped.__mcuDashLastWatch=true;window.setSeriesWatched=wrapped;
    }
  }catch{}
}
function ensureStyle(){
  if(document.getElementById('mcuDashboardPlan1Style1618'))return;
  const s=document.createElement('style');s.id='mcuDashboardPlan1Style1618';s.textContent=`
  #mcuDashboardPlan1{margin:0 0 18px;display:grid;gap:12px}
  .mcu-dash-hero{background:linear-gradient(135deg,rgba(230,36,41,.14),rgba(10,12,18,.92) 48%,rgba(53,89,255,.10));border:1px solid rgba(255,255,255,.10);border-radius:18px;padding:18px;overflow:hidden;position:relative}
  .mcu-dash-hero:after{content:'PLAN 1';position:absolute;right:14px;top:12px;font-size:10px;font-weight:900;letter-spacing:2px;opacity:.28}
  .mcu-dash-kicker{font-size:11px;font-weight:900;letter-spacing:1.5px;color:#ff696d;text-transform:uppercase;margin-bottom:5px}
  .mcu-dash-title{font-size:24px;font-weight:950;letter-spacing:-.5px;margin-bottom:4px}.mcu-dash-sub{color:#aeb3bf;font-size:13px}
  .mcu-dash-progress-row{display:flex;align-items:end;justify-content:space-between;gap:15px;margin-top:17px}.mcu-dash-pct{font-size:34px;font-weight:950}.mcu-dash-pct small{font-size:13px;color:#aeb3bf;font-weight:800}
  .mcu-dash-bar{height:10px;background:rgba(255,255,255,.08);border-radius:99px;overflow:hidden;margin-top:8px}.mcu-dash-bar>i{display:block;height:100%;background:linear-gradient(90deg,#e62429,#ff6b70);border-radius:99px;box-shadow:0 0 18px rgba(230,36,41,.35)}
  .mcu-dash-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.mcu-dash-card{background:rgba(17,20,28,.9);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px;min-width:0}.mcu-dash-card b{display:block;font-size:21px;margin-top:6px}.mcu-dash-card small{color:#9fa5b2;font-weight:700}.mcu-dash-icon{font-size:18px}
  .mcu-dash-wide{display:grid;grid-template-columns:1fr 1fr;gap:10px}.mcu-dash-journey{background:rgba(17,20,28,.9);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px;min-width:0}.mcu-dash-journey .label{font-size:11px;color:#9fa5b2;font-weight:900;text-transform:uppercase;letter-spacing:.8px}.mcu-dash-journey .value{font-size:15px;font-weight:900;margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mcu-dash-journey .hint{font-size:11px;color:#747b89;margin-top:4px}
  .mcu-dash-stones{display:flex;gap:5px;margin-top:9px}.mcu-dash-stones i{width:17px;height:17px;border-radius:50%;display:block;border:2px solid rgba(255,255,255,.20);background:rgba(255,255,255,.04)}.mcu-dash-stones i.on{background:#e62429;border-color:#ff6b70;box-shadow:0 0 9px rgba(230,36,41,.42)}
  @media(max-width:760px){.mcu-dash-grid{grid-template-columns:1fr 1fr}.mcu-dash-wide{grid-template-columns:1fr}.mcu-dash-title{font-size:20px}}
  `;document.head.appendChild(s);
}
function render(){
  try{
    if(typeof currentCategory==='undefined'||currentCategory!=='doomsday'){document.getElementById('mcuDashboardPlan1')?.remove();return}
    const anchor=document.getElementById('progressText')?.closest('section')||document.getElementById('nextPanel');if(!anchor)return;
    ensureStyle();let host=document.getElementById('mcuDashboardPlan1');if(!host){host=document.createElement('section');host.id='mcuDashboardPlan1';anchor.parentNode.insertBefore(host,anchor)}
    const s=globalStats(),li=level(),st=stones(),trophy=lastTrophy(),last=lastWatched(),next=nextItem();const pct=s.all?Math.min(100,Math.round((s.totalDone/s.all)*100)):0;
    host.innerHTML=`<div class="mcu-dash-hero"><div class="mcu-dash-kicker">MCU Yolculuğun</div><div class="mcu-dash-title">Dashboard</div><div class="mcu-dash-sub">Tüm ilerlemeni tek bakışta gör.</div><div class="mcu-dash-progress-row"><div><div class="mcu-dash-pct">${pct}% <small>MCU tamamlandı</small></div></div><div style="text-align:right"><b>${s.totalDone} / ${s.all}</b><div class="mcu-dash-sub">toplam içerik</div></div></div><div class="mcu-dash-bar"><i style="width:${pct}%"></i></div></div><div class="mcu-dash-grid"><div class="mcu-dash-card"><span class="mcu-dash-icon">🎬</span><b>${s.done}</b><small>İzlenen Film</small></div><div class="mcu-dash-card"><span class="mcu-dash-icon">📺</span><b>${s.seriesDone}</b><small>İzlenen Sezon</small></div><div class="mcu-dash-card"><span class="mcu-dash-icon">⚡</span><b>${li.xp}</b><small>Toplam XP</small></div><div class="mcu-dash-card"><span class="mcu-dash-icon">🛡️</span><b>Seviye ${li.level}</b><small>${esc(li.rank)}</small></div></div><div class="mcu-dash-wide"><div class="mcu-dash-journey"><div class="label">🏆 Son Kazanılan Kupa</div><div class="value">${trophy?esc(trophy.title):'Henüz kupa yok'}</div><div class="hint">${trophy?esc(trophy.tier)+' kupa':'İlk başarımını açarak başla'}</div></div><div class="mcu-dash-journey"><div class="label">💎 Infinity Stones</div><div class="value">${st.done} / ${st.total} taş toplandı</div><div class="mcu-dash-stones">${Array.from({length:st.total},(_,i)=>`<i class="${i<st.done?'on':''}"></i>`).join('')}</div></div><div class="mcu-dash-journey"><div class="label">✅ Son İzlenen Yapım</div><div class="value">${esc(last||'Henüz kayıt yok')}</div><div class="hint">Son tamamlanan içeriğin</div></div><div class="mcu-dash-journey"><div class="label">▶ Sıradaki İzlenecek Yapım</div><div class="value">${esc(next||'Liste tamamlandı')}</div><div class="hint">Açık olan izleme listene göre</div></div></div>`;
  }catch{}
}
function patchProgress(){try{const original=window.updateProgress;if(typeof original!=='function'||original.__mcuDashP1)return;const wrapped=function(...args){const r=original.apply(this,args);setTimeout(render,0);return r};wrapped.__mcuDashP1=true;window.updateProgress=wrapped}catch{}}
function install(){patchWatchSetters();patchProgress();render()}
install();setTimeout(install,300);setTimeout(install,1000);document.addEventListener('click',()=>setTimeout(install,60),true);document.addEventListener('change',()=>setTimeout(install,80),true);window.addEventListener('focus',install,{passive:true});
})();