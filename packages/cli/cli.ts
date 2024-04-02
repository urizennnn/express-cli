import { prompt, args } from "../config/cli.config";
import { exec, ExecException } from 'child_process';

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
]

export function createExpress() {
    prompt(question).then((answer) => {
        return console.log(answer);
    })
}

export function installDependencies(...args: string[]) {
    const argv = args.join(' ');

    import('chalk').then(chalk => {
        exec(`npm install ${argv}`, (error: ExecException | null, stdout: string, stderr: string) => {
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
