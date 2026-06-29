import {Console as C, Data as D, DateTime as DT, Effect as E, flow, Match as M, pipe, Schema as S} from "effect";
import {matchAuthErrors, newServerAction} from "@/lib/effect-server-action";
import {verifyAuthCookie} from "@/lib/auth";
import db from "@/lib/db";

const GetCurrentlyActiveBudget = S.Struct({});
type GetCurrentlyActiveBudget = typeof GetCurrentlyActiveBudget.Type;

class FailedToGetBudget extends D.TaggedError('FailedToGetBudget') {
}

/**
 * Select the currently active budget from the database for a given user and date.
 * @param userId
 * @param currentDate
 */
const selectCurrentlyActiveBudget = (userId: string, currentDate: Date) => pipe(
    E.tryPromise(() => db.query.budgets.findFirst({
        columns: {
            id: true,
        },
        where: {
            userId: {
                eq: userId
            },
            startTimestamp: {
                lte: currentDate,
            },
            endTimestamp: {
                gte: currentDate,
            }
        },
    })),
    E.tapError((error) => C.error("An error occurred when fetching a user's current budget from the database: ", error)),
    E.mapError(() => new FailedToGetBudget()),
);

const getCurrentlyActiveBudgetEffect = ({}: GetCurrentlyActiveBudget) => E.gen(function* () {
    const {userId} = yield* verifyAuthCookie;

    return (yield* selectCurrentlyActiveBudget(userId, yield* DT.nowAsDate)) ?? null /* TODO: replace with creating a new budget */;
})

export const _getCurrentlyActiveBudget = newServerAction(GetCurrentlyActiveBudget)(flow(
    getCurrentlyActiveBudgetEffect,
    E.mapError(flow(
        M.value,
        M.tagsExhaustive({
            FailedToGetBudget: () => ({
                code: 'failed_to_get_budget' as const,
                message: "Failed to get the currently active budget. Please try again later."
            }),
            ...matchAuthErrors,
        }),
    ))
));

export const getCurrentlyActiveBudget = (input: GetCurrentlyActiveBudget) => _getCurrentlyActiveBudget(input);