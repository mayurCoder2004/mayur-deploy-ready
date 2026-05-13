const fs = require("fs");

function platformCheck(frameworks) {

    const warnings = [];

    /* Vercel */

    if (
        frameworks.includes("React") ||
        frameworks.includes("Next.js")
    ) {

        if (!fs.existsSync("vercel.json")) {

            warnings.push("vercel.json missing");
        }
    }

    /* Railway */

    if (frameworks.includes("Express")) {

        if (!fs.existsSync("railway.json")) {

            warnings.push("railway.json missing");
        }
    }

    return warnings;
}

module.exports = platformCheck;