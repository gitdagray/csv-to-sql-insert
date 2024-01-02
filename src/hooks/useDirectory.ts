import {
    existsSync,
    mkdirSync,
    writeFileSync,
    promises as fsPromises,
} from "fs";
import path from "path";

export const useDirectory = () => {
    // append data
    const append = (data: string, dest: string): Promise<void> => {
        return new Promise((resolve: any, reject) => {
            const output = path.dirname(`sql/${dest}.sql`);
            if (!existsSync(output)) {
                mkdirSync(output, { recursive: true });
            }
            fsPromises
                .writeFile(`sql/${dest}.sql`, data)
                .then(() => resolve("success"))
                .catch((e) => reject(e));
        });
    };
    // const append = async (data: string, dest: string) => {
    //     const output = path.dirname(`sql/${dest}.sql`);
    //     if (!existsSync(output)) {
    //         mkdirSync(output, { recursive: true });
    //     }
    //     writeFileSync(`sql/${dest}.sql`, data);
    // };

    return {
        append,
    };
};
