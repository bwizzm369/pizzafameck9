# Vapi Busy Lines Assistant - Pizza Club Fameck

## Overview

This integration adds a Vapi voice assistant that handles incoming calls when phone lines are busy. The assistant informs callers that lines are occupied and offers two options:
1. Send an SMS with a quick order link
2. Wait to speak with someone when the line becomes available

The assistant does **not** take orders via phone — it only redirects to the online ordering platform.

## Environment Variables

Add these to `.env.local`:

```bash
# Vapi webhook authentication
VAPI_WEBHOOK_SECRET=your-secret-key-here

# Public app URL (used in order links sent via SMS)
NEXT_PUBLIC_APP_URL=https://pizzaclub-fameck.fr
# or for local development:
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Webhook Endpoint

**URL:** `POST /api/vapi/webhook`

**Authentication:** Bearer token in `Authorization` header  
```
Authorization: Bearer {VAPI_WEBHOOK_SECRET}
```

## Payload Format

### Request

```json
{
  "action": "send_order_link",
  "phone": "0759235658"
}
```

**Fields:**
- `action` (string, required): Currently only `"send_order_link"` is supported
- `phone` (string, optional): Customer phone number (for SMS routing)

### Response

```json
{
  "success": true,
  "order_url": "https://pizzaclub-fameck.fr",
  "sms_message": "Bonjour, voici le lien pour commander rapidement chez Pizza Club Fameck : https://pizzaclub-fameck.fr"
}
```

**Fields:**
- `success` (boolean): Whether the request was processed successfully
- `order_url` (string): Direct link to the ordering platform
- `sms_message` (string): Message text ready to send via SMS (if SMS provider is integrated)
- `error` (string, optional): Error message if `success` is false

## Test with cURL

```bash
curl -X POST http://localhost:3000/api/vapi/webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-key-here" \
  -d '{
    "action": "send_order_link",
    "phone": "0759235658"
  }'
```

Expected response:
```json
{
  "success": true,
  "order_url": "http://localhost:3000",
  "sms_message": "Bonjour, voici le lien pour commander rapidement chez Pizza Club Fameck : http://localhost:3000"
}
```

## Vapi Configuration

### In Vapi Dashboard

1. **Create a new assistant** (or edit existing)
2. **Voice Settings:**
   - Language: French
   - Voice: Choose a natural-sounding French voice
3. **Initial Message (Assistant Greeting):**
   ```
   Bonjour, vous avez appelé Pizza Club Fameck. 
   Malheureusement, nos lignes sont actuellement occupées. 
   Je peux vous envoyer par SMS un lien pour commander rapidement en ligne, 
   ou vous pouvez rester en ligne pour parler à quelqu'un. 
   Que souhaitez-vous faire ?
   ```
4. **Tools/Actions:**
   - Create a custom tool/action named `send_order_link`
   - This triggers the webhook endpoint
5. **Webhook Configuration:**
   - URL: `https://pizzaclub-fameck.fr/api/vapi/webhook` (or your production URL)
   - Authentication: Bearer token (use `VAPI_WEBHOOK_SECRET`)
   - Method: POST
6. **Callback Handling:**
   - After webhook response, respond to caller:
     ```
     Parfait ! Vous allez recevoir un SMS avec le lien pour commander. 
     Merci d'avoir appelé Pizza Club Fameck !
     ```

### Alternative Voice Script (Simplified)

```
Bonjour Pizza Club Fameck. Nos équipes sont occupées. 
Je vais vous envoyer notre lien de commande par SMS. 
À bientôt !
```

## Implementation Notes

- **No Order Taking:** The system only redirects to online ordering; it does not capture menu preferences or payment over the phone.
- **SMS Not Integrated:** Currently, the webhook returns the SMS message text but does not send it. To fully implement SMS:
  - Add Twilio or AWS SNS integration in the webhook
  - Parse the `phone` field and send using your SMS provider
- **URL Construction:** The `order_url` is built from `NEXT_PUBLIC_APP_URL` and points to the home page (`/`), which includes the full menu and checkout flow
- **No Cart Pre-population:** The SMS link is a clean URL with no pre-filled data
- **Future Enhancements:**
  - Add SMS provider integration (Twilio, AWS SNS, etc.)
  - Track which calls received the SMS link
  - A/B test different greeting scripts
  - Queue callbacks for peak times

## Deployment Checklist

- [ ] Set `VAPI_WEBHOOK_SECRET` in production `.env.local` (or via your hosting platform's env config)
- [ ] Set `NEXT_PUBLIC_APP_URL` to your production domain
- [ ] Update Vapi dashboard webhook URL to production endpoint
- [ ] Test webhook with cURL or Vapi's test tool
- [ ] Verify SMS message quality (if SMS provider added)
- [ ] Configure call recording/logging in Vapi dashboard if needed
- [ ] Monitor webhook logs for errors

## Troubleshooting

**401 Unauthorized**
- Check that `Authorization` header is correctly formatted: `Bearer {VAPI_WEBHOOK_SECRET}`
- Verify `VAPI_WEBHOOK_SECRET` environment variable is set on the server

**500 Internal Server Error**
- Check Next.js application logs
- Verify `NEXT_PUBLIC_APP_URL` is set
- Ensure webhook is deployed and reachable

**SMS Not Sent**
- SMS sending is not yet implemented; only the message template is returned
- To enable actual SMS, integrate Twilio or similar in the webhook

## Related Files

- Route handler: [`app/api/vapi/webhook/route.ts`](../app/api/vapi/webhook/route.ts)
- Main ordering page: [`app/page.tsx`](../app/page.tsx)
- Menu component: [`components/MenuPage.tsx`](../components/MenuPage.tsx)
