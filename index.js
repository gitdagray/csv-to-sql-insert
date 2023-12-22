import fs from "node:fs/promises";

async function writeSQL(statement, saveFileAs = "") {
	try {
		const destinationFile = process.argv[2] || saveFileAs;

		if (!destinationFile) {
			throw new Error("Missing saveFileAs parameter");
		}

		await fs.writeFile(`sql/${process.argv[2]}.sql`, statement);
	} catch (err) {
		console.error(err);
	}
}

async function readCSV(csvFileName = "") {
	try {
		const fileAndTableName = process.argv[2] || csvFileName;

		if (!fileAndTableName) {
			throw new Error("Missing csvFileName parameter");
		}

		const data = await fs.readFile(`csv/${fileAndTableName}.csv`, { encoding: "utf8" });

		const linesArray = data.split(/\r|\n/).filter((line) => line);
		const columnNames = linesArray.shift().split(",");

		let beginSQLInsert = `INSERT INTO ${fileAndTableName} (`;
		columnNames.forEach((name) => (beginSQLInsert += `${name}, `));
		beginSQLInsert = beginSQLInsert.slice(0, -2) + ")\nVALUES\n";

		let values = "";
		linesArray.forEach((line) => {
			// Parses each line of CSV into field values array
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
		values = values.slice(0, -2) + ";";

		const sqlStatement = beginSQLInsert + values;

		// Write File
		writeSQL(sqlStatement);
	} catch (err) {
		console.error(err);
	}
}

readCSV();

console.log("Finished!");
