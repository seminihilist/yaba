'use strict';
'use client';

import {
    IconButton,
    TableRow,
    TableCell,
    Typography
} from "@mui/material";
import {useAppSelector} from "@/lib/hooks";
import type {Item} from "@/domain/types";
import {Edit, Payments} from "@mui/icons-material";
import React from "react";
import { CURRENCY_FORMAT } from "@/lib/formatters";

/* Display an item in a Budget Section. 
 */
export default function BudgetItemComponent({
                                                item,
                                                //isOpenInOverview,
                                                openInOverview,
                                            }: Readonly<{
    item: Item;
    isOpenInOverview: boolean;
    openInOverview: () => unknown;
}>) {
    const transactions = useAppSelector(
        (state) => item.transactionIDs.map((id) => state.app.transactions[id])
    ).filter((transaction) => !!transaction);

    const transactionTotal = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

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
                <TableCell>{CURRENCY_FORMAT.format(item.amount)}</TableCell>
                <TableCell>{CURRENCY_FORMAT.format(item.amount - transactionTotal)}</TableCell>
                <TableCell>
                    <IconButton title="Edit" size={'small'}><Edit/></IconButton>
                </TableCell>
            </TableRow>
        </>
    )
}