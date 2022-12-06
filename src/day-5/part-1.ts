import { last } from "lodash";
import path from "path";
import { logger } from "../shared/logger";
import { doLines, LineProcessor } from "../shared/read-file";

type CratesStack = {
  [key in number]: string[];
};

const processRucksack: LineProcessor<CratesStack> = function () {
  // let final = "";
  const start: string[][] = [];
  let startFinished = false;
  const crates: { [key in number]: string[] } = {};

  return {
    doLine(line) {
      // Parse beginning of crates to determine starting situation

      if (!line.startsWith("move")) {
        // We are in starting stack
        const cratesRow = line.match(/.{1,4}/g)?.map((col) => col.trim());
        // console.log(cratesRow);
        cratesRow && start.push(cratesRow);
        return;
      }
      if (!startFinished) {
        // Now we can use starting crates
        start.reverse();
        const numArray = start.shift();
        numArray &&
          numArray.forEach((stackNum) => {
            const stackKey = parseInt(stackNum, 10);
            crates[stackKey] = [];

            start.forEach((crateRow) => {
              // stackKey starts at one, must -1 to 0 index
              const oneIndexed = stackKey - 1;
              if (!!crateRow[oneIndexed]) {
                crates[stackKey].push(crateRow[oneIndexed]);
              }
            });
          });
        // console.log(crates);

        startFinished = true;
        return;
      }
      // Now process all move commands
      const commands = line.split(" ");
      const numCrates = parseInt(commands[1], 10);
      const fromStack = parseInt(commands[3], 10);
      const toStack = parseInt(commands[5], 10);

      const cratesToMove = crates[fromStack].splice(-numCrates).reverse();
      crates[toStack].push(...cratesToMove);
    },
    getResult() {
      return crates;
    },
  };
};

(async function doIt() {
  const crates = await doLines(
    processRucksack,
    path.join(__dirname, "crates.txt")
  );

  // final stuff
  console.log(crates);

  const answer = Object.values(crates)
    .map((stack) => {
      const last = stack.pop()?.replace("[", "").replace("]", "");
      return last;
    })
    .join("");

  logger(
    `****\nReading file line by line with readline done.\n****\nThe score is ${answer}`
  );
})();
