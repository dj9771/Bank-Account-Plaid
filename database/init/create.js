//Collections on Firestore database
const { admin, db } = require('../../server/db/firebaseAdmin');

const usersCollection = db.collection('users');
const itemsCollection = db.collection('items');
const assetsCollection = db.collection('assets');
const accountsCollection = db.collection('accounts');
const transactionsCollection = db.collection('transactions');
const linkEventsCollection = db.collection('link_events');
const plaidApiEventsCollection = db.collection('plaid_api_events');


/*USERS
-- This is used to store the users of our application. The view returns the same data
-- we're just creating it to follow the pattern used in other collections.*/
  
async function createUser() {
  const newUser = {
    username: 'example_user',
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    updated_at: admin.firestore.FieldValue.serverTimestamp()
  };

  // Add the new user document to the 'users' collection
  const userRef = await usersCollection.add(newUser);

  // Retrieve user document by ID
  const userId = userRef.id;
  const userDoc = await usersCollection.doc(userId).get();
  if (userDoc.exists) {
    // Update other fields as needed
    await usersCollection.doc(userId).update({
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });
  }
}

async function getUsersView() {
  const snapshot = await usersCollection.get();
  const users = [];
  snapshot.forEach(doc => {
    users.push({
      id: doc.id,
      username: doc.data().username,
      created_at: doc.data().created_at,
      updated_at: doc.data().updated_at
    });
  });
  return users;
}



/*ITEMS
-- This is used to store the items associated with each user. The view returns the same data
-- we're just using both to maintain consistency. For more info
-- on the Plaid Item schema, see the docs page: https://plaid.com/docs/#item-schema*/

async function createItem(userId, plaidAccessToken, plaidItemId, plaidInstitutionId, status, transactionsCursor) {
  const newItem = {
    user_id: userId,
    plaid_access_token: plaidAccessToken,
    plaid_item_id: plaidItemId,
    plaid_institution_id: plaidInstitutionId,
    status: status,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
    transactions_cursor: transactionsCursor
  };

  // Add a new document to the 'items' collection
  const newItemRef = await itemsCollection.add(newItem);
  return newItemRef.id; // Return the ID of the newly created item
}

async function updateItem(itemId, updatedData) {
  // Update the 'updated_at' timestamp
  updatedData.updated_at = admin.firestore.FieldValue.serverTimestamp();

  // Update the item document
  await itemsCollection.doc(itemId).update(updatedData);
}

async function getItemsView() {
  const snapshot = await itemsCollection.get();
  const items = [];
  snapshot.forEach(doc => {
    items.push({
      id: doc.id,
      plaid_item_id: doc.data().plaid_item_id,
      user_id: doc.data().user_id,
      plaid_access_token: doc.data().plaid_access_token,
      plaid_institution_id: doc.data().plaid_institution_id,
      status: doc.data().status,
      created_at: doc.data().created_at,
      updated_at: doc.data().updated_at,
      transactions_cursor: doc.data().transactions_cursor
    });
  });
  return items;
}


/*ASSETS
-- -- This is used to store the assets associated with each user. The view returns the same data
-- -- we're just using both to maintain consistency.*/

async function addAsset(userId, value, description) {
  const newAsset = {
    user_id: userId,
    value: value,
    description: description,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    updated_at: admin.firestore.FieldValue.serverTimestamp()
  };

  // Add a new document to the 'assets' collection
  const newAssetRef = await assetsCollection.add(newAsset);
  return newAssetRef.id; // Return the ID of the newly created asset
}

async function updateAsset(assetId, updatedData) {
  // Update the 'updated_at' timestamp
  updatedData.updated_at = admin.firestore.FieldValue.serverTimestamp();

  // Update the asset document
  await assetsCollection.doc(assetId).update(updatedData);
}

async function getAssetsView() {
  const snapshot = await assetsCollection.get();
  const assets = [];
  snapshot.forEach(doc => {
    assets.push({
      id: doc.id,
      user_id: doc.data().user_id,
      value: doc.data().value,
      description: doc.data().description,
      created_at: doc.data().created_at,
      updated_at: doc.data().updated_at
    });
  });
  return assets;
}


/*ACCOUNTS
-- This is used to store the accounts associated with each item. The view returns all the
-- data from the accounts collection and some data from the items view. For more info on the Plaid
-- Accounts schema, see the docs page:  https://plaid.com/docs/#account-schema*/

async function addAccount(accountData) {
  const newAccountRef = await accountsCollection.add(accountData);
  return newAccountRef.id; // Return the ID of the newly created account
}

async function getAccountsView() {
  const snapshot = await accountsCollection.get();
  const accounts = [];
  snapshot.forEach(doc => {
    accounts.push({
      id: doc.id,
      ...doc.data()
    });
  });
  return accounts;
}


/*TRANSACTIONS
-- This is used to store the transactions associated with each account. The view returns all
-- the data from the transactions collection and some data from the accounts view. For more info on the
-- Plaid Transactions schema, see the docs page: https://plaid.com/docs/#transaction-schema*/

async function addTransaction(transactionData) {
  const newTransactionRef = await transactionsCollection.add(transactionData);
  return newTransactionRef.id; // Return the ID of the newly created transaction
}

async function getTransactionsView() {
  const snapshot = await transactionsCollection.get();
  const transactions = [];
  snapshot.forEach(doc => {
    transactions.push({
      id: doc.id,
      ...doc.data()
    });
  });
  return transactions;
}


/*The link_events_table is used to log responses from the Plaid API for client requests to the
-- Plaid Link client. This information is useful for troubleshooting.*/

async function addLinkEvent(linkEventData) {
  const newLinkEventRef = await linkEventsCollection.add(linkEventData);
  return newLinkEventRef.id;
}

async function addPlaidApiEvent(plaidApiEventData) {
  const newPlaidApiEventRef = await plaidApiEventsCollection.add(plaidApiEventData);
  return newPlaidApiEventRef.id;
}

module.exports = {
  createUser,
  getUsersView,
  createItem, 
  updateItem, 
  getItemsView,
  addAsset,
  updateAsset,
  getAssetsView,
  addAccount,
  getAccountsView,
  addTransaction,
  getTransactionsView,
  addLinkEvent,
  addPlaidApiEvent
};
