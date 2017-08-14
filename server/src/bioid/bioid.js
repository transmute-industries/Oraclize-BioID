
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
            .catch((err) => {
                console.log('error: ', error);
                reject(err);
            });
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
            })
            .catch((err) => {
                console.log('error: ', error);
                reject(err);
            });
    });
}

module.exports = {
    getToken,
    getResult
}