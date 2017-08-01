

// app.post('/token', function(req, res) {
//     var postBody = req.body;

//     console.log('postBody: ', postBody);


//     var signature = utils.stripHexPrefix(req.body.signature);
//     var r = new Buffer(signature.substring(0, 64), 'hex')
//     var s = new Buffer(signature.substring(64, 128), 'hex')
//     var v = new Buffer((parseInt(signature.substring(128, 130)) + 27).toString());
//     var messageBuffer = new Buffer(postBody.message, 'hex');
//     var pub = utils.ecrecover(messageBuffer, v, r, s);
//     var recoveredAddress = utils.addHexPrefix(utils.pubToAddress(pub).toString('hex'))
//     console.log('recoveredAddress: ', recoveredAddress);
//     if (recoveredAddress === postBody.account_address) {
//         var uid = postBody.account_address;
//         var additionalClaims = {
//             premiumAccount: true,
//             account_address: postBody.account_address
//         };
//         var token = firebase.auth().createCustomToken(uid, additionalClaims);
//         res.send(token)
//     } else {
//         console.log('NOT A MATCH')
//         res.send(null)
//     }
// })

const registerEndpoints = (app) => {
    app.post('/api/v0/ecrecover', (req, res) => {
        res.json({
            nope: true
        })
    })
}

module.exports = {
    registerEndpoints
}