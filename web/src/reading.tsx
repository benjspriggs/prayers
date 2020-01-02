import { Reading } from "@prayers/server";
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

export function renderReading(reading: Reading) {
  return (
    <article
      data-header={reading.category}
      data-back-link={`/category/?id=${encodeURIComponent(reading.category)}`}
    >
      <h1 hidden>{reading.category}</h1>
      <section>
        {reading.content.map(datum => (
          <p className={datum.classes.join(" ")}>{datum.text}</p>
        ))}
      </section>
      <a
        rel="author"
        href={
          reading.author
            ? `/author/?id=${encodeURIComponent(reading.author)}`
            : "#"
        }
      >
        &#8212; {reading.author || "Unknown"}
      </a>
    </article>
  );
}
