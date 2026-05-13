const fs = require("fs");

function fixRoutes() {

    if (!fs.existsSync("routes")) {

        fs.mkdirSync("routes");

        console.log("✔ routes folder created");
    }
}

module.exports = fixRoutes;