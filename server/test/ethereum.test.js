//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let assert = chai.should;

chai.use(chaiHttp);

var bip39 = require("bip39");
var hdkey = require('ethereumjs-wallet/hdkey');
var ProviderEngine = require("web3-provider-engine");
var WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
var Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");
var Web3 = require("web3");

// Get our mnemonic and create an hdwallet
var mnemonic = "couch solve unique spirit wine fine occur rhythm foot feature glory away";
var hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));

// Get the first account using the standard hd path.
var wallet_hdpath = "m/44'/60'/0'/0/";
var wallet = hdwallet.derivePath(wallet_hdpath + "0").getWallet();
var address = "0x" + wallet.getAddress().toString("hex");

var providerUrl = "http://localhost:8545";
var engine = new ProviderEngine();
engine.addProvider(new WalletSubprovider(wallet, {}));
engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(providerUrl)));
engine.start(); // Required by the provider engine.
var web3 = new Web3(engine)

describe('Ethereum API Tests', () => {

    describe('Provider Tests', () => {
        it('getAccounts', (done) => {
            web3.eth.getAccounts((err, accounts) => {
                // console.log(err, accounts)
                var message = web3.sha3('user_secret');
                web3.eth.sign(accounts[0], message, (err, signature) => {
                    // console.log(signature)
                    assert(signature === '0x32d7b1cffdfd20f5b01a584e2b4ff8f664e0abe0a9043b5121ad1fb27668b2d02792b85a09ce11fd80eac1de43ae1fe241a3c741db23d696649176f6a9f58a6f1c')
                    done();
                });
            })
        })
    });

    // describe('Off Chain Wallet', () => {

    //     it('should support lightwallet sigs', (done) => {
    //         // the seed is stored encrypted by a user-defined password
    //         // var password = prompt('Enter password for encryption', 'password');
    //         keystore.createVault({
    //             password: password,
    //             // seedPhrase: seedPhrase, // Optionally provide a 12-word seed phrase
    //             // salt: fixture.salt,     // Optionally provide a salt.
    //             // A unique salt will be generated otherwise.
    //             // hdPathString: hdPath    // Optional custom HD Path String
    //         }, (err, ks) => {
    //             // Some methods will require providing the `pwDerivedKey`,
    //             // Allowing you to only decrypt private keys on an as-needed basis.
    //             // You can generate that value with this convenient method:
    //             ks.keyFromPassword(password, (err, pwDerivedKey) => {
    //                 if (err) throw err;
    //                 // generate five new address/private key pairs
    //                 // the corresponding private keys are also encrypted
    //                 ks.generateNewAddress(pwDerivedKey, 5);
    //                 var addr = ks.getAddresses();
    //                 // console.log(addr)
    //                 ks.passwordProvider = (callback) => {
    //                     // var pw = prompt("Please enter password", "Password");
    //                     var pw = password;
    //                     callback(null, pw);
    //                 };
    //                 done();
    //                 // Now set ks as transaction_signer in the hooked web3 provider
    //                 // and you can start using web3 using the keys/addresses in ks!
    //             });
    //         });
    //     })
    // })

    // describe('Can generate transaction...', () => {

    //     it('should support lightwallet sigs', (done) => {

    //         web3.eth.getAccounts((error, accounts) => {
    //             // console.log(error, accounts)
    //             var message = web3.sha3('user_secret');
    //             let signature = web3.eth.sign(accounts[0], message);
    //             console.log(signature)
    //             done();
    //         })
    //         // var signature = web3.eth.sign(, message);
    //         // console.log(signature)

    //     })
    // })

    // describe('/api/v0/ecrecover', () => {


    //     it('it should GET all the books', (done) => {
    //         chai.request(server)
    //             .post('/api/v0/ecrecover', {
    //                 account_address: lastFromAccountAddress,
    //                 message: lastTransaction,
    //                 signature: lastSignature
    //             })
    //             .end((err, res) => {

    //                 console.log(res.body)
    //                 // res.should.have.status(200);
    //                 // res.body.should.be.a('array');
    //                 // res.body.length.should.be.eql(0);
    //                 done();
    //             });
    //     });

    // });

})