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

// Path to .env file
const envFilePath = path.join(__dirname, '.env');

// Write platform to .env file
fs.writeFile(envFilePath, `PLATFORM="${platform}"\n`, (err) => {
    if (err) {
        console.error('Error writing to .env file:', err);
    } else {
        console.log('.env file has been updated');
    }
});

// Set the bin field based on the OS
if (isWindows) {
    packageJson.bin = { "express": "windows.exe" };
} else if (isLinux) {
    packageJson.bin = { "express": "linux" };
} else if (isMac) {
    packageJson.bin = { "express": "linux" };
}

// Write the modified package.json back to disk
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log(`Set the bin field in package.json for ${platform}`);

