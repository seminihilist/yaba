'use strict';
'use client';

import { useState, useEffect } from "react";

import NavigationContainer from "../components/NavigationContainer"
import StoreProvider from "../components/StoreProvider";

export default function BudgetLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const [ isMobile, setIsMobile ] = useState(false)

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

		// To clean up, just remove the event listener
		return () => {
			window.removeEventListener("resize", listener)
		}
	})

	return (
		<StoreProvider>
			<NavigationContainer isMobile={isMobile}>
				<div className="bg-amber-100 w-100 h-100 p-2">
					{children}
				</div>
			</NavigationContainer>
		</StoreProvider>
	);
}
