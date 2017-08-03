var client;


const Issuer = require('openid-client').Issuer;

const API_TOKEN = (new Buffer(process.env.BIO_ID_CLIENT_APP_ID + ':' + process.env.BIO_ID_CLIENT_APP_SECRET)).toString('base64');

const keccak256 = require('js-sha3').keccak256;

// bws/11424/Class-ID
// Here we need to tie the biometic operations to an external identifier...
// the 123 is the external identifier...
const BCID = 'bws/11424/123';

const rp = require('request-promise');
const querystring = require("querystring");


Issuer.discover('https://account.bioid.com/connect/.well-known/openid-configuration')
    .then((bioIdIssuer) => {
        // console.log('Discovered bioIdIssuer %s', bioIdIssuer);
        var client_id = process.env.BIO_ID_CLIENT_ID;
        var client_secret = process.env.BIO_ID_CLIENT_SECRET;
        client = new bioIdIssuer.Client({
            client_id: client_id,
            client_secret: client_secret
        });
    });


const registerEndpoints = (app) => {
    // https://www.npmjs.com/package/openid-client
    // https://github.com/panva/node-openid-client

    app.get('/api/v0/bioid', (req, res) => {
        // console.log('bioid')
        res.json({
            BCID: BCID,
            profile_url: 'https://account.bioid.com/profile/',
            login_url: process.env.APP_BASE_URL + '/api/v0/bioid/login',
            enrollment_url: process.env.APP_BASE_URL + '/api/v0/bioid/enrollment',
            verify_url: process.env.APP_BASE_URL + '/api/v0/bioid/verify',
            identify_url: process.env.APP_BASE_URL + '/api/v0/bioid/identify',
            about: {
                BCID: 'A BCID is the unique identifier used to store your biometric templates. It is how you are identified to our BioID Web Service (BWS), which has no additional knowledge about you to keep your biometrics anonymous.'
            }
        });
    });

    // BEGIN BIO_ID CONNECT ENDPOINTS
    app.get('/api/v0/bioid/login', (req, res) => {
        // after authenticating user will be redirected to /callback
        var url = client.authorizationUrl({
            redirect_uri: process.env.APP_BASE_URL + '/callback',
            scope: 'openid',
        });
        res.redirect(url);
    });

    app.get('/callback', (req, res) => {
        // req.query === .../callback?code=XXX
        client.authorizationCallback(process.env.APP_BASE_URL + '/callback', req.query)
            .then((tokenSet) => {
                console.log('received and validated tokens %j', tokenSet);
                console.log('validated id_token claims %j', tokenSet.claims);
                // Here we return the token set for the BioId OpenId Connect User.
                res.json({
                    tokenSet: tokenSet
                });
            })
            .catch((err) => {
                // console.error(err);
                res.json(err);
            })
    });
    // END BIO_ID CONNECT ENDPOINTS


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
                let return_url = process.env.APP_BASE_URL + '/api/v0/bioid/result';
                var qs = querystring.stringify({
                    access_token: bws_web_token,
                    return_url: return_url,
                    state: 'wallet_address_here'
                });
                // console.log(qs);
                var enrollment_url = 'https://www.bioid.com/bws/performtask?' + qs;
                res.json({
                    bws_web_token: bws_web_token,
                    return_url: return_url,
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

        console.log('verify query: ', req.query);

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
                    return_url: process.env.APP_BASE_URL + '/api/v0/bioid/result',
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
                task: 'identify',
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
                let return_url = process.env.APP_BASE_URL + '/api/v0/bioid/result';
                var qs = querystring.stringify({
                    access_token: bws_web_token,
                    return_url: return_url,
                    state: 'wallet_address_here'
                });
                // console.log(qs);
                var identify_url = 'https://www.bioid.com/bws/performtask?' + qs;
                res.json({
                    identify_url: identify_url
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

        console.log(req)

        console.log('result query: ', req.query);
        console.log('result access_token: ', req.query.access_token);
        
        // https://{bws-instance}.bioid.com/extension/result?access_token={token}

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