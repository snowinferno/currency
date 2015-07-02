var chai = require('chai');
var chaiHttp = require('chai-http');
var express = require('express');
var kraken = require('kraken-js');

chai.use(chaiHttp);
var should = chai.should();

describe('Routes', function(){
    before(function (done) {
        app = express();
        app.on('start', done);
        app.use(kraken({
            basedir: process.cwd()
        }));

        mock = app.listen(1337);
    });

    describe('/paypal/currencyConversion', function(){
		it('should return json with conversion from one currency to another.',
			function(itDone){
				chai.request(app).get('/paypal/currencyConversion?amount=42&from=CNY&to=EUR')
				.end(function(error, response){
					should.not.exist(error);
					response.should.be.an("object");
					response.body.should.be.an("object");
					response.should.have.status(200);
					response.body.should.not.have.property('error');
					response.body.should.have.property('from');
					response.body.should.have.property('to');
					response.body.should.have.property('amount');
					response.body.should.have.property('converted');
					response.body.should.have.property('symbols');
					itDone();
				});
			}
		);
		it('should return json with an error for missing amount',
			function(itDone){
				chai.request(app).get('/paypal/currencyConversion?from=USD&to=CAD')
				.end(function(error, response){
					response.should.have.status(400);
					response.body.should.have.property('error');
					itDone();
				});
			}
		);
		it('should return json with an error for missing from',
			function(itDone){
				chai.request(app).get('/paypal/currencyConversion?amount=42&to=CAD')
				.end(function(error, response){
					response.should.have.status(400);
					response.body.should.have.property('error');
					itDone();
				});
			}
		);
		it('should return json with an error for missing to',
			function(itDone){
				chai.request(app).get('/paypal/currencyConversion?from=USD&amount=42')
				.end(function(error, response){
					response.should.have.status(400);
					response.body.should.have.property('error');
					itDone();
				});
			}
		);
    });

    describe('/paypal/currencyRate', function(){
    	it('should return json with the rate to convert from one currency to another',
    		function(itDone){
    			chai.request(app).get('/paypal/currencyRate?from=INR&to=USD')
    			.end(function(error, response){
    				should.not.exist(error);
    				response.should.be.an("object");
    				response.body.should.be.an("object");
    				response.should.have.status(200);
    				response.body.should.not.have.property('error');
    				response.body.should.have.property('from');
    				response.body.should.have.property('to');
    				response.body.should.have.property('symbols');
    				response.body.should.have.property('rate');
    				itDone();
    			});
    		}
    	);
    	it('should return json with an error for missing from',
    		function(itDone){
    			chai.request(app).get('/paypal/currencyRate?to=USD')
    			.end(function(error, response){
    				should.not.exist(error);
    				response.body.should.have.property('error');
    				itDone();
    			});
    		}
    	);
    	it('should return json with an error for missing to',
    		function(itDone){
    			chai.request(app).get('/paypal/currencyRate?from=INR')
    			.end(function(error, response){
    				should.not.exist(error);
    				response.body.should.have.property('error');
    				itDone();
    			});
    		}
    	);
    });
});