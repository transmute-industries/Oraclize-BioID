



const getSearchObject = (searchFromLocation: string) => {
  var search = location.search.substring(1);
  return search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
    (key, value) => { return key === "" ? value : decodeURIComponent(value) }) : {}
}

import { store } from '../../store/store'

import { push } from 'react-router-redux';

const handlers = {
  ['@@router/LOCATION_CHANGE']: (state: any, action: any) => {
    let searchObject = getSearchObject(action.payload.search)
    // console.log('maybe login with token: ', searchObject)
    if (searchObject.token) {
      firebase.auth().signInWithCustomToken(searchObject.token)
        .then(() => {
          store.dispatch(push(window.location.pathname));
        })
        .catch((error: any) => {
          // Handle Errors here.
          // var errorCode = error.code;
          // var errorMessage = error.message;
          // ...
        });
    }

    return state;
  }
};

export const reducer = (state: any, action: any) => {
  if (handlers[action.type]) {
    return handlers[action.type](state, action);
  }
  state = {
    bcid: null,
    ...state
  };

  console.log('bioid :', state)

  return state;
};

export default {
  reducer
}