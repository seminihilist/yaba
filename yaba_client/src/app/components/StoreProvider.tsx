'use client';

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/lib/store";

/**
 * `StoreProvider` enables its children components to access the Redux store.  
 * @param param0 The props of the component.   
 * @returns 
 */
export default function StoreProvider ({ children }: Readonly<{ children: React.ReactNode }>) {
	const storeRef = useRef<AppStore | null>(null)

	// Make a new store if our reference is null, i.e. there is no store because this is our first render
	if (!storeRef.current) {
		storeRef.current = makeStore()
	}

	return (
		<Provider store={storeRef.current}>{children}</Provider>
	)
}