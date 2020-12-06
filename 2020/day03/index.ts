import Util from "../helpers/util";

interface Coordinates {
    x: number;
    y: number;
}

class TobogganTrajectory {
    private filePath: string;
    private map: string[][] = [];
    private coordinates: Coordinates = { x: 0, y: 0 };
    private treesCount = 0;

    public constructor(filePath: string) {
        this.filePath = filePath;
    }

    public async calculate(inXAxis: number, inYAxis: number): Promise<number> {
        this.reset();
        this.map = await this.getMap();

        while (this.coordinates.y < this.map.length) {
            this.move(inXAxis, inYAxis);
        }

        return this.treesCount;
    }

    private reset() {
        this.coordinates.x = 0;
        this.coordinates.y = 0;
        this.treesCount = 0;
    }

    private async getMap(): Promise<string[][]> {
        const input = await Util.readFile(this.filePath);
        return input.split("\n").filter(row => row).map(row => row.split(""));
    }

    private move(inXAxis: number, inYAxis: number): void {
        this.coordinates.x += inXAxis;
        this.coordinates.y += inYAxis;

        if (this.isItTheEnd()) {
            return;
        }

        const currentYLength = this.map[this.coordinates.y].length;
        
        if (this.coordinates.x < 0) {
            this.coordinates.x += currentYLength;
        }
        if (this.coordinates.x >= currentYLength) {
            this.coordinates.x -= currentYLength;
        }

        this.countTree();
    }

    private isItTheEnd(): boolean {
        return this.coordinates.y >= this.map.length;
    }
    
    private countTree() {
        if (this.map[this.coordinates.y][this.coordinates.x] === "#") {
            this.treesCount++;
        }
    }
}

const filePath = `${__dirname}/input.txt`;
const tt = new TobogganTrajectory(filePath);

tt.calculate(3, 1)
    .then(data => console.log("Part 1: ", data))
    .catch(err => console.error("Part 1 error: ", err));

const tt1 = new TobogganTrajectory(filePath);
const tt2 = new TobogganTrajectory(filePath);
const tt3 = new TobogganTrajectory(filePath);
const tt4 = new TobogganTrajectory(filePath);
const tt5 = new TobogganTrajectory(filePath);

Promise.all([
    tt1.calculate(1, 1),
    tt2.calculate(3, 1),
    tt3.calculate(5, 1),
    tt4.calculate(7, 1),
    tt5.calculate(1, 2)
]).then(data => console.log("Part 2: ", data.reduce((a, b) => a * b)))
  .catch(err => console.error("Part 2 error: ", err));