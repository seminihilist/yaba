'use client';

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import BottomRightPlusButtonComponent from "../components/BottomRightPlusButtonComponent";
import { RootState } from "@/lib/store";
import { BudgetItem, BudgetSection, ItemMap, Transaction, TransactionGroup } from "@/lib/types";
import TransactionGroupComponent from "./components/TransactionGroupComponent";

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, IconButton, Select, Accordion, AccordionDetails, AccordionSummary, Radio, AccordionProps, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { ExpandMore } from "@mui/icons-material";
import { bgColor } from "@/lib/color_utils";
import React from "react";
import { useSearchParams } from "next/navigation";

const MyAccordion = styled((props: AccordionProps) => (
	<Accordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
	border: `1px solid ${theme.palette.divider}`,
	'&:not(:last-child)': {
    	borderBottom: 0,
	},
	'&::before': {
		display: 'none',
	},
}));

export default function TransactionsPage() {
	const params = useSearchParams();

	const [newTransactionDialogIsOpen, setNewTransactionDialogIsOpen] = useState(false);

	// ntd stands for New Transaction Dialog
	const [ntdOpenAccordion, setNtdOpenAccordion] = useState(-1); 

	const [ntdSelectedItem, setNtdSelectedItem] = useState(-1); // set to the databaseID of the item

	const transactionGroups: Array<TransactionGroup> = Object.values(useAppSelector((state: RootState) => state.budget.transactionGroups)).toSorted((a, b) => {
		const dateA = new Date(a.dateString);
		const dateB = new Date(b.dateString);

		return dateB.getTime() - dateA.getTime(); // Sort in descending order
	});

	const transactions: Array<Transaction> = Object.values(useAppSelector((state: RootState) => state.budget.transactions));

	// IDs become strings in objects, so we need to worry about that
	const sectionsAndIDs: Array<[string, BudgetSection]> = Object.entries(useAppSelector((state: RootState) => state.budget.sections))

	// IDs become strings in objects, so we need to worry about that
	const idToItemMap: ItemMap = useAppSelector((state: RootState) => state.budget.items)
	const itemsAndIDs: Array<[string, BudgetItem]> = Object.entries(idToItemMap)

	const dispatch = useAppDispatch();

	const openNewTransactionDialog = () => {
		setNewTransactionDialogIsOpen(true);

		// Open the first accordion (budget section)
		setNtdOpenAccordion(0);

		// Select the first item of the first section
		setNtdSelectedItem(sectionsAndIDs[0][1].itemIDs[0])
	}

	const closeNewTransactionDialog = () => {
		setNewTransactionDialogIsOpen(false);

		// Clear the open accordion and selected item
		setNtdOpenAccordion(-1);
		setNtdSelectedItem(-1);
	}

	// This is the jankiest piece of code in the whole project
	useEffect(() => {
		if (params.has("create_transaction", "1")) {

			const itemID = params.get("itemid");

			if (itemID !== null && Object.keys(idToItemMap).includes(itemID)) {
				const item = idToItemMap[itemID];

				setNtdOpenAccordion(0); // TODO: Make this so that it opens the right accordion
				setNtdSelectedItem(parseInt(itemID));
				setNewTransactionDialogIsOpen(true);

				const url = new URL(window.location.href);
				url.searchParams.forEach((value, key) => url.searchParams.delete(key))
				window.history.replaceState(null, '', url.toString());
			}
		}
	});

	return (
		<>
				{
					transactionGroups.length > 0 ?
						<main>
							{
								transactionGroups.map(
									(transactionGroup, index) => (
										<TransactionGroupComponent 
										transactionGroup={transactionGroup} 
										key={transactionGroup.databaseID} 
										openByDefault={index === 0} // The first (most recent) group in the array should be open by default
										/>
									)
								)
							}
						</main>
						: <main className="flex flex-row justify-center items-center h-full">
							<p>No transactions yet! Click the plus button in the bottom right corner or on a budget item to create some!</p>
						</main>
				}
			<BottomRightPlusButtonComponent onClick={openNewTransactionDialog} />
			<Dialog 
				open={newTransactionDialogIsOpen}
				onClose={closeNewTransactionDialog}
				slotProps={{
					paper: {
						component: "form",
						onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
							event.preventDefault()

							const formData = new FormData(event.currentTarget);
							const formJson = Object.fromEntries((formData as any).entries());
							const amount = Number(formJson.amount);

							const [id, item]: [string, BudgetItem] = itemsAndIDs.filter(([idStr, item]) => item.databaseID === ntdSelectedItem)[0]; // There should be only one match, so we get the first

							const itemAmountRemaining = item.amount - 
								transactions.filter((transaction) => transaction.itemID === item.databaseID)
									.reduce((acc, transaction) => acc + transaction.amount, 0)

							console.log("ABCDEF!!!!!:D")

							dispatch({
								"type": "budget/addTransaction",
								"payload": {
									"itemDatabaseID": item.databaseID,
									"amount": amount,
									"dateString": new Date(Date.now()).toISOString()
								}
							});

							// Close the dialog
							closeNewTransactionDialog();
						}
					}
				}}>
				<DialogTitle>New Transaction</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please select the item and amount of the transaction.
					</DialogContentText>
					{
						sectionsAndIDs.map(([idStr, section], index) => (
							<MyAccordion 
								key={section.databaseID}
								expanded={index === ntdOpenAccordion}
								onChange={() => {
									if (index === ntdOpenAccordion) { // Then this accordion is the one currently open
										setNtdOpenAccordion(-1);
									} else { // Then this accordion is not currently open
										setNtdOpenAccordion(index);
									}
								}}
								slotProps={{ heading: { component: 'h4' } }}
							>
								<AccordionSummary
									expandIcon={<ExpandMore />}
									aria-controls={`panel1-content`}
									id={`section-accordion-${index}}`}
									className={bgColor(section.color, 400)}
								>
									{section.name}
								</AccordionSummary>
								<AccordionDetails className={bgColor(section.color, 100)}>
									{
										section.itemIDs.map((itemID, index) => (
											<React.Fragment key={itemID}>
												<Radio
													checked={itemID === ntdSelectedItem}

													onChange={() => {
														setNtdSelectedItem(itemID);

														// Somewhat hacky way to validate the amount input when a new item is selected
														const item = idToItemMap[itemID];

														console.log(transactions.filter((transaction) => transaction.itemID === item.databaseID))

														const itemAmountRemaining = item.amount - 
															transactions.filter((transaction) => transaction.itemID === item.databaseID)
																.reduce((acc, transaction) => acc + transaction.amount, 0)

														console.log("Item amount remaining: ", itemAmountRemaining);

														const amountInput = (document.querySelector("#new-transaction-amount-htmlInput") as HTMLInputElement);

														if (amountInput.valueAsNumber > itemAmountRemaining) {
															// Then we are trying to spend more than the item has available!
															amountInput.setCustomValidity(`There isn't enough money left in ${item.name}! ${item.name} only has $${itemAmountRemaining} available!`);
														} else {
															amountInput.setCustomValidity(""); // Clear the custom validity message
														}
													}}
													value={itemID}
													name="budget-item-radios"
												/>
												<h2 className="inline-block">{idToItemMap[itemID]?.name}</h2>
												<br />
											</React.Fragment>
										))
									}
								</AccordionDetails>
							</MyAccordion>
						))
					}
					<TextField
						required
						margin="dense"
						id="new-transaction-amount"
						name="amount"
						label="Amount"
						type="number"
						onChange={(event) => {
							console.log("Change event triggered for amount input");

							const [id, item]: [string, BudgetItem] = itemsAndIDs.filter(([idStr, item]) => item.databaseID === ntdSelectedItem)[0]; // There should be only one match, so we get the first

							const itemAmountRemaining = item.amount - 
								transactions.filter((transaction) => transaction.itemID === item.databaseID)
									.reduce((acc, transaction) => acc + transaction.amount, 0)

							if (Number(event.currentTarget.value) > itemAmountRemaining) {
								// Then we are trying to spend more than the item has available!
								event.currentTarget.setCustomValidity(`There isn't enough money left in ${item.name}! ${item.name} only has $${itemAmountRemaining} available!`);
							} else {
								event.currentTarget.setCustomValidity(""); // Clear the custom validity message
							}
						}}
						slotProps={{
							htmlInput: {
								id: "new-transaction-amount-htmlInput",
								min: 0.01, // Why would you ever have a transaction of less than 1 cent?
								step: 0.01,
								onChange: (event: React.FormEvent<HTMLInputElement>) => {
									console.log("Change event triggered for amount input");

									const [id, item]: [string, BudgetItem] = itemsAndIDs.filter(([idStr, item]) => item.databaseID === ntdSelectedItem)[0]; // There should be only one match, so we get the first

									const itemAmountRemaining = item.amount - 
										transactions.filter((transaction) => transaction.itemID === item.databaseID)
											.reduce((acc, transaction) => acc + transaction.amount, 0)

									if (event.currentTarget.valueAsNumber > itemAmountRemaining) {
										// Then we are trying to spend more than the item has available!
										event.currentTarget.setCustomValidity(`${item.name} only has $${itemAmountRemaining} available!`);
									} else {
										event.currentTarget.setCustomValidity(""); // Clear the custom validity message
									}
								}
							}
						}}
						fullWidth
						variant="standard"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeNewTransactionDialog}>Cancel</Button>
					<Button type="submit">Create</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
