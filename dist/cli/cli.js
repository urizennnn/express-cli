"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installDependencies = exports.createExpress = void 0;
const cli_config_1 = require("../config/cli.config");
const child_process_1 = require("child_process");
const question = [
    {
        type: 'list',
        name: 'package',
        message: 'Choose package manager',
        choices: ['npm', 'yarn', 'pnpm'],
        default: 'npm',
    },
    {
        type: 'list',
        name: 'language',
        message: 'Choose language',
        choices: ['JavaScript', 'TypeScript'],
        default: 'JavaScript',
    },
    {
        type: 'list',
        name: 'dependency',
        message: 'Would you like to add pre installed dependencies or a fresh start?',
        choices: ['pre installed', 'fresh start'],
        default: 'pre installed',
    }
];
function createExpress() {
    (0, cli_config_1.prompt)(question).then((answer) => {
        return console.log(answer);
    });
}
exports.createExpress = createExpress;
function installDependencies(...args) {
    const argv = args.join(' ');
    Promise.resolve().then(() => __importStar(require('chalk'))).then(chalk => {
        (0, child_process_1.exec)(`npm install ${argv}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`npm install error: ${error.message}`);
                return;
            }
            console.log(chalk.default.green(`Successfully installed ${argv}.`));
        });
    }).catch(error => {
        console.error(`Error loading chalk: ${error}`);
    });
}
exports.installDependencies = installDependencies;
