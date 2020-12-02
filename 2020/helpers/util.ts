import { promisify } from "util";
import { readFile } from "fs";
const read = promisify(readFile);

class Util {
    public static async readFile(filePath: string): Promise<string> {
        return read(filePath, "utf8");
    }
}

export default Util;
