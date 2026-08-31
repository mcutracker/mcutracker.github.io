(()=>{
'use strict';
if(window.__MCU_ONBOARDING_1619__)return;
window.__MCU_ONBOARDING_1619__=true;

const VERSION='1.6.19';
const SESSION_KEY='MCU_TRACKER_SESSION_V1';
const KEY_PREFIX='MCU_TRACKER_ONBOARDING_DONE_1619_';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let activeStep=0;
let openTimer=0;

const steps=[
  {
    icon:'👋',
    title:'MCU Tracker Ultimate’a hoş geldin',
    text:'İzleme yolculuğunu birkaç adımda hazırlayalım. Bu rehber yalnızca yeni hesaplarda bir kez gösterilir.',
    hint:'Yaklaşık 30 saniye sürer.'
  },
  {
    icon:'📋',
    title:'Önce izleme listeni seç',
    text:'Doomsday ekranındaki “Bunu Listele” menüsünden sana uygun sırayı seçebilirsin: Doomsday, Hızlı Hazırlık, MCU’ya Tam Hazırlık, kronoloji veya yayın sırası.',
    hint:'Daha sonra istediğin zaman liste değiştirebilirsin.'
  },
  {
    icon:'✅',
    title:'İzlediklerini işaretle',
    text:'Bir film veya sezonu tamamladığında karttan izledim olarak işaretle. İlerlemen hesabına kaydolur ve web ile Windows arasında senkronize olur.',
    hint:'İlk işaretlemen Dashboard’unu da hareketlendirecek.'
  },
  {
    icon:'⚡',
    title:'XP kazan, seviyeni yükselt',
    text:'İzledikçe XP, kupalar ve Infinity Stones ilerlemesi kazanırsın. Dashboard; tamamlanma oranını, son izlediğini ve sıradaki yapımı tek yerde gösterir.',
    hint:'Hazırsın. İlk içeriğini işaretleyerek başlayabilirsin.'
  }
];

function currentKey(){
  try{
    if(typeof currentUser!=='undefined'&&currentUser?.username)return String(currentUser.username).trim().toLocaleLowerCase('tr-TR');
  }catch{}
  return String(localStorage.getItem(SESSION_KEY)||'').trim().toLocaleLowerCase('tr-TR');
}
function watchedCount(){
  try{return Object.values(state?.watched||{}).filter(Boolean).length}catch{return 0}
}
function isAdminCenter(){
  return (document.getElementById('subtitle')?.textContent||'').trim().toLocaleUpperCase('tr-TR')==='ADMIN MERKEZİ';
}
function doneKey(){const k=currentKey();return k?KEY_PREFIX+k:''}
function isDone(){const k=doneKey();return !k||localStorage.getItem(k)==='1'}
function markDone(){const k=doneKey();if(k)localStorage.setItem(k,'1')}
function eligible(){
  if(isDone()||isAdminCenter())return false;
  const k=currentKey();if(!k)return false;
  try{if(typeof currentUser!=='undefined'&&!currentUser)return false}catch{}
  return watchedCount()===0;
}
function style(){
  if(document.getElementById('mcuOnboardingStyle1619'))return;
  const s=document.createElement('style');s.id='mcuOnboardingStyle1619';s.textContent=`
  #mcuOnboarding1619{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:20px;background:rgba(3,5,10,.78);backdrop-filter:blur(9px)}
  #mcuOnboarding1619 .mcu-onboard-card{width:min(560px,100%);border-radius:22px;border:1px solid rgba(255,255,255,.12);background:linear-gradient(145deg,#151923,#0b0e14);box-shadow:0 28px 90px rgba(0,0,0,.55);overflow:hidden}
  #mcuOnboarding1619 .mcu-onboard-top{padding:22px 22px 12px;background:radial-gradient(circle at 15% 0,rgba(230,36,41,.20),transparent 42%),radial-gradient(circle at 95% 10%,rgba(62,112,255,.13),transparent 36%)}
  #mcuOnboarding1619 .mcu-onboard-version{font-size:10px;font-weight:900;letter-spacing:1.4px;color:#ff7276;text-transform:uppercase}
  #mcuOnboarding1619 .mcu-onboard-icon{font-size:38px;margin:16px 0 8px}
  #mcuOnboarding1619 h2{margin:0;font-size:25px;letter-spacing:-.5px}
  #mcuOnboarding1619 p{margin:10px 0 0;color:#aab1bf;line-height:1.65;font-size:14px}
  #mcuOnboarding1619 .mcu-onboard-hint{margin-top:12px;padding:10px 12px;border:1px solid rgba(255,255,255,.07);border-radius:12px;background:rgba(255,255,255,.03);color:#7f8898;font-size:12px}
  #mcuOnboarding1619 .mcu-onboard-dots{display:flex;gap:7px;padding:0 22px 16px}.mcu-onboard-dot{width:28px;height:5px;border:0;padding:0;border-radius:99px;background:rgba(255,255,255,.10)}.mcu-onboard-dot.on{background:#e62429}
  #mcuOnboarding1619 .mcu-onboard-actions{display:flex;justify-content:space-between;gap:10px;padding:16px 22px 22px;border-top:1px solid rgba(255,255,255,.07)}
  #mcuOnboarding1619 .mcu-onboard-left,#mcuOnboarding1619 .mcu-onboard-right{display:flex;gap:8px;align-items:center}
  #mcuOnboarding1619 button{border-radius:11px;padding:10px 14px;font-weight:900;cursor:pointer;border:1px solid rgba(255,255,255,.12);background:#151922;color:#dce2ec}
  #mcuOnboarding1619 button.primary{background:linear-gradient(135deg,#d51d35,#8f1024);border-color:#dd4054;color:white}
  #mcuOnboarding1619 button.ghost{background:transparent;border-color:transparent;color:#8f98a8}
  @media(max-width:520px){#mcuOnboarding1619{padding:12px;align-items:end}#mcuOnboarding1619 .mcu-onboard-card{border-radius:20px}#mcuOnboarding1619 .mcu-onboard-actions{flex-direction:column-reverse}#mcuOnboarding1619 .mcu-onboard-left,#mcuOnboarding1619 .mcu-onboard-right{width:100%}#mcuOnboarding1619 button{flex:1}}
  `;(document.head||document.documentElement).appendChild(s);
}
function close(finish=true){
  if(finish)markDone();
  document.getElementById('mcuOnboarding1619')?.remove();
}
function renderStep(){
  const root=document.getElementById('mcuOnboarding1619');if(!root)return;
  const step=steps[activeStep];
  root.querySelector('.mcu-onboard-icon').textContent=step.icon;
  root.querySelector('h2').textContent=step.title;
  root.querySelector('.mcu-onboard-text').textContent=step.text;
  root.querySelector('.mcu-onboard-hint').textContent=step.hint;
  root.querySelector('.mcu-onboard-dots').innerHTML=steps.map((_,i)=>`<i class="mcu-onboard-dot ${i===activeStep?'on':''}"></i>`).join('');
  const back=root.querySelector('[data-onboard-back]');
  const next=root.querySelector('[data-onboard-next]');
  back.style.visibility=activeStep===0?'hidden':'visible';
  next.textContent=activeStep===steps.length-1?'Başlayalım':'Devam';
}
function openGuide(force=false){
  if(document.getElementById('mcuOnboarding1619'))return;
  if(!force&&!eligible())return;
  if(isAdminCenter())return;
  style();activeStep=0;
  const root=document.createElement('div');root.id='mcuOnboarding1619';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','Yeni kullanıcı rehberi');
  root.innerHTML=`<div class="mcu-onboard-card"><div class="mcu-onboard-top"><div class="mcu-onboard-version">YENİ • v${VERSION} BAŞLANGIÇ REHBERİ</div><div class="mcu-onboard-icon"></div><h2></h2><p class="mcu-onboard-text"></p><div class="mcu-onboard-hint"></div></div><div class="mcu-onboard-dots"></div><div class="mcu-onboard-actions"><div class="mcu-onboard-left"><button type="button" class="ghost" data-onboard-skip>Atla</button></div><div class="mcu-onboard-right"><button type="button" data-onboard-back>Geri</button><button type="button" class="primary" data-onboard-next>Devam</button></div></div></div>`;
  document.body.appendChild(root);renderStep();
  root.querySelector('[data-onboard-skip]').addEventListener('click',()=>close(true));
  root.querySelector('[data-onboard-back]').addEventListener('click',()=>{if(activeStep>0){activeStep--;renderStep()}});
  root.querySelector('[data-onboard-next]').addEventListener('click',()=>{if(activeStep<steps.length-1){activeStep++;renderStep()}else close(true)});
}
function addSettingsReplay(){
  const grid=document.querySelector('.settings-grid');if(!grid||document.getElementById('mcuOnboardingReplay1619'))return;
  const card=document.createElement('section');card.id='mcuOnboardingReplay1619';card.className='settings-card';
  card.innerHTML='<h3>🧭 Başlangıç Rehberi</h3><p>MCU Tracker’ın temel kullanım adımlarını yeniden görüntüle.</p><div class="settings-actions"><button type="button" class="secondary" id="mcuOnboardingReplayBtn1619">Rehberi Tekrar Aç</button></div>';
  grid.appendChild(card);
  card.querySelector('button').addEventListener('click',()=>openGuide(true));
}
function scheduleOpen(){
  clearTimeout(openTimer);openTimer=setTimeout(()=>{if(eligible())openGuide(false)},500);
}
function install(){
  addSettingsReplay();
  if(!isAdminCenter())scheduleOpen();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
document.addEventListener('click',()=>setTimeout(()=>{addSettingsReplay();if(!document.getElementById('mcuOnboarding1619'))scheduleOpen()},120),true);
window.addEventListener('focus',()=>{addSettingsReplay();if(!document.getElementById('mcuOnboarding1619'))scheduleOpen()},{passive:true});
setTimeout(install,1200);
})();
