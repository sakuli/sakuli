const sprintf = require('util').format;

class Spinner {

    constructor(message, style) {
        this.spinnerMessage = message;
        this.spinnerStyle = style;
        this.timer = null;
    }

    start() {
        let spinner = this.spinnerStyle;

        if (!spinner || spinner.length === 0) {
            spinner = 'win32' === process.platform ? ['|', '/', '-', '\\'] : ['◜', '◠', '◝', '◞', '◡', '◟'];
        }

        const play = (arr, interval) => {
            let len = arr.length, i = 0;
            interval = interval || 100;

            const drawTick = () => {
                let str = arr[i++ % len];
                process.stdout.write('\u001b[0G' + str + '\u001b[90m' + this.spinnerMessage + '\u001b[0m');
            };

            this.timer = setInterval(drawTick, interval);
        };

        const frames = spinner.map(function (c) {
            return sprintf('  \u001b[96m%s ', c);
        });

        play(frames, 70);
    }

    message(message) {
        this.spinnerMessage = message;
    };

    stop() {
        process.stdout.write('\u001b[0G\u001b[2K');
        clearInterval(this.timer);
    };
}


const spinner = new Spinner('Running');
spinner.start();
setTimeout(() => {
    spinner.stop()
}, 5000);