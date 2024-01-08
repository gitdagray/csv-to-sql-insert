import path from "path";
import chalk from "chalk";
import { existsSync, readdirSync } from "fs";
import { TConvertTo } from "../@types/index.js";

/** Get input files from converting to direcotry */
export const getInputFiles = (
    direcotry: TConvertTo
): string[] | ErrorConstructor => {
    /** resolve csv folder and return all files that included */
    switch (direcotry) {
        case "csv-to-sql":
            if (!existsSync(path.resolve("csv"))) {
                console.error(chalk.redBright("CSV directory not found!"));
                process.exit(0);
            }
            return readdirSync(path.resolve("csv"));
        case "xlsv-to-sql":
            if (!existsSync(path.resolve("xlsv"))) {
                console.error(chalk.redBright("XLSV directory not found!"));
                process.exit(0);
            }
            return readdirSync(path.resolve("xlsv"));
    }
};
/**
 * TODO:
 * Create another method for getting files
 * Like: getXlsvFiles() etc
 */

/** convert to csv/xlsv/--/--/ etc export from here... */
/**
 * TODO:
 * make one by one convert to
 */
export const convertTo: TConvertTo[] = ["csv-to-sql", "xlsv-to-sql"];
