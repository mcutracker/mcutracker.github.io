(()=>{
  'use strict';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let deferredInstallPrompt=null;

  const isStandalone=()=>window.matchMedia?.('(display-mode: standalone)')?.matches||window.navigator.standalone===true;
  const isEdge=()=>/Edg\//.test(navigator.userAgent);
  const isChromium=()=>/Chrome\//.test(navigator.userAgent)||isEdge();

  function installStatus(text){
    const el=document.getElementById('pwaInstallStatus');
    if(el)el.textContent=text;
  }

  function updateInstallButton(){
    const btn=document.getElementById('pwaInstallBtn');
    if(!btn)return;
    if(isStandalone()){
      btn.textContent='✅ Windows’a Kuruldu';
      btn.setAttribute('aria-disabled','true');
    }else{
      btn.textContent='🪟 Windows’a Kur';
      btn.removeAttribute('aria-disabled');
    }
  }

  function ensureInstallUI(){
    const actions=document.querySelector('.actions');
    if(actions&&!document.getElementById('pwaInstallBtn')){
      const btn=document.createElement('button');
      btn.id='pwaInstallBtn';
      btn.type='button';
      btn.className='btn secondary';
      btn.style.cursor='pointer';
      btn.textContent='🪟 Windows’a Kur';
      const first=actions.querySelector('.btn');
      if(first?.nextSibling)actions.insertBefore(btn,first.nextSibling);else actions.appendChild(btn);
      btn.addEventListener('click',installPwa);
    }

    const meta=document.querySelector('.downloadmeta');
    if(meta)meta.textContent='Windows’ta Edge veya Chrome üzerinden uygulama olarak kurulabilir. EXE gerekmez; güncellemeler web üzerinden gelir.';

    if(!document.getElementById('windows-kurulum')){
      const features=document.getElementById('ozellikler');
      if(features){
        const section=document.createElement('section');
        section.className='section';
        section.id='windows-kurulum';
        section.innerHTML=`<div class="wrap"><h2>Windows’a uygulama olarak kur.</h2><p class="lead">MCU Tracker’ı EXE indirmeden, Microsoft Edge veya Google Chrome üzerinden masaüstü uygulaması gibi kurabilirsin.</p><div class="cards"><div class="card"><b>1. MCU Tracker’ı aç</b><p>Önce web uygulamasını tarayıcıda aç. Hesabın ve ilerlemen aynı web uygulamasında çalışır.</p></div><div class="card"><b>2. “Windows’a Kur”a bas</b><p>Tarayıcı kurulum penceresini destekliyorsa yukarıdaki buton kurulum istemini doğrudan açar.</p></div><div class="card"><b>3. Gerekirse tarayıcı menüsünü kullan</b><p>Edge: adres çubuğundaki uygulama yükleme simgesi veya <b>⋯ → Uygulamalar → Bu siteyi uygulama olarak yükle</b>. Chrome: adres çubuğundaki yükleme simgesi.</p></div></div><div class="privacy-note" id="pwaInstallStatus">${isStandalone()?'✅ MCU Tracker bu cihazda uygulama olarak çalışıyor.':isChromium()?'Hazır. “Windows’a Kur” butonuna basabilirsin.':'En iyi kurulum deneyimi için Microsoft Edge veya Google Chrome kullan.'}</div></div>`;
        features.parentNode.insertBefore(section,features);
      }
    }
    updateInstallButton();
  }

  async function installPwa(){
    ensureInstallUI();
    if(isStandalone()){
      installStatus('✅ MCU Tracker zaten bu cihazda uygulama olarak kurulu.');
      return;
    }
    if(deferredInstallPrompt){
      const prompt=deferredInstallPrompt;
      deferredInstallPrompt=null;
      try{
        prompt.prompt();
        const choice=await prompt.userChoice;
        if(choice?.outcome==='accepted')installStatus('Kurulum onaylandı. MCU Tracker Windows uygulamaları arasında görünecek.');
        else installStatus('Kurulum iptal edildi. İstediğinde tekrar deneyebilirsin.');
      }catch{
        installStatus('Otomatik kurulum penceresi açılamadı. Aşağıdaki Edge/Chrome adımlarını kullan.');
      }
      return;
    }
    document.getElementById('windows-kurulum')?.scrollIntoView({behavior:'smooth',block:'start'});
    if(isEdge())installStatus('Edge’de adres çubuğundaki uygulama yükleme simgesini kullan. Simge görünmüyorsa ⋯ → Uygulamalar → Bu siteyi uygulama olarak yükle yolunu aç.');
    else if(isChromium())installStatus('Chrome’da adres çubuğundaki uygulama yükleme simgesini kullan.');
    else installStatus('Bu tarayıcı otomatik PWA kurulumunu sunmuyor. Microsoft Edge veya Google Chrome ile bu sayfayı aç.');
  }

  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    deferredInstallPrompt=event;
    ensureInstallUI();
    installStatus('Hazır. “Windows’a Kur” butonuna basarak kurulumu başlatabilirsin.');
  });

  window.addEventListener('appinstalled',()=>{
    deferredInstallPrompt=null;
    updateInstallButton();
    installStatus('✅ MCU Tracker başarıyla Windows’a kuruldu. Başlat menüsünden açabilirsin.');
  });

  async function json(url){
    const r=await fetch(url+'?t='+Date.now(),{cache:'no-store'});
    if(!r.ok)throw new Error('HTTP '+r.status);
    return r.json();
  }

  async function syncReleaseInfo(){
    ensureInstallUI();
    try{
      const [manifest,changelog]=await Promise.all([
        json('app/latest.json'),
        json('app/changelog.json')
      ]);
      const version=String(manifest?.version||changelog?.latest||'').trim();
      if(version){
        document.querySelectorAll('[data-current-version]').forEach(el=>el.textContent='v'+version);
        document.title='MCU Tracker Ultimate • v'+version;
      }

      const entries=Array.isArray(changelog?.entries)?changelog.entries:[];
      const latest=entries[0];
      const latestTitle=document.getElementById('siteLatestTitle');
      const latestItems=document.getElementById('siteLatestItems');
      if(latestTitle&&latest){
        latestTitle.textContent=`v${latest.version} • ${latest.title||'Güncelleme'}`;
      }
      if(latestItems&&latest){
        latestItems.innerHTML=(latest.items||[]).slice(0,4).map(x=>`<li>${esc(String(x).replace(/ovztur/gi,'Ana Admin'))}</li>`).join('');
      }

      const release=document.getElementById('siteReleaseList');
      if(release&&entries.length){
        release.innerHTML=entries.slice(0,6).map((entry,i)=>{
          const first=(entry.items||[])[0]||'';
          return `<div class="rel"><div><b>v${esc(entry.version)}</b><br><small>${esc(String(entry.title||first||'Güncelleme').replace(/ovztur/gi,'Ana Admin'))}</small></div><span>${i===0?'Güncel':'Önceki'}</span></div>`;
        }).join('');
      }
    }catch(err){
      console.warn('Site sürüm bilgisi alınamadı:',err);
    }
  }

  function start(){ensureInstallUI();syncReleaseInfo();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
