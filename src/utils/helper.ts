import { ArticleDocument } from "@codesRoot/db/schemas/articleType";
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

function GetLatestArticleList(list: Array<ArticleDocument>, from: number, length: number) {
    return list
        .sort((a, b) => {
            return b.CreatedAt.getTime() - a.CreatedAt.getTime()
        })
        .filter((_value: ArticleDocument, index: number) => {
            // Include from, exclude end.
            return index >= from && index < length
        })
        .map((value: ArticleDocument) => {
            return {
                id: value.id,
                Image: process.env.IMAGEPATH + value.Image,
                Tags: value.Tags,
                Name: value.Name,
            }
        })
}

export { HashPassword, ComparePassword, GetLatestArticleList }
