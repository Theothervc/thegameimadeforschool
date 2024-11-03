//VARIABLES

let ctx;
let canvas;
let started = false;
let dead = false;
let score = 0;
let currentpopup = null;
let paused = false;
let hasextrahp = false;

let objects = [];

let health = 3;

let hsp1 = false;
let hsp2 = false;
let hsp3 = false;
 
//Popups

let p1 = "Being On A Screen Before Bed Can Make You Sleep Much Worse!";
let p2 = "Most People On Social Media Don't Actually Have Perfect Lives. Dont Hold Yourself To Them!";
let p3 = "Your Not Alone! If You Feel Depressed, Talk To Someone, Get Help!";

//Images


let paperimg = new Image();
paperimg.src = "Images/paper.png";

let playerimg = new Image();
playerimg.src = "Images/Player.png";

let phoneimg = new Image();
phoneimg.src = "Images/Phone.png";

let heartimage = new Image();
heartimage.src = "Images/Heart.png";

let superheartimage = new Image();
superheartimage.src = "Images/SuperHeart.png";

let ironimage = new Image();
ironimage.src = "Images/Iron.png";

let background = new Image();
background.src = "Images/background.png";

//CLASSES
class Object {
  constructor(image,x,y,width,height,type) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    objects.push(this);
  }
}

class Player {
  constructor(image,x,y,width,height) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class Popup {
  constructor(title,description,x,y,width,height,time) {
    this.title = title;
    this.description = description;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.time = time;
  }
}

//SETUP

let player = new Player(playerimg,250-64/2,500-64,64,64);

window.onload = init;

function init() {
  canvas = document.getElementById("game")
  ctx = canvas.getContext("2d");
let splash = document.getElementById("Splash");
let splashes = [
  "A Game About Cell Phones",
"I Spent Way Too Much Time On This",
":) :) :) :) :) :) :) :)",
"Heath Class Is Definity Very Cool!",
"Oh, The IRONy!"
]
  fpsInterval = 1000/60;
then = Date.now();
requestAnimationFrame(main);

var randomNumber = Math.floor(Math.random() * splashes.length);
splash.innerHTML = splashes[randomNumber];

setTimeout(function() {
started = true
},2000);
}

function main() {
requestAnimationFrame(main);

now = Date.now(); 
elapsed = now - then; 

if (elapsed > fpsInterval) { 
  then = now - (elapsed % fpsInterval); 
update();
draw();
}
  }



//MAIN FUNCTIONS

function update() {
  if (!started || dead || paused) {return;}
objects.forEach(object => {
  object.y += 5;
  if (collision(player,object)) {
    objects.splice(objects.indexOf(object),1);
    if (object.type == "Bad") {
      if (hasextrahp) {
        hasextrahp = false;
      } else {
        health -= 1;
      }
    } else if (object.type == "Good") {
      score += 1;
    } else {
      hasextrahp = true;
      score += 3;
    }
  }
  if (object.y >= 500) {
    objects.splice(objects.indexOf(object),1);
  }
});

if (Math.floor(Math.random()*40) == 1) {
  if (Math.floor(Math.random()*10) == 1) {
  new Object(paperimg,Math.floor(Math.random()*(500-64)),-64,64,64,"Good");
    } else if (Math.floor(Math.random()*40) == 1) {
      new Object(ironimage,Math.floor(Math.random()*(500-64)),-64,64,64,"Great");
    } else {
      new Object(phoneimg,Math.floor(Math.random()*(500-64)),-64,64,64,"Bad");
    }
  }

  if (health <= 0) {
    dead = true
    objects = []
  }

  if (score >= 10 && !hsp1) {
    paused = true;
    objects = [];
    currentpopup = new Popup("Did You Know?",p1,50,150,400,200,5000);
    hsp1 = true;
    setTimeout(function() {
      paused = false;
      currentpopup = null;
      score += 1;
      health = clamp(health+1,3,0);
    },currentpopup.time);
  }
  if (score == 20 && !hsp2) {
    paused = true;
    objects = [];
    currentpopup = new Popup("Did You Know?",p2,50,150,400,200,5000);
    hsp2 = true;
    setTimeout(function() {
      paused = false;
      currentpopup = null;
      score += 2;
      health = clamp(health+2,3,0);
    },currentpopup.time);
  }
  if (score == 30 && !hsp3) {
    paused = true;
    objects = [];
    currentpopup = new Popup("Did You Know?",p3,50,150,400,200,5000);
    hsp3 = true;
    setTimeout(function() {
      paused = false;
      currentpopup = null;
      score += 3;
      health = clamp(health+3,3,0);
    },currentpopup.time);
  }
}

document.onmousemove = function(e) {
  if (!started || dead || paused) {return;}
  player.x = clamp(e.clientX - canvas.getBoundingClientRect().left-32,500-64,0);

}


function draw() {

  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "white";
  ctx.drawImage(background,0,0,500,500);
  ctx.drawImage(player.image,player.x,player.y,player.width,player.height);
  ctx.font = "30px Pixelify Sans";
  ctx.fillStyle = "black";
  if (!started) {
    ctx.fillText("COLLECT PAPERS & IRONS",90,30);
    ctx.fillText("AVOID ANYTHING ELSE",110,60);
  }

  objects.forEach(object => {
    ctx.drawImage(object.image,object.x,object.y,object.width,object.height);
  })



  if (health >= 1) {ctx.drawImage(heartimage,0,500-32,32,32)}
  if (health >= 2) {ctx.drawImage(heartimage,24,500-32,32,32)}
  if (health >= 3) {ctx.drawImage(heartimage,48,500-32,32,32)}
  if (hasextrahp) {ctx.drawImage(superheartimage,72,500-32,32,32)}

  if (dead) {
    ctx.fillText("YOU DIED",200,30);
    ctx.fillText("REFRESH TO PLAY AGAIN",100,60);
    ctx.font = "60px Pixelify Sans";
    ctx.fillText("Final Score:"+score,80,250);
  } else if (started) {
    ctx.fillText("Score: "+score,5,30);
  }

  if (currentpopup != null) {
    ctx.fillStyle = "white";
    ctx.fillRect(currentpopup.x,currentpopup.y,currentpopup.width,currentpopup.height);
    ctx.fillStyle = "black";
    ctx.fillText(currentpopup.title,(currentpopup.x+currentpopup.width/2)-ctx.measureText(currentpopup.title).width/2,currentpopup.y+20);
    wrapText(currentpopup.description,currentpopup.x+10,currentpopup.y+50,currentpopup.width-10,30,"Pixelify Sans");
  }
}


//UTILITY

function clamp(Value,Topvalue,Bottomvalue) {
if (Value < Bottomvalue) {
  return Bottomvalue;
} else if (Value > Topvalue) {
  return Topvalue;
}
return Value;
}

function collision(obj1,obj2) {
  return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
}


//Not Made By Me, Found On riptutorial.com
function wrapText(text, x, y, maxWidth, fontSize, fontFace){
  var firstY=y;
  var words = text.split(' ');
  var line = '';
  var lineHeight=fontSize*1.286;

  ctx.font=fontSize+" "+fontFace;
  ctx.textBaseline='top';

  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = ctx.measureText(testLine);
    var testWidth = metrics.width;
    if(testWidth > maxWidth) {
      ctx.fillText(line, x, y);
      if(n<words.length-1){
          line = words[n] + ' ';
          y += lineHeight;
      }
    }
    else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}