const yargs = require('yargs');
const fs = require('fs-extra');

// Define command-line arguments and options
const argv = yargs
    .options({
        name: {
            type: 'string',
            describe: 'Name of the project',
        },
        initialVersion: {
            type: 'string',
            describe: 'Initial version',
        },
        description: {
            type: 'string',
            describe: 'Description of the project',
        },
        author: {
            type: 'string',
            describe: 'Author of the project',
        },
        license: {
            type: 'string',
            describe: 'License for the project',
        },
    })
    .help()
    .argv;

// Generate package.json based on arguments
async function generatePackageJson() {
    const packageJson = {
        name: argv.name,
        version: argv.initialVersion,
        description: argv.description,
        author: argv.author,
        license: argv.license,
    };

    // Write package.json to file
    fs.writeJsonSync('package.json', packageJson, { spaces: 2 });

    console.log('Initialized package.json');
}

// Invoke the generation process
generatePackageJson();
