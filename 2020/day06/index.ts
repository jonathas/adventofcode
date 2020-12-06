import Util from "../helpers/util";

class CustomCustoms {
    private filePath: string;

    public constructor(filePath: string) {
        this.filePath = filePath;
    }

    public getSumOfAnswersCount(groups: string[][]): number {
        return groups.map(people => new Set(people.join("")).size).reduce((a, b) => a + b);
    }

    public getSumWhereEveryoneAnsweredYes(groups: string[][]): number {
        return groups.map(people => [...new Set(people.join(''))]
            .filter(a => !people.some(person => !person.includes(a))))
            .map(a => a.length).reduce((a, b) => a + b);
    }

    public async getGroups(): Promise<string[][]> {
        const input = await Util.readFile(this.filePath);
        return input.trim().split("\n\n").map(r => r.split("\n"));
    }
}

const run = async () => {
    const cc = new CustomCustoms(`${__dirname}/input.txt`);

    const groups = await cc.getGroups();

    const part1 = cc.getSumOfAnswersCount(groups);
    console.log("Part 1: ", part1);

    const part2 = cc.getSumWhereEveryoneAnsweredYes(groups);
    console.log("Part 2: ", part2);
};

run();
