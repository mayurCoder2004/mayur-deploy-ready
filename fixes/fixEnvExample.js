const fs = require("fs");

function fixEnvExample() {

    if (!fs.existsSync(".env.example")) {

        const content = `PORT=
JWT_SECRET=
DATABASE_URL=
`;

        fs.writeFileSync(
            ".env.example",
            content
        );

        console.log("✔ .env.example created");
    }
}

module.exports = fixEnvExample;