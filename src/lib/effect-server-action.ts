import {Effect as E, Schema as S, SchemaIssue as SI, flow} from "effect";

/**
 * Types that can be serialized and returned from server functions.
 */
export type Serializable =
    | boolean
    | number
    | bigint
    | string
    | undefined
    | null
    | { [key: string | number]: Serializable }
    | Array<Serializable>
    | Date
    | Map<Serializable, Serializable>
    | Set<Serializable>
    | FormData;

/**
 * Create a server action from an effect.
 * @param decoder
 */
export const newServerAction =
    <T>(decoder: S.Decoder<T>) =>
        <EA extends Serializable, EE extends Serializable>(effectFactory: (validData: T) => E.Effect<EA, EE>) =>
            flow(
                (input: unknown) => S.decodeUnknownEffect(decoder)(input),
                E.mapError((schemaError) => ({
                    ok: false as const,
                    status: 'invalid' as const,
                    data: {
                        issues: SI.makeFormatterStandardSchemaV1()(schemaError.issue).issues
                    },
                })),
                E.flatMap(flow(
                        effectFactory,
                        E.mapBoth({
                            onSuccess: (success) => ({
                                ok: true as const,
                                status: 'success' as const,
                                data: success,
                            }),
                            onFailure: (failure) => ({
                                ok: false as const,
                                status: 'error' as const,
                                data: failure,
                            })
                        }),
                    ),
                ),
                E.match({
                    onSuccess: success => success,
                    onFailure: failure => failure,
                }),
                E.runPromise
            );

export const matchAuthErrors = {
    MissingAuthToken: () => ({
        code: 'missing_auth_token' as const,
        message: "Authentication token is missing. Please log in again.",
    }),
    ExpiredAuthToken: () => ({
        code: 'expired_auth_token' as const,
        message: "Authentication token has expired. Please log in again."
    }),
    InvalidAuthToken: () => ({
        code: 'invalid_auth_token' as const,
        message: "Authentication token is invalid. Please log in again."
    }),
    CouldNotVerifyAuthToken: () => ({
        code: 'could_not_verify_auth_token' as const,
        message: "Couldn't verify your authentication token. Please try again later or log in again."
    }),
};

export const matchFailedToCheckAccess = {
    FailedToCheckAccess: () => ({
        code: 'failed_to_check_access' as const,
        message: "Your permissions could not be verified. Please try again later.",
    }),
}