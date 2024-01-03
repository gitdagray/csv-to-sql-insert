import { SingleBar } from "cli-progress";
import { cyan } from "ansi-colors";

export const progress = (total: number) => {
    const bar = new SingleBar({
        format: "Inserting |" + cyan("{bar}") + "| {percentage}% || CSV to SQL",
        barCompleteChar: "\u2588",
        barIncompleteChar: "\u2591",
        hideCursor: true,
    });
    /** start */
    bar.start(100, total);

    const timer = setInterval(() => {
        bar.update(total);
    }, 20);

    if (total >= 200) {
        clearInterval(timer);
        bar.stop();
    }
};
