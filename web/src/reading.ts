export interface Reading {
  id: string;
  book: string;
  content: string;
  hash: string;
}

export function fetchReading(id: string): Promise<Reading> {
  return fetch(`http://localhost:5041/readings/${id}`).then(resp =>
    resp.json()
  );
}
