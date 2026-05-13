const fs = require("fs");

function fixGitignore() {

    const content = `
node_modules
.env
dist
`;

    fs.writeFileSync(".gitignore", content);

    console.log("✔ .gitignore created");
}

module.exports = fixGitignore;