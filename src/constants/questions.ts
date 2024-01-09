import { QuestionCollection } from "inquirer";
import { getInputFiles } from "../services/index.js";
import { TConvertTo } from "../@types/index.js";

/** Terminal questions */
export const convertQuestions = (
    convertingTo: TConvertTo
): QuestionCollection => {
    switch (convertingTo) {
        case "csv-to-sql":
            return [
                {
                    type: "list",
                    name: "filename",
                    message: "Select your CSV file name:",
                    choices: getInputFiles("csv-to-sql"),
                },
            ];
        case "xlsv-to-sql":
            return [
                {
                    type: "list",
                    name: "filename",
                    message: "Select your XLSV file name:",
                    choices: getInputFiles("xlsv-to-sql"),
                },
            ];
        default:
            return [];
    }
};

export const generelQuestion = (fileName: string): QuestionCollection => {
    return [
        /** output destinations locations */
        {
            type: "input",
            name: "destination",
            message: "Destination (without extension):",
            default: fileName ?? "insert",
        },
    ];
};
