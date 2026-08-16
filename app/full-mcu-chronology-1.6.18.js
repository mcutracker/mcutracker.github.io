(()=>{
'use strict';
if(window.__MCU_FULL_CHRONOLOGY_1618__)return;
window.__MCU_FULL_CHRONOLOGY_1618__=true;

const wikiAliases={
  'Black Widow':'Black Widow (2021 film)',
  'I Am Groot S1':'I Am Groot','I Am Groot S2':'I Am Groot',
  'Daredevil S1':'Daredevil (TV series)','Daredevil S2':'Daredevil (TV series)','Daredevil S3':'Daredevil (TV series)',
  'Jessica Jones S1':'Jessica Jones (TV series)','Jessica Jones S2':'Jessica Jones (TV series)','Jessica Jones S3':'Jessica Jones (TV series)',
  'Luke Cage S1':'Luke Cage (TV series)','Luke Cage S2':'Luke Cage (TV series)',
  'Iron Fist S1':'Iron Fist (TV series)','Iron Fist S2':'Iron Fist (TV series)',
  'The Defenders':'The Defenders (miniseries)',
  'The Punisher S1':'The Punisher (TV series)','The Punisher S2':'The Punisher (TV series)',
  'Loki S1':'Loki (TV series)','Loki S2':'Loki (TV series)',
  'What If...? S1':'What If...? (TV series)','What If...? S2':'What If...? (TV series)','What If...? S3':'What If...? (TV series)',
  'Daredevil: Born Again S1':'Daredevil: Born Again','Daredevil: Born Again S2':'Daredevil: Born Again'
};

const full=[
'Eyes of Wakanda','Captain America: The First Avenger','Marvel Studios One Shot: Agent Carter','Captain Marvel','Iron Man','Iron Man 2','The Incredible Hulk','Marvel Studios One Shot: A Funny Thing Happened on the Way to Thor’s Hammer','Thor','Marvel Studios One Shot: The Consultant','The Avengers','Marvel Studios One Shot: Item 47','Thor: The Dark World','Iron Man 3','Marvel Studios One Shot: All Hail the King','Captain America: The Winter Soldier','Guardians of the Galaxy','Guardians of the Galaxy Vol. 2','I Am Groot S1','I Am Groot S2','Daredevil S1','Jessica Jones S1','Avengers: Age of Ultron','Ant-Man','Daredevil S2','Luke Cage S1','Iron Fist S1','The Defenders','Captain America: Civil War','Black Widow','Black Panther','Spider-Man: Homecoming','The Punisher S1','Doctor Strange','Jessica Jones S2','Luke Cage S2','Iron Fist S2','Daredevil S3','Thor: Ragnarok','The Punisher S2','Jessica Jones S3','Ant-Man and the Wasp','Avengers: Infinity War','Avengers: Endgame','Loki S1','What If...? S1','Marvel Zombies','WandaVision','Shang-Chi and the Legend of the Ten Rings','The Falcon and the Winter Soldier','Spider-Man: Far From Home','Eternals','Spider-Man: No Way Home','Doctor Strange in the Multiverse of Madness','Hawkeye','Moon Knight','Black Panther: Wakanda Forever','Echo','She-Hulk: Attorney at Law','Ms. Marvel','Thor: Love and Thunder','Ironheart','Werewolf By Night','The Guardians of the Galaxy Holiday Special','Ant-Man and the Wasp: Quantumania','Guardians of the Galaxy Vol. 3','Secret Invasion','The Marvels','Loki S2','What If...? S2','Deadpool & Wolverine','Agatha All Along','What If...? S3','Daredevil: Born Again S1','Captain America: Brave New World','Thunderbolts*','The Fantastic Four: First Steps','Wonder Man','Daredevil: Born Again S2','The Punisher: One Last Kill'
].map(t=>({t,w:wikiAliases[t]||t}));

let mode='doomsday';
window.__MCU_FULL_MODE_1618__=false;
window.__MCU_LIST_MODE_1618__='doomsday';

function setMode(v){
  mode=['doomsday','full','chronological','release'].includes(v)?v:'doomsday';
  window.__MCU_FULL_MODE_1618__=mode!=='doomsday';
  window.__MCU_LIST_MODE_1618__=mode;
}

function rememberBase(){
  if(!window.__MCU_DOOMSDAY_BASE_1618__&&typeof DOOMSDAY_DATA!=='undefined'&&Array.isArray(DOOMSDAY_DATA)){
    window.__MCU_DOOMSDAY_BASE_1618__=DOOMSDAY_DATA.map(x=>({...x}));
  }
}

function modeLabel(){
  return mode==='full'?'🌌 Tam MCU Kronolojisi':mode==='chronological'?'⏳ Kronolojiye Göre — Filmler':mode==='release'?'📅 Vizyona Göre — Filmler':'⚡ Doomsday Listesi';
}

function titleForMode(){
  return mode==='full'?'TAM MCU KRONOLOJİSİ — HER ŞEYE HÂKİM OL':mode==='chronological'?'KRONOLOJİYE GÖRE — TÜM FİLMLER':mode==='release'?'VİZYONA GÖRE — TÜM FİLMLER':'DOOMSDAY İÇİN İZLEMEN GEREKENLER';
}

function sourceForMode(){
  if(mode==='full')return full;
  if(mode==='chronological'&&typeof CHRONOLOGICAL!=='undefined')return CHRONOLOGICAL;
  if(mode==='release'&&typeof RELEASE!=='undefined')return RELEASE;
  return window.__MCU_DOOMSDAY_BASE_1618__||[];
}

function applyMode(render=true){
  try{
    if(typeof currentCategory==='undefined'||currentCategory!=='doomsday')return;
    rememberBase();
    const src=sourceForMode();
    if(typeof DOOMSDAY_DATA!=='undefined'&&Array.isArray(DOOMSDAY_DATA)&&Array.isArray(src)){
      DOOMSDAY_DATA.splice(0,DOOMSDAY_DATA.length,...src.map(x=>({...x})));
      if(typeof DATA!=='undefined'&&DATA)DATA.doomsday=DOOMSDAY_DATA;
    }
    if(typeof TITLES!=='undefined')TITLES.doomsday=titleForMode();
    if(render&&typeof renderCurrent==='function')renderCurrent(false);
    setTimeout(addChooser,0);
  }catch{}
}

function restoreBase(render=false){
  setMode('doomsday');
  try{
    rememberBase();
    const src=window.__MCU_DOOMSDAY_BASE_1618__||[];
    if(typeof DOOMSDAY_DATA!=='undefined'&&Array.isArray(DOOMSDAY_DATA)){
      DOOMSDAY_DATA.splice(0,DOOMSDAY_DATA.length,...src.map(x=>({...x})));
      if(typeof DATA!=='undefined'&&DATA)DATA.doomsday=DOOMSDAY_DATA;
    }
    if(typeof TITLES!=='undefined')TITLES.doomsday='DOOMSDAY İÇİN İZLEMEN GEREKENLER';
    if(render&&typeof currentCategory!=='undefined'&&currentCategory==='doomsday'&&typeof renderCurrent==='function')renderCurrent(false);
  }catch{}
}

function ensureStyle(){
  if(document.getElementById('mcuListChooserStyle1618'))return;
  const s=document.createElement('style');
  s.id='mcuListChooserStyle1618';
  s.textContent=`
    #fullMcuMode1618{margin:0 0 18px;padding:0;overflow:hidden}
    #fullMcuMode1618>summary{list-style:none;cursor:pointer;padding:13px 15px;font-weight:900;display:flex;justify-content:space-between;gap:12px;align-items:center}
    #fullMcuMode1618>summary::-webkit-details-marker{display:none}
    #fullMcuMode1618 .mcu-list-current{font-size:12px;color:#aeb3bf;font-weight:700;text-align:right}
    #fullMcuMode1618 .mcu-list-options{padding:0 12px 12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px}
    #fullMcuMode1618 .mcu-list-options button{width:100%;text-align:left}
  `;
  document.head.appendChild(s);
}

function addChooser(){
  if(typeof currentCategory==='undefined'||currentCategory!=='doomsday')return;
  const list=document.getElementById('movieList');if(!list)return;
  ensureStyle();
  let wrap=document.getElementById('fullMcuMode1618');
  if(!wrap){
    wrap=document.createElement('details');
    wrap.id='fullMcuMode1618';
    wrap.className='panel';
    list.parentNode.insertBefore(wrap,list);
  }
  const wasOpen=wrap.open;
  wrap.innerHTML=`<summary><span>📋 Bunu Listele</span><span class="mcu-list-current">${modeLabel()} ▾</span></summary><div class="mcu-list-options"><button type="button" data-mcu-list-mode="doomsday" class="${mode==='doomsday'?'active':'secondary'}">⚡ Doomsday Listesi</button><button type="button" data-mcu-list-mode="full" class="${mode==='full'?'active':'secondary'}">🌌 Ben Her Şeye Hâkim Olmak İstiyorum</button><button type="button" data-mcu-list-mode="chronological" class="${mode==='chronological'?'active':'secondary'}">⏳ Kronolojiye Göre — Filmler</button><button type="button" data-mcu-list-mode="release" class="${mode==='release'?'active':'secondary'}">📅 Vizyona Göre — Filmler</button></div>`;
  wrap.open=wasOpen;
  wrap.querySelectorAll('[data-mcu-list-mode]').forEach(btn=>btn.onclick=e=>{
    e.preventDefault();
    setMode(btn.dataset.mcuListMode);
    wrap.open=false;
    applyMode(true);
  });
}

function watch(){
  if(typeof currentCategory!=='undefined'&&currentCategory==='doomsday'){
    rememberBase();
    addChooser();
  }else{
    if(mode!=='doomsday')restoreBase(false);
    document.getElementById('fullMcuMode1618')?.remove();
  }
}

setTimeout(watch,400);
setTimeout(watch,1200);
document.addEventListener('click',()=>setTimeout(watch,30),true);
window.addEventListener('focus',watch,{passive:true});
})();