var Convertor = require('currency_conversion');

var CurrencyModule = function CurrencyModule(router) {
	'use strict';
	var convertor = new Convertor({});

	router.get('/updateRates', function(request, response){
		convertor.updateFile(function(){convertor.updateConversionTable();});
		response.redirect('/paypal/currencyRate');
	});

	router.get('/activity', function(request, response){
		var data = {
			symbols: request.app.kraken.get("currencySymbols")
		};
		var transactions = request.app.kraken.get("transactions");
		data.transactions = transactions;
		response.render('paypal/activity', data);
	});

	router.get('/currencyConversion', function(request, response){
		var amount, from, to, gui;
		if (request.query){
			amount = request.query.amount;
			from = request.query.from;
			to = request.query.to;
			gui = request.query.gui;
		}

		var converted = convertor.convert(amount, from, to);

		var data = {
			amount: amount,
			from: from,
			to: to,
			converted: converted.toFixed(2),
			symbols: request.app.kraken.get("currencySymbols")
		};
		if (!gui){
			if (!amount || !from || !to){
				data = {
					error: "Missing required information. " +
							"You must include amount to convert, currency to convert from and currency to convert to."
				};
				response.status(400);
			}
			response.json(data);
		} else {
			var currencies = request.app.kraken.get('currencies');
			var symbols = request.app.kraken.get('currencySymbols');
			data.currencies = [];
			for (var i = 0; i < convertor.currencies.length; i++) {
				if (currencies.indexOf(convertor.currencies[i]) > 0) {
					var code = convertor.currencies[i];
					data.currencies.push({code: code, symbol: symbols[code]});
				}
			}
			response.render('paypal/conversion', data);
		}
	});

	router.get('/currencyRate', function(request, response){
		console.dir(request.query);
		var from, to, gui;
		if (request.query){
			from = request.query.from;
			to = request.query.to;
			gui = request.query.gui
		}

		var data = {
			from: from,
			to: to,
			rate: convertor.conversionRate(from, to),
			symbols: request.app.kraken.get("currencySymbols")
		};
		if (!gui){
			if (!from || !to){
				data = {
					error: "Missing required information. " +
							"You must include the currency you are converting from and the currency you are converting to."
				};
				response.status(400);
			}
			response.json(data);
		} else {
			var currencies = request.app.kraken.get('currencies');
			var symbols = request.app.kraken.get('currencySymbols');
			data.currencies = [];
			for (var i = 0; i < convertor.currencies.length; i++) {
				if (currencies.indexOf(convertor.currencies[i]) > 0) {
					var code = convertor.currencies[i];
					data.currencies.push({code: code, symbol: symbols[code]});
				}
			}
			response.render('paypal/rates', data);
		}
	});
};

module.exports = CurrencyModule;