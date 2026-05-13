const fs = require("fs");

function fixDockerfile() {

    if (!fs.existsSync("Dockerfile")) {

        const content = `FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
`;

        fs.writeFileSync("Dockerfile", content);

        console.log("✔ Dockerfile created");
    }
}

module.exports = fixDockerfile;