'use strict';

import { configureStore, createSlice, isPlain, PayloadAction, Store } from "@reduxjs/toolkit";
import { AppState } from "./types";
import {Color} from "@/lib/color_utils";
import { isImmutable, Map } from "immutable";

/**
 * The key in `localStorage` where state is persisted.
 */
const LOCAL_STORAGE_KEY = "state";

export const makeStore = () => {
    const initialState: AppState = loadFromLocalStorage(() => {
        return {
            budgets: {
                0: {
                    id: 0,
                    incomeItems: [3],
                    sections: [1],
                    transaction_groups: []
                }
            },
            sections: {
                1: {
                    id: 1,
                    budgetID: 0,
                    name: "Food",
                    color: "red",
                    itemIDs: [2]
                }
            },
            items: {
                2: {
                    name: "Onions",
                    amount: 500,
                    id: 2,
                    isCumulative: false,
                    sectionID: 1,
                    transactionIDs: []
                }
            },
            transactions: {},
            incomeItems: {
                3: {
                    id: 3,
                    budgetID: 0,
                    name: "Salary",
                    amount: 3000
                }
            },
            idCounter: 4
        }
    });

	/**
	 * This slice contains budget sections and their items. 
	 */
	const appSlice = createSlice({
		name: "app",
		initialState: initialState,
		reducers: {
            addBudget: (state, action: PayloadAction<{}>) => {
                state.budgets[state.idCounter] = {
                    id: state.idCounter,
                    incomeItems: [],
                    sections: [],
                };

                // Increment the ID counter for the next thing
                state.idCounter++;
            },

            deleteBudget: (
                state,
                action: PayloadAction<{
                    /**
                     * The ID of the Budget to delete.
                     */
                    id: number
                }>
            ) => {
                const budget = state.budgets[action.payload.id];
                if (typeof budget === "undefined") return;

                // Delete the sections this Budget contains
                budget.sections.forEach((id) => {
                    appSlice.caseReducers.deleteSection(state, {
                        payload: {
                            id: id
                        },
                        type: "deleteSection"
                    });
                });

                // Delete the budget
                delete state.budgets[action.payload.id];
            },

			addSection: (state, action: PayloadAction<{ budgetID: number, name: string, color: Color }>) => {
				const budget = state.budgets[action.payload.budgetID];
                if (typeof budget === "undefined") return;

                // Create the section
                state.sections[state.idCounter] = {
                    id: state.idCounter,
                    budgetID: action.payload.budgetID,
					name: action.payload.name,
					color: action.payload.color,
					itemIDs: []
				};

                // Add it to the budget by ID
                budget.sections.push(state.idCounter);

                // Increment the ID counter for the next thing
				state.idCounter++;
			},
			
			deleteSection: (
                state,
                action: PayloadAction<{
                    /**
                     * The database ID of the section to delete.
                     */
                    id: number
                }>
            ) => {
				const section = state.sections[action.payload.id];
                if (typeof section === "undefined") return;

                // Delete the items
                section.itemIDs.forEach((id) => {
                    appSlice.caseReducers.deleteItem(state, {
                        payload: {
                            id: id
                        },
                        type: "deleteItem"
                    })
				})

                // Delete the section from the budget that contains it
                const budget = state.budgets[section.budgetID];
                if (typeof budget !== "undefined") {
                    budget.sections.splice(budget.sections.indexOf(action.payload.id), 1);
                }

                // Delete the actual section
                delete state.sections[action.payload.id];
			},

			renameSection: (state, action: PayloadAction<{ id: number, newName: string }>) => {
				const section = state.sections[action.payload.id];
                if (typeof section === "undefined") return;
				
				section.name = action.payload.newName
			},

			recolorSection: (state, action: PayloadAction<{ id: number, newColor: Color }>) => {
				const section = state.sections[action.payload.id];
                if (typeof section === "undefined") return;
				
				section.color = action.payload.newColor
			},

			addItem: (state, action: PayloadAction<{ sectionID: number, itemName: string, itemAmount: number }>) => {
                console.log("CREATING AN ITEM!!!!!!!!!"); // FIXME

                console.log(`!!!!!!!!!! ${action.payload.sectionID}`); // FIXME
                const section = state.sections[action.payload.sectionID];
                if (typeof section === "undefined") return;

                console.log(`SECTION WAS DEFINED!!!!!!!!!! ${action.payload.sectionID}`); // FIXME

                // Create the item
                state.items[state.idCounter] = {
                    id: state.idCounter,
					name: action.payload.itemName,
					amount: action.payload.itemAmount,
					isCumulative: false, // This feature has been scrapped
					sectionID: action.payload.sectionID,
					transactionIDs: []
				};

                // Add the item to the section by ID
				section.itemIDs.push(state.idCounter);

				state.idCounter++;
			},

			alterItem: (state, action: PayloadAction<{
                /**
                 * The ID of the item to alter.
                 */
                id: number,

                /**
                 * The new name of the item.
                 */
                newName: string,

                /**
                 * The new amount of the item.
                 */
                newAmount: number
            }>) => {
				const item = state.items[action.payload.id];
                if (typeof item === "undefined") return;

                item.name = action.payload.newName;
                item.amount = action.payload.newAmount;
			},

			deleteItem: (
                state, action: PayloadAction<{
                    /**
                     * The database ID of the Item to delete.
                     */
                    id: number
                }>
            ) => {
                const item = state.items[action.payload.id];
                if (typeof item === "undefined") return;

				const section = state.sections[item.sectionID];
                if (typeof section === "undefined") return;

				// Remove the item from its section
                // This is maybe really slow, maybe change this TODO
				section.itemIDs = section.itemIDs.filter((id) => id !== item.id);

				// Delete all transactions that were made from this item
				for (const transactionID of item.transactionIDs) {
					appSlice.caseReducers.deleteTransaction(state, {
                        payload: {
                            id: transactionID,
                        },
                        type: "deleteTransaction"
                    })
				}

				// Delete the item itself
                delete state.items[action.payload.id];
			},

			addTransaction: (state, action: PayloadAction<{ itemID: number, amount: number, dateString: string }>) => {
                const item = state.items[action.payload.itemID];
                // If the item doesn't exist, do nothing
                if (!item) {
                    console.error(
                        `Attempted to create a transaction under non-existent item id=${action.payload.itemID}.`
                    );
                    return;
                }

                // Create the transaction
                state.transactions[state.idCounter] = {
                    id: state.idCounter,
                    itemID: action.payload.itemID,
                    amount: action.payload.amount,
                    dateString: action.payload.dateString,
                };

                // Add it to the item
                item.transactionIDs.push(state.idCounter);

                state.idCounter++;
			},

			deleteTransaction: (state, action: PayloadAction<{ id: number }>) => {
				const transaction = state.transactions[action.payload.id];
				if (!transaction) {
                    console.error(`Attempted to delete non-existent transaction id=${action.payload.id}.`);
                    return;
                } // No such transaction exists

				// Remove the transaction from the item it belongs to
				const item = state.items[transaction.itemID];

				if (item) {
                    const index = item.transactionIDs.indexOf(transaction.id);
                    if (index !== -1) {
                        item.transactionIDs.splice(index, 1);
                    }
                }

				// Delete the transaction itself
				delete state.transactions[action.payload.id];
			},

			addIncomeItem: (state, action: PayloadAction<{ budgetID: number, name: string, amount: number }>) => {
				state.incomeItems[state.idCounter] = {
                    id: state.idCounter,
                    budgetID: action.payload.budgetID,
					name: action.payload.name,
					amount: action.payload.amount
				};

				state.idCounter++;
			},

			alterIncomeItem: (state, action: PayloadAction<{ id: number, name: string, amount: number }>) => {
				const incomeItem = state.incomeItems[action.payload.id];
                if (!incomeItem) {
                    console.error(`Attempted to alter non-existent income item id=${action.payload.id}.`);
                    return;
                }

                incomeItem.name = action.payload.name;
				incomeItem.amount = action.payload.amount;
			},

			deleteIncomeItem: (state, action: PayloadAction<{ id: number }>) => {
                const incomeItem = state.incomeItems[action.payload.id];
                if (!incomeItem) {
                    console.error(`Attempted to delete non-existent income item id=${action.payload.id}.`);
                    return;
                }

                // Delete the income item from its budget
                const budget = state.budgets[incomeItem.budgetID];
                if (budget) {
                    budget.incomeItems.splice(budget.incomeItems.indexOf(action.payload.id), 1);
                }

                // Delete the income item
                delete state.incomeItems[action.payload.id];
			}
		}
	});

	const store = configureStore({
		reducer: appSlice.reducer,
        middleware: getDefaultMiddleware => {
            return getDefaultMiddleware().concat([(store: any) => (next: any) => (action: any) => {
                console.log('dispatching', action);
                let result = next(action);
                console.log('next state', store.getState());
                return result;
            }]) // FIXME
        }
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

function loadFromLocalStorage(fallback: () => any) {
    // If we don't have access to localStorage, return the fallback data immediately.
    if (typeof localStorage === "undefined") {
        return fallback();
    }

	const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);

	if (serializedState === null || serializedState === "undefined") return fallback();

	try {
		return JSON.parse(serializedState);
	} catch (e) {
		console.group("An error occurred when loading the state from localStorage:")
		console.warn(e)
        console.groupEnd();
		return undefined;
	}
}

function saveToLocalStorage(store: AppStore) {
	try {
		console.group("Saving state...")
		console.log(store.getState())
		console.groupEnd()
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store.getState()))
	} catch (e: any) {
		if (e.name === "QuotaExceededError") {
			alert("YABA has run out of storage!\n\nAny changes you make will not be saved until storage space" +
                "is reclaimed.\n\nYou can reclaim storage space by deleting old budgets.")
		} else {
            alert("An error has occurred when saving your data.\n\nYour changes are likely not being saved.")
        }
	}
}