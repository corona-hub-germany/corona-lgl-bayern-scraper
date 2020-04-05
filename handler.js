'use strict';

const LGLBayernCoronaDataScraper = require('./src/LGLBayernCoronaDataScraper');
const telegramSendMessage = require('./src/telegramSendMessage');

module.exports.getCoronaDataBaveria = async (event, context, callback) => {
	try {
		const scraper = new LGLBayernCoronaDataScraper();

		await scraper.loadPage();

		const srcUrl = scraper.getSourceUrl();
		const copyright = scraper.getCopyright();
		const lastUpdate = scraper.getLastUpdate();
		const data = scraper.getTableEntries();

		const returnJson = {
			srcUrl,
			copyright,
			lastUpdate,
			data
		}

		return {
			statusCode: 200,
			body: JSON.stringify(returnJson, null, 2),
		};

	} catch (err) {
		telegramSendMessage(`Error in getCoronaDataBaveria : ${err}`);
		return {
			statusCode: 500,
			body: JSON.stringify(err)
		};
	}
};
