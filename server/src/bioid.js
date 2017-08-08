var client;


const Issuer = require('openid-client').Issuer;

const API_TOKEN = (new Buffer(process.env.BIO_ID_CLIENT_APP_ID + ':' + process.env.BIO_ID_CLIENT_APP_SECRET)).toString('base64');

const BASE_URL = process.env.APP_BASE_URL || 'http://ngrok.transmute.industries'

const keccak256 = require('js-sha3').keccak256;

// bws/11424/Class-ID
// Here we need to tie the biometic operations to an external identifier...
// the 123 is the external identifier...
const BCID = 'bws/11424/123';

const rp = require('request-promise');
const querystring = require("querystring");


const registerEndpoints = (app) => {
    // https://www.npmjs.com/package/openid-client
    // https://github.com/panva/node-openid-client

    app.get('/api/v0/bioid', (req, res) => {
        // console.log('bioid')
        res.json({
            BCID: BCID,
            profile_url: 'https://account.bioid.com/profile/',
            enroll: BASE_URL + '/api/v0/bioid/enrollment',
            verify: BASE_URL + '/api/v0/bioid/verify',
            identify: BASE_URL + '/api/v0/bioid/identify',
            about: {
                BCID: 'A BCID is the unique identifier used to store your biometric templates. It is how you are identified to our BioID Web Service (BWS), which has no additional knowledge about you to keep your biometrics anonymous.'
            }
        });
    });

    // BEGIN BIO ID WEB API ENDPOINTS
    app.get('/api/v0/bioid/enrollment', (req, res, next) => {
        var options = {
            uri: 'https://bws.bioid.com/extension/token',
            qs: {
                id: process.env.BIO_ID_CLIENT_APP_ID,
                bcid: BCID,
                task: 'enroll',
                livedetection: true,
                autoenroll: true
            },
            headers: {
                'Authorization': 'Basic ' + API_TOKEN
            },
            json: true // Automatically parses the JSON string in the response 
        };
        rp(options)
            .then((bws_web_token) => {
                let return_url = BASE_URL + '/api/v0/bioid/result';
                var qs = querystring.stringify({
                    access_token: bws_web_token,
                    return_url: return_url,
                    state: 'wallet_address_here'
                });
                // console.log(qs);
                var enrollment_url = 'https://www.bioid.com/bws/performtask?' + qs;
                res.json({
                    enrollment_url: enrollment_url
                })
                // res.redirect(enrollment_url, next);
            })
            .catch((err) => {
                // throw err;
                // console.error(err);
                res.json(err)
            });


    });


    app.get('/api/v0/bioid/verify', (req, res, next) => {
        var options = {
            uri: 'https://bws.bioid.com/extension/token',
            qs: {
                id: process.env.BIO_ID_CLIENT_APP_ID,
                bcid: BCID,
                task: 'verify',
                livedetection: true,
                autoenroll: true
            },
            headers: {
                'Authorization': 'Basic ' + API_TOKEN
            },
            json: true // Automatically parses the JSON string in the response 
        };
        rp(options)
            .then((bws_web_token) => {
                var qs = querystring.stringify({
                    access_token: bws_web_token,
                    return_url: BASE_URL + '/api/v0/bioid/result',
                    state: 'wallet_address_here'
                });
                // console.log(qs);
                var verify_url = 'https://www.bioid.com/bws/performtask?' + qs;
                res.json({
                    verify_url: verify_url
                })
                // res.redirect(enrollment_url, next);
            })
            .catch((err) => {
                // throw err;
                // console.error(err);
                res.json(err)
            });
    });

    app.get('/api/v0/bioid/identify', (req, res, next) => {
        var options = {
            uri: 'https://bws.bioid.com/extension/token',
            qs: {
                id: process.env.BIO_ID_CLIENT_APP_ID,
                bcid: BCID,
                task: 'verify',
                livedetection: true,
                autoenroll: true
            },
            headers: {
                'Authorization': 'Basic ' + API_TOKEN
            },
            json: true // Automatically parses the JSON string in the response 
        };
        rp(options)
            .then((bws_web_token) => {
                res.json({
                    url: 'https://www.bioid.com/bws/performtask?' + querystring.stringify({
                        access_token: bws_web_token,
                        return_url: BASE_URL + '/api/v0/bioid/result',
                        state: 'wallet_address_here'
                    })
                })
                // res.redirect(enrollment_url, next);
            })
            .catch((err) => {
                // throw err;
                // console.error(err);
                res.json(err)
            });
    });

    app.get('/api/v0/bioid/result', (req, res, next) => {
        var options = {
            uri: 'https://bws.bioid.com/extension/result',
            qs: {
                access_token: req.query.access_token
            },
            headers: {
                'Authorization': 'Basic ' + API_TOKEN
            },
            json: true
        };
        rp(options)
            .then((data) => {
                console.log(data);
                res.json(data)
            })
            .catch((err) => {
                // throw err;
                res.json(err)
            });
    });

}

module.exports = {
    registerEndpoints
}