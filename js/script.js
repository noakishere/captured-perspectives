/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

// localforage backend server config
localforage.setDriver(localforage.INDEXEDDB);

let prompts = [
	"give me your best power pose",
	"Let's see your most joyful expression",
	"give me your best surprised expression",
	"Can you portray a sense of calm and serenity?",
	"Let's see your most curious expression",
];

let myCanvas;

let capture;
let newPic;
let galleryPic;
let currentPic;

let leftBtn;
let rightBtn;
let submitBtn;
let retakeBtn;
let backBtn;

let p5Canvas;
let imageContainer;

let promptTitle;
let narrationText;
let imgPrompt;

let imageCounter = 0;

let showCamera = true;
let takeImage = false;
let showGallery = false;
let picAlreadySubmitted = false;

let globalPicArray = [];
let galleryPics = [];

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
	// capture.hide();

	// button = createButton("Go to next page");
	// button.mousePressed(takesnap);

	newPic = createImage(capture.width, capture.height);
	galleryPic = createImage(capture.width, capture.height);

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

	promptTitle = document.getElementById("prompt");
	generateNewPrompt();

	narrationText = document.getElementById("description");
	imgPrompt = document.getElementById("imgPrompt");
}

/**
Description of draw()
*/
function draw() {
	background("black");

	if (showCamera) {
		// image(capture, 50, 50); //show the camera
		capture.show();
	}

	if (takeImage) {
		image(newPic, 0, 0); // the captured pic
	}
	// else if (showGallery) {
	// 	image(newPic, 0, 0);
	// }

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

function generateNewPrompt() {
	promptTitle.innerText = prompts[floor(random(0, prompts.length))];
}

function keyPressed() {
	if (key == " " && !picAlreadySubmitted) {
		// newPic = capture.get(0, 0, 500, 350);
		picAlreadySubmitted = true;

		retakeBtn.style.display = "inline-block";
		newPic.copy(capture, 0, 0, capture.width, capture.height, 0, 0, newPic.width, newPic.height);

		showCamera = false;
		takeImage = true;

		document.body.scrollTop = document.documentElement.scrollTop = 0;
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
		var newNarrationText = narrationText.value;
		var newPromptImg = promptTitle.innerText;
		var newObj = {
			title: newPromptImg,
			narrationText: newNarrationText,
			blobImg: blob,
		};
		globalPicArray.push(newObj);
		// galleryPics.push(blob);

		populateImages();
	});

	// if (takeImage) {
	// 	globalPicArray.push(newPic);
	// 	console.log(globalPicArray);

	// 	picAlreadySubmitted = true;
	// 	capture.hide();
	// 	populateImages();

	// 	console.log(galleryPics);
	// } else {
	// }
}

function populateImages(i = 0) {
	// let imageContainer = document.getElementById("images");

	// // // imageContainer.innerHTML = "";

	// globalPicArray.forEach((element) => {
	// 	let img = document.createElement("img");
	// 	img.src = URL.createObjectURL(element);
	// 	console.log(img.src);
	// 	imageContainer.appendChild(img);
	// });

	// globalPicArray.forEach((element) => {
	// 	let img = document.createElement("img");
	// 	// img.src = URL.createObjectURL(element);
	// 	img.src = element;
	// 	console.log(img.src);
	// 	imageContainer.appendChild(img);
	// });

	capture.hide();
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

	console.log(globalPicArray[i]);

	let newImage = document.getElementById("currentPic");
	newImage.src = URL.createObjectURL(globalPicArray[i].blobImg);

	let newImgStory = document.getElementById("imgStory");
	newImgStory.innerHTML = globalPicArray[i].narrationText || "";

	let newImgPrompt = document.getElementById("imgPrompt");
	newImgPrompt.innerHTML = globalPicArray[i].title;

	// newPic.copy(
	// 	globalPicArray[i],
	// 	0,
	// 	0,
	// 	globalPicArray[i].width,
	// 	globalPicArray[i].height,
	// 	0,
	// 	0,
	// 	newPic.width,
	// 	newPic.height
	// );

	// imageCounter = 0;

	console.log(newPic);
}

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

function goBackCamera() {
	submitBtn.style.display = "inline-block";

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

	narrationText.value = "";

	capture.show();
	promptTitle.innerText = prompts[floor(random(0, prompts.length))];
}

window.addEventListener("keydown", function (e) {
	if (e.keyCode == 32 && e.target == document.body) {
		e.preventDefault();
	}
});

function retakeImage() {
	picAlreadySubmitted = false;
	retakeBtn.style.display = "none";
}

// function storeImageToLocalForage() {
// 	newPic.canvas.toBlob((blob) => {
// 		localforage.setItem("screenshot", blob);
// 	});

// 	window.location.replace("processedImagePage.html");
// }

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
