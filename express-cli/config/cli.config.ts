import yargs from "yargs"
import inquirer from "inquirer"

const cli = process.argv.slice(2);

export async function initArgs(): Promise<yargs.Arguments> {
    const argv = await yargs(cli).argv;
    return argv;
}

export const args  = yargs(cli).argv
export const prompt = inquirer.createPromptModule()
