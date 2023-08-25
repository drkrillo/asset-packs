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