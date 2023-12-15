/**
 * @file Defines the queries for the plaid_api_events.
 */


const { admin, db } = require('../firebaseAdmin');

/**
 * Creates a single Plaid api event log entry.
 *
 * @param {string} itemId the item id in the request.
 * @param {string} userId the user id in the request.
 * @param {string} plaidMethod the Plaid client method called.
 * @param {Array} clientMethodArgs the arguments passed to the Plaid client method.
 * @param {Object} response the Plaid api response object.
 */

const createPlaidApiEvent = async (
  itemId,
  userId,
  plaidMethod,
  clientMethodArgs,
  response
) => {
  const {
    error_code: errorCode,
    error_type: errorType,
    request_id: requestId,
  } = response;

  const plaidApiEventsCollection = db.collection('plaid_api_events');
  
  // Create a new document in the 'plaid_api_events' collection
  await plaidApiEventsCollection.add({
    item_id: itemId,
    user_id: userId,
    plaid_method: plaidMethod,
    arguments: JSON.stringify(clientMethodArgs),
    request_id: requestId,
    error_type: errorType,
    error_code: errorCode,
  });
};

module.exports = {
  createPlaidApiEvent,
};
