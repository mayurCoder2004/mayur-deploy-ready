#!/usr/bin/env node

const logger = require("../utils/logger");
const packageCheck = require("../checks/packageCheck");
const buildCheck = require("../checks/buildCheck");
const gitignoreCheck = require("../checks/gitignoreCheck");
const gitignore = gitignoreCheck();
const securityCheck = require("../checks/securityCheck");
const security = securityCheck();

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
}

/* build script check */
if (buildCheck()) {
    logger.success("Build script exists");
} else {
    logger.warning("Build script missing");
}

// build .gitignore check
if (!gitignore.exists) {
    logger.error(".gitignore missing");
} else {

    logger.success(".gitignore found");

    if (!gitignore.hasNodeModules) {
        logger.warning("node_modules not ignored");
    }

    if (!gitignore.hasEnv) {
        logger.warning(".env not ignored");
    }
}

// build security check
if (security.secure) {
    logger.success("No weak secrets detected");
} else {
    logger.warning(security.reason);
}