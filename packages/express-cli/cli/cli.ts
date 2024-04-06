import { generateFiles } from "../../generator/main.js";
import { prompt, loadingBar, preferences } from "../../config/cli.config.js";
import { exec } from "child_process";
import { createFolderAndWriteConfig } from "./helper.js";
import chalk from "chalk";

const question = [
	{
		type: "list",
		name: "package",
		message: "Choose package manager?",
		choices: ["npm", "yarn", "pnpm"],
		default: "npm",
	},
	{
		type: "list",
		name: "language",
		message: "Choose language?",
		choices: ["JavaScript", "TypeScript"],
		default: "JavaScript",
	},
	{
		type: "list",
		name: "database",
		message: "What database are you using?",
		choices: ["MongoDB", "MSQL", "PGSQL", "Other"],
	},
	{
		type: "list",
		name: "dependency",
		message:
			"Would you like to add pre installed dependencies or a fresh start?",
		choices: ["pre installed", "fresh start"],
		default: "pre installed",
	},
];
export async function createDefault() {}
export async function createExpress(name: string) {
	prompt(question).then(
		async (answer) => {
			preferences.language = answer.language;
			preferences.database = answer.database;
			preferences.injection = answer.dependency;
			preferences.packageManager = answer.package;

			if (preferences.language === "TypeScript") {
				await generateFiles(name, process.cwd(), "templates", ".ts");
			} else {
				await generateFiles(name, process.cwd(), "templates",".js");
			}


			return createFolderAndWriteConfig(preferences);

		}
	);
}

export async function installDependencies(flags?:string, ...args:string[]) {
	const argv = args.join(" ");

	// const chalk = await import("chalk");

	console.log(chalk.green(`Installing ${argv}...`));

	const interval = loadingBar("Installing");

	if (preferences.packageManager === "yarn") {
		exec(
			`${preferences.packageManager} add ${flags} ${argv}`,
			(error, stdout, stderr) => {
				clearInterval(interval);
				process.stdout.clearLine(0);
				process.stdout.cursorTo(0);
				process.stdout.write("\nInstalled [.........]");
				if (error) {
					console.error(
						`${preferences.packageManager} install error: ${error.message}`
					);
					return;
				}

				console.log(chalk.green(`\nSuccessfully installed ${argv}.`));
			}
		);
	} else if (preferences.packageManager === "pnpm") {
		exec(
			`${preferences.packageManager} install ${flags} ${argv}`,
			(error, stdout , stderr) => {
				clearInterval(interval);
				process.stdout.clearLine(0);
				process.stdout.cursorTo(0);
				process.stdout.write("\nInstalled [.........]");
				if (error) {
					console.error(`npm install error: ${error.message}`);
					return;
				}

				console.log(chalk.green(`\nSuccessfully installed ${argv}.`));
			}
		);
	} else {
		exec(
			`npm install ${flags} ${argv}`,
			(error, stdout, stderr) => {
				clearInterval(interval);
				process.stdout.clearLine(0);
				process.stdout.cursorTo(0);
				process.stdout.write("\nInstalled [.........]");
				if (error) {
					console.error(`npm install error: ${error.message}`);
					return;
				}

				console.log(chalk.green(`\nSuccessfully installed ${argv}.`));
			}
		);
	}
}

export async function removeDependencies(...args:string[]) {
	const argv = args.join(" ");

	// const chalk = await import("chalk");

	console.log(chalk.green(`Removing ${argv}...`));

	const interval = loadingBar("Removing");

	exec(
		`npm remove ${argv}`,
		(error, stdout, stderr) => {
			clearInterval(interval);
			process.stdout.clearLine(0);
			process.stdout.cursorTo(0);
			process.stdout.write("\nRemoved [.........]");
			if (error) {
				console.error(`npm remove error: ${error.message}`);
				return;
			}

			console.log(chalk.green(`\nSuccessfully removed ${argv}.`));
		}
	);
}
