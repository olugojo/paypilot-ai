import {explainInvoices} from "@/lib/gemini";
import {checks} from "@/lib/paypilot";
import {config,sign,guard} from "@/lib/server";
import {owner,readInvoices,saveReview,queue} from "@/lib/storage";
export async function POST(req:Request){try{guard(req);const user=await owner();const invoices=await readInvoices(user);if(!invoices.length)throw Error("No invoices to review.");const e=config();let ai=false;let explanations:Record<string,string>={};
if(e.GEMINI_API_KEY){explanations=await explainInvoices(invoices,e);ai=true;}
const reviews=await Promise.all(invoices.map(async i=>{const issues=checks(i,invoices);const payload=JSON.stringify({owner:user,invoice:i,clear:issues.length===0,expires:Date.now()+900000});const token=e.APP_SIGNING_SECRET?btoa(unescape(encodeURIComponent(payload)))+"."+await sign(payload,e.APP_SIGNING_SECRET):"demo";return {id:i.id,issues,token,explanation:typeof explanations[i.id]==="string"?explanations[i.id].slice(0,1000):issues.length?"Correct the flagged details and review this invoice again before preparing a payout.":"Payment details are present and the invoice number is unique in this queue. Confirm the work was delivered before approving."};}));await saveReview(user,reviews);return Response.json({reviews,ai,invoices:await queue(user)});}catch(e){return Response.json({error:e instanceof Error?e.message:"Review failed"},{status:400});}}


