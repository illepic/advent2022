import path from "path";
import { logger } from "../../shared/logger";
import { doLines, LineProcessor } from "../../shared/read-file";

const processGnome: LineProcessor<number[]> = function () {
  let currentGnomeTotal = 0;
  const top3Gnomes = [0, 0, 0];

  return {
    doLine(line) {
      if (line !== "") {
        // Otherwise, keep adding onto gnome total
        currentGnomeTotal = currentGnomeTotal + parseInt(line, 10);
        return;
      }

      // Empty line means start of new gnome

      const firstSmallerIdx = top3Gnomes.findIndex(
        (topGnome) => currentGnomeTotal > topGnome
      );

      // Our gnome is bigger than something in the top 3
      if (firstSmallerIdx > -1) {
        // Splice it into the position where it is the highest
        top3Gnomes.splice(firstSmallerIdx, 0, currentGnomeTotal);
        // Array is at 4, return to 3
        top3Gnomes.pop();
      }

      // Reset current gnome
      currentGnomeTotal = 0;
    },
    getResult() {
      return top3Gnomes;
    },
  };
};

(async function doIt() {
  const answer = await doLines(
    processGnome,
    path.join(__dirname, "gnomes.txt")
  );

  // Sum of top 3 here
  const top3Total = answer.reduce((total, top3Gnome) => total + top3Gnome, 0);

  logger(
    `****\nReading file line by line with readline done.\n****\nThe highest gnome number is ${top3Total}`
  );
})();
