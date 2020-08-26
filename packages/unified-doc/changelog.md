# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
