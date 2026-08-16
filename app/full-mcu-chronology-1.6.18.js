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
  'Daredevil: Born Again S1':'Daredevil: Born Again','Daredevil: Born Again S2':'Daredevil: Born Again',
  'X-Men':'X-Men (film)','X2':'X2 (film)','X-Men: The Last Stand':'X-Men: The Last Stand','X-Men: First Class':'X-Men: First Class','X-Men: Days of Future Past':'X-Men: Days of Future Past',
  'Spider-Man':'Spider-Man (2002 film)','Spider-Man 2':'Spider-Man 2','Spider-Man 3':'Spider-Man 3','The Amazing Spider-Man':'The Amazing Spider-Man (film)','The Amazing Spider-Man 2':'The Amazing Spider-Man 2'
};

const preparedExtras=[
  'X-Men','X2','X-Men: The Last Stand','X-Men: First Class','X-Men: Days of Future Past',
  'Spider-Man','Spider-Man 2','Spider-Man 3','The Amazing Spider-Man','The Amazing Spider-Man 2',
  'Deadpool & Wolverine'
].map(t=>({t,w:wikiAliases[t]||t}));

let mode='doomsday';
window.__MCU_FULL_MODE_1618__=false;
window.__MCU_LIST_MODE_1618__='doomsday';

function ensureExternalMeta(){
  try{
    if(typeof PHASES!=='undefined')Object.assign(PHASES,{
      'X-Men':'X-Men Evreni','X2':'X-Men Evreni','X-Men: The Last Stand':'X-Men Evreni','X-Men: First Class':'X-Men Evreni','X-Men: Days of Future Past':'X-Men Evreni',
      'Spider-Man':'Tobey Spider-Verse','Spider-Man 2':'Tobey Spider-Verse','Spider-Man 3':'Tobey Spider-Verse',
      'The Amazing Spider-Man':'Andrew Spider-Verse','The Amazing Spider-Man 2':'Andrew Spider-Verse'
    });
    if(typeof DURATIONS!=='undefined')Object.assign(DURATIONS,{
      'X-Men':104,'X2':134,'X-Men: The Last Stand':104,'X-Men: First Class':132,'X-Men: Days of Future Past':132,
      'Spider-Man':121,'Spider-Man 2':127,'Spider-Man 3':139,'The Amazing Spider-Man':136,'The Amazing Spider-Man 2':142
    });
  }catch{}
}

function setMode(v){
  mode=['doomsday','prepared','chronological','release'].includes(v)?v:'doomsday';
  window.__MCU_FULL_MODE_1618__=mode!=='doomsday';
  window.__MCU_LIST_MODE_1618__=mode;
}

function rememberBase(){
  if(!window.__MCU_DOOMSDAY_BASE_1618__&&typeof DOOMSDAY_DATA!=='undefined'&&Array.isArray(DOOMSDAY_DATA)){
    window.__MCU_DOOMSDAY_BASE_1618__=DOOMSDAY_DATA.map(x=>({...x}));
  }
}

function modeLabel(){
  return mode==='prepared'?'🔥 Doomsday’e Tam Hazırlık':mode==='chronological'?'⏳ Kronolojiye Göre — Filmler':mode==='release'?'📅 Vizyona Göre — Filmler':'⚡ Doomsday Listesi';
}

function titleForMode(){
  return mode==='prepared'?"DOOMSDAY’E TAM HAZIRLIK — MCU + X-MEN + SPIDER-VERSE":mode==='chronological'?'KRONOLOJİYE GÖRE — TÜM FİLMLER':mode==='release'?'VİZYONA GÖRE — TÜM FİLMLER':'DOOMSDAY İÇİN İZLEMEN GEREKENLER';
}

function sourceForMode(){
  if(mode==='prepared'){
    const base=window.__MCU_DOOMSDAY_BASE_1618__||[];
    const seen=new Set();
    return [...preparedExtras,...base].filter(x=>x?.t&&!seen.has(x.t)&&seen.add(x.t));
  }
  if(mode==='chronological'&&typeof CHRONOLOGICAL!=='undefined')return CHRONOLOGICAL;
  if(mode==='release'&&typeof RELEASE!=='undefined')return RELEASE;
  return window.__MCU_DOOMSDAY_BASE_1618__||[];
}

function applyMode(render=true){
  try{
    if(typeof currentCategory==='undefined'||currentCategory!=='doomsday')return;
    rememberBase();ensureExternalMeta();
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
  wrap.innerHTML=`<summary><span>📋 Bunu Listele</span><span class="mcu-list-current">${modeLabel()} ▾</span></summary><div class="mcu-list-options"><button type="button" data-mcu-list-mode="doomsday" class="${mode==='doomsday'?'active':'secondary'}">⚡ Doomsday Listesi</button><button type="button" data-mcu-list-mode="prepared" class="${mode==='prepared'?'active':'secondary'}">🔥 Doomsday’e Tam Hazırlık — MCU + X-Men + Spider-Verse</button><button type="button" data-mcu-list-mode="chronological" class="${mode==='chronological'?'active':'secondary'}">⏳ Kronolojiye Göre — Filmler</button><button type="button" data-mcu-list-mode="release" class="${mode==='release'?'active':'secondary'}">📅 Vizyona Göre — Filmler</button></div>`;
  wrap.open=wasOpen;
  wrap.querySelectorAll('[data-mcu-list-mode]').forEach(btn=>btn.onclick=e=>{
    e.preventDefault();
    setMode(btn.dataset.mcuListMode);
    wrap.open=false;
    applyMode(true);
  });
}

function watch(){
  ensureExternalMeta();
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