"use strict";

/**************************************************************************
 * IMPORTS
 ***************************************************************************/

var fs    = require("fs");
var https = require("https");
var os    = require("os");
var path  = require("path");
var url   = require("url");


/**************************************************************************
 * CONFIGURATION
 ***************************************************************************/

var DATA_DIR = path.join(__dirname, "./../../data/");

var TYPES = [
  "source",
  "target"
];

var DEEPL = {
  METHOD   : "GET",
  ENDPOINT : "https://api-free.deepl.com/v2/languages"
};


/**************************************************************************
 * FUNCTIONS
 ***************************************************************************/

/**
 * Reads from a JSON file
 * @private
 * @param  {string} path
 * @return {object} Promise object
 */
var __read_json_file = (path) => {
  return new Promise((resolve, reject) => {
    return fs.readFile(
      path,

      (error, buffer) => {
        if (error !== null) {
          return reject(error);
        }

        return resolve(JSON.parse(buffer))
      });
  });
}

/**
 * Writes to a JSON file
 * @private
 * @param  {string} path
 * @param  {string} content
 * @return {object} Promise object
 */
var __write_json_file = (path, content) => {
  return new Promise((resolve, reject) => {
    return fs.writeFile(
      path,
      JSON.stringify(content, null, 2),

      {
        encoding : "utf8"
      },

      (error) => {
        if (error !== null) {
          return reject(error);
        }

        return resolve();
      });
  });
};

/**
 * Dispatches an HTTPS request
 * @private
 * @param  {string} method
 * @param  {string} uri
 * @return {object} Promise object
 */
var __dispatch_request = (method, uri) => {
  let _url            = url.parse(uri),
      _request_params = {
        method : method
      };

  _request_params.host = _url.host;
  _request_params.port = _url.port;
  _request_params.path = _url.path;

  return new Promise((resolve, reject) => {
    var request = https.request(_request_params, (response) => {
      let _body = "";

      response.setEncoding("utf8");

      response.on("data", (chunk) => {
        _body += chunk;
      });

      response.on("end", () => {
        if (_body.length) {
          try {
            _body = JSON.parse(_body);
          } catch(error) {
            return reject(error);
          }
        }

        if (response.statusCode !== 200) {
          return reject(
            new Error(`Got error: ${response.statusCode}`)
          );
        } else {
          return resolve(_body);
        }
      });
    });


    request.on("timeout", function() {
      request.abort();
    });

    request.on("abort", function(error) {
      return reject(error);
    });

    request.on("error", function(error) {
      return reject(error);
    });

    request.on("close", function() {
      return resolve();
    });

    request.end();
  });
};

/**
 * Updates languages for a type
 * @private
 * @param  {string} type
 * @return {object} Promise object
 */
var update_languages = (type) => {
  let _existing_languages = {},
      _new_languages      = {},
      _languages_changed  = false,
      _data_path          = path.join(DATA_DIR, `${type}.json`);

  return Promise.resolve()
    .then(() => {
      return __read_json_file(_data_path);
    })
    .then(existing_languages => {
      _existing_languages = existing_languages;

      if (_existing_languages === {}) {
        return Promise.reject("No existing languages for this type");
      }

      return __dispatch_request(
        DEEPL.METHOD,
        `${DEEPL.ENDPOINT}?type=${type}&auth_key=${process.env.DEEPL_KEY}`
      );
    })
    .then(body => {
      _new_languages = body;

      _languages_changed = (
        JSON.stringify(_new_languages) !== JSON.stringify(_existing_languages)
      );

      if (_languages_changed) {
        return __write_json_file(_data_path, _new_languages);
      }

      return Promise.resolve();
    })
    .then(() => {
      if (_languages_changed) {
        return Promise.resolve(true);
      }

      return Promise.resolve(false);
    });
};

/**
 * Entry point
 */
var update = () => {
  return Promise.all(
    TYPES.map(type => {
      return update_languages(type);
    })
  )
    .then((results) => {
      process.stdout.write(os.EOL);

      if (results.indexOf(true) !== -1) {
        // At least one type updated
        process.stdout.write("::set-output name=status::updated" + os.EOL);
      } else {
        // No type updated
        process.stdout.write("::set-output name=status::none_updated" + os.EOL);
      }

      process.exit(0);
    })
    .catch((error) => {
      console.error(error);

      process.exit(1);
    });
};


// Run script (via entry point)
update();
