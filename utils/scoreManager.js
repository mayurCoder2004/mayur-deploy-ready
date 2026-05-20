const config = require("./scoreConfig");

let categoryScores = {
    package: config.package,
    scripts: config.scripts,
    gitignore: config.gitignore,
    security: config.security,
    docker: config.docker,
    framework: config.framework,
    platform: config.platform
};

function deduct(category, points) {

    if (categoryScores[category] !== undefined) {

        categoryScores[category] -= points;

        if (categoryScores[category] < 0) {
            categoryScores[category] = 0;
        }
    }
}

function getTotalScore() {

    return Object.values(categoryScores)
        .reduce((a, b) => a + b, 0);
}

function getCategoryScores() {
    return categoryScores;
}

module.exports = {
    deduct,
    getTotalScore,
    getCategoryScores
};