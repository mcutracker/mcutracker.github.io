(()=>{
  'use strict';
  if(window.__MCU_CHRONOLOGY_1618__)return;
  window.__MCU_CHRONOLOGY_1618__=true;

  const VERSION='1.6.18';
  const TELEMETRY_URL='https://svnrfyqloiludzvnylyp.supabase.co/functions/v1/mcu-telemetry';
  const corrected=[
    {t:'Captain America: The First Avenger',w:'Captain America: The First Avenger'},
    {t:'Captain Marvel',w:'Captain Marvel (film)'},
    {t:'Iron Man',w:'Iron Man (2008 film)'},
    {t:'Iron Man 2',w:'Iron Man 2'},
    {t:'The Incredible Hulk',w:'The Incredible Hulk (film)'},
    {t:'Thor',w:'Thor (film)'},
    {t:'The Avengers',w:'The Avengers (2012 film)'},
    {t:'Thor: The Dark World',w:'Thor: The Dark World'},
    {t:'Iron Man 3',w:'Iron Man 3'},
    {t:'Captain America: The Winter Soldier',w:'Captain America: The Winter Soldier'},
    {t:'Guardians of the Galaxy',w:'Guardians of the Galaxy (film)'},
    {t:'Guardians of the Galaxy Vol. 2',w:'Guardians of the Galaxy Vol. 2'},
    {t:'Avengers: Age of Ultron',w:'Avengers: Age of Ultron'},
    {t:'Ant-Man',w:'Ant-Man (film)'},
    {t:'Captain America: Civil War',w:'Captain America: Civil War'},
    {t:'Black Widow',w:'Black Widow (film)'},
    {t:'Black Panther',w:'Black Panther (film)'},
    {t:'Spider-Man: Homecoming',w:'Spider-Man: Homecoming'},
    {t:'Doctor Strange',w:'Doctor Strange (2016 film)'},
    {t:'Thor: Ragnarok',w:'Thor: Ragnarok'},
    {t:'Ant-Man and the Wasp',w:'Ant-Man and the Wasp'},
    {t:'Avengers: Infinity War',w:'Avengers: Infinity War'},
    {t:'Avengers: Endgame',w:'Avengers: Endgame'},
    {t:'Shang-Chi and the Legend of the Ten Rings',w:'Shang-Chi and the Legend of the Ten Rings'},
    {t:'Spider-Man: Far From Home',w:'Spider-Man: Far From Home'},
    {t:'Eternals',w:'Eternals (film)'},
    {t:'Spider-Man: No Way Home',w:'Spider-Man: No Way Home'},
    {t:'Doctor Strange in the Multiverse of Madness',w:'Doctor Strange in the Multiverse of Madness'},
    {t:'Black Panther: Wakanda Forever',w:'Black Panther: Wakanda Forever'},
    {t:'Thor: Love and Thunder',w:'Thor: Love and Thunder'},
    {t:'Ant-Man and the Wasp: Quantumania',w:'Ant-Man and the Wasp: Quantumania'},
    {t:'Guardians of the Galaxy Vol. 3',w:'Guardians of the Galaxy Vol. 3'},
    {t:'The Marvels',w:'The Marvels (film)'},
    {t:'Deadpool & Wolverine',w:'Deadpool & Wolverine'},
    {t:'Captain America: Brave New World',w:'Captain America: Brave New World'},
    {t:'Thunderbolts*',w:'Thunderbolts* (film)'},
    {t:'The Fantastic Four: First Steps',w:'The Fantastic Four: First Steps'},
    {t:'Spider-Man: Brand New Day',w:'Spider-Man: Brand New Day'}
  ];

  function ensureDoomsdayOrder(){
    if(window.__MCU_DOOMSDAY_ORDER_1618__||document.getElementById('mcuDoomsdayOrder1618Loader'))return;
    const s=document.createElement('script');
    s.id='mcuDoomsdayOrder1618Loader';
    s.src='https://mcutracker.github.io/app/doomsday-order-1.6.18.js?t='+Date.now();
    s.async=false;
    s.onerror=()=>s.remove();
    document.head.appendChild(s);
  }

  function applyChronology(){
    try{
      if(typeof CHRONOLOGICAL!=='undefined'&&Array.isArray(CHRONOLOGICAL)){
        CHRONOLOGICAL.splice(0,CHRONOLOGICAL.length,...corrected.map(x=>({...x})));
        if(typeof DATA!=='undefined'&&DATA)DATA.chronological=CHRONOLOGICAL;
        if(typeof currentCategory!=='undefined'&&currentCategory==='chronological'&&typeof renderCurrent==='function')renderCurrent(false);
      }
    }catch{}
  }

  function patchVersionUI(){
    const selectors=['.version-pill','[data-current-version]','.profile-rank','.badge'];
    for(const sel of selectors){
      document.querySelectorAll(sel).forEach(el=>{
        const text=el.textContent||'';
        if(/v1\.5\.0|v1\.6\.17/.test(text))el.textContent=text.replace(/v1\.5\.0|v1\.6\.17/g,'v'+VERSION);
      });
    }
  }

  function patchTelemetry(){
    try{
      if(typeof sendTelemetry==='function'){
        sendTelemetry=function(event){
          try{fetch(TELEMETRY_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event,version:VERSION}),keepalive:true}).catch(()=>{})}catch{}
        };
      }
    }catch{}
  }

  function apply(){applyChronology();patchTelemetry();patchVersionUI();ensureDoomsdayOrder();}
  apply();
  setTimeout(apply,250);
  setTimeout(apply,1000);
  document.addEventListener('click',()=>setTimeout(()=>{applyChronology();patchVersionUI();ensureDoomsdayOrder()},0),true);
  window.addEventListener('focus',()=>{applyChronology();patchVersionUI();ensureDoomsdayOrder()},{passive:true});
})();
