import * as fs from "fs";
import * as nodeCrypto from "crypto";
import * as path from "path";

import { Author, Book, Category, Reading, ResourcePath } from "./types";

import { databases } from "./constants";
import { importFormattedData } from "./lib/write";

type Document<T> = PouchDB.Core.Document<T>;

const doc = `
Takes an exported JSON document from ../scripts, and imports them
to the provided CouchDB database.

Usage:
    import.js <filename> [--host HOST] [--port PORT] [--dry-run]
`;
const { docopt } = require("docopt");

const {
  ["<filename>"]: filename,
  ["--host"]: host,
  ["--port"]: port,
  ["--dry-run"]: dryRun
} = docopt(doc, {
  version: "0.1"
});

const DEFAULT_OPTIONS = {
  host: host || "localhost",
  port: parseInt(port) || 5984
};

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
      title: string | string[];
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

function convertGeneralPrayers(data: ImportFormat): ExportFormat {
  /**
   * Collects all the unique authors, by ID.
   */
  const authors = new Map<string, Author>();
  const categories = new Map<string, Category>();
  const categoriesByTitle: { [title: string]: Document<Category> } = {};
  const categoriesById = new Map<string, Document<Category>>();
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
        const title =
          typeof category.title === "string"
            ? category.title
            : category.title.join(" ");
        addCategory({ title, parent: category.parent });

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

    console.debug(author);
    authors.set(author._id, author);
    return author;
  }

  function addCategory(category: {
    title: string;
    parent: { title: string; __zeroeth_index: number };
  }): Document<Category> {
    const id = nodeCrypto
      .createHash("md5")
      .update(
        JSON.stringify({ title: category.title, parent: category.parent })
      )
      .digest("hex");

    if (categoriesById.has(id)) {
      return categoriesById.get(id)!;
    }

    const parentDocument = categoriesByTitle[category.parent.title];
    console.log(category.parent.title, parentDocument);

    if (!parentDocument) {
      console.error(
        `No parent found! ${JSON.stringify(
          category
        )}. Had following keys: '${Object.keys(categoriesByTitle)}'`
      );
    }

    console.debug(
      `creating category '${category.title}', ${typeof category.title}`
    );

    const categoryDocument: Document<Category> = {
      _id: id,
      displayName: category.title,
      parent: ((parentDocument && parentDocument.parent) || []).concat([id])
    };

    console.debug("adding category", categoryDocument);
    categories.set(categoryDocument._id, categoryDocument);
    categoriesById.set(categoryDocument._id, categoryDocument);

    return categoryDocument;
  }

  return {
    readings: readings,
    books: books,
    authors: Array.from(authors.values()),
    categories: Array.from(categories.values())
  };
}

function loadData(filename) {
  console.log(`loading data from '${filename}'`);

  return new Promise((resolve, reject) => {
    try {
      resolve(require(path.join(process.cwd(), filename)));
    } catch (e) {
      reject(e);
    }
  });
}

function writeConvertedDataToFile(formattedData: ExportFormat) {
  const outputFilename = path.join(process.cwd(), path.basename(filename));

  fs.writeFile(outputFilename, JSON.stringify(formattedData), () => {
    console.log("wrote full file");
  });

  return Promise.all(
    Array.from(databases).map(database => {
      return new Promise<{
        filename: string;
        database: string;
        stream: Buffer;
      }>((resolve, reject) => {
        resolve({
          filename,
          database,
          stream: Buffer.from(JSON.stringify(formattedData[database]))
        });
      });
    })
  );
}

loadData(filename)
  .then(convertGeneralPrayers)
  .then(formattedData => {
    if (dryRun) {
      console.log(JSON.stringify(formattedData, null, 2));
    } else {
      return Promise.all([
        writeConvertedDataToFile(formattedData),
        importFormattedData(formattedData)
      ]);
    }
  });
