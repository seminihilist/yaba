'use strict';
'use client';

import {ReactNode, useEffect, useRef, useState} from "react";
import {Provider} from "react-redux";
import {makeStore, AppStore} from "@/store/store";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

/**
 * `StoreProvider` enables its children components to access the Redux store.
 * @param param0 The props of the component.
 * @returns
 */
export default function StoreProvider({children}: Readonly<{ children: ReactNode }>) {
    const storeRef = useRef<AppStore | null>(null)
    const [hasMadeStore, setHasMadeStore] = useState(false);

    useEffect(() => {
        // Make a new store if our reference is null, i.e. there is no store because this is our first render
        if (!storeRef.current) {
            storeRef.current = makeStore();
            setHasMadeStore(true);
        }
    }, []);

    if (hasMadeStore && storeRef.current) {
        return (
            <Provider store={storeRef.current}>{children}</Provider>
        )
    } else {
        return (
            <Box height={'100vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <CircularProgress/>
            </Box>
        )
    }
}