let ed=-1,dr=null,nw=0,ia=0;
const isRest=m=>m.rest||/^พัก/.test(m.note),nbg=m=>m.bg||(isRest(m)?'#D9D9D9':'#FFE1CC'),nbox=m=>m.box?';border:3px solid #C0392B;outline:2px solid #fff;outline-offset:-5px':'',SW=['#D9D9D9','#FFE1CC','#FFF2CC','#FDE49B','#C6EFCE','#BDD7EE','#FFCCFF','#F8CBAD'],swatch=(i)=>SW.map(c=>`<button type=button data-act=sw data-i="${i}" data-c="${c}" title="${c}" style="background:${c};width:22px;height:22px;padding:0;border:1px solid #888;border-radius:4px;vertical-align:middle"></button>`).join(' '),CC={ก:'#FDE49B',ข:'#A6E3B7',ย:'#FFCCFF'},cl=o=>JSON.parse(JSON.stringify(o));
const fd=d=>d?new Date(d).toLocaleDateString('th-TH',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}):'';
const txt=(m,k)=>Array.isArray(m[k])?(ref(m[k])||''):m[k];
const sn=r=>S.sizes[r[0]].slice(0,gi(r[1])).reduce((x,y)=>x+y,0)+r[2],sd=(m,k)=>{const r=m[k];if(!Array.isArray(r))return{h:esc(r)};const t=ref(r),bd=`<b class=nb style="background:${CC[r[0]]}">${sn(r)}</b>`;return t===null?{x:1,h:`<i class=off>ไม่มีทีมที่ ${r[2]}</i>`}:{h:bd+(t?esc(t):`<i class=ph>สาย ${r[1]} ลำดับ ${r[2]}</i>`)}};
const BTN='<button data-act=ok>💾 บันทึก</button> <button data-act=cancel>ยกเลิก</button>',ACT=i=>`<button data-act=up data-i="${i}" title="เลื่อนขึ้น">▲</button><button data-act=down data-i="${i}" title="เลื่อนลง">▼</button> <button data-act=edit data-i="${i}">✏️ แก้ไข</button> <button data-act=del data-i="${i}">🗑 ลบ</button>`;
const opt=(a,v)=>a.map(x=>`<option${v==x?' selected':''}>${x}</option>`).join('');
function cancelEd(){if(ed>=0&&nw)S.m.splice(ed,1);ed=-1;nw=0;ia=0;dr=null;render()}
function startEd(i){if(ed>=0)cancelEd();ed=i;nw=0;dr=cl(S.m[i]);if(dr.note==null){dr.ta=txt(dr,'a');dr.tb=txt(dr,'b')}render()}
function addM(rest,at){if(ed>=0){if(nw&&at!=null&&ed<at)at--;cancelEd()}const a=[...S.m].reverse().find(x=>x.n),ins=at!=null,l=(ins?[...S.m].slice(0,at).reverse().find(x=>x.d):[...S.m].reverse().find(x=>x.d))||(ins&&S.m.slice(at).find(x=>x.d))||{};
const nd=(rest&&ins&&l.d)?new Date(Date.parse(l.d)+864e5).toISOString().slice(0,10):(l.d||'');
const m=rest?{note:'พักการแข่งขัน',rest:1,d:nd,det:''}:{n:Math.max(0,...S.m.map(x=>x.n||0))+1,d:l.d||'',t:'',c:cup=='all'?'ก':cup,g:'',r:'แรก',a:'',b:'',v:a?a.v:'',sa:'',sb:''};
if(ins){S.m.splice(at,0,m);ed=at;ia=1}else{S.m.push(m);ed=S.m.length-1;ia=0}nw=1;dr=cl(m);if(!rest){dr.ta='';dr.tb=''}render()}
function commit(){const o=S.m[ed],d=dr;
if(d.note!=null){d.note=d.note.trim()||'พักการแข่งขัน';if(/^พัก/.test(d.note))d.rest=1;else delete d.rest;if(!d.bg)delete d.bg;if(!d.box)delete d.box}
else{const nn=+d.n;if(nn&&S.m.some((x,j)=>j!=ed&&x.n===nn)){alert('เลขคู่ที่ '+nn+' ซ้ำกับคู่อื่นในโปรแกรม กรุณาใช้เลขอื่น');return}
if(nn&&nn!==o.n){d.n=nn;d.nm=1;if(!nw)remapN(o.n,nn)}else if(!nn){delete d.nm;d.n=o.n}else d.n=nn;['a','b'].forEach(k=>{const t=(d['t'+k]||'').trim();d[k]=(!nw&&Array.isArray(o[k])&&t===txt(o,k))?o[k]:t});delete d.ta;delete d.tb}
S.m.splice(ed,1);
if(nw&&!ia){let p=S.m.length;if(d.d){p=0;S.m.forEach((x,i)=>{if(x.d&&x.d<=d.d)p=i+1})}S.m.splice(p,0,d)}else S.m.splice(ed,0,d);
ed=-1;nw=0;ia=0;dr=null;renum();save();render()}
function remapN(a,b){S.docs.ref.concat(S.docs.rep).forEach(r=>{if(String(r.n)===String(a))r.n=String(b)});['a','b'].forEach(k=>{if((a+k) in S.lu){S.lu[b+k]=S.lu[a+k];delete S.lu[a+k]}})}
function renum(){const mp={},used=new Set(S.m.filter(m=>m.nm&&m.n!=null).map(m=>m.n));let k=0;S.m.forEach(m=>{if(m.n!=null){const o=m.n;if(m.nm){if(!(o in mp))mp[o]=o}else{do k++;while(used.has(k));m.n=k;if(!(o in mp))mp[o]=k}}});
['ref','rep'].forEach(t=>S.docs[t].forEach(r=>{if(r.n!==''&&r.n!=null)r.n=r.n in mp?String(mp[r.n]):''}));
const L={};for(const key in S.lu){const x=/^(\d+)([ab])$/.exec(key);if(x&&x[1] in mp)L[mp[x[1]]+x[2]]=S.lu[key]}S.lu=L}
function delM(i){const m=S.m[i];if(confirm('ลบ '+(m.note!=null?'รายการนี้':'คู่ที่ '+m.n)+' ?')){if(ed==i)ed=-1;else if(ed>i)ed--;S.m.splice(i,1);renum();save();render()}}
function vProg(){if(em)return vProgEdit();const VC=dayMap(S.m.filter(x=>x.note!=null?cup=='all':(cup=='all'||x.c==cup)));const off=S.m.filter(m=>m.n&&[m.a,m.b].some(r=>Array.isArray(r)&&ref(r)===null));
const gap=i=>cup=='all'?`<tr class=gap><td colspan=9><span class=gp>➕ แทรกตรงนี้: <button data-act=insm data-i="${i}">คู่แข่งขัน</button><button data-act=insr data-i="${i}">วันพัก / หัวข้อ</button></span></td></tr>`:'';
const tr=S.m.map((m,i)=>gap(i)+(()=>{const e=ed==i;
if(m.note!=null){if(cup!='all'&&!e)return'';
if(e)return`<tr class=ed><td colspan=9>วันพัก/หัวข้อ <input type=date data-e=d value="${dr.d||''}" style="width:150px"> <input data-e=note value="${esc(dr.note)}" placeholder="หัวข้อ เช่น พักการแข่งขัน 1 วัน" style="width:30%"> <input data-e=det value="${esc(dr.det||'')}" placeholder="รายละเอียด เช่น สมโภชกฐิน" style="width:30%"> <br>🎨 สีพื้นช่องข้อความ: <input type=color data-e=bg value="${nbg(dr)}" style="width:52px;height:30px;padding:0;vertical-align:middle"> ${swatch()} <label style="white-space:nowrap"><input type=checkbox data-e=box style="width:auto;vertical-align:middle"${dr.box?' checked':''}> ใส่กรอบ</label> <button type=button data-act=sw data-c="">คืนสีเดิม</button> ${BTN}</td></tr>`;
return`<tr style="background:${nbg(m)};font-weight:600${nbox(m)}"><td colspan=8>${m.d?fd(m.d)+' · ':''}${esc(m.note)}${m.det?' — '+esc(m.det):''}</td><td class=ac>${ACT(i)}</td></tr>`}
if(cup!='all'&&m.c!=cup&&!e)return'';
if(e)return`<tr class=ed><td><input type=number data-e=n min=1 value="${dr.n}" style="width:58px" title="แก้เลขคู่ได้ (ลบให้ว่างเพื่อกลับไปเรียงเลขอัตโนมัติ)"></td><td><input type=date data-e=d value="${dr.d||''}"></td><td><input class=s data-e=t value="${esc(dr.t)}"></td><td><select data-e=c>${opt(['','ก','ข','ย'],dr.c)}</select><select data-e=g>${opt(['','A','B','C','D'],dr.g)}</select><input data-e=r value="${esc(dr.r)}" style="width:96px"></td><td><input data-e=ta list="L${dr.c}" value="${esc(dr.ta)}"></td><td class=sc><input type=number data-e=sa value="${esc(dr.sa)}">-<input type=number data-e=sb value="${esc(dr.sb)}"></td><td><input data-e=tb list="L${dr.c}" value="${esc(dr.tb)}"></td><td><input data-e=v value="${esc(dr.v)}"></td><td class=ac>${BTN}</td></tr>`;
const a=sd(m,'a'),b=sd(m,'b');
return`<tr class="${a.x||b.x?'off':''} ${VC.get(m)||''}"><td>${m.n}</td><td>${fd(m.d)}</td><td>${esc(m.t)}</td><td><span class=cp style="background:${CC[m.c]||'#fff'}">${m.c}${m.g}</span> <small>${esc(m.r)}</small></td><td>${a.h}</td><td class=sc><input type=number data-k="m|${i}|sa" value="${esc(m.sa)}">-<input type=number data-k="m|${i}|sb" value="${esc(m.sb)}"></td><td>${b.h}</td><td>${esc(m.v)}</td><td class=ac>${ACT(i)}</td></tr>`})()).join('')+gap(S.m.length);
return`<div class=warn>📅 วันที่ในไฟล์ Excel เป็นของปี 2568 — เลือกวันแข่งนัดแรกของปีนี้แล้วกด “เลื่อนทั้งโปรแกรม”${off.length?`<br>⚠️ ${off.length} คู่ (สีจาง) ใช้ทีมที่ไม่มีในสาย เช่น เยาวชนสาย A ทีมที่ 4 — ถ้าสายนั้นมี 4 ทีมให้เพิ่มจำนวนทีมที่หน้าจับสลาก`:''}</div>
<div class=chips>${['all',...CUPS].map(c=>`<button data-cup="${c}" class="${cup==c?'on':''}">${c=='all'?'ทั้งหมด':NAME[c]}</button>`).join('')}<input type=date id=sh><button data-act=shift>เลื่อนทั้งโปรแกรม (คู่ที่ 1 = วันนี้)</button></div>
<div class=chips><button data-act=add>➕ เพิ่มคู่แข่งขัน</button><button data-act=addrest>➕ เพิ่มวันพัก</button><small>กด ➕ แทรก ระหว่างแถวเพื่อเพิ่มคู่หรือวันพักตรงตำแหน่งที่ต้องการ · เลขคู่ที่เรียงใหม่อัตโนมัติเมื่อเพิ่ม/ลบ · ช่องผลประตูกรอกได้ทันที · ส่วนอื่นกด ✏️ แก้ไข แล้ว 💾 บันทึก</small></div>
<div class=chips><button data-act=pprint>🖨 สั่งพิมพ์โปรแกรม (A4 แนวตั้ง)</button><button data-act=ppdf>📄 ส่งเป็น PDF (A4 แนวตั้ง)</button><button data-act=dlcsv>⬇️ ดาวน์โหลด Excel (.csv)</button><button data-act=dlhtml>⬇️ ดาวน์โหลดไฟล์โปรแกรม (.html พร้อมพิมพ์)</button><small>พิมพ์ตามตัวกรองถ้วยที่เลือก · PDF: เลือกเครื่องพิมพ์ “บันทึกเป็น PDF” ในหน้าต่างที่เปิดขึ้น</small></div>
<div class=tw><table><tr><th>คู่</th><th>วันที่</th><th>เวลา</th><th>ถ้วย/สาย/รอบ</th><th>ทีม</th><th>ผล</th><th>ทีม</th><th>สนาม</th><th></th></tr>${tr}</table></div>${CUPS.map(c=>`<datalist id="L${c}">${S.teams[c].filter(Boolean).map(n=>`<option value="${esc(n)}">`).join('')}</datalist>`).join('')}`}
document.addEventListener('input',e=>{const f=e.target.dataset.e;if(f&&dr)dr[f]=e.target.type=='checkbox'?(e.target.checked?1:0):e.target.value});

let em=0,dm=null,eu=0;
const dayCls=(a,i)=>{const m=a[i];if(m.note!=null)return'de';const sm=x=>x&&x.note==null&&x.d&&x.d===m.d,sp=sm(a[i-1]),sn=sm(a[i+1]);return(sp?'sp ':'')+(sn?'sn':'de')};
const dayMap=a=>new Map(a.map((m,i)=>[m,dayCls(a,i)]));
const calcN=L=>{const used=new Set(),o=new Map();L.forEach(m=>{if(m.note==null&&m.mn!==''&&m.mn!=null&&+m.mn>0)used.add(+m.mn)});let k=0;L.forEach(m=>{if(m.note!=null)return;if(m.mn!==''&&m.mn!=null&&+m.mn>0)o.set(m,+m.mn);else{do k++;while(used.has(k));o.set(m,k)}});return o};
const vis=m=>m.note!=null?cup=='all':(cup=='all'||m.c==cup);
function rr(u){const y=scrollY;render();scrollTo(0,y);if(u){const el=document.querySelector('[data-u="'+u+'"]');if(el)el.scrollIntoView({block:'nearest'})}}
function enterEd(){if(em)return;if(ed>=0)cancelEd();em=1;dm=cl(S.m);dm.forEach(m=>{m._u=++eu;if(m.note==null){m._o=m.n;m.mn=m.nm?m.n:'';m.ta=txt(m,'a');m.tb=txt(m,'b')}})}
function moveRow(L,i,dir){let j=i+dir;while(j>=0&&j<L.length&&!vis(L[j]))j+=dir;if(j<0||j>=L.length)return false;L.splice(j,0,L.splice(i,1)[0]);return true}
function newRow(rest,at){const prev=dm.slice(0,at).reverse().find(x=>x.d)||dm.slice(at).find(x=>x.d)||{},pm=[...dm.slice(0,at)].reverse().find(x=>x.note==null)||{};
return rest?{note:'พักการแข่งขัน',rest:1,d:prev.d||'',det:'',_u:++eu}:{n:0,mn:'',d:prev.d||'',t:'',c:cup=='all'?(pm.c||'ก'):cup,g:'',r:'แรก',a:'',b:'',ta:'',tb:'',v:pm.v||'',sa:'',sb:'',_u:++eu}}
function saveAll(){const L=dm,man=L.filter(m=>m.note==null&&m.mn!==''&&+m.mn>0).map(m=>+m.mn);
if(new Set(man).size!=man.length){alert('มีเลขคู่ที่กำหนดเองซ้ำกัน กรุณาแก้ไขก่อนบันทึก');return false}
const fin=calcN(L),mp={};
L.forEach(m=>{if(m.note!=null){m.note=(m.note||'').trim()||'พักการแข่งขัน';if(/^พัก/.test(m.note))m.rest=1;else delete m.rest;if(!m.bg)delete m.bg;if(!m.box)delete m.box;delete m._u;return}
['a','b'].forEach(k=>{const t=(m['t'+k]||'').trim();m[k]=(Array.isArray(m[k])&&t===txt(m,k))?m[k]:t});
const n=fin.get(m);if(m.mn!==''&&+m.mn>0)m.nm=1;else delete m.nm;if(m._o!=null&&!(m._o in mp))mp[m._o]=n;m.n=n;['ta','tb','mn','_o','_u'].forEach(k=>delete m[k])});
['ref','rep'].forEach(t=>S.docs[t].forEach(r=>{if(r.n!==''&&r.n!=null)r.n=r.n in mp?String(mp[r.n]):''}));
const LU={};for(const key in S.lu){const x=/^(\d+)([ab])$/.exec(key);if(x&&x[1] in mp)LU[mp[x[1]]+x[2]]=S.lu[key]}S.lu=LU;
S.m=L;em=0;dm=null;save();render();return true}
function gapRow(i){return cup=='all'?`<tr class=gap><td colspan=9><span class=gp>➕ แทรกตรงนี้: <button data-act=insm data-i="${i}">คู่แข่งขัน</button><button data-act=insr data-i="${i}">วันพัก / หัวข้อ</button></span></td></tr>`:''}
function vProgEdit(){const fin=calcN(dm),VC=dayMap(dm.filter(vis)),T=(i,f,v,x='')=>`<input data-r="${i}|${f}" value="${esc(v==null?'':v)}"${x}>`;
const rows=dm.map((m,i)=>{if(!vis(m))return'';const u=`data-u="${m._u}" style="scroll-margin-top:70px"`,mv=`<button data-act=up data-i="${i}" title="เลื่อนขึ้น">▲</button><button data-act=down data-i="${i}" title="เลื่อนลง">▼</button> <button data-act=del data-i="${i}">🗑</button>`;
if(m.note!=null)return gapRow(i)+`<tr class=ed ${u}><td colspan=8 style="background:${nbg(m)}${nbox(m)}">วันพัก/หัวข้อ <input type=date data-r="${i}|d" value="${m.d||''}" style="width:150px"> ${T(i,'note',m.note,' placeholder="หัวข้อ เช่น พักการแข่งขัน 1 วัน" style="width:30%"')} ${T(i,'det',m.det||'',' placeholder="รายละเอียด" style="width:30%"')}<br>🎨 สีพื้น: <input type=color data-r="${i}|bg" value="${nbg(m)}" style="width:52px;height:30px;padding:0;vertical-align:middle"> ${swatch(i)} <label style="white-space:nowrap"><input type=checkbox data-r="${i}|box" style="width:auto;vertical-align:middle"${m.box?' checked':''}> ใส่กรอบ</label> <button type=button data-act=sw data-i="${i}" data-c="">คืนสีเดิม</button></td><td class=ac>${mv}</td></tr>`;
return gapRow(i)+`<tr class="ed ${VC.get(m)||''}" ${u}><td><input type=number min=1 data-r="${i}|mn" data-num value="${fin.get(m)}" style="width:58px;${m.mn!==''&&+m.mn>0?'background:#fff3b0':''}" title="เลขคู่ปรับอัตโนมัติ — พิมพ์เพื่อกำหนดเอง (ลบให้ว่างเพื่อกลับเป็นอัตโนมัติ)"></td><td><input type=date data-r="${i}|d" value="${m.d||''}"></td><td>${T(i,'t',m.t,' class=s')}</td><td><select data-r="${i}|c" data-rr>${opt(['','ก','ข','ย'],m.c)}</select><select data-r="${i}|g">${opt(['','A','B','C','D'],m.g)}</select>${T(i,'r',m.r,' style="width:96px"')}</td><td>${T(i,'ta',m.ta,` list="L${m.c}"`)}</td><td class=sc><input type=number data-r="${i}|sa" value="${esc(m.sa)}">-<input type=number data-r="${i}|sb" value="${esc(m.sb)}"></td><td>${T(i,'tb',m.tb,` list="L${m.c}"`)}</td><td>${T(i,'v',m.v)}</td><td class=ac>${mv}</td></tr>`}).join('')+gapRow(dm.length);
const bar=`<div class=chips style="position:sticky;top:56px;z-index:4;background:#fffbe6;border:1px solid #fedf89;border-radius:10px;padding:6px 10px"><b>✏️ โหมดแก้ไข</b><button data-act=eaok style="background:#0b6b5c;color:#fff">💾 บันทึกทั้งหมด</button><button data-act=eacancel>ยกเลิก</button><button data-act=add>➕ เพิ่มคู่แข่งขัน</button><button data-act=addrest>➕ เพิ่มวันพัก</button><small>แก้ได้ทุกแถวต่อเนื่อง · ▲▼ เลื่อนแถว เลขคู่ปรับอัตโนมัติ · แล้วกด 💾 บันทึกทั้งหมด</small></div>`;
return`${bar}<div class=chips>${['all',...CUPS].map(c=>`<button data-cup="${c}" class="${cup==c?'on':''}">${c=='all'?'ทั้งหมด':NAME[c]}</button>`).join('')}</div>
<div class=tw><table><tr><th>คู่</th><th>วันที่</th><th>เวลา</th><th>ถ้วย/สาย/รอบ</th><th>ทีม</th><th>ผล</th><th>ทีม</th><th>สนาม</th><th></th></tr>${rows}</table></div>
<div class=chips><button data-act=eaok style="background:#0b6b5c;color:#fff">💾 บันทึกทั้งหมด</button><button data-act=eacancel>ยกเลิก</button></div>${CUPS.map(c=>`<datalist id="L${c}">${S.teams[c].filter(Boolean).map(n=>`<option value="${esc(n)}">`).join('')}</datalist>`).join('')}`}
document.addEventListener('input',e=>{const el=e.target,r=el.dataset.r;if(!r||!em)return;const[i,f]=r.split('|');if(f=='mn')return;dm[+i][f]=el.type=='checkbox'?(el.checked?1:0):el.value});
document.addEventListener('change',e=>{const el=e.target,r=el.dataset.r;if(!r||!em)return;const[i,f]=r.split('|'),m=dm[+i];if(f=='mn'){m.mn=el.value.trim();rr(m._u)}else if(f=='bg'||f=='box'||el.dataset.rr!=null)rr(m._u)});
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b||tab!='prog')return;const a=b.dataset.act,i=+b.dataset.i,H=['edit','add','addrest','insm','insr','up','down','eaok','eacancel'];
if(!(H.includes(a)||(a=='del'&&em)||(a=='sw'&&em)))return;e.stopImmediatePropagation();
if(a=='eaok'){saveAll();return}
if(a=='eacancel'){if(confirm('ยกเลิกการแก้ไขทั้งหมดที่ยังไม่ได้บันทึก?')){em=0;dm=null;render()}return}
if(a=='up'||a=='down'){const L=em?dm:S.m,u=L[i]&&L[i]._u;if(moveRow(L,i,a=='up'?-1:1)){if(!em){renum();save()}rr(u)}return}
if(a=='sw'){const m=dm[i];m.bg=b.dataset.c;rr(m._u);return}
if(a=='del'){if(confirm('ลบ '+(dm[i].note!=null?'รายการนี้':'คู่นี้')+' ?')){dm.splice(i,1);rr()}return}
enterEd();
if(a=='add'||a=='addrest'){const x=newRow(a=='addrest',dm.length);dm.push(x);rr(x._u)}
else if(a=='insm'||a=='insr'){const x=newRow(a=='insr',i);dm.splice(i,0,x);rr(x._u)}
else rr(dm[i]&&dm[i]._u)},true);

function dlFile(name,type,data){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
function dlProg(kind){const sfx=cup=='all'?'':'-'+cup,L=S.m.filter(m=>m.note!=null?cup=='all':(cup=='all'||m.c==cup));
if(kind=='csv'){const q=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"',nm=(m,k)=>{const r=m[k];if(!Array.isArray(r))return r||'';const t=ref(r);return t===null?'(ไม่มีทีม)':t?t:'สาย '+r[1]+' ลำดับ '+r[2]};
const rows=[['คู่','วันที่','เวลา','ถ้วย','สาย','รอบ','ทีม','ผลทีมแรก','ผลทีมหลัง','ทีม','สนาม'],...L.map(m=>m.note!=null?['',m.d?fd(m.d):'','','','','',m.note+(m.det?' — '+m.det:''),'','','','']:[m.n,fd(m.d),m.t,m.c,m.g,m.r,nm(m,'a'),m.sa,m.sb,nm(m,'b'),m.v])];
dlFile('loykrathong54-program'+sfx+'.csv','text/csv;charset=utf-8','﻿'+rows.map(r=>r.map(q).join(',')).join('\r\n'));return}
window._dl=1;try{prnProg()}finally{window._dl=0}
const h=$('#pr').innerHTML;$('#pr').innerHTML='';$('#pr').style.cssText='';
dlFile('loykrathong54-program'+sfx+'.html','text/html;charset=utf-8','<!doctype html><html lang=th><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>โปรแกรมการแข่งขัน</title><style>@page{size:A4 portrait;margin:10mm}body{font-family:Sarabun,Tahoma,sans-serif;margin:10mm auto;max-width:190mm;color:#000}.pth{text-align:center;font-weight:700;font-size:14px;margin-bottom:6px}.np{margin-bottom:8px;padding:6px 14px;font:inherit;cursor:pointer}@media print{.np{display:none}body{margin:0;max-width:none}}</style></head><body><button class=np onclick="print()">🖨 พิมพ์ / บันทึกเป็น PDF</button>'+h+'</body></html>')}
document.addEventListener('click',e=>{const b=e.target.closest('[data-act=dlcsv],[data-act=dlhtml]');if(b)dlProg(b.dataset.act=='dlcsv'?'csv':'html')});
