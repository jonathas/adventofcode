import Util from "../helpers/util";

interface Passport {
    byr: string;
    iyr: string;
    eyr: string;
    hgt: string;
    hcl: string;
    ecl: string;
    pid: string;
    cid?: string;
    valid: boolean;
}

enum ValidationType {
    FIELDS = "FIELDS",
    DATA = "DATA"
}

class PassportValidator {
    private filePath: string;
    private mandatoryFields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];
    private validationType: ValidationType = ValidationType.FIELDS;

    public constructor(filePath: string) {
        this.filePath = filePath;
    }

    public async calculate(validationType: ValidationType): Promise<any> {
        this.validationType = validationType;
        const passports = await this.parseInput();
        return passports.filter(p => p.valid).length;
    }

    private async parseInput(): Promise<Passport[]> {
        const input = await Util.readFile(this.filePath);
        const passports = this.groupPassports(input);
        return passports.map(p => this.parsePassport(p));
    }

    private groupPassports(input : string) {
        return input.split("\n").map(r => (r === "") ? "|" : r).join(" ").split("|");
    }

    private parsePassport(passportRow: string): Passport {
        const passport: any = {};
        passportRow.trim().split(" ").forEach(pr => {
            const rowData = pr.split(":");
            passport[rowData[0]] = rowData[1];
        });

        passport.valid = this.isPassportValid(passport);
        
        return passport as Passport;
    }

    private isPassportValid(passport: Passport): boolean {
        const passportFields = Object.keys(passport);
        const allMandatoryIncluded =  this.mandatoryFields.every(mf => passportFields.includes(mf));

        if (!allMandatoryIncluded) {
            return false;
        }

        if (this.validationType === ValidationType.DATA) {
            if (passport.byr.length < 4 || !this.isNumberBetween(passport.byr, 1920, 2002)) {
                return false;
            }
            if (passport.iyr.length < 4 || !this.isNumberBetween(passport.iyr, 2010, 2020)) {
                return false;
            }
            if (passport.eyr.length < 4 || !this.isNumberBetween(passport.eyr, 2020, 2030)) {
                return false;
            }
            if (!passport.hgt.includes("cm") && !passport.hgt.includes("in")) {
                return false;
            }
            if (passport.hgt.includes("cm") && !this.isNumberBetween(passport.hgt.replace("cm",""), 150, 193)) {
                return false;
            }
            if (passport.hgt.includes("in") && !this.isNumberBetween(passport.hgt.replace("in", ""), 59, 76)) {
                return false;
            }

            const hairColor = new RegExp(/^#[0-9a-f]{6}$/);
            if (!passport.hcl.match(hairColor)) {
                return false;
            }

            const eyeColor = new RegExp(/^(amb|blu|brn|gry|grn|hzl|oth)$/);
            if (!passport.ecl.match(eyeColor)) {
                return false;
            }

            const passportId = new RegExp(/^\d{9}$/);
            if (!passport.pid.match(passportId)) {
                return false;
            }
        }

        return true;
    }

    private isNumberBetween(n: string, min: number, max: number): boolean {
        const num = parseInt(n);
        return min <= num && num <= max;
    }
}

const run = async () => {
    const pv = new PassportValidator(`${__dirname}/input.txt`);

    const part1 = await pv.calculate(ValidationType.FIELDS);
    console.log("Part 1: ", part1);
    
    const part2 = await pv.calculate(ValidationType.DATA);
    console.log("Part 2: ", part2);
};

run();
