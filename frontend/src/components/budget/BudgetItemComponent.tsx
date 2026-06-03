'use strict';
'use client';

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    TextField,
    IconButton,
    TableRow,
    TableCell, ButtonBase, Typography
} from "@mui/material";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import type {Section, Item, Budget, AppState} from "@/domain/types";
import {Add, Delete, DragIndicator, Edit, Payment, Payments, Savings} from "@mui/icons-material";
import React, {useState} from "react";

/* Display an item in a Budget Section. 
 */
export default function BudgetItemComponent({
                                                item,
                                                isOpenInOverview,
                                                openInOverview,
                                            }: Readonly<{
    item: Item;
    isOpenInOverview: boolean;
    openInOverview: () => unknown;
}>) {
    const transactions = useAppSelector(
        (state) => item.transactionIDs.map((id) => state.app.transactions[id])
    ).filter((transaction) => !!transaction);

    // Total up the amount spent from the item so far, and how much is left
    const totalSpent = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    const amountRemaining = item.amount - totalSpent;

    return (
        <>
            <TableRow
                id={`item-${item.id}`}
                onClick={openInOverview}
            >
                <TableCell/>
                <TableCell>
                    <Typography variant={'body2'}>
                        {item.name}
                        {item.kind === 'income' ?
                            <span title={"Income Item"}><Payments color={'disabled'} fontSize={'small'}
                                                                  sx={{marginLeft: '10px'}}/></span> : <></>}
                    </Typography>
                </TableCell>
                <TableCell>${item.amount}</TableCell>
                <TableCell>${amountRemaining}</TableCell>
                <TableCell>
                    <IconButton title="Edit" size={'small'}><Edit/></IconButton>
                </TableCell>
            </TableRow>
        </>
    )
}