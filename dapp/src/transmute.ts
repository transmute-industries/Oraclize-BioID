import TransmuteFramework from 'transmute-framework';

let config: any = {
    // env: 'metamask',
    env: 'testrpc',
    // ipfsConfig: {
    //     host: 'ipfs.infura.io',
    //     port: '5001',
    //     options: {
    //         protocol: 'https'
    //     }
    // },
    aca: require('./contracts/RBAC'),
    esa: require('./contracts/UnsafeEventStore'),
    esfa: require('./contracts/UnsafeEventStoreFactory')
};


firebase.initializeApp({
    apiKey: "AIzaSyDIXrTv0TD9zdaCy5n_QXm6_VMaS-1B3sQ",
    authDomain: "transmute-industries.firebaseapp.com",
    databaseURL: "https://transmute-industries.firebaseio.com",
    projectId: "transmute-industries",
    storageBucket: "transmute-industries.appspot.com",
    messagingSenderId: "1068223304219"
});

firebase.auth()
    .onAuthStateChanged((user: any) => {
        console.log('user: ', user)
    })

export default TransmuteFramework.init(config);
