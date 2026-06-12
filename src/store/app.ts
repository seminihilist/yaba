import {AppState, ItemKind} from "@/domain/types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const INITIAL_STATE: AppState = {
    budgets: {},
    sections: {},
    items: {},
    transactions: {},
    idCounter: 0,
}

export const appSlice = createSlice({
    name: "app",
    initialState: INITIAL_STATE,
    reducers: {
        addBudget: (state, {payload}: PayloadAction<{
            startTime: number;
            endTime: number;

            /**
             * Out-parameter to return the newly created budget's ID.
             */
            newId?: number,
        }>) => {
            const newBudgetID = state.idCounter++;

            state.budgets[newBudgetID] = {
                id: newBudgetID,
                startTime: payload.startTime,
                endTime: payload.endTime,
                sections: [],
                state: 'active',
            };

            payload.newId = newBudgetID;
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

        /**
         * Migrate a budget from one budgeting period to the next, copying sections and items.
         * @param state
         * @param param1
         * @param param1.payload
         */
        migrateBudget: (state, {payload}: PayloadAction<{
            /**
             * The ID of the old budget to migrate from.
             */
            id: number,

            /**
             * The start time of the new budget, as a Unix timestamp.
             */
            newStartTime: number,

            /**
             * The end time of the new budget, as a Unix timestamp.
             */
            newEndTime: number,

            /**
             * Out-parameter to return the newly created budget's ID.
             */
            newId?: number,
        }>) => {
            const budget = state.budgets[payload.id];
            if (!budget) {
                console.error(`Attempted to migrate the non-existent budget with ID ${payload.id}`);
                return;
            }

            budget.state = 'archived';

            const copiedSectionIDs = [];

            const newBudgetID = state.idCounter++;

            for (const sectionID of budget.sections) {
                const section = state.sections[sectionID];
                if (!section) continue;

                const copiedItemIDs = [];

                const newSectionID = state.idCounter++;

                for (const itemID of section.itemIDs) {
                    const item = state.items[itemID];
                    if (!item) continue;

                    const newItemID = state.idCounter++;

                    state.items[newItemID] = {
                        id: newItemID,
                        name: item.name,
                        kind: item.kind,
                        amount: item.amount,
                        transactionIDs: [],
                        sectionID: newSectionID,
                        isCumulative: item.isCumulative,
                    };

                    copiedItemIDs.push(newItemID);
                }

                state.sections[newSectionID] = {
                    id: newSectionID,
                    name: section.name,
                    budgetID: newBudgetID,
                    itemIDs: copiedItemIDs,
                };

                copiedSectionIDs.push(newSectionID);
            }

            state.budgets[newBudgetID] = {
                id: newBudgetID,
                sections: copiedSectionIDs,
                startTime: payload.newStartTime,
                endTime: payload.newEndTime,
                state: 'active',
            }

            payload.newId = newBudgetID;
        },

        addSection: (state, {payload}: PayloadAction<{
            budgetID: number;
            name: string;

            /**
             * Out-parameter to return the newly created section's ID.
             */
            newId?: number;
        }>) => {
            const budget = state.budgets[payload.budgetID];
            if (typeof budget === "undefined") return;

            const newSectionId = state.idCounter++;

            // Create the section
            state.sections[newSectionId] = {
                id: newSectionId,
                budgetID: payload.budgetID,
                name: payload.name,
                itemIDs: []
            };

            // Add it to the budget by ID
            budget.sections.push(newSectionId);

            payload.newId = newSectionId;
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

        addItem: (state, {payload}: PayloadAction<{
            sectionID: number,
            itemName: string,
            kind: 'income' | 'expense',
            itemAmount: number

            /**
             * Out-parameter to return the newly created item's ID.
             */
            newId?: number,
        }>) => {
            const section = state.sections[payload.sectionID];
            if (typeof section === "undefined") return;

            const newItemId = state.idCounter++;

            // Create the item
            state.items[newItemId] = {
                id: newItemId,
                name: payload.itemName,
                kind: payload.kind,
                amount: payload.itemAmount,
                isCumulative: false, // This feature has been scrapped
                sectionID: payload.sectionID,
                transactionIDs: []
            };

            // Add the item to the section by ID
            section.itemIDs.push(newItemId);

            payload.newId = newItemId;
        },

        alterItem: (state, action: PayloadAction<{
            /**
             * The ID of the item to alter.
             */
            id: number,

            /**
             * The new name of the item.
             */
            newName?: string,

            /**
             * The new amount of the item.
             */
            newAmount?: number
        }>) => {
            const item = state.items[action.payload.id];
            if (typeof item === "undefined") return;

            item.name = action.payload.newName ?? item.name;
            item.amount = action.payload.newAmount ?? item.amount;
        },

        setItemKind: (state, {payload}: PayloadAction<{ id: number, newKind: ItemKind }>) => {
            const item = state.items[payload.id];
            if (!item) return;

            item.kind = payload.newKind;
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

        addTransaction: (state, {payload}: PayloadAction<{
            readonly itemID: number,
            readonly amount: number,
            readonly timestamp: number,

            /**
             * Out-parameter to return the newly created transaction's ID.
             */
            newId?: number,
        }>) => {
            const item = state.items[payload.itemID];
            // If the item doesn't exist, do nothing
            if (!item) {
                console.error(
                    `Attempted to create a transaction under non-existent item id=${payload.itemID}.`
                );
                return;
            }

            const newTransactionId = state.idCounter++;

            // Create the transaction
            state.transactions[newTransactionId] = {
                id: newTransactionId,
                itemID: payload.itemID,
                amount: payload.amount,
                timestamp: payload.timestamp,
            };

            // Add it to the item
            item.transactionIDs.push(newTransactionId);

            payload.newId = newTransactionId;
        },

        editTransaction: (state, {payload}: PayloadAction<{ id: number, amount: number }>) => {
            const transaction = state.transactions[payload.id];
            if (!transaction) {
                console.error(`Attempted to edit non-existent transaction id=${payload.id}.`);
                return;
            } // No such transaction exists

            transaction.amount = payload.amount;
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
    }
});

export const {
    addBudget,
    addItem,
    addTransaction,
    addSection,
    deleteItem,
    deleteTransaction,
    deleteSection,
    deleteBudget,
    editTransaction,
    renameSection,
    setItemKind,
    alterItem,
    migrateBudget
} = appSlice.actions;

