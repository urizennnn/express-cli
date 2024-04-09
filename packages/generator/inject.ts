import { installMSQL,installMongo,installPGSQL } from "../../process/injectDatabase";
import chalk from "chalk";
import { exit } from "node:process";

export async function helperInject(database:string){
    try {
        if (database === "MongoDB") {
         await installMongo();
        } else if (database === "MSQL") {
        await  installMSQL();
        } else if (database === "PGSQL") {
         await installPGSQL();
        }
    } catch (e) {
        console.log(chalk.red(e));
        exit(1);
    }
}