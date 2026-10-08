import { env } from "cloudflare:workers";
export function config(){return env as unknown as Record<string,string|undefined>;}
export async function sign(text:string,secret:string){const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);const b=await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(text));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("");}
export function guard(request:Request){const origin=request.headers.get("Origin");if(origin&&origin!==new URL(request.url).origin)throw Error("Cross-origin requests are not allowed.");}
