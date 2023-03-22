/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

// localforage backend server config
localforage.setDriver(localforage.INDEXEDDB);

let myCanvas;

let capture;
let newPic;

let button;

let imageCounter = 0;

let showCamera = true;

/**
Description of preload
*/
function preload() {}

/**
Description of setup
*/
function setup() {
	myCanvas = createCanvas(640, 480);
	myCanvas.parent("webcamCanvas");
	capture = createCapture(VIDEO);
	capture.size(640, 480);
	capture.hide();

	// button = createButton("Go to next page");
	// button.mousePressed(takesnap);

	newPic = createImage(capture.width, capture.height);
}

/**
Description of draw()
*/
function draw() {
	background("black");

	if (showCamera) {
		image(capture, 0, 0); //show the camera
	}

	image(newPic, 0, 0); // the captured pic

	// image(capture, 0, 0, 320, 240);
	// filter(INVERT);

	// ruler();
}

function takesnap() {
	// newPic = capture.get(0, 0, 500, 500);
	// saveCanvas("myPicture", "png", "D:/_CART/Captured_Perspectives/assets/images");
	// let formData = new FormData();
	// formData.append("file", canvas.toDataURL());
	// fetch("/saveImage", {
	// 	method: "POST",
	// 	body: formData,
	// })
	// 	.then((response) => {
	// 		window.location.href =
	// 			"pages/processedImagePage.html?image=../../assets/images/myPicture.png";
	// 	})
	// 	.catch((error) => {
	// 		console.error(error);
	// 	});
}

function keyPressed() {
	if (key == " ") {
		// newPic = capture.get(0, 0, 500, 350);
		newPic.copy(capture, 0, 0, capture.width, capture.height, 0, 0, newPic.width, newPic.height);
		showCamera = false;
	}
}

function getImageAsBase64(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onload = function () {
		var reader = new FileReader();
		reader.onloadend = function () {
			callback(reader.result);
		};

		reader.readAsDataURL(xhr.response);
	};

	xhr.open("GET", url);
	xhr.responseType = "blob";
	xhr.send();
}

function storeImage() {
	var imageUrl = `D:/_CART/Captured_Perspectives/assets/images/image${imageCounter}.jpg`;

	getImageAsBase64(imageUrl, function (base64Img) {
		localforage
			.setItem("image", base64Img)
			.then(function () {
				console.log("Image stored in localForage.");
			})
			.catch(function (err) {
				console.log("Error storing image in localForage: ", err);
			});
	});
}

function storeImageToLocalForage() {
	newPic.canvas.toBlob((blob) => {
		localforage.setItem("screenshot", blob);
	});

	window.location.replace("processedImagePage.html");
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
