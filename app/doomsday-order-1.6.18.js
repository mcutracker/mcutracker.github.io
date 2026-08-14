(()=>{
  'use strict';
  if(window.__MCU_DOOMSDAY_ORDER_1618__)return;
  window.__MCU_DOOMSDAY_ORDER_1618__=true;

  const ordered=[
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
    {t:'Loki S1',w:'Loki (TV series)'},
    {t:'WandaVision',w:'WandaVision'},
    {t:'Shang-Chi',w:'Shang-Chi and the Legend of the Ten Rings'},
    {t:'The Falcon and the Winter Soldier',w:'The Falcon and the Winter Soldier'},
    {t:'Spider-Man: Far From Home',w:'Spider-Man: Far From Home'},
    {t:'Eternals',w:'Eternals (film)'},
    {t:'Spider-Man: No Way Home',w:'Spider-Man: No Way Home'},
    {t:'Doctor Strange in the Multiverse of Madness',w:'Doctor Strange in the Multiverse of Madness'},
    {t:'Hawkeye',w:'Hawkeye (miniseries)'},
    {t:'Moon Knight',w:'Moon Knight (TV series)'},
    {t:'Black Panther: Wakanda Forever',w:'Black Panther: Wakanda Forever'},
    {t:'Echo',w:'Echo (miniseries)'},
    {t:'She-Hulk',w:'She-Hulk: Attorney at Law'},
    {t:'Ms. Marvel',w:'Ms. Marvel (miniseries)'},
    {t:'Thor: Love and Thunder',w:'Thor: Love and Thunder'},
    {t:'Ironheart',w:'Ironheart (TV series)'},
    {t:'Werewolf by Night',w:'Werewolf by Night (TV special)'},
    {t:'Guardians Holiday Special',w:'The Guardians of the Galaxy Holiday Special'},
    {t:'Secret Invasion',w:'Secret Invasion (miniseries)'},
    {t:'Loki S2',w:'Loki season 2'},
    {t:'Agatha All Along',w:'Agatha All Along'},
    {t:'Daredevil: Born Again S1',w:'Daredevil: Born Again'},
    {t:'Captain America: Brave New World',w:'Captain America: Brave New World'},
    {t:'Thunderbolts*',w:'Thunderbolts* (film)'},
    {t:'The Fantastic Four: First Steps',w:'The Fantastic Four: First Steps'}
  ];

  function patch(){
    try{
      if(typeof DOOMSDAY_DATA!=='undefined'&&Array.isArray(DOOMSDAY_DATA)){
        DOOMSDAY_DATA.splice(0,DOOMSDAY_DATA.length,...ordered.map(x=>({...x})));
        if(typeof DATA!=='undefined'&&DATA)DATA.doomsday=DOOMSDAY_DATA;
      }
      if(typeof TITLES!=='undefined'&&TITLES)TITLES.doomsday='DOOMSDAY İÇİN İZLEMEN GEREKENLER';
      const btn=document.querySelector('[data-cat="doomsday"]');
      if(btn)btn.textContent='⚡ Doomsday İçin İzlemen Gerekenler';
      if(typeof currentCategory!=='undefined'&&currentCategory==='doomsday'&&typeof renderCurrent==='function')renderCurrent(false);
    }catch{}
  }

  patch();
  setTimeout(patch,250);
  setTimeout(patch,900);
  document.addEventListener('click',()=>setTimeout(patch,0),true);
  window.addEventListener('focus',patch,{passive:true});
})();
