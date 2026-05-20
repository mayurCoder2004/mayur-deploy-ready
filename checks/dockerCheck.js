const fs = require("fs");

function dockerCheck() {

    const warnings = [];

    if (!fs.existsSync("Dockerfile")) {

        warnings.push(
            "Dockerfile missing"
        );

        return warnings;
    }

    const dockerfile =
        fs.readFileSync(
            "Dockerfile",
            "utf-8"
        );

    if (
        dockerfile.includes(":latest")
    ) {

        warnings.push(
            "Avoid using latest Docker tag"
        );
    }

    if (
        !dockerfile.includes("WORKDIR")
    ) {

        warnings.push(
            "WORKDIR missing"
        );
    }

    if (
        !dockerfile.includes("EXPOSE")
    ) {

        warnings.push(
            "EXPOSE instruction missing"
        );
    }

    if (
        !dockerfile.includes("USER")
    ) {

        warnings.push(
            "Container runs as root user"
        );
    }

    if (
        !dockerfile.includes("HEALTHCHECK")
    ) {

        warnings.push(
            "HEALTHCHECK missing"
        );
    }

    return warnings;
}

module.exports = dockerCheck;