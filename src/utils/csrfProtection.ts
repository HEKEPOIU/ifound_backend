import { csrfSync } from "csrf-sync";

const csrfProtection = csrfSync();

export { csrfProtection }
