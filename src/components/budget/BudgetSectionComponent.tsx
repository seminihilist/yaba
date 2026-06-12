'use strict';
'use client';

import type {Section} from "@/domain/types";
import BudgetItemComponent from "./BudgetItemComponent";

import {
    Button,
    TableRow,
    TableCell,
    Box, IconButton
} from "@mui/material";
import React, {useState} from "react";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";

import {Add, Edit, KeyboardArrowRight} from "@mui/icons-material"
import {addItem} from "@/store/app";

/* A section of the budget.
 */
export default function BudgetSectionComponent({
                                                   section,
//                                                 isOpenInOverview,
                                                   openInOverview,
                                                   itemIsOpenInOverview,
                                                   openItemInOverview,
                                               }: Readonly<{
    section: Section;
    isOpenInOverview: boolean,
    openInOverview: React.MouseEventHandler<HTMLTableRowElement>;
    itemIsOpenInOverview: (id: number) => boolean;
    openItemInOverview: (id: number) => unknown;
}>) {
    const [isExpanded, setIsExpanded] = useState(true);

    const items = useAppSelector(
        (state) => section.itemIDs.map((id) => state.app.items[id])
    ).filter((item) => !!item);

    const dispatch = useAppDispatch();

    return (
        <>
            <TableRow onClick={openInOverview}>
                <TableCell>
                    <IconButton onClick={(e) => {
                        e.stopPropagation();

                        setIsExpanded(!isExpanded);
                    }}>
                        <KeyboardArrowRight sx={{
                            rotate: '0deg',
                            transition: (theme) => theme.transitions.create("rotate", {
                                duration: theme.transitions.duration.short,
                                easing: theme.transitions.easing.sharp,
                            }),
                            ...(isExpanded && {
                                rotate: '90deg',
                                transition: (theme) => theme.transitions.create("rotate", {
                                    duration: theme.transitions.duration.short,
                                    easing: theme.transitions.easing.sharp,
                                }),
                            }),
                        }}/>
                    </IconButton>
                </TableCell>
                <TableCell colSpan={3}>
                    <span className={"text-lg"}>{section.name}</span>
                </TableCell>
                <TableCell>
                    <IconButton title="Edit" size={'small'}><Edit/></IconButton>
                </TableCell>
            </TableRow>
            {isExpanded ? (
                <>
                    {
                        section.itemIDs.length > 0 ?
                            <>
                                {[...items.map((item, index) => (
                                    <BudgetItemComponent item={item}
                                                         key={index}
                                                         isOpenInOverview={itemIsOpenInOverview(item.id)}
                                                         openInOverview={() => openItemInOverview(item.id)}/>)
                                )]}
                            </>
                            : <TableRow>
                                <TableCell colSpan={5}>
                                    <i>You haven&apos;t created any items in this section yet! Click &quot;Add Item&quot; to create
                                        some!</i>
                                </TableCell>
                            </TableRow>
                    }
                    <TableRow>
                        <TableCell colSpan={6}>
                            <Box sx={{'display': 'flex', 'justifyContent': 'flex-end'}}>
                                <Button
                                    onClick={() => {
                                        const {payload: {newId}} = dispatch(addItem({
                                            sectionID: section.id,
                                            kind: 'expense',
                                            itemName: "New Item",
                                            itemAmount: 10,
                                        }));

                                        openItemInOverview(newId as number);
                                    }}
                                    startIcon={<Add/>}
                                    variant="text">
                                    Add Item
                                </Button>
                            </Box>
                        </TableCell>
                    </TableRow>
                </>
            ) : (<></>)}
        </>
    );
}