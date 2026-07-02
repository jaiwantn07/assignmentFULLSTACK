const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'attendance.json');


function readStore() {
    try {
        if (!fs.existsSync(FILE_PATH)) {
            fs.writeFileSync(FILE_PATH, JSON.stringify({}), 'utf8');
            return {};
        }
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading attendance store:', error);
        return {};
    }
}


function writeStore(data) {
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing to attendance store:', error);
    }
}

/**
 * @param {string|number} rollNumber 
 * @returns {string} ISO timestamp of when they were marked present.
 */
function markPresent(rollNumber) {
    const store = readStore();
    const rollStr = String(rollNumber);


    if (store[rollStr]) {
        throw new Error(`Duplicate entry: Roll number ${rollStr} is already marked present.`);
    }

    
    const timestamp = new Date().toISOString();
    store[rollStr] = timestamp;
    
    writeStore(store);
    return timestamp;
}

/**
 * @returns {Object} { total: number, list: string[] }
 */
function getStats() {
    const store = readStore();
    const rollNumbers = Object.keys(store);
    
    return {
        total: rollNumbers.length,
        list: rollNumbers
    };
}


function getRawStore() {
    return readStore();
}


module.exports = {
    markPresent,
    getStats,
    getRawStore
};


if (require.main === module) {
    console.log('--- Testing attendance.js Module ---');
    
    
    if (fs.existsSync(FILE_PATH)) {
        fs.unlinkSync(FILE_PATH);
    }

    try {
        
        console.log('Testing markPresent for 240001...');
        const time1 = markPresent(240001);
        console.log(`✅ Success! Marked present at: ${time1}`);

       
        console.log('Testing markPresent for 240005...');
        markPresent('240005');
        console.log('✅ Success!');

        
        const stats = getStats();
        console.log('Testing getStats()...', stats);
        if (stats.total === 2 && stats.list.includes('240001')) {
            console.log('✅ Stats verification passed.');
        } else {
            console.log('❌ Stats verification failed.');
        }

        
        console.log('Testing duplicate handling for 240001...');
        markPresent(240001); 
        console.log('❌ Failed: Duplicate error was not thrown.');
    } catch (error) {
        if (error.message.includes('Duplicate entry')) {
            console.log(`✅ Success! Caught expected duplicate error: "${error.message}"`);
        } else {
            console.log('❌ Unexpected error occurred:', error);
        }
    }
}