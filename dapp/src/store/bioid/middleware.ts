
require('es6-promise').polyfill();
require('isomorphic-fetch');

const querystring = require("querystring");

// http://ti-acs-swarmagents.southcentralus.cloudapp.azure.com:8080
// let bioid_api_base = 'http://localhost:3001';
let bioid_api_base = 'http://ngrok.transmute.industries';

export const biometricAction = (payload: any) => {
    let url = bioid_api_base + '/api/v0/bioid/action?' + querystring.stringify(payload);
    return fetch(url, {
        method: 'GET',
    })
        .then((response: any) => {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        })
}


export const firebaseSignatureBiometricChallenge = (payload: any) => {
    let url = bioid_api_base + '/api/v0/firebase-signature-biometric-challenge';
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    })
        .then((response: any) => {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        })
}




export default {
    biometricAction,
    firebaseSignatureBiometricChallenge
}