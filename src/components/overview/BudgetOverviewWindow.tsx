import {Budget} from "@/domain/types";
import {useAppSelector} from "@/lib/hooks";
import {
    Box, Divider,
    Typography
} from "@mui/material";
import React from "react";
import _ from "lodash";
import {ExpensesBar, IncomeBar} from "@/components/overview/IncomeExpenseBars";
import {CURRENCY_FORMAT} from "@/lib/formatters";

export default function BudgetOverviewWindow({budget}: Readonly<{
    budget: Budget;
}>) {
    const DAY_FORMAT = Intl.DateTimeFormat(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        weekday: "short"
    })

    const budgetSections = Object.values(useAppSelector(state => state.app.sections)).filter(section => !!section).filter(section => section.budgetID === budget.id);
    const items = useAppSelector(state => state.app.items);
    const budgetItems = budgetSections.flatMap(section => section.itemIDs.map(itemID => items[itemID])).filter(item => !!item);

    const [incomeItems, expenseItems] = _.partition(budgetItems, item => item.kind === 'income');

    const totalIncome = _.sum(incomeItems.map(item => item.amount));
    const totalExpenses = _.sum(expenseItems.map(item => item.amount));

    const plannedBalance = totalIncome - totalExpenses;

    return (
        <Box sx={{display: 'grid', gap: 2, margin: 1}}>
            <Box display={'flex'} flexDirection={'row'} width={'100%'} alignItems={'center'}
                 justifyContent={'space-between'}>
                <Typography
                    variant={"h4"}>{DAY_FORMAT.format(budget.startTime)} to {DAY_FORMAT.format(budget.endTime)}
                </Typography>
            </Box>
            <Divider/>
            <Typography variant={'h5'}>Month Overview</Typography>
            <Typography variant={'body2'}>Planned Income: {CURRENCY_FORMAT.format(totalIncome)}</Typography>
            <Typography variant={'body2'}>Planned Expenses: {CURRENCY_FORMAT.format(totalExpenses)}</Typography>
            <Typography variant={'body1'}>Balance: {CURRENCY_FORMAT.format(plannedBalance)}</Typography>
            <Divider/>
            <Typography variant={'h5'}>Income This Month</Typography>
            <IncomeBar incomeItems={incomeItems}/>
            <Divider/>
            <Typography variant={'h5'}>Expenses This Month</Typography>
            <ExpensesBar expenseItems={expenseItems}/>
        </Box>
    )
}