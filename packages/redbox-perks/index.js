const { rateLimit } = require('express-rate-limit');
const session = require('express-session');
const express = require('express');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { SMTPClient } = require('emailjs');
require('dotenv').config({ path: "./.env" });
const { getPrisma } = require("../db");

const app = express();
const RATE_LIMITING = process.env.RATE_LIMITING === 'true' ? true : false;
app.locals.recaptcha = process.env.USE_RECAPTCHA === 'true' ? process.env.RECAPTCHA_PUBLIC_KEY : null;

const API_CONFIGURATION = require('dotenv').parse(fs.readFileSync(path.join(__dirname, '../../', '.env')));

const GENERAL_RATE_LIMIT = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    limit: 300, // 300 requests per IP per 24 hours (this is for the entire website, so just viewing the pages counts)
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: "It looks like you've reached the maximum requests. Please try again in 24 hours."
});

const LOGIN_RATE_LIMIT = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    limit: 30, // 30 logins per IP per 24 hours (we're being generous here, in case it fails sometimes)
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: "It looks like you've reached the maximum login attempts. Please try again in 24 hours."
});

const SIGNUP_RATE_LIMIT = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    limit: 5, // 5 signups per IP per 24 hours (we're being generous here, in case it fails sometimes)
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: "It looks like you've already created an account. Please try again in 24 hours."
});

const UPDATE_RATE_LIMIT = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 60, // 60 account updates per IP per 5 minutes
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: "It looks like you've reached the maximum updates, please try again in 5 minutes."
});

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
if(RATE_LIMITING) app.use(GENERAL_RATE_LIMIT);
app.use(session({ // login sessions
    secret: process.env.SESSION_TOKEN,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'strict',
        httpOnly: true
    }
}));

// Search for a user in Prisma database
async function getUser(key, value) {
    try {
        const prisma = await getPrisma();
        if(!key && !value) return await prisma.user.findMany(); // return all users if no key/value is provided
    
        const user = await prisma.user.findUnique({
            where: {
                [key]: value
            }
        });
    
        return user;
    } catch(error) {
        console.error(error);
        return []; // return an empty array if there was an error
    }
}

// Creates a user ID, checks for one that's unused
async function createCPN() {
    const prisma = await getPrisma();
    let userCpn = null;

    while (!userCpn) {
        let newCpn = Math.random().toString().slice(2, 12); // create a 10-digit user id
        const existingUser = await getUser('cpn', newCpn);

        if (!existingUser) {
            userCpn = newCpn;
        }
    }

    return userCpn;
}

// Verify the reCAPTCHA response
async function verifyRecaptcha(recaptchaToken) {
    try {
        const { data } = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: recaptchaToken
            }
        });

        return data.success;
    } catch (error) {
        console.error("reCAPTCHA verification failed:", error);
        return false;
    }
}

// Generate analytics from authorized transactions
const analyticsCache = [];

async function generateAnalytics() {
    try {
        const prisma = await getPrisma();
        const transactions = await prisma.transaction.findMany();
    
        analyticsCache.length = 0; // clear the cache
        transactions.forEach(transaction => {
            analyticsCache.push({ date: transaction.transactionDate, rentals: transaction.items.Rental.length, purchases: transaction.items.Purchased.length });
        });
    
        return analyticsCache;
    } catch (error) {
        console.error("Error occurred when generating analytics: ", error);
        return [];
    }
}

// Check if an email is valid
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Prevents logged-in users from accessing the login and signup pages
const rejectLoggedIn = (req, res, next) => {
    const isAdminPath = req.path === '/admin' || req.path.startsWith('/admin/');

    if (req.session[isAdminPath ? 'admin' : 'user']) {        
        if (req.method === 'GET') {
            return res.redirect(isAdminPath ? '/admin/dashboard' : '/dashboard');
        } else if (req.method === 'POST') {
            return res.send(isAdminPath ? 'It looks like you are already authorized as an admin.' : 'It looks like you already have an account for perks.');
        }
    }
    
    next();
};

// Aceepts logged-in users to access the dashboard page and other pages
const acceptLoggedIn = async (req, res, next) => {
    const isAdminPath = req.path === '/admin' || req.path.startsWith('/admin/');

    if (!req.session[isAdminPath ? 'admin' : 'user']) {
        if (req.method === 'GET') {
            return res.redirect(isAdminPath ? '/admin' : '/login');
        } else if (req.method === 'POST') {
            return res.send("It looks like your session has expired. Please log in again.");
        }
    }

    // Check if the users account was terminated before allowing access
    if (!isAdminPath) {
        const user = await getUser('cpn', req.session.user);
        
        if (!user || user?.disabled) {
            delete req.session.user; // remove the session if the user doesn't exist or is disabled
            
            if (req.method === 'GET') {
                return res.redirect('/login');
            } else {
                return res.send("It looks like your account has been terminated. Please contact support.");
            }
        }
    }
    
    next();
};

app.get('/', (req, res) => {
    res.redirect('/login'); // we don't have a home page yet..
});

app.get('/login', rejectLoggedIn, (req, res) => {
    res.render('login');
});

app.get('/signup', rejectLoggedIn, (req, res) => {
    res.render('signup');
});

app.get('/dashboard', acceptLoggedIn, async (req, res) => {
    const prisma = await getPrisma();
    const user = await getUser('cpn', req.session.user);

    res.render('dashboard', { user });
});

app.get('/logout', acceptLoggedIn, (req, res) => {
    if(req.session.user) {
        delete req.session.user;
    }

    res.redirect('/login');
});

// Delete the user's account completely
app.post('/delete', acceptLoggedIn, async (req, res) => {
    try {
        const prisma = await getPrisma();

        await prisma.user.delete({
            where: { cpn: req.session.user }
        });
    } catch (error) {
        console.error('It looks like the account MAY not have been deleted. Error:', error);
    }

    delete req.session.user;
    res.redirect('/login/?deleted=true'); // deleted param for success message
});

// Login and create a session
app.post('/login', rejectLoggedIn, (RATE_LIMITING ? LOGIN_RATE_LIMIT : (req, res, next) => next()), async (req, res) => {
    const { 'emailAddress': providedEmail, password, recaptchaToken = null } = req.body;
    const email = providedEmail.toLowerCase(); // lower case email

    // Check if they have all the fields
    if (!email || !password || (!recaptchaToken && app.locals.recaptcha)) {
        return res.json({ error: 'It looks like your request was malformed. Please refresh the page and try again!' });
    }

    // Verify the reCAPTCHA
    if (app.locals.recaptcha && !(await verifyRecaptcha(recaptchaToken))) {
        return res.json({ error: 'It looks like the reCAPTCHA verification failed. Please try again.' });
    }

    // Check if the user exists
    const user = await getUser('emailAddress', email);
    if (!user) {
        return res.json({ error: 'It looks like your email or password provided is incorrect.' });
    }

    // Check if the user is disabled
    if (user?.disabled) {
        return res.json({ error: 'Your account has been terminated. Please contact support.' });
    }

    // Check if the password is correct
    const passwordMatch = user.hashed ? (await bcrypt.compare(password, user.password)) : (user.password === password)
    if (!passwordMatch) {
        return res.json({ error: 'It looks like your email or password provided is incorrect.' });
    }

    req.session.user = user.cpn;
    res.json({ success: true, message: 'You have been successfully logged into your Redbox account!' });
});

// Signup as a new user for program
app.post('/signup', rejectLoggedIn, (RATE_LIMITING ? SIGNUP_RATE_LIMIT : (req, res, next) => next()), async (req, res) => {
    const { firstName, 'emailAddress': providedEmail, password, recaptchaToken = null } = req.body;
    const email = providedEmail.toLowerCase(); // lower case email

    // Check if they have all the fields
    if (!firstName || !email || !password || (!recaptchaToken && app.locals.recaptcha)) {
        return res.json({ error: 'It looks like your request was malformed. Please refresh the page and try again!' });
    }

    // Check if email is valid
    if(!isValidEmail(email)) {
        return res.json({ error: 'It looks like you entered an invalid email! Please try again.' });
    }

    // Verify the reCAPTCHA
    if (app.locals.recaptcha && !(await verifyRecaptcha(recaptchaToken))) {
        return res.json({ error: 'It looks like the reCAPTCHA verification failed. Please try again.' });
    }

    // Check if the email is taken (already has an account)
    if (await getUser('emailAddress', email)) {
        return res.json({ error: "It looks like there's already an account under this email." });
    }

    // continue with signup process
    const prisma = await getPrisma();
    const newUser = await prisma.user.create({
        data: {
            "cpn": await createCPN(),
            "signupDate": new Date().toISOString(),
            "firstName": firstName,
            "emailAddress": email,
            "phoneNumber": null,
            "password": await bcrypt.hash(password, 10), // hash the password w/ bcrypt
            "pin": null,
            "hashed": true, // migrate to bcrypt for hashing (safe storage of passwords)
            "loyalty": {
                "pointBalance": process.env.NEW_POINT_BALANCE || 2000, // Get a FREE 1-night disc rental for signing up.
                "currentTier": process.env.NEW_TIER_DEFAULT || "Member", // this is their tier (calculated based on purchases)
                "tierCounter": 0 // this is their purchase count
            },
            "promoCodes": []
        },
    });

    req.session.user = newUser.cpn;
    res.json({ success: true, message: 'Congratulations! Your Perks account has been successfully created.' });
});

// If a user signs up at kiosk, we don't know their name! This fixes that problem.
app.post("/migrateName", acceptLoggedIn, (RATE_LIMITING ? UPDATE_RATE_LIMIT : (req, res, next) => next()), async (req, res) => {
    const { firstName } = req.body;

    // Check if they have all the fields
    if(!firstName) {
        return res.json({ error: 'It looks like your request was malformed. Please refresh the page and try again!' });
    }

    const user = await getUser('cpn', req.session.user);
    if(!user) return res.json({ error: "It looks like you aren't signed in. Please refresh the page and try again!" });
    if(user.firstName !== null) return res.json({ error: "It looks like you've already set your name. Please contact support to update your name." });

    const prisma = await getPrisma();
    await prisma.user.update({
        where: { cpn: req.session.user },
        data: { firstName }
    });

    res.json({ success: true });
});

// Update the user's account information (email, password, etc.)
app.post("/update", acceptLoggedIn, (RATE_LIMITING ? UPDATE_RATE_LIMIT : (req, res, next) => next()), async (req, res) => {
    const { 'emailAddress': providedEmail, password, recaptchaToken = null } = req.body;
    const email = providedEmail.toLowerCase(); // lower case email

    // Verify the reCAPTCHA
    if (app.locals.recaptcha && !(await verifyRecaptcha(recaptchaToken))) {
        return res.json({ error: 'It looks like the reCAPTCHA verification failed. Please try again.' });
    }

    const prisma = await getPrisma();
    const user = await getUser('cpn', req.session.user);
    const passwordMatch = user.hashed ? (await bcrypt.compare(password, (user.password || ''))) : ((user.password || '') === password); // check if password changed at all

    if(email.length !== 0 && !(email === user.emailAddress)) {
        if(!isValidEmail(email)) return res.json({ error: 'Please enter a valid email address.' });

        if(await getUser('emailAddress', email)) {
            return res.json({ error: 'This email already has an account.' });
        } else {
            await prisma.user.update({
                where: { cpn: req.session.user },
                data: { emailAddress: email }
            });
        }
    }

    if(password.length !== 0 && !passwordMatch) {
        if(password.length < 6) {
            return res.json({ error: 'Password must be at least 6 characters long.' });
        } else if(password.length > 30) {
            return res.json({ error: 'Password must be less than 30 characters long.' });
        } else {
            await prisma.user.update({
                where: { cpn: req.session.user },
                data: { password: (user.hashed ? await bcrypt.hash(password, 10) : password) } // update the password w/ bcrypt (or plain-text if hashing disabled)
            });
        }
    }

    res.json({ success: true });
});

// Set the user's phone number and/or PIN (for their kiosk login)
app.post("/kiosk", acceptLoggedIn, (RATE_LIMITING ? UPDATE_RATE_LIMIT : (req, res, next) => next()), async (req, res) => {
    const { phoneNumber, pin } = req.body;

    const user = await getUser('cpn', req.session.user);
    const pinMatch = user.hashed ? (await bcrypt.compare(pin, (user.pin || ''))) : ((user.pin || '') === pin); // check if PIN changed at all
    const numberMatch = user.phoneNumber === phoneNumber; // check if number changed at all
    const prisma = await getPrisma();

    if(phoneNumber.length === 10 && !isNaN(Number(phoneNumber)) && !numberMatch) {
        if(await getUser('phoneNumber', phoneNumber)) {
            return res.json({ error: 'This phone number is already linked to another account.' });
        } else {
            await prisma.user.update({
                where: { cpn: req.session.user },
                data: { phoneNumber }
            });
        }
    }

    if(pin.length === 4 && !isNaN(Number(pin)) && !pinMatch) {
        await prisma.user.update({
            where: { cpn: req.session.user },
            data: { pin: (user.hashed ? await bcrypt.hash(pin, 10) : pin) } // update the PIN w/ bcrypt (or plain-text if hashing disabled)
        });
    }

    res.json({ success: true });
});


// -- Admin Routes -- //
app.get('/admin', rejectLoggedIn, (req, res) => {
    res.render('admin/login');
});

app.get('/admin/dashboard', acceptLoggedIn, async (req, res) => {
    let users = await getUser(); // get all users from Prisma
    users = users.map(user => ({
        // strip of sensitive information, also good to truncate / make it smaller data
        cpn: user.cpn,
        identifier: (user?.phoneNumber?.replace(/^(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3') || user?.emailAddress || 'Unknown User'),
        disabled: user?.disabled || false,
    }));

    res.render('admin/dashboard', { analyticsCache, API_CONFIGURATION, users });
});

app.get('/admin/logout', acceptLoggedIn, (req, res) => {
    if(req.session.admin) {
        delete req.session.admin;
    }

    res.redirect('/admin');
});

// Login to the admin dashboard, check if the password is correct
app.post('/admin', rejectLoggedIn, (RATE_LIMITING ? LOGIN_RATE_LIMIT : (req, res, next) => next()), async (req, res) => {
    const { password, recaptchaToken = null } = req.body;

    // Check if they have all the fields
    if (!password) {
        return res.json({ error: 'It looks like your request was malformed. Please refresh the page and try again!' });
    }

    // Verify the reCAPTCHA
    if (app.locals.recaptcha && !(await verifyRecaptcha(recaptchaToken))) {
        return res.json({ error: 'It looks like the reCAPTCHA verification failed. Please try again.' });
    }

    // Check if the password is correct
    if (password !== process.env.ADMIN_PASSWORD) {
        return res.json({ error: 'An unauthorized attempt was detected, login is denied.' });
    }

    req.session.admin = true;
    return res.json({ success: true, message: 'You have been successfully logged into the Redbox Perks admin dashboard.' });
});

// Get the user data information for the admin dashboard
app.post('/admin/user', acceptLoggedIn, async (req, res) => {
    const { cpn } = req.body;
    const user = await getUser('cpn', cpn);
    if(!user) return res.json({ error: 'It looks like this user no longer exists.' });
    
    delete user.password;
    delete user.pin;
    delete user.hashed;

    return res.json(user);
});

// Update the user information (email, phone number, password, pin, etc.)
app.post('/admin/update', acceptLoggedIn, async (req, res) => {
    const { cpn, emailAddress, phoneNumber, password, pin } = req.body;

    const user = await getUser('cpn', cpn);
    if(!user) return res.json({ error: 'It looks like this user no longer exists.' });

    // Check if email is valid, update if valid
    const emailMatch = user.emailAddress === emailAddress; // check if email changed at all
    if(emailAddress.length !== 0 && !emailMatch) {
        if(!isValidEmail(emailAddress)) {
            return res.json({ error: "It looks like you entered an invalid email! Please try again." });
        } else if(await getUser('emailAddress', emailAddress)) {
            return res.json({ error: "It looks like there's already an account under this email." });
        } else {
            await prisma.user.update({
                where: { cpn },
                data: { emailAddress }
            });
        }
    }

    // Check if phone number is valid, update if valid
    const numberMatch = user.phoneNumber === phoneNumber; // check if number changed at all
    if(phoneNumber.length !== 0 && !numberMatch) {
        if(phoneNumber.length !== 10 || isNaN(Number(phoneNumber))) {
            return res.json({ error: "A valid U.S. phone number was not entered." });
        } else if(await getUser('phoneNumber', phoneNumber)) {
            return res.json({ error: "This phone number is already linked to another account." });
        } else {
            await prisma.user.update({
                where: { cpn },
                data: { phoneNumber }
            });
        }
    }

    // Check if pin is valid, update if valid
    const pinMatch = user.hashed ? (await bcrypt.compare(pin, (user.pin || ''))) : ((user.pin || '') === pin); // check if PIN changed at all
    if(pin.length !== 0 && !pinMatch) {
        if(pin.length !== 4 || isNaN(Number(pin))) {
            return res.json({ error: "It looks like this PIN is not supported." });
        } else {
            await prisma.user.update({
                where: { cpn },
                data: { pin: (user.hashed ? await bcrypt.hash(pin, 10) : pin) } // update the PIN w/ bcrypt, or plain if disabled
            });
        }
    }

    // Check if password is valid, update if valid
    const passwordMatch = user.hashed ? (await bcrypt.compare(password, (user.password || ''))) : ((user.password || '') === password); // check if password changed at all
    if(password.length !== 0 && !passwordMatch) {
        if(password.length < 6) {
            return res.json({ error: 'Password must be at least 6 characters long.' });
        } else if(password.length > 30) {
            return res.json({ error: 'Password must be less than 30 characters long.' });
        } else {
            await prisma.user.update({
                where: { cpn },
                data: { password: (user.hashed ? await bcrypt.hash(password, 10) : password) } // update the password w/ bcrypt, or plain if disabled
            });
        }
    }

    return res.json({ success: true, message: 'This user account has been updated successfully.' });
});

// Delete the user account or disable it (punish accounts)
app.post('/admin/status', acceptLoggedIn, async (req, res) => {
    const { cpn, method } = req.body;
    
    const user = await getUser('cpn', cpn);
    if(!user) return res.json({ error: 'It looks like this user no longer exists.' });

    if(method === 'delete') {
        const prisma = await getPrisma();
        await prisma.user.delete({
            where: { cpn },
        });
        return res.json({ success: true, message: 'This user account has been permanently deleted.' });
    } else if(method === 'disable') {
        const prisma = await getPrisma();
        await prisma.user.update({
            where: { cpn },
            data: { disabled: !user.disabled } // toggle the disabled status
        });
        return res.json({ success: true, message: 'This user account has been successfully ' + (user.disabled ? 'disabled' : 'enabled') + '.' });
    } else {
        return res.json({ error: 'It looks like your request was malformed. Please refresh the page and try again!' });
    }
});

app.post('/admin/send-test-email', acceptLoggedIn, async (req, res) => {
  const { emailAddress } = req.body;

  const client = new SMTPClient({
    user: API_CONFIGURATION.SMTP_USERNAME,
    password: API_CONFIGURATION.SMTP_PASSWORD,
    host: API_CONFIGURATION.SMTP_HOSTNAME,
    port: Number(API_CONFIGURATION.SMTP_PORT),
    ssl: API_CONFIGURATION.SMTP_SSL === "true",
    tls: API_CONFIGURATION.SMTP_TLS === "true",
  });

  const maskedPassword = '*'.repeat(API_CONFIGURATION.SMTP_PASSWORD.length);

  const message = {
    from: `Redbox Perks <${API_CONFIGURATION.SMTP_USERNAME}>`,
    to: emailAddress,
    subject: 'Your email server is live!',
    text: `Success! Your email service has been successfully set up.
  
  If you see this message, your email server is working correctly.
  This is a test email sent from the Redbox Perks system to verify your email configuration.
  
  Thank you for using Redbox Perks!`,
    attachment: [
      {
        data: `
          <h1>Success!</h1>
          <p>Your email service has been <strong>successfully set up</strong>.</p>
          <p>If you're reading this, your email server is working correctly.</p>
          <p>This is a test email sent from the <b>Redbox Perks</b> system to verify your email configuration.</p>
          <p><strong>SMTP Credentials</strong></p>
          <ul>
              <li><strong>Host:</strong> ${API_CONFIGURATION.SMTP_HOSTNAME}</li>
              <li><strong>Port:</strong> ${API_CONFIGURATION.SMTP_PORT}</li>
              <li><strong>Username:</strong> ${API_CONFIGURATION.SMTP_USERNAME}</li>
              <li><strong>Password:</strong> ${maskedPassword}</li>
              <li><strong>SSL:</strong> ${API_CONFIGURATION.SMTP_SSL}</li>
              <li><strong>TLS:</strong> ${API_CONFIGURATION.SMTP_TLS}</li>
          </ul>
          <p>Thank you for using Redbox Perks!</p>
        `,
        alternative: true,
      }
    ]
  };

  try {
    const result = await client.sendAsync(message);
    res.json({ success: true, result });
  } catch (error) {
    console.log('SMTP Error:', error?.message || error.toString());
    res.json({ error: error?.message || error.toString() });
  }
});

app.use((req, res, next) => {
    res.status(404).redirect('/');
});

app.listen(process.env.SERVER_PORT, async () => {
    console.log(`The Redbox Perks website is sucessfully live at port ${process.env.SERVER_PORT}! 🎉`);
    console.log('Generating analytics from recent authorized transactions... this may take a second!');
    await generateAnalytics();
    console.log('Analytics have been updated, transactions re-checked every 5 minutes.');

    setInterval(generateAnalytics, 5 * 60 * 1000); // every 5 minutes
});