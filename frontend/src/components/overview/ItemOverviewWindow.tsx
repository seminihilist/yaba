'use client';

import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    TextField,
    IconButton,
    Radio,
Box, Typography, Divider, Table, TableRow, TableHead, TableCell,
    TableBody, RadioGroup, FormGroup, FormLabel, FormControlLabel
} from "@mui/material";
import {useEffect, useState} from "react";
import {Add, Close, Delete, Edit, ExpandMore} from "@mui/icons-material";
import React from "react";
import NewTransactionDialog from "@/components/overview/NewTransactionDialog";
import {ExpensesBar, IncomeBar} from "./IncomeExpenseBars";
import { CURRENCY_FORMAT } from "@/lib/formatters";

const DAY_FORMAT = Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    weekday: "short"
})

const TIME_FORMAT = Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    hour12: true,
    hourCycle: "h12",
    minute: "numeric",
})

/**
 * The overview window.
 * @param param0 The props of this component.
 * @constructor
 */
export default function ItemOverviewWindow(
    {
        openID,
        setOpenID,
        openKind,
        setOpenKind,
        onClose,
    }: Readonly<{
        openID: number,
        setOpenID: (newOpenID: number) => unknown,
        openKind: 'budget' | 'section' | 'item',
        setOpenKind: (newOpenKind: 'budget' | 'section' | 'item') => unknown,
        onClose: () => unknown
    }>) {

    const budgets = useAppSelector((state) => state.app.budgets);
    const sections = useAppSelector((state) => state.app.sections);
    const items = useAppSelector((state) => state.app.items);
    const transactions = useAppSelector((state) => state.app.transactions);

    const [newTransactionDialogIsOpen, setNewTransactionDialogIsOpen] = useState(false);

    const [transactionBeingEdited, setTransactionBeingEdited] = useState<number | null>(null);
    const [transactionBeingDeleted, setTransactionBeingDeleted] = useState<number | null>(null);

    const [deleteItemDialogIsOpen, setDeleteItemDialogIsOpen] = useState(false);

    const openDeleteItemDialog = () => setDeleteItemDialogIsOpen(true);
    const closeDeleteItemDialog = () => setDeleteItemDialogIsOpen(false);

    const dispatch = useAppDispatch();

    const item = items?.[openID];

    useEffect(() => {
        if (!item) {
            onClose();
        }
    }, []);

    if (!item) {
        return (<></>); // TODO: say "that item no longer exists"
    }

    const itemTransactions = Object.values(transactions)
        .filter(transaction => !!transaction)
        .filter(transaction => transaction.itemID === openID);

    return (<Box sx={{display: 'grid', gap: 2, margin: 1}}>
        <Box display={'flex'} flexDirection={'row'} width={'100%'} alignItems={'center'}
             justifyContent={'space-between'}>
            <Typography variant={"h4"}>{item.name}</Typography>
            <IconButton sx={{alignSelf: 'flex-end'}} title={"Back"} onClick={onClose}><Close/></IconButton>
        </Box>
        {
            item.kind === 'income' ? <IncomeBar incomeItems={[item]}/> : <ExpensesBar expenseItems={[item]}/>
        }
        <Divider/>
        <Typography variant={"h5"}>Details</Typography>
        <TextField label={"Name"} value={item.name} onChange={(e) => dispatch({
            type: "app/alterItem",
            payload: {id: item.id, newName: e.currentTarget.value, newAmount: item.amount}
        })}/>
        <TextField label={"Amount"} type={"number"} value={item.amount} onChange={(e) => {
            if (isNaN(parseFloat(e.currentTarget.value))) {
                if (e.currentTarget.value.trim() === "") {
                    e.currentTarget.value = "0";
                } else {
                    return;
                }
            }

            dispatch({
                type: "app/alterItem",
                payload: {id: item.id, newName: item.name, newAmount: parseFloat(e.currentTarget.value)}
            });
        }}/>
        <FormGroup>
            <FormLabel>Kind</FormLabel>
            <RadioGroup value={item.kind} onChange={(e) => {
                dispatch({
                    type: 'app/setItemKind',
                    payload: {
                        id: item.id,
                        newKind: e.currentTarget.value,
                    }
                })
            }}>
                <FormControlLabel value="income" control={<Radio/>} label="Income"/>
                <FormControlLabel value="expense" control={<Radio/>} label="Expense"/>
            </RadioGroup>
        </FormGroup>
        <Button color={'error'} startIcon={<Delete/>} onClick={openDeleteItemDialog}>Delete Item</Button>
        <Divider/>
        <Box display={"flex"} flexDirection={"row"}>
            <Typography variant={"h5"} width={"100%"}>Transaction Log</Typography>
            <IconButton onClick={() => setNewTransactionDialogIsOpen(true)}
                        title={"Add Transaction"}><Add/></IconButton>
        </Box>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell sx={{padding: '4px'}}>Date</TableCell>
                    <TableCell sx={{padding: '4px'}}>Time</TableCell>
                    <TableCell sx={{padding: '4px'}}>Amount</TableCell>
                    <TableCell sx={{padding: '4px'}} colSpan={2} align={'center'}>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {itemTransactions.toSorted((left, right) => right.timestamp - left.timestamp).map((transaction, index) => {
                    const date = new Date(transaction.timestamp);

                    return (
                        <TableRow key={transaction.id}>
                            <TableCell sx={{padding: '4px'}}>{DAY_FORMAT.format(date)}</TableCell>
                            <TableCell sx={{padding: '4px'}}>{TIME_FORMAT.format(date)}</TableCell>
                            <TableCell sx={{padding: '4px'}}>
                                {CURRENCY_FORMAT.format((item.kind === 'income' ? 1 : -1) * transaction.amount)}
                            </TableCell>
                            <TableCell sx={{padding: '4px'}}><IconButton title={"Edit Transaction"} size={"small"}
                                                                         onClick={e => setTransactionBeingEdited(transaction.id)}><Edit/></IconButton></TableCell>
                            <TableCell sx={{padding: '4px'}}><IconButton title={"Delete Transaction"} size={"small"}
                                                                         onClick={e => setTransactionBeingDeleted(transaction.id)}><Delete
                                color={"error"}/></IconButton></TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
        <Button variant={"contained"} startIcon={<Add/>} onClick={(e) => setNewTransactionDialogIsOpen(true)}>Add
            Transaction</Button>
        <NewTransactionDialog isOpen={newTransactionDialogIsOpen} close={() => setNewTransactionDialogIsOpen(false)}
                              itemID={item.id}/>
        <Dialog open={Boolean(transactionBeingEdited)}
                onClose={() => setTransactionBeingEdited(null)}>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter the new amount of the transaction.
                </DialogContentText>
                <form onSubmit={(e) => {
                    e.preventDefault(); // don't send the data off anywhere

                    const formData = new FormData(e.currentTarget);
                    const formJson = Object.fromEntries((formData).entries());
                    const amount = Number(formJson.amount);

                    dispatch({
                        type: "app/editTransaction",
                        payload: {
                            id: transactionBeingEdited,
                            amount: amount,
                        }
                    });

                    // Close the dialog
                    setTransactionBeingEdited(null);
                }}>
                    <TextField
                        required
                        margin="dense"
                        name="amount"
                        label="New Amount"
                        type="number"
                        fullWidth
                        defaultValue={!!transactionBeingEdited ? transactions[transactionBeingEdited]?.amount : null}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={(e) => setTransactionBeingEdited(null)}>Cancel</Button>
                <Button type="submit">Edit</Button>
            </DialogActions>
        </Dialog>
        <Dialog open={Boolean(transactionBeingDeleted)}
                onClose={() => setTransactionBeingDeleted(null)}>
            <DialogTitle>Delete Transaction?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure? You cannot undo this action.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={(e) => setTransactionBeingDeleted(null)}>Cancel</Button>
                <Button type="submit" onClick={e => {
                    dispatch({
                        type: "app/deleteTransaction",
                        payload: {
                            id: transactionBeingDeleted,
                        }
                    });

                    setTransactionBeingDeleted(null);
                }}>Delete</Button>
            </DialogActions>
        </Dialog>
        <Dialog open={deleteItemDialogIsOpen}
                onClose={closeDeleteItemDialog}>
            <DialogTitle>Delete "{item.name}"?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure? You cannot undo this action.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDeleteItemDialog}>Cancel</Button>
                <Button type="submit" color={'error'} onClick={e => {
                    dispatch({
                        type: "app/deleteItem",
                        payload: {
                            id: item.id,
                        }
                    });

                    closeDeleteItemDialog();
                }}>Delete</Button>
            </DialogActions>
        </Dialog>
    </Box>);
}
