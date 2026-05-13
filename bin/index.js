#!/usr/bin/env node

const logger = require("../utils/logger");

const command = process.argv[2];
const packageCheck = require("../checks/packageCheck");
const buildCheck = require("../checks/buildCheck");
const gitignoreCheck = require("../checks/gitignoreCheck");
const securityCheck = require("../checks/securityCheck");
const frameworkCheck = require("../checks/frameworkCheck");

const reactChecks = require("../checks/frameworks/reactChecks");
const expressChecks = require("../checks/frameworks/expressChecks");

const scoreManager = require("../utils/scoreManager");
const showSuggestion = require("../utils/suggestions");
const statsManager = require("../utils/statsManager");

const gitignore = gitignoreCheck();
const security = securityCheck();
const frameworks = frameworkCheck();

const fixGitignore = require("../fixes/fixGitignore");
const fixRoutes = require("../fixes/fixRoutes");
const fixEnvExample = require("../fixes/fixEnvExample");

/* FIX MODE */

if (command === "fix") {

    console.log(`
━━━━━━━━━━━━━━━━━━━━━━
🛠 DEPLOY READY FIX
━━━━━━━━━━━━━━━━━━━━━━
`);

    fixGitignore();
    fixRoutes();
    fixEnvExample();

    process.exit();
}

console.log(`
━━━━━━━━━━━━━━━━━━━━━━
🚀 DEPLOY READY
━━━━━━━━━━━━━━━━━━━━━━
`);

logger.info("Running Deploy Ready Checks...\n");

/* package.json check */

if (packageCheck()) {

    logger.success("package.json found");
    statsManager.addPass();

} else {

    logger.error("package.json missing");

    showSuggestion(
        "Create package.json:",
        `npm init -y`
    );

    statsManager.addError();

    scoreManager.deduct(25);
}

/* build script check */

if (buildCheck()) {

    logger.success("Build script exists");
    statsManager.addPass();

} else {

    logger.warning("Build script missing");

    showSuggestion(
        "Add this inside package.json scripts:",
        `"build": "vite build"`
    );

    statsManager.addWarning();

    scoreManager.deduct(10);
}

/* .gitignore check */

if (!gitignore.exists) {

    logger.error(".gitignore missing");

    showSuggestion(
        "Create .gitignore file with:",
        `node_modules
.env
dist`
    );

    statsManager.addError();

    scoreManager.deduct(15);

} else {

    logger.success(".gitignore found");
    statsManager.addPass();

    if (!gitignore.hasNodeModules) {

        logger.warning("node_modules not ignored");

        showSuggestion(
            "Add this to .gitignore:",
            `node_modules`
        );

        statsManager.addWarning();

        scoreManager.deduct(5);
    }

    if (!gitignore.hasEnv) {

        logger.warning(".env not ignored");

        showSuggestion(
            "Add this to .gitignore:",
            `.env`
        );

        statsManager.addWarning();

        scoreManager.deduct(10);
    }
}

/* security check */

if (security.secure) {

    logger.success("No weak secrets detected");
    statsManager.addPass();

} else {

    logger.warning(security.reason);

    if (security.reason === ".env missing") {

        showSuggestion(
            "Create .env file:",
            `PORT=5000
JWT_SECRET=your_secret`
        );

    } else {

        showSuggestion(
            "Use stronger secrets:",
            `JWT_SECRET=your_super_secure_secret`
        );
    }

    statsManager.addWarning();

    scoreManager.deduct(20);
}

/* framework detection */

if (frameworks && frameworks.length > 0) {

    logger.success(
        `Framework Detected: ${frameworks.join(" + ")}`
    );

    statsManager.addPass();

} else {

    logger.warning("No framework detected");

    statsManager.addWarning();

    scoreManager.deduct(10);
}

/* React checks */

if (frameworks.includes("React")) {

    const reactWarnings = reactChecks();

    reactWarnings.forEach((warning) => {

        logger.warning(warning);

        if (warning === "Vite config missing") {

            showSuggestion(
                "Create Vite config file:",
                `vite.config.js`
            );
        }

        if (warning === "src folder missing") {

            showSuggestion(
                "Create source folder:",
                `mkdir src`
            );
        }

        statsManager.addWarning();

        scoreManager.deduct(5);
    });
}

/* Express checks */

if (frameworks.includes("Express")) {

    const expressWarnings = expressChecks();

    expressWarnings.forEach((warning) => {

        logger.warning(warning);

        if (warning === "start script missing") {

            showSuggestion(
                "Add this to package.json scripts:",
                `"start": "node server.js"`
            );
        }

        if (warning === "routes folder missing") {

            showSuggestion(
                "Create routes folder:",
                `mkdir routes`
            );
        }

        statsManager.addWarning();

        scoreManager.deduct(5);
    });
}

/* deployment readiness level */

const finalScore = scoreManager.getScore();
const stats = statsManager.getStats();

console.log(`
━━━━━━━━━━━━━━━━━━━━━━
📊 Deployment Score: ${finalScore}/100
━━━━━━━━━━━━━━━━━━━━━━
`);

console.log(`
✔ Passed: ${stats.passed}
⚠ Warnings: ${stats.warnings}
❌ Errors: ${stats.errors}
`);

if (finalScore >= 85) {

    console.log("🟢 Production Ready");

} else if (finalScore >= 60) {

    console.log("🟡 Needs Attention");

} else {

    console.log("🔴 Unsafe Deployment");
}