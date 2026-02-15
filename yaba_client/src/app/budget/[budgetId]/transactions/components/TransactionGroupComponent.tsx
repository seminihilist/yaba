'use client';

import { useAppSelector } from "@/app/hooks";
import { bgColor } from "@/lib/color_utils";
import { RootState } from "@/lib/store";
import { Delete, Edit, ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, IconButton, List, ListItem, ListItemText, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import TransactionComponent from "./TransactionComponent";
import { DateTime } from "luxon";
import {Transaction} from "@/lib/types";

/* Display a group of transactions that occurred on the same date.
 */
export default function TransactionGroupComponent({ date, openByDefault }: Readonly<{
    /* The day this group is defined by. */
    date: DateTime,
    openByDefault: boolean
}>) {
    // TODO: avoid iterating over every transaction for every date
	const allTransactions =
        Object.values(useAppSelector((state: RootState) => state.transactions))
            .filter((transaction) => transaction !== undefined);

	const myTransactions =
        allTransactions.filter(transaction =>
            DateTime.fromISO(transaction.dateString).hasSame(date, "day")
        );

	return (
		<Accordion defaultExpanded={openByDefault}>
			<AccordionSummary
				expandIcon={<ExpandMore />}
				aria-controls={`transaction-group-${date.toISO()}-content`}
				id={`transaction-group-${date.toISO()}`}
			>
				<b>{date.toLocaleString({ weekday: 'short', month: 'short', day: '2-digit' })}</b>&nbsp;
                <i>({myTransactions.length} transactions)</i>
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
								<TransactionComponent transaction={transaction} key={transaction.id} />
							)
						})
					}
					</TableBody>
				</Table>
			</AccordionDetails>
		</Accordion>
	);
}