<h1 align="center">Redbox API's</h1>

<p align="center">An API designed to restore the functionality of your Redbox kiosk by recreating the original backend services.<br></p>

## Installation

To get started hosting your Redbox API, make sure you have Node.js and pnpm
installed, then follow the steps below to set up your environment:

1. **Install Node.js** from [here](https://nodejs.org/).
2. Clone the repository and install the dependencies:

```bash
git clone https://github.com/Puyodead1/redbox-apis.git
cd redbox-apis
pnpm install
```

Next, configure the following environment files:

- `.env` - SMTP settings, used for receipts & account registration
- `packages/db/.env` - Prisma database URL (can likely leave as-is)
- `packages/redbox-perks/.env` - Loyalty web UI admin config & reCAPTCHA tokens
- `config.toml` - Global server and certificate configuration (ports, hosts, CA settings, MQTT, loyalty options)

> ##### If you want to use reCAPTCHA for the loyalty web UI (optional), create a project in [Google Cloud Console](https://console.cloud.google.com/), enable the [reCAPTCHA Enterprise API](https://console.cloud.google.com/apis/library/recaptchaenterprise.googleapis.com) in APIs & Services, then go to the [reCAPTCHA admin page](https://www.google.com/u/1/recaptcha/admin/create) to add your domain and get your keys.

If you're okay with the default configuration, or won't be using certain features, you can leave these unmodified.

## Building

Before you start the Redbox API, it's important to follow these steps to make
sure your kiosk is configured properly:

Begin by opening the File Explorer on your Redbox kiosk and clearing the folder
at `C:\ProgramData\Redbox\KioskClient\HttpQueue` to empty the queue of old HTTP
requests (preventing any old transactions from being processed).

Make sure Standalone mode on your Redbox kiosk is **disabled**. You can find
this registry key at
`HKEY_LOCAL_MACHINE:\SOFTWARE\Redbox\REDS\KioskEngine\Store`.

Once these steps are complete and your API server is configured, use the
following commands to finish building the project:

```
pnpm build # compiles the project
pnpm migrate:prod # run this only on the first start
pnpm start # start the API server
```

## Usage

To apply these changes to your Redbox kiosk (and update the API to your custom
server), you’ll need to configure the kiosk first.

1. In the File Explorer, navigate to the file
   `C:\ProgramData\Redbox\UpdateClient\IoT\iotcertificatedata.json` and delete
   it.
2. Open the file `C:\ProgramData\Redbox\configuration\configuration.json` in a
   text editor, and update **every** URL present to point to your Redbox API
   server (either a custom domain or your router's IP address if you're using
   port forwarding).

During the following steps, use the ports found below (these are the default, 
and can be modified in `config.toml`). Finally, restart your Redbox kiosk to apply
the changes. Your kiosk will now be connected to your API server!

- Proxy Serivce: 3012
- Data Service: 3013
- Ad Server: 3014
- Transaction Service: 3015
- Reels: 3016
- Kiosk Inventory: 3017
- IOT Certificate Service: 3018
- Loyalty Web UI: 3019 (optional)
- MQTT Broker: 8883

### Certificate Authority

See [Certificate Authority](/ca.md)

## Legacy Database - Migration

If your project currently uses the legacy database (which utilized the
`database/` folder), it's required that you migrate your database to the
improved structure by using the command: `pnpm perks:migrate`.

This will push any migrations to your existing Prisma database, and transfer all
of your data over. It will then proceed to delete the `database/` folder and
perform a clean-up. After this command is ran, no further action is needed from
your end.

## Development

- If you modify something in `db` or `common`, you can rebuild those quicker
  with the following command: `pnpm prebuild`
- To run a script on a specific package, use the following operation:
  `pnpm --filter <package name> run <script name> [any args]`
- To change the log level, set the environment variable `LOG_LEVEL`:
  `LOG_LEVEL=verbose`

### Scripts

Listed are the workspace scripts. Individual packages may specify their own
additional scripts:

- `build` - Builds all packages
- `start` - Starts all servers
- `clean` - Cleans `server.log` and the `dist` folder of every package
- `prebuild` - Builds `common` and `db` packages
- `migrate:prod` - Run migrations for a production database
- `migrate:dev` - Run migrations for a development database
- `seed` - Seed the database, mainly for development, currently is just for
  adding promo codes for testing
- `format` - Run prettier across the entire codebase
- `perks:migrate` - Migrates the existing database structure (more info [here](#legacy-database---migration))

### Seeding

We use seeding to add initial data to a database. Currently, we use this to add different types of promo codes for testing. If you want to test/use these promo codes, run the `seed` script.
