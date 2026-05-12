const fs = require("fs");

function gitignoreCheck() {
    if (!fs.existsSync(".gitignore")) {
        return {
            exists: false
        };
    }

    const content = fs.readFileSync(
        ".gitignore",
        "utf-8"
    );

    return {
        exists: true,
        hasNodeModules: content.includes("node_modules"),
        hasEnv: content.includes(".env")
    };
}

module.exports = gitignoreCheck;