let video;

function setup() {
  var myCanvas = createCanvas(640, 480);
  background(100);
  video = createCapture(VIDEO); //access live webcam
  video.size(640, 480); //change the size to 320 x 240
  video.hide();

  myCanvas.parent("picture");
}

function keyPressed() {
  if (key == " ") {
    //this means space bar, since it is a space inside of the single quotes

    image(video, 0, 0); //draw the image being captured on webcam onto the canvas at the position (0, 0) of the canvas
  }
}

function draw() {}
