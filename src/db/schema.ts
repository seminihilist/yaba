import {pgTable, timestamp, uuid} from "drizzle-orm/pg-core"
import {defineRelations} from "drizzle-orm"

export const users = pgTable("users", {
    id: uuid().primaryKey(),

    creationDate: timestamp(),
});

export const budgets = pgTable("budgets", {
    id: uuid().primaryKey(),
    userId: uuid(),

    startDate: timestamp(),
    endDate: timestamp(),

    creationDate: timestamp(),
});

export const sections = pgTable("sections", {
    id: uuid().primaryKey(),
    budgetId: uuid(),

    creationDate: timestamp(),
});

export const items = pgTable("items", {
    id: uuid().primaryKey(),
    sectionId: uuid(),

    creationDate: timestamp(),
});

export const transactions = pgTable("transactions", {
    id: uuid().primaryKey(),
    itemId: uuid(),

    creationDate: timestamp(),
});

export const relations = defineRelations({ budgets, sections, items, transactions }, r => ({
    budgets: {
        sections: r.many.sections({
            from: r.budgets.id,
            to: r.sections.budgetId,
        })
    },
    sections: {
        budget: r.one.budgets({
            from: r.sections.budgetId,
            to: r.budgets.id,
        }),
        items: r.many.items({
            from: r.sections.id,
            to: r.items.sectionId,
        }),
    },
    items: {
        section: r.one.sections({
            from: r.items.sectionId,
            to: r.sections.id,
        }),
        transactions: r.many.transactions({
            from: r.items.id,
            to: r.transactions.itemId,
        })
    },
    transactions: {
        item: r.one.items({
            from: r.transactions.itemId,
            to: r.items.id,
        })
    },
}));