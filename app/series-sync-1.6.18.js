(()=>{
  'use strict';
  if(window.__MCU_SERIES_SYNC_1618__)return;
  window.__MCU_SERIES_SYNC_1618__=true;

  const EXTRA_SERIES=[
    {t:'I Am Groot',seasons:2,w:'I Am Groot'},
    {t:'Daredevil',seasons:3,w:'Daredevil (TV series)'},
    {t:'Jessica Jones',seasons:3,w:'Jessica Jones (TV series)'},
    {t:'Luke Cage',seasons:2,w:'Luke Cage (TV series)'},
    {t:'Iron Fist',seasons:2,w:'Iron Fist (TV series)'},
    {t:'The Defenders',seasons:1,w:'The Defenders (miniseries)'},
    {t:'The Punisher',seasons:2,w:'The Punisher (TV series)'}
  ];

  const MAP={
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

  const reverse={};
  Object.entries(MAP).forEach(([timeline,[show,season]])=>{
    const k=show+'|'+season;
    (reverse[k]||(reverse[k]=[])).push(timeline);
  });

  function ensureSeries(){
    try{
      if(typeof SERIES==='undefined'||!Array.isArray(SERIES))return;
      EXTRA_SERIES.forEach(show=>{
        if(!SERIES.some(x=>x.t===show.t))SERIES.push({...show});
      });
      if(typeof DATA!=='undefined'&&DATA)DATA.series=SERIES;
    }catch{}
  }

  const movieKey=title=>'movie|'+title+'|';
  const seriesKey=(show,season)=>'series|'+show+'|'+season;

  function timelineMapping(item){
    return item?.t&&MAP[item.t]?MAP[item.t]:null;
  }

  function patchSetters(){
    try{
      const movieOriginal=window.setMovieWatched;
      const seriesOriginal=window.setSeriesWatched;
      if(typeof movieOriginal==='function'&&!movieOriginal.__mcuSeriesSync1618&&typeof seriesOriginal==='function'){
        const wrappedMovie=function(item,value){
          const r=movieOriginal.apply(this,arguments);
          const m=timelineMapping(item);
          if(m){
            const show=typeof SERIES!=='undefined'&&SERIES.find(x=>x.t===m[0]);
            if(show)seriesOriginal(show,m[1],!!value);
            else if(typeof state!=='undefined'&&state?.watched)state.watched[seriesKey(m[0],m[1])]=!!value;
          }
          return r;
        };
        wrappedMovie.__mcuSeriesSync1618=true;
        wrappedMovie.__mcuOriginal=movieOriginal;
        window.setMovieWatched=wrappedMovie;
      }
      const currentSeriesOriginal=window.setSeriesWatched;
      if(typeof currentSeriesOriginal==='function'&&!currentSeriesOriginal.__mcuSeriesSync1618){
        const wrappedSeries=function(show,season,value){
          const r=currentSeriesOriginal.apply(this,arguments);
          try{
            const titles=reverse[(show?.t||'')+'|'+season]||[];
            if(typeof state!=='undefined'&&state?.watched)titles.forEach(t=>state.watched[movieKey(t)]=!!value);
          }catch{}
          return r;
        };
        wrappedSeries.__mcuSeriesSync1618=true;
        wrappedSeries.__mcuOriginal=currentSeriesOriginal;
        window.setSeriesWatched=wrappedSeries;
      }
    }catch{}
  }

  function syncExisting(){
    try{
      if(typeof state==='undefined'||!state?.watched)return;
      let changed=false;
      Object.entries(MAP).forEach(([timeline,[show,season]])=>{
        const mk=movieKey(timeline),sk=seriesKey(show,season);
        const on=!!state.watched[mk]||!!state.watched[sk];
        if(on){
          if(!state.watched[mk]){state.watched[mk]=true;changed=true}
          if(!state.watched[sk]){state.watched[sk]=true;changed=true}
        }
      });
      if(changed&&typeof save==='function')save();
    }catch{}
  }

  function install(){
    ensureSeries();
    patchSetters();
    syncExisting();
  }

  install();
  setTimeout(install,250);
  setTimeout(install,900);
  setTimeout(install,2200);
  document.addEventListener('click',()=>setTimeout(install,0),true);
  window.addEventListener('focus',install,{passive:true});
})();
