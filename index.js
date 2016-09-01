var async = require('async');
var request = require('request');
var express = require('express');
var app = express();
var config = require('./config');

app.use(express.static('public'));
app.set('view engine', 'pug');

app.get('/', function (req, res) {
	res.render('index');
});

app.get('/status', function (req, res) {
	request('https://api.tfl.gov.uk/line/mode/tube,overground,dlr,tflrail/status', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			body = JSON.parse(body);
			res.send(body);
		}
	});
});

app.get('/weather', function (req, res) {
	request('https://api.forecast.io/forecast/172a8d5f40ecd870c484634ca9d66ba2/51.5100974,-0.1367674', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var weather = {};
			body = JSON.parse(body);
			weather.currently = body.currently;
			weather.hourly = body.hourly;
			res.send(weather);
		}
	});
});

app.get('/travel-time', function (req, res) {
	async.map(config.users, function(person, callback) {
		request('https://api.tfl.gov.uk/journey/journeyresults/' + person, function(error, response, body) {
			body = JSON.parse(body);
			callback(error, body.journeys[0].duration);
		});
	}, function(err, results) {
		var send = {};
		var i = 0;
		for (var person in config.users) {
			// add 2 minutes walking time
			send[person] = results[i] + 2;
			i++;
		}
		res.send(send);
	});
});

app.get('/next-trains', function (req, res) {
	request('https://huxley.apphb.com/departures/'+config.trains.start+'/to/'+config.trains.end+'/3?accessToken='+config.api_keys.nation_rail, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			body = JSON.parse(body);
			res.send(body);
		}
	});
});

app.listen(3000, function () {
	console.log('Running home dashboard on port 3000!');
});