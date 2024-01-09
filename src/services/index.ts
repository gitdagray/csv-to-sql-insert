import path from "path";
import chalk from "chalk";
import { existsSync, readdirSync } from "fs";
import { TConvertTo } from "../@types/index.js";

/** Get input files from converting to directory */
export const getInputFiles = (directory: TConvertTo): string[] | Error => {
    try {
        /** Switch based on the provided directory type */
        switch (directory) {
            /** Handling 'csv-to-sql' directory case */
            case "csv-to-sql":
                const csvPath = path.resolve("csv");
                /** Check if the CSV directory exists */
                if (!existsSync(csvPath)) {
                    /** Throw an error if the directory is not found */
                    throw new Error("CSV directory not found!");
                }
                /** Return an array of file names in the CSV directory */
                return readdirSync(csvPath);
            /** Handling 'xlsv-to-sql' directory case */
            case "xlsv-to-sql":
                const xlsvPath = path.resolve("xlsv");
                /** Check if the XLSV directory exists */
                if (!existsSync(xlsvPath)) {
                    /** Throw an error if the directory is not found */
                    throw new Error("XLSV directory not found!");
                }
                /** Return an array of file names in the XLSV directory */
                return readdirSync(xlsvPath);

            /** Handling invalid directory type case */
            default:
                /** Throw an error if an invalid directory type is provided */
                throw new Error("Invalid directory type!");
        }
    } catch (error: any) {
        /** Log the error message in red using chalk */
        console.error(chalk.redBright(error.message));
        return error; /** Return the caught error object */
    }
};

/** convert to csv/xlsv/--/--/ etc export from here... */
/**
 * TODO:
 * make one by one convert to
 */
export const convertTo: TConvertTo[] = ["csv-to-sql", "xlsv-to-sql"];
