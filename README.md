<div align="center">

# 🚀 mayur-deploy-ready

**Analyze, score, and fix your project's deployment readiness — before it hits production.**

[![npm version](https://img.shields.io/npm/v/mayur-deploy-ready?color=0ea5e9&style=flat-square)](https://www.npmjs.com/package/mayur-deploy-ready)
[![npm downloads](https://img.shields.io/npm/dm/mayur-deploy-ready?color=22c55e&style=flat-square)](https://www.npmjs.com/package/mayur-deploy-ready)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D14-brightgreen?style=flat-square&logo=node.js)](https://nodejs.org/)

A zero-config CLI tool that detects missing deployment configurations, Docker setup issues, CI/CD misconfigurations, insecure defaults, and other common deployment pitfalls — all before you push to production.

[Installation](#-installation) · [Usage](#-usage) · [Features](#-features) · [Examples](#-example-output) · [Roadmap](#-roadmap) · [Contributing](#-contributing)

</div>

---

## 🤔 Why mayur-deploy-ready?

Broken deployments are expensive. Missing a `.gitignore`, an undefined `start` script, or a forgotten `Dockerfile` can block releases or expose secrets. `mayur-deploy-ready` acts as your pre-flight checklist — run it locally or in CI, get a score, and ship with confidence.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Framework Detection** | Automatically identifies Node.js, Express, React, Vite, and more |
| 📊 **Deployment Scoring** | Grades your project 0–100 with clear pass/warning/error breakdown |
| 🐳 **Docker Checks** | Validates `Dockerfile`, `.dockerignore`, and image configuration |
| 🚂 **Railway / Vercel Checks** | Platform-specific config validation for Railway and Vercel |
| 🔒 **Security Checks** | Detects exposed secrets, missing `.gitignore` entries, and unsafe defaults |
| 💡 **Suggestions Engine** | Actionable recommendations for every issue found |
| 🛠️ **Auto Fix Mode** | Automatically scaffolds missing files with sensible defaults |
| 📦 **package.json Auto Updates** | Adds missing `start`, `build`, and `test` scripts automatically |
| 📄 **JSON Output Mode** | Machine-readable output for scripting and dashboards |
| ⚙️ **CI/CD Integration** | Exit codes for seamless GitHub Actions, Jenkins, and GitLab CI support |

---

## 📦 Installation

```bash
npm install -g mayur-deploy-ready
```

Requires **Node.js ≥ 14**.

---

## 🚀 Usage

### Standard Analysis

Run from the root of your project:

```bash
mayur-deploy-ready
```

Scans your project and prints a detailed report with a deployment score.

---

### Auto Fix Mode

```bash
mayur-deploy-ready fix
```

Automatically creates missing files with sensible defaults:

| File | Purpose |
|---|---|
| `.gitignore` | Prevents committing `node_modules`, `.env`, build artifacts |
| `.dockerignore` | Keeps Docker image lean by excluding dev files |
| `Dockerfile` | Production-ready container definition |
| `.env.example` | Documents required environment variables |
| `routes/` | Scaffolds an Express route directory |
| `vercel.json` | Vercel deployment configuration |
| `railway.json` | Railway deployment configuration |

> **Note:** Auto fix creates files only if they don't already exist. Existing files are never overwritten.

---

### JSON Output Mode

```bash
mayur-deploy-ready --json
```

Returns structured JSON — ideal for piping into other tools or building dashboards:

```json
{
  "score": 85,
  "framework": "Express",
  "stats": {
    "passed": 6,
    "warnings": 1,
    "errors": 0
  },
  "issues": [
    {
      "type": "warning",
      "message": ".env.example not found",
      "fix": "Create a .env.example documenting required environment variables"
    }
  ]
}
```

---

### CI/CD Mode

```bash
mayur-deploy-ready --ci
```

Runs a silent check and exits with a meaningful code:

| Exit Code | Meaning |
|---|---|
| `0` | ✅ Deployment safe — all critical checks passed |
| `1` | ❌ Deployment unsafe — critical issues detected |

**Example: GitHub Actions**

```yaml
name: Deployment Readiness Check

on: [push, pull_request]

jobs:
  deploy-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g mayur-deploy-ready
      - run: mayur-deploy-ready --ci
```

Works with: **GitHub Actions · Jenkins · GitLab CI · Railway Pipelines · CircleCI**

---

## 📋 Example Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀  DEPLOY READY  —  mayur-deploy-ready
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✔  package.json found
✔  .gitignore found
✔  .dockerignore found
✔  Dockerfile found
✔  Framework detected: Express
⚠  .env.example not found
   → Create a .env.example to document required environment variables

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊  Deployment Score: 90 / 100
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Passed   6   ████████████████████  
  Warnings 1   ███                   
  Errors   0                         

🟢  Production Ready

Run `mayur-deploy-ready fix` to resolve warnings automatically.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🌐 Supported Platforms & Frameworks

**Runtimes**
- Node.js

**Frameworks**
- Express · React · Vite

**Deployment Platforms**
- Docker · Railway · Vercel

> Support for Kubernetes, Netlify, Render, and Netlify is on the roadmap.

---

## 🗺️ Roadmap

- [ ] GitHub Actions inline annotations
- [ ] Kubernetes manifest checks
- [ ] Netlify deployment support
- [ ] Render deployment checks
- [ ] Advanced security scanning (OWASP alignment)
- [ ] Python / Django / FastAPI support
- [ ] Go and Rust project detection

Have a feature request? [Open an issue](https://github.com/mayurpawar/mayur-deploy-ready/issues).

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

Please make sure your PR includes tests for any new checks or features.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

---

<div align="center">

Made with ❤️ by **Mayur Pawar**

If this tool saved you from a broken deploy, consider giving it a ⭐ on GitHub!

</div>