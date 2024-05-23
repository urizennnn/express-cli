const path = require('path')
const fs = require('fs')
const pathToVersion = path.join(__dirname, 'package.json');
const fileContent = fs.readFileSync(pathToVersion, 'utf8');
const packageJson = JSON.parse(fileContent);

console.log(packageJson.version)

