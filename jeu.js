'use strict';

let songH = document.getElementById('audioPlayer')

//gestion du jeu canvas
let game = {
  ctx: canvas.getContext('2d'),
  showScore: document.getElementById('score'),
  load: 0,
  start: 0,
  song: document.getElementById('audioPlayer'),
  songGameOver: document.getElementById('audioPlayerGameOver')
}
let scale = 40; // facteur d'echelle

let sprites = {
  ThRight: new Image(),  //thor moove right
  ThLeft: new Image(),   //thor moove left
  ThFace: new Image(),   //thor une image de face
  DrFace: new Image(),  //dragon
  heart: new Image()
}

let hero = {
  x: canvas.width / 2,
  stepThor: 0,
  life: 10,
  score: 0
}

let dragon = {
  x: rand(55, canvas.width - 50),
  y: 150,
  stepDragon: 0
}

let key = {
  up: false,
  right: false,
  left: false,
  enter: false
}

function init() {
  drawStart();
  loadImg();
  game.ctx.imageSmoothingEnabled = false; // enlève le flou de l'image si trop agrandi
  let hp = document.getElementById('hp');
  let canvas = document.querySelector('#canvas');
  $(document).keydown(function (e) {
    if (e.keyCode == 39) {
      key.right = true;
    }
    if (e.keyCode == 37) {
      key.left = true;
    }
  });
  $(document).keydown((e) => {
    if (e.keyCode == 38) { //shoot dragon
      key.up = true;
    }

  });
  $(document).keyup((e) => {
    key.right = false;
    key.left = false;
    key.up = false;
    key.enter = false;
  });
}

function loadImg() {
  sprites.ThRight.onload = fullImgLoad;//thor
  sprites.ThLeft.onload = fullImgLoad;//thor
  sprites.ThFace.onload = fullImgLoad;   //thor
  sprites.DrFace.onload = fullImgLoad;   //dragon
  sprites.heart.onload = fullImgLoad;
  sprites.ThRight.src = "img/sprites/thorsprites.png";//thor
  sprites.ThLeft.src = "img/sprites/leftThorSprites.png";//thor
  sprites.ThFace.src = "img/sprites/faceThSprite.png"; //thor
  sprites.DrFace.src = "img/sprites/spdragons.png";//dragon
  sprites.heart.src = "img/sprites/heart.png";//dragon
}

function fullImgLoad() {
  game.load++;
  console.log(game.load);
  if (game.load == 5) {
    start();
  }
}
function start() {
  $(document).keypress((e) => {
    if (e.keyCode == 13 && game.start == 0) {
      game.start++; //verrouille le restart du jeu en cours de partie
      hero.score = 0; // initialise le score
      loop();
      game.songGameOver.pause()
      game.songGameOver.currentTime = 0;
      game.song.play()
    }
  });
}
function loop() {

  game.ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  draw();
  if (hero.life > 0) {
    requestAnimationFrame(loop);
  }
  if (hero.life == 0) {//initialisation du jeu
    game.start = 0; //deverrouille le restart
    game.song.pause();
    game.songGameOver.play()
    game.song.currentTime = 0;
    hero.life = 10;
    drawEnd();
  }
}
function draw() {
  drawStats();
  drawDragon();
  drawThor();
}
function drawDragon() {
  let localStep = Math.floor(dragon.stepDragon);
  let s = scale / 20;
  game.ctx.drawImage(sprites.DrFace, 140 * localStep, 0, 140, 125, dragon.x - 30 * s, dragon.y - 122 * s, 54 * s, 50 * s);  // dessine l'élément sprites
}

function drawThor() {
  let s = scale / 30;
  let y = canvas.height;
  let localStep = Math.floor(hero.stepThor);
  if (key.right == true) {
    game.ctx.drawImage(sprites.ThRight, 53.3 * localStep, 0, 54, 50, hero.x - 27 * s, y - 48 * s, 54 * s, 50 * s);  // dessine l'élément sprites
  }
  else if (key.left == true) {
    game.ctx.drawImage(sprites.ThLeft, 53 * localStep, 0, 54, 50, hero.x - 27 * s, y - 48 * s, 54 * s, 50 * s);  // dessine l'élément sprites
  }
  else {
    game.ctx.drawImage(sprites.ThFace, 0, 0, 54, 50, hero.x - 27 * s, y - 48 * s, 54 * s, 50 * s);  // dessine l'élément sprites
  }
}
function drawStart() {
  game.ctx.rect(0, 0, canvas.width, canvas.height);
  game.ctx.fillStyle = "black";
  game.ctx.fill();

  game.ctx.fillStyle = "white";
  game.ctx.font = " 15px Passion One";
  game.ctx.fillText("press 'ENTER' to start game", 220, 200);
}
function drawStats() {
  let s = scale / 100;
  let positionHeart = 0;
  game.ctx.fillStyle = "red";
  game.ctx.font = " 15px Passion One";
  game.ctx.fillText("SCORE " + hero.score, 10, 20);

  for (let i = 0; i < hero.life; i++) {
    game.ctx.drawImage(sprites.heart, 0, 0, 100, 100, 635 - positionHeart, 0, 100 * s, 100 * s);  // dessine l'élément sprites
    positionHeart += 20;
  }
}
function drawEnd() {
  game.ctx.rect(0, 0, canvas.width, canvas.height);
  game.ctx.fillStyle = "black";
  game.ctx.fill();

  game.ctx.fillStyle = "white";
  game.ctx.font = "bold 40px Passion One";
  game.ctx.fillText("GAME OVER", 200, 175);

  game.ctx.font = "bold 20px Passion One";
  game.ctx.fillText("SCORE " + hero.score, 280, 230);

  game.ctx.font = " 15px Passion One";
  game.ctx.fillText("press 'ENTER' to replay", 250, 300);

}
function update() {
  updateThor();
  updateDragon();
}

function updateThor() {
  let vitesseX = scale * 0.12;
  if (key.right == true) {
    hero.stepThor += 0.15;
    if (hero.stepThor >= 11) {
      hero.stepThor -= 11;
    }
    if (hero.x <= canvas.width - 27) {
      hero.x += vitesseX;
    }
  }

  if (key.left == true) {
    hero.stepThor -= 0.15;
    if (hero.stepThor <= 0) {
      hero.stepThor += 11;
    }
    if (hero.x >= 27) {
      hero.x -= vitesseX;
    }
  }
}

function updateDragon() {
  // zone de collisions x
  let vitesseY = scale * 0.1;
  let xSpaceLeft = hero.x - 50;
  let xSpaceRigth = hero.x + 50;
  let killDragon = false;

  //gestion collisions
  if (dragon.x >= xSpaceLeft && dragon.x <= xSpaceRigth && dragon.y > 350 && key.up == true) {
    killDragon = true;
    /*hero.score+=10;
    dragon.y = 0;
    dragon.x = rand(55,canvas.width-50);*/
  }

  if (dragon.y > canvas.height + 170) {
    if (killDragon == true) {
      hero.score += 10;
      dragon.y = 0;
      dragon.x = rand(55, canvas.width - 50);
    }
    else {
      hero.life--;
    }
    dragon.y = 0;
    dragon.x = rand(55, canvas.width - 50);
  }
  dragon.y += vitesseY;
  dragon.stepDragon += 0.01;
  if (dragon.stepDragon >= 4) {
    dragon.stepDragon -= 4;
  }
}

function rand(min, max) {
  // random entier entre min et max
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

init();
