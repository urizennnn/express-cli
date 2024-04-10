import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";
import { User } from "../../config/cli.config";
export const userProfile = process.env.USERPROFILE || process.env.HOME;
import{exit} from "node:process"

export function createFolderAndWriteConfig(preferences:User) {
  try {
    if (!userProfile) {
      console.error(
        chalk.red.underline("Unable to determine user profile directory.")
      );
      return;
    }
  
    const folderPath = path.join(userProfile, "@express-cli");
    const filePath = path.join(folderPath, ".express.config.json");
  
    fs.mkdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.error(chalk.red.underline("Error creating folder:", err));
        return;
      }
  
      fs.writeFile(filePath, JSON.stringify(preferences), (err) => {
        if (err) {
          console.error(chalk.red.underline("Error writing file:", err));
        } 
      });
    });
  } catch (e) {
    console.log(chalk.red(e));
    exit(1);
  }
}
