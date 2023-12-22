const fs = require("node:fs/promises");
const { listenerCount } = require("node:process");
const yargs = require("yargs");

// Use yargs to define command line options
const argv = yargs
  .option("saveFileAs", {
    alias: "s",
    describe: "Specify th ename of the file to save the SQL statement",
    type: "string",
  })
  .option("csvFileName", {
    alias: "c",
    describe: "Specify th ename of the file to save the SQL statement",
    type: "string",
  })
  .help().argv;

async function ensureDirectoryExists(directoryPath) {
  try {
    await fs.access(directoryPath, 0);
  } catch (error) {
    if (error.code === "ENOENT") {
      // Directory doesn't exist, create it
      await fs.mkdir(directoryPath, { recursive: true });
    } else {
      throw error;
    }
  }
}

async function writeSQL(statement, saveFileAs = "") {
  try {
    const destinationFile = argv.saveFileAs || saveFileAs;

    if (!destinationFile) {
      throw new Error("Missing saveFileAs parameter");
    }

    // Ensure that the "sql" directory exists
    await ensureDirectoryExists("sql");

    await fs.writeFile(`sql/${destinationFile}.sql`, statement);
  } catch (err) {
    console.log(err);
  }
}

function constructSQLStatement(columnNames, linesArray, tableName) {
  let beginSQLInsert = `INSERT INTO ${tableName} (`;
  columnNames.forEach((name) => (beginSQLInsert += `${name}, `));
  beginSQLInsert = beginSQLInsert.slice(0, -2) + ")\nVALUES\n";

  let values = "";
  linesArray.forEach((line) => {
    // Parse each line of CSV into fieldvalues array
    const arr = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    if (arr.length > columnNames.length) {
      console.log(arr);
      throw new Error("Too Many Values in row");
    } else if (arr.length < columnNames.length) {
      console.log(arr);
      throw new Error("Too Few Values in row");
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
  return beginSQLInsert + values.slice(0, -2) + ";";
}


async function readCSV(csvFileName = "") {
  try {
    const fileAndTableName = argv.csvFileName || csvFileName;

    if (!fileAndTableName) {
      throw new Error("Missing csvFileName parameter");
    }

    // Ensure that the "csv" directory exists
    await ensureDirectoryExists("csv");

    const data = await fs.readFile(`csv/${fileAndTableName}.csv`, {
      encoding: "utf8",
    });

    const linesArray = data.split(/\r|\n/).filter((line) => line);
    const columnNames = linesArray.shift().split(",");

    const sqlStatement = constructSQLStatement(columnNames, linesArray, fileAndTableName);

    // Write File
    // Added await to ensure it completes before proceeding
    await writeSQL(sqlStatement);
  } catch (err) {
    console.log(err);
  }
}

readCSV();

console.log("Finished!");
