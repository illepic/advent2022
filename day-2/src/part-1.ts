import path from "path";
import { logger } from "../../shared/logger";
import { doLines, LineProcessor } from "../../shared/read-file";

type conditions = "win" | "lose" | "draw";
type opponentPlay = "A" | "B" | "C";
type youPlay = "X" | "Y" | "Z";

type Lookup = {
  [key in opponentPlay]: {
    [key in youPlay]: conditions;
  };
};

const isOpponentPlay = (play: unknown): play is opponentPlay =>
  ["A", "B", "C"].includes(play as string);
const isYouPlay = (play: unknown): play is youPlay =>
  ["X", "Y", "Z"].includes(play as string);

const lookup: Lookup = {
  // Rock
  A: {
    X: "draw", // Rock
    Y: "win", // Paper
    Z: "lose", // Scissors
  },
  // Paper
  B: {
    X: "lose", // Rock
    Y: "draw", // Paper
    Z: "win", // Scissors
  },
  // Scissors
  C: {
    X: "win", // Rock
    Y: "lose", // Paper
    Z: "draw", // Scissors
  },
};

const shapeScoreLookup: { [key in youPlay]: number } = {
  X: 1, // Rock
  Y: 2, // Paper
  Z: 3, // Scissors
};

const successScoreLookup: { [key in conditions]: number } = {
  lose: 0,
  draw: 3,
  win: 6,
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
