const { verifyEmail } = require("../src/verifyEmail");

describe("Email Verification Tests", () => {

    test("Valid email format", async () => {
        const res = await verifyEmail("test@gmail.com");
        expect(res.email).toBe("test@gmail.com");
    });

    test("Empty email", async () => {
        const res = await verifyEmail("");
        expect(res.result).toBe("invalid");
    });

    test("Null email", async () => {
        const res = await verifyEmail(null);
        expect(res.result).toBe("invalid");
    });

    test("Missing @ symbol", async () => {
        const res = await verifyEmail("testgmail.com");
        expect(res.result).toBe("invalid");
    });

    test("Double dots rejection", async () => {
        const res = await verifyEmail("test..123@gmail.com");
        expect(res.result).toBe("invalid");
    });

    test("Multiple @ rejection", async () => {
        const res = await verifyEmail("test@@gmail.com");
        expect(res.result).toBe("invalid");
    });

    test("Typo detection", async () => {
        const res = await verifyEmail("user@gmial.com");
        expect(res.didyoumean).toBeDefined();
    });

    test("Long email test", async () => {
        const res = await verifyEmail("a".repeat(100) + "@gmail.com");
        expect(res.result).toBeDefined();
    });

    test("Unknown domain test", async () => {
        const res = await verifyEmail("test@randomdomainxyz.com");
        expect(res.result).toBeDefined();
    });

    test("Valid yahoo email", async () => {
        const res = await verifyEmail("test@yahoo.com");
        expect(res.email).toContain("@");
    }, 15000);

    test("SMTP connection handling", async () => {
        const res = await verifyEmail("test@outlook.com");
        expect(res.result).toBeDefined();
    });

    test("Execution time present", async () => {
        const res = await verifyEmail("test@gmail.com");
        expect(res.executiontime).toBeDefined();
    });

    test("Timestamp present", async () => {
        const res = await verifyEmail("test@gmail.com");
        expect(res.timestamp).toBeDefined();
    });

    test("Did you mean typo suggestion", async () => {
        const res = await verifyEmail("test@hotmial.com");
        expect(res.didyoumean).toContain("hotmail");
    });

    test("Result code validation", async () => {
        const res = await verifyEmail("invalidemail");
        expect([1,3,6]).toContain(res.resultcode);
    });

});