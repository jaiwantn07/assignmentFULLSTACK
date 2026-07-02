
require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const os = require('os');


const { decodeQR } = require('./qr');
const { extractRollNumber, isRegistered } = require('./parser');
const { markPresent, getStats, getRawStore } = require('./attendance');

const token = process.env.BOT_TOKEN;
if (!token) {
    console.error('Error: BOT_TOKEN is missing in your environment config.');
    process.exit(1);
}


const bot = new TelegramBot(token, { polling: true });
console.log('🤖 Telegram Attendance Bot is up and running...');


bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Welcome! Please send a clear photo of a student\'s IITK ID card QR code to log their attendance.');
});


bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    let localFilePath = '';

    try {
        
        const photo = msg.photo[msg.photo.length - 1];
        const fileId = photo.file_id;

        
        const tempDir = os.tmpdir();
        localFilePath = path.join(tempDir, `${fileId}.jpg`);

        
        await bot.downloadFile(fileId, tempDir);
       
        const expectedDownloadedPath = path.join(tempDir, fileId);
        if (fs.existsSync(expectedDownloadedPath) && !fs.existsSync(localFilePath)) {
            fs.renameSync(expectedDownloadedPath, localFilePath);
        }

        
        const qrData = await decodeQR(localFilePath);
        const rollNumber = extractRollNumber(qrData);

        if (!rollNumber) {
            return bot.sendMessage(chatId, '❌ Error: Could not extract a valid 6-digit roll number sequence from the QR code.');
        }

        if (!isRegistered(rollNumber)) {
            return bot.sendMessage(chatId, `❌ Error: Roll number ${rollNumber} is out of the registered range (240001–240400).`);
        }

        const timestamp = markPresent(rollNumber);
        const localTime = new Date(timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        
        bot.sendMessage(chatId, `✅ Marked Present!\nRoll Number: ${rollNumber}\nTime: ${localTime}`);

    } catch (error) {
       
        if (error.message.includes('No QR code found')) {
            bot.sendMessage(chatId, '❌ Error: No QR code could be detected in this image. Please make sure it is clear and well-lit.');
        } else if (error.message.includes('Duplicate entry')) {
            
            try {
                const store = getRawStore();
                const rollStr = error.message.match(/\d{6}/)[0];
                const originalTime = new Date(store[rollStr]).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
                bot.sendMessage(chatId, `⚠️ Already Marked!\nRoll number ${rollStr} was already submitted earlier at: ${originalTime}`);
            } catch {
                bot.sendMessage(chatId, `⚠️ ${error.message}`);
            }
        } else {
            console.error(error);
            bot.sendMessage(chatId, '❌ An unexpected processing error occurred. Please try again.');
        }
    } finally {
    
        if (localFilePath && fs.existsSync(localFilePath)) {
            try { fs.unlinkSync(localFilePath); } catch (e) {}
        }
    }
});


bot.onText(/\/report/, (msg) => {
    const stats = getStats();
    if (stats.total === 0) {
        return bot.sendMessage(msg.chat.id, '📊 Attendance Summary:\nNo students marked present yet.');
    }

    const reportMessage = `📊 *Attendance Summary*\n*Total Present:* ${stats.total}\n\n*Roll Numbers List:*\n${stats.list.map(r => `• ${r}`).join('\n')}`;
    bot.sendMessage(msg.chat.id, reportMessage, { parse_mode: 'Markdown' });
});


bot.onText(/\/export/, async (msg) => {
    const chatId = msg.chat.id;
    const store = getRawStore();
    const records = Object.entries(store);

    if (records.length === 0) {
        return bot.sendMessage(chatId, '❌ There are no attendance records to export yet.');
    }

    try {
        
        const header = 'RollNumber,Timestamp\n';
        const rows = records.map(([roll, time]) => `${roll},${time}`).join('\n');
        const csvContent = header + rows;

        
        const tempCsvPath = path.join(os.tmpdir(), `attendance_export_${Date.now()}.csv`);
        fs.writeFileSync(tempCsvPath, csvContent, 'utf8');

        await bot.sendDocument(chatId, tempCsvPath, {}, {
            filename: 'attendance_report.csv',
            contentType: 'text/csv'
        });

        fs.unlinkSync(tempCsvPath);
    } catch (error) {
        console.error('Export Error:', error);
        bot.sendMessage(chatId, '❌ Failed to generate or send the CSV export file.');
    }
});