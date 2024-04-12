import {
  installMSQL,
  installMongo,
  installPGSQL,
} from "../../process/injectDatabase";
import chalk from "chalk";
import { exit } from "node:process";
import { installTSMSQL, installTSMongo, installTSPGSQL } from "../../process/TS/injectTSDatabse";

export async function helperInject(database: string) {
  try {
    if (database === "MongoDB") {
      await installMongo();
    } else if (database === "MSQL") {
      await installMSQL();
    } else if (database === "PGSQL") {
      await installPGSQL();
    }
  } catch (e) {
    console.log(chalk.red(e));
    exit(1);
  }
}
export async function helperInjectTS(database: string) {
  try {
    if (database === "MongoDB") {
      await installTSMongo();
    } else if (database === "MSQL") {
      await installTSMSQL();
    } else if (database === "PGSQL") {
      await installTSPGSQL();
    }
  } catch (e:any) {
    console.log(chalk.red(e.stack));
    exit(1);
  }
}
