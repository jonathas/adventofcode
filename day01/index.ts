import Util from "../helpers/util";

class ExpenseReport {
    private filePath: string;
    private goal: number;

    public constructor(filePath: string, goal: number) {
        this.filePath = filePath;
        this.goal = goal;
    }

    /**
     * 
     * @param itemsCount 2 or 3
     */
    public async calculate(itemsCount: number): Promise<number> {
        if (itemsCount !== 2 && itemsCount !== 3) {
            throw new Error("Not implemented! Should be 2 or 3");
        }

        const input = await Util.readFile(this.filePath);
        const report = this.parseReport(input);

        return report.filter(r => {
            const complement = this.goal-r;

            if (itemsCount === 2) {
                return report.find(rp => rp === complement);
            } else {
                return this.calculate3Items(report, complement);
            }
        }).reduce((a, b) => a * b);
    }

    private parseReport(input: string) {
        return input.split("\n").map(r => parseInt(r));
    }
    
    private calculate3Items(report: number[], complement: number) {
        // all values which are lower than the value missing to reach the goal
        const lowerThanComplement = report.filter(rp => rp < complement);

        // iterate the lower values and find a partB
        return lowerThanComplement.find(ltc => {
            const partB = complement-ltc;
            return lowerThanComplement.find(lt => lt === partB);
        });
    }
}

const er = new ExpenseReport(`${__dirname}/expense_report.txt`, 2020);

er.calculate(3)
    .then(data => console.log(data))
    .catch(err => console.error(err.message));
