import BrowserSidebarButton from "./browser/BrowserSidebarButton"
import MobileNavbarButton from "./mobile/MobileNavbarButton"

/* Sidebar/navbar, depending on screen size. Children will be displayed 
   with the correct offset so that they do not appear behind the 
   sidebar/navbar.
 */
export default function NavigationContainer({ isMobile, children }: Readonly<{ isMobile: boolean, children: React.ReactNode }>) {
	if (isMobile) {
		// Display a navigation bar on mobile
		return (
			<>
				<div className="absolute top-0 left-0 w-screen h-20 bg-red-500">
					<MobileNavbarButton href="./home">
						Home
					</MobileNavbarButton>
					<MobileNavbarButton href="./plan">
						Plan
					</MobileNavbarButton>
					<MobileNavbarButton href="./transactions">
						Transactions
					</MobileNavbarButton>
				</div>
				<div className="absolute top-20 left-0">
					{children}
				</div>
			</>
		)
	} else {
		// Display a sidebar on desktop
		return (
			<>
				<div className="absolute top-0 left-0 h-screen w-60 dark:bg-red-500">
					<BrowserSidebarButton href="./home">
						Home
					</BrowserSidebarButton>
					<BrowserSidebarButton href="./plan">
						Plan
					</BrowserSidebarButton>
					<BrowserSidebarButton href="./transactions">
						Transactions
					</BrowserSidebarButton>
				</div>
				<div className="absolute top-0 left-60">
					{children}
				</div>
			</>
		)
	}
}