/* ***** GAME OF LIFE OBJECT ***** */

/**
 * Constructor for the Game of Life object
 * 
 * @author Qbit
 * @version 0.1
 */
function Game(canvas, cfg) {

    // Properties
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.raw_matrix = [];
    this.round = 0;
    this.count = 20;

    // Merge of the default and delivered config.
    var defaults = {
        cellSize: 30,
        rules: "23/3",
        gridColor: "#eee",
        cellColor: "#ccc"
    };
    this.cfg = $.extend({}, defaults, cfg);

    // Initialize the canvas and matrix.
    this.init();
}


Game.prototype = {

    /**
     * Initializes the canvas object and the matrix.
     */
    init: function() {
        // set canvas dimensions
        this.canvas.width = this.count * this.cfg.cellSize;
        this.canvas.height = this.count * this.cfg.cellSize;

        // initialize matrix
        this.raw_matrix = new Array(this.count*this.count);

        this.draw();
    },

    /**
     * Draws the entire game on the canvas.
     */
    draw: function() {
        var x, y;
        // clear canvas and set colors
        this.canvas.width = this.canvas.width;
        this.ctx.strokeStyle = this.cfg.gridColor;
        this.ctx.fillStyle = this.cfg.cellColor;

        // draw grid
        for (x = 0.5; x < this.count * this.cfg.cellSize; x += this.cfg.cellSize) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.count * this.cfg.cellSize);
        }

        for (y = 0.5; y < this.count * this.cfg.cellSize; y += this.cfg.cellSize) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.count * this.cfg.cellSize, y);
        }

        this.ctx.stroke();


        // draw matrix
        console.log("draw:"+this.raw_matrix);
        for (x = 0; x < this.count; x++) {
            for (y = 0; y < this.count; y++) {
                if (this.raw_matrix[x*this.count+y]==1) {

                    this.ctx.fillRect(x * this.cfg.cellSize + 1,
                        y * this.cfg.cellSize + 1,
                        this.cfg.cellSize - 1,
                        this.cfg.cellSize - 1);
                }
            }
        }
    },

    /**
     * Toggels the state of one cell at the given coordinates.
     *
     * @param cx horizontal coordinates of the given cell
     * @param cy vertical coordinates of the given cell
     */
    toggleCell: function(cx, cy) {
        if (cx >= 0 && cx < this.matrix.length && cy >= 0 && cy < this.matrix[0].length) {
            this.matrix[cx][cy] = !this.matrix[cx][cy];
            this.draw();
        }
    }
};


// animation loop
var timer;
// Initialize game
var game = new Game(document.getElementById("game"));

// register onclick on the canvas
game.canvas.addEventListener("click", gameOnClick, false);

if (!("WebSocket" in window)) {
    throw ("Sorry, no WebSockets support");
};

ws = new WebSocket("ws://localhost:8080/");

ws.onmessage = function(evt) {

    game.raw_matrix = JSON.parse(evt.data);
    //game.update_matrix();
    game.draw();

};

ws.onclose = function() {
    console.log("socket closed");
};

ws.onopen = function() {
    console.log("connected...");
};

// determens the click position and toggels the corresponding cell
function gameOnClick(e) {
    var x;
    var y;

    // determen click position
    if (e.pageX !== undefined && e.pageY !== undefined) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    // make it relativ to canvas
    var position = $("#container").position()
    x -= position.left
    y -= position.top

    // calculate clicked cell
    cell_x = Math.floor(x / game.cfg.cellSize);
    cell_y = Math.floor(y / game.cfg.cellSize);

    ws.send(cell_x + " " + cell_y);

    //game.toggleCell(cell_x, cell_y);
    //$('#output').append('<p>' + cell_x + " " + cell_y + '</p>');
};

function update_world(){
    ws.send("");
};


timer = setInterval(update_world, 1000);
