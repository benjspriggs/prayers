export function fetchAnthology(id: string) {
  return fetch(`http://localhost:5041/anthologies/${id}`).then(resp =>
    resp.json()
  );
}
