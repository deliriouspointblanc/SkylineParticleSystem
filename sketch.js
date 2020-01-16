/*

//Making multiple particle systems using: https://p5js.org/examples/simulate-multiple-particle-systems.html

--> mousePressed/mouseDragged for rain
--> snow inherits rain particle system - change a little bit to make more floaty and white
    
    References:
    Curve Vertex for river: https://p5js.org/learn/curves.html
    
    mouseDragged idea for rain: https://editor.p5js.org/Ellie_Lin/sketches/BJSSkPvTQ
*/

//let fire;
//let rain;

//Physics
var gravity;
var wind;
var friction;

// var particleMode;

//Textures
//let fire;
//let smoke;

let storm;

var renderCloud = false;

function preload() {
 
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  storm = [];
  gravity = createVector (0, 0.01); //downward vector
}

function draw() {
      background(0);
    
//===== Particle Stuff =======//
    for (i = 0; i < storm.length; i++) {
        storm[i].run();
        storm[i].addRain();
    }
    
    //Rain - so it doesn't happen every frame
    
//    drawCloud(600, 80, 80, 80);
        
//    if (random(1) < 0.2) {
//            for (let i = 0; i < 2; i++) {
//        let r = new RainParticle(random(580, 660),
//                                 random(80, 100));
//        rain.push(r);
//    }
//     }
//    
//    for (let i = rain.length - 1; i >=0; i--) {
//            rain[i].applyForce(gravity);
//            rain[i].update();
//            rain[i].show();
//            rain[i].borders();
//        
//        if (rain[i].done()) {
//            //remove rain particles
//            rain.splice(i, 1);
//        }
//        
//        friction = rain[i].vel.copy();
//        friction.mult(-0.01);
//        friction.normalize();
//        friction.mult(0.01);
//        rain[i].applyForce(friction);
//    }
    
//    if ()
    if (renderCloud) {
        print("render cloud");
        noStroke();
        fill(255);
        ellipse(mouseX, mouseY, 80, 60);
        drawCloud(mouseX, mouseY, 80, 80);
    }

}

function drawCloud(x, y, size, size) {
  noStroke();
  fill(255); //Clouds
  ellipse(x, y, size, size - 20);
  ellipse(x + 60, y, size, size - 20);
  ellipse(x + 30, y - 30, size, size);
}

function mousePressed() {
    print('mouse pressed');
    
    fill(255, 0, 0);
    ellipse(width/2, height/2, 10, 10);
    renderCloud == true;
//    if (random(1) < 0.2) {
//      print(drawCloud);
      this.p = new RainSystem(createVector(mouseX, mouseY));
      storm.push(p);
    


//    }

}

//========== PARTICLE ======//
// Why pick function over class?

//A simple Particle class - TO-DO: find out why .prototype is used

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
    this.lifespan -= 0.5;
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
  this.rain = [];
};

RainSystem.prototype.addRain = function () {
  // Add either rain particle or snow particle with if statement
//  if (int(random(0, 2)) == 0) {
    p = new Rain(this.origin);
    print('Raining');
//  } else if (keyCode == 's') {
//    p = new Snow(this.origin);
//    print('Snowing');
//  }
  this.rain.push(p);
};

RainSystem.prototype.run = function () {
  for (let i = this.rain.length - 1; i >= 0; i--) {
    let r = this.rain[i];
    r.run();
    
    //Friction force - how do I make this work?
//    this.friction = r.vel.copy();
//    this.friction.mult(-0.01);
//    this.friction.normalize();
//    this.friction.mult(0.01);
//    r.applyForce(friction);
      
    if (r.done()) {
      this.rain.splice(i, 1);
    }
  }
};

function Snow(origin) {
  // Call the parent constructor Rain
  Rain.call(this, origin);
    
  //Initialize added properties
};

Snow.prototype = Object.create(Rain.prototype);

//Constructor refers to snow
Snow.prototype.constructor = Snow;

//method run() is inherited

Snow.prototype.update = function() {
  Rain.prototype.update.call(this);
  //Change update to make it more snowy?
}

Snow.prototype.display = function() {
  //Render ellipse like regular 
  Rain.prototype.display.call(this);
  //
  push();
  translate(this.position.x, this.position.y);
  ellipseMode(CENTER);
  fill(255, this.lifespan);
  ellipse(this.position.x, this.position.y, 5, 5);
  pop();
}
