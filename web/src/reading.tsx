import { Author, fetchAuthor } from "./author.js";

import { Reading } from "../node_modules/server/out/index";
import { emit } from "pouchdb";
import { render } from "./render";
import { useDatabase } from "./lib/db.js";

export { Reading };

export interface FakeReading {
  id: string;
  book: string;
  content: string;
  hash: string;
}

export const db = () => useDatabase<Reading>({ name: "readings" });

const allReadingsInBook = {
  _id: "_design/readings",
  views: {
    by_book: {
      map: function(doc: PouchDB.Core.Document<Reading>, emit) {
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

export async function fetchReadingsInBook(
  id: string
): Promise<PouchDB.Core.ExistingDocument<Reading>[]> {
  const d = await db();
  const res: PouchDB.Query.Response<Reading> = await d.localDb.query(
    "readings/by_book",
    { include_docs: true }
  );

  return Array.from(res.rows).map(row => row.doc!);
}

export function fetchReading(id: string): Promise<Reading> {
  return db().then(({ localDb }) => {
    return localDb.get(id);
  });
}

const DEFAULT_AUTHOR: Author = {
  id: "",
  name: "Unknown",
  books: []
};

export async function renderReading(reading: PouchDB.Core.Document<Reading>) {
  const author: Author = reading.authorId
    ? await fetchAuthor(reading.authorId)
    : DEFAULT_AUTHOR;
  return (
    <article
      data-header={reading.title}
      data-back-link={`/category/?id=${encodeURIComponent(reading._id)}`}
    >
      <h1 hidden>{reading.title}</h1>
      <section>
        {reading.content.map(datum => (
          <p className={datum.classes.join(" ")}>{datum.text}</p>
        ))}
      </section>
      <a
        rel="author"
        href={author ? `/author/?id=${encodeURIComponent(author.id)}` : "#"}
      >
        &#8212; {reading.authorId || "Unknown"}
      </a>
    </article>
  );
}
