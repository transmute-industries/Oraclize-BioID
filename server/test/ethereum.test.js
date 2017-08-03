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
                let signature = await sign(signing_addr, 'hello');
                let addr = await recover(signing_addr, 'hello', signature);
                // console.log(addr)
                // console.log(signing_addr)
                assert(addr === signing_addr)
                done();
            })
        })
    })

    // describe('/api/v0/ecrecover', () => {

    //     it('it should GET all the books', (done) => {
    //         web3.eth.getAccounts(async (err, accounts) => {
    //             let signing_addr = "0x" + wallet.getAddress().toString("hex");
    //             let message_hash = web3.sha3('hello')
    //             let signature = await sign(signing_addr, message_hash);

    //             chai.request(server)
    //                 .post('/api/v0/ecrecover')
    //                 .send({
    //                     account_address: signing_addr,
    //                     message_hash: message_hash,
    //                     signature: signature
    //                 })
    //                 .end((err, res) => {
    //                     console.log(res.body)
    //                     // res.should.have.status(200);
    //                     // res.body.should.be.a('array');
    //                     // res.body.length.should.be.eql(0);
    //                     done();
    //                 });
    //         })
    //     });
    // });
})