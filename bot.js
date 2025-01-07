const TelegramBot = require('node-telegram-bot-api');

// Bot tokeni va admin guruhining chat ID'si
const token = '7693636466:AAEVT3HgOLTig4C9KKXzD-1FyIEeZjhu7xQ';
const adminGroupId = '-1002398646128';

const bot = new TelegramBot(token, { polling: true });

let userData = {};

// Start komandasi
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    userData[chatId] = { step: 'phone' };

    bot.sendMessage(chatId, "Iltimos, telefon raqamingizni kiriting:");
});

// Ma'lumotlarni yig'ish
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    if (!userData[chatId]) return;

    const step = userData[chatId].step;

    if (step === 'phone') {
        userData[chatId].phone = msg.text;
        userData[chatId].step = 'name';
        bot.sendMessage(chatId, "Iltimos, ismingizni kiriting:");
    } else if (step === 'name') {
        userData[chatId].name = msg.text;
        userData[chatId].step = 'lastName';
        bot.sendMessage(chatId, "Iltimos, familiyangizni kiriting:");
    } else if (step === 'lastName') {
        userData[chatId].lastName = msg.text;
        userData[chatId].step = 'district';
        bot.sendMessage(chatId, "Iltimos, mahallangizni kiriting:");
    } else if (step === 'district') {
        userData[chatId].district = msg.text;
        const userInfo = `
            Ism: ${userData[chatId].name}
            Familiya: ${userData[chatId].lastName}
            Mahalla: ${userData[chatId].district}
            Telefon raqam: ${userData[chatId].phone}
        `;

        bot.sendMessage(chatId, "Siz ro'yxatdan o'tdingiz. Rahmat!");

        // Admin guruhiga xabar yuborish
        bot.sendMessage(adminGroupId, `Yangi foydalanuvchi ro'yxatdan o'tdi:\n${userInfo}`);

        // Foydalanuvchi ma'lumotlarini tozalash
        delete userData[chatId];
    }
});

// Polling errorlarni qayta ishlash
bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});
