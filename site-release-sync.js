(()=>{
  'use strict';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  async function json(url){
    const r=await fetch(url+'?t='+Date.now(),{cache:'no-store'});
    if(!r.ok)throw new Error('HTTP '+r.status);
    return r.json();
  }

  function ensureMaintenanceUI(){
    if(document.getElementById('bakim'))return;
    const section=document.createElement('section');
    section.className='section';
    section.id='bakim';
    section.innerHTML='<div class="wrap"><h2>Son bakım ve düzeltmeler</h2><p class="lead">Sürüm numarası değişmese bile uygulamada yapılan arayüz, hesap ve altyapı düzeltmeleri burada yayınlanır.</p><div class="release" id="siteMaintenanceList"><div class="rel"><div><b>Bakım bilgisi yükleniyor…</b></div><span>Fix</span></div></div></div>';
    const releases=document.getElementById('surumler');
    if(releases?.parentNode)releases.parentNode.insertBefore(section,releases);
    else document.querySelector('main')?.appendChild(section);
  }

  function renderMaintenance(feed){
    ensureMaintenanceUI();
    const list=document.getElementById('siteMaintenanceList');
    const entries=Array.isArray(feed?.entries)?feed.entries:[];
    if(!list)return;
    if(!entries.length){
      list.innerHTML='<div class="rel"><div><b>Bakım kaydı yok.</b><br><small>Yeni bir düzeltme yayınlandığında burada görünecek.</small></div><span>Güncel</span></div>';
      return;
    }
    list.innerHTML=entries.slice(0,6).map((entry,i)=>{
      const items=(entry.items||[]).slice(0,4).map(x=>`<li>${esc(String(x).replace(/ovztur/gi,'Ana Admin'))}</li>`).join('');
      return `<div class="rel"><div><b>${esc(entry.title||'Bakım')}</b><br><small>${esc(entry.date||'')}</small>${items?`<ul style="margin:8px 0 0;padding-left:18px">${items}</ul>`:''}</div><span>${i===0?'Son Fix':'Bakım'}</span></div>`;
    }).join('');
  }

  async function syncReleaseInfo(){
    ensureMaintenanceUI();
    try{
      const [manifest,changelog,maintenance]=await Promise.all([
        json('app/latest.json'),
        json('app/changelog.json'),
        json('site-updates.json').catch(()=>({entries:[]}))
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
      if(latestTitle&&latest)latestTitle.textContent=`v${latest.version} • ${latest.title||'Güncelleme'}`;
      if(latestItems&&latest)latestItems.innerHTML=(latest.items||[]).slice(0,4).map(x=>`<li>${esc(String(x).replace(/ovztur/gi,'Ana Admin'))}</li>`).join('');

      renderMaintenance(maintenance);

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

  function start(){ensureMaintenanceUI();syncReleaseInfo();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();