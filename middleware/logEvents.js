import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "yyyy/MM/dd  HH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\n${message}\n\n`;
  //console.log(logItem);
  if (!existsSync(path.join(__dirname, "..", "logs"))) {
    await fs.mkdir(path.join(__dirname, "..", "logs"));
  }
  try {
    await fs.appendFile(path.join(__dirname, "..", "logs", logName), logItem);
  } catch (e) {
    console.error(e);
    const errorItem = `${dateTime}\t${uuid()}\t${e}\n\n`;
    await fs.appendFile(
      path.join(__dirname, "..", "logs", "errorLogs.txt"),
      errorItem
    );
  }
};

export { logEvents };
