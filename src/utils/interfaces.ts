import { createInterface } from "readline";

export const readLine = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});
