const doc = `
Takes an exported JSON document from ../scripts, and imports them
to the provided CouchDB database.

Usage:
    import.js <filename> [--database DATABASE]
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
 *
 * @typedef {Object} TextBlock
 * @property {string[]} classes
 * @property {string} text
 */

/**
 * @typedef {Object} ImportFormat
 * @property {Hash} hash
 * @property {Object} source_version
 * @property {Hash} source_version.hash
 * @property {Object[]} sections
 * @property {string} sections[].title
 * @property {string?} sections[].author
 * @property {string} sections[].text
 * @property {Object[]} sections[].categories
 * @property {string} sections[].categories[].title
 * @property {string} sections[].categories[].author
 * @property {TextBlock[]} sections[].categories[].texts
 * @property {Object?} sections[].interstitial
 * @property {string} sections[].interstitial.text
 * @property {string} sections[].interstitial.author
 * @property {string} title
 * @property {string} subtitle
 */

/**
 * @typedef {Object} ExportFormat
 * @property {Object[]} readings
 * @property {string?} readings._id
 * @property {string?} readings.author
 * @property {string[]} readings.category
 * @property {TextBlock[]} readings.texts
 * @property {Object[]} authors
 * @property {Object[]} anthologies
 * @property {Object[]} books
 */

/**
 * @param {ImportFormat} data
 * @returns {ExportFormat}
 */
function convertGeneralPrayers(data) {
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
    console.log(section.title || "<section title>");
    if (section.categories) {
      section.categories.forEach(category => {
        console.log(category.title || "<category title>");
        authors.add(category.author);
        readings.push({
          _id: null,
          author: category.author,
          category: category.title,
          content: category.texts
        });
      });
    } else if (section.interstitial) {
      // special case for the intro
      console.log("intro section");
      authors.add(section.author);
      authors.add(section.interstitial.author);

      readings.push({
        _id: section.title,
        author: section.author,
        category: section.title,
        content: [{ classes: [], text: section.text }]
      });

      readings.push({
        _id: "__intro__.interstitial",
        author: section.interstitial.author,
        category: section.interstitial.title,
        content: section.interstitial
      });
    } else {
      console.log("skipping unrecognized format...");
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
const fs = require("fs");
const path = require("path");

console.log(`loading data from '${filename}'`);

const rawData = require(filename);
const formattedData = convertGeneralPrayers(rawData);
const outputFilename = path.join(__dirname, path.basename(filename));

console.log({
  filename,
  outputFilename
});

fs.writeFile(outputFilename, JSON.stringify(formattedData), (err, data) => {
  if (err) throw err;

  console.log("done");
});

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