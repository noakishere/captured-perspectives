/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

let capture;
let button;

let newPic;

/**
Description of preload
*/
function preload() {}

/**
Description of setup
*/
function setup() {
	createCanvas(750, 750);
	capture = createCapture(VIDEO);
	capture.size(500, 240);
	capture.hide();

	// button = createButton("snap");
	// button.mousePressed(takesnap);

	newPic = createImage(500, 240);
}

/**
Description of draw()
*/
function draw() {
	background(255);
	// image(capture, 0, 0, 500, 240);
	image(newPic, width / 2, height / 2, 350, 350);
	// image(capture, 0, 0, 320, 240);
	filter(INVERT);

	ruler();
}

function takesnap() {
	newPic = capture.get(0, 0, 500, 240);
}

function keyPressed() {
	if (key == " ") {
		//this means space bar, since it is a space inside of the single quotes
		// image(video, 0, 0); //draw the image being captured on webcam onto the canvas at the position (0, 0) of the canvas
		takesnap();
	}
}

/** PROD TOOLS */

/*
 * have a clearer idea of the points on the canvas
 * only used for production, won't be used for the final result
 */
function ruler() {
	for (let i = 1; i < 1080; i++) {
		/* to have a clean look, as without this constraint
		 * all points would be written on the screen.
		 */
		if (i % 50 === 0) {
			fill("white");
			text(i, i, 20);
			text(i, 5, i);
		}
	}
}
