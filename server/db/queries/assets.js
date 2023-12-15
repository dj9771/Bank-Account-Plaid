/**
 * @file Defines the queries for the assets.
 */

const { admin, db } = require('../firebaseAdmin');

/**
 * Creates a single property.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object} the new property.
 */

const createAsset = async (userId, description, value) => {
  try {
    const assetsCollection = db.collection('assets');
    const newAssetRef = await assetsCollection.add({
      user_id: userId,
      description: description,
      value: value,
    });

    const newAssetSnapshot = await newAssetRef.get();
    return newAssetSnapshot.data();
  } catch (error) {
    console.error(error);
    throw new Error('Error creating asset.');
  }
};

/**
 * Retrieves all assets for a single user.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object[]} an array of assets.
 */

const retrieveAssetsByUser = async userId => {
  try {
    const assetsCollection = db.collection('assets');
    const querySnapshot = await assetsCollection.where('user_id', '==', userId).get();

    const assets = [];
    querySnapshot.forEach(doc => {
      assets.push(doc.data());
    });

    return assets;
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving assets.');
  }
};

/**
 * Removes asset by asset id.
 *to
 *
 * @param {number} id the desired asset be deleted.
 */

const deleteAssetByAssetId = async assetId => {
  try {
    const assetDocRef = db.collection('assets').doc(assetId);
    await assetDocRef.delete();
  } catch (error) {
    console.error(error);
    throw new Error('Error deleting asset.');
  }
};

module.exports = {
  createAsset,
  retrieveAssetsByUser,
  deleteAssetByAssetId,
};
