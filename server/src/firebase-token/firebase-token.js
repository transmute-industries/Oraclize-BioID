const admin = require("firebase-admin");
const moment = require('moment');
const querystring = require("querystring");
const _ = require('lodash');

require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');

const keccak256 = require('js-sha3').keccak256;

const BASE_URL = process.env.APP_BASE_URL || 'http://ngrok.transmute.industries'

const serviceAccount = require('../../../transmute-industries-firebase-adminsdk-qfd5b-9e6a8cc6c8.json');

const TransmuteFramework = require('../transmute');
const { Toolbox } = TransmuteFramework;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://transmute-industries.firebaseio.com"
});

const db = admin.database();

const {
    getToken,
    getResult
} = require('../bioid/bioid')

const getChallenge = (address) => {
    return new Promise((resolve, reject) => {
        let ref = db.ref(`challenge/${address}`);
        ref.on("value", (snapshot) => {
            console.log();
            resolve(snapshot.val())
        }, (errorObject) => {
            reject(errorObject)
        });
    })

}

const registerEndpoints = (app) => {

    app.get('/api/v0/bioid', (req, res) => {
        let app_callback_url = BASE_URL + '/api/v0/bioid/app_callback';
        let bcid = 'bws/11424/1234';

        let mnemonic = 'divert spare attend review reveal satisfy diagram type afraid annual swim style';
        let config = TransmuteFramework.config;
        config.wallet = Toolbox.getWalletFromMnemonic(mnemonic);
        let address = Toolbox.getDefaultAddressFromWallet(config.wallet);
        TransmuteFramework.init(config);

        res.json({
            enroll: BASE_URL + `/api/v0/bioid/action?` + querystring.stringify({
                task: 'enroll',
                bcid: bcid,
                address: address,
                signature: '0xdeadbeef',
                app_callback_url: app_callback_url
            }),
            verify: BASE_URL + `/api/v0/bioid/action?` + querystring.stringify({
                task: 'verify',
                bcid: bcid,
                address: address,
                signature: '0xdeadbeef',
                app_callback_url: app_callback_url
            }),
            identify: BASE_URL + `/api/v0/bioid/action?` + querystring.stringify({
                task: 'identify',
                bcid: bcid,
                address: address,
                signature: '0xdeadbeef',
                app_callback_url: app_callback_url
            }),
        });
    });

    app.post('/api/v0/firebase-signature-biometric-challenge', (req, res) => {
        let {
            address,
            bcid,
            task,
            app_callback_url
        } = req.body;

        // if (['enroll', 'verify'].indexOf(task) === -1) {
        //     throw Error('Only enroll or verify are supported for signature challenges.')
        // }

        let timestamp = moment().unix();
        let challenge = `${address}:${timestamp}`
        let expires = moment().add(10, 'minutes').unix();

        let ref = db.ref(`challenge/${address}`);

        ref.set({
            address: address,
            challenge: challenge,
            expires: expires,
        });

        let url_params = querystring.stringify({
            task: task,
            bcid: bcid,
            address: address,
            app_callback_url: app_callback_url
        })

        let action_url = BASE_URL + `/api/v0/bioid/action?${url_params}`;
        // client will add signature, which will be the signed challenge in this case.
        // console.log(action_url)
        res.json({
            action_url: action_url,
            address: address,
            challenge: challenge
        })
    })

    app.get('/api/v0/bioid/action', async (req, res) => {
        let access_token = await getToken({
            id: process.env.BIO_ID_CLIENT_APP_ID,
            bcid: req.query.bcid,
            task: req.query.task,
            // These are for providing additional security
            // livedetection: false,
            // challenge: false
            // autoenroll: true
        })
        // console.log(access_token)
        let biometric_action_url = 'https://www.bioid.com/bws/performtask?' + querystring.stringify({
            access_token: access_token,
            return_url: BASE_URL + '/api/v0/bioid/result',
            state: (new Buffer(JSON.stringify({
                address: req.query.address,
                signature: req.query.signature,
                app_callback_url: req.query.app_callback_url
            })).toString('base64'))
        });
        res.redirect(biometric_action_url);
    });

    app.get('/api/v0/bioid/result', async (req, res, next) => {
        let result = await getResult(req.query.access_token);

        let state = JSON.parse(new Buffer(req.query.state, 'base64').toString('ascii'));

        // unsafe property override here...
        let augmented_result = _.extend(result, state);

        if (augmented_result.Action === 'identification') {
            if (augmented_result.Success) {
                res.redirect(augmented_result.app_callback_url + '?' + querystring.stringify({
                    bcid: augmented_result.BCID
                }));
            } else {
                res.json(augmented_result)
            }
            return;
        }

        if (!augmented_result.Success) {
            throw Error('Failed biometric challenge...');
        }
        let challenge = await getChallenge(state.address)
        // TODO: check expires first....
        if (moment().isAfter(moment.unix(challenge.expires))) {
            throw Error('Challange has expired. Please try again, with more haste...');
        }

        let signature_address = await Toolbox.recover(augmented_result.address, challenge.challenge, augmented_result.signature);
        let isMessageSignatureValid = signature_address === augmented_result.address;

        if (!isMessageSignatureValid) {
            throw Error('Signature does not match challenge... ECRecover failure.');
        } else {
            // TODO: As a system account, update Ethereum Event Store with result of token request 
            // (success or failure)

            var uid = augmented_result.address;
            var additionalClaims = {
                bcid: augmented_result.BCID,
                address: augmented_result.address
            };
            var token = await admin.auth().createCustomToken(uid, additionalClaims);
            // console.log(token);

            let callback_url = augmented_result.app_callback_url + '?' + querystring.stringify({
                token: token
            })
            res.redirect(callback_url);
        }
    });

    app.get('/api/v0/bioid/app_callback', async (req, res, next) => {
        res.json(req.query)
    });
}

module.exports = {
    registerEndpoints
}