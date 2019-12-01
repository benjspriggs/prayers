import { Book, fetchBook } from "./book.js";

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
  const newSummary = document.createElement("anthology-summary");
  newSummary.setAttribute("data-anthology-id", data.id);

  const title = document.createElement("h1");
  title.innerText = data.displayName;
  title.setAttribute("slot", "title");
  newSummary.appendChild(title);

  const books: Book[] = await Promise.all(data.books.map(fetchBook));

  await Promise.all(
    books.map(book => {
      return new Promise(resolve => {
        setTimeout(() => {
          const li = document.createElement("li");
          const bookLink = document.createElement("book-link");
          const text = document.createTextNode(book.displayName);

          bookLink.setAttribute("data-book-id", book.id);
          bookLink.appendChild(text);
          li.appendChild(bookLink);

          newSummary.appendChild(li);
          resolve();
        });
      });
    })
  );

  return newSummary;
}
