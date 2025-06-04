'use client';

import { useAppSelector } from "@/app/hooks";
import { bgColor } from "@/lib/color_utils";
import { RootState } from "@/lib/store";
import { TransactionGroup } from "@/lib/types";
import { Delete, Edit, ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, IconButton, List, ListItem, ListItemText, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import TransactionComponent from "./TransactionComponent";

/* Display a group of transactions that occurred on the same date.
 */
export default function TransactionGroupComponent({ transactionGroup, openByDefault }: Readonly<{ transactionGroup: TransactionGroup, openByDefault: boolean }>) {
	const transactions = Object.values(useAppSelector((state: RootState) => state.budget.transactions))
	const myTransactions = transactions.filter((transaction) => transactionGroup.transactionIDs.includes(transaction.databaseID));
	
	const date = new Date(transactionGroup.dateString);

	const dateFormatter = new Intl.DateTimeFormat(navigator.language);

	return (
		<Accordion defaultExpanded={openByDefault}>
			<AccordionSummary
				expandIcon={<ExpandMore />}
				aria-controls={`transaction-group-${transactionGroup.databaseID}-content`}
				id={`transaction-group-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
			>
				<b>{dateFormatter.format(date)}</b>&nbsp;<i>({transactionGroup.transactionIDs.length} transactions)</i>
			</AccordionSummary>
			<AccordionDetails>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell className="font-bold basis-full">Item</TableCell>
							<TableCell className="font-bold w-30 text-center">Amount</TableCell>
							<TableCell className="font-bold w-25 text-center">Time</TableCell>
							<TableCell className="font-bold w-20 text-center"></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
					{
						myTransactions.toSorted((a, b) => {
							const dateA = new Date(a.dateString);
							const dateB = new Date(b.dateString);

							return dateB.getTime() - dateA.getTime(); // Sort in descending order
						}).map((transaction) => {
							return (
								<TransactionComponent transaction={transaction} key={transaction.databaseID} />
							)
						})
					}
					</TableBody>
				</Table>
			</AccordionDetails>
		</Accordion>
	);
}