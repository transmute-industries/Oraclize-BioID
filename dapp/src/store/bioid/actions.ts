
import Middleware from './middleware'

export const biometricAction = (payload: any) => async (dispatch: any) => {
    let resp: any = await Middleware.biometricAction(payload)
    console.log(resp)
    // cryptography should be added here to prevent session hijacking.
    window.location.href = resp.action_url;
}

export default {
    biometricAction
}