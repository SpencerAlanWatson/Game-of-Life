var keyFunc = _.memoize(function (v) {
	return v;
}); //function(v) { return v; });
function point(x, y) {
	this.x = x;
	this.y = y;
}
Object.defineProperty(point.prototype, 'k', {
	get: function () {
		return self.x + "|" + self.y;
	}
});
point.prototype.toString = function () {
	return `${self.x}|${self.y}`;
};
point.prototype.valueOf = function () {
	return `${self.x}|${self.y}`;
};

function p(x, y) {
	if (typeof x === "string") {
		var points = x.split('|')
		return new point(Number(points[0]), Number(points[1]));
	}
	return new point(x, y);
}

function k(x, y) {
	return x + '|' + y;
}

function* neighborIterator(current) {
	var x = current.x,
		y = current.y,
		n00 = k(x - 1, y - 1),
		n01 = k(x - 1, y),
		n02 = k(x - 1, y + 1),
		n10 = k(x, y - 1),
		n12 = k(x, y + 1),
		n20 = k(x + 1, y - 1),
		n21 = k(x + 1, y),
		n22 = k(x + 1, y + 1);
	/*if (nodes.has(n00))*/
	yield n00;
	/*if (nodes.has(n01))*/
	yield n01;
	/*if (nodes.has(n02))*/
	yield n02;
	/*if (nodes.has(n10))*/
	yield n10;
	/*if (nodes.has(n12))*/
	yield n12;
	/*if (nodes.has(n20))*/
	yield n20;
	/*if (nodes.has(n21))*/
	yield n21;
	/*if (nodes.has(n22))*/
	yield n22;

}

function* neighborIteratorNew(current) {
	var x1 = current.x,
		y1 = current.y,
		x0 = x1 - 1,
		x2 = x1 + 1,
		y0 = y1 - 1,
		y2 = y + 1;

	yield `${x-1}|${y-1}`;
	yield `${x-1}|${y}`;
	yield `${x-1}|${y+1}`;
	yield `${x}|${y-1}`;
	yield `${x}|${y+1}`;
	yield `${x+1}|${y-1}`;
	yield `${x+1}|${y}`;
	yield `${x+1}|${y+1}`;
}

function* neighborIteratorNew2(current) {
	var x = current.x,
		y = current.y,
		x0 = x - 1,
		x2 = x + 1,
		y0 = y - 1,
		y2 = y + 1;


	yield x0 + '|' + y0;
	yield x0 + '|' + y;
	yield x0 + '|' + y2;
	yield x + '|' + y0;
	yield x + '|' + y2;
	yield x2 + '|' + y0;
	yield x2 + '|' + y;
	yield x2 + '|' + y2;
}

function calcTileValues(alive) {
	var tileValues = new Map();

	for (var atileK of alive) {
		var nIterator = neighborIteratorNew2(p(atileK));
		for (var key of nIterator) {
			/* if (!tileValues[x])
			            tileValues[x] = [];
			        tileValues[x][y] = tileValues[x][y] ? tileValues[x][y] + 1 : 1;*/
			tileValues.set(key, tileValues.has(key) ? tileValues.get(key) + 1 : 1);
		}
	}
	return tileValues;
}

function calcTileValuesNew(alive) {
		var tileValues = new Map();

		for (var atileK of alive) {
			//var nIterator = neighborIteratorNew2(p(atileK));
			var current = p(atileK),
				x = current.x,
				y = current.y,
				key = `${x-1}|${y-1}`;

			tileValues.set(key, tileValues.has(key) ? tileValues.get(key) + 1 : 1);
			key = `${x-1}|${y}`;
			tileValues.set(key, tileValues.has(key) ? tileValues.get(key) + 1 : 1);
			key = `${x-1}|${y+1}`;
			tileValues.set(key, tileValues.has(key) ? tileValues.get(key) + 1 : 1);
			key = `${x}|${y-1}`;
			tileValues.set(key, tileValues.has(key) ? tileValues.get(key) + 1 : 1);
			key = `${x}|${y+1}`;
			tileValues.set(key, tileValues.has(key) ? tileValues.get(key) + 1 : 1);
			key = `${x+1}|${y-1}`;
			tileValues.set(key, tileValues.has(key) ? tileValues.get(key) + 1 : 1);
			key = `${x+1}|${y}`;
			tileValues.set(key, tileValues.has(key) ? tileValues.get(key) + 1 : 1);
			key = `${x+1}|${y+1}`;
			tileValues.set(key, tileValues.has(key) ? tileValues.get(key) + 1 : 1);
		}
		return tileValues;
	}
	/*
	1. Any live cell with fewer than two live neighbours dies, as if caused by under-population.
	2. Any live cell with two or three live neighbours lives on to the next generation.
	3. Any live cell with more than three live neighbours dies, as if by overcrowding.
	4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
	*/
function lifeLoop(startAlive) {
	var self = this;
	self.alive = new Set(startAlive);

	self.gen = function* lifeTick() {
		while (true) {
			var tileValues = calcTileValuesNew(self.alive);
			for (var [key, value] of tileValues) {
				//console.log(key, value);
				if (value < 2 || value > 3) {
					self.alive.delete(key);
				} else if (value === 3) {
					self.alive.add(key);
				}
			}
			yield self.alive;
		}
	}();

}

function* lifeTick(startAlive) {
	console.log(this);
	var alive = new Set(startAlive);
	while (true) {
		console.log(this);
		var tileValues = calcTileValues(alive);
		for (var [key, value] of tileValues) {
			console.log(key, value);
			if (value < 2 || value > 3) {
				alive.delete(key);
			} else if (value === 3 && !alive.has(key)) {
				alive.add(key);
			}
		}
		yield [
            alive, tileValues
            ];
	}
}

function drawAlive(context, alive, width, height) {
	context.fillStyle = "#000000";

	context.beginPath();
	for (var tileK of alive) {
		var pos = p(tileK);
		context.rect(pos.x * width, pos.y * height, width, height);
	}
	context.fill();
};

function drawTileValues(context, tileValues, width, height) {
	context.font = "10px Helvetica";
	context.fillStyle = "black";
	context.strokeStyle = 'white';

	// setup these to match your needs
	context.miterLimit = 2;
	context.lineJoin = 'circle';



	context.beginPath();

	for (var [key, value] of tileValues) {
		var pos = p(key),
			x = pos.x * width,
			y = pos.y * height;
		// draw an outline, then filled
		context.lineWidth = 7;
		context.strokeText(value, x, y);
		context.lineWidth = 1;
		context.fillText(value, x, y);
	}
	//context.fill();
	//context.stroke();
};

function Graphics() {
	var self = this;
	self.drawBackground = function (context, width, height) {
		context.storkeStyle = "#000000";
		context.beginPath();
		for (var x = 0; x <= width; x += self.tileWidth) {
			context.moveTo(x, 0);
			context.lineTo(x, height);
		}
		for (var y = 0; y <= height; y += self.tileHeight) {
			context.moveTo(0, y);
			context.lineTo(width, y);
		}
		context.stroke();
	};
	self.createContext = function (width, height) {
		var canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		return canvas.getContext('2d');
	}
	self.setup = function (width, height, tileWidth, tileHeight) {
		self.width = width;
		self.height = height;
		self.tileWidth = tileWidth;
		self.tileHeight = tileHeight;

		self.canvasContext = self.createContext(width, height);

		self.canvas = self.canvasContext.canvas;
		document.getElementById('canvas-container').appendChild(self.canvas);

		self.backgroundContext = self.createContext(width, height);
		self.mainContext = self.createContext(width, height);

		self.drawBackground(self.backgroundContext, width, height);
		self.render();

	}
	self.startRenderLoop = function () {
		self.animId = requestAnimationFrame(self.renderLoop);
	}
	self.stopRenderLoop = function () {
		cancelAnimationFrame(self.animId);
	}
	self.renderLoop = function (timeStamp) {
		self.animId = requestAnimationFrame(self.renderLoop);
		self.render(timeStamp);
	}

	self.render = function (timeStamp) {
		//self.animId = requestAnimationFrame(self.render);
		--self.canvas.height;
		++self.canvas.height;
		self.canvasContext.drawImage(self.backgroundContext.canvas, 0, 0);
		self.canvasContext.drawImage(self.mainContext.canvas, 0, 0);
		--self.mainContext.canvas.height;
		++self.mainContext.canvas.height;
	}
}

function Controls(graphics, lifeGen) {
	var canvasOffsetX = 0,
		canvasOffsetY = 0,
		drawMode = true,
		isMouseDown = false;

	function calculateOffset(canvas) {
		canvasOffsetX = document.body.scrollLeft + document.documentElement.scrollLeft - canvas.offsetLeft;
		canvasOffsetY = document.body.scrollTop + document.documentElement.scrollTop - canvas.offsetTop;
	}

	function clickCoords(event) {
		return {
			x: event.clientX + canvasOffsetX,
			y: event.clientY + canvasOffsetY
		}
	}

	function mouseMoveDraw(event) {
		var coords = clickCoords(event),
			posKey = k(Math.floor(coords.x / graphics.tileWidth), Math.floor(coords.y / graphics.tileHeight));

		lifeGen.alive.add(posKey);
		drawAlive(graphics.mainContext, lifeGen.alive, graphics.tileWidth, graphics.tileHeight);
		graphics.render();

	}

	function mouseMoveErase(event) {
		var coords = clickCoords(event),
			posKey = k(Math.floor(coords.x / graphics.tileWidth), Math.floor(coords.y / graphics.tileHeight));

		lifeGen.alive.delete(posKey);
		drawAlive(graphics.mainContext, lifeGen.alive, graphics.tileWidth, graphics.tileHeight);
		graphics.render();
	}

	function mouseDown(event) {
		isMouseDone = true;
		calculateOffset(graphics.canvas);
		graphics.canvas.addEventListener('mouseout', mouseUp);

		if (drawMode) {
			graphics.canvas.addEventListener('mousemove', mouseMoveDraw);
			mouseMoveDraw(event);
		} else {
			graphics.canvas.addEventListener('mousemove', mouseMoveErase);
			mouseMoveErase(event);
		}

	}

	function mouseUp(event) {
		isMouseDown = false;
		if (drawMode)
			graphics.canvas.removeEventListener('mousemove', mouseMoveDraw);
		else
			graphics.canvas.removeEventListener('mousemove', mouseMoveErase);

		graphics.canvas.removeEventListener('mouseout', mouseUp);

		drawAlive(graphics.mainContext, lifeGen.alive, graphics.tileWidth, graphics.tileHeight);
		graphics.render();
	}

	var drawModeElem = document.getElementById('drawMode');

	function changeMode(event) {
		event.preventDefault();
		event.stopPropagation();
		drawMode = !drawMode;

		drawModeElem.innerHTML = drawMode.toString();

		return false;
	}

	graphics.canvas.addEventListener('mousedown', mouseDown);
	graphics.canvas.addEventListener('mouseup', mouseUp);

	document.addEventListener('keyup', function (event) {
		console.count('documentKeyUp');
		if (event.keyCode === 32 || event.keyCode === 67) {
			return changeMode(event);

		}
	});
}
var alive = new Set([k(1, 1), k(1, 2), k(1, 3)]);
var graphics = new Graphics();
graphics.setup(450, 450, 15, 15);
drawAlive(graphics.mainContext, alive, graphics.tileWidth, graphics.tileHeight);
graphics.render();

var lifeGen = new lifeLoop(alive);
Controls(graphics, lifeGen);

var delay = 100,
	running = false,
	timerID = 0;




function Run() {

	var {
		value
	} = lifeGen.gen.next();

	drawAlive(graphics.mainContext, value, graphics.tileWidth, graphics.tileHeight);
	graphics.render();

	//drawTileValues(graphics.mainContext, value[1], graphics.tileWidth, graphics.tileHeight);
	timerID = setTimeout(Run, delay);
}

function toggleRun() {
	if (running) {
		document.getElementById('running').innerHTML = "false";
		running = false;
		clearTimeout(timerID);
	} else {
				document.getElementById('running').innerHTML = "true";

		running = true;
		Run();
		//timerID = setTimeout(Run, delay);
	}
}

function clearAlive() {
	'use strict';
	lifeGen.alive = new Set();
	drawAlive(graphics.mainContext, lifeGen.alive, graphics.tileWidth, graphics.tileHeight);
	graphics.render();
}