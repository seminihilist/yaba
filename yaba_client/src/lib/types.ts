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
}

export type BudgetSection = {
	/**
	 * The name of this budget section, as set by the user.
	 */
	name: string;

	/**
	 * The ID of this budget section as stored in the database. This will be -1 if the budget section has not yet been
	 * committed to the database.
	 */
	databaseID: number;

	/**
	 * The RGB color of this budget section in a 3-length array, as set by the user. 
	 */
	color: Array<number>;

	items: Array<BudgetItem>;
}

/**
 * A transaction that spent money from a budget item.
 */
export type Transaction = {
	/**
	 * The database ID of the `BudgetItem` from which the money was spent.
	 */
	itemID: number;

	/**
	 * The amount of money that was spent.
	 */
	amount: number;
}

export type BudgetState = {
	sections: Array<BudgetSection>;

	ownerUsername: string;
	memberUsernames: Array<string>;
}