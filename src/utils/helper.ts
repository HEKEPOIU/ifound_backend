import bcrypt from "bcrypt"

const satRound = 10;
async function HashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(satRound);
    return bcrypt.hashSync(password, salt);
}

export { HashPassword }