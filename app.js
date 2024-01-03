const { SingleBar } = require("cli-progress");
const { cyan } = require("ansi-colors");

const progress = (total) => {
    const bar = new SingleBar({
        format:
            "Inserting |" +
            cyan("{bar}") +
            "| {percentage}% || {value}/{total}",
        barCompleteChar: "\u2588",
        barIncompleteChar: "\u2591",
        hideCursor: true,
    });
    /** the bar value - will be linear incremented */
    let value = 0;
    /** start */
    bar.start(total, value);

    const updateProgress = (increment) => {
        value += increment;
        bar.update(value);

        if (value >= total) {
            clearInterval(timer);
            bar.stop();
        }
    };
    const timer = setInterval(() => {
        // Simulate progress by incrementing the value
        updateProgress(1);
    }, 1);

    /** 20ms update rate */
    // const timer = setInterval(() => {
    //     value++;
    //     /** update the bar value */
    //     bar.update(value);

    //     /** set the limit */
    //     if (value >= bar.getTotal()) {
    //         /** stop timer */
    //         clearInterval(timer);
    //         bar.stop();
    //     }
    // });

    // for (let i = 0; i < total; i++) {
    //     updateProgress(1);
    // }
};

for (let i = 0; i < 201; i++) {
    progress(i);
}
