import { Author, Reading } from "server/out/index";
import { DEFAULT_AUTHOR, fetchAuthor } from "./author.js";
import { defineDesignDocument, useDatabase } from "./lib/db.js";
import {
  fetchCategory,
  renderCategory,
  renderCategoryBreadcrumbs
} from "./category.js";

import { render } from "./render";

export { Reading };

const db = useDatabase<Reading>({ name: "readings" });

defineDesignDocument(
  { name: "readings" },
  {
    _id: "_design/readings",
    views: {
      by_book: {
        map: `function(doc) {
        emit(doc._id);
      }`
      }
    }
  }
);

export async function fetchReadingsInBook(id: string) {
  return db.then(async ({ localDb }) => {
    return localDb
      .createIndex({
        index: { fields: ["bookId"] }
      })
      .then(() =>
        localDb.find({
          selector: {
            bookId: id
          }
        })
      )
      .then(response => response.docs);
  });
}

export function fetchReading(
  id: string
): Promise<PouchDB.Core.ExistingDocument<Reading>> {
  return db.then(({ localDb }) => {
    return localDb.get(id);
  });
}

export async function renderReadingDetail(
  reading: PouchDB.Core.Document<Reading>
) {
  const author = reading.authorId
    ? await fetchAuthor(reading.authorId)
    : DEFAULT_AUTHOR;

  const title =
    reading.title || (await fetchCategory(reading.categoryIds[0])).displayName;
  return (
    <article
      data-header={title}
      data-back-link={`/category/?id=${reading.categoryIds[0]}`}
    >
      <h1 hidden>{reading.title}</h1>

      <section>
        {reading.content.map(datum => (
          <p className={datum.classes.join(" ")}>{datum.text}</p>
        ))}
      </section>
      <a
        rel="author"
        href={
          author !== DEFAULT_AUTHOR
            ? `/author/?id=${encodeURIComponent(author._id)}`
            : "#"
        }
      >
        &#8212; {author.displayName}
      </a>
    </article>
  );
}
