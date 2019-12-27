export interface Author {
  id: string;
  name: string;
  books: string[];
}

export function fetchAuthor(id: string): Promise<Author> {
  return fetch(`http://localhost:5984/authors/${id}`).then(resp => resp.json());
}
