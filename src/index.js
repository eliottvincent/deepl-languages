"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**************************************************************************
 * IMPORTS
 ***************************************************************************/

var data = {
  source : require("../data/source.json"),
  target : require("../data/target.json")
};

/**************************************************************************
 * CONFIGURATION
 ***************************************************************************/

var DEFAULT_TYPE = "source";

/**************************************************************************
 * FUNCTIONS
 ***************************************************************************/

/**
 * Checks whether a language is supported or not
 * @private
 * @param  {string}  code
 * @param  {string}  [type]
 * @return {boolean} Whether the language is supported or not
 */
var isLanguageSupported = function(code, type = DEFAULT_TYPE) {
  if (!code) {
    throw new Error("Missing language code");
  }

  if (data[type] === undefined || data[type] === {}) {
    return false;
  }

  var _language = data[type].find((language) => {
    return language.language === code.toUpperCase();
  });

  return !!_language;
};

/**************************************************************************
 * EXPORTS
 ***************************************************************************/

exports.isLanguageSupported = isLanguageSupported;

exports.source              = data.source;
exports.target              = data.target;

exports.default             = {
  isLanguageSupported : isLanguageSupported,

  dataSource          : data.source,
  dataTarget          : data.target
};
