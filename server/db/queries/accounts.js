/**
 * @file Defines the queries for the accounts.
 */

const { admin, db } = require('../firebaseAdmin');


/**
 * Creates multiple accounts related to a single item.
 *
 * @param {string} plaidItemId the Plaid ID of the item.
 * @param {Object[]} accounts an array of accounts.
 * @returns {Object[]} an array of new accounts.
 */

const createAccounts = async (plaidItemId, accounts) => {
  try {
    const itemDoc = await db.collection('items').doc(plaidItemId).get();
    if (!itemDoc.exists) {
      throw new Error('Item with the specified ID does not exist.');
    }
    const itemId = itemDoc.id;

    const batch = db.batch();
    const createdAccounts = [];

    for (const account of accounts) {
      const {
        account_id: aid,
        name,
        mask,
        official_name: officialName,
        balances: {
          available: availableBalance,
          current: currentBalance,
          iso_currency_code: isoCurrencyCode,
          unofficial_currency_code: unofficialCurrencyCode,
        },
        subtype,
        type,
      } = account;

      const accountRef = db.collection('accounts').doc();

      batch.set(accountRef, {
        item_id: itemId,
        plaid_account_id: aid,
        name,
        mask,
        official_name: officialName,
        current_balance: currentBalance,
        available_balance: availableBalance,
        iso_currency_code: isoCurrencyCode,
        unofficial_currency_code: unofficialCurrencyCode,
        type,
        subtype,
      });

      createdAccounts.push({ id: accountRef.id, ...account });
    }

    await batch.commit();
    return createdAccounts;
  } catch (error) {
    console.error(error);
    throw new Error('Error creating accounts.');
  }
};

/**
 * Retrieves the account associated with a Plaid account ID.
 *
 * @param {string} plaidAccountId the Plaid ID of the account.
 * @returns {Object} a single account.
 */

const retrieveAccountByPlaidAccountId = async (plaidAccountId) => {
  try {
    const querySnapshot = await db.collection('accounts').where('plaid_account_id', '==', plaidAccountId).get();
    if (querySnapshot.empty) return null;

    const account = querySnapshot.docs[0].data();
    return { id: querySnapshot.docs[0].id, ...account };
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving account.');
  }
};

/**
 * Retrieves the accounts for a single item.
 *
 * @param {number} itemId the ID of the item.
 * @returns {Object[]} an array of accounts.
 */

const retrieveAccountsByItemId = async (itemId) => {
  try {
    const querySnapshot = await db.collection('accounts').where('item_id', '==', itemId).orderBy('id').get();

    const accounts = [];
    querySnapshot.forEach((doc) => {
      const account = doc.data();
      accounts.push({ id: doc.id, ...account });
    });

    return accounts;
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving accounts by item ID.');
  }
};

/**
 * Retrieves all accounts for a single user.
 *
 * @param {number} userId the ID of the user.
 *
 * @returns {Object[]} an array of accounts.
 */

const retrieveAccountsByUserId = async (userId) => {
  try {
    const querySnapshot = await db.collection('accounts').where('user_id', '==', userId).orderBy('id').get();

    const accounts = [];
    querySnapshot.forEach((doc) => {
      const account = doc.data();
      accounts.push({ id: doc.id, ...account });
    });

    return accounts;
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving accounts by user ID.');
  }
};

module.exports = {
  createAccounts,
  retrieveAccountByPlaidAccountId,
  retrieveAccountsByItemId,
  retrieveAccountsByUserId,
};
