const CUPS=['ก','ข','ย'],NAME={ก:'ประเภท ก',ข:'ประเภท ข',ย:'เยาวชนอายุไม่เกิน 17 ปี'},G=['A','B','C','D'];
const $=s=>document.querySelector(s),esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const SCR=location.hash=='#screen';let S,tab='menu',cup='all',api=localStorage.api||((window.APP_CONFIG||{}).API_URL||''),dirty=0,busy=0,T;
let typing=0;
try{S=JSON.parse(localStorage.cl54)}catch(e){}
if(!S||!S.m)S=JSON.parse(JSON.stringify(SEED));
const stash=()=>{localStorage.cl54=JSON.stringify(S)},gi=g=>G.indexOf(g);
function save(){S.ts=Date.now();stash();dirty=1;typing=0;st();scheduleSync()}
function st(){if(typeof updateStatus=='function')updateStatus()}
function ref(r){const[c,g,n]=r;if(n>S.sizes[c][gi(g)])return null;const j=S.draw[c][g][n-1];return j===''?'':S.teams[c][j]}
function side(m,k,i){const r=m[k];if(Array.isArray(r)){const t=ref(r);return t===null?{x:1,h:`<i class=off>ไม่มีทีมที่ ${r[2]}</i>`}:{h:t?esc(t):`<i class=ph>สาย ${r[1]} ลำดับ ${r[2]}</i>`}}return{h:`<input data-k="m|${i}|${k}" list="L${m.c}" value="${esc(r)}">`}}
function rows(){const nm=(m,k)=>{const r=m[k];if(!Array.isArray(r))return r;const t=ref(r);return t===null?'(ไม่มีทีม)':t};
return{extra:xs(),teams:[...Array(14)].map((_,i)=>[i+1,...CUPS.map(c=>S.teams[c][i]||'')]),
draw:CUPS.flatMap(c=>G.flatMap((g,k)=>[...Array(S.sizes[c][k])].map((_,i)=>{const j=S.draw[c][g][i];return[c,g,i+1,j===''?'':S.teams[c][j]]}))),
prog:S.m.map(m=>m.note!=null?['',m.d||'','','','','',m.note,m.det||'','','','']:[m.n,m.d,m.t,m.c,m.r,m.g,nm(m,'a'),nm(m,'b'),m.v,m.sa,m.sb])}}
