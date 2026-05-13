#!/usr/bin/env node

const logger = require("../utils/logger");

const packageCheck = require("../checks/packageCheck");
const buildCheck = require("../checks/buildCheck");
const gitignoreCheck = require("../checks/gitignoreCheck");
const securityCheck = require("../checks/securityCheck");
const scoreManager = require("../utils/scoreManager");
const gitignore = gitignoreCheck();
const security = securityCheck();
const frameworkCheck = require("../checks/frameworkCheck");
const frameworks = frameworkCheck();

console.log(`
━━━━━━━━━━━━━━━━━━━━━━
🚀 DEPLOY READY
━━━━━━━━━━━━━━━━━━━━━━
`);

logger.info("Running Deploy Ready Checks...\n");

/* package.json check */
if (packageCheck()) {
    logger.success("package.json found");
} else {
    logger.error("package.json missing");
    scoreManager.deduct(25);
}

/* build script check */
if (buildCheck()) {
    logger.success("Build script exists");
} else {
    logger.warning("Build script missing");
    scoreManager.deduct(10);
}

/* .gitignore check */
if (!gitignore.exists) {

    logger.error(".gitignore missing");
    scoreManager.deduct(15);

} else {

    logger.success(".gitignore found");

    if (!gitignore.hasNodeModules) {
        logger.warning("node_modules not ignored");
        scoreManager.deduct(5);
    }

    if (!gitignore.hasEnv) {
        logger.warning(".env not ignored");
        scoreManager.deduct(10);
    }
}

/* security check */
if (security.secure) {

    logger.success("No weak secrets detected");

} else {

    logger.warning(security.reason);
    scoreManager.deduct(20);
}

// framework check
if (frameworks && frameworks.length > 0) {
    logger.success(
        `Framework Detected: ${frameworks.join(" + ")}`
    );
} else {

    logger.warning("No framework detected");
}

/* final score */
console.log(`
━━━━━━━━━━━━━━━━━━━━━━
📊 Deployment Score: ${scoreManager.getScore()}/100
━━━━━━━━━━━━━━━━━━━━━━
`);