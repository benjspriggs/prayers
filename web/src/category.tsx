import { Category } from "../node_modules/server/out/types";
import { render } from "./render.js";
import { useDatabase } from "./lib/db.js";

export const db = useDatabase<Category>({ name: "categories" });

export function fetchCategory(id: string) {
  return db.then(({ localDb }) => localDb.get(id));
}

export function renderCategory(data: Category) {
  return <p>I am a placeholder</p>;
}
