import { SingleBar } from "cli-progress";
import { cyan } from "ansi-colors";

export const progress = () => {
    let pg = 0;

    const bar = new SingleBar({
        format:
            "CLI Progress |" +
            cyan("{bar}") +
            "| {percentage}% || {value}/{total} Chunks || Speed: {speed}",
        align: "left",
        autopadding: true,
        barsize: 10,
        hideCursor: true,
        synchronousUpdate: true,
        barCompleteChar: "\u2588",
        barIncompleteChar: "\u2591",
    });
    // initialize the bar - defining payload token "speed" with the default value "N/A"
    bar.start(100, 0, {
        speed: "N/A",
    });

    // update values
    bar.increment();
    bar.update(30);

    // stop the bar
    bar.stop();
};
