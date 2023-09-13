#!/bin/sh
npm run build
npx concurrently "npm run start:catalog-and-upload" "npm run start"
