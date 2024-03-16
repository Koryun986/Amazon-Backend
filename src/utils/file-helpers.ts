import path from 'path';

export const extractRelativePath = (filePath: string) => {
    const absolutePath = path.join(path.resolve(), 'public');
    return path.relative(absolutePath, filePath);
};