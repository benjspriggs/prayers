/**
 * Generates data used by `json-server`.
 */
const faker = require("faker");

/**
 * An anthology.
 *
 * @typedef {Object<string, any>} Anthology
 * @property {string} id The ID of the anthology.
 * @property {string} displayName The displayed name of the anthology.
 * @property {string[]} books An array of {@link Book.id} that comprise this anthology.
 */

/**
 * A book.
 *
 * @typedef {Object<string, any>} Book
 * @property {string} id The ID of the book.
 * @property {string} displayName The displayed name of the book.
 * @property {string?} author The {@link Author.id} of the author of the book.
 * @property {string[]} readings An array of {@link Reading.id} that comprise this book.
 * @property {string?} anthology A link to the parent {@link Anthology.id}.
 */

/**
 * An author.
 *
 * @typedef {Object<string, any>} Author
 * @property {string} id The ID of the author.
 * @property {string} name The name of the author.
 * @property {string[]} books A list of books this author has written.
 */

/**
 * A reading.
 *
 * @typedef {Object<string, any>} Reading
 * @property {string} id The ID of the prayer.
 * @property {string} content The content of the prayer.
 * @property {string?} book A link to the parent {@link Book.id}.
 * @property {string} hash The encoded hash of the content.
 */

module.exports = function generateDatabase() {
  /**
   * @type {{readings: { [id: string]: Reading }, anthologies: { [id: string]: Anthology}, books: { [id: string]: Book}, authors: { [id: string]: Author}}}
   */
  const data = {
    readings: {},
    anthologies: {},
    books: {},
    authors: {}
  };

  /**
   * @param {string} id
   * @returns {Anthology}
   */
  function generateAnthology(id) {
    return {
      id: id,
      displayName: faker.company.companyName(),
      books: []
    };
  }

  /**
   * @param {string} id
   * @returns {Book}
   */
  function generateBook(id) {
    return {
      id: id,
      displayName: faker.lorem.sentence(3),
      author: null,
      readings: [],
      anthology: null
    };
  }

  /**
   * @param {string} id
   * @returns {Reading}
   */
  function generateReading(id) {
    return {
      id: id,
      content: faker.lorem.sentences(15),
      book: null,
      hash: faker.lorem.slug(5)
    };
  }

  /**
   *
   * @param {string} id
   * @returns {Author}
   */
  function generateAuthor(id) {
    return {
      id: id,
      name: faker.name.firstName(),
      books: []
    };
  }

  function chooseRandom(a) {
    return a[(a.length * Math.random()) << 0];
  }

  [
    { max: 10, gen: generateAnthology, getter: () => data.anthologies },
    { max: 5, gen: generateAuthor, getter: () => data.authors },
    { max: 50, gen: generateBook, getter: () => data.books },
    { max: 500, gen: generateReading, getter: () => data.readings }
  ].forEach(({ max, gen, getter }) => {
    const count = Math.random() * max + 1;

    for (let i = 0; i < count; ++i) {
      const id = Math.random()
        .toString(36)
        .substr(2);
      const datum = gen(id);
      getter()[datum.id] = datum;
    }
  });

  const anthologyKeys = Object.keys(data.anthologies);
  const bookKeys = Object.keys(data.books);
  const readingKeys = Object.keys(data.readings);
  const authorKeys = Object.keys(data.authors);

  // Link everything together
  readingKeys.forEach(key => {
    const bookId = chooseRandom(bookKeys);
    data.readings[key].book = bookId;
    data.books[bookId].readings.push(data.readings[key].id);
  });

  bookKeys.forEach(key => {
    const anthologyId = chooseRandom(anthologyKeys);
    const authorId = chooseRandom(authorKeys);

    data.books[key].anthology = anthologyId;
    data.books[key].author = authorId;
    data.anthologies[anthologyId].books.push(data.books[key].id);
    data.authors[authorId].books.push(data.books[key].id);
  });

  return data;
};
