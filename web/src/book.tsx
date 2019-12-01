import { Reading, fetchReading } from "./reading.js";

import { render } from "./render";

export interface Book {
  id: string;
  displayName: string;
  author: string;
  readings: any[];
}

export function fetchBook(id: string): Promise<Book> {
  return fetch(`http://localhost:5041/books/${id}`).then(resp => resp.json());
}

export async function renderBookSummary(data: Book) {
  const readings: Reading[] = await Promise.all(
    data.readings.map(fetchReading)
  );

  const readingFragments = readings.map(reading => {
    return (
      <li>
        <reading-link data-reading-id={reading.id}>{reading.id}</reading-link>
      </li>
    );
  });

  return (
    <book-summary data-book-id={data.id}>
      <h1 slot="title">
        <book-link>{data.displayName}</book-link>
      </h1>
      {readingFragments}
    </book-summary>
  );
}
