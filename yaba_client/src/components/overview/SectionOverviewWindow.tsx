'use client';

import {useAppDispatch, useAppSelector} from "../../lib/hooks";
import BottomRightPlusButtonComponent from "../budget/BottomRightPlusButtonComponent";
import {RootState} from "../../store/store";
import {Budget, Item, Section, Transaction} from "../../domain/types";

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    TextField,
    IconButton,
    Select,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Radio,
    AccordionProps,
    styled,
    Drawer, InputLabel, Box, Typography, Divider, LinearProgress, Container, Table, TableRow, TableHead, TableCell,
    TableBody
} from "@mui/material";
import {useEffect, useState} from "react";
import {Add, Close, Delete, Edit, ExpandMore} from "@mui/icons-material";
import React from "react";
import AmountSpentProgressBar from "@/components/overview/AmountSpentProgressBar";

/**
 * The overview window.
 * @param param0 The props of this component.
 * @constructor
 */
export default function SectionOverviewWindow(
    {
        section,
        setIsOpen,
    }: Readonly<{
        section: Section;
        setIsOpen: (newIsOpen: boolean) => unknown;
    }>) {

    const sectionItems = Object.values(useAppSelector((state) => state.app.items)).filter(item => !!item).filter((item) => item.sectionID === section.id);
    const transactions = useAppSelector((state) => state.app.transactions);
    const sectionTransactions = sectionItems.flatMap(item => item.transactionIDs.map(transactionID => transactions[transactionID])).filter(transaction => !!transaction);

    const totalSpent = sectionTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalPlanned = sectionItems.reduce((sum, item) => sum + item.amount, 0);

    const [deleteSectionDialogIsOpen, setDeleteSectionDialogIsOpen] = useState(false);

    const openDeleteSectionDialog = () => setDeleteSectionDialogIsOpen(true);
    const closeDeleteSectionDialog = () => setDeleteSectionDialogIsOpen(false);

    const dispatch = useAppDispatch();

    return (<Box sx={{display: 'grid', gap: 2, margin: 1}}>
        <Box display={'flex'} flexDirection={'row'} width={'100%'} alignItems={'center'}
             justifyContent={'space-between'}>
            <Typography variant={"h4"}>{section.name}</Typography>
            <IconButton sx={{alignSelf: 'flex-end'}} title={"Close Overview"} onClick={(e) => setIsOpen(false)}><Close/></IconButton>
        </Box>
        <AmountSpentProgressBar amountSpent={totalSpent} amountPlanned={totalPlanned}/>
        <Divider/>
        <Typography variant={"h5"}>Details</Typography>
        <TextField label={"Name"} value={section.name} onChange={(e) => dispatch({
            type: "app/renameSection",
            payload: {id: section.id, newName: e.currentTarget.value}
        })}/>
        <Button color={'error'} startIcon={<Delete/>} onClick={openDeleteSectionDialog}>Delete Section</Button>
        <Dialog open={deleteSectionDialogIsOpen}
                onClose={closeDeleteSectionDialog}>
            <DialogTitle>Delete Section?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure? You cannot undo this action.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDeleteSectionDialog}>Cancel</Button>
                <Button type="submit" color={'error'} onClick={e => {
                    dispatch({
                        type: "app/deleteSection",
                        payload: {
                            id: section.id,
                        }
                    });

                    closeDeleteSectionDialog();
                }}>Delete</Button>
            </DialogActions>
        </Dialog>
    </Box>);
}
