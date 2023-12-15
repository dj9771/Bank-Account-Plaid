/**
 * @file Defines the queries for the items.
 */
const { admin, db } = require('../firebaseAdmin');


/**
 * Creates a single item.
 *
 * @param {string} plaidInstitutionId the Plaid institution ID of the item.
 * @param {string} plaidAccessToken the Plaid access token of the item.
 * @param {string} plaidItemId the Plaid ID of the item.
 * @param {number} userId the ID of the user.
 * @returns {Object} the new item.
 */

const createItem = async (
  plaidInstitutionId,
  plaidAccessToken,
  plaidItemId,
  userId
) => {
  const itemsCollection = db.collection('items');

  const newItem = {
    user_id: userId,
    plaid_access_token: plaidAccessToken,
    plaid_item_id: plaidItemId,
    plaid_institution_id: plaidInstitutionId,
    status: 'good', // Set default status
  };

  const newItemRef = await itemsCollection.add(newItem);
  const newItemDoc = await newItemRef.get();
  
  return newItemDoc.data(); // Return the newly created item data
};

/**
 * Retrieves a single item.
 *
 * @param {number} itemId the ID of the item.
 * @returns {Object} an item.
 */

const retrieveItemById = async (itemId) => {
  const itemDoc = await db.collection('items').doc(itemId).get();
  
  if (itemDoc.exists) {
    return itemDoc.data(); // Return the item data
  } else {
    return null; // Item doesn't exist
  }
};

/**
 * Retrieves a single item.
 *
 * @param {string} accessToken the Plaid access token of the item.
 * @returns {Object} the item.
 */

const retrieveItemByPlaidAccessToken = async (accessToken) => {
  const querySnapshot = await db.collection('items')
    .where('plaid_access_token', '==', accessToken)
    .get();
  
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data(); // Return the item data
  } else {
    return null; // Item doesn't exist
  }
};

/**
 * Retrieves a single item.
 *
 * @param {string} plaidInstitutionId the Plaid institution ID of the item.
 * @param {number} userId the ID of the user.
 * @returns {Object} an item.
 */

const retrieveItemByPlaidInstitutionId = async (plaidInstitutionId, userId) => {
  const querySnapshot = await db.collection('items')
    .where('plaid_institution_id', '==', plaidInstitutionId)
    .where('user_id', '==', userId)
    .get();
  
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data(); // Return the item data
  } else {
    return null; // Item doesn't exist
  }
};


/**
 * Retrieves a single item.
 *
 * @param {string} plaidItemId the Plaid ID of the item.
 * @returns {Object} an item.
 */

const retrieveItemByPlaidItemId = async (plaidItemId) => {
  const itemsCollection = db.collection('items');
  
  // Query items collection where 'plaid_item_id' field matches the provided 'plaidItemId'
  const querySnapshot = await itemsCollection.where('plaid_item_id', '==', plaidItemId).get();
  
  if (!querySnapshot.empty) {
    // Retrieve the first document (as Plaid item IDs are assumed to be unique)
    const itemData = querySnapshot.docs[0].data();
    return itemData;
  } else {
    return null; // Item doesn't exist
  }
};


/**
 * Retrieves all items for a single user.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object[]} an array of items.
 */

const retrieveItemsByUser = async (userId) => {
  const querySnapshot = await db.collection('items')
    .where('user_id', '==', userId)
    .get();
  
  const items = [];
  querySnapshot.forEach((doc) => {
    items.push(doc.data()); // Add item data to the array
  });

  return items;
};


/**
 * Updates the status for a single item.
 *
 * @param {string} itemId the Plaid item ID of the item.
 * @param {string} status the status of the item.
 */

const updateItemStatus = async (itemId, status) => {
  await db.collection('items').doc(itemId).update({
    status: status // Update the status field
  });
};


/**
 * Updates the transaction cursor for a single item.
 *
 * @param {string} itemId the Plaid item ID of the item.
 * @param {string} transactionsCursor latest observed transactions cursor on this item.
 */

const updateItemTransactionsCursor = async (itemId, transactionsCursor) => {
  await db.collection('items').doc(itemId).update({
    transactions_cursor: transactionsCursor // Update the transactions_cursor field
  });
};

/**
 * Removes a single item. The database will also remove related accounts and transactions.
 *
 * @param {string} itemId the id of the item.
 */

const deleteItem = async (itemId) => {
  await db.collection('items').doc(itemId).delete();
};


module.exports = {
  createItem,
  deleteItem,
  retrieveItemById,
  retrieveItemByPlaidAccessToken,
  retrieveItemByPlaidInstitutionId,
  retrieveItemByPlaidItemId,
  retrieveItemsByUser,
  updateItemStatus,
  updateItemTransactionsCursor,
};
