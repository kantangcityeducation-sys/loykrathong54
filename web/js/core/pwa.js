/* ติดตั้งเป็นแอป + เปิดได้แม้ไม่มีอินเทอร์เน็ต (Service Worker)
   ใช้ได้เมื่อเปิดผ่าน http(s) — ถ้าเปิดไฟล์ตรง ๆ (file://) จะไม่ลงทะเบียน แต่ข้อมูลยังเก็บในเครื่องได้ */
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
