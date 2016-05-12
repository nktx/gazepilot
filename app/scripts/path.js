var audio = new Audio('assets/pi.ogg');

Menu = function() {
	this.mode = false;

	this.open = function() {
		this.mode = true;
		this.positionX = x;
		this.positionY = y;

		$('#menu-block')
			.css('left', x-380)
			.css('top', y-380)
			.fadeIn();
	};
	
	this.close = function() {
		this.mode = false;
		$('#menu-block').fadeOut();
		$('.trigger-area').removeClass('triggered r g b y');
	};
};

Record = function(x, y, t) {
	this.interface = $('#task-interface').text();
	this.subject = $('#task-subject').val();
	this.task = t;
	this.result = '';
	this.duration = 0;
	this.path = [];
	this.startTime = Date.now();
	this.startPosition = {
		X: x,
		Y: y
	};

	$('.trigger--start').addClass('triggered ' + this.task);

	this.record = function(x, y) {
		this.path.push({
			X: x,
			Y: y
		})
	};
	
	this.end = function(r) {
		this.duration = Date.now() - this.startTime;
		this.result = r;

		$('#task-duration').text(this.duration);
		$('#task-result').text(this.result);

		if (this.task) {
			console.log(this);
			socket.emit('record', this);
		}
	};
};

$(function() {
	var allowed = true;
	var recordMode = false;
	var gestureRecord;

	var tasks = [
		'r', 'g', 'b', 'y',
		'r', 'g', 'b', 'y',
		'r', 'g', 'b', 'y',
		'r', 'g', 'b', 'y',
		'r', 'g', 'b', 'y'
	];
	tasks.sort(function(){return Math.round(Math.random());});

	socket = io.connect();
	menu = new Menu();
	$('#task-interface').text('FOLLOWPATH');

	$(document).keydown(function(event){

		// avoid keydown event repeated
		if (event.repeat != undefined) { allowed = !event.repeat; }
	  if (!allowed) return;
	  allowed = false;
		
		if (event.keyCode == 90) {
			if (recordMode){
				gestureRecord = new Record(x, y, tasks.pop());
			}
			menu.open();
		}

    if (event.keyCode == 82) {
			recordMode = !recordMode;
			$('#record-mode').text( recordMode ? 'ON' : 'OFF');
    }
	});

	$(document).keyup(function(event){
		allowed = true;

		if (event.keyCode == 90) {
			if (recordMode){
				var triggered = $('.triggered.trigger--end').attr('class');
				if (triggered) {
					gestureRecord.end(triggered[triggered.length - 1]);
				} else {
					gestureRecord.end('n');
				}
	    }
			menu.close();
		}
	});

	$(document).mousemove(function(e) {
    window.x = e.pageX;
    window.y = e.pageY;

    if (recordMode && menu.mode){
			gestureRecord.record(window.x, window.y);
    }
	});

	function mouseoverHandler() {
		return function () {
			var $this = $(this);

			if ($this.hasClass('trigger--top')) {
				$this.addClass('triggered r');
				audio.play();
			}

			if ($this.hasClass('trigger--right')) {
				$this.addClass('triggered g');
				audio.play();
			}

			if ($this.hasClass('trigger--bottom')) {
				$this.addClass('triggered b');
				audio.play();
			}

			if ($this.hasClass('trigger--left')) {
				$this.addClass('triggered y');
				audio.play();
			}

		};
	}

	function mouseleaveHandler() {
		return function () {
			var $this = $(this);	
			$this.removeClass('triggered r g b y');
			commitFlag = 0;
		};
	}

	$('.trigger--end').on('mouseover', mouseoverHandler());
	$('.trigger--end').on('mouseleave', mouseleaveHandler());

});