# unified-doc

unified document APIs.

## Development

The project uses `lerna` to manage developing, testing, and linting packages.

```sh
# install dependencies
npm install

# clean all packages (rm dist + node_modules)
npm run clean

# watch/rebuild all packages
npm run dev

# lint all packages (xo + tsc)
npm run lint

# test all packages with cypress (make sure 'dev' script is running)
npm run test # visually
npm run test:run # headlessly

# build all packages
npm run build
```
