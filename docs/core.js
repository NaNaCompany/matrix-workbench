const abs=x=>x<0n?-x:x;
function gcd(a,b){a=abs(a);b=abs(b);while(b){[a,b]=[b,a%b];}return a||1n;}
export function q(n,d=1n){if(d===0n)throw Error('zeroDenominator');if(d<0n){n=-n;d=-d;}const g=gcd(n,d);n/=g;d/=g;if(abs(n).toString().length>1000||d.toString().length>1000)throw Error('complexity');return {n,d};}
const zero=()=>q(0n),one=()=>q(1n);
export const add=(a,b)=>q(a.n*b.d+b.n*a.d,a.d*b.d);
export const neg=a=>q(-a.n,a.d);
export const mul=(a,b)=>q(a.n*b.n,a.d*b.d);
export const div=(a,b)=>q(a.n*b.d,a.d*b.n);
export function parseNumber(value){
 if(typeof value!=='string'||value.length>40)throw Error('badNumber');
 const s=value.trim();let v;
 if(/^[+-]?\d+\/[+-]?\d+$/.test(s)){const [n,d]=s.split('/').map(BigInt);if(abs(d)>1000000n)throw Error('range');v=q(n,d);}
 else if(/^[+-]?(?:\d+(?:\.\d{0,6})?|\.\d{1,6})$/.test(s)){const sign=s.startsWith('-')?-1n:1n;const clean=s.replace(/^[+-]/,'');const [whole,fraction='']=clean.split('.');v=q(sign*BigInt((whole||'0')+fraction),10n**BigInt(fraction.length));}
 else throw Error('badNumber');
 if(abs(v.n)>1000000n*v.d)throw Error('range');return v;
}
export function parseMatrix(text){
 if(typeof text!=='string'||text.length>5000||!text.trim())throw Error('empty');
 const lines=text.trim().split(/\r?\n/);if(lines.length<2||lines.length>6)throw Error('shape');
 const a=lines.map(line=>{if(/^[\s]*[,;]|[,;][\s]*$|[,;][\s]*[,;]/.test(line))throw Error('badNumber');return line.trim().split(/[\t ,;]+/).map(parseNumber);});
 if(a.some(row=>row.length!==lines.length))throw Error('shape');return a;
}
export function parseVector(text,n){if(!text.trim())return null;if(text.length>2000||/^[\s]*[,;]|[,;][\s]*$|[,;][\s]*[,;]/.test(text))throw Error('badVector');const parts=text.trim().split(/[\s,;]+/);if(parts.length!==n)throw Error('badVector');return parts.map(parseNumber);}
export function fraction(v){return v.d===1n?String(v.n):`${v.n}/${v.d}`;}
export function decimal(v){const value=Number(v.n)/Number(v.d);if(!Number.isFinite(value))return fraction(v);return Number(value.toPrecision(10)).toString();}
export function solve(a,b=null){
 const n=a.length;if(n<2||n>6||a.some(row=>row.length!==n)||(b&&b.length!==n))throw Error('shape');
 const matrix=a.map((row,i)=>[...row,...Array.from({length:n},(_,j)=>q(i===j?1n:0n)),...(b?[b[i]]:[])]);
 const steps=[{type:'initial',matrix:matrix.map(row=>row.slice())}],pivots=[];let r=0,det=one();
 const snapshot=operation=>{steps.push({...operation,matrix:matrix.map(row=>row.slice())});};
 for(let c=0;c<n&&r<n;c++){
   let p=r;for(let i=r+1;i<n;i++)if(abs(matrix[i][c].n)*matrix[p][c].d>abs(matrix[p][c].n)*matrix[i][c].d)p=i;
   if(matrix[p][c].n===0n)continue;
   if(p!==r){[matrix[p],matrix[r]]=[matrix[r],matrix[p]];det=neg(det);snapshot({type:'swap',a:r,b:p});}
   const pivot=matrix[r][c];det=mul(det,pivot);
   if(pivot.n!==pivot.d){const factor=div(one(),pivot);matrix[r]=matrix[r].map(v=>mul(v,factor));snapshot({type:'scale',row:r,factor});}
   for(let i=0;i<n;i++){if(i===r||matrix[i][c].n===0n)continue;const factor=neg(matrix[i][c]);matrix[i]=matrix[i].map((v,j)=>add(v,mul(factor,matrix[r][j])));snapshot({type:'add',target:i,source:r,factor});}
   pivots.push(c);r++;
 }
 if(r<n)det=zero();
 const free=Array.from({length:n},(_,i)=>i).filter(i=>!pivots.includes(i));
 const kernel=free.map(f=>{const vector=Array.from({length:n},zero);vector[f]=one();pivots.forEach((c,i)=>vector[c]=neg(matrix[i][f]));return vector;});
 let solution=null;if(b){const inconsistent=matrix.some(row=>row.slice(0,n).every(v=>v.n===0n)&&row[2*n].n!==0n);if(inconsistent)solution={kind:'none'};else{const particular=Array.from({length:n},zero);pivots.forEach((c,i)=>particular[c]=matrix[i][2*n]);solution={kind:r===n?'unique':'infinite',particular};}}
 return {n,rank:r,nullity:n-r,det,rref:matrix.map(row=>row.slice(0,n)),inverse:r===n?matrix.map(row=>row.slice(n,2*n)):null,kernel,solution,steps};
}
