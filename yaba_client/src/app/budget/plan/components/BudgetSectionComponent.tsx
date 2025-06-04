'use client';

import type { BudgetSection } from "@/lib/types";
import BudgetItemComponent from "./BudgetItemComponent";

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, IconButton, Table, TableHead, TableRow, TableCell, TableBody, RadioGroup, Radio, Grid, Card, CardHeader, CardActions } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { bgColor, colors, textColor } from "@/lib/color_utils";

import { Add, Check, Delete, Edit, Palette } from "@mui/icons-material"
import { RootState } from "@/lib/store";
import ColorPicker from "./ColorPickerComponent";

/* A section of the budget.
 */
export default function BudgetSectionComponent({ section }: Readonly<{ section: BudgetSection }>) {
	const [renameDialogIsOpen, setRenameDialogIsOpen] = useState(false);
	const [recolorDialogIsOpen, setRecolorDialogIsOpen] = useState(false);
	const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
	const [newItemDialogIsOpen, setNewItemDialogIsOpen] = useState(false);

	const idToItemMap = useAppSelector((state: RootState) => state.budget.items);

	const itemsAndIDs = Object.entries(idToItemMap).filter(([id, item]) => item !== undefined && item.sectionID === section.databaseID);

	const dispatch = useAppDispatch();

	return (
		<>
			<Card elevation={1} className={`rounded-s mb-2 p-1.5 ${bgColor(section.color, 500)}`} id={`section-${section.databaseID}`}>
				<CardHeader
				action={
					<>
					<IconButton title="Rename" className="basis-50" onClick={(e) => setRenameDialogIsOpen(true)}><Edit /></IconButton>
					<IconButton title="Recolor" className="basis-50" onClick={(e) => setRecolorDialogIsOpen(true)}><Palette /></IconButton>
					<IconButton title="Delete" className="basis-50" onClick={(e) => setDeleteDialogIsOpen(true)}><Delete /></IconButton>
					</>
				}
				title={section.name}
				/>
				<Card elevation={2} className="ml-[1rem] mr-4.5">
					<Table>
						{
							section.itemIDs.length > 0 ?
								<>
									<TableHead>
										<TableRow className={`p-1.5 ${bgColor(section.color, 200)}`}>
											<TableCell className="font-bold p-1.5 w-auto">Name</TableCell>
											<TableCell className="font-bold p-1.5 w-10 text-center">Amount</TableCell>
											<TableCell className="font-bold p-1.5 w-[160px] text-center">Actions</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{itemsAndIDs.map(([id, item], index) => { console.log(item); return (<BudgetItemComponent item={item} color={section.color} index={index} key={index} />) })}
									</TableBody>
								</>
								: <TableHead>
									<TableRow className={`p-1.5 ${bgColor(section.color, 200)}`}>
										<TableCell>
											<i>You haven't created any items in this section yet! Click "Add Item" to create some!</i>
										</TableCell>
									</TableRow>
								</TableHead>
						}
					</Table>
				</Card>
				<CardActions className="float-right">
					<Button 
					className={`font-bold ${textColor(section.color, 950)}`} 
					//className={`w-full rounded-b-sm rounded-t-none text-black p-2 pt-1.5 pb-1.5 ${bgColor(section.color, 200)}`} 
					onClick={(e) => setNewItemDialogIsOpen(true)}
					startIcon={<Add />}
					variant="text">
						Add Item
					</Button>
				</CardActions>
			</Card>
			<Dialog 
				open={renameDialogIsOpen}
				onClose={() => setRenameDialogIsOpen(false)}
				slotProps={{
					paper: {
						component: "form",
						onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
							event.preventDefault()

							const formData = new FormData(event.currentTarget);
							const formJson = Object.fromEntries((formData as any).entries());
							const sectionName = formJson.sectionName;
							console.log(sectionName);

							dispatch({
								"type": "budget/renameSection",
								"payload": {
									"newName": sectionName,
									"databaseID": section.databaseID
								}
							});

							// Close the dialog
							setRenameDialogIsOpen(false)
						}
					}
				}}>
				<DialogTitle>Renaming '{section.name}'</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please enter the new name for this section.
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
					<Button onClick={() => setRenameDialogIsOpen(false)}>Cancel</Button>
					<Button type="submit">Rename</Button>
				</DialogActions>
			</Dialog>
			<Dialog 
				open={recolorDialogIsOpen}
				onClose={() => setRecolorDialogIsOpen(false)}
				slotProps={{
					paper: {
						component: "form",
						onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
							event.preventDefault()

							const formData = new FormData(event.currentTarget);
							const formJson = Object.fromEntries((formData as any).entries());
							const newColor = formJson.newColor;

							dispatch({
								"type": "budget/recolorSection",
								"payload": {
									"newColor": newColor,
									"databaseID": section.databaseID
								}
							});

							// Close the dialog
							setRecolorDialogIsOpen(false)
						}
					}
				}}>
				<DialogTitle>Recoloring '{section.name}'</DialogTitle>
				<DialogContent>
					<DialogContentText className="mb-5">
						Please select the new color for this section.
					</DialogContentText>
					<ColorPicker defaultColor={section.color} />
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setRecolorDialogIsOpen(false)}>Cancel</Button>
					<Button type="submit">Recolor</Button>
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

							const formData = new FormData(event.currentTarget);

							dispatch({
								"type": "budget/deleteSection",
								"payload": {
									"databaseID": section.databaseID
								}
							});

							// Close the dialog
							setDeleteDialogIsOpen(false);
						}
					}
				}}>
				<DialogTitle>Delete "{section.name}"?</DialogTitle>
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
								"type": "budget/addItem",
								"payload": { 
									sectionDatabaseID: section.databaseID, 
									itemName: itemName, 
									itemAmount: amount, 
									itemIsCumulative: false 
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
	)
}