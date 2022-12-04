import { logger } from "../../shared/logger";
import { doGnomes, GnomeProcessor } from "./read-gnomes";

const doLine: GnomeProcessor<number> = function () {
  let currentGnomeTotal = 0;
  let greatestGnomeTotal = 0;

  return {
    doLine(line) {
      // Empty line means start of new gnome
      if (line === "") {
        // Time to check if last gnome is the greatest, set winner if so
        if (currentGnomeTotal > greatestGnomeTotal) {
          greatestGnomeTotal = currentGnomeTotal;
        }
        // Reset current gnome
        currentGnomeTotal = 0;
        return;
      }
      // Otherwise, keep adding onto gnome total
      currentGnomeTotal = currentGnomeTotal + parseInt(line, 10);
    },
    getResult() {
      return greatestGnomeTotal;
    },
  };
};

(async function doIt() {
  const answer = await doGnomes(doLine);

  logger(
    `****\nReading file line by line with readline done.\n****\nThe highest gnome number is ${answer}`
  );
})();
