/* เริ่มระบบ — ต้องโหลดเป็นไฟล์สุดท้าย */
/* เครื่องที่ยังไม่เคยแก้ไขข้อมูล (ยังเป็นข้อมูลตั้งต้นจากไฟล์ Excel, ts<=1) ต้องไม่ไปทับข้อมูลบนเซิร์ฟเวอร์
   — mig() จะประทับเวลา "ตอนนี้" ให้ข้อมูลที่อัปเกรด จึงต้องคืนค่า ts เดิมไว้ ให้ฉบับบนเซิร์ฟเวอร์ชนะเสมอ */
const pristine = !S.ts || S.ts <= 1;
mig();
if (pristine) { S.ts = 1; dirty = 0; }
stash();
if (!api) dirty = 0;   // ใช้ในเครื่องอย่างเดียว: ไม่มีอะไรรอส่ง (ถ้าตั้งลิงก์ภายหลัง ระบบเทียบเวลาแล้วส่งเอง)
addEventListener('online', () => { st(); pull(); pushImg(); });
addEventListener('offline', () => st());
setInterval(() => { if (!document.hidden) { pull(); pushImg(); } }, 20000);
render(); st(); pull(); pullImg(); pushImg();
