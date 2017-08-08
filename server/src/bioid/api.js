

require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');

const querystring = require("querystring");

const BASE_URL = process.env.APP_BASE_URL || 'http://ngrok.transmute.industries'

const API_TOKEN = (new Buffer(process.env.BIO_ID_CLIENT_APP_ID + ':' + process.env.BIO_ID_CLIENT_APP_SECRET)).toString('base64');

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
            .then((response) => {

                if (response.status >= 400) {
                    reject(response.json())
                }
                resolve(response.json());
            })
    })
}

const registerEndpoints = (app) => {

    app.get('/api/v0/bioid', async (req, res, next) => {
        res.json({
            enroll: BASE_URL + '/api/v0/bioid/action?' + querystring.stringify({
                bcid: '123',
                task: 'enroll',
                app_callback_url: BASE_URL + '/api/v0/bioid/app_callback'
            })
        });
    })


    app.get('/api/v0/bioid/action', async (req, res, next) => {

        let response = await getToken({
            id: process.env.BIO_ID_CLIENT_APP_ID,
            bcid: req.query.bcid,
            task: req.query.task,
            livedetection: true,
            autoenroll: true
        })

        res.json({
            url: 'https://www.bioid.com/bws/performtask?' + querystring.stringify({
                access_token: bws_web_token,
                return_url: BASE_URL + '/api/v0/bioid/result?' + querystring.stringify({
                    bcid: req.query.bcid,
                    action: req.query.task,
                    app_callback_url: req.query.app_callback_url
                }),
                state: 'wallet_address_here'
            })
        })

        // res.json({
        //     url: '/api/v0/bioid/mock/performtask?' + querystring.stringify({
        //         access_token: '',
        //         return_url: '/api/v0/bioid/mock/result?' + querystring.stringify({
        //             bcid: req.body.bcid,
        //             action: req.body.task,
        //             app_callback_url: req.body.app_callback_url
        //         }),
        //         state: 'wallet_address_here'
        //     })
        // })

    });

    app.get('/api/v0/bioid/result', (req, res, next) => {
        console.log('result....', req.query)

        let callback_params;

        // switch (req.query.action) {
        //     case 'enroll': callback_params = enroll_result; break;
        //     case 'verify': callback_params = verify_result; break;
        // }

        res.redirect(req.query.app_callback_url + '?' + querystring.stringify(callback_params));
    });

    app.get('/api/v0/bioid/app_callback', (req, res, next) => {
        console.log('app_callback....', req.query)
        res.json(req.query)
    });

}

module.exports = {
    registerEndpoints
}