const fs = require("fs");

function packageCheck() {
    return fs.existsSync("package.json");
}

module.exports = packageCheck;