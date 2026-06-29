'use server';

import db from "@/lib/db"
import {users} from "@/db/schema";
import {timingSafeEqual} from "crypto"
import {eq} from "drizzle-orm";
import {setAuthCookie, hashPassword} from "@/lib/auth";
import {Data as D, Effect as E, Match as M, Schema as S, pipe, flow} from "effect";
import {newServerAction} from "@/lib/effect-server-action";

const LogIn = S.Struct({
    username: S.NonEmptyString,
    password: S.NonEmptyString,
})
export type LogIn = typeof LogIn.Type;

export class FailedToLogIn extends D.TaggedError('FailedToLogIn') {
}

export class UserDoesNotExist extends D.TaggedError('UserDoesNotExist') {
}

export class IncorrectUsernameOrPassword extends D.TaggedError('IncorrectUsernameOrPassword') {
}

const fetchUser = (username: string) => pipe(
    E.tryPromise(
        () => db
            .select({
                id: users.id,
                passwordHash: users.passwordHash,
                passwordSalt: users.passwordSalt
            })
            .from(users)
            .where(eq(users.username, username))
            .limit(1), // Because users.username is unique, we can assume there is only one user with a given username.
    ),
    E.tapError((error) => E.logError("An error when accessing the database to log a user in:", error)),
    E.mapError(() => new FailedToLogIn()),
    E.filterOrFail(
        (result) => result.length === 1,
        () => new UserDoesNotExist(),
    ),
    E.map((result) => result[0]),
)

const logInEffect =
    ({username: givenUsername, password: givenPassword}: LogIn) => E.gen(function* () {
        const {id, passwordHash: correctHash, passwordSalt} = yield* fetchUser(givenUsername);

        const computedHash = yield* hashPassword(givenPassword, passwordSalt);

        if (correctHash.length === computedHash.length && timingSafeEqual(correctHash, computedHash)) {
            yield* setAuthCookie({userId: id, username: givenUsername})
        } else {
            yield* E.fail(new IncorrectUsernameOrPassword());
        }
    })

export const _logIn = newServerAction(LogIn)(flow(
    logInEffect,
    E.as({message: "Logged in successfully." as const}),
    E.mapError((error) => M.value(error).pipe(
        M.tag('UserDoesNotExist', () => ({
            code: 'user_does_not_exist' as const,
            message: "That user does not exist."
        })),
        M.tag('IncorrectUsernameOrPassword', () => ({
            code: 'incorrect_username_or_password' as const,
            message: "Incorrect username or password",
        })),
        M.tag('FailedToLogIn', () => ({
            code: 'failed_to_log_in' as const,
            message: "Failed to log in. Please try again later.",
        })),
        M.exhaustive,
    ))
));

export const logIn = (input: LogIn) => _logIn(input);