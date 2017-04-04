// Aliases
var container 			= PIXI.Container,
    autoDetectRenderer 	= PIXI.autoDetectRenderer,
    loader 				= PIXI.loader,
    resources 			= PIXI.loader.resources,
    sprite 				= PIXI.Sprite;

// Create and add renderer
var renderer = autoDetectRenderer(480, 480);

// Create the stage
var stage = new container();

$(document).ready(function() {

	// Append the renderer to the main view
	$('#mainView').append(renderer.view);

	// Load game setup
	loader
		.add([
			'images/grass.png',
			'images/water.png',
			'images/water-t.png',
			'images/water-r.png',
			'images/water-b.png',
			'images/water-l.png',
			'images/water-tr.png',
			'images/water-br.png',
			'images/water-bl.png',
			'images/water-tl.png',
			'images/water-tr-i.png',
			'images/water-br-i.png',
			'images/water-bl-i.png',
			'images/water-tl-i.png',
			'images/single.png'
		])
		.on('progress', loadProgressHandler)
		.load(setup);

});

// Global variables
var cursor;
var cursorSpeed = 0;

function loadProgressHandler(loader, resources) {
	console.log("Loading Assest: " + resources.url); 
 	console.log("Loading Progress: " + Math.round(loader.progress) + "%"); 
}

function setup() {
	console.log('All Files Loaded.');

	// Create game map
	for (var i = 0; i < gameMap.length; i++) {
		
		var row = gameMap[i];
		
		for (var x = 0; x < row.length; x++) {
		
			var tileId = row[x];

			switch(tileId) {
				case 1:
					var tile = new sprite(resources['images/water.png'].texture);
					break;
				case 2:
					var tile = new sprite(resources['images/water-t.png'].texture);
					break;
				case 3:
					var tile = new sprite(resources['images/water-r.png'].texture);
					break;
				case 4:
					var tile = new sprite(resources['images/water-b.png'].texture);
					break;
				case 5:
					var tile = new sprite(resources['images/water-l.png'].texture);
					break;
				case 6:
					var tile = new sprite(resources['images/water-tr.png'].texture);
					break;
				case 7:
					var tile = new sprite(resources['images/water-br.png'].texture);
					break;
				case 8:
					var tile = new sprite(resources['images/water-bl.png'].texture);
					break;
				case 9:
					var tile = new sprite(resources['images/water-tl.png'].texture);
					break;
				case 10:
					var tile = new sprite(resources['images/water-tr-i.png'].texture);
					break;
				case 11:
					var tile = new sprite(resources['images/water-br-i.png'].texture);
					break;
				case 12:
					var tile = new sprite(resources['images/water-bl-i.png'].texture);
					break;
				case 13:
					var tile = new sprite(resources['images/water-tl-i.png'].texture);
					break;
				default:
					var tile = new sprite(resources['images/grass.png'].texture);
			}

			// Position Tile
			tile.y = i * 16;
			tile.x = x * 16;

			// Stage tile
			stage.addChild(tile);
			
		};
	};

	// Random Piece
	cursor = new sprite(resources["images/single.png"].texture);
	cursor.x = 0;
	cursor.y = 0;
	cursor.vx = 0;
	cursor.vy = 0;
	stage.addChild(cursor);

	// Setup controls
	var left 	= keyboard(37),
		right	= keyboard(39),
		up		= keyboard(38),
		down	= keyboard(40),
		space	= keyboard(32);

	left.press = function() {
		cursor.vx = -16;
		cursor.vy = 0;
	};

	left.release = function() {
		if (!right.isDown && cursor.vy === 0) {
			cursor.vx = 0;
			cursorSpeed = 5;
		}
	};

	right.press = function() {
		cursor.vx = 16;
		cursor.vy = 0;
	};

	right.release = function() {
		if (!left.isDown && cursor.vy === 0) {
			cursor.vx = 0;
			cursorSpeed = 5;
		}
	};

	up.press = function() {
		cursor.vy = -16;
		cursor.vx = 0;
	};

	up.release = function() {
		if (!down.isDown && cursor.vx === 0) {
			cursor.vy = 0;
			cursorSpeed = 5;
		}
	};

	down.press = function() {
		cursor.vy = 16;
		cursor.vx = 0;
	};

	down.release = function() {
		if (!up.isDown && cursor.vx === 0) {
			cursor.vy = 0;
			cursorSpeed = 5;
		}
	};

	space.press = function() {
		console.log('space');
	};

	// Set gamestate to play
	state = play;

	// Begin gameloop
	gameLoop();

};

function gameLoop() {

	// Main game loop
	requestAnimationFrame(gameLoop);

	// Update game state
	state();
	
	// Render the stage
	renderer.render(stage);

};

function play() {

	// Cursor Movement
	cursorSpeed++;
	
	if(cursorSpeed > 5) {
		cursor.x += cursor.vx;
	  	cursor.y += cursor.vy
	  	cursorSpeed = 0;
	}

};

// The keyboard controls
function keyboard(keyCode) {

	var key = {};
	key.code = keyCode;
	
	key.isDown = false;
	key.isUp = true;
	
	key.press = undefined;
	key.release = undefined;
	
	// The downstroke event handler
	key.downHandler = function(event) {

		if (event.keyCode === key.code) {

			if (key.isUp && key.press) key.press();
			key.isDown = true;
			key.isUp = false;

		}

		event.preventDefault();

	};
	
	// The upstroke event handler
	key.upHandler = function(event) {

		if (event.keyCode === key.code) {

			if (key.isDown && key.release) key.release();
			key.isDown = false;
			key.isUp = true;

		}

		event.preventDefault();

	};

	// Attach event listeners for key presses
	window.addEventListener("keydown", key.downHandler.bind(key), false);
	window.addEventListener("keyup", key.upHandler.bind(key), false);

	return key;

}