(()=>{
  'use strict';
  if(window.__MCU_SERIES_RUNTIME_1618__)return;
  window.__MCU_SERIES_RUNTIME_1618__=true;

  const RUNTIMES={
    'WandaVision':[322],
    'The Falcon and the Winter Soldier':[302],
    'Loki':[285,297],
    'What If...?':[283,271,235],
    'Hawkeye':[279],
    'Moon Knight':[287],
    'Ms. Marvel':[271],
    'She-Hulk: Attorney at Law':[285],
    'Secret Invasion':[260],
    'Echo':[203],
    'Agatha All Along':[357],
    'Daredevil: Born Again':[430,389],
    'Ironheart':[289],
    'Eyes of Wakanda':[114],
    'Marvel Zombies':[125],
    'Your Friendly Neighborhood Spider-Man':[280,null],
    'Wonder Man':[250]
  };
  const APPROX={
    'Your Friendly Neighborhood Spider-Man':{1:true}
  };

  // Tam MCU kronolojisinde tek kart olarak gösterilen dizi sezonlarının toplam süreleri.
  const TIMELINE_RUNTIMES={
    'Eyes of Wakanda':114,
    'I Am Groot S1':20,
    'I Am Groot S2':20,
    'Daredevil S1':700,
    'Jessica Jones S1':666,
    'Daredevil S2':700,
    'Luke Cage S1':703,
    'Iron Fist S1':712,
    'The Defenders':393,
    'The Punisher S1':676,
    'Jessica Jones S2':662,
    'Luke Cage S2':761,
    'Iron Fist S2':516,
    'Daredevil S3':655,
    'The Punisher S2':681,
    'Jessica Jones S3':648,
    'Loki S1':285,
    'What If...? S1':283,
    'Marvel Zombies':125,
    'WandaVision':322,
    'The Falcon and the Winter Soldier':302,
    'Hawkeye':279,
    'Moon Knight':287,
    'Echo':203,
    'She-Hulk: Attorney at Law':285,
    'Ms. Marvel':271,
    'Ironheart':289,
    'Secret Invasion':260,
    'Loki S2':297,
    'What If...? S2':271,
    'Agatha All Along':357,
    'What If...? S3':235,
    'Daredevil: Born Again S1':430,
    'Wonder Man':250,
    'Daredevil: Born Again S2':389
  };

  window.MCU_SERIES_RUNTIMES_1618=RUNTIMES;
  window.MCU_TIMELINE_SERIES_RUNTIMES_1618=TIMELINE_RUNTIMES;

  const fmt=min=>{
    min=Number(min)||0;
    if(!min)return '';
    const h=Math.floor(min/60),m=min%60;
    return h?(m?`${h} sa ${m} dk`:`${h} sa`):`${m} dk`;
  };
  const seasonMinutes=(title,season)=>RUNTIMES[title]?.[season-1]??null;
  const knownTotal=title=>(RUNTIMES[title]||[]).reduce((n,v)=>n+(Number(v)||0),0);
  const knownCount=title=>(RUNTIMES[title]||[]).filter(v=>Number(v)>0).length;

  function enhanceSeriesView(){
    try{
      if(typeof currentCategory!=='undefined'&&currentCategory!=='series')return;
      const cards=[...document.querySelectorAll('#movieList .series-card')];
      cards.forEach(card=>{
        const name=card.querySelector('.series-name')?.textContent?.trim()||'';
        if(!name||!RUNTIMES[name])return;
        const summary=card.querySelector('summary');
        const total=knownTotal(name),known=knownCount(name),all=(RUNTIMES[name]||[]).length;
        let badge=card.querySelector('.mcu-series-runtime-total');
        if(!badge&&summary){
          badge=document.createElement('small');
          badge.className='mcu-series-runtime-total';
          badge.style.cssText='margin-left:auto;margin-right:8px;color:#aeb3bf;font-weight:700;white-space:nowrap';
          const arrow=summary.querySelector('.season-arrow');
          if(arrow)summary.insertBefore(badge,arrow);else summary.appendChild(badge);
        }
        if(badge){
          const partial=known<all?' • yayınlanan sezonlar':'';
          badge.textContent=total?`⏱ ${fmt(total)}${partial}`:'⏱ Süre bekleniyor';
        }
        [...card.querySelectorAll('.season-row')].forEach((row,i)=>{
          const season=i+1,mins=seasonMinutes(name,season),status=row.querySelector('small');
          if(!status)return;
          const done=!!row.querySelector('input[type="checkbox"]')?.checked;
          if(mins){
            const approx=APPROX[name]?.[season]?'yakl. ':'';
            status.textContent=`${done?'Tamamlandı':'İzlenmedi'} • ⏱ ${approx}${fmt(mins)}`;
          }else{
            status.textContent=`${done?'Tamamlandı':'İzlenmedi'} • ⏱ Süre henüz açıklanmadı`;
          }
        });
      });
      const host=document.getElementById('movieList');
      if(host&&!document.getElementById('mcuSeriesRuntimeNote')){
        const note=document.createElement('section');
        note.id='mcuSeriesRuntimeNote';
        note.className='panel';
        note.innerHTML='<p class="meta" style="margin:0">⏱ Dizi süreleri sezon içindeki bölüm sürelerinin toplamıdır. Yayınlanmamış sezonlarda süre, bölüm süreleri belli olana kadar gösterilmez.</p>';
        host.appendChild(note);
      }
    }catch{}
  }

  function watchedSeriesMinutes(){
    try{
      if(typeof SERIES==='undefined'||!Array.isArray(SERIES)||typeof watched!=='function'||typeof idOf!=='function')return 0;
      return SERIES.reduce((sum,show)=>{
        for(let s=1;s<=show.seasons;s++)if(watched(idOf(show,'series',s)))sum+=Number(seasonMinutes(show.t,s))||0;
        return sum;
      },0);
    }catch{return 0}
  }
  function totalSeriesMinutes(){
    try{
      if(typeof SERIES==='undefined'||!Array.isArray(SERIES))return 0;
      return SERIES.reduce((sum,show)=>sum+knownTotal(show.t),0);
    }catch{return 0}
  }

  function enhanceStats(){
    try{
      if(typeof currentCategory!=='undefined'&&currentCategory!=='stats')return;
      const grid=document.querySelector('#movieList .metric-grid');
      if(!grid)return;
      grid.querySelectorAll('[data-series-runtime-1618]').forEach(x=>x.remove());
      const watchedMin=watchedSeriesMinutes(),totalMin=totalSeriesMinutes();
      const a=document.createElement('div');a.className='metric-card';a.dataset.seriesRuntime1618='1';a.innerHTML=`<b>${fmt(watchedMin)||'0 dk'}</b><small>İzlenen dizi süresi</small>`;
      const b=document.createElement('div');b.className='metric-card';b.dataset.seriesRuntime1618='1';b.innerHTML=`<b>${fmt(totalMin)}</b><small>Bilinen toplam dizi süresi</small>`;
      grid.append(a,b);
    }catch{}
  }

  function patchItemMeta(){
    try{
      const original=window.itemMeta;
      if(typeof original!=='function'||original.__mcuSeriesRuntime1618)return;
      const wrapped=function(item){
        const base=original.apply(this,arguments);
        const mins=Number(TIMELINE_RUNTIMES[item?.t]||0);
        if(!mins)return base;
        const duration=`⏱ ${fmt(mins)}`;
        if(String(base).includes('Süre bilgisi yok'))return String(base).replace('Süre bilgisi yok',duration);
        if(String(base).includes(duration))return base;
        return `${base} • ${duration}`;
      };
      wrapped.__mcuSeriesRuntime1618=true;
      wrapped.__mcuOriginal=original;
      window.itemMeta=wrapped;
    }catch{}
  }

  function wrap(name,after){
    try{
      const original=window[name];
      if(typeof original!=='function'||original.__mcuSeriesRuntime1618)return;
      const wrapped=function(...args){
        const r=original.apply(this,args);
        setTimeout(after,0);
        return r;
      };
      wrapped.__mcuSeriesRuntime1618=true;
      wrapped.__mcuOriginal=original;
      window[name]=wrapped;
    }catch{}
  }

  function install(){
    patchItemMeta();
    wrap('renderSeries',enhanceSeriesView);
    wrap('renderStats',enhanceStats);
    if(typeof currentCategory!=='undefined'&&currentCategory==='series')setTimeout(enhanceSeriesView,0);
    if(typeof currentCategory!=='undefined'&&currentCategory==='stats')setTimeout(enhanceStats,0);
  }

  install();
  setTimeout(install,300);
  setTimeout(install,1200);
  document.addEventListener('click',()=>setTimeout(()=>{install();enhanceSeriesView();enhanceStats()},0),true);
  window.addEventListener('focus',()=>{install();enhanceSeriesView();enhanceStats()},{passive:true});
})();
