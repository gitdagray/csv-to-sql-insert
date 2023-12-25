import { existsSync, mkdirSync } from "fs";
import { appendFile, writeFile } from "fs/promises";

export const useDirectory = () => {
    const createDirIfNot = async (dir: string) => {
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
        }
    };
    // append data
    const append = async (data: string, dest: string) => {
        try {
            await appendFile(`${process.cwd()}/sql/${dest}.sql`, data);
        } catch (error) {
            console.error(`Fail to append data into ${dest}.sql`);
        }
    };

    const write = async (data: string, dest: string) => {
        try {
            await writeFile(`${process.cwd()}/sql/${dest}.sql`, data);
        } catch (error) {
            console.error(`Fail to write ${dest}.sql file!`);
        }
    };

    return {
        write,
        append,
        createDirIfNot,
    };
};
