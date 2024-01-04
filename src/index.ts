import { promises as fs, existsSync } from "fs";
import * as path from "path";
import { EStatus, readLine } from "./utils";
import { validateString } from "./validator";
import { useDirectory } from "./hooks/useDirectory";
import { response } from "./libs";
// import { loading } from "cli-loading-animation";
// import { fistBump } from "cli-spinners";

class Main {
    private destinationFile: string = "";
    private fileName: string = "";

    public run = () => {
        this.askFileName();
    };

    private askFileName = () => {
        /** Initialize progress bar */

        /** Take file name from console */
        readLine.question("Enter your CSV file name: ", (fileName) => {
            /** file name exist or not */
            if (!validateString(fileName))
                return new Error("Missing csvFileName parameter");
            /**
             * Our CSV file path
             * TODO: Improve something (if possible)
             */
            this.fileName = fileName;
            const filePath = `${process.cwd()}/csv/${fileName}.csv`;
            if (!existsSync(path.resolve(filePath))) {
                console.log(`(${fileName}) not found!`);
                process.exit(0);
            } else {
                this.askDestinationFile(filePath);
            }
        });
    };
    /**
     * Dicretory name reader
     */
    private askDestinationFile = (filePath: string) => {
        /** destination of our output sql file */
        readLine.question("Destination name(file): ", (destinationFile) => {
            /** directory name exist or not */
            if (!destinationFile || destinationFile.trim() === "") {
                this.destinationFile = this.fileName;
            } else {
                this.destinationFile = destinationFile;
            }
            /** should start here our snipper */
            console.log("Inserting....");
            this.readCSV(filePath);
        });
    };
    /**
     * CSV Reader
     */
    private readCSV = async (filePath: string) => {
        /** default when readCSV is called then our progressing will be true */

        try {
            const data = await fs.readFile(filePath, {
                encoding: "utf8",
            });
            /**  We got data. so now let's process our data :) */
            //  console.log("data: ", data);
            this.process(data ?? "");
        } catch (error) {
            console.log("Fail to read file");
            process.exit(0);
        }
    };
    /**
     * Write SQL code
     */
    private writeSQL = async (statement: string) => {
        const { append } = useDirectory();
        try {
            const res = await append(statement, this.destinationFile);
            if (res) {
                this.responseMessage(EStatus.SUCCESS);
            }
        } catch (err) {
            this.responseMessage(EStatus.ERROR);
        }
    };

    /**
     * CSV data Processing for writing SQL
     * @param {string} data
     */
    private process = async (data: string) => {
        if (!validateString(data) || data.length < 10)
            return console.log("Invalid data");

        let values = "";
        const linesArray = data?.split(/\r|\n/).filter((line) => line);
        const columnNames: string[] = linesArray?.shift()?.split(",") as [];
        let beginSQLInsert = `INSERT INTO ${this.fileName} (`;

        if (columnNames?.length > 2) {
            columnNames.forEach((name) => (beginSQLInsert += `${name}, `));
            beginSQLInsert = beginSQLInsert.slice(0, -2) + ")\nVALUES\n";
        }

        linesArray?.forEach((line: any, index: number) => {
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
                this.writeSQL(`${beginSQLInsert}${values}`);
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
        this.writeSQL(`${beginSQLInsert}${values}`);
    };
    /**
     * End of the console message
     * @param {EStatus} status progressing status
     */
    private responseMessage = (status: EStatus) => {
        /**
         * TODO:
         * Handle all status like error pending etc...
         */
        console.log("Progressing finished...");
        switch (status) {
            case EStatus.SUCCESS:
                response(this.fileName, this.destinationFile);
                break;
            case EStatus.ERROR:
                response(
                    this.fileName,
                    this.destinationFile,
                    "Fail to convert file!"
                );
                break;
            default:
                response(
                    this.fileName,
                    this.destinationFile,
                    "Something went wrong!"
                );
        }
    };
    /**
     * show progressbar when data is on processing
     * @param {boolean} isActive based on this active status progressbar will be shows
     * @returns {void} nothing will returns
     * Since it's just a progressbar
     */
    public progressbar = (isActive: boolean): void => {};
}

const inserter = new Main();
inserter.run();
