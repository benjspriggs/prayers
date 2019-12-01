import { Book, fetchBook } from "./book.js";

import { render } from "./render.js";

interface Anthology {
  id: string;
  displayName: string;
  books: string[];
}

export function fetchAnthology(id: string) {
  return fetch(`http://localhost:5041/anthologies/${id}`).then(resp =>
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
