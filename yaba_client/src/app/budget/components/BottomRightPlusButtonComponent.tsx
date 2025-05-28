import { MouseEventHandler } from "react";

export default function BottomRightPlusButtonComponent({ onClick }: Readonly<{ onClick: MouseEventHandler}>) {
	return (
		<button 
			className="rounded-full w-15 h-15 fixed bottom-3 right-3 bg-violet-600 cursor-pointer hover:bg-violet-500 active:bg-violet-400"
			onClick={onClick}>
			+
		</button>
	)
}