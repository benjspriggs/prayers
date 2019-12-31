import "./pouchdb.js";

import { Book, fetchBook, fetchBooksInAnthology } from "./book.js";

import { Observable } from "./rxjs.js";
import { render } from "./render.js";
import { useDatabase } from "./lib/db.js";

const { from } = window.rxjs;
const { map, flatMap, switchMap } = window.rxjs.operators;

const db = () => useDatabase<Anthology>({ name: "anthologies" });

interface Anthology {
  id: string;
  displayName: string;
  books: string[];
}

export function fetchAnthologies(): Observable<Anthology> {
  return from(
    db().then(({ localDb }) => {
      return localDb.allDocs({
        include_docs: true
      });
    })
  ).pipe(
    map(response => {
      return Array.from(response.rows || [])
        .map(row => row.doc!)
        .filter(row => !!row);
    }),
    flatMap(data => data)
  );
}

export function fetchAnthology(id: string) {
  return fetch(`http://localhost:5984/anthologies/${id}`).then(resp =>
    resp.json()
  );
}

export async function renderAnthologySummary(
  data?: PouchDB.Core.ExistingDocument<Anthology>
) {
  if (!data) return;

  const books = await fetchBooksInAnthology(data._id);

  const bookFragments = books.map(book => {
    return (
      <li>
        <book-link data-book-id={book._id}>{book.displayName}</book-link>
      </li>
    );
  });

  return (
    <anthology-summary data-anthology-id={data.id}>
      <h1 slot="title">{data.displayName}</h1>
      {bookFragments}
    </anthology-summary>
  );
}
