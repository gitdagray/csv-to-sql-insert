import { promises as fs } from 'fs';
import  {join}  from 'path';

async function writeSQL(statement: string, fileName:string, saveFileAs = '') {
  try {
    const destinationFile = fileName || saveFileAs;

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

async function readDirectory(rootDir : string) {

  try {
    const files = await fs.readdir(rootDir);
    const fileNames: string[] = files.map((file) => file.toString());
    console.log('File names:', fileNames);
    return fileNames;
  } catch (err) {
    console.error('Error reading directory:', err);
  }
}

async function readFile(fileName : string) {

  const fullPath = join('csv', fileName.endsWith('.csv') ? fileName : `${fileName}.csv`);
  const data = await fs.readFile(fullPath, { encoding: 'utf8' });

  const linesArray = data.split(/\r?\n/).filter((line) => line);
  const columnNames = linesArray?.shift()?.split(',') || [];

  if (columnNames.length === 0) {
    throw new Error('CSV file is empty or has no header');
  }

  let beginSQLInsert = `INSERT INTO ${fileName} (`;
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

  await writeSQL(sqlStatement, fileName);
}

async function readCSV() {

  try {
    if(process.argv[2]) {
      const fileName = process.argv[2];
      readFile(fileName)
    } else {
      const rootDir = './csv' ;
      const fileNames : string[] | undefined = await readDirectory(rootDir)

      for (const fileName of fileNames || []) {
        await readFile(fileName);
      }
    }

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
