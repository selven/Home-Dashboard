var main = {
	lines : $('#lines'),
	weather : $('#weather'),
	skycons : new Skycons({"color": "white"}),
	first : true,
	
	intervals : {
		get_status : 30000,
		get_weather : 30000,
		get_travel_time : 30000,
		get_next_train : 30000,
		update_time : 1000
	},
	
	events : function() {
		$('#lines').on('click', 'li', function() {
			$('#lines').toggleClass('open');
		});
	},
	
	format_text : function(text) {
		return text.split(' ').join('_').split('&').join('and').toLowerCase();
	},
	
	line_template : function(lines) {
		var self = this;
		this.lines.empty();
		$.each(lines, function(key, value) {
			var id = self.format_text(value.name);
			var status = self.format_text(value.lineStatuses[0].statusSeverityDescription);
			self.lines.append('<li id="' + id + '" class="' + status + '">' + value.name + '<span class="icon"></span></li>');
		});
	},

	get_status : function() {
		var self = this;
		$.get('status', function(result) {
			self.line_template(result);
		});
	},
	
	fahrenheit_to_celsius : function(fahrenheit) {
		//Deduct 32, then multiply by 5, then divide by 9
		var celsius = Math.round(((fahrenheit - 32) * 5) / 9);
		return celsius;
	},
	
	blue_percentage : function(percent) {
		var blue = 255 * (percent / 100);
		return blue;
	}, 
	
	get_weather : function() {
		var self = this;
		$.get('weather', function(result) {
			$('#middle .weather').html(self.fahrenheit_to_celsius(result.currently.temperature) + '&deg;');
			var i = 0;
			$.each(result.hourly.data, function(key, value) {
				console.log(value);
				if(i < 12) {
					if(self.first) {
						self.first = false;
						self.skycons.add('weather' + i, value.icon);
					} else {
						self.skycons.set('weather' + i, value.icon);
					}
					
					var parent = $('#weather li').eq(i);
					parent.find('.time').text(moment(value.time, 'X').format('H') + ':00');
					parent.find('.temperature').html(self.fahrenheit_to_celsius(value.temperature) + '&deg;');
					parent.find('.rain').animate({
						height: value.precipProbability * 100 + '%'
					});
					
					i++;
				}
			});
			self.skycons.play();
		});
	},
	
	get_next_train : function() {
		$.get('next-trains', function(result) {
			$('#next-trains').empty();
			$.each(result.trainServices, function(key, value) {
				var platform = '';
				if(value.platform) {
					platform = '<span class="platform">' + value.platform + '</span>';
				}
				var startTime = moment();
				var endTime = moment(value.std, 'hh:mm');
				var remaining = endTime.diff(startTime, 'minutes');
				remaining = (remaining < 0) ? 0 : remaining;
				$('#next-trains').append('<li><span class="time">' + value.std + '</span><span class="remaining">' + remaining + '<span>m</span></span>' + platform + '</li>');
			});
		});
	},
	
	get_travel_time : function() {
		$.get('travel-time', function(result) {
			$('#travel-time').empty();
			$.each(result, function(key, value) {
				$('#travel-time').append('<li>' + key + ' ' + value + '</li>');
			});
		});
	},
	
	update_time : function() {
		$('#middle .time').text(moment().format('H:mm'));
		$('#middle .date').text(moment().format('Do MMMM YYYY'));
	},
	
	run_intervals : function() {
		var self = this;
		$.each(this.intervals, function(key, value) {
			self[key]();
			setInterval(function() {
				self[key]();
			}, value)
		});
	},
	
	init : function() {
		this.events();
		this.run_intervals();
	}
};

main.init();