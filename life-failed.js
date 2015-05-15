var keyFunc = _.memoize(function (v) {
    return v;
}); //function(v) { return v; });
function point(x, y) {
    var self = this;
    self.x = x;
    self.y = y;
    Object.defineProperty(self, 'k', {
        get: function () {
            return self.x + "|" + self.y;
        }
    });
    self.toString = function () {
        return `${self.x}|${self.y}`;
    };
    self.valueOf = function () {
        return `${self.x}|${self.y}`;
    };
}

function p(x, y) {
    if (typeof x === "string") {
        var points = x.split('|', 2)
        return new point(Number(points[0]), Number(points[1]));
    }
    return new point(x, y);
}

function * neighborIterator(current) {
    var x = current.x,
        y = current.y,
        n00 = p(x - 1, y - 1).k,
        n01 = p(x - 1, y).k,
        n02 = p(x - 1, y + 1).k,
        n10 = p(x, y - 1).k,
        n12 = p(x, y + 1).k,
        n20 = p(x + 1, y - 1).k,
        n21 = p(x + 1, y).k,
        n22 = p(x + 1, y + 1).k;
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

function calcTileValues(alive) {
    var tileValues = new Map();

    for (var atileK of alive) {
        var nIterator = neighborIterator(p(atileK));
        for (var key of nIterator) {
            /* if (!tileValues[x])
                        tileValues[x] = [];
                    tileValues[x][y] = tileValues[x][y] ? tileValues[x][y] + 1 : 1;*/
            tileValues.set(key, tileValues.has(key) ? tileValues.get(key) + 1 : 1);
        }
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

    self.gen = function * lifeTick() {
        while (true) {
            var tileValues = calcTileValues(self.alive),
                changed = new Map();

            for (var [key, value] of tileValues) {
                console.log(key, value);
                if (self.alive.has(key)) {
                    if (value < 2 || value > 3) {
                        self.alive.delete(key);
                        changed.set(key, false);
                    }
                } else {
                    if (value === 3) {
                        self.alive.add(key);
                        changed.set(key, true);

                    }
                }
            }
            yield[
                self.alive, changed, tileValues
                ];
        }
    }();

}

function * lifeTick(startAlive) {
    console.log(this);
    var alive = new Set(startAlive);
    while (true) {
        console.log(this);
        var tileValues = calcTileValues(alive);
        for (var [key, value] of tileValues) {
            console.log(key, value);
            if (alive.has(key)) {
                if (value < 2 || value > 3) {
                    alive.delete(key);
                }
            } else {
                if (value === 3) {
                    alive.add(key);
                }
            }
        }
        yield[
            alive, tileValues
            ];
    }
}

function drawAlive(context, alive, width, height) {
    /*context.fillStyle = "#000000";

    context.beginPath();
    for (var tileK of alive) {
        var pos = p(tileK);
        context.rect(pos.x * width, pos.y * height, width, height);
    }
    context.fill();*/
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
    self.drawAlive = function (layer, alive) {
        layer.clearCache();
        layer.children.forEach(function (tile) {

            if (alive.has(p(self.topLeft.x + tile.column, self.topLeft.y + tile.row).k)) {
                tile.setFill('lightgreen');
            } else {
                tile.setFill('white');
            }

        });
        layer.cache();
    };
    self.drawChanged = function (layer, changed) {

        var minX = self.topLeft.x,
            minY = self.topLeft.y,
            maxX = minX + self.columnLength,
            maxY = minY + self.rowLength;
        changed.forEach(function (isAlive, posK, list) {
            var pos = p(posK);
            if (pos.x >= minX && pos.y >= minY && pos.x <= maxX && pos.y <= maxY) {
                var tile = layer.find("#" + posK);
                tile.clearCache();
                if (isAlive) {
                    tile.setFill('lightgreen');
                    tile.fillEnabled(true);
                                        tile.visible(true);

                } else {
                    tile.fillEnabled(false);
                    tile.visible(false);
                    //tile.setFill('white');
                }
            }
        });

    };
    self.createScreenTiles = function (layer) {
        for (let x = 0, xPos = 0; x < self.columnLength; ++x, xPos += self.tileWidth) {
            for (let y = 0, yPos = 0; y < self.rowLength; ++y, yPos += self.tileHeight) {
                let tile = new Kinetic.Rect({
                    x: xPos,
                    y: yPos,
                    width: self.tileWidth,
                    height: self.tileHeight,
                    fill: 'white',
                    stroke: 'black',
                    strokeWidth: 1,
                    fillEnabled: false,
                    visible: false,
                    name: 'Tile',
                    id: p(x, y).k
                });
                tile.row = y;
                tile.column = x;
                /*tile.on('mouseout', function (event) {
                    console.log("Tile mouseout", event, this);
                });*/
                layer.add(tile);


            }
        }


    };
    self.createContext = function (width, height) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas.getContext('2d');
    };
    self.setup = function (width, height, tileWidth, tileHeight) {
        self.stage = new Kinetic.Stage({
            container: 'canvas-container',
            width: width,
            height: height
        });
        self.layer = new Kinetic.FastLayer({});

        self.tileWidth = tileWidth;
        self.tileHeight = tileHeight;

        self.topLeft = p(0, 0);
        self.columnLength = width / tileWidth;
        self.rowLength = height / tileHeight;

        self.createScreenTiles(self.layer);

        self.stage.add(self.layer);

        /*self.canvas = self.layer.canvas._canvas;
        document.getElementById('canvas-container').appendChild(self.canvas);
        self.canvasContext = self.layer.canvas.context._context;

        self.backgroundContext = self.createContext(width, height);
        self.mainContext = self.createContext(width, height);

        self.drawBackground(self.backgroundContext, width, height);*/
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
        self.stage.drawScene();

    }
    self.render = function (timeStamp) {
        //self.animId = requestAnimationFrame(self.render);
        /*--self.canvas.height;
        ++self.canvas.height;
        self.canvasContext.drawImage(self.backgroundContext.canvas, 0, 0);
        self.canvasContext.drawImage(self.mainContext.canvas, 0, 0);
        --self.mainContext.canvas.height;
        ++self.mainContext.canvas.height;*/
        self.stage.drawScene();
    }
}

function setupControls(layer, lifeGen) {
    var draw = true;

    function layerMouseMove(event) {
        console.count('layerMouseMove');
        if (draw) {
            lifeGen.alive.add(event.target.id());
        } else {
            lifeGen.alive.remove(event.target.id());
        }
    };
    layer.on('mousedown', function (event) {
        console.count('layerMouseDown');

        layer.on('mousemove', layerMouseMove);
        graphics.startRenderLoop();
    });
    layer.on('mouseup', function (event) {
        console.count('layerMouseUp');

        layer.off('mousemove', layerMouseMove);
        graphics.stopRenderLoop();

    });
    document.addEventListener('keyup', function (event) {
        console.count('documentKeyUp');

        if (event.keyCode === 32) {
            draw = !draw;
        }
    });
}
var alive = new Set([p(1, 1).k, p(1, 2).k, p(1, 3).k]);
var graphics = new Graphics();
graphics.setup(300, 300, 20, 20);
graphics.drawAlive(graphics.layer, alive);
graphics.render();
var lifeGen = new lifeLoop(alive);
setupControls(graphics.layer, lifeGen);

var delay = 100,
    running = false,
    timerID = 0;






function Run() {

    var {
        value
    } = lifeGen.gen.next();

    graphics.drawChanged(graphics.layer, value[1]);
    graphics.render();

    //drawTileValues(graphics.mainContext, value[1], graphics.tileWidth, graphics.tileHeight);
    timerID = setTimeout(Run, delay);
}

function toggleRun() {
    if (running) {
        running = false;
        clearTimeout(timerID);
    } else {
        running = true;
        Run();
        //timerID = setTimeout(Run, delay);
    }
}