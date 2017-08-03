var util = require('ethereumjs-util');

let { web3 } = require('../src/env')

const sign = (address, message) => {
    return new Promise((resolve, reject) => {
        // console.log(message.length)
        // THIS IS LAME... testrpc... I hate you....
        web3.eth.sign(address, message, (err, signature) => {
            if (err) {
                web3.eth.sign(address, web3.sha3(message), (err, signature) => {
                    if (err) {
                        throw err;
                    }
                    resolve(signature)
                })
            } else {
                resolve(signature)
            }
        })
    })
}

const recover = (address, message, signature) => {
    return new Promise((resolve, reject) => {
        var r = util.toBuffer(signature.slice(0, 66))
        var s = util.toBuffer('0x' + signature.slice(66, 130))
        var v = parseInt(signature.slice(130, 132), 16)
        if (v !== 27) {
            v += 27
        }
        var m = util.toBuffer(web3.sha3(message));
        var pub = util.ecrecover(m, v, r, s)
        var recovered_address = '0x' + util.pubToAddress(pub).toString('hex')
        resolve(recovered_address)
    })
}

module.exports = {
    sign,
    recover
}
