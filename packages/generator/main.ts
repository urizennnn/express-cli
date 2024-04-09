import ejs from "ejs";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { preferences } from "../config/cli.config";
import { createJsonUponFreshStart } from "../../process/createJSON";
import { helperInject } from "./inject";
import { readConfig } from "../../process/readConfig";
import { injectEnv } from "../../process/injectEnv";
import { exit } from "node:process";

export const generateFiles = async (
  targetDir: string,
  templateDir: string,
  cdname: string,
  flag: boolean = false
) => {
  try {
    let data;
    if (flag) {
      data = await readConfig();
    }

    const database = preferences.database || data.database;
    await helperInject(database);
    await injectEnv(database);

    const templatePath = path.join(__dirname, templateDir);
    const appName = cdname as string;
    const targetPath = path.join(targetDir, appName);
    const pathExist = await fs.pathExists(targetPath);

    if (pathExist) {
      console.log(chalk.red(`Folder ${appName} already exists`));
      return exit(0);
    }

    await fs.ensureDir(targetPath);
    let extension;
    extension = preferences.language === "TypeScript" ? "ts" : "js";

    if (flag) {
      await createJsonUponFreshStart({
        name: targetPath,
        PackageManager: data.packageManager || preferences.packageManager,
      });
    }

    const files = await fs.readdir(templatePath);
    for (const file of files) {
      const filePath = path.join(templatePath, file);
      const targetFilePath = path.join(
        targetPath,
        file.startsWith(".") ? file : `${path.parse(file).name}.${extension}`
      );

      const stats = await fs.stat(filePath);

      if (stats.isFile()) {
        const fileName = path.basename(file);
        if (fileName.startsWith(".env")) {
          await fs.copyFile(filePath, targetFilePath);
          console.log(chalk.green(`Copied ${fileName} to ${targetPath}`));
        } else {
          const template = await fs.readFile(filePath, "utf-8");
          const rendered = ejs.render(template, { appName });
          await fs.writeFile(targetFilePath, rendered);
        }
      } else if (stats.isDirectory()) {
        const subDir = path.join(templateDir, file);
        await generateFiles(targetPath, subDir, path.basename(file));
      }
    }
  } catch (e) {
    console.log(chalk.red(e));
    return exit(1);
  }
};
