var chai = require('chai');
var chaiHttp = require('chai-http');
var CurrencyConvertor = require('../index');

chai.use(chaiHttp);
var should = chai.should();

var convertor;
describe("Currency Convertor", function(){
	describe("Instantiation", function(){
		it('Should instantiate without error with an empty object', function(itDone){
			convertor = new CurrencyConvertor({});
			should.exist(convertor);
			should.exist(convertor.conversionTable);
			itDone();
		});
	});
	describe("Conversion", function(){
		it('Should convert to/from same currency', function(itDone){
			var converted = convertor.convert(50, 'EUR','EUR');
			converted.should.be.a("number");
			converted.should.equal(50);
			itDone();
		});
		it('Should convert to different currencies', function(itDone){
			var amount = (42).toFixed(2);
			var euro = convertor.convert(amount, 'USD', 'EUR').toFixed(2);
			var calc = (amount / convertor.conversionTable.rates['USD'] * convertor.conversionTable.rates['EUR']).toFixed(2);
			euro.should.equal(calc);
			itDone();
		});
	});
	describe("Rates", function(){
		it('Should give rate from one currency to another', function(itDone){
			var eurTOcny = convertor.conversionRate('EUR','CNY').toFixed(2);
			var rate = ((1 / convertor.conversionTable.rates['EUR']) * convertor.conversionTable.rates['CNY']).toFixed(2);
			eurTOcny.should.equal(rate);
			itDone();
		});
	});
});
