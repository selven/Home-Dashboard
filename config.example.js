var config = {
	users : {
		// can be lat/long or a station id
		person1 : '51.510971,-0.151877/to/51.474297,-0.093126',
		person2 : '51.510971,-0.151877/to/51.474297,-0.093126'
	},
	api_keys : {
		nation_rail : '',
		// you can use tfl without an api key, but there is a limit
		tfl : '',
		forecast_io : ''
	},
	trains : {
		start : 'HGR',
		end : 'CHX'
	},
	// weather lat/long
	weather : ''
};

module.exports = config;