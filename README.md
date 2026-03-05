# 📧 Email Verification Module

## 🚀 Project Description
This project is a Node.js Email Verification Module that verifies email addresses using:
- Email syntax validation
- DNS MX record lookup
- SMTP mailbox verification via raw socket (RCPT TO command)
- Typo detection using Levenshtein distance algorithm
- Jest unit testing with mocked SMTP/DNS

The module returns structured verification results with execution time and status codes.

---

## 🌐 Live API
**Hosted on Railway:**
> https://email-verification-module-production-d240.up.railway.app

### Test it live:
| Test | URL |
|------|-----|
| Valid email | [knikki7505@gmail.com](https://email-verification-module-production-d240.up.railway.app/verify-email?email=knikki7505@gmail.com) |
| Invalid email | [nikky@gmail.com](https://email-verification-module-production-d240.up.railway.app/verify-email?email=nikky@gmail.com) |
| Typo detection | [test@gmial.com](https://email-verification-module-production-d240.up.railway.app/verify-email?email=test@gmial.com) |

> **Note:** SMTP verification (port 25) is blocked on free cloud hosting platforms by default to prevent spam abuse. Mailbox-level verification works correctly in a local environment. In production, this would be resolved using a dedicated server with port 25 whitelisted.

---

## 🏗 Project Structure
```
email-verification-module/
│
├── src/
│   ├── verifyEmail.js       ← Core verification function
│   ├── typoDetector.js      ← Levenshtein typo detection
│   └── utils/
│       ├── emailValidator.js ← Syntax validation
│       └── levenshtein.js   ← Distance algorithm
│
├── tests/
│   └── verifyEmail.test.js  ← 23 Jest test cases
│
├── server.js                ← Express API server
├── package.json
└── README.md
```

---

## ⚡ Features
- ✔ Email format validation (RFC compliant regex)
- ✔ DNS MX record lookup (sorted by priority)
- ✔ Real SMTP mailbox verification (RCPT TO command via raw socket)
- ✔ Typo suggestion using Levenshtein distance (edit distance ≤ 2)
- ✔ Execution time tracking
- ✔ Structured JSON response
- ✔ Express REST API

---

## 📦 Installation

### Clone Repository
```bash
git clone https://github.com/nikky-kumar7505/Email-Verification-Module.git
cd Email-Verification-Module
```

### Install Dependencies
```bash
npm install
```

---

## ▶ How to Run

### Start API Server
```bash
npm start
```
Server runs on: `http://localhost:3000`

### Verify an Email
```
GET http://localhost:3000/verify-email?email=test@gmail.com
```

---

## 🧪 Run Tests
```bash
npm test
```
**23 test cases** covering syntax validation, SMTP error codes, typo detection and edge cases.

---

## 📊 Expected Response Format
```json
{
  "email": "user@example.com",
  "result": "valid",
  "resultcode": 1,
  "subresult": "mailbox_exists",
  "didyoumean": null,
  "domain": "example.com",
  "mxRecords": ["mx1.example.com", "mx2.example.com"],
  "executiontime": 1.25,
  "error": null,
  "timestamp": "2026-03-05T10:30:00.000Z"
}
```

---

## 🔢 Result Codes
| Code | Meaning |
|------|---------|
| 1 | Valid Email |
| 3 | Unknown Result |
| 6 | Invalid Email |

---

## 🧪 Test Coverage
23 test cases covering:
- Valid email formats
- Invalid syntax (missing @, double dots, multiple @)
- SMTP error codes (550 → invalid, 450 → unknown, timeout → unknown)
- Typo detection (gmial.com, yahooo.com, hotmial.com, outlok.com)
- Edge cases (null, undefined, empty string, very long email)
- Output structure validation (resultcode, timestamp, executiontime)

---

## 🛠 Technologies Used
- Node.js
- Express.js
- SMTP Protocol (raw socket — net module)
- DNS MX Lookup
- Levenshtein Distance Algorithm
- Jest Testing Framework

---

## 👨‍💻 Author
**Nikky Kumar**
- GitHub: [nikky-kumar7505](https://github.com/nikky-kumar7505)

## 📜 License
ISC License
