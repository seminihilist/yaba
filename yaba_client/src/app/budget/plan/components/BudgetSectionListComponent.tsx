'use client';

import { useAppSelector } from "@/app/hooks";
import type { BudgetSection, BudgetState } from "@/lib/types";
import BudgetSectionComponent from "./BudgetSectionComponent";
import { RootState } from "@/lib/store";

/* An item in the transaction list of that tab. Given a transaction object from the Redux store, displays the name of the budget item, the amount spent, and
   buttons to edit or delete the transaction.  
 */
export default function BudgetSectionListComponent() {
	console.log(useAppSelector((state: RootState) => state))

	const sections: Array<BudgetSection> = useAppSelector((state: RootState) => state.budget.sections)

	console.log(sections)

	return (
		// Nothing
		<>
			{sections.map((section, index) => (<BudgetSectionComponent section={section} key={index} />))}
		</>
	);
}