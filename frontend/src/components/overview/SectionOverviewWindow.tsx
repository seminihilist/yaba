'use client';

import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {Section} from "@/domain/types";

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    TextField,
    IconButton,
    Box, Typography, Divider
} from "@mui/material";
import {useState} from "react";
import {Close, Delete} from "@mui/icons-material";
import React from "react";
import {ExpensesBar, IncomeBar} from "./IncomeExpenseBars";
import _ from "lodash";

/**
 * The overview window.
 * @param param0 The props of this component.
 * @constructor
 */
export default function SectionOverviewWindow(
    {
        section,
        onClose,
    }: Readonly<{
        section: Section;
        onClose: () => unknown;
    }>) {

    const sectionItems = Object.values(useAppSelector((state) => state.app.items)).filter(item => !!item).filter((item) => item.sectionID === section.id);

    const [deleteSectionDialogIsOpen, setDeleteSectionDialogIsOpen] = useState(false);

    const openDeleteSectionDialog = () => setDeleteSectionDialogIsOpen(true);
    const closeDeleteSectionDialog = () => setDeleteSectionDialogIsOpen(false);

    const dispatch = useAppDispatch();

    const [incomeItems, expenseItems] = _.partition(sectionItems, item => item.kind === 'income');

    return (<Box sx={{display: 'grid', gap: 2, margin: 1}}>
        <Box display={'flex'} flexDirection={'row'} width={'100%'} alignItems={'center'}
             justifyContent={'space-between'}>
            <Typography variant={"h4"}>{section.name}</Typography>
            <IconButton sx={{alignSelf: 'flex-end'}} title={"Back"} onClick={onClose}><Close/></IconButton>
        </Box>
        {incomeItems.length > 0 &&
            <>
                <Divider/>
                <Typography variant={'h5'}>Income in {section.name}</Typography>
                <IncomeBar incomeItems={incomeItems}/>
            </>
        }
        {expenseItems.length > 0 &&
            <>
                <Divider/>
                <Typography variant={'h5'}>Expenses in {section.name}</Typography>
                <ExpensesBar expenseItems={expenseItems}/>
            </>
        }
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
                <Button type="submit" color={'error'} onClick={() => {
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
