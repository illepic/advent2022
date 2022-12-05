import path from "path";
import intersection from "lodash/intersection";
import { logger } from "../shared/logger";
import { doLines, LineProcessor } from "../shared/read-file";

const letterScore = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const processRucksack: LineProcessor<number> = function () {
  let total = 0;

  return {
    doLine(line) {
      const allContents = line.split("");
      const firstHalf = allContents.slice(0, allContents.length / 2);
      const secondHalf = allContents.slice(allContents.length / 2);

      const [letter] = intersection(firstHalf, secondHalf);
      const letterValue =
        letterScore.findIndex((listLetter) => listLetter === letter) + 1;

      total = total + letterValue;
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
