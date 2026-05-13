const fs = require("fs");

function fixPackageScripts(frameworks) {

    if (!fs.existsSync("package.json")) {
        return;
    }

    const packageJson = JSON.parse(
        fs.readFileSync("package.json", "utf-8")
    );

    if (!packageJson.scripts) {
        packageJson.scripts = {};
    }

    /* Express */

    if (
        frameworks.includes("Express") &&
        !packageJson.scripts.start
    ) {

        packageJson.scripts.start = "node index.js";

        console.log(
            '✔ Added "start" script'
        );
    }

    /* React/Vite */

    if (
        frameworks.includes("React") &&
        !packageJson.scripts.build
    ) {

        packageJson.scripts.build = "vite build";

        console.log(
            '✔ Added "build" script'
        );
    }

    fs.writeFileSync(
        "package.json",
        JSON.stringify(packageJson, null, 2)
    );
}

module.exports = fixPackageScripts;