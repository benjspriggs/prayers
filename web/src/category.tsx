import { Category } from "server/out/types";
import { render } from "./render.js";
import { useDatabase } from "./lib/db.js";

const db = useDatabase<Category>({ name: "categories" });

export function fetchCategory(
  id: string
): Promise<PouchDB.Core.ExistingDocument<Category>> {
  return db.then(({ localDb }) => localDb.get(id));
}

export function fetchCategories() {
  return db
    .then(({ localDb }) => localDb.allDocs({ include_docs: true, limit: 50 }))
    .then(response => response.rows.map(row => row.doc!));
}

export function renderCategoryBreadcrumbs(
  data?: PouchDB.Core.ExistingDocument<Category>
) {
  if (!data) return;

  return (
    <ul class="breadcrumb">
      {data.parent ? (
        Promise.all(data.parent.map(fetchCategory)).then(categories =>
          categories.map(category => (
            <li>
              <category-link data-category-id={category._id}>
                {category.displayName}
              </category-link>
            </li>
          ))
        )
      ) : (
        <category-link data-category-id={data._id}>
          {data.displayName}
        </category-link>
      )}
    </ul>
  );
}

export function renderCategory(data?: PouchDB.Core.ExistingDocument<Category>) {
  if (!data) {
    return;
  }

  return (
    <category-summary data-category-id={data._id}>
      <h1 slot="title">{data.displayName}</h1>
      {data.parent ? (
        renderCategoryBreadcrumbs(data)
      ) : (
        <p>This category has no parents.</p>
      )}
    </category-summary>
  );
}
