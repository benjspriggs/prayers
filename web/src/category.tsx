import { render } from "./render.js";

/**
 * A category is a stand-in for a chapter within a book.
 * Readings can have one or more categories.
 */
interface Category {}

export function fetchCategory(id: string) {
  return fetch(`http://localhost:5984/categories/${id}`).then(resp =>
    resp.json()
  );
}

export function renderCategory(data: Category) {
  return <p>I am a placeholder</p>;
}
