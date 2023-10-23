import path from "path";
import { logger } from "../shared/logger";
import { LineProcessor, doLines } from "../shared/read-file";

const process: LineProcessor<number> = function () {
  const caret: string[] = [];
  const fileSystem = new Map<string, number>();

  return {
    doLine(line) {
      if (line.startsWith("$")) {
        const [_, cmd, dir] = line.split(" ");

        if (cmd === "cd") {
          if (dir === "..") {
            caret.pop();
          } else {
            caret.push(dir);
          }
        }
        return;
      }
      if (line.startsWith("dir")) return;

      const fileSize = parseInt(line.split(" ")[0], 10);
      if (isNaN(fileSize)) return;

      // caret looks like ['/', 'a', 'b', 'c'  ]. Loop over this path and add the
      // file size to **each parent folder** as well as the current folder
      caret.forEach((_, idx) => {
        const path = caret.slice(0, caret.length - idx).join(".");
        const folderSum = fileSystem.get(path) || 0;

        fileSystem.set(path, folderSum + fileSize);
      });
    },
    getResult() {
      // console.log([...fileSystem.entries()]);
      const totalSum = [...fileSystem]
        .filter(([_, folderSum]) => {
          return folderSum <= 100000;
        })
        .reduce((overallSum, filesystemItem) => {
          const [_, folderSum] = filesystemItem;
          overallSum += folderSum;
          return overallSum;
        }, 0);

      return totalSum;
    },
  };
};

(async function doIt() {
  const answer = await doLines(process, path.join(__dirname, "commands.txt"));

  logger(
    `****\nReading file line by line with readline done.\n****\nThe score is ${answer}`
  );
})();
