'use server';

import db from "@/lib/db";
import {users} from "@/db/schema";
import * as uuid from "uuid";
import {generateSalt, hashPassword, setAuthCookie} from "@/lib/auth";
import {Schema as S, Effect as E, Data as D, Match as M, flow} from "effect";
import {newServerAction} from "@/lib/effect-server-action";

const CreateUser = S.Struct({
    username: S.NonEmptyString,

    // TODO: require a relatively strong password
    password: S.NonEmptyString,
})
type CreateUser = typeof CreateUser.Type;

export class UsernameAlreadyTaken extends D.TaggedError('UsernameAlreadyTaken') {
}

export class FailedToCreateUser extends D.TaggedError('FailedToCreateUser') {
}

const insertUser = (
    id: string,
    username: string,
    passwordHash: Buffer,
    passwordSalt: Buffer
) => E.tryPromise(() => db
    .insert(users)
    .values({
        username,
        id,
        passwordHash,
        passwordSalt,
    })
    .onConflictDoNothing()
    .returning({}),
).pipe(
    E.tapError(error => E.logError("An error occurred when creating a user:", error)),
    E.mapError(() => new FailedToCreateUser()),
    E.filterOrFail(result => result.length > 0, () => new UsernameAlreadyTaken()),
    E.asVoid
);

const createUserEffect =
    ({username, password}: CreateUser) => E.gen(function* () {
        const id = uuid.v7();
        const passwordSalt = yield* generateSalt;
        const passwordHash = yield* hashPassword(password, passwordSalt);

        yield* insertUser(id, username, passwordHash, passwordSalt);

        yield* setAuthCookie({userId: id, username});

        return;
    });

export const _createUser = newServerAction(CreateUser)(flow(
    createUserEffect,
    E.as({message: "User was created successfully." as const}),
    E.mapError(flow(
        M.value,
        M.tag('FailedToCreateUser', () => ({
            code: 'failed_to_create_user' as const,
            message: "Failed to create user. Please try again later." as const,
        })),
        M.tag('UsernameAlreadyTaken', () => ({
            code: 'username_already_taken' as const,
            message: "That username is already taken." as const,
        })),
        M.exhaustive
    ))
));

export const createUser = (input: CreateUser) => _createUser(input);
