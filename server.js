const express = require("express");
const { verifyEmail } = require("./src/verifyEmail");

const app = express();

app.get("/", (req, res) => {
    res.json({
        message: "Email Verification API is running",
        usage: "Use /verify-email endpoint with email query parameter",
        example: "http://localhost:3000/verify-email?email=test@gamil.com"
    });
});

app.get("/verify-email", async (req, res) => {
    try {
        const email = req.query.email;

        if (!email) {
            return res.status(400).json({ error: "Email query parameter required" });
        }

        const result = await verifyEmail(email);

        res.json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});