var Request = require('request');
var FS = require('fs');
var Path = require('path');

var CurrencyConversion = function CurrencyConversion(config){
	'use strict';
	if (! config) {
		throw new Error("Configuration not supplied to CurrencyConversion");
		return null;
	}

	var self = this;

	this.currencyUpdateOpts  = {
		method: "GET",
		url: "https://openexchangerates.org/api/latest.json",
		qs: {
			app_id: "de0133e5996a48c29ff0fb6203a72fb0"
		}
	};

	this.updateCurrencies = function updateCurrencies(){
		this.currencies = [];
		for (var key in this.conversionTable.rates){
			this.currencies.push(key);
		}

		this.conversionTable.currencies = this.currencies;
	};

	this.updateConversionTable = function updateConversionTable(){
		var table = FS.readFileSync(Path.join(__dirname,'/lib/currencies.json'), 'utf8');
		self.conversionTable = JSON.parse(table);
		self.updateCurrencies();
		return self.conversionTable;
	}

	this.updateFile = function updateFile(callback){
		Request.get(self.currencyUpdateOpts,
			function (error, incomingMessage, responseBody) {
				FS.writeFileSync(Path.join(__dirname, '/lib/currencies.json'), responseBody);
				if (callback) {
					callback();
				}
			}
		);
	};

	this.convert = function convert(amount, from, to){
		if (from in self.conversionTable.rates && to in self.conversionTable.rates){
			// 12 gbp in euro
			// 12 gbp / 0.6 (gbp/usd) => results in usd
			// 12/0.6 usd * 0.9 (eur/usd) => results in euro
			// 12 gbp / 0.6 (gbp/usd) * 0.9 (eur/usd) = euros
			return amount / self.conversionTable.rates[from] * self.conversionTable.rates[to];
		}
	}

	this.conversionRate = function conversionRate(from, to){
		var base = self.conversionTable.base;
		return (self.conversionTable.rates[base] / self.conversionTable.rates[from]) * self.conversionTable.rates[to]
	}

	this.conversionTable = this.updateConversionTable();

	return this;
};

module.exports = CurrencyConversion;