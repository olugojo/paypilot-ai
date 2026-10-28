import assert from 'node:assert/strict';
import {explainInvoices} from './lib/gemini.ts';
import {samples} from './lib/paypilot.ts';
const invoices=[samples[1]];
const response=(reviews)=>new Response(JSON.stringify({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify({reviews})}]}}]}));
const settings={GEMINI_API_KEY:'test-key'};
let sent;
const valid=await explainInvoices(invoices,settings,async(url,options)=>{sent=JSON.parse(options.body);assert.ok(url.includes('gemini-3.1-flash-lite'));assert.equal(options.headers['x-goog-api-key'],'test-key');return response([{id:invoices[0].id,explanation:'Check delivered work before approving.'}]);});
assert.ok(valid[invoices[0].id]);assert.ok(!JSON.stringify(sent).includes(invoices[0].email));assert.ok(!JSON.stringify(sent).includes(invoices[0].name));
await assert.rejects(()=>explainInvoices(invoices,settings,async()=>response([])),/invalid invoice review/);
await assert.rejects(()=>explainInvoices(invoices,settings,async()=>new Response('{}',{status:429})),/quota or rate limit/);
await assert.rejects(()=>explainInvoices(invoices,settings,async()=>{throw Error('secret-in-error');}),/Cannot connect/);
console.log('Passed: Gemini request, validated structured response, omitted recipient/name, incomplete response rejection, quota handling, sanitized connection error.');

