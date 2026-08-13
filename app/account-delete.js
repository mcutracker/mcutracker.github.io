(()=>{
  'use strict';
  const VERSION='1.6.17';
  const USERS_KEY='MCU_TRACKER_USERS_V1';
  const SESSION_KEY='MCU_TRACKER_SESSION_V1';
  const STATE_PREFIX='MCU_TRACKER_USER_STATE_V1_';
  const RECOVERY_HASH='9332ba9b89547b96bbe2b845326d038edb4feaa41fc7729a733914c0818d7a3e';
  const RECOVERY_EXPIRES=Date.parse('2026-08-13T14:33:31Z');
  const keyOf=v=>String(v||'').trim().toLocaleLowerCase('tr-TR');
  const readUsers=()=>{try{return JSON.parse(localStorage.getItem(USERS_KEY)||'{}')||{}}catch{return {}}};
  const writeUsers=u=>localStorage.setItem(USERS_KEY,JSON.stringify(u));
  const sessionKey=()=>localStorage.getItem(SESSION_KEY)||'';
  const account=()=>{const users=readUsers(),key=sessionKey();return{users,key,user:users[key]||null}};
  const primary=u=>keyOf(u?.username||u?.key)==='ovztur';

  async function sha256(text){
    const raw=String(text||'');
    try{
      if(window.crypto?.subtle){
        const b=new TextEncoder().encode(raw),d=await crypto.subtle.digest('SHA-256',b);
        return Array.from(new Uint8Array(d)).map(x=>x.toString(16).padStart(2,'0')).join('');
      }
    }catch{}
    let h=2166136261;
    for(let i=0;i<raw.length;i++){h^=raw.charCodeAt(i);h=Math.imul(h,16777619)}
    return 'local-'+(h>>>0).toString(16);
  }

  function stripRecoveryToken(){
    try{const u=new URL(location.href);u.searchParams.delete('admin-recovery');history.replaceState(null,'',u.pathname+(u.search||'')+u.hash)}catch{}
  }

  async function recoverPrimaryAdmin(){
    let token='';
    try{token=new URL(location.href).searchParams.get('admin-recovery')||''}catch{}
    if(!token)return;
    const valid=Date.now()<=RECOVERY_EXPIRES&&await sha256(token)===RECOVERY_HASH;
    stripRecoveryToken();
    if(!valid){alert('Ana Admin kurtarma bağlantısı geçersiz veya süresi dolmuş.');return}
    const pass=prompt('ovztur Ana Admin hesabı için yeni şifreyi belirle (en az 4 karakter):');
    if(pass===null)return;
    if(pass.length<4){alert('Şifre en az 4 karakter olmalı.');return}
    const confirmPass=prompt('Yeni şifreyi tekrar gir:');
    if(confirmPass===null)return;
    if(pass!==confirmPass){alert('Şifreler eşleşmiyor. Kurtarma işlemini tekrar başlat.');return}
    const users=readUsers(),key='ovztur',old=users[key]||{};
    users[key]={...old,key,username:'ovztur',displayName:old.displayName||'ovztur',role:'admin',isPrimaryAdmin:true,passwordHash:await sha256(pass),createdAt:old.createdAt||Date.now()};
    writeUsers(users);localStorage.setItem(SESSION_KEY,key);
    alert('Ana Admin hesabı bu tarayıcıda yeniden kuruldu.');location.replace('/app/');
  }

  function protectPrimaryRegistration(){
    document.addEventListener('submit',e=>{
      const form=e.target;if(!(form instanceof HTMLFormElement)||form.id!=='authForm')return;
      const username=form.querySelector('#authUsername');if(!username||keyOf(username.value)!=='ovztur')return;
      const registerActive=document.getElementById('registerTab')?.classList.contains('active');if(!registerActive)return;
      e.preventDefault();e.stopImmediatePropagation();
      const err=document.getElementById('authError');if(err)err.textContent='ovztur Ana Admin hesabı normal kayıt ekranından oluşturulamaz.';else alert('ovztur Ana Admin hesabı normal kayıt ekranından oluşturulamaz.');
    },true);
  }

  function clearUserState(storedKey,user){
    const candidates=new Set([storedKey,user?.key,user?.username].filter(Boolean).map(String));
    for(const c of candidates)localStorage.removeItem(STATE_PREFIX+encodeURIComponent(c));
  }

  function deleteStoredAccount(storedKey){
    const users=readUsers(),target=users[storedKey];
    if(!target)return{ok:false,msg:'Hesap bulunamadı.'};
    if(primary(target))return{ok:false,msg:'ovztur Ana Admin hesabı silinemez.'};
    if(storedKey!==sessionKey())return{ok:false,msg:'Yalnızca kendi hesabını silebilirsin.'};
    clearUserState(storedKey,target);delete users[storedKey];writeUsers(users);localStorage.removeItem(SESSION_KEY);
    setTimeout(()=>location.reload(),80);return{ok:true,msg:`@${target.username||storedKey} hesabı silindi.`};
  }

  function confirmDelete(label){
    if(!confirm(`${label} hesabı silinsin mi?\n\nBu işlem geri alınamaz.`))return false;
    return confirm('SON ONAY: Hesap ile bu hesaba ait izleme, favori, not, XP, kupa ve puan verileri kalıcı olarak silinecek. Devam edilsin mi?');
  }

  function ensureSelfDelete(){
    const {key,user}=account(),existing=document.getElementById('mcuSelfDeleteBtn');
    if(!user||primary(user)){existing?.remove();return}
    if(existing)return;
    const side=document.getElementById('sideMenu');if(!side)return;
    const btn=document.createElement('button');btn.id='mcuSelfDeleteBtn';btn.className='menu-category';btn.type='button';btn.textContent='🗑️ Hesabımı Sil';btn.style.cssText='border-color:rgba(255,90,90,.35);color:#ffb3b3';
    btn.onclick=e=>{e.preventDefault();e.stopPropagation();const now=account();if(!now.user||primary(now.user))return;const label='@'+(now.user.username||now.key);if(!confirmDelete(label))return;deleteStoredAccount(now.key)};
    const logout=document.getElementById('logoutBtn');if(logout)side.insertBefore(btn,logout);else side.appendChild(btn);
  }

  function ensureReleaseNotes(){
    const existing=document.getElementById('mcuReleaseNotesBtn');
    if(existing){existing.textContent='📋 Yama Notları';return}
    if(document.getElementById('mcuReleaseNotesLoader'))return;
    const side=document.getElementById('sideMenu');if(!side)return;
    const s=document.createElement('script');s.id='mcuReleaseNotesLoader';s.src='https://mcutracker.github.io/app/release-notes.js?t='+Date.now();s.async=true;s.onload=()=>{const btn=document.getElementById('mcuReleaseNotesBtn');if(btn)btn.textContent='📋 Yama Notları'};document.head.appendChild(s);
  }

  function ensureCloudAuth(){
    if(window.__MCU_CLOUD_AUTH_LOADING__||document.getElementById('mcuCloudAuthLoader'))return;
    window.__MCU_CLOUD_AUTH_LOADING__=true;
    const s=document.createElement('script');s.id='mcuCloudAuthLoader';s.src='https://mcutracker.github.io/app/cloud-auth.js?t='+Date.now();s.async=false;s.onload=()=>{window.__MCU_CLOUD_AUTH_LOADING__=false};s.onerror=()=>{window.__MCU_CLOUD_AUTH_LOADING__=false;s.remove()};document.head.appendChild(s);
  }

  function install(){
    protectPrimaryRegistration();recoverPrimaryAdmin();ensureCloudAuth();ensureSelfDelete();
    setTimeout(ensureCloudAuth,250);setTimeout(ensureSelfDelete,250);setTimeout(ensureSelfDelete,1000);setTimeout(ensureReleaseNotes,600);setTimeout(ensureReleaseNotes,1800);
    document.addEventListener('click',()=>setTimeout(()=>{ensureSelfDelete();ensureReleaseNotes();ensureCloudAuth()},0),true);
    window.addEventListener('focus',()=>{ensureSelfDelete();ensureReleaseNotes();ensureCloudAuth()},{passive:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();