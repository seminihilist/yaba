import { House, Payments, Settings, ViewList } from "@mui/icons-material"
import BrowserSidebarButton from "./browser/BrowserSidebarButton"
import MobileNavbarButton from "./mobile/MobileNavbarButton"
import { BottomNavigation, BottomNavigationAction, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Table, Toolbar } from "@mui/material"
import Link from "next/link"

function ListItemLink({ icon, primary, href }: Readonly<{ icon: React.ReactNode, primary: string, href: string }>) {
	return (
        <Link href={href}>
            <ListItemButton>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} />
            </ListItemButton>
        </Link>
	);
}

/* Sidebar/navbar, depending on screen size. Children will be displayed 
   with the correct offset so that they do not appear behind the 
   sidebar/navbar.
 */
function MobileNavigationContainer({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="flex flex-col h-screen overflow-clip min-md:hidden fixed top-0 left-0 right-0 bottom-0">
			<Paper elevation={10} className="flex-none">
				<BottomNavigation className="p-2">
					<Link href="./home">
						<BottomNavigationAction label="Home" icon={<House />} showLabel={true} />
					</Link>
					<Link href="./plan">
						<BottomNavigationAction label="Budget" icon={<ViewList />} showLabel={true} />
					</Link>
					<Link href="./transactions">
						<BottomNavigationAction label="Transactions" icon={<Payments />} showLabel={true} />
					</Link>
					<Link href="./settings">
						<BottomNavigationAction label="Settings" icon={<Settings />} showLabel={true} />
					</Link>
				</BottomNavigation>
			</Paper>
			<div className="overflow-x-clip overflow-y-scroll flex-1 bg-amber-100">
				{children}
			</div>
		</div>
	)
}

function DesktopNavigationContainer({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="h-screen flex flex-row max-md:hidden">
			<Drawer
			variant="permanent"
			className="flex-none"
			sx={{
				position: "relative",
				width: 240,
				'& .MuiDrawer-paper': {
					width: 240,
					boxSizing: 'border-box'
				},
			}}
			>
				<List>
					<ListItem>
						<ListItemLink icon={<House />} primary="Home" href="./home" />
					</ListItem>
					<ListItem>
						<ListItemLink icon={<ViewList />} primary="Budget" href="./plan" />
					</ListItem>
					<ListItem>
						<ListItemLink icon={<Payments />} primary="Transactions" href="./transactions" />
					</ListItem>
				</List>
				<Divider />
				<List>
					<ListItem>
						<ListItemLink icon={<Settings />} primary="Settings" href="./settings" />
					</ListItem>
				</List>
			</Drawer>
			<div className="flex-1 overflow-auto bg-amber-100">
				{children}
			</div>
		</div>
	)
}

export default function NavigationContainer({ isMobile, children }: Readonly<{ isMobile: boolean, children: React.ReactNode }>) {
    return (
        <>
            <div
                className={
                    "max-md:flex max-md:flex-col max-md:h-screen max-md:overflow-clip max-md:fixed max-md:top-0 " +
                    "max-md:left-0 max-md:right-0 max-md:bottom-0 " +

                    "min-md:h-screen min-md:flex min-md:flex-row"
                }
            >
                <Paper elevation={10} className="flex-none min-md:hidden">
                    <BottomNavigation className="p-2">
                        <Link href="./home">
                            <BottomNavigationAction label="Home" icon={<House />} showLabel={true} />
                        </Link>
                        <Link href="./plan">
                            <BottomNavigationAction label="Budget" icon={<ViewList />} showLabel={true} />
                        </Link>
                        <Link href="./transactions">
                            <BottomNavigationAction label="Transactions" icon={<Payments />} showLabel={true} />
                        </Link>
                        <Link href="./settings">
                            <BottomNavigationAction label="Settings" icon={<Settings />} showLabel={true} />
                        </Link>
                    </BottomNavigation>
                </Paper>
                <Drawer
                    variant="permanent"
                    className="flex-none max-md:hidden"
                    sx={{
                        position: "relative",
                        width: 240,
                        '& .MuiDrawer-paper': {
                            width: 240,
                            boxSizing: 'border-box'
                        },
                    }}
                >
                    <List>
                        <ListItem>
                            <ListItemLink icon={<House />} primary="Home" href="./home" />
                        </ListItem>
                        <ListItem>
                            <ListItemLink icon={<ViewList />} primary="Budget" href="./plan" />
                        </ListItem>
                        <ListItem>
                            <ListItemLink icon={<Payments />} primary="Transactions" href="./transactions" />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem>
                            <ListItemLink icon={<Settings />} primary="Settings" href="./settings" />
                        </ListItem>
                    </List>
                </Drawer>
                <div className="overflow-x-clip overflow-y-scroll flex-1 bg-amber-100">
                    {children}
                </div>
            </div>
        </>
    )

    /*
    if (typeof window === "undefined") {
		// If we are on the server, return both as one will be hidden by CSS
		return (
			<>
				<MobileNavigationContainer>{children}</MobileNavigationContainer>
				<DesktopNavigationContainer>{children}</DesktopNavigationContainer>
			</>
		)
	} else if (isMobile) {
		// Display a navigation bar on mobile
		return (
			<MobileNavigationContainer>{children}</MobileNavigationContainer>
		)
	} else {
		// Display a sidebar on desktop
		return (
			<DesktopNavigationContainer>{children}</DesktopNavigationContainer>
		)

		return (
			<div className="h-screen flex flex-row">
				<Drawer
					variant="permanent"
					className="flex-none"
					sx={{
						position: "relative",
						width: 240,
						'& .MuiDrawer-paper': {
							width: 240,
							boxSizing: 'border-box'
						},
					}}
				>
					<List>
						<ListItem>
							<ListItemLink icon={<House />} primary="Home" href="./home" />
						</ListItem>
						<ListItem>
							<ListItemLink icon={<ViewList />} primary="Budget" href="./plan" />
						</ListItem>
						<ListItem>
							<ListItemLink icon={<Payments />} primary="Transactions" href="./transactions" />
						</ListItem>
					</List>
					<Divider />
					<List>
						<ListItem>
							<ListItemLink icon={<Settings />} primary="Settings" href="./settings" />
						</ListItem>
					</List>
				</Drawer>
				<div className="flex-1 overflow-auto bg-amber-100">
					{children}
				</div>
			</div>
		)
	}
	*/
}