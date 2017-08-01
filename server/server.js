'use strict';

const express = require('express');
const bioid = require('./src/bioid')
const ethereum = require('./src/ethereum')


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

const moment = require('moment');

app.get('/', (req, res) => {
  res.json({
    base_url: process.env.APP_BASE_URL,
    bioid_url: process.env.APP_BASE_URL + '/api/v0/bioid',
    privacy: 'This app is for demo purposes.',
    terms: 'This app is for demo purposes.',
    contact: 'hello@transmute.industries',
    now: moment().format('LLL')
  });
});

bioid.registerEndpoints(app);
ethereum.registerEndpoints(app);

if(!module.parent){ 
  app.listen(PORT, HOST);
}

console.log(`Running on http://${HOST}:${PORT}`);



module.exports = app;