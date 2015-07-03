# currency
A currency challenge using Kraken, Bower, Dust, Mocha, and Chai.

Installation of currency_module
===
    $cd Currency\ Convertor
    $npm install ../currency_module

Using currency_module
---
    var CurrencyConvertor = require('currency_conversion');
    var convertor = new CurrencyConvertor({});

the empty object is currently required, the idea being it is a placeholder for configuration options

Testing
===
currency_module
---
    $cd currency_module
    $npm run test

Currency Convertor
---
    $cd Currency\ Convertor
    $npm run unit

API
===
Unless otherwise noted, all inputs are required

If any required parameters are missing a json response with only an "error" property is returned and status is changed to 400.

/paypal/currencyConversion
---
### input:

*amount* - number, amount in currency to be converted

*from* - string, 3 letter code for currency to convert from

*to* - string, 3 letter code for currency to convert to

*gui* - (optional) boolean, whether or not a basic HTML UI should be shown (default=false)

### output:
A JSON object containing original amount, currency converted from, currency converted to, converted currency, and hash of currency to appropriate symbols

    {
      "amount": "42",
      "from": "INR",
      "to": "EUR",
      "converted": "0.60",
      "symbols": {
        "USD": "$",
        "EUR": "€",
        "CAD": "$",
        "CNY": "元",
        "INR": "₹"
      }
    }

/paypal/currencyRate
---
### input:

*from* - string, 3 letter code for currency to convert from

*to* - string, 3 letter code for currency to convert to

*gui* - (optional) boolean, whether or not a basic HTML UI should be shown (default=false)

### output:
A JSON object containing original amount, currency converted from, currency converted to, rate of exchange, and hash of currency to appropriate symbols

    {
      "from": "INR",
      "to": "EUR",
      "rate": 0.014221207430486993,
      "symbols": {
        "USD": "$",
        "EUR": "€",
        "CAD": "$",
        "CNY": "元",
        "INR": "₹"
      }
    }

/paypal/updateRates
---
### input:
**none**

### output:
A json object with a single property, fileDate, containing the human readable date the file was last updated (may not match date and time this endpoint is run)

    {
      "fileDate": "Thu Jul 02 2015 17:00:41 GMT-0700 (PDT)"
    }