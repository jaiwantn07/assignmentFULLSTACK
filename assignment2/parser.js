

/**
 * @param {string} qrString 
 * @returns {string|null}
 */
function extractRollNumber(qrString) {
    if (!qrString) return null;

    const matches = qrString.match(/\b\d{6}\b/g);
    if (!matches) return null;

    const validRoll = matches.find(roll => isRegistered(roll));
    return validRoll || null;
}

/**
 
 * @param {string|number} rollNumber 
 * @returns {boolean}
 */
function isRegistered(rollNumber) {
    const num = Number(rollNumber);
    return num >= 240001 && num <= 240400;
}


if (require.main === module) {
    console.log('--- Testing parser.js Module ---');
    const mockQR = "IITK-STUDENT-240350-BPLUS";
    const extracted = extractRollNumber(mockQR);
    console.log(`Raw: "${mockQR}" -> Extracted: ${extracted} (Expected: 240350)`);
    console.log('Is 240350 registered?:', isRegistered('240350'));
    console.log('Is 250001 registered?:', isRegistered('250001'));
}

module.exports = { extractRollNumber, isRegistered };