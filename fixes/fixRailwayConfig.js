const fs = require("fs");

function fixRailwayConfig() {

    if (!fs.existsSync("railway.json")) {

        const content = `{
  "$schema": "https://railway.app/railway.schema.json"
}`;

        fs.writeFileSync(
            "railway.json",
            content
        );

        console.log(
            "✔ railway.json created"
        );
    }
}

module.exports = fixRailwayConfig;