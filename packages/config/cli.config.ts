#!/usr/bin/env node

const { hideBin } = require('yargs/helpers');
import yargs from "yargs";

import inquirer from "inquirer"


export const args = hideBin(process.argv);
export const prompt = inquirer.createPromptModule()
export function simulateLoading() {
    const totalTicks = 10;
    let ticks = 0;

    const loadingInterval = setInterval(() => {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);

        const progress = '.'.repeat(ticks) + ' '.repeat(totalTicks - ticks);
        process.stdout.write(`Loading [${progress}]`);

        if (++ticks > totalTicks) {
            clearInterval(loadingInterval);
            console.log('\nLoading complete!');
        }
    }, 100); // Adjust the interval as needed
}

simulateLoading();
