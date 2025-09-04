(function(w){
    'use strict';
  
    const STORIES_KEY   = 'crowe-user-stories-v3';
    const COMMENTS_KEY  = 'crowe-user-story-comments-v2';
    const MENTIONS_KEY  = 'crowe-mentions-v1';
    const AUDIT_KEY     = 'crowe-audit-v1';
  
    let STORAGE_OK = true;
    try {
      const t='__crowe_test__';
      localStorage.setItem(t,'1');
      localStorage.removeItem(t);
    } catch (e) {
      STORAGE_OK = false;
      console.warn('Local storage unavailable:', e);
    }
  
    function load(key, fallback){
      if (!STORAGE_OK) return fallback;
      try{
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        const parsed = JSON.parse(raw);
        return parsed ?? fallback;
      }catch(e){
        console.error('Load failed:', e);
        return fallback;
      }
    }
  
    function save(key, value){
      if (!STORAGE_OK) return;
      try{
        localStorage.setItem(key, JSON.stringify(value));
      }catch(e){
        console.error('Save failed:', e);
      }
    }
  
    function uuid(){
      if (w.crypto && crypto.randomUUID) return crypto.randomUUID();
      return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,8);
    }
  
    w.CroweStorage = Object.freeze({
      ok: STORAGE_OK,
      uuid,
      keys: { STORIES_KEY, COMMENTS_KEY, MENTIONS_KEY, AUDIT_KEY },
  
      // Stories
      loadStories(){ return load(STORIES_KEY, []); },
      saveStories(stories){ return save(STORIES_KEY, stories); },
  
      // Comments per story { [storyId]: Comment[] }
      loadComments(){ return load(COMMENTS_KEY, {}); },
      saveComments(map){ return save(COMMENTS_KEY, map); },
  
      // Mentions list
      loadMentions(){ return load(MENTIONS_KEY, []); },
      saveMentions(list){ return save(MENTIONS_KEY, list); },
  
      // Audit by story { [storyId]: AuditEntry[] }
      loadAudit(){ return load(AUDIT_KEY, {}); },
      saveAudit(map){ return save(AUDIT_KEY, map); },
    });
  })(window);
  