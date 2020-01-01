/**
 * Generates data used by `json-server`.
 */
const faker = require("faker");

import { Author, Book, Category, Reading } from "./types";

type FakerDocument<T> = T & {
  id: number;
};

type KeyMapping<T> = { [key: string]: T };

module.exports = function generateDatabase() {
  const data: {
    readings: KeyMapping<FakerDocument<Reading>>;
    books: KeyMapping<FakerDocument<Book>>;
    authors: KeyMapping<FakerDocument<Author>>;
    categories: KeyMapping<FakerDocument<Category>>;
  } = {
    readings: {},
    categories: {},
    books: {},
    authors: {}
  };

  function generateBook(id: number): FakerDocument<Book> {
    return {
      id: id,
      title: faker.lorem.sentence(3),
      subtitle: faker.lorem.sentence(1),
      readings: [],
      digest: faker.lorem.slug(5)
    };
  }

  function generateReading(id: number): FakerDocument<Reading> {
    return {
      id: id,
      content: faker.lorem.sentences(15),
      digest: faker.lorem.slug(5),
      categoryIds: []
    };
  }

  function generateAuthor(id: number): FakerDocument<Author> {
    return {
      id: id,
      displayName: faker.name.firstName()
    };
  }

  function generateCategory(id: number): FakerDocument<Category> {
    return {
      id: id,
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
      const id = i + 1;
      /*
      const id = Math.random()
        .toString(36)
        .substr(2);
        */
      const datum = gen(id);
      getter()[datum.id] = datum;
    }
  });

  const categoryKeys = Object.keys(data.categories);
  const bookKeys = Object.keys(data.books);
  const readingKeys = Object.keys(data.readings);
  const authorKeys = Object.keys(data.authors);

  // Link everything together
  readingKeys.forEach(key => {
    const bookId = chooseRandom(bookKeys);

    data.books[bookId].readings.push(String(data.readings[key].id));
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

    if (!parentId) {
      return;
    }

    const parent = data.categories[parentId];

    if (!parent.parent) {
      return;
    }

    child.parent = parent.parent.concat([String(child.id)]);
  });

  return {
    readings: Object.values(data.readings),
    authors: Object.values(data.authors),
    books: Object.values(data.books),
    categories: Object.values(data.categories)
  };
};
