const doc = `
Takes an exported JSON document from ../scripts, and imports them
to the provided CouchDB database.

Usage:
    import.js <filename> --database DATABASE
`;
const { docopt } = require("docopt");

const { ["<filename>"]: filename, ["--database"]: database } = docopt(doc, {
  version: "0.1"
});

const couchimport = require("couchimport");

const DEFAULT_OPTIONS = {
  url: database
};

/**
 * Each of the databases we will be importing to.
 */
const databases = ["readings", "authors", "anthologies", "books"];

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
 * @property {Object[]} sections[].categories
 * @property {string} sections[].categories[].title
 * @property {Object[]} sections[].categories[].texts
 * @property {string} title
 * @property {string} subtitle
 */

/**
 * @typedef {Object} ExportFormat
 * @property {Object[]} readings
 * @property {Object[]} authors
 * @property {Object[]} anthologies
 * @property {Object[]} books
 */

/**
 * @param {ImportFormat} data
 * @returns {ExportFormat}
 */
function convert(data) {
  /**
   * Collects all the unique authors.
   */
  const authors = new Set();
  const books = [];
  const anthologies = [];
  const readings = [];

  books.push({
    _id: data.hash.digest,
    title: data.title,
    subtitle: data.subtitle
  });

  data.sections.forEach(section => {
    if (section.categories) {
      section.categories.forEach(category => {
        readings.push({
          _id: null,
          category: category.title,
          content: category.texts
        });
      });
    } else {
      // special case for the intro
      readings.push({
        _id: section.title,
        category: section.title,
        content: section.text
      });

      readings.push({
        _id: "__intro__.interstitial",
        category: section.title,
        content: section.interstitial
      });
    }
  });

  return {
    readings: readings,
    books: books,
    anthologies: anthologies,
    authors: Array.from(authors)
  };
}

/**
 * Import the filename.
 * Convert the filename into records for each database.
 * For each of the databases, import all the records into the CouchDB instance. Bonus points for doing it in separate streams.
 */
console.log(JSON.stringify(convert(require(filename)), null, 1));

/*
couchimport.importStream(filename, {
    ...DEFAULT_OPTIONS
}, (err, data) => {
    if (err) {
        console.error(err);
        throw err;
    }

    console.log('done');
});
*/
