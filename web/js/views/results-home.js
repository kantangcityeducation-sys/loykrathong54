let hday='',hedit=0;
function mres(m,RA){const w=x=>String(x==null?'':x).trim().toLowerCase(),rp=S.docs.rep.find(r=>r.n==m.n&&(!r.d||!m.d||r.d===m.d))||S.docs.rep.find(r=>r.n==m.n)||{};
const pr=x=>{const t=String(x||'').match(/(\d+)\s*[-–—:]\s*(\d+)/);return t?[t[1],t[2]]:['','']},f=pr(rp.f),p=pr(rp.p),sv=v=>v!==''&&v!=null,g=(v,a)=>sv(v)?String(v):a;
const cd=(tm,k)=>{const t=w(tm);if(!t)return'';let a=0,h=0;S.docs.cau.forEach(c=>{if(w(c.tm)===t&&c.d===m.d&&(!c.c||c.c===m.c)){a+=+c[k]||0;h=1}});RA.forEach(o=>{if(o.d===m.d&&w(o.tm)===t){if(o[k]>a)a=o[k];h=1}});return h?a:''};
const tA=txt(m,'a'),tB=txt(m,'b'),o={sa:g(m.sa,f[0]),sb:g(m.sb,f[1]),pa:g(m.pa,p[0]),pb:g(m.pb,p[1])};
['ya','ra','yb','rb'].forEach(k=>{o[k]=g(m[k],cd(k[1]=='a'?tA:tB,k[0]=='y'?'y':'rd'))});o.done=o.sa!==''&&o.sb!=='';return o}
function hctx(){const RA=repAll(),pts=S.m.map((m,i)=>[m,i]).filter(([m])=>m.n&&m.d&&(cup=='all'||m.c==cup)),days=[...new Set(pts.map(([m])=>m.d))].sort(),today=new Date().toLocaleDateString('en-CA');
const auto=days.includes(today)?today:[...days].reverse().find(d=>pts.some(([m])=>m.d===d&&mres(m,RA).done))||days[0];
const sel=hday=='all'?days:days.length?[days.includes(hday)?hday:auto]:[];return{RA,pts,days,sel,today}}
function posterH(dy,pts,RA,pr){const C=cvo(),dm=pts.filter(([m])=>m.d===dy),grp={x:[],ย:[],ข:[],ก:[]};dm.forEach(q=>(q[0].c&&grp[q[0].c]?grp[q[0].c]:grp.x).push(q));
const vn=[...new Set(dm.map(([m])=>String(m.v||'').trim()).filter(Boolean))].join(' / '),dt=new Date(dy).toLocaleDateString('th-TH',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}),
img=k=>IM[k]?`<img class=ps-lg src="${IM[k]}">`:'<span class="ps-lg e"></span>';
const tn=(m,k)=>{const r=m[k];if(!Array.isArray(r))return esc(r);const t=ref(r);return t===null?'<i>(ไม่มีทีม)</i>':t?esc(t):`<i>สาย ${esc(r[1])} ลำดับ ${esc(r[2])}</i>`};
const tl=(m,k)=>{const t=txt(m,k),cs=m.c?[m.c]:CUPS;let im='';if(t)for(const c of cs){const j=(S.teams[c]||[]).indexOf(t);if(j>=0&&IM['lg_'+c+'_'+j+'_0']){im=IM['lg_'+c+'_'+j+'_0'];break}}return im?`<div class=ps-tl><img src="${im}"></div>`:'<div class="ps-tl e">⚽</div>'};
const sq=(cl,v,m,f)=>{const sh=v!==''&&(+v>0||(m[f]!==''&&m[f]!=null));return sh?`<div class=ps-cb><div class="ps-sq ${cl}"></div><b class=ps-cn>${esc(v)}</b></div>`:''};
const FL=[['sa','ประตู A'],['sb','ประตู B'],['pa','จุดโทษ A'],['pb','จุดโทษ B'],['ya','เหลือง A'],['yb','เหลือง B'],['ra','แดง A'],['rb','แดง B']];
const mh=([m,i])=>{const o=mres(m,RA);let ed='';if(hedit&&!pr){const au=mres(Object.assign({},m,{sa:'',sb:'',pa:'',pb:'',ya:'',ra:'',yb:'',rb:''}),RA);ed=`<div class=ps-e>${FL.map(([f,l])=>`<label>${l}<input type=number min=0 data-k="m|${i}|${f}" value="${esc(m[f]==null?'':m[f])}" placeholder="${esc(au[f])}"></label>`).join('')}</div>`}
return`<div class=ps-m><div class=ps-cap>${[m.t,m.g?'สาย '+m.g:'',m.r,'คู่ที่ '+m.n].filter(Boolean).map(esc).join(' · ')}</div><div class=ps-b><div class=ps-tm>${tl(m,'a')}<div class=ps-n>${tn(m,'a')}</div></div><div class=ps-vs>VS</div><div class=ps-tm>${tl(m,'b')}<div class=ps-n>${tn(m,'b')}</div></div></div><div class=ps-s><div class="ps-cd l">${sq('r',o.ra,m,'ra')}${sq('y',o.ya,m,'ya')}</div><div>${o.done?`<div class=ps-sc>${esc(o.sa)} - ${esc(o.sb)}</div>${o.pa!==''&&o.pb!==''?`<div class=ps-pn>(${esc(o.pa)}-${esc(o.pb)})</div>`:''}`:`<div class="ps-sc nr">${esc(m.t)||'รอผล'}</div>`}</div><div class="ps-cd r">${sq('y',o.yb,m,'yb')}${sq('r',o.rb,m,'rb')}</div></div>${ed}</div>`};
const pn=['x','ย','ข','ก'].filter(k=>grp[k].length).map(k=>`<div class="ps-c k-${k}"><div class=ps-ct>${k=='x'?esc(grp.x[0][0].r||'คู่พิเศษ'):'ถ้วย '+(k=='ย'?'เยาวชนอายุไม่เกิน 17 ปี':k)}</div>${grp[k].map(mh).join('')}</div>`).join('');
return`<div class="ps${pr?' pp':''}"><div class=ps-h><div><div class=ps-org>${esc(C.org)}</div>${img('lg_cover2')}</div><div><div class=ps-t>${esc(C.pt)}</div><div class=ps-v>${vn?'ณ '+esc(vn):''}</div><div class=ps-d>ประจำวันที่ ${dt}</div></div><div>${img('lg_cover')}</div></div>${pn}</div>`}
function vHome(){const{RA,pts,days,sel,today}=hctx(),pl=pts.filter(([m])=>mres(m,RA).done),goals=pl.reduce((a,[m])=>{const o=mres(m,RA);return a+(+o.sa||0)+(+o.sb||0)},0);
return`<div class=stt><div><b>${pl.length} / ${pts.length}</b>คู่ที่แข่งแล้ว</div><div><b>${goals}</b>ประตูรวม</div><div><b>${pts.length-pl.length}</b>คู่ที่เหลือ</div><div><b>${days.length}</b>วันแข่งขัน</div></div>
<div class=chips>${['all',...CUPS].map(c=>`<button data-cup="${c}" class="${cup==c?'on':''}">${c=='all'?'ทุกประเภท':NAME[c]}</button>`).join('')}</div>
<div class=chips><button data-act=hday data-d="all" class="${hday=='all'?'on':''}">ทุกวัน</button>${days.map(x=>`<button data-act=hday data-d="${x}" class="${sel.length==1&&hday!='all'&&sel[0]==x?'on':''}">${x==today?'วันนี้ · ':''}${fd(x)}</button>`).join('')}</div>
<div class=chips><button data-act=hedit class="${hedit?'on':''}">✏️ ${hedit?'ปิดโหมดแก้ไขผล':'แก้ไขผล / ใบเหลือง-แดง'}</button><button data-act=hprn>🖨 พิมพ์ / PDF (A4 แนวตั้ง)</button><small>ช่องที่เว้นว่าง = ดึงอัตโนมัติจากหน้า “ผลตัดสิน” และ “ใบคาดโทษ” (ตัวเลขจางในช่องคือค่าอัตโนมัติ)</small></div>${sel.map(d=>posterH(d,pts,RA,0)).join('')||'<p class=hint>ยังไม่มีโปรแกรมการแข่งขัน</p>'}`}
function prnHome(){const{RA,pts,sel}=hctx();if(!sel.length)return;const el=$('#pr');el.style.cssText='width:194mm';
el.innerHTML=sel.map(d=>`<div class=pg>${posterH(d,pts,RA,1)}</div>`).join('');
let g=$('#pg');if(!g){g=document.createElement('style');g.id='pg';document.head.appendChild(g)}g.textContent='@page{size:A4 portrait;margin:8mm}';
document.body.classList.add('printing');
setTimeout(()=>{el.querySelectorAll('.pg').forEach(pg=>{const ps=pg.firstChild;ps.style.zoom=1;const h=ps.offsetHeight;if(h>pg.clientHeight)ps.style.zoom=pg.clientHeight/h});window.print()},150)}
