(()=>{
'use strict';
if(window.__MCU_DOOMSDAY_QUICK_PREP_1618__)return;
window.__MCU_DOOMSDAY_QUICK_PREP_1618__=true;

const quickPrep=[
  {t:'X-Men',w:'X-Men (film)'},
  {t:'X2: X-Men United',w:'X2 (film)'},
  {t:'Captain America: The First Avenger',w:'Captain America: The First Avenger'},
  {t:'The Avengers',w:'The Avengers (2012 film)'},
  {t:'Avengers: Infinity War',w:'Avengers: Infinity War'},
  {t:'Avengers: Endgame',w:'Avengers: Endgame'},
  {t:'Loki S1',w:'Loki (TV series)'},
  {t:'Loki S2',w:'Loki (TV series)'},
  {t:'Shang-Chi and the Legend of the Ten Rings',w:'Shang-Chi and the Legend of the Ten Rings'},
  {t:'Spider-Man: No Way Home',w:'Spider-Man: No Way Home'},
  {t:'Black Panther: Wakanda Forever',w:'Black Panther: Wakanda Forever'},
  {t:'Captain America: Brave New World',w:'Captain America: Brave New World'},
  {t:'Deadpool & Wolverine',w:'Deadpool & Wolverine'},
  {t:'Doctor Strange in the Multiverse of Madness',w:'Doctor Strange in the Multiverse of Madness'},
  {t:'Thunderbolts*',w:'Thunderbolts* (film)'},
  {t:'The Fantastic Four: First Steps',w:'The Fantastic Four: First Steps'}
];
window.MCU_DOOMSDAY_QUICK_PREP_1618=quickPrep;
let active=false;

function base(){return Array.isArray(window.__MCU_DOOMSDAY_BASE_1618__)?window.__MCU_DOOMSDAY_BASE_1618__:[]}
function replaceWith(src,title){
  try{
    if(typeof DOOMSDAY_DATA==='undefined'||!Array.isArray(DOOMSDAY_DATA))return;
    DOOMSDAY_DATA.splice(0,DOOMSDAY_DATA.length,...src.map(x=>({...x})));
    if(typeof DATA!=='undefined'&&DATA)DATA.doomsday=DOOMSDAY_DATA;
    if(typeof TITLES!=='undefined')TITLES.doomsday=title;
  }catch{}
}
function activate(){
  active=true;
  window.__MCU_LIST_MODE_1618__='doomsday15';
  replaceWith(quickPrep,'DOOMSDAY HIZLI HAZIRLIK');
  try{if(typeof renderCurrent==='function')renderCurrent(false)}catch{}
  setTimeout(installButton,0);
}
function restore(){
  if(!active)return;
  active=false;
  window.__MCU_LIST_MODE_1618__='doomsday';
  const b=base();
  if(b.length)replaceWith(b,'DOOMSDAY İÇİN İZLEMEN GEREKENLER');
}
function installButton(){
  try{
    if(typeof currentCategory==='undefined'||currentCategory!=='doomsday')return;
    const options=document.querySelector('#fullMcuMode1618 .mcu-list-options');
    if(!options)return;
    let btn=options.querySelector('[data-mcu-list-mode="doomsday15"]');
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.dataset.mcuListMode='doomsday15';
      btn.textContent='🎯 Doomsday Hızlı Hazırlık';
      const first=options.firstElementChild;
      first?first.insertAdjacentElement('afterend',btn):options.appendChild(btn);
      btn.onclick=e=>{e.preventDefault();e.stopPropagation();const wrap=document.getElementById('fullMcuMode1618');if(wrap)wrap.open=false;activate()};
    }
    btn.className=active?'active':'secondary';
    if(active){
      options.querySelectorAll('button').forEach(x=>{if(x!==btn)x.className='secondary'});
      const current=document.querySelector('#fullMcuMode1618 .mcu-list-current');
      if(current)current.textContent='🎯 Doomsday Hızlı Hazırlık ▾';
    }
  }catch{}
}
function watch(){
  try{
    if(typeof currentCategory!=='undefined'&&currentCategory!=='doomsday'){
      restore();
      return;
    }
    installButton();
  }catch{}
}

document.addEventListener('click',e=>{
  const existing=e.target?.closest?.('#fullMcuMode1618 [data-mcu-list-mode]');
  if(existing&&existing.dataset.mcuListMode!=='doomsday15')active=false;
  setTimeout(watch,60);
},true);
setTimeout(watch,500);setTimeout(watch,1400);window.addEventListener('focus',watch,{passive:true});
})();