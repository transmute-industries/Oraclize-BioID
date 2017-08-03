

let { recover } = require('./crypto')

const registerEndpoints = (app) => {
    app.post('/api/v0/ecrecover', async (req, res) => {

        let {
            account_address,
            message_hash,
            signature
        } = req.body;

        let addr = await recover(account_address, message_hash, signature);

        res.json({
            addr,
            account_address
           
        })
    })
}

module.exports = {
    registerEndpoints
}