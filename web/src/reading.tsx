import { render } from "./render";

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

export function fetchReading(id: string): Promise<Reading> {
  return fetch(`http://localhost:5984/readings/${id}`).then(resp =>
    resp.json()
  );
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
