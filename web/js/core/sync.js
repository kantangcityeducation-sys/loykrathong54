/* ซิงก์ข้อมูลกับเซิร์ฟเวอร์ (Google Apps Script + Google Sheet)
   โปรโตคอล (ใช้ร่วมกับแอป Android):
     GET  <api>?a=load            -> state ล่าสุด (JSON, มีฟิลด์ ts)
     GET  <api>?a=img             -> แผนที่รูปภาพ { key: dataURL }
     GET  <api>?a=ping            -> ตรวจการเชื่อมต่อ
     POST <api> {state,rows}      -> {ok:true,ts} | {ok:false,state}  (ฝั่งเซิร์ฟเวอร์ใหม่กว่า)
     POST <api> {img:{key:val}}   -> {ok:true}
   กติกา: ฉบับที่บันทึกล่าสุด (ts มากสุด) ชนะ · ข้อมูลทุกอย่างถูกเก็บในเครื่องก่อนเสมอ */

const SYNC_DELAY = 5000;
let autoSync = localStorage.cl54auto != null
  ? localStorage.cl54auto !== '0'
  : ((window.APP_CONFIG || {}).AUTO_SYNC !== false);
let lastSync = +localStorage.cl54last || 0, lastErr = '';
let wantPush = 0;   // ผู้ใช้กด SAVE ไว้แล้วแต่ยังส่งไม่ได้ (ออฟไลน์/เซิร์ฟเวอร์ขัดข้อง) → ส่งให้เองเมื่อพร้อม

function jfetch(url, opt, ms) {
  const c = new AbortController(), t = setTimeout(() => c.abort(), ms || 20000);
  return fetch(url, Object.assign({}, opt, { signal: c.signal })).finally(() => clearTimeout(t));
}
const apiUrl = a => api + (api.includes('?') ? '&' : '?') + 'a=' + a;

function scheduleSync() {
  clearTimeout(T);
  if (autoSync && api) T = setTimeout(() => sync(), SYNC_DELAY);
}

/* เก็บสำเนาฉบับในเครื่องไว้ก่อนถูกฉบับเซิร์ฟเวอร์ทับ (กรณีแก้พร้อมกันหลายเครื่อง) */
function backupLocal(why) {
  if (!dirty) return;
  try { localStorage.cl54bak = JSON.stringify({ why, at: Date.now(), state: S }); } catch (e) {}
  if (typeof toast == 'function')
    toast('มีข้อมูลใหม่กว่าจากเครื่องอื่น — ฉบับที่ยังไม่ได้ส่งถูกสำรองไว้ (ตั้งค่า → ดาวน์โหลดฉบับที่ถูกทับ)', 'warn');
}

async function sync(force) {
  if (!api || busy) return { ok: false, skipped: 1 };
  if (!dirty && !force) return { ok: true, skipped: 1 };
  if (!navigator.onLine) { st(); return { ok: false, offline: 1 }; }
  busy = 1; st();
  let res = { ok: false };
  try {
    const sent = S.ts;
    const r = await jfetch(api, {
      method: 'POST', headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ state: S, rows: rows() })
    });
    const j = await r.json();
    if (j.ok) {
      dirty = S.ts > (j.ts || sent) ? 1 : 0; if (!dirty) wantPush = 0;
      lastSync = Date.now(); localStorage.cl54last = lastSync; lastErr = '';
      res = { ok: true };
    } else if (j.state) {
      backupLocal('server-newer');
      S = j.state; mig(); stash(); dirty = 0; wantPush = 0;
      lastSync = Date.now(); localStorage.cl54last = lastSync; lastErr = '';
      render(); res = { ok: false, replaced: 1 };
    } else {
      lastErr = j.error || 'เซิร์ฟเวอร์ตอบกลับไม่ถูกต้อง'; res = { ok: false, error: lastErr };
    }
  } catch (x) {
    lastErr = x && x.name == 'AbortError' ? 'หมดเวลาเชื่อมต่อ' : 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้';
    res = { ok: false, error: lastErr };
  }
  busy = 0; st();
  if (dirty && api && (autoSync || wantPush) && navigator.onLine) {   // ลองส่งใหม่เอง
    clearTimeout(T); T = setTimeout(() => sync(), res.ok ? SYNC_DELAY : 15000);
  }
  return res;
}

async function pull() {
  if (!api || !navigator.onLine) return st();
  try {
    const r = await jfetch(apiUrl('load')), j = await r.json(), sts = (j && j.ts) || 0;
    if (sts > S.ts) {                       // เซิร์ฟเวอร์ใหม่กว่า
      backupLocal('pull-overwrite');
      S = j; dirty = 0; mig(); stash(); render();
      lastSync = Date.now(); localStorage.cl54last = lastSync; lastErr = '';
      if (dirty && (autoSync || wantPush)) sync();
    } else if (S.ts > sts) {                // ในเครื่องใหม่กว่า (แก้ตอนออฟไลน์ / เซิร์ฟเวอร์ยังว่าง)
      dirty = 1;
      if (autoSync || wantPush) await sync();
    } else { dirty = 0; lastSync = Date.now(); localStorage.cl54last = lastSync; lastErr = ''; }
  } catch (x) { lastErr = 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'; }
  st();
}

async function pingApi() {
  const t0 = Date.now();
  const r = await jfetch(apiUrl('ping'), {}, 15000), j = await r.json();
  if (!j || !j.ok) throw new Error('ลิงก์นี้ไม่ใช่เซิร์ฟเวอร์ของระบบนี้');
  return { ms: Date.now() - t0, ts: j.ts || 0, version: j.version || '' };
}
