import {cookies} from "next/headers";
import {jwtVerify, SignJWT} from "jose";
import {JWT_AUDIENCE, JWT_ISSUER, JWT_SECRET_KEY, JWT_TOKEN_LIFETIME, REQUIRE_SECURE} from "@/lib/env";
import nodeCrypto from "crypto";
import {Data as D, Effect as E, Schema as S, pipe, flow} from "effect";
import {JWTClaimValidationFailed, JWTExpired, JWTInvalid} from "jose/errors";
import {budgets, items, sections, transactions, users} from "@/db/schema";
import {and, eq} from "drizzle-orm";
import db from "@/lib/db";


const AuthTokenPayload = S.Struct({
    userId: S.NonEmptyString.check(S.isUUID(7)),
    username: S.NonEmptyString,
});
export type AuthTokenPayload = typeof AuthTokenPayload.Type;

export class MissingAuthToken extends D.TaggedError("MissingAuthToken") {
}

export class InvalidAuthToken extends D.TaggedError("InvalidAuthToken") {
}

export class ExpiredAuthToken extends D.TaggedError("ExpiredAuthToken") {
}

export class CouldNotVerifyAuthToken extends D.TaggedError("CouldNotVerifyAuthToken") {
}

export type AuthenticationError = MissingAuthToken | InvalidAuthToken | ExpiredAuthToken | CouldNotVerifyAuthToken;

const getCookies = E.promise(cookies);

const getAuthCookie = pipe(
    getCookies,
    E.map((cookies) => cookies.get('auth_token')?.value),
    E.flatMap((authCookie) => typeof authCookie !== 'undefined'
        ? E.succeed(authCookie)
        : E.fail(new MissingAuthToken())
    ),
)

const verifyToken = (token: string) => E.tryPromise({
    try: () => jwtVerify(
        token, JWT_SECRET_KEY, {
            algorithms: ["HS256"],
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE,
            maxTokenAge: JWT_TOKEN_LIFETIME,
        }),
    catch: error =>
        error instanceof JWTInvalid ||
        error instanceof JWTClaimValidationFailed ? new InvalidAuthToken() :
            error instanceof JWTExpired ? new ExpiredAuthToken() :
                (() => {
                    console.group("An error occurred when verifying the JWT:");
                    console.error(error);
                    console.groupEnd();
                    return new CouldNotVerifyAuthToken();
                })(),
});

export const verifyAuthCookie = E.gen(function* () {
    const authCookie = yield* getAuthCookie;
    const verifyResult = yield* verifyToken(authCookie);
    return yield* S.decodeUnknownEffect(AuthTokenPayload)(verifyResult.payload).pipe(
        E.mapError(() => new InvalidAuthToken())
    );
});

/**
 * Effect that signs a new JWT with the provided payload (plus additional fields for validation) and saves it securely
 * in the `auth_token` cookie.
 * @param payload The payload to sign and store.
 */
export const setAuthCookie = (payload: AuthTokenPayload) => E.gen(function* () {
    (yield* getCookies).set({
        name: "auth_token",
        value: (yield* E.promise(() => new SignJWT(payload)
            .setIssuer(JWT_ISSUER)
            .setAudience(JWT_AUDIENCE)
            .setIssuedAt()
            .setExpirationTime(Date.now() + (JWT_TOKEN_LIFETIME * 1000))
            .setProtectedHeader({alg: "HS256"})
            .sign(JWT_SECRET_KEY))),
        httpOnly: true,
        secure: REQUIRE_SECURE,
        sameSite: 'lax',
    });
});

/**
 * Effect that generates a 32-byte random salt.
 */
export const generateSalt = E.sync(() => nodeCrypto.randomBytes(32) as Buffer);

export const hashPassword = flow(
    E.effectify(
        (password: string, salt: nodeCrypto.BinaryLike, callback: Parameters<typeof nodeCrypto.scrypt>[4]) => nodeCrypto.scrypt(
            password,
            salt,
            64,
            {
                N: 16384,
                r: 8,
                p: 1
            },
            callback
        )
    ),
    E.orDie // Hashing the password should never fail, and if it does, something is horribly wrong
);

export class FailedToCheckAccess extends D.TaggedError('FailedToCheckAccess') {
}

export class BudgetAccessIsNotPermitted extends D.TaggedError('BudgetAccessIsNotPermitted') {
}

/**
 * Effect that asserts the given user owns the given budget.
 * @param userId The ID of the user.
 * @param budgetId The ID of the budget.
 */
export const checkAccessToBudget = (userId: string, budgetId: string) => pipe(
    E.tryPromise(
        () => db
            .select({})
            .from(budgets)
            .where(and(eq(budgets.id, budgetId), eq(users.id, userId)))
            .innerJoin(users, eq(users.id, budgets.userId))
            .limit(1)
    ),
    E.tapError((error) => E.logError("An error occurred when checking a user's access to a budget:", error)),
    E.mapError(() => new FailedToCheckAccess()),
    E.filterOrFail(
        // TODO: different error if the budget does not exist
        result => result.length > 0,
        () => new BudgetAccessIsNotPermitted(),
    ),
    E.asVoid
);

export class SectionAccessIsNotPermitted extends D.TaggedError('SectionAccessIsNotPermitted') {
}

/**
 * Assert that a user owns a section.
 * @param userId The ID of the user.
 * @param sectionId The ID of the section.
 */
export const checkAccessToSection = (userId: string, sectionId: string) => pipe(
    E.tryPromise(
        () => db
            .select({})
            .from(sections)
            .where(and(eq(sections.id, sectionId), eq(users.id, userId)))
            .innerJoin(budgets, eq(sections.budgetId, budgets.id))
            .innerJoin(users, eq(budgets.id, users.id))
            .limit(1)
    ),
    E.tapError((error) => E.logError("An error occurred when checking a user's access to a section:", error)),
    E.mapError(() => new FailedToCheckAccess()),
    E.filterOrFail(
        // TODO: a different error if the section does not exist
        result => result.length > 0,
        () => new SectionAccessIsNotPermitted(),
    ),
    E.asVoid
);

export class ItemAccessIsNotPermitted extends D.TaggedError('ItemAccessIsNotPermitted') {
}

/**
 * Assert that a user owns an item.
 * @param userId The ID of the user.
 * @param itemId The ID of the item.
 */
export const checkAccessToItem = (userId: string, itemId: string) => pipe(
    E.tryPromise(
        () => db
            .select({})
            .from(sections)
            .where(and(eq(items.id, itemId), eq(users.id, userId)))
            .innerJoin(sections, eq(items.sectionId, sections.id))
            .innerJoin(budgets, eq(sections.budgetId, budgets.id))
            .innerJoin(users, eq(budgets.id, users.id))
            .limit(1)
    ),
    E.tapError((error) => E.logError("An error occurred when checking a user's access to an item:", error)),
    E.mapError(() => new FailedToCheckAccess()),
    E.filterOrFail(
        // TODO: a different error if the item does not exist
        result => result.length > 0,
        () => new ItemAccessIsNotPermitted(),
    ),
    E.asVoid
);

export class TransactionAccessIsNotPermitted extends D.TaggedError('TransactionAccessIsNotPermitted') {
}

/**
 * Assert that a user owns a transaction.
 * @param userId The ID of the user.
 * @param transactionId The ID of the transaction.
 */
export const checkAccessToTransaction = (userId: string, transactionId: string) => pipe(
    E.tryPromise(
        () => db
            .select({})
            .from(sections)
            .where(and(eq(transactions.id, transactionId), eq(users.id, userId)))
            .innerJoin(items, eq(transactions.itemId, items.id))
            .innerJoin(sections, eq(items.sectionId, sections.id))
            .innerJoin(budgets, eq(sections.budgetId, budgets.id))
            .innerJoin(users, eq(budgets.id, users.id))
            .limit(1)
    ),
    E.tapError((error) => E.logError("An error occurred when checking a user's access to a transaction:", error)),
    E.mapError(() => new FailedToCheckAccess()),
    E.filterOrFail(
        // TODO: a different error if the transaction does not exist
        result => result.length > 0,
        () => new TransactionAccessIsNotPermitted(),
    ),
    E.asVoid
);



