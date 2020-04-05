const LGLBayernCoronaDataScraper = require('./src/LGLBayernCoronaDataScraper');

(async () => {
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

	console.log(returnJson);

} catch (err) {
	// TODO send errors to developer
	console.error(err);
}
})()