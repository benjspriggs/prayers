import { DEFAULT_AUTHOR, fetchAuthor } from "./author.js";
import { defineDesignDocument, useDatabase } from "./lib/db.js";
import { fetchReading, fetchReadingsInBook } from "./reading.js";

import { Book } from "../node_modules/server/out/types";
import { render } from "./render";

export { Book };

export const db = useDatabase<Book>({ name: "books" });

export function fetchBook(id: string): Promise<Book> {
  return db.then(({ localDb }) => localDb.get(id));
}

export function fetchBooks(): Promise<Book[]> {
  return db
    .then(({ localDb }) =>
      localDb.query("books/by_name", { include_docs: true, limit: 10 })
    )
    .then((response: PouchDB.Core.AllDocsResponse<Book>) => {
      return Array.from(response.rows || [])
        .map(row => row.doc!)
        .filter(doc => !!doc);
    });
}

defineDesignDocument(
  { name: "books" },
  {
    _id: "_design/books",
    views: {
      by_name: {
        map: `function(doc) {
        emit(doc.displayName);
      }`
      }
    }
  }
);

export async function fetchBooksInAnthology(
  id: string
): Promise<Array<PouchDB.Core.ExistingDocument<Book>>> {
  return Promise.resolve([]);
}

export async function renderBookSummary(data?: PouchDB.Core.Document<Book>) {
  if (!data) return;

  const readings = Promise.all(
    (data.readings || []).map(async readingId => {
      const reading = await fetchReading(readingId);

      return (
        <li>
          <reading-link data-reading-id={reading._id}>
            {reading.title || reading._id}
          </reading-link>
        </li>
      );
    })
  );

  const author = data.authorId
    ? await fetchAuthor(data.authorId)
    : DEFAULT_AUTHOR;

  return (
    <book-summary data-book-id={data._id}>
      <h1 slot="title">
        {data.title} - by {author.displayName}
      </h1>
      {readings}
    </book-summary>
  );
}
