import {config} from "@/lib/server";
export function GET(){const e=config();return Response.json({paypal:!!(e.PAYPAL_CLIENT_ID&&e.PAYPAL_CLIENT_SECRET&&e.APP_SIGNING_SECRET),ai:!!e.GEMINI_API_KEY,aiProvider:e.GEMINI_API_KEY?"Gemini":null});}
