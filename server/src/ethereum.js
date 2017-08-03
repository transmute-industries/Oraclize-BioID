

let { recover } = require('./crypto')

const registerEndpoints = (app) => {
    app.post('/api/v0/ecrecover', async (req, res) => {
        let {
            address,
            message,
            signature
        } = req.body;
        let recovered = await recover(address, message, signature);
        res.json({
            recovered,
            address,
            success: recovered === address
        })
    })
}

module.exports = {
    registerEndpoints
}