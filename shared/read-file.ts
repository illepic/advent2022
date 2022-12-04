import events from "events";
import fs from "fs";
import path from "path";
import readline from "readline";

export type LineProcessor<T> = () => {
  doLine: (line: string) => void;
  getResult: () => T;
};

export async function doLines<T>(onLine: LineProcessor<T>, filePath: string) {
  const doLines = onLine();

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
  });

  rl.on("line", doLines.doLine);

  await events.once(rl, "close");

  return doLines.getResult();
}
