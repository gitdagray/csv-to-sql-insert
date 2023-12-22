const fs = require('node:fs/promises');

async function writeSQL(statement, saveFileAs = '') {
  try {
    const destinationFile = process.argv[2] || saveFileAs

    if (!destinationFile) {
      throw new Error("Missing saveFileAs parameter")
    }

    await fs.writeFile(`sql/${process.argv[2]}.sql`, statement);
  } catch (err) {
    console.log(err);
  }
}

async function readCSV(csvFileName = '') {
  try {

    const fileAndTableName = process.argv[2] || csvFileName

    if (!fileAndTableName) {
      throw new Error("Missing csvFileName parameter")
    }

    const data = await fs.readFile(`csv/${fileAndTableName}.csv`, { encoding: 'utf8' });

    const linesArray = data.split(/\r|\n/).filter(line => line)
    const columnNames = linesArray.shift().split(",")

    let createTable = createSQLTable({columnNames, linesArray, fileAndTableName})

    let beginSQLInsert = `INSERT INTO ${fileAndTableName} (`
    columnNames.forEach(name => beginSQLInsert += `${name}, `)
    beginSQLInsert = beginSQLInsert.slice(0, -2) + ")\nVALUES\n"

    let values = ''
    linesArray.forEach(line => {
      // Parses each line of CSV into field values array
      const arr = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)

      if (arr.length > columnNames.length) {
        console.log(arr)
        throw new Error("Too Many Values in row")
      } else if (arr.length < columnNames.length) {
        console.log(arr)
        throw new Error("Too Few Values in row")
      }

      let valueLine = '\t('
      arr.forEach(value => {
        // Matches NULL values, Numbers, 
        // Strings accepted as numbers, and Booleans (0 or 1)
        if (value === "NULL" || !isNaN(+value)) {
          valueLine += `${value}, `
        }
        else {
          // If a string is wrapped in quotes, it doesn't need more
          if (value.at(0) === '"') valueLine += `${value}, `
          else {
            // This wraps strings in quotes
            // also wraps timestamps
            valueLine += `"${value}", `
          }
        }
      })
      valueLine = valueLine.slice(0, -2) + "),\n"
      values += valueLine
    })
    values = values.slice(0, -2) + ";"

    const sqlStatement = createTable + beginSQLInsert + values

    // Write File 
    await writeSQL(sqlStatement)

    // optionally prints out table format
    const readTableFlag = process.argv[3] ?? null;
    if (readTableFlag && (readTableFlag === '-r' || readTableFlag === '--read')) {
      previewTable({filename: fileAndTableName})
    }

  } catch (err) {
    console.log(err);
  }
}

readCSV()

console.log('Finished!')

const createSQLTable = ({columnNames, linesArray, fileAndTableName}) => {
  if(!columnNames.length || !fileAndTableName) throw new Error('No Column Names OR No File name:\nError creating table')
  let createTable = `CREATE TABLE IF NOT EXISTS ${fileAndTableName} (\n`
  //define column names
  const columnsToLower = columnNames.map(name => name.toLowerCase())
  
  //column names with date in it
  const namesWithDate = nameHasDate(columnsToLower)
  // columns with int values
  const firstLine = linesArray[1].split(',').slice(1)
  const namesWithIntegers = isNumber(firstLine, columnNames.slice(1))
  const otherAttributes = getOtherAttributes(columnsToLower, ['id', ...namesWithIntegers])

  if (columnsToLower.includes('id')) createTable += `\tid\tINT PRIMARY KEY NOT NULL`
  if (namesWithIntegers.length) namesWithIntegers.map(name => createTable += `,\n\t${name}\tINT`)
  if (otherAttributes.length) otherAttributes.map(name => createTable += `,\n\t${name}\tVARCHAR(255)`)
  if (namesWithDate.length) namesWithDate.map(name => createTable += `,\n\t${name}\tDATE`)

  createTable += "\n);\n"
  return createTable
}

const nameHasDate = (names=[]) => {
  return names.filter(name => (name.toLowerCase()).includes('date'));
}
const isNumber = (values=[], names=[]) => {
  const numberValuesIndex = values.map((name, index) => !isNaN(name) ? index : null).filter(val => val !== null);
  return names.filter((name, index) => numberValuesIndex.includes(index) ? name : null).filter(val => val !== null);
}
const getOtherAttributes = (allNames=[], alreadyInsertedNames=[]) => {
  const namesInsertedToLower = alreadyInsertedNames.map(name => name.toLowerCase())
  return allNames.filter(name => !namesInsertedToLower.includes(name)).filter(name => !name.includes('date'))
}

const previewTable = async({filename}) => {
  const fsRead = await fs.readFile(`sql/${filename}.sql`, { encoding: 'utf8' })
  console.info(fsRead)
}