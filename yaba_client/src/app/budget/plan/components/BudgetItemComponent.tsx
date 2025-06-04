'use client';

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, IconButton, TableRow, TableCell } from "@mui/material";
import { useAppDispatch } from "@/app/hooks";
import { bgColor } from "@/lib/color_utils";
import type { BudgetSection, BudgetItem } from "@/lib/types";
import { Add, Delete, Edit } from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* Display an item in a Budget Section. 
 */
export default function BudgetSectionComponent({ item, color, index }: Readonly<{ item: BudgetItem, color: string, index: number }>) {
	const router = useRouter();

	const dispatch = useAppDispatch()

	const [editDialogIsOpen, setEditDialogIsOpen] = useState(false)
	const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false)

	return (
		<>
			<TableRow 
				className={`${ index % 2 === 0 ? bgColor(color, 50) : bgColor(color, 100)} text-black`}
				id={`item-${item.databaseID}`}
			>
				<TableCell className="p-2">{item.name}</TableCell>
				<TableCell className="p-2 text-center">${item.amount}</TableCell>
				<TableCell className="p-2 text-center">
					<IconButton title="Edit" onClick={(e) => setEditDialogIsOpen(true)}><Edit /></IconButton>
					<Link
					href={{
						pathname: "./transactions",
						query: {
							"create_transaction": 1,
							"itemid": item.databaseID 
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
								"type": "budget/alterItem",
								"payload": { 
									databaseID: item.databaseID, 
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
								"type": "budget/deleteItem",
								"payload": { 
									databaseID: item.databaseID
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