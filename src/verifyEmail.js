const dns = require("dns").promises;
const net = require("net");
const { validateEmailSyntax } = require("./utils/emailValidator");
const { getDidYouMean } = require("./typoDetector");


function checkSMTP(smtpHost, email) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        let step = 0;
        let resolved = false;

        const domain = email.split("@")[1];

        const finish = (result, subresult, error = null) => {
            if (!resolved) {
                resolved = true;
                socket.destroy();
                resolve({ result, subresult, error });
            }
        };

        socket.setTimeout(8000);

        socket.on("timeout", () => {
            finish("unknown", "connection_timeout", "SMTP connection timed out");
        });

        socket.on("error", (err) => {
            finish("unknown", "connection_error", err.message);
        });

        socket.on("data", (data) => {
            const response = data.toString();

            if (step === 0) {
                if (response.startsWith("220")) {
                    step = 1;
                    socket.write(`EHLO ${domain}\r\n`);
                } else {
                    finish("unknown", "connection_error", "Bad SMTP banner: " + response.trim());
                }
            } else if (step === 1) {
                if (response.includes("250")) {
                    step = 2;
                    socket.write(`MAIL FROM:<verify@${domain}>\r\n`);
                } else {
                    finish("unknown", "connection_error", "EHLO failed: " + response.trim());
                }
            } else if (step === 2) {
                if (response.startsWith("250")) {
                    step = 3;
                    socket.write(`RCPT TO:<${email}>\r\n`);
                } else {
                    finish("unknown", "connection_error", "MAIL FROM failed: " + response.trim());
                }
            } else if (step === 3) {
                const code = parseInt(response.substring(0, 3));

                if (code === 250 || code === 251) {
                    finish("valid", "mailbox_exists");
                } else if (code === 550 || code === 551 || code === 553 || code === 554) {
                    finish("invalid", "mailbox_does_not_exist", response.trim());
                } else if (code === 450 || code === 451 || code === 452) {
                    finish("unknown", "greylisted", response.trim());
                } else if (code === 421) {
                    finish("unknown", "connection_error", response.trim());
                } else {
                    finish("unknown", "unknown_smtp_response", response.trim());
                }
            }
        });

        socket.connect(25, smtpHost);
    });
}

async function verifyEmail(email) {
    const startTime = Date.now();

    let result = "unknown";
    let resultcode = 3;
    let subresult = null;
    let error = null;
    let mxRecords = [];
    let didYouMean = null;
    let domain = null;

    try {

        if (email === null || email === undefined || typeof email !== "string") {
            return {
                email: email ?? null,
                result: "invalid",
                resultcode: 6,
                subresult: "invalid_input",
                didyoumean: null,
                domain: null,
                mxRecords: [],
                executiontime: (Date.now() - startTime) / 1000,
                error: "Invalid input: email must be a string",
                timestamp: new Date().toISOString()
            };
        }

        email = email.trim();




        if (!validateEmailSyntax(email)) {
            didYouMean = await getDidYouMean(email);
            return {
                email,
                result: "invalid",
                resultcode: 6,
                subresult: "syntax_error",
                didyoumean: didYouMean,
                domain: null,
                mxRecords: [],
                executiontime: (Date.now() - startTime) / 1000,
                error: null,
                timestamp: new Date().toISOString()
            };
        }

        domain = email.split("@")[1];

        // ✅ FIX 1: Check typo first — force invalid immediately
        didYouMean = await getDidYouMean(email);
        if (didYouMean) {
            return {
                email,
                result: "invalid",
                resultcode: 6,
                subresult: "typo_detected",
                didyoumean: didYouMean,
                domain,
                mxRecords: [],
                executiontime: (Date.now() - startTime) / 1000,
                error: null,
                timestamp: new Date().toISOString()
            };
        }

        try {
            const rawMx = await dns.resolveMx(domain);
            if (!rawMx || rawMx.length === 0) throw new Error("No MX records found");
            rawMx.sort((a, b) => a.priority - b.priority);
            mxRecords = rawMx.map(m => m.exchange);
        } catch (mxError) {
            return {
                email,
                result: "invalid",
                resultcode: 6,
                subresult: "no_mx_records",
                didyoumean: null,
                domain,
                mxRecords: [],
                executiontime: (Date.now() - startTime) / 1000,
                error: mxError.message,
                timestamp: new Date().toISOString()
            };
        }

        const smtpResult = await checkSMTP(mxRecords[0], email);
        result = smtpResult.result;
        subresult = smtpResult.subresult;
        error = smtpResult.error;

        if (result === "valid") resultcode = 1;
        else if (result === "unknown") resultcode = 3;
        else if (result === "invalid") resultcode = 6;

    } catch (err) {
        error = err.message;
        result = "unknown";
        resultcode = 3;
        subresult = "verification_failed";
    }

    return {
        email: email || null,
        result,
        resultcode,
        subresult,
        didyoumean: didYouMean,
        domain,
        mxRecords,
        executiontime: (Date.now() - startTime) / 1000,
        error,
        timestamp: new Date().toISOString()
    };
}

module.exports = { verifyEmail, checkSMTP };