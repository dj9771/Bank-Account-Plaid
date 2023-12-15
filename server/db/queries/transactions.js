/**
 * @file Defines the queries for the transactions.
 */

const { admin, db } = require('../firebaseAdmin');

/**
 * Creates or updates multiple transactions.
 *
 * @param {Object[]} transactions an array of transactions.
 */

const createOrUpdateTransactions = async (transactions) => {
  try {
    const batch = db.batch();

    for (const transaction of transactions) {
      const {
        account_id: plaidAccountId,
        transaction_id: plaidTransactionId,
        category_id: plaidCategoryId,
        category: categories,
        transaction_type: transactionType,
        name: transactionName,
        amount,
        iso_currency_code: isoCurrencyCode,
        unofficial_currency_code: unofficialCurrencyCode,
        date: transactionDate,
        pending,
        account_owner: accountOwner,
      } = transaction;

      const { id: accountId } = await retrieveAccountByPlaidAccountId(
        plaidAccountId
      );

      const [category, subcategory] = categories;

      const transactionRef = db.collection('transactions').doc(plaidTransactionId);

      batch.set(transactionRef, {
        account_id: accountId,
        plaid_transaction_id: plaidTransactionId,
        plaid_category_id: plaidCategoryId,
        category,
        subcategory,
        type: transactionType,
        name: transactionName,
        amount,
        iso_currency_code: isoCurrencyCode,
        unofficial_currency_code: unofficialCurrencyCode,
        date: transactionDate,
        pending,
        account_owner: accountOwner,
      }, { merge: true });
    }

    await batch.commit();
  } catch (error) {
    console.error(error);
    throw new Error('Error creating or updating transactions.');
  }
};

/**
 * Retrieves all transactions for a single account.
 *
 * @param {number} accountId the ID of the account.
 * @returns {Object[]} an array of transactions.
 */

const retrieveTransactionsByAccountId = async (accountId) => {
  try {
    const transactionRef = db.collection('transactions');
    const querySnapshot = await transactionRef.where('account_id', '==', accountId).orderBy('date', 'desc').get();

    const transactions = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });

    return transactions;
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving transactions by account ID.');
  }
};

/**
 * Retrieves all transactions for a single item.
 *
 *
 * @param {number} itemId the ID of the item.
 * @returns {Object[]} an array of transactions.
 */

const retrieveTransactionsByItemId = async (itemId) => {
  try {
    const transactionRef = db.collection('transactions');
    const querySnapshot = await transactionRef.where('item_id', '==', itemId).orderBy('date', 'desc').get();

    const transactions = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });

    return transactions;
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving transactions by item ID.');
  }
};

/**
 * Retrieves all transactions for a single user.
 *
 *
 * @param {number} userId the ID of the user.
 * @returns {Object[]} an array of transactions.
 */

const retrieveTransactionsByUserId = async (userId) => {
  try {
    const transactionRef = db.collection('transactions');
    const querySnapshot = await transactionRef.where('user_id', '==', userId).orderBy('date', 'desc').get();

    const transactions = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });

    return transactions;
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving transactions by user ID.');
  }
};


/**
 * Removes one or more transactions.
 *
 * @param {string[]} plaidTransactionIds the Plaid IDs of the transactions.
 */

const deleteTransactions = async (plaidTransactionIds) => {
  const batch = db.batch();

  plaidTransactionIds.forEach((transactionId) => {
    const transactionDocRef = db.collection('transactions').doc(transactionId);
    batch.delete(transactionDocRef);
  });

  await batch.commit();
};


module.exports = {
  createOrUpdateTransactions,
  retrieveTransactionsByAccountId,
  retrieveTransactionsByItemId,
  retrieveTransactionsByUserId,
  deleteTransactions,
};
