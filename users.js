(function(w){
    'use strict';
  
    const USERS_KEY   = 'crowe-users-db-v1';
    const DEVICE_KEY  = 'crowe-device-id-v1';
    const MAP_KEY     = 'crowe-device-map-v1'; // { deviceId: userId }
  
    function load(key, fb){ try{ const r=localStorage.getItem(key); return r? JSON.parse(r):fb; }catch{ return fb; } }
    function save(key, v){ try{ localStorage.setItem(key, JSON.stringify(v)); }catch{} }
    function uuid(){ if (crypto.randomUUID) return crypto.randomUUID(); return 'u-'+Math.random().toString(36).slice(2); }
  
    function listUsers(){ return load(USERS_KEY, []); }
    function saveUsers(users){ save(USERS_KEY, users); }
    function getDeviceId(){
      let id = localStorage.getItem(DEVICE_KEY);
      if (!id){ id = 'dev-'+uuid(); localStorage.setItem(DEVICE_KEY, id); }
      return id;
    }
    function getDeviceMap(){ return load(MAP_KEY, {}); }
    function saveDeviceMap(m){ save(MAP_KEY, m); }
  
    function addUser({firstName,lastName,email}){
      const users = listUsers();
      const exists = users.find(u=>u.email.toLowerCase()===email.toLowerCase());
      if (exists) return exists;
      const u = { id: uuid(), firstName:firstName.trim(), lastName:lastName.trim(), email:email.trim().toLowerCase(), createdAt: Date.now() };
      users.push(u); saveUsers(users); return u;
    }
    function findUserByEmail(email){
      return listUsers().find(u=>u.email.toLowerCase()===String(email||'').toLowerCase());
    }
    function getUserById(id){ return listUsers().find(u=>u.id===id); }
    function mapDeviceToUser(deviceId, userId){
      const m = getDeviceMap(); m[deviceId]=userId; saveDeviceMap(m);
    }
    function userForDevice(deviceId){
      const m = getDeviceMap(); const uid = m[deviceId]; if (!uid) return null;
      return getUserById(uid) || null;
    }
  
    w.CroweUsers = Object.freeze({
      listUsers, saveUsers,
      getDeviceId, getDeviceMap, saveDeviceMap,
      addUser, findUserByEmail, userForDevice, mapDeviceToUser,
      getUserById
    });
  })(window);
  