/* Button for navbar. Uses exactly one-third of the available width.
 */

'use client';

import Link from "next/link";

export default function MobileNavbarButton({ children, href }: Readonly<{ children: React.ReactNode, href: string }>) {
	return (
		<Link 
			href={ href }
			className="w-1/3 h-full bg-red-700 cursor-pointer inline-block content-center text-center hover:bg-red-600 active:bg-red-500"
		>
			<p>{children}</p>
		</Link>
	)
}