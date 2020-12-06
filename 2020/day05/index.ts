import Util from "../helpers/util";

interface Ticket {
    row: number;
    column: number;
    seatId: number;
    ticketNumber: string;
}

class BinaryBoarding {
    private filePath: string;

    public constructor(filePath: string) {
        this.filePath = filePath;
    }

    public async findHighestSeatId(): Promise<number> {
        const tickets = await this.parseInput();
        return tickets.sort((a, b) => b.seatId - a.seatId)[0].seatId;
    }

    public async findMySeatId(): Promise<number> {
        const tickets = await this.parseInput();
        let i = 0;
        const missingIds: number[] = [];
        tickets.sort((a, b) => a.seatId - b.seatId).forEach(t => {
            while (i < t.seatId) {
                missingIds.push(i);
                i++;
            }
            i++;
        });
        return missingIds[missingIds.length-1];
    }

    private async parseInput(): Promise<Ticket[]> {
        const input = await Util.readFile(this.filePath);
        return input.trim().split("\n").map(ir => this.parseTicket(ir));
    }

    private parseTicket(ticketNumber: string): Ticket {
        const rowCodeItems = ticketNumber.substr(0, 7).split("");
        const columnCodeItems = ticketNumber.substr(7, 3).split("");
        const row = this.getNumber(rowCodeItems, 0, 127);
        const column = this.getNumber(columnCodeItems, 0, 7);
        const seatId = row * 8 + column;
        return { row, column, seatId, ticketNumber };
    }

    private getNumber(rowCodeItems: string[], min: number, max: number): number {
        const [firstCharacter, ...otherCharacters] = rowCodeItems;
        if (otherCharacters.length === 0) {
            if (firstCharacter === "F" || firstCharacter === "L") {
                return min;
            }
            return max;
        }
        if (firstCharacter === "F" || firstCharacter === "L") {
            return this.getNumber(otherCharacters, min, max - Math.round((max - min) / 2));
        }
        return this.getNumber(otherCharacters, min + Math.round((max - min) / 2), max);
    }

}

const run = async () => {
    const bb = new BinaryBoarding(`${__dirname}/input.txt`);

    const part1 = await bb.findHighestSeatId();
    console.log("Part 1: ", part1);

    const part2 = await bb.findMySeatId();
    console.log("Part 2: ", part2);
};

run();
