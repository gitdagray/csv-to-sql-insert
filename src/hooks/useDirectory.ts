import { existsSync, mkdirSync, promises as fsPromises } from "fs";
import path from "path";

export const useDirectory = () => {
    // append data
    const append = (data: string, dest: string): Promise<boolean> => {
        return new Promise((resolve: any, reject: any) => {
            const output = path.dirname(`sql/${dest}.sql`);
            if (!existsSync(output)) {
                mkdirSync(output, { recursive: true });
            }
            fsPromises
                .writeFile(`sql/${dest}.sql`, data)
                .then(() => resolve(true))
                .catch((e) => reject(false));
        });
    };

    return {
        append,
    };
};
