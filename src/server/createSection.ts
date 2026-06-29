import {checkAccessToBudget, verifyAuthCookie} from "@/lib/auth";
import db from "@/lib/db";
import {sections} from "@/db/schema";
import * as uuid from "uuid";
import {Data as D, Effect as E, Match as M, Schema as S, pipe, flow} from "effect";
import {matchAuthErrors, matchFailedToCheckAccess, newServerAction} from "@/lib/effect-server-action";

const CreateSection = S.Struct({
    budgetId: S.String.check(S.isUUID(7)),
    name: S.NonEmptyString,
})
export type CreateSection = typeof CreateSection.Type;

export class BudgetDoesNotExist extends D.TaggedError('BudgetDoesNotExist') {
}

export class BudgetAccessIsNotPermitted extends D.TaggedError('BudgetAccessIsNotPermitted') {
}

/**
 * An internal server error occurred that prevented the section from being created.
 */
export class FailedToCreateSection extends D.TaggedError('FailedToCreateSection') {
}

/**
 * Insert a section into the database and return the
 * @param budgetId
 * @param name
 */
const insertSection = (budgetId: string, name: string) => pipe(
    E.tryPromise(
        () => db
            .insert(sections)
            .values({
                id: uuid.v7(),
                budgetId,
                name,
            })
            .returning({id: sections.id}),
    ),
    E.tapError((error) => E.logError("An error occurred when creating a section:", error)),
    E.mapError(() => new FailedToCreateSection()),
    E.filterOrFail(
        result => result.length > 0,
        () => new FailedToCreateSection(),
    ),
    E.map(([{id}]) => id)
)

const createSectionEffect =
    ({budgetId, name}: CreateSection) => E.gen(function* () {
        const {userId} = yield* verifyAuthCookie;

        yield* checkAccessToBudget(userId, budgetId);

        const id = yield* insertSection(budgetId, name);

        return {
            message: "Section was created successfully." as const,

            /** The UUID of the newly created section. */
            id
        }
    })

export const _createSection = newServerAction(CreateSection)(flow(
    createSectionEffect,
    E.mapError(flow(
        M.value,
        M.tagsExhaustive({
            BudgetAccessIsNotPermitted: () => ({
                code: 'access_denied' as const,
                message: "You do not have permission to access that budget.",
            }),
            FailedToCreateSection: () => ({
                code: 'failed_to_create_budget' as const,
                message: "Failed to create the budget. Please try again later.",
            }),
            ...matchAuthErrors,
            ...matchFailedToCheckAccess,
        }),
    )),
));

export const createSection = (input: CreateSection) => _createSection(input);