import { promises as fs } from 'fs';
import  {join}  from 'path';

async function writeSQL(statement: string, saveFileAs = '') {
  try {
    const destinationFile = process.argv[2] || saveFileAs;

    if (!destinationFile) {
      throw new Error('Missing saveFileAs parameter');
    }

    const filePath = join('sql', `${destinationFile}.sql`);
    await fs.writeFile(filePath, statement);
  } catch (err: unknown) {
    if (err instanceof Error) {
        console.error('Error:', err.message);
    } else {
      console.error('Unknown error:', err);
    }
  }
}

async function readCSV(csvFileName = '') {
  try {
    const fileAndTableName = process.argv[2] || csvFileName;

    if (!fileAndTableName) {
      throw new Error('Missing csvFileName parameter');
    }

    const filePath = join('csv', `${fileAndTableName}.csv`);
    const data = await fs.readFile(filePath, { encoding: 'utf8' });

    const linesArray = data.split(/\r?\n/).filter((line) => line);
    const columnNames = linesArray?.shift()?.split(',') || [];

    if (columnNames.length === 0) {
      throw new Error('CSV file is empty or has no header');
    }

    let beginSQLInsert = `INSERT INTO ${fileAndTableName} (`;
    columnNames.forEach((name) => (beginSQLInsert += `${name}, `));
    beginSQLInsert = beginSQLInsert.slice(0, -2) + ')\nVALUES\n';

    let values = '';
    linesArray.forEach((line) => {
      const arr = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

      if (arr.length !== columnNames.length) {
        throw new Error('Mismatched number of values in a row');
      }

      let valueLine = '\t(';
      arr.forEach((value) => {
        if (value === 'NULL' || !isNaN(+value)) {
          valueLine += `${value}, `;
        } else {
          valueLine += `"${value}", `;
        }
      });
      valueLine = valueLine.slice(0, -2) + '),\n';
      values += valueLine;
    });
    values = values.slice(0, -2) + ';';

    const sqlStatement = beginSQLInsert + values;

    // Write File
    await writeSQL(sqlStatement);
  } catch (err: unknown) {
      if (err instanceof Error) {
          console.error('Error:', err.message);
      } else {
        console.error('Unknown error:', err);
      }
  }
}

readCSV();

console.log('Finished!');
