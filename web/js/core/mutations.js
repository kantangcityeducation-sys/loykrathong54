function tOk(){const[c,i]=te;tv=tv.trim();if(tv)S.teams[c][i]=tv;else if(S.teams[c][i]==='')S.teams[c].splice(i,1);te=null;save();render()}
function tCancel(){const[c,i]=te;if(S.teams[c][i]==='')S.teams[c].splice(i,1);te=null;render()}
function rmTeam(c,i){S.teams[c].splice(i,1);G.forEach(g=>S.draw[c][g]=S.draw[c][g].map(v=>v===i?'':v>i?v-1:v));
const rk=o=>{const n={};for(const k in o){const[cc,j]=k.split('_');if(cc!=c||+j<i)n[k]=o[k];else if(+j>i)n[c+'_'+(j-1)]=o[k]}return n};S.pl=rk(S.pl);S.st=rk(S.st);S.bond.dep=rk(S.bond.dep);rmImg(c,i);te=null;save();render()}
function cf(y,rd){const B=S.bond,r2=B.r2==null||B.r2===''?500:+B.r2;if(y>=2&&rd>=1)return r2+(y-2)*B.ry+(rd-1)*B.rr;return y*B.ry+rd*B.rr}
function dOk(){const k=dd.k;if(k=='cau'){const r=dd.r,B=S.bond;if(r.fine===undefined||r.fine==='')r.fine=cf(+r.y||0,+r.rd||0)}if(dd.i==null)S.docs[k].push(dd.r);else S.docs[k][dd.i]=dd.r;dd=null;save();render()}
function dFill(){const m=S.m.find(x=>x.n==dd.r.n);if(!m)return alert('ไม่พบคู่ที่นี้ในโปรแกรม');Object.assign(dd.r,{d:m.d,t:m.t,v:m.v,c:m.c,ta:txt(m,'a'),tb:txt(m,'b')});render()}
function mig(){let ch=0;S.pl=S.pl||{};S.st=S.st||{};S.lu=S.lu||{};S.bond=S.bond||{ry:0,rr:0,dep:{}};S.cover=S.cover||{n:'ลอยกระทงคัพ',no:'54',yr:'2569'};S.docs=S.docs||{};['ref','rep','cau','sub','spon'].forEach(k=>S.docs[k]=S.docs[k]||[]);
if(!S.v||S.v<2){S.sizes.ย=[4,3,3,3];CUPS.forEach(c=>{const mp={};let k=0;S.teams[c].forEach((n,j)=>{if(n)mp[j]=k++});S.teams[c]=S.teams[c].filter(Boolean);G.forEach(g=>S.draw[c][g]=S.draw[c][g].map(v=>v===''?'':(v in mp?mp[v]:'')))});S.v=2;ch=1}
if(ch){S.ts=Date.now();dirty=1}}
