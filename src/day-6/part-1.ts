import fs, { read } from "fs";
import path from "path";
import uniq from "lodash/uniq";

import { logger } from "../shared/logger";

const noRepeats = (word: string) => uniq(word.split("")).length === word.length;

(async function doIt() {
  const readable = fs.createReadStream(
    path.join(__dirname, "datastream.txt"),
    "utf8"
  );

  readable.on("error", function (error) {
    console.error(error);
  });

  let distinctChunk = 4;
  let counter = 0;
  let marker = "";

  readable.on("readable", function () {
    let chunk = "";

    while ((chunk = readable.read(1))) {
      counter = counter + 1;
      if (chunk === null) {
        return readable.destroy();
      }

      marker = marker + chunk;

      // Remove first char if over count
      if (marker.length > distinctChunk) {
        marker = marker.substring(1);
      }

      if (marker.length === distinctChunk && noRepeats(marker)) {
        logger(
          `****\nReading file line by line with readline done.\n****\nThe score is ${counter}`
        );
        return readable.destroy();
      }
    }
  });
})();
