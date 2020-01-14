import * as request from "request-promise-native";

import { PassThrough, Readable } from "stream";

export interface ImportOptions {
  database: string;
  host: string;
  port: number;
}

function checkDatabaseExists(opts: ImportOptions): Promise<boolean> {
  console.debug("checking if database exists", opts);
  const url = new URL(`http://${opts.host}`);
  url.port = String(opts.port);
  url.pathname = `/${opts.database}`;

  return request
    .head({
      url: url.toString(),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      return true;
    })
    .catch(() => {
      return false;
    });
}

function ensureDatabaseExists(opts: ImportOptions): Promise<{} | void> {
  console.debug("ensuring database exists", opts);

  return checkDatabaseExists(opts).then(exists => {
    if (exists) {
      console.log("it does exist", opts);
      return Promise.resolve(undefined);
    } else {
      const url = new URL(`http://${opts.host}`);
      url.port = String(opts.port);
      url.pathname = `/${opts.database}`;
      console.log("it does not exist");
      return request
        .put({
          url: url.toString(),
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(() => {
          console.log("created");
        });
    }
  });
}

export function importStream(stream: Readable, opts: ImportOptions) {
  return ensureDatabaseExists(opts).then(() => {
    const url = new URL(`http://${opts.host}`);
    url.port = String(opts.port);
    url.pathname = `/${opts.database}/_bulk_docs`;

    const bulkRequest = request.post({
      url: url.toString(),
      headers: {
        "Content-Type": "application/json"
      }
    });

    stream.pipe(bulkRequest);

    bulkRequest.pipe(process.stdout);

    return bulkRequest;
  });
}

const DEFAULT_OPTIONS = {
  host: "localhost",
  port: 5984
};

function importFormattedDataToDatabase({ stream, database }) {
  console.log("importing formatted data", "to database", database);
  return new Promise((resolve, reject) => {
    const opts: ImportOptions = {
      ...DEFAULT_OPTIONS,
      database: database
    };

    console.log("options", opts);

    return importStream(stream, opts);
  })
    .then(data => {
      console.log("done", { databaseName: database, data });
    })
    .catch(err => {
      console.error("An error occurred: ", err);
    });
}

export function importFormattedData(formattedData: {}) {
  const streams = Object.keys(formattedData).map(database => {
    const buffer = Buffer.from(
      JSON.stringify({ docs: formattedData[database] })
    );
    const stream = new PassThrough();

    stream.end(buffer);

    return {
      database,
      stream
    };
  });

  return Promise.all(
    streams.map(({ database, stream }) =>
      importFormattedDataToDatabase({ database, stream })
    )
  );
}
