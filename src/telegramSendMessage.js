const SystemNotifier = require('system-notifier').default;

// add .env support during development
require('dotenv').config();

module.exports = function telegramSendMessage(msg, icon = 'error') {
	try {
		if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
			console.warn(`Telegram variables are not defined.`);
			return null;
		}

		const notifier = new SystemNotifier({
			prefix: 'corona-lgl-bayern-scraper',
			telegram: {
				botToken: process.env.TELEGRAM_BOT_TOKEN,
				chatId: process.env.TELEGRAM_CHAT_ID
			}
		});
		
		notifier.notify(msg, icon);
	} catch(err) {
		console.error(`ERROR sending telegram msg "${msg}": ${err}`);
	}
}