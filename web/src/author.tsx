import { Author } from "server/out/types";
import { render } from "./render.js";
import { useDatabase } from "./lib/db.js";

export const DEFAULT_AUTHOR: PouchDB.Core.Document<Author> = {
  _id: "default",
  displayName: "Unknown"
};

const db = useDatabase<Author>({ name: "authors" });

export function fetchAuthor(id: string) {
  return db.then(({ localDb }) => localDb.get(id));
}

export function renderAuthorSummary(
  data?: PouchDB.Core.ExistingDocument<Author>
) {
  if (!data) return;

  return (
    <author-link data-author-id={data._id}>
      <h1>{data.displayName}</h1>
    </author-link>
  );
}

export function renderAuthorDetail(
  data?: PouchDB.Core.ExistingDocument<Author>
) {
  if (!data) return;

  return (
    <author-link data-author-id={data._id} data-back-link="/author">
      <h1>{data.displayName}</h1>
    </author-link>
  );
}
