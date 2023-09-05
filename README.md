## asset-packs

This repo holds all the asset packs for the Web Editor. When the repo is deployed, all the files are hashed and uploaded to an S3 bucket under `contents/:hash` and the `catalog.json` is regenerated with all the asset packs and assets data. The bucket is accessible through the `builder-items.decentraland.*` via Cloudflare.

### Production

- Catalog: `https://builder-items.decentraland.org/catalog.json`

- Contents: `https://builder-items.decentraland.org/contents/:hash`

### Development

- Catalog: `https://builder-items.decentraland.zone/catalog.json`

- Contents: `https://builder-items.decentraland.zone/contents/:hash`

### Deployment

Every push to the `main` branch will be deployed to the development environemnt.

Every [release](https://github.com/decentraland/asset-packs/releases) will be deployed to the production environment.

### Local Development

You can develop this repo locally and test it within the Web Editor by doing the following:

Go to this repo in your machine and do this:
1. Run `npm run start:lib` to watch for changes.
2. Run `npm run start:js` to start running the SDK7 scene locally (by default on port `8000`).
3. Run `npm link` to allow other projects to symlink to this one.
4. Copy the path to the `bin/index.js` in this repo (something like `/Users/my-user/path/to/asset-packs/bin/index.js`).

Go the `builder-server` repo in your machine and do this:
1. Set the `DEV_SCENE_JS_PATH` env var in `.env` to the path you copied in the previous section.
2. Set the `DEV_SCENE_JS_PORT` to the port where the SDK7 started running (by defualt `8000`).
3. Run `npm start` to start the server (by default on port `5000`)
4. Run `npx local-ssl-proxy --source 5001 --target 5000`. Now the server can be used via HTTPS on port `5001`. You might need to open the browser on `https://localhost:5001` and acknowledge the warning message you will see there before the browser can make requests to it (this only needs to be done once). This is because the SSL certificate is self-signed and untrusted by default.

Go the `js-sdk-toolchain` repo in your machine and do this:
1. Run `cd packages/@dcl/inspector`.
2. Run `npm link @dcl/asset-packs` to symlink to your local repository
3. Run `npm start` to start a local dev server. It should start by default on port `8000` but since we are already using it for the SDK7 scene, it will start on port `8001`.

Go to the `builder` repo in your machine and do this:
1. Set the `REACT_APP_INSPECTOR_PORT` env var in `.env` to be `8001` (this is the `@dcl/inspector` dev server we started in the previous section).
2. Change the `BUILDER_SERVER_URL` in the `src/config/env/dev.json` to be `https://localhost:5001` (this is our local builder server behind the HTTPS proxy).
3. Run `npm start` to start the builder local server which should start on port `3000`

Now you are all set, you can start developing the SDK7 scene in this repo, use it from the local Builder and test it by previewing the scene, which should use your local Builder Server serving the development javascript files.
