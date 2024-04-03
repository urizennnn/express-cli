#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadingBar = exports.prompt = exports.args = void 0;
const { hideBin } = require('yargs/helpers');
const inquirer_1 = __importDefault(require("inquirer"));
exports.args = hideBin(process.argv);
exports.prompt = inquirer_1.default.createPromptModule();
function loadingBar() {
    const totalTicks = 10;
    let ticks = 0;
    const loadingInterval = setInterval(() => {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        const progress = ".".repeat(ticks) + " ".repeat(totalTicks - ticks);
        process.stdout.write(`Installing [${progress}]`);
        if (++ticks > totalTicks) {
            ticks = 0;
        }
    }, 100);
    return loadingInterval;
}
exports.loadingBar = loadingBar;
