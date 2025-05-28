'use strict';

import { combineReducers, configureStore, createSlice, ListenerMiddleware, Middleware, PayloadAction, Store, ThunkMiddleware, Tuple } from "@reduxjs/toolkit";
import { AppState, BudgetSection, BudgetState } from "./types";
import { useAppDispatch } from "@/app/hooks";

/**
 * Mock data to be replaced with real data from the server later
 */
//const budgetInitialState: BudgetState = 
//
//const appInitialState: AppState = {
//	openDialog: ""
//}

export const makeStore = () => {
	const budgetInitialState: BudgetState = (() => {
		const fallback = {
			sections: [{
				name: "Food",
				databaseID: -1,
				color: [200, 50, 100],
				items: []
			}],
			ownerUsername: "TheNameless",
			memberUsernames: ["TheNameless"]
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
			addSection: (state, action: PayloadAction<{ name: string, databaseID: number }>) => {
				state.sections.push({
					name: action.payload.name,
					databaseID: action.payload.databaseID,
					color: [128, 128, 128],
					items: []
				})
			},
			
			deleteSection: (state, action: PayloadAction<{ databaseID: number }>) => {
				state.sections = state.sections.filter((section: BudgetSection) => section.databaseID !== action.payload.databaseID);
			},

			addItem: (state, action: PayloadAction<{ sectionDatabaseID: number, itemName: string, itemDatabaseID: number, itemAmount: number, itemIsCumulative: boolean }>) => {
				state.sections.forEach((section: BudgetSection) => {
					if (section.databaseID === action.payload.sectionDatabaseID) {
						// If this is the correct section, add the item to the end
						section.items.push({
							name: action.payload.itemName,
							databaseID: action.payload.itemDatabaseID,
							amount: action.payload.itemAmount,
							isCumulative: action.payload.itemIsCumulative
						})
					}
				});
			},

			deleteItem: (state, action: PayloadAction<{ databaseID: number }>) => {
				state.sections.forEach((section: BudgetSection) => {
					section.items = section.items.filter((item) => item.databaseID !== action.payload.databaseID)
				});
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

