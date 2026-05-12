const logger = require("../utils/logger");
const packageCheck = require("../checks/packageCheck");

logger.info("Running Deploy Ready Checks...\n");

if (packageCheck()) {
    logger.success("package.json found");
} else {
    logger.error("package.json missing");
}