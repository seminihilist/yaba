'use client';

/* An item in the transaction list of that tab. Given a transaction object from the Redux store, displays the name of the budget item, the amount spent, and
   buttons to edit or delete the transaction.  
 */
export default function TransactionItem({ transaction }: Readonly<{ transaction: string }>) {
	return (
		<p>{transaction}</p>
	);
}