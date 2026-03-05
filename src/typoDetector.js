const { levenshteinDistance } = require("./utils/levenshtein");

const COMMON_DOMAINS = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "aol.com",
    "icloud.com",
    "protonmail.com",
    "mail.com"
];

async function getDidYouMean(email) {
    if (!email || typeof email !== "string") return null;
    if (!email.includes("@")) return null;

    const parts = email.split("@");
    if (parts.length !== 2) return null;

    const [local, domain] = parts;
    if (!domain || !local) return null;

    const lowerDomain = domain.toLowerCase();

    // ✅ If domain exactly matches a known domain — NOT a typo
    if (COMMON_DOMAINS.includes(lowerDomain)) return null;

    let bestMatch = null;
    let minDistance = 3;

    for (const d of COMMON_DOMAINS) {
        const distance = levenshteinDistance(lowerDomain, d);
        if (distance >= 1 && distance <= 2 && distance < minDistance) {
            minDistance = distance;
            bestMatch = d;
        }
    }

    return bestMatch ? `${local}@${bestMatch}` : null;
}

module.exports = { getDidYouMean };