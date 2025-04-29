// Welcome! This script is used to migrate the previous database system for Redbox Perks to the new one (with the help of Prisma).

const fs = require('fs');
const path = require('path');
const { getPrisma } = require('./packages/db');

require('dotenv').config();
const dbPath = process.env.DATABASE_PATH || 'database';
const database = path.isAbsolute(dbPath) ? dbPath : path.join(__dirname, dbPath);

async function migrateUsers() {
    const filePath = path.join(database, 'users.json');

    // check if users.json exists
    if(!fs.existsSync(filePath)) {
        console.log('Success! No users.json file found. No migration needed.');
        return;
    }

    // check if users.json is empty
    const users = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if(users.length === 0) return console.log('Success! No users found. No migration needed.');

    // merge users.json to prisma database
    const prisma = await getPrisma();
    for (const user of users) {
        await prisma.user.upsert({
            where: { cpn: user.cpn },
            update: {
              signupDate: user.signupDate,
              firstName: user?.firstName,
              emailAddress: user?.emailAddress,
              phoneNumber: user?.phoneNumber,
              password: user.password,
              pin: user?.pin,
              hashed: user.hashed,
              loyalty: user.loyalty,
              promoCodes: user.promoCodes,
              disabled: user?.disabled,
            },
            create: {
              cpn: user.cpn,
              signupDate: user.signupDate,
              firstName: user?.firstName,
              emailAddress: user?.emailAddress,
              phoneNumber: user?.phoneNumber,
              password: user.password,
              pin: user?.pin,
              hashed: user.hashed,
              loyalty: user.loyalty,
              promoCodes: user.promoCodes,
              disabled: user?.disabled,
            }
        });
    }

    return console.log(`Success! Your ${users.length} user${users.length > 1 ? 's' : ''} ${users.length === 1 ? 'was' : 'were'} migrated to Prisma database.`);
}

async function migrateTransactions() {
    const filePath = path.join(database, 'transactions.json');

    // check if transactions.json exists
    if(!fs.existsSync(filePath)) {
        console.log('Success! No transactions.json file found. No migration needed.');
        return;
    }

    // check if transactions.json is empty
    const transactions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if(Object.keys(transactions).length === 0) return console.log('Success! No transactions found. No migration needed.');

    // merge transactions.json to prisma database
    const prisma = await getPrisma();
    for (const [transactionId, trans] of Object.entries(transactions)) {
        await prisma.transaction.upsert({
            where: { transactionId },
            update: {
                email: trans?.email,
                kioskId: trans?.kioskId,
                transactionDate: trans?.transactionDate,
                customerProfileNumber: trans?.customerProfileNumber,
                items: trans.items,
                discounts: trans.discounts,
                cardInformation: trans.cardInformation
            },
            create: {
                transactionId,
                email: trans?.email,
                kioskId: trans?.kioskId,
                transactionDate: trans?.transactionDate,
                customerProfileNumber: trans?.customerProfileNumber,
                items: trans.items,
                discounts: trans.discounts,
                cardInformation: trans.cardInformation
            }
        });
    }

    return console.log(`Success! Your ${Object.keys(transactions).length} transaction${Object.keys(transactions).length > 1 ? 's' : ''} ${Object.keys(transactions).length === 1 ? 'was' : 'were'} migrated to Prisma database.`);
}

async function migrateCredentials() {
    const filePath = path.join(database, 'credentials.json');
    const tomlPath = './config.toml';

    // check if credentials.json exists
    if(!fs.existsSync(filePath)) {
        console.log('Success! No credentials.json file found. No migration needed.');
        return;
    }

    // check if config.toml exists
    if(!fs.existsSync(tomlPath)) {
        console.log("It looks like you don't have a config.toml file. Please build the project before running, or run filecheck.cjs to create it manually.");
        return;
    }

    // check if credentials.json is empty
    const credentials = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if(credentials.desktop.length === 0 && credentials.field.length === 0) return console.log('Success! No credentials found. No migration needed.');

    // merge credentials.json to prisma database
    let toml = fs.readFileSync(tomlPath, 'utf8');

    for (const login of credentials.desktop) {
        toml += `\n\n[[loginInfo.desktop]]\nusername = "${login.username.replace(/"/g, '\\"')}"\npassword = "${login.password.replace(/"/g, '\\"')}"`;
    }

    for (const login of credentials.field) {
        toml += `\n\n[[loginInfo.field]]\nusername = "${login.username.replace(/"/g, '\\"')}"\npassword = "${login.password.replace(/"/g, '\\"')}"`;
    }

    fs.writeFileSync(tomlPath, toml, 'utf8');
    return console.log(`Success! Your login credentials have been migrated to the TOML configuration.`);
}

async function startMigration() {
    console.log('It looks like you are using the old database system. This script will migrate your database to the new one (with Prisma).');
    await migrateUsers();    
    await migrateTransactions();
    await migrateCredentials();

    await fs.promises.rm(database, { recursive: true, force: true });
    console.log('All migrations has been successfully completed!');
    process.exit(0);
}

if (!fs.existsSync(database)) {
    console.log('Success! No database folder found. No migration needed.');
    process.exit(0);
} else {
    startMigration();
}