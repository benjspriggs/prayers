import { render } from "./render";

export interface FakeReading {
  id: string;
  book: string;
  content: string;
  hash: string;
}

export interface Reading {
  id: string | null;
  // Change this to just string once we've fixed them in the scripts.
  category: string | string[];
  content: {
    classes: string[];
    text: string;
  }[];
  author?: string;
}

export function fetchReading(id: string): Promise<Reading> {
  return fetch(`http://localhost:5041/readings/${id}`).then(resp =>
    resp.json()
  );
}

export function renderReading(reading: Reading) {
  return (
    <article
      data-header={reading.category}
      data-back-link={`/category/?id=${reading.category}`}
    >
      <h1 hidden>{reading.category}</h1>
      <section>
        {reading.content.map(datum => (
          <p className={datum.classes.join(" ")}>{datum.text}</p>
        ))}
      </section>
      <a rel="author" href="#">
        &#8212; {reading.author || "Unknown"}
      </a>
    </article>
  );
}
