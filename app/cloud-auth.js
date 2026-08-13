(()=>{
  'use strict';

  const SUPABASE_URL='https://svnrfyqloiludzvnylyp.supabase.co';
  const SUPABASE_KEY='sb_publishable_SLhIn3mSi8EzBym_BnfiqA_IUR_3xxm';
  const CLOUD_TOKEN_KEY='MCU_TRACKER_CLOUD_TOKEN_V1';
  const STATE_PREFIX='MCU_TRACKER_USER_STATE_V1_';
  let cloudToken=localStorage.getItem(CLOUD_TOKEN_KEY)||'';
  let cloudReady=false;
  let syncTimer=0;
  let syncing=false;

  const originalSave=typeof save==='function'?save:null;

  async function rpc(name,args){
    const r=await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`,{
      method:'POST',
      headers:{'apikey':SUPABASE_KEY,'Content-Type':'application/json'},
      body:JSON.stringify(args||{}),
      cache:'no-store'
    });
    if(!r.ok)throw new Error(`HTTP ${r.status}`);
    return r.json();
  }

  function cloudRole(profile){
    return profile?.role==='superadmin'?'admin':(profile?.role||'user');
  }

  function localStateFor(key){
    try{
      const raw=localStorage.getItem(STATE_PREFIX+encodeURIComponent(key));
      return raw?normalizeState(JSON.parse(raw)):null;
    }catch{return null;}
  }

  function hasMeaningfulState(s){
    if(!s||typeof s!=='object')return false;
    return ['watched','favorites','notes','personalRatings','unlockedAchievements','earnedWatchXP'].some(k=>s[k]&&Object.keys(s[k]).length>0);
  }

  function authError(text){
    const el=document.getElementById('authError');
    if(el)el.textContent=text;else alert(text);
  }

  function setBusy(v){
    const b=document.querySelector('#authForm .auth-submit');
    if(!b)return;
    b.disabled=!!v;
    b.style.opacity=v?'.65':'';
    if(v)b.dataset.oldText=b.textContent||'';
    if(v)b.textContent='Bağlanıyor…';else if(b.dataset.oldText)b.textContent=b.dataset.oldText;
  }

  function updateAuthNote(){
    const note=document.querySelector('#authCard .auth-note');
    if(note)note.textContent='Tek hesap sistemi: Bu kullanıcıyla webde ve Windows uygulamasında aynı ilerlemeyi kullanırsın.';
  }

  async function applyCloud(result,token,preferredState=null){
    const profile=result?.profile;
    if(!profile?.username||!token)throw new Error('invalid_cloud_session');
    const key=userKey(profile.username);
    const old=users[key]||{};
    users[key]={...old,key,username:profile.username,displayName:profile.displayName||profile.username,role:cloudRole(profile),isPrimaryAdmin:profile.role==='superadmin'};
    saveUsers();
    currentUser=users[key];
    localStorage.setItem(sessionKey,key);
    cloudToken=token;
    localStorage.setItem(CLOUD_TOKEN_KEY,token);
    const incoming=preferredState||result.state;
    state=normalizeState(incoming&&typeof incoming==='object'?incoming:blankState(profile.displayName||profile.username));
    if(!state.profile)state.profile={name:profile.displayName||profile.username};
    if(!state.profile.name)state.profile.name=profile.displayName||profile.username;
    if(originalSave)originalSave();
    applyTheme(currentTheme());
    updateAccountUI();
    hideAuth();
    currentCategory='doomsday';
    renderCurrent();
    updateProgress();
    refreshIMDbRatings(false);
    cloudReady=true;
  }

  async function pushStateNow(){
    if(!cloudReady||!cloudToken||syncing||!currentUser)return;
    syncing=true;
    try{
      const j=await rpc('mcu_account_save_state',{p_token:cloudToken,p_state:state});
      if(!j?.ok&&j?.error==='invalid_session'){
        cloudReady=false;
        cloudToken='';
        localStorage.removeItem(CLOUD_TOKEN_KEY);
      }
    }catch{}
    finally{syncing=false;}
  }

  function scheduleStatePush(){
    if(!cloudReady||!cloudToken)return;
    clearTimeout(syncTimer);
    syncTimer=setTimeout(pushStateNow,500);
  }

  if(originalSave){
    save=function(){
      originalSave();
      scheduleStatePush();
    };
  }

  async function migrateLocalAccount(username,password){
    const key=userKey(username),u=users[key];
    if(!u)return null;
    if(u.passwordHash!==await hashPassword(password))return null;
    if(key==='ovztur')return {adminClaimRequired:true};
    const localState=localStateFor(key)||blankState(u.displayName||u.username);
    const reg=await rpc('mcu_account_register',{p_username:u.username,p_display_name:u.displayName||u.username,p_password:password});
    if(!reg?.ok)return reg;
    await applyCloud(reg,reg.token,localState);
    await pushStateNow();
    return {ok:true,migrated:true};
  }

  async function handleAuthSubmit(e){
    const form=e.target;
    if(!(form instanceof HTMLFormElement)||form.id!=='authForm')return;
    const usernameInput=form.querySelector('#authUsername');
    if(!usernameInput)return;
    e.preventDefault();
    e.stopImmediatePropagation();

    const register=document.getElementById('registerTab')?.classList.contains('active');
    const username=usernameInput.value.trim();
    const password=form.querySelector('#authPassword')?.value||'';
    const display=(form.querySelector('#authDisplay')?.value||username).trim().slice(0,24)||username;
    const key=userKey(username);
    authError('');
    if(key.length<3){authError('Kullanıcı adı en az 3 karakter olmalı.');return;}
    if(password.length<6){authError('Bulut hesabı için şifre en az 6 karakter olmalı.');return;}

    setBusy(true);
    try{
      if(register){
        const confirm=form.querySelector('#authConfirm')?.value||'';
        if(password!==confirm){authError('Şifreler eşleşmiyor.');return;}
        if(key==='ovztur'){authError('ovztur Ana Admin hesabı normal kayıt ekranından oluşturulamaz.');return;}
        const localExisting=users[key]?localStateFor(key):null;
        const j=await rpc('mcu_account_register',{p_username:username,p_display_name:display,p_password:password});
        if(!j?.ok){
          const msg={username_taken:'Bu kullanıcı adı zaten kayıtlı.',reserved_username:'Bu kullanıcı adı ayrılmıştır.',invalid_password:'Şifre en az 6 karakter olmalı.',invalid_username:'Geçersiz kullanıcı adı.'}[j?.error]||'Hesap oluşturulamadı.';
          authError(msg);return;
        }
        await applyCloud(j,j.token,localExisting||j.state);
        if(localExisting&&hasMeaningfulState(localExisting))await pushStateNow();
        sendTelemetry('register');
        return;
      }

      const j=await rpc('mcu_account_login',{p_username:username,p_password:password});
      if(j?.ok){
        await applyCloud(j,j.token);
        sendTelemetry('login');
        return;
      }
      if(j?.error==='account_not_found'){
        const migrated=await migrateLocalAccount(username,password);
        if(migrated?.ok){sendTelemetry('login');return;}
        if(migrated?.adminClaimRequired){authError('Ana Admin hesabını buluta taşımak için sana verilen özel Ana Admin bağlantısını bir kez aç.');return;}
      }
      const msg={invalid_credentials:'Kullanıcı adı veya şifre hatalı.',account_locked:'Çok fazla hatalı deneme. 10 dakika sonra tekrar dene.',account_not_found:'Bu hesap henüz ortak hesap sisteminde yok.'}[j?.error]||'Giriş yapılamadı.';
      authError(msg);
    }catch(err){
      authError('Sunucuya bağlanılamadı. İnternet bağlantını kontrol et.');
    }finally{setBusy(false);updateAuthNote();}
  }

  async function restoreCloudSession(){
    if(!cloudToken)return false;
    try{
      const j=await rpc('mcu_account_session',{p_token:cloudToken});
      if(j?.ok){await applyCloud(j,cloudToken);return true;}
    }catch{}
    localStorage.removeItem(CLOUD_TOKEN_KEY);
    cloudToken='';cloudReady=false;
    return false;
  }

  function removeClaimParam(){
    try{
      const u=new URL(location.href);
      u.searchParams.delete('cloud-admin-claim');
      history.replaceState(null,'',u.pathname+(u.search||'')+u.hash);
    }catch{}
  }

  async function claimAdminIfPresent(){
    let claim='';
    try{claim=new URL(location.href).searchParams.get('cloud-admin-claim')||'';}catch{}
    if(!claim)return false;
    removeClaimParam();
    const pass=prompt('ovztur Ana Admin ortak hesabı için yeni şifre belirle (en az 6 karakter):');
    if(pass===null)return true;
    if(pass.length<6){alert('Şifre en az 6 karakter olmalı.');return true;}
    const again=prompt('Yeni şifreyi tekrar gir:');
    if(again!==pass){alert('Şifreler eşleşmiyor.');return true;}
    try{
      const j=await rpc('mcu_account_claim_admin',{p_recovery_token:claim,p_password:pass});
      if(!j?.ok){alert(j?.error==='invalid_or_expired_token'?'Ana Admin bağlantısı geçersiz, kullanılmış veya süresi dolmuş.':'Ana Admin hesabı oluşturulamadı.');return true;}
      const local=localStateFor('ovztur');
      await applyCloud(j,j.token,local||j.state);
      if(local&&hasMeaningfulState(local))await pushStateNow();
      alert('✅ ovztur Ana Admin hesabı ortak hesap sistemine taşındı. Artık aynı hesap web ve Windows uygulamasında çalışır.');
    }catch{alert('Ana Admin hesabı için sunucuya bağlanılamadı.');}
    return true;
  }

  document.addEventListener('submit',handleAuthSubmit,true);
  document.addEventListener('click',e=>{
    const t=e.target instanceof Element?e.target.closest('#logoutBtn'):null;
    if(!t)return;
    const old=cloudToken;
    cloudReady=false;cloudToken='';
    localStorage.removeItem(CLOUD_TOKEN_KEY);
    if(old)rpc('mcu_account_logout',{p_token:old}).catch(()=>{});
  },true);

  document.addEventListener('click',()=>setTimeout(updateAuthNote,0),true);

  async function start(){
    await claimAdminIfPresent();
    if(!cloudReady)await restoreCloudSession();
    updateAuthNote();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
