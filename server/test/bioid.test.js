//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const assert = chai.assert;
const _ = require('lodash');

chai.use(chaiHttp);

let TF = require('../src/transmute')

const BASE_URL = process.env.APP_BASE_URL || 'http://localhost:8080'

describe('BioID API Tests', () => {

    const getActionURL = (url, payload) => {
        return new Promise((resolve, reject) => {
            chai.request(server)
                .post(url)
                .send(payload)
                .end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res.body);
                    }
                });
        })
    }

    const completeAction = (url) => {
        return new Promise((resolve, reject) => {
            chai.request(server)
                .get(url)
                .end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res.body);
                    }
                });
        })
    }

    it('Mock Enrollment', async () => {
        let { url } = await getActionURL('/api/v0/bioid/mock/action', {
            bcid: 'bws/11424/123',
            id: 'XYZ',
            task: 'enroll',
            livedetection: true,
            autoenroll: true,
            app_callback_url: '/api/v0/bioid/mock/app_callback'
        });
        // console.log(url);
        let result = await completeAction(url);
        console.log(result);
    });

    it('Mock Verification', async () => {
        let { url } = await getActionURL('/api/v0/bioid/mock/action', {
            bcid: 'bws/11424/123',
            id: 'XYZ',
            task: 'verify',
            livedetection: true,
            autoenroll: true,
            app_callback_url: '/api/v0/bioid/mock/app_callback'
        });
        // console.log(url);
        let result = await completeAction(url);
        console.log(result);
    });


})