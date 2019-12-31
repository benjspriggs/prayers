const doc = `
Takes an exported JSON document from ../scripts, and imports them
to the provided CouchDB database.

Usage:
    import.js <filename> [--url URL]
`;
const { docopt } = require("docopt");

const { ["<filename>"]: filename, ["--url"]: url } = docopt(doc, {
  version: "0.1"
});

const couchimport = require("couchimport");

const DEFAULT_OPTIONS = {
  url: url || "http://localhost:5984"
};

/**
 * Each of the databases we will be importing to.
 */
const databases = ["readings", "authors", "anthologies", "books", "categories"];

module.exports.databases = databases;

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
 * @property {Object} sections[].categories[].parent
 * @property {string} sections[].categories[].parent.title
 * @property {number} sections[].categories[].parent.__zeroeth_index
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
 * @property {string?} readings.digest
 * @property {string?} readings.author
 * @property {string[]} readings.category
 * @property {TextBlock[]} readings.texts
 * @property {Object[]} authors
 * @property {Object[]} anthologies
 * @property {Object[]} books
 */

const crypto = require("crypto");

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

  const book = {
    _id: data.hash.digest,
    digest: data.hash.digest,
    title: data.title,
    subtitle: data.subtitle
  };

  books.push(book);

  data.sections.forEach(section => {
    console.log({ title: section.title || "<section title>" });
    if (section.categories) {
      section.categories.forEach(category => {
        console.log({ categoryTitle: category.title || "<category title>" });
        authors.add(category.author);
        const reading = {
          author: category.author,
          category: category.parent.title,
          content: category.texts,
          bookId: book._id
        };
        const id = crypto
          .createHash("md5")
          .update(JSON.stringify(reading))
          .digest("hex");
        readings.push({
          _id: id,
          digest: id,
          ...reading
        });
      });
    } else if (section.interstitial) {
      // special case for the intro
      console.log({ title: "intro section" });
      authors.add(section.author);
      authors.add(section.interstitial.author);

      readings.push({
        _id: "__intro__",
        digest: section.title,
        author: section.author,
        category: section.title,
        content: [{ classes: [], text: section.text }]
      });

      const interstitial = section.interstitial;

      readings.push({
        _id: "__intro__.interstitial",
        digest: "__intro__.interstitial",
        author: interstitial.author,
        category: "Interstitial",
        content: [{ classes: [], text: interstitial.text }]
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

function loadData(filename) {
  console.log(`loading data from '${filename}'`);

  return new Promise((resolve, reject) => {
    try {
      resolve(require(filename));
    } catch (e) {
      reject(e);
    }
  });
}

function writeConvertedData(rawData) {
  const formattedData = convertGeneralPrayers(rawData);
  const outputFilename = path.join(__dirname, path.basename(filename));

  return new Promise((resolve, reject) => {
    fs.writeFile(outputFilename, JSON.stringify(formattedData), (err, data) => {
      if (err) {
        reject(err);
      } else {
        console.log("done writing", { filename, outputFilename });

        resolve({
          filename,
          outputFilename,
          data
        });
      }
    });
  });
}

function importFormattedData({ filename }) {
  const promises = databases.map(databaseName =>
    importFormattedDataToDatabase({ filename, databaseName })
  );
  return Promise.all(promises);
}

function importFormattedDataToDatabase({ filename, databaseName }) {
  console.log(
    "importing formatted data at",
    filename,
    "to database",
    databaseName
  );
  return new Promise((resolve, reject) => {
    const opts = {
      ...DEFAULT_OPTIONS,
      database: databaseName,
      type: "json",
      jsonpath: databaseName,
      overwrite: true
    };

    console.log(opts);

    couchimport.importFile(filename, opts, (err, data) => {
      if (err) {
        reject(err);
      } else {
        console.log("done", { databaseName, data });
        resolve(data);
      }
    });
  });
}

loadData(filename)
  .then(writeConvertedData)
  .then(({ outputFilename }) =>
    importFormattedData({ filename: outputFilename })
  );
