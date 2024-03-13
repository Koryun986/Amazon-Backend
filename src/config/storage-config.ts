import multer from "multer";
import path from "node:path";
import * as fs from "fs";

const imagesFolderPath = path.resolve(__dirname, "../../public/images");

const defineImagesFolder = async () => {
    try {
        const exists = fs.existsSync(imagesFolderPath);
        if (!exists) {
            await fs.promises.mkdir(path.resolve('public'));
            await fs.promises.mkdir(path.resolve('public/images'));
        }
    } catch (error) {
        throw new Error(error);
    }
};

(async () => {
    try {
        await defineImagesFolder();
    } catch (error) {
        console.error(error);
    }
})();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imagesFolderPath);
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + "-" + file.originalname;
        cb(null, fileName);
    }
});

export default storage;