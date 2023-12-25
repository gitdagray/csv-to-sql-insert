import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";

export const useDirectory = () => {
    // append data
    const append = async (data: string, dest: string) => {
        const output = path.dirname(`sql/${dest}.sql`);
        if (!existsSync(output)) {
            mkdirSync(output, { recursive: true });
        }
        writeFileSync(`sql/${dest}.sql`, data);
    };

    return {
        append,
    };
};
