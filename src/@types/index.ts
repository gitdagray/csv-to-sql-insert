export type TConvertTo = "csv-to-sql" | "xlsv-to-sql";

export type TAnswer = {
    convertTo: TConvertTo;
    filename: string;
    destination: string;
};
