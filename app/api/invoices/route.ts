import {owner,seed,queue,addInvoice} from "@/lib/storage";
import {guard} from "@/lib/server";
export async function GET(){try{const user=await owner();await seed(user);return Response.json({invoices:await queue(user)});}catch(e){return Response.json({error:e instanceof Error?e.message:"Storage unavailable"},{status:503});}}
export async function POST(req:Request){try{guard(req);const user=await owner();const text=await req.text();if(text.length>10000)throw Error("Invoice too large.");await addInvoice(user,JSON.parse(text));return Response.json({invoices:await queue(user)});}catch(e){return Response.json({error:e instanceof Error?e.message:"Invoice could not be saved"},{status:400});}}
