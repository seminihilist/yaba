'use strict';
'use client';

import {ReactNode, useRef} from "react";
import {Provider} from "react-redux";
import {makeStore, AppStore} from "@/store/store";
import {useAppSelector} from "@/lib/hooks";
import CircularProgress from "@mui/material/CircularProgress";

/**
 * `StoreProvider` enables its children components to access the Redux store.
 * @param param0 The props of the component.
 * @returns
 */
export default function StoreProvider({children}: Readonly<{ children: ReactNode }>) {
    const storeRef = useRef<AppStore | null>(null)

    // Make a new store if our reference is null, i.e. there is no store because this is our first render
    if (!storeRef.current && typeof window !== 'undefined') {
        storeRef.current = makeStore()
    }

    if (storeRef.current) {
        return (
            <Provider store={storeRef.current}>{children}</Provider>
        )
    } else {
        return (
            <CircularProgress/>
        )
    }
}