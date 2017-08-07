'use strict';

const express = require('express');


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(require('body-parser').json());

const moment = require('moment');

app.get('/', (req, res) => {
  res.json({
    // base_url: process.env.APP_BASE_URL,
    // bioid_url: process.env.APP_BASE_URL + '/api/v0/bioid',
    // privacy: 'This app is for demo purposes.',
    // terms: 'This app is for demo purposes.',
    // contact: 'hello@transmute.industries',
    // now: moment().format('LLL')
  });
});

// require('./src/bioid').registerEndpoints(app); OLD
require('./src/bioid/mock').registerEndpoints(app);
require('./src/ethereum').registerEndpoints(app);

if(!module.parent){ 
  app.listen(PORT, HOST);
}

console.log(`Running on http://${HOST}:${PORT}`);

module.exports = app;
