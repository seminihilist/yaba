import {Box, LinearProgress, styled, Typography} from "@mui/material";
import React from "react";
import { Item } from "@/domain/types";
import {useAppSelector} from "@/lib/hooks";
import {CURRENCY_FORMAT} from "@/lib/formatters";

const BolderLinearProgress = styled(LinearProgress)(({
    height: 10,
    borderRadius: 5,
    transition: 'left 0.8s',
    // [`&.${linearProgressClasses.colorPrimary}`]: {
    //     backgroundColor: theme.palette.grey[200],
    //     ...theme.applyStyles('dark', {
    //         backgroundColor: theme.palette.grey[800],
    //     }),
    // },
    // [`& .${linearProgressClasses.bar}`]: {
    //     borderRadius: 5,
    //     backgroundColor: GREEN,
    //     ...theme.applyStyles('dark', {
    //         backgroundColor: '#308fe8',
    //     }),
    // },
}));

const percentage = (current: number, max: number) => current === 0 ? 0 : max === 0 ? 100 : (current / max * 100);

export function IncomeBar({ incomeItems }: Readonly<{ incomeItems: Item[]; }>) {
    const allTransactions = useAppSelector(state => state.app.transactions);
    const transactions =
        incomeItems.flatMap(item => item.transactionIDs.map(id => allTransactions[id]))
            .filter(transaction => !!transaction);

    const totalReceived = transactions.reduce((total, transaction) => total + transaction.amount, 0);
    const totalExpected = incomeItems.reduce((total, item) => total + item.amount, 0);

    return (
        <Box sx={{flexDirection: "column"}}>
            <Box display={"flex"} flexDirection={"row"}>
                <Typography
                    variant="caption"
                    component="div"
                    sx={{color: 'text.secondary', flex: 1, textAlign: 'left'}}
                >{CURRENCY_FORMAT.format(0)}</Typography>
                <Typography
                    variant="caption"
                    component="div"
                    sx={{color: 'text.secondary', flex: 1, textAlign: 'right'}}
                >{CURRENCY_FORMAT.format(totalExpected)}</Typography>
            </Box>
            <Box>
                <BolderLinearProgress
                    variant="determinate"
                    aria-label="Percent spent"
                    sx={{
                        width: '100%',
                    }}
                    color={'success'}
                    value={percentage(totalReceived, totalExpected)}
                />
            </Box>
            <Box height={'11px'} width={'100%'} display={'flex'} justifyContent={'center'}>
                <Typography
                    variant="caption"
                >
                    {CURRENCY_FORMAT.format(totalReceived)}
                </Typography>
            </Box>
        </Box>
    )
}

export function ExpensesBar({expenseItems}: Readonly<{ expenseItems: Item[]; }>) {
    const allTransactions = useAppSelector(state => state.app.transactions);
    const transactions = expenseItems.flatMap(item => item.transactionIDs.map(id => allTransactions[id]))
        .filter(transaction => !!transaction);

    const totalSpent = transactions.reduce((total, transaction) => total + transaction.amount, 0);
    const totalAllotted = expenseItems.reduce((total, item) => total + item.amount, 0);

    return (
        <Box sx={{flexDirection: "column"}}>
            <Box display={"flex"} flexDirection={"row"}>
                <Typography
                    variant="caption"
                    component="div"
                    sx={{color: 'text.secondary', flex: 1, textAlign: 'left'}}
                >{CURRENCY_FORMAT.format(0)}</Typography>
                <Typography
                    variant="caption"
                    component="div"
                    sx={{color: 'text.secondary', flex: 1, textAlign: 'right'}}
                >{CURRENCY_FORMAT.format(totalAllotted)}</Typography>
            </Box>
            <Box>
                <BolderLinearProgress
                    variant="determinate"
                    aria-label="Percent spent"
                    sx={{
                        width: '100%',
                    }}
                    color={'warning'}
                    value={percentage(totalSpent, totalAllotted)}
                />
            </Box>
            <Box height={'11px'} width={'100%'} display={'flex'} justifyContent={'center'}>
                <Typography
                    variant="caption"
                >
                    {CURRENCY_FORMAT.format(totalSpent)}
                </Typography>
            </Box>
        </Box>
    )
}