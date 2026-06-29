import {matchAuthErrors, matchFailedToCheckAccess, newServerAction} from "@/lib/effect-server-action";
import {Data as D, Effect as E, Match as M, Schema as S, flow, pipe} from "effect";
import {checkAccessToSection, verifyAuthCookie} from "@/lib/auth";
import db from "@/lib/db";
import {items} from "@/db/schema";
import * as uuid from "uuid";

const CreateItem = S.Struct({
    sectionId: S.String.check(S.isUUID(7)),
    name: S.NonEmptyString,
    amountCents: S.Int.check(S.isGreaterThanOrEqualTo(0)),
})
export type CreateItem = typeof CreateItem.Type;

export class FailedToCreateItem extends D.TaggedError('FailedToCreateItem') {
}

/**
 * Insert an item into the database and return its ID.
 * @param sectionId
 * @param name
 * @param amountCents
 */
const insertItem = (sectionId: string, name: string, amountCents: number) => pipe(
    E.tryPromise(
        () => db
            .insert(items)
            .values({
                id: uuid.v7(),
                sectionId,
                name,
                amountCents,
            })
            .returning({id: items.id}),
    ),
    E.tapError((error) => E.logError("An error occurred when creating an item:", error)),
    E.mapError(() => new FailedToCreateItem()),
    E.filterOrFail(
        result => result.length > 0,
        () => new FailedToCreateItem(),
    ),
    E.map(([{id}]) => id),
);

const createItemEffect = ({sectionId, name, amountCents}: CreateItem) => E.gen(function* () {
    const {userId} = yield* verifyAuthCookie;
    yield* checkAccessToSection(userId, sectionId);
    return yield* insertItem(sectionId, name, amountCents);
});

export const _createItem = newServerAction(CreateItem)(flow(
    createItemEffect,
    E.map(id => ({
        message: "Item was created successfully.",

        /**
         * The ID of the newly created item.
         */
        id,
    })),
    E.mapError(flow(
        M.value,
        M.tagsExhaustive({
            SectionAccessIsNotPermitted: () => ({
                code: "access_denied" as const,
                message: "You do not have permission to access that section.",
            }),
            FailedToCreateItem: () => ({
                code: "failed_to_create_item" as const,
                message: "Failed to create the item. Please try again later.",
            }),
            ...matchAuthErrors,
            ...matchFailedToCheckAccess,
        }),
    )),
));

export const createItem = (input: CreateItem) => _createItem(input);