const fs = require("fs");

function securityCheck() {
    if (!fs.existsSync(".env")) {
        return {
            secure: false,
            reason: ".env missing"
        }
    }

    const envContent = fs.readFileSync(
        ".env",
        "utf-8"
    );

    const weakSecrets = [
        "123456",
        "password",
        "secret",
        "admin"
    ];

    for (let weak of weakSecrets) {
        if (envContent.includes(weak)) {
            return {
                secure: false,
                reason: `Weak secret detected: ${weak}`
            }
        }
    }

    return {
        secure: true
    };
}