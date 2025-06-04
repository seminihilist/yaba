'use strict';

import { combineReducers, configureStore, createSelector, createSlice, ListenerMiddleware, Middleware, PayloadAction, Store, ThunkMiddleware, Tuple } from "@reduxjs/toolkit";
import { AppState, BudgetItem, BudgetSection, BudgetState } from "./types";
import { useAppDispatch } from "@/app/hooks";


export const makeStore = () => {
	const budgetInitialState: BudgetState = (() => {
		const fallback: BudgetState = {
			sections: {0: {
				name: "Food",
				databaseID: 0,
				color: "red",
				itemIDs: [1]
			}},
			items: {1: {
				name: "Onions",
				amount: 500,
				databaseID: 1,
				isCumulative: false,
				sectionID: 0,
				transactionIDs: []
			}},
			transactions: {},
			transactionGroups: {},
			idCounter: 2,
			availableMoney: 0
		}

		if (typeof window === "undefined") {
			console.log("Falling back because window is undefined!")
			return fallback;
		} else {
			const serializedBudget = window.localStorage.getItem("budget")

			if (serializedBudget === null) {
				return fallback
			} else {
				return JSON.parse(serializedBudget);
			}
		}
	})()

	const appInitialState: AppState = {
		openDialog: ""
	}

	/**
	 * This slice contains budget sections and their items. 
	 */
	const budgetSlice = createSlice({
		name: "budget",
		initialState: budgetInitialState,
		reducers: {
			addSection: (state, action: PayloadAction<{ name: string, color: string }>) => {
				state.sections[state.idCounter] = {
					name: action.payload.name,
					databaseID: state.idCounter,
					color: action.payload.color,
					itemIDs: []
				};

				state.idCounter++;
			},
			
			deleteSection: (state, action: PayloadAction<{ databaseID: number }>) => {
				Object.entries(state.items).forEach(([id, item]) => {
					if (item === undefined) return;

					if (item.sectionID === action.payload.databaseID) { // Then this item is part of the section being deleted
						delete state.items[parseInt(id)];
					}
				})

				delete state.sections[action.payload.databaseID];
			},

			renameSection: (state, action: PayloadAction<{ databaseID: number, newName: string }>) => {
				const section = state.sections[action.payload.databaseID]
				
				if (section !== undefined) section.name = action.payload.newName
			},

			recolorSection: (state, action: PayloadAction<{ databaseID: number, newColor: string }>) => {
				const section = state.sections[action.payload.databaseID]
				
				if (section !== undefined) section.color = action.payload.newColor
			},

			addItem: (state, action: PayloadAction<{ sectionDatabaseID: number, itemName: string, itemAmount: number }>) => {
				state.items[state.idCounter] = {
					name: action.payload.itemName,
					databaseID: state.idCounter,
					amount: action.payload.itemAmount,
					isCumulative: false, // This feature has been scrapped
					sectionID: action.payload.sectionDatabaseID,
					transactionIDs: []
				};

				const section = state.sections[action.payload.sectionDatabaseID];

				if (section !== undefined) section.itemIDs.push(state.idCounter);

				state.idCounter++;
			},

			alterItem: (state, action: PayloadAction<{ databaseID: number, newName: string, newAmount: number }>) => {
				const item = state.items[action.payload.databaseID];

				if (item !== undefined) {
					item.name = action.payload.newName;
					item.amount = action.payload.newAmount;
				}
			},

			deleteItem: (state, action: PayloadAction<{ databaseID: number }>) => {
				const item = state.items[action.payload.databaseID];

				const section = state.sections[item.sectionID];

				// Find the index in section.itemIDs of the ID of the item being deleted
				const index = section.itemIDs.find(itemID => itemID === item.databaseID)
				
				// Remove the item from the section's itemIDs array
				if (index !== undefined) section.itemIDs.splice(index)

				// Delete all transactions that were made from this item
				for (const transactionID of item.transactionIDs) {
					delete state.transactions[transactionID];
				}

				// Delete the item itself
				delete state.items[action.payload.databaseID];
			},

			addTransaction: (state, action: PayloadAction<{ itemDatabaseID: number, amount: number, dateString: string }>) => {
				const dateFromString = new Date(action.payload.dateString);

				// Sort the transaction groups by date, so that the most recent group is always at the start of the array
				const sortedTransactionGroups = Object.values(state.transactionGroups).toSorted((a, b) => {
					const dateA = new Date(a.dateString);
					const dateB = new Date(b.dateString);

					return dateB.getTime() - dateA.getTime(); // Sort in descending order
				})

				if (Object.entries(state.transactionGroups).length === 0) { // Then no transactions have ever occurred and we must make a new group
					state.transactionGroups[state.idCounter] = {
						databaseID: state.idCounter,
						dateString: action.payload.dateString,
						transactionIDs: [state.idCounter + 1],
					};

					state.transactions[state.idCounter + 1] = {
						databaseID: state.idCounter + 1,
						itemID: action.payload.itemDatabaseID,
						amount: action.payload.amount,
						dateString: action.payload.dateString,
						transactionGroupID: state.idCounter
					}

					state.items[action.payload.itemDatabaseID].transactionIDs.push(state.idCounter + 1);

					state.idCounter += 2;
				} else if ((() => { 
					const dateOfLastGroup = new Date(sortedTransactionGroups[0].dateString); // Date of the most recent transaction group

					return dateOfLastGroup.getFullYear() !== dateFromString.getFullYear()
					|| dateOfLastGroup.getMonth() !== dateFromString.getMonth()
					|| dateOfLastGroup.getDate() !== dateFromString.getDate();
				})()) { // If the most recent group's date and the given date have a different year, month, or day, then we must make a new group
					state.transactionGroups[state.idCounter] = {
						databaseID: state.idCounter,
						dateString: action.payload.dateString,
						transactionIDs: [state.idCounter + 1],
					};

					state.transactions[state.idCounter + 1] = {
						databaseID: state.idCounter + 1,
						itemID: action.payload.itemDatabaseID,
						amount: action.payload.amount,
						dateString: action.payload.dateString,
						transactionGroupID: state.idCounter
					}

					state.items[action.payload.itemDatabaseID].transactionIDs.push(state.idCounter + 1);

					state.idCounter += 2;
				} else { // If we get here, the most recent transaction group fits the new transaction's date
					state.transactionGroups[
						sortedTransactionGroups[0].databaseID // ID of most recent transaction group
					].transactionIDs.push(state.idCounter);

					state.transactions[state.idCounter] = {
						databaseID: state.idCounter,
						itemID: action.payload.itemDatabaseID,
						amount: action.payload.amount,
						dateString: action.payload.dateString,
						transactionGroupID: sortedTransactionGroups[0].databaseID
					}

					state.items[action.payload.itemDatabaseID].transactionIDs.push(state.idCounter);

					state.idCounter++;
				}
			},

			deleteTransaction: (state, action: PayloadAction<{ databaseID: number }>) => {
				const transaction = state.transactions[action.payload.databaseID];

				if (transaction === undefined) return; // No such transaction exists

				// Remove the transaction from the item it belongs to
				const item = state.items[transaction.itemID];
				const index = item.transactionIDs.indexOf(transaction.databaseID);
				if (index !== -1) {
					item.transactionIDs.splice(index, 1);
				}

				// Remove the transaction from the transaction group it belongs to
				const group = state.transactionGroups[transaction.transactionGroupID];
				const groupIndex = group.transactionIDs.indexOf(transaction.databaseID);
				if (groupIndex !== -1) {
					group.transactionIDs.splice(groupIndex, 1);
				}

				console.log(`group.transactionIDs after deletion: ${group.transactionIDs}`)
				console.log(`group.transactionIDs.length after deletion: ${group.transactionIDs.length}`)

				// If the transaction group has no transactions left, delete it
				if (group.transactionIDs.length === 0) {
					delete state.transactionGroups[transaction.transactionGroupID];
				}

				// Delete the transaction itself
				delete state.transactions[action.payload.databaseID];
			}
		}
	});

	/**
	 * This slice contains application state, such as open dialog boxes.
	 */
	const appSlice = createSlice({
		name: "app",
		initialState: appInitialState,
		reducers: {
			openDialog: (state, action: PayloadAction<{ dialog: string }>) => {
				state.openDialog = action.payload.dialog
			},

			closeDialog: (state) => {
				state.openDialog = ""
			}
		}
	});

	const combinedReducer = combineReducers({
		budget: budgetSlice.reducer, 
		app: appSlice.reducer
	});

	const store = configureStore({
		reducer: combinedReducer,
	});

	store.subscribe(() => saveToLocalStorage(store))

	return store;
}

// Infer return type of makeStore 
export type AppStore = ReturnType<typeof makeStore>

// Infer types of RootState and AppDispatch
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

/*
 * Functions to save and load data from localStorage.
 */
function loadFromLocalStorage() {
	const serializedState = localStorage.getItem("state");

	if (serializedState === null) return undefined;

	try {
		return JSON.parse(serializedState);
	} catch (e) {
		console.warn("An error occurred when loading the state from localStorage:")
		console.warn(e)
		return undefined;
	}
}

function saveToLocalStorage(store: Store) {
	try {
		console.group("Saving budget...")
		console.log(store.getState().budget)
		console.groupEnd()
		localStorage.setItem("budget", JSON.stringify(store.getState().budget))
	} catch (e: any) {
		if (e.name === "QuotaExceededError") {
			const dispatch = useAppDispatch()

			dispatch({
				"type": "app/openDialog", 
				"payload": {
					"dialog": "errorCouldNotSave"
				}
			});
		}
	}
}