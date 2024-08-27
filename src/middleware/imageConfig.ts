import { NextFunction, Request, RequestHandler, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { IFoundError } from "./errorType";
import sharp from "sharp";
import { UserDocument } from "@codesRoot/db/schemas/userType";
import fs from "fs"
import decode from "heic-decode";


const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const filetypes: RegExp = /jpg|jpeg|heic/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpg and .heic files are allowed!'));
    }
};


const multerconfig = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 3000000
    }

})
function processImagetojpg(field: string): RequestHandler {
    return async (req: Request, _res: Response, next: NextFunction) => {
        if (!req.file) {
            return next(new IFoundError("No file upload", 401, [`${field} not contain image`]))
        }
        const user = req.user as UserDocument;
        const fileName = user.id + "_" + Date.now() + '.jpg';
        const dirPath = path.join(process.cwd(), '/imgs/');
        const outputPath = path.join(dirPath, fileName);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        req.file.path = outputPath;
        req.file.filename = fileName;
        let sharpObj;
        if (req.file.mimetype === 'image/heic') {
            const decodeheic = await decode({ buffer: req.file.buffer })
            sharpObj =
                sharp(decodeheic.data, {
                    raw: {
                        width: decodeheic.width,
                        height: decodeheic.height,
                        channels: 4
                    }
                })
        } else {
            sharpObj = sharp(req.file.buffer)
        }
        sharpObj
            .jpeg()
            .toFile(outputPath, (err, _info) => {
                if (err) {
                    return next(new IFoundError("Internal Error", 500, [err.message]));
                }
                next();
            });
    }

}

export { processImagetojpg, multerconfig }
