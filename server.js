const express = require("express");
const { verifyEmail } = require("./src/verifyEmail");

const app = express();

app.get("/", (req, res) => {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Email Verification API</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
                h1 { color: #333; }
                .card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                a { color: #0070f3; text-decoration: none; display: block; margin: 10px 0; }
                a:hover { text-decoration: underline; }
                .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; margin-right: 8px; }
                .valid { background: #d4edda; color: #155724; }
                .invalid { background: #f8d7da; color: #721c24; }
                .typo { background: #fff3cd; color: #856404; }
            </style>
        </head>
        <body>
            <h1>📧 Email Verification API</h1>
            <div class="card">
                <h3>Usage</h3>
                <p>GET /verify-email?email=your@email.com</p>
            </div>
            <div class="card">
                <h3>Try Examples</h3>
                <a href="${baseUrl}/verify-email?email=knikki7505@gmail.com">
                    <span class="badge valid">VALID</span> knikki7505@gmail.com
                </a>
                <a href="${baseUrl}/verify-email?email=nikky@gmail.com">
                    <span class="badge invalid">INVALID</span> nikky@gmail.com
                </a>
                <a href="${baseUrl}/verify-email?email=test@gmial.com">
                    <span class="badge typo">TYPO</span> test@gmial.com → gmail.com
                </a>
            </div>
        </body>
        </html>
    `);
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