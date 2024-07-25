import bcrypt from "bcrypt"

const satRound = 10;
async function HashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(satRound);
    return bcrypt.hashSync(password, salt);
}

async function ComparePassword(hashPassword: string, password: string): Promise<boolean> {
    const isSame: boolean = await bcrypt.compare(password, hashPassword);
    return isSame;
}

export { HashPassword, ComparePassword }
