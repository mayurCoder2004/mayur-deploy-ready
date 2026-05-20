#!/usr/bin/env node

const logger = require("../utils/logger");
const config = require("../utils/scoreManager.js");
const scoreConfig = require("../utils/scoreConfig");

const command = process.argv[2];
const isJsonMode = process.argv.includes("--json");
const isCiMode = process.argv.includes("--ci");

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

const fixGitignore = require("../fixes/fixGitignore");
const fixRoutes = require("../fixes/fixRoutes");
const fixEnvExample = require("../fixes/fixEnvExample");
const fixDockerfile = require("../fixes/fixDockerfile");
const fixDockerignore = require("../fixes/fixDockerignore");
const fixPackageScripts = require("../fixes/fixPackageScripts");
const fixVercelConfig = require("../fixes/fixVercelConfig");
const fixRailwayConfig = require("../fixes/fixRailwayConfig");

const gitignore = gitignoreCheck();
const security = securityCheck();
const frameworks = frameworkCheck();

const dockerCheck = require("../checks/dockerCheck");
const platformCheck = require("../checks/platformCheck");
const dockerWarnings = dockerCheck();

const results = [];

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
    fixDockerfile();
    fixDockerignore();
    fixPackageScripts(frameworks);
    fixVercelConfig();
    fixRailwayConfig();

    process.exit();
}

/* CLI HEADER */

if (!isJsonMode) {

    console.log(`
━━━━━━━━━━━━━━━━━━━━━━
🚀 DEPLOY READY
━━━━━━━━━━━━━━━━━━━━━━
`);

    logger.info("Running Deploy Ready Checks...\n");
}

/* package.json check */

if (packageCheck()) {

    if (!isJsonMode) {
        logger.success("package.json found");
    }

    results.push({
        type: "success",
        message: "package.json found"
    });

    statsManager.addPass();

} else {

    if (!isJsonMode) {
        logger.error("package.json missing");
    }

    results.push({
        type: "error",
        message: "package.json missing"
    });

    if (!isJsonMode) {
        showSuggestion(
            "Create package.json:",
            `npm init -y`
        );
    }

    statsManager.addError();

    scoreManager.deduct("package", 25);
}

/* build script check */

if (buildCheck()) {

    if (!isJsonMode) {
        logger.success("Build script exists");
    }

    results.push({
        type: "success",
        message: "Build script exists"
    });

    statsManager.addPass();

} else {

    if (!isJsonMode) {
        logger.warning("Build script missing");

        showSuggestion(
            "Add this inside package.json scripts:",
            `"build": "vite build"`
        );
    }

    results.push({
        type: "warning",
        message: "Build script missing"
    });

    statsManager.addWarning();

    scoreManager.deduct("scripts", 10);
}

/* .gitignore check */

if (!gitignore.exists) {

    if (!isJsonMode) {

        logger.error(".gitignore missing");

        showSuggestion(
            "Create .gitignore file with:",
            `node_modules
.env
dist`
        );
    }

    results.push({
        type: "error",
        message: ".gitignore missing"
    });

    statsManager.addError();

    scoreManager.deduct("gitignore", 15);

} else {

    if (!isJsonMode) {
        logger.success(".gitignore found");
    }

    results.push({
        type: "success",
        message: ".gitignore found"
    });

    statsManager.addPass();

    if (!gitignore.hasNodeModules) {

        if (!isJsonMode) {

            logger.warning("node_modules not ignored");

            showSuggestion(
                "Add this to .gitignore:",
                `node_modules`
            );
        }

        results.push({
            type: "warning",
            message: "node_modules not ignored"
        });

        statsManager.addWarning();

        scoreManager.deduct("gitignore", 5);
    }

    if (!gitignore.hasEnv) {

        if (!isJsonMode) {

            logger.warning(".env not ignored");

            showSuggestion(
                "Add this to .gitignore:",
                `.env`
            );
        }

        results.push({
            type: "warning",
            message: ".env not ignored"
        });

        statsManager.addWarning();

        scoreManager.deduct("gitignore", 10);
    }
}

/* security check */

if (security.secure) {

    if (!isJsonMode) {
        logger.success("No weak secrets detected");
    }

    results.push({
        type: "success",
        message: "No weak secrets detected"
    });

    statsManager.addPass();

} else {

    if (!isJsonMode) {

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
    }

    results.push({
        type: "warning",
        message: security.reason
    });

    statsManager.addWarning();

    scoreManager.deduct("security", 20);
}

/* framework detection */

if (frameworks && frameworks.length > 0) {

    if (!isJsonMode) {
        logger.success(
            `Framework Detected: ${frameworks.join(" + ")}`
        );
    }

    results.push({
        type: "success",
        message: `Framework Detected: ${frameworks.join(" + ")}`
    });

    statsManager.addPass();

} else {

    if (!isJsonMode) {
        logger.warning("No framework detected");
    }

    results.push({
        type: "warning",
        message: "No framework detected"
    });

    statsManager.addWarning();

    scoreManager.deduct("framework", 10);
}

/* React checks */

if (frameworks.includes("React")) {

    const reactWarnings = reactChecks();

    reactWarnings.forEach((warning) => {

        if (!isJsonMode) {

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
        }

        results.push({
            type: "warning",
            message: warning
        });

        statsManager.addWarning();

        scoreManager.deduct("framework", 5);
    });
}

/* Express checks */

if (frameworks.includes("Express")) {

    const expressWarnings = expressChecks();

    expressWarnings.forEach((warning) => {

        if (!isJsonMode) {

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
        }

        results.push({
            type: "warning",
            message: warning
        });

        statsManager.addWarning();

        scoreManager.deduct("framework", 5);
    });
}

// Docker checks
dockerWarnings.forEach((warning) => {

    if (!isJsonMode) {

        logger.warning(warning);

        if (warning === "Dockerfile missing") {

            showSuggestion(
                "Create Dockerfile:",
                `FROM node:18`
            );
        }

        if (warning === ".dockerignore missing") {

            showSuggestion(
                "Create .dockerignore:",
                `node_modules
.env`
            );
        }
    }

    results.push({
        type: "warning",
        message: warning
    });

    statsManager.addWarning();

    scoreManager.deduct("docker", 5);
});

/* Platform deployment checks */

const platformWarnings = platformCheck(frameworks);

platformWarnings.forEach((warning) => {

    if (!isJsonMode) {

        logger.warning(warning);

        if (warning === "vercel.json missing") {

            showSuggestion(
                "Create vercel.json:",
                `{
  "version": 2
}`
            );
        }

        if (warning === "railway.json missing") {

            showSuggestion(
                "Create railway.json:",
                `{
  "$schema": "https://railway.app/railway.schema.json"
}`
            );
        }
    }

    results.push({
        type: "warning",
        message: warning
    });

    statsManager.addWarning();

    scoreManager.deduct("platform", 5);
});

/* FINAL RESULTS */

const finalScore = scoreManager.getTotalScore();
const stats = statsManager.getStats();

/* JSON MODE */

if (isJsonMode) {

    console.log(JSON.stringify({
        score: finalScore,
        stats,
        results
    }, null, 2));

    process.exit();
}

/* NORMAL MODE */

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

/* CATEGORY SCORES */

const categoryScores =
    scoreManager.getCategoryScores();

console.log(`
📦 Category Scores
━━━━━━━━━━━━━━━━━━━━━━
`);

Object.entries(categoryScores)
.forEach(([key, value]) => {

    console.log(
        `${key.toUpperCase()}: ${value}/${scoreConfig[key]}`
    );
});

/* FINAL STATUS */

if (finalScore >= 85) {

    console.log("🟢 Production Ready");

} else if (finalScore >= 60) {

    console.log("🟡 Needs Attention");

} else {

    console.log("🔴 Unsafe Deployment");
}