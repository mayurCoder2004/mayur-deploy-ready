const fs = require("fs");

function buildCheck() {

    const packageJson = JSON.parse(
        fs.readFileSync("package.json", "utf-8")
    );

    if (
        packageJson.scripts &&
        packageJson.scripts.build
    ) {
        return true;
    }

    return false;
}

module.exports = buildCheck;