
// Don't use localStorage in production!
// https://stackoverflow.com/questions/37398427/redux-testing-referenceerror-localstorage-is-not-defined
let localStorage: any = window.localStorage || (function () {
  var store = {};
  return {
    getItem: function (key: string) {
      return store[key];
    },
    setItem: function (key: string, value: any) {
      store[key] = value.toString();
    },
    clear: function () {
      store = {};
    },
    removeItem: function (key: string) {
      delete store[key];
    }
  };
})();

import TransmuteFramework from '../transmute'

const handlers = {

  ['TRANSMUTE_WEB3_ACCOUNTS_RECEIVED']: (state: any, action: any) => {
    let defaultAddress = action.payload[0];
    return {
      ...state,
      defaultAddress: defaultAddress,
      addresses: action.payload,
    };
  },
  ['TRANSMUTE_FACTORY_RECEIVED']: (state: any, action: any) => {
    return {
      ...state,
      [action.payload.readModelType]: action.payload
    };
  },
  ['TRANSMUTE_EVENTSTORE_EVENTS_RECEIEVED']: (state: any, action: any) => {
    return {
      ...state,
      ['events']: action.payload.events
    };
  },

  ['EVENTSTORE_ADDRESS_UPDATED']: (state: any, action: any) => {
    return {
      ...state,
      ['selectedContract']: action.payload
    };
  },
  ['RECORD_EVENT_DIALOG_UPDATE']: (state: any, action: any) => {
    return {
      ...state,
      ['activeDialog']: action.payload,
    };
  },
  ['PATIENT_SUMMARY_UPDATED']: (state: any, action: any) => {
    return {
      ...state,
      ['patientSummary']: action.payload,
    };
  },

  ['UNSAFE_LIGHT_WALLET_UPDATED']: (state: any, action: any) => {
    let cfg = TransmuteFramework.config;
    cfg.wallet = TransmuteFramework.Toolbox.getWalletFromMnemonic(action.payload.lightWalletMnemonic);
    TransmuteFramework.init(cfg);
    return {
      ...state,
      lightWalletMnemonic: action.payload.lightWalletMnemonic,
      lightWalletAddress: action.payload.lightWalletAddress,
    };
  },

};

export const reducer = (state: any, action: any) => {
  if (handlers[action.type]) {
    return handlers[action.type](state, action);
  }
  return {
    patientSummary: JSON.parse( <any> localStorage.getItem('patientSummary') || '{}') || {},
    defaultAddress: localStorage.getItem('defaultAddress') || null,
    selectedContract: localStorage.getItem('selectedContract') || null,
    addresses: null,
    lightWalletMnemonic: localStorage.getItem('lightWalletMnemonic') || '',
    lightWalletAddress:  localStorage.getItem('lightWalletAddress') || '',
    provider: localStorage.getItem('provider') || 'testrpc',
    ...state
  };
};
