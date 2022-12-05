import path from "path";
import { logger } from "../shared/logger";
import { doLines, LineProcessor } from "../shared/read-file";

const processRucksack: LineProcessor<number> = function () {
  let total = 0;

  return {
    doLine(line) {
      const results = line
        .split(",")
        .map((schedule) => schedule.split("-").map((day) => parseInt(day, 10)))
        .sort((first, second) => {
          const [firstStart, firstEnd] = first;
          const [secondStart, secondEnd] = second;

          return firstEnd - firstStart - (secondEnd - secondStart);
        });

      const [first, second] = results;

      // check range of first in second
      if (first[0] >= second[0] && first[1] <= second[1]) {
        total = total + 1;
        console.log("fully contains vvv");
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
    path.join(__dirname, "assignments.txt")
  );

  logger(
    `****\nReading file line by line with readline done.\n****\nThe score is ${answer}`
  );
})();
