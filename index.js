import fs from "node:fs/promises";
import { createInterface } from 'node:readline';



async function writeSQL (statement, saveFileAs = "") {
	try {
		const destinationFile = process.argv[2] || saveFileAs;

		if (!destinationFile) {
			throw new Error("Missing saveFileAs parameter");
		}

		await fs.writeFile(`sql/${process.argv[2]}.sql`, statement);
	} catch (err) {
		console.log(err);
	}
}

function previewSQL (fileData) {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout
	});


	rl.question(`Here's a preview of your SQL code:\n\n${fileData}\n\nDo you want to save it? (Yes/No) `, (reply) => {

		// Valid options
		const options = ["y", "yes", "n", "no"];

		let cleanReply = reply.trim().toLowerCase();

		if (options.includes(cleanReply)) {
			// Save or exit
			if (cleanReply[0] == 'y') {
				// Save
				writeSQL(fileData);
				console.log("SQL code successfully saved!");
			} else {
				console.log("SQL code not saved. Operation cancelled.");
			}

			// Close readline interface
			rl.close();
		} else {


			// User gave an invalid response, provide a chance to correct
			rl.setPrompt(`${reply.trim()} is an invalid response, do you want to save the file? (Yes | Y OR No | N) `);

			rl.prompt();

			// Set a limit on attempts
			let maxAttempts = 5;


			// Get user input every time they hit enter!
			rl.on("line", (userInput) => {

				if (maxAttempts > 0) {
					let cleanReply = userInput.trim().toLowerCase();

					if (options.includes(cleanReply)) {
						// Save or exit
						if (cleanReply[0] == 'y') {
							// Save
							writeSQL(fileData);
							console.log("SQL code successfully saved!");
						} else {
							console.log("SQL code not saved. Operation cancelled.");
						}
						// Close readline interface
						rl.close();

					} else {
						rl.setPrompt(`${userInput.trim()} is an invalid response, do you want to save the file? (Yes | Y OR No | N) `);
						rl.prompt();
					}
				} else {
					// Max attempts reached
					console.log("Maximum attempts exceeded. Operation cancelled.");
					rl.close();
				}
				// Decrement attempts
				maxAttempts--;

			});
		}
	});
}

async function readCSV (csvFileName = "") {
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

		// Preview and save
		previewSQL(sqlStatement);
	} catch (err) {
		console.log(err);
	}
}

readCSV();

