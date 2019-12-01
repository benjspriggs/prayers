import { Reading, fetchReading } from "./reading.js";

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
  const newSummary = document.createElement("book-summary");
  newSummary.setAttribute("data-book-id", data.id);

  const title = document.createElement("h1");
  title.innerText = data.displayName;
  title.setAttribute("slot", "title");
  newSummary.appendChild(title);

  const readings: Reading[] = await Promise.all(
    data.readings.map(fetchReading)
  );

  await Promise.all(
    readings.map(reading => {
      return new Promise(resolve => {
        setTimeout(() => {
          const li = document.createElement("li");
          const readingLink = document.createElement("reading-link");
          const text = document.createTextNode(reading.content);

          readingLink.setAttribute("data-reading-id", reading.id);
          readingLink.appendChild(text);
          li.appendChild(readingLink);

          newSummary.appendChild(li);
          resolve();
        });
      });
    })
  );

  return newSummary;
}
