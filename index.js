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

    // create the table first and define the parameters
    let createTable = `CREATE TABLE IF NOT EXISTS ${fileAndTableName} (\n`
    //define column names
    const columnsToLower = columnNames.map(name => name.toLowerCase())
    
    //column names with date in it
    const namesWithDate = nameHasDate(columnsToLower)
    // columns with int values
    // const firstlineWithVlues = linesArray.shift().split(",")
    const firstLine = linesArray[1].split(',').slice(1)
    const namesWithIntegers = isNumber(firstLine, columnNames.slice(1))
    // remaining columns
    const otherAttributes = getOtherAttributes(columnsToLower, ['id', ...namesWithIntegers])
    // add Id attribute
    if (columnsToLower.includes('id')) createTable += `\tid\tINT PRIMARY KEY NOT NULL`
    // add integers attribute
    if (namesWithIntegers.length) namesWithIntegers.map(name => createTable += `,\n\t${name}\tINT`)
    // add other attributes
    if (otherAttributes.length) otherAttributes.map(name => createTable += `,\n\t${name}\tVARCHAR(255)`)
    // add attributes with date
    if (namesWithDate.length) namesWithDate.map(name => createTable += `,\n\t${name}\tDATE`)
    createTable += "\n);\n"

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
    writeSQL(sqlStatement)

  } catch (err) {
    console.log(err);
  }
}

readCSV()

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
console.log('Finished!')