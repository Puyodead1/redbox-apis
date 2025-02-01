# redbox-apis

Reimplementation of various redbox kiosk APIs

## Building

[pnpm](https://pnpm.io/installation) is required

-   Install dependencies: `pnpm install`
-   Build: `pnpm build`

## Usage

-   On the first start, run `pnpm migrate:prod`
-   `pnpm start`

## Notes

Error response:

```
{
    "Code": "",
    "Message": ""
}
```

## Port Mapping

-   Proxy Serivce: 3012
-   Data Service: 3013
-   Ad Server: 3014
-   Transaction Service: 3015
-   Reels: 3016
-   Kiosk Inventory: 3017
-   IOT Certificate Service: 3018
