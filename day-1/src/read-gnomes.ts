import events from "events";
import fs from "fs";
import path from "path";
import readline from "readline";

export type GnomeProcessor<T> = () => {
  doLine: (line: string) => void;
  getResult: () => T;
};

export async function doGnomes<T>(onLine: GnomeProcessor<T>) {
  const doGnomesLine = onLine();

  const rl = readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, "gnomes.txt")),
  });

  rl.on("line", doGnomesLine.doLine);

  await events.once(rl, "close");

  return doGnomesLine.getResult();
}
