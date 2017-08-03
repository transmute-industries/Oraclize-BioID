//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let assert = chai.assert;

chai.use(chaiHttp);

let { web3, wallet } = require('../src/env')
let { sign, recover } = require('../src/crypto')

describe('Ethereum API Tests', () => {
    describe('Provider Tests', () => {
        it('sign and recover', (done) => {
            web3.eth.getAccounts(async (err, accounts) => {
                // let signing_addr = accounts[0];
                let signing_addr = "0x" + wallet.getAddress().toString("hex");
                let message = 'hello'
                let signature = await sign(signing_addr, message);
                let addr = await recover(signing_addr, message, signature);
                // console.log(addr)
                // console.log(signing_addr)
                assert(addr === signing_addr)
                done();
            })
        })
    })

    describe('/api/v0/ecrecover', () => {
        it('it should return success: true when message signature was signed by priv key for address', (done) => {
            web3.eth.getAccounts(async (err, accounts) => {
                let signing_addr = "0x" + wallet.getAddress().toString("hex");
                let message = 'hello'
                let signature = await sign(signing_addr, message);
                chai.request(server)
                    .post('/api/v0/ecrecover')
                    .send({
                        address: signing_addr,
                        message: message,
                        signature: signature
                    })
                    .end((err, res) => {
                        // console.log(res.body)
                        assert(res.body.recovered === signing_addr)
                        done();
                    });
            })
        });
    });
})