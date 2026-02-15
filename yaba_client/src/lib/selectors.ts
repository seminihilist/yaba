import {RootState} from "@/lib/store";
import {createSelector} from "reselect";
import { Budget, Section, Item, Transaction, IncomeItem } from "@/lib/types";

const budgets = (state: RootState) => state.budgets;
export const budgetsSelector = createSelector(
    [budgets],
    (budgets) => Object.entries(budgets)
        .map(([id, budget]): [number, Budget | undefined] => [Number(id), budget])
);

const sections = (state: RootState) => state.sections;
export const sectionsSelector = createSelector(
    [sections],
    (sections) => Object.entries(sections)
        .map(([id, section]): [number, Section | undefined] => [Number(id), section])
);

const items = (state: RootState) => state.items;
export const itemsSelector = createSelector(
    [items],
    (items) => Object.entries(items)
        .map(([id, item]): [number, Item | undefined] => [Number(id), item])
);

const transactions = (state: RootState) => state.transactions;
export const transactionsSelector = createSelector(
    [transactions],
    (transactions) => Object.entries(transactions)
        .map(([id, transaction]): [number, Transaction | undefined] => [Number(id), transaction])
);

const incomeItems = (state: RootState) => state.incomeItems;
export const incomeItemsSelector = createSelector(
    [incomeItems],
    (incomeItems) => Object.entries(incomeItems)
        .map(([id, incomeItem]): [number, IncomeItem | undefined] => [Number(id), incomeItem])
);