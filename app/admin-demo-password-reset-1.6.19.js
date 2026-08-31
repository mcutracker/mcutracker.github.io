(()=>{
  'use strict';
  if(window.__MCU_ADMIN_DEMO_PASSWORD_RESET_1619__)return;
  window.__MCU_ADMIN_DEMO_PASSWORD_RESET_1619__=true;

  const ENDPOINT='https://svnrfyqloiludzvnylyp.supabase.co/functions/v1/mcu-admin';
  const TOKEN_KEY='MCU_TRACKER_CLOUD_TOKEN_V1';
  const DEMO='mcu_demo_2026';

  function isSuperAdmin(){
    try{
      return String(currentUser?.username||'').trim().toLowerCase()==='ovztur'||currentUser?.isPrimaryAdmin===true;
    }catch{return false}
  }

  function makePassword(){
    const bytes=new Uint8Array(5);
    crypto.getRandomValues(bytes);
    const tail=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
    return 'DemoMCU!'+tail;
  }

  async function reset(){
    if(!isSuperAdmin())return;
    if(!confirm('Demo hesabı için yeni bir şifre oluşturulsun mu? Eski demo oturumları kapatılacak.'))return;
    const token=localStorage.getItem(TOKEN_KEY)||'';
    if(!token){alert('Ana Admin oturumu bulunamadı.');return;}
    const password=makePassword();
    const btn=document.getElementById('mcuDemoPasswordResetBtn');
    if(btn){btn.disabled=true;btn.textContent='Şifre yenileniyor…'}
    try{
      const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'reset_password',token,username:DEMO,password}),cache:'no-store'});
      const j=await r.json().catch(()=>({ok:false,error:'bad_response'}));
      if(!j?.ok){
        alert(j?.error==='forbidden'?'Bu işlem yalnızca Ana Admin hesabında kullanılabilir.':'Demo şifresi yenilenemedi.');
        return;
      }
      try{await navigator.clipboard?.writeText(password)}catch{}
      prompt('✅ Demo şifresi yenilendi. Yeni şifre aşağıda. Panoya da kopyalanmaya çalışıldı:',password);
    }catch{
      alert('Demo şifresi yenilenemedi. Ağ bağlantısını kontrol et.');
    }finally{
      if(btn){btn.disabled=false;btn.textContent='🔑 Demo Şifresini Yenile'}
    }
  }

  function inject(){
    if(!isSuperAdmin())return;
    const host=document.getElementById('movieList');
    if(!host)return;
    if((document.getElementById('subtitle')?.textContent||'').trim().toLocaleUpperCase('tr-TR')!=='ADMIN MERKEZİ')return;
    if(document.getElementById('mcuDemoPasswordResetBtn'))return;
    const rows=[...host.querySelectorAll('section.panel,div.panel')];
    const row=rows.find(el=>(el.textContent||'').toLowerCase().includes('@'+DEMO));
    if(!row)return;
    const controls=row.lastElementChild instanceof HTMLElement?row.lastElementChild:row;
    const btn=document.createElement('button');
    btn.id='mcuDemoPasswordResetBtn';
    btn.type='button';
    btn.className='secondary';
    btn.textContent='🔑 Demo Şifresini Yenile';
    btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();reset()},true);
    controls.appendChild(btn);
  }

  const observer=new MutationObserver(()=>inject());
  const start=()=>{
    observer.observe(document.body||document.documentElement,{childList:true,subtree:true});
    inject();setTimeout(inject,300);setTimeout(inject,1000);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.addEventListener('focus',inject,{passive:true});
})();