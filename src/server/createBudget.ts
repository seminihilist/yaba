import {verifyAuthCookie} from "@/lib/auth";
import db from "@/lib/db";
import {budgets} from "@/db/schema";
import * as uuid from "uuid";
import {Data as D, Effect as E, Match as M, Schema as S, pipe, flow} from "effect";
import {matchAuthErrors, newServerAction} from "@/lib/effect-server-action";

const CreateBudget = S.Struct({
    startTimestamp: S.Date,
    endTimestamp: S.Date,
})
export type CreateBudget = typeof CreateBudget.Type;

export class FailedToCreateBudget extends D.TaggedError('FailedToCreateBudget') {
}

export const insertBudget = (userId: string, startTimestamp: Date, endTimestamp: Date) => pipe(
    E.tryPromise(
        () => db
            .insert(budgets)
            .values({
                id: uuid.v7(),
                userId,
                startTimestamp,
                endTimestamp,
            })
            .returning({id: budgets.id}),
    ),
    E.tapError((error) => E.logError("An error occurred when creating a budget:", error)),
    E.mapError(() => new FailedToCreateBudget()),
    E.filterOrFail(
        result => result.length > 0,
        () => new FailedToCreateBudget(),
    ),
    E.map(([{id}]) => id)
)

const createBudgetEffect =
    ({startTimestamp, endTimestamp}: CreateBudget) => E.gen(function* () {
        const {userId} = yield* verifyAuthCookie;

        const id = yield* insertBudget(userId, startTimestamp, endTimestamp);

        return {
            message: "Budget was created successfully." as const,

            /** The UUID of the newly created budget. */
            id
        }
    })

export const _createBudget = newServerAction(CreateBudget)(flow(
    createBudgetEffect,
    E.mapError(flow(
        M.value,
        M.tagsExhaustive({
            FailedToCreateBudget: () => ({
                code: 'failed_to_create_budget' as const,
                message: "Failed to create the budget. Please try again later.",
            }),
            ...matchAuthErrors,
        }),
    ))
));

export const createBudget = (input: CreateBudget) => _createBudget(input);