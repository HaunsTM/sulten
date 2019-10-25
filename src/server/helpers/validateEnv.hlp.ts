/** Envalid is a small library for validating and accessing environment variables in Node.js  */
import { cleanEnv, port, str } from "envalid";

export function validateEnv() {
    cleanEnv(process.env, {
        PORT: port(),
    });
}
