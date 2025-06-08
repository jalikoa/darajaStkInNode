require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Variables
const PORT = process.env.PORT || 3000;
const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const BUSINESS_SHORT_CODE = process.env.BUSINESS_SHORT_CODE;
const LIPA_NA_MPESA_PASSKEY = process.env.LIPA_NA_MPESA_PASSKEY;
const CALLBACK_URL = process.env.CALLBACK_URL;
const BASE_URL = process.env.BASE_URL;

// Get access token
const getAccessToken = async () => {
    try {
        const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
        const response = await axios.get(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
            headers: {
                Authorization: `Basic ${auth}`
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error);
        throw error;
    }
};

// STK Push function
const initiateSTKPush = async (phone, amount, accountReference, transactionDesc) => {
    try {
        const accessToken = await getAccessToken();
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
        const password = Buffer.from(`${BUSINESS_SHORT_CODE}${LIPA_NA_MPESA_PASSKEY}${timestamp}`).toString('base64');
        
        const payload = {
            BusinessShortCode: BUSINESS_SHORT_CODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: phone,
            PartyB: BUSINESS_SHORT_CODE,
            PhoneNumber: phone,
            CallBackURL: CALLBACK_URL,
            AccountReference: accountReference,
            TransactionDesc: transactionDesc
        };

        const response = await axios.post(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, payload, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error initiating STK Push:', error.response?.data || error.message);
        throw error;
    }
};

// Routes
app.post('/stkpush', async (req, res) => {
    try {
        const { phone, amount, accountReference, transactionDesc } = req.body;
        
        if (!phone || !amount) {
            return res.status(400).json({ error: 'Phone and amount are required' });
        }

        const response = await initiateSTKPush(
            phone,
            amount,
            accountReference || 'Payment',
            transactionDesc || 'Payment for services'
        );

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Callback URL for M-Pesa
app.post('/callback', (req, res) => {
    console.log('Callback received:', req.body);
    // Process the callback data here
    res.status(200).send();
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});