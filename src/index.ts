import { promises as fs, existsSync, stat } from "fs";
import * as path from "path";
import { readLine } from "./utils";
import { validateString } from "./validator";
import { useDirectory } from "./hooks/useDirectory";

class Main {
    private fileName: string = "";
    public destinationFile: string = "";
    constructor() {
        // Take file name from console
        readLine.question("Enter your CSV file name: ", (fileName) => {
            // file name exist or not
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
    }
    /**
     * Dicretory name reader
     */
    askDestinationFile = (filePath: string) => {
        // destination of our output sql file
        readLine.question("Destination name(file): ", (destinationFile) => {
            // directory name exist or not
            if (destinationFile.length > 1) {
                this.destinationFile = destinationFile;
            } else {
                this.destinationFile = this.fileName;
            }
            this.readCSV(filePath);
        });
    };
    /**
     * CSV Reader
     */
    readCSV = async (filePath: string) => {
        try {
            const data = await fs.readFile(filePath, {
                encoding: "utf8",
            });
            //  We got data. so now let's process our data :)
            //  console.log("data: ", data);
            this.process(data ?? "");
        } catch (error) {
            console.log("Fail to read file");
            process.exit(0);
        }
    };
    writeSQL = async (statement: string, isAppend?: boolean) => {
        const { write, append, createDirIfNot } = useDirectory();
        // create directory best on condition
        createDirIfNot(`${process.cwd()}/sql`);
        // if append is tru then we don't need to write file
        if (isAppend) {
            append(statement, this.destinationFile);
        } else {
            write(statement, this.destinationFile);
        }
    };

    /**
     * CSV Processing
     */
    process = async (data: string) => {
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
            if (
                newArray.length > columnNames.length &&
                newArray.length < columnNames.length
            )
                throw new Error("Invalid row items or column items :( ");
            /**
             * TODO:
             * Check batch size (rows per batch) and more...
             */
            if (index > 0 && index % 500 == 0) {
                values = values.slice(0, -2) + ";\n\n";
                // Write File
                this.writeSQL(`${beginSQLInsert}${values}`, false);
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
        this.writeSQL(`${beginSQLInsert}${values}`, true);
        this.endMessage();
    };
    /**
     * End message
     */
    endMessage = () => {
        console.log("==============================");
        console.log("CSV to SQL convert successfully");
        process.exit(0);
    };
}

new Main();

// import { promises as fs ,existsSync} from "fs";
// import {createIfNot} from "./utils/fileUtils.js"
// import * as  path from "node:path"

// async function writeSQL(statement: string, saveFileAs = "", isAppend: boolean = false) {
//   try {
//     const destinationFile = process.argv[2] || saveFileAs;
//     if (!destinationFile) {
//       throw new Error("Missing saveFileAs parameter");
//     }
//     createIfNot(path.resolve(`./sql/${destinationFile}.sql`))
// 		if(isAppend){
//       await fs.appendFile(`sql/${process.argv[2]}.sql`, statement);
//     }else{
//       await fs.writeFile(`sql/${process.argv[2]}.sql`, statement);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }

// async function readCSV(csvFileName = "", batchSize: number = 0) {
//   console.log("read CSV: ", csvFileName, "batch", batchSize)
//   try {
//     const fileAndTableName = process.argv[2] || csvFileName;

//     batchSize = parseInt(process.argv[3]) || batchSize || 500;
// 		let isAppend: boolean = false;

//     if (!fileAndTableName) {
//       throw new Error("Missing csvFileName parameter");
//     }
//     if(!existsSync(path.resolve(`./csv/${fileAndTableName}.csv`))){
//       console.log("file not found")
//       return
//     }
//     const data = await fs.readFile(`csv/${fileAndTableName}.csv`, {
//       encoding: "utf8",
//     });
//     console.log("sabbir: ",data)
//     const linesArray = data.split(/\r|\n/).filter((line) => line);
//     const columnNames = linesArray?.shift()?.split(",") || [];
//     let beginSQLInsert = `INSERT INTO ${fileAndTableName} (`;
//     columnNames.forEach((name) => (beginSQLInsert += `${name}, `));
//     beginSQLInsert = beginSQLInsert.slice(0, -2) + ")\nVALUES\n";
//     let values = "";
//     linesArray.forEach((line, index) => {
//       // Parses each line of CSV into field values array
//       const arr = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
//       if (arr.length > columnNames.length) {
//         console.log(arr);
//         throw new Error("Too Many Values in row");
//       } else if (arr.length < columnNames.length) {
//         console.log(arr);
//         throw new Error("Too Few Values in row");
//       }

//       // Check batch size (rows per batch)
//       if(index > 0 && index % batchSize == 0){
//         values = values.slice(0, -2) + ";\n\n";

//         const sqlStatement = beginSQLInsert + values;

//         // Write File
//         writeSQL(sqlStatement, fileAndTableName, isAppend);
//         values = "";
//         isAppend = true;
//       }

//       let valueLine = "\t(";
//       arr.forEach((value) => {
//         // Matches NULL values, Numbers,
//         // Strings accepted as numbers, and Booleans (0 or 1)
//         if (value === "NULL" || !isNaN(+value)) {
//           valueLine += `${value}, `;
//         } else {
//           // If a string is wrapped in quotes, it doesn't need more
//           if (value.at(0) === '"') valueLine += `${value}, `;
//           else {
//             // This wraps strings in quotes
//             // also wraps timestamps
//             valueLine += `"${value}", `;
//           }
//         }
//       });
//       valueLine = valueLine.slice(0, -2) + "),\n";
//       values += valueLine;
//     });
//     values = values.slice(0, -2) + ";";
//     const sqlStatement = beginSQLInsert + values;
//     // Write File
//     writeSQL(sqlStatement, fileAndTableName, isAppend);
//   } catch (err) {
//     console.log(err);
//   }
// }
// readCSV();
// console.log("Finished!");
