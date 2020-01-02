import { Author } from "../node_modules/server/out/types";
import { useDatabase } from "./lib/db.js";

export const DEFAULT_AUTHOR: PouchDB.Core.Document<Author> = {
  _id: "default",
  displayName: "Unknown"
};

export const db = () => useDatabase<Author>({ name: "authors" });

export function fetchAuthor(id: string) {
  return db().then(({ localDb }) => localDb.get(id));
}
