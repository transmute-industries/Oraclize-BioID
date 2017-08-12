



const getSearchObject = (searchFromLocation: string) => {
  var search = location.search.substring(1);
  return search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
    (key, value) => { return key === "" ? value : decodeURIComponent(value) }) : {}
}


const handlers = {
  ['@@router/LOCATION_CHANGE']: (state: any, action: any) => {
    let searchObject = getSearchObject(action.payload.search)
    let containsAction = ['enrollment', 'verification', 'identification'].indexOf(searchObject.Action) !== -1;
    if (containsAction && searchObject.Success == 'true') {
      return {
        ...state,
        bcid: searchObject.BCID
      };
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