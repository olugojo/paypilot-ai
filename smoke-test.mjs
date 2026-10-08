import assert from 'node:assert/strict';
import {samples,checks,validateInvoices} from './lib/paypilot.ts';
assert.equal(checks(samples[1],samples).length,0);
assert.ok(checks(samples[0],samples).some(x=>x.includes('Duplicate')));
assert.ok(checks(samples[3],samples).some(x=>x.includes('recipient')));
assert.throws(()=>validateInvoices([{...samples[1],cents:1.5}]));
assert.throws(()=>validateInvoices([{...samples[1],currency:'EUR'}]));
const base='http://127.0.0.1:5173';
const post=(path,body)=>fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
const r=await post('/api/review',{invoices:samples});assert.equal(r.status,200);const d=await r.json();assert.equal(d.reviews.filter(x=>!x.issues.length).length,1);
assert.equal((await post('/api/payout',{invoice:samples[1],approved:false})).status,400);
assert.equal((await post('/api/payout',{invoice:samples[3],approved:true})).status,400);
const p=await post('/api/payout',{invoice:samples[1],approved:true,token:d.reviews[1].token});assert.equal(p.status,200);assert.equal((await p.json()).simulated,true);
const forged=await fetch(base+'/api/review',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://other.example'},body:JSON.stringify({invoices:samples})});assert.ok([400,403].includes(forged.status));
console.log('Passed: duplicates, missing recipient, currency/amount validation, review API, approval gate, simulation, origin guard.');

