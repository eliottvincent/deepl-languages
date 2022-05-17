# DeepL Languages

[![Build Status](https://github.com/eliottvincent/deepl-languages/actions/workflows/action.yml/badge.svg)](https://github.com/eliottvincent/deepl-languages/actions) [![NPM](https://img.shields.io/npm/v/deepl-languages.svg)](https://www.npmjs.com/package/deepl-languages) [![Downloads](https://img.shields.io/npm/dt/deepl-languages.svg)](https://www.npmjs.com/package/deepl-languages)

Maps the languages currently supported by operations of the DeepL API. The data **auto-updates every 3 days**, if needed.


## Usage

```js
const { isLanguageSupported } = require("deepl-languages");

console.log(isLanguageSupported("en"));
// true
```


## API

### Access to supported languages

The raw sets of supported languages, as returned by DeepL API, are made accessible:

```js
const { source } = require("deepl-languages");

console.log(source);
// [{language: 'BG', name: 'Bulgarian'}, {…}, {…}, …]

// OR
const deepL = require("deepl-languages");

console.log(deepL.dataSource);
// [{language: 'BG', name: 'Bulgarian'}, {…}, {…}, …]
```
Supported types are: `source` & `target`.

### Check if a language is supported
`isLanguageSupported(code, type)` returns whether a language is supported or not:
* `code` must be a BCP 47 language tag, as per [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1)
* `type` must be either `source` or `target` (defaults to `source`)

```js
const { isLanguageSupported } = require("deepl-languages");

console.log(isLanguageSupported("en"));
// true

console.log(isLanguageSupported("en", "source"));
// true

console.log(isLanguageSupported("en-gb", "target"));
// true
```


## License

deepl-languages is released under the MIT License. See the bundled LICENSE file for details.
