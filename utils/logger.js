const chalk = require("chalk");

const logger = {
    success: (msg) => {
        console.log(chalk.green(`✔ ${msg}`));
    },

    error: (msg) => {
        console.log(chalk.red(`❌ ${msg}`));
    },

    warning: (msg) => {
        console.log(chalk.yellow(`⚠ ${msg}`));
    },

    info: (msg) => {
        console.log(chalk.cyan(`ℹ ${msg}`));
    }
};

module.exports = logger;