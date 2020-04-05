# corona-lgl-bayern-scraper

Scrape corona case-data from the [lgl.bayern.de website](https://www.lgl.bayern.de/gesundheit/infektionsschutz/infektionskrankheiten_a_z/coronavirus/karte_coronavirus/index.htm)

## Serverless

You can depoy a serverless function:

```sh
serverless deploy
```

Here is an example endpoint you can use:

https://9gqwiyjoha.execute-api.eu-central-1.amazonaws.com/dev/getCoronaDataBaveria

## API Example

```js
const LGLBayernCoronaDataScraper = require('corona-lgl-bayern-scraper');
	
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
```

Output:
```js
{
	srcUrl: 'https://www.lgl.bayern.de/gesundheit/infektionsschutz/infektionskrankheiten_a_z/coronavirus/karte_coronavirus/index.htm',
	copyright: '© Bayerisches Landesamt für Gesundheit und Lebensmittelsicherheit 2020',
	lastUpdate: '2020-04-04T08:00:00.000Z',
	data: [
		{
			name: 'Aichach-Friedberg',
			infected: 164,
			infected_new: 10,
			infected_100k: 122.76,
			infected_indicator_100k: 50.9,
			deaths: 3,
			deaths_new: 0
		}
		...
	]
}
```