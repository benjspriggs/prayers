import { Reading, fetchReading } from "./reading.js";

import { fetchAuthor } from "./author.js";
import { render } from "./render";
import { useDatabase } from "./lib/db.js";

export interface Book {
  id: string;
  displayName: string;
  author: string;
  readings: any[];
}

const db = () => useDatabase<Book>({ name: "books" });

export function fetchBook(id: string): Promise<Book> {
  return db().then(({ localDb }) => localDb.get(id));
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

  const author = await fetchAuthor(data.author);

  return (
    <book-summary data-book-id={data.id}>
      <h1 slot="title">
        {data.displayName} - by {author.name}
      </h1>
      {readingFragments}
    </book-summary>
  );
}
