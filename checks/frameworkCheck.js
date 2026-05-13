const fs = require("fs");

function frameworkCheck() {

    if (!fs.existsSync("package.json")) {
        return null;
    }

    const packageJson = JSON.parse(
        fs.readFileSync("package.json", "utf-8")
    );

    const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
    };

    const frameworks = [];

    if (dependencies.react) {
        frameworks.push("React");
    }

    if (dependencies.vite) {
        frameworks.push("Vite");
    }

    if (dependencies.next) {
        frameworks.push("Next.js");
    }

    if (dependencies.express) {
        frameworks.push("Express");
    }

    if (dependencies.typescript) {
        frameworks.push("TypeScript");
    }

    return frameworks;
}

module.exports = frameworkCheck;