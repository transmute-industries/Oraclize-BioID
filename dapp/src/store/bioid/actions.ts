
import Middleware from './middleware';


import TransmuteFramework from '../../transmute';
const { Toolbox } = TransmuteFramework;

export const biometricAction = (payload: any) => async (dispatch: any) => {
    let resp: any = await Middleware.biometricAction(payload)
    console.log(resp)
    // cryptography should be added here to prevent session hijacking.
    window.location.href = resp.action_url;
}

export const firebaseSignatureBiometricChallenge = (payload: any) => async (dispatch: any) => {
    let { action_url, address, challenge } = await Middleware.firebaseSignatureBiometricChallenge(payload)
    // console.log(action_url, address, challenge)
    let signature = await Toolbox.sign(address, challenge);
    // signature should occur hear, then redirect to the completed action_url
    let action_url_with_sig = action_url + '&signature=' + signature
    console.log(action_url_with_sig)
    // window.location.href = action_url_with_sig
}

export default {
    biometricAction,
    firebaseSignatureBiometricChallenge
}