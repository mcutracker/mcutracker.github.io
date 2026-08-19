(()=>{
  'use strict';
  if(window.__MCU_LIST_STATS_1618__)return;
  window.__MCU_LIST_STATS_1618__=true;

  const SERIES_MAP={
    'Eyes of Wakanda':['Eyes of Wakanda',1],
    'I Am Groot S1':['I Am Groot',1],
    'I Am Groot S2':['I Am Groot',2],
    'Daredevil S1':['Daredevil',1],
    'Daredevil S2':['Daredevil',2],
    'Daredevil S3':['Daredevil',3],
    'Jessica Jones S1':['Jessica Jones',1],
    'Jessica Jones S2':['Jessica Jones',2],
    'Jessica Jones S3':['Jessica Jones',3],
    'Luke Cage S1':['Luke Cage',1],
    'Luke Cage S2':['Luke Cage',2],
    'Iron Fist S1':['Iron Fist',1],
    'Iron Fist S2':['Iron Fist',2],
    'The Defenders':['The Defenders',1],
    'The Punisher S1':['The Punisher',1],
    'The Punisher S2':['The Punisher',2],
    'Loki S1':['Loki',1],
    'Loki S2':['Loki',2],
    'What If...? S1':['What If...?',1],
    'What If...? S2':['What If...?',2],
    'What If...? S3':['What If...?',3],
    'Marvel Zombies':['Marvel Zombies',1],
    'WandaVision':['WandaVision',1],
    'The Falcon and the Winter Soldier':['The Falcon and the Winter Soldier',1],
    'Hawkeye':['Hawkeye',1],
    'Moon Knight':['Moon Knight',1],
    'Echo':['Echo',1],
    'She-Hulk':['She-Hulk: Attorney at Law',1],
    'She-Hulk: Attorney at Law':['She-Hulk: Attorney at Law',1],
    'Ms. Marvel':['Ms. Marvel',1],
    'Ironheart':['Ironheart',1],
    'Secret Invasion':['Secret Invasion',1],
    'Agatha All Along':['Agatha All Along',1],
    'Daredevil: Born Again S1':['Daredevil: Born Again',1],
    'Daredevil: Born Again S2':['Daredevil: Born Again',2],
    'Wonder Man':['Wonder Man',1]
  };

  const FILM_ALIASES={
    'Shang-Chi':'Shang-Chi and the Legend of the Ten Rings'
  };

  const movieKey=title=>'movie|'+title+'|';
  const seriesKey=(show,season)=>'series|'+show+'|'+season;

  function isOn(key){
    try{return !!state?.watched?.[key]}catch{return false}
  }

  function filmTitles(){
    try{return new Set((ALL_MOVIES||[]).map(x=>x.t))}catch{return new Set()}
  }

  function itemDone(item){
    const title=item?.t||'';
    const map=SERIES_MAP[title];
    if(map)return isOn(seriesKey(map[0],map[1]))||isOn(movieKey(title));
    return isOn(movieKey(title));
  }

  function seasonRows(){
    try{
      const out=[];
      (SERIES||[]).forEach(show=>{
        for(let s=1;s<=Number(show.seasons||0);s++)out.push({t:show.t+' S'+s,series:[show.t,s]});
      });
      return out;
    }catch{return []}
  }

  function scopedData(){
    try{
      if(typeof currentCategory==='undefined')return null;
      if(currentCategory==='doomsday')return {kind:'mixed',items:Array.isArray(DATA?.doomsday)?DATA.doomsday:[],mode:window.__MCU_LIST_MODE_1618__||'doomsday'};
      if(currentCategory==='mcu')return {kind:'films',items:Array.isArray(ALL_MOVIES)?ALL_MOVIES:[]};
      if(currentCategory==='chronological')return {kind:'films',items:Array.isArray(CHRONOLOGICAL)?CHRONOLOGICAL:[]};
      if(currentCategory==='release')return {kind:'films',items:Array.isArray(RELEASE)?RELEASE:[]};
      if(currentCategory==='imdb')return {kind:'films',items:Array.isArray(ALL_MOVIES)?ALL_MOVIES:[]};
      if(currentCategory==='series')return {kind:'series',items:seasonRows()};
      return null;
    }catch{return null}
  }

  function setStat(id,value,label){
    const el=document.getElementById(id);if(!el)return;
    el.textContent=String(value);
    const small=el.closest('.stat')?.querySelector('small');
    if(small&&label)small.textContent=label;
  }

  function applyScopedStats(){
    const data=scopedData();
    if(!data)return;

    let total=0,done=0,seriesCount=0,nonSeriesCount=0,specialCount=0;
    const films=filmTitles();

    if(data.kind==='series'){
      total=data.items.length;
      seriesCount=total;
      done=data.items.reduce((n,row)=>n+(isOn(seriesKey(row.series[0],row.series[1]))?1:0),0);
    }else{
      total=data.items.length;
      data.items.forEach(item=>{
        const title=item?.t||'';
        const map=SERIES_MAP[title];
        if(map)seriesCount++;
        else{
          nonSeriesCount++;
          const filmTitle=FILM_ALIASES[title]||title;
          if(!films.has(filmTitle))specialCount++;
        }
        if(itemDone(item))done++;
      });
    }

    const left=Math.max(0,total-done);
    const pct=total?Math.min(100,done/total*100):0;
    const progressText=document.getElementById('progressText');if(progressText)progressText.textContent=done+' / '+total;
    const progressFill=document.getElementById('progressFill');if(progressFill)progressFill.style.width=pct+'%';

    setStat('statDone',done,'Tamamlanan');
    setStat('statLeft',left,'Kalan');
    setStat('statMovies',nonSeriesCount,specialCount?'Film / Özel':'Filmler');
    setStat('statSeries',seriesCount,'Dizi Sezonları');
  }

  function applyScopedNextWatch(){
    try{
      const data=scopedData();
      if(!data)return false;
      const titleEl=document.getElementById('nextTitle');
      const metaEl=document.getElementById('nextMeta');
      const btn=document.getElementById('nextBtn');
      if(!titleEl||!metaEl||!btn)return false;

      if(data.kind==='series'){
        const row=data.items.find(x=>!isOn(seriesKey(x.series[0],x.series[1])));
        titleEl.textContent=row?row.t:'🎉 Tüm dizi sezonlarını tamamladın!';
        metaEl.textContent=row?'Sıradaki izlenmemiş sezon':'';
        btn.disabled=!row;
        btn.textContent='▶ Şimdi İzle';
        btn.onclick=()=>{
          if(!row)return;
          const cards=[...document.querySelectorAll('.series-card')];
          const idx=typeof SERIES!=='undefined'&&Array.isArray(SERIES)?SERIES.findIndex(x=>x.t===row.series[0]):-1;
          const card=idx>=0?cards[idx]:null;
          if(card){card.open=true;card.scrollIntoView({behavior:'smooth',block:'center'});}
        };
        return true;
      }

      const n=data.items.find(x=>!itemDone(x));
      titleEl.textContent=n?n.t:'🎉 Bu listedeki tüm içerikleri tamamladın!';
      metaEl.textContent=n&&typeof itemMeta==='function'?itemMeta(n):'';
      btn.disabled=!n;
      btn.textContent='▶ Şimdi İzle';
      btn.onclick=()=>n&&typeof openDetail==='function'&&openDetail(n);
      return true;
    }catch{return false}
  }

  function patchNextWatch(){
    try{
      const original=window.nextWatch;
      if(typeof original!=='function'||original.__mcuScopedNext1618)return;
      const wrapped=function(...args){
        if(applyScopedNextWatch())return;
        return original.apply(this,args);
      };
      wrapped.__mcuScopedNext1618=true;
      wrapped.__mcuOriginal=original;
      window.nextWatch=wrapped;
    }catch{}
  }

  function patchUpdateProgress(){
    try{
      const original=window.updateProgress;
      if(typeof original!=='function'||original.__mcuListStats1618)return;
      const wrapped=function(...args){
        const r=original.apply(this,args);
        applyScopedStats();
        applyScopedNextWatch();
        return r;
      };
      wrapped.__mcuListStats1618=true;
      wrapped.__mcuOriginal=original;
      window.updateProgress=wrapped;
    }catch{}
  }

  function install(){
    patchNextWatch();
    patchUpdateProgress();
    applyScopedStats();
    applyScopedNextWatch();
  }

  install();
  setTimeout(install,250);
  setTimeout(install,900);
  setTimeout(install,1800);
  document.addEventListener('click',()=>setTimeout(install,40),true);
  window.addEventListener('focus',install,{passive:true});
})();