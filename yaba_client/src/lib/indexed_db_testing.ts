var db;

const dbRequest = window.indexedDB.open("yaba", 2)

dbRequest.onerror = (evt) => {
	console.error("Opening the database failed. The application will not work.")

	// TODO: Tell the user that they need to give permission.
}

dbRequest.onupgradeneeded = (evt) => {
	if (evt.target === null) return;

	const db = (evt.target as IDBOpenDBRequest).result

	// Object store for budget sections
	const sectionStore = db.createObjectStore("sections", { keyPath: "id" });

	// Object store for budget items
	const itemStore = db.createObjectStore("items", { keyPath: "id" });

	// Index to search budget items by section
	itemStore.createIndex("items_by_sectionId", "sectionId", { unique: false });

	// Use transaction oncomplete to make sure the objectStore creation is
	// finished before adding data into it.
	sectionStore.transaction.oncomplete = (evt) => {
		// Store values in the newly created objectStore.
		const sectionStore = db.transaction("sections", "readwrite").objectStore("customers");

		sectionStore.add({
			
		})

		customerData.forEach((customer) => {
		customerObjectStore.add(customer);
		});
	};
};

dbRequest.onsuccess = (evt) => {
	// Save the database for later

	db = dbRequest.result;
}

