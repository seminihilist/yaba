/* Button for navbar. Uses exactly one-third of the available width.
 */

'use client';

import Link from "next/link";

export default function BrowserSidebarButton({ children, className, href }: Readonly<{ children: React.ReactNode, className?: string, href: string }>) {
	return (
		<Link 
			href={ href }
			className={"h-20 w-full bg-red-700 hover:bg-red-600 active:bg-red-500 cursor-pointer block content-center pl-7 text-2xl " + (className !== undefined ? className : "")}
		>
			<p>{children}</p>
		</Link>
	)
}