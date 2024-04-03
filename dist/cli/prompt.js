#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const { args } = require("../config/cli.config");
const cli_1 = require("./cli");
yargs_1.default.command({
    command: "create",
    describe: "Create a new express app",
    handler(args) {
        (0, cli_1.createExpress)();
    },
});
yargs_1.default.command({
    command: "install",
    aliases: "i",
    describe: "Install dependencies",
    handler: (args) => {
        const packageNames = args._.slice(1);
        (0, cli_1.installDependencies)(...packageNames);
    }
});
yargs_1.default.parse(args);
