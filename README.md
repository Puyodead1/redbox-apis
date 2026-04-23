<h1 align="center">Redbox API's | Powered by Express.js</h1>

<p align="center">A feature-rich API designed to restore the functionality of your Redbox kiosk, as well as Redbox Perks.<br>An attempt to recreate the Redbox backend APIs.<br></p>

#### This project has been merged with the now unmaintained [RedboxAPI](https://github.com/BrianWalczak/RedboxAPI) project, restoring functionality for the Redbox Perks loyalty program.

## Installation

To get started with hosting your Redbox API instance, make sure you have Node.js
and pnpm installed. Follow the steps below to set up your environment:

1. **Install Node.js** from [here](https://nodejs.org/).
2. Clone the repository and install the dependencies:

```bash
git clone https://github.com/Puyodead1/redbox-apis.git
cd redbox-apis
pnpm install
```

Next, configure the following environment files:

- `.env`
- `packages/db/.env`
- `packages/redbox-perks/.env`

> ##### If you'd like to use reCAPTCHA (completely optional), you'll need to create a new project by visiting your [Google Cloud Console](https://console.cloud.google.com/). Then, visit the **APIs & Services** page and enable the [reCAPTCHA Enterprise API](https://console.cloud.google.com/apis/library/recaptchaenterprise.googleapis.com) (you may need to search for it). After enabling the API for your Google Cloud project, access the reCAPTCHA dashboard [here](https://www.google.com/u/1/recaptcha/admin/create) and follow the steps to add your domain (the one you'll use for the dashboard) and get your reCAPTCHA keys.

If you're okay with the default configuration, you can close the file. Once
you've configured your web server, you're all done!

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
server), you’ll need to configure the kiosk.

1. In the File Explorer, navigate to the file
   `C:\ProgramData\Redbox\UpdateClient\IoT\iotcertificatedata.json` and delete
   it.
2. Open the file `C:\ProgramData\Redbox\configuration\configuration.json` in a
   text editor, and update **every** URL present to point to your Redbox API
   server (either a custom domain or your router's IP address if you're using
   port forwarding).

During the following steps, use the ports found below. Finally, restart your
Redbox kiosk to apply the changes. Your kiosk will now be connected to your
custom API!

- Proxy Serivce: 3012
- Data Service: 3013
- Ad Server: 3014
- Transaction Service: 3015
- Reels: 3016
- Kiosk Inventory: 3017
- IOT Certificate Service: 3018
- MQTT Broker: 8883

### Certificate Authority

See [Certificate Authority](/ca.md)

## Legacy Database - Migration

If your project currently uses the legacy database (which utilized the
`database/` folder), it's required that you migrate to database usage by using
the command: `pnpm perks:migrate`.

This will push any migrations to your existing Prisma database, and transfer all
of your data over. It will then proceed to delete the `database/` folder and
perform a clean-up. After this command is ran, no further action is needed from
your end.

## Development

- If you modify something in `db` or `common`, you can rebuild those quicker
  with the following command: `pnpm prebuild`
- To run a script on a specific package, use the following operation:
  `pnpm --filter <package name> run <script name> [any args]`

### Scripts

Listed are the workspace scripts, individual packages may specify their own
additional scripts

- `build` - Builds all packages
- `start` - Starts all servers
- `clean` - Cleans `server.log` and the `dist` folder of every package
- `prebuild` - Builds `common` and `db` packages
- `migrate:prod` - Run migrations for a production database
- `migrate:dev` - Run migrations for a development database
- `seed` - Seed the database, mainly for development, currently is just for
  adding promo codes for testing

### Seeding

We use seeding to add initial data to a database, this is called seeding it.
Currently, we use this to add different types of promo codes for testing. If you
want to test/use these promo codes, just run the `seed` script.
