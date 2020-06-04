# unified-doc

unified document APIs.

## Development

The project uses `lerna` to manage developing, testing, and linting packages.

```sh
# install dependencies
npm install

# clean all packages (rm dist + node_modules)
npm run clean

# watch all packages with microbundle
npm run dev

# lint all packages with xo + prettier + tsc
npm run lint

# test all packages with jest
npm run test

# build all packages with microbundle
npm run build
```
