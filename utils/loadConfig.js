const fs = require("fs");

function loadConfig() {

    const configPath =
        ".deployreadyrc.json";

    if (!fs.existsSync(configPath)) {
        return null;
    }

    try {

        const raw =
            fs.readFileSync(
                configPath,
                "utf-8"
            );

        return JSON.parse(raw);

    } catch {

        return null;
    }
}

module.exports = loadConfig;