# M-Pesa STK Push Integration with Node.js

A lightweight Express app for integrating **M-Pesa Lipa Na M-Pesa Online Payment (STK Push)** using the **Safaricom Daraja API**.

This app allows you to trigger an STK push prompt on a customer’s phone and receive payment confirmation via a callback URL.

---

## ✅ Features

- Initiates M-Pesa STK Push payment
- Secure OAuth 2.0 token generation
- Dynamic ngrok tunneling for local development
- Callback endpoint to handle M-Pesa transaction results
- Configurable via `.env`

---

## Prerequisites

Before getting started, ensure you have:

- [Node.js](https://nodejs.org/) (v14 or higher)
- A registered app on the [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
- [ngrok](https://ngrok.com/download) **installed globally** (`npm install -g ngrok`)
- Git (optional)

---

## Installation

### 1. Clone the Repository

```bash
git https://github.com/jalikoa/darajaStkInNode.git
cd darajaStkInNode
```

### 2. Install Dependencies

```bash
npm install
```

---

## Configuration

Create a `.env` file in the root of the project and fill in your credentials from the Safaricom Developer Portal:

```env
CONSUMER_KEY=your_consumer_key
CONSUMER_SECRET=your_consumer_secret
BUSINESS_SHORT_CODE=your_shortcode
LIPA_NA_MPESA_PASSKEY=your_passkey
BASE_URL=https://sandbox.safaricom.co.ke
PORT=3000
CALLBACK_URL=
```

> Never commit this file to version control. Add it to your `.gitignore`.

---

## 🚀 Running the App

Since **ngrok is installed globally**, we'll use a helper script to expose our server and update the callback URL dynamically.

### Step 1: Start ngrok Tunnel Manually

Open a new terminal window and start ngrok:

```bash
ngrok http 3000
```

You’ll see a public URL like:

```
Forwarding                    https://abc123.ngrok.io -> http://localhost:3000
```

### Step 2: Set CALLBACK_URL in `.env`

Update your `.env` file with the ngrok URL:

```env
CALLBACK_URL=https://abc123.ngrok.io/callback
```

### Step 3: Start the Server

Back in your main terminal:

```bash
npm start
```

Or

```bash
node app.js
```

You should see:

```
Server running on port 3000
```

---

## API Endpoints

### 1. Initiate STK Push

**POST** `/stkpush`

#### Request Body

```json
{
  "phone": "254700000001",
  "amount": "1",
  "accountReference": "INV-1234",
  "transactionDesc": "Test Payment"
}
```

| Field | Description |
|-------|-------------|
| `phone` | Customer phone number (format: `2547XXXXXXXX`) |
| `amount` | Amount to pay (as string e.g., `"1"`) |
| `accountReference` | Optional. Reference for the transaction |
| `transactionDesc` | Optional. Description of the transaction |

#### Example cURL Command

```bash
curl -X POST http://localhost:3000/stkpush \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "254700000001",
    "amount": "100",
    "accountReference": "INV-1234",
    "transactionDesc": "Test Payment"
  }'
```

#### Sample Response

```json
{
  "MerchantRequestID": "29163-1234567",
  "CheckoutRequestID": "ws_CO_0408123456",
  "ResponseCode": "0",
  "ResponseDescription": "Success. Request accepted for processing",
  "CustomerMessage": "Enter your PIN to complete payment"
}
```

> If `ResponseCode` is `0`, the user will receive an STK prompt on their phone.

---

### 2. M-Pesa Callback Endpoint

**POST** `/callback`

This endpoint receives real-time payment status updates from M-Pesa after the user completes or cancels the transaction.

> You can view these logs in the terminal where your server is running.

---

## Testing Locally

Use `ngrok` to expose your localhost so Safaricom can reach your `/callback` endpoint.

If you restart your server or ngrok session, always:

1. Restart ngrok and get a new public URL
2. Update the `CALLBACK_URL` in `.env`
3. Restart your Express server

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you'd like to improve this project.

---

##  License

MIT License – see [`LICENSE`](LICENSE) for details.

---

##  Credits

- Powered by [Safaricom Daraja API](https://developer.safaricom.co.ke/)
- Built with [Express.js](https://expressjs.com/)
- Tunneling by [ngrok](https://ngrok.com)

---

##  Support

If you need help setting up, testing, or deploying this project, feel free to reach out via:

*  **Phone**: [+254799311413](tel:+254799311413)
*  **Email**: [www.owinocalvince@gmail.com](mailto:www.owinocalvince@gmail.com)

Alternatively, you can open an issue in the repo.

---
