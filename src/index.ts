import { promises as fs, existsSync } from "fs";
import { createIfNot } from "./utils/fileUtils.js";
import * as path from "node:path";

async function writeSQL(statement: string, saveFileAs = "", isAppend: boolean = false) {
  try {
    const destinationFile = saveFileAs;
    if (!destinationFile) {
      throw new Error("Missing saveFileAs parameter");
    }
    createIfNot(path.resolve(`../sql/${destinationFile}.sql`));
    if (isAppend) {
      await fs.appendFile(`sql/${destinationFile}.sql`, statement);
    } else {
      await fs.writeFile(`sql/${destinationFile}.sql`, statement);
    }
  } catch (err) {
    console.log(err);
  }
}

async function readCSV(csvFileName = "", batchSize: number = 0) {
  try {
    const fileAndTableName = process.argv[2] || csvFileName;

    batchSize = parseInt(process.argv[3]) || batchSize || 500;
    let isAppend: boolean = false;

    if (!fileAndTableName) {
      throw new Error("Missing csvFileName parameter");
    }

    const csvFiles = fileAndTableName.split(",");

    for (const csvFile of csvFiles) {
      if (!existsSync(path.resolve(`./csv/${csvFile}.csv`))) {
        console.log(`File not found: ${csvFile}`);
        continue;
      }

      const data = await fs.readFile(`csv/${csvFile}.csv`, {
        encoding: "utf8",
      });
      const linesArray = data.split(/\r|\n/).filter((line) => line);
      const columnNames = linesArray?.shift()?.split(",") || [];
      let beginSQLInsert = `INSERT INTO ${csvFile} (`;
      columnNames.forEach((name) => (beginSQLInsert += `${name}, `));
      beginSQLInsert = beginSQLInsert.slice(0, -2) + ")\nVALUES\n";
      let values = "";
      linesArray.forEach((line, index) => {
        // Parses each line of CSV into field values array
        const arr = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (arr.length > columnNames.length) {
          console.log(arr);
          throw new Error("Too Many Values in row");
        } else if (arr.length < columnNames.length) {
          console.log(arr);
          throw new Error("Too Few Values in row");
        }

        // Check batch size (rows per batch)
        if (index > 0 && index % batchSize == 0) {
          values = values.slice(0, -2) + ";\n\n";

          const sqlStatement = beginSQLInsert + values;

          // Write File
          writeSQL(sqlStatement, csvFile, isAppend);
          values = "";
          isAppend = true;
        }

        let valueLine = "\t(";
        arr.forEach((value) => {
          // Matches NULL values, Numbers,
          // Strings accepted as numbers, and Booleans (0 or 1)
          if (value === "NULL" || !isNaN(+value)) {
            valueLine += `${value}, `;
          } else {
            // If a string is wrapped in quotes, it doesn't need more
            if (value.at(0) === '"') valueLine += `${value}, `;
            else {
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
      const sqlStatement = beginSQLInsert + values;
      // Write File
      writeSQL(sqlStatement, csvFile, isAppend);
    }
  } catch (err) {
    console.log(err);
  }
}

// Usage example: node yourScript.js file1,file2,file3
readCSV();
console.log("Finished!");
