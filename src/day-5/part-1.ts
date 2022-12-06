import { last } from "lodash";
import path from "path";
import { logger } from "../shared/logger";
import { doLines, LineProcessor } from "../shared/read-file";

type CratesStack = {
  [key in number]: string[];
};

const processRucksack: LineProcessor<CratesStack> = function () {
  const start: string[][] = [];
  const crates: { [key in number]: string[] } = {};

  return {
    doLine(line) {
      // Parse beginning of crates to determine starting situation
      if (line && !line.startsWith("move")) {
        // We are in starting stack
        const cratesRow = line.match(/.{1,4}/g)?.map((col) => col.trim());
        cratesRow && start.push(cratesRow);
        return;
      }
      // empty line indicates start move coming up next
      if (!line) {
        // Now we can use starting crates, bottom up to bottom first
        start.reverse();
        // Last row is numbers
        const numArray = start.shift();
        if (!numArray) throw Error("No num array row");

        numArray.forEach((stackNum) => {
          const stackKey = parseInt(stackNum, 10);
          crates[stackKey] = [];

          start.forEach((crateRow) => {
            // stackKey starts at one, must -1 to 0 index
            const crateRowItem = crateRow[stackKey - 1];
            if (crateRowItem) {
              crates[stackKey].push(crateRowItem);
            }
          });
        });

        return;
      }
      // Now process all move commands
      const commands = line.split(" ");
      const numCrates = parseInt(commands[1], 10);
      const fromStack = parseInt(commands[3], 10);
      const toStack = parseInt(commands[5], 10);

      const cratesToMove = crates[fromStack]
        .splice(-numCrates, numCrates)
        .reverse();

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

  const answer = Object.values(crates)
    .map((stack) => stack.pop()?.replace("[", "").replace("]", ""))
    .join("");

  logger(
    `****\nReading file line by line with readline done.\n****\nThe score is ${answer}`
  );
})();
