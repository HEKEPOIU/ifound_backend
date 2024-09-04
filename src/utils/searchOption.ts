import { IArticle } from "@codesRoot/db/schemas/article";
import { IFuseOptions } from "fuse.js";

const searchArticleFuseOptions: IFuseOptions<IArticle> = {
    findAllMatches: true,
    includeMatches: true,
    includeScore: true,
    threshold: 1.0,
    keys: [
        "Tags",
        "Name",
        "DetailInfo.Description",
        "DetailInfo.FoundLocation",
        "DetailInfo.CurrentLocation",
    ]
}

export { searchArticleFuseOptions }
