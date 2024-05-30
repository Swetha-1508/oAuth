const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Meta App credentials
const CLIENT_ID = '1512290809707571';
const CLIENT_SECRET = 'c8568feaaf62045dee60aa3b84867fe2';
const REDIRECT_URI = 'https://56c7-115-240-223-250.ngrok-free.app/callback';

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Step 1: Redirect to Meta's OAuth 2.0 server
app.get('/auth', (req, res) => {
  const authUrl = `https://www.facebook.com/dialog/oauth?client_id=${CLIENT_ID}&display=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement`;
  res.redirect(authUrl);
});

// Step 2: Meta redirects back to your site with the token
app.get('/callback', (req, res) => {
  const hash = req.originalUrl.split('#')[1];
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  const longLivedToken = params.get('long_lived_token');

  if (!accessToken || !longLivedToken) {
    return res.status(400).send('Authorization failed or tokens not provided!');
  }

  res.send(`Access Token: ${accessToken}<br>Long-Lived Token: ${longLivedToken}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
