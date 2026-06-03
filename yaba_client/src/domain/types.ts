/**
 *
 */
export type ItemKind = 'income' | 'expense';

/**
 * An item in the budget from which money can be spent or gained.
 */
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
     * The kind of item this is.
     */
    kind: ItemKind;

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
     * An array containing the IDs of all items in this section.
     */
    itemIDs: Array<number>;
}

/**
 * A transaction that added or removed money from a budget item.
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
     * The time when this Transaction occurred, as a Unix timestamp.
     */
    timestamp: number;
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
     * The time this budget started, as a Unix timestamp.
     */
    startTime: number;

    /**
     * The time this budget ended/will end, as a Unix timestamp.
     */
    endTime: number;

    /**
     * The array of IDs of the sections of this budget.
     */
    sections: Array<number>;

    state: 'active' | 'archived';
}

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
     * Used to generate new IDs for budgets, sections, items, transactions, and transaction groups.
     * This will be removed once I finally add a server and database.
     */
    idCounter: number;
}

export type UserState = {
    openBudget: number | null;
    hasCompletedSetup: boolean;
    tutorialStage: number; // TODO: a tutorial
}