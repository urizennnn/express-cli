"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_config_1 = require("../config/cli.config");
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
        console.log(answer);
    });
}
(0, cli_config_1.initArgs)().then((args) => {
    if (args._ && args._[0] === 'create') {
        createExpress();
    }
});
