# DeepL Languages

[![Build Status](https://github.com/eliottvincent/deepl-languages/actions/workflows/action.yml/badge.svg)](https://github.com/eliottvincent/deepl-languages/actions) [![NPM](https://img.shields.io/npm/v/deepl-languages.svg)](https://www.npmjs.com/package/deepl-languages) [![Downloads](https://img.shields.io/npm/dt/deepl-languages.svg)](https://www.npmjs.com/package/deepl-languages)

Maps the languages currently supported by operations of the DeepL API. The data **auto-updates every 3 days**, if needed.


## Usage

```js
const { isLanguageSupported } = require("deepl-languages");

console.log(isLanguageSupported("en"));
// true
```
