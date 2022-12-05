import path from "path";
import intersection from "lodash/intersection";
import { logger } from "../shared/logger";
import { doLines, LineProcessor } from "../shared/read-file";

import { letterScore } from "./shared";

const processRucksack: LineProcessor<number> = function () {
  let total = 0;
  let threeGnomes: string[][] = [];

  return {
    doLine(line) {
      threeGnomes.push(line.split(""));
      // Full group
      if (threeGnomes.length === 3) {
        const [letter] = intersection(...threeGnomes);

        // Find value of common letter
        const letterValue =
          letterScore.findIndex((listLetter) => listLetter === letter) + 1;

        total = total + letterValue;
        // wipe out to start next group
        threeGnomes = [];
      }
    },
    getResult() {
      return total;
    },
  };
};

(async function doIt() {
  const answer = await doLines(
    processRucksack,
    path.join(__dirname, "ruckcontents.txt")
  );

  logger(
    `****\nReading file line by line with readline done.\n****\nThe score is ${answer}`
  );
})();
