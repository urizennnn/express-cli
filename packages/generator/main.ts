import ejs from "ejs";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { preferences } from "../config/cli.config";
import { createJsonUponFreshStart } from "../../process/createJSON";
import { helperInject } from "./inject";

export const generateFiles = async (targetDir:string, templateDir:string, cdname:string) => {
  try {
    await helperInject(preferences.database);

    const templatePath = path.join(__dirname, templateDir);
    const appName = cdname as string;
    const targetPath = path.join(targetDir, appName);
    const pathExist = await fs.pathExists(targetPath);

    if (pathExist) {
      console.log(chalk.red(`Folder ${appName} already exists`));
      process.exit(1);
    }

    await fs.ensureDir(targetPath);

    let extension;
     extension = preferences.language === "TypeScript" ? "ts" : "js";

	//TODO: create a separate function for this
      createJsonUponFreshStart(preferences.packageManager, targetPath);
 

    const files = await fs.readdir(templatePath);
    for (const file of files) {
      const filePath = path.join(templatePath, file);
      const stats = await fs.stat(filePath);

      if (stats.isFile()) {
        const template = await fs.readFile(filePath, "utf-8");
        const rendered = ejs.render(template, { appName });
        const targetFilePath = path.join(
          targetPath,
          `${path.parse(file).name}.${extension}`
        );

        await fs.writeFile(targetFilePath, rendered);
      } else if (stats.isDirectory()) {
        const subDir = path.join(templateDir, file);
        await generateFiles(targetPath, subDir, path.basename(file));
      }
    }
  } catch (e) {
    console.log(chalk.red(e));
  }
};
