let order = 8;
let N = Math.floor(Math.pow(2, order)); // grids 
let total = N * N; // total coordinates
let path = new Array(total);
let img; // Variable to hold the image
let counter = 0; // Counter for drawing the curve incrementally

function preload() {
  // Load your image
  img = loadImage('black_beige.png');
}

function setup() {
  createCanvas(img.width, img.height);
  colorMode(RGB); // Set color mode to RGB
  
  // Resize the image to fit the canvas
  img.resize(width, height);
  
  
  for (let i = 0; i < total; i++){
    path[i] = hilbert(i);
    let len = width / N; // length of line segment of the curve
    path[i].mult(len);
    path[i].add(len/2,len/2);
  }
}

function draw() {
  background(255); // Set canvas background to white
  
  // Draw Hilbert curve incrementally
  noFill();
  for (let i = 1; i < min(counter, path.length); i++) {
    // Get the corresponding pixel color from the image
    let imgX = int(map(path[i].x, 0, width, 0, img.width - 1));
    let imgY = int(map(path[i].y, 0, height, 0, img.height - 1));
    let col = img.get(imgX, imgY);
    
    // Set the stroke color to the pixel color
    stroke(col);
    
    // Draw line segment of the curve
    let prevX = map(path[i-1].x, 0, width, 0, img.width);
    let prevY = map(path[i-1].y, 0, height, 0, img.height);
    let x = map(path[i].x, 0, width, 0, img.width);
    let y = map(path[i].y, 0, height, 0, img.height);
    line(prevX, prevY, x, y);
  }
  
  // Increment counter
  if (counter < path.length) {
    counter += 700;
  }
}

// create hilbert's curve
function hilbert(i){
  let points = [
    createVector(0,0),
    createVector(0,1),
    createVector(1,1),
    createVector(1,0)
  ];
  
  let index = i & 3;
  let v = points[index]; // get point from first order hilbert's curve
  for(let k = 1; k < order; k++){
    i = i >>> 2;
    index = i & 3; // grid to place in
    let len = pow(2,k);
    if(index == 0){
      let temp = v.x;
      v.x = v.y;
      v.y = temp;
    }else if(index == 1){
      v.y += len;
    }else if(index == 2){
      v.y += len;
      v.x += len;
    }else if(index == 3){
      let temp = len - 1 - v.x;
      v.x = len - 1 - v.y;
      v.y = temp;
      v.x += len;
    }
  }
  return v;
}
