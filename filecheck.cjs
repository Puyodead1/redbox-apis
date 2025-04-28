// Welcome! This script is used to check for the status of certain configuration files. It will create default files if they do not exist.

const fs = require('fs');
const path = require('path');
let criticalError = false;

// check for environment variables
function checkEnvVariables(location) {
    if(!fs.existsSync(path.join(__dirname, location, '.env'))) {
        let message = `An .env file for the directory "${location}" was not found.`;

        if(!fs.existsSync(path.join(__dirname, location, '.env.example'))) {
            message += ' Please create your configuration file manually.';
            criticalError = true; // we can't continue without the .env file, it's critical
        } else {
            fs.copyFileSync(path.join(__dirname, location, '.env.example'), path.join(__dirname, location, '.env'));
            message += ' A default configuration file has been created.';
        }

        console.log(message);
    }
}

async function checkAllFiles() {
    checkEnvVariables('./'); // Check for the root directory
    checkEnvVariables('./packages/redbox-perks'); // Check for the redbox-perks project

    require('dotenv').config();
    const dbPath = process.env.DATABASE_PATH || 'database';
    const database = path.isAbsolute(dbPath) ? dbPath : path.join(__dirname, dbPath);

    // Check if each required file exists, if not, create it with default content
    const requiredFiles = ['credentials.json', 'users.json'];

    if (!fs.existsSync(database)) {
        throw new Error("Critical error: Database path does not exist, it looks like you're missing required files. Please re-download this project.");
    }

    for (const file of requiredFiles) {
        const filePath = path.join(database, file);
        if (!fs.existsSync(filePath)) {
            let content = {};

            // check if .example.json exists
            let example = path.join(database, file.replace('.json', '.example.json'));
            if (fs.existsSync(example)) {
                content = JSON.parse(fs.readFileSync(example, 'utf8'));
            } else if(file === 'credentials.json') {
                content = { "desktop": [], "field": [] };
            } else if(file === 'users.json') {
                content = [];
            }

            fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
        }
    }

    if(criticalError) throw new Error("Critical error: .env file not found. Please create it manually.");
}

checkAllFiles();