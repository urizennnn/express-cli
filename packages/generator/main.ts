import ejs from "ejs";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { preferences } from "../config/cli.config";
import { createJsonUponFreshStart } from "../../process/createJSON";
import { helperInject, helperInjectTS } from "./inject";
import { readConfig } from "../../process/readConfig";
import { injectEnv } from "../../process/injectEnv";
import { deleteFolder } from "../../process/deleteFile";
import { injectDb } from "../../process/injectDependencies";
import { initTs } from "../../process/TS/init";

export const generateFiles = async (
  targetDir: string,
  templateDir: string,
  cdname: string,
  flag: boolean = false
) => {
  try {
    await generate(targetDir, templateDir, cdname, flag);
  } catch (error: any) {
    console.log(chalk.red(error.stack));
    await deleteFolder(path.join(targetDir, cdname));
    process.exit(1);
  }
};

export const generateDefaultFiles = async (
  targetDir: string,
  templateDir: string,
  cdname: string,
  flag: boolean
) => {
  try {
    const data = await readConfig();
    if (!data || !data.database) {
      throw new Error("Database configuration not found.");
    }
    await generate(targetDir, templateDir, cdname, flag, data);
  } catch (error: any) {
    console.log(chalk.red(error.stack));
    await deleteFolder(path.join(targetDir, cdname));
    process.exit(1);
  }
};

async function generate(
  targetDir: string,
  templateDir: string,
  cdname: string,
  flag: boolean,
  data?: any
) {

  const database = data ? data.database : preferences.database;

 
  if ((data && data.language) || preferences.language === "TypeScript") {
    await helperInjectTS(database);
  } else if ((data && data.language) || preferences.language === "JavaScript") {
    await helperInject(database);
  }
  await injectEnv(database);

  const templatePath = path.join(__dirname, templateDir);
  const appName = cdname as string;
  const targetPath = path.join(targetDir, appName);

  
  if (await fs.pathExists(targetPath)) {
    console.log(chalk.red(`Folder ${appName} already exists`));
    process.exit(0);
  }

  await fs.ensureDir(targetPath);

  const extension =
    (data && data.language === "TypeScript") ||
    preferences.language === "TypeScript"
      ? "ts"
      : "js";

  if (extension === "ts") {
    if (flag) {
      await initTs(targetPath);
    }
  }

  if (flag) {
    await createJsonUponFreshStart({
      name: targetPath,
      PackageManager: data ? data.packageManager : preferences.packageManager,
    });
  }

  const files = await fs.readdir(templatePath);

  for (const file of files) {
    if (file.startsWith(".git")) {
      continue;
    }

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
      } else {
        const template = await fs.readFile(filePath, "utf-8");
        const rendered = ejs.render(template, { appName });
        await fs.writeFile(targetFilePath, rendered);
      }
    } else if (stats.isDirectory()) {
      const subDir = path.join(templateDir, file);
      await generate(targetPath, subDir, path.basename(file), false, data);
    }
  }

  if (preferences.injection || data?.injection === "pre installed") {
    await injectDb(targetPath, database);
  }
}