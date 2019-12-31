import "./pouchdb.js";

import { Book, fetchBook } from "./book.js";

import { Observable } from "./rxjs.js";
import { render } from "./render.js";

const { from } = window.rxjs;
const { map, flatMap } = window.rxjs.operators;

interface Anthology {
  id: string;
  displayName: string;
  books: string[];
}

/**
 * TODO: This will eventually be a hard-coded URL and port, but for the moment, this will do.
 */
const remoteDb = new PouchDB<Anthology>("http://localhost:5984/anthologies");
const localDb = new PouchDB<Anthology>("anthologies");

localDb.replicate
  .from(remoteDb)
  .on("active", console.log)
  .on("error", console.error)
  .on("complete", info => {
    console.log("ding!", info);
  });

export function fetchAnthologies(): Observable<Anthology> {
  return from(
    localDb.allDocs({
      include_docs: true
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

export async function renderAnthologySummary(data?: Anthology) {
  if (!data) return;

  const books: Book[] = await Promise.all(data.books.map(fetchBook));

  const bookFragments = books.map(book => {
    return (
      <li>
        <book-link data-book-id={book.id}>{book.displayName}</book-link>
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
