import { readFileSync } from "fs";
import { validate } from "../validator/index.js";
import { useDirectory } from "../hooks/useDirectory.js";

export class CsvToSql {
    private destination: string = "";
    private filename: string = "";

    constructor(destination: string, filename: string) {
        this.destination = destination;
        this.filename = filename;
    }
    /**
     * Read CSV File
     */
    public readingCSVFile = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            resolve(
                readFileSync(`${process.cwd()}/csv/${this.filename}.csv`, {
                    encoding: "utf8",
                })
            );
            reject(new Error("Fail to read file"));
        });
    };

    public processingCSVFile = async (data: string, filename: string) => {
        const { append } = useDirectory();
        if (!validate(data) || data.length < 10)
            return console.log("Invalid data");

        let values = "";
        const linesArray = data?.split(/\r|\n/).filter((line) => line);
        const columnNames: string[] = linesArray?.shift()?.split(",") as [];
        let beginSQLInsert = `INSERT INTO ${filename} (`;

        if (columnNames?.length > 2) {
            columnNames.forEach((name) => (beginSQLInsert += `${name}, `));
            beginSQLInsert = beginSQLInsert.slice(0, -2) + ")\nVALUES\n";
        }

        linesArray?.forEach(async (line: any, index: number) => {
            // parse value for get array for each line
            const newArray: string[] = line.split(
                /,(?=(?:(?:[^"]*"){2})*[^"]*$)/
            );
            if (newArray.length !== columnNames.length)
                throw new Error("Invalid row items or column items :( ");
            /**
             * TODO:
             * Check batch size (rows per batch) and more...
             */
            if (index > 0 && index % 500 == 0) {
                values = values.slice(0, -2) + ";\n\n";
                // Write File
                await append(`${beginSQLInsert}${values}`, this.destination);
            }

            let valueLine = "\t(";
            newArray?.forEach((value: string) => {
                // // Matches NULL values, Numbers,
                // // Strings accepted as numbers, and Booleans (0 or 1)
                if (value === "NULL" || !isNaN(+value)) {
                    valueLine += `${value}, `;
                } else {
                    // If a string is wrapped in quotes, it doesn't need more
                    if (value.at(0) === '"') {
                        valueLine += `${value}, `;
                    } else {
                        // This wraps strings in quotes
                        // also wraps timestamps
                        valueLine += `"${value}", `;
                    }
                }
            });
            valueLine = valueLine.slice(0, -2) + "),\n";
            values += valueLine;
        });
        values = values.slice(0, -2) + ";";
        await append(`${beginSQLInsert}${values}`, this.destination);
    };
}
