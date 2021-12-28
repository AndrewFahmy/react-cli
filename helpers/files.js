const fs = require('fs');


module.exports = {
    getCurrentDirectoryBase: () => process.cwd(),

    pathExists: (path) => fs.existsSync(path),

    createDirectory: (path) => fs.mkdirSync(path),

    deleteDirectory: (path) => fs.rmSync(path, { recursive: true }),

    deleteFile: (path) => fs.unlinkSync(path),

    getJsonContents: (path) => require(path),

    updateJsonFile: (path, data) => fs.writeFileSync(path, JSON.stringify(data, null, 4)),

    writeFile: (path, value) => fs.writeFileSync(path, value)
};