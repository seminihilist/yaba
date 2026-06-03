"use client";

import BottomRightPlusButtonComponent from "./BottomRightPlusButtonComponent";
import BudgetSectionComponent from "./BudgetSectionComponent";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {bgColor, COLORS} from "@/lib/color_utils";
import {AppDispatch} from "../../store/store";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
    Button,
    Table, TableHead, TableCell, TableRow, TableBody, Card, Container
} from "@mui/material";
import React, {useState} from "react";
import {Budget, Item, Section} from "@/domain/types";
import {Add} from "@mui/icons-material";
import AddSectionButton from "@/components/budget/AddSectionButton";

export default function BudgetWindow({
                                         budget,
                                         sectionIsOpenInOverview,
                                         openSectionInOverview,
                                         itemIsOpenInOverview,
                                         openItemInOverview,
                                     }: Readonly<{
    budget: Budget;
    sectionIsOpenInOverview: (id: number) => boolean;
    openSectionInOverview: (id: number) => unknown;
    itemIsOpenInOverview: (id: number) => boolean;
    openItemInOverview: (id: number) => unknown;
}>) {
    const allSections = useAppSelector(state => state.app.sections);

    const mySections = budget.sections.map(section => allSections[section])
        .filter(section => !!section); // todo: errors if an undefined section is present

    const dispatch: AppDispatch = useAppDispatch();

    const [newSectionDialogIsOpen, setNewSectionDialogIsOpen] = useState(false);
    const closeNewSectionDialog = setNewSectionDialogIsOpen.bind(null, false);

    return (
        <>
            <Container sx={{padding: 2}}>
                <Card>
                    <Table sx={{display: 'table'}} size={'small'}>
                        <TableHead sx={{display: 'table-header-group'}}>
                            <TableRow sx={{display: 'table-row'}} className={`p-1.5`}>
                                <TableCell sx={{width: 8}}/>
                                <TableCell sx={{display: 'table-cell'}}
                                           className="font-bold w-auto"></TableCell>
                                <TableCell sx={{display: 'table-cell'}}
                                           className="font-bold w-25">Planned</TableCell>
                                <TableCell sx={{display: 'table-cell'}}
                                           className="font-bold w-25">Remaining</TableCell>
                                <TableCell sx={{display: 'table-cell'}}
                                           className="font-bold w-16">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{display: 'table-row-group'}}>
                            {[...mySections.map((section, index) => (
                                <BudgetSectionComponent budget={budget} section={section} key={section.id}
                                                        isOpenInOverview={sectionIsOpenInOverview(section.id)}
                                                        openInOverview={() => openSectionInOverview(section.id)}
                                                        itemIsOpenInOverview={itemIsOpenInOverview}
                                                        openItemInOverview={openItemInOverview}/>))]}
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <AddSectionButton openSectionInOverview={openSectionInOverview}/>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Card>
            </Container>
            <Dialog
                open={newSectionDialogIsOpen}
                onClose={closeNewSectionDialog}
                slotProps={{
                    paper: {
                        component: "form",
                        onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => {
                            event.preventDefault()

                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries((formData as any).entries());
                            const sectionName = formJson.sectionName;
                            console.log(sectionName);

                            dispatch({
                                "type": "app/addSection",
                                "payload": {
                                    "budgetID": budget.id,
                                    "name": sectionName,
                                    "color": COLORS[Math.round(Math.random() * (COLORS.length - 1))]
                                }
                            });

                            // Close the dialog
                            setNewSectionDialogIsOpen(false);
                        }
                    }
                }}>
                <DialogTitle>New Section</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the name of your new section.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="sectionName"
                        label="Section Name"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeNewSectionDialog}>Cancel</Button>
                    <Button type="submit">Create</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
