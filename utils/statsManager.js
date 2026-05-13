let passed = 0;
let warnings = 0;
let errors = 0;

function addPass() {
    passed++;
}

function addWarning() {
    warnings++;
}

function addError() {
    errors++;
}

function getStats() {
    return {
        passed,
        warnings,
        errors
    };
}

module.exports = {
    addPass,
    addWarning,
    addError,
    getStats
};