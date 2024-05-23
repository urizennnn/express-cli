const path = require('path');
const fs = require('fs');

function getPackageVersion() {
    const pathToVersion = path.join(__dirname, 'package.json');
    const fileContent = fs.readFileSync(pathToVersion, 'utf8');
    const packageJson = JSON.parse(fileContent);
    return packageJson;
}

console.log(getPackageVersion());

