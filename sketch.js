/*

//Making multiple particle systems + inheritance using: https://p5js.org/examples/simulate-multiple-particle-systems.html

--> mousePressed/mouseDragged for rain
--> snow inherits rain particle system - change a little bit to make more floaty and white
    
    References:
    Curve Vertex for river: https://p5js.org/learn/curves.html
    
    mouseDragged idea for rain: https://editor.p5js.org/Ellie_Lin/sketches/BJSSkPvTQ
    
    keyPressed: https://p5js.org/reference/#/p5/keyPressed
    
    Figure out bool/logical operators: https://p5js.org/examples/control-logical-operators.html
    
*/


//Physics
var gravity;
var wind;
var friction;

let storm;
let fire;
let fireYpos;

let renderCloud = false;
let cloudX;
let cloudY;

//boolean for snow and rain - toggle s and r to change

let snow = false;
let rain = true;

let frameRate = 30;

//===== GUI =======//

let params = {
  //particles
  particles: 3,
  particlesMin: 1,
  particlesMax: 10,
    
  //particle size
  size: 10,
  sizeMin: 2,
  sizeMax: 20,

  //opacity/lifetime
  lifetime: 200,
  lifetimeMax: 255,
    
  //initial velocity
  velocity: 5,
  velocityMin: 1,
  velocityMax: 10,
    
  //position
  position: 300,
  positionMin: 100,
  positionMax: 750,
    
  //fire span/overall size
  span: 3,
  spanMin: 10,
  spanMax: 100,
};

let gui;

//=================//

function setup() {
  createCanvas(innerWidth, innerHeight);
  storm = [];
  fire = [];
  fireYpos = height - 180;
  cloudX = 450;
  cloudY = 100;
  gravity = createVector (0, 0.001); //downward vector

  //Create GUI
  gui = createGui('Play With Fire');
  gui.addObject(params);

}

function renderSkyline() {
//===== Skyline Silhouette =======//
    stroke(255);
    noFill();
    ellipseMode(CENTER);
    //London Eye TO-DO: MAKE LONDON EYE MOVE?
    triangle(50, 500, 100, 350, 150, 500);
    ellipse(100, 350, 250, 250);
    ellipse(10, 265, 40, 40); //120deg
    ellipse(100, 225, 40, 40); //90deg
    ellipse(190, 265, 40, 40); //45deg
    ellipse(225, 350, 40, 40); //0deg
    ellipse(190, 440, 40, 40); //-45deg
    ellipse(100, 470, 40, 40);
    ellipse(10, 440, 40, 40);
    
    rect(260, 200, 80, 300); //1, x: 250, y: 200
//    rect(275, 175, 80, 300); //Side
    
    rect(400, 300, 80, 200); //2, x: 250, y: 200
    rect(400, 220, 80, 80);
    ellipse(440, 260, 60, 60);
//    rect(425, 275, 80, 200); //Side
    
    arc(670, 500, 200, 200, -PI, 0, CHORD);
    
        //Shard: triangle: x1y1, x2y2, x3y3
    triangle(520, 500, 570, height - 400, 620, 500);
    
    //River
    fill(0, 0, 139);
    stroke(0);
    beginShape();
        curveVertex(0, height);
        curveVertex(0, height);
        curveVertex(40,520);
        curveVertex(140,550);
        curveVertex(300,530);
        curveVertex(450,525);
        curveVertex(600,560);
        curveVertex(750,530);
        curveVertex(810,450);
        curveVertex(740,400);
        curveVertex(900,425);
        curveVertex(1000, 500);
        curveVertex(1020, 530);
        curveVertex(1250, 680);
        curveVertex(1020, height);
        curveVertex(1020, height);
    endShape();  
    
//   DEBUGGING FOR RIVER - used ellipses to plan and track the coordinates for the curveVertex

    let coords = [40, 520, 140, 550, 300, 530, 450, 525, 600, 560, 750, 530, 810, 450, 740, 400, 900, 425, 1000, 500, 1200, 650];
    
    for (let i = 0; i < coords.length; i+= 2){
        fill(255);
          ellipse(coords[i], coords[i+1], 10, 10);
         }
  
}

function draw() {
  background(0);
  renderSkyline();
//===== Storm for Snow and Rain =======//
  for (i = 0; i < storm.length; i++) {
    storm[i].run();
    storm[i].addRain();
  }
//=========== Fire ===========//
  push();
    for (let i = 0; i < params.particles; i++) {
      let f = new FireParticle(params.position + random(- params.span, params.span), fireYpos);
      fire.push(f); 
    }
    //Reason why we count backwards is so when looking for finished particles, once one is spliced the one directly after gets skipped, resulting in jumpy fire particles
  for (let i = fire.length - 1; i >= 0; i--) {
    if (key == 'w') {
      print("wind");
      fire[i].applyForce(wind);
    }
      fire[i].applyForce(gravity);
      fire[i].update();
      fire[i].show();
        
    if (fire[i].done()) {
            //remove this particle
            fire.splice(i, 1); //splice removes element from array at position i of just one element
    }
  }
  pop();    
//===== Clouds =======//
    
  drawCloud(cloudX, cloudY, 80, 80);
  drawCloud(cloudX + 200, cloudY + 60, 80, 80);
  drawCloud(cloudX + 400, cloudY + 20, 80, 80);
}

function drawCloud(x, y, size, size) {
  noStroke();
  fill(47,79,79);
  ellipse(x + 45, y - 30, size, size);
  ellipse(x + 75, y, size, size - 20);
  fill(255); //Clouds
  ellipse(x, y, size, size - 20);
  ellipse(x + 60, y, size, size - 20);
  ellipse(x + 30, y - 30, size, size);
}

function mousePressed() {
//  print('mouse pressed');
//    
////  if (mouseY <= 200 && mouseX >= 400) { //so rain can't spawn everywhere so GUI can be used
////    this.p = new RainSystem(createVector(mouseX, mouseY));
////    storm.push(p); 
////  }
//
//  return false;
}

//Toggle state between rain and snow
function keyPressed() {
    if (keyCode == 83) { //s key
      snow = !snow;
      this.p = new RainSystem(createVector(cloudX + 40, cloudY));
      print('s pressed');
    }
    if (int(random(0, 2)) == 0) {
        this.p = new RainSystem(createVector(cloudX + 240, cloudY + 60));
      }
     else {
        this.p = new RainSystem(createVector(cloudX + 440, cloudY + 20));    
      }
          
  storm.push(p);

//    if (keyCode === 82) { //r key
//        rain = !rain; 
//      
//    }

  return false;
}

//========== PARTICLE CODE ======//
// Why pick function over class?

//A simple Particle class - TO-DO: find out why .prototype is used

//FIRE
function FireParticle(x, y) {
  this.pos = createVector(x, y);
  this.acc = createVector(0, 0);
  this.vel = createVector(random(-params.span / params.span * 0.5, params.span / params.span * 0.5), (params.velocity * -1) + random(-3, -1.5));
  this.lifespan = params.lifetime;
  this.size = params.size;
  this.deg = 0;

  this.applyForce = function(force) {
    this.acc.add(force);
  };

  this.update = function() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(this.acc * 0);
    this.lifespan -= 1.5;
    this.diameter -= random(0.05, 0.1);
    this.deg += 0.03
  };

  this.done = function() {
    if (this.lifespan < 0) {
      return true;
    } else {
      return false;
    }
  };

  this.show = function() {
    noStroke();
    //Lerping 2 colors together that change as particle ages
    var col1 = color(random(50,150), 0, 0, 20);
    var col2 = color(random(232, 255),122,79);
    var particle_col = lerpColor(col1, col2, (this.lifespan/255));
      
    fill(particle_col);
//    rotate(this.deg);
    rect(this.pos.x, this.pos.y, this.size, this.size + 10);
  };
}

// A simple Rain Particle class
let Rain = function(position) {
  this.position = position.copy();
  this.acc = createVector(0, 0.1);
  this.vel = createVector(random(-0.2, 0.2), random(0.05, 3));
  this.lifespan = 255;
  this.diameter = 10;
  this.deg = 0;
};

Rain.prototype.run = function() {
  this.update();
  this.applyForce(gravity);
  this.borders();
  this.show();
};

Rain.prototype.applyForce = function(force) {
    this.acc.add(force);
};

Rain.prototype.borders = function() {
  if (this.position.x - this.diameter <= 0 || this.position.x + this.diameter >= innerWidth) {
    this.vel.x *= -0.8;
    }
  if (this.position.y + this.diameter >= innerHeight || this.position.y - this.diameter <= 0) {
    this.vel.y *= -0.5;
    }    
};

// Method to update position
Rain.prototype.update = function(){
    this.vel.add(this.acc);
    this.position.add(this.vel);
    this.acc.mult(this.acc * 0);
    this.lifespan -= 1.5;
    this.diameter += random(0.09, 0.19); //gravity + velocity stretches out the rain particle increasing length of rain drop
};

// Method to display
Rain.prototype.show = function () {
    noStroke();
    //Lerping 2 colors together that change as particle ages
    var col1 = color(0, 0, 139, 20);
    var col2 = color(0, 191, 255);
    var particle_col = lerpColor(col1, col2, (this.lifespan/255));
      
    fill(particle_col);
    ellipse(this.position.x, this.position.y, 5, this.diameter);
  };

// Is the particle still useful?
Rain.prototype.done = function () {
  if (this.lifespan < 0) {
    return true;
  } else {
    return false;
  }
};

let RainSystem = function (position) {
  this.origin = position.copy();
  this.storm = [];
};

RainSystem.prototype.addRain = function () {
  // Add either rain particle or snow particle with if statement
  if (snow) {
    p = new Snow(this.origin);
//        this.snow.push(p);
        print('Snowing');
  } 
//    else {
//          p = new Rain(this.origin);
//          print('Raining');
//  }
    else if (rain) {
                  p = new Rain(this.origin);
          print('Raining');
    }
  this.storm.push(p); 

};

RainSystem.prototype.run = function () {
  for (let i = this.storm.length - 1; i >= 0; i--) {
    let r = this.storm[i];
    r.run();
    
    //Friction force - how do I make this work?
//    this.friction = r.vel.copy();
//    this.friction.mult(-0.01);
//    this.friction.normalize();
//    this.friction.mult(0.01);
//    r.applyForce(friction);
      
    if (r.done()) {
      this.storm.splice(i, 1);
    }
  }
};

function Snow(origin) {
  // Call the parent constructor Rain
  Rain.call(this, origin);
    
  //Initialize added properties
  this.size = random(2, 8); //make snow smaller than rain drops
  this.spin = 0.0;
};

Snow.prototype = Object.create(Rain.prototype);

//Constructor refers to snow
Snow.prototype.constructor = Snow;

//method run() is inherited

Snow.prototype.update = function() {
  Rain.prototype.update.call(this);
  //Change update to make it more snowy/floaty/spinny
  this.spin += (this.vel.x * this.vel.acc) / 10.0;
  
  this.position.x += random(-2, 2); //snowflakes jitter
//  this.position.y += pow(this.diameter, 0.5);
}

Snow.prototype.show = function() {
  //Render ellipse like regular 
//  Rain.prototype.show.call(this);
    push();
    rotate(this.spin);
    noStroke();
    fill(255, this.lifespan * 5); //make snow last longer than rain
    ellipse(this.position.x, this.position.y, this.size, this.size);
    pop();
}

/*
    push();
    translate(innerWidth/2, innerHeight/2);
    strokeWeight(5);
    stroke(255);
    line(0, 25, 0, -25);
    pop();
    push();
    rotate(PI/2);
    line(0, 25, 0, -25);
    pop();
    push();
    rotate(PI/4);
    line(0, 25, 0, -25);
    pop();
    push();
    rotate(-PI/2);
    line(0, 25, 0, -25);
    pop();
*/
