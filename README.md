# PayPilot AI

Contractor invoice review and human-approved PayPal sandbox payouts. The local end-to-end flow has been verified with Google Gemini and PayPal sandbox. Without configured credentials the application uses rule-based checks and simulated payouts. The older hosted demo has not been updated with the latest integration. No live-payment endpoint exists.

## Try the demo

Click **Review invoices**. Alex's repeated invoice is flagged on both rows, Sam's missing recipient is blocked, and Jamie's invoice is ready. Select Jamie, review the payout, and approve the simulation. Add an invoice to try different values. Invoices, reviews, and payout records are saved in D1, scoped to the signed-in user. Reloading restores them. Demo payouts remain simulations.

## Run locally

Use Node 22.13 or later. Run `npm run install:ci`, then `npm run dev`. Open the Local URL printed by the server. `node smoke-test.mjs` runs the invoice and API checks against the default local URL. `npx tsc --noEmit` checks types, and `npm run build` creates the Cloudflare Worker output.

## Connect PayPal sandbox

Create a REST app in the PayPal Developer Dashboard using **Sandbox** credentials. Configure server-side secrets `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, and a randomly generated `APP_SIGNING_SECRET` (at least 32 random bytes). Never place keys in browser code or a Git repository. Use a sandbox personal account email as the recipient. Sample example.com emails are deliberately blocked when connected.

The server obtains an OAuth token and submits `POST https://api-m.sandbox.paypal.com/v1/payments/payouts`. Review creates a signed, 15-minute receipt bound to invoice details. The payout route checks the receipt and explicit approval. Stable sender batch IDs protect retries of the same invoice; PayPal batch acceptance is not a final payout success. Check final status in the sandbox dashboard. Do not change invoice IDs to retry an uncertain payout. D1 records each payout attempt before the PayPal request. A unique contractor-name/invoice-number key prevents another payout for the same saved invoice across sessions. Uncertain outcomes are marked RECONCILE and remain blocked until manually reconciled. The status endpoint refreshes known batch statuses from PayPal. Batch status does not prove every item succeeded. This remains a hackathon prototype rather than production payroll software.

## Optional AI explanations

Configure `GEMINI_API_KEY` as a server-side secret and optionally `GEMINI_MODEL` (default `gemini-3.1-flash-lite`). The adapter sends invoice descriptions, amounts, IDs, and validation issues to Google Gemini; recipient emails and contractor names are omitted. The model explains findings and cannot override payment validation. Until a key is configured, the UI explicitly labels rule-based checks. On October 28, 2026, Gemini reviewed sample invoices and the app completed a $1.00 USD sandbox payout. Batch CPRFQ9GN38AP2 and its individual payout both returned SUCCESS; the PayPal sandbox dashboard showed the payment claimed. This is test money.

## Deployment

This project uses Sites and starts owner-private. Configure hosted secrets using Sites environment-variable settings. The workspace requires ChatGPT sign-in and all invoice/payout routes scope database queries by authenticated user. Preserve private access. Payout records provide a durable operational history; a full immutable audit-event log is future work. Browser WebMCP tools read/review the queue; they never send payouts. WebMCP read/review tools were validated in the local browser; they do not send payouts.

## Official references

- [PayPal payout request and duplicate behavior](https://developer.paypal.com/api/payments.payouts-batch/v1/definitions/create_payout_request/)
- [PayPal REST API setup](https://developer.paypal.com/api/get-started/)
- [Gemini structured outputs](https://ai.google.dev/gemini-api/docs/structured-output)


## Persistent backend development

`db/schema.ts` defines invoices and payout records. `drizzle/0000_equal_katie_power.sql` is the initial schema migration. After building, apply it once to the local D1 database:

```sh
node --import ./scripts/sites-env.mjs node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_equal_katie_power.sql
```

The local preview simulates sign-in through `/signin-with-chatgpt?return_to=/`. The smoke test uses that local sign-in flow, writes synthetic records, and verifies invoice persistence and repeat-payout protection. Run it against a local database with no external API credentials. Production migrations are handled by Sites publishing.

API routes: `GET/POST /api/invoices`, `POST /api/review`, `POST /api/payout`, and `POST /api/payout/status`. The payout request accepts only an invoice ID and explicit approval; payment details come from the saved record. Review receipts are stored server-side. Adding invoices invalidates previous reviews so duplicate checks run again.



## Judge setup from a fresh clone

1. Install Node.js 22.13 or later and clone this public repository.
2. In the repository folder, run `npm run install:ci`.
3. Copy `.env.example` to `.env`. For AI review, supply your own `GEMINI_API_KEY`. The tested model is `gemini-3.1-flash-lite`.
4. For connected payouts, create a PayPal sandbox REST app associated with a US Business sandbox test account, enable Payouts, and set `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`. Use a fictional US Personal sandbox account as recipient. Country settings here describe test accounts, not the developer's real identity or location.
5. Generate a signing secret with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` and set `APP_SIGNING_SECRET` in `.env`.
6. Run `npm run build`, then apply the initial local migration once using the command in Persistent backend development above.
7. Run `npm run dev`, open the printed local URL, and use the simulated local sign-in if redirected. The local sign-in is for development only; production requires the hosting platform's identity checks.
8. Click Review invoices. For a real sandbox test, add a new invoice for your sandbox recipient with a unique invoice number and $1.00 USD, review it, and approve only after verifying its details. Check saved payout status and confirm individual payment success in PayPal.

If credentials are omitted, rule-based review and simulated payouts are available, but this mode does not demonstrate live Gemini or PayPal API integration. No real funds are used by the app. Never publish API keys, sandbox passwords, or .env files. Existing historical test batch IDs cannot be queried with a different sandbox merchant's credentials.

## License and assistance

Project-authored code is MIT licensed; see LICENSE. Bundled dependencies and vendored files retain their respective license notices. OpenAI Codex assisted implementation and testing. The prototype's AI role is invoice explanation, not independent fraud determination or autonomous payment approval.
