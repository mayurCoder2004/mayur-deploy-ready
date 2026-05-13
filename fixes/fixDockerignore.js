const fs = require("fs");

function fixDockerignore() {

    if (!fs.existsSync(".dockerignore")) {

        const content = `node_modules
npm-debug.log
.env
dist
`;

        fs.writeFileSync(
            ".dockerignore",
            content
        );

        console.log("✔ .dockerignore created");
    }
}

module.exports = fixDockerignore;