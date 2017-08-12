


const TransmuteFramework = require('../src/transmute');
const { Toolbox } = TransmuteFramework;
const admin = require("firebase-admin");

const serviceAccount = require('../../transmute-industries-firebase-adminsdk-qfd5b-9e6a8cc6c8.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://transmute-industries.firebaseio.com"
});

let address;

const initMneumonicWallet = () => {
    let mnemonic = 'divert spare attend review reveal satisfy diagram type afraid annual swim style';
    let config = TransmuteFramework.config;
    config.wallet = Toolbox.getWalletFromMnemonic(mnemonic);
    address = Toolbox.getDefaultAddressFromWallet(config.wallet);
    TransmuteFramework.init(config);
}

const getJWTForAddress = async () => {
    let signature = await Toolbox.sign(address, 'hello');
    let signature_address = await Toolbox.recover(address, 'hello', signature);
    let isMessageSignatureValid = signature_address === address;
    console.log('isMessageSignatureValid: ', isMessageSignatureValid)
}

const generateToken = () => {
    var uid = '0x01';
    var additionalClaims = {
        // premiumAccount: true,
        address: '0x0'
    };
    var token = admin.auth().createCustomToken(uid, additionalClaims);
    console.log(token)
}

// initMneumonicWallet()
// getJWTForAddress()

generateToken()
