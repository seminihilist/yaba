import {Budget} from "@/domain/types";
import {useAppSelector} from "@/lib/hooks";
import {
    Box,
    Button,
    Dialog, DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    Divider,
    IconButton,
    TextField,
    Typography
} from "@mui/material";
import {Close, Delete} from "@mui/icons-material";
import AmountSpentProgressBar from "@/components/overview/AmountSpentProgressBar";
import React from "react";
import _ from "lodash";

export default function BudgetOverviewWindow({budget, setIsOpen}: Readonly<{
    budget: Budget;
    setIsOpen: (newIsOpen: boolean) => unknown;
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

    const [incomeItems, expenseItems] = _.partition(budgetItems, (item) => item.kind === 'income');

    const transactions = useAppSelector(state => state.app.transactions);
    const incomeTransactions = incomeItems.flatMap(item => item.transactionIDs.map(transactionID => transactions[transactionID])).filter(transaction => !!transaction);
    const expenseTransactions = expenseItems.flatMap(item => item.transactionIDs.map(transactionID => transactions[transactionID])).filter(transaction => !!transaction);

    const totalSpent = expenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalPlanned = budgetItems.reduce((sum, item) => sum + item.amount, 0);

    return (
        <Box sx={{display: 'grid', gap: 2, margin: 1}}>
            <Box display={'flex'} flexDirection={'row'} width={'100%'} alignItems={'center'}
                 justifyContent={'space-between'}>
                <Typography
                    variant={"h4"}>{DAY_FORMAT.format(budget.startTime)} to {DAY_FORMAT.format(budget.endTime)}
                </Typography>
            </Box>
            <AmountSpentProgressBar amountSpent={totalSpent} amountPlanned={totalPlanned}/>
        </Box>
    )
}