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

export function renderReading(reading: Reading) {
  const fragment = document.createDocumentFragment();

  const p = document.createElement("p");
  const textContent = document.createTextNode(reading.content);

  p.appendChild(textContent);
  fragment.appendChild(p);

  return fragment;
}
