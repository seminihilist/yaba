'use client';

import NewBudgetWrapper from "@/components/budget/NewBudgetWrapper";
import MainView from "@/components/MainView";

export default function BudgetPage() {
    return (
        <NewBudgetWrapper>
            {(budget) => <MainView budget={budget}/>}
        </NewBudgetWrapper>
    );
}