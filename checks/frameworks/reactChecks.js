const fs = require("fs");

function reactChecks() {

    const warnings = [];

    /* vite config check */

    const hasViteConfig =
        fs.existsSync("vite.config.js") ||
        fs.existsSync("vite.config.ts");

    if (!hasViteConfig) {
        warnings.push("Vite config missing");
    }

    /* src folder check */

    if (!fs.existsSync("src")) {
        warnings.push("src folder missing");
    }

    return warnings;
}

module.exports = reactChecks;