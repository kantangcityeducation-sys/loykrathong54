/**
 * loykrathong54 - Google Apps Script API
 * Existing protocol:
 * GET ?a=load -> state JSON
 * GET ?a=img  -> { key: dataURL }
 * GET ?a=ping -> connection status
 * POST {state, rows} or POST {img:{key:value}}
 *
 * Run as the deploying account. Do not share the private Drive data folder.
 */
const APP_NAME = 'loykrathong54';
const API_VERSION = '2.0.0';
const STATE_KEY = 'LOYKRATHONG54_STATE_FILE_ID';
const IMAGE_KEY = 'LOYKRATHONG54_IMAGE_FILE_ID';
const FOLDER_KEY = 'LOYKRATHONG54_DATA_FOLDER_ID';

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.view === 'public') {
    return HtmlService.createHtmlOutputFromFile('Public')
      .setTitle('ฟุตบอลลอยกระทงคัพ ครั้งที่ 54')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  const a = p.a || 'ping';
  if (a === 'load') return output_(readState_());
  if (a === 'img') return output_(readImages_());
  if (a === 'ping') {
    const s = readState_();
    return output_({ok:true, app:APP_NAME, version:API_VERSION, ts:Number(s.ts)||0});
  }
  return output_({ok:false, error:'Unknown action', app:APP_NAME, version:API_VERSION});
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(25000);
    const raw = e && e.postData && e.postData.contents;
    if (!raw) return output_({ok:false, error:'Empty request body'});
    const body = JSON.parse(raw);
    if (body.app && body.app !== APP_NAME) return output_({ok:false,error:'App name mismatch'});

    if (body.img && typeof body.img === 'object') {
      const images = readImages_();
      Object.keys(body.img).forEach(function(k) {
        const v = body.img[k];
        if (v === '' || v == null) delete images[k];
        else if (typeof v === 'string') images[k] = v;
      });
      writeJson_(IMAGE_KEY, images, 'images.json');
      return output_({ok:true, app:APP_NAME, version:API_VERSION});
    }

    if (body.state && typeof body.state === 'object') {
      const incoming = body.state;
      if (!incoming.m || !incoming.teams || !Array.isArray(incoming.m)) {
        return output_({ok:false,error:'Invalid state schema'});
      }
      const current = readState_();
      const currentTs = Number(current.ts)||0;
      const incomingTs = Number(incoming.ts)||0;
      // Serialize writes and reject stale/equal snapshots instead of silently overwriting newer data.
      if (currentTs && incomingTs <= currentTs) {
        return output_({ok:false, state:current, ts:currentTs, conflict:true});
      }
      writeJson_(STATE_KEY, incoming, 'state.json');
      // Preserve the derived rows sent by the current app for downstream use/debugging.
      if (body.rows) writeJson_(STATE_KEY + '_ROWS', body.rows, 'rows.json');
      return output_({ok:true, ts:incomingTs || Date.now(), app:APP_NAME, version:API_VERSION});
    }
    return output_({ok:false,error:'Expected state or img payload'});
  } catch (err) {
    return output_({ok:false,error:String(err && err.message || err)});
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

/** Read-only projection used by Public.html. */
function getPublicData() {
  const s = readState_();
  const cups = ['ก','ข','ย'];
  const matches = (s.m || []).map(function(m) {
    if (m.note != null) {
      return {no:'',date:m.d||'',time:'',cup:'',home:'',score:'',away:'',field:'',note:m.note,detail:m.det||''};
    }
    return {
      no:m.n||'', date:m.d||'', time:m.t||'',
      cup:[m.c||'',m.g||'',m.r||''].filter(Boolean).join(' '),
      home:teamName_(s,m.a), score:((m.sa!==''&&m.sa!=null)||(m.sb!==''&&m.sb!=null)) ? String(m.sa==null?'':m.sa)+' - '+String(m.sb==null?'':m.sb) : '',
      away:teamName_(s,m.b), field:m.v||'', note:''
    };
  });
  const teams = [];
  cups.forEach(function(c) {
    (s.teams && s.teams[c] || []).forEach(function(name, i) {
      if (name) teams.push({no:i+1, cup:c, name:String(name)});
    });
  });
  return {
    app:APP_NAME,
    updatedAt:s.ts ? new Date(Number(s.ts)).toISOString() : null,
    matches:matches,
    teams:teams
  };
}

function teamName_(s, v) {
  if (!Array.isArray(v)) return String(v == null ? '' : v);
  const cup=v[0], group=v[1], pos=Number(v[2])-1;
  const draw=s.draw && s.draw[cup] && s.draw[cup][group];
  const teams=s.teams && s.teams[cup];
  if (!draw || pos<0 || pos>=draw.length) return 'สาย '+group+' ลำดับ '+(pos+1);
  const index=draw[pos];
  if (index === '' || index == null) return 'สาย '+group+' ลำดับ '+(pos+1);
  return teams && teams[index] ? String(teams[index]) : '';
}

function readState_() { return readJson_(STATE_KEY, {}); }
function readImages_() { return readJson_(IMAGE_KEY, {}); }

function readJson_(key, fallback) {
  const id=PropertiesService.getScriptProperties().getProperty(key);
  if (!id) return fallback;
  try {
    const text=DriveApp.getFileById(id).getBlob().getDataAsString('UTF-8');
    return text ? JSON.parse(text) : fallback;
  } catch (err) { return fallback; }
}

function writeJson_(key, value, filename) {
  const props=PropertiesService.getScriptProperties();
  const text=JSON.stringify(value);
  let id=props.getProperty(key);
  if (id) {
    try { DriveApp.getFileById(id).setContent(text); return; }
    catch (err) { props.deleteProperty(key); }
  }
  const folder=getFolder_();
  const file=folder.createFile(filename, text, MimeType.PLAIN_TEXT);
  props.setProperty(key, file.getId());
}

function getFolder_() {
  const props=PropertiesService.getScriptProperties();
  const id=props.getProperty(FOLDER_KEY);
  if (id) {
    try { return DriveApp.getFolderById(id); }
    catch (err) { props.deleteProperty(FOLDER_KEY); }
  }
  const folder=DriveApp.createFolder(APP_NAME+'-private-data');
  props.setProperty(FOLDER_KEY, folder.getId());
  return folder;
}

function output_(v) {
  return ContentService.createTextOutput(JSON.stringify(v))
    .setMimeType(ContentService.MimeType.JSON);
}
