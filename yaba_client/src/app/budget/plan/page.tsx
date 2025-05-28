'use client';

import { useAppSelector, useAppDispatch } from "@/app/hooks"
import { AppStore, RootState } from "@/lib/store"
import type { AppState, BudgetSection, BudgetState } from "@/lib/types"
import BudgetSectionComponent from "./components/BudgetSectionComponent";
import BudgetSectionListComponent from "./components/BudgetSectionListComponent";
import BottomRightPlusButtonComponent from "../components/BottomRightPlusButtonComponent";

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from "@mui/material";

export default function PlanPage() {
	const openDialogName: string = useAppSelector((state: RootState) => state.app.openDialog);

	const dispatch = useAppDispatch();
	const openDialog = (name: string) => dispatch({"type": "app/openDialog", "payload": {"dialog": "newBudgetSection"}});
	const closeDialog = () => dispatch({type: "app/closeDialog"});

	return (
		<>
			<main>
				<BudgetSectionListComponent />
				<BottomRightPlusButtonComponent onClick={(e) => openDialog("newBudgetSection")} />
			</main>
			<Dialog 
				open={openDialogName === "newBudgetSection"}
				onClose={closeDialog}
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
								"type": "budget/addSection",
								"payload": {
									"name": sectionName,
									"databaseID": 123
								}
							});

							// Close the dialog
							closeDialog()
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
					<Button onClick={closeDialog}>Cancel</Button>
					<Button type="submit">Create</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}
