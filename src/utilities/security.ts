import bcrypt from "bcryptjs";

export async function HashPassword(password: string): Promise<string> {
    const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
    return await bcrypt.hash(password, saltRounds);
}

export async function ComparePassword(password: string, hashed: string): Promise<boolean> {
    return await bcrypt.compareSync(password, hashed);
}
