'use strict';

import {configureStore} from "@reduxjs/toolkit";
import {appSlice} from "@/store/app";
import {userSlice} from "@/store/user";
import {AppState, UserState} from "@/domain/types";
import {rememberEnhancer} from "redux-remember";

/**
 * The key in `localStorage` where state is persisted.
 */
const LOCAL_STORAGE_KEY = "state";

// const INITIAL_STATE: AppState = {
//     budgets: {
//         0: {
//             id: 0,
//             sections: [1, 2],
//             startTime: (() => {
//                 const date = new Date(Date.now());
//                 date.setHours(0, 0, 0, 0);
//                 return date;
//             })(),
//             endTime: 100,
//             state: 'active',
//         },
//     },
//     sections: {
//         1: {
//             id: 1,
//             budgetID: 0,
//             name: "Income",
//             itemIDs: [3]
//         },
//         2: {
//             id: 2,
//             budgetID: 0,
//             name: "Food",
//             itemIDs: [4]
//         },
//     },
//     items: {
//         3: {
//             id: 3,
//             name: "Paycheck",
//             kind: 'income',
//             amount: 2000,
//             isCumulative: false,
//             sectionID: 1,
//             transactionIDs: []
//         },
//         4: {
//             id: 4,
//             name: "Onions",
//             kind: 'expense',
//             amount: 500,
//             isCumulative: false,
//             sectionID: 2,
//             transactionIDs: []
//         },
//     },
//     transactions: {},
//     idCounter: 5
// };

export const makeStore = () => {
    const store = configureStore<{ app: AppState, user: UserState }>({
        reducer: {
            app: appSlice.reducer,
            user: userSlice.reducer,
        },
        preloadedState: loadFromLocalStorage(),
        // middleware: getDefaultMiddleware => {
        //     return getDefaultMiddleware().concat([(store: any) => (next: any) => (action: any) => {
        //         console.log('dispatching', action);
        //         let result = next(action);
        //         console.log('next state', store.getState());
        //         return result;
        //     }]) // FIXME
        // }
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
    // If we don't have access to localStorage, return the fallback data immediately.
    if (typeof localStorage === "undefined") {
        return undefined;
    }

    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (serializedState === null || serializedState === "undefined") return undefined;

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
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store.getState()))
    } catch (e: any) {
        if (e.name === "QuotaExceededError") {
            alert("YABA has run out of storage!\n\nAny changes you make will not be saved until storage space" +
                "is reclaimed.\n\nYou can reclaim storage space by deleting old budgets.") // TODO: implement deleting old budgets
        } else {
            alert("An error has occurred when saving your data.\n\nYour changes are likely not being saved.")
        }
    }
}