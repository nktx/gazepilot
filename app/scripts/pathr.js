$(function() {

	var line = d3.svg.line()
			.x(function(d) {
				return d.X;
			})
			.y(function(d) {
				return d.Y;
			})
			.interpolate('basis');

	var svg = d3.select('#result-svg');

	function drawResult(result){
		result.forEach(function (data){
			
			var offsetX = data.startPosition.X - 320;
			var offsetY = data.startPosition.Y - 320;
			
			var translatedPath = data.path.map(function(p){
				return {
					X: p.X - offsetX,
					Y: p.Y - offsetY
				}
			});

			if (data.task == 'r') {
				svg.append('path')
				.attr({
					'd': line(translatedPath),
					'stroke': '#e74c3c',
					'stroke-width': '1px',
					'fill': 'none'
				});
			}

			if (data.task == 'g') {
				svg.append('path')
				.attr({
					'd': line(translatedPath),
					'stroke': '#2ecc71',
					'stroke-width': '1px',
					'fill': 'none'
				});
			}

			if (data.task == 'b') {
				svg.append('path')
				.attr({
					'd': line(translatedPath),
					'stroke': '#3498db',
					'stroke-width': '1px',
					'fill': 'none'
				});
			}

			if (data.task == 'y') {
				svg.append('path')
				.attr({
					'd': line(translatedPath),
					'stroke': '#f1c40f',
					'stroke-width': '1px',
					'fill': 'none'
				});
			}
			
		});
	}

	socket = io.connect();
	socket.emit('readfile');

	socket.on('filedata', function(data){
		console.log(data)
		drawResult(data);
	});

});