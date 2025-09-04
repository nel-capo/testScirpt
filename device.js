(function(w){
    'use strict';
  
    const E = {};
  
    function makeEl(html){
      const t=document.createElement('template');
      t.innerHTML=html.trim();
      return t.content.firstElementChild;
    }
  
    function renderRegister(firstName='', lastName='', email=''){
      const overlay = makeEl(`
        <div class="overlay show" id="registerOverlay" role="dialog" aria-modal="true" aria-labelledby="regTitle">
          <div class="modal">
            <h2 id="regTitle" style="margin:0 0 8px 0; color:#032d60">Welcome</h2>
            <p style="margin-top:0;color:#5f6a7d">We don't recognize this device. Please register to continue.</p>
            <form id="regForm" style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
              <div class="field" style="grid-column:span 1">
                <label>First Name</label>
                <input id="regFirst" type="text" required value="${firstName}">
              </div>
              <div class="field" style="grid-column:span 1">
                <label>Last Name</label>
                <input id="regLast" type="text" required value="${lastName}">
              </div>
              <div class="field" style="grid-column:span 2">
                <label>Company Email</label>
                <input id="regEmail" type="email" required value="${email}" placeholder="name@company.com">
              </div>
              <div style="grid-column:span 2; display:flex; gap:8px; justify-content:flex-end; margin-top:6px">
                <button class="btn" type="button" id="regCancel">Cancel</button>
                <button class="btn brand" type="submit">Continue</button>
              </div>
            </form>
          </div>
        </div>
      `);
      document.body.appendChild(overlay);
      overlay.querySelector('#regCancel').addEventListener('click', ()=> {
        // Optional: allow viewing in read-only? For now we require registration
        overlay.remove();
      });
      overlay.querySelector('#regForm').addEventListener('submit', (e)=>{
        e.preventDefault();
        const firstName = overlay.querySelector('#regFirst').value.trim();
        const lastName  = overlay.querySelector('#regLast').value.trim();
        const email     = overlay.querySelector('#regEmail').value.trim();
        if (!firstName || !lastName || !email) return;
        const user = (window.CroweUsers.findUserByEmail(email)) || window.CroweUsers.addUser({firstName,lastName,email});
        const deviceId = window.CroweUsers.getDeviceId();
        window.CroweUsers.mapDeviceToUser(deviceId, user.id);
        overlay.remove();
        E._resolve && E._resolve(user);
        document.dispatchEvent(new CustomEvent('user-ready', { detail: user }));
      });
    }
  
    function ready(){
      return new Promise((resolve)=>{
        E._resolve = resolve;
        const deviceId = window.CroweUsers.getDeviceId();
        const user = window.CroweUsers.userForDevice(deviceId);
        if (user){
          resolve(user);
          document.dispatchEvent(new CustomEvent('user-ready', { detail: user }));
        }else{
          renderRegister();
        }
      });
    }
  
    w.DeviceAPI = Object.freeze({ ready });
  })(window);
  