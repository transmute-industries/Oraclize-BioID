
require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');
const querystring = require("querystring");
const _ = require('lodash');

const API_TOKEN = (new Buffer(process.env.BIO_ID_CLIENT_APP_ID + ':' + process.env.BIO_ID_CLIENT_APP_SECRET)).toString('base64');
const BASE_URL = process.env.APP_BASE_URL || 'http://ngrok.transmute.industries'

const getToken = (payload) => {
    let url = 'https://bws.bioid.com/extension/token?' + querystring.stringify(payload);
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + API_TOKEN
            }
        })
            .then(async (response) => {
                if (response.status >= 400) {
                    reject((await response.text()));
                } else {
                    let token = await response.text();
                    resolve(token);
                }
            })
    })
}

const getResult = (access_token) => {
    let url = 'https://bws.bioid.com/extension/result?' + querystring.stringify({
        access_token: access_token
    });
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + API_TOKEN
            }
        })
            .then(async (response) => {
                if (response.status >= 400) {
                    reject({
                        error: await response.text()
                    });
                } else {
                    let data = await response.json();
                    resolve(data);
                }
            });
    });
}

const registerEndpoints = (app) => {

    app.get('/api/v0/bioid', (req, res) => {
        let app_callback_url = BASE_URL + '/api/v0/bioid/app_callback';
        let bcid = 'bws/11424/1234';
         // bws/11424/Class-ID
        // Here we need to tie the biometic operations to an external identifier...
        // the 1234 is the external identifier...
        // we pass it as a get parameter.
        let encrypted_state = '0xdeadbeef'
        let test_params = `bcid=${bcid}&app_callback_url=${app_callback_url}&encrypted_state=${encrypted_state}`
        res.json({
            BCID: bcid,
            profile_url: 'https://account.bioid.com/profile/',
            enroll: BASE_URL + `/api/v0/bioid/action?task=enroll&${test_params}`,
            verify: BASE_URL + `/api/v0/bioid/action?task=verify&${test_params}`,
            identify: BASE_URL + `/api/v0/bioid/action?task=identify&${test_params}`,
            about: {
                BCID: 'A BCID is the unique identifier used to store your biometric templates. It is how you are identified to our BioID Web Service (BWS), which has no additional knowledge about you to keep your biometrics anonymous.'
            }
        });
    });

    app.get('/api/v0/bioid/action', async (req, res) => {
        let access_token = await getToken({
            id: process.env.BIO_ID_CLIENT_APP_ID,
            bcid: req.query.bcid,
            task: req.query.task,
            // These are for providing additional security
            // livedetection: true,
            // challenge: true
            // autoenroll: true
        })
        res.json({
            ['action_url']: 'https://www.bioid.com/bws/performtask?' + querystring.stringify({
                access_token: access_token,
                return_url: BASE_URL + '/api/v0/bioid/result',
                state: (new Buffer(JSON.stringify({
                    encrypted_state: req.query.encrypted_state,
                    app_callback_url: req.query.app_callback_url
                })).toString('base64'))
            })
        });
    });

    app.get('/api/v0/bioid/result', async (req, res, next) => {
        let result = await getResult(req.query.access_token);
        let state = JSON.parse(new Buffer(req.query.state, 'base64').toString('ascii'));
        let augmented_result = _.extend(result, {
            encrypted_state: state.encrypted_state
        });
        delete augmented_result['Matches']
        // Here we don't want to return matches to the client, but we might care to inspect them
        // and do something nice if confidence is low 
    
        // Here we should also look at encrypted_state.
        // We probably want to use an HD wallet + framework to sign a transaction related to this operation.
        // Then we will be storing our biometric challenge result using a wallet.
        
        // We can also store such a transaction as a 3rd party (no need to share access to the wallet, 
        // only need to prove control via ecrecover)

        // CRITICAL: This is were the entire security of the binding needs to occur.
        // the client should be untrusted.

        // Obviously, if token theft occurs an attacker can use this API to 
        // claim biometric identities via arbitrary wallets

        let callback_url = state.app_callback_url + '?' + querystring.stringify(augmented_result)
        res.redirect(callback_url);
    });

    app.get('/api/v0/bioid/app_callback', async (req, res, next) => {
        res.json(req.query)
    });
}

module.exports = {
    registerEndpoints
}