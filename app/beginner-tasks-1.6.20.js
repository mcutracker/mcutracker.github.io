(()=>{
'use strict';
if(window.__MCU_BEGINNER_TASKS_1620__)return;
window.__MCU_BEGINNER_TASKS_1620__=true;

const REWARD_XP=25;
const TASKS=[
  {id:'first-watch',icon:'🎬',title:'İlk içeriğini tamamla',desc:'Bir film veya sezonu izledim olarak işaretle.',test:()=>countTrue(state?.watched)>0},
  {id:'first-favorite',icon:'⭐',title:'İlk favorini ekle',desc:'Sevdiğin bir yapımı favorilerine ekle.',test:()=>countTrue(state?.favorites)>0},
  {id:'first-rating',icon:'✦',title:'İlk puanını ver',desc:'Bir filme 1–10 arasında kişisel puan ver.',test:()=>Object.values(state?.personalRatings||{}).some(v=>Number(v)>=1)},
  {id:'first-trophy',icon:'🏆',title:'İlk kupanı kazan',desc:'İlerleyerek ilk başarım kupanı aç.',test:()=>Object.keys(state?.unlockedAchievements||{}).length>0}
];

function countTrue(obj){try{return Object.values(obj||{}).filter(Boolean).length}catch{return 0}}
function isDoomsday(){try{return typeof currentCategory!=='undefined'&&currentCategory==='doomsday'}catch{return false}}
function isAdmin(){const s=(document.getElementById('subtitle')?.textContent||'').trim().toLocaleUpperCase('tr-TR');return s==='ADMIN MERKEZİ'||s==='ORTAK ADMIN MERKEZİ'}
function rewards(){try{state.beginnerTaskRewards=state?.beginnerTaskRewards&&typeof state.beginnerTaskRewards==='object'?state.beginnerTaskRewards:{};return state.beginnerTaskRewards}catch{return {}}}
function claimed(id){return !!rewards()[id]}
function bonusXP(){return Object.keys(rewards()).filter(id=>TASKS.some(t=>t.id===id)).length*REWARD_XP}
function saveState(){try{if(typeof save==='function')save()}catch{}}
function taskDone(t){try{return !!t.test()}catch{return false}}
function remove(){document.getElementById('mcuBeginnerTasks1620')?.remove()}

function patchXP(){
  try{
    if(window.__MCU_BEGINNER_TASK_XP_PATCHED_1620__)return;
    const original=window.totalXP;
    if(typeof original!=='function')return;
    const wrapped=function(){return Number(original.apply(this,arguments)||0)+bonusXP()};
    wrapped.__mcuBeginnerTaskXP=true;
    window.totalXP=wrapped;
    window.__MCU_BEGINNER_TASK_XP_PATCHED_1620__=true;
  }catch{}
}

function ensureStyle(){
  if(document.getElementById('mcuBeginnerTasksStyle1620'))return;
  const s=document.createElement('style');s.id='mcuBeginnerTasksStyle1620';s.textContent=`
  #mcuBeginnerTasks1620{margin:0 0 16px;padding:16px;border-radius:17px;border:1px solid rgba(255,255,255,.09);background:linear-gradient(135deg,rgba(25,31,43,.96),rgba(11,13,19,.96));box-shadow:0 12px 38px rgba(0,0,0,.16)}
  .mcu-bt-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;margin-bottom:12px}.mcu-bt-kicker{font-size:10px;letter-spacing:1.3px;text-transform:uppercase;color:#73b8ff;font-weight:900}.mcu-bt-title{font-size:19px;font-weight:950;margin-top:3px}.mcu-bt-sub{font-size:12px;color:#9299a7;margin-top:4px}.mcu-bt-count{padding:7px 10px;border-radius:999px;background:rgba(255,255,255,.06);font-size:11px;font-weight:900;white-space:nowrap}
  .mcu-bt-bar{height:7px;border-radius:99px;background:rgba(255,255,255,.07);overflow:hidden;margin-bottom:12px}.mcu-bt-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#2c8cff,#70c0ff);transition:width .2s ease}
  .mcu-bt-list{display:grid;grid-template-columns:1fr 1fr;gap:9px}.mcu-bt-task{display:grid;grid-template-columns:36px 1fr auto;align-items:center;gap:10px;padding:11px;border-radius:12px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.025)}.mcu-bt-task.ready{border-color:rgba(64,170,255,.35);background:rgba(45,130,220,.07)}.mcu-bt-task.claimed{opacity:.72;background:rgba(67,180,120,.06);border-color:rgba(67,180,120,.22)}
  .mcu-bt-icon{width:36px;height:36px;display:grid;place-items:center;border-radius:10px;background:rgba(255,255,255,.05);font-size:17px}.mcu-bt-task b{display:block;font-size:13px}.mcu-bt-task small{display:block;color:#858d9b;font-size:10px;line-height:1.35;margin-top:3px}.mcu-bt-reward{font-size:10px;color:#ffd36d;font-weight:900;margin-top:4px}
  .mcu-bt-btn{padding:7px 9px;border-radius:9px;border:1px solid rgba(90,180,255,.4);background:rgba(50,135,220,.16);color:#d8edff;font-size:10px;font-weight:900;cursor:pointer}.mcu-bt-btn[disabled]{cursor:default;opacity:.55;border-color:rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:#8a919d}.mcu-bt-done{font-size:12px;font-weight:900;color:#75d69d}
  @media(max-width:760px){.mcu-bt-list{grid-template-columns:1fr}.mcu-bt-task{grid-template-columns:34px 1fr auto}}
  `;(document.head||document.documentElement).appendChild(s);
}

function claim(id){
  const t=TASKS.find(x=>x.id===id);if(!t||claimed(id)||!taskDone(t))return;
  rewards()[id]=Date.now();
  saveState();
  try{if(typeof updateProgress==='function')updateProgress()}catch{}
  render();
}

function render(){
  try{
    patchXP();
    if(!currentUser||!isDoomsday()||isAdmin()){remove();return}
    ensureStyle();
    const anchor=document.getElementById('mcuDashboardPlan1')||document.getElementById('progressText')?.closest('section')||document.getElementById('nextPanel');
    if(!anchor?.parentNode)return;
    let host=document.getElementById('mcuBeginnerTasks1620');
    if(!host){host=document.createElement('section');host.id='mcuBeginnerTasks1620';anchor.parentNode.insertBefore(host,anchor)}
    const rw=rewards();
    const claimedCount=TASKS.filter(t=>!!rw[t.id]).length;
    const pct=Math.round(claimedCount/TASKS.length*100);
    if(claimedCount===TASKS.length){
      host.innerHTML=`<div class="mcu-bt-head" style="margin:0"><div><div class="mcu-bt-kicker">Başlangıç tamamlandı</div><div class="mcu-bt-title">🚀 İlk görevlerin bitti</div><div class="mcu-bt-sub">Toplam +${TASKS.length*REWARD_XP} bonus XP kazandın. Artık MCU yolculuğuna hazırsın.</div></div><div class="mcu-bt-count">4 / 4 ✓</div></div>`;
      return;
    }
    const rows=TASKS.map(t=>{
      const done=taskDone(t),got=!!rw[t.id];
      const cls=got?'claimed':done?'ready':'';
      const action=got?'<span class="mcu-bt-done">✓</span>':done?`<button class="mcu-bt-btn" type="button" data-mcu-bt-claim="${t.id}">+${REWARD_XP} XP Al</button>`:'<button class="mcu-bt-btn" type="button" disabled>Bekliyor</button>';
      return `<div class="mcu-bt-task ${cls}"><div class="mcu-bt-icon">${t.icon}</div><div><b>${t.title}</b><small>${t.desc}</small><div class="mcu-bt-reward">Ödül: +${REWARD_XP} XP</div></div>${action}</div>`;
    }).join('');
    host.innerHTML=`<div class="mcu-bt-head"><div><div class="mcu-bt-kicker">Yeni Başlayan Görevleri</div><div class="mcu-bt-title">İlk 5 dakikanı tamamla</div><div class="mcu-bt-sub">Küçük görevleri bitir, bonus XP kazan ve MCU Tracker'ı keşfet.</div></div><div class="mcu-bt-count">${claimedCount} / ${TASKS.length}</div></div><div class="mcu-bt-bar"><i style="width:${pct}%"></i></div><div class="mcu-bt-list">${rows}</div>`;
    host.querySelectorAll('[data-mcu-bt-claim]').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();claim(btn.dataset.mcuBtClaim)},true));
  }catch{}
}

function install(){patchXP();render()}
install();setTimeout(install,350);setTimeout(install,1100);
document.addEventListener('click',()=>setTimeout(render,80),true);
document.addEventListener('change',()=>setTimeout(render,100),true);
window.addEventListener('focus',install,{passive:true});
})();