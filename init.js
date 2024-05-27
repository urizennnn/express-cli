const fs = require('fs');
const path = require('path');

// Determine the OS
const platform = process.platform;
const isWindows = platform === 'win32';
const isLinux = platform === 'linux';
const isMac = platform === 'darwin';

// Path to package.json
const packageJsonPath = path.join(__dirname, 'package.json');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Set the bin field based on the OS
if (isWindows) {
    packageJson.bin = { "express": "bin/windows.exe" };
} else if (isLinux) {
    packageJson.bin = { "express": "bin/linux" };
} else if (isMac) {
    packageJson.bin = { "express": "bin/linux" };
}

// Write the modified package.json back to disk
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log(`Set the bin field in package.json for ${platform}`);

