# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.6](https://github.com/unified-doc/unified-doc/compare/unified-doc@3.0.5...unified-doc@3.0.6) (2020-09-06)


### Bug Fixes

* **unified-doc:** share common `getTextContent` implementation to blacklist text nodes in `head` node ([e81ba5c](https://github.com/unified-doc/unified-doc/commit/e81ba5ce18c04d0798d8283d7949cd0045b9ff88))





## [3.0.5](https://github.com/unified-doc/unified-doc/compare/unified-doc@3.0.4...unified-doc@3.0.5) (2020-09-06)


### Bug Fixes

* **unified-doc:** fix `getFileData` by excluding text content in `head` nodes ([5b8f57c](https://github.com/unified-doc/unified-doc/commit/5b8f57cbd0b941660218ae58aeea9f6834825d55))





## [3.0.4](https://github.com/unified-doc/unified-doc/compare/unified-doc@3.0.3...unified-doc@3.0.4) (2020-08-29)

**Note:** Version bump only for package unified-doc





## [3.0.3](https://github.com/unified-doc/unified-doc/compare/unified-doc@3.0.2...unified-doc@3.0.3) (2020-08-29)

**Note:** Version bump only for package unified-doc





## [3.0.2](https://github.com/unified-doc/unified-doc/compare/unified-doc@3.0.1...unified-doc@3.0.2) (2020-08-29)

**Note:** Version bump only for package unified-doc





## [3.0.1](https://github.com/unified-doc/unified-doc/compare/unified-doc@3.0.0...unified-doc@3.0.1) (2020-08-29)


### Bug Fixes

* **unified-doc:** update type from `Doc` ->  `DocInstance` ([dcecac9](https://github.com/unified-doc/unified-doc/commit/dcecac9bcd8a5de62138b33378a822c28e9848a0))





# [3.0.0](https://github.com/unified-doc/unified-doc/compare/unified-doc@2.1.1...unified-doc@3.0.0) (2020-08-29)


### feature

* **unified-doc:** support parsing of code files into code blocks ([d82930b](https://github.com/unified-doc/unified-doc/commit/d82930bb921993a833cf4e4159d7ea9bd394f9ac))


### BREAKING CHANGES

* **unified-doc:** - Remove formal support of `text`/`json` parser in favor of a generic `codeBlock` parser.  Previous `hast` layout for parsed text content will now include an additional `<pre>` + `<code>` nodes.
- Apply `sanitize` step after all plugins (this is recommended by `unified`) and makes sense.  This will break behaviors for marked nodes (since `data-mark-id` are now removed with the default safe sanitization rules).  It is possible to whitelist these and retrieve the old behaviors if specific sanitize schema is applied.  More info will be provided for this in relating documentation.





## [2.1.1](https://github.com/unified-doc/unified-doc/compare/unified-doc@2.1.0...unified-doc@2.1.1) (2020-08-26)


### Bug Fixes

* **unified-doc:** fix JSON parser to parse into code block (`<pre> + <code/>`) and not just `<pre>` ([720694c](https://github.com/unified-doc/unified-doc/commit/720694c732abad281c91f34342aae1b47a124edf))





# [2.1.0](https://github.com/unified-doc/unified-doc/compare/unified-doc@2.0.5...unified-doc@2.1.0) (2020-08-26)


### Features

* **core:** support `prePlugins` option. ([2f151ef](https://github.com/unified-doc/unified-doc/commit/2f151efe1e9133e14c2ccee318053450eae303c2))
* **core:** support json content type ([6f9e811](https://github.com/unified-doc/unified-doc/commit/6f9e811b31b0381375f353b8377421e733029daf))





## [2.0.5](https://github.com/unified-doc/unified-doc/compare/unified-doc@2.0.4...unified-doc@2.0.5) (2020-08-23)

**Note:** Version bump only for package unified-doc





## [2.0.4](https://github.com/unified-doc/unified-doc/compare/unified-doc@2.0.3...unified-doc@2.0.4) (2020-08-20)


### Bug Fixes

* test conventional commit changelog ([7f6adb2](https://github.com/unified-doc/unified-doc/commit/7f6adb28ef2458ceea1f647a77c69a5ecb971163))





## [2.0.3](https://github.com/unified-doc/unified-doc/compare/unified-doc@2.0.2...unified-doc@2.0.3) (2020-08-20)


### Bug Fixes

* test/trigger conventional commit changelog ([9a82c50](https://github.com/unified-doc/unified-doc/commit/9a82c501d9eea778a7b9cc2137aa86dec8ca2302))





## [2.0.2](https://github.com/unified-doc/unified-doc/compare/unified-doc@2.0.1...unified-doc@2.0.2) (2020-08-20)

**Note:** Version bump only for package unified-doc





## [2.0.1](https://github.com/unified-doc/unified-doc/compare/unified-doc@2.0.1...unified-doc@2.0.1) (2020-08-20)


* refactor!: rename `annotations` to `marks`.  cleanup to trigger conventional commit changelog.md ([9f60a39](https://github.com/unified-doc/unified-doc/commit/9f60a399daf57b41ee622bf9cd1c82213cf4ce54))


### Reverts

* Revert "add ts and checkJs" ([ed68f9b](https://github.com/unified-doc/unified-doc/commit/ed68f9bf7b64b6d2c8a6502b900f260709bc0191))
* Revert "fix build" ([d4e1fa4](https://github.com/unified-doc/unified-doc/commit/d4e1fa465c8e9252aa29338ac032a483766eeb7b))


### BREAKING CHANGES

* - rename `annotations` to `marks` (as well as type interfaces `Annotation` -> `Mark`)
- rename `plugins` to `postPlugins`
