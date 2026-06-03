'use strict';
'use client';

import type {AppState, Budget, Item, Section} from "@/domain/types";
import BudgetItemComponent from "./BudgetItemComponent";

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    TextField,
    TableRow,
    TableCell,
    Box, IconButton
} from "@mui/material";
import React, {Fragment, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";

import {Add, Edit, KeyboardArrowDown, KeyboardArrowRight} from "@mui/icons-material"
import {addItem} from "@/store/app";

/* A section of the budget.
 */
export default function BudgetSectionComponent({
                                                   budget,
                                                   section,
                                                   isOpenInOverview,
                                                   openInOverview,
                                                   itemIsOpenInOverview,
                                                   openItemInOverview,
                                               }: Readonly<{
    budget: Budget, section: Section,
    isOpenInOverview: boolean,
    openInOverview: React.MouseEventHandler<HTMLTableRowElement>;
    itemIsOpenInOverview: (id: number) => boolean;
    openItemInOverview: (id: number) => unknown;
}>) {
    const [renameDialogIsOpen, setRenameDialogIsOpen] = useState(false);
    const [recolorDialogIsOpen, setRecolorDialogIsOpen] = useState(false);
    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
    const [newItemDialogIsOpen, setNewItemDialogIsOpen] = useState(false);

    const [isExpanded, setIsExpanded] = useState(true);

    const items = useAppSelector(
        (state) => section.itemIDs.map((id) => state.app.items[id])
    ).filter((item) => !!item);

    const dispatch = useAppDispatch();

    return (
        <>
            <Fragment>
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
                                        <i>You haven't created any items in this section yet! Click "Add Item" to create
                                            some!</i>
                                    </TableCell>
                                </TableRow>
                        }
                        <TableRow>
                            <TableCell colSpan={6}>
                                <Box sx={{'display': 'flex', 'justifyContent': 'flex-end'}}>
                                    <Button
                                        onClick={(e) => {
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
            </Fragment>
            <Dialog
                open={newItemDialogIsOpen}
                onClose={() => setNewItemDialogIsOpen(false)}
                slotProps={{
                    paper: {
                        component: "form",
                        onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => {
                            event.preventDefault()

                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries((formData as any).entries());
                            const itemName: string = formJson.itemName;
                            const amount: number = formJson.amount;


                            // Close the dialog
                            setNewItemDialogIsOpen(false)
                        }
                    }
                }}>
                <DialogTitle>Create an Item</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the name and amount for the item. It will be created under "{section.name}".
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="itemName"
                        label="Item Name"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="amount"
                        name="amount"
                        label="Amount"
                        type="number"
                        fullWidth
                        variant="standard"
                        slotProps={{
                            htmlInput: {
                                step: 0.01
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNewItemDialogIsOpen(false)}>Cancel</Button>
                    <Button type="submit">Create</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}