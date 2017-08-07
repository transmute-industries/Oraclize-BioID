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

describe('Ethereum API Tests', () => {

    describe('/api/v0/ecrecover', () => {
        it('uses TF', async () => {

            let mneumonic = TF.Toolbox.generateMnemonic();

            TF.init(
                _.extend(TF.config, {
                    wallet: TF.Toolbox.getWalletFromMnemonic(mneumonic)
                })
            );

            let addr = TF.Toolbox.getDefaultAddressFromMnemonic(mneumonic)
            let msg = 'hello';
            let sig = await TF.Toolbox.sign(addr, msg);

            chai.request(server)
                .post('/api/v0/ecrecover')
                .send({
                    address: addr,
                    message: msg,
                    signature: sig
                })
                .end((err, res) => {
                    // console.log(res.body)
                    assert(res.body.recovered === signing_addr)
                });
        });
    });
})