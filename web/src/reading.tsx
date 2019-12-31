import { render } from "./render";
import { useDatabase } from "./lib/db.js";

export interface FakeReading {
  id: string;
  book: string;
  content: string;
  hash: string;
}

export interface Reading {
  id: string | null;
  category: string;
  content: {
    classes: string[];
    text: string;
  }[];
  author?: string;
}

const db = () => useDatabase<Reading>({ name: "readings" });

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
