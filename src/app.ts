import inquirer from "inquirer";
import { TConvertTo } from "./@types/index.js";
import { convertTo } from "./services/index.js";
import { convertQuestions, generelQuestion } from "./constants/index.js";
import { skipExtension } from "./validator/index.js";
import { loading } from "cli-loading-animation";
import { CsvToSql } from "./modules/index.js";
import cliSpinner from "cli-spinners";
import { response } from "./libs/index.js";

const { start, stop } = loading("Progressing...", {
    spinner: cliSpinner.fistBump,
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
        generelQuestion(skipExtension(filename))
    );
    /** loading start */
    start();
    /**
     * Read File | Processing File | and also Write file
     */
    /** make destination filename without any file extension */
    const destinationSkipExtension = skipExtension(destination);
    /** make filename without any file extension */
    const fileNameSkipExtension = skipExtension(filename);
    /** Create a instance of CsvToSql class */
    /** It's need to must pass destination filename without any extension and also filename without any extension */
    const insert = new CsvToSql(
        destinationSkipExtension,
        fileNameSkipExtension
    );
    try {
        /** read data from the csv file */
        const data = await insert.readingCSVFile();
        /** process and write sql code within this method */
        await insert.processingCSVFile(data, fileNameSkipExtension);
        stop();
        /** send a response to user */
        response(fileNameSkipExtension, destinationSkipExtension);
    } catch (err) {
        stop();
        return response(
            fileNameSkipExtension,
            destinationSkipExtension,
            "Fail to Insert SQL data!"
        );
    }
};

main().catch(() => {
    process.exit(1);
});
