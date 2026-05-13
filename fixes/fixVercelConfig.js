const fs = require("fs");

function fixVercelConfig() {

    if (!fs.existsSync("vercel.json")) {

        const content = `{
  "version": 2
}`;

        fs.writeFileSync(
            "vercel.json",
            content
        );

        console.log(
            "✔ vercel.json created"
        );
    }
}

module.exports = fixVercelConfig;