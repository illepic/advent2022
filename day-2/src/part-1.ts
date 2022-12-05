import path from "path";
import { logger } from "../../shared/logger";
import { doLines, LineProcessor } from "../../shared/read-file";

enum Conditions {
  Lose,
  Draw,
  Win,
}
enum OpponentShape {
  Rock = "A",
  Paper = "B",
  Scissors = "C",
}
enum YouShape {
  Rock = "X",
  Paper = "Y",
  Scissors = "Z",
}

type Lookup = {
  [key in OpponentShape]: {
    [key in YouShape]: Conditions;
  };
};

const isOpponentPlay = (shape: unknown): shape is OpponentShape =>
  Object.values(OpponentShape).includes(shape as OpponentShape);
const isYouPlay = (shape: unknown): shape is YouShape =>
  Object.values(YouShape).includes(shape as YouShape);

const lookup: Lookup = {
  // Rock
  [OpponentShape.Rock]: {
    [YouShape.Rock]: Conditions.Draw, // Rock
    [YouShape.Paper]: Conditions.Win, // Paper
    [YouShape.Scissors]: Conditions.Lose, // Scissors
  },
  // Paper
  [OpponentShape.Paper]: {
    [YouShape.Rock]: Conditions.Lose, // Rock
    [YouShape.Paper]: Conditions.Draw, // Paper
    [YouShape.Scissors]: Conditions.Win, // Scissors
  },
  // Scissors
  [OpponentShape.Scissors]: {
    [YouShape.Rock]: Conditions.Win, // Rock
    [YouShape.Paper]: Conditions.Lose, // Paper
    [YouShape.Scissors]: Conditions.Draw, // Scissors
  },
};

const shapeScoreLookup: { [key in YouShape]: number } = {
  [YouShape.Rock]: 1, // Rock
  [YouShape.Paper]: 2, // Paper
  [YouShape.Scissors]: 3, // Scissors
};

const successScoreLookup: { [key in Conditions]: number } = {
  [Conditions.Lose]: 0,
  [Conditions.Draw]: 3,
  [Conditions.Win]: 6,
};

const processPuzzle: LineProcessor<number> = function () {
  let score = 0;

  return {
    doLine(line) {
      const [opponentPlay, youPlay] = line.split(" ");

      const isGood = isOpponentPlay(opponentPlay) && isYouPlay(youPlay);
      if (!isGood) throw new Error("Parsed input not proper type");

      const result = lookup[opponentPlay][youPlay];
      const successScore = successScoreLookup[result];
      const shapeScore = shapeScoreLookup[youPlay];

      score = score + successScore + shapeScore;

      return line;
    },
    getResult() {
      return score;
    },
  };
};

(async function doIt() {
  const answer = await doLines(
    processPuzzle,
    path.join(__dirname, "puzzles.txt")
  );

  logger(
    `****\nReading file line by line with readline done.\n****\nThe score is ${answer}`
  );
})();
