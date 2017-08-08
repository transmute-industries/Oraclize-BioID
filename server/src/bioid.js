
require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');


const API_TOKEN = (new Buffer(process.env.BIO_ID_CLIENT_APP_ID + ':' + process.env.BIO_ID_CLIENT_APP_SECRET)).toString('base64');

const BASE_URL = process.env.APP_BASE_URL || 'http://ngrok.transmute.industries'

// bws/11424/Class-ID
// Here we need to tie the biometic operations to an external identifier...
// the 123 is the external identifier...
const BCID = 'bws/11424/123';

const rp = require('request-promise');
const querystring = require("querystring");

const getToken = (payload) => {
    let url = 'https://bws.bioid.com/extension/token?' + querystring.stringify(payload)
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
                    reject(status)
                } else {
                    let token = await response.text()
                    resolve(token)
                }
            })
    })
}

const getResult = (access_token) => {
    let url = 'https://bws.bioid.com/extension/result?' + querystring.stringify({
        access_token: access_token
    })
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
                    reject(status)
                } else {
                    let data = await response.json()
                    resolve(data)
                }
            })
    })
}


const registerEndpoints = (app) => {
    // https://www.npmjs.com/package/openid-client
    // https://github.com/panva/node-openid-client

    app.get('/api/v0/bioid', (req, res) => {
        // console.log('bioid')
        res.json({
            BCID: BCID,
            profile_url: 'https://account.bioid.com/profile/',
            enroll: BASE_URL + `/api/v0/bioid/action?bcid=${BCID}&task=enroll`,
            verify: BASE_URL + `/api/v0/bioid/action?bcid=${BCID}&task=verify`,
            about: {
                BCID: 'A BCID is the unique identifier used to store your biometric templates. It is how you are identified to our BioID Web Service (BWS), which has no additional knowledge about you to keep your biometrics anonymous.'
            }
        });
    });

    app.get('/api/v0/bioid/action', async (req, res) => {
        // console.log('bioid')
        let access_token = await getToken({
            id: process.env.BIO_ID_CLIENT_APP_ID,
            bcid: req.query.bcid,
            task: req.query.task,
            livedetection: true,
            autoenroll: true
        })
        res.json({
            [req.query.task]: 'https://www.bioid.com/bws/performtask?' + querystring.stringify({
                access_token: access_token,
                return_url: BASE_URL + '/api/v0/bioid/result', //extend app redirect params here...
                state: 'wallet_address_here'
            })
        });
    });

    app.get('/api/v0/bioid/result', async (req, res, next) => {
        let result = await getResult(req.query.access_token);
        res.json({
            result: result
        })
    });

}

module.exports = {
    registerEndpoints
}