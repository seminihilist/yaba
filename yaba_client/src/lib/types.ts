import { Color } from "./color_utils";
import { Map } from "immutable";

export type Item = {
	/**
	 * The name of this budget item, as set by the user.
	 */
	name: string;

	/**
	 * The ID of this budget item as stored in the database. This will be -1 if the budget item has not yet been
	 * committed to the database.
	 */
	id: number;

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

export type IncomeItem = {
    /**
     * The ID of this income item as stored in the database.
     */
    id: number;

    /**
     * The ID of the budget that contains this item.
     */
    budgetID: number;

	/**
	 * The name of this income item, as set by the user.
	 */
	name: string;

	/**
	 * The amount of money that this income item provides.
	 */
	amount: number;
}

export type Section = {
    /**
     * The ID of this budget section as stored in the database.
     */
    id: number;

    /**
     * The ID of the budget that contains this section.
     */
    budgetID: number;

	/**
	 * The name of this budget section, as set by the user.
	 */
	name: string;

	/**
	 * The color of this budget section, as set by the user. Uses Tailwind's color class names. 
	 */
	color: Color;

	/**
	 * An array containing the IDs of all items in this section.
	 */
	itemIDs: Array<number>;
}

/**
 * A transaction that spent money from a budget item.
 */
export type Transaction = {
	/**
	 * The ID of this transaction as stored in the database.
	 */
	id: number;

	/**
	 * The database ID of the `BudgetItem` from which the money was spent.
	 */
	itemID: number;

	/**
	 * The amount of money that was spent.
	 */
	amount: number;

	/**
	 * The Date when this Transaction occurred, as an ISO date string.
	 */
	dateString: string;
}

/**
 * A budget for a budgeting period.
 */
export type Budget = {
    /**
     * The ID of this Budget in the database.
     */
    id: number;

    /**
     * The array of IDs of income items in this budget.
     */
    incomeItems: Array<number>;

    /**
     * The array of IDs of the sections of this budget.
     */
    sections: Array<number>;
}

/**
 * The section of the state that contains a mapping of date strings to their budgets.
 */
export type AppState = {
    /**
     * A mapping of budget IDs to budgets.
     */
	budgets: {
        [index: number | string]: Budget | undefined;
    };

    /**
     * A mapping of section IDs to sections.
     */
    sections: {
        [index: number | string]: Section | undefined;
    };

    /**
     * A mapping of item IDs to items.
     */
    items: {
        [index: number | string]: Item | undefined;
    }

    /**
     * A mapping of transaction IDs to transactions.
     */
    transactions: {
        [index: number | string]: Transaction | undefined;
    }

    /**
     * A mapping of income item IDs to income items.
     */
    incomeItems: {
        [index: number | string]: IncomeItem | undefined;
    }

	/**
	 * Used to generate new IDs for budgets, sections, items, transactions, and transaction groups.
	 * This will be removed once I finally add a server and database.
	 */
	idCounter: number;
}