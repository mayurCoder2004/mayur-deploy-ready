const fs = require("fs");

function expressChecks() {

    const warnings = [];

    if (!fs.existsSync("routes")) {
        warnings.push("routes folder missing");
    }

    const packageJson = JSON.parse(
        fs.readFileSync("package.json", "utf-8")
    );

    if (
        !packageJson.scripts ||
        !packageJson.scripts.start
    ) {
        warnings.push("start script missing");
    }

    return warnings;
}

module.exports = expressChecks;