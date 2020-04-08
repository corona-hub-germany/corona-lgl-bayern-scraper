# corona-lgl-bayern-scraper

Scrape corona case-data from the [lgl.bayern.de website](https://www.lgl.bayern.de/gesundheit/infektionsschutz/infektionskrankheiten_a_z/coronavirus/karte_coronavirus/index.htm)

## Serverless

You can depoy a serverless function:

```sh
serverless deploy
```

You'll need to set a few environment-variables to recieve error messages from the telegram corona-serverless-error-bot:

* TELEGRAM_BOT_TOKEN
* TELEGRAM_CHAT_ID

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
"srcUrl": "https://www.lgl.bayern.de/gesundheit/infektionsschutz/infektionskrankheiten_a_z/coronavirus/karte_coronavirus/index.htm",
  "copyright": [
    "© Bayerisches Landesamt für Gesundheit und Lebensmittelsicherheit 2020",
    "© Statistisches Bundesamt (Destatis)"
  ],
  "lastUpdate": "2020-04-07T08:00:00.000Z",
  "data": [
    {
      "name_org": "Aichach-Friedberg",
      "name": "Aichach-Friedberg",
      "type": "Landkreis",
      "ags": "09771",
      "area_km2": 780.23,
      "population": 133596,
      "population_male": 66651,
      "population_female": 66945,
      "population_per_km2": 171,
      "infected": 189,
      "infected_new": 15,
      "infected_100k": 141.47,
      "infected_indicator_100k": 51.65,
      "deaths": 5,
      "deaths_new": 0
    },
		...
	]
}
```