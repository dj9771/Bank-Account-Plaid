/**
 * @file Defines a connection to the Firestore database, using environment
 * variables for connection information.
 */

const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://shining-relic-408022-default-rtdb.firebaseio.com/' // Replace with your Firestore database URL
});

const db = admin.firestore();

module.exports = { admin, db };
