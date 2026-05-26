module.exports = [

    {
        name: "OpenAI API Key",
        severity: "high",
        deduction: 10,
        regex: /sk-[a-zA-Z0-9]{20,}/g
    },

    {
        name: "AWS Access Key",
        severity: "critical",
        deduction: 20,
        regex: /AKIA[0-9A-Z]{16}/g
    },

    {
        name: "MongoDB URI",
        severity: "medium",
        deduction: 5,
        regex: /mongodb\+srv:\/\/[^\s]+/g
    },

    {
        name: "JWT Secret",
        severity: "low",
        deduction: 3,
        regex: /JWT_SECRET\s*=\s*["']?(?!your_secret\b)(?!example\b)(?!changeme\b)[a-zA-Z0-9!@#$%^&*()_+=-]{12,}["']?/g
    }
];