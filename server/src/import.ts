import { Author, Book, Category, Reading, ResourcePath } from "./types";

type Document<T> = PouchDB.Core.Document<T>;

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

interface TextBlock {
  classes: string[];
  text: string;
}

interface Hash {
  input_encoding: string;
  algorithm: string;
  digest: string;
}

interface ImportFormat {
  hash: Hash;
  title: string;
  subtitle: string;
  source_version: {
    hash: Hash;
  };
  sections: {
    title: string;
    author?: string;
    text: string;
    categories: {
      texts: TextBlock[];
      title: string;
      author: string;
      parent: {
        title: string;
        __zeroeth_index: number;
      };
    }[];
    interstitial?: {
      text: string;
      author: string;
    };
  }[];
}

interface ExportFormat {
  readings: Reading[];
  categories: Category[];
  books: Book[];
  authors: Author[];
}

const nodeCrypto = require("crypto");

function convertGeneralPrayers(data: ImportFormat): ExportFormat {
  /**
   * Collects all the unique authors.
   */
  const authors = new Set<Author>();
  const categories = new Set<Category>();
  const categoriesByParent: { [title: string]: Document<Category> } = {};
  const books: Document<Book>[] = [];
  const readings: Document<Reading>[] = [];

  const book = {
    _id: data.hash.digest,
    digest: data.hash.digest,
    title: data.title,
    subtitle: data.subtitle,
    readings: []
  };

  books.push(book);

  data.sections.forEach(section => {
    console.log({ title: section.title || "<section title>" });
    if (section.categories) {
      section.categories.forEach(category => {
        console.log({ categoryTitle: category.title || "<category title>" });

        const author = addAuthor(category.author);
        addCategory(category);

        const reading = {
          author: category.author,
          category: category.parent.title,
          content: category.texts,
          bookId: book._id
        };
        const id = nodeCrypto
          .createHash("md5")
          .update(JSON.stringify(reading))
          .digest("hex");
        readings.push({
          _id: id,
          digest: id,
          authorId: author._id,
          categoryIds: [],
          ...reading
        });
      });
    } else if (section.interstitial) {
      // special case for the intro
      console.log({ title: "intro section" });
      const sectionAuthor = addAuthor(section.author!);

      const interstitialAuthor = addAuthor(section.interstitial.author);

      readings.push({
        _id: "__intro__",
        digest: section.title,
        authorId: sectionAuthor._id,
        categoryIds: ["__intro__"],
        content: [{ classes: [], text: section.text }]
      });

      const interstitial = section.interstitial;

      readings.push({
        _id: "__intro__.interstitial",
        digest: "__intro__.interstitial",
        authorId: interstitialAuthor._id,
        categoryIds: ["__intro__.intertitial"],
        content: [{ classes: [], text: interstitial.text }]
      });
    } else {
      console.log("skipping unrecognized format...");
    }
  });

  function addAuthor(authorName: string) {
    const author: Document<Author> = {
      _id: nodeCrypto
        .createHash("md5")
        .update(authorName)
        .digest("hex"),
      displayName: authorName
    };
    authors.add(author);
    return author;
  }

  function addCategory(category: {
    title: string;
    parent: { title: string; __zeroeth_index: number };
  }): Document<Category> {
    if (category.title in categoriesByParent) {
      throw new Error(`Duplicate category '${category.title}'`);
    }

    const path = categoriesByParent[category.parent.title];

    const id = nodeCrypto
      .createHash("md5")
      .update(category.title)
      .digest("hex");

    const categoryDocument: Document<Category> = {
      _id: id,
      displayName: category.title,
      parent: (path.parent || []).concat([id])
    };

    categories.add(categoryDocument);
    categoriesByParent[id] = categoryDocument;

    return categoryDocument;
  }

  return {
    readings: readings,
    books: books,
    authors: Array.from(authors),
    categories: Array.from(categories)
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
