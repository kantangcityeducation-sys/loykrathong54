/* หน้า "ตั้งค่า": หน้าปก · เชื่อมเซิร์ฟเวอร์ · ข้อมูลสำรอง */
function vSet() {
  const bak = localStorage.cl54bak;
  const ls = lastSync ? 'ซิงก์ล่าสุด ' + new Date(lastSync).toLocaleString('th-TH') : 'ยังไม่เคยซิงก์ในเครื่องนี้';
  return `${cvP()}
<section><h3>🌐 เชื่อมเซิร์ฟเวอร์ (Google Sheet)</h3>
<p class=hint>วางลิงก์ที่ลงท้าย <b>/exec</b> จาก Google Apps Script (ขั้นตอนอยู่ที่ <code>server/google-apps-script/README.md</code>) — ทุกเครื่องใช้ลิงก์เดียวกัน ข้อมูลจะตรงกัน · หรือกำหนดล่วงหน้าในไฟล์ <code>config.js</code></p>
<input data-k="api" value="${esc(api)}" placeholder="https://script.google.com/macros/s/.../exec">
<div class=btns><button data-act=testapi>🔌 ทดสอบการเชื่อมต่อ</button><button data-act=sync>⟳ ซิงก์ตอนนี้</button></div>
<label class=chk><input type=checkbox data-act=autosync ${autoSync ? 'checked' : ''}><span>ส่งขึ้นเซิร์ฟเวอร์อัตโนมัติหลังแก้ไข ${SYNC_DELAY / 1000} วินาที (ถ้าปิด = ส่งเมื่อกดปุ่ม SAVE เท่านั้น)</span></label>
<p class=hint id=apiMsg>${esc(ls)}</p></section>
<section><h3>💾 ข้อมูลสำรอง</h3>
<div class=btns><button data-act=exp>⬇ ดาวน์โหลดข้อมูลสำรอง (.json)</button>
<label class=btn>⬆ นำเข้าข้อมูลสำรอง<input type=file accept=".json,application/json" data-act=impfile hidden></label>
${bak ? '<button data-act=dlbak>⬇ ดาวน์โหลดฉบับที่ถูกทับ</button>' : ''}
<button data-act=reset>คืนค่าตามไฟล์ Excel เดิม</button></div>
<p class=hint>ออฟไลน์: แก้ไขได้ตามปกติ ข้อมูลเก็บในเครื่อง และส่งขึ้น Sheet เองเมื่อมีเน็ต · เมื่อแก้พร้อมกันหลายเครื่อง ฉบับที่บันทึกล่าสุดจะถูกใช้ (ฉบับที่ถูกทับจะสำรองไว้ให้ดาวน์โหลด)</p></section>`;
}

function dl(name, text) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  a.download = name; a.click();
}
document.addEventListener('click', async e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const a = b.dataset.act;
  if (a == 'testapi') {
    const m = $('#apiMsg'); if (!api) { if (m) m.textContent = '⚠️ ยังไม่ได้ใส่ลิงก์เซิร์ฟเวอร์'; return; }
    if (m) m.textContent = '⏳ กำลังทดสอบ…';
    try { const r = await pingApi(); if (m) m.textContent = `✅ เชื่อมต่อสำเร็จ (${r.ms} ms${r.version ? ' · เซิร์ฟเวอร์ v' + r.version : ''})`; }
    catch (x) { if (m) m.textContent = '❌ เชื่อมต่อไม่ได้: ' + (x && x.name == 'AbortError' ? 'หมดเวลา' : (x.message || x)) + ' — ตรวจว่าเป็นลิงก์ /exec และเปิดสิทธิ์ "ทุกคน" แล้ว'; }
  } else if (a == 'dlbak') {
    try { dl('loykrathong54-ฉบับที่ถูกทับ.json', JSON.stringify(JSON.parse(localStorage.cl54bak).state)); } catch (x) {}
  }
});
document.addEventListener('change', e => {
  const t = e.target, a = t.dataset && t.dataset.act;
  if (a == 'autosync') {
    autoSync = t.checked; localStorage.cl54auto = autoSync ? '1' : '0';
    toast(autoSync ? 'เปิดส่งอัตโนมัติ' : 'ปิดส่งอัตโนมัติ — กดปุ่ม SAVE เพื่อส่งขึ้นเซิร์ฟเวอร์', 'ok');
    if (autoSync && dirty) scheduleSync();
    st();
  } else if (a == 'impfile' && t.files && t.files[0]) {
    const f = t.files[0], r = new FileReader();
    r.onload = () => {
      try {
        const j = JSON.parse(r.result);
        if (!j || !j.m || !j.teams) throw new Error('ไม่ใช่ไฟล์สำรองของระบบนี้');
        if (!confirm('นำเข้าไฟล์สำรองนี้? ข้อมูลปัจจุบันจะถูกแทนที่ (และส่งขึ้นเซิร์ฟเวอร์)')) return;
        S = j; mig(); save(); render(); toast('✅ นำเข้าข้อมูลสำรองแล้ว — กด SAVE เพื่อส่งขึ้นเซิร์ฟเวอร์ทันที', 'ok');
      } catch (x) { alert('นำเข้าไม่สำเร็จ: ' + x.message); }
    };
    r.readAsText(f); t.value = '';
  }
});
