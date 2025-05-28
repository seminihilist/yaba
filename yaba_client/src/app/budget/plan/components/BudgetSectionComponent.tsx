'use client';

import type { BudgetSection } from "@/lib/types";

/* An item in the transaction list of that tab. Given a transaction object from the Redux store, displays the name of the budget item, the amount spent, and
   buttons to edit or delete the transaction.  
 */
export default function BudgetSectionComponent({ section }: Readonly<{ section: BudgetSection }>) {
	return (
		<div style={{ backgroundColor: `rgb(${section.color[0]}, ${section.color[1]}, ${section.color[2]})` }} className="rounded-s">
			<h1 className="text-4xl">{section.name}</h1>
		</div>
	)
}