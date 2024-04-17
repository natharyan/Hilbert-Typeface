let order = 4;
let N = Math.floor(Math.pow(2, order)); // grids 
let total = N*N; // total coordinates
let path = new Array(total);

function setup() {
  let cnv = createCanvas(windowHeight, windowHeight);
  cnv.style('display', 'block');
  cnv.style('margin-left', 'auto');
  cnv.style('margin-right', 'auto');
  colorMode(HSB, 360, 255, 255);

  var offset = (windowWidth - windowHeight)/2;

  for (let i = 0; i < total; i++){
    path[i] = hilbert(i);
    let len = width / N; // length of line segment of the curve
    path[i].mult(len);
    path[i].add(len/2,len/2);
  }
}
let counter = 0;
function draw() {
  background(255);
  
  stroke(0);
  strokeWeight(1);
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
  
  // for (let i = 0; i < path.length; i++){
  //  strokeWeight(4);
  //  point(path[i].x, path[i].y);
  //  strokeWeight(1);
  //  text(i, path[i].x + 5, path[i].y);
  // }
  if(counter != path.length){
    counter += 7*order*0.01;
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