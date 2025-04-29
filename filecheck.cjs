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

    // check for toml
    if (!fs.existsSync('./config.toml')) {
        if (fs.existsSync('./config.example.toml')) {
            fs.copyFileSync('./config.example.toml', './config.toml');
        } else {
            throw new Error('A config.toml file was not found. Please create it manually.');
        }
    }
    
    if(criticalError) throw new Error("Critical error: .env file not found. Please create it manually.");
}

checkAllFiles();