let order = 1; // Initial order
let N = Math.floor(Math.pow(2, order)); // grids 
let total = N*N; // total coordinates
let path = new Array(total);
let flag = false;
let img;

function setup() {
  let cnv = createCanvas(windowHeight, windowHeight);
  cnv.style('display', 'block');
  cnv.style('margin-left', 'auto');
  cnv.style('margin-right', 'auto');

  colorMode(RGB);

  for (let i = 0; i < total; i++){
    path[i] = hilbert(i);
    let len = width / N; // length of line segment of the curve
    path[i].mult(len);
    path[i].add(len/2,len/2);
  }
}

function loadImageFromLocalStorage(callback) {
  const imageData = localStorage.getItem(key);
  if (!imageData) {
    console.error('Image data not found in localStorage for key:', key);
    return null;
  }

  const image = loadImage(imageData, () => {
    callback(image);
  });
}

document.addEventListener('render', () => {
  order = 8;
  flag = true;
  path = new Array(total);
  N = Math.floor(Math.pow(2, order));
  total = N*N;
  for (let i = 0; i < total; i++){
    path[i] = hilbert(i);
    let len = width / N; // length of line segment of the curve
    path[i].mult(len);
    path[i].add(len/2,len/2);
  }
  loadImageFromLocalStorage((image) => {
    img = image;
    localStorage.removeItem(key);
    console.log(img);
  });
});

let counter = 0;
function draw() {
  background(255);

  if(!flag){
    stroke(0);
    strokeWeight(2);
    noFill();
    // beginShape();
    for (let i = 1; i < counter; i++){
      let h = map(i, 0, path.length, 0, 360);
      //stroke(h,255,255);
      if(path[i]){
        line(path[i].x, path[i].y, path[i-1].x, path[i-1].y);
      }
    }
    // endShape();

    if(counter < path.length){
      // counter += 0.01*order*6.7;
      counter += 0.08 * order**2
    } else{
      // Reset for next order
      order = (order+1)%9;
      // if (order > 8) {
      //   noLoop(); // Stop after order 8
      //   return;
      // }
      N = Math.floor(Math.pow(2, order));
      total = N*N;
      path = new Array(total);
      counter = 0;
      
      for (let i = 0; i < total; i++){
        path[i] = hilbert(i);
        let len = width / N; // length of line segment of the curve
        path[i].mult(len);
        path[i].add(len/2,len/2);
      }
    }
  }else{
    if(img){
      background(255);
      // Draw Hilbert curve incrementally
      noFill();
      strokeWeight(1);
      for (let i = 1; i < min(counter, path.length); i++) {
        // Get the corresponding pixel color from the image
        let imgX = int(map(path[i].x, 0, width, 0, img.width - 1));
        let imgY = int(map(path[i].y, 0, height, 0, img.height - 1));
        let col = img.get(imgX, imgY);
        
        stroke(col);
        
        // Draw line segment of the curve
        let prevX = map(path[i-1].x, 0, width, 0, img.width);
        let prevY = map(path[i-1].y, 0, height, 0, img.height);
        let x = map(path[i].x, 0, width, 0, img.width);
        let y = map(path[i].y, 0, height, 0, img.height);
        line(prevX, prevY, x, y);
      }
      
      if (counter < path.length) {
        counter += 700;
      }
    }
  }
}

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
