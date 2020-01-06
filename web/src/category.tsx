import { Category } from "../node_modules/server/out/types";
import { render } from "./render.js";
import { useDatabase } from "./lib/db.js";

export const db = useDatabase<Category>({ name: "categories" });

export function fetchCategory(
  id: string
): Promise<PouchDB.Core.ExistingDocument<Category>> {
  return db.then(({ localDb }) => localDb.get(id));
}

export function fetchCategories() {
  return db
    .then(({ localDb }) => localDb.allDocs({ include_docs: true }))
    .then(response => response.rows.map(row => row.doc!));
}

export function renderCategory(data?: PouchDB.Core.ExistingDocument<Category>) {
  if (!data) {
    return;
  }

  const parents = data.parent
    ? Promise.all(data.parent.map(fetchCategory)).then(categories =>
        categories.map(category => (
          <li slot="parent">
            <category-link data-category-id={category._id}>
              {category.displayName}
            </category-link>
          </li>
        ))
      )
    : null;

  return (
    <category-summary data-category-id={data._id}>
      <h1 slot="title">{data.displayName}</h1>
      {parents ? parents : <p>This category has no parents.</p>}
    </category-summary>
  );
}
