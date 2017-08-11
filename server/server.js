'use strict';

require('dotenv').config({path: './server.env'})

const express = require('express');


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(require('body-parser').json());

const moment = require('moment');

const BASE_URL = process.env.APP_BASE_URL

app.get('/', (req, res) => {
  res.json({
    bioid_url: BASE_URL + '/api/v0/bioid',
    privacy: 'This app is for demo purposes.',
    terms: 'This app is for demo purposes.',
    contact: 'hello@transmute.industries',
    now: moment().format('LLL')
  });
});

require('./src/bioid/bioid').registerEndpoints(app); 
require('./src/ethereum').registerEndpoints(app);

if (!module.parent) {
  app.listen(PORT, HOST);
}

console.log(`Running on http://${HOST}:${PORT}`);

module.exports = app;
