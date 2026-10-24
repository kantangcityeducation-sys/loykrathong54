/* ===== โหมดจอโปรเจคเตอร์ ===== */
const SCD={mode:'auto',day:'',cup:'all',sec:12,pause:0,n:0,cmd:''};
const scC=()=>{let o={};try{o=JSON.parse(localStorage.cl54scr)||{}}catch(e){}return Object.assign({},SCD,o)};
function scSet(p){try{localStorage.cl54scr=JSON.stringify(Object.assign(scC(),p))}catch(e){}render()}
let SCI=0,SCT=0,SCN=SCR?scC().n:0,SCK='';
function scSlides(C){const RA=repAll(),cv=cvo(),today=new Date().toLocaleDateString('en-CA'),
mt=S.m.filter(m=>m.n&&m.d&&(C.cup=='all'||m.c==C.cup)),days=[...new Set(mt.map(m=>m.d))].sort(),
dn=d=>mt.some(m=>m.d===d&&mres(m,RA).done),
rd=C.day||(days.includes(today)&&dn(today)?today:[...days].reverse().find(dn)||days[0]);
const logo=(m,k)=>{const t=txt(m,k),cs=m.c?[m.c]:CUPS;let im='';if(t)for(const c of cs){const j=(S.teams[c]||[]).indexOf(t);if(j>=0&&IM['lg_'+c+'_'+j+'_0']){im=IM['lg_'+c+'_'+j+'_0'];break}}return im?`<div class=sc-tl><img src="${im}"></div>`:'<div class="sc-tl e">⚽</div>'};
const nm=(m,k)=>{const r=m[k];if(!Array.isArray(r))return esc(r);const t=ref(r);return t===null?'(ไม่มีทีม)':t?esc(t):`สาย ${esc(r[1])} ลำดับ ${esc(r[2])}`};
const cdh=(c,v,cl)=>v!==''&&+v>0?`<span class=${cl}><i></i>${esc(v)}</span>`:'';
const card=(m,res)=>{const o=mres(m,RA);if(m.note!=null)return`<div class="sc-c w" style="background:${nbg(m)}${nbox(m)}">${m.d?fd(m.d)+' · ':''}${esc(m.note)}${m.det?'<br><small style="font-weight:600;color:#444">'+esc(m.det)+'</small>':''}</div>`;
return`<div class=sc-c><div class=sc-cap>${m.c?`<span class=sc-cp style="background:${CC[m.c]||'#eee'}">${esc(m.c)}${esc(m.g)}</span>`:''}<span>${[m.r,'คู่ที่ '+m.n,res?'':fd(m.d),m.t,m.v].filter(Boolean).map(esc).join(' · ')}</span></div>
<div class=sc-b><div class=sc-tm>${logo(m,'a')}${nm(m,'a')}</div><div>${res&&o.done?`<div class=sc-sc>${esc(o.sa)} - ${esc(o.sb)}</div>${o.pa!==''&&o.pb!==''?`<div class=sc-pn>จุดโทษ ${esc(o.pa)}-${esc(o.pb)}</div>`:''}`:`<div class="sc-sc nr">${res?'รอผล':'VS'}</div>`}</div><div class=sc-tm>${logo(m,'b')}${nm(m,'b')}</div></div>
<div class=sc-cd>${res&&o.done?`<span class=l style="display:flex;gap:.6em">${cdh(o.ya,o.ya,'y')}${cdh(o.ra,o.ra,'r')}</span><span class=rt style="display:flex;gap:.6em">${cdh(o.yb,o.yb,'y')}${cdh(o.rb,o.rb,'r')}</span>`:''}</div></div>`};
const hd=(t,sub)=>`<div class=sc-h>${IM.lg_cover2?`<img src="${IM.lg_cover2}">`:'<span class=e></span>'}<div class=sc-ht><b>${t}</b><span>${sub||''}</span></div>${IM.lg_cover?`<img src="${IM.lg_cover}">`:'<span class=e></span>'}</div>`;
const chunk=(a,n)=>{const r=[];for(let i=0;i<a.length;i+=n)r.push(a.slice(i,i+n));return r};
const wrap=(h,b,f)=>`${h}${b}${f||''}`;
const out={};
// ปก
out.cover=[`<div class=sc-cv><div>${IM.lg_cover2?`<img src="${IM.lg_cover2}" style="width:4em;height:4em;border-radius:50%;background:#fff;object-fit:contain">`:''}<div class=t>ระบบบันทึก<br>ฟุตบอล${esc(cv.n.replace(/^ฟุตบอล/,''))}</div>${IM.lg_cover?`<img class=big src="${IM.lg_cover}">`:'<div style="font-size:6em">⚽</div>'}<div class=s>${esc(cv.org)} · ครั้งที่ ${esc(cv.no)} · ประจำปี ${esc(cv.yr)}</div></div></div>`];
// ตารางแบ่งสาย
out.groups=CUPS.filter(c=>C.cup=='all'||c==C.cup).map(c=>{const sz=S.sizes[c],gs=G.map((g,k)=>({g,n:sz[k]})).filter(x=>x.n>0);if(!gs.length)return'';
const gh=x=>{let rows='';for(let i=0;i<x.n;i++){const v=S.draw[c][x.g][i],ok=v!==''&&v!=null,t=ok?S.teams[c][v]:'',im=ok?IM['lg_'+c+'_'+v+'_0']:'';
rows+=`<div class="sc-gr${ok?'':' em'}"><b style="background:${CC[c]}">${i+1}</b>${im?`<img src="${im}">`:'<span class=ni></span>'}<span>${ok?esc(t):'รอจับสลาก'}</span></div>`}
return`<div class=sc-gc><div class=sc-gt style="background:${CC[c]}">สาย ${x.g}</div>${rows}</div>`};
return wrap(hd('การแบ่งสาย · '+esc(NAME[c]),'ผลการจับสลากแบ่งสาย'),`<div class=sc-gg style="grid-template-columns:repeat(${gs.length<=2?gs.length:2},1fr)">${gs.map(gh).join('')}</div>`)}).filter(Boolean);
// ผล
const rm=S.m.filter(m=>m.d===rd&&(m.note!=null||(m.n&&(C.cup=='all'||m.c==C.cup))));
out.results=rm.length?chunk(rm,4).map((g,i,a)=>wrap(hd('ผลการแข่งขัน',fd(rd)+(a.length>1?` · หน้า ${i+1}/${a.length}`:'')),`<div class=sc-g>${g.map(m=>card(m,1)).join('')}</div>`)):[];
// โปรแกรมถัดไป
let up=S.m.filter(m=>m.d&&m.d>=today&&(m.note!=null||(m.n&&(C.cup=='all'||m.c==C.cup)&&!mres(m,RA).done)));
if(!up.some(m=>m.note==null))up=S.m.filter(m=>m.n&&(C.cup=='all'||m.c==C.cup)&&!mres(m,RA).done);
up=up.filter((m,i,a)=>m.note==null||a.slice(i).some(x=>x.note==null));
let k=0;up=up.filter(m=>m.note!=null||k++<8);
out.next=up.length?chunk(up,4).map((g,i,a)=>wrap(hd('โปรแกรมการแข่งขัน','คู่ถัดไป'+(a.length>1?` · หน้า ${i+1}/${a.length}`:'')),`<div class=sc-g>${g.map(m=>card(m,0)).join('')}</div>`)):[];
// ผู้สนับสนุน
const sp=S.docs.spon,tot=sp.reduce((a,r)=>a+(+r.amt||0),0),f=n=>Number(n).toLocaleString('th-TH');
out.spon=sp.length?chunk(sp,8).map((g,i,a)=>{const b=i*8;return wrap(hd('ขอขอบคุณผู้สนับสนุน',a.length>1?`หน้า ${i+1}/${a.length}`:''),`<div class=sc-tb><table><tr><th>ที่</th><th>ชื่อผู้สนับสนุน</th><th>จำนวนเงิน (บาท)</th><th>ป้ายชื่อ</th></tr>${g.map((r,j)=>`<tr><td class=n>${b+j+1}</td><td>${esc(r.nm)}</td><td class=a>${r.amt===''||r.amt==null?'':f(r.amt)}</td><td>${esc(r.sg)}</td></tr>`).join('')}</table></div><div class=sc-tot>ยอดรวม ${f(tot)} บาท</div>`)}):[];
const L=C.mode=='auto'?[...out.cover,...out.groups,...out.results,...out.next,...out.spon]:(out[C.mode]&&out[C.mode].length?out[C.mode]:[`<div class=sc-empty>ยังไม่มีข้อมูลสำหรับแสดง</div>`]);
return L}
function scrDraw(){document.body.classList.add('scr');const C=scC(),key=[C.mode,C.day,C.cup].join('|');if(key!==SCK){SCK=key;SCI=0;SCT=0}
if(C.n!==SCN){SCN=C.n;if(C.cmd=='next')SCI++;else if(C.cmd=='prev')SCI--;SCT=0}
let L;try{L=scSlides(C)}catch(e){L=['<div class=sc-empty>ข้อมูลยังไม่พร้อม</div>']}
SCI=((SCI%L.length)+L.length)%L.length;
$('#app').innerHTML=`<div class=sc-root>${L[SCI]}<div class=sc-f><span>${esc(cvo().n)} ครั้งที่ ${esc(cvo().no)} · ${C.pause?'⏸ หยุดชั่วคราว':'ดับเบิลคลิกเพื่อเต็มจอ'}</span><div class=sc-dots>${L.length>1?L.map((_,i)=>`<i class="${i==SCI?'on':''}"></i>`).join(''):''}</div></div></div>`;document.title=cvo().n+' · จอโปรเจคเตอร์'}
if(SCR){setInterval(()=>{const C=scC();if(C.pause)return;if(++SCT>=C.sec){SCT=0;SCI++;scrDraw()}},1000);
addEventListener('storage',e=>{if(e.key=='cl54'){try{S=JSON.parse(e.newValue);mig()}catch(x){return}scrDraw()}else if(e.key=='cl54i'||e.key=='cl54d'){try{IM=JSON.parse(localStorage.cl54i)||{}}catch(x){}scrDraw()}else if(e.key=='cl54scr')scrDraw()});
document.addEventListener('dblclick',()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{})});
document.addEventListener('keydown',e=>{if(e.key=='f'||e.key=='F'){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{})}else if(e.key=='ArrowRight'||e.key==' '){SCI++;SCT=0;scrDraw()}else if(e.key=='ArrowLeft'){SCI--;SCT=0;scrDraw()}})}
function vScr(){const C=scC(),days=[...new Set(S.m.filter(m=>m.n&&m.d).map(m=>m.d))].sort(),M=[['auto','🔄 หมุนอัตโนมัติ'],['cover','หน้าปก'],['groups','ตารางแบ่งสาย'],['results','ผลการแข่งขัน'],['next','โปรแกรมคู่ถัดไป'],['spon','ผู้สนับสนุน']];
return`<section><h3>📽 จอโปรเจคเตอร์ (แยกหน้าจอ)</h3><p class=hint>กด “เปิดหน้าจอโปรเจคเตอร์” จะเปิดหน้าต่างใหม่ → ลากไปไว้จอโปรเจคเตอร์ แล้วดับเบิลคลิก (หรือกดปุ่ม F) เพื่อเต็มจอ · หน้านี้ใช้ควบคุมว่าจะฉายอะไร หน้าจอฉายอัปเดตตามข้อมูลทันที (ต้องเปิดในเบราว์เซอร์เครื่องเดียวกัน)</p>
<div class=chips><button data-act=scopen class=on>📽 เปิดหน้าจอโปรเจคเตอร์</button><button data-act=scprev>◀ ก่อนหน้า</button><button data-act=scnext>ถัดไป ▶</button><button data-act=scpause class="${C.pause?'on':''}">${C.pause?'▶ หมุนต่อ':'⏸ หยุดหมุน'}</button></div>
<div class=chips>${M.map(([k,l])=>`<button data-act=scmode data-v="${k}" class="${C.mode==k?'on':''}">${l}</button>`).join('')}</div>
<div class=chips><label>ถ้วย <select data-sc=cup>${['all',...CUPS].map(c=>`<option value="${c}"${C.cup==c?' selected':''}>${c=='all'?'ทุกประเภท':NAME[c]}</option>`).join('')}</select></label><label>วันที่ (ผลแข่ง) <select data-sc=day><option value="">อัตโนมัติ (วันนี้/วันล่าสุดที่มีผล)</option>${days.map(d=>`<option value="${d}"${C.day==d?' selected':''}>${fd(d)}</option>`).join('')}</select></label><label>เปลี่ยนหน้าทุก <select data-sc=sec>${[5,8,10,12,15,20,30].map(n=>`<option${C.sec==n?' selected':''}>${n}</option>`).join('')}</select> วินาที</label></div></section>
<section><h3>ตัวอย่าง</h3><div class=sc-pv><iframe src="${esc(location.href.split('#')[0])}#screen"></iframe></div><p class=hint>โหมดหมุนอัตโนมัติ: หน้าปก → ตารางแบ่งสาย → ผลการแข่งขัน → โปรแกรมคู่ถัดไป → ผู้สนับสนุน (ข้ามหน้าที่ยังไม่มีข้อมูล) · ใช้ปุ่มลูกศรซ้าย/ขวาบนหน้าจอฉายเพื่อเลื่อนหน้าได้</p></section>`}
document.addEventListener('change',e=>{const k=e.target.dataset&&e.target.dataset.sc;if(!k||SCR)return;const v=e.target.value;scSet({[k]:k=='sec'?+v:v})});
