let CM=[];
function cauMiss(){const w=x=>String(x==null?'':x).trim().toLowerCase(),out=[];
S.docs.rep.forEach(r=>{const m=S.m.find(x=>x.n==r.n)||{},ta=w(r.ta||txt(m,'a')),tb=w(r.tb||txt(m,'b')),TA=r.ta||txt(m,'a')||'',TB=r.tb||txt(m,'b')||'',d=r.d||m.d||'',P={};
[['yc','y'],['rd','rd']].forEach(([f,k])=>String(r[f]||'').split(/\n|;/).map(x=>x.trim()).filter(x=>x&&!/^[-–—.\s]*$/.test(x)).forEach(line=>{
let tm='',no='',nm='';const tk=line.split('/').map(x=>x.trim());
if(tk.length>=2){const t0=w(tk[0]);tm=t0&&ta&&(t0.includes(ta)||ta.includes(t0))?TA:t0&&tb&&(t0.includes(tb)||tb.includes(t0))?TB:/^(ทีม\s*)?a$/.test(t0)?TA:/^(ทีม\s*)?b$/.test(t0)?TB:'';
if(/^\d{1,3}$/.test(tk[1])){no=tk[1];nm=tk[2]||''}else{nm=tk[1]}}
else{const l=w(line);tm=ta&&l.includes(ta)?TA:tb&&l.includes(tb)?TB:'';nm=line.replace(/\d+\s*(นาที|')?/g,'').replace(/นาที|เบอร์|หมายเลข|ใบเหลือง|ใบแดง/g,'').trim()}
nm=nm.replace(/\s*\d+\s*(นาที|')?\s*$/,'').trim();
const key=(tm||'?')+'|'+(w(nm)||('#'+no)||w(line));const o=P[key]=P[key]||{tm,no,nm,y:0,rd:0,line};o[k]++;if(!o.no&&no)o.no=no}));
Object.values(P).forEach(o=>{const ok=S.docs.cau.some(c=>(!d||!c.d||c.d===d)&&(o.tm?w(c.tm)===w(o.tm):true)&&((o.nm&&w(c.nm)&&w(c.nm)===w(o.nm))||(!o.nm&&o.no&&String(c.no)===o.no)||(o.nm&&!w(c.nm)&&o.no&&String(c.no)===o.no)||(!o.tm&&!o.nm&&!o.no))&&(+c.y||0)>=o.y&&(+c.rd||0)>=o.rd);
if(!ok)out.push({n:r.n,d,c:m.c||'',...o})})});return out}
function chkCau(){CM=cauMiss();const has=S.docs.rep.some(r=>String(r.yc||'').trim()||String(r.rd||'').trim());
if(!has)return'<div class=warn>🔎 ตรวจอัตโนมัติ: ยังไม่มีรายการคาดโทษ/ไล่ออกในหน้า “ผลตัดสิน” ให้ตรวจ</div>';
if(!CM.length)return'<div class=warn style="background:#ecfdf3;border-color:#abefc6">✅ ตรวจอัตโนมัติจาก “ผลตัดสิน”: ใบคาดโทษครบถ้วนแล้ว</div>';
return`<div class=warn style="background:#fef3f2;border-color:#fda29b">⚠️ ตรวจอัตโนมัติจาก “ผลตัดสิน”: พบ ${CM.length} รายการที่ยังไม่ได้กรอกในใบคาดโทษ<br>${CM.map((x,i)=>`• คู่ที่ ${esc(x.n)} ${x.d?fd(x.d):''} · ${esc(x.tm||'ไม่ทราบทีม')} · ${x.no?'เบอร์ '+esc(x.no)+' ':''}${esc(x.nm)||(!x.no?esc(x.line):'')} · ${x.y?'เหลือง '+x.y+' ใบ ':''}${x.rd?'แดง '+x.rd+' ใบ':''} <b style="color:#b54708">[รอตรวจสอบ / กำลังตรวจ]</b> <button data-act=cfill data-i="${i}">➕ เติมลงใบคาดโทษ</button>`).join('<br>')}</div>`}
function repAll(){const w=x=>String(x==null?'':x).trim().toLowerCase(),out=[];
S.docs.rep.forEach(r=>{const m=S.m.find(x=>x.n==r.n)||{},ta=w(r.ta||txt(m,'a')),tb=w(r.tb||txt(m,'b')),TA=r.ta||txt(m,'a')||'',TB=r.tb||txt(m,'b')||'',d=r.d||m.d||'',P={};
[['yc','y'],['rd','rd']].forEach(([f,k])=>String(r[f]||'').split(/\n|;/).map(x=>x.trim()).filter(x=>x&&!/^[-–—.\s]*$/.test(x)).forEach(line=>{
let tm='',no='',nm='';const tk=line.split('/').map(x=>x.trim());
if(tk.length>=2){const t0=w(tk[0]);tm=t0&&ta&&(t0.includes(ta)||ta.includes(t0))?TA:t0&&tb&&(t0.includes(tb)||tb.includes(t0))?TB:/^(ทีม\s*)?a$/.test(t0)?TA:/^(ทีม\s*)?b$/.test(t0)?TB:'';
if(/^\d{1,3}$/.test(tk[1])){no=tk[1];nm=tk[2]||''}else{nm=tk[1]}}
else{const l=w(line);tm=ta&&l.includes(ta)?TA:tb&&l.includes(tb)?TB:'';nm=line.replace(/\d+\s*(นาที|')?/g,'').replace(/นาที|เบอร์|หมายเลข|ใบเหลือง|ใบแดง/g,'').trim()}
nm=nm.replace(/\s*\d+\s*(นาที|')?\s*$/,'').trim();
const key=(tm||'?')+'|'+(w(nm)||('#'+no)||w(line));const o=P[key]=P[key]||{tm,no,nm,y:0,rd:0,d};o[k]++;if(!o.no&&no)o.no=no}));
out.push(...Object.values(P))});return out}
function cst(r){const w=x=>String(x==null?'':x).trim().toLowerCase();
if(!(w(r.tm)&&(w(r.nm)||w(r.no))&&r.d&&((+r.y||0)>0||(+r.rd||0)>0)))return'w';
const E=repAll().filter(o=>(!o.d||o.d===r.d)&&(!o.tm||w(o.tm)===w(r.tm))&&((o.nm&&w(r.nm)&&w(r.nm)===w(o.nm))||((!o.nm||!w(r.nm))&&o.no&&String(r.no)===o.no)));
if(!E.length)return'd';return E.some(o=>o.y===(+r.y||0)&&o.rd===(+r.rd||0))?'v':'w'}
function stb(r){const t=cst(r),M={v:['ตรวจสอบแล้ว','#ecfdf3','#067647'],d:['ดำเนินการแล้ว','#eff8ff','#175cd3'],w:['รอตรวจสอบ / กำลังตรวจ','#fffaeb','#b54708']}[t];
return`<span style="display:inline-block;padding:2px 8px;border-radius:99px;font-size:12px;white-space:nowrap;background:${M[1]};color:${M[2]};border:1px solid ${M[2]}55">${M[0]}</span>`}
const STT=r=>({v:'ตรวจสอบแล้ว',d:'ดำเนินการแล้ว',w:'รอตรวจสอบ / กำลังตรวจ'}[cst(r)]);
function vDoc(k){const D=DOCS[k],L=S.docs[k],all=CUPS.flatMap(c=>S.teams[c]);
const fm=dd&&dd.k==k?`<section class=ed><div class=fg>${D.f.map(([f,l,t,o])=>`<label>${l}${t=='area'?`<textarea data-g="${f}">${esc(dd.r[f])}</textarea>`:t=='cup'||t=='sel'?`<select data-g="${f}">${opt(t=='cup'?['','ก','ข','ย']:o,dd.r[f])}</select>`:`<input type="${t=='date'||t=='number'?t:'text'}" data-g="${f}"${t=='team'?' list=LT':''} value="${esc(dd.r[f])}">`}</label>`).join('')}</div><div class=chips>${D.f.some(x=>x[0]=='n')?'<button data-act=fill>⤵ ดึงจากโปรแกรม (ตามคู่ที่)</button>':''}<button data-act=dok>💾 บันทึก</button><button data-act=dcancel>ยกเลิก</button></div></section>`:'';
return`${k=='cau'?chkCau()+bondP():''}<div class=chips><button data-act=dadd>➕ เพิ่ม${D.t}</button>${k=='cau'?'<button data-act=cprint>🖨 สั่งพิมพ์ใบคาดโทษ (A4 แนวตั้ง)</button>':''}${k=='spon'?`<button data-act=sprint>🖨 สั่งพิมพ์รายชื่อผู้สนับสนุน (A4 แนวตั้ง)</button><b style="margin-left:8px">ยอดรวม ${spTot().toLocaleString('th-TH')} บาท</b>`:''}<small>${L.length} รายการ</small></div>${fm}<div class=tw><table><tr>${D.f.map(x=>`<th>${x[1]}</th>`).join('')}${k=='cau'?'<th>สถานะ</th>':''}<th></th></tr>${L.map((r,i)=>`<tr style="background:${CC[r.c]?CC[r.c]+'44':''}">${D.f.map(x=>`<td${x[0]=='amt'?' style="text-align:right"':''}>${x[0]=='amt'&&r.amt!==''&&r.amt!=null?Number(r.amt).toLocaleString('th-TH'):esc(r[x[0]])}</td>`).join('')}${k=='cau'?'<td>'+stb(r)+'</td>':''}<td class=ac><button data-act=dedit data-i="${i}">✏️</button><button data-act=ddel data-i="${i}">🗑</button></td></tr>`).join('')}${k=='spon'?`<tr style="background:#eef0f4;font-weight:700"><td colspan=2 style="text-align:right">ยอดรวมทั้งหมด (${L.length} ราย)</td><td style="text-align:right">${spTot().toLocaleString('th-TH')}</td><td colspan=3>บาท</td></tr>`:''}</table></div><datalist id=LT>${all.map(n=>`<option value="${esc(n)}">`).join('')}</datalist>`}
function xs(){const nm=k=>{const[c,j]=k.split('_');return[c,S.teams[c][j]||'']},o=[];
o.push({n:'นักกีฬา',h:['ถ้วย','ทีม','เบอร์','ชื่อ'],r:Object.keys(S.pl).flatMap(k=>Object.entries(S.pl[k]).filter(e=>e[1]).map(e=>[...nm(k),e[0]=='mgr'?'ผู้จัดการทีม':e[0],e[1]]))});
o.push({n:'เจ้าหน้าที่',h:['ถ้วย','ทีม','ตำแหน่ง','ชื่อ'],r:Object.keys(S.st).flatMap(k=>Object.entries(S.st[k]).filter(e=>e[1]).map(e=>[...nm(k),SR[e[0]]||e[0],e[1]]))});
for(const k in DOCS)o.push({n:DOCS[k].t.replace('/','-'),h:DOCS[k].f.map(x=>x[1]),r:S.docs[k].map(r=>DOCS[k].f.map(x=>r[x[0]]==null?'':r[x[0]]))});o.push({n:'ค่าประกันทีม',h:['ถ้วย','ทีม','ค่าประกัน','หักแล้ว','คงเหลือ'],r:CUPS.flatMap(c=>S.teams[c].map((n,i)=>{const d=+S.bond.dep[c+'_'+i]||0,x=S.docs.cau.filter(r=>r.tm==n).reduce((a,r)=>a+(+r.fine||0),0);return[c,n,d,x,d-x]}))});return o}
