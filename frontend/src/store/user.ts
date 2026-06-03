import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {UserState} from "@/domain/types";

const INITIAL_STATE: UserState = {
    openBudget: null,
    hasCompletedSetup: false,
    tutorialStage: 0,
}

export const userSlice = createSlice({
    name: "user",
    initialState: INITIAL_STATE,
    reducers: {
        setOpenBudget(state: UserState, {payload}: PayloadAction<{
            /**
             * The ID of the budget to open.
             */
            readonly id: number
        }>) {
            state.openBudget = payload.id;
        },

        setHasCompletedSetup(state: UserState, {payload}: PayloadAction<{ hasCompletedSetup: boolean; }>) {
            state.hasCompletedSetup = payload.hasCompletedSetup;
        }
    }
});

export const {setOpenBudget, setHasCompletedSetup} = userSlice.actions;