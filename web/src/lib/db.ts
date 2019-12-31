export interface DatabaseOptions {
  // The name of the database.
  name: string;
}

const COUCHDB_URL = "http://localhost:5984";

/**
 * TODO: This will eventually be a hard-coded URL and port, but for the moment, this will do.
 */
export function useDatabase<TDatum>(
  options: DatabaseOptions
): Promise<{
  localDb: PouchDB.Database<TDatum>;
  remoteDb: PouchDB.Database<TDatum>;
}> {
  return new Promise((resolve, reject) => {
    try {
      const remoteDb = new PouchDB<TDatum>(options.name);
      const localDb = new PouchDB<TDatum>(`${COUCHDB_URL}/${options.name}`, {
        skip_setup: true
      });

      localDb.replicate
        .from(remoteDb)
        .on("active", console.debug)
        .on("error", console.error)
        .on("complete", info => {
          console.debug("ding!", info);
        });

      resolve({ localDb, remoteDb });
    } catch (e) {
      reject(e);
    }
  });
}
