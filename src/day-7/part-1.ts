import path from "path";
import { logger } from "../shared/logger";
import { LineProcessor, doLines } from "../shared/read-file";
import set from "lodash/set";
import { dropRight, forEachRight, get } from "lodash";

type Filesystem = {
  [key: string]: string | Filesystem;
};

const process: LineProcessor<number> = function () {
  const fs: Filesystem = {};
  let path: string[] = [];

  const total: { [key: string]: number } = {};

  return {
    doLine(line) {
      // console.log(path);
      const output = line.split(" ");

      // command
      if (output[0] === "$") {
        if (output[1] === "cd") {
          if (output[2] === "/") {
            path = [];
            return;
          }
          if (output[2] === "..") {
            path.pop();
            return;
          }
          // Otherwise go deeper
          path.push(output[2]);
          return;
        }
      }

      // Is dir
      if (output[0] === "dir") {
        // console.log(output[1]);
        set(fs, path, { [output[1]]: {} });
      }
      // Is file
      if (parseInt(output[0], 10)) {
        // sets {filename: '123123'}
        set(fs, [...path, output[1]], output[0]);

        const fileSize = parseInt(output[0], 10);
        // We know the entire path and a number. We can add this number to
        // every part of the path below this to get a total per unique folder.

        const getable = path.join(".");
        const existingValue = get(total, getable, 0);
        total[getable] = existingValue + fileSize;
      }
    },
    getResult() {
      function addToAllPaths(sumPath: string[], value: number) {
        const newSumUpPath = dropRight(sumPath);
        const existingValue = get(total, newSumUpPath, 0);
        total[newSumUpPath.join(".")] = existingValue + value;

        if (newSumUpPath.length === 0) {
          return;
        }

        addToAllPaths(newSumUpPath, value);
      }

      Object.entries(total).forEach(([getable, size]) => {
        const path = getable.split(".");

        const existingValue = get(total, getable, 0);
        addToAllPaths(path, existingValue);
      });

      const answer = Object.values(total).reduce((acc, curr) => {
        if (curr <= 100000) {
          acc = acc + curr;
        }

        return acc;
      }, 0);

      console.log(JSON.stringify(fs, null, 2));
      console.log(JSON.stringify(total, null, 2));

      // console.log(path);
      return answer;
    },
  };
};

(async function doIt() {
  const answer = await doLines(process, path.join(__dirname, "commands.txt"));

  logger(
    `****\nReading file line by line with readline done.\n****\nThe score is ${answer}`
  );
})();
