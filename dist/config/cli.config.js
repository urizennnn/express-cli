"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prompt = exports.args = exports.initArgs = void 0;
const yargs_1 = __importDefault(require("yargs"));
const inquirer_1 = __importDefault(require("inquirer"));
const cli = process.argv.slice(2);
async function initArgs() {
    const argv = await (0, yargs_1.default)(cli).argv;
    return argv;
}
exports.initArgs = initArgs;
exports.args = (0, yargs_1.default)(cli).argv;
exports.prompt = inquirer_1.default.createPromptModule();
