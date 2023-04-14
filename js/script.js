/**
Title of Project: Captured Perspectives
Authors Name: Kamyar Karimi - Rebecca Acone

Captured Perspectives emphasizes the importance of collaboration in our creative works, and
				how storytelling brings the community together.
*/

"use strict";

// Main prompts with narrative bits associated to each
let prompts = [
	[
		"Walking through the forest and feeling curious.",
		"You are on your way to visit your grandmother, who lives deep in the forest. Along the way, you encounter many interesting sights and sounds.",
	],
	[
		"Meeting the Big Bad Wolf and feeling cautious.",
		"While walking through the forest, you meet a sly and cunning wolf who asks you many questions about your destination.",
	],
	[
		"Arriving at your grandmother's house and feeling excited.",
		"You finally arrive at your grandmother's house, feeling happy and excited to see her. You share many stories and laughs together.",
	],
	[
		"Discovering the wolf in disguise and feeling frightened.",
		"You discover that the wolf has disguised himself as your grandmother, and you are terrified by his deception.",
	],
	[
		"Outsmarting the wolf and feeling clever.",
		"You use your wit and cunning to outsmart the wolf, tricking him into revealing his true identity.",
	],
	[
		"Escaping from the wolf's clutches and feeling relieved.",
		"You escape from the wolf's grasp and run to safety, feeling relieved and grateful to be alive.",
	],
	[
		"Navigating the forest alone and feeling independent.",
		"You venture back into the forest alone, feeling confident and independent in your abilities.",
	],
	[
		"Meeting other creatures in the forest and feeling connected.",
		"Along your journey, you meet many other creatures of the forest, and feel a deep sense of connection and belonging with them.",
	],
	[
		"Returning home and feeling changed.",
		"After your harrowing experience with the wolf, you return home feeling different and changed by the events that have transpired.",
	],
];

let myCanvas;

let mainPadAddress = "../assets/sounds/littlered.mp3";
let mainPad;

// Video capture variables
let capture;
let newPic;
let galleryPic;
let currentPic;

// DOM variables
let leftBtn;
let rightBtn;
let submitBtn;
let retakeBtn;
let backBtn;

let p5Canvas;
let imageContainer;

// DOM Prompt variables
let promptTitle;
let narrationText;
let imgPrompt;
let narrativeBit;

let imageCounter = 0;

let showCamera = true;
let takeImage = false;
let showGallery = false;
let picAlreadySubmitted = false;

let globalPicArray = []; // holds all the images that are submitted by users

// Keeps track of the prompt progression
let storyLineCounter = 0;

/**
Description of preload
*/
function preload() {
	//sound setup
	mainPad = loadSound(mainPadAddress);
}

/**
Description of setup
*/
function setup() {
	//canvas setup
	myCanvas = createCanvas(640, 480);
	myCanvas.parent("webcamCanvas");

	//video setup
	capture = createCapture(VIDEO);
	capture.size(640, 480);
	// capture.hide();

	// they will be following what the webcam captures to print it on the canvas
	newPic = createImage(capture.width, capture.height);
	galleryPic = createImage(capture.width, capture.height);

	// DOM references
	submitBtn = document.getElementById("submitPicBtn");
	backBtn = document.getElementById("backBtn");
	retakeBtn = document.getElementById("retake");

	retakeBtn.style.display = "none";

	leftBtn = document.getElementById("leftPicBtn");
	rightBtn = document.getElementById("RightPicBtn");

	leftBtn.style.display = "none";
	rightBtn.style.display = "none";
	backBtn.style.display = "none";

	imageContainer = document.getElementById("imageContainer");
	imageContainer.style.display = "none";

	p5Canvas = document.getElementById("mainContainer");
	p5Canvas.style.display = "block";

	// prompt section HTML DOM
	promptTitle = document.getElementById("prompt");
	imgPrompt = document.getElementById("imgPrompt");
	narrativeBit = document.getElementById("narrativeBit");

	generateNewPrompt();

	// Sound configs
	mainPad.setVolume(0.2);
	mainPad.loop();
}

/**
Description of draw()
*/
function draw() {
	background("black");

	if (showCamera) {
		capture.show();
	}

	if (takeImage) {
		image(newPic, 0, 0); // the captured pic
	}
}

// Goes through the prompts array and takes the next element
function generateNewPrompt() {
	promptTitle.innerText = "Image Prompt: " + prompts[storyLineCounter][0];
	narrativeBit.innerText = prompts[storyLineCounter][1];

	console.log(storyLineCounter);
	if (storyLineCounter < prompts.length) {
		storyLineCounter++;
	}
	if (storyLineCounter >= prompts.length) {
		storyLineCounter = 0;
	}
}

function keyPressed() {
	// avoids constantly taking pictures
	if (key == " " && !picAlreadySubmitted) {
		picAlreadySubmitted = true;

		retakeBtn.style.display = "inline-block";
		newPic.copy(capture, 0, 0, capture.width, capture.height, 0, 0, newPic.width, newPic.height);

		showCamera = false;
		takeImage = true;

		document.body.scrollTop = document.documentElement.scrollTop = 0;
	}
}

// Processes each image that's submitted to the array as an object to be processed by the gallery section
function storeImageToLocalArray() {
	// using blob format because the images need to be converted to binary to be able to be shown on the gallery again
	// while they're stored in an array
	newPic.canvas.toBlob((blob) => {
		var newNarrationText = narrativeBit.innerText;
		var newPromptImg = promptTitle.innerText;
		var newObj = {
			title: newPromptImg,
			narrationText: newNarrationText,
			blobImg: blob,
		};
		globalPicArray.push(newObj);

		populateImages(); // shows the gallery section
	});
}

// Processes all the images in the array to show on gallery
function populateImages(i = 0) {
	capture.hide();

	// DOM configs
	picAlreadySubmitted = true;
	imageContainer.style.display = "block";
	p5Canvas.style.display = "none";

	submitBtn.style.display = "none";
	retakeBtn.style.display = "none";

	leftBtn.style.display = "inline-block";
	rightBtn.style.display = "inline-block";
	backBtn.style.display = "inline-block";

	takeImage = false;
	showGallery = true;

	// Shows the images
	// decodes the blob files to urls so that the image shows up
	let newImage = document.getElementById("currentPic");
	newImage.src = URL.createObjectURL(globalPicArray[i].blobImg);

	let newImgStory = document.getElementById("imgStory");
	newImgStory.innerHTML = globalPicArray[i].narrationText || "";

	let newImgPrompt = document.getElementById("imgPrompt");
	newImgPrompt.innerHTML = globalPicArray[i].title;
}

// The function to browse through pics in the global pics array
function browsePics(i = 0) {
	if (imageCounter + i < globalPicArray.length && imageCounter + i >= 0) {
		imageCounter += i;

		console.log(`${imageCounter} and array length ${globalPicArray.length}`);
		populateImages(imageCounter);
	} else if (imageCounter + i >= globalPicArray.length) {
		imageCounter = 0;
		populateImages(imageCounter);
	} else if (imageCounter + i < 0) {
		imageCounter = globalPicArray.length - 1;
		populateImages(imageCounter);
	}
}

// Moves back from gallery to camera mode
function goBackCamera() {
	submitBtn.style.display = "inline-block";

	// DOM CONFIGS
	leftBtn.style.display = "none";
	rightBtn.style.display = "none";
	backBtn.style.display = "none";
	imageContainer.style.display = "none";
	retakeBtn.style.display = "none";

	p5Canvas.style.display = "block";

	takeImage = false;
	showGallery = false;

	showCamera = true;
	picAlreadySubmitted = false;

	document.getElementById("images").scrollIntoView();

	capture.show();
	generateNewPrompt(); // show the new prompt
}

// Prevents from clicking on space to scroll through the page
window.addEventListener("keydown", function (e) {
	if (e.keyCode == 32 && e.target == document.body) {
		e.preventDefault();
	}
});

function retakeImage() {
	picAlreadySubmitted = false;
	retakeBtn.style.display = "none";
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
