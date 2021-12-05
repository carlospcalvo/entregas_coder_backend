const logger = require("tracer").colorConsole();
const {
	getDocs,
	addDoc,
	getDoc,
	deleteDoc,
	updateDoc,
	query,
	orderBy,
	limit,
	where,
} = require("firebase/firestore/lite");

module.exports = class FirebaseDataHandler {
	/**
	 * Initializes connection with firebase
	 * @param {any} firebaseCollection
	 */
	constructor(firebaseCollection) {
		this.collection = firebaseCollection;
	}

	/**
	 * Saves an object in database.
	 * @param {Object} newData Object to be saved.
	 * @returns {Number} New object id
	 */
	async save(newData = {}) {
		try {
			let querySnapshot = await getDocs(
				query(this.collection, orderBy("id", "desc"), limit(1))
			);
			let lastId;
			querySnapshot.forEach((doc) => {
				lastId = parseInt(doc.data().id);
			});
			let id = lastId !== undefined ? parseInt(lastId) + 1 : 1;

			await addDoc(this.collection, { ...newData, id });
			return id;
		} catch (error) {
			logger.error(error.message);
			throw new Error(error.message);
		}
	}

	/**
	 * Get an element from database by its id
	 * @param {Number} queryId Element's id
	 * @returns {Object} Element
	 */
	async getById(queryId) {
		try {
			let querySnapshot = await getDocs(
				query(this.collection, where("id", "==", parseInt(queryId)))
			);
			let result;
			querySnapshot.forEach((doc) => (result = doc.data()));
			return result;
		} catch (error) {
			logger.error(error.message);
			throw new Error(error.message);
		}
	}

	/**
	 * Get all elements from database
	 * @returns {Array} Array of elements
	 */
	async getAll() {
		try {
			const snapshot = await getDocs(this.collection);
			const docs = snapshot.docs.map((doc) => doc.data());
			return docs;
		} catch (error) {
			logger.error(error.message);
			throw new Error(error.message);
		}
	}

	/**
	 * Deletes an element from the database by id
	 * @param {Number} queryId Id of the element to be deleted
	 */
	async deleteById(queryId) {
		try {
			let querySnapshot = await getDocs(
				query(this.collection, where("id", "==", parseInt(queryId)))
			);
			let itemRef;
			querySnapshot.forEach((doc) => (itemRef = doc.ref));

			await deleteDoc(itemRef);
		} catch (error) {
			logger.error(error.message);
			throw new Error(error.message);
		}
	}

	/**
	 * Modifies an item by replacing it (PUT)
	 * @param {Object} item Item to be modified
	 */
	async modifyItem(item) {
		try {
			let querySnapshot = await getDocs(
				query(this.collection, where("id", "==", parseInt(item.id)))
			);
			let itemRef;
			querySnapshot.forEach((doc) => (itemRef = doc.ref));
			await updateDoc(itemRef, item);
		} catch (error) {
			logger.error(error.message);
			throw new Error(error.message);
		}
	}

	/**
	 * Deletes all elements in the file
	 */
	async deleteAll() {
		try {
			const snapshot = await getDocs(this.collection);
			const refs = snapshot.docs.map((doc) => doc.ref);

			refs.forEach((ref) => deleteDoc(ref));
		} catch (error) {
			logger.error(error.message);
			throw new Error(error.message);
		}
	}
};
