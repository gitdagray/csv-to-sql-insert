import inquirer from "inquirer";
import { TConvertTo } from "./@types/index.js";
import { convertTo } from "./services/index.js";
import { convertQuestions, generelQuestion } from "./constants/index.js";
import { validFileName } from "./validator/index.js";
import { loading } from "cli-loading-animation";
import { CsvToSql } from "./modules/index.js";
import cliSpinner from "cli-spinners";
import { response } from "./libs/index.js";

const { start, stop } = loading("Progressing...", {
    spinner: cliSpinner.dots,
});

const main = async () => {
    /** Ask a converting to question */
    const { convertingTo } = await inquirer.prompt<{
        convertingTo: TConvertTo;
    }>([
        {
            type: "list",
            name: "convertingTo",
            message: "Select convert:",
            choices: convertTo,
        },
    ]);
    /** ask a file name */
    const { filename } = await inquirer.prompt<{ filename: string }>(
        convertQuestions(convertingTo)
    );
    /** ask a destination name with default file name */
    const { destination } = await inquirer.prompt<{ destination: string }>(
        generelQuestion(validFileName(filename))
    );
    /** loading start */
    start();
    /**
     * Read File | Processing File | and also Write file
     */
    const insert = new CsvToSql(
        validFileName(destination),
        validFileName(filename)
    );
    try {
        /** read data from the csv file */
        const data = await insert.readingCSVFile();
        /** process and write sql code within this method */
        await insert.processingCSVFile(data, validFileName(filename));
        stop();
        /** send a response to user */
        response(validFileName(filename), validFileName(destination));
    } catch (err) {
        stop();
        return response(
            validFileName(filename),
            validFileName(destination),
            "Fail to Insert SQL data!"
        );
    }
};

main().catch(() => {
    process.exit(1);
});
