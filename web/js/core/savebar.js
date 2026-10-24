/* ปุ่ม SAVE · แถบสถานะ · ข้อความแจ้งเตือน
   หลักการ: ทุกการแก้ไขถูกเก็บในเครื่องทันที (ไม่หายแม้ปิดหน้า/ไม่มีเน็ต)
   ปุ่ม SAVE = ยืนยันบันทึก + ส่งขึ้นเซิร์ฟเวอร์ทันที (ถ้าตั้งลิงก์ไว้และมีอินเทอร์เน็ต) */

let toastT;
function toast(msg, kind) {
  const el = $('#toast'); if (!el) return;
  el.textContent = msg; el.className = 'show ' + (kind || '');
  clearTimeout(toastT); toastT = setTimeout(() => { el.className = ''; }, 4200);
}
const hhmm = t => new Date(t).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
const hasOpenEditor = () => ed >= 0 || !!dd || !!te;
const hasPending = () => !!dirty || !!typing || Object.keys(imd).length > 0 || hasOpenEditor();

function updateStatus() {
  const el = $('#st'), b = $('#saveBtn');
  if (!el || !b) return;
  const online = navigator.onLine, pend = hasPending();
  let t, c = '';
  if (!api) { t = pend ? '✏️ มีการแก้ไข · เก็บในเครื่อง' : '💾 ใช้ในเครื่อง · ยังไม่ตั้งลิงก์เซิร์ฟเวอร์'; c = 'warn'; }
  else if (!online) { t = '📴 ออฟไลน์ · เก็บในเครื่อง' + (pend ? ' · รอส่งขึ้นเซิร์ฟเวอร์' : ''); c = 'off'; }
  else if (busy) t = '⏳ กำลังบันทึก…';
  else if (lastErr && pend) { t = '⚠️ ' + lastErr + ' · เก็บในเครื่องแล้ว จะลองส่งใหม่'; c = 'warn'; }
  else if (pend) { t = '✏️ มีการแก้ไข ยังไม่ได้ส่งขึ้นเซิร์ฟเวอร์'; c = 'warn'; }
  else { t = '✅ บันทึกขึ้นเซิร์ฟเวอร์แล้ว' + (lastSync ? ' · ' + hhmm(lastSync) : ''); c = 'ok'; }
  el.textContent = t; el.className = c;
  b.disabled = !!busy;
  b.className = pend && !busy ? 'need' : '';
  b.textContent = busy ? '⏳ กำลังบันทึก…' : pend ? '💾 SAVE' : '✔ บันทึกแล้ว';
}

/* แถวที่กำลังแก้ไขค้างอยู่ (ยังไม่กด "บันทึก" ของแถว) ให้ยืนยันไปพร้อมกัน */
function commitOpenEditors() {
  try { if (em) saveAll(); else if (ed >= 0) commit(); } catch (e) { console.error(e); }
  try { if (dd) dOk(); } catch (e) { console.error(e); }
  try { if (te) tOk(); } catch (e) { console.error(e); }
}

async function doSave() {
  if (busy) return;
  commitOpenEditors();
  S.ts = Date.now(); stash(); imSave(); typing = 0;            // เก็บในเครื่องก่อนเสมอ
  if (!api) {
    dirty = 0; st();
    toast('💾 บันทึกในเครื่องแล้ว · ยังไม่ได้ตั้งลิงก์เซิร์ฟเวอร์ (ตั้งได้ที่เมนู ตั้งค่า)', 'ok'); return;
  }
  dirty = 1; wantPush = 1; st();
  if (!navigator.onLine) {
    toast('📴 ออฟไลน์ — บันทึกในเครื่องแล้ว จะส่งขึ้นเซิร์ฟเวอร์เองเมื่อมีอินเทอร์เน็ต', 'warn'); return;
  }
  clearTimeout(T);
  const r = await sync(true);
  await pushImg();
  if (r.ok) toast('✅ บันทึกขึ้นเซิร์ฟเวอร์แล้ว', 'ok');
  else if (r.replaced) toast('⚠️ เครื่องอื่นบันทึกใหม่กว่า — ดึงฉบับล่าสุดมาแล้ว', 'warn');
  else toast('⚠️ ส่งขึ้นเซิร์ฟเวอร์ไม่สำเร็จ (' + (r.error || 'ไม่ทราบสาเหตุ') + ') — เก็บในเครื่องไว้แล้ว จะลองส่งใหม่เอง', 'err');
  st();
}

$('#saveBtn').addEventListener('click', doSave);
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && (e.key == 's' || e.key == 'S')) { e.preventDefault(); doSave(); }
});
/* พิมพ์แล้วปุ่ม SAVE ขึ้นทันที (ก่อนเหตุการณ์ change) */
document.addEventListener('input', e => {
  const d = e.target.dataset || {};
  if ((d.k && d.k !== 'api') || d.e || d.g) { typing = 1; updateStatus(); }
}, true);
/* เตือนก่อนปิดหน้า ถ้ายังมีแถวที่กำลังแก้ไขค้างอยู่ */
addEventListener('beforeunload', e => { if (hasOpenEditor()) { e.preventDefault(); e.returnValue = ''; } });
