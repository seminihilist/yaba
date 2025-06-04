'use strict';
'use client';

import { useState, useEffect, Suspense } from "react";

import NavigationContainer from "../components/NavigationContainer"
import StoreProvider from "../components/StoreProvider";
import CenterCircleLoader from "./components/CenterCircleLoader";

export default function BudgetLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const [ isMobile, setIsMobile ] = useState(false)
	const [ isReady, setIsReady ] = useState(false)

	useEffect(() => {
		// Event listener
		const listener = () => {
			const width = window.screen.availWidth;
			setIsMobile(width < 768);
		}

		// Call the listener once to initialize things before the component mounts
		listener()

		// Attach the event listener 
		window.addEventListener("resize", listener)

		setIsReady(true);

		// To clean up, just remove the event listener
		return () => {
			window.removeEventListener("resize", listener)
		}
	})

	const content = typeof window === "undefined" ?
		// If we are on the server, return a loading screen
		<CenterCircleLoader /> :
		// If we are on the client, return a Suspense
		<Suspense fallback={<CenterCircleLoader />}>
			{children}
		</Suspense>


	return (
		<StoreProvider>
			<NavigationContainer isMobile={isMobile}>
				<div className="bg-amber-100 text-black w-full h-full p-2">
					{content}
				</div>
			</NavigationContainer>
		</StoreProvider>
	);
}
