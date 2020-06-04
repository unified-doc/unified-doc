# unified-doc

unified document APIs.

## Development

The project is managed  `lerna`.

```sh
# install dependencies
npm install

# clean all packages (rm dist + node_modules)
npm run clean

# lint all packages with xo + prettier + tsc
npm run lint

# watch/rebuild all packages with microbundle
npm run dev

# test all packages with jest (make sure to run the 'dev' script)
npm run test

# build all packages with microbundle
npm run build
```
