'use strict';
'use client';

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, IconButton, TableRow, TableCell } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {bgColor, Color} from "@/lib/color_utils";
import type {Section, Item, Budget, AppState} from "@/lib/types";
import { Add, Delete, Edit } from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RootState } from "@/lib/store";
import {createSelector} from "reselect";

/* Display an item in a Budget Section. 
 */
export default function BudgetItemComponent({ budget, item, color, index }: Readonly<{ budget: Budget, item: Item, color: Color, index: number }>) {
	const dispatch = useAppDispatch()

	const [editDialogIsOpen, setEditDialogIsOpen] = useState(false)
	const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false)

    const transactions = useAppSelector(
        (state) => item.transactionIDs.map((id) => state.transactions[id])
    ).filter((transaction) => typeof transaction !== "undefined");

    // Total up the amount spent from the item so far, and how much is left
	const totalSpent = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
	const amountRemaining = item.amount - totalSpent;

	return (
		<>
			<TableRow 
				className={`${ index % 2 === 0 ? bgColor(color, 50) : bgColor(color, 100)} text-black`}
				id={`item-${item.id}`}
			>
				<TableCell className="p-2">{item.name}</TableCell>
				<TableCell className="p-2 text-center">${item.amount}</TableCell>
				<TableCell className="p-2 text-center">-${totalSpent}</TableCell>
				<TableCell className="p-2 text-center">${amountRemaining}</TableCell>
				<TableCell className="p-2 text-center">
					<IconButton title="Edit" onClick={(e) => setEditDialogIsOpen(true)}><Edit /></IconButton>
					<Link
					href={{
						pathname: "./transactions",
						query: {
							"create_transaction": 1,
							"itemid": item.id
						}
					}}
					>
						<IconButton title="Add Transaction"><Add /></IconButton>
					</Link>
					<IconButton title="Delete" onClick={(e) => setDeleteDialogIsOpen(true)}><Delete /></IconButton>
				</TableCell>
			</TableRow>
			<Dialog 
				open={editDialogIsOpen}
				onClose={() => setEditDialogIsOpen(false)}
				slotProps={{
					paper: {
						component: "form",
						onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
							event.preventDefault()

							const formData = new FormData(event.currentTarget);
							const formJson = Object.fromEntries((formData as any).entries());
							const itemName: string = formJson.itemName;
							const amount: number = formJson.amount;

							dispatch({
								"type": "app/alterItem",
								"payload": { 
									id: item.id,
									newName: itemName, 
									newAmount: amount 
								}
							});

							// Close the dialog
							setEditDialogIsOpen(false)
						}
					}
				}}>
				<DialogTitle>Editing "{item.name}"</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please enter the new name and amount for "{item.name}".
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
						defaultValue={item.name}
					/>
					<TextField
						autoFocus
						required
						margin="dense"
						id="name"
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
						defaultValue={item.amount}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setEditDialogIsOpen(false)}>Cancel</Button>
					<Button type="submit">Edit</Button>
				</DialogActions>
			</Dialog>
			<Dialog 
				open={deleteDialogIsOpen}
				onClose={() => setDeleteDialogIsOpen(false)}
				slotProps={{
					paper: {
						component: "form",
						onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
							event.preventDefault()

							dispatch({
								"type": "app/deleteItem",
								"payload": { 
									id: item.id
								}
							});

							// Close the dialog
							setDeleteDialogIsOpen(false)
						}
					}
				}}>
				<DialogTitle>Delete "{item.name}"?</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure? This action cannot be undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteDialogIsOpen(false)}>Cancel</Button>
					<Button type="submit">Delete</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}