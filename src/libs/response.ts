export const response = (input: string, output: string, message?: string) => {
    console.log("\n===============================\n");
    console.log(message ?? "CSV to SQL convert successfully");
    console.log(`${input}.csv (TO) ${output}.sql`);
    console.log("\n===============================\n");
    process.exit(0);
};
