import fs from "node:fs/promises"

async function writeSQL(statement, saveFileAs = "") {
  try {
    const destinationFile = process.argv[2] || saveFileAs
    if (!destinationFile) {
      throw new Error("Missing saveFileAs parameter")
    }
    await fs.writeFile(`sql/${process.argv[2]}.sql`, statement)
  } catch (err) {
    console.log(err)
  }
}

async function readCSV(csvFileName = '', batchSize = 500) {
  try {
    const fileAndTableName = process.argv[2] || csvFileName;
    const isAppend = false; // Initialize isAppend directly

    if (!fileAndTableName) {
      throw new Error('Missing csvFileName parameter');
    }

    const filePath = `csv/${fileAndTableName}.csv`;
    
    if (!(await fileExists(filePath))) {
      console.log('File not found:', filePath);
      return;
    }

    const data = await fs.readFile(filePath, { encoding: 'utf8' });
    const linesArray = data.split(/\r|\n/).filter((line) => line);
    const columnNames = linesArray.shift()?.split(',') || [];
    let beginSQLInsert = `INSERT INTO ${fileAndTableName} (${columnNames.join(', ')})\nVALUES\n`;
    let values = '';

    linesArray.forEach((line, index) => {
      const arr = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

      // Validate the number of values in each row
      validateRow(arr, columnNames);

      if (index > 0 && index % batchSize === 0) {
        values = `${values.slice(0, -2)};\n\n`;
        const sqlStatement = `${beginSQLInsert}${values}`;
        
        writeSQL(sqlStatement, fileAndTableName, isAppend);
        values = '';
        isAppend = true;
      }

      let valueLine = '\t(';
      arr.forEach((value) => {
        // Handle NULL values, Numbers, Strings, and Booleans
        valueLine += value === 'NULL' || !isNaN(+value)
          ? `${value}, `
          : value.at(0) === '"'
            ? `${value}, `
            : `"${value}", `;
      });

      valueLine = `${valueLine.slice(0, -2)}),\n`;
      values += valueLine;
    });

    values = `${values.slice(0, -2)};`;
    const sqlStatement = `${beginSQLInsert}${values}`;
    
    writeSQL(sqlStatement, fileAndTableName, isAppend);
  } catch (err) {
    console.error(err);
  }
}

//file existence check 
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

//Extracted the validation logic
function validateRow(arr, columnNames) {
  if (arr.length !== columnNames.length) {
    console.error(arr);
    throw new Error(`Mismatched number of values in row. Expected: ${columnNames.length}, Actual: ${arr.length}`);
  }
}

readCSV();

console.log("Finished!")
