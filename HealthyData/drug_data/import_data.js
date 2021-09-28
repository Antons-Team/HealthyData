/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line no-undef
const firestoreService = require('firestore-export-import');
// eslint-disable-next-line no-undef
const serviceAccount = require('../serviceAccount.json');
// eslint-disable-next-line no-undef
const firebaseConfig = require('./firebaseconfig.json');


// // emulator options
// const options = {
//   firestore: {
//     host: '192.168.x.x:8080',
//     ssl: false,
//   },
// };

// JSON To Firestore    

const jsonToFirestore = async () => {
  try {
    console.log('Initialzing Firebase');
    await firestoreService.initializeApp(serviceAccount, firebaseConfig.databaseURL);
    console.log('Firebase Initialized');

    await firestoreService.restore('./drug_data/drug_data_web_sider.json');
    console.log('Upload Success');
  }
  catch (error) {
    console.log(error);
  }
};

jsonToFirestore();