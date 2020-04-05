const fs = require('fs-extra');
const axios = require('axios').default;
const cheerio = require('cheerio');
const moment = require('moment');

module.exports = class LGLBayernCoronaDataScraper {

	constructor(options) {
		this.options = Object.assign({
			url: 'https://www.lgl.bayern.de/gesundheit/infektionsschutz/infektionskrankheiten_a_z/coronavirus/karte_coronavirus/index.htm',
			useFileCache: false
		}, options );
	}

	_getFromStringByRegex(string, regexp) {
		const found = [...string.matchAll(regexp)];
		if (found && found[0]) {
			const data = found[0][1] || null;
			return data || null;
		} else {
			return null;
		}
	}

	_getNumberFromString(string) {
		const cleanString = string
			.replace('.','')
			.replace(',','.')
			.replace(/[()]/g,'')
			.replace(' ', '')
			.replace('-', '0');
		const number = Number(cleanString);
		return number;
	}

	async loadPage() {
		const CACHE_FILE = './.cache.html';

		var htmlContent = '';
		if (this.options.useFileCache && fs.existsSync(CACHE_FILE)) {
			htmlContent = await fs.readFile(CACHE_FILE);
		} else {
			try {
				var response = await axios.get(this.options.url, {});
				htmlContent = response.data;
			} catch(err) {
				throw new Error(`Error requesting remote url "${this.options.url}": ${err}`);
			}

			if (this.options.useFileCache) {
				await fs.writeFile(CACHE_FILE, htmlContent);
			}
		}

		try {
			this.$ = cheerio.load(htmlContent);
		} catch(err) {
			throw new Error(`Error parsing html content with cheerio: ${err}`);
		}
	}

	getSourceUrl() {
		return this.options.url;
	}

	getCopyright(options) {
		const opts = Object.assign({
			textSepector: '#seitenabschlusstxt'
		}, options);
		
		const text = this.$(opts.textSepector).text();
		if (!text || !text.length) {
			throw new Error(`Could not find selector "${opts.textSepector}" in html document`);
		}

		return text;
	}

	getLastUpdate(options) {
		const opts = Object.assign({
			captionSepector: '#content_1c > div.abstand_unten > div > table > caption',
			parseRegex: /Stand:\s?(\d*\.\d*\.\d*, \d*:\d*)\s?Uhr\s?/g,
			dateTimeFormat: 'DD.MM.YYYYY, HH:mm'
		}, options);
		
		const caption = this.$(opts.captionSepector).text();
		if (!caption || !caption.length) {
			throw new Error(`Could not find selector "${opts.captionSepector}" in html document`);
		}

		const dateString = this._getFromStringByRegex(caption, opts.parseRegex);
		if (!dateString || !dateString.length) {
			throw new Error(`Could not find datestring "${opts.parseRegex}" in "${caption}"`);
		}

		const dateTime = moment(dateString, opts.dateTimeFormat);
		if (!dateTime.isValid()) {
			throw new Error(`Could not parse date-time from "${dateString}" using format "${opts.dateTimeFormat}"`);
		}

		return dateTime.toISOString();
	}

	/*
	 * <tr>
	 * 	<td>Aichach-Friedberg</td> // Landkreis/Stadt
	 * 	<td>164</td> // Anzahl der Fälle
	 * 	<td>(+ 10)</td> // Fälle Änderung zum Vortag
	 * 	<td>1.022,76</td> // Fallzahl pro 100.000 Einwohner
	 * 	<td>50,90</td> // 7-Tage-Inzidenz pro 100.000 Einwohner
	 * 	<td>3</td> // Anzahl der Todesfälle
	 * 	<td>-</td> // Todesfälle* Änderung zum Vortag
	 * </tr>
	*/
	getTableEntries() {
		const $rows = this.$('#content_1c > div.abstand_unten > div > table > tbody > tr');

		const rowCount = $rows.length;
		if (rowCount < 95) {
			throw new Error(`Invalid row count "${rowCount}" expected ">= 95"`);
		}

		var data = []
		$rows.each((index, element) => {
			const tds = this.$(element).find('td');

			const name = this.$(tds[0]).text();

			if (name === 'Gesamtergebnis' || name === '') {
				return;
			}

			const columnCount = tds.length;
			if (columnCount !== 7) {
				throw new Error(`Invalid column count "${columnCount}" expected "7"`);
			}

			const infected = this.$(tds[1]).text();
			const infected_new = this.$(tds[2]).text();
			const infected_100k = this.$(tds[3]).text();
			const infected_indicator_100k = this.$(tds[4]).text();
			const deaths = this.$(tds[5]).text();
			const deaths_new = this.$(tds[6]).text();

			const entry = {
				name,
				infected: this._getNumberFromString(infected),
				infected_new: this._getNumberFromString(infected_new),
				infected_100k: this._getNumberFromString(infected_100k),
				infected_indicator_100k: this._getNumberFromString(infected_indicator_100k),
				deaths: this._getNumberFromString(deaths),
				deaths_new: this._getNumberFromString(deaths_new)
			};
			data.push(entry);
		});

		return data;
	}

}