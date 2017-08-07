

require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');

const querystring = require("querystring");

const BASE_URL = process.env.APP_BASE_URL || 'http://localhost:8080'

const enroll_result = {
    Success: true,
    Action: "enrollment",
    BCID: "bws/11424/123"
}

const verify_result = {
    Success: true,
    Action: "verification",
    BCID: "bws/11424/123"
}

const registerEndpoints = (app) => {

    app.post('/api/v0/bioid/mock/action', (req, res, next) => {
        res.json({
            url: '/api/v0/bioid/mock/performtask?' + querystring.stringify({
                access_token: '',
                return_url: '/api/v0/bioid/mock/result?' + querystring.stringify({
                    bcid: req.body.bcid,
                    action: req.body.task,
                    app_callback_url: req.body.app_callback_url
                }),
                state: 'wallet_address_here'
            })
        })
    });

    app.get('/api/v0/bioid/mock/performtask', (req, res, next) => {
        console.log('performtask....', req.query),
            res.redirect(req.query.return_url);
    });

    app.get('/api/v0/bioid/mock/result', (req, res, next) => {
        console.log('result....', req.query)
        let callback_params;
        switch (req.query.action) {
            case 'enroll': callback_params = enroll_result; break;
            case 'verify': callback_params = verify_result; break;
        }
        res.redirect(req.query.app_callback_url + '?' + querystring.stringify(callback_params));
    });

    app.get('/api/v0/bioid/mock/app_callback', (req, res, next) => {
        console.log('app_callback....')
        res.json(req.query)
    });

}

module.exports = {
    registerEndpoints
}