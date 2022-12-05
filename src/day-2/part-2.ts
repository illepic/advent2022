import path from "path";
import { logger } from "../shared/logger";
import { doLines, LineProcessor } from "../shared/read-file";

enum Shape {
  Rock = "A",
  Paper = "B",
  Scissors = "C",
}
enum Conditions {
  Lose = "X",
  Draw = "Y",
  Win = "Z",
}

type Lookup = {
  [key in Shape]: {
    [key in Conditions]: Shape;
  };
};

const isOpponentPlay = (play: unknown): play is Shape =>
  Object.values(Shape).includes(play as Shape);

const isYouPlay = (play: unknown): play is Conditions =>
  Object.values(Conditions).includes(play as Conditions);

const lookup: Lookup = {
  // Rock
  [Shape.Rock]: {
    [Conditions.Lose]: Shape.Scissors, // lose
    [Conditions.Draw]: Shape.Rock, // draw
    [Conditions.Win]: Shape.Paper, // win
  },
  // Paper
  [Shape.Paper]: {
    [Conditions.Lose]: Shape.Rock, // lose
    [Conditions.Draw]: Shape.Paper, // draw
    [Conditions.Win]: Shape.Scissors, // win
  },
  // Scissors
  [Shape.Scissors]: {
    [Conditions.Lose]: Shape.Paper, // lose
    [Conditions.Draw]: Shape.Scissors, // draw
    [Conditions.Win]: Shape.Rock, // win
  },
};

const successScoreLookup: { [key in Conditions]: number } = {
  [Conditions.Lose]: 0,
  [Conditions.Draw]: 3,
  [Conditions.Win]: 6,
};

const shapeScoreLookup: { [key in Shape]: number } = {
  [Shape.Rock]: 1, // Rock
  [Shape.Paper]: 2, // Paper
  [Shape.Scissors]: 3, // Scissors
};

const processPuzzle: LineProcessor<number> = function () {
  let score = 0;

  return {
    doLine(line) {
      const [opponentPlay, youPlay] = line.split(" ");

      const isGood = isOpponentPlay(opponentPlay) && isYouPlay(youPlay);
      if (!isGood) throw new Error("Parsed input not proper type");

      const result = lookup[opponentPlay][youPlay];
      const successScore = successScoreLookup[youPlay];
      const shapeScore = shapeScoreLookup[result];

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
