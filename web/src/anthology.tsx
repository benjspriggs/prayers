import "./rxjs.js";
import "./pouchdb.js";

import { Book, fetchBook } from "./book.js";

import { render } from "./render.js";

const { from } = window.rxjs;

const { map } = window.rxjs.operators;

interface Anthology {
  id: string;
  displayName: string;
  books: string[];
}

const db = new PouchDB<Anthology>("anthologies");

export function fetchAnthologies() {
  return from(
    db.allDocs({
      include_docs: true
    })
  ).pipe(
    map(response => {
      return Array.from(response.rows || []).map(row => row.doc!);
    })
  );
}

export function fetchAnthology(id: string) {
  return fetch(`http://localhost:5984/anthologies/${id}`).then(resp =>
    resp.json()
  );
}

export async function renderAnthologySummary(data: Anthology) {
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
