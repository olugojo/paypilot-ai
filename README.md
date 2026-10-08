# PayPilot AI

Contractor invoice review and human-approved PayPal sandbox payouts. The initial deployment runs in demonstration mode: invoice rules are real, AI explanations and PayPal calls require configuration. No live-payment endpoint exists.

## Try the demo

Click **Review invoices**. Alex's repeated invoice is flagged on both rows, Sam's missing recipient is blocked, and Jamie's invoice is ready. Select Jamie, review the payout, and approve the simulation. Add an invoice to try different values. Invoices are held in memory for this browser session; refresh resets them.

## Run locally

Use Node 22.13 or later. Run `npm run install:ci`, then `npm run dev`. Open the Local URL printed by the server. `node smoke-test.mjs` runs the invoice and API checks against the default local URL. `npx tsc --noEmit` checks types, and `npm run build` creates the Cloudflare Worker output.

## Connect PayPal sandbox

Create a REST app in the PayPal Developer Dashboard using **Sandbox** credentials. Configure server-side secrets `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, and a randomly generated `APP_SIGNING_SECRET` (at least 32 random bytes). Never place keys in browser code or a Git repository. Use a sandbox personal account email as the recipient. Sample example.com emails are deliberately blocked when connected.

The server obtains an OAuth token and submits `POST https://api-m.sandbox.paypal.com/v1/payments/payouts`. Review creates a signed, 15-minute receipt bound to invoice details. The payout route checks the receipt and explicit approval. Stable sender batch IDs protect retries of the same invoice; PayPal batch acceptance is not a final payout success. Check final status in the sandbox dashboard. Do not change invoice IDs to retry an uncertain payout. Cross-session duplicate prevention and a durable audit ledger are future work, so this is a hackathon prototype rather than production payroll software.

## Optional AI explanations

Configure `OPENAI_API_KEY` as a server-side secret and optionally `OPENAI_MODEL` (default `gpt-4.1-mini`). The adapter sends invoice descriptions, amounts, IDs, and validation issues to OpenAI; recipient emails and contractor names are omitted. The model explains findings and cannot override payment validation. Until a key is configured, the UI explicitly labels rule-based checks. AI and PayPal external calls have not been tested with credentials in this initial build.

## Deployment

This project uses Sites and starts owner-private. Configure hosted secrets using Sites environment-variable settings. Keep it private until authentication, access controls, persistent duplicate prevention, and audit logging are in place. Browser WebMCP tools read/review the queue; they never send payouts. Live WebMCP validation depends on browser support.

## Official references

- [PayPal payout request and duplicate behavior](https://developer.paypal.com/api/payments.payouts-batch/v1/definitions/create_payout_request/)
- [PayPal REST API setup](https://developer.paypal.com/api/get-started/)
- [OpenAI JSON mode](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=chat)
