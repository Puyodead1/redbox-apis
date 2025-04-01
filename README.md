# redbox-apis

An attempt to recreate the Redbox backend APIs

## Building

[pnpm](https://pnpm.io/installation) is required

-   Install dependencies: `pnpm install`
-   Build: `pnpm build`

## Usage

-   On the first start, run `pnpm migrate:prod`
-   `pnpm start`

## Development

-   If you change something in `db` or `common`, you can rebuild those quicker with `pnpm prebuild`
-   To run a script on a specific package: `pnpm --filter <package name> run <script name> [any args]`

## Port Mapping

-   Proxy Serivce: 3012
-   Data Service: 3013
-   Ad Server: 3014
-   Transaction Service: 3015
-   Reels: 3016
-   Kiosk Inventory: 3017
-   IOT Certificate Service: 3018

## Scripts

Listed are the workspace scripts, individual packages may specify their own additional scripts

-   `build` - Builds all packages
-   `start` - Starts all servers
-   `clean` - Cleans `server.log` and the `dist` folder of every package
-   `prebuild` - Builds `common` and `db` packages
-   `migrate:prod` - Run migrations for a production database
-   `migrate:dev` - Run migrations for a development database
-   `seed` - Seed the database, mainly for development, currently is just for adding promo codes for testing

## Notes

Developer note for Error responses:

```
{
    "Code": "",
    "Message": ""
}
```
