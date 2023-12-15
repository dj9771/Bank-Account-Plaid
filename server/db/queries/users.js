/**
 * @file Defines the queries for the users.
 */

const { admin, db } = require('../firebaseAdmin');

/**
 * Creates a single user.
 *
 * @param {string} username the username of the user.
 * @returns {Object} the new user.
 */

const createUser = async username => {
  try {
    const userRef = await db.collection('users').add({ username });
    const userDoc = await userRef.get();
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};


/**
 * Removes users and related items, accounts and transactions.
 *
 *
 * @param {string[]} userId the desired user to be deleted.
 */

const deleteUsers = async userId => {
  try {
    await db.collection('users').doc(userId).delete();
    // You may implement additional logic here to delete related items, accounts, or transactions.
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Retrieves a single user.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object} a user.
 */

const retrieveUserById = async userId => {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      return null; // User not found
    }
  } catch (error) {
    console.error('Error retrieving user by ID:', error);
    throw error;
  }
};

/**
 * Retrieves a single user.
 *
 * @param {string} username the username to search for.
 * @returns {Object} a single user.
 */

const retrieveUserByUsername = async username => {
  try {
    const querySnapshot = await db.collection('users').where('username', '==', username).get();
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      return null; // User not found
    }
  } catch (error) {
    console.error('Error retrieving user by username:', error);
    throw error;
  }
};


/**
 * Retrieves all users.
 *
 * @returns {Object[]} an array of users.
 */

const retrieveUsers = async () => {
  try {
    const querySnapshot = await db.collection('users').get();
    const users = [];
    querySnapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error('Error retrieving users:', error);
    throw error;
  }
};

module.exports = {
  createUser,
  deleteUsers,
  retrieveUserById,
  retrieveUserByUsername,
  retrieveUsers,
};
