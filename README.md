# 📧 Email Verification Module

## 🚀 Project Description

This project is a Node.js Email Verification Module that verifies email addresses using:

- Email syntax validation  
- DNS MX record lookup  
- SMTP mailbox verification  
- Typo detection using Levenshtein distance  
- Jest unit testing  

The module returns structured verification results with execution time and status codes.

---

## 🏗 Project Structure


email-verification-module/
│
├── src/
│ ├── verifyEmail.js
│ ├── typoDetector.js
│ └── utils/
│ ├── emailValidator.js
│ └── levenshtein.js
│
├── tests/
│ └── verifyEmail.test.js
│
├── package.json
├── jest.config.js
└── README.md

---

## ⚡ Features

✔ Email format validation  
✔ SMTP mailbox verification  
✔ DNS MX record lookup  
✔ Typo suggestion detection  
✔ Execution time tracking  
✔ Structured JSON response  

---

## 📦 Installation

### Clone Repository

```bash
git clone <repository-url>
cd email-verification-module
Install Dependencies
npm install

Required Packages:

nodemailer

jest

▶ How to Run This Project

Run Email Verification Module:

node src/verifyEmail.js

OR (if start script is added):

npm start
🧪 Run Tests
npm test

OR

npx jest

👉 For production submission, npm test is recommended.

🧪 Example Usage

Create a test file or use Node REPL:

const { verifyEmail } = require("./src/verifyEmail");

async function test() {
    const result = await verifyEmail("test@gmail.com");
    console.log(result);
}

test();

Run:

node test.js
📊 Expected Response Format
{
  "email": "user@example.com",
  "result": "valid",
  "resultcode": 1,
  "subresult": "mailbox_exists",
  "didyoumean": "user@gmail.com",
  "domain": "example.com",
  "mxRecords": ["mx.server.com"],
  "executiontime": 2,
  "error": null,
  "timestamp": "2026-02-11T10:30:00.000Z"
}
🔢 Result Codes
Code	Meaning
1	Valid Email
3	Unknown Result
6	Invalid Email
🧪 Testing Strategy

The project includes 15+ test cases covering:

Valid email formats

Invalid syntax

SMTP connection handling

Typo detection

Edge cases

Testing Framework:

Jest

🛠 Technologies Used

Node.js

SMTP Protocol

DNS MX Lookup

Jest Testing Framework

Nodemailer

⚠️ Notes

SMTP verification may be blocked by some providers.

Tests use mocked network calls for stability.

👨‍💻 Author

Nikky Kumar

📜 License

ISC License
