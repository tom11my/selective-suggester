import * as fs from "fs";
import * as path from "path";

// custom logger since console logging is broken in vscode extensions
const LOGGER_PATH = path.join(__dirname, "..", "logs", "one-time-log");
export function log(message: string) {
    fs.writeFileSync(LOGGER_PATH, message);
}
