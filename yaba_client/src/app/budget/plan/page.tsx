import { useAppSelector } from "@/app/hooks"
import { AppStore } from "@/lib/store"
import type { BudgetSection, BudgetState } from "@/lib/types"
import BudgetSectionComponent from "./components/BudgetSectionComponent";

export default function PlanPage() {
	const sections: Array<BudgetSection> = useAppSelector((state: BudgetState) => state.sections)

	return (
		// Nothing
		<>
			{sections.map(section => (<BudgetSectionComponent section={section} />))}
		</>
	);
}
