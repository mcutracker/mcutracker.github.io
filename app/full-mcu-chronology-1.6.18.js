(()=>{
'use strict';
if(window.__MCU_FULL_CHRONOLOGY_1618__)return;
window.__MCU_FULL_CHRONOLOGY_1618__=true;
const wikiAliases={'Black Widow':'Black Widow (2021 film)'};
const full=[
'Eyes of Wakanda','Captain America: The First Avenger','Marvel Studios One Shot: Agent Carter','Captain Marvel','Iron Man','Iron Man 2','The Incredible Hulk','Marvel Studios One Shot: A Funny Thing Happened on the Way to Thor’s Hammer','Thor','Marvel Studios One Shot: The Consultant','The Avengers','Marvel Studios One Shot: Item 47','Thor: The Dark World','Iron Man 3','Marvel Studios One Shot: All Hail the King','Captain America: The Winter Soldier','Guardians of the Galaxy','Guardians of the Galaxy Vol. 2','I Am Groot S1','I Am Groot S2','Daredevil S1','Jessica Jones S1','Avengers: Age of Ultron','Ant-Man','Daredevil S2','Luke Cage S1','Iron Fist S1','The Defenders','Captain America: Civil War','Black Widow','Black Panther','Spider-Man: Homecoming','The Punisher S1','Doctor Strange','Jessica Jones S2','Luke Cage S2','Iron Fist S2','Daredevil S3','Thor: Ragnarok','The Punisher S2','Jessica Jones S3','Ant-Man and the Wasp','Avengers: Infinity War','Avengers: Endgame','Loki S1','What If...? S1','Marvel Zombies','WandaVision','Shang-Chi and the Legend of the Ten Rings','The Falcon and the Winter Soldier','Spider-Man: Far From Home','Eternals','Spider-Man: No Way Home','Doctor Strange in the Multiverse of Madness','Hawkeye','Moon Knight','Black Panther: Wakanda Forever','Echo','She-Hulk: Attorney at Law','Ms. Marvel','Thor: Love and Thunder','Ironheart','Werewolf By Night','The Guardians of the Galaxy Holiday Special','Ant-Man and the Wasp: Quantumania','Guardians of the Galaxy Vol. 3','Secret Invasion','The Marvels','Loki S2','What If...? S2','Deadpool & Wolverine','Agatha All Along','What If...? S3','Daredevil: Born Again S1','Captain America: Brave New World','Thunderbolts*','The Fantastic Four: First Steps','Wonder Man','Daredevil: Born Again S2','The Punisher: One Last Kill'
].map(t=>({t,w:wikiAliases[t]||t}));
let fullMode=false;
window.__MCU_FULL_MODE_1618__=false;

function setFullMode(v){
  fullMode=!!v;
  window.__MCU_FULL_MODE_1618__=fullMode;
}

function rememberBase(){
  if(!window.__MCU_DOOMSDAY_BASE_1618__&&typeof DOOMSDAY_DATA!=='undefined'&&Array.isArray(DOOMSDAY_DATA)){
    window.__MCU_DOOMSDAY_BASE_1618__=DOOMSDAY_DATA.map(x=>({...x}));
  }
}

function restoreBase(render=false){
  try{
    if(window.__MCU_DOOMSDAY_BASE_1618__&&typeof DOOMSDAY_DATA!=='undefined'){
      DOOMSDAY_DATA.splice(0,DOOMSDAY_DATA.length,...window.__MCU_DOOMSDAY_BASE_1618__.map(x=>({...x})));
      if(typeof DATA!=='undefined')DATA.doomsday=DOOMSDAY_DATA;
    }
    if(typeof TITLES!=='undefined')TITLES.doomsday='DOOMSDAY İÇİN İZLEMEN GEREKENLER';
    if(render&&typeof currentCategory!=='undefined'&&currentCategory==='doomsday'&&typeof renderCurrent==='function')renderCurrent(false);
  }catch{}
}

function addButton(){
 if(typeof currentCategory==='undefined'||currentCategory!=='doomsday')return;
 const list=document.getElementById('movieList'); if(!list)return;
 let wrap=document.getElementById('fullMcuMode1618');
 if(!wrap){wrap=document.createElement('div');wrap.id='fullMcuMode1618';wrap.style.cssText='margin:0 0 18px;display:flex;gap:10px;flex-wrap:wrap;align-items:center';list.parentNode.insertBefore(wrap,list);}
 wrap.innerHTML=`<button id="fullMcuToggle1618" class="${fullMode?'active':''}" type="button">${fullMode?'⚡ Doomsday Listesine Dön':'🌌 Ben Her Şeye Hâkim Olmak İstiyorum'}</button><span class="meta">${fullMode?'Tüm MCU yapımları • gönderdiğin 1–80 kronolojik sıra':'Film + dizi + özel yapımların tamamını kronolojik sırayla göster'}</span>`;
 document.getElementById('fullMcuToggle1618').onclick=()=>{setFullMode(!fullMode);applyMode();};
}
function applyMode(){
 try{
  if(typeof currentCategory==='undefined'||currentCategory!=='doomsday'){
    if(fullMode)restoreBase(false);
    setFullMode(false);
    document.getElementById('fullMcuMode1618')?.remove();
    return;
  }
  rememberBase();
  if(fullMode&&typeof DOOMSDAY_DATA!=='undefined'){
   DOOMSDAY_DATA.splice(0,DOOMSDAY_DATA.length,...full.map(x=>({...x})));
   if(typeof DATA!=='undefined')DATA.doomsday=DOOMSDAY_DATA;
   if(typeof TITLES!=='undefined')TITLES.doomsday='TAM MCU KRONOLOJİSİ — HER ŞEYE HÂKİM OL';
  }else{
   restoreBase(false);
  }
  if(typeof renderCurrent==='function')renderCurrent(false);
  setTimeout(addButton,0);
 }catch{}
}
function watch(){
 if(typeof currentCategory!=='undefined'&&currentCategory==='doomsday')addButton();
 else{
   if(fullMode)restoreBase(false);
   setFullMode(false);
   document.getElementById('fullMcuMode1618')?.remove();
 }
}
setTimeout(watch,400);setTimeout(watch,1200);
document.addEventListener('click',()=>setTimeout(watch,30),true);
window.addEventListener('focus',watch,{passive:true});
})();