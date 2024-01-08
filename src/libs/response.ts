import chalk from "chalk";

export const response = (input: string, output: string, message?: string) => {
    console.log("\n===============================\n");
    console.log(
        chalk.greenBright(message ?? "CSV to SQL convert successfully")
    );
    console.log(chalk.blueBright(`${input}.csv (TO) ${output}.sql`));
    console.log("\n===============================\n");
    process.exit(0);
};
