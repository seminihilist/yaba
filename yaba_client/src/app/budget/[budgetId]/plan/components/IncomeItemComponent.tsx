import { useAppDispatch } from "@/app/hooks";
import { IncomeItem } from "@/lib/types";
import { Edit, Delete } from "@mui/icons-material";
import { TableRow, TableCell, IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

export default function IncomeItemComponent({ item, index }: Readonly<{ item: IncomeItem, index: number }>) {
	const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
	const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);

	const dispatch = useAppDispatch();

	return (
		<>
			<TableRow 
				className={`${ index % 2 === 0 ? "bg-slate-200" : "bg-slate-300"} text-black`}
				id={`income-item-${index}`}
			>
				<TableCell className="p-2">{item.name}</TableCell>
				<TableCell className="p-2 text-center">${item.amount}</TableCell>
				<TableCell className="p-2 text-center">
					<IconButton title="Edit" onClick={(e) => setEditDialogIsOpen(true)}><Edit /></IconButton>
					<IconButton title="Delete" onClick={(e) => setDeleteDialogIsOpen(true)}><Delete /></IconButton>
				</TableCell>
			</TableRow>

			{/* Edit Dialog */}
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
							const newName = formJson.newName;
							const newAmount = formJson.newAmount;

							dispatch({
								"type": "app/alterIncomeItem",
								"payload": {
									name: newName,
									amount: newAmount,
									id: item.id
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
						id="newName"
						name="newName"
						label="New Name"
						type="text"
						fullWidth
						variant="standard"
						defaultValue={item.name}
					/>
					<TextField
						autoFocus
						required
						margin="dense"
						id="newAmount"
						name="newAmount"
						label="New Amount"
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

			{/* Delete Dialog */}
			<Dialog 
				open={deleteDialogIsOpen}
				onClose={() => setDeleteDialogIsOpen(false)}
				slotProps={{
					paper: {
						component: "form",
						onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
							event.preventDefault()

							dispatch({
								"type": "app/deleteIncomeItem",
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
					<Button type="submit" className="text-red-500">Delete</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}