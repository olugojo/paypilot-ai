import {config} from "@/lib/server";
export function GET(){const e=config();return Response.json({paypal:!!(e.PAYPAL_CLIENT_ID&&e.PAYPAL_CLIENT_SECRET&&e.APP_SIGNING_SECRET),ai:!!e.OPENAI_API_KEY});}
