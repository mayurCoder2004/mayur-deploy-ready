module.exports = [
    {
        name: "OpenAI API Key",
        regex: /sk-[a-zA-Z0-9]{20,}/g
    },

    {
        name: "AWS Access Key",
        regex: /AKIA[0-9A-Z]{16}/g
    },

    {
        name: "MongoDB URI",
        regex: /mongodb\+srv:\/\/[^\s]+/g
    },

    {
        name: "JWT Secret",
        regex: /JWT_SECRET\s*=\s*["']?(?!your_secret\b)(?!example\b)(?!changeme\b)[a-zA-Z0-9!@#$%^&*()_+=-]{12,}["']?/g
    }
];