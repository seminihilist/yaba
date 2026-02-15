'use client';

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { bgColor } from "@/lib/color_utils";
import { RootState } from "@/lib/store";
import { Transaction } from "@/lib/types";
import { Edit, Delete } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemText, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useState } from "react";

/* An item in the transaction list of that tab. Given a transaction object from the Redux store, displays the name of the budget item, the amount spent, and
   buttons to edit or delete the transaction.  
 */
export default function TransactionComponent({ transaction }: Readonly<{ transaction: Transaction }>) {
	const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
	const dispatch = useAppDispatch();

	const timeFormatter = new Intl.DateTimeFormat(navigator.language, {
		hour: "numeric",
		minute: "2-digit"
	})

	const idToItemMap = useAppSelector((state: RootState) => state.items)
	const idToSectionMap = useAppSelector((state: RootState) => state.sections)

	const item = idToItemMap[transaction.itemID]

    if (item === undefined) {
        console.error(`transaction #${transaction.id} is attached to non-existent item #${transaction.itemID}`);
        return <></>;
    }

	const section = idToSectionMap[item.sectionID]

    if (section === undefined) {
        console.error(`item #${item.id} is attached to non-existent section #${item.sectionID}`);
        return <></>;
    }

	return (
		<>
			<TableRow className={bgColor(section.color, 50)}>
				<TableCell>{item.name} <i>({section.name})</i></TableCell>
				<TableCell className="w-30 text-center">${transaction.amount}</TableCell>
				<TableCell className="w-25 text-center">{timeFormatter.format(new Date(transaction.dateString))}</TableCell>
				<TableCell className="w-20 text-center">
					<IconButton onClick={() => setDeleteDialogIsOpen(true)}><Delete /></IconButton>
				</TableCell> 
			</TableRow>
			<Dialog
				open={deleteDialogIsOpen}
				onClose={() => setDeleteDialogIsOpen(false)}
				slotProps={{
					paper: {
						component: "form",
						onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
							event.preventDefault()

							dispatch({
								"type": "budget/deleteTransaction",
								"payload": { 
									id: transaction.id
								}
							});

							// Close the dialog
							setDeleteDialogIsOpen(false)
						}
					}
				}}>
				<DialogTitle>Delete Transaction?</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete the transaction "${transaction.amount} from {item.name}"? This action cannot be undone.
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