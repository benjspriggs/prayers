export interface DatabaseOptions {
  // The name of the database.
  name: string;
}

/**
 * Adds 'emit' to the namespace, so design docs can be type-checked.
 *
 * See https://stackoverflow.com/questions/43078363/pouchdb-with-angular2-cannot-find-name-emit.
 */
export declare function emit(value: any);
export declare function emit(key: any, value: any);

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
          console.debug("ding!", { options, ...info });
        });

      resolve({ localDb, remoteDb });
    } catch (e) {
      reject(e);
    }
  });
}

export interface ViewDefinition {}

export function defineDesignDocument(
  options: DatabaseOptions,
  designDocument: PouchDB.Core.PutDocument<{}>
): Promise<void> {
  console.debug("creating design doc");
  return useDatabase<{}>(options).then(async ({ localDb }) => {
    if (!designDocument._id) {
      console.debug(
        "no ID specified for design document, assuming",
        `_design/${options.name}`
      );
      designDocument._id = `_design/${options.name}`;
    }

    console.debug("fetching", designDocument._id);

    const doc = await localDb.get(designDocument._id).catch(() => ({}));

    const newDoc = {
      _rev: "_rev" in doc ? doc._rev : undefined,
      ...designDocument
    };

    await localDb.put(newDoc, { force: true }).catch(e => {
      console.error(e);
    });
  });
}
