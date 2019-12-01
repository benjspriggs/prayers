export interface Book {
  id: string;
  displayName: string;
  author: string;
  readings: any[];
}

export function fetchBook(id: string): Promise<Book> {
  return fetch(`http://localhost:5041/books/${id}`).then(resp => resp.json());
}
