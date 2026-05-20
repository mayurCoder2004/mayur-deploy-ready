const fs = require("fs");
const path = require("path");
const loadConfig = require("../utils/loadConfig");

const patterns =
    require("./secretPatterns");

const allowedExtensions = [
    ".js",
    ".ts",
    ".env",
    ".json"
];

// Static analysis tools skip common generated/vendor folders by default
// to avoid noisy findings and unnecessary traversal cost.
const defaultIgnoredDirectories = [
    "node_modules",
    ".git",
    "dist",
    "build"
];

function normalizeIgnorePath(ignorePath) {

    if (typeof ignorePath !== "string") {
        return "";
    }

    return ignorePath
        .trim()
        .replace(/\\/g, "/")
        .replace(/^\.\/+/, "")
        .replace(/\/+$/, "");
}

function getIgnoreSettings() {

    const config =
        loadConfig() || {};

    const configuredIgnores =
        Array.isArray(config.securityIgnore)
            ? config.securityIgnore
            : [];

    const ignoredDirectories =
        new Set(defaultIgnoredDirectories);

    const ignoredFiles =
        new Set();

    configuredIgnores.forEach((entry) => {

        const normalized =
            normalizeIgnorePath(entry);

        if (!normalized) {
            return;
        }

        const baseName =
            path.basename(normalized);

        const looksLikeFile =
            path.extname(baseName) !== "";

        if (looksLikeFile) {
            ignoredFiles.add(normalized);
            ignoredFiles.add(baseName);
            return;
        }

        ignoredDirectories.add(normalized);
        ignoredDirectories.add(baseName);
    });

    return {
        ignoredDirectories,
        ignoredFiles
    };
}

function isIgnoredDirectory(relativeDirectoryPath, ignoredDirectories) {

    const normalized =
        normalizeIgnorePath(relativeDirectoryPath);

    if (!normalized) {
        return false;
    }

    return (
        ignoredDirectories.has(normalized) ||
        ignoredDirectories.has(path.basename(normalized))
    );
}

function isIgnoredFile(relativeFilePath, ignoredFiles) {

    const normalized =
        normalizeIgnorePath(relativeFilePath);

    if (!normalized) {
        return false;
    }

    return (
        ignoredFiles.has(normalized) ||
        ignoredFiles.has(path.basename(normalized))
    );
}

function shouldScanExtension(fileName) {

    const ext =
        path.extname(fileName);

    return allowedExtensions.includes(ext);
}

function scanFile(filePath) {

    const warnings = [];

    try {

        const content =
            fs.readFileSync(
                filePath,
                "utf-8"
            );

        patterns.forEach((pattern) => {

            if (
                pattern.regex.test(content)
            ) {

                warnings.push(
                    `Potential ${pattern.name} detected in ${filePath}`
                );
            }
        });

    } catch {}

    return warnings;
}

function scanDirectory(rootDir) {

    const {
        ignoredDirectories,
        ignoredFiles
    } = getIgnoreSettings();

    function scanRecursive(currentDir, relativeDirPath = "") {

        let warnings = [];

        let entries = [];

        try {
            entries =
                fs.readdirSync(currentDir);
        } catch {
            return warnings;
        }

        entries.forEach((entryName) => {

            const fullPath =
                path.join(currentDir, entryName);

            let stat;

            try {
                stat =
                    fs.statSync(fullPath);
            } catch {
                return;
            }

            const relativePath =
                relativeDirPath
                    ? path.join(relativeDirPath, entryName)
                    : entryName;

            if (stat.isDirectory()) {

                // Exclusions are critical in security scanning so teams can
                // suppress known-safe, generated, or irrelevant paths.
                if (
                    isIgnoredDirectory(
                        relativePath,
                        ignoredDirectories
                    )
                ) {
                    return;
                }

                warnings =
                    warnings.concat(
                        scanRecursive(
                            fullPath,
                            relativePath
                        )
                    );
                return;
            }

            if (
                isIgnoredFile(
                    relativePath,
                    ignoredFiles
                )
            ) {
                return;
            }

            if (
                shouldScanExtension(entryName)
            ) {

                warnings =
                    warnings.concat(
                        scanFile(fullPath)
                    );
            }
        });

        return warnings;
    }

    return scanRecursive(rootDir);
}

module.exports = scanDirectory;
