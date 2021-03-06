const fs = require("fs");

if (process.argv.length < 2) {
  console.error("Require a .json file as the first argument.");
  process.exit(1);
}

/**
 * @typedef {Object} Hash
 * @property {string} input_encoding
 * @property {string} algorithm
 * @property {string} digest
 */

/**
 * @typedef {Object} ImportFormat
 * @property {Hash} hash
 * @property {Object} source_version
 * @property {Hash} source_version.hash
 * @property {Object[]} sections
 * @property {string} sections[].title
 */

/**
 *
 * @param {ImportFormat} parsed
 */
function format(parsed) {
  return parsed.sections.map(section => {
    return {
      __input_digest: parsed.source_version.hash.digest,
      __output_digest: parsed.hash.digest,
      ...section
    };
  });
}

const parsed = require(process.argv[2]);

fs.writeFile(
  "example.jsonl",
  format(parsed)
    .map(o => JSON.stringify(o))
    .join("\n"),
  err => {
    if (err) {
      console.error(err);
      throw err;
    }
  }
);
