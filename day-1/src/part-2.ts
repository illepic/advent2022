import { logger } from "../../shared/logger";
import { doGnomes, GnomeProcessor } from "./read-gnomes";

const doLine: GnomeProcessor<number[]> = function () {
  let currentGnomeTotal = 0;
  const top3Gnomes = [0, 0, 0];

  return {
    doLine(line) {
      // Empty line means start of new gnome
      if (line === "") {
        // Is current gnome greater than all top 3 gnomes?
        if (top3Gnomes.every((topGnome) => currentGnomeTotal > topGnome)) {
          top3Gnomes[top3Gnomes.length - 1] = currentGnomeTotal;
          top3Gnomes.sort((a, b) => b - a);
        }

        // Reset current gnome
        currentGnomeTotal = 0;
        return;
      }
      // Otherwise, keep adding onto gnome total
      currentGnomeTotal = currentGnomeTotal + parseInt(line, 10);
    },
    getResult() {
      return top3Gnomes;
    },
  };
};

(async function doIt() {
  const answer = await doGnomes(doLine);

  // Sum of top 3 here
  const top3Total = answer.reduce((acc, curr) => acc + curr, 0);

  logger(
    `****\nReading file line by line with readline done.\n****\nThe highest gnome number is ${top3Total}`
  );
})();
