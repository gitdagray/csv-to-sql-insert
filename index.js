const fs = require('node:fs/promises');

async function writeSQL(statement) {
    try {
      await fs.writeFile(`sql/${process.argv[2]}.sql`, statement);
    } catch (err) {
      console.log(err);
    }
}

async function readCSV(csvFileName = '') {
  const fileAndTableName = process.argv[2] || csvFileName

  try {
    const data = await fs.readFile(`csv/${fileAndTableName}.csv`, { encoding: 'utf8' });
    
    const linesArray = data.split(/\r|\n/).filter(line => line)
    const columnNames = linesArray.shift().split(",")
    
    let insertStart = `INSERT INTO ${fileAndTableName} (`
    columnNames.forEach(name => insertStart += `${name}, `)
    insertStart = insertStart.slice(0,-2) + ")\nVALUES\n" 

    let values = ''
    linesArray.forEach(line => {
        const arr = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        
        if (arr.length > columnNames.length) {
            console.log(arr)
            throw new Error("Too Many Values in row")
        }

        const timestampRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/
        // value.match(timestampRegex) || 
        let valueLine = '\t('
        arr.forEach(value => {
            // NULL values
            // Numbers, Strings accepted as numbers, and Booleans (0 or 1)
            if (value === "NULL" || !isNaN(+value)) {
                valueLine += `${value}, `
            }
            else {
                // If a string is wrapped in quotes, it doesn't need more
                if (value.at(0) === '"') valueLine += `${value}, `
                else {
                    // This wraps strings in quotes that need them
                    // also wraps timestamps
                    valueLine += `"${value}", `
                }
            }
        })
        valueLine = valueLine.slice(0,-2) + "),\n"
        values += valueLine
    })
    values = values.slice(0,-2) + ";"

    const sqlStatement = insertStart + values

    // Write File 
    writeSQL(sqlStatement)

  } catch (err) {
    console.log(err);
  }
}

readCSV()

console.log('Finished!')