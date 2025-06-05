import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { RootState } from "@/lib/store";
import IncomeItemComponent from "./IncomeItemComponent";
import { Edit, Palette, Delete, Add } from "@mui/icons-material";
import { Card, CardHeader, IconButton, Table, TableHead, TableRow, TableCell, TableBody, CardActions, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

export default function IncomeSectionComponent() {
	const [newItemDialogIsOpen, setNewItemDialogIsOpen] = useState(false);
	const dispatch = useAppDispatch();

	const incomeItems = useAppSelector((state: RootState) => state.budget.incomeItems);

	return (
		<>
			<Card elevation={1} className={`rounded-s mb-2 p-1.5 bg-slate-700 text-white`} id="section-income">
				<CardHeader
				title="Income"
				/>
				<Card elevation={2} className="ml-[1rem] mr-4.5">
					<Table>
						{
							Object.values(incomeItems).length > 0 ?
								<>
									<TableHead>
										<TableRow className={`p-1.5 bg-slate-400`}>
											<TableCell className="font-bold p-1.5 w-auto">Name</TableCell>
											<TableCell className="font-bold p-1.5 w-[100px] text-center">Planned</TableCell>
											<TableCell className="font-bold p-1.5 w-[106px] text-center">Actions</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{Object.values(incomeItems).map((item, index) => { console.log(item); return (<IncomeItemComponent item={item} index={index} key={item.databaseID} />) })}
									</TableBody>
								</>
								: <TableHead>
									<TableRow className={`p-1.5 bg-slate-400`}>
										<TableCell>
											<i>You haven't created any income items yet! Click "Add Item" to create some!</i>
										</TableCell>
									</TableRow>
								</TableHead>
						}
					</Table>
				</Card>
				<CardActions className="float-right">
					<Button 
					className="font-bold text-white" 
					//className={`w-full rounded-b-sm rounded-t-none text-black p-2 pt-1.5 pb-1.5 ${bgColor(section.color, 200)}`} 
					onClick={(e) => setNewItemDialogIsOpen(true)}
					startIcon={<Add />}
					variant="text">
						Add Item
					</Button>
				</CardActions>
			</Card>
			<Dialog 
				open={newItemDialogIsOpen}
				onClose={() => setNewItemDialogIsOpen(false)}
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
								"type": "budget/addIncomeItem",
								"payload": { 
									name: itemName, 
									amount: amount, 
								}
							});

							// Close the dialog
							setNewItemDialogIsOpen(false)
						}
					}
				}}>
				<DialogTitle>Create an Item</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please enter the name and amount for the income item.
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