import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";
import { User } from "../../config/cli.config";
export const userProfile = process.env.USERPROFILE || process.env.HOME;

export function createFolderAndWriteConfig(preferences:User) {
  if (!userProfile) {
    console.error(
      chalk.red.underline("Unable to determine user profile directory.")
    );
    return;
  }

  const folderPath = path.join(userProfile, "@express-cli");
  const filePath = path.join(folderPath, ".express.config");

  fs.mkdir(folderPath, { recursive: true }, (err) => {
    if (err) {
      console.error(chalk.red.underline("Error creating folder:", err));
      return;
    }

    fs.writeFile(filePath, JSON.stringify(preferences), (err) => {
      if (err) {
        console.error(chalk.red.underline("Error writing file:", err));
      } else {
        console.log(
          chalk.green.underline("Folder and file created successfully!")
        );
      }
    });
  });
}
