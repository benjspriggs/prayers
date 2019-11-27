export function fetchBook(id: string) {
  return fetch(`http://localhost:5041/books/${id}`).then(resp => resp.json());
}
