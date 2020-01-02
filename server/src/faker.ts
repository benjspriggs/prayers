import * as faker from "faker";

import { Author, Book, Category, Reading } from "./types";

type Document<T> = PouchDB.Core.Document<T>;

type KeyMapping<T> = { [key: string]: T };

export default function generateDatabase() {
  const data: {
    readings: KeyMapping<Document<Reading>>;
    books: KeyMapping<Document<Book>>;
    authors: KeyMapping<Document<Author>>;
    categories: KeyMapping<Document<Category>>;
  } = {
    readings: {},
    categories: {},
    books: {},
    authors: {}
  };

  function generateBook(id: string): Document<Book> {
    return {
      _id: id,
      title: faker.lorem.sentence(3),
      subtitle: faker.lorem.sentence(1),
      readings: [],
      digest: faker.lorem.slug(5)
    };
  }

  function generateReading(id: string): Document<Reading> {
    return {
      _id: id,
      content: [{ text: faker.lorem.sentences(15), classes: [] }],
      digest: faker.lorem.slug(5),
      categoryIds: []
    };
  }

  function generateAuthor(id: string): Document<Author> {
    return {
      _id: id,
      displayName: faker.name.firstName()
    };
  }

  function generateCategory(id: string): Document<Category> {
    return {
      _id: id,
      displayName: faker.name.firstName()
    };
  }

  function chooseRandom<T>(a: T[]): T;
  function chooseRandom<T>(a: T[], misfire?: number): T | undefined;
  function chooseRandom<T>(a: T[], misfire?: number): T | undefined {
    if (misfire && Math.random() > 0.5) {
      return undefined;
    }
    return a[(a.length * Math.random()) << 0];
  }

  [
    { max: 25, gen: generateAuthor, getter: () => data.authors },
    { max: 500, gen: generateBook, getter: () => data.books },
    { max: 5000, gen: generateReading, getter: () => data.readings },
    { max: 50, gen: generateCategory, getter: () => data.categories }
  ].forEach(({ max, gen, getter }) => {
    const count = Math.random() * max + 1;

    for (let i = 0; i < count; ++i) {
      const id = Math.random()
        .toString(36)
        .substr(2);
      const datum = gen(id);
      getter()[datum._id] = datum;
    }
  });

  const categoryKeys = Object.keys(data.categories);
  const bookKeys = Object.keys(data.books);
  const readingKeys = Object.keys(data.readings);
  const authorKeys = Object.keys(data.authors);

  // Link everything together
  readingKeys.forEach(key => {
    const bookId = chooseRandom(bookKeys);

    data.books[bookId].readings.push(String(data.readings[key]._id));
  });

  bookKeys.forEach(key => {
    const authorId = chooseRandom(authorKeys);

    data.books[key].authorId = authorId;
  });

  categoryKeys.forEach(key => {
    const child = data.categories[key];

    if (child.parent) {
      return;
    }

    const parentId = chooseRandom(categoryKeys, 0.3);

    if (!parentId || parentId === String(child._id)) {
      return;
    }

    const parent = data.categories[parentId];
    const parentAncestry = parent.parent || [String(parent._id)];

    child.parent = parentAncestry.concat(String(child._id));
  });

  return {
    readings: Object.values(data.readings),
    authors: Object.values(data.authors),
    books: Object.values(data.books),
    categories: Object.values(data.categories)
  };
}
