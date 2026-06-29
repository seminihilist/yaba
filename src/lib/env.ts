import {importJWK} from "jose";

function getEnv(name: string) {
    if (process.env[name]) {
        return process.env[name]
    } else {
        throw Error(`${name} environment variable not found`);
    }
}

export const REQUIRE_SECURE = !!getEnv("REQUIRE_SECURE");

export const DATABASE_URL = getEnv("DATABASE_URL");

export const JWT_ISSUER = getEnv("JWT_ISSUER");
export const JWT_AUDIENCE = getEnv("JWT_AUDIENCE");
export const JWT_SECRET_KEY = await importJWK({
    kty: "oct",
    k: Buffer.from(getEnv("JWT_SECRET_KEY")).toString("base64url"),
}, "HS256");
export const JWT_TOKEN_LIFETIME = parseInt(getEnv("JWT_TOKEN_LIFETIME"));
