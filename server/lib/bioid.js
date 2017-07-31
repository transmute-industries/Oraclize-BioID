

const Issuer = require('openid-client').Issuer;

var client;

Issuer.discover('https://account.bioid.com/connect/.well-known/openid-configuration')
    .then((bioIdIssuer) => {
        // console.log('Discovered bioIdIssuer %s', bioIdIssuer);
        var client_id = process.env.BIO_ID_CLIENT_ID;
        var client_secret = process.env.BIO_ID_CLIENT_SECRET;
        client = new bioIdIssuer.Client({
            client_id: client_id,
            client_secret: client_secret
        });
    });


const registerEndpoints = (app) => {
    // https://www.npmjs.com/package/openid-client
    // https://github.com/panva/node-openid-client

    app.get('/api/v0/bioid', (req, res) => {
        console.log('bioid')
        res.json({
            login: process.env.APP_BASE_URL + '/api/v0/bioid/login'
        });
    });

    app.get('/api/v0/bioid/login', (req, res) => {
        // after authenticating user will be redirected to /callback
        var url = client.authorizationUrl({
            redirect_uri: process.env.APP_BASE_URL + '/callback',
            scope: 'openid',
        });
        res.redirect(url);
    });

    app.get('/callback', (req, res) => {
        // req.query === .../callback?code=XXX
        client.authorizationCallback(process.env.APP_BASE_URL + '/callback', req.query)
            .then((tokenSet) => {
                console.log('received and validated tokens %j', tokenSet);
                console.log('validated id_token claims %j', tokenSet.claims);
                // Here we return the token set for the BioId OpenId Connect User.
                res.json({
                    tokenSet: tokenSet
                });
            });
    });
}

module.exports = {
    registerEndpoints
}