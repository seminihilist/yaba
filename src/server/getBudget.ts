import {Data as D, Effect as E, flow, Match as M, pipe, Schema as S} from "effect";
import {checkAccessToBudget, verifyAuthCookie} from "@/lib/auth";
import {matchAuthErrors, matchFailedToCheckAccess, newServerAction} from "@/lib/effect-server-action";
import db from "@/lib/db";

const GetBudget = S.Struct({
    id: S.String.check(S.isUUID(7))
})
export type GetBudget = typeof GetBudget.Type;

class BudgetDoesNotExist extends D.TaggedError('BudgetDoesNotExist') {
}

class FailedToGetBudget extends D.TaggedError('FailedToGetBudget') {
}

const getBudgetFromDatabase = (id: string) => pipe(
    E.tryPromise(
        () => db.query.budgets.findFirst({
            where: {
                id: {
                    eq: id,
                }
            },
            with: {
                sections: {
                    with: {
                        items: true,
                    }
                }
            }
        })
    ),
    E.tapError((error) => E.logError("An error occurred when getting a budget from the database:", error)),
    E.mapError(() => new FailedToGetBudget),
    E.filterOrFail(
        (result) => !!result,
        () => new BudgetDoesNotExist,
    )
)

const getBudgetEffect = ({id: budgetId}: GetBudget) => E.gen(function* () {
    const {userId} = yield* verifyAuthCookie;

    yield* checkAccessToBudget(userId, budgetId);

    return yield* getBudgetFromDatabase(budgetId);
})

export const _getBudget = newServerAction(GetBudget)(flow(
    getBudgetEffect,
    E.mapError(flow(
        M.value,
        M.tagsExhaustive({
            BudgetAccessIsNotPermitted: () => ({
                code: 'access_denied' as const,
                message: "You do not have permission to access that budget.",
            }),
            FailedToGetBudget: () => ({
                code: 'failed_to_get_budget' as const,
                message: "Failed to get budget. Please try again later.",
            }),
            BudgetDoesNotExist: () => ({
                code: 'budget_does_not_exist' as const,
                message: "That budget does not exist.",
            }),
            ...matchAuthErrors,
            ...matchFailedToCheckAccess,
        }),
    )),
));

export const getBudget = (input: GetBudget) => _getBudget(input);
