import { promises as fs ,existsSync} from "fs";
import {createIfNot} from "./utils/fileUtils.js"
import * as  path from "node:path"
async function writeSQL(statement: string, saveFileAs = "", isAppend: boolean = false) {
  try {
    const destinationFile = saveFileAs;
    if (!destinationFile) {
      throw new Error("Missing saveFileAs parameter");
    }
    createIfNot(path.resolve(`./sql/${destinationFile}.sql`))
		if(isAppend){
      await fs.appendFile(`sql/${destinationFile}.sql`, statement);
    }else{
      await fs.writeFile(`sql/${destinationFile}.sql`, statement);
    }
  } catch (err) {
    console.log(err);
  }
}

async function readCSV(csvFileName = "", batchSize: number = 0) {
  try {
    const fileAndTableName = csvFileName;
    
    batchSize = parseInt(process.argv[3]) || batchSize || 500;
		let isAppend: boolean = false;

    if (!fileAndTableName) {
      throw new Error("Missing csvFileName parameter");
    }
    if(!existsSync(path.resolve(`./csv/${fileAndTableName}.csv`))){
      console.log("file not found")
      return
    }
    const data = await fs.readFile(`csv/${fileAndTableName}.csv`, {
      encoding: "utf8",
    });
    const linesArray = data.split(/\r|\n/).filter((line) => line);
    const columnNames = linesArray?.shift()?.split(",") || [];
    let beginSQLInsert = `INSERT INTO ${fileAndTableName} (`;
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
      if(index > 0 && index % batchSize == 0){
        values = values.slice(0, -2) + ";\n\n";
    
        const sqlStatement = beginSQLInsert + values;
    
        // Write File 
        writeSQL(sqlStatement, fileAndTableName, isAppend);
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
    writeSQL(sqlStatement, fileAndTableName, isAppend);
  } catch (err) {
    console.log(err);
  }
}
var args = process.argv[2];
if(args === "all") {
  const files = await fs.readdir("./csv")
  files.forEach(file => {
    if(file.includes(".csv")) {
      const tableName = file.slice(0, -4);
      console.log(`Reading ${tableName}...`);
      readCSV(tableName);
    }
  })
}
else{
  console.log(`Reading ${args}...`);
  readCSV(args)
}

console.log("Finished!");
