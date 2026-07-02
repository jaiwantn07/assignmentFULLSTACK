const Jimp = require('jimp');
const jsQR = require('jsqr');

/**
 * Decodes a QR code from a given local image path.
 * @param {string} imagePath 
 * @returns {Promise<string>} The decoded string data.
 */
async function decodeQR(imagePath) {
    // P1a: Load image with Jimp.read() and extract bitmap properties
    const image = await Jimp.read(imagePath);
    const { data, width, height } = image.bitmap;

    // P1b: Pass pixel data to jsqr()
    const code = jsQR(data, width, height);

    if (!code) {
        throw new Error('No QR code found');
    }

    return code.data;
}

// P1c: Standalone test guard
if (require.main === module) {
    (async () => {
        console.log('--- Testing qr.js Module ---');
        try {
            // Replace with a local test image path if testing manually
            const result = await decodeQR('./test_qr.png');
            console.log('✅ Decoded Data:', result);
        } catch (error) {
            console.error('❌ Error during test:', error.message);
        }
    })();
}

module.exports = { decodeQR };