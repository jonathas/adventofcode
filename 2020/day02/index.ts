import Util from "../helpers/util";

interface ParsedRow { 
    rule: Rule;
    password: string 
}

interface Rule {
    lowerLimit: number;
    upperLimit: number;
    character: string;
}

enum RuleType {
    TOBOGAN = "TOBOGAN",
    SLEDRENTAL = "SLEDRENTAL"
}

class TobogganPolicy {
    private filePath: string;

    public constructor(filePath: string) {
        this.filePath = filePath;
    }

    public async calculate(ruleType: RuleType) {
        if (ruleType !== RuleType.SLEDRENTAL && ruleType !== RuleType.TOBOGAN) {
            throw new Error("Rule not implemented!");
        }
        const input = await Util.readFile(this.filePath);
        const rows = input.split("\n").filter(p => p); // filter out undefined
        return rows.filter(r => this.isPasswordValid(r, ruleType)).length;
    }

    private isPasswordValid(row: string, ruleType: RuleType): boolean {
        const parsedRow = this.parseRow(row);

        if (ruleType === RuleType.TOBOGAN) {
            return this.isTobogganRuleValid(parsedRow);
        }
        return this.isSledRentalRuleValid(parsedRow);
    }

    private parseRow(row: string): ParsedRow {
        const parsedRow = row.split(":");
        return {
            rule: this.parseRule(parsedRow[0]),
            password: parsedRow[1]
        };
    }

    private isTobogganRuleValid(parsedRow: ParsedRow): boolean {
        const charactersCount = Array.from(parsedRow.password).filter(p => p === parsedRow.rule.character).length;
        return charactersCount >= parsedRow.rule.lowerLimit && charactersCount <= parsedRow.rule.upperLimit;
    }

    private isSledRentalRuleValid(parsedRow: ParsedRow) {
        const { rule, password } = parsedRow;
        return Boolean(password.charAt(rule.lowerLimit++) === rule.character) !== Boolean(password.charAt(rule.upperLimit++) === rule.character);
    }

    private parseRule(rule: string) {
        const ruleParts = rule.split(" ");
        const limits = ruleParts[0].split("-");
        return {
            lowerLimit: parseInt(limits[0]),
            upperLimit: parseInt(limits[1]),
            character: ruleParts[1]
        };
    }
}

const tp = new TobogganPolicy(`${__dirname}/input.txt`);

tp.calculate(RuleType.SLEDRENTAL)
    .then(data => console.log(data))
    .catch(err => console.error(err));
