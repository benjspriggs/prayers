import {
  Reading,
  fetchReading,
  fetchReadingsInBook,
  db as readingDb
} from "./reading.js";

import { emit } from "pouchdb";
import { fetchAuthor } from "./author.js";
import { render } from "./render";
import { useDatabase } from "./lib/db.js";

interface FakeBook {
  id: string;
  displayName: string;
  author: string;
  readings: any[];
}

export interface Book {
  digest: string;
  displayName: string;
  // The ID of the author.
  author: string;
}

export const db = () => useDatabase<Book>({ name: "books" });

export function fetchBook(id: string): Promise<Book> {
  return db().then(({ localDb }) => localDb.get(id));
}

const allReadingsInBook = {
  _id: "_design/books",
  views: {
    by_anthology: {
      map: function(doc: PouchDB.Core.Document<Book>, emit) {
        emit(doc._id);
      }.toString()
    }
  }
};

const initializeDesignDoc = useDatabase<{}>({ name: "readings" }).then(
  ({ localDb }) => {
    return localDb.put(allReadingsInBook).catch(e => {
      console.error(e);
    });
  }
);

export async function fetchBooksInAnthology(
  id: string
): Promise<PouchDB.Core.ExistingDocument<Book>[]> {
  const d = await db();
  const res: PouchDB.Query.Response<Book> = await d.localDb.query(
    "books/by_anthology",
    { include_docs: true }
  );

  return Array.from(res.rows).map(row => row.doc!);
}

export async function renderBookSummary(data?: PouchDB.Core.Document<Book>) {
  if (!data) return;

  const readings = await fetchReadingsInBook(data._id);

  const readingFragments = readings.map(reading => {
    return (
      <li>
        <reading-link data-reading-id={reading._id}>{reading._id}</reading-link>
      </li>
    );
  });

  const author = await fetchAuthor(data.author);

  return (
    <book-summary data-book-id={data._id}>
      <h1 slot="title">
        {data.displayName} - by {author.name}
      </h1>
      {readingFragments}
    </book-summary>
  );
}
