'use strict';

import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BudgetSection, BudgetState } from "./types";

/**
 * Mock data to be replaced with real data from the server later
 */
const initialState: BudgetState = {
	sections: [],
	ownerUsername: "TheNameless",
	memberUsernames: ["TheNameless"]
}

export const makeStore = () => {
	/**
	 * This slice contains budget sections and their items. 
	 */
	const budgetSlice = createSlice({
		name: "budget",
		initialState: initialState,
		reducers: {
			add_section: (state, action: PayloadAction<{ name: string, databaseID: number }>) => {
				state.sections.push({
					name: action.payload.name,
					databaseID: action.payload.databaseID,
					color: [128, 128, 128],
					items: []
				})
			},
			
			delete_section: (state, action: PayloadAction<{ databaseID: number }>) => {
				state.sections = state.sections.filter((section) => section.databaseID !== action.payload.databaseID);
			},

			add_item: (state, action: PayloadAction<{ sectionDatabaseID: number, itemName: string, itemDatabaseID: number, itemAmount: number, itemIsCumulative: boolean }>) => {
				state.sections.forEach((section) => {
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

			delete_item: (state, action: PayloadAction<{ databaseID: number }>) => {
				state.sections.forEach((section) => {
					section.items = section.items.filter((item) => item.databaseID !== action.payload.databaseID)
				});
			}
		}
	});
	
	return configureStore({
		reducer: budgetSlice.reducer
	});
}

// Infer return type of makeStore 
export type AppStore = ReturnType<typeof makeStore>

// Infer types of RootState and AppDispatch
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']