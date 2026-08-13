(()=>{
  'use strict';

  const ENDPOINT='https://svnrfyqloiludzvnylyp.supabase.co/functions/v1/mcu-admin';
  const TOKEN_KEY='MCU_TRACKER_CLOUD_TOKEN_V1';
  const USERS_KEY='MCU_TRACKER_USERS_V1';
  const SESSION_KEY='MCU_TRACKER_SESSION_V1';
  const STATE_PREFIX='MCU_TRACKER_USER_STATE_V1_';
  const keyOf=v=>String(v||'').trim().toLocaleLowerCase('tr-TR');
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
  const token=()=>localStorage.getItem(TOKEN_KEY)||'';
  const readUsers=()=>{try{return JSON.parse(localStorage.getItem(USERS_KEY)||'{}')||{}}catch{return {}}};
  const writeUsers=u=>localStorage.setItem(USERS_KEY,JSON.stringify(u));

  function removeBulkWatchActions(){
    if(!document.getElementById('mcuBulkWatchHideStyle')){
      const style=document.createElement('style');
      style.id='mcuBulkWatchHideStyle';
      style.textContent='#allBtn,#noneBtn{display:none!important}';
      (document.head||document.documentElement).appendChild(style);
    }
    document.getElementById('allBtn')?.remove();
    document.getElementById('noneBtn')?.remove();
  }
  removeBulkWatchActions();

  async function api(action,extra={}){
    const t=token();
    if(!t)return{ok:false,error:'invalid_session'};
    try{
      const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,token:t,...extra}),cache:'no-store'});
      const j=await r.json().catch(()=>({ok:false,error:'bad_response'}));
      return j;
    }catch{return{ok:false,error:'network_error'}}
  }

  function applyCloudAccounts(accounts){
    if(!Array.isArray(accounts))return;
    const users=readUsers();
    for(const a of accounts){
      const k=keyOf(a.username);if(!k)continue;
      const old=users[k]||{};
      users[k]={...old,key:k,username:a.username,displayName:a.displayName||a.username,role:a.role==='superadmin'?'admin':(a.role||'user'),isPrimaryAdmin:a.role==='superadmin',cloud:true};
    }
    writeUsers(users);
    try{
      const k=localStorage.getItem(SESSION_KEY)||'';
      if(k&&users[k]&&typeof currentUser!=='undefined'&&currentUser){
        currentUser.role=users[k].role;
        currentUser.isPrimaryAdmin=users[k].isPrimaryAdmin;
        currentUser.displayName=users[k].displayName;
        if(typeof updateAccountUI==='function')updateAccountUI();
      }
    }catch{}
  }

  async function listCloudAccounts(){
    const j=await api('list');
    if(j?.ok)applyCloudAccounts(j.accounts);
    return j;
  }

  function roleLabel(a){return a.role==='superadmin'?'🛡️ Ana Admin':a.role==='admin'?'👑 Admin':'👤 Kullanıcı'}

  async function renderCloudAdmin(message=''){
    removeBulkWatchActions();
    const host=document.getElementById('movieList');
    if(!host)return;
    const subtitle=document.getElementById('subtitle');if(subtitle)subtitle.textContent='ADMIN MERKEZİ';
    document.querySelectorAll('.menu-category').forEach(b=>b.classList.toggle('active',b.id==='adminMenuBtn'));
    host.innerHTML='<section class="panel"><b>☁️ Ortak hesaplar yükleniyor…</b><div class="meta">Web ve Windows aynı hesap merkezini kullanır.</div></section>';
    document.getElementById('loadMore')?.classList.add('hidden');

    const j=await listCloudAccounts();
    if(!j?.ok){host.innerHTML='<section class="panel"><b>Hesap merkezi yüklenemedi.</b><div class="meta">Oturumunu yenileyip tekrar dene.</div></section>';return;}
    const accounts=Array.isArray(j.accounts)?j.accounts:[];
    const me=(()=>{try{return typeof currentUser!=='undefined'?currentUser:null}catch{return null}})();
    const superAdmin=keyOf(me?.username)==='ovztur'||me?.isPrimaryAdmin===true;
    const admins=accounts.filter(a=>a.role==='admin'||a.role==='superadmin').length;
    const rows=accounts.map(a=>{
      const primary=a.role==='superadmin'||keyOf(a.username)==='ovztur';
      const admin=a.role==='admin'||primary;
      const controls=primary?'<button class="secondary" disabled>Kalıcı Ana Admin</button>':superAdmin?`<div style="display:flex;gap:8px;flex-wrap:wrap"><button data-cloud-admin="${esc(a.username)}" data-make="${admin?'0':'1'}" class="${admin?'secondary':''}">${admin?'Adminliği Kaldır':'Admin Yap'}</button><button data-cloud-delete="${esc(a.username)}" class="secondary">🗑️ Hesabı Sil</button></div>`:'<span class="meta">Yetki yönetimi yalnızca Ana Admin hesabında.</span>';
      return `<div class="panel" style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap"><div><b>${esc(a.displayName||a.username)}</b> <span class="meta">@${esc(a.username)}</span><div style="margin-top:6px"><span class="role-badge ${admin?'admin':''}">${roleLabel(a)}</span></div></div><div>${controls}</div></div>`;
    }).join('');
    host.innerHTML=`<section class="profile-hero" style="grid-template-columns:72px 1fr"><div class="profile-avatar">☁️</div><div><div class="profile-name">Ortak Admin Merkezi</div><div class="profile-rank">Web + Windows</div><p class="meta" style="margin:8px 0 0">Toplam hesap: ${accounts.length} • Admin: ${admins} • Tüm platformlarda ortak</p>${message?`<div class="privacy-note" style="margin-top:10px">${esc(message)}</div>`:''}</div></section><section class="panel"><h3 style="margin-top:0">Tek Hesap Sistemi</h3><p>Bir kullanıcı hesabını yalnızca bir kez oluşturur. Aynı kullanıcı adı ve şifreyle webde, Windows uygulamasında ve başka cihazlarda giriş yapabilir.</p><p class="meta">Admin rolleri de bulutta tutulur. Burada yapılan yetki değişikliği diğer platformlarda da geçerlidir.</p></section>${rows||'<section class="panel">Henüz ortak hesap yok.</section>'}`;
    document.getElementById('loadMore')?.classList.add('hidden');
  }

  async function setAdmin(username,makeAdmin){
    const j=await api('set_admin',{username,makeAdmin});
    if(!j?.ok){await renderCloudAdmin('Yetki değiştirilemedi.');return;}
    await renderCloudAdmin(`@${username} ${makeAdmin?'Admin yapıldı.':'normal kullanıcı yapıldı.'}`);
  }

  async function deleteAccount(username){
    if(!confirm(`@${username} hesabı tüm platformlardan silinsin mi?`))return;
    if(!confirm('SON ONAY: Bu hesap ve buluttaki ilerlemesi kalıcı olarak silinecek.'))return;
    const j=await api('delete_account',{username});
    if(!j?.ok){await renderCloudAdmin('Hesap silinemedi.');return;}
    const users=readUsers(),k=keyOf(username);delete users[k];writeUsers(users);
    try{localStorage.removeItem(STATE_PREFIX+encodeURIComponent(k))}catch{}
    await renderCloudAdmin(`@${username} tüm platformlardan silindi.`);
  }

  async function deleteSelfCloud(){
    const me=(()=>{try{return typeof currentUser!=='undefined'?currentUser:null}catch{return null}})();
    if(!me||keyOf(me.username)==='ovztur'||me.isPrimaryAdmin)return;
    const label='@'+(me.username||'hesap');
    if(!confirm(`${label} hesabı tüm platformlardan silinsin mi?`))return;
    if(!confirm('SON ONAY: Hesap ve buluttaki izleme, favori, not, XP, kupa ve puan verileri kalıcı olarak silinecek.'))return;
    const j=await api('delete_self');
    if(!j?.ok){alert('Hesap silinemedi.');return;}
    const users=readUsers(),k=keyOf(me.username);delete users[k];writeUsers(users);
    try{localStorage.removeItem(STATE_PREFIX+encodeURIComponent(k))}catch{}
    localStorage.removeItem(TOKEN_KEY);localStorage.removeItem(SESSION_KEY);
    location.reload();
  }

  document.addEventListener('click',e=>{
    removeBulkWatchActions();
    const target=e.target instanceof Element?e.target:null;if(!target)return;
    const adminMenu=target.closest('#adminMenuBtn');
    if(adminMenu&&token()){
      e.preventDefault();e.stopImmediatePropagation();
      try{document.getElementById('sideMenu')?.classList.remove('open');document.getElementById('menuOverlay')?.classList.remove('open')}catch{}
      renderCloudAdmin();return;
    }
    const roleBtn=target.closest('[data-cloud-admin]');
    if(roleBtn){e.preventDefault();e.stopImmediatePropagation();setAdmin(roleBtn.dataset.cloudAdmin,roleBtn.dataset.make==='1');return;}
    const delBtn=target.closest('[data-cloud-delete]');
    if(delBtn){e.preventDefault();e.stopImmediatePropagation();deleteAccount(delBtn.dataset.cloudDelete);return;}
    const self=target.closest('#mcuSelfDeleteBtn');
    if(self&&token()){e.preventDefault();e.stopImmediatePropagation();deleteSelfCloud();return;}
  },true);

  window.addEventListener('focus',()=>{
    removeBulkWatchActions();
    const me=(()=>{try{return typeof currentUser!=='undefined'?currentUser:null}catch{return null}})();
    if(token()&&(me?.role==='admin'||me?.isPrimaryAdmin||keyOf(me?.username)==='ovztur'))listCloudAccounts().catch(()=>{});
  },{passive:true});

  setTimeout(()=>{
    removeBulkWatchActions();
    const me=(()=>{try{return typeof currentUser!=='undefined'?currentUser:null}catch{return null}})();
    if(token()&&(me?.role==='admin'||me?.isPrimaryAdmin||keyOf(me?.username)==='ovztur'))listCloudAccounts().catch(()=>{});
  },900);
})();