const fs = require("fs");

function dockerCheck() {

    const warnings = [];

    if (!fs.existsSync("Dockerfile")) {
        warnings.push("Dockerfile missing");
    }

    if (!fs.existsSync(".dockerignore")) {
        warnings.push(".dockerignore missing");
    }

    return warnings;
}

module.exports = dockerCheck;