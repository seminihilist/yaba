export type BudgetItem = {
	/**
	 * The name of this budget item, as set by the user.
	 */
	name: string;

	/**
	 * The ID of this budget item as stored in the database. This will be -1 if the budget item has not yet been
	 * committed to the database.
	 */
	databaseID: number;

	/**
	 * The amount of money planned for this budget item. Does not account for any transactions out of this item.
	 */
	amount: number;

	/**
	 * Whether or not this budget item has been marked as "cumulative", indicating that money that is not spent in one period
	 * will carry over to the next.
	 */
	isCumulative: boolean;

	/**
	 * The ID of the section that contains this budget item.
	 */
	sectionID: number;

	/**
	 * An array containing the IDs of all transactions that have been made from this item.
	 */
	transactionIDs: Array<number>;
}

export interface ItemMap {
	[index: number]: BudgetItem;
	[index: string]: BudgetItem;
}

export type IncomeItem = {
	/**
	 * The name of this income item, as set by the user.
	 */
	name: string;

	/**
	 * The ID of this income item as stored in the database.
	 */
	databaseID: number;

	/**
	 * The amount of money that this income item provides.
	 */
	amount: number;
}

export interface IncomeItemMap {
	[index: number]: IncomeItem;
	[index: string]: IncomeItem;
}

export type BudgetSection = {
	/**
	 * The name of this budget section, as set by the user.
	 */
	name: string;

	/**
	 * The ID of this budget section as stored in the database.
	 */
	databaseID: number;

	/**
	 * The color of this budget section, as set by the user. Uses Tailwind's color class names. 
	 */
	color: string;

	/**
	 * An array containing the IDs of all items in this section.
	 */
	itemIDs: Array<number>;
}

export interface SectionMap {
	[index: number]: BudgetSection;
	[index: string]: BudgetSection;
}

/**
 * A transaction that spent money from a budget item.
 */
export type Transaction = {
	/**
	 * The ID of this transaction as stored in the database.
	 */
	databaseID: number;

	/**
	 * The database ID of the `BudgetItem` from which the money was spent.
	 */
	itemID: number;

	/**
	 * The ID of the `TransactionGroup` that this transaction belongs to.
	 */
	transactionGroupID: number;

	/**
	 * The amount of money that was spent.
	 */
	amount: number;

	/**
	 * The Date when this Transaction occured, as an ISO date string.
	 */
	dateString: string;
}

export interface TransactionMap {
	[index: number]: Transaction;
	[index: string]: Transaction;
}

export type TransactionGroup = {
	/**
	 * The ID of this transaction group as stored in the database.
	 */
	databaseID: number;

	/**
	 * The date of all transactions in this group, as an ISO date string. Only the year, month, and day are used or checked.
	 */
	dateString: string;

	/**
	 * An Array containing the IDs of all Transactions in this group.
	 */
	transactionIDs: Array<number>
}

export type TransactionGroupMap = {
	[index: number]: TransactionGroup;
	[index: string]: TransactionGroup;
}


export type BudgetState = {
	/**
	 * A mapping of section IDs to sections.
	 */
	sections: SectionMap;

	/**
	 * A mapping of item IDs to items.
	 */
	items: ItemMap;

	/**
	 * A mapping of transaction IDs to transactions.
	 */
	transactions: TransactionMap;

	/**
	 * A mapping of transaction IDs to transactions.
	 */
	transactionGroups: TransactionGroupMap;

	/**
	 * The next ID that will be assigned. Will be removed once I finally add a server and database.
	 */
	idCounter: number;

	/**
	 * An array of all income items in the budget.
	 */
	incomeItems: IncomeItemMap;
}

export type AppState = {
	/**
	 * The name of the currently open dialog box. This will be an empty string if there is no open dialog box.
	 */
	openDialog: string;
}