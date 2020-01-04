import * as fs from "fs";
import * as http from "http";
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
    return new Promise((resolve, reject) => {
      const send = http.request(
        {
          host: opts.host,
          port: opts.port,
          method: "POST",
          path: `/${opts.database}/_bulk_docs`,
          headers: {
            "Content-Type": "application/json"
          }
        },
        res => {
          res
            .on("data", () => {
              console.log("read response", opts);
            })
            .on("error", e => {
              console.error("An error occurred with the request", e);
              reject(e);
              send.end();
            });
          res.pipe(process.stdout);
        }
      );

      stream.pipe(send);
      stream.on("close", () => {
        resolve();
      });
    });
  });
}

function importFile(
  filename: string,
  opts: { database: string; host: string; port: number }
) {
  return new Promise((resolve, reject) => {
    const send = http.request(
      {
        host: opts.host,
        port: opts.port,
        method: "POST",
        path: `/${opts.database}/_bulk_docs`,
        headers: {
          "Content-Type": "application/json"
        }
      },
      res => {
        res
          .on("data", () => {
            console.log("read response", opts);
          })
          .on("error", e => {
            console.error("An error occurred with the request", e);
            reject(e);
            send.end();
          });
        res.pipe(process.stdout);
      }
    );

    const filestream = fs.createReadStream(filename);

    filestream
      .on("open", () => {
        console.debug("open file", opts);
        filestream.pipe(send);
      })
      .on("close", () => {
        console.debug("close", opts);
        send.end();
        resolve();
      });
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
